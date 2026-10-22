// 스크린샷 비교: 두 폴더의 같은 이름 PNG를 픽셀 단위로 비교해 차이 비율과 차이 이미지를 남긴다.
// 사용: node tools/diff-shots.mjs [기준 폴더=.shots-baseline] [비교 폴더=.shots]
//       차이 이미지는 .shots-diff/<viewport>/<state>.png (다른 픽셀을 빨갛게 표시)
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [baseArg = '.shots-baseline', curArg = '.shots'] = process.argv.slice(2);
const BASE = path.resolve(ROOT, baseArg), CUR = path.resolve(ROOT, curArg), OUT = path.join(ROOT, '.shots-diff');

const files = fs.readdirSync(BASE, { recursive: true }).filter(f => f.endsWith('.png')).sort();
const browser = await chromium.launch();
const page = await browser.newPage();
const toUrl = f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
let changed = 0;

for (const f of files) {
  const cur = path.join(CUR, f);
  if (!fs.existsSync(cur)) { console.log(`✗ ${f.padEnd(22)} 비교 대상 없음`); changed++; continue; }
  const r = await page.evaluate(async ([a, b]) => {
    const load = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const w = Math.max(ia.width, ib.width), h = Math.max(ia.height, ib.height);
    const px = img => { const c = new OffscreenCanvas(w, h), x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, w, h).data; };
    const da = px(ia), db = px(ib);
    const c = new OffscreenCanvas(w, h), x = c.getContext('2d'), out = x.createImageData(w, h);
    let diff = 0, top = -1, bottom = -1;
    for (let i = 0; i < da.length; i += 4) {
      const d = Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]) + Math.abs(da[i + 3] - db[i + 3]);
      if (d > 0) { diff++; const y = Math.floor(i / 4 / w); if (top < 0) top = y; bottom = y; out.data.set([255, 0, 0, 255], i); }
      else { const g = (da[i] + da[i + 1] + da[i + 2]) / 3; out.data.set([g, g, g, 60], i); }
    }
    let png = null;
    if (diff) { x.putImageData(out, 0, 0); const blob = await c.convertToBlob(); png = [...new Uint8Array(await blob.arrayBuffer())]; }
    return { size: [ia.width, ia.height, ib.width, ib.height], diff, ratio: diff / (w * h), top, bottom, png };
  }, [toUrl(path.join(BASE, f)), toUrl(cur)]);
  const sameSize = r.size[0] === r.size[2] && r.size[1] === r.size[3];
  if (r.diff || !sameSize) {
    changed++;
    fs.mkdirSync(path.dirname(path.join(OUT, f)), { recursive: true });
    if (r.png) fs.writeFileSync(path.join(OUT, f), Buffer.from(r.png));
  }
  const size = sameSize ? `${r.size[0]}x${r.size[1]}` : `${r.size[0]}x${r.size[1]} → ${r.size[2]}x${r.size[3]}`;
  console.log(`${r.diff || !sameSize ? '✗' : '✓'} ${f.replace(/\\/g, '/').padEnd(22)} ${size.padEnd(24)} 다른 픽셀 ${r.diff} (${(r.ratio * 100).toFixed(3)}%)${r.diff ? `  y ${r.top}~${r.bottom}` : ''}`);
}

await browser.close();
console.log(`\n${files.length}장 중 ${changed}장 다름${changed ? ' · 차이 이미지: .shots-diff/' : ''}`);
process.exit(changed ? 1 : 0);

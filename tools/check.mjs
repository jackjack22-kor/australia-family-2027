// 현황판 화면 점검: 정적 서버로 저장소를 띄우고 뷰포트·화면별 스크린샷과 기준 위반을 기록한다.
// 사용: npm run check            (위반이 있으면 종료 코드 1)
//       npm run shots            (스크린샷만, 실패 처리 안 함)
//       node tools/check.mjs --fixture tools/fixtures/storage.json   (저장 데이터 주입 후 점검)
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '.shots');
const args = process.argv.slice(2);
const NO_FAIL = args.includes('--no-fail');
const fxIdx = args.indexOf('--fixture');
const FIXTURE = fxIdx >= 0 ? path.resolve(ROOT, args[fxIdx + 1]) : null;
const STORAGE_KEY = 'family-australia-atlas-v1';

const VIEWPORTS = [
  { name: 'm390', width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: 't768', width: 768, height: 1024, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  { name: 'd1440', width: 1440, height: 900, isMobile: false, hasTouch: false, deviceScaleFactor: 1 }
];
const ROUTES = ['cover', 'compare', 'itinerary', 'bookings', 'prep'];
// 화면 코드에 아래 data-check 훅을 유지할 것 (점검 스크립트가 사용)
//   data-check="day-open"   : 일정 목록에서 하루 상세를 여는 첫 카드
//   data-check="plan-chip"  : 여행안 선택 바텀시트를 여는 칩
//   data-check="manage"     : 관리 모달을 여는 버튼
// 인라인 텍스트 링크 등 44px 예외는 data-check-exempt="tap" 으로 표시

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
function serve() {
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (p.endsWith('/')) p += 'index.html';
      const f = path.join(ROOT, p);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(res);
    }).listen(0, '127.0.0.1', () => resolve(srv));
  });
}

const AUDIT = () => {
  const W = document.documentElement.clientWidth;
  const visible = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const label = el => (el.getAttribute('aria-label') || el.innerText || el.value || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 30);
  const overflow = document.documentElement.scrollWidth > W + 1;
  const offenders = overflow ? [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > W + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('[style*="overflow"],.scroll-x'); }).slice(0, 5).map(e => e.tagName + '.' + String(e.className).slice(0, 40)) : [];
  const small = [];
  document.querySelectorAll('body *').forEach(el => {
    if (!visible(el)) return;
    if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 12) small.push(label(el) + ':' + fs + 'px');
  });
  const taps = [];
  document.querySelectorAll('button, a[href], input:not([type=hidden]), select, textarea, summary, [role=button], [role=tab]').forEach(el => {
    if (!visible(el) || el.closest('[data-check-exempt="tap"]')) return;
    let r = el.getBoundingClientRect();
    if ((el.type === 'checkbox' || el.type === 'radio') && el.closest('label')) r = el.closest('label').getBoundingClientRect();
    if (r.height < 44 || r.width < 44) taps.push(label(el) + ':' + Math.round(r.width) + 'x' + Math.round(r.height));
  });
  return { scrollWidth: document.documentElement.scrollWidth, clientWidth: W, overflow, offenders, smallText: small.slice(0, 20), smallTextCount: small.length, smallTaps: taps.slice(0, 20), smallTapCount: taps.length };
};

const srv = await serve();
const base = `http://127.0.0.1:${srv.address().port}/`;
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const report = [];
let failures = 0;

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext(vp);
  if (FIXTURE) {
    const data = fs.readFileSync(FIXTURE, 'utf8');
    await ctx.addInitScript(([k, v]) => { if (!sessionStorage.getItem('__fx')) { localStorage.setItem(k, v); sessionStorage.setItem('__fx', '1'); } }, [STORAGE_KEY, data]);
  }
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  const dir = path.join(OUT, vp.name);
  fs.mkdirSync(dir, { recursive: true });

  const snap = async (state) => {
    await page.waitForTimeout(500);
    const a = await page.evaluate(AUDIT);
    await page.screenshot({ path: path.join(dir, state + '.png'), fullPage: true });
    const bad = a.overflow || a.smallTextCount > 0 || a.smallTapCount > 0;
    if (bad) failures++;
    report.push({ viewport: vp.name, state, ...a });
    console.log(`${bad ? '✗' : '✓'} ${vp.name.padEnd(6)} ${state.padEnd(10)} overflow:${a.overflow ? a.scrollWidth : 'no'}  <12px:${a.smallTextCount}  <44px:${a.smallTapCount}`);
  };

  await page.goto(base + '#cover', { waitUntil: 'networkidle' });
  for (const r of ROUTES) {
    await page.evaluate(h => { location.hash = h; }, r);
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo(0, 0));
    await snap(r);
    if (r === 'itinerary') {
      const day = page.locator('[data-check="day-open"]').first();
      if (await day.count()) { await day.click(); await snap('day'); }
      else console.log('  · data-check="day-open" 없음: 하루 상세 생략');
    }
  }
  for (const [hook, name] of [['plan-chip', 'sheet'], ['manage', 'manage']]) {
    const el = page.locator(`[data-check="${hook}"]`).first();
    if (await el.count()) { await el.click(); await snap(name); await page.keyboard.press('Escape'); }
    else console.log(`  · data-check="${hook}" 없음: ${name} 생략`);
  }
  if (errors.length) { failures++; console.log('  ✗ 콘솔 오류:', errors.slice(0, 5)); }
  report.push({ viewport: vp.name, errors });
  await ctx.close();
}

await browser.close();
srv.close();
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
console.log(`\n스크린샷: .shots/<viewport>/<state>.png · 상세: .shots/report.json · 위반 ${failures}건`);
console.log('시안 비교: design/mockups/*.png 와 .shots/m390/*.png 를 나란히 볼 것');
process.exit(failures && !NO_FAIL ? 1 : 0);

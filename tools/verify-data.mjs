// 저장 데이터 점검: 픽스처 표시, 백업 내보내기→가져오기 왕복, HTML 사본 오프라인 열기를 확인한다.
// 사용: node tools/verify-data.mjs [픽스처=tools/fixtures/storage.json]
//       내려받은 백업·사본은 .shots/verify/에 남긴다.
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '.shots', 'verify');
const FIXTURE = path.resolve(ROOT, process.argv[2] || 'tools/fixtures/storage.json');
const STORAGE_KEY = 'family-australia-atlas-v1';
const fixture = JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg' };

const srv = await new Promise(resolve => {
  const s = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(ROOT, p);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  }).listen(0, '127.0.0.1', () => resolve(s));
});
const base = `http://127.0.0.1:${srv.address().port}/`;
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
let failures = 0;
const ok = (cond, msg, detail = '') => { if (!cond) failures++; console.log(`${cond ? '✓' : '✗'} ${msg}${!cond && detail ? ` → ${detail}` : ''}`); };
const sameRecords = (a, b) => JSON.stringify(Object.entries(a).sort(([x], [y]) => x.localeCompare(y))) === JSON.stringify(Object.entries(b).sort(([x], [y]) => x.localeCompare(y)));
const missing = (want, got) => Object.keys(want).filter(k => JSON.stringify(want[k]) !== JSON.stringify(got[k])).join(', ');

async function newPage(seed) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
  if (seed) await ctx.addInitScript(([k, v]) => { if (!sessionStorage.getItem('__fx')) { localStorage.setItem(k, v); sessionStorage.setItem('__fx', '1'); } }, [STORAGE_KEY, JSON.stringify(seed)]);
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', e => page.errors.push(e.message));
  return page;
}
const go = async (page, view) => { await page.evaluate(v => { location.hash = v; }, view); await page.waitForTimeout(300); };
// 관리 모달은 준비 화면 앱 바의 관리 버튼으로 연다(홈은 사진 위, 하루 상세는 앱 바가 없다).
const openManage = async page => { await go(page, 'prep'); await page.locator('[data-open-manage]').filter({ visible: true }).first().click(); };
const mainText = page => page.evaluate(() => document.querySelector('main').innerText);

// 화면에 픽스처 값이 보이는지 확인한다. 픽스처를 바꾸면 이 기대값도 함께 바꾼다.
async function expectFixtureShown(page, label) {
  await go(page, 'prep');
  const checked = await page.evaluate(() => [...document.querySelectorAll('[data-task]')].filter(e => e.checked).map(e => e.dataset.task).sort());
  ok(['adapter', 'eta', 'sun'].every(id => checked.includes(id)), `${label}: 준비 체크 3개 유지`, checked.join(','));
  ok(await page.inputValue('#general-note') === fixture.records['general.note'], `${label}: 가족 여행 메모 표시`);
  await go(page, 'bookings');
  await page.locator('[data-booking-tab="flights"]:visible').first().click();
  ok((await mainText(page)).includes(fixture.records['flight.oz-eco.ref']), `${label}: 항공 예약번호 표시`);
  await page.locator('[data-booking-tab="hotels"]:visible').first().click();
  const hotels = await mainText(page);
  ok(hotels.includes('FAKE-H001') && hotels.includes('픽스처 호텔 메모'), `${label}: 호텔 예약번호·메모 표시`);
  await go(page, 'itinerary');
  await page.locator('[data-open-day="2027-02-01"]').first().click();
  await page.waitForTimeout(300);
  ok(await page.inputValue('#day-note') === fixture.records['day.2027-02-01.note'], `${label}: 2/1 날짜 메모 표시`);
  await page.locator('[data-edit-day="2027-02-01"]:visible').first().click();
  ok(await page.inputValue('#editor [name="food"]') === '120', `${label}: 2/1 현지 예산 식비 120`);
  await page.locator('#editor [data-close]').first().click();
  ok(await page.inputValue('#fx-input') === '950', `${label}: 환율 950`);
}
async function storedRecords(page) { return page.evaluate(k => JSON.parse(localStorage.getItem(k) || '{}').records || {}, STORAGE_KEY); }

// 1. 픽스처 주입
console.log('— 픽스처 주입');
const page = await newPage(fixture);
await page.goto(base + '#cover', { waitUntil: 'networkidle' });
ok(sameRecords(await storedRecords(page), fixture.records), '저장 레코드가 그대로 유지됨', missing(fixture.records, await storedRecords(page)));
await expectFixtureShown(page, '픽스처');

// 2. 백업 내보내기 → 빈 브라우저에서 가져오기
console.log('— 백업 왕복');
await openManage(page);
const [backupDl] = await Promise.all([page.waitForEvent('download'), page.click('#export')]);
const backupPath = path.join(OUT, 'backup.json');
await backupDl.saveAs(backupPath);
const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
ok(backup.format === 'australia-atlas' && backup.version === 1, '백업 형식 australia-atlas v1');
ok(sameRecords(backup.records, fixture.records), '백업에 모든 레코드 포함', missing(fixture.records, backup.records));
await page.keyboard.press('Escape');
const fresh = await newPage(null);
await fresh.goto(base + '#cover', { waitUntil: 'networkidle' });
await openManage(fresh);
await fresh.setInputFiles('#import-file', backupPath);
await fresh.waitForTimeout(500);
ok(sameRecords(await storedRecords(fresh), fixture.records), '가져온 뒤 레코드 일치', missing(fixture.records, await storedRecords(fresh)));
await expectFixtureShown(fresh, '가져오기');
ok(!fresh.errors.length, '백업 왕복 중 스크립트 오류 없음', fresh.errors.join(' | '));

// 3. HTML 사본 → 네트워크 없이 file://로 열기
console.log('— HTML 사본');
await openManage(page);
const [copyDl] = await Promise.all([page.waitForEvent('download'), page.click('#download')]);
const copyPath = path.join(OUT, 'copy.html');
await copyDl.saveAs(copyPath);
await page.keyboard.press('Escape');
const html = fs.readFileSync(copyPath, 'utf8');
ok(!/(?:src|href)=["'](?:\.\/)?assets\//.test(html), '사본에 로컬 파일 참조 없음');
ok(html.includes('EMBEDDED_STATE'), '사본에 입력 상태 포함');
ok(!page.errors.length, '원본 페이지 스크립트 오류 없음', page.errors.join(' | '));
const offline = await newPage(null);
const requested = [];
await offline.route('**/*', route => { const u = route.request().url(); if (u.startsWith('file:')) return route.continue(); requested.push(u); return route.abort(); });
await offline.goto(pathToFileURL(copyPath).href);
await offline.waitForTimeout(800);
ok(!requested.some(u => u.includes('/assets/')), '사본이 로컬 파일을 요청하지 않음', requested.filter(u => u.includes('/assets/')).join(', '));
ok(await offline.evaluate(() => { const i = document.querySelector('.hero-media img'); return !!i && i.complete && i.naturalWidth > 0; }), '사본 표지 사진 표시');
ok((await offline.textContent('#sync-status')).includes('HTML 사본'), '사본 모드로 열림');
await expectFixtureShown(offline, '사본');
ok(!offline.errors.length, '사본 스크립트 오류 없음(외부 CDN 차단 상태)', offline.errors.join(' | '));

await browser.close();
srv.close();
console.log(`\n위반 ${failures}건 · 백업·사본: .shots/verify/`);
process.exit(failures ? 1 : 0);

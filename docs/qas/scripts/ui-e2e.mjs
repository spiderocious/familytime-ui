// Drives the REAL UI end to end in headless Chrome: one big screen and two
// phones, each in its own browser context, playing a whole game against the
// running backend. Fails on any console error or failed assertion.
//
//   BASE=http://192.168.1.35:5173 SHOTS=./shots node ui-e2e.mjs
//
// Needs: backend + web dev server running, mongosh on PATH, and puppeteer-core
// resolvable from the working directory (it is not a project dependency).
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(path.join(process.cwd(), 'noop.js'));
const puppeteer = require('puppeteer-core');

const BASE = process.env.BASE ?? 'http://localhost:5173';
const SHOTS = process.env.SHOTS ?? './shots';
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
mkdirSync(SHOTS, { recursive: true });

const bank = JSON.parse(
  execFileSync('mongosh', ['--quiet', process.env.MONGODB_DB ?? 'familytime', '--eval',
    'EJSON.stringify(db.questions.find({}, {_id:0, prompt:1, correct:1}).toArray())'], { maxBuffer: 32 * 1024 * 1024 }).toString(),
);
const truth = new Map();
for (const q of bank) truth.set(q.prompt, [...(truth.get(q.prompt) ?? []), q.correct]);

const problems = [];
const check = (condition, message) => {
  if (!condition) {
    problems.push(message);
    console.error('  ✗', message);
  } else {
    console.log('  ✓', message);
  }
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });

async function device(name, width, height, mobile) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
  page.on('console', (msg) => {
    // The duplicate-name step below provokes a 409 on purpose; Chrome logs every
    // non-2xx response as a console error, so that one is expected.
    if (msg.type() === 'error' && !msg.text().includes('409')) problems.push(`[${name}] console error: ${msg.text()}`);
  });
  page.on('pageerror', (error) => problems.push(`[${name}] page error: ${error.message}`));
  page.on('requestfailed', (request) => {
    const failure = request.failure()?.errorText ?? '';
    if (!failure.includes('ERR_ABORTED')) problems.push(`[${name}] request failed: ${request.url()} ${failure}`);
  });
  return page;
}

const shot = async (page, name) => page.screenshot({ path: path.join(SHOTS, `${name}.png`) });
const sees = (page, text, timeout = 30000) =>
  page.waitForFunction((t) => document.body.innerText.toLowerCase().includes(t.toLowerCase()), { timeout }, text);
const clickText = async (page, text) => {
  const handle = await page.waitForFunction(
    (t) => [...document.querySelectorAll('button, a')].find((el) => el.innerText.trim().toLowerCase().includes(t.toLowerCase()) && !el.disabled),
    { timeout: 15000 }, text,
  );
  await handle.click();
};
const clickLabel = async (page, label, times = 1) => {
  for (let i = 0; i < times; i += 1) await page.click(`button[aria-label="${label}"]`);
};

const host = await device('host', 1600, 900, false);
const ada = await device('ada', 390, 844, true);
const bola = await device('bola', 390, 844, true);

console.log('home → setup');
await host.goto(BASE, { waitUntil: 'networkidle0' });
await sees(host, 'Family Quiz');
await shot(host, '01-home');
await clickText(host, 'Host this');
await sees(host, 'How hard?');
await clickLabel(host, 'Fewer rounds', 2);
await clickLabel(host, 'Fewer questions per round', 7);
await clickText(host, '10s');
await shot(host, '02-setup');
const summary = await host.evaluate(() => document.querySelector('aside').innerText);
check(/\b3\b/.test(summary) && summary.includes('1 round'), 'setup rail shows 3 questions in 1 round');
check(summary.includes('1,056'), 'setup rail counts all 1,056 questions for "everything, mixed"');

console.log('open room → lobby');
await clickText(host, 'Open the room');
await host.waitForFunction(() => location.pathname.startsWith('/host/room/'), { timeout: 15000 });
const code = host.url().split('/').pop();
await sees(host, 'Waiting for players');
check(/^[A-Z0-9]{5}$/.test(code), `room opened with code ${code}`);
check((await host.$('svg[role="img"], svg')) !== null, 'lobby shows a QR code');

console.log('phones join');
await ada.goto(`${BASE}/join/${code}`, { waitUntil: 'networkidle0' });
await sees(ada, 'Who’s playing?');
await ada.type('input[placeholder="e.g. Grandma"]', 'Ada');
await shot(ada, '03-phone-join');
await clickText(ada, 'Let me in');
await sees(ada, 'You’re in, Ada');

// Bola tries Ada's name first: the server's own message must appear under the field.
await bola.goto(`${BASE}/join/${code}`, { waitUntil: 'networkidle0' });
await sees(bola, 'Who’s playing?');
await bola.type('input[placeholder="e.g. Grandma"]', 'ada');
await clickText(bola, 'Let me in');
await sees(bola, 'already has that name');
check(true, 'duplicate name is rejected with the server message');
await bola.click('input[placeholder="e.g. Grandma"]', { clickCount: 3 });
await bola.type('input[placeholder="e.g. Grandma"]', 'Bola');
await bola.click('button[aria-label="Show questions on my phone"]');
await clickText(bola, 'Let me in');
await sees(bola, 'You’re in, Bola');
await shot(bola, '04-phone-lobby');

await sees(host, '2 players in');
await bola.click('button[aria-label="Send 🔥"]');
await new Promise((r) => setTimeout(r, 500));
await shot(host, '05-host-lobby');
const lobbyText = await host.evaluate(() => document.body.innerText);
check(lobbyText.includes('Ada') && lobbyText.includes('Bola'), 'both players appear on the big screen');

console.log('play');
await clickText(host, 'start!');
await sees(host, 'Round 1');
await shot(host, '06-host-intro');

for (let q = 1; q <= 3; q += 1) {
  await bola.waitForSelector('button[aria-label^="Answer "]:not([disabled])', { timeout: 30000 });
  await ada.waitForSelector('button[aria-label^="Answer "]:not([disabled])', { timeout: 30000 });

  // Bola has "show questions" on, so the question is readable on the phone.
  const asked = await bola.evaluate(() => ({
    prompt: document.querySelector('p.mt-1.font-display')?.innerText ?? '',
    options: [...document.querySelectorAll('button[aria-label^="Answer "]')].map((b) => b.innerText.trim()),
  }));
  const hostText = await host.evaluate(() => document.body.innerText);
  check(asked.prompt !== '' && hostText.includes(asked.prompt), `Q${q}: phone and big screen show the same question — ${asked.prompt}`);
  const adaButtons = await ada.$$eval('button[aria-label^="Answer "]', (bs) => bs.map((b) => b.innerText.trim()));
  check(adaButtons.every((t) => t === ''), `Q${q}: Ada's phone shows shapes only (questions hidden by default)`);

  const corrects = truth.get(asked.prompt) ?? [];
  const right = asked.options.findIndex((o) => corrects.includes(o));
  check(right >= 0, `Q${q}: one of the four options is the database's correct answer`);
  if (q === 1) {
    await new Promise((r) => setTimeout(r, 1300)); // let the entrance animations settle
    await shot(host, '07-host-question');
    await shot(ada, '08-phone-question-shapes');
    await shot(bola, '09-phone-question-text');
  }

  const buttons = await bola.$$('button[aria-label^="Answer "]');
  await buttons[right].click();
  // Ada always taps a wrong answer, a moment later.
  await new Promise((r) => setTimeout(r, 700));
  const adaChoices = await ada.$$('button[aria-label^="Answer "]');
  await adaChoices[(right + 1) % 4].click();

  await sees(bola, 'Correct!');
  await sees(ada, 'Not quite!');
  const revealed = await host.evaluate(() => document.body.innerText);
  check(revealed.includes('Fastest:') && revealed.includes('Bola'), `Q${q}: big screen names Bola as fastest`);
  if (q === 1) {
    await new Promise((r) => setTimeout(r, 900));
    await shot(host, '10-host-reveal');
    await shot(bola, '11-phone-correct');
    await shot(ada, '12-phone-wrong');
  }
  if (q < 3) {
    await sees(host, 'Scoreboard');
    if (q === 1) {
      await new Promise((r) => setTimeout(r, 1200));
      await shot(host, '13-host-scoreboard');
      await shot(bola, '14-phone-standing');
    }
  }
}

await sees(host, 'Round 1 done');
await new Promise((r) => setTimeout(r, 1200));
await shot(host, '15-host-round-end');

await sees(host, 'We have a winner', 20000);
await new Promise((r) => setTimeout(r, 3200));
await shot(host, '16-host-final');
await sees(bola, '1st place');
await sees(ada, '2nd place');
await shot(bola, '17-phone-final');

const rows = await host.$$eval('tbody tr', (trs) => trs.map((tr) => [...tr.children].map((td) => td.innerText.trim())));
console.log('  final table:', JSON.stringify(rows));
check(rows.length === 2 && rows[0][1].includes('Bola') && rows[0][3] === '3/3' && rows[0][4] === '100%', 'final table: Bola first, 3/3, 100%');
check(rows[1][1].includes('Ada') && rows[1][2] === '0' && rows[1][3] === '0/3' && rows[1][5] === '—', 'final table: Ada second, 0 points, no average speed');
const awards = await host.evaluate(() => document.body.innerText);
check(['Speed Demon', 'Sharpshooter', 'On Fire'].every((a) => awards.includes(a)), 'all three awards are shown');

console.log('refresh keeps the seat; play again');
await bola.reload({ waitUntil: 'networkidle0' });
await sees(bola, '1st place');
check(true, 'a refreshed phone comes back to its own result');
await clickText(host, 'Play again');
await sees(host, 'Round 1');
await sees(bola, 'Round 1');
check(true, 'Play again starts a new game for everyone');

console.log('design system page');
await host.goto(`${BASE}/preview`, { waitUntil: 'networkidle0' });
await sees(host, 'Living-room party');
await host.screenshot({ path: path.join(SHOTS, '18-preview.png'), fullPage: true });

await browser.close();
if (problems.length > 0) {
  console.error(`\nFAIL · ${problems.length} problem(s)`);
  for (const p of problems) console.error('  -', p);
  process.exit(1);
}
console.log('\nPASS · full game played through the real UI on three devices, no console errors');

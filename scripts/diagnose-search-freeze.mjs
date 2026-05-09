#!/usr/bin/env node
import { chromium } from 'playwright';

const args = parseArgs(process.argv.slice(2));
const url = args.url ?? 'http://localhost:5173/';
const cpu = Number(args.cpu ?? 1);
const headed = Boolean(args.headed);
const scenario = (args.scenario ?? 'a,ab,abc').split(',').map(s => s.trim()).filter(Boolean);

if (!Number.isFinite(cpu) || cpu < 1) fail('--cpu must be a number >= 1');
if (scenario.length === 0) fail('--scenario must contain at least one value');

console.log(`▶ Diagnostic recherche`);
console.log(`  URL: ${url}`);
console.log(`  CPU throttling: x${cpu}`);
console.log(`  Scénario: ${scenario.map(v => `"${v}"`).join(' → ')}`);

const browser = await chromium.launch({ headless: !headed });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.route('https://api.pirsch.io/**', route => route.abort());

const cdp = await page.context().newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });

console.log('\n▶ Chargement de la page');
await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#villes .pointGroup', { timeout: 30_000 });
await page.waitForFunction(() => document.querySelectorAll('#villes .pointGroup').length > 1000, null, { timeout: 30_000 });

const communeCount = await page.locator('#villes .pointGroup').count();
console.log(`✓ ${communeCount} communes chargées`);

await page.evaluate(() => {
  window.__diagnoseSearchLongTasks = [];
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__diagnoseSearchLongTasks.push({ duration: entry.duration });
        }
      });
      observer.observe({ type: 'longtask', buffered: true });
      window.__diagnoseSearchLongTaskObserver = observer;
    } catch {}
  }
});

console.log('\n▶ Simulation depuis une barre vide');
await resetInput(page);

const rows = [];
for (const value of scenario) {
  const result = await setSearchValue(page, value);
  rows.push(result);
  const status = classify(result);
  console.log(`${status.icon} "${value}" → visible=${result.visibleCount}, handler=${fmt(result.inputHandlerMs)}, rendu=${fmt(result.paintMs)}, long task max=${fmt(result.maxLongTaskMs)} ${status.label}`);
}

console.log('\n## État actuel\n');
console.log('| Étape | Communes visibles | Handler input | Jusqu’au rendu | Long task max | Verdict |');
console.log('|---|---:|---:|---:|---:|---|');
for (const row of rows) {
  const status = classify(row);
  console.log(`| \`${escapePipes(row.value)}\` | ${row.visibleCount} | ${fmt(row.inputHandlerMs)} | ${fmt(row.paintMs)} | ${fmt(row.maxLongTaskMs)} | ${status.label} |`);
}

const worst = rows.reduce((max, row) => row.paintMs > max.paintMs ? row : max, rows[0]);
console.log(`\nConclusion: le pire cas du scénario est \`${worst.value}\` avec ${fmt(worst.paintMs)} jusqu’au rendu et ${worst.visibleCount} communes visibles.`);
console.log('Interprétation: si le temps jusqu’au rendu dépasse ~100 ms, l’utilisateur perçoit un ralentissement; au-delà de ~500 ms, on est proche du freeze perceptible.');

await browser.close();

async function resetInput(page) {
  await page.evaluate(() => {
    const input = document.querySelector('#dropdown input');
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  });
  await waitTwoFrames(page);
}

async function setSearchValue(page, value) {
  return page.evaluate(async (value) => {
    window.__diagnoseSearchLongTasks = [];
    const input = document.querySelector('#dropdown input');

    const start = performance.now();
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    const afterInputHandler = performance.now();

    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const afterPaint = performance.now();

    const longTasks = window.__diagnoseSearchLongTasks ?? [];
    return {
      value,
      inputHandlerMs: afterInputHandler - start,
      paintMs: afterPaint - start,
      visibleCount: document.querySelectorAll('#villes .pointGroup.visible').length,
      maxLongTaskMs: longTasks.reduce((max, task) => Math.max(max, task.duration), 0),
    };
  }, value);
}

async function waitTwoFrames(page) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

function classify(result) {
  if (result.paintMs >= 500 || result.maxLongTaskMs >= 500) return { icon: '🔴', label: 'freeze perceptible' };
  if (result.paintMs >= 100 || result.maxLongTaskMs >= 100) return { icon: '🟠', label: 'ralentissement visible' };
  return { icon: '🟢', label: 'fluide' };
}

function fmt(n) {
  return `${n.toFixed(1)} ms`;
}

function escapePipes(s) {
  return String(s).replaceAll('|', '\\|');
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const [key, inlineValue] = arg.slice(2).split('=');
    if (inlineValue !== undefined) out[key] = inlineValue;
    else if (argv[i + 1] && !argv[i + 1].startsWith('--')) out[key] = argv[++i];
    else out[key] = true;
  }
  return out;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

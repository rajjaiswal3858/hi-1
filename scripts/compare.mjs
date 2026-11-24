// Measures the local build against the reference site, page by page and viewport by viewport.
//
//   npm run compare                          default routes × default widths
//   npm run compare -- /about-us/ /faq/      specific routes
//   npm run compare -- --widths=1440,390     specific widths
//   npm run compare -- --all                 every built route (slow; be gentle with the live site)
//   npm run compare -- --shots               also save full-page screenshots to .cache/compare/shots
//   npm run compare -- --local-only          only check the local build (overflow, broken images, JS errors)
//
// Reference measurements are cached in .cache/compare/live.json so repeated runs do not re-hit the live site
// (use --refresh to re-measure). Requires the local server: `npm run serve`.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '.cache', 'compare');
const LOCAL = process.env.LOCAL_ORIGIN || 'http://localhost:4321';
const LIVE = 'https://hatchworks.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';

const args = process.argv.slice(2);
const flag = n => args.includes(`--${n}`);
const opt = (n, d) => (args.find(a => a.startsWith(`--${n}=`)) || '').split('=')[1] || d;
const widths = opt('widths', '1440,1024,768,390').split(',').map(Number);
const TOLERANCE = Number(opt('tolerance', '0.02'));

const DEFAULT_ROUTES = ['/', '/about-us/', '/careers/', '/case-studies/', '/company/contact/', '/faq/', '/how-we-engage/',
  '/ai-strategy-roadmap/', '/generative-driven-development/', '/intelligence-layer-ai/', '/agentic-ai-automation/',
  '/private-equity/', '/healthcare/', '/anthropic/', '/databricks/', '/resources/blog/', '/talking-ai/', '/newsletter/',
  '/company/newsroom/', '/resources/events/', '/hatchfutures/', '/the-gendd-manifesto/'];

let routes = args.filter(a => a.startsWith('/'));
if (flag('all')) routes = JSON.parse(await fs.readFile(path.join(ROOT, 'src', 'site.json'), 'utf8')).routes.map(r => r.route);
if (!routes.length) routes = DEFAULT_ROUTES;

await fs.mkdir(path.join(OUT, 'shots'), { recursive: true });
const livePath = path.join(OUT, 'live.json');
const liveCache = JSON.parse(await fs.readFile(livePath, 'utf8').catch(() => '{}'));

// Runs in the page: scroll through (triggers lazy content / reveals), then measure.
async function measureInPage() {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.8) { window.scrollTo(0, y); await sleep(120); }
  window.scrollTo(0, 0);
  await sleep(400);
  const tall = el => Array.from(el.children).filter(c => {
    const cs = getComputedStyle(c);
    return c.offsetHeight > 40 && cs.position !== 'fixed' && cs.display !== 'none' && !/^(SCRIPT|STYLE|LINK)$/.test(c.tagName);
  });
  // Descend through single-child wrappers until the page splits into blocks.
  let node = document.querySelector('[data-elementor-type="wp-page"], [data-elementor-type="wp-post"], [data-elementor-type="single-post"], [data-elementor-type="single-page"], [data-elementor-type="archive"]') || document.body;
  let kids = tall(node);
  for (let i = 0; i < 12 && kids.length === 1; i++) { node = kids[0]; kids = tall(node); }
  const blocks = kids.map(k => ({ key: (k.tagName + '.' + (k.className && k.className.split ? k.className.split(/\s+/)[0] : '')).toLowerCase(), h: k.offsetHeight }));
  const footer = document.querySelector('#hwf');
  return {
    height: document.documentElement.scrollHeight,
    contentHeight: node.offsetHeight,
    footerHeight: footer ? footer.offsetHeight : 0,
    blocks,
    overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    brokenImages: Array.from(document.images).filter(i => i.complete && i.naturalWidth === 0 && i.currentSrc).map(i => i.currentSrc).slice(0, 5),
  };
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
let problems = 0;

async function measure(origin, route, width, shotName) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 }, userAgent: UA, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message.slice(0, 160)));
  const failed = [];
  page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(origin)) failed.push(`${r.status()} ${r.url().replace(origin, '')}`); });
  try {
    const res = await page.goto(origin + route, { waitUntil: 'load', timeout: 60000 });
    // A rate-limited or missing page must never be recorded as a valid measurement.
    if (!res || res.status() >= 400) return { error: `HTTP ${res ? res.status() : 'no response'}` };
    await page.waitForTimeout(1200);
    const m = await page.evaluate(measureInPage);
    if (shotName && flag('shots')) await page.screenshot({ path: path.join(OUT, 'shots', shotName), fullPage: true });
    return { ...m, errors, failed: failed.slice(0, 8) };
  } catch (e) {
    return { error: e.message.slice(0, 200) };
  } finally {
    await ctx.close();
  }
}

const slug = r => r.replace(/^\/|\/$/g, '').replace(/\//g, '__') || 'home';
const pct = (a, b) => (b ? ((a - b) / b * 100).toFixed(1) + '%' : 'n/a');

for (const route of routes) {
  for (const width of widths) {
    const key = `${route}@${width}`;
    const local = await measure(LOCAL, route, width, `${slug(route)}-${width}-local.png`);
    let live = null;
    if (!flag('local-only')) {
      live = liveCache[key];
      if (!live || flag('refresh')) {
        live = await measure(LIVE, route, width, `${slug(route)}-${width}-live.png`);
        if (!live.error) { live.at = new Date().toISOString(); liveCache[key] = live; await fs.writeFile(livePath, JSON.stringify(liveCache, null, 1)); }
        await new Promise(r => setTimeout(r, 1500));
      }
    }
    const notes = [];
    if (local.error) notes.push(`LOCAL ERROR ${local.error}`);
    else {
      if (local.overflowX && !(live && live.overflowX)) notes.push('horizontal overflow');
      if (local.brokenImages.length) notes.push(`broken images: ${local.brokenImages.join(', ')}`);
      if (local.errors.length) notes.push(`js errors: ${local.errors.join(' | ')}`);
      if (local.failed.length) notes.push(`failed requests: ${local.failed.join(', ')}`);
      if (live && !live.error) {
        const d = Math.abs(local.contentHeight - live.contentHeight) / Math.max(1, live.contentHeight);
        if (d > TOLERANCE) {
          notes.push(`content height ${local.contentHeight} vs live ${live.contentHeight} (${pct(local.contentHeight, live.contentHeight)})`);
          if (local.blocks.length === live.blocks.length) {
            local.blocks.forEach((b, i) => {
              const lb = live.blocks[i];
              if (Math.abs(b.h - lb.h) > Math.max(12, lb.h * TOLERANCE)) notes.push(`  block ${i + 1} ${b.key}: ${b.h} vs ${lb.h}`);
            });
          } else notes.push(`  block count ${local.blocks.length} vs ${live.blocks.length}`);
        }
        if (Math.abs(local.footerHeight - live.footerHeight) > 12) notes.push(`footer height ${local.footerHeight} vs ${live.footerHeight}`);
      } else if (live && live.error) notes.push(`live unavailable: ${live.error}`);
    }
    const ok = notes.length === 0;
    if (!ok) problems++;
    console.log(`${ok ? 'OK  ' : 'DIFF'} ${route} @${width}${live && !live.error && !local.error ? `  local ${local.contentHeight} / live ${live.contentHeight}` : ''}`);
    notes.forEach(n => console.log('      ' + n));
    results.push({ route, width, ok, notes });
  }
}

await browser.close();
await fs.writeFile(path.join(OUT, 'report.json'), JSON.stringify(results, null, 1));
console.log(`\n${results.length - problems}/${results.length} checks match. Report: .cache/compare/report.json`);

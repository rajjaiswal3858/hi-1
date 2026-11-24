// Crawls the reference site and caches raw HTML in .cache/pages.
// Breadth-first from the homepage, up to MAX_DEPTH link hops. Records redirects
// so the build can emit redirect stubs for legacy URLs.
import fs from 'node:fs/promises';
import path from 'node:path';
import { ORIGIN, UA, CACHE_DIR, routeToFile, normalizeRoute, isPageHref } from './shared.mjs';

const MAX_DEPTH = Number(process.env.MAX_DEPTH ?? 2);
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 3);

const pagesDir = path.join(CACHE_DIR, 'pages');
await fs.mkdir(pagesDir, { recursive: true });

const manifestPath = path.join(CACHE_DIR, 'manifest.json');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8').catch(() => '{"pages":{},"redirects":{}}'));

const seen = new Set();
let frontier = [{ route: '/', depth: 0 }];
seen.add('/');

const sleep = ms => new Promise(r => setTimeout(r, ms));

/** fetch with backoff on 429 / 5xx (the site rate-limits bursts). */
async function politeFetch(url) {
  let res;
  for (let attempt = 0; attempt < 6; attempt++) {
    res = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'follow' });
    if (res.status !== 429 && res.status < 500) break;
    await sleep(5000 * (attempt + 1));
  }
  return res;
}

// Every URL in the site's XML sitemaps is crawled too (as leaf pages: their links are not followed).
const sitemapRoutes = [];
for (const map of ['post-sitemap1', 'post-sitemap2', 'post-sitemap3', 'page-sitemap']) {
  try {
    const res = await politeFetch(`${ORIGIN}/${map}.xml`);
    if (!res.ok) { console.warn(`sitemap ${map}: HTTP ${res.status}`); continue; }
    const xml = await res.text();
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const r = normalizeRoute(m[1]);
      if (r && isPageHref(r) && !r.startsWith('/wp-content/')) sitemapRoutes.push(r);
    }
  } catch (e) { console.warn(`sitemap ${map}: ${e.message}`); }
}

function extractLinks(html) {
  const out = new Set();
  for (const m of html.matchAll(/href=["']([^"']+)["']/g)) {
    const r = normalizeRoute(m[1]);
    if (r && isPageHref(r)) out.add(r);
  }
  return out;
}

async function fetchRoute(route) {
  const res = await politeFetch(ORIGIN + route);
  const finalRoute = normalizeRoute(res.url) ?? route;
  const html = res.ok ? await res.text() : '';
  return { status: res.status, finalRoute, html, external: !res.url.startsWith(ORIGIN) ? res.url : null };
}

while (frontier.length) {
  const next = [];
  for (let i = 0; i < frontier.length; i += CONCURRENCY) {
    const batch = frontier.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(async ({ route, depth }) => {
      try {
        const cached = manifest.pages[route];
        let html;
        if (cached && cached.status === 200) {
          html = await fs.readFile(path.join(pagesDir, cached.file), 'utf8');
        } else {
          const r = await fetchRoute(route);
          if (r.external) { manifest.redirects[route] = r.external; return; }
          if (r.finalRoute !== route) {
            manifest.redirects[route] = r.finalRoute;
            if (seen.has(r.finalRoute)) return;
            seen.add(r.finalRoute);
            route = r.finalRoute;
          }
          const file = routeToFile(route);
          manifest.pages[route] = { status: r.status, file, depth };
          if (r.status !== 200) { console.warn(`! ${r.status} ${route}`); return; }
          html = r.html;
          await fs.writeFile(path.join(pagesDir, file), html);
          console.log(`✓ [d${depth}] ${route}`);
        }
        if (depth < MAX_DEPTH) {
          for (const link of extractLinks(html)) {
            if (!seen.has(link)) { seen.add(link); next.push({ route: link, depth: depth + 1 }); }
          }
        }
      } catch (err) {
        console.warn(`✗ ${route}: ${err.message}`);
      }
    }));
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  }
  frontier = next;
  if (!frontier.length && sitemapRoutes.length) {
    frontier = sitemapRoutes.filter(r => !seen.has(r)).map(r => ({ route: r, depth: MAX_DEPTH }));
    frontier.forEach(f => seen.add(f.route));
    sitemapRoutes.length = 0;
    console.log(`+ ${frontier.length} sitemap pages`);
  }
}

// The site's own "not found" template, stored as the /404/ route.
if (!manifest.pages['/404/']) {
  const res = await fetch(ORIGIN + '/this-page-does-not-exist-404/', { headers: { 'user-agent': UA } });
  const html = await res.text();
  if (html.includes('<body')) {
    await fs.writeFile(path.join(pagesDir, '404.html'), html);
    manifest.pages['/404/'] = { status: 200, file: '404.html', depth: 0, notFound: true };
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✓ 404 template');
  }
}

const ok = Object.values(manifest.pages).filter(p => p.status === 200).length;
console.log(`\nDone. ${ok} pages cached, ${Object.keys(manifest.redirects).length} redirects.`);

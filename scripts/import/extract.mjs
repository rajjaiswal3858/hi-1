// Extracts the cached reference pages into the project's source tree:
//
//   src/components/<name>/{index.html,style.css,script.js}   shared chrome (announcement, header, footer, trust strip)
//   src/shared/<name>.{css,js}                              inline blocks reused by 2+ pages
//   src/styles/wp-globals.css                               WordPress/Elementor global inline styles
//   src/pages/<route>/{index.html,page.json,style.css,script.js}
//   src/assets/wp-content/...                               images, fonts and vendor CSS (original paths)
//   src/data/forms/<id>.json                                HubSpot form definitions (rendered locally)
//   src/site.json                                           routes + redirects
//
// Trackers/analytics are dropped. All hatchworks.com URLs are rewritten to local paths.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import * as cheerio from 'cheerio';
import { ORIGIN, UA, CACHE_DIR, SRC_DIR, normalizeRoute, isPageHref, routeToPageDir } from './shared.mjs';

// Generated output is rebuilt from scratch on every run (hand-written files live elsewhere).
const GENERATED_DIRS = ['pages', 'shared', 'components'];
for (const d of GENERATED_DIRS) await fs.rm(path.join(SRC_DIR, d), { recursive: true, force: true });

const manifest = JSON.parse(await fs.readFile(path.join(CACHE_DIR, 'manifest.json'), 'utf8'));
const routes = Object.entries(manifest.pages).filter(([, p]) => p.status === 200).map(([r]) => r);
const pageSet = new Set(routes);

// ---------------------------------------------------------------------------
// URL rewriting
// ---------------------------------------------------------------------------
const assetQueue = new Set(); // "wp-content/uploads/…"
const ASSET_ABS = /(?:https?:)?\/\/(?:www\.)?hatchworks\.com\/(wp-(?:content|includes)\/[^\s"'()<>\\?#]+)(\?[^\s"'()<>\\]*)?/g;
const ASSET_REL = /(^|["'(\s,=])\/(wp-(?:content|includes)\/[^\s"'()<>\\?#]+)(\?[^\s"'()<>\\]*)?/g;
const PAGE_ABS = /https?:\/\/(?:www\.)?hatchworks\.com(\/[^\s"'<>\\)]*)?/g;

const SECTION_FALLBACKS = [
  ['/blog/', '/resources/blog/'], ['/author/', '/resources/blog/'], ['/category/', '/resources/blog/'],
  ['/tag/', '/resources/blog/'], ['/resource/events/', '/resources/events/'], ['/resource/', '/resources/blog/'],
  ['/news/', '/company/newsroom/'], ['/podcast/', '/talking-ai/'], ['/talking-ai/', '/talking-ai/'],
  ['/case-studies/', '/case-studies/'], ['/ai-services/', '/'], ['/partners/', '/'], ['/services/', '/'],
];
const unresolved = new Map();

export function resolveRoute(route) {
  for (let i = 0; i < 4 && manifest.redirects[route] && !pageSet.has(route); i++) {
    const t = manifest.redirects[route];
    if (/^https?:/.test(t)) return t;
    route = t;
  }
  if (pageSet.has(route)) return route;
  for (const [prefix, target] of SECTION_FALLBACKS) if (route.startsWith(prefix) && pageSet.has(target)) {
    unresolved.set(route, target); return target;
  }
  let p = route;
  while (p !== '/') { p = p.replace(/[^/]+\/$/, ''); if (pageSet.has(p)) { unresolved.set(route, p); return p; } }
  unresolved.set(route, '/');
  return '/';
}

function localAsset(p) { if (/\.[a-z0-9]{2,5}$/i.test(p)) assetQueue.add(p); return '/assets/' + p; }

function rewritePageUrl(full) {
  let u;
  try { u = new URL(full.replace(/&amp;/g, '&').replace(/&#038;/g, '&')); } catch { return full; }
  const route = normalizeRoute(u.href);
  if (!route || !isPageHref(route)) return full;
  // keep tracking-free query strings only (drop utm_*)
  const qs = [...u.searchParams].filter(([k]) => !k.startsWith('utm_'));
  const query = qs.length ? '?' + new URLSearchParams(qs).toString() : '';
  return resolveRoute(route) + query + (u.hash || '');
}

/** Rewrites every hatchworks.com asset/page URL inside arbitrary text (HTML, CSS or JS). */
export function rewriteText(text) {
  return text
    .replace(ASSET_ABS, (_, p) => localAsset(decodeURIComponent(p)))
    .replace(ASSET_REL, (_, pre, p) => pre + localAsset(decodeURIComponent(p)))
    .replace(PAGE_ABS, m => rewritePageUrl(m))
    .replace(/https?:\/\/js\.hsforms\.net\/forms\/embed\/(?:v2|\d+)\.js|\/\/js\.hsforms\.net\/forms\/embed\/(?:v2|\d+)\.js/g, '/scripts/hubspot-forms.js');
}

// ---------------------------------------------------------------------------
// Classification of inline <style>/<script> blocks
// ---------------------------------------------------------------------------
const TRACKER_SCRIPT = /gtag\(|dataLayer|_linkedin|lintrk|h\.hj=|initApollo|reb2b|ldfdr|_hsq|wp-emoji|logoutUrl|lazyloadRunObserver|uiBackCompat|hustleSettings|exad_ajax_object|exad_frontend_ajax_object|wp\.i18n|ElementorProFrontendConfig|elementorFrontendConfig|dFlipLocation|__CF\$cv|gtmLoaded|var Modules = |className\.replace\('no-js'|captivate_player|jetpack|_stq/;
const DROP_SCRIPT_TYPES = /ld\+json|speculationrules|application\/json/;
const DROP_EXT_SCRIPT = /googletagmanager|smart-company-365|katalon|stats\.wp\.com|hsforms\.net|hs-scripts|hubspot|linkedin|clarity|hotjar|reb2b|leadfeeder|apollo|cloudflare-static|\/wp-content\/|\/wp-includes\//;
const DROP_STYLE = /wp-smiley|#wpadminbar|e-lazyloaded|THIS FILE IS AUTOMATICALLY GENERATED/;

const COMPONENT_STYLE = [
  ['announcement', s => s.includes('#hwann')],
  ['header', s => s.includes('#hwnav,#hwnav *')],
  ['footer', s => s.includes('FOOTER v5')],
  ['trust-strip', s => s.startsWith('.hwts{') || s.trimStart().startsWith('.hwts{')],
];
const COMPONENT_SCRIPT = [
  ['announcement', s => s.includes('__hwAnnInit')],
  ['header', s => s.includes('Elementor "Sticky" clones')],
  ['footer', s => s.includes('FOOTER v5 runtime') || s.includes("getElementById('hwf')")],
  ['trust-strip', s => s.includes('__hwtsBooted')],
];
const GLOBAL_STYLE_IDS = new Set(['wp-img-auto-sizes-contain-inline-css', 'safe-svg-svg-icon-style-inline-css',
  'global-styles-inline-css', 'elementor-frontend-inline-css', 'elementor-pro-custom-fonts-inline-css']);

const hash = s => crypto.createHash('md5').update(s).digest('hex').slice(0, 10);

// ---------------------------------------------------------------------------
// Pass 1: parse every page, count inline block usage
// ---------------------------------------------------------------------------
// Pages are parsed one at a time (twice) rather than kept in memory: the site has ~600 pages.
async function loadPage(route) {
  const html = await fs.readFile(path.join(CACHE_DIR, 'pages', manifest.pages[route].file), 'utf8');
  return cheerio.load(html, { decodeEntities: false });
}
const styleUse = new Map(), scriptUse = new Map(), linkUse = new Map();
for (const route of routes) {
  const $ = await loadPage(route);
  const seenHere = new Set();
  $('style').each((_, el) => { const h = hash($(el).html()); if (!seenHere.has(h)) { seenHere.add(h); styleUse.set(h, (styleUse.get(h) || 0) + 1); } });
  $('script:not([src])').each((_, el) => { const h = hash($(el).html()); if (!seenHere.has(h)) { seenHere.add(h); scriptUse.set(h, (scriptUse.get(h) || 0) + 1); } });
  $('link[rel="stylesheet"]').each((_, el) => { const k = cleanHref($(el).attr('href')); if (!seenHere.has(k)) { seenHere.add(k); linkUse.set(k, (linkUse.get(k) || 0) + 1); } });
}
const total = routes.length;
const isCommonLink = href => (linkUse.get(href) || 0) >= total * 0.95;

function cleanHref(href) {
  return (href || '').replace(/&#038;/g, '&').replace(/&amp;/g, '&');
}

// ---------------------------------------------------------------------------
// Output helpers
// ---------------------------------------------------------------------------
async function write(file, content) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content);
}
const components = {}; // name -> {css:[], js:[], html}
const shared = new Map(); // hash -> {name, kind, code}
const globalsCss = new Map();
const formIds = new Set();
const report = { jqueryPages: [], scriptFallbacks: [] };

function sharedName(code, kind) {
  if (kind === 'js') {
    const v = code.match(/var\s+HW_([A-Z]+)/)?.[1] || code.match(/^\s*\/\*\s*([A-Za-z][\w ]{2,30}?)\s*\*\//)?.[1];
    if (v) return v.trim().toLowerCase().replace(/\s+/g, '-');
  }
  const ns = code.match(/namespace\s+([.#][\w-]+)/)?.[1]
    || code.match(/^[\s\S]{0,400}?([#.][a-z][\w-]{2,24})[\s,{:*]/i)?.[1]
    || code.match(/__(\w+?)(?:Booted|Init)/)?.[1]
    || kind;
  return ns.replace(/^[.#]/, '').toLowerCase();
}

// Shared chrome is identical on every page, so its blocks are taken from the homepage only
// (all of them, in source order: e.g. the footer ships a small flag script plus its runtime).
function addComponent(route, name, kind, code) {
  if (route !== '/') return;
  const c = (components[name] ||= { css: [], js: [], html: '' });
  (kind === 'css' ? c.css : c.js).push(code);
}

function minifyCommentsHtml($) {
  $('*').contents().each((_, n) => { if (n.type === 'comment') $(n).remove(); });
}

function jsOk(code) {
  try { new vm.Script(code); return true; } catch { return false; }
}

// ---------------------------------------------------------------------------
// Pass 2: emit pages
// ---------------------------------------------------------------------------
for (const route of routes) {
  const $ = await loadPage(route);
  const pageDir = path.join(SRC_DIR, 'pages', routeToPageDir(route));
  const meta = {
    route,
    title: $('title').first().text().trim(),
    description: $('meta[name="description"]').attr('content') || '',
    robots: $('meta[name="robots"]').attr('content') || '',
    og: {},
    bodyClass: ($('body').attr('class') || '').split(/\s+/).filter(c => !/^(jlt-admin-bar|logged-in|admin-bar|no-customize-support)$/.test(c)).join(' '),
    styles: [],
    shared: { css: [], js: [] },
    externalScripts: [],
  };
  $('meta[property^="og:"], meta[name^="twitter:"]').each((_, el) => {
    const k = $(el).attr('property') || $(el).attr('name');
    if (/og:(title|description|image|type|site_name)$|twitter:(card|title|description|image)$/.test(k)) meta.og[k] = rewriteText($(el).attr('content') || '');
  });

  const pageCss = [], pageJs = [];
  // Order bookkeeping: styles appearing before the content region = "early", others late.
  const body = $('body');
  const headerLoc = body.find('[data-elementor-type="header"]').first();
  const footerLoc = body.find('[data-elementor-type="footer"]').first();

  // --- styles ---
  $('style').each((_, el) => {
    const $el = $(el);
    const code = $el.html();
    const id = $el.attr('id') || '';
    if (DROP_STYLE.test(code.slice(0, 600)) || /hw-env-badge|wp-emoji/.test(code)) return;
    const comp = COMPONENT_STYLE.find(([, test]) => test(code));
    if (comp) return addComponent(route, comp[0], 'css', rewriteText(code));
    if (GLOBAL_STYLE_IDS.has(id) || code.includes('.lazyload,')) return void globalsCss.set(hash(code), rewriteText(code));
    const inContent = !$el.closest('[data-elementor-type="header"],[data-elementor-type="footer"]').length;
    if (!inContent) return; // other header/footer leftovers
    const h = hash(code);
    if ((styleUse.get(h) || 0) >= 2) {
      if (!shared.has(h)) shared.set(h, { name: sharedName(code, 'block'), kind: 'css', code: rewriteText(code) });
      meta.shared.css.push(h);
    } else pageCss.push(rewriteText(code));
  });

  // --- inline scripts ---
  $('script').each((_, el) => {
    const $el = $(el);
    const src = $el.attr('src');
    const type = $el.attr('type') || '';
    if (src) {
      const s = cleanHref(src);
      if (!DROP_EXT_SCRIPT.test(s) && /^https?:|^\/\//.test(s)) meta.externalScripts.push(s);
      return;
    }
    const code = $el.html();
    if (DROP_SCRIPT_TYPES.test(type) || !code.trim() || TRACKER_SCRIPT.test(code)) return;
    for (const m of code.matchAll(/(?:formId|FORM)\s*[:=]\s*["']([0-9a-f-]{36})/g)) formIds.add(m[1]);
    // Untargeted embeds render where the <script> sat: keep that position with a placeholder.
    if (/hbspt\.forms\.create/.test(code) && !/target\s*:/.test(code)) {
      const id = code.match(/formId\s*:\s*["']([0-9a-f-]{36})/)?.[1];
      if (id) { $el.replaceWith(`<div class="hs-form-embed" data-hs-form-id="${id}"></div>`); return; }
    }
    const comp = COMPONENT_SCRIPT.find(([, test]) => test(code));
    if (comp) return addComponent(route, comp[0], 'js', rewriteText(code));
    const inHeaderFooter = $el.closest('[data-elementor-type="header"],[data-elementor-type="footer"]').length;
    if (inHeaderFooter) return;
    if (/\bjQuery\b|\$\(/.test(code)) report.jqueryPages.push(route);
    const h = hash(code);
    if ((scriptUse.get(h) || 0) >= 2) {
      if (!shared.has(h)) shared.set(h, { name: sharedName(code, 'js'), kind: 'js', code: rewriteText(code) });
      meta.shared.js.push(h);
    } else pageJs.push(rewriteText(code));
  });

  // Component markup (taken from the homepage only). Runs after the style/script passes above,
  // because it strips the inline <style>/<script> tags that live inside the component roots.
  if (route === '/') {
    components.announcement ||= { css: [], js: [], html: '' };
    components.header ||= { css: [], js: [], html: '' };
    components.footer ||= { css: [], js: [], html: '' };
    const ann = headerLoc.find('#hwann').first();
    const nav = headerLoc.find('#hwnav').first();
    const foot = footerLoc.find('#hwf').first();
    for (const el of [ann, nav, foot]) { el.find('script,style,link').remove(); }
    components.announcement.html = rewriteText($.html(ann));
    components.header.html = rewriteText($.html(nav));
    components.footer.html = rewriteText($.html(foot));
  }

  // --- stylesheet links (vendor CSS) ---
  $('link[rel="stylesheet"]').each((_, el) => {
    const href = cleanHref($(el).attr('href'));
    if (/megamenu|hustle|leadin\/public/.test(href)) return;
    if (isCommonLink(href)) return;
    // Local copies drop the cache-busting ?ver=; external URLs (Google Fonts) need their query.
    const rewritten = rewriteText(href);
    const local = rewritten.startsWith('/assets/') ? rewritten.replace(/\?.*$/, '') : rewritten;
    if (!meta.styles.includes(local)) meta.styles.push(local);
  });

  // HubSpot frame embeds (data-form-id)
  $('[data-form-id]').each((_, el) => { const id = $(el).attr('data-form-id'); if (/^[0-9a-f-]{36}$/.test(id)) formIds.add(id); });

  // --- content region ---
  const content = cheerio.load('<div id="__root"></div>', { decodeEntities: false });
  const root = content('#__root');
  body.children().each((_, el) => {
    const $el = $(el);
    const tag = el.tagName;
    if (['script', 'style', 'link', 'noscript', 'iframe', 'img', 'template'].includes(tag)) return;
    if ($el.is('[data-elementor-type="header"],[data-elementor-type="footer"],#wpadminbar,.skip-link,.hustle-ui,[id^="hustle"],.screen-reader-text')) return;
    if (!$el.text().trim() && !$el.find('img,svg,video,iframe,[style*="background"]').length) return;
    root.append($.html($el));
  });
  root.find('script,style,link[rel="stylesheet"],link[rel="preconnect"],noscript').remove();
  root.find('.hustle-ui').remove();
  minifyCommentsHtml(content);

  // Internal links in markup that are root-relative
  root.find('a[href^="/"]').each((_, a) => {
    const $a = content(a);
    const href = $a.attr('href');
    if (/^\/(assets|wp-)/.test(href) || href.startsWith('//')) return;
    const [p, rest = ''] = href.split(/(?=[?#])/);
    const r = normalizeRoute(p);
    if (r && isPageHref(r)) $a.attr('href', resolveRoute(r) + rest);
  });
  // External links open safely
  root.find('a[target="_blank"]').each((_, a) => { const $a = content(a); if (!/noopener/.test($a.attr('rel') || '')) $a.attr('rel', (($a.attr('rel') || '') + ' noopener').trim()); });

  const contentHtml = rewriteText(root.html()).trim();

  // --- write page files ---
  await write(path.join(pageDir, 'index.html'), contentHtml + '\n');
  if (pageCss.length) await write(path.join(pageDir, 'style.css'), pageCss.map(s => s.trim()).join('\n\n') + '\n');
  if (pageJs.length) {
    const joined = pageJs.map(s => s.trim()).join('\n;\n');
    if (jsOk(joined)) await write(path.join(pageDir, 'script.js'), joined + '\n');
    else {
      report.scriptFallbacks.push(route);
      meta.scriptFiles = [];
      for (const [i, s] of pageJs.entries()) { const f = `script-${i + 1}.js`; meta.scriptFiles.push(f); await write(path.join(pageDir, f), s.trim() + '\n'); }
    }
  }
  meta.shared.css = [...new Set(meta.shared.css)];
  meta.shared.js = [...new Set(meta.shared.js)];
  meta.externalScripts = [...new Set(meta.externalScripts)];
  await write(path.join(pageDir, 'page.json'), JSON.stringify(meta, null, 2) + '\n');
}

// ---------------------------------------------------------------------------
// Shared blocks: give each a stable, readable file name
// ---------------------------------------------------------------------------
const nameCount = {};
const sharedFiles = {};
for (const [h, b] of shared) {
  let name = b.name;
  nameCount[name + b.kind] = (nameCount[name + b.kind] || 0) + 1;
  if (nameCount[name + b.kind] > 1) name += '-' + nameCount[name + b.kind];
  const file = `${name}.${b.kind}`;
  sharedFiles[h] = file;
  await write(path.join(SRC_DIR, 'shared', file), b.code.trim() + '\n');
}
// replace hashes with file names in page.json files
for (const route of routes) {
  const f = path.join(SRC_DIR, 'pages', routeToPageDir(route), 'page.json');
  const meta = JSON.parse(await fs.readFile(f, 'utf8'));
  meta.shared.css = meta.shared.css.map(h => sharedFiles[h]);
  meta.shared.js = meta.shared.js.map(h => sharedFiles[h]);
  await write(f, JSON.stringify(meta, null, 2) + '\n');
}

// ---------------------------------------------------------------------------
// Components + globals
// ---------------------------------------------------------------------------
for (const [name, c] of Object.entries(components)) {
  const dir = path.join(SRC_DIR, 'components', name);
  if (c.html) await write(path.join(dir, 'index.html'), c.html.trim() + '\n');
  if (c.css.length) await write(path.join(dir, 'style.css'), c.css.join('\n\n').trim() + '\n');
  if (c.js.length) await write(path.join(dir, 'script.js'), c.js.join('\n;\n').trim() + '\n');
}
await write(path.join(SRC_DIR, 'styles', 'wp-globals.css'), [...globalsCss.values()].map(s => s.trim()).join('\n\n') + '\n');

const commonStyles = [...linkUse.entries()].filter(([h]) => isCommonLink(h) && !/megamenu|hustle/.test(h)).map(([h]) => /^https?:\/\/(www\.)?hatchworks/.test(h) ? rewriteText(h).replace(/\?.*$/, '') : h);

// ---------------------------------------------------------------------------
// Site manifest
// ---------------------------------------------------------------------------
const redirects = {};
for (const [from, to] of Object.entries(manifest.redirects)) if (!pageSet.has(from)) redirects[from] = /^https?:/.test(to) ? to : resolveRoute(to);
for (const [from, to] of unresolved) if (!redirects[from]) redirects[from] = to;
await write(path.join(SRC_DIR, 'site.json'), JSON.stringify({
  origin: ORIGIN,
  commonStyles: [...new Set(commonStyles)],
  routes: routes.map(r => ({ route: r, dir: routeToPageDir(r) })),
  redirects,
}, null, 2) + '\n');

// ---------------------------------------------------------------------------
// Assets (+ vendor CSS dependencies)
// ---------------------------------------------------------------------------
const ASSET_DIR = path.join(SRC_DIR, 'assets');
const done = new Set();
const failed = [];
async function download(p) {
  if (done.has(p)) return; done.add(p);
  const out = path.join(ASSET_DIR, p);
  let exists = false;
  try { await fs.access(out); exists = true; } catch {}
  let buf;
  if (exists) buf = await fs.readFile(out);
  else {
    let res;
    for (let a = 0; a < 4; a++) {
      try { res = await fetch(`${ORIGIN}/${encodeURI(p)}`, { headers: { 'user-agent': UA, referer: ORIGIN + '/' } }); } catch { res = null; }
      if (res && res.status !== 429 && res.status < 500) break;
      await new Promise(r => setTimeout(r, 3000 * (a + 1)));
    }
    if (!res || !res.ok) { failed.push(`${res?.status ?? 'ERR'} ${p}`); return; }
    buf = Buffer.from(await res.arrayBuffer());
  }
  if (p.endsWith('.css')) {
    let css = buf.toString('utf8');
    // queue relative url()/@import references (they stay valid because paths are mirrored)
    for (const m of css.matchAll(/url\(\s*['"]?([^'")]+?)['"]?\s*\)|@import\s+['"]([^'"]+)['"]/g)) {
      const ref = (m[1] || m[2]).trim();
      if (/^(data:|https?:|\/\/|#)/.test(ref)) continue;
      const resolved = new URL(ref, `${ORIGIN}/${p}`).pathname.replace(/^\//, '');
      if (/^wp-(content|includes)\//.test(resolved)) assetQueue.add(decodeURIComponent(resolved));
    }
    css = rewriteText(css);
    buf = Buffer.from(css);
  }
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, buf);
}
for (const s of commonStyles) if (s.startsWith('/assets/')) assetQueue.add(s.slice(8));
// Thumbnails referenced by the blog post index (cards rendered client-side by blog-filters.js).
try {
  const idx = JSON.parse(await fs.readFile(path.join(SRC_DIR, 'data', 'posts.json'), 'utf8'));
  for (const p of idx.posts) if (p.image?.url?.startsWith('/assets/wp-content/')) assetQueue.add(decodeURIComponent(p.image.url.slice(8)));
} catch { /* run `npm run posts` first to include them */ }
for (const f of ['favicon-hw-ai-150x150.png', 'favicon-hw-ai-300x300.png']) assetQueue.add('wp-content/uploads/2021/04/' + f);
let pending;
while ((pending = [...assetQueue].filter(p => !done.has(p))).length) {
  for (let i = 0; i < pending.length; i += 8) await Promise.all(pending.slice(i, i + 8).map(download));
}

// ---------------------------------------------------------------------------
// HubSpot form definitions (public JSON; rendered by src/scripts/hubspot-forms.js)
// ---------------------------------------------------------------------------
for (const id of formIds) {
  const out = path.join(SRC_DIR, 'data', 'forms', `${id}.json`);
  try {
    const res = await fetch(`https://forms.hsforms.com/embed/v3/form/6632357/${id}/json`);
    if (!res.ok) { failed.push(`form ${id} ${res.status}`); continue; }
    const { form } = await res.json();
    const slim = {
      id, captcha: !!form.captchaEnabled, submitText: form.submitText, inlineMessage: form.inlineMessage, cssClass: form.cssClass,
      groups: form.formFieldGroups.map(g => ({
        richText: g.richText?.content || '',
        fields: g.fields.filter(f => !f.hidden).map(f => ({
          name: f.name, label: f.label, type: f.fieldType, required: f.required, placeholder: f.placeholder,
          description: f.description, unselectedLabel: f.unselectedLabel, defaultValue: f.defaultValue,
          options: (f.options || []).map(o => ({ label: o.label, value: o.value })),
        })),
      })),
      legal: form.metaData?.find(m => m.name === 'legalConsentOptions')?.value || null,
    };
    await write(out, JSON.stringify(slim, null, 2) + '\n');
  } catch (e) { failed.push(`form ${id} ${e.message}`); }
}

console.log(`pages: ${routes.length}`);
console.log(`shared blocks: ${shared.size}`);
console.log(`components: ${Object.keys(components).join(', ')}`);
console.log(`assets: ${done.size} (failed ${failed.length})`);
console.log(`forms: ${formIds.size}`);
console.log(`unresolved links -> fallbacks: ${unresolved.size}`);
console.log(`pages with jQuery-dependent scripts: ${[...new Set(report.jqueryPages)].join(', ') || 'none'}`);
console.log(`pages with split scripts: ${report.scriptFallbacks.join(', ') || 'none'}`);
if (failed.length) console.log('failed:\n  ' + failed.slice(0, 40).join('\n  '));

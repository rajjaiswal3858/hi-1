// Assembles the static site into dist/ from src/.
//
//   src/layouts/base.html          document shell with {{placeholders}}
//   src/components/<name>/         shared chrome: index.html + style.css + script.js
//   src/pages/<route>/             index.html (content), page.json (meta), page style/script
//   src/shared, src/styles, src/scripts, src/assets, src/data   copied as-is
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { themeDist } from './theme/recolor.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

const read = (p, fallback = null) => fs.readFile(p, 'utf8').catch(() => fallback);
const exists = p => fs.access(p).then(() => true, () => false);
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
// Titles in page.json are stored HTML-encoded (as on the source site); keep them as-is.
const attrSafe = s => String(s ?? '').replace(/"/g, '&quot;');

async function copyDir(from, to) {
  if (!(await exists(from))) return;
  await fs.cp(from, to, { recursive: true });
}

async function write(file, content) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content);
}

const site = JSON.parse(await read(path.join(SRC, 'site.json')));
const layout = await read(path.join(SRC, 'layouts', 'base.html'));

// --- components -----------------------------------------------------------
const COMPONENTS = ['announcement', 'header', 'footer', 'trust-strip'];
const comp = {};
for (const name of COMPONENTS) {
  const dir = path.join(SRC, 'components', name);
  comp[name] = {
    html: (await read(path.join(dir, 'index.html'), '')).trim(),
    css: await exists(path.join(dir, 'style.css')),
    js: await exists(path.join(dir, 'script.js')),
  };
}

// --- clean + static copies --------------------------------------------------
await fs.rm(DIST, { recursive: true, force: true });
await fs.mkdir(DIST, { recursive: true });
for (const d of ['assets', 'shared', 'styles', 'scripts', 'data']) await copyDir(path.join(SRC, d), path.join(DIST, d));
for (const name of COMPONENTS) {
  const dir = path.join(SRC, 'components', name);
  if (comp[name].css) await fs.copyFile(path.join(dir, 'style.css'), path.join(DIST, 'components', `${name}.css`)).catch(async () => {
    await fs.mkdir(path.join(DIST, 'components'), { recursive: true });
    await fs.copyFile(path.join(dir, 'style.css'), path.join(DIST, 'components', `${name}.css`));
  });
  if (comp[name].js) {
    await fs.mkdir(path.join(DIST, 'components'), { recursive: true });
    await fs.copyFile(path.join(dir, 'script.js'), path.join(DIST, 'components', `${name}.js`));
  }
}
await copyDir(path.join(SRC, 'public'), DIST);

const css = href => `<link rel="stylesheet" href="${esc(href)}">`;
const js = src => `<script src="${esc(src)}"></script>`;
const compCss = name => (comp[name].css ? css(`/components/${name}.css`) : '');
const compJs = name => (comp[name].js ? js(`/components/${name}.js`) : '');

// --- pages -------------------------------------------------------------------
let count = 0;
for (const { route, dir } of site.routes) {
  const pdir = path.join(SRC, 'pages', dir);
  const meta = JSON.parse(await read(path.join(pdir, 'page.json')));
  const content = await read(path.join(pdir, 'index.html'), '');
  const outDir = route === '/' ? DIST : path.join(DIST, ...route.split('/').filter(Boolean));

  const og = Object.entries(meta.og || {}).map(([k, v]) =>
    k.startsWith('og:') ? `<meta property="${k}" content="${attrSafe(v)}">` : `<meta name="${k}" content="${attrSafe(v)}">`).join('\n');

  const pageStyles = [];
  if (await exists(path.join(pdir, 'style.css'))) {
    await write(path.join(outDir, 'page.css'), await read(path.join(pdir, 'style.css')));
    pageStyles.push(css(`${route}page.css`));
  }
  const pageScripts = [];
  for (const f of meta.scriptFiles || ['script.js']) {
    if (await exists(path.join(pdir, f))) {
      const outName = f === 'script.js' ? 'page.js' : f.replace('script', 'page');
      await write(path.join(outDir, outName), await read(path.join(pdir, f)));
      pageScripts.push(js(`${route}${outName}`));
    }
  }

  const vars = {
    title: meta.title,
    description: attrSafe(meta.description),
    robots: meta.robots ? `<meta name="robots" content="${attrSafe(meta.robots)}">` : '',
    og,
    commonStyles: site.commonStyles.map(css).join('\n'),
    vendorStyles: (meta.styles || []).map(css).join('\n'),
    headerStyles: compCss('announcement') + '\n' + compCss('header'),
    sharedStyles: (meta.shared?.css || []).map(f => css(`/shared/${f}`)).join('\n'),
    pageStyles: pageStyles.join('\n'),
    footerStyles: compCss('footer') + '\n' + compCss('trust-strip'),
    bodyClass: esc(meta.bodyClass),
    announcement: comp.announcement.html,
    header: comp.header.html,
    content,
    footer: comp.footer.html,
    externalScripts: (meta.externalScripts || []).map(js).join('\n'),
    headerScripts: compJs('announcement') + '\n' + compJs('header'),
    sharedScripts: (meta.shared?.js || []).map(f => js(`/shared/${f}`)).join('\n'),
    pageScripts: pageScripts.join('\n'),
    footerScripts: compJs('footer') + '\n' + compJs('trust-strip'),
  };
  const html = layout.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');
  await write(path.join(outDir, 'index.html'), html);
  count++;
}

// --- 404 -------------------------------------------------------------------------
const nf = path.join(DIST, '404', 'index.html');
if (await exists(nf)) await fs.copyFile(nf, path.join(DIST, '404.html'));

// --- redirect stubs for legacy URLs ---------------------------------------------
let redirects = 0;
for (const [from, to] of Object.entries(site.redirects || {})) {
  const outDir = path.join(DIST, ...from.split('/').filter(Boolean));
  if (await exists(path.join(outDir, 'index.html'))) continue;
  await write(path.join(outDir, 'index.html'),
    `<!doctype html><html lang="en-US"><head><meta charset="utf-8"><title>Redirecting…</title>` +
    `<meta http-equiv="refresh" content="0; url=${esc(to)}"><link rel="canonical" href="${esc(to)}">` +
    `<script>location.replace(${JSON.stringify(to)} + location.hash)</script></head>` +
    `<body><a href="${esc(to)}">Continue</a></body></html>\n`);
  redirects++;
}

// --- obsidian / acid-lime colour theme ----------------------------------------
const themed = await themeDist(DIST);

console.log(`Built ${count} pages and ${redirects} redirects into dist/ (theme applied to ${themed} files)`);

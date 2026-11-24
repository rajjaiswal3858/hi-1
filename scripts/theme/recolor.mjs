// Obsidian / acid-lime theme: a build-time colour remap applied to everything in dist/.
//
// The imported pages hard-code their palette in thousands of places (page CSS, inline styles,
// CSS strings inside scripts), so instead of overriding selectors one by one we rewrite each
// colour according to the role it plays where it is used:
//
//   background  light surfaces -> deep charcoal, dark surfaces -> obsidian, solid accents -> lime
//   text        dark text -> muted grey (darkest -> brightest), light text stays light, accents -> lime
//   border      hairlines -> dark graphite, accents -> lime
//   shadow      neutral shadows kept, coloured glows -> lime glow
//
// Only colour values change; no selector, property or layout value is touched.
import fs from 'node:fs/promises';
import path from 'node:path';

const LIME_HUE = 74;            // #CCFF00-ish acid lime
const INK = '#0b0c0d';          // text placed on lime surfaces
const SKIP = /(^|[\\/])(theme\.css|theme\.js)$/;

// ---------------------------------------------------------------- colour maths
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function rgbToHsl(r, g, b) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  if (!d) return { h: 0, s: 0, l, c: 0 };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  return { h, s, l, c: d };
}

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [r + m, g + m, b + m];
}

function parse(tok) {
  const t = tok.toLowerCase();
  if (t === 'white') return { r: 1, g: 1, b: 1, a: 1, hex: true };
  if (t === 'black') return { r: 0, g: 0, b: 0, a: 1, hex: true };
  if (t[0] === '#') {
    let h = t.slice(1);
    if (h.length <= 4) h = [...h].map(c => c + c).join('');
    const n = i => parseInt(h.slice(i, i + 2), 16) / 255;
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1, hex: true };
  }
  const parts = t.slice(t.indexOf('(') + 1, -1).split(/[\s,/]+/).filter(Boolean);
  const ch = v => (v.endsWith('%') ? parseFloat(v) / 100 : parseFloat(v) / 255);
  const al = v => (v === undefined ? 1 : v.endsWith('%') ? parseFloat(v) / 100 : parseFloat(v));
  return { r: ch(parts[0]), g: ch(parts[1]), b: ch(parts[2]), a: al(parts[3]), hex: false };
}

function format([r, g, b], a, asHex) {
  const to = v => Math.round(clamp(v, 0, 1) * 255);
  if (a >= 0.999 && asHex) return '#' + [r, g, b].map(v => to(v).toString(16).padStart(2, '0')).join('');
  return `rgba(${to(r)}, ${to(g)}, ${to(b)}, ${+a.toFixed(3)})`;
}

const isRed = ({ h, s, c }) => c > 0.25 && s > 0.45 && (h < 12 || h > 340);   // errors keep their red
const isAccent = ({ c, l }) => c >= 0.12 && l > 0.18;

/** Map one colour for a role. Returns { value, lime } where lime = solid lime surface. */
export function mapColor(tok, role) {
  const p = parse(tok);
  if ([p.r, p.g, p.b, p.a].some(Number.isNaN)) return { value: tok, lime: false };
  const hsl = rgbToHsl(p.r, p.g, p.b);
  const { l } = hsl;
  if (p.a === 0) return { value: tok, lime: false };
  if (isRed(hsl)) return { value: tok, lime: false };

  const neutral = (L, sat = 0.05, hue = 220) => format(hslToRgb(hue, sat, clamp(L, 0, 1)), p.a, p.hex);
  const lime = (L, sat = 1) => format(hslToRgb(LIME_HUE, sat, clamp(L, 0, 1)), p.a, p.hex);
  const accent = isAccent(hsl);

  // Translucent neutral overlays (white veils, hairlines, black scrims) already work on a dark
  // canvas. Keep them, except dark hairlines, which would vanish and so become light ones.
  if (!accent && p.a < 0.9 && (role === 'bg' || role === 'grad' || role === 'border' || role === 'shadow')) {
    if (role === 'border' && l < 0.5) return { value: format([1, 1, 1], p.a, false), lime: false };
    return { value: tok, lime: false };
  }

  switch (role) {
    case 'grad': {
      // Gradient stops: big atmospheric washes stay dark; bright glows become a soft lime haze.
      if (!accent) return mapColor(tok, 'bg');
      if (l > 0.8) return { value: format(hslToRgb(LIME_HUE, 0.25, 0.115), p.a, p.hex), lime: false };
      if (l < 0.4) return { value: format(hslToRgb(LIME_HUE, 0.14, 0.03 + l * 0.2), p.a, p.hex), lime: false };
      const a = p.a >= 0.85 ? p.a : p.a * 0.35;
      return { value: format(hslToRgb(LIME_HUE, 1, 0.5), a, false), lime: false };
    }
    case 'bg': {
      if (accent && l > 0.8) return { value: format(hslToRgb(LIME_HUE, 0.25, 0.115), p.a, p.hex), lime: false };
      if (accent && l < 0.25) return { value: format(hslToRgb(LIME_HUE, 0.3, 0.03 + l * 0.25), p.a, p.hex), lime: false };
      if (accent) {
        const solid = p.a >= 0.85;
        return { value: lime(0.5 + (l - 0.5) * 0.15), lime: solid };
      }
      if (l >= 0.5) return { value: neutral(0.07 + (1 - l) * 0.12, 0.06), lime: false };
      return { value: neutral(0.03 + l * 0.3, 0.07), lime: false };
    }
    case 'border': {
      if (accent) return { value: lime(clamp(0.5 + (l - 0.45) * 0.4, 0.48, 0.7)), lime: false };
      if (l >= 0.5) return { value: neutral(0.13 + (1 - l) * 0.15, 0.04), lime: false };
      return { value: neutral(0.16 + l * 0.2, 0.04), lime: false };
    }
    case 'shadow': {
      if (accent) return { value: lime(0.5), lime: false };
      return { value: tok, lime: false };
    }
    default: { // text
      if (accent) return { value: lime(clamp(0.5 + (l - 0.45) * 0.4, 0.5, 0.72), l > 0.8 ? 0.75 : 1), lime: false };
      if (l < 0.6) return { value: neutral(clamp(0.86 - l * 0.85, 0.52, 0.86), 0.03), lime: false };
      return { value: neutral(0.55 + (l - 0.6) * 0.95, 0.03), lime: false };
    }
  }
}

// ---------------------------------------------------------------- CSS rewriting
const COLOR_RE = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])|rgba?\(\s*[\d.]+%?\s*[,\s]\s*[\d.]+%?\s*[,\s]\s*[\d.]+%?\s*(?:[,/]\s*[\d.]+%?\s*)?\)|\b(?:white|black)\b/gi;
const COLORISH_PROP = /^(--|color|background|border|outline|fill|stroke|box-shadow|text-shadow|caret|accent|stop-color|column-rule|text-decoration|-webkit-text)/i;
const VAR_RE = /var\(\s*(--[\w-]+)\s*((?:,(?:[^()]|\([^()]*\))*)?)\)/g;

function roleOf(prop) {
  const p = prop.toLowerCase();
  if (p.startsWith('--')) {
    if (/background|bg/.test(p)) return 'bg';
    if (/border|outline|divider|rule/.test(p)) return 'border';
    if (/shadow|glow/.test(p)) return 'shadow';
    return 'var';
  }
  if (p.startsWith('background')) return 'bg';
  if (/^(border|outline|column-rule)/.test(p)) return 'border';
  if (/shadow|^filter$/.test(p)) return 'shadow';
  return 'text';
}

const SKIP_PROPS = /^(content|font|src|grid|transition|animation|will-change|mask|clip-path|counter|quotes)/i;

function mapValue(value, role, prop) {
  let lime = false;
  if (role === 'bg' && /gradient\(/i.test(value)) role = 'grad';
  const keywordsOk = COLORISH_PROP.test(prop);
  const out = value.replace(COLOR_RE, (m, off, s) => {
    if (/^[a-z]/i.test(m) && !keywordsOk) return m;
    if (s.slice(Math.max(0, off - 4), off) === 'url(') return m;
    const r = mapColor(m, role);
    if (r.lime) lime = true;
    return r.value;
  });
  return { out, lime };
}

/** State gathered across files: custom properties that hold colours. */
export function createTheme() {
  const colorVars = new Set();   // --x defined with a colour (role 'var')
  const limeVars = new Set();    // --x whose background alias is solid lime

  const DECL_RE = /(^|[{;\s"'])(--[\w-]+|-?[a-zA-Z][\w-]*)(\s*:\s*)([^;{}"']+?)(?=\s*(?:!important\s*)?[;}"']|\s*$)/g;

  function collect(text) {
    for (const m of text.matchAll(DECL_RE)) {
      const [, , prop, , value] = m;
      if (prop.startsWith('--') && roleOf(prop) === 'var' && COLOR_RE.test(value)) {
        colorVars.add(prop);
        COLOR_RE.lastIndex = 0;
        const bg = mapValue(value, 'bg', prop);
        if (bg.lime) limeVars.add(prop);
      }
      COLOR_RE.lastIndex = 0;
    }
  }

  // Rewrites the declarations inside one block body. Returns the new body.
  function rewriteBody(body) {
    let lime = false;
    const textDecls = [];
    let out = body.replace(DECL_RE, (all, lead, prop, sep, value) => {
      if (SKIP_PROPS.test(prop)) return all;
      const role = roleOf(prop);
      let v = value;
      if (role === 'bg' || role === 'border') {
        const suffix = role === 'bg' ? '-bg' : '-bd';
        v = v.replace(VAR_RE, (vm, name, fb) => {
          if (!colorVars.has(name)) return vm;
          if (role === 'bg' && limeVars.has(name) && !/gradient\(/i.test(v)) lime = true;
          return `var(${name}${suffix}, var(${name}${fb}))`;
        });
      }
      if (role === 'var') {
        if (!COLOR_RE.test(v)) { COLOR_RE.lastIndex = 0; return all; }
        COLOR_RE.lastIndex = 0;
        const t = mapValue(v, 'text', prop).out, b = mapValue(v, 'bg', prop).out, d = mapValue(v, 'border', prop).out;
        return `${lead}${prop}${sep}${t};${prop}-bg:${b};${prop}-bd:${d}`;
      }
      const r = mapValue(v, role === 'var' ? 'text' : role, prop);
      if (role === 'bg' && r.lime) lime = true;
      if (role === 'text' && /^color$/i.test(prop)) textDecls.push(prop);
      return `${lead}${prop}${sep}${r.out}`;
    });
    if (lime) {
      // Text sitting on a lime surface must be dark to stay legible.
      if (textDecls.length) out = out.replace(/(^|[;{\s])color(\s*:\s*)[^;}!]+/i, `$1color$2${INK}`);
      else if (!/(^|[;\s])color\s*:/i.test(out)) out = out.replace(/;?\s*$/, m => `;color:${INK}` + (m.includes(';') ? '' : ''));
    }
    return out;
  }

  function css(text) {
    return text.replace(/([^{}]*)\{([^{}]*)\}/g, (all, sel, body) => {
      if (/@font-face|@keyframes/i.test(sel)) return all;
      return `${sel}{${rewriteBody(body)}}`;
    });
  }

  function html(text) {
    return text
      .replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (_, a, body, c) => a + css(body) + c)
      .replace(/(<script\b(?![^>]*\bsrc=)(?![^>]*type="application\/(?:ld\+)?json")[^>]*>)([\s\S]*?)(<\/script>)/gi, (_, a, body, c) => a + js(body) + c)
      .replace(/(\sstyle\s*=\s*)(["'])([\s\S]*?)\2/gi, (_, a, q, body) => a + q + rewriteBody(body.replace(/&quot;/g, '\u0001')).replace(/\u0001/g, '&quot;') + q)
      .replace(/(\s(?:fill|stroke|stop-color|color)\s*=\s*)(["'])(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\))\2/gi,
        (all, a, q, c) => a + q + mapColor(c, 'text').value + q);
  }

  function js(text) {
    // CSS embedded in strings (e.g. 'P .x{color:#fff}') plus standalone colour literals.
    let out = text.replace(/(['"`])((?:\\.|(?!\1)[^\\\n])*?\{(?:\\.|(?!\1)[^\\\n])*?\})\1/g, (all, q, s) => q + css(s) + q);
    out = out.replace(/(['"`])(#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(?:,\s*[\d.]+\s*)?\))\1/g,
      (all, q, c) => q + mapColor(c, 'text').value + q);
    // Bare 'r,g,b' strings used to build canvas colours ('rgba(' + TEAL + ',.5)'); accents only.
    out = out.replace(/(['"])(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\1/g, (all, q, r, g, b) => {
      const c = `rgb(${r},${g},${b})`, p = parse(c), hsl = rgbToHsl(p.r, p.g, p.b);
      if (!isAccent(hsl) || isRed(hsl)) return all;
      const m = parse(mapColor(c, 'text').value);
      return q + [m.r, m.g, m.b].map(v => Math.round(v * 255)).join(',') + q;
    });
    return out;
  }

  return { collect, css, html, js };
}

// ---------------------------------------------------------------- dist walker
async function* walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

export async function themeDist(dist) {
  const theme = createTheme();
  const files = [];
  for await (const f of walk(dist)) {
    if (SKIP.test(f)) continue;
    const ext = path.extname(f).toLowerCase();
    const isVendorJs = ext === '.js' && f.includes(`${path.sep}assets${path.sep}`);
    if ((ext === '.css' || ext === '.html' || ext === '.js') && !isVendorJs) files.push([f, ext]);
  }
  const texts = await Promise.all(files.map(([f]) => fs.readFile(f, 'utf8')));
  texts.forEach((t, i) => { if (files[i][1] === '.css') theme.collect(t); });
  texts.forEach((t, i) => { if (files[i][1] !== '.css') theme.collect(t); });
  let changed = 0;
  await Promise.all(files.map(async ([f, ext], i) => {
    const t = texts[i];
    const out = ext === '.css' ? theme.css(t) : ext === '.html' ? theme.html(t) : theme.js(t);
    if (out !== t) { changed++; await fs.writeFile(f, out); }
  }));
  return changed;
}

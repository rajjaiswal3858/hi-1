// Helpers shared by the import scripts (crawl + extract).
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ORIGIN = 'https://hatchworks.com';
export const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const CACHE_DIR = path.join(ROOT, '.cache');
export const SRC_DIR = path.join(ROOT, 'src');

const NON_PAGE = /^\/(wp-|feed\b|comments\b|xmlrpc|cdn-cgi|\?)|\/feed\/$|\/embed\/$|\.(css|js|png|jpe?g|gif|svg|webp|avif|ico|xml|pdf|woff2?|ttf|mp4|mp3|json|txt|zip)\/?$/i;

/** Turns an href into a canonical site route ("/foo/bar/"), or null if it is not on the site. */
export function normalizeRoute(href) {
  if (!href) return null;
  href = href.trim().replace(/&amp;/g, '&');
  if (/^(mailto|tel|javascript|data):/i.test(href) || href.startsWith('#')) return null;
  let url;
  try { url = new URL(href, ORIGIN + '/'); } catch { return null; }
  if (!/^(www\.)?hatchworks\.com$/i.test(url.hostname)) return null;
  let p = decodeURIComponent(url.pathname).replace(/\/{2,}/g, '/');
  if (!p.endsWith('/') && !/\.[a-z0-9]{2,5}$/i.test(p)) p += '/';
  return p;
}

export function isPageHref(route) {
  return route && !NON_PAGE.test(route) && !route.startsWith('//');
}

/** "/" -> "index.html", "/a/b/" -> "a__b.html" */
export function routeToFile(route) {
  const slug = route.replace(/^\/|\/$/g, '').replace(/\//g, '__');
  return (slug || 'index') + '.html';
}

/** "/" -> "home", "/a/b/" -> "a/b" (source folder under src/pages) */
export function routeToPageDir(route) {
  return route.replace(/^\/|\/$/g, '') || 'home';
}

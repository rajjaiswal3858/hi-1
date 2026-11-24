// Zero-dependency static server for dist/ with clean-URL routing.
//   npm run serve            -> http://localhost:4321
//   PORT=8080 npm run serve
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.env.PORT || 4321);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
};

async function resolveFile(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  let file = path.join(DIST, clean);
  if (!file.startsWith(DIST)) return null;
  try {
    const st = await fs.stat(file);
    if (st.isDirectory()) file = path.join(file, 'index.html');
    await fs.access(file);
    return file;
  } catch {
    if (!path.extname(file)) {
      try { await fs.access(path.join(file, 'index.html')); return { redirect: urlPath + '/' }; } catch {}
    }
    return null;
  }
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const hit = await resolveFile(url.pathname);
  if (hit && hit.redirect) { res.writeHead(301, { location: hit.redirect + url.search }); return res.end(); }
  const file = hit || path.join(DIST, '404.html');
  try {
    const body = await fs.readFile(file);
    res.writeHead(hit ? 200 : 404, { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-cache' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }); res.end('Not found');
  }
}).listen(PORT, () => console.log(`Serving dist/ on http://localhost:${PORT}`));

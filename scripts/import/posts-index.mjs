// Builds src/data/posts.json: a compact index of every blog post (title, date, link,
// categories, tags, image, author). Used by the blog listing's client-side filters,
// sorting and pagination, replacing the original AJAX (JetSmartFilters) backend.
import fs from 'node:fs/promises';
import path from 'node:path';
import { ORIGIN, UA, SRC_DIR, normalizeRoute } from './shared.mjs';

const api = p => fetch(`${ORIGIN}/wp-json/wp/v2/${p}`, { headers: { 'user-agent': UA } });

async function all(resource, fields, extra = '') {
  const out = [];
  for (let page = 1; ; page++) {
    const res = await api(`${resource}?per_page=100&page=${page}&_fields=${fields}${extra}`);
    if (!res.ok) break;
    const items = await res.json();
    out.push(...items);
    if (page >= Number(res.headers.get('x-wp-totalpages') || 1)) break;
  }
  return out;
}

const decode = s => String(s || '')
  .replace(/<[^>]+>/g, '')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ').trim();

const [categories, tags, users] = await Promise.all([
  all('categories', 'id,name,slug,parent,count,link'),
  all('tags', 'id,name,slug,count'),
  all('users', 'id,name,slug'),
]);
const posts = await all('posts', 'id,date,slug,link,title,excerpt,categories,tags,author,featured_media,_links,_embedded', '&_embed=wp:featuredmedia');

const media = p => {
  const m = p._embedded?.['wp:featuredmedia']?.[0];
  if (!m || !m.media_details) return null;
  const sizes = m.media_details.sizes || {};
  const pick = sizes.medium_large || sizes.large || sizes.full || sizes.medium;
  const url = (pick?.source_url || m.source_url || '').replace(/^https?:\/\/(www\.)?hatchworks\.com\//, '/assets/');
  return { url, alt: m.alt_text || '', w: pick?.width, h: pick?.height };
};

const index = {
  generated: new Date().toISOString(),
  categories: categories.map(c => ({ id: c.id, name: decode(c.name), slug: c.slug, parent: c.parent, count: c.count, route: normalizeRoute(c.link) })),
  tags: tags.map(t => ({ id: t.id, name: decode(t.name), slug: t.slug, count: t.count })),
  authors: users.map(u => ({ id: u.id, name: u.name, slug: u.slug })),
  posts: posts.map(p => ({
    id: p.id, date: p.date, route: normalizeRoute(p.link), title: decode(p.title?.rendered),
    excerpt: decode(p.excerpt?.rendered).slice(0, 260), categories: p.categories, tags: p.tags, author: p.author, image: media(p),
  })),
};

await fs.mkdir(path.join(SRC_DIR, 'data'), { recursive: true });
await fs.writeFile(path.join(SRC_DIR, 'data', 'posts.json'), JSON.stringify(index));
console.log(`posts: ${index.posts.length}, categories: ${index.categories.length}, tags: ${index.tags.length}`);

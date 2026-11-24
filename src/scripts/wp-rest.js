/*
 * Static stand-in for the WordPress REST API endpoints the site's own scripts call
 * (blog live search, case-study listing). Requests to /wp-json/wp/v2/* are answered
 * from /data/posts.json in the same JSON shape WordPress returns, so the original
 * page scripts run unchanged.
 *
 * Supported:  GET /posts       (search, per_page, page, categories, categories_exclude, tags, order)
 *             GET /categories  (slug, per_page)
 * Anything else resolves to an empty list, which callers treat as "no live data".
 */
(function () {
  'use strict';
  if (!window.fetch || window.__wpRestShim) return;
  window.__wpRestShim = true;

  // WordPress' native search URL (/?s=term) lands on the blog listing, which filters by ?s=.
  if (location.pathname === '/' && /[?&]s=/.test(location.search)) {
    location.replace('/resources/blog/' + location.search);
    return;
  }

  var nativeFetch = window.fetch.bind(window);
  var indexPromise = null;
  function index() {
    if (!indexPromise) indexPromise = nativeFetch('/data/posts.json').then(function (r) { return r.json(); });
    return indexPromise;
  }

  function json(body, total, perPage) {
    var headers = { 'Content-Type': 'application/json' };
    if (total != null) {
      headers['X-WP-Total'] = String(total);
      headers['X-WP-TotalPages'] = String(Math.max(1, Math.ceil(total / (perPage || 10))));
    }
    return new Response(JSON.stringify(body), { status: 200, headers: headers });
  }

  function ids(v) { return v ? v.split(',').map(Number).filter(Boolean) : []; }

  function score(post, words) {
    var title = post.title.toLowerCase(), text = (post.excerpt || '').toLowerCase(), s = 0;
    for (var i = 0; i < words.length; i++) {
      var inTitle = title.indexOf(words[i]) > -1;
      if (!inTitle && text.indexOf(words[i]) === -1) return 0;
      s += inTitle ? 3 : 1;
    }
    return s;
  }

  function wpPost(p) {
    var media = p.image && p.image.url ? [{
      source_url: p.image.url, alt_text: p.image.alt || '',
      media_details: { sizes: { thumbnail: { source_url: p.image.url }, medium: { source_url: p.image.url }, medium_large: { source_url: p.image.url } } },
    }] : [];
    return {
      id: p.id, date: p.date, link: p.route, slug: p.route.replace(/\/$/, '').split('/').pop(),
      title: { rendered: p.title }, excerpt: { rendered: '<p>' + (p.excerpt || '') + '</p>' },
      categories: p.categories, tags: p.tags, author: p.author,
      _embedded: { 'wp:featuredmedia': media },
    };
  }

  function posts(q, data) {
    var perPage = Math.min(100, parseInt(q.get('per_page') || '10', 10));
    var page = Math.max(1, parseInt(q.get('page') || '1', 10));
    var inc = ids(q.get('categories')), exc = ids(q.get('categories_exclude')), tags = ids(q.get('tags'));
    var words = (q.get('search') || '').toLowerCase().split(/\s+/).filter(Boolean);
    var list = data.posts.filter(function (p) {
      if (inc.length && !inc.some(function (c) { return p.categories.indexOf(c) > -1; })) return false;
      if (exc.length && exc.some(function (c) { return p.categories.indexOf(c) > -1; })) return false;
      if (tags.length && !tags.some(function (t) { return p.tags.indexOf(t) > -1; })) return false;
      return true;
    });
    if (words.length) {
      list = list.map(function (p) { return { p: p, s: score(p, words) }; })
        .filter(function (x) { return x.s > 0; })
        .sort(function (a, b) { return b.s - a.s || (a.p.date < b.p.date ? 1 : -1); })
        .map(function (x) { return x.p; });
    } else if (q.get('order') === 'asc') list = list.slice().reverse();
    return json(list.slice((page - 1) * perPage, page * perPage).map(wpPost), list.length, perPage);
  }

  function categories(q, data) {
    var slugs = (q.get('slug') || '').split(',').filter(Boolean);
    var list = data.categories.filter(function (c) { return !slugs.length || slugs.indexOf(c.slug) > -1; });
    return json(list.map(function (c) { return { id: c.id, slug: c.slug, name: c.name, parent: c.parent, count: c.count, link: c.route }; }), list.length, 100);
  }

  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    var m = url.match(/\/wp-json\/wp\/v2\/([\w-]+)\/?(?:\?(.*))?$/);
    if (!m) return nativeFetch(input, init);
    var q = new URLSearchParams(m[2] || '');
    return index().then(function (data) {
      if (m[1] === 'posts') return posts(q, data);
      if (m[1] === 'categories') return categories(q, data);
      return json([], 0);
    }).catch(function () { return json([], 0); });
  };

  // Expose the same matcher for the blog listing's ?s= filter.
  window.hwSearchScore = score;
})();

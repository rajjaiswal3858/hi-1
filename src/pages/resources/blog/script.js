(function () {
  /* ===== CONFIG — lo único que puede necesitar ajuste ===== */
  var HWH_CONFIG = {
    restBase: '/wp-json/wp/v2',

    // A dónde va "See all results" y Enter.
    // Por defecto: búsqueda nativa de WP limitada a post type `post`.
    // Si tu Loop Grid llega a leer ?s=, poné resultsUrl: '/resources/blog/'
    // y resultsParams: ''.
    resultsUrl: '/',
    resultsParams: 'post_type=post',

    perPage: 6,
    minChars: 2,
    debounce: 250,
    // Categorías que NO deben aparecer. Se resuelven por slug en runtime;
    // si un slug no existe, se ignora sin romper nada.
    excludeSlugs: ['newsroom', 'news', 'press', 'press-release']
  };
  /* ======================================================== */

  var root = document.getElementById('hwHero2026');
  if (!root) return;
  var wrap  = root.querySelector('.hwh-search');
  var form  = root.querySelector('.hwh-field');
  var input = root.querySelector('#hwhInput');
  var panel = root.querySelector('#hwhResults');
  var clear = root.querySelector('.hwh-clear');
  if (!wrap || !form || !input || !panel || !clear) return;

  var timer = null, ctrl = null, active = -1, items = [];
  var excludeIds = null;   // null = sin resolver todavía

  function resultsHref(q) {
    var u = HWH_CONFIG.resultsUrl + '?s=' + encodeURIComponent(q);
    if (HWH_CONFIG.resultsParams) u += '&' + HWH_CONFIG.resultsParams;
    return u;
  }

  function esc(s) { return String(s).replace(/[<>"']/g, function (c) { return { '<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]; }); }
  function decode(html) { var t = document.createElement('textarea'); t.innerHTML = html; return t.value; }

  function fmtDate(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  function thumb(post) {
    try {
      var m = post._embedded['wp:featuredmedia'][0];
      var s = m.media_details && m.media_details.sizes;
      return (s && (s.thumbnail || s.medium) || {}).source_url || m.source_url || '';
    } catch (e) { return ''; }
  }

  function resolveExcluded() {
    if (excludeIds !== null) return Promise.resolve(excludeIds);
    var q = HWH_CONFIG.excludeSlugs.join(',');
    return fetch(HWH_CONFIG.restBase + '/categories?per_page=100&_fields=id,slug&slug=' + encodeURIComponent(q))
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (cats) {
        excludeIds = (cats || []).map(function (c) { return c.id; });
        return excludeIds;
      })
      .catch(function () { excludeIds = []; return excludeIds; });
  }

  function open() {
    wrap.classList.add('is-open');
    wrap.setAttribute('aria-expanded', 'true');
    root.classList.add('hwh-top');
  }
  function close() {
    wrap.classList.remove('is-open');
    wrap.setAttribute('aria-expanded', 'false');
    root.classList.remove('hwh-top');
    active = -1;
  }

  function msg(text) {
    panel.innerHTML = '<span class="hwh-msg">' + esc(text) + '</span>';
    items = []; active = -1; open();
  }

  function render(posts, q, total) {
    if (!posts.length) { msg('No blog posts match “' + q + '”'); return; }

    var html = posts.map(function (p) {
      var t = thumb(p);
      var img = t
        ? '<img loading="lazy" loading="lazy" decoding="async" src="' + esc(t) + '" alt="" loading="lazy" width="40" height="40">'
        : '<span class="hwh-thumb"></span>';
      return '<a class="hwh-res" role="option" href="' + esc(p.link) + '">' + img +
             '<span class="hwh-txt">' +
               '<span class="hwh-t">' + esc(decode(p.title.rendered)) + '</span>' +
               '<span class="hwh-m">' + esc(fmtDate(p.date)) + '</span>' +
             '</span></a>';
    }).join('');

    var label = (total && total > posts.length) ? 'See all ' + total + ' results' : 'See all results';

    html += '<a class="hwh-all" href="' + esc(resultsHref(q)) + '">' +
            '<span>' + label + '</span>' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15"></path><path d="M13 6l6 6-6 6"></path></svg></a>';

    panel.innerHTML = html;
    items = Array.prototype.slice.call(panel.querySelectorAll('.hwh-res, .hwh-all'));
    active = -1;
    open();
  }

  function search(q) {
    if (ctrl) ctrl.abort();
    ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    wrap.classList.add('is-loading');

    resolveExcluded().then(function (ids) {
      var url = HWH_CONFIG.restBase + '/posts?_embed=1&per_page=' + HWH_CONFIG.perPage +
                '&orderby=relevance&search=' + encodeURIComponent(q) +
                '&_fields=id,link,date,title,_links.wp:featuredmedia,_embedded';
      if (ids.length) url += '&categories_exclude=' + ids.join(',');

      return fetch(url, ctrl ? { signal: ctrl.signal } : undefined);
    })
    .then(function (r) {
      if (!r.ok) return { posts: [], total: 0 };
      var total = parseInt(r.headers.get('X-WP-Total') || '0', 10) || 0;
      return r.json().then(function (posts) { return { posts: posts, total: total }; });
    })
    .then(function (res) {
      wrap.classList.remove('is-loading');
      if (input.value.trim() !== q) return;      // llegó tarde
      render(res.posts || [], q, res.total);
    })
    .catch(function (err) {
      if (err && err.name === 'AbortError') return;
      wrap.classList.remove('is-loading');
      msg('Search is unavailable right now');
    });
  }

  function onType() {
    var q = input.value.trim();
    wrap.classList.toggle('has-query', q.length > 0);
    clearTimeout(timer);
    if (ctrl) { ctrl.abort(); ctrl = null; }

    if (q.length < HWH_CONFIG.minChars) { wrap.classList.remove('is-loading'); close(); return; }
    timer = setTimeout(function () { search(q); }, HWH_CONFIG.debounce);
  }

  /* Scroll interno del panel sin scrollIntoView (no toca el scroll de la página) */
  function keepInView(el) {
    var top = el.offsetTop, bottom = top + el.offsetHeight;
    if (top < panel.scrollTop) panel.scrollTop = top;
    else if (bottom > panel.scrollTop + panel.clientHeight) panel.scrollTop = bottom - panel.clientHeight;
  }

  function setActive(i) {
    if (!items.length) return;
    if (active > -1 && items[active]) items[active].classList.remove('is-active');
    active = (i + items.length) % items.length;
    items[active].classList.add('is-active');
    keepInView(items[active]);
  }

  input.addEventListener('input', onType);
  input.addEventListener('focus', function () {
    wrap.classList.add('is-focus');
    if (items.length && input.value.trim().length >= HWH_CONFIG.minChars) open();
  });
  input.addEventListener('blur', function () { wrap.classList.remove('is-focus'); });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Escape') { close(); input.blur(); }
    else if (e.key === 'Enter') {
      if (active > -1 && items[active]) { e.preventDefault(); window.location.href = items[active].href; }
      /* si no hay item activo, el form navega a resultsUrl?s=… */
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (q) window.location.href = resultsHref(q);
  });

  clear.addEventListener('click', function () {
    input.value = '';
    wrap.classList.remove('has-query');
    close();
    input.focus();
  });

  document.addEventListener('click', function (e) {
    if (!wrap.contains(e.target)) close();
  });

  /* ---- Ticker: click = buscar ese tema, no navegar ---- */
  Array.prototype.forEach.call(root.querySelectorAll('.hwh-seg a'), function (a) {
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;  // dejá pasar abrir-en-pestaña
      e.preventDefault();
      var term = a.querySelector('span').textContent.trim();
      input.value = term;
      wrap.classList.add('has-query');
      input.focus();
      clearTimeout(timer);
      search(term);
    });
  });
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":28438,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before
;
var JetSmartFilterSettings = {"ajaxurl":"https://hatchworks.com/wp-admin/admin-ajax.php","siteurl":"/","sitepath":"","baseurl":"/resources/blog/","selectors":{"epro-loop-builder":{"selector":".elementor-loop-container","action":"replace","inDepth":true,"idPrefix":"#"},"default-woo-archive":{"selector":".woocommerce .products","action":"insert","inDepth":false,"idPrefix":"#","list":".products","item":".product"}},"queries":{"epro-loop-builder":{"default":{"has_custom_pagination":false,"post_status":"publish","post_type":"post","orderby":"post_date","order":"desc","post__not_in":[],"tax_query":{"0":{"taxonomy":"category","field":"term_taxonomy_id","terms":["134"]},"relation":"AND","1":[{"taxonomy":"category","field":"term_taxonomy_id","terms":["53","143","209"],"operator":"NOT IN"}]},"date_query":[]}}},"settings":{"epro-loop-builder":{"default":{"widget_id":"0176f42","filtered_post_id":28438}}},"misc":{"week_start":"0","url_type":"plain","valid_url_params":["jsf","tax","meta","date","sort","alphabet","_s","_sm","pagenum","plain_query","jet-smart-filters","jet_paged","search","_tax_query_","_meta_query_","_date_query_","_sort_","__s_"]},"props":{"epro-loop-builder":{"default":{"found_posts":191,"max_num_pages":13,"page":1}}},"extra_props":{},"templates":{"active_tag":{"label":"\u003Cdiv class=\"jet-active-tag__label\"\u003E/% $value %/\u003Cspan class=\"jet-active-tag__label-separator\"\u003E:\u003C/span\u003E\u003C/div\u003E","value":"\u003Cdiv class=\"jet-active-tag__val\"\u003E/% $value %/\u003C/div\u003E","remove":"\u003Cdiv class=\"jet-active-tag__remove\"\u003E&times;\u003C/div\u003E"},"active_filter":{"label":"\u003Cdiv class=\"jet-active-filter__label\"\u003E/% $value %/\u003Cspan class=\"jet-active-filter__label-separator\"\u003E:\u003C/span\u003E\u003C/div\u003E","value":"\u003Cdiv class=\"jet-active-filter__val\"\u003E/% $value %/\u003C/div\u003E","remove":"\u003Cdiv class=\"jet-active-filter__remove\"\u003E&times;\u003C/div\u003E"},"pagination":{"item":"\u003Cdiv class=\"jet-filters-pagination__link\"\u003E/% $value %/\u003C/div\u003E","dots":"\u003Cdiv class=\"jet-filters-pagination__dots\"\u003E&hellip;\u003C/div\u003E","load_more":"\u003Cdiv class=\"jet-filters-pagination__link\"\u003E/% $value %/\u003C/div\u003E"}},"plugin_settings":{"use_tabindex":"false","use_url_aliases":"false","url_aliases":[{"needle":"/jsf/jet-engine/","replacement":"/filter/"}],"provider_preloader":{"template":"\n\u003Cdiv class=\"jsf_provider-preloader\"\u003E\n\t\u003Cdiv class=\"jsf_provider-preloader-circle-clip-growing\"\u003E\n\t\t\u003Csvg width=\"0\" height=\"0\" viewBox=\"0 0 50 50\"\u003E\u003Ccircle class=\"path\" cx=\"25\" cy=\"25\" r=\"20\" fill=\"none\" stroke-width=\"5\"\u003E\u003C/circle\u003E\u003C/svg\u003E\t\u003C/div\u003E\n\u003C/div\u003E","fixed_position":"false","fixed_edge_gap":"80"},"url_custom_symbols":""},"datePickerData":{"closeText":"Done","prevText":"Prev","nextText":"Next","currentText":"Today","monthNames":["January","February","March","April","May","June","July","August","September","October","November","December"],"monthNamesShort":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"dayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"dayNamesShort":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"dayNamesMin":["Su","Mo","Tu","We","Th","Fr","Sa"],"weekHeader":"Wk"},"referrer_url":"/resources/blog/?jsf_ajax=1"};
//# sourceURL=jet-smart-filters-js-extra

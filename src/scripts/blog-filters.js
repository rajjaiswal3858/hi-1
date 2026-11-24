/*
 * Client-side replacement for the blog listing's JetSmartFilters (AJAX on the original site).
 *
 * Works on the existing markup: the sort <select>, category <select>, tag checkboxes,
 * date range, active-filter chips and pagination all drive the Elementor loop grid.
 * Posts come from /data/posts.json; cards are produced by cloning the first server-rendered
 * card, so they always match the page's own card template and CSS.
 */
(function () {
  'use strict';
  var grid = document.querySelector('.elementor-widget-loop-grid .elementor-loop-container');
  var pager = document.querySelector('.jet-smart-filters-pagination');
  if (!grid || !pager) return;
  var template = grid.querySelector('[data-elementor-type="loop-item"]');
  if (!template) return;

  var PER_PAGE = grid.querySelectorAll('[data-elementor-type="loop-item"]').length || 15;
  var sortSel = document.querySelector('.jet-sorting-select');
  var catSel = document.querySelector('.jet-select__control[name="category"]');
  var tagBoxes = Array.prototype.slice.call(document.querySelectorAll('.jet-checkboxes-list__input[name="post_tag"]'));
  var fromInput = document.querySelector('.jet-date-range__from');
  var toInput = document.querySelector('.jet-date-range__to');
  var dateSubmit = document.querySelector('.jet-date-range__submit');
  var activeBox = document.querySelector('.jet-smart-filters-active');
  var gridTop = grid.closest('.elementor-widget-loop-grid');

  var state = { page: 1, sort: null, category: '', tags: [], from: '', to: '', search: '' };
  try { state.search = (new URLSearchParams(location.search).get('s') || '').trim(); } catch (e) { /* no URL API */ }
  var data = null;
  var authors = {};

  [fromInput, toInput].forEach(function (i) { if (i) { i.type = 'date'; } });

  function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function card(post) {
    var n = template.cloneNode(true);
    n.className = n.className.replace(/\b(e-loop-item-|post-)\d+\b/g, '$1' + post.id).replace(/\b(category|tag)-[\w-]+\s?/g, '');
    Array.prototype.forEach.call(n.querySelectorAll('a[href]'), function (a) {
      var href = a.getAttribute('href');
      if (/\/author\//.test(href)) {
        var au = authors[post.author];
        if (au) {
          a.setAttribute('href', '/author/' + au.slug + '/');
          var t = a.querySelector('.elementor-post-info__item--type-author');
          if (t) t.textContent = au.name;
        }
      } else if (!/^(https?:)?\/\//.test(href) || href.indexOf(location.host) > -1) a.setAttribute('href', post.route);
    });
    var img = n.querySelector('.elementor-widget-theme-post-featured-image img');
    if (img) {
      if (post.image && post.image.url) {
        img.src = post.image.url; img.alt = post.image.alt || post.title;
        img.removeAttribute('srcset'); img.removeAttribute('sizes'); img.removeAttribute('fetchpriority');
        img.loading = 'lazy';
      } else img.closest('.elementor-widget').style.display = 'none';
    }
    var title = n.querySelector('.elementor-widget-theme-post-title a, .elementor-widget-theme-post-title .elementor-heading-title');
    if (title) title.textContent = post.title;
    var time = n.querySelector('.elementor-post-info__item--type-date time, .elementor-post-info__item--type-date');
    if (time) time.textContent = fmtDate(post.date);
    return n;
  }

  function filtered() {
    var words = state.search.toLowerCase().split(/\s+/).filter(Boolean);
    var list = data.posts.filter(function (p) {
      if (words.length && window.hwSearchScore && !window.hwSearchScore(p, words)) return false;
      if (state.category && p.categories.indexOf(+state.category) === -1) return false;
      if (state.tags.length && !state.tags.some(function (t) { return p.tags.indexOf(+t) > -1; })) return false;
      var d = p.date.slice(0, 10);
      if (state.from && d < state.from) return false;
      if (state.to && d > state.to) return false;
      return true;
    });
    var s = state.sort;
    if (s) {
      var dir = s.order === 'ASC' ? 1 : -1;
      list.sort(function (a, b) {
        return (s.orderby === 'title' ? a.title.localeCompare(b.title) : (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)) * dir;
      });
    }
    return list;
  }

  function pageItem(label, value, cls) {
    return '<div class="jet-filters-pagination__item ' + (cls || '') + '" data-value="' + value + '">' +
      '<div class="jet-filters-pagination__link" role="button" tabindex="0">' + label + '</div></div>';
  }

  function renderPager(pages) {
    if (pages <= 1) { pager.innerHTML = ''; return; }
    var cur = state.page, html = '', last = 0;
    if (cur > 1) html += pageItem('Prev', 'prev', 'prev-next prev');
    for (var i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - cur) <= 2) {
        if (last && i - last > 1) html += '<div class="jet-filters-pagination__item"><div class="jet-filters-pagination__dots">…</div></div>';
        html += pageItem(i, i, i === cur ? 'jet-filters-pagination__current' : '');
        last = i;
      }
    }
    if (cur < pages) html += pageItem('Next', 'next', 'prev-next next');
    pager.innerHTML = '<div class="jet-filters-pagination">' + html + '</div>';
  }

  function chip(label, value, key, id) {
    return '<div class="jet-active-filter" data-key="' + key + '" data-id="' + (id || '') + '" role="button" tabindex="0">' +
      (label ? '<div class="jet-active-filter__label">' + label + '</div>' : '') +
      '<div class="jet-active-filter__val">' + value + '</div><div class="jet-active-filter__remove">×</div></div>';
  }

  function renderActive() {
    if (!activeBox) return;
    var html = '';
    if (state.search) html += chip('Search:', state.search.replace(/[<>&"]/g, ''), 'search');
    if (state.category && catSel) html += chip('Categories:', catSel.options[catSel.selectedIndex].text, 'category');
    state.tags.forEach(function (t) {
      var box = tagBoxes.filter(function (b) { return b.value === t; })[0];
      html += chip('', box ? box.getAttribute('data-label') : t, 'tag', t);
    });
    if (state.from || state.to) html += chip('', (state.from || '…') + ' – ' + (state.to || '…'), 'date');
    activeBox.innerHTML = html ? '<div class="jet-active-filters__list">' + html + '</div>' : '';
  }

  function render(scroll) {
    var list = filtered();
    var pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    state.page = Math.min(Math.max(1, state.page), pages);
    var slice = list.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE);
    Array.prototype.forEach.call(grid.querySelectorAll('[data-elementor-type="loop-item"], .hw-no-results'), function (n) { n.remove(); });
    if (!slice.length) {
      var empty = document.createElement('div');
      empty.className = 'hw-no-results e-loop-nothing-found-message';
      empty.textContent = 'It seems we can’t find what you’re looking for.';
      grid.appendChild(empty);
    }
    var frag = document.createDocumentFragment();
    slice.forEach(function (p) { frag.appendChild(card(p)); });
    grid.appendChild(frag);
    renderPager(pages);
    renderActive();
    if (scroll && gridTop) window.scrollTo({ top: gridTop.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
  }

  function update(resetPage, scroll) {
    if (resetPage) state.page = 1;
    if (data) return render(scroll);
    fetch('/data/posts.json').then(function (r) { return r.json(); }).then(function (j) {
      // The listing shows blog articles only (news, podcast episodes etc. have their own archives).
      j.posts = j.posts.filter(function (p) { return p.route && p.route.indexOf('/blog/') === 0; });
      if (!j.posts.length) return; // empty index: keep the server-rendered first page
      j.authors.forEach(function (a) { authors[a.id] = a; });
      data = j;
      render(scroll);
    }).catch(function () { /* index unavailable: keep the server-rendered first page */ });
  }

  if (sortSel) sortSel.addEventListener('change', function () {
    try { state.sort = sortSel.value ? JSON.parse(sortSel.value) : null; } catch (e) { state.sort = null; }
    update(true);
  });
  if (catSel) catSel.addEventListener('change', function () { state.category = catSel.value; update(true); });
  tagBoxes.forEach(function (b) {
    b.addEventListener('change', function () {
      state.tags = tagBoxes.filter(function (x) { return x.checked; }).map(function (x) { return x.value; });
      update(true);
    });
  });
  function applyDates() { state.from = fromInput ? fromInput.value : ''; state.to = toInput ? toInput.value : ''; update(true); }
  if (dateSubmit) dateSubmit.addEventListener('click', function (e) { e.preventDefault(); applyDates(); });
  else [fromInput, toInput].forEach(function (i) { if (i) i.addEventListener('change', applyDates); });

  function onPager(e) {
    var item = e.target.closest('.jet-filters-pagination__item[data-value]');
    if (!item) return;
    var v = item.getAttribute('data-value');
    state.page = v === 'prev' ? state.page - 1 : v === 'next' ? state.page + 1 : +v;
    update(false, true);
  }
  pager.addEventListener('click', onPager);
  pager.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPager(e); } });

  if (activeBox) activeBox.addEventListener('click', function (e) {
    var c = e.target.closest('.jet-active-filter');
    if (!c) return;
    var key = c.getAttribute('data-key');
    if (key === 'search') {
      state.search = '';
      try { history.replaceState(null, '', location.pathname); } catch (err) { /* file:// */ }
    }
    if (key === 'category') { state.category = ''; if (catSel) catSel.value = ''; }
    if (key === 'tag') {
      var id = c.getAttribute('data-id');
      state.tags = state.tags.filter(function (t) { return t !== id; });
      tagBoxes.forEach(function (b) { if (b.value === id) b.checked = false; });
    }
    if (key === 'date') { state.from = state.to = ''; if (fromInput) fromInput.value = ''; if (toInput) toInput.value = ''; }
    update(true);
  });

  // Initial pagination (first page is already server-rendered); a ?s= search scrolls to the results.
  update(false, !!state.search);
})();

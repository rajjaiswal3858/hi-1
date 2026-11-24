/*
 * Lightweight runtime for the Elementor / add-on widgets used on the site.
 * Replaces Elementor's jQuery-based frontend bundle with the behaviour actually needed:
 *
 *   - Video widget (YouTube / Vimeo / self-hosted, inline or behind an image overlay)
 *   - Nav Menu widget (mobile toggle + desktop sub-menus)
 *   - Exclusive Addons testimonial carousel (slick-style slider)
 *   - Loop Carousel (Swiper, loaded on demand from the CDN)
 *   - WP Tabs (sp-tab) tab switching
 *   - Exclusive Addons table (client-side search / sort when enabled)
 */
(function () {
  'use strict';

  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  function settings(el) {
    try { return JSON.parse(el.getAttribute('data-settings') || '{}'); } catch (e) { return {}; }
  }
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  function loadCss(href) {
    if (document.querySelector('link[href="' + href + '"]')) return;
    var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l);
  }

  /* ---------------------------------------------------------------- video */
  function youtubeId(url) {
    var m = String(url || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
    return m && m[1];
  }
  function vimeoId(url) {
    var m = String(url || '').match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m && m[1];
  }
  function videoSrc(s, autoplay) {
    var p = [];
    if (s.video_type === 'vimeo') {
      var vid = vimeoId(s.vimeo_url);
      if (!vid) return null;
      if (autoplay || s.autoplay === 'yes') p.push('autoplay=1');
      if (s.mute === 'yes') p.push('muted=1');
      if (s.loop === 'yes') p.push('loop=1');
      return 'https://player.vimeo.com/video/' + vid + (p.length ? '?' + p.join('&') : '');
    }
    var id = youtubeId(s.youtube_url);
    if (!id) return null;
    p.push('feature=oembed', 'rel=0', 'playsinline=1', 'controls=' + (s.controls === 'yes' || s.controls == null ? 1 : 0));
    if (autoplay || s.autoplay === 'yes') p.push('autoplay=1');
    if (s.mute === 'yes' || (s.autoplay === 'yes' && !autoplay)) p.push('mute=1');
    if (s.loop === 'yes') p.push('loop=1', 'playlist=' + id);
    if (s.start) p.push('start=' + parseInt(s.start, 10));
    if (s.end) p.push('end=' + parseInt(s.end, 10));
    var host = s.yt_privacy === 'yes' ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com';
    return host + '/embed/' + id + '?' + p.join('&');
  }
  function initVideo(widget) {
    var s = settings(widget);
    var slot = widget.querySelector('.elementor-video');
    if (!slot || slot.tagName === 'VIDEO' || slot.tagName === 'IFRAME') return;
    var overlay = widget.querySelector('.elementor-custom-embed-image-overlay');
    function mount(autoplay) {
      var src = videoSrc(s, autoplay);
      if (!src) return;
      var f = document.createElement('iframe');
      f.className = 'elementor-video';
      f.src = src;
      f.title = s.video_type === 'vimeo' ? 'vimeo Video Player' : 'youtube Video Player';
      f.setAttribute('frameborder', '0');
      f.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      f.setAttribute('allowfullscreen', '');
      f.setAttribute('loading', 'lazy');
      slot.replaceWith(f);
      slot = f;
    }
    if (overlay) {
      overlay.addEventListener('click', function () {
        mount(true);
        overlay.remove();
      });
      overlay.setAttribute('role', 'button');
      overlay.setAttribute('tabindex', '0');
      overlay.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); overlay.click(); } });
    } else mount(false);
  }

  /* ------------------------------------------------------------- nav menu */
  function initNavMenu(widget) {
    var toggle = widget.querySelector('.elementor-menu-toggle');
    var dropdown = widget.querySelector('.elementor-nav-menu--dropdown');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = toggle.classList.toggle('elementor-active');
        toggle.setAttribute('aria-expanded', String(open));
        if (dropdown) dropdown.setAttribute('aria-hidden', String(!open));
      });
      toggle.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); } });
    }
    $$('.menu-item-has-children', widget).forEach(function (li) {
      var sub = li.querySelector(':scope > ul');
      if (!sub) return;
      var show = function () { sub.style.display = 'block'; li.classList.add('highlighted'); };
      var hide = function () { sub.style.display = ''; li.classList.remove('highlighted'); };
      li.addEventListener('mouseenter', show);
      li.addEventListener('mouseleave', hide);
      li.addEventListener('focusin', show);
      li.addEventListener('focusout', function (e) { if (!li.contains(e.relatedTarget)) hide(); });
    });
  }

  /* ----------------------------------------- testimonial carousel (slick) */
  function initSlick(wrapper) {
    var slides = Array.prototype.slice.call(wrapper.children);
    if (slides.length < 2) return;
    var perView = function () {
      var w = window.innerWidth;
      var key = w <= 767 ? 'data-slidestoshow-mobile' : (w <= 1024 ? 'data-slidestoshow-tablet' : 'data-slidestoshow');
      return Math.max(1, parseInt(wrapper.getAttribute(key) || wrapper.getAttribute('data-slidestoshow') || '1', 10));
    };
    var speed = parseInt(wrapper.getAttribute('data-speed') || '600', 10);
    var autoplay = wrapper.getAttribute('data-autoplay') === 'true';
    var delay = parseInt(wrapper.getAttribute('data-autoplayspeed') || '5000', 10);
    var pause = wrapper.getAttribute('data-pauseonhover') === 'true';

    wrapper.classList.add('slick-initialized', 'slick-slider');
    var list = document.createElement('div'); list.className = 'slick-list draggable'; list.style.overflow = 'hidden';
    var track = document.createElement('div'); track.className = 'slick-track';
    track.style.display = 'flex';
    track.style.transition = 'transform ' + speed + 'ms ease';
    slides.forEach(function (s) { s.classList.add('slick-slide'); track.appendChild(s); });
    list.appendChild(track); wrapper.appendChild(list);

    var index = 0, timer = 0, hovering = false;
    function layout() {
      var n = perView();
      slides.forEach(function (s) { s.style.flex = '0 0 ' + (100 / n) + '%'; s.style.maxWidth = (100 / n) + '%'; });
      index = Math.min(index, Math.max(0, slides.length - n));
      go(index, true);
    }
    function go(i, instant) {
      var n = perView();
      var max = Math.max(0, slides.length - n);
      index = i > max ? 0 : (i < 0 ? max : i);
      if (instant) { track.style.transition = 'none'; requestAnimationFrame(function () { track.style.transition = 'transform ' + speed + 'ms ease'; }); }
      track.style.transform = 'translateX(' + (-index * 100 / n) + '%)';
      slides.forEach(function (s, k) { var on = k >= index && k < index + n; s.classList.toggle('slick-active', on); s.setAttribute('aria-hidden', String(!on)); });
    }
    function tick() { if (!(pause && hovering)) go(index + 1); }
    if (autoplay) timer = setInterval(tick, delay);
    wrapper.addEventListener('mouseenter', function () { hovering = true; });
    wrapper.addEventListener('mouseleave', function () { hovering = false; });
    // swipe
    var x0 = null;
    list.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    list.addEventListener('touchend', function (e) {
      if (x0 == null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    });
    window.addEventListener('resize', layout);
    layout();
    wrapper.__slick = { go: go, stop: function () { clearInterval(timer); } };
  }

  /* ------------------------------------------------ loop carousel (swiper) */
  var SWIPER_JS = 'https://cdn.jsdelivr.net/npm/swiper@8.4.7/swiper-bundle.min.js';
  var SWIPER_CSS = 'https://cdn.jsdelivr.net/npm/swiper@8.4.7/swiper-bundle.min.css';
  function initLoopCarousels(widgets) {
    if (!widgets.length) return;
    loadCss(SWIPER_CSS);
    loadScript(SWIPER_JS).then(function () {
      widgets.forEach(function (w) {
        var s = settings(w);
        var el = w.querySelector('.swiper');
        if (!el || el.swiper) return;
        var num = function (v, d) { var n = parseFloat(v); return isNaN(n) ? d : n; };
        var gap = s.image_spacing_custom && s.image_spacing_custom.size != null ? s.image_spacing_custom.size : 10;
        var opts = {
          slidesPerView: num(s.slides_to_show_mobile, 1),
          slidesPerGroup: num(s.slides_to_scroll_mobile, 1),
          spaceBetween: num(s.image_spacing_custom_mobile && s.image_spacing_custom_mobile.size, gap),
          speed: num(s.speed, 500),
          loop: s.infinite === 'yes',
          breakpoints: {
            768: { slidesPerView: num(s.slides_to_show_tablet, 2), slidesPerGroup: num(s.slides_to_scroll_tablet, 1), spaceBetween: num(s.image_spacing_custom_tablet && s.image_spacing_custom_tablet.size, gap) },
            1025: { slidesPerView: num(s.slides_to_show, 3), slidesPerGroup: num(s.slides_to_scroll, 1), spaceBetween: gap },
          },
          navigation: { nextEl: w.querySelector('.elementor-swiper-button-next'), prevEl: w.querySelector('.elementor-swiper-button-prev') },
          pagination: w.querySelector('.swiper-pagination') ? { el: w.querySelector('.swiper-pagination'), clickable: true, type: s.pagination || 'bullets' } : undefined,
        };
        if (s.autoplay === 'yes') opts.autoplay = { delay: num(s.autoplay_speed, 5000), disableOnInteraction: false, pauseOnMouseEnter: s.pause_on_hover === 'yes' };
        new window.Swiper(el, opts);
      });
    }).catch(function () { /* offline: slides stay in their static row */ });
  }

  /* ---------------------------------------------------------------- tabs */
  function initSpTabs(root) {
    var links = $$('.sp-tab__nav-link', root);
    if (!links.length) return;
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var target = link.getAttribute('data-sptoggle') ? null : link.getAttribute('href');
        var id = link.getAttribute('aria-controls') || (target && target.replace('#', ''));
        links.forEach(function (l) { l.classList.remove('sp-tab__active'); l.setAttribute('aria-selected', 'false'); });
        link.classList.add('sp-tab__active'); link.setAttribute('aria-selected', 'true');
        $$('.sp-tab__tab-pane', root).forEach(function (p) {
          var on = p.id === id;
          p.classList.toggle('sp-tab__active', on);
          p.classList.toggle('sp-tab__show', on);
        });
      });
    });
  }

  /* --------------------------------------------------------------- table */
  function initTable(container) {
    var table = container.querySelector('table');
    if (!table || table.__init) return;
    table.__init = true;
    var heads = $$('thead th', table);
    var body = table.tBodies[0];
    if (!body || container.getAttribute('data-sort') !== 'true') return;
    heads.forEach(function (th, col) {
      th.style.cursor = 'pointer';
      var dir = 1;
      th.addEventListener('click', function () {
        var rows = Array.prototype.slice.call(body.rows);
        rows.sort(function (a, b) {
          var x = (a.cells[col] || {}).textContent || '', y = (b.cells[col] || {}).textContent || '';
          return x.trim().localeCompare(y.trim(), undefined, { numeric: true }) * dir;
        });
        dir = -dir;
        rows.forEach(function (r) { body.appendChild(r); });
      });
    });
  }

  function init() {
    $$('.elementor-widget-video').forEach(initVideo);
    $$('.elementor-widget-nav-menu').forEach(initNavMenu);
    $$('.exad-testimonial-carousel-wrapper, .exad-carousel-item').forEach(function (w) { if (!w.__slick && !w.classList.contains('slick-initialized')) initSlick(w); });
    initLoopCarousels($$('.elementor-widget-loop-carousel'));
    $$('.sp-tab__lay-default, [id^="sp-wp-tabs-wrapper_"]').forEach(initSpTabs);
    $$('.exad-table-container').forEach(initTable);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

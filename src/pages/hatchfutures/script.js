(function () {
  var root = document.getElementById('hf');
  if (!root || root.dataset.hfInit) return;
  root.dataset.hfInit = '1';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Hero video */
  var v = root.querySelector('.hf-hero-video');
  if (v) {
    v.muted = true;
    var show = function () { v.classList.add('hf-ready'); };
    if (v.readyState >= 2) show(); else v.addEventListener('loadeddata', show, { once: true });
    var p = v.play(); if (p && p.catch) p.catch(function () { show(); });
  }

  /* Stagger index per group */
  root.querySelectorAll('[data-rev-group]').forEach(function (group) {
    var i = 0;
    group.querySelectorAll('[data-rev]').forEach(function (el) {
      el.style.setProperty('--d', i++);
    });
  });

  /* Scroll reveal */
  var revEls = root.querySelectorAll('[data-rev]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('hf-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revEls.forEach(function (el) { io.observe(el); });
  } else {
    revEls.forEach(function (el) { el.classList.add('hf-in'); });
  }

  /* Count-up on the stat */
  var stat = root.querySelector('[data-count]');
  if (stat && 'IntersectionObserver' in window && !reduce) {
    var target = parseInt(stat.getAttribute('data-count'), 10) || 0;
    var fmt = function (n) { return n >= 1000 ? '1K' : String(n); };
    stat.textContent = '0';
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        sio.unobserve(e.target);
        var t0 = null, dur = 1400;
        var tick = function (ts) {
          if (t0 === null) t0 = ts;
          var k = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - k, 3);
          stat.textContent = fmt(Math.round(target * eased));
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    sio.observe(stat);
  }

  /* Hero parallax + scroll-cue fade */
  var hero = root.querySelector('.hf-hero');
  if (hero && !reduce) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var r = hero.getBoundingClientRect();
        var y = Math.max(0, -r.top);
        if (r.bottom > 0) {
          if (v) v.style.transform = 'translate3d(0,' + (y * 0.22).toFixed(1) + 'px,0)';
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Gallery lightbox */
  var lb = document.getElementById('hf-lb');
  var tiles = root.querySelectorAll('.hf-tile');
  if (lb && tiles.length) {
    if (lb.parentNode !== document.body) document.body.appendChild(lb);
    var TOTAL = 35, BASE = '/assets/wp-content/uploads/2026/08/hatchfutures-';
    var lbImg = lb.querySelector('.hf-lb-img');
    var lbCur = lb.querySelector('.hf-lb-cur');
    var thumbWrap = lb.querySelector('.hf-lb-thumbs');
    var cur = 1, lastFocus = null, built = false;

    var buildThumbs = function () {
      if (built) return; built = true;
      var frag = document.createDocumentFragment();
      for (var n = 1; n <= TOTAL; n++) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'hf-lb-thumb'; b.setAttribute('data-i', n);
        b.setAttribute('aria-label', 'Foto ' + n);
        var im = document.createElement('img');
        im.src = BASE + n + '.jpg'; im.alt = ''; im.loading = 'lazy'; im.decoding = 'async';
        b.appendChild(im); frag.appendChild(b);
      }
      thumbWrap.appendChild(frag);
      thumbWrap.addEventListener('click', function (e) {
        var t = e.target.closest('.hf-lb-thumb');
        if (t) go(parseInt(t.getAttribute('data-i'), 10));
      });
    };

    var preload = function (n) {
      if (n < 1 || n > TOTAL) return;
      var i = new Image(); i.src = BASE + n + '.jpg';
    };

    var go = function (n) {
      cur = ((n - 1 + TOTAL) % TOTAL) + 1;
      lbImg.classList.remove('hf-lb-in');
      var next = new Image();
      next.onload = function () {
        lbImg.src = next.src;
        lbImg.alt = 'HatchFutures — foto ' + cur;
        requestAnimationFrame(function () { lbImg.classList.add('hf-lb-in'); });
      };
      next.src = BASE + cur + '.jpg';
      if (next.complete) next.onload();
      lbCur.textContent = (cur < 10 ? '0' : '') + cur;
      var active = thumbWrap.querySelector('.hf-lb-active');
      if (active) active.classList.remove('hf-lb-active');
      var t = thumbWrap.querySelector('.hf-lb-thumb[data-i="' + cur + '"]');
      if (t) {
        t.classList.add('hf-lb-active');
        var tr = t.getBoundingClientRect(), wr = thumbWrap.getBoundingClientRect();
        thumbWrap.scrollBy({ left: tr.left - wr.left - wr.width / 2 + tr.width / 2, behavior: reduce ? 'auto' : 'smooth' });
      }
      preload(cur + 1); preload(cur - 1);
    };

    var open = function (n) {
      lastFocus = document.activeElement;
      buildThumbs();
      lb.classList.add('hf-lb-open');
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () { lb.classList.add('hf-lb-vis'); });
      go(n);
      lb.querySelector('.hf-lb-close').focus();
    };
    var close = function () {
      lb.classList.remove('hf-lb-vis');
      document.body.style.overflow = '';
      setTimeout(function () { lb.classList.remove('hf-lb-open'); }, 300);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    tiles.forEach(function (t) {
      t.addEventListener('click', function () { open(parseInt(t.getAttribute('data-i'), 10)); });
    });
    lb.querySelector('.hf-lb-close').addEventListener('click', close);
    lb.querySelector('.hf-lb-prev').addEventListener('click', function () { go(cur - 1); });
    lb.querySelector('.hf-lb-next').addEventListener('click', function () { go(cur + 1); });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('hf-lb-stage')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('hf-lb-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(cur + 1);
      else if (e.key === 'ArrowLeft') go(cur - 1);
    });
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 45) go(dx < 0 ? cur + 1 : cur - 1);
      sx = null;
    }, { passive: true });
  }

  /* Quote — word-by-word reveal */
  var quote = root.querySelector('[data-rev-words]');
  if (quote) {
    var nodes = Array.prototype.slice.call(quote.childNodes), out = [], idx = 0;
    var wrap = function (word, cls) {
      var s = document.createElement('span');
      s.className = 'hf-q-w' + (cls ? ' ' + cls : '');
      s.style.setProperty('--d', idx++);
      s.textContent = word;
      return s;
    };
    nodes.forEach(function (node) {
      var isEl = node.nodeType === 1;
      var text = (isEl ? node.textContent : node.nodeValue) || '';
      var cls = isEl ? node.className : '';
      text.split(/\s+/).forEach(function (w) {
        if (!w) return;
        out.push(wrap(w, cls));
        out.push(document.createTextNode(' '));
      });
    });
    quote.textContent = '';
    out.forEach(function (n) { quote.appendChild(n); });
    if ('IntersectionObserver' in window && !reduce) {
      var qio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('hf-in'); qio.unobserve(e.target); }
        });
      }, { threshold: 0.35 });
      qio.observe(quote);
    } else {
      quote.classList.add('hf-in');
    }
  }

  /* Smooth in-page anchors */
  root.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      ev.preventDefault();
      window.scrollTo({
        top: t.getBoundingClientRect().top + window.pageYOffset - 80,
        behavior: reduce ? 'auto' : 'smooth'
      });
    });
  });
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":32190,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

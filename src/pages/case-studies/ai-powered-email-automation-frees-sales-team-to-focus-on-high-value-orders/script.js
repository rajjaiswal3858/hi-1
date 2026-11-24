/* =====================================================================
   HATCHWORKS AI CASE STUDY  |  shared behaviour (vanilla JS, no deps)
   Root: #hw-cs-email-automation   Handles: contents nav + progress, tabs, before/after,
   counters, bars, reveals. Respects prefers-reduced-motion.
   ===================================================================== */
(function () {
  function init() {
    var root = document.getElementById('hw-cs-email-automation');
    if (!root || root.dataset.hwWired) return;
    root.dataset.hwWired = '1';

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var animate = !reduce;
    var $ = function (s) { return root.querySelector(s); };
    var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };

    /* ---- generic tab groups: [data-tabs] > [role=tab][data-tab] + [data-panel] ---- */
    $$('[data-tabs]').forEach(function (group) {
      var tabs = Array.prototype.slice.call(group.querySelectorAll('[data-tab]'));
      var panels = Array.prototype.slice.call(group.querySelectorAll('[data-panel]'));
      function select(btn, focus) {
        var key = btn.getAttribute('data-tab');
        tabs.forEach(function (b) {
          var on = b === btn;
          b.setAttribute('aria-selected', on ? 'true' : 'false');
          b.setAttribute('tabindex', on ? '0' : '-1');
        });
        panels.forEach(function (p) {
          var on = p.getAttribute('data-panel') === key;
          p.hidden = !on;
          if (on && animate) { p.classList.remove('is-anim'); void p.offsetWidth; p.classList.add('is-anim'); }
        });
        if (focus) btn.focus();
      }
      tabs.forEach(function (btn, i) {
        btn.addEventListener('click', function () { select(btn, false); });
        btn.addEventListener('keydown', function (ev) {
          var n = null;
          if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') n = (i + 1) % tabs.length;
          if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
          if (ev.key === 'Home') n = 0;
          if (ev.key === 'End') n = tabs.length - 1;
          if (n !== null) { ev.preventDefault(); select(tabs[n], true); }
        });
      });
    });

    /* ---- contents nav + reading progress ---- */
    var sections = $$('[data-section]');
    var navLinks = $$('[data-nav]');
    var fill = $('[data-progress-fill]');
    var track = $('[data-progress-track]');
    var article = $('[data-article]');
    var ticking = false;
    function paint() {
      var vh = window.innerHeight || 800;
      if (article && fill && track) {
        var r = article.getBoundingClientRect();
        var total = r.height - vh * 0.5;
        var p = total > 0 ? (vh * 0.5 - r.top) / total : 0;
        p = Math.max(0, Math.min(1, p));
        fill.style.height = (p * track.offsetHeight).toFixed(1) + 'px';
      }
      var current = sections.length ? sections[0].id : null;
      sections.forEach(function (s) { if (s.getBoundingClientRect().top <= vh * 0.34) current = s.id; });
      navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-nav') === current); });
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; paint(); });
    }
    if (navLinks.length) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      paint();
    }

    /* ---- counters: <span data-count="16.7" data-decimals="1">16.7</span>
           Final value is rendered in markup for screen readers; animation is visual only. ---- */
    function fmt(v, dec) {
      return v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    }
    function countUp(el) {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
      if (!animate) { el.textContent = fmt(target, dec); return; }
      var dur = 1000, start = null;
      el.textContent = fmt(0, dec);
      function tick(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * e, dec);
        if (p < 1) requestAnimationFrame(tick); else el.textContent = fmt(target, dec);
      }
      requestAnimationFrame(tick);
    }

    /* ---- bars: [data-bars] container, [data-bar="68.8"] fills ---- */
    function drawBars(scope) {
      Array.prototype.slice.call((scope || root).querySelectorAll('[data-bar]')).forEach(function (b, i) {
        if (b.dataset.done) return;
        b.dataset.done = '1';
        var pct = b.getAttribute('data-bar') + '%';
        if (!animate) { b.style.width = pct; return; }
        b.style.transition = 'width .9s cubic-bezier(.2,.8,.2,1)';
        b.style.transitionDelay = (i * 70) + 'ms';
        requestAnimationFrame(function () { b.style.width = pct; });
      });
    }

    /* ---- donuts: [data-donut="47"] on the fill circle (r=70, circumference 439.8) ---- */
    function drawDonuts(scope) {
      Array.prototype.slice.call((scope || root).querySelectorAll('[data-donut]')).forEach(function (c) {
        if (c.dataset.done) return;
        c.dataset.done = '1';
        var pct = parseFloat(c.getAttribute('data-donut')) || 0;
        var off = 439.8 * (1 - pct / 100);
        if (!animate) { c.style.transition = 'none'; }
        requestAnimationFrame(function () { c.style.strokeDashoffset = String(off); });
      });
    }

    /* ---- reveal + stagger ---- */
    var reveals = $$('.hw-reveal, .hw-stagger');
    function runStagger(g) {
      Array.prototype.slice.call(g.children).forEach(function (c, i) { c.style.transitionDelay = (animate ? i * 60 : 0) + 'ms'; });
      g.classList.add('is-in');
    }
    var ioLive = false;
    function finalize() {
      reveals.forEach(function (el) { el.classList.contains('hw-stagger') ? runStagger(el) : el.classList.add('is-in'); });
      $$('[data-count]').forEach(function (el) { if (!el.dataset.done) { el.dataset.done = '1'; el.textContent = fmt(parseFloat(el.getAttribute('data-count')) || 0, parseInt(el.getAttribute('data-decimals') || '0', 10)); } });
      $$('[data-bar]').forEach(function (b) { b.dataset.done = '1'; b.style.width = b.getAttribute('data-bar') + '%'; });
      drawDonuts(root);
      if (navLinks.length) paint();
    }

    /* ---------- 6. Ambient video: autoplay muted loop, only while on screen ---------- */
    var vids = $$('video[data-ambient]');
    if (vids.length) {
      vids.forEach(function (v) {
        v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', '');
        if (reduce) { v.removeAttribute('autoplay'); v.controls = true; }   /* reduced motion: poster + controls, no autoplay */
      });
      var tryPlay = function (v) { if (reduce) return; var p = v.play(); if (p && p.catch) p.catch(function () { v.controls = true; }); };
      if ('IntersectionObserver' in window) {
        var vio = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting) tryPlay(e.target); else if (!e.target.paused) e.target.pause(); });
        }, { threshold: 0.25 });
        vids.forEach(function (v) { vio.observe(v); });
      } else {
        vids.forEach(tryPlay);
      }
    }
    if (!animate) { finalize(); return; }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          ioLive = true;
          var t = e.target;
          if (t.classList.contains('hw-stagger')) runStagger(t); else t.classList.add('is-in');
          Array.prototype.slice.call(t.querySelectorAll('[data-count]')).forEach(countUp);
          if (t.hasAttribute('data-count')) countUp(t);
          if (t.hasAttribute('data-bars') || t.querySelector('[data-bar]')) drawBars(t);
          if (t.querySelector('[data-donut]')) drawDonuts(t);
          io.unobserve(t);
        });
      }, { threshold: 0.18 });
      reveals.forEach(function (el) { io.observe(el); });
      /* counters and bars outside a reveal wrapper */
      $$('[data-count]').forEach(function (el) { if (!el.closest('.hw-reveal, .hw-stagger')) io.observe(el); });
      $$('[data-bars]').forEach(function (el) { if (!el.closest('.hw-reveal, .hw-stagger')) io.observe(el); });
    } else {
      finalize();
    }
    /* IO can fail to fire inside transformed/clipped Elementor containers: never let it be the only path to a visible state */
    setTimeout(function () { if (!ioLive) finalize(); }, 1200);

  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":34440,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

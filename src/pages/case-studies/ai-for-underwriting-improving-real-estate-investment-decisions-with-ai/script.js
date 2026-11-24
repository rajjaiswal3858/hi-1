(function () {
  function init() {

      const root = document.getElementById('gv-cs');
      if (!root || root.dataset.gvWired) return;
      root.dataset.gvWired = '1';

      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const animate = !reduce;
      const $ = (s) => root.querySelector(s);
      const $$ = (s) => Array.prototype.slice.call(root.querySelectorAll(s));
      const setS = (el, prop, val) => { if (el) el.style.setProperty(prop, val, 'important'); };

      /* ---- before / after ---- */
      const baTabs = $$('[data-ba-tab]');
      baTabs.forEach((btn) => {
        btn.addEventListener('click', () => {
          const key = btn.getAttribute('data-ba-tab');
          baTabs.forEach((b) => {
            const on = b === btn;
            b.setAttribute('aria-selected', on ? 'true' : 'false');
            setS(b, 'background', on ? '#151920' : 'transparent');
            setS(b, 'color', on ? '#ffffff' : '#566069');
          });
          $$('[data-ba-pane]').forEach((p) => {
            const on = p.getAttribute('data-ba-pane') === key;
            p.hidden = !on;
            if (on && animate) { p.style.animation = 'none'; void p.offsetWidth; p.style.animation = 'gvFade .3s cubic-bezier(0.2, 0.8, 0.2, 1)'; }
          });
        });
      });

      /* ---- section nav + reading progress ---- */
      const sections = $$('[data-section]');
      const navLinks = $$('[data-nav]');
      const fill = $('[data-progress-fill]');
      const track = $('[data-progress-track]');
      const article = $('[data-article]');
      let ticking = false;
      const paint = () => {
        const vh = window.innerHeight || 800;
        if (article && fill && track) {
          const r = article.getBoundingClientRect();
          const total = r.height - vh * 0.5;
          let p = total > 0 ? (vh * 0.5 - r.top) / total : 0;
          p = Math.max(0, Math.min(1, p));
          fill.style.height = (p * track.offsetHeight).toFixed(1) + 'px';
        }
        let current = sections.length ? sections[0].id : null;
        sections.forEach((s) => { if (s.getBoundingClientRect().top <= vh * 0.34) current = s.id; });
        navLinks.forEach((a) => {
          const on = a.getAttribute('data-nav') === current;
          setS(a, 'color', on ? '#151920' : '#6f7883');
          setS(a, 'font-weight', on ? '700' : '400');
          setS(a.querySelector('[data-nav-ic]'), 'color', on ? '#1f7f7e' : '#c2c9cf');
        });
      };
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { ticking = false; paint(); });
      };
      navLinks.forEach((a) => {
        a.addEventListener('mouseenter', () => { if (a.style.fontWeight !== '700') setS(a, 'color', '#151920'); });
        a.addEventListener('mouseleave', () => { if (a.style.fontWeight !== '700') setS(a, 'color', '#6f7883'); });
      });
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      paint();

      /* ---- counters, bars, reveals ---- */
      const countUp = (el) => {
        if (el.dataset.done) return;
        el.dataset.done = '1';
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const fmt = (v) => v.toLocaleString('en-US');
        if (!animate) { el.textContent = fmt(target); return; }
        const dur = 1000;
        let start = null;
        const tick = (ts) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          el.textContent = fmt(Math.round((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        el.textContent = fmt(0);
        requestAnimationFrame(tick);
      };

      const drawBars = () => {
        $$('[data-bar]').forEach((b, i) => {
          const pct = b.getAttribute('data-bar') + '%';
          if (!animate) { b.style.width = pct; return; }
          b.style.transition = 'width .9s cubic-bezier(0.2, 0.8, 0.2, 1)';
          b.style.transitionDelay = (i * 70) + 'ms';
          requestAnimationFrame(() => { b.style.width = pct; });
        });
      };

      let ioLive = false;
      const finalize = () => {
        $$('[data-reveal]').forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
        $$('[data-count]').forEach((el) => { if (!el.dataset.done) { el.dataset.done = '1'; el.textContent = (parseInt(el.getAttribute('data-count'), 10) || 0).toLocaleString('en-US'); } });
        $$('[data-bar]').forEach((b) => { b.style.width = b.getAttribute('data-bar') + '%'; });
        paint();
      };

      const reveals = $$('[data-reveal]');
      if (animate) {
        reveals.forEach((el) => {
          if (el.getBoundingClientRect().top > (window.innerHeight || 800) * 0.9) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(12px)';
            el.style.transition = 'opacity .5s cubic-bezier(0.2, 0.8, 0.2, 1), transform .5s cubic-bezier(0.2, 0.8, 0.2, 1)';
          }
        });
      } else {
        drawBars();
      }

      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            ioLive = true;
            const t = e.target;
            t.style.opacity = '1';
            t.style.transform = 'none';
            if (t.hasAttribute('data-count')) countUp(t);
            if (t.hasAttribute('data-bars')) drawBars();
            io.unobserve(t);
          });
        }, { threshold: 0.18 });
        reveals.forEach((el) => io.observe(el));
        $$('[data-count]').forEach((el) => io.observe(el));
        const bars = $('[data-bars]');
        if (bars) io.observe(bars);
      } else {
        finalize();
      }

      /* IO is not guaranteed to fire in every embedding context (clipped or
         transformed containers, cross-document viewports). Never let it be the
         only path to a visible final state. */
      setTimeout(() => { if (!ioLive) finalize(); }, 1200);
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":36216,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

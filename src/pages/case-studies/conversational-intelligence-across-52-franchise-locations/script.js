(function () {
  function init() {

      const root = document.getElementById('k9-cs');
      if (!root || root.dataset.k9Wired) return;
      root.dataset.k9Wired = '1';

      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const animate = !reduce;
      const $ = (s) => root.querySelector(s);
      const setS = (el, prop, val) => { if (el) el.style.setProperty(prop, val, 'important'); };
      const $$ = (s) => Array.prototype.slice.call(root.querySelectorAll(s));

      /* ---- tabs ---- */
      const tabs = $$('[data-tab]');
      tabs.forEach((btn) => {
        btn.addEventListener('click', () => {
          const key = btn.getAttribute('data-tab');
          tabs.forEach((b) => {
            const on = b === btn;
            b.setAttribute('aria-selected', on ? 'true' : 'false');
            setS(b, 'background', on ? '#151920' : '#ffffff');
            setS(b, 'color', on ? '#ffffff' : '#566069');
            setS(b, 'border-color', on ? '#151920' : '#d6dbe0');
          });
          $$('[data-panel]').forEach((p) => {
            const on = p.getAttribute('data-panel') === key;
            p.hidden = !on;
            if (on && animate) { p.style.animation = 'none'; void p.offsetWidth; p.style.animation = 'k9Fade .32s cubic-bezier(0.2, 0.8, 0.2, 1)'; }
          });
        });
      });


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
            if (on && animate) { p.style.animation = 'none'; void p.offsetWidth; p.style.animation = 'k9Fade .3s cubic-bezier(0.2, 0.8, 0.2, 1)'; }
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

      /* ---- counters, reveals, donut, dot grid ---- */
      const countUp = (el) => {
        if (el.dataset.done) return;
        el.dataset.done = '1';
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        if (!animate) { el.textContent = String(target); return; }
        const dur = 1000;
        let start = null;
        const tick = (ts) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          el.textContent = String(Math.round((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        el.textContent = '0';
        requestAnimationFrame(tick);
      };

      const drawDonut = () => {
        const c = $('[data-donut]');
        if (c) c.style.strokeDashoffset = String(439.8 * (1 - 0.61));
      };
      if (!animate) drawDonut();

      let ioLive = false;
      const finalize = () => {
        $$('[data-reveal]').forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
        $$('[data-count]').forEach((el) => { if (!el.dataset.done) { el.dataset.done = '1'; el.textContent = el.getAttribute('data-count'); } });
        $$('[data-dot]').forEach((d) => { d.style.opacity = '1'; });
        drawDonut();
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
        $$('[data-dot]').forEach((d) => { d.style.opacity = '0'; d.style.transition = 'opacity .35s ease'; });
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
            if (t.hasAttribute('data-donut-wrap')) drawDonut();
            if (t.hasAttribute('data-dots')) {
              Array.prototype.slice.call(t.querySelectorAll('[data-dot]')).forEach((d, i) => {
                setTimeout(() => { d.style.opacity = '1'; }, animate ? i * 16 : 0);
              });
            }
            io.unobserve(t);
          });
        }, { threshold: 0.18 });
        reveals.forEach((el) => io.observe(el));
        $$('[data-count]').forEach((el) => io.observe(el));
        const wrap = $('[data-donut-wrap]');
        if (wrap) io.observe(wrap);
        const dots = $('[data-dots]');
        if (dots) io.observe(dots);
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
window._googlesitekit.contentEvents = {"postID":36194,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

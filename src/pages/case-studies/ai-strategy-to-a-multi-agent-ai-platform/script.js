(function () {
  function init() {
  const root = document.getElementById('cre-cs');
  if (!root || root.dataset.creWired) return;
  root.dataset.creWired = '1';

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animate = !reduce;
  const $ = (s) => root.querySelector(s);
  const $$ = (s) => Array.prototype.slice.call(root.querySelectorAll(s));
  const setS = (el, prop, val) => { if (el) el.style.setProperty(prop, val, 'important'); };

  /* section nav + reading progress */
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
      setS(a, 'color', on ? '#151920' : '#5B6170');
      setS(a, 'font-weight', on ? '700' : '400');
    });
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; paint(); });
  };
  navLinks.forEach((a) => {
    a.addEventListener('mouseenter', () => { if (a.style.fontWeight !== '700') setS(a, 'color', '#151920'); });
    a.addEventListener('mouseleave', () => { if (a.style.fontWeight !== '700') setS(a, 'color', '#5B6170'); });
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  paint();

  /* counters */
  const countUp = (el) => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (!animate) { el.textContent = target.toLocaleString('en-US'); return; }
    const dur = 320;
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = '0';
    requestAnimationFrame(tick);
  };

  const drawBars = () => {
    $$('[data-bar]').forEach((b, i) => {
      const pct = b.getAttribute('data-bar') + '%';
      if (!animate) { b.style.width = pct; return; }
      b.style.transition = 'width .32s cubic-bezier(.2,.8,.2,1)';
      b.style.transitionDelay = (i * 60) + 'ms';
      requestAnimationFrame(() => { b.style.width = pct; });
    });
  };

  /* staggered card entry */
  const staggerGroups = $$('[data-stagger]');
  if (animate) {
    staggerGroups.forEach((g) => {
      if (g.getBoundingClientRect().top > (window.innerHeight || 800) * 0.9) {
        Array.prototype.slice.call(g.children).forEach((c) => {
          c.style.opacity = '0';
          c.style.transform = 'translateY(6px)';
          c.style.transition = 'opacity .2s cubic-bezier(.2,.8,.2,1), transform .2s cubic-bezier(.2,.8,.2,1)';
        });
      }
    });
  }
  const runStagger = (g) => {
    Array.prototype.slice.call(g.children).forEach((c, i) => {
      c.style.transitionDelay = (i * 60) + 'ms';
      c.style.opacity = '1';
      c.style.transform = 'none';
    });
  };

  let ioLive = false;
  const finalize = () => {
    staggerGroups.forEach(runStagger);
    $$('[data-count]').forEach((el) => { if (!el.dataset.done) { el.dataset.done = '1'; el.textContent = (parseInt(el.getAttribute('data-count'), 10) || 0).toLocaleString('en-US'); } });
    $$('[data-bar]').forEach((b) => { b.style.width = b.getAttribute('data-bar') + '%'; });
    paint();
  };

  if (!animate) { drawBars(); }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        ioLive = true;
        const t = e.target;
        if (t.hasAttribute('data-stagger')) runStagger(t);
        if (t.hasAttribute('data-count')) countUp(t);
        if (t.hasAttribute('data-bars')) drawBars();
        io.unobserve(t);
      });
    }, { threshold: 0.18 });
    staggerGroups.forEach((el) => io.observe(el));
    $$('[data-count]').forEach((el) => io.observe(el));
    const bars = $('[data-bars]');
    if (bars) io.observe(bars);
  } else {
    finalize();
  }

  setTimeout(() => { if (!ioLive) finalize(); }, 500);
  
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":36512,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

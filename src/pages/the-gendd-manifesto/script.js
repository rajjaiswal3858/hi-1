(function () {
  var root = document.getElementById('gendd-root');
  if (!root) return;
  var CFG = { aurora: true, highlights: true, motion: 'full' };
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var animate = CFG.motion !== 'off' && !reduced;

  (function draw(n) {
    if (window.lucide && window.lucide.createIcons) { window.lucide.createIcons(); return; }
    if ((n || 0) < 40) setTimeout(function () { draw((n || 0) + 1); }, 100);
  })(0);

  if (!CFG.highlights) [].forEach.call(root.querySelectorAll('[data-hl]'), function (el) {
    el.style.background = 'none'; el.style.color = '#c9ccd3';
  });
  var aur = root.querySelector('[data-aurora]');
  if (aur && !CFG.aurora) aur.style.display = 'none';
  else if (aur && !animate) [].forEach.call(aur.querySelectorAll('div'), function (d) { d.style.animation = 'none'; });

  var fill = root.querySelector('[data-progress]');
  var shift = root.querySelector('[data-aurora-shift]');
  var raf = null;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = null;
      var r = root.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      if (fill) fill.style.width = (p * 100).toFixed(2) + '%';
      if (shift && animate) shift.style.filter = 'hue-rotate(' + (24 - 56 * p).toFixed(1) + 'deg) saturate(' + (1 + 0.2 * Math.sin(Math.PI * p)).toFixed(2) + ')';
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (animate && 'IntersectionObserver' in window) {
    var items = [].slice.call(root.querySelectorAll('[data-row], [data-item]'));
    items.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(6px)';
      el.style.transition = 'opacity 320ms cubic-bezier(0.2,0.8,0.2,1), transform 320ms cubic-bezier(0.2,0.8,0.2,1)';
    });
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":36234,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

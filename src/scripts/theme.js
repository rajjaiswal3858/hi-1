// Obsidian / acid-lime theme: smooth fade-ins for page sections as they scroll into view.
// Only opacity and transform are animated, so layout is never affected. Content stays visible
// if this script does not run, and motion is skipped for users who prefer reduced motion.
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Top-level sections of the page body (not header / footer templates), plus the
  // direct children of each section so grids and columns cascade in.
  var roots = document.querySelectorAll('[data-elementor-type="wp-page"], [data-elementor-type="single-page"], [data-elementor-type="single-post"], [data-elementor-type="archive"]');
  var targets = [];
  roots.forEach(function (root) {
    if (root.closest('header, footer, .elementor-location-header, .elementor-location-footer')) return;
    Array.prototype.forEach.call(root.children, function (section) {
      if (!section.matches('.e-con, .elementor-section, .elementor-element')) return;
      // Sections containing sticky/fixed children would lose their positioning context while
      // transformed, so animate their children instead.
      var inner = section.querySelector(':scope > .e-con-inner') || section;
      var kids = Array.prototype.filter.call(inner.children, function (el) { return el.offsetHeight > 0; });
      if (kids.length > 1 && kids.length <= 12) {
        kids.forEach(function (el, i) { el.style.setProperty('--ob-delay', Math.min(i, 6) * 0.07 + 's'); targets.push(el); });
      } else {
        targets.push(section);
      }
    });
  });
  if (!targets.length) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('ob-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  targets.forEach(function (el) {
    if (getComputedStyle(el).position === 'fixed' || getComputedStyle(el).position === 'sticky') return;
    el.classList.add('ob-reveal');
    io.observe(el);
  });
  // Safety net: never leave anything hidden (e.g. when printing or jumping to an anchor).
  window.addEventListener('beforeprint', function () { targets.forEach(function (el) { el.classList.add('ob-in'); }); });
  setTimeout(function () {
    targets.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0) el.classList.add('ob-in');
    });
  }, 1500);
})();

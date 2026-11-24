(function () {
  if (window.__hwAnnInit) return;            /* run once even if Elementor duplicates the widget */
  window.__hwAnnInit = true;

  var KEY = 'hwAnn:airoi-2026';              /* change this key for the next campaign so it shows again */
  var root = document.documentElement;
  var inEditor = document.body && /elementor-editor-active|elementor-editor-preview/.test(document.body.className);
  var last = null, ticking = false;

  function banners() { return document.querySelectorAll('[data-hwann]'); }
  function liveBanner() {
    var b = banners();
    for (var i = 0; i < b.length; i++) if (b[i].offsetHeight) return b[i];
    return null;
  }
  function adminOffset() {
    var a = document.getElementById('wpadminbar');
    if (!a) return 0;
    return getComputedStyle(a).position === 'fixed' ? a.offsetHeight : Math.max(0, a.getBoundingClientRect().bottom);
  }
  function sync() {
    ticking = false;
    var b = liveBanner();
    if (!b) { root.classList.remove('hwann-on'); last = null; return; }
    /* set the variable on the header only (small subtree), fall back to <html> */
    var scope = b.closest('.elementor-location-header, header') || root;
    var top = Math.round(Math.max(adminOffset(), b.getBoundingClientRect().bottom, 0));
    if (top !== last) { scope.style.setProperty('--hwann-top', top + 'px'); last = top; }
    root.classList.add('hwann-on');
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(sync); } }
  function hide() {
    Array.prototype.forEach.call(banners(), function (n) { n.classList.add('is-ann-off'); });
    sync();
  }

  try { if (!inEditor && localStorage.getItem(KEY) === '1') hide(); } catch (e) {}
  sync();

  document.addEventListener('click', function (ev) {
    if (!ev.target.closest || !ev.target.closest('[data-hwann] [data-hw-ann-x]')) return;
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    hide();
  });
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  window.addEventListener('orientationchange', request);
  window.addEventListener('pageshow', function () { last = null; request(); });
  document.addEventListener('DOMContentLoaded', function () { last = null; sync(); });
  window.addEventListener('load', function () { last = null; sync(); });
})();

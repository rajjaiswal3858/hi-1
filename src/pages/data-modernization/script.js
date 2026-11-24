(function () {
  var host = document.getElementById('hw-data-modernization');
  if (!host) return;
  /* Declarative Shadow DOM fallback (when the HTML is injected via innerHTML, e.g. Elementor editor preview) */
  if (!host.shadowRoot) {
    var tmpl = host.querySelector('template[shadowrootmode]');
    if (tmpl && host.attachShadow) { var sr0 = host.attachShadow({ mode: 'open' }); sr0.appendChild(tmpl.content.cloneNode(true)); tmpl.parentNode.removeChild(tmpl); }
  }
  var sr = host.shadowRoot || host;
  var root = sr.getElementById ? sr.getElementById('dmx') : sr.querySelector('#dmx');
  if (!root) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var S = { pillar: 0, fixed: false, step: 0, hold: false, counted: false };
  function val(k) {
    if (k === 'fixed') return S.fixed;
    var n = parseInt(k.slice(1), 10);
    if (k[0] === 'p') return S.pillar === n;
    if (k[0] === 's') return S.step === n;
    return false;
  }
  function q(sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
  function setText(k, v) { q('[data-txt="' + k + '"]').forEach(function (el) { el.textContent = v; }); }
  function render() {
    q('[data-k]').forEach(function (el) {
      var v = val(el.getAttribute('data-k')) ? 'true' : 'false';
      if (el.hasAttribute('data-on')) el.setAttribute('data-on', v);
      if (el.hasAttribute('aria-selected')) el.setAttribute('aria-selected', v);
      if (el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed', v);
    });
    q('[data-fixed]').forEach(function (el) { el.setAttribute('data-fixed', S.fixed ? 'true' : 'false'); });
    q('.dmx-fig').forEach(function (el) { el.setAttribute('data-c', String(S.pillar)); });
    setText('fixedLabel', S.fixed ? 'Showing: modernized foundation' : 'Show what modernization changes');
  }
  var acts = {
    setP0: function () { S.pillar = 0; }, setP1: function () { S.pillar = 1; }, setP2: function () { S.pillar = 2; },
    setS0: function () { S.step = 0; }, setS1: function () { S.step = 1; }, setS2: function () { S.step = 2; }, setS3: function () { S.step = 3; },
    toggleFixed: function () { S.fixed = !S.fixed; },
    holdOn: function () { S.hold = true; }, holdOff: function () { S.hold = false; }
  };
  function bind(attr, ev) {
    q('[data-' + attr + ']').forEach(function (el) {
      el.addEventListener(ev, function () { var fn = acts[el.getAttribute('data-' + attr)]; if (fn) { fn(); render(); } });
    });
  }
  bind('click', 'click'); bind('enter', 'mouseenter'); bind('leave', 'mouseleave'); bind('focus', 'focus');
  root.addEventListener('keydown', function (e) { var t = e.target; if ((e.key === 'Enter' || e.key === ' ') && t && t.getAttribute && t.getAttribute('role') === 'button') { e.preventDefault(); t.click(); } });
  render();
  if (!reduce) setInterval(function () { if (!S.hold) { S.step = (S.step + 1) % 4; render(); } }, 3600);

  /* metrics count-up: numbers are server-rendered at their final value for SEO, then reset and animated on first view */
  var metrics = sr.getElementById ? sr.getElementById('dmx-metrics') : null;
  if (metrics && !reduce) {
    setText('m1', '0'); setText('m2', '0');
    var count = function () {
      if (S.counted) return; S.counted = true;
      window.removeEventListener('scroll', check, true); window.removeEventListener('resize', check);
      var t0 = Date.now(), d = 1400;
      var iv = setInterval(function () {
        var p = Math.min(1, (Date.now() - t0) / d), e = 1 - Math.pow(1 - p, 3);
        setText('m1', String(Math.round(52 * e))); setText('m2', String(Math.round(2 * e)));
        if (p >= 1) clearInterval(iv);
      }, 24);
      setTimeout(function () { clearInterval(iv); setText('m1', '52'); setText('m2', '2'); }, d + 100);
    };
    var check = function () { var r = metrics.getBoundingClientRect(); if (r.top < window.innerHeight * 0.9 && r.bottom > 0) count(); };
    window.addEventListener('scroll', check, { passive: true, capture: true });
    window.addEventListener('resize', check, { passive: true });
    check();
    setTimeout(count, 6000);
  }
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":36801,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

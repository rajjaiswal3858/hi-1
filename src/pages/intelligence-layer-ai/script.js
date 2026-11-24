(function () {
  var r = document.getElementById('ilx');
  if (!r || window.__ilxInit) return;
  window.__ilxInit = true;

  var css = r.style;
  var EASE = 'cubic-bezier(.2,.8,.2,1)';
  var STOPS = [0, .14, .3, .5, .7, .9];
  var AMPS = [1, .95, 1, .88, .95, .68];
  var reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  var reveals = Array.prototype.slice.call(r.querySelectorAll('[data-reveal]'));
  reveals.forEach(function (el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 680ms ' + EASE + ' ' + (i % 3) * 80 + 'ms, transform 680ms ' + EASE + ' ' + (i % 3) * 80 + 'ms';
  });
  function flush() {
    reveals.forEach(function (el) { el.style.opacity = '1'; el.style.transform = 'none'; });
    reveals = [];
  }
  if (reduced) flush();
  setTimeout(flush, 2600);

  var stage = null, stepEl = null, warned = false;

  function tick() {
    if (!stage || !stage.isConnected) stage = r.querySelector('[data-stage-wrap]');
    if (!stepEl || !stepEl.isConnected) stepEl = r.querySelector('[data-step]');
    var vh = window.innerHeight || 1;

    if (reveals.length) {
      var keep = [];
      for (var i = 0; i < reveals.length; i++) {
        var el = reveals[i];
        if (el.getBoundingClientRect().top < vh * .9) { el.style.opacity = '1'; el.style.transform = 'none'; }
        else keep.push(el);
      }
      reveals = keep;
    }

    var box = r.getBoundingClientRect();
    var span = box.height - vh;
    var p = span > 0 ? Math.min(1, Math.max(0, -box.top / span)) : 0;

    var t = 5;
    for (var s = 0; s < 5; s++) {
      if (p <= STOPS[s + 1]) { t = s + (p - STOPS[s]) / (STOPS[s + 1] - STOPS[s]); break; }
    }
    t = Math.max(0, Math.min(5, t));
    for (var a = 0; a < 6; a++) {
      css.setProperty('--ilx-t' + a, (AMPS[a] * Math.max(0, Math.min(1, 1 - Math.abs(t - a)))).toFixed(3));
    }
    var k = t / 5;
    var e = k * k * (3 - 2 * k);
    css.setProperty('--ilx-ty', (17 - 17 * e).toFixed(2) + 'vh');
    css.setProperty('--ilx-rx', (76 - 76 * e).toFixed(2) + 'deg');
    css.setProperty('--ilx-sc', (1.34 - .34 * e).toFixed(3));

    if (stage) {
      var sb = stage.getBoundingClientRect();
      var sSpan = sb.height - vh;
      var q = sSpan > 0 ? Math.min(1, Math.max(0, -sb.top / sSpan)) : 0;
      var idx = q * 5;
      for (var i2 = 0; i2 < 6; i2++) {
        var al = Math.max(0, Math.min(1, (idx - i2 + .62) * 1.7));
        var ea = al * al * (3 - 2 * al);
        css.setProperty('--l' + i2 + 'o', ea.toFixed(3));
        css.setProperty('--l' + i2 + 'z', ((i2 - 2.5) * 30 + (1 - ea) * 150).toFixed(1) + 'px');
        var dist = idx - i2;
        var xo = Math.max(0, Math.min(1, (.5 - Math.abs(dist)) / .15));
        css.setProperty('--x' + i2 + 'o', xo.toFixed(3));
        css.setProperty('--x' + i2 + 'y', ((1 - xo) * (dist > 0 ? -26 : 26)).toFixed(1) + 'px');
      }
      if (stepEl) {
        var step = '0' + Math.max(1, Math.min(6, Math.round(idx) + 1));
        if (stepEl.textContent !== step) stepEl.textContent = step;
      }
    }
  }

  function safe() { try { tick(); } catch (err) { if (!warned) { warned = true; console.warn('ILX', err); } } }

  var raf = 0, running = false, lastEvt = Date.now();
  function spin() {
    safe();
    if (document.hidden || Date.now() - lastEvt > 700) { running = false; return; }
    raf = requestAnimationFrame(spin);
  }
  function arm() { if (running) return; running = true; raf = requestAnimationFrame(spin); }
  function onEvt() { lastEvt = Date.now(); safe(); arm(); }
  arm();
  window.addEventListener('scroll', onEvt, { passive: true, capture: true });
  window.addEventListener('resize', onEvt, { passive: true });
  window.addEventListener('orientationchange', onEvt, { passive: true });
  window.addEventListener('load', onEvt);
  document.addEventListener('visibilitychange', onEvt);
  setInterval(function () { if (!document.hidden) safe(); }, 260);
  safe();

  var zs = [-125, -75, -25, 25, 75, 125];
  var cols = ['#8B5CF6', '#4C6BE0', '#2E86C8', '#3ABDBC', '#34D9A6', '#BFEFEF'];
  var fills = ['rgba(139,92,246,.18)', 'rgba(76,107,224,.18)', 'rgba(46,134,200,.18)', 'rgba(58,189,188,.18)', 'rgba(52,217,166,.16)', 'rgba(191,239,239,.13)'];
  var hi = 0, swap = 0;
  function paint() {
    for (var k = 0; k < 6; k++) {
      css.setProperty('--ilx-p' + k, k === hi ? '1' : '0');
      css.setProperty('--ilx-h' + k, k === hi ? '1' : '0');
    }
    css.setProperty('--ilx-hc', cols[hi]);
    css.setProperty('--ilx-hf', fills[hi]);
    css.setProperty('--ilx-htip', (-zs[hi] * .5).toFixed(1) + 'px');
    css.setProperty('--ilx-hto', '1');
  }
  if (r.querySelector('[data-htip]')) {
    paint();
    if (!reduced) {
      setInterval(function () {
        if (document.hidden) return;
        for (var k = 0; k < 6; k++) css.setProperty('--ilx-p' + k, '0');
        clearTimeout(swap);
        swap = setTimeout(function () { hi = (hi + 1) % 6; paint(); }, 520);
      }, 4200);
    }
  }
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":36593,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

(function () {
  var host = document.getElementById('hw-agentic-automation');
  if (!host) return;
  /* mount: declarative shadow DOM → attachShadow fallback → light DOM fallback (styles are #aax-scoped, so it still renders) */
  if (!host.shadowRoot) {
    var tmpl = host.querySelector('template');
    if (tmpl) {
      var frag = tmpl.content ? tmpl.content.cloneNode(true) : null;
      try { if (host.attachShadow) host.attachShadow({ mode: 'open' }).appendChild(frag); else throw 0; }
      catch (_) { if (frag) host.appendChild(frag); else host.innerHTML = tmpl.innerHTML; }
      if (tmpl.parentNode) tmpl.parentNode.removeChild(tmpl);
    }
  }
  var sr = host.shadowRoot || host;
  try {
  var root = sr.getElementById ? sr.getElementById('aax') : sr.querySelector('#aax');
  if (!root) return;
  if (!sr.getElementById) sr.getElementById = function (id) { return root.querySelector('#' + id); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var q = function (sel, el) { return Array.prototype.slice.call((el || root).querySelectorAll(sel)); };
  var byId = function (id) { return sr.getElementById ? sr.getElementById(id) : root.querySelector('#' + id); };
  var S = { hero: 0, heroHold: false, mode: 'old', userFlow: false, loop: 0, userLoop: false, hold: false, counted: false };

  function val(k) {
    if (k === 'old') return S.mode === 'old';
    if (k === 'ai') return S.mode === 'ai';
    var n = parseInt(k.slice(1), 10);
    if (k[0] === 'h') return S.hero === n;
    if (k[0] === 'l') return S.loop === n;
    return false;
  }
  function render() {
    q('[data-k]').forEach(function (el) {
      var v = val(el.getAttribute('data-k')) ? 'true' : 'false';
      el.setAttribute('data-on', v);
      if (el.hasAttribute('aria-selected')) el.setAttribute('aria-selected', v);
      if (el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed', v);
    });
    q('.step').forEach(function (el) { el.setAttribute('data-m', S.mode === 'ai' ? el.getAttribute('data-ai') : 'old'); });
    var loop = byId('aax-loop'); if (loop) loop.classList.toggle('held', S.hold || S.userLoop);
  }
  var holdT;
  var acts = {
    setOld: function () { S.userFlow = true; S.mode = 'old'; },
    setAi: function () { S.userFlow = true; S.mode = 'ai'; },
    holdOn: function () { S.hold = true; }, holdOff: function () { S.hold = false; }
  };
  for (var i = 0; i < 4; i++) (function (i) {
    acts['setH' + i] = function () { S.hero = i; S.heroHold = true; clearTimeout(holdT); holdT = setTimeout(function () { S.heroHold = false; }, 6000); };
    acts['setL' + i] = function () { S.loop = i; S.userLoop = true; };
  })(i);
  function bind(attr, ev) {
    q('[data-' + attr + ']').forEach(function (el) {
      el.addEventListener(ev, function () { var fn = acts[el.getAttribute('data-' + attr)]; if (fn) { fn(); render(); } });
    });
  }
  bind('click', 'click'); bind('enter', 'mouseenter'); bind('leave', 'mouseleave');
  q('[data-jump]').forEach(function (a) { a.addEventListener('click', function (e) { var t = byId(a.getAttribute('data-jump')); if (t) { e.preventDefault(); var y = t.getBoundingClientRect().top + window.pageYOffset - 24; window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' }); } }); });
  q('[role="tablist"]').forEach(function (tl) {
    tl.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      var tabs = q('[role="tab"]', tl), i = tabs.indexOf(sr.activeElement || document.activeElement); if (i < 0) return;
      e.preventDefault(); var n = tabs[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : tabs.length - 1)) % tabs.length]; n.focus(); n.click();
    });
  });
  render();

  /* reveal on scroll */
  var rvs = q('.rv');
  var showAll = function () { rvs.forEach(function (el) { el.classList.add('in'); }); };
  if (!reduce && 'IntersectionObserver' in window && 'requestAnimationFrame' in window) {
    root.classList.add('js-rv');
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    rvs.forEach(function (el) { io.observe(el); });
    setTimeout(showAll, 2500);
    window.addEventListener('beforeprint', showAll);
  }
  function once(el, fn, th) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var o = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { fn(); o.disconnect(); } }, { threshold: th || .35 });
    o.observe(el);
  }

  /* auto-cycles */
  if (!reduce) {
    setInterval(function () { if (!S.heroHold && !document.hidden) { S.hero = (S.hero + 1) % 4; render(); } }, 2600);
    once(byId('aax-flow'), function () { setTimeout(function () { if (!S.userFlow) { S.mode = 'ai'; render(); } }, 2200); });
    once(byId('aax-loop'), function () {
      setInterval(function () { if (!S.userLoop && !S.hold && !document.hidden) { S.loop = (S.loop + 1) % 4; render(); } }, 4200);
    });
  }

  /* metrics count-up: server-rendered final values, animated once on first view */
  var metrics = byId('aax-metrics');
  var setText = function (k, v) { q('[data-txt="' + k + '"]').forEach(function (el) { el.textContent = v; }); };
  if (metrics && !reduce) {
    var FIN = [47, 7, 70];
    setText('m0', '0'); setText('m1', '0'); setText('m2', '0');
    var count = function () {
      if (S.counted) return; S.counted = true;
      var t0 = Date.now(), d = 1500;
      var iv = setInterval(function () {
        var p = Math.min(1, (Date.now() - t0) / d), e = 1 - Math.pow(1 - p, 3);
        for (var j = 0; j < 3; j++) setText('m' + j, String(Math.round(FIN[j] * e)));
        if (p >= 1) clearInterval(iv);
      }, 24);
      setTimeout(function () { clearInterval(iv); for (var j = 0; j < 3; j++) setText('m' + j, String(FIN[j])); }, d + 100);
    };
    once(metrics, count, .3);
    setTimeout(count, 8000);
  }
  } catch (err) { root.classList.remove('js-rv'); if (window.console) console.warn('hw-agentic-automation', err); }
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":33491,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

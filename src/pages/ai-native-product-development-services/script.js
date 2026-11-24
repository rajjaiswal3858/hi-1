(function () {
  var host = document.getElementById('hw-ai-native-products');
  if (!host) return;
  if (!host.shadowRoot) {
    var tmpl = host.querySelector('template[shadowrootmode]');
    if (tmpl && host.attachShadow) { var sr0 = host.attachShadow({ mode: 'open' }); sr0.appendChild(tmpl.content.cloneNode(true)); tmpl.parentNode.removeChild(tmpl); }
  }
  var sr = host.shadowRoot || host;
  var root = sr.getElementById ? sr.getElementById('anp') : sr.querySelector('#anp');
  if (!root) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var q = function (sel, el) { return Array.prototype.slice.call((el || root).querySelectorAll(sel)); };
  var byId = function (id) { return sr.getElementById ? sr.getElementById(id) : root.querySelector('#' + id); };
  var S = { kind: 0, way: 0, hold: false };
  var mock = byId('anp-mock'), typed = byId('anp-typed'), typeT, holdT;

  function val(k) { var n = parseInt(k.slice(1), 10); return k[0] === 'k' ? S.kind === n : k[0] === 'w' ? S.way === n : false; }
  function render() {
    q('[data-k]').forEach(function (el) {
      var v = val(el.getAttribute('data-k')) ? 'true' : 'false';
      el.setAttribute('data-on', v);
      if (el.hasAttribute('aria-selected')) el.setAttribute('aria-selected', v);
    });
    if (mock) mock.classList.toggle('held', S.hold);
  }
  function typeIn() {
    clearInterval(typeT);
    var pan = q('.mpan')[S.kind], text = pan ? pan.getAttribute('data-q') || '' : '';
    q('.mpan').forEach(function (p) { p.classList.remove('done'); });
    if (mock) mock.classList.remove('done');
    if (!typed) return;
    if (reduce) { typed.textContent = text; if (pan) pan.classList.add('done'); if (mock) mock.classList.add('done'); return; }
    typed.textContent = '';
    var n = 0;
    typeT = setInterval(function () {
      n++; typed.textContent = text.slice(0, n);
      if (n >= text.length) { clearInterval(typeT); if (pan) pan.classList.add('done'); if (mock) mock.classList.add('done'); }
    }, 28);
  }
  function setKind(i) { if (S.kind === i) return; S.kind = i; render(); typeIn(); }
  var acts = {};
  for (var i = 0; i < 4; i++) (function (i) {
    acts['setK' + i] = function () { S.hold = true; clearTimeout(holdT); holdT = setTimeout(function () { S.hold = false; render(); }, 8000); setKind(i); };
    acts['setW' + i] = function () { S.way = i; };
  })(i);
  function bind(attr, ev) {
    q('[data-' + attr + ']').forEach(function (el) {
      el.addEventListener(ev, function () { var fn = acts[el.getAttribute('data-' + attr)]; if (fn) { fn(); render(); } });
    });
  }
  bind('click', 'click'); bind('enter', 'mouseenter');
  q('[data-jump]').forEach(function (a) { a.addEventListener('click', function (e) { var t = byId(a.getAttribute('data-jump')); if (t) { e.preventDefault(); var y = t.getBoundingClientRect().top + window.pageYOffset - 24; window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' }); } }); });
  render(); typeIn();
  if (!reduce) setInterval(function () { if (!S.hold) setKind((S.kind + 1) % 4); }, 5200);

  /* reveal on scroll */
  var rvs = q('.rv');
  if (reduce || !('IntersectionObserver' in window)) { root.classList.add('no-io'); }
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    rvs.forEach(function (el) { io.observe(el); });
    setTimeout(function () { rvs.forEach(function (el) { el.classList.add('in'); }); }, 4000);
  }
  var cs = byId('anp-case');
  if (cs) {
    if (reduce || !('IntersectionObserver' in window)) cs.classList.add('shown');
    else {
      var co = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { cs.classList.add('shown'); co.disconnect(); } }, { threshold: .3 });
      co.observe(cs);
      setTimeout(function () { cs.classList.add('shown'); }, 8000);
    }
  }
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":32797,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

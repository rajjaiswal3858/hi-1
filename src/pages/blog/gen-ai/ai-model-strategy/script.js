(function(){
  function tabs(root, sel, onSelect){
    var items = [].slice.call(root.querySelectorAll(sel));
    function pick(el, focus){
      items.forEach(function(t){ var on = t === el; t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1; });
      if (focus) el.focus();
      onSelect(el);
    }
    items.forEach(function(t, i){
      t.addEventListener('click', function(){ pick(t); });
      t.addEventListener('keydown', function(e){
        var k = e.key, n = null;
        if (k === 'Enter' || k === ' ') { e.preventDefault(); pick(t); return; }
        if (k === 'ArrowRight' || k === 'ArrowDown') n = items[(i + 1) % items.length];
        if (k === 'ArrowLeft' || k === 'ArrowUp') n = items[(i - 1 + items.length) % items.length];
        if (n) { e.preventDefault(); pick(n, true); }
      });
    });
    var start = items.filter(function(t){ return t.getAttribute('aria-selected') === 'true'; })[0] || items[0];
    if (start) onSelect(start);
  }

  /* Visual 1: levers */
  var v1 = document.getElementById('hwms-v1');
  if (v1) {
    var d1 = v1.querySelector('[data-detail]');
    var lev = [
      {t:'Routine usage starts on less expensive models. Employees can still choose a frontier model when the work requires it.'},
      {t:'An internal gateway sends work to different models based on difficulty, price, availability, and cache state.'},
      {t:'Reused context is not processed at full price on every turn. One implementation reportedly moved its cache hit rate:', m:[['Before',5],['After',60]]},
      {t:'Teams cut unnecessary files, tools, and stale conversation history before each request.'},
      {t:'Spend is visible without turning every token into an approval process. Share of employees who had not been reaching the old usage caps:', m:[['Employees',91]]}
    ];
    tabs(v1, '.hwms-lever', function(el){
      var l = lev[+el.getAttribute('data-i')], h = '<p>' + l.t + '</p>';
      (l.m || []).forEach(function(m, i){ h += '<div class="hwms-meter' + (l.m.length > 1 && i === 0 ? ' is-before' : '') + '"><span>' + m[0] + '</span><i><b data-w="' + m[1] + '"></b></i><span>' + m[1] + '%</span></div>'; });
      d1.innerHTML = h;
      requestAnimationFrame(function(){ [].forEach.call(d1.querySelectorAll('[data-w]'), function(b){ b.style.width = b.getAttribute('data-w') + '%'; }); });
    });
  }

  /* Visual 2: ladder */
  var v2 = document.getElementById('hwms-v2');
  if (v2) {
    var w = v2.querySelector('[data-when]'), tk = v2.querySelector('[data-takes]');
    var rungs = [
      ['You need a baseline fast, or the output needs shaping.', 'The least investment of the four. It is the fastest way to start.'],
      ['The task needs current or proprietary facts: policies, product data, account history, knowledge that changes.', 'A retrieval pipeline over trusted, current sources.'],
      ['A stable, high-volume task needs stronger domain performance, consistent formatting, or specialized terminology.', 'Labeled examples, training runs, and an evaluation set that can prove the improvement.'],
      ['Unusual capability, ownership, scale, or sovereignty requirements. Most enterprise applications will not need it.', 'Far more data, infrastructure, and ongoing ownership.']
    ];
    tabs(v2, '.hwms-rung', function(el){ var r = rungs[+el.getAttribute('data-i')]; w.textContent = r[0]; tk.textContent = r[1]; });
  }

  /* Visual 3: router */
  var v3 = document.getElementById('hwms-v3');
  if (v3) {
    var dests = [].slice.call(v3.querySelectorAll('.hwms-dest')), why = v3.querySelector('[data-why]');
    var reasons = [
      'A known lookup. The answer is the same every time, so it goes to an API call with no model in the loop.',
      'A current knowledge question. Retrieval pulls the policy as it stands today instead of relying on what a model memorized.',
      'Stable classification work. It goes to the lowest-cost model that passes the evaluation set.',
      'Ambiguous and high risk. It escalates to a stronger model or a person.',
      'The prompt cache is still useful, so the conversation stays on the same model.'
    ];
    tabs(v3, '.hwms-req', function(el){
      var d = +el.getAttribute('data-d');
      dests.forEach(function(x){ x.className = 'hwms-dest' + (+x.getAttribute('data-dest') === d ? ' is-on' : ''); });
      why.textContent = reasons[d];
    });
  }

  /* Visual 4: calculator */
  var v4 = document.getElementById('hwms-v4');
  if (v4) {
    var a = v4.querySelector('#hwms-a'), b = v4.querySelector('#hwms-b'), c = v4.querySelector('#hwms-c');
    var m = v4.querySelector('[data-m]'), y = v4.querySelector('[data-y]');
    var fmt = function(n){ var s = Math.abs(n).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:0}); return (n < 0 ? '-' : '') + s; };
    function calc(){
      var mo = ((parseFloat(a.value) || 0) - (parseFloat(b.value) || 0)) * (parseFloat(c.value) || 0);
      m.textContent = fmt(mo); y.textContent = fmt(mo * 12);
      [].forEach.call(v4.querySelectorAll('.hwms-o'), function(o){ o.className = 'hwms-o' + (mo < 0 ? ' is-neg' : ''); });
    }
    [a, b, c].forEach(function(i){ i.addEventListener('input', calc); });
    calc();
  }

  /* Visual 5: worth-it check */
  var v5 = document.getElementById('hwms-v5');
  if (v5) {
    var rows = [].slice.call(v5.querySelectorAll('.hwms-row')), sum = v5.querySelector('[data-sum]');
    function paint(){
      var n = rows.filter(function(r){ return r.getAttribute('aria-checked') === 'true'; }).length;
      if (n === 0) { sum.className = 'hwms-sum'; sum.innerHTML = '<strong>Nothing selected yet.</strong><p>Pick every condition that describes your AI usage today.</p>'; }
      else if (n < 3) { sum.className = 'hwms-sum is-part'; sum.innerHTML = '<strong>' + n + ' of 6: some signal</strong><p>Put usage logging and a small evaluation set in place now. They make the later decision much easier.</p>'; }
      else { sum.className = 'hwms-sum is-go'; sum.innerHTML = '<strong>' + n + ' of 6: a strong case</strong><p>Several conditions are present. Start with a workload map and cost per successful task.</p>'; }
    }
    rows.forEach(function(r){
      function toggle(){ r.setAttribute('aria-checked', r.getAttribute('aria-checked') === 'true' ? 'false' : 'true'); paint(); }
      r.addEventListener('click', toggle);
      r.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    });
    paint();
  }
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":37211,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":2615,"estimatedReadTimeSeconds":659,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

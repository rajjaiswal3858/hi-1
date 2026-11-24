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

  /* McKinsey bars */
  var v2 = document.getElementById('hwrm-v2');
  if (v2) {
    var sets = [
      {l:['High performers','Everyone else'], v:[75,25], t:['Nearly 3 in 4','1 in 4'], take:'Share that fundamentally redesigned workflows because of AI: a three-to-one gap.'},
      {l:['AI improved my own productivity','AI contributed positively to EBIT'], v:[80,37], t:['8 in 10','37%'], take:'Individual gains are common. Enterprise returns are not.'}
    ];
    var q = function(s){ return v2.querySelector(s); };
    tabs(v2, '.hwrm-seg [role="tab"]', function(el){
      var s = sets[+el.getAttribute('data-i')];
      [0,1].forEach(function(i){
        q('[data-l="' + i + '"]').textContent = s.l[i];
        q('[data-v="' + i + '"]').textContent = s.t[i];
        q('[data-f="' + i + '"]').style.width = s.v[i] + '%';
      });
      q('[data-take]').textContent = s.take;
    });
  }

  /* Four steps */
  var v1 = document.getElementById('hwrm-v1');
  if (v1) {
    var c1 = v1.querySelector('[data-call]');
    tabs(v1, '.hwrm-seg [role="tab"]', function(el){
      var skip = el.getAttribute('data-mode') === 'skip';
      v1.className = 'hwrm-viz' + (skip ? ' is-skip' : '');
      c1.innerHTML = skip
        ? '<strong>Starting at step three.</strong> A team ranks a list it did not build, for an organization whose readiness was never assessed.'
        : '<strong>All four, in order.</strong> Discovery builds the list, assessment tests it, and only then does ranking and sequencing mean anything.';
    });
  }

  /* Value vs dependencies */
  var v3 = document.getElementById('hwrm-v3');
  if (v3) {
    var list = v3.querySelector('[data-list]'), c3 = v3.querySelector('[data-call]');
    var card = function(k){ return list.querySelector('[data-k="' + k + '"]'); };
    var ph1 = list.querySelector('[data-p="1"]'), ph2 = list.querySelector('[data-p="2"]');
    function set(k, rank, tag, cls){ var c = card(k); c.querySelector('.hwrm-rank').textContent = rank; var t = c.querySelector('.hwrm-tag'); t.textContent = tag; t.className = 'hwrm-tag ' + cls; }
    tabs(v3, '.hwrm-seg [role="tab"]', function(el){
      var dep = el.getAttribute('data-mode') === 'dep';
      v3.className = 'hwrm-viz' + (dep ? ' is-dep' : '');
      var order = dep ? [ph1, card('platform'), card('win'), ph2, card('risk'), card('rfq')] : [ph1, card('rfq'), card('risk'), card('platform'), card('win'), ph2];
      order.forEach(function(n){ list.appendChild(n); });
      if (dep) {
        set('platform', '1', 'Unlocks both', 'is-go');
        set('risk', '2', 'Needs the platform', 'is-part');
        set('rfq', '2', 'Needs the platform', 'is-part');
        c3.innerHTML = '<strong>The platform goes first</strong> because neither of the other two can work without it.';
      } else {
        set('rfq', '1', 'Largest savings', 'is-go');
        set('risk', '2', 'High value', 'is-go');
        set('platform', '3', 'Never funded', 'is-no');
        c3.innerHTML = '<strong>Fund proposal automation first</strong> and you spend two quarters learning the output is only as good as a document estate nobody has curated.';
      }
    });
  }

  /* K9 build order */
  var v4 = document.getElementById('hwrm-v4');
  if (v4) {
    var d4 = v4.querySelector('[data-detail]');
    var steps = [
      '<strong>Sources.</strong> Operational data lived in Gingr. Financial data lived in ProfitKeeper. The two had never spoken to each other.',
      '<strong>Ingestion.</strong> Nightly pipelines unify operational and financial data across every franchise location.',
      '<strong>Lakehouse on Databricks.</strong> Raw, transformed and validated layers, ending in clean daily KPI aggregates with revenue validated to the penny.',
      '<strong>Serving layer.</strong> An analytics database, a REST API serving validated figures, and an index of every validated endpoint.',
      '<strong>Products.</strong> K9 Fetch for dashboards and K9 Chat for plain-English questions, both reading the same validated numbers.'
    ];
    tabs(v4, '.hwrm-node', function(el){ d4.innerHTML = steps[+el.getAttribute('data-i')]; });
  }

  /* Diagnostic */
  var v5 = document.getElementById('hwrm-v5');
  if (v5) {
    var rows = [].slice.call(v5.querySelectorAll('.hwrm-row')), sum = v5.querySelector('[data-sum]');
    function paint(){
      var miss = rows.filter(function(r){ return r.getAttribute('aria-checked') === 'true'; }).map(function(r){ return r.getAttribute('data-m'); });
      if (!miss.length) { sum.className = 'hwrm-sum'; sum.innerHTML = '<strong>Nothing selected yet.</strong><p>Pick every statement that describes the roadmap on your desk.</p>'; return; }
      sum.className = 'hwrm-sum is-gap';
      sum.innerHTML = '<strong>' + miss.length + ' of 5 missing from your roadmap</strong><div class="hwrm-chips">' + miss.map(function(m){ return '<span>' + m + '</span>'; }).join('') + '</div>';
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
window._googlesitekit.contentEvents = {"postID":37204,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":2147,"estimatedReadTimeSeconds":541,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

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

  /* ---------- Visual 1 ---------- */
  var v1 = document.getElementById('hwra-v1');
  if (v1) {
    var out = v1.querySelector('[data-out]');
    var opps = [
      {name:'Internal knowledge assistant', pill:'is-go', verdict:'Ready now', when:'Could start this quarter', rows:[
        ['Data', '4,000 policy and procedure documents in SharePoint, already permissioned'],
        ['Integration', 'Reads a document store'],
        ['Ownership', 'One operations manager can change it without asking anyone'],
        ['If it is wrong', 'An underwriter asks a second question']]},
      {name:'Claims status automation', pill:'is-part', verdict:'Partially ready', when:'About four months out', rows:[
        ['Data', 'Status lives in a policy administration system from 2004'],
        ['Integration', 'Reaches the service layer by overnight batch, so answers are a day old'],
        ['Ownership', 'Claims owns half the workflow, billing owns the other half'],
        ['If it is wrong', 'A customer acts on it']]},
      {name:'Refund and adjustment agent', pill:'is-no', verdict:'Not close', when:'About a year out, mostly governance', rows:[
        ['Integration', 'Writes to the general ledger'],
        ['Governance', 'No control owner, no reversal path, no precedent for non-human write access'],
        ['Ownership', 'No settled answer on who is accountable'],
        ['If it is wrong', 'It pays a claimant twice']]}
    ];
    tabs(v1, '.hwra-seg [role="tab"]', function(el){
      var o = opps[+el.getAttribute('data-i')];
      var h = '<div class="hwra-out-top"><strong>' + o.name + '</strong><span class="hwra-pill ' + o.pill + '">' + o.verdict + '</span><span class="hwra-when">' + o.when + '</span></div><div class="hwra-finds">';
      o.rows.forEach(function(r){ h += '<div class="hwra-find"><span>' + r[0] + '</span><span>' + r[1] + '</span></div>'; });
      out.innerHTML = h + '</div>';
    });
  }

  /* ---------- Visual 3: checker ---------- */
  var v3 = document.getElementById('hwra-v3');
  if (v3) {
    var list = v3.querySelector('[data-checks]'), res = v3.querySelector('[data-result]');
    var checks = [
      ['The data', 'Which fields, in which system, shown in production?'],
      ['The fit', 'Good enough for this particular question?'],
      ['The workflow owner', 'Who can authorize the change without escalating?'],
      ['The write path', 'What can it alter, and how is that reversed?'],
      ['The control', 'Which existing control covers it, and who owns it?'],
      ['The reviewer', 'Who checks the output before it reaches a customer, auditor or ledger?'],
      ['The people', 'Whose work changes, and how are they prepared?'],
      ['The number', 'What moves if this works, and is it measured today?']
    ];
    var state = checks.map(function(){ return null; });
    checks.forEach(function(c, i){
      var row = document.createElement('div'); row.className = 'hwra-check';
      row.innerHTML = '<span><b>' + (i + 1) + '. ' + c[0] + '.</b> ' + c[1] + '</span>' +
        '<div class="hwra-yn" role="radiogroup" aria-label="' + c[0] + '">' +
        '<div role="radio" tabindex="0" aria-checked="false" data-v="y">Named</div>' +
        '<div role="radio" tabindex="0" aria-checked="false" data-v="n">Blank</div></div>';
      [].forEach.call(row.querySelectorAll('[role="radio"]'), function(r){
        function set(){ state[i] = r.getAttribute('data-v');
          [].forEach.call(row.querySelectorAll('[role="radio"]'), function(x){ x.setAttribute('aria-checked', x === r ? 'true' : 'false'); });
          paint(); }
        r.addEventListener('click', set);
        r.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); set(); } });
      });
      list.appendChild(row);
    });
    function paint(){
      var answered = state.filter(function(s){ return s !== null; }).length;
      var blanks = state.filter(function(s){ return s === 'n'; }).length;
      var cls = '', head = '', body = '';
      if (answered === 0) { head = 'Mark each check as named or blank.'; body = 'Pick one real opportunity and answer for that one only.'; }
      else if (blanks >= 4) { cls = 'is-no'; head = blanks + ' blanks: not ready yet'; body = 'Not ready in a sense a project plan can fix. It belongs later in the roadmap, behind something that is.'; }
      else if (blanks === 3) { cls = 'is-part'; head = '3 blanks: look at the gaps'; body = 'Check how long each gap takes to close. Two weeks, a quarter, and a program with its own sponsor sequence very differently.'; }
      else if (blanks >= 1) { cls = 'is-part'; head = blanks + (blanks === 1 ? ' blank' : ' blanks') + ': scoped work with a date'; body = 'Not a readiness problem. The build can often start in parallel.'; }
      else if (answered < 8) { cls = ''; head = 'No blanks so far'; body = (8 - answered) + ' still to answer.'; }
      else { cls = 'is-go'; head = 'Zero blanks: build'; body = 'Every name can be checked by someone else. That is what ready looks like.'; }
      res.className = 'hwra-result' + (cls ? ' ' + cls : '');
      res.innerHTML = '<strong>' + head + '</strong><p>' + body + '</p>';
    }
    var reset = v3.querySelector('[data-reset]');
    function clear(){ state = state.map(function(){ return null; }); [].forEach.call(list.querySelectorAll('[role="radio"]'), function(x){ x.setAttribute('aria-checked','false'); }); paint(); }
    reset.addEventListener('click', clear);
    reset.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clear(); } });
    paint();
  }

  /* ---------- Visual 5: phasing ---------- */
  var v5 = document.getElementById('hwra-v5');
  if (v5) {
    var d5 = v5.querySelector('[data-detail]');
    var ph = [
      '<strong>Phase 1, weeks 1 to 10: core platform.</strong> An enterprise knowledge assistant over deal data spread across multiple systems, plus the foundation later phases build on.',
      '<strong>Phase 2, weeks 11 to 18: document generation.</strong> Drafting BOVs and offering memoranda for brokers.',
      '<strong>Phase 3, weeks 19 to 24: title and lease abstraction.</strong> The third capability, released on the same platform.'
    ];
    tabs(v5, '.hwra-seg5', function(el){ d5.innerHTML = ph[+el.getAttribute('data-i')]; });
  }
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":37194,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":1990,"estimatedReadTimeSeconds":502,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

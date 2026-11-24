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

  /* ---------- Visual 1: coverage ---------- */
  var v1 = document.getElementById('hwsp-v1');
  if (v1) {
    var fns = [
      {n:'Leadership', size:16, ws:12, ai:14, exec:true},
      {n:'Estimating', size:64, ws:3, ai:40},
      {n:'Procurement', size:48, ws:0, ai:30},
      {n:'Safety', size:48, ws:0, ai:30},
      {n:'Field operations', size:288, ws:2, ai:180, wide:true},
      {n:'Project management', size:112, ws:4, ai:70, wide:true},
      {n:'Finance', size:64, ws:3, ai:40, link:true},
      {n:'HR and admin', size:32, ws:0, ai:20},
      {n:'Customer service', size:128, ws:3, ai:76, link:true, wide:true}
    ];
    var org = v1.querySelector('[data-org]');
    fns.forEach(function(f){
      var card = document.createElement('div');
      card.className = 'hwsp-fn' + (f.wide ? ' is-wide' : '');
      var h = document.createElement('div'); h.className = 'hwsp-fnh';
      h.innerHTML = '<span>' + f.n + '</span><em data-c></em>';
      var d = document.createElement('div'); d.className = 'hwsp-dots';
      for (var i = 0; i < f.size; i++) d.appendChild(document.createElement('i'));
      card.appendChild(h); card.appendChild(d); org.appendChild(card);
      f.card = card; f.dots = [].slice.call(d.children); f.count = h.querySelector('[data-c]');
      // spread lit dots evenly across the block so coverage reads as area
      f.order = f.dots.map(function(_, i){ return i; }).sort(function(a, b){ return ((a * 37) % f.size) - ((b * 37) % f.size); });
    });
    var stat = function(k){ return v1.querySelector('[data-k="' + k + '"]'); };
    var call = v1.querySelector('[data-call]');
    function render(mode){
      var total = 0, reached = 0;
      fns.forEach(function(f){
        var lit = f[mode]; total += lit; if (lit > 0) reached++;
        f.dots.forEach(function(dot){ dot.className = ''; });
        for (var i = 0; i < lit; i++) {
          var dot = f.dots[mode === 'ws' ? i : f.order[i]];
          dot.className = (mode === 'ws' && f.exec) ? 'exec' : 'on';
        }
        f.count.textContent = lit + ' / ' + f.size;
        f.card.className = 'hwsp-fn' + (f.wide ? ' is-wide' : '') + (mode === 'ai' && f.link ? ' is-linked' : '');
      });
      stat('people').textContent = total;
      stat('fns').textContent = reached + ' of ' + fns.length;
      if (mode === 'ws') {
        stat('ideas').textContent = '~6'; stat('ideasl').textContent = 'familiar ideas';
        call.className = 'hwsp-call is-warn';
        call.textContent = 'Procurement, Safety, and HR had nobody in the room, so they show up with zero opportunities.';
      } else {
        stat('ideas').textContent = 'Cross-fn'; stat('ideasl').textContent = 'patterns between functions';
        call.className = 'hwsp-call';
        call.textContent = 'Pattern found: a reconciliation headache in Finance and a billing dispute in Customer Service trace back to the same broken handoff.';
      }
    }
    tabs(v1, '.hwsp-seg [role="tab"]', function(el){ render(el.getAttribute('data-mode')); });
  }

  /* ---------- Visual 3 (funnel) ---------- */
  var v2 = document.getElementById('hwsp-v2');
  if (v2) {
    var box = v2.querySelector('[data-detail]');
    var stages = [
      '<p><strong>Discovery across the business.</strong> Senior leadership plus subject-matter experts in estimating, project management, field operations, procurement, safety, and finance produced more than 50 candidate use cases.</p>',
      '<p><strong>Every candidate, same four criteria.</strong></p><div class="hwsp-chips"><span>Business impact</span><span>Feasibility</span><span>Data readiness</span><span>Implementation complexity</span></div>',
      '<p><strong>Business cases with projected ROI.</strong> The strongest candidates each received a business case with projected ROI.</p>',
      '<p><strong>Four priority categories.</strong></p><div class="hwsp-cats">' +
        '<div class="hwsp-cat"><strong>Estimating accuracy</strong><span>Protect project margin</span></div>' +
        '<div class="hwsp-cat"><strong>Predictive project risk</strong><span>Cut cost and schedule overruns</span></div>' +
        '<div class="hwsp-cat"><strong>Proposal and RFQ response</strong><span>Lift win rate</span></div>' +
        '<div class="hwsp-cat"><strong>Specification analysis</strong><span>Speed preconstruction, reduce rework</span></div></div>'
    ];
    tabs(v2, '.hwsp-fs', function(el){ box.innerHTML = stages[+el.getAttribute('data-i')]; });
  }

  /* ---------- Visual 4 (roadmap) ---------- */
  var v3 = document.getElementById('hwsp-v3');
  if (v3) {
    var d3 = v3.querySelector('[data-detail]');
    var phases = [
      '<strong>Foundation.</strong> Pair data and infrastructure investment with the first GenAI quick wins, so value shows up while the platform is being built.',
      '<strong>Core development.</strong> Deploy the high-ROI use cases that proved out, and push them into more departments.',
      '<strong>Scale.</strong> Operationalize governance, people, and process for AI adoption across the company.'
    ];
    var frontMsg = '<strong>The common alternative.</strong> The platform gets built first and every use case waits behind it. Value arrives only after the foundation is finished.';
    var mode = 'under', cur = 0;
    function paint(){ d3.innerHTML = mode === 'front' ? frontMsg : phases[cur]; }
    tabs(v3, '.hwsp-seg [role="tab"]', function(el){
      mode = el.getAttribute('data-mode');
      v3.className = 'hwsp-viz' + (mode === 'front' ? ' is-front' : '');
      paint();
    });
    tabs(v3, '.hwsp-ph', function(el){ cur = +el.getAttribute('data-i'); if (mode === 'front') { mode = 'under'; v3.className = 'hwsp-viz'; var s = v3.querySelectorAll('.hwsp-seg [role="tab"]'); s[0].setAttribute('aria-selected','true'); s[0].tabIndex = 0; s[1].setAttribute('aria-selected','false'); s[1].tabIndex = -1; } paint(); });
  }

  /* ---------- Visual 2 (GenROI stages) ---------- */
  var v4 = document.getElementById('hwsp-v4');
  if (v4) {
    var d4 = v4.querySelector('[data-detail]'), bar = v4.querySelector('[data-bar]');
    var steps = [
      ['Discover', 'Uncover operational challenges, unmet needs, and AI opportunities across the organization.', 'AI-guided interviews reach every function, then strategists validate and challenge what comes back.'],
      ['Assess', 'Evaluate each opportunity based on potential value, feasibility, strategic fit, and organizational readiness.', 'The same four questions, applied by the same people, to every opportunity.'],
      ['Prioritize', 'Weigh dependencies, risks, and tradeoffs to identify the initiatives worth pursuing first.', 'The output is short: the three or four worth funding first.'],
      ['Roadmap', 'Turn the strongest opportunities into a sequenced plan with clear recommendations and next steps.', 'Every priority is tied to the data foundation it depends on.']
    ];
    tabs(v4, '.hwsp-step', function(el){
      var i = +el.getAttribute('data-i'), s = steps[i];
      d4.innerHTML = '<strong>' + s[0] + '</strong><p>' + s[1] + '</p><em>' + s[2] + '</em>';
      bar.style.width = ((i + 1) * 25) + '%';
    });
  }
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":37187,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":1811,"estimatedReadTimeSeconds":457,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

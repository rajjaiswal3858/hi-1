/* HWDEP — deployment path tabs.
     Namespaced IIFE. No globals, no libraries, no storage.
     Tabs above 640px (role=tablist, arrow keys, automatic activation);
     stacked accordion at 640px and below (aria-expanded, Up/Down keys).
     Version numbers and cost strings live in HWDEP_DATA — bump them here. */
  (function(){
    var root = document.getElementById('hwdep');
    if(!root || root.getAttribute('data-hwdep-ready') === '1'){ return; }
    root.setAttribute('data-hwdep-ready','1');

    /* ---------- DATA: the only place version numbers should be edited ---------- */
    var HWDEP_DATA = {
      local: {
        tool: 'Ollama',
        version: 'v0.32.6',
        alt: 'LM Studio',
        cost: 'Sunk hardware cost — an RTX 5090 32 GB was about $4,100 in July 2026',
        concurrency: '1–4 users'
      },
      hosted: {
        tool: 'vLLM',
        version: '0.27.0',
        alt: 'SGLang 0.5.9',
        cost: '$504/mo for an L4 24 GB up to $2,520/mo for an H100 80 GB, running 24/7',
        devops: 'plus DevOps at $750–$3,000/mo, which pushes true cost to 1.3–2.0× the raw GPU line'
      },
      api: {
        tool: 'Any OpenAI-compatible provider endpoint',
        cost: '$0.10–$5 per 1M input tokens',
        breakeven: 'self-hosting only overtakes a frontier API at roughly 82M tokens/month against GPT-5.6 Sol and 240M against Claude Sonnet 5'
      }
    };
    /* -------------------------------------------------------------------------- */

    function bind(){
      var nodes = [].slice.call(root.querySelectorAll('[data-hwdep-bind]'));
      nodes.forEach(function(node){
        var path = node.getAttribute('data-hwdep-bind').split('.');
        var val = HWDEP_DATA;
        for(var i = 0; i < path.length; i++){
          if(val === null || typeof val !== 'object' || !(path[i] in val)){ return; }
          val = val[path[i]];
        }
        if(typeof val === 'string'){ node.textContent = val; }
      });
    }
    bind();

    var nav    = root.querySelector('[data-hwdep-nav]');
    var stack  = root.querySelector('[data-hwdep-panels]');
    var tabs   = [].slice.call(root.querySelectorAll('[data-hwdep-tab]'));
    if(!nav || !stack || tabs.length === 0){ return; }

    var panels = tabs.map(function(t){ return document.getElementById(t.getAttribute('aria-controls')); });
    if(panels.indexOf(null) !== -1){ return; }

    root.classList.add('hwdep--js');

    var current = 0;      /* default tab is Local */
    var mode    = null;   /* 'tabs' | 'acc' */

    function paint(){
      tabs.forEach(function(tab, i){
        var on = (i === current);
        if(mode === 'acc'){
          tab.setAttribute('aria-expanded', on ? 'true' : 'false');
          tab.tabIndex = 0;
          var chev = tab.querySelector('.hwdep__chev');
          if(chev){ chev.textContent = on ? '−' : '+'; }
        } else {
          tab.setAttribute('aria-selected', on ? 'true' : 'false');
          tab.tabIndex = on ? 0 : -1;
        }
        panels[i].hidden = !on;
      });
    }

    function toTabs(){
      mode = 'tabs';
      root.setAttribute('data-hwdep-mode','tabs');
      tabs.forEach(function(tab){
        nav.appendChild(tab);                        /* re-parent back into the tablist, in order */
        tab.setAttribute('role','tab');
        tab.removeAttribute('aria-expanded');
      });
      panels.forEach(function(panel){
        stack.appendChild(panel);
        panel.setAttribute('role','tabpanel');
      });
      nav.hidden = false;
      nav.setAttribute('role','tablist');
      nav.setAttribute('aria-label','LLM deployment paths');
      if(current < 0){ current = 0; }
      paint();
    }

    function toAccordion(){
      mode = 'acc';
      root.setAttribute('data-hwdep-mode','acc');
      nav.removeAttribute('role');
      nav.removeAttribute('aria-label');
      nav.hidden = true;
      tabs.forEach(function(tab, i){
        tab.removeAttribute('role');                 /* native button semantics */
        tab.removeAttribute('aria-selected');
        stack.appendChild(tab);                      /* header, then its own panel */
        stack.appendChild(panels[i]);
        panels[i].setAttribute('role','region');
      });
      paint();
    }

    function select(i, moveFocus){
      if(mode === 'acc' && i === current){
        current = -1;                                /* accordion headers toggle closed */
      } else {
        current = i;
      }
      paint();
      if(moveFocus && tabs[i]){ tabs[i].focus(); }
    }

    tabs.forEach(function(tab, i){
      tab.addEventListener('click', function(){ select(i, false); });
      tab.addEventListener('keydown', function(ev){
        var key = ev.key;
        var next = -1;
        if(mode === 'tabs'){
          if(key === 'ArrowRight'){ next = (i + 1) % tabs.length; }
          else if(key === 'ArrowLeft'){ next = (i - 1 + tabs.length) % tabs.length; }
        } else {
          if(key === 'ArrowDown'){ next = (i + 1) % tabs.length; }
          else if(key === 'ArrowUp'){ next = (i - 1 + tabs.length) % tabs.length; }
        }
        if(key === 'Home'){ next = 0; }
        if(key === 'End'){ next = tabs.length - 1; }
        if(next < 0){ return; }
        ev.preventDefault();
        if(mode === 'tabs'){
          select(next, true);                        /* automatic activation */
        } else {
          tabs[next].focus();                        /* accordion: move focus only */
        }
      });
    });

    var mq = window.matchMedia ? window.matchMedia('(max-width:640px)') : null;

    function apply(){
      var wantAcc = mq ? mq.matches : false;
      if(wantAcc && mode !== 'acc'){ toAccordion(); }
      else if(!wantAcc && mode !== 'tabs'){ toTabs(); }
    }
    apply();

    if(mq){
      if(typeof mq.addEventListener === 'function'){ mq.addEventListener('change', apply); }
      else if(typeof mq.addListener === 'function'){ mq.addListener(apply); }
    }
  })();
;
/* HWVRAM — hardware selector. Namespaced IIFE, all computation client-side.
     No fetch, no libraries, no storage. */
  (function(){
    var root = document.getElementById('hwvram');
    if(!root || root.getAttribute('data-hwvram-ready') === '1'){ return; }
    root.setAttribute('data-hwvram-ready','1');

    /* Q4_K_M footprints at 8K context (LocalLLM.in, Feb 2026). gb8k already
       includes the KV cache for 8K, so longer contexts add only the delta.
       Rows marked EST are the current-generation models the article recommends;
       their gb8k is the top of the 4-bit range in the Step 5 table (conservative
       on purpose), not a LocalLLM.in measurement. */
    var MODELS = [
      { name:'Llama 3.2 3B',  params:3,    gb8k:3.58  },
      { name:'Qwen3 4B',      params:4,    gb8k:4.00  },
      { name:'Qwen3.5 4B',    params:4,    gb8k:5.00  },   /* EST */
      { name:'Llama 3.1 8B',  params:8,    gb8k:6.20  },
      { name:'Qwen3 14B',     params:14,   gb8k:10.70 },
      { name:'Gemma 4 12B',   params:12,   gb8k:11.00 },   /* EST */
      { name:'gpt-oss 20B',   params:20,   gb8k:11.95 },
      { name:'Gemma 3 12B',   params:12,   gb8k:12.40 },
      { name:'Qwen3.6 27B',   params:27,   gb8k:20.00 },   /* EST */
      { name:'Qwen3 32B',     params:32,   gb8k:22.20 },
      { name:'Gemma 3 27B',   params:27,   gb8k:22.50 },
      { name:'Gemma 4 31B',   params:30.7, gb8k:24.00 },   /* EST */
      { name:'Llama 3.3 70B', params:70,   gb8k:45.60 }
    ];

    /* Anchor: ~5 GB KV for an 8B model at 32K  ->  5 / (8 * 32) GB per B per 1K tokens.
       Linear in parameter count, which is a simplification: real KV cache scales with
       layers x kv_heads x head_dim. Long-context totals are indicative, not measured. */
    var KV_PER_B_PER_K = 5 / (8 * 32);
    var OVERHEAD       = 0.75;   /* observed range 0.5-1 GB */

    var gpuSel = root.querySelector('[data-hwvram-gpu]');
    var ctxSel = root.querySelector('[data-hwvram-ctx]');
    var out    = root.querySelector('[data-hwvram-result]');
    if(!gpuSel || !ctxSel || !out){ return; }

    root.classList.add('hwvram--js');

    function kv(params, ctxK){ return KV_PER_B_PER_K * params * ctxK; }
    function total(m, ctxK){ return m.gb8k + (kv(m.params, ctxK) - kv(m.params, 8)) + OVERHEAD; }
    function fmt(n){ return (Math.round(n * 10) / 10).toFixed(1); }
    function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

    /* largest model class first: by parameter count, then by footprint */
    var ranked = MODELS.slice().sort(function(a, b){
      return (b.params - a.params) || (b.gb8k - a.gb8k);
    });

    function best(vram, ctxK){
      for(var i = 0; i < ranked.length; i++){
        if(total(ranked[i], ctxK) <= vram){ return ranked[i]; }
      }
      return null;
    }

    function chips(vram, ctxK){
      var html = '<p class="hwvram__alsolabel">Everything in the table at this setting</p><ul class="hwvram__chips">';
      MODELS.forEach(function(m){
        var t   = total(m, ctxK);
        var ok  = t <= vram;
        html += '<li class="hwvram__chip ' + (ok ? 'hwvram__chip--fits' : 'hwvram__chip--no') + '">' +
                esc(m.name) + ' <span aria-hidden="true">&middot;</span> ' + fmt(t) + ' GB</li>';
      });
      return html + '</ul>';
    }

    function render(){
      var vram = parseFloat(gpuSel.value);
      var ctxK = parseFloat(ctxSel.value);
      if(!(vram > 0) || !(ctxK > 0)){ return; }

      var pick  = best(vram, ctxK);
      var at8k  = best(vram, 8);
      var warn  = '';
      var html  = '';

      if(!pick){
        var smallest = MODELS[0];
        html += '<p class="hwvram__verdictlabel">Largest model class that fits</p>';
        html += '<p class="hwvram__verdict">Nothing in this table fits</p>';
        html += '<p class="hwvram__quant">At ' + ctxK + 'K context, even ' + esc(smallest.name) +
                ' at Q4_K_M needs about ' + fmt(total(smallest, ctxK)) + ' GB against your ' + vram + ' GB.</p>';
        html += '<p class="hwvram__warn">KV cache at ' + ctxK + 'K context is what pushed you over. Cut the context window, drop to a smaller or more heavily quantized model, or accept CPU offload and a large throughput hit.</p>';
        html += chips(vram, ctxK);
        out.innerHTML = html;
        return;
      }

      var t        = total(pick, ctxK);
      var kvHere   = kv(pick.params, ctxK);
      var weights  = pick.gb8k - kv(pick.params, 8);
      var headroom = vram - t;

      /* amber warning cases, most specific first */
      if(at8k && at8k.params > pick.params){
        warn = 'KV cache at ' + ctxK + 'K context pushed ' + at8k.name + ' (' + fmt(total(at8k, ctxK)) +
               ' GB) past your ' + vram + ' GB budget. At 8K it would have fitted. ' + pick.name +
               ' is the largest class that still fits at ' + ctxK + 'K.';
      } else if(headroom < 1){
        warn = 'Only ' + fmt(headroom) + ' GB spare. That is inside the 0.5–1 GB backend overhead band, so a longer prompt or a second concurrent request will spill to system RAM. Check with ollama ps and look for 100% GPU.';
      } else if(headroom < 2.5){
        warn = fmt(headroom) + ' GB spare is workable for one user and tight for anything else. Size for the longest context you will actually serve, not the average one.';
      }

      html += '<p class="hwvram__verdictlabel">Largest model class that fits ' + vram + ' GB at ' + ctxK + 'K context</p>';
      html += '<p class="hwvram__verdict">' + esc(pick.name) + '</p>';
      html += '<p class="hwvram__quant">Quantization required: <strong>Q4_K_M (4-bit)</strong>' +
              (headroom > pick.gb8k * 0.6
                ? ' — and you have room to move up to Q5_K_M/Q6_K or a longer context if quality matters more than speed.'
                : '.') + '</p>';

      html += '<dl class="hwvram__budget">';
      html += '<dt>Weights</dt><dd>' + fmt(weights) + ' GB</dd>';
      html += '<dt>KV cache at ' + ctxK + 'K</dt><dd>' + fmt(kvHere) + ' GB</dd>';
      html += '<dt>Backend overhead</dt><dd>' + fmt(OVERHEAD) + ' GB</dd>';
      html += '<dt class="hwvram__tot">Total</dt><dd class="hwvram__tot">' + fmt(t) + ' GB</dd>';
      html += '<dt>Headroom on ' + vram + ' GB</dt><dd>' + fmt(headroom) + ' GB</dd>';
      html += '</dl>';

      if(warn){ html += '<p class="hwvram__warn">' + esc(warn) + '</p>'; }
      html += chips(vram, ctxK);

      out.innerHTML = html;
    }

    gpuSel.addEventListener('change', render);
    ctxSel.addEventListener('change', render);
    render();
  })();
;
/* HWRAG — pitfalls accordion. Progressive enhancement over native details/summary.
     Namespaced IIFE. No globals, no libraries, no storage.
     Single-open, aria-expanded kept in sync, rows deep-linkable by URL fragment. */
  (function(){
    var root = document.getElementById('hwrag');
    if(!root || root.getAttribute('data-hwrag-ready') === '1'){ return; }
    root.setAttribute('data-hwrag-ready','1');

    var items = [].slice.call(root.querySelectorAll('[data-hwrag-item]'));
    if(!items.length){ return; }

    var suppress = false;   /* guards the close-the-others cascade */

    function setHash(id){
      if(!id){ return; }
      try{
        if(window.history && typeof window.history.replaceState === 'function'){
          window.history.replaceState(null, '', '#' + id);   /* no storage, no reload */
        }
      }catch(e){ /* file:// and sandboxed contexts — ignore */ }
    }

    items.forEach(function(item){
      var head = item.querySelector('.hwrag__head');
      if(!head){ return; }
      head.setAttribute('aria-expanded', item.open ? 'true' : 'false');

      item.addEventListener('toggle', function(){
        head.setAttribute('aria-expanded', item.open ? 'true' : 'false');
        if(!item.open || suppress){ return; }
        suppress = true;
        items.forEach(function(other){
          if(other !== item && other.open){ other.open = false; }
        });
        suppress = false;
        setHash(item.id);
      });
    });

    function openFromHash(scroll){
      var id = (window.location.hash || '').replace(/^#/, '');
      if(!id){ return; }
      var target = null;
      items.forEach(function(item){ if(item.id === id){ target = item; } });
      if(!target){ return; }
      if(!target.open){ target.open = true; }
      if(scroll && typeof target.scrollIntoView === 'function'){
        target.scrollIntoView({ block:'start' });
      }
      var head = target.querySelector('.hwrag__head');
      if(head && scroll && typeof head.focus === 'function'){ head.focus({ preventScroll:true }); }
    }

    openFromHash(true);
    window.addEventListener('hashchange', function(){ openFromHash(false); });

    /* Up/Down moves focus between row headers, matching the tabs component. */
    var heads = items.map(function(i){ return i.querySelector('.hwrag__head'); });
    heads.forEach(function(head, i){
      if(!head){ return; }
      head.addEventListener('keydown', function(ev){
        var next = -1;
        if(ev.key === 'ArrowDown'){ next = (i + 1) % heads.length; }
        else if(ev.key === 'ArrowUp'){ next = (i - 1 + heads.length) % heads.length; }
        else if(ev.key === 'Home'){ next = 0; }
        else if(ev.key === 'End'){ next = heads.length - 1; }
        if(next < 0 || !heads[next]){ return; }
        ev.preventDefault();
        heads[next].focus();
      });
    });
  })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":31657,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":6556,"estimatedReadTimeSeconds":1653,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

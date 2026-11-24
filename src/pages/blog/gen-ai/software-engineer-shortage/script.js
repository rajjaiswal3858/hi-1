/* HWSHIFT — entry-level vs senior comparison. Namespaced IIFE, no globals, no storage. */
  (function(){
    var root = document.getElementById('hwshift');
    if(!root || root.getAttribute('data-hwshift-ready') === '1'){ return; }
    root.setAttribute('data-hwshift-ready','1');

    var tags = root.querySelectorAll('.hwshift__src');

    function closeAll(except){
      for(var i=0;i<tags.length;i++){
        if(tags[i] !== except){ tags[i].setAttribute('aria-expanded','false'); }
      }
    }

    for(var i=0;i<tags.length;i++){
      (function(btn){
        btn.addEventListener('click', function(e){
          e.preventDefault();
          var open = btn.getAttribute('aria-expanded') === 'true';
          closeAll(btn);
          btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        });
        btn.addEventListener('keydown', function(e){
          if(e.key === 'Escape'){ btn.setAttribute('aria-expanded','false'); }
        });
      })(tags[i]);
    }

    document.addEventListener('click', function(e){
      if(!root.contains(e.target)){ closeAll(null); }
    });
  })();
;
/* HWPATH — hiring situation selector. Namespaced IIFE, no globals, no storage.
     Disclosure-button group (role="toolbar" + aria-expanded), manual activation.
     Default state = prompt, no branch preselected. */
  (function(){
    var root = document.getElementById('hwpath');
    if(!root || root.getAttribute('data-hwpath-ready') === '1'){ return; }
    root.setAttribute('data-hwpath-ready','1');

    var chipWrap = root.querySelector('[data-hwpath-chips]');
    var chips    = [].slice.call(root.querySelectorAll('.hwpath__chip'));
    var panels   = [].slice.call(root.querySelectorAll('[data-hwpath-panel]'));
    var prompt   = root.querySelector('[data-hwpath-prompt]');
    var reset    = root.querySelector('[data-hwpath-reset]');
    if(!chipWrap || !chips.length || !panels.length){ return; }

    /* JS is running: reveal the control, hide every branch, show the prompt. */
    chipWrap.hidden = false;
    if(prompt){ prompt.hidden = false; }
    if(reset){ reset.hidden = false; }
    panels.forEach(function(p){ p.hidden = true; });

    function panelFor(chip){ return document.getElementById(chip.getAttribute('aria-controls')); }

    /* clear() leaves NO chip holding tabindex=0. Every caller decides which chip
       should hold focus and sets it, so the group can never expose two tab stops. */
    function clear(){
      chips.forEach(function(c){
        c.setAttribute('aria-expanded','false');
        c.tabIndex = -1;
      });
      panels.forEach(function(p){ p.hidden = true; });
      if(prompt){ prompt.hidden = false; }
    }

    function select(chip, opts){
      opts = opts || {};
      if(!chip){ return; }
      chips.forEach(function(c){
        c.setAttribute('aria-expanded','false');
        c.tabIndex = -1;
      });
      chip.setAttribute('aria-expanded','true');
      chip.tabIndex = 0;
      panels.forEach(function(p){ p.hidden = true; });
      if(prompt){ prompt.hidden = true; }
      var panel = panelFor(chip);
      if(panel){ panel.hidden = false; }
      if(opts.focusChip){ chip.focus(); }
      if(opts.setHash){
        try{
          if(window.history && window.history.replaceState){
            window.history.replaceState(null,'','#'+chip.id);
          }
        }catch(err){ /* hash update is a convenience only */ }
      }
      if(opts.scroll && panel && panel.scrollIntoView){
        try{ panel.scrollIntoView({block:'center'}); }catch(e2){ panel.scrollIntoView(); }
      }
    }

    chips.forEach(function(chip){
      chip.addEventListener('click', function(){
        if(chip.getAttribute('aria-expanded') === 'true'){
          clear();
          chip.tabIndex = 0;
          chip.focus();
          return;
        }
        select(chip,{setHash:true});
      });
      chip.addEventListener('keydown', function(e){
        var i = chips.indexOf(chip), next = -1;
        if(e.key === 'ArrowRight' || e.key === 'ArrowDown'){ next = (i+1) % chips.length; }
        else if(e.key === 'ArrowLeft' || e.key === 'ArrowUp'){ next = (i-1+chips.length) % chips.length; }
        else if(e.key === 'Home'){ next = 0; }
        else if(e.key === 'End'){ next = chips.length-1; }
        else if(e.key === 'Escape'){ clear(); chip.tabIndex = 0; chip.focus(); return; }
        else { return; }
        e.preventDefault();
        chips.forEach(function(c){ c.tabIndex = -1; });
        chips[next].tabIndex = 0;
        chips[next].focus();
      });
    });

    if(reset){
      reset.addEventListener('click', function(){
        clear();
        chips[0].tabIndex = 0;
        try{
          if(window.history && window.history.replaceState){
            window.history.replaceState(null,'',window.location.pathname + window.location.search);
          }
        }catch(err){}
        chips[0].focus();
      });
    }

    /* Deep linking for sales: #hs-review-load etc. */
    function fromHash(scroll){
      var h = (window.location.hash || '').replace('#','');
      if(!h){ return; }
      for(var i=0;i<chips.length;i++){
        if(chips[i].id === h){ select(chips[i],{scroll:scroll}); return; }
      }
    }
    fromHash(true);
    window.addEventListener('hashchange', function(){ fromHash(false); });
  })();
;
/* HWPIT — pitfalls accordion. Progressive enhancement over native details/summary.
     Namespaced IIFE, no globals, no storage. Multi-open allowed. */
  (function(){
    var root = document.getElementById('hwpit');
    if(!root || root.getAttribute('data-hwpit-ready') === '1'){ return; }
    root.setAttribute('data-hwpit-ready','1');

    var items  = [].slice.call(root.querySelectorAll('[data-hwpit-item]'));
    var toggle = root.querySelector('[data-hwpit-toggle]');
    if(!items.length){ return; }

    items.forEach(function(item){
      item.addEventListener('toggle', function(){
        /* No aria-expanded is set on the summary: native details/summary already
           exposes expanded state, and duplicating it makes some screen reader and
           browser pairs announce the state twice. The +/x rotation is CSS. */
        syncToggle();
      });
    });

    function allOpen(){
      return items.every(function(i){ return i.open; });
    }

    function syncToggle(){
      if(!toggle){ return; }
      var open = allOpen();
      toggle.textContent = open ? 'Collapse all' : 'Expand all';
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    if(toggle){
      toggle.hidden = false;
      syncToggle();
      toggle.addEventListener('click', function(){
        var open = !allOpen();
        items.forEach(function(i){ i.open = open; });
        syncToggle();
      });
    }
  })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":28945,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":5894,"estimatedReadTimeSeconds":1486,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

/* HWLYR — six-layer AI OS stack. Progressive enhancement over native details/summary.
     Namespaced IIFE, no globals, no storage. Multi-open allowed. */
  (function(){
    var root = document.getElementById('hwlyr');
    if(!root || root.getAttribute('data-hwlyr-ready') === '1'){ return; }
    root.setAttribute('data-hwlyr-ready','1');
 
    var items  = [].slice.call(root.querySelectorAll('[data-hwlyr-item]'));
    var toggle = root.querySelector('[data-hwlyr-toggle]');
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
/* HWVEN — vendor selector. Filter-button group, not a tablist: the default
     view shows all five vendors at once, which no single tabpanel can
     represent honestly. Namespaced IIFE, no globals, no storage.
     No-JS state is all five cards visible; the filter row is CSS-hidden
     until the ready class lands. */
  (function(){
    var root = document.getElementById('hwven');
    if(!root || root.getAttribute('data-hwven-ready') === '1'){ return; }
    root.setAttribute('data-hwven-ready','1');
 
    var chips = [].slice.call(root.querySelectorAll('[data-hwven-chip]'));
    var cards = [].slice.call(root.querySelectorAll('[data-hwven-card]'));
    var clear = root.querySelector('[data-hwven-clear]');
    if(!chips.length || !cards.length){ return; }
 
    root.classList.add('hwven-ready');
 
    function selected(){
      return chips.filter(function(c){
        return c.getAttribute('aria-pressed') === 'true';
      }).map(function(c){
        return c.getAttribute('data-hwven-chip');
      });
    }
 
    function render(){
      var picked = selected();
      var showAll = picked.length === 0;
 
      cards.forEach(function(card){
        var key = card.getAttribute('data-hwven-card');
        /* The hidden attribute is used rather than a display rule so the
           filtered-out cards leave the accessibility tree as well as the page. */
        card.hidden = !(showAll || picked.indexOf(key) !== -1);
      });
 
      /* Two selections sit side by side on desktop; one, none, or three plus
         stay in a single column, because three narrow cards of this much text
         are unreadable. */
      if(picked.length === 2){
        root.classList.add('hwven-compare');
      } else {
        root.classList.remove('hwven-compare');
      }
 
      if(clear){ clear.hidden = showAll; }
    }
 
    chips.forEach(function(chip){
      chip.addEventListener('click', function(){
        var on = chip.getAttribute('aria-pressed') === 'true';
        chip.setAttribute('aria-pressed', on ? 'false' : 'true');
        render();
      });
    });
 
    if(clear){
      clear.addEventListener('click', function(){
        chips.forEach(function(c){ c.setAttribute('aria-pressed','false'); });
        render();
        chips[0].focus();
      });
    }
 
    render();
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
window._googlesitekit.contentEvents = {"postID":31270,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":8120,"estimatedReadTimeSeconds":2047,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

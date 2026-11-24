/* HWSTAT — stat explorer tabs.
     Namespaced IIFE. No globals, no libraries, no storage.
     Tabs with role=tablist and automatic activation (Left/Right/Home/End).
     Within-tab text filter, aria-live result count, per-panel empty state.
     Deep-linkable: #genai-stat-<category> opens that tab. Foreign hashes ignored.
     The statistics themselves are HTML above — this script only shows, hides and filters them. */
  (function(){
    var root = document.getElementById('genai-stat-explorer');
    if(!root || root.getAttribute('data-hwstat-ready') === '1'){ return; }
    root.setAttribute('data-hwstat-ready','1');
    root.className += ' hwstat--js';

    var tabs   = [].slice.call(root.querySelectorAll('[data-hwstat-tab]'));
    var panels = [].slice.call(root.querySelectorAll('[data-hwstat-panel]'));
    if(!tabs.length || !panels.length){ return; }

    var filterWrap = root.querySelector('[data-hwstat-filter]');
    var input      = root.querySelector('[data-hwstat-input]');
    var status     = root.querySelector('[data-hwstat-status]');
    if(filterWrap){ filterWrap.removeAttribute('hidden'); }   /* only reveal the filter when JS is alive */

    function panelFor(cat){
      var found = null;
      panels.forEach(function(p){ if(p.getAttribute('data-hwstat-cat') === cat){ found = p; } });
      return found;
    }

    function rowText(row){
      return (row.textContent || '').toLowerCase().replace(/\s+/g,' ');
    }

    function applyFilter(){
      var panel = panelFor(current);
      if(!panel){ return; }
      var q     = input ? (input.value || '').trim().toLowerCase() : '';
      var rows  = [].slice.call(panel.querySelectorAll('[data-hwstat-row]'));
      var shown = 0;
      rows.forEach(function(row){
        var hit = !q || rowText(row).indexOf(q) !== -1;
        if(hit){ row.removeAttribute('hidden'); shown++; }
        else{ row.setAttribute('hidden',''); }
      });
      var empty = panel.querySelector('[data-hwstat-empty]');
      if(empty){
        if(shown === 0){ empty.removeAttribute('hidden'); }
        else{ empty.setAttribute('hidden',''); }
      }
      if(status){
        if(!q){ status.textContent = 'Showing all ' + rows.length + ' statistics in this category.'; }
        else if(shown === 0){ status.textContent = 'No matches for "' + q + '" in this category.'; }
        else{ status.textContent = 'Showing ' + shown + ' of ' + rows.length + ' statistics.'; }
      }
    }

    var current = 'adoption';

    function select(cat, focusTab){
      var target = panelFor(cat);
      if(!target){ return; }
      current = cat;
      tabs.forEach(function(tab){
        var on = tab.getAttribute('data-hwstat-cat') === cat;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.setAttribute('tabindex', on ? '0' : '-1');
        if(on && focusTab && typeof tab.focus === 'function'){ tab.focus(); }
      });
      panels.forEach(function(p){
        if(p === target){ p.removeAttribute('hidden'); }
        else{ p.setAttribute('hidden',''); }
      });
      applyFilter();
      if(input){ input.setAttribute('placeholder','Filter the ' + cat + ' statistics'); }
    }

    tabs.forEach(function(tab, i){
      tab.setAttribute('tabindex', i === 0 ? '0' : '-1');
      tab.addEventListener('click', function(){
        select(tab.getAttribute('data-hwstat-cat'), false);
        setHash(tab.getAttribute('aria-controls'));
      });
      tab.addEventListener('keydown', function(ev){
        var next = -1;
        if(ev.key === 'ArrowRight'){ next = (i + 1) % tabs.length; }
        else if(ev.key === 'ArrowLeft'){ next = (i - 1 + tabs.length) % tabs.length; }
        else if(ev.key === 'Home'){ next = 0; }
        else if(ev.key === 'End'){ next = tabs.length - 1; }
        if(next < 0){ return; }
        ev.preventDefault();
        var cat = tabs[next].getAttribute('data-hwstat-cat');
        select(cat, true);                                     /* automatic activation */
        setHash(tabs[next].getAttribute('aria-controls'));
      });
    });

    function setHash(id){
      if(!id){ return; }
      try{
        if(window.history && typeof window.history.replaceState === 'function'){
          window.history.replaceState(null, '', '#' + id);      /* no storage, no reload */
        }
      }catch(e){ /* file:// and sandboxed contexts — ignore */ }
    }

    if(input){
      input.addEventListener('input', applyFilter);
      input.addEventListener('search', applyFilter);
      input.addEventListener('keydown', function(ev){
        if(ev.key === 'Escape' && input.value){ ev.preventDefault(); input.value = ''; applyFilter(); }
      });
    }

    function fromHash(scroll){
      var id = (window.location.hash || '').replace(/^#/,'');
      if(id.indexOf('genai-stat-') !== 0){ return false; }      /* not ours — leave it alone */
      var cat = id.replace('genai-stat-','');
      if(!panelFor(cat)){ return false; }
      select(cat, false);
      if(scroll && typeof root.scrollIntoView === 'function'){ root.scrollIntoView({ block:'start' }); }
      return true;
    }

    if(!fromHash(true)){ select('adoption', false); }
    window.addEventListener('hashchange', function(){ fromHash(true); });
  })();
;
/* HWROLE — role selector.
     Namespaced IIFE. No globals, no libraries, no storage.
     Tabs with role=tablist and automatic activation (Left/Right/Home/End).
     Deliberately does NOT write to the URL hash: the reference chips inside the panels are
     ordinary anchors into the stat explorer's hashes, and hijacking the hash here would fight them. */
  (function(){
    var root = document.getElementById('hwrole');
    if(!root || root.getAttribute('data-hwrole-ready') === '1'){ return; }
    root.setAttribute('data-hwrole-ready','1');
    root.className += ' hwrole--js';

    var tabs   = [].slice.call(root.querySelectorAll('[data-hwrole-tab]'));
    var panels = [].slice.call(root.querySelectorAll('[data-hwrole-panel]'));
    if(!tabs.length || !panels.length){ return; }

    function select(role, focusTab){
      var target = null;
      panels.forEach(function(p){ if(p.getAttribute('data-hwrole-role') === role){ target = p; } });
      if(!target){ return; }
      tabs.forEach(function(tab){
        var on = tab.getAttribute('data-hwrole-role') === role;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.setAttribute('tabindex', on ? '0' : '-1');
        if(on && focusTab && typeof tab.focus === 'function'){ tab.focus(); }
      });
      panels.forEach(function(p){
        if(p === target){ p.removeAttribute('hidden'); }
        else{ p.setAttribute('hidden',''); }
      });
    }

    tabs.forEach(function(tab, i){
      tab.setAttribute('tabindex', i === 0 ? '0' : '-1');
      tab.addEventListener('click', function(){
        select(tab.getAttribute('data-hwrole-role'), false);
      });
      tab.addEventListener('keydown', function(ev){
        var next = -1;
        if(ev.key === 'ArrowRight'){ next = (i + 1) % tabs.length; }
        else if(ev.key === 'ArrowLeft'){ next = (i - 1 + tabs.length) % tabs.length; }
        else if(ev.key === 'Home'){ next = 0; }
        else if(ev.key === 'End'){ next = tabs.length - 1; }
        if(next < 0){ return; }
        ev.preventDefault();
        select(tabs[next].getAttribute('data-hwrole-role'), true);   /* automatic activation */
      });
    });

    select('cto', false);
  })();
;
/* HWPIT — pitfalls accordion. Progressive enhancement over native details/summary.
     Namespaced IIFE. No globals, no libraries, no storage.
     Single-open, aria-expanded kept in sync, rows deep-linkable by URL fragment (#pitfall-...). */
  (function(){
    var root = document.getElementById('hwpit');
    if(!root || root.getAttribute('data-hwpit-ready') === '1'){ return; }
    root.setAttribute('data-hwpit-ready','1');

    var items = [].slice.call(root.querySelectorAll('[data-hwpit-item]'));
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
      var head = item.querySelector('.hwpit__head');
      if(!head){ return; }
      head.setAttribute('aria-expanded', item.open ? 'true' : 'false');
      var chev = head.querySelector('.hwpit__chev');
      if(chev){ chev.textContent = item.open ? '−' : '+'; }

      item.addEventListener('toggle', function(){
        head.setAttribute('aria-expanded', item.open ? 'true' : 'false');
        if(chev){ chev.textContent = item.open ? '−' : '+'; }
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
      var id = (window.location.hash || '').replace(/^#/,'');
      if(id.indexOf('pitfall-') !== 0){ return; }             /* not ours — leave it alone */
      var target = null;
      items.forEach(function(item){ if(item.id === id){ target = item; } });
      if(!target){ return; }
      if(!target.open){ target.open = true; }
      if(scroll && typeof target.scrollIntoView === 'function'){ target.scrollIntoView({ block:'start' }); }
      var head = target.querySelector('.hwpit__head');
      if(head && scroll && typeof head.focus === 'function'){ head.focus({ preventScroll:true }); }
    }

    openFromHash(true);
    window.addEventListener('hashchange', function(){ openFromHash(false); });

    /* Up/Down/Home/End move focus between row headers. */
    var heads = items.map(function(i){ return i.querySelector('.hwpit__head'); });
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
window._googlesitekit.contentEvents = {"postID":30636,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":7101,"estimatedReadTimeSeconds":1790,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

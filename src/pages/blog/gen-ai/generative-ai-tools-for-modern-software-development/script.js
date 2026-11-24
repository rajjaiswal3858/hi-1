(function(){
  function initSelector(root, btnSel, panelSel, keyAttr){
    var btns = Array.prototype.slice.call(root.querySelectorAll(btnSel));
    var panels = Array.prototype.slice.call(root.querySelectorAll(panelSel));
    if(!btns.length){ return; }
    root.classList.add('hwgenai-js');
    function select(key){
      btns.forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute(keyAttr)===key ? 'true' : 'false'); });
      panels.forEach(function(p){ if(p.getAttribute('data-panel')===key){ p.classList.add('is-active'); } else { p.classList.remove('is-active'); } });
    }
    btns.forEach(function(b, i){
      b.addEventListener('click', function(){ select(b.getAttribute(keyAttr)); });
      b.addEventListener('keydown', function(e){
        if(e.key===' ' || e.key==='Enter'){ e.preventDefault(); select(b.getAttribute(keyAttr)); }
        else if(e.key==='ArrowRight' || e.key==='ArrowDown'){ e.preventDefault(); var n=btns[(i+1)%btns.length]; n.focus(); select(n.getAttribute(keyAttr)); }
        else if(e.key==='ArrowLeft' || e.key==='ArrowUp'){ e.preventDefault(); var p=btns[(i-1+btns.length)%btns.length]; p.focus(); select(p.getAttribute(keyAttr)); }
      });
    });
    var pre = btns.filter(function(b){ return b.getAttribute('aria-pressed')==='true'; })[0] || btns[0];
    select(pre.getAttribute(keyAttr));
  }
  function boot(){
    Array.prototype.forEach.call(document.querySelectorAll('[data-hwgenai-quad]'), function(q){ initSelector(q, '.hwgenai-iqc', '.hwgenai-iqp', 'data-q'); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-hwgenai-loop]'), function(l){ initSelector(l, '.hwgenai-istep', '.hwgenai-iloop-panel', 'data-step'); });
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', boot); } else { boot(); }
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":29665,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":3563,"estimatedReadTimeSeconds":898,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

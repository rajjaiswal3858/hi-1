(function(){
  /* Layer tabs */
  document.querySelectorAll('[data-hwfd-layer]').forEach(function(root){
    if(root.dataset.ready) return; root.dataset.ready = '1';
    var copy = [
      '<strong>Source of truth.</strong> Choose which systems feed the profile and the agent, and make sure what\'s published stays in sync with prices, stock, and policies that change daily.',
      '<strong>Scope.</strong> Write down what the agent may answer, what it must decline, and where it should send people.',
      '<strong>Handoff.</strong> Decide where a conversation goes when the agent reaches its limit: your site, a phone line, a support queue. Make sure the receiving team knows it\'s coming.'
    ];
    var tabs = [].slice.call(root.querySelectorAll('.hwfd-part'));
    var detail = root.querySelector('[data-detail]');
    function select(i){
      tabs.forEach(function(t, j){
        t.setAttribute('aria-selected', j === i ? 'true' : 'false');
        t.setAttribute('tabindex', j === i ? '0' : '-1');
      });
      detail.innerHTML = copy[i];
    }
    tabs.forEach(function(t, i){
      t.addEventListener('click', function(){ select(i); });
      t.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); select(i); }
        if(e.key === 'ArrowRight' || e.key === 'ArrowDown'){ e.preventDefault(); var n = (i + 1) % tabs.length; select(n); tabs[n].focus(); }
        if(e.key === 'ArrowLeft' || e.key === 'ArrowUp'){ e.preventDefault(); var p = (i - 1 + tabs.length) % tabs.length; select(p); tabs[p].focus(); }
      });
    });
  });

  /* Bars animate in when visible */
  document.querySelectorAll('[data-hwfd-bars]').forEach(function(root){
    if(root.dataset.ready) return; root.dataset.ready = '1';
    var fills = root.querySelectorAll('.hwfd-fill');
    function grow(){ fills.forEach(function(f){ f.style.width = f.getAttribute('data-w') + '%'; }); }
    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){ if(en.isIntersecting){ grow(); io.disconnect(); } });
      }, {threshold: 0.3});
      io.observe(root);
    } else { grow(); }
  });
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":38091,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":1553,"estimatedReadTimeSeconds":392,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

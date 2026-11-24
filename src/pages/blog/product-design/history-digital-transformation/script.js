(function(){
  if (window.__hwdtInit) return; window.__hwdtInit = true;
  function ready(fn){ if(document.readyState!=='loading'){fn();} else {document.addEventListener('DOMContentLoaded',fn);} }
  ready(function(){
    /* Animate bar charts when they scroll into view */
    var anims = document.querySelectorAll('.hwdt-anim');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window) || reduce) {
      anims.forEach(function(el){ el.classList.remove('hwdt-anim'); });
    } else {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.remove('hwdt-anim'); io.unobserve(e.target); } });
      }, {threshold:0.35});
      anims.forEach(function(el){ io.observe(el); });
    }

    /* Generative AI milestone filter */
    var tl = document.getElementById('hwdt-genai-tl');
    if (tl) {
      var chips = tl.querySelectorAll('.hwdt-chip');
      var items = tl.querySelectorAll('.hwdt-tl__item');
      chips.forEach(function(chip){
        chip.addEventListener('click', function(){
          var f = chip.getAttribute('data-filter');
          chips.forEach(function(c){ c.setAttribute('aria-pressed', c===chip ? 'true' : 'false'); });
          items.forEach(function(li){
            var cats = (li.getAttribute('data-cat')||'').split(' ');
            li.classList.toggle('hwdt-is-hidden', f!=='all' && cats.indexOf(f)===-1);
          });
        });
      });
    }

    /* Generic toggles: chatbot vs agent, adoption gap views */
    function toggle(rootId, attr){
      var root = document.getElementById(rootId); if(!root) return;
      var btns = root.querySelectorAll('.hwdt-seg .hwdt-chip');
      var panels = root.querySelectorAll('.hwdt-panel');
      btns.forEach(function(b){
        b.addEventListener('click', function(){
          var v = b.getAttribute(attr);
          btns.forEach(function(x){ x.setAttribute('aria-pressed', x===b ? 'true' : 'false'); });
          panels.forEach(function(p){
            var on = p.getAttribute(attr)===v;
            p.hidden = !on;
            if (on && !reduce) {
              p.querySelectorAll('.hwdt-bar__fill').forEach(function(f){
                var w = f.style.getPropertyValue('--v'); f.style.width='0';
                requestAnimationFrame(function(){ requestAnimationFrame(function(){ f.style.width = w; }); });
              });
            }
          });
        });
      });
    }
    toggle('hwdt-compare','data-panel');
    toggle('hwdt-gap','data-view');
  });
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":29097,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":4131,"estimatedReadTimeSeconds":1041,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

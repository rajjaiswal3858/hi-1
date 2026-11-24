(function(){
  var root = document.getElementById('hw-oai-root');
  if(!root) return;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* reveal on scroll */
  var rv = root.querySelectorAll('.hw-oai-rv, .hw-oai-tl__i');
  if('IntersectionObserver' in window && !reduced){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, {threshold:0.08, rootMargin:'0px 0px -56px 0px'});
    rv.forEach(function(el){ io.observe(el); });
  } else {
    rv.forEach(function(el){ el.classList.add('is-in'); });
  }

  /* faq accordion */
  root.querySelectorAll('.hw-oai-faq__i').forEach(function(item){
    var btn = item.querySelector('.hw-oai-faq__q');
    if(!btn) return;
    btn.addEventListener('click', function(){
      var open = item.getAttribute('data-open') === 'true';
      item.setAttribute('data-open', open ? 'false' : 'true');
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });

  /* smooth anchor scroll */
  root.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var t = document.getElementById(a.getAttribute('href').slice(1));
      if(!t) return;
      e.preventDefault();
      window.scrollTo({top: t.getBoundingClientRect().top + window.pageYOffset - 16, behavior:'smooth'});
    });
  });

  /* scroll progress + parallax */
  var bar = document.getElementById('hw-oai-progress');
  var layers = Array.prototype.slice.call(root.querySelectorAll('[data-parallax]'));
  var ticking = false;
  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      var vh = window.innerHeight || 1;
      if(bar){
        var total = Math.max(document.documentElement.scrollHeight - vh, 1);
        bar.style.transform = 'scaleX(' + Math.min(window.pageYOffset / total, 1) + ')';
      }
      if(!reduced){
        layers.forEach(function(el){
          var host = el.parentElement;
          if(!host) return;
          var b = host.getBoundingClientRect();
          if(b.bottom < -200 || b.top > vh + 200) return;
          var rate = parseFloat(el.getAttribute('data-parallax')) || 0.12;
          var offset = (b.top + b.height/2 - vh/2) * rate;
          el.style.transform = 'translate3d(0,' + (-offset).toFixed(1) + 'px,0)';
        });
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll, {passive:true});
  onScroll();
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":36464,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

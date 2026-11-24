(function(){
    var root=document.getElementById('soai-intro');
    if(!root||root.dataset.init)return; root.dataset.init='1';
    var reduce=(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)||false;

    root.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click',function(e){
        var t=document.getElementById(a.getAttribute('href').slice(1));
        if(!t)return;
        e.preventDefault();
        var y=t.getBoundingClientRect().top+window.pageYOffset-90;
        window.scrollTo({top:y,behavior:reduce?'auto':'smooth'});
      });
    });
  })();
;
window.option_df_36038 = {"webgl":"true","outline":[],"backgroundColor":"#464c56","hard":"cover","autoEnableOutline":"false","autoEnableThumbnail":"false","overwritePDFOutline":"false","enableDownload":"true","direction":"1","pageSize":"0","source":"https:\/\/hatchworks.com\/wp-content\/uploads\/2026\/08\/p-STATE-OF-AI-MID.pdf","wpOptions":"true"}; if(window.DFLIP && window.DFLIP.parseBooks){window.DFLIP.parseBooks();}
;
(function(){
    var root=document.getElementById('soai-ty');
    if(!root||root.dataset.init)return; root.dataset.init='1';
    root.classList.add('js');
    var mq=window.matchMedia||function(){return{matches:false}};
    var reduce=mq('(prefers-reduced-motion: reduce)').matches;
    var coarse=mq('(pointer: coarse)').matches;

    var reveals=root.querySelectorAll('.ty-reveal');
    if('IntersectionObserver' in window && !reduce){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -7% 0px'});
      reveals.forEach(function(el){io.observe(el);});
      root.querySelectorAll('.ty-grid,.ty-who').forEach(function(g){
        Array.prototype.forEach.call(g.children,function(c,i){ if(c.classList.contains('ty-reveal')) c.style.transitionDelay=(i*70)+'ms'; });
      });
    } else { reveals.forEach(function(el){el.classList.add('is-in');}); }

    if(!coarse){
      root.querySelectorAll('.ty-card').forEach(function(c){
        c.addEventListener('mousemove',function(ev){ var r=c.getBoundingClientRect();
          c.style.setProperty('--mx',((ev.clientX-r.left)/r.width*100)+'%');
          c.style.setProperty('--my',((ev.clientY-r.top)/r.height*100)+'%'); });
      });
    }

    /* click-to-load YouTube (keeps the page fast until the visitor asks for it) */
    root.querySelectorAll('.ty-facade').forEach(function(btn){
      btn.addEventListener('click',function(){
        var id=btn.getAttribute('data-yt');
        var f=document.createElement('iframe');
        f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&modestbranding=1';
        f.title='State of AI 2026 — Audiobook';
        f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        f.referrerPolicy='strict-origin-when-cross-origin';
        f.setAttribute('allowfullscreen','');
        btn.parentNode.appendChild(f);
        btn.remove();
      });
    });
  })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":36041,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

(function(){
  var root=document.getElementById('hwp-root'); if(!root) return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bar=document.getElementById('hwp-progress');
  var toc=document.getElementById('hwp-toc');
  var links=toc?Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]')):[];
  var targets=links.map(function(a){return document.getElementById(a.getAttribute('href').slice(1));}).filter(Boolean);
  var ticking=false;

  function update(){
    ticking=false;
    var doc=document.documentElement;
    var max=doc.scrollHeight-window.innerHeight;
    if(bar&&max>0){bar.style.width=Math.min(100,Math.max(0,(window.scrollY/max)*100))+'%';}
    if(targets.length){
      var cur=null, line=window.innerHeight*0.33;
      for(var i=0;i<targets.length;i++){var r=targets[i].getBoundingClientRect(); if(r.top<=line) cur=targets[i]; else break;}
      links.forEach(function(a){a.classList.toggle('on',cur&&a.getAttribute('href')==='#'+cur.id);});
    }
  }
  function onScroll(){ if(!ticking){ ticking=true; window.requestAnimationFrame(update);} }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  update();

  // smooth anchor scroll for TOC
  links.forEach(function(a){a.addEventListener('click',function(e){
    var t=document.getElementById(a.getAttribute('href').slice(1)); if(!t) return;
    e.preventDefault();
    t.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
    if(history.replaceState) history.replaceState(null,'','#'+t.id);
  });});

  // reveal on scroll
  var rv=root.querySelectorAll('.rv');
  if(reduce||!('IntersectionObserver' in window)){ rv.forEach(function(el){el.classList.add('in');}); }
  else{
    var io=new IntersectionObserver(function(entries){entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:0.05});
    rv.forEach(function(el){io.observe(el);});
  }

  // open FAQ item if deep-linked to its group
  if(location.hash){var g=document.querySelector(location.hash); if(g&&g.classList.contains('faq-group')){var d=g.querySelector('details'); if(d) d.open=true;}}
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":37563,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

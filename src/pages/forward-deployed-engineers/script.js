(function(){
  /* ── SCROLL REVEAL ── */
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");obs.unobserve(e.target);}});
  },{threshold:0.06});
  document.querySelectorAll(".hw-fde .rv").forEach(function(el){obs.observe(el);});

  /* ── PROOF GAUGE COUNT-UP ── */
  var gauge=document.getElementById("proofGauge"),gv=document.getElementById("proofCount");
  if(gauge&&gv){
    var gobs=new IntersectionObserver(function(en){
      en.forEach(function(e){
        if(e.isIntersecting){
          gauge.classList.add("in");
          var st=null;
          (function run(ts){
            if(!st)st=ts;
            var p=Math.min((ts-st)/1800,1),ease=1-Math.pow(1-p,3);
            gv.textContent=Math.round(100*ease)+"+";
            if(p<1)requestAnimationFrame(run);
          })(performance.now());
          gobs.unobserve(e.target);
        }
      });
    },{threshold:.4});
    gobs.observe(gauge);
  }

  /* ── SMOOTH ANCHOR ── */
  var anchorBtn=document.querySelector('.hw-fde a[href="#how-fdes-work"]');
  if(anchorBtn){
    anchorBtn.addEventListener("click",function(ev){
      var target=document.getElementById("how-fdes-work");
      if(target){ev.preventDefault();target.scrollIntoView({behavior:"smooth",block:"start"});}
    });
  }
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":32356,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

(function(){
    var root=document.getElementById('soai-2026');
    if(!root||root.dataset.init)return; root.dataset.init='1';
    root.classList.add('js');
    var mq=window.matchMedia||function(){return{matches:false}};
    var reduce=mq('(prefers-reduced-motion: reduce)').matches;
    var coarse=mq('(pointer: coarse)').matches;

    /* scroll reveal */
    var reveals=root.querySelectorAll('.soai-reveal');
    if('IntersectionObserver' in window && !reduce){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}});},{threshold:.14,rootMargin:'0px 0px -7% 0px'});
      reveals.forEach(function(el){io.observe(el);});
      root.querySelectorAll('.soai-grid,.soai-who').forEach(function(g){
        Array.prototype.forEach.call(g.children,function(c,i){ if(c.classList.contains('soai-reveal')) c.style.transitionDelay=(i*70)+'ms'; });
      });
    } else { reveals.forEach(function(el){el.classList.add('is-in');}); }

    /* count-up (hero chip) */
    function fmt(n){return n.toLocaleString('en-US');}
    function countUp(el){
      var target=parseFloat(el.getAttribute('data-count'))||0;
      var suf=el.getAttribute('data-suffix')||'', pre=el.getAttribute('data-prefix')||'';
      var dur=1500, t0=null;
      function step(t){ if(!t0)t0=t; var p=Math.min((t-t0)/dur,1); var e=1-Math.pow(1-p,3);
        el.textContent=pre+fmt(Math.round(target*e))+suf; if(p<1)requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }
    var counters=root.querySelectorAll('[data-count]');
    if('IntersectionObserver' in window && !reduce){
      counters.forEach(function(el){ el.textContent=(el.getAttribute('data-prefix')||'')+'0'+(el.getAttribute('data-suffix')||''); });
      var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){countUp(e.target);cio.unobserve(e.target);}});},{threshold:.5});
      counters.forEach(function(el){cio.observe(el);});
    }

    /* 3D tilt + parallax chip + sheen + scale */
    if(!reduce && !coarse){
      root.querySelectorAll('[data-tilt]').forEach(function(stage){
        var card=stage.querySelector('.soai-tilt-card');
        var sheen=stage.querySelector('.soai-tilt-sheen');
        var chips=stage.querySelectorAll('.soai-chip,.soai-audio-badge');
        var raf=null;
        stage.addEventListener('mousemove',function(ev){
          var r=stage.getBoundingClientRect();
          var px=(ev.clientX-r.left)/r.width, py=(ev.clientY-r.top)/r.height;
          if(raf)cancelAnimationFrame(raf);
          raf=requestAnimationFrame(function(){
            var rx=(py-.5)*-16, ry=(px-.5)*18;
            card.style.transform='rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg) scale(1.04)';
            if(sheen)sheen.style.background='radial-gradient(460px circle at '+(px*100).toFixed(1)+'% '+(py*100).toFixed(1)+'%, rgba(191,239,239,.34), transparent 46%)';
            chips.forEach(function(c){ var d=parseFloat(c.getAttribute('data-depth'))||14;
              c.style.setProperty('transform','translate3d('+((px-.5)*d).toFixed(1)+'px,'+((py-.5)*d).toFixed(1)+'px,0)','important'); });
          });
        });
        stage.addEventListener('mouseleave',function(){
          card.style.transform='';
          if(sheen)sheen.style.background='';
          chips.forEach(function(c){c.style.removeProperty('transform');});
        });
      });
    }
    /* card cursor glow */
    if(!coarse){
      root.querySelectorAll('.soai-card').forEach(function(c){
        c.addEventListener('mousemove',function(ev){ var r=c.getBoundingClientRect();
          c.style.setProperty('--mx',((ev.clientX-r.left)/r.width*100)+'%');
          c.style.setProperty('--my',((ev.clientY-r.top)/r.height*100)+'%'); });
      });
    }

    /* smooth scroll to form */
    root.querySelectorAll('a[href^="#soai-"]').forEach(function(a){
      a.addEventListener('click',function(e){ var id=a.getAttribute('href').slice(1); var t=document.getElementById(id); if(!t)return;
        e.preventDefault(); var y=t.getBoundingClientRect().top+window.pageYOffset-28;
        window.scrollTo({top:y,behavior:reduce?'auto':'smooth'});
        if(id==='soai-hs-form'){ var f=t.querySelector('input,select,textarea'); if(f)setTimeout(function(){f.focus({preventScroll:true});},reduce?0:520); } });
    });

    /* HubSpot form */
    var hsTarget=document.getElementById('soai-hs-form');
    if(hsTarget){
      var skel=hsTarget.querySelector('.soai-hs-skel');
      if('MutationObserver' in window && skel){
        var mo=new MutationObserver(function(){ if(hsTarget.querySelector('.hs-form, form, iframe')){ skel.remove(); mo.disconnect(); } });
        mo.observe(hsTarget,{childList:true,subtree:true});
      }
      var tries=0;
      function createHs(){
        if(window.hbspt && window.hbspt.forms){
          window.hbspt.forms.create({ portalId:"6632357", formId:"fb759944-3b59-4c1b-a069-ffc2b1c224a4", region:"na1", target:"#soai-hs-form" });
        } else if(tries++ < 50){ setTimeout(createHs,150); }
      }
      if(window.hbspt && window.hbspt.forms){ createHs(); }
      else{
        var s=document.createElement('script');
        s.src="/scripts/hubspot-forms.js"; s.charset="utf-8"; s.async=true;
        s.onload=createHs; s.onerror=createHs;
        document.head.appendChild(s);
        setTimeout(createHs,600);
      }
    }
  })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":36050,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

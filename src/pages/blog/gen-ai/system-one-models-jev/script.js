(function(){
  /* Tabs + probability bars */
  var demo=document.getElementById('hwj-demo');
  if(demo){
    var tabs=demo.querySelectorAll('.hwj-tab');
    var fillBars=function(){demo.querySelectorAll('#hwj-panel-jev .hwj-bar-fill').forEach(function(b){b.style.width=b.getAttribute('data-w')+'%';});};
    var resetBars=function(){demo.querySelectorAll('#hwj-panel-jev .hwj-bar-fill').forEach(function(b){b.style.width='0';});};
    var select=function(t){
      tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;document.getElementById(x.getAttribute('aria-controls')).hidden=!on;});
      if(t.id==='hwj-tab-jev'){resetBars();setTimeout(fillBars,40);}
    };
    tabs.forEach(function(t,i){
      t.addEventListener('click',function(){select(t);});
      t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowLeft'){var n=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];n.focus();select(n);}});
    });
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){fillBars();io.disconnect();}});},{threshold:.3});
      io.observe(demo);
    } else { fillBars(); }
  }

  /* Flow diagram */
  var flow=document.getElementById('hwj-flow');
  if(flow){
    var det=document.getElementById('hwj-flow-detail');
    flow.querySelectorAll('.hwj-flow-node').forEach(function(n){
      n.addEventListener('click',function(){
        flow.querySelectorAll('.hwj-flow-node').forEach(function(m){m.setAttribute('aria-pressed','false');});
        n.setAttribute('aria-pressed','true');
        det.innerHTML=n.getAttribute('data-d');
      });
    });
  }

  /* Calculator */
  var calc=document.getElementById('hwj-calc');
  if(calc){
    var v=function(id){var x=parseFloat(document.getElementById(id).value);return isNaN(x)?0:x;};
    var money=function(x){return '$'+(x<1?x.toFixed(3):x.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}));};
    var run=function(){
      var n=v('hwj-n'),err=v('hwj-err'),sla=v('hwj-sla');
      var calcOne=function(p){
        var acc=Math.min(Math.max(v('hwj-'+p+'-acc'),0),100)/100;
        var spend=n*v('hwj-'+p+'-cost')/1000;
        var wrong=n*(1-acc);
        var ok=n*acc;
        return {cps:ok>0?(spend+wrong*err)/ok:Infinity,spend:spend,wrong:wrong,lat:v('hwj-'+p+'-lat')};
      };
      var r={a:calcOne('a'),b:calcOne('b')};
      ['a','b'].forEach(function(p){
        var el=document.getElementById('hwj-res-'+p),d=r[p];
        el.querySelector('.hwj-r-val').textContent=isFinite(d.cps)?money(d.cps)+' per correct decision':'n/a';
        el.querySelector('.hwj-r-meta').textContent='Model spend '+money(d.spend)+' / month · '+Math.round(d.wrong).toLocaleString()+' wrong decisions';
        var w=el.querySelector('.hwj-r-warn');if(w)w.remove();
        if(d.lat>sla){var s=document.createElement('span');s.className='hwj-r-warn';s.textContent='Misses the '+sla+' ms latency requirement';el.appendChild(s);}
      });
      var okA=r.a.lat<=sla,okB=r.b.lat<=sla;
      var winA=(okA&&!okB)||(okA===okB&&r.a.cps<=r.b.cps);
      document.getElementById('hwj-res-a').classList.toggle('is-win',winA);
      document.getElementById('hwj-res-b').classList.toggle('is-win',!winA);
    };
    calc.querySelectorAll('input').forEach(function(i){i.addEventListener('input',run);});
    run();
  }

  /* Readiness checklist */
  var chk=document.getElementById('hwj-check');
  if(chk){
    var boxes=chk.querySelectorAll('input[type=checkbox]');
    var msgs=['Start with context and evaluation before adding any new model.','Start with context and evaluation before adding any new model.','Foundations are forming. Close the evaluation and policy gaps before a pilot.','Foundations are forming. Close the evaluation and policy gaps before a pilot.','You could run a shadow-mode pilot on one bounded decision.','You could run a shadow-mode pilot on one bounded decision.','Your stack is ready to test a decision model against a real baseline.'];
    var upd=function(){
      var c=0;boxes.forEach(function(b){if(b.checked)c++;});
      document.getElementById('hwj-meter-fill').style.width=(c/boxes.length*100)+'%';
      document.getElementById('hwj-meter-msg').textContent=c+' of '+boxes.length+' in place. '+msgs[c];
    };
    boxes.forEach(function(b){b.addEventListener('change',upd);});
  }
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":37113,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":3017,"estimatedReadTimeSeconds":761,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

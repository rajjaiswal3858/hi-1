(function(){
  var root=document.getElementById('geneq');
  if(!root||root.dataset.gqInit)return;root.dataset.gqInit='1';
  var RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- CTA final: formulario HubSpot desplegable ---- */
  var btn=document.getElementById('gqCtaToggle'),panel=document.getElementById('gqCtaPanel'),loaded=false;
  if(btn&&panel){
    btn.addEventListener('click',function(){
      var isOpen=panel.classList.contains('open');
      panel.classList.toggle('open');btn.classList.toggle('open');
      if(!isOpen&&!loaded&&window.hbspt){
        loaded=true;
        hbspt.forms.create({portalId:"6632357",formId:"9ba971f2-6cc7-485d-8907-c7afc61ba714",region:"na1",target:"#gqCtaForm"});
      }
    });
  }

  /* ---- scroll wash ---- */
  var K=[{base:[16,20,26],t:[12,-6,.085],b:[92,108,.055]},
         {base:[13,17,23],t:[78,18,.07],b:[8,82,.075]},
         {base:[10,14,20],t:[22,86,.06],b:[88,12,.095]},
         {base:[15,19,25],t:[50,104,.095],b:[50,-8,.055]}];
  function lerp(a,b,t){return a+(b-a)*t}
  function apply(p){
    var seg=Math.min(K.length-2,Math.floor(p*(K.length-1))),t=p*(K.length-1)-seg,A=K[seg],B=K[seg+1];
    var c=A.base.map(function(v,i){return Math.round(lerp(v,B.base[i],t))});
    var s=root.style;
    s.setProperty('--gq-base','rgb('+c.join(',')+')');
    s.setProperty('--gq-tx',lerp(A.t[0],B.t[0],t).toFixed(1)+'%');
    s.setProperty('--gq-ty',lerp(A.t[1],B.t[1],t).toFixed(1)+'%');
    s.setProperty('--gq-ta',lerp(A.t[2],B.t[2],t).toFixed(4));
    s.setProperty('--gq-bx',lerp(A.b[0],B.b[0],t).toFixed(1)+'%');
    s.setProperty('--gq-by',lerp(A.b[1],B.b[1],t).toFixed(1)+'%');
    s.setProperty('--gq-ba',lerp(A.b[2],B.b[2],t).toFixed(4));
  }
  function progress(){
    var r=root.getBoundingClientRect(),max=r.height-window.innerHeight;
    if(max<=0)return 0;
    var p=-r.top/max;return p<0?0:p>1?1:p;
  }
  var target=progress(),current=target,raf=0;
  apply(current);
  function settle(){
    raf=0;current+=(target-current)*.12;apply(current);
    if(Math.abs(target-current)>.0008)raf=requestAnimationFrame(settle);else{current=target;apply(current)}
  }
  function onScroll(){
    target=progress();
    if(RM){current=target;apply(current);return}
    if(!raf)raf=requestAnimationFrame(settle);
  }
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',onScroll,{passive:true});

  /* ---- hero particle network ---- */
  var host=document.getElementById('gq-hero'),c=document.getElementById('gqHeroCanvas');
  if(!host||!c)return;
  var ctx=c.getContext('2d'),W=0,H=0,pts=[],mx=-9e3,my=-9e3,praf=0,running=false,md=[];
  var LINK=140,LINK2=LINK*LINK;
  function size(){
    var DPR=Math.min(window.devicePixelRatio||1,2);
    W=host.offsetWidth;H=host.offsetHeight;
    c.width=Math.round(W*DPR);c.height=Math.round(H*DPR);
    c.style.width=W+'px';c.style.height=H+'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
    var n=Math.max(28,Math.min(W<760?55:90,Math.round(W*H/9000)));
    pts=[];
    for(var i=0;i<n;i++){
      var r=Math.random(),big=r<.05,med=r>=.05&&r<.18,v=big?.005:med?.008:.012;
      pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*v,vy:(Math.random()-.5)*v,r:big?3.5:med?1.8:Math.random()*.6+.5,big:big,med:med});
    }
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    var i,j;
    for(i=0;i<pts.length;i++)md[i]=Math.hypot(pts[i].x-mx,pts[i].y-my);
    for(i=0;i<pts.length;i++){var a=pts[i];
      for(j=i+1;j<pts.length;j++){var b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d2=dx*dx+dy*dy;
        if(d2>=LINK2)continue;
        var d=Math.sqrt(d2),nr=md[i]<md[j]?md[i]:md[j],o=.2*(1-d/LINK);
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
        ctx.strokeStyle=nr<160?'rgba(191,239,239,'+(o*1.3)+')':'rgba(58,189,188,'+o+')';
        ctx.lineWidth=(a.big||b.big)?.9:(a.med||b.med)?.6:.4;ctx.stroke();
      }}
    for(i=0;i<pts.length;i++){var p=pts[i];
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<-10)p.x=W+10;if(p.x>W+10)p.x=-10;if(p.y<-10)p.y=H+10;if(p.y>H+10)p.y=-10;
      var dm=md[i];
      if(dm<120&&dm>0){var f=.004*(120-dm);p.vx+=(p.x-mx)/dm*f;p.vy+=(p.y-my)/dm*f;
        var sp=Math.hypot(p.vx,p.vy);if(sp>.8){p.vx*=.8/sp;p.vy*=.8/sp}}
      if(p.big){ctx.beginPath();ctx.arc(p.x,p.y,p.r+4,0,Math.PI*2);ctx.fillStyle='rgba(58,189,188,.12)';ctx.fill()}
      if(p.med){ctx.beginPath();ctx.arc(p.x,p.y,p.r+2,0,Math.PI*2);ctx.fillStyle='rgba(58,189,188,.07)';ctx.fill()}
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.big?'rgba(58,189,188,.55)':p.med?'rgba(58,189,188,.4)':'rgba(255,255,255,.25)';ctx.fill();
    }
    praf=requestAnimationFrame(draw);
  }
  function start(){if(!running&&!RM){running=true;praf=requestAnimationFrame(draw)}}
  function stop(){running=false;cancelAnimationFrame(praf)}
  size();
  var rt;
  addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(size,160)},{passive:true});
  host.addEventListener('mousemove',function(e){var r=host.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top},{passive:true});
  host.addEventListener('mouseleave',function(){mx=my=-9e3});
  host.addEventListener('touchmove',function(e){var t=e.touches[0],r=host.getBoundingClientRect();mx=t.clientX-r.left;my=t.clientY-r.top},{passive:true});
  host.addEventListener('touchend',function(){mx=my=-9e3});
  if('IntersectionObserver' in window){new IntersectionObserver(function(es){es[0].isIntersecting?start():stop()},{threshold:0}).observe(host)}else{start()}
  document.addEventListener('visibilitychange',function(){document.hidden?stop():start()});
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":36279,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

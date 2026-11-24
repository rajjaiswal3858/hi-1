(function(){
  var html=document.documentElement;
  if(html.dataset.gdBg) return;
  html.dataset.gdBg='1';

  /* the layer must be a child of <body> for z-index:-1 to sit behind content */
  var layer=document.getElementById('gendd-bg');
  if(layer && layer.parentNode!==document.body) document.body.appendChild(layer);

  /* Four brand-safe stops: Neural Black → deep blue-black → back.
     Teal + Link Blue glows only, no multicolour. */
  var K=[
    {base:[21,25,32], t:[12,-6,.075], b:[92,108,.05 ]},
    {base:[18,23,31], t:[78, 18,.06 ], b:[ 8, 82,.07 ]},
    {base:[15,21,28], t:[22, 86,.05 ], b:[88, 12,.085]},
    {base:[20,26,34], t:[50,104,.085], b:[50, -8,.05 ]}
  ];

  function lerp(a,b,t){return a+(b-a)*t}
  function apply(p){
    lastApply=performance.now();
    var seg=Math.min(K.length-2,Math.floor(p*(K.length-1)));
    var t=p*(K.length-1)-seg;
    var A=K[seg],B=K[seg+1];
    var r=Math.round(lerp(A.base[0],B.base[0],t)),
        g=Math.round(lerp(A.base[1],B.base[1],t)),
        bl=Math.round(lerp(A.base[2],B.base[2],t));
    html.style.setProperty('--gd-base','rgb('+r+','+g+','+bl+')');
    html.style.setProperty('--gd-tx',lerp(A.t[0],B.t[0],t).toFixed(1)+'%');
    html.style.setProperty('--gd-ty',lerp(A.t[1],B.t[1],t).toFixed(1)+'%');
    html.style.setProperty('--gd-ta',lerp(A.t[2],B.t[2],t).toFixed(4));
    html.style.setProperty('--gd-bx',lerp(A.b[0],B.b[0],t).toFixed(1)+'%');
    html.style.setProperty('--gd-by',lerp(A.b[1],B.b[1],t).toFixed(1)+'%');
    html.style.setProperty('--gd-ba',lerp(A.b[2],B.b[2],t).toFixed(4));
  }

  var target=0,current=0,rafId=0,lastApply=0;
  var RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function progress(){
    var max=(document.documentElement.scrollHeight||1)-window.innerHeight;
    if(max<=0) return 0;
    var p=(window.pageYOffset||document.documentElement.scrollTop)/max;
    return p<0?0:p>1?1:p;
  }

  /* eased follow so the wash drifts rather than snapping with the scrollbar.
     rafId is cleared before the work, and onScroll falls back to an immediate
     apply if a frame hasn't landed recently — so a throttled or backgrounded
     rAF can never leave the wash stuck. */
  function settle(){
    rafId=0;
    current+=(target-current)*.12;
    apply(current);
    if(Math.abs(target-current)>.0008){rafId=requestAnimationFrame(settle)}
    else{current=target;apply(current)}
  }

  function onScroll(){
    target=progress();
    if(RM||performance.now()-lastApply>250){
      current=target;apply(current);
      if(rafId){cancelAnimationFrame(rafId);rafId=0}
      return;
    }
    if(!rafId) rafId=requestAnimationFrame(settle);
  }

  current=target=progress();
  apply(current);
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
})();
;
(function(){
const root=document.getElementById('gendd-hero-min');
const RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const c=document.getElementById('ghmC'),ctx=c.getContext('2d');
let W,H,DPR=1,pts=[],mx=-9e3,my=-9e3,raf=0,running=false;

function rz(){
  DPR=Math.min(window.devicePixelRatio||1,2);
  W=root.offsetWidth;H=root.offsetHeight;
  c.width=Math.round(W*DPR);c.height=Math.round(H*DPR);
  c.style.width=W+'px';c.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  const n=Math.max(28,Math.min(W<760?55:90,Math.round(W*H/9000)));
  pts=[];
  for(let i=0;i<n;i++){
    const r=Math.random();const big=r<.05;const med=r>=.05&&r<.18;
    pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*(big?.005:med?.008:.012),vy:(Math.random()-.5)*(big?.005:med?.008:.012),r:big?3.5:med?1.8:Math.random()*.6+.5,big,med});
  }
}
const LINK=140,LINK2=LINK*LINK;
let md=[];
function dr(){
  ctx.clearRect(0,0,W,H);
  /* distance-to-cursor once per point, not once per pair */
  for(let i=0;i<pts.length;i++){const a=pts[i];md[i]=Math.hypot(a.x-mx,a.y-my)}
  for(let i=0;i<pts.length;i++){const a=pts[i];
    for(let j=i+1;j<pts.length;j++){const b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d2=dx*dx+dy*dy;
      if(d2<LINK2){const d=Math.sqrt(d2);const nr=md[i]<md[j]?md[i]:md[j];const o=.2*(1-d/LINK);const lw=(a.big||b.big)?.9:(a.med||b.med)?.6:.4;
        const cl=nr<160?`rgba(191,239,239,${o*1.3})`:`rgba(58,189,188,${o})`;
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=cl;ctx.lineWidth=lw;ctx.stroke()}}}
  for(let i=0;i<pts.length;i++){const a=pts[i];a.x+=a.vx;a.y+=a.vy;
    if(a.x<-10)a.x=W+10;if(a.x>W+10)a.x=-10;if(a.y<-10)a.y=H+10;if(a.y>H+10)a.y=-10;
    const dm=md[i];
    if(dm<120&&dm>0){const f=.004*(120-dm);a.vx+=(a.x-mx)/dm*f;a.vy+=(a.y-my)/dm*f;const s=Math.hypot(a.vx,a.vy);if(s>.8){a.vx*=.8/s;a.vy*=.8/s}}
    if(a.big){ctx.beginPath();ctx.arc(a.x,a.y,a.r+4,0,Math.PI*2);ctx.fillStyle='rgba(58,189,188,.12)';ctx.fill()}
    if(a.med){ctx.beginPath();ctx.arc(a.x,a.y,a.r+2,0,Math.PI*2);ctx.fillStyle='rgba(58,189,188,.07)';ctx.fill()}
    ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fillStyle=a.big?'rgba(58,189,188,.55)':a.med?'rgba(58,189,188,.4)':'rgba(255,255,255,.25)';ctx.fill()}
  raf=requestAnimationFrame(dr);
}
function start(){if(!running&&!RM){running=true;raf=requestAnimationFrame(dr)}}
function stop(){running=false;cancelAnimationFrame(raf)}

rz();
let rt;
window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(rz,160)},{passive:true});
root.addEventListener('mousemove',e=>{const r=root.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top},{passive:true});
root.addEventListener('mouseleave',()=>{mx=my=-9e3});
root.addEventListener('touchmove',e=>{const t=e.touches[0],r=root.getBoundingClientRect();mx=t.clientX-r.left;my=t.clientY-r.top},{passive:true});
root.addEventListener('touchend',()=>{mx=my=-9e3});
root.addEventListener('click',e=>{
  if(RM)return;
  const r=root.getBoundingClientRect(),cx=e.clientX-r.left,cy=e.clientY-r.top;
  let el=document.createElement('div');
  el.style.cssText=`position:absolute;left:${cx}px;top:${cy}px;width:0;height:0;border-radius:50%;border:1.5px solid rgba(58,189,188,.4);pointer-events:none;z-index:5;transform:translate(-50%,-50%);transition:width .5s ease-out,height .5s ease-out,opacity .5s ease-out;opacity:1`;
  root.appendChild(el);
  requestAnimationFrame(()=>{el.style.width='180px';el.style.height='180px';el.style.opacity='0'});
  setTimeout(()=>el.remove(),600);
});
if('IntersectionObserver' in window){
  new IntersectionObserver(es=>{es[0].isIntersecting?start():stop()},{threshold:0}).observe(root);
}else{start()}
document.addEventListener('visibilitychange',()=>{document.hidden?stop():start()});

function animateCounters(){
  root.querySelectorAll('.stat-val[data-target]').forEach(el=>{
    const target=parseFloat(el.dataset.target);
    const suffix=el.dataset.suffix||'';
    const prefix=el.dataset.prefix||'';
    const isDecimal=el.dataset.decimal==='true';
    if(RM){el.textContent=prefix+(isDecimal?target.toFixed(1):target)+suffix;return}
    const duration=1400;
    const start=performance.now();
    function tick(now){
      const p=Math.min((now-start)/duration,1);
      const ease=1-Math.pow(1-p,3);
      const val=ease*target;
      el.textContent=prefix+(isDecimal?val.toFixed(1):Math.round(val))+suffix;
      if(p<1)requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* Hero is above the fold — reveal on load, not on scroll */
requestAnimationFrame(()=>requestAnimationFrame(()=>{
  root.querySelectorAll('.a').forEach(el=>el.classList.add('v'));
  setTimeout(animateCounters,600);
}));

/* Secondary CTA — smooth scroll to the "how it works" section.
   Add the CSS ID "gendd-how" to that Elementor section for this to work. */
root.querySelectorAll('[data-ghm-scroll]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(!t) return;
    e.preventDefault();
    window.scrollTo({top:t.getBoundingClientRect().top+window.pageYOffset-90,behavior:RM?'auto':'smooth'});
  });
});
})();
;
(function(){
var obs=new IntersectionObserver(function(es){
  for(var i=0;i<es.length;i++){if(es[i].isIntersecting){es[i].target.classList.add('gg-v');obs.unobserve(es[i].target)}}
},{threshold:0.08});
var a=document.querySelectorAll('#gendd-gap .gg-a');
for(var i=0;i<a.length;i++) obs.observe(a[i]);
})();
;
(function(){
var root=document.getElementById('gendd-quadrant');
var cells=root.querySelectorAll('.gq-cell');
var chart=root.querySelector('.gq-chart');
var activeQ=null;
var hideTimeout=null;

/* Desktop tooltip elements */
var tip=document.getElementById('gqTip');
var tDot=document.getElementById('gqTDot');
var tName=document.getElementById('gqTName');
var tDesc=document.getElementById('gqTDesc');
var tTag=document.getElementById('gqTTag');

/* Mobile info bar elements */
var infoBar=document.getElementById('gqInfo');
var iDot=document.getElementById('gqIDot');
var iName=document.getElementById('gqIName');
var iDesc=document.getElementById('gqIDesc');
var iTag=document.getElementById('gqITag');
var iPlaceholder=document.getElementById('gqIPlaceholder');

var info={
  ai:{name:'AI-assisted development',desc:'Faster individuals working within the same delivery model.',tag:'Low Speed · High Risk',color:'#c8943a',bg:'rgba(200,148,58,.1)',border:'rgba(200,148,58,.15)'},
  vibe:{name:'Vibe coding',desc:'Rapid output with greater risk around quality, security, and maintainability.',tag:'High Speed · High Risk',color:'#d45040',bg:'rgba(212,80,64,.1)',border:'rgba(212,80,64,.15)'},
  trad:{name:'Traditional development',desc:'Strong control, but conventional delivery speed.',tag:'Low Speed · Low Risk',color:'#e05545',bg:'rgba(224,85,69,.1)',border:'rgba(224,85,69,.15)'},
  gendd:{name:'GenDD',desc:'Faster delivery with production-grade controls built into the process.',tag:'High Speed · Low Risk',color:'#3abdbc',bg:'rgba(58,189,188,.1)',border:'rgba(58,189,188,.15)'}
};

function isMobile(){return window.innerWidth<=700}

function showDesktopTip(q,cellEl){
  var d=info[q];if(!d)return;
  tDot.style.background=d.color;
  tName.textContent=d.name;
  tName.style.color=d.color;
  tDesc.textContent=d.desc;
  tTag.textContent=d.tag;
  tTag.style.background=d.bg;
  tTag.style.color=d.color;
  tTag.style.border='1px solid '+d.border;

  var cr=cellEl.getBoundingClientRect();
  var pr=chart.getBoundingClientRect();
  var cellLeft=cr.left-pr.left;
  var cellTop=cr.top-pr.top;
  var tipW=Math.max(180,Math.min(260,cr.width*.82));
  var tx=cellLeft+(cr.width-tipW)/2;

  tip.style.width=tipW+'px';
  tip.style.left=tx+'px';
  tip.classList.add('show');

  requestAnimationFrame(function(){
    var tipH=tip.offsetHeight;
    var ty=cellTop+(cr.height-tipH)/2;
    if(ty<cellTop+6) ty=cellTop+6;
    if(ty+tipH>cellTop+cr.height-6) ty=cellTop+cr.height-tipH-6;
    tip.style.top=ty+'px';
  });
}

function hideDesktopTip(){
  tip.classList.remove('show');
}

function showMobileInfo(q){
  var d=info[q];if(!d)return;
  iPlaceholder.style.display='none';
  iName.style.display='';iDesc.style.display='';iTag.style.display='';
  iDot.style.background=d.color;
  iName.textContent=d.name;
  iName.style.color=d.color;
  iDesc.textContent=d.desc;
  iTag.textContent=d.tag;
  iTag.style.background=d.bg;
  iTag.style.color=d.color;
  iTag.style.border='1px solid '+d.border;
  infoBar.classList.add('active');
}

function hideMobileInfo(){
  infoBar.classList.remove('active');
  iPlaceholder.style.display='';
  iName.style.display='none';iDesc.style.display='none';iTag.style.display='none';
  iDot.style.background='rgba(255,255,255,.15)';
}

function activate(q,cellEl){
  if(hideTimeout){clearTimeout(hideTimeout);hideTimeout=null}
  activeQ=q;
  for(var i=0;i<cells.length;i++) cells[i].classList.toggle('on',cells[i].getAttribute('data-q')===q);
  if(isMobile()){
    showMobileInfo(q);
  } else {
    showDesktopTip(q,cellEl);
  }
}

function deactivate(){
  hideTimeout=setTimeout(function(){
    activeQ=null;
    for(var i=0;i<cells.length;i++) cells[i].classList.remove('on');
    hideDesktopTip();
    hideMobileInfo();
    hideTimeout=null;
  },80);
}

function deactivateNow(){
  if(hideTimeout){clearTimeout(hideTimeout);hideTimeout=null}
  activeQ=null;
  for(var i=0;i<cells.length;i++) cells[i].classList.remove('on');
  hideDesktopTip();
  hideMobileInfo();
}

/* Hover for desktop */
for(var i=0;i<cells.length;i++){
  (function(cell){
    cell.addEventListener('mouseenter',function(){
      if(!isMobile()) activate(cell.getAttribute('data-q'),cell);
    });
    cell.addEventListener('mouseleave',function(){
      if(!isMobile()) deactivate();
    });
    /* Tap for mobile */
    cell.addEventListener('click',function(e){
      e.stopPropagation();
      var q=cell.getAttribute('data-q');
      if(activeQ===q){deactivateNow()}
      else{activate(q,cell)}
    });
  })(cells[i]);
}

tip.addEventListener('mouseenter',function(){
  if(hideTimeout){clearTimeout(hideTimeout);hideTimeout=null}
});
tip.addEventListener('mouseleave',function(){
  deactivate();
});

document.addEventListener('click',function(){
  if(activeQ) deactivateNow();
});

/* Entrance */
var obs=new IntersectionObserver(function(entries){
  for(var i=0;i<entries.length;i++){
    if(entries[i].isIntersecting){entries[i].target.classList.add('gq-v');obs.unobserve(entries[i].target)}
  }
},{threshold:0.08});
var anims=root.querySelectorAll('.gq-a');
for(var i=0;i<anims.length;i++) obs.observe(anims[i]);
})();
;
(function(){
var obs=new IntersectionObserver(function(es){
  for(var i=0;i<es.length;i++){if(es[i].isIntersecting){es[i].target.classList.add('gt-v');obs.unobserve(es[i].target)}}
},{threshold:0.08});
var a=document.querySelectorAll('#gendd-stage .gt-a');
for(var i=0;i<a.length;i++) obs.observe(a[i]);
})();
;
(function(){
var obs=new IntersectionObserver(function(es){
  for(var i=0;i<es.length;i++){if(es[i].isIntersecting){es[i].target.classList.add('gm-v');obs.unobserve(es[i].target)}}
},{threshold:0.08});
var a=document.querySelectorAll('#gendd-mmk .gm-a');
for(var i=0;i<a.length;i++) obs.observe(a[i]);
})();
;
(function(){
var obs=new IntersectionObserver(function(es){
  for(var i=0;i<es.length;i++){if(es[i].isIntersecting){es[i].target.classList.add('gv-v');obs.unobserve(es[i].target)}}
},{threshold:0.08});
var a=document.querySelectorAll('#gendd-value .gv-a');
for(var i=0;i<a.length;i++) obs.observe(a[i]);
})();
;
(function(){
var RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

var obs=new IntersectionObserver(function(es){
  for(var i=0;i<es.length;i++){if(es[i].isIntersecting){es[i].target.classList.add('gw-v');obs.unobserve(es[i].target)}}
},{threshold:0.08});
var a=document.querySelectorAll('#gendd-ways .gw-a');
for(var i=0;i<a.length;i++) obs.observe(a[i]);

if(RM) return;

function boot(id,step){
  var c=document.getElementById(id);if(!c)return;
  var ctx=c.getContext('2d'),W=0,H=0,DPR=1,raf=0,running=false;
  function rz(){
    var r=c.parentElement.getBoundingClientRect();
    DPR=Math.min(window.devicePixelRatio||1,2);
    W=r.width;H=r.height;
    c.width=Math.round(W*DPR);c.height=Math.round(H*DPR);
    ctx.setTransform(DPR,0,0,DPR,0,0);
    if(step.reset) step.reset(W,H);
  }
  function frame(){ctx.clearRect(0,0,W,H);step.draw(ctx,W,H);raf=requestAnimationFrame(frame)}
  function start(){if(!running){running=true;rz();raf=requestAnimationFrame(frame)}}
  function stop(){running=false;cancelAnimationFrame(raf)}
  rz();
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(rz,160)},{passive:true});
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){es[0].isIntersecting?start():stop()},{threshold:0}).observe(c);
  }else{start()}
  document.addEventListener('visibilitychange',function(){document.hidden?stop():start()});
}

/* 1: EMBED — one agent joining an existing orbit */
var t0=0;
boot('gwAnim0',{
  draw:function(ctx,W,H){
    t0+=.008;var cx=W/2,cy=H/2,r=Math.min(W,H)*.3;
    var x1=cx+Math.cos(t0)*r,y1=cy+Math.sin(t0)*r*.6;
    var x2=cx+Math.cos(t0+Math.PI)*r,y2=cy+Math.sin(t0+Math.PI)*r*.6;
    ctx.beginPath();ctx.ellipse(cx,cy,r,r*.6,0,0,6.28);ctx.strokeStyle='rgba(58,189,188,.08)';ctx.lineWidth=1;ctx.stroke();
    ctx.beginPath();ctx.arc(x1,y1,5,0,6.28);ctx.fillStyle='rgba(58,189,188,.5)';ctx.fill();
    ctx.beginPath();ctx.arc(x1,y1,8,0,6.28);ctx.fillStyle='rgba(58,189,188,.1)';ctx.fill();
    ctx.beginPath();ctx.arc(x2,y2,4,0,6.28);ctx.fillStyle='rgba(255,255,255,.3)';ctx.fill();
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle='rgba(58,189,188,.06)';ctx.lineWidth=.5;ctx.setLineDash([3,4]);ctx.stroke();ctx.setLineDash([]);
  }
});

/* 2: ESTABLISH — a grid coming up across the org */
var t1=0;
boot('gwAnim1',{
  draw:function(ctx,W,H){
    t1+=.003;var cols=5,rows=3,gx=W/(cols+1),gy=H/(rows+1);
    for(var i=1;i<=cols;i++){for(var j=1;j<=rows;j++){
      var x=gx*i,y=gy*j,pulse=Math.sin(t1*2+i*.7+j*.5)*.5+.5,sz=2+pulse*2;
      ctx.beginPath();ctx.arc(x,y,sz,0,6.28);ctx.fillStyle='rgba(113,199,210,'+(pulse*.35+.1)+')';ctx.fill();
      if(i<cols){ctx.beginPath();ctx.moveTo(x+sz,y);ctx.lineTo(gx*(i+1)-sz,y);ctx.strokeStyle='rgba(113,199,210,'+(pulse*.06+.02)+')';ctx.lineWidth=.5;ctx.stroke()}
      if(j<rows){ctx.beginPath();ctx.moveTo(x,y+sz);ctx.lineTo(x,gy*(j+1)-sz);ctx.strokeStyle='rgba(113,199,210,'+(pulse*.06+.02)+')';ctx.lineWidth=.5;ctx.stroke()}
    }}
  }
});

/* 3: OWN — a pod converging on one delivered outcome */
var t2=0;
boot('gwAnim2',{
  draw:function(ctx,W,H){
    t2+=.01;var cx=W/2,cy=H/2,r=Math.min(W,H)*.28,pulseR=3+Math.sin(t2*2)*1.5;
    var angles=[-.5,-2.6,-4.7];
    ctx.beginPath();ctx.arc(cx,cy,pulseR+8,0,6.28);ctx.fillStyle='rgba(58,189,188,'+(Math.sin(t2*2)*.06+.04)+')';ctx.fill();
    ctx.beginPath();ctx.arc(cx,cy,pulseR,0,6.28);ctx.fillStyle='rgba(58,189,188,.4)';ctx.fill();
    for(var i=0;i<3;i++){
      var ang=angles[i]+t2*.3;
      var x=cx+Math.cos(ang)*r,y=cy+Math.sin(ang)*r*.65;
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(cx,cy);ctx.strokeStyle='rgba(58,189,188,.1)';ctx.lineWidth=1;ctx.stroke();
      var tp=(t2*1.5+i*2.1)%1;
      ctx.beginPath();ctx.arc(x+(cx-x)*tp,y+(cy-y)*tp,1.5,0,6.28);ctx.fillStyle='rgba(58,189,188,.5)';ctx.fill();
      ctx.beginPath();ctx.arc(x,y,4,0,6.28);ctx.fillStyle='rgba(58,189,188,.35)';ctx.fill();
      ctx.beginPath();ctx.arc(x,y,7,0,6.28);ctx.fillStyle='rgba(58,189,188,.08)';ctx.fill();
    }
    for(var k=0;k<5;k++){
      var pa=(t2*2+k*1.3)%3;if(pa>1)continue;
      ctx.beginPath();ctx.arc(cx+10+pa*r*.8,cy+Math.sin(t2+k*1.7)*8,1+pa,0,6.28);
      ctx.fillStyle='rgba(58,189,188,'+(.3*(1-pa))+')';ctx.fill();
    }
  }
});
})();
;
(function(){
var obs=new IntersectionObserver(function(entries){
  for(var i=0;i<entries.length;i++){
    if(entries[i].isIntersecting){entries[i].target.classList.add('gp-v');obs.unobserve(entries[i].target)}
  }
},{threshold:0.08});
var anims=document.querySelectorAll('#gendd-proof .gp-a');
for(var i=0;i<anims.length;i++) obs.observe(anims[i]);
})();
;
(function(){
var obs=new IntersectionObserver(function(es){
  for(var i=0;i<es.length;i++){if(es[i].isIntersecting){es[i].target.classList.add('gj-v');obs.unobserve(es[i].target)}}
},{threshold:0.08});
var a=document.querySelectorAll('#gendd-journey .gj-a');
for(var i=0;i<a.length;i++) obs.observe(a[i]);
var L=document.querySelectorAll('#gendd-journey .gj-cta-logo');
for(var j=0;j<L.length;j++){var u=L[j].getAttribute('data-logo');if(u){L[j].src=u;L[j].hidden=false;var w=L[j].parentNode.querySelector('.gj-cta-wm');if(w)w.style.display='none'}}
})();
;
(function(){
var btn=document.getElementById('gcToggle');
var panel=document.getElementById('gcPanel');
var loaded=false;

btn.addEventListener('click',function(){
  var isOpen=panel.classList.contains('open');
  panel.classList.toggle('open');
  btn.classList.toggle('open');
  if(!isOpen&&!loaded&&window.hbspt){
    loaded=true;
    hbspt.forms.create({
      portalId:"6632357",
      formId:"9ba971f2-6cc7-485d-8907-c7afc61ba714",
      region:"na1",
      target:"#gcHsForm"
    });
  }
});

var obs=new IntersectionObserver(function(entries){
  for(var i=0;i<entries.length;i++){
    if(entries[i].isIntersecting){entries[i].target.classList.add('gc-v');obs.unobserve(entries[i].target)}
  }
},{threshold:0.08});
var anims=document.querySelectorAll('#gendd-cta .gc-a');
for(var i=0;i<anims.length;i++) obs.observe(anims[i]);
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":30343,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

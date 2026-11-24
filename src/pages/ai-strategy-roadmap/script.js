(function(){
  var html=document.documentElement;
  if(html.dataset.grBg) return;
  html.dataset.grBg='1';

  var layer=document.getElementById('genroi-bg');
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
  var appliedAt=-1;
  function apply(p){
    lastApply=performance.now();
    /* Quantize: repainting two viewport-sized radial gradients is the most
       expensive thing on the page, so skip sub-perceptual steps. */
    var q=Math.round(p*400);
    if(q===appliedAt) return;
    appliedAt=q;
    var seg=Math.min(K.length-2,Math.floor(p*(K.length-1)));
    var t=p*(K.length-1)-seg;
    var A=K[seg],B=K[seg+1];
    var r=Math.round(lerp(A.base[0],B.base[0],t)),
        g=Math.round(lerp(A.base[1],B.base[1],t)),
        bl=Math.round(lerp(A.base[2],B.base[2],t));
    html.style.setProperty('--gr-base','rgb('+r+','+g+','+bl+')');
    html.style.setProperty('--gr-tx',lerp(A.t[0],B.t[0],t).toFixed(1)+'%');
    html.style.setProperty('--gr-ty',lerp(A.t[1],B.t[1],t).toFixed(1)+'%');
    html.style.setProperty('--gr-ta',lerp(A.t[2],B.t[2],t).toFixed(4));
    html.style.setProperty('--gr-bx',lerp(A.b[0],B.b[0],t).toFixed(1)+'%');
    html.style.setProperty('--gr-by',lerp(A.b[1],B.b[1],t).toFixed(1)+'%');
    html.style.setProperty('--gr-ba',lerp(A.b[2],B.b[2],t).toFixed(4));
  }

  var target=0,current=0,rafId=0,lastApply=0;
  var RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function progress(){
    var max=(document.documentElement.scrollHeight||1)-window.innerHeight;
    if(max<=0) return 0;
    var p=(window.pageYOffset||document.documentElement.scrollTop)/max;
    return p<0?0:p>1?1:p;
  }

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
const root=document.getElementById('genroi-hero');
const RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const c=document.getElementById('grhC'),ctx=c.getContext('2d');
let W,H,DPR=1,pts=[],mx=-9e3,my=-9e3,raf=0,running=false;

function rz(){
  DPR=Math.min(window.devicePixelRatio||1,2);
  W=root.offsetWidth;H=root.offsetHeight;
  c.width=Math.round(W*DPR);c.height=Math.round(H*DPR);
  c.style.width=W+'px';c.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  const n=Math.max(24,Math.min(W<760?40:70,Math.round(W*H/11000)));
  pts=[];
  for(let i=0;i<n;i++){
    const r=Math.random();const big=r<.05;const med=r>=.05&&r<.18;
    pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*(big?.005:med?.008:.012),vy:(Math.random()-.5)*(big?.005:med?.008:.012),r:big?3.5:med?1.8:Math.random()*.6+.5,big,med});
  }
}
const LINK=140,LINK2=LINK*LINK;
let md=[];
/* Pre-built stroke strings: building rgba() templates per line was allocating
   thousands of strings a frame. */
const TEAL=[],CYAN=[];
for(let i=0;i<14;i++){TEAL.push('rgba(58,189,188,'+(i/40).toFixed(3)+')');CYAN.push('rgba(191,239,239,'+(i/40).toFixed(3)+')')}
function dr(){
  ctx.clearRect(0,0,W,H);
  for(let i=0;i<pts.length;i++){const a=pts[i];md[i]=Math.hypot(a.x-mx,a.y-my)}
  for(let i=0;i<pts.length;i++){const a=pts[i];
    for(let j=i+1;j<pts.length;j++){const b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d2=dx*dx+dy*dy;
      if(d2<LINK2){const d=Math.sqrt(d2);const nr=md[i]<md[j]?md[i]:md[j];const o=.2*(1-d/LINK);const lw=(a.big||b.big)?.9:(a.med||b.med)?.6:.4;
        const cl=nr<160?CYAN[Math.min(13,(o*52)|0)]:TEAL[Math.min(13,(o*40)|0)];
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
function reflow(){clearTimeout(rt);rt=setTimeout(rz,180)}
window.addEventListener('resize',reflow,{passive:true});
/* Fonts and the logo SVG can change hero height after first paint — keep the
   canvas matched to the box instead of only to the window. */
if('ResizeObserver' in window){new ResizeObserver(reflow).observe(root)}
if(document.fonts&&document.fonts.ready){document.fonts.ready.then(reflow)}
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

/* Hero is above the fold — reveal on load, not on scroll */
requestAnimationFrame(()=>requestAnimationFrame(()=>{
  root.querySelectorAll('.a').forEach(el=>el.classList.add('v'));
}));

root.querySelectorAll('[data-grh-scroll]').forEach(a=>{
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
  for(var i=0;i<es.length;i++){if(es[i].isIntersecting){es[i].target.classList.add('gc-v');obs.unobserve(es[i].target)}}
},{threshold:0.08});
var a=document.querySelectorAll('#genroi-clarity .gc-a');
for(var i=0;i<a.length;i++) obs.observe(a[i]);
})();
;
(function(){
var root=document.getElementById('genroi-coverage');
var RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var TOTAL=60;

root.querySelectorAll('.gv-dots').forEach(function(box){
  var spec=box.getAttribute('data-lit');
  var lit=null;
  if(spec!=='all'){lit={};spec.split(',').forEach(function(n){lit[parseInt(n,10)]=1})}
  var frag=document.createDocumentFragment();
  for(var i=0;i<TOTAL;i++){
    var d=document.createElement('i');
    /* "all" is a broad-coverage look, not a literal count — leave a few gaps */
    var on=lit?!!lit[i]:(i%13!==7&&i%17!==3);
    if(on){d.className='on';d.style.transitionDelay=(RM?0:(i*14))+'ms'}
    frag.appendChild(d);
  }
  box.appendChild(frag);
});

var obs=new IntersectionObserver(function(es){
  for(var i=0;i<es.length;i++){
    if(es[i].isIntersecting){
      es[i].target.classList.add('gv-v');
      es[i].target.querySelectorAll('.gv-dots i.on').forEach(function(d){d.classList.add('lit')});
      obs.unobserve(es[i].target);
    }
  }
},{threshold:0.08});
var a=root.querySelectorAll('.gv-a');
for(var i=0;i<a.length;i++) obs.observe(a[i]);
})();
;
(function(){
var obs=new IntersectionObserver(function(es){
  for(var i=0;i<es.length;i++){if(es[i].isIntersecting){es[i].target.classList.add('gs-v');obs.unobserve(es[i].target)}}
},{threshold:0.08});
var a=document.querySelectorAll('#genroi-steps .gs-a');
for(var i=0;i<a.length;i++) obs.observe(a[i]);
})();
;
(function(){
var obs=new IntersectionObserver(function(es){
  for(var i=0;i<es.length;i++){if(es[i].isIntersecting){es[i].target.classList.add('gd-v');obs.unobserve(es[i].target)}}
},{threshold:0.08});
var a=document.querySelectorAll('#genroi-deliverables .gd-a');
for(var i=0;i<a.length;i++) obs.observe(a[i]);
})();
;
(function(){
var obs=new IntersectionObserver(function(es){
  for(var i=0;i<es.length;i++){if(es[i].isIntersecting){es[i].target.classList.add('gj-v');obs.unobserve(es[i].target)}}
},{threshold:0.08});
var a=document.querySelectorAll('#genroi-journey .gj-a');
for(var i=0;i<a.length;i++) obs.observe(a[i]);
})();
;
(function(){
var btn=document.getElementById('gxToggle');
var panel=document.getElementById('gxPanel');
var loaded=false,sdk=null;

/* HubSpot's embed script is only fetched when the panel is opened, so it never
   blocks first paint or counts against the initial page weight. */
function loadSdk(){
  if(sdk) return sdk;
  sdk=new Promise(function(res,rej){
    if(window.hbspt) return res();
    var s=document.createElement('script');
    s.src='/scripts/hubspot-forms.js';
    s.charset='utf-8';s.async=true;
    s.onload=res;s.onerror=rej;
    document.head.appendChild(s);
  });
  return sdk;
}

btn.addEventListener('click',function(){
  var open=!panel.classList.contains('open');
  panel.classList.toggle('open',open);
  btn.classList.toggle('open',open);
  btn.setAttribute('aria-expanded',open?'true':'false');
  panel.setAttribute('aria-hidden',open?'false':'true');
  if(open&&!loaded){
    loaded=true;
    loadSdk().then(function(){
      hbspt.forms.create({
        portalId:"6632357",
        formId:"9ba971f2-6cc7-485d-8907-c7afc61ba714",
        region:"na1",
        target:"#gxHsForm"
      });
    }).catch(function(){
      loaded=false;
      document.getElementById('gxHsForm').innerHTML='<p style="font:600 15px/1.5 \'Open Sans\',sans-serif;color:#363943">The form could not load. Email <a href="mailto:hello@hatchworks.com" style="color:#10758b">hello@hatchworks.com</a> and we\'ll get back to you.</p>';
    });
  }
});

var obs=new IntersectionObserver(function(entries){
  for(var i=0;i<entries.length;i++){
    if(entries[i].isIntersecting){entries[i].target.classList.add('gx-v');obs.unobserve(entries[i].target)}
  }
},{threshold:0.08});
var anims=document.querySelectorAll('#genroi-cta .gx-a');
for(var i=0;i<anims.length;i++) obs.observe(anims[i]);
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":32526,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

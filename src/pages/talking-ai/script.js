(function(){
'use strict';

function init(){

/* Scroll reveal */
var io = new IntersectionObserver(function(e){
  e.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});
},{threshold:.08});
document.querySelectorAll('.sr').forEach(function(el){io.observe(el);});

/* YouTube tabs — also updates the meta card on the right */
var ytMeta = {
  full: {
    tag: 'Full video playlist',
    title: 'Complete Conversations',
    desc: 'Every episode in full video. In-depth discussions with AI experts, enterprise leaders, and startup founders across five seasons.',
    url: 'https://www.youtube.com/playlist?list=PLsoyQPLIPSkTh-i9w77FUAxjZ7CocoSH8',
    cta: 'Open Full Playlist on YouTube'
  },
  shorts: {
    tag: 'Shorts playlist',
    title: 'Talking AI Shorts',
    desc: 'The sharpest moments from each episode. Bite-sized clips for founders, executives, and builders who want the signal fast.',
    url: 'https://www.youtube.com/playlist?list=PLsoyQPLIPSkRGq5Y-sLNGxU73YJrzqclH',
    cta: 'Open Shorts Playlist on YouTube'
  }
};
window.switchYT = function(id,btn){
  document.querySelectorAll('.yt-tab').forEach(function(t){t.classList.remove('on');t.setAttribute('aria-selected','false');});
  document.querySelectorAll('.yt-panel').forEach(function(p){p.classList.remove('on');});
  btn.classList.add('on');btn.setAttribute('aria-selected','true');
  document.getElementById('panel-'+id).classList.add('on');
  /* Update meta card text */
  var m = ytMeta[id];
  if(m){
    var tag=document.getElementById('yt-meta-tag');
    var title=document.getElementById('yt-meta-title');
    var desc=document.getElementById('yt-meta-desc');
    var cta=document.getElementById('yt-meta-cta');
    var icon=document.getElementById('yt-meta-icon');
    var icoFull=document.getElementById('yt-icon-full');
    var icoShorts=document.getElementById('yt-icon-shorts');
    if(tag){tag.textContent=m.tag;}
    if(title){title.textContent=m.title;}
    if(desc){desc.textContent=m.desc;}
    if(cta){
      cta.href=m.url;
      cta.setAttribute('aria-label',m.cta);
      /* update CTA text node (after the svg) */
      var nodes=cta.childNodes;
      for(var i=0;i<nodes.length;i++){
        if(nodes[i].nodeType===3&&nodes[i].textContent.trim()){
          nodes[i].textContent=' '+m.cta;break;
        }
      }
    }
    /* Swap icon and accent color */
    if(id==='shorts'){
      if(icon){icon.classList.add('shorts-icon');}
      if(icoFull){icoFull.style.display='none';}
      if(icoShorts){icoShorts.style.display='';}
      if(tag){tag.style.color='var(--coral)';}
    } else {
      if(icon){icon.classList.remove('shorts-icon');}
      if(icoFull){icoFull.style.display='';}
      if(icoShorts){icoShorts.style.display='none';}
      if(tag){tag.style.color='';}
    }
  }
};

/* Episode catalog */
var eps=[
  {title:'Building in Public as a Solo Founder',guest:'Thomas Schlossmacher · Resonant',ep:'S5 E10',
   desc:'Building Resonant publicly: product differentiation through taste, a ShadCN design workflow, Claude Code and Next.js stack, and a vision for proactive context-aware AI agents.',
   img:'/assets/wp-content/uploads/2026/05/Talking-AI-S5E10-Thomas-Schlossmacher-social-1024x1024.png',
   url:'/talking-ai/building-in-public-as-a-solo-founder/'},
  {title:'AI in Education',guest:'Todd Brekhus',ep:'S5 E09',
   desc:'How AI is personalizing learning, augmenting educators, and reshaping the classroom from K-12 through higher education.',
   img:'/assets/wp-content/uploads/2026/04/Thumbnail-Talking-AI-S5E09-Todd-Brekhus-Social-1024x1024.png',
   url:'/talking-ai/ai-in-education/'},
  {title:'The SaaS-pocalypse',guest:'Dan Priest · PwC Chief AI Officer',ep:'S5 E08',
   desc:'PwC Chief AI Officer on why AI value creation is 80% transformation and 20% tech, and how Fortune 500 companies keep getting that ratio backwards.',
   img:'/assets/wp-content/uploads/2026/04/Dan-Priest-TalkingAI-Thumbnail-Social-1024x1024.png',
   url:'/talking-ai/saas-pocalypse/'},
  {title:'Build with Agents',guest:'Zach Lloyd · Warp',ep:'S5 E07',
   desc:'Parallel agent workflows, the emerging agent control plane, cloud-native orchestration, and how agents will replace entire SaaS categories.',
   img:'/assets/wp-content/uploads/2026/03/Thumbnail-Zach-Lloyd-Social-1024x1024.png',
   url:'/talking-ai/build-with-agents/'},
  {title:'AI Agents Could Hire You',guest:'Nathaniel · Ego AI',ep:'S5 E06',
   desc:'Behavioral simulation, continual learning, and the personality design patterns that make AI agents feel genuinely human.',
   img:'/assets/wp-content/uploads/2026/03/Nathaniel-TalkingAIAsset-9-1024x1024.png',
   url:'/talking-ai/ai-agents-could-hire-you/'},
  {title:'Making AI Feel Like a Person',guest:'Rowan · Ego AI',ep:'S5 E05',
   desc:'Behavior is all you need. Anatomy of human-like agents, measuring humanness through retention, and the ethics of simulated personality.',
   img:'/assets/wp-content/uploads/2026/03/Behavior-Is-All-You-Need-Making-AI-Feel-Like-a-Person3-1024x1024.jpg',
   url:'/talking-ai/ai-feel-like-a-person/'},
  {title:'Taming Tech Stack Bloat with AI',guest:'Vanessa Heppner · Altas AI',ep:'S4 E12',
   desc:'How AI tackles operational complexity, reshapes software pricing models, and opens new roles that were previously impossible to fill.',
   img:'/assets/wp-content/uploads/2025/06/Talking-AI-S4E12-social-1024x1024.png',
   url:'/talking-ai/tech-stack-bloat/'},
  {title:'Prompt, Build, Repeat',guest:'Andrew Miller · PDD',ep:'S4 E10',
   desc:'Prompt Driven Development: a methodology for building production-grade software with LLMs that replaces traditional coding without sacrificing reliability.',
   img:'/assets/wp-content/uploads/2025/04/Talking-AI-S4E10-social-1024x1024.png',
   url:'/talking-ai/prompt-build-repeat/'},
  {title:'AI Evolving from Assistant to Co-Worker',guest:'Patrick Lynch · Hult',ep:'S4 E06',
   desc:'The four faces of AI maturity and what genuine human-AI collaboration looks like when the AI becomes a real team member.',
   img:'/assets/wp-content/uploads/2024/11/Talking-AI-S4E06-social-1024x1024.png',
   url:'/talking-ai/ai-co-worker/'},
  {title:'Agentic Systems and Enterprise Software',guest:'Praveen Gunasekaran · Visa',ep:'S3 E12',
   desc:'Senior Director and Chief Architect at Visa on how autonomous AI systems are reshaping enterprise software development and deployment patterns.',
   img:'/assets/wp-content/uploads/2024/12/Talking-AI-S3E12-social-1024x1024.png',
   url:'/talking-ai/'},
];

/* ── SURPRISE ME MODAL ─────────────────────────────────────────────────────
   Built entirely in JS and appended to document.body so Elementor's
   stacking context / transform wrappers can never trap position:fixed.
   All styles inline — zero CSS cascade dependency.
   ───────────────────────────────────────────────────────────────────────── */
var randBtn = document.getElementById('rand-btn');
var cdTimer = null;
var CIRC = 87.96; /* 2 * PI * r(14) — real SVG circumference */
var currentUrl = '#';

/* ── Build modal DOM once — pure createElement, no innerHTML ── */
function mk(tag,css,attrs){
  var el=document.createElement(tag);
  if(css) el.style.cssText=css;
  if(attrs) for(var k in attrs) el.setAttribute(k,attrs[k]);
  return el;
}
function svgEl(paths,w,h,style){
  var ns='http://www.w3.org/2000/svg';
  var s=document.createElementNS(ns,'svg');
  s.setAttribute('width',w||'24');s.setAttribute('height',h||'24');
  s.setAttribute('viewBox','0 0 '+(w||24)+' '+(h||24));
  s.setAttribute('fill','none');s.setAttribute('stroke','currentColor');
  s.setAttribute('stroke-width','2.5');s.setAttribute('stroke-linecap','round');
  s.setAttribute('stroke-linejoin','round');
  if(style) s.style.cssText=style;
  paths.forEach(function(d){
    var p=document.createElementNS(ns,'path');p.setAttribute('d',d);s.appendChild(p);
  });
  return s;
}

var overlay = mk('div',
  'display:none;position:fixed;top:0;left:0;right:0;bottom:0;'+
  'z-index:2147483647;'+
  'background:rgba(6,10,16,.92);'+
  '-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);'+
  'display:none;align-items:center;justify-content:center;padding:16px;'+
  'box-sizing:border-box;',
  {id:'sm-overlay',role:'dialog','aria-modal':'true','aria-label':'Random episode'}
);

var smCard = mk('div',
  'background:#111820;border:1px solid rgba(58,189,188,.22);border-radius:16px;'+
  'width:100%;max-width:440px;overflow:hidden;position:relative;'+
  'box-shadow:0 32px 72px rgba(0,0,0,.85),0 0 0 1px rgba(255,255,255,.05);'+
  'transform:translateY(24px) scale(.95);'+
  'transition:transform .32s cubic-bezier(.32,.72,0,1);',
  {id:'sm-card'}
);

/* thumbnail */
var smThumb = mk('div',
  'width:100%;height:172px;background:linear-gradient(140deg,#16202e,#0a1e1e);'+
  'position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;'
);
var smImg = mk('img',
  'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;'+
  'opacity:0;transition:opacity .4s;filter:none !important;',
  {id:'sm-img',alt:''}
);
var smFb = mk('div',
  'width:60px;height:60px;border-radius:12px;'+
  'background:linear-gradient(140deg,#3ABDBC,#145f5f);'+
  'display:flex;align-items:center;justify-content:center;position:relative;z-index:1;',
  {id:'sm-fb'}
);
/* mic icon in fb */
var micSvg = (function(){
  var ns='http://www.w3.org/2000/svg';
  var s=document.createElementNS(ns,'svg');
  s.setAttribute('width','26');s.setAttribute('height','26');
  s.setAttribute('viewBox','0 0 24 24');s.setAttribute('fill','none');
  s.setAttribute('stroke','white');s.setAttribute('stroke-width','1.4');
  s.setAttribute('stroke-linecap','round');
  var p1=document.createElementNS(ns,'path');p1.setAttribute('d','M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z');
  var p2=document.createElementNS(ns,'path');p2.setAttribute('d','M19 10v1a7 7 0 0 1-14 0v-1');
  s.appendChild(p1);s.appendChild(p2);return s;
})();
smFb.appendChild(micSvg);

var smGrad = mk('div',
  'position:absolute;top:0;left:0;right:0;bottom:0;'+
  'background:linear-gradient(to bottom,transparent 40%,#111820 100%);'+
  'z-index:2;pointer-events:none;'
);
var smBadge = mk('div',
  'position:absolute;top:10px;left:10px;z-index:3;'+
  'display:inline-flex;align-items:center;gap:5px;'+
  'font-family:Space Mono,monospace;font-size:9px;letter-spacing:.14em;text-transform:uppercase;'+
  'color:#3ABDBC;background:rgba(6,10,16,.88);'+
  'border:1px solid rgba(58,189,188,.22);padding:4px 9px;border-radius:100px;'
);
smBadge.textContent = 'Random pick';

var smClose = mk('button',
  'position:absolute;top:8px;right:8px;z-index:4;'+
  'width:28px;height:28px;border-radius:50%;cursor:pointer;'+
  'background:rgba(6,10,16,.82);border:1px solid rgba(255,255,255,.1);'+
  'color:#a8bfc4;display:flex;align-items:center;justify-content:center;padding:0;',
  {id:'sm-close','aria-label':'Cerrar'}
);
smClose.appendChild(svgEl(['M18 6 6 18M6 6l12 12'],14,14));

smThumb.appendChild(smImg);
smThumb.appendChild(smFb);
smThumb.appendChild(smGrad);
smThumb.appendChild(smBadge);
smThumb.appendChild(smClose);

/* body */
var smBody = mk('div','padding:18px 20px 20px;margin-top:-18px;position:relative;z-index:3;');

var smEp = mk('div',
  'font-family:Space Mono,monospace;font-size:9px;letter-spacing:.14em;'+
  'text-transform:uppercase;color:#8fadb4;margin-bottom:5px;',
  {id:'sm-ep'}
);
var smTitle = mk('div',
  'font-family:Inter,system-ui,sans-serif;font-size:19px;font-weight:800;'+
  'letter-spacing:-.02em;line-height:1.18;color:#e2ecee;margin-bottom:4px;',
  {id:'sm-title'}
);
var smGuest = mk('div',
  'font-size:13px;color:#3ABDBC;font-weight:500;margin-bottom:12px;',
  {id:'sm-guest'}
);
var smDesc = mk('p',
  'font-size:13px;color:#8fadb4;line-height:1.6;margin-bottom:18px;'+
  'overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;',
  {id:'sm-desc'}
);

/* CTA */
var smCta = mk('a',
  'display:flex;align-items:center;justify-content:space-between;gap:10px;'+
  'padding:13px 16px;border-radius:10px;'+
  'background:#3ABDBC;color:#0c1016;text-decoration:none;cursor:pointer;'+
  'font-family:Inter,system-ui,sans-serif;font-size:15px;font-weight:800;'+
  'margin-bottom:10px;-webkit-tap-highlight-color:transparent;'+
  'transition:background .18s;',
  {id:'sm-cta',href:'#',target:'_blank',rel:'noopener'}
);
var ctaLeft = mk('span','display:flex;align-items:center;gap:9px;');
ctaLeft.appendChild(svgEl(['M5 12h14M12 5l7 7-7 7'],16,16));
var ctaLabels = mk('span');
var ctaMain = mk('span','display:block;line-height:1;');
ctaMain.textContent = 'Go to Episode';
var ctaSub = mk('span',
  'display:block;font-family:Space Mono,monospace;font-size:10px;font-weight:400;opacity:.6;margin-top:2px;'
);
/* countdown text */
var smCdN = mk('span',null,{id:'sm-cd-n'});
smCdN.textContent = '5';
var ctaSubText = document.createTextNode('Opening in ');
var ctaSubS = document.createTextNode('s');
ctaSub.appendChild(ctaSubText);
ctaSub.appendChild(smCdN);
ctaSub.appendChild(ctaSubS);
ctaLabels.appendChild(ctaMain);
ctaLabels.appendChild(ctaSub);
ctaLeft.appendChild(ctaLabels);

/* ring */
var ringWrap = mk('span','position:relative;width:36px;height:36px;flex-shrink:0;display:inline-block;');
var ns='http://www.w3.org/2000/svg';
var ringSvg=document.createElementNS(ns,'svg');
ringSvg.setAttribute('width','36');ringSvg.setAttribute('height','36');
ringSvg.setAttribute('viewBox','0 0 36 36');
ringSvg.style.transform='rotate(-90deg)';
var trackC=document.createElementNS(ns,'circle');
trackC.setAttribute('cx','18');trackC.setAttribute('cy','18');trackC.setAttribute('r','14');
trackC.setAttribute('fill','none');trackC.setAttribute('stroke','rgba(0,0,0,.18)');trackC.setAttribute('stroke-width','3');
var smRing=document.createElementNS(ns,'circle');
smRing.setAttribute('cx','18');smRing.setAttribute('cy','18');smRing.setAttribute('r','14');
smRing.setAttribute('fill','none');smRing.setAttribute('stroke','#0c1016');smRing.setAttribute('stroke-width','3');
smRing.setAttribute('stroke-linecap','round');
smRing.setAttribute('stroke-dasharray',String(CIRC));
smRing.setAttribute('stroke-dashoffset','0');
smRing.setAttribute('id','sm-ring');
ringSvg.appendChild(trackC);ringSvg.appendChild(smRing);
var smRingN=mk('span',
  'position:absolute;top:0;left:0;right:0;bottom:0;'+
  'display:flex;align-items:center;justify-content:center;'+
  'font-family:Space Mono,monospace;font-size:11px;font-weight:700;color:#0c1016;',
  {id:'sm-ring-n'}
);
smRingN.textContent='5';
ringWrap.appendChild(ringSvg);
ringWrap.appendChild(smRingN);

smCta.appendChild(ctaLeft);
smCta.appendChild(ringWrap);

/* cancel */
var smCancel = mk('button',
  'display:block;width:100%;padding:11px;border-radius:9px;cursor:pointer;'+
  'background:transparent;border:1px solid rgba(255,255,255,.1);'+
  'color:#8fadb4;font-family:Inter,system-ui,sans-serif;font-size:14px;font-weight:600;'+
  '-webkit-tap-highlight-color:transparent;transition:border-color .18s,color .18s;',
  {id:'sm-cancel'}
);
smCancel.textContent = 'Cancelar';

smBody.appendChild(smEp);
smBody.appendChild(smTitle);
smBody.appendChild(smGuest);
smBody.appendChild(smDesc);
smBody.appendChild(smCta);
smBody.appendChild(smCancel);

smCard.appendChild(smThumb);
smCard.appendChild(smBody);
overlay.appendChild(smCard);
document.body.appendChild(overlay);


/* ── Countdown ── */
function stopCd(){clearInterval(cdTimer);cdTimer=null;}

function startCd(url){
  var n=5;
  smRing.style.transition='none';
  smRing.style.strokeDashoffset='0';
  smCdN.textContent=n;
  smRingN.textContent=n;
  void smRing.getBoundingClientRect(); /* force reflow */
  stopCd();
  cdTimer=setInterval(function(){
    n--;
    smCdN.textContent=n;
    smRingN.textContent=n;
    smRing.style.transition='stroke-dashoffset 1s linear';
    smRing.style.strokeDashoffset=String(CIRC*(1-n/5));
    if(n<=0){
      stopCd();
      window.open(url,'_blank','noopener');
      closeModal();
    }
  },1000);
}

/* ── Open / Close ── */
function openModal(ep){
  currentUrl = ep.url;
  smTitle.textContent = ep.title;
  smEp.textContent = ep.ep;
  smGuest.innerHTML = ep.guest.replace(/\s·\s/g,' &bull; ');
  smDesc.textContent = ep.desc;
  smCta.href = ep.url;

  /* Show immediately */
  overlay.style.display='flex';
  /* Slight rAF so display:flex paints before we trigger the transform transition */
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      smCard.style.transform='translateY(0) scale(1)';
    });
  });

  /* Thumbnail async */
  smImg.style.opacity='0';
  smFb.style.display='flex';
  if(ep.img){
    smImg.onload=function(){smImg.style.opacity='1';smFb.style.display='none';};
    smImg.onerror=function(){smFb.style.display='flex';};
    smImg.src=ep.img;
    smImg.alt=ep.title;
  }

  startCd(ep.url);
}

function closeModal(){
  stopCd();
  smCard.style.transform='translateY(20px) scale(.95)';
  setTimeout(function(){
    overlay.style.display='none';
    smImg.src='';
  },220);
}

/* ── Events ── */
smClose.addEventListener('click',closeModal);
smCancel.addEventListener('click',closeModal);
overlay.addEventListener('click',function(e){if(e.target===overlay)closeModal();});
smCta.addEventListener('click',function(){stopCd();closeModal();});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&overlay.style.display==='flex')closeModal();
});

/* Touch-friendly hover states */
smCta.addEventListener('touchstart',function(){smCta.style.background='#BFEFEF';},{passive:true});
smCta.addEventListener('touchend',function(){smCta.style.background='#3ABDBC';},{passive:true});
smCancel.addEventListener('touchstart',function(){smCancel.style.background='rgba(255,255,255,.06)';},{passive:true});
smCancel.addEventListener('touchend',function(){smCancel.style.background='transparent';},{passive:true});
smClose.addEventListener('touchstart',function(){smClose.style.background='rgba(255,255,255,.12)';},{passive:true});
smClose.addEventListener('touchend',function(){smClose.style.background='rgba(10,14,20,.8)';},{passive:true});

/* Focus-visible rings for keyboard users */
function addFocusRing(el, color){
  el.addEventListener('focus', function(){el.style.outline='2px solid '+color;el.style.outlineOffset='3px';});
  el.addEventListener('blur',  function(){el.style.outline='none';});
}
addFocusRing(smCta,    '#3ABDBC');
addFocusRing(smCancel, '#3ABDBC');
addFocusRing(smClose,  '#3ABDBC');

/* ── Wire Surprise Me button ── */
if(randBtn){
  randBtn.addEventListener('click',function(e){
    e.stopPropagation();
    openModal(eps[Math.floor(Math.random()*eps.length)]);
  });
}


/* Magnetic hover — rAF-driven, pauses CSS float animation */
var kwEls=document.querySelectorAll('#kw-cloud .kw');
kwEls.forEach(function(el){
  var tgtX=0,tgtY=0,curX=0,curY=0,raf=null,hovering=false;

  function animate(){
    if(!hovering && Math.abs(curX)<0.1 && Math.abs(curY)<0.1){
      curX=0;curY=0;
      el.style.transform='';
      el.classList.remove('is-hovering');
      raf=null;return;
    }
    var ease=hovering?0.18:0.22;
    curX+=(tgtX-curX)*ease;
    curY+=(tgtY-curY)*ease;
    el.style.transform='translate('+curX.toFixed(2)+'px,'+curY.toFixed(2)+'px)';
    raf=requestAnimationFrame(animate);
  }

  el.addEventListener('mouseenter',function(){
    hovering=true;
    el.classList.add('is-hovering'); /* pauses CSS float */
    if(!raf)raf=requestAnimationFrame(animate);
  });
  el.addEventListener('mousemove',function(e){
    var r=el.getBoundingClientRect();
    var dx=(e.clientX-(r.left+r.width/2))/(r.width/2);
    var dy=(e.clientY-(r.top+r.height/2))/(r.height/2);
    tgtX=dx*7;tgtY=dy*5;
  });
  el.addEventListener('mouseleave',function(){
    hovering=false;tgtX=0;tgtY=0;
    if(!raf)raf=requestAnimationFrame(animate);
  });
});

} /* end init */

/* ── SPEECH WAVEFORM — runs independently of init() ── */
(function(){
  var canvas = document.getElementById('hero-wave');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');

  var W=0, H=0, dpr=1;
  var mx=0.5, my=0.5, tmx=0.5, tmy=0.5;
  var isHovering=false;
  var raf, t=0;

  function resize(){
    var hero=canvas.parentElement;
    dpr=Math.min(window.devicePixelRatio||1,2);
    W=hero.offsetWidth; H=hero.offsetHeight;
    canvas.width=W*dpr; canvas.height=H*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  if(window.ResizeObserver) new ResizeObserver(function(){resize();}).observe(canvas.parentElement);
  window.addEventListener('resize',resize,{passive:true});
  resize();

  var hero=canvas.parentElement;
  hero.addEventListener('mousemove',function(e){
    var r=hero.getBoundingClientRect();
    tmx=(e.clientX-r.left)/r.width;
    tmy=(e.clientY-r.top)/r.height;
    isHovering=true;
  },{passive:true});
  hero.addEventListener('touchmove',function(e){
    if(!e.touches.length)return;
    var r=hero.getBoundingClientRect();
    tmx=(e.touches[0].clientX-r.left)/r.width;
    tmy=(e.touches[0].clientY-r.top)/r.height;
    isHovering=true;
  },{passive:true});
  hero.addEventListener('mouseleave',function(){isHovering=false;tmx=0.5;tmy=0.5;},{passive:true});
  hero.addEventListener('touchend',function(){isHovering=false;tmx=0.5;tmy=0.5;},{passive:true});

  /* Bar geometry */
  var BAR_W=2, GAP=2, STEP=BAR_W+GAP;

  /*
    Speech waveform uses several summed sine layers:
    - a slow envelope (breath/phrase level)
    - medium bursts (syllables)
    - fast noise (consonants/texture)
    All summed → abs → gives classic speech waveform silhouette
  */
  var LAYERS=[
    {freq:0.008, speed:0.0006, amp:0.30, phase:0.0  },  /* slow phrase envelope */
    {freq:0.021, speed:0.0011, amp:0.22, phase:1.3  },  /* syllable rhythm */
    {freq:0.045, speed:0.0019, amp:0.14, phase:2.7  },  /* fast texture */
    {freq:0.012, speed:0.0007, amp:0.20, phase:4.1  },  /* secondary envelope */
    {freq:0.067, speed:0.0028, amp:0.08, phase:0.8  },  /* consonant noise */
    {freq:0.004, speed:0.0004, amp:0.18, phase:3.5  },  /* very slow breathing */
  ];

  function draw(){
    raf=requestAnimationFrame(draw);
    t+=1;

    var ease=isHovering?0.05:0.025;
    mx+=(tmx-mx)*ease;
    my+=(tmy-my)*ease;

    ctx.clearRect(0,0,W,H);

    var nBars=Math.floor(W/STEP)+1;
    var cy=H*0.5;                        /* centre line */
    var cursorX=mx*W;
    var rippleR=W*0.18;
    var rippleStr=isHovering?(1.2-my*0.6):0;

    for(var i=0;i<nBars;i++){
      var x=i*STEP+BAR_W/2;
      var nx=x/W;

      /* Sum layers — abs gives the waveform envelope shape */
      var raw=0;
      for(var l=0;l<LAYERS.length;l++){
        var ly=LAYERS[l];
        raw+=Math.sin(nx*W*ly.freq + t*ly.speed + ly.phase) * ly.amp;
      }
      /* abs + small floor so bars never fully disappear */
      var h=Math.abs(raw);
      h=Math.max(0.03, Math.min(0.90, h));

      /* Cursor proximity — pull bars upward */
      var dist=Math.abs(x-cursorX);
      if(dist<rippleR){
        var prox=1-dist/rippleR;
        h=Math.min(0.96, h + rippleStr*Math.pow(prox,1.8));
      }else{
        var prox=0;
      }

      /* Pixel height — fill from top to bottom, mirrored around centre */
      var halfH=h*(H*0.5);

      /* Color: teal base, shifts toward coral at tall/cursor bars */
      var heat=prox*0.85 + (h-0.3)*0.4;
      heat=Math.max(0,Math.min(1,heat));
      var cr=Math.round(58  + heat*197);
      var cg=Math.round(189 - heat*130);
      var cb=Math.round(188 - heat*148);

      /* Vertical gradient — hot tip, fade at extremes */
      var topAlpha   =0.06+heat*0.06;
      var midAlpha   =0.18+heat*0.20;
      var centreAlpha=0.28+heat*0.22;

      /* TOP half — bar from centre up */
      var gTop=ctx.createLinearGradient(0,cy,0,cy-halfH);
      gTop.addColorStop(0,'rgba('+cr+','+cg+','+cb+','+centreAlpha+')');
      gTop.addColorStop(0.6,'rgba('+cr+','+cg+','+cb+','+midAlpha+')');
      gTop.addColorStop(1,'rgba('+Math.min(255,cr+60)+','+Math.min(255,cg+50)+','+Math.min(255,cb+50)+','+topAlpha+')');
      ctx.fillStyle=gTop;
      ctx.fillRect(x-BAR_W/2, cy-halfH, BAR_W, halfH);

      /* BOTTOM half — mirror */
      var gBot=ctx.createLinearGradient(0,cy,0,cy+halfH);
      gBot.addColorStop(0,'rgba('+cr+','+cg+','+cb+','+centreAlpha+')');
      gBot.addColorStop(0.6,'rgba('+cr+','+cg+','+cb+','+midAlpha+')');
      gBot.addColorStop(1,'rgba('+Math.min(255,cr+60)+','+Math.min(255,cg+50)+','+Math.min(255,cb+50)+','+topAlpha+')');
      ctx.fillStyle=gBot;
      ctx.fillRect(x-BAR_W/2, cy, BAR_W, halfH);

      /* Soft bloom on tall / cursor-hot bars */
      if(h>0.45||prox>0.3){
        var bloomA=(prox*0.07+h*0.04);
        var bw=BAR_W+14;
        var bgT=ctx.createLinearGradient(0,cy,0,cy-halfH);
        bgT.addColorStop(0,'rgba('+cr+','+cg+','+cb+','+bloomA+')');
        bgT.addColorStop(1,'rgba('+cr+','+cg+','+cb+',0)');
        ctx.fillStyle=bgT;
        ctx.fillRect(x-bw/2,cy-halfH,bw,halfH);
        var bgB=ctx.createLinearGradient(0,cy,0,cy+halfH);
        bgB.addColorStop(0,'rgba('+cr+','+cg+','+cb+','+bloomA+')');
        bgB.addColorStop(1,'rgba('+cr+','+cg+','+cb+',0)');
        ctx.fillStyle=bgB;
        ctx.fillRect(x-bw/2,cy,bw,halfH);
      }
    }

    /* Centre line */
    var lineG=ctx.createLinearGradient(0,0,W,0);
    lineG.addColorStop(0,'rgba(58,189,188,0)');
    lineG.addColorStop(0.12,'rgba(58,189,188,0.18)');
    lineG.addColorStop(0.5,'rgba(58,189,188,0.28)');
    lineG.addColorStop(0.88,'rgba(58,189,188,0.18)');
    lineG.addColorStop(1,'rgba(58,189,188,0)');
    ctx.fillStyle=lineG;
    ctx.fillRect(0,cy-1,W,2);
  }

  document.addEventListener('visibilitychange',function(){
    if(document.hidden) cancelAnimationFrame(raf); else draw();
  });
  draw();
})();

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init);
} else {
  init();
}

})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":29242,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

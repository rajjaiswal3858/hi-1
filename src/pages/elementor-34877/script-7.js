/* ── BG PARTICLE FIELD ── */
const bg = document.getElementById('c');
const bx = bg.getContext('2d');
let W,H;
function rz(){W=bg.width=innerWidth;H=bg.height=innerHeight}
rz();window.addEventListener('resize',rz);

const pts=[];
for(let i=0;i<90;i++)pts.push({
  x:Math.random()*5000,y:Math.random()*3000,
  vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,
  r:Math.random()*1.4+.3,a:Math.random()*.5+.1,
  c:Math.random()>.6?'58,189,188':Math.random()>.5?'113,199,210':'16,117,139'
});
let mx=W/2,my=H/2;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});

function bgAnim(){
  bx.clearRect(0,0,W,H);
  // deep gradient
  const g=bx.createRadialGradient(W*.7,H*.3,0,W*.7,H*.3,Math.max(W,H)*.8);
  g.addColorStop(0,'rgba(16,60,100,.18)');g.addColorStop(.5,'rgba(13,20,40,.12)');g.addColorStop(1,'rgba(0,0,0,0)');
  bx.fillStyle=g;bx.fillRect(0,0,W,H);
  // mouse glow
  const mg=bx.createRadialGradient(mx,my,0,mx,my,400);
  mg.addColorStop(0,'rgba(58,189,188,.06)');mg.addColorStop(1,'rgba(0,0,0,0)');
  bx.fillStyle=mg;bx.fillRect(0,0,W,H);

  pts.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0)p.x=W;if(p.x>W)p.x=0;
    if(p.y<0)p.y=H;if(p.y>H)p.y=0;
    bx.beginPath();bx.arc(p.x,p.y,p.r,0,Math.PI*2);
    bx.fillStyle=`rgba(${p.c},${p.a})`;bx.fill();
  });
  // lines
  for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
    const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
    if(d<130){
      bx.beginPath();bx.moveTo(pts[i].x,pts[i].y);bx.lineTo(pts[j].x,pts[j].y);
      bx.strokeStyle=`rgba(16,117,139,${.07*(1-d/130)})`;bx.lineWidth=.6;bx.stroke();
    }
  }
  requestAnimationFrame(bgAnim);
}
bgAnim();

/* ── 3D EXECUTION LOOP CANVAS ── */
const lc=document.getElementById('loop-canvas');
const lx=lc.getContext('2d');
const SZ=560;lc.width=SZ;lc.height=SZ;

const nodes=[
  {label:'CONTEXT',sub:'Loading',angle:0,color:'#3abdbc',icon:'◈'},
  {label:'GENERATE',sub:'Structure',angle:Math.PI*.5,color:'#71c7d2',icon:'⚡'},
  {label:'VALIDATE',sub:'Human',angle:Math.PI,color:'#bfefef',icon:'◎'},
  {label:'LEARN',sub:'Compound',angle:Math.PI*1.5,color:'#10758b',icon:'↺'},
];
const cx2=SZ/2,cy2=SZ/2,R2=170;
let t2=0,activeN=0;

function drawLoop(){
  lx.clearRect(0,0,SZ,SZ);
  // bg glow
  const bg2=lx.createRadialGradient(cx2,cy2,0,cx2,cy2,SZ*.6);
  bg2.addColorStop(0,'rgba(16,117,139,.15)');bg2.addColorStop(1,'rgba(0,0,0,0)');
  lx.fillStyle=bg2;lx.fillRect(0,0,SZ,SZ);

  // rings
  [200,170,140,110].forEach((r,i)=>{
    lx.beginPath();lx.arc(cx2,cy2,r,0,Math.PI*2);
    lx.strokeStyle=`rgba(58,189,188,${.04+i*.02})`;lx.lineWidth=1;lx.stroke();
  });

  // rotating dashes
  lx.save();lx.translate(cx2,cy2);lx.rotate(t2*.4);
  lx.beginPath();lx.arc(0,0,R2,0,Math.PI*2);
  lx.strokeStyle='rgba(58,189,188,.15)';lx.lineWidth=1.5;
  lx.setLineDash([8,16]);lx.stroke();lx.setLineDash([]);
  lx.restore();

  // colored arcs between nodes
  nodes.forEach((n,i)=>{
    const next=nodes[(i+1)%4];
    const a1=n.angle+t2*.2+.35,a2=next.angle+t2*.2-.35;
    const isActive=i===activeN||i===(activeN+3)%4;
    lx.beginPath();
    lx.arc(cx2,cy2,R2,a1,a2);
    lx.strokeStyle=n.color;
    lx.lineWidth=isActive?3:1.5;
    lx.globalAlpha=isActive?0.9:0.3;
    lx.stroke();
    lx.globalAlpha=1;
  });

  // center
  const cg=lx.createRadialGradient(cx2,cy2,0,cx2,cy2,62);
  cg.addColorStop(0,'rgba(16,117,139,.9)');cg.addColorStop(1,'rgba(11,16,24,.95)');
  lx.beginPath();lx.arc(cx2,cy2,62,0,Math.PI*2);lx.fillStyle=cg;lx.fill();
  lx.beginPath();lx.arc(cx2,cy2,62,0,Math.PI*2);
  lx.strokeStyle='rgba(58,189,188,.5)';lx.lineWidth=1.5;lx.stroke();
  // center glow
  const cgl=lx.createRadialGradient(cx2,cy2,0,cx2,cy2,80);
  cgl.addColorStop(0,'rgba(58,189,188,.15)');cgl.addColorStop(1,'rgba(0,0,0,0)');
  lx.beginPath();lx.arc(cx2,cy2,80,0,Math.PI*2);lx.fillStyle=cgl;lx.fill();

  lx.fillStyle='#f0f8ff';lx.font='bold 20px "Open Sans",sans-serif';lx.textAlign='center';
  lx.fillText('Gen',cx2-10,cy2+4);
  // DD box
  lx.fillStyle='#3abdbc';
  const tw=lx.measureText('DD').width;
  roundRect(lx,cx2+8,cy2-14,tw+16,22,4);lx.fill();
  lx.fillStyle='#fff';lx.font='bold 14px "Open Sans",sans-serif';
  lx.fillText('DD',cx2+16,cy2+3);

  // node dots + labels
  nodes.forEach((n,i)=>{
    const ang=n.angle+t2*.2;
    const nx=cx2+R2*Math.cos(ang),ny=cy2+R2*Math.sin(ang);
    const isA=i===activeN;
    // glow
    if(isA){
      const ng=lx.createRadialGradient(nx,ny,0,nx,ny,30);
      ng.addColorStop(0,n.color+'44');ng.addColorStop(1,'rgba(0,0,0,0)');
      lx.beginPath();lx.arc(nx,ny,30,0,Math.PI*2);lx.fillStyle=ng;lx.fill();
    }
    lx.beginPath();lx.arc(nx,ny,isA?14:9,0,Math.PI*2);
    lx.fillStyle=isA?n.color:'rgba(13,18,30,.95)';lx.fill();
    lx.strokeStyle=n.color;lx.lineWidth=isA?2:1.5;lx.stroke();

    // label
    const lbx=cx2+(R2+42)*Math.cos(ang),lby=cy2+(R2+42)*Math.sin(ang);
    lx.fillStyle=isA?n.color:'rgba(191,239,239,.5)';
    lx.font=`${isA?'700':'600'} 10px "Space Grotesk",sans-serif`;
    lx.textAlign='center';lx.fillText(n.label,lbx,lby);
    lx.fillStyle='rgba(107,130,153,.7)';lx.font='9px "Space Grotesk",sans-serif';
    lx.fillText(n.sub,lbx,lby+13);
  });

  // spinning outer markers
  for(let i=0;i<24;i++){
    const a=i/24*Math.PI*2+t2*.15;
    const mx2=cx2+210*Math.cos(a),my2=cy2+210*Math.sin(a);
    const sz=i%6===0?3:1.2;
    lx.beginPath();lx.arc(mx2,my2,sz,0,Math.PI*2);
    lx.fillStyle=i%6===0?'rgba(58,189,188,.6)':'rgba(58,189,188,.15)';lx.fill();
  }

  t2+=.012;
  activeN=Math.floor((t2*.2/(Math.PI*.5))%4);
  requestAnimationFrame(drawLoop);
}
drawLoop();

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
  ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);
  ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath();
}

function switchTab(i){
  document.querySelectorAll('.tab').forEach((t,j)=>t.classList.toggle('active',i===j));
  document.querySelectorAll('.panel').forEach((p,j)=>p.classList.toggle('active',i===j));
  // animate progress bars in new active panel
  setTimeout(()=>{
    document.querySelectorAll('.panel.active .vs-fill').forEach(el=>{
      el.style.width='0%';
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        el.style.width=el.dataset.w;
      }));
    });
  },50);
}

// initial bar animation on load
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      document.querySelectorAll('.panel.active .vs-fill').forEach(el=>{
        el.style.width=el.dataset.w;
      });
      obs.disconnect();
    }
  });
},{threshold:.3});
obs.observe(document.getElementById('s2'));

const nodeData=[
  {label:'CONTEXT',sub:'Loading',color:'#3abdbc',title:'Context Loading',desc:'Full architectural context loaded before every generation cycle. No blank-slate prompting.',metric:'100%',metricLab:'Context Coverage'},
  {label:'GENERATE',sub:'Structure',color:'#71c7d2',title:'Structured Generation',desc:'AI outputs follow pre-defined patterns. Every output has a known structure and a human owner.',metric:'<3.2%',metricLab:'Defect Rate'},
  {label:'VALIDATE',sub:'Human',color:'#bfefef',title:'Human Validation',desc:'Engineers review and approve every critical output. Governance is structural, not optional.',metric:'100%',metricLab:'Human Oversight'},
  {label:'LEARN',sub:'Compound',color:'#10758b',title:'Continuous Learning',desc:'Each loop improves templates and eliminates defect patterns. Velocity compounds with every sprint.',metric:'94%',metricLab:'Productivity Gain'},
];

const canvas=document.getElementById('loop-svg');
const ctx=canvas.getContext('2d');
const SZ=560,cx=280,cy=280,R=170;
let t=0,active=0,autoTimer;

function drawLoop(){
  ctx.clearRect(0,0,SZ,SZ);

  // bg
  const bg=ctx.createRadialGradient(cx,cy,0,cx,cy,SZ*.55);
  bg.addColorStop(0,'rgba(16,117,139,.14)');bg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=bg;ctx.fillRect(0,0,SZ,SZ);

  // rings
  [220,190,170,148,110].forEach((r,i)=>{
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.strokeStyle=`rgba(58,189,188,${.03+i*.015})`;
    ctx.lineWidth=i===2?1.5:1;ctx.stroke();
  });

  // dashed rotating outer ring
  ctx.save();ctx.translate(cx,cy);ctx.rotate(t*.3);
  ctx.beginPath();ctx.arc(0,0,210,0,Math.PI*2);
  ctx.strokeStyle='rgba(58,189,188,.08)';ctx.lineWidth=1;
  ctx.setLineDash([6,18]);ctx.stroke();ctx.setLineDash([]);
  ctx.restore();

  // arcs between nodes
  nodeData.forEach((n,i)=>{
    const a1=(-Math.PI/2)+i*(Math.PI/2)+.38;
    const a2=(-Math.PI/2)+(i+1)*(Math.PI/2)-.38;
    const isA=i===active;
    ctx.beginPath();ctx.arc(cx,cy,R,a1,a2);
    ctx.strokeStyle=n.color;
    ctx.lineWidth=isA?4:2;
    ctx.globalAlpha=isA?.95:.25;
    ctx.stroke();ctx.globalAlpha=1;

    // arrow on arc midpoint
    const midA=(a1+a2)/2+.08;
    const ax=cx+R*Math.cos(midA),ay=cy+R*Math.sin(midA);
    const perp=midA+Math.PI/2;
    ctx.save();ctx.translate(ax,ay);ctx.rotate(perp);
    ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(4,3);ctx.lineTo(-4,3);ctx.closePath();
    ctx.fillStyle=n.color;ctx.globalAlpha=isA?.9:.2;ctx.fill();ctx.globalAlpha=1;
    ctx.restore();
  });

  // nodes
  nodeData.forEach((n,i)=>{
    const ang=-Math.PI/2+i*(Math.PI/2);
    const nx=cx+R*Math.cos(ang),ny=cy+R*Math.sin(ang);
    const isA=i===active;

    if(isA){
      const ng=ctx.createRadialGradient(nx,ny,0,nx,ny,36);
      ng.addColorStop(0,n.color+'55');ng.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath();ctx.arc(nx,ny,36,0,Math.PI*2);ctx.fillStyle=ng;ctx.fill();
    }

    // outer pulse ring for active
    if(isA){
      const pulse=((Math.sin(t*2)+1)/2)*8+14;
      ctx.beginPath();ctx.arc(nx,ny,pulse,0,Math.PI*2);
      ctx.strokeStyle=n.color;ctx.lineWidth=1;ctx.globalAlpha=.4-(pulse-14)/24*.4;
      ctx.stroke();ctx.globalAlpha=1;
    }

    ctx.beginPath();ctx.arc(nx,ny,isA?16:10,0,Math.PI*2);
    ctx.fillStyle=isA?n.color:'rgba(11,16,24,.95)';ctx.fill();
    ctx.strokeStyle=n.color;ctx.lineWidth=isA?2.5:1.5;ctx.stroke();

    // label
    const dist=R+50;
    const lx2=cx+dist*Math.cos(ang),ly2=cy+dist*Math.sin(ang);
    ctx.fillStyle=isA?n.color:'rgba(148,170,184,.5)';
    ctx.font=`${isA?700:600} ${isA?11:10}px "Space Grotesk",sans-serif`;
    ctx.textAlign='center';ctx.fillText(n.label,lx2,ly2);
    ctx.fillStyle='rgba(107,130,153,.6)';ctx.font='8px "Space Grotesk",sans-serif';
    ctx.fillText(n.sub,lx2,ly2+14);
  });

  // center piece
  const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,68);
  cg.addColorStop(0,'rgba(16,117,139,.95)');cg.addColorStop(1,'rgba(11,16,24,.98)');
  ctx.beginPath();ctx.arc(cx,cy,68,0,Math.PI*2);ctx.fillStyle=cg;ctx.fill();

  // center border glow
  ctx.beginPath();ctx.arc(cx,cy,68,0,Math.PI*2);
  const cb=ctx.createLinearGradient(cx-68,cy-68,cx+68,cy+68);
  cb.addColorStop(0,'rgba(58,189,188,.6)');cb.addColorStop(.5,'rgba(113,199,210,.3)');
  cb.addColorStop(1,'rgba(16,117,139,.6)');
  ctx.strokeStyle=cb;ctx.lineWidth=1.5;ctx.stroke();

  ctx.fillStyle='#f0f8ff';ctx.font='bold 20px "Open Sans",sans-serif';ctx.textAlign='center';
  ctx.fillText('Gen',cx-12,cy+4);
  // DD box
  ctx.fillStyle='#3abdbc';
  rr(ctx,cx+4,cy-14,34,22,4);ctx.fill();
  ctx.fillStyle='#fff';ctx.font='bold 14px "Open Sans",sans-serif';
  ctx.fillText('DD',cx+21,cy+3);

  // outer tick marks
  for(let i=0;i<48;i++){
    const a=i/48*Math.PI*2+t*.1;
    const r1=218,r2=i%4===0?228:223;
    ctx.beginPath();
    ctx.moveTo(cx+r1*Math.cos(a),cy+r1*Math.sin(a));
    ctx.lineTo(cx+r2*Math.cos(a),cy+r2*Math.sin(a));
    ctx.strokeStyle=i%4===0?'rgba(58,189,188,.5)':'rgba(58,189,188,.15)';
    ctx.lineWidth=i%4===0?1.5:1;ctx.stroke();
  }

  t+=.015;
  requestAnimationFrame(drawLoop);
}

function rr(ctx,x,y,w,h,r){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);
  ctx.arcTo(x+w,y,x+w,y+r,r);ctx.lineTo(x+w,y+h-r);
  ctx.arcTo(x+w,y+h,x+w-r,y+h,r);ctx.lineTo(x+r,y+h);
  ctx.arcTo(x,y+h,x,y+h-r,r);ctx.lineTo(x,y+r);
  ctx.arcTo(x,y,x+r,y,r);ctx.closePath();
}

drawLoop();

let stepTimer=setInterval(()=>selectStep((active+1)%4),4000);

function selectStep(i){
  clearInterval(stepTimer);
  active=i;
  document.querySelectorAll('.step').forEach((s,j)=>s.classList.toggle('active',i===j));
  document.querySelectorAll('.step-connector').forEach((c,j)=>{
    c.classList.toggle('filled',j<i);
  });
  const n=nodeData[i];
  document.getElementById('info-t').textContent=n.title;
  document.getElementById('info-d').textContent=n.desc;
  stepTimer=setInterval(()=>selectStep((active+1)%4),4000);
}

// canvas node click
document.getElementById('loop-svg').addEventListener('click',e=>{
  const rect=canvas.getBoundingClientRect();
  const scaleX=SZ/rect.width,scaleY=SZ/rect.height;
  const mx=(e.clientX-rect.left)*scaleX,my=(e.clientY-rect.top)*scaleY;
  nodeData.forEach((n,i)=>{
    const ang=-Math.PI/2+i*(Math.PI/2);
    const nx=cx+R*Math.cos(ang),ny=cy+R*Math.sin(ang);
    const d=Math.hypot(mx-nx,my-ny);
    if(d<28) selectStep(i);
  });
});

/* counter */
function counter(el,target,suf,dec,dur){
  let s=0,step=target/(dur/16);
  const t=setInterval(()=>{
    s=Math.min(s+step,target);
    el.textContent=(dec?s.toFixed(dec):Math.round(s))+suf;
    if(s>=target)clearInterval(t);
  },16);
}

/* bars */
function buildBars(){
  const data=[{m:'Oct',v:45},{m:'Nov',v:58},{m:'Dec',v:52},{m:'Jan',v:74},{m:'Feb',v:68},{m:'Mar',v:89},{m:'Apr',v:94}];
  const max=94;
  const wrap=document.getElementById('bars');
  if(wrap.children.length)return;
  data.forEach(d=>{
    const col=document.createElement('div');col.className='b-col';
    const bar=document.createElement('div');bar.className='b-bar';
    bar.style.cssText=`height:0px;background:linear-gradient(180deg,#71c7d2,#10758b)`;
    const lbl=document.createElement('div');lbl.className='b-lbl';lbl.textContent=d.m;
    col.append(bar,lbl);wrap.appendChild(col);
    setTimeout(()=>bar.style.height=(d.v/max*82)+'px',100+data.indexOf(d)*60);
  });
}

/* progress bars */
function buildProgs(){
  const rows=[{n:'Context Quality',v:91,c:'#3abdbc'},{n:'Gen Accuracy',v:87,c:'#71c7d2'},{n:'Validation',v:94,c:'#bfefef'},{n:'Loop Velocity',v:78,c:'#10758b'}];
  const wrap=document.getElementById('proglist');
  if(wrap.children.length)return;
  rows.forEach(r=>{
    const d=document.createElement('div');
    d.style.cssText='margin-bottom:6px';
    d.innerHTML=`<div style="display:flex;justify-content:space-between;margin-bottom:3px">
      <span style="font-size:.62rem;color:#6b8299;font-family:Space Grotesk,sans-serif">${r.n}</span>
      <span style="font-size:.62rem;color:#f0f8ff;font-weight:700;font-family:Space Grotesk,sans-serif">${r.v}%</span>
    </div>
    <div style="height:4px;background:rgba(255,255,255,.05);border-radius:2px;overflow:hidden">
      <div style="height:100%;border-radius:2px;background:${r.c};width:0;transition:width 1.5s ease"></div>
    </div>`;
    wrap.appendChild(d);
    setTimeout(()=>d.querySelector('div>div').style.width=r.v+'%',200);
  });
}

/* donut */
function buildDonut(){
  const c=document.getElementById('donut');
  const x=c.getContext('2d');
  const segs=[{v:.28,c:'#3abdbc'},{v:.35,c:'#71c7d2'},{v:.22,c:'#bfefef'},{v:.15,c:'#10758b'}];
  let a=-Math.PI/2;
  segs.forEach(s=>{
    const end=a+s.v*Math.PI*2;
    x.beginPath();x.moveTo(40,40);
    x.arc(40,40,36,a,end);
    x.fillStyle=s.c;x.fill();
    a=end;
  });
  x.beginPath();x.arc(40,40,22,0,Math.PI*2);
  x.fillStyle='#0f1520';x.fill();
}

/* sparkline */
function buildSpark(){
  const c=document.getElementById('spark1');
  if(!c)return;
  const x=c.getContext('2d');
  const W=c.offsetWidth||200,H=c.offsetHeight||70;
  c.width=W;c.height=H;
  const pts=[30,45,38,55,48,62,58,70,65,72,68,76,80,78,85,87,90,88,92,94];
  const max=Math.max(...pts),min=Math.min(...pts);
  const stepX=W/(pts.length-1);
  // gradient fill
  const grad=x.createLinearGradient(0,0,0,H);
  grad.addColorStop(0,'rgba(58,189,188,.3)');
  grad.addColorStop(1,'rgba(58,189,188,0)');
  x.beginPath();
  pts.forEach((p,i)=>{
    const px=i*stepX,py=H-((p-min)/(max-min))*(H-8)-4;
    i===0?x.moveTo(px,py):x.lineTo(px,py);
  });
  x.lineTo(W,H);x.lineTo(0,H);x.closePath();
  x.fillStyle=grad;x.fill();
  // line
  x.beginPath();
  pts.forEach((p,i)=>{
    const px=i*stepX,py=H-((p-min)/(max-min))*(H-8)-4;
    i===0?x.moveTo(px,py):x.lineTo(px,py);
  });
  x.strokeStyle='#3abdbc';x.lineWidth=2;x.stroke();
}

/* agents */
function buildAgents(){
  const names=[['JA','J. Alpear'],['MR','M. Ruiz'],['KL','K. Lee'],['SP','S. Patel'],['DT','D. Torres'],['AR','A. Reyes']];
  const wrap=document.getElementById('agents');
  if(wrap.children.length)return;
  names.forEach(([av,nm],i)=>{
    const el=document.createElement('div');el.className='agent';
    const active=i<4;
    el.innerHTML=`<div class="agent-ava">${av}</div>
    <div class="agent-name">${nm}</div>
    <div class="agent-status"><div class="st-dot ${active?'st-active':'st-idle'}"></div>
    <span style="font-size:.58rem;color:${active?'#3abdbc':'#6b8299'};font-family:Space Grotesk,sans-serif">${active?'Active':'Idle'}</span></div>`;
    wrap.appendChild(el);
  });
}

/* live counter simulation */
let liveCount=547;
function tickLive(){
  liveCount+=Math.floor(Math.random()*3)+1;
  const el=document.getElementById('kv3');
  if(el)el.textContent=liveCount+'h';
}

const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    counter(document.getElementById('kv1'),94,'%',0,1800);
    counter(document.getElementById('kv2'),17,'',0,1200);
    counter(document.getElementById('kv3'),547,'h',0,2000);
    counter(document.getElementById('kv4'),3.2,'%',1,1500);
    buildBars();buildProgs();buildDonut();buildSpark();buildAgents();
    setInterval(tickLive,3000);
    obs.disconnect();
  });
},{threshold:.2});
obs.observe(document.getElementById('s4'));

/* Scroll reveal */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}});
},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

/* 3D tilt on cards */
document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(600px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transform='perspective(600px) rotateY(0) rotateX(0) translateZ(0)';
  });
});

/* counter animation */
function counter(el,target,suf,dec,dur){
  if(!el)return;
  let s=0,step=target/(dur/16);
  const t=setInterval(()=>{
    s=Math.min(s+step,target);
    el.textContent=(dec?s.toFixed(dec):Math.round(s))+suf;
    if(s>=target)clearInterval(t);
  },16);
}

/* proof card canvas visuals */
function drawVis1(){
  const c=document.getElementById('vis1');
  if(!c)return;
  const x=c.getContext('2d'),W=120,H=120,cx=60,cy=60;
  // animated connection diagram
  function draw(){
    x.clearRect(0,0,W,H);
    const t=Date.now()*.001;
    const nodes=[{x:30,y:30},{x:90,y:30},{x:90,y:90},{x:30,y:90},{x:60,y:60}];
    nodes.forEach((a,i)=>nodes.forEach((b,j)=>{
      if(i>=j)return;
      const wave=Math.sin(t+i+j)*.5+.5;
      x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);
      x.strokeStyle=`rgba(58,189,188,${wave*.25})`;x.lineWidth=1;x.stroke();
    }));
    nodes.forEach((n,i)=>{
      const pulse=Math.sin(t*1.5+i)*.5+.5;
      x.beginPath();x.arc(n.x,n.y,i===4?8:5+pulse*2,0,Math.PI*2);
      x.fillStyle=i===4?'#3abdbc':'rgba(58,189,188,.5)';x.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

function drawVis2(){
  const c=document.getElementById('vis2');
  if(!c)return;
  const x=c.getContext('2d');
  function draw(){
    x.clearRect(0,0,120,120);
    const t=Date.now()*.001;
    // Clock visual
    x.beginPath();x.arc(60,60,44,0,Math.PI*2);
    x.strokeStyle='rgba(58,189,188,.2)';x.lineWidth=1;x.stroke();
    // progress arc
    const prog=Math.PI*2*(94/100);
    x.beginPath();x.arc(60,60,44,-Math.PI/2,-Math.PI/2+prog);
    x.strokeStyle='#3abdbc';x.lineWidth=3;x.lineCap='round';x.stroke();
    // center
    x.fillStyle='#bfefef';x.font='bold 18px Open Sans,sans-serif';x.textAlign='center';
    x.fillText('547',60,58);
    x.fillStyle='#6b8299';x.font='8px Space Grotesk,sans-serif';
    x.fillText('HRS/MO',60,70);
    requestAnimationFrame(draw);
  }
  draw();
}

function drawVis3(){
  const c=document.getElementById('vis3');
  if(!c)return;
  const x=c.getContext('2d');
  function draw(){
    x.clearRect(0,0,120,120);
    const t=Date.now()*.001;
    // Weeks progress
    const weeks=[1,2,3,4,5,6,7,8];
    weeks.forEach((w,i)=>{
      const a=(i/8)*Math.PI*2-Math.PI/2;
      const r=38;
      const nx=60+r*Math.cos(a),ny=60+r*Math.sin(a);
      const filled=i<=(((Math.sin(t*.3)+1)/2)*7);
      x.beginPath();x.arc(nx,ny,7,0,Math.PI*2);
      x.fillStyle=filled?'#3abdbc':'rgba(58,189,188,.2)';x.fill();
      if(filled){x.fillStyle='#fff';x.font='bold 7px Space Grotesk,sans-serif';x.textAlign='center';
        x.fillText(w,nx,ny+2.5);}
    });
    x.fillStyle='#bfefef';x.font='bold 14px Open Sans,sans-serif';x.textAlign='center';x.fillText('8',60,57);
    x.fillStyle='#6b8299';x.font='7px Space Grotesk,sans-serif';x.fillText('WEEKS',60,68);
    requestAnimationFrame(draw);
  }
  draw();
}

/* observers */
const statsObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    document.querySelectorAll('.num-val[data-target]').forEach(el=>{
      const t=parseFloat(el.dataset.target);
      const s=el.dataset.suffix||'';
      const d=el.dataset.dec?parseInt(el.dataset.dec):0;
      counter(el,t,s,d,2200);
    });
    statsObs.disconnect();
  });
},{threshold:.3});
statsObs.observe(document.querySelector('.nums-grid'));

const revObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');revObs.unobserve(e.target);}});
},{threshold:.08,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));

const visObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    drawVis1();drawVis2();drawVis3();
    visObs.disconnect();
  });
},{threshold:.2});
const pg=document.querySelector('.proof-grid');
if(pg)visObs.observe(pg);

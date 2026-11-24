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

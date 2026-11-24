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

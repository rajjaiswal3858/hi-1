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

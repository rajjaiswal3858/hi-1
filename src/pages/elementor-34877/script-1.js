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

/* ── ROLE DATA ─────────────────────────────────────── */
const ROLES=[
  {title:"Data Scientists",avail:"hi",
   photo:"/assets/wp-content/uploads/2024/11/Computer-Vision-Expert-1024x1024.jpg",
   sub:"Statistical modeling & AI research",
   desc:"Design and deploy machine learning models, run experiments, and extract insights from complex data. GenDD-trained to ship production-ready models — not just notebooks.",
   skills:["Python","TensorFlow","PyTorch","SQL","Feature Engineering","A/B Testing","Statistics"],
   stack:["AWS SageMaker","Jupyter","Apache Spark","MLflow"],
   delivers:["Predictive models deployed to production","Automated ML pipelines and data experiments","Real-time scoring APIs and inference services"],
   radar:[85,90,70,88,75],seniority:"Senior+",senBar:"90%"},
  {title:"MLOps Architects",avail:"md",
   photo:"/assets/wp-content/uploads/2024/11/Natural-Language-Process-HWAI-1024x1024.jpg",
   sub:"ML infrastructure & model lifecycle",
   desc:"Design and manage the full ML lifecycle — from experiment tracking to production monitoring. Build infrastructure that keeps AI systems running reliably at scale.",
   skills:["Kubernetes","Docker","CI/CD","Model Monitoring","Python","Terraform"],
   stack:["MLflow","Kubeflow","AWS/GCP","ArgoCD"],
   delivers:["Production ML pipelines with full observability","Model registry and experiment tracking","Auto-scaling inference infrastructure"],
   radar:[80,92,85,72,80],seniority:"Lead+",senBar:"95%"},
  {title:"BI Engineers",avail:"hi",
   photo:"/assets/wp-content/uploads/2024/11/BI-ENGINEER-1024x1024.jpg",
   sub:"Data visualization & business intelligence",
   desc:"Transform raw data into business decisions. Build dashboards, data models, and self-service analytics that executives and operators actually use.",
   skills:["SQL","dbt","Power BI","Tableau","Python","Data Modeling"],
   stack:["Snowflake","BigQuery","Looker","Redshift"],
   delivers:["Executive dashboards and real-time reports","Self-service analytics platforms","Semantic data layer and mart architecture"],
   radar:[75,80,92,85,88],seniority:"Senior",senBar:"80%"},
  {title:"AI-Powered Engineers",avail:"hi",
   photo:"/assets/wp-content/uploads/2024/11/Conversational-UX-Architect-1024x1024.jpg",
   sub:"Full-stack AI-native development",
   desc:"Software engineers trained in GenDD who build AI-native applications — from LLM-powered products to agentic workflows, shipping production software that leverages AI as a first-class capability.",
   skills:["Python","TypeScript","LangChain","FastAPI","React","RAG"],
   stack:["OpenAI/Claude APIs","LangChain","AWS","Next.js"],
   delivers:["AI-native web applications and APIs","LLM-powered product features","Agentic workflows and automations"],
   radar:[88,90,78,80,85],seniority:"Senior+",senBar:"90%"},
  {title:"ML Engineers",avail:"md",
   photo:"/assets/wp-content/uploads/2024/11/Machine-Learning-Engineers-1080-1024x1024.jpg",
   sub:"Building & optimizing ML systems",
   desc:"Bridge the gap between ML research and production engineering. Build scalable training pipelines, optimize model performance, and integrate ML into product systems.",
   skills:["Python","PyTorch","CUDA","C++","Distributed Training","Model Optimization"],
   stack:["Ray","Triton","ONNX","TensorRT"],
   delivers:["Optimized model training pipelines","Production inference with low latency","Custom fine-tuning and distillation"],
   radar:[92,88,80,85,72],seniority:"Senior+",senBar:"92%"},
  {title:"Databricks Experts",avail:"hi",
   photo:"/assets/wp-content/uploads/2024/11/Databricks-Expert-1024x1024.jpg",
   sub:"Lakehouse architecture & Spark engineering",
   desc:"Specialists in Databricks and the modern data lakehouse. Build data pipelines, lakehouse architectures, and ML workflows on unified data platforms.",
   skills:["Databricks","Apache Spark","Delta Lake","SQL","Python","MLflow"],
   stack:["Databricks","Delta Lake","Unity Catalog","Azure/AWS"],
   delivers:["Lakehouse data architectures","High-throughput ETL pipelines on Spark","ML workflows within Databricks ML Runtime"],
   radar:[78,85,95,80,76],seniority:"Expert",senBar:"95%"},
  {title:"Data Engineers",avail:"hi",
   photo:"/assets/wp-content/uploads/2024/11/Data-Scientist-HWAI-1080-1024x1024.jpg",
   sub:"Data pipelines & infrastructure",
   desc:"Build the data infrastructure that powers AI. Design and maintain scalable pipelines, data warehouses, and streaming architectures that deliver clean, reliable data.",
   skills:["Python","SQL","Apache Kafka","Airflow","dbt","Spark"],
   stack:["Snowflake","BigQuery","Kafka","Airflow"],
   delivers:["Real-time and batch data pipelines","Cloud data warehouse architecture","Data quality frameworks and observability"],
   radar:[80,86,94,78,82],seniority:"Senior",senBar:"85%"},
  {title:"AI Strategists",avail:"md",
   photo:"/assets/wp-content/uploads/2024/11/AI-Strategist-HWAI-1024x1024.jpg",
   sub:"AI roadmapping & transformation leadership",
   desc:"Senior practitioners who translate AI capability into business outcomes. Lead AI adoption programs, define roadmaps, and ensure your AI investments deliver measurable ROI.",
   skills:["AI Strategy","GenDD Methodology","Roadmapping","Stakeholder Management","ROI Modeling"],
   stack:["AI Assessment Frameworks","GenDD Tools","OKR Systems","Workshop Facilitation"],
   delivers:["AI opportunity assessments and ROI models","Phased AI transformation roadmaps","Executive AI education and change management"],
   radar:[72,78,80,92,95],seniority:"Principal",senBar:"98%"},
  /* index 8 — FDE (featured card) */
  {title:"Forward-Deployed Engineers",avail:"hi",
   photo:"/assets/wp-content/uploads/2024/11/Machine-Learning-Engineers-1080-1024x1024.jpg",
   sub:"Embed, integrate, and ship AI to production",
   desc:"FDEs embed directly inside your organization to implement, integrate, and operationalize AI systems in production. GenDD-trained to own outcomes from kickoff through delivery — not just deliverables.",
   skills:["System Integration","LLM Deployment","API Design","Agentic Workflows","Stakeholder Communication","GenDD"],
   stack:["OpenAI / Claude APIs","LangChain","AWS / GCP","React / Next.js"],
   delivers:["Production AI systems deployed inside client environments","LLM integrations and agentic workflow automation","Technical scoping through post-deployment iteration"],
   radar:[90,92,82,85,94],seniority:"Senior+",senBar:"92%"}
];
const AXES=["ML/AI","Engineering","Data","Domain","Communication"];

/* ── RADAR ─────────────────────────────────────────── */
function drawRadar(canvas,vals){
  const ctx=canvas.getContext("2d");
  const W=canvas.width,H=canvas.height,cx=W/2,cy=H/2;
  const r=Math.min(W,H)/2-22,n=AXES.length;
  ctx.clearRect(0,0,W,H);
  const ang=i=>(Math.PI*2*i/n)-Math.PI/2;
  [.25,.5,.75,1].forEach(f=>{
    ctx.beginPath();
    for(let i=0;i<n;i++){const a=ang(i),rr=r*f;i===0?ctx.moveTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a)):ctx.lineTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a));}
    ctx.closePath();ctx.strokeStyle=f===1?"rgba(58,189,188,.22)":"rgba(255,255,255,.04)";ctx.lineWidth=f===1?1:.7;ctx.stroke();
  });
  for(let i=0;i<n;i++){
    const a=ang(i);
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));
    ctx.strokeStyle="rgba(255,255,255,.05)";ctx.lineWidth=.7;ctx.stroke();
    ctx.font="9px 'Open Sans',sans-serif";ctx.fillStyle="rgba(255,255,255,.38)";
    ctx.textAlign="center";ctx.textBaseline="middle";
    ctx.fillText(AXES[i],cx+(r+13)*Math.cos(a),cy+(r+13)*Math.sin(a));
  }
  const pts=vals.map((v,i)=>{const a=ang(i),rr=r*(v/100);return[cx+rr*Math.cos(a),cy+rr*Math.sin(a)];});
  ctx.beginPath();pts.forEach(([x,y],i)=>i===0?ctx.moveTo(x,y):ctx.lineTo(x,y));ctx.closePath();
  ctx.fillStyle="rgba(58,189,188,.14)";ctx.fill();ctx.strokeStyle="#3ABDBC";ctx.lineWidth=1.5;ctx.stroke();
  pts.forEach(([x,y])=>{ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle="#3ABDBC";ctx.fill();});
}

/* ── SET ROLE ───────────────────────────────────────── */
function setRole(idx){
  const r=ROLES[idx];
  // deactivate all selectable elements
  document.querySelectorAll("[data-role]").forEach(c=>c.classList.remove("active"));
  // activate the clicked one
  const clicked=document.querySelector("[data-role='"+idx+"']");
  if(clicked) clicked.classList.add("active");
  document.getElementById("rpImg").src=r.photo;
  document.getElementById("rpImg").alt=r.title;
  document.getElementById("rpTitle").textContent=r.title;
  document.getElementById("rpSub").textContent=r.sub;
  document.getElementById("rpDesc").textContent=r.desc;
  document.getElementById("rpSkills").innerHTML=r.skills.map(s=>'<span class="rp-chip">'+s+'</span>').join("");
  document.getElementById("rpStack").innerHTML=r.stack.map(s=>'<span class="rp-chip rp-chip-t">'+s+'</span>').join("");
  document.getElementById("rpDelivers").innerHTML=r.delivers.map(d=>'<div class="rp-del"><span class="rp-del-arrow">→</span>'+d+'</div>').join("");
  document.getElementById("rpSeniority").textContent=r.seniority;
  document.getElementById("rpSenLabel").textContent=r.seniority;
  document.getElementById("rpSenPct").textContent=r.senBar;
  document.getElementById("rpSenFill").style.width=r.senBar;
  const c=document.getElementById("radarCanvas");if(c)drawRadar(c,r.radar);
  const panel=document.getElementById("rolePanel");
  panel.style.animation="none";void panel.offsetHeight;panel.style.animation="";
  panel.scrollIntoView({behavior:"smooth",block:"nearest"});
}

/* ── INIT ───────────────────────────────────────────── */
// Wire up all cards — both grid cards and the FDE featured card
document.querySelectorAll("[data-role]").forEach(card=>{
  card.addEventListener("click",()=>setRole(parseInt(card.dataset.role)));
  card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setRole(parseInt(card.dataset.role));}});
});
setRole(0);

/* ── SCROLL REVEAL ──────────────────────────────────── */
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");obs.unobserve(e.target);}});},{threshold:0.06});
document.querySelectorAll(".hw-tt .rv").forEach(el=>obs.observe(el));

/* ── RETENTION GAUGE ────────────────────────────────── */
const gauge=document.getElementById("retGauge"),retV=document.getElementById("retV");
if(gauge){
  const go=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){
    gauge.classList.add("in");
    let st=null;
    (function step(ts){if(!st)st=ts;const p=Math.min((ts-st)/2200,1),ease=1-Math.pow(1-p,3);
    retV.textContent=(98.2*ease).toFixed(1)+"%";if(p<1)requestAnimationFrame(step);})(performance.now());
    go.unobserve(e.target);}});},{threshold:.3});
  go.observe(gauge);
}
;
/* ── CONSTELLATION HERO BACKGROUND ─────────────────── */
(function(){
  const canvas=document.getElementById('heroCanvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let W,H,stars=[],mouse={x:-9999,y:-9999};
  const N=90,CONNECT=140,MOUSE_R=120;
  function resize(){const sect=canvas.closest('.hero');W=canvas.width=sect?sect.offsetWidth:window.innerWidth;H=canvas.height=sect?sect.offsetHeight:window.innerHeight;}
  function Star(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-.5)*.18;this.vy=(Math.random()-.5)*.18;this.r=Math.random()*1.2+.4;this.op=Math.random()*.45+.15;this.ph=Math.random()*Math.PI*2;}
  function init(){stars=[];for(let i=0;i<N;i++)stars.push(new Star());}
  function draw(){
    const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,'rgba(13,17,23,1)');bg.addColorStop(.5,'rgba(17,24,34,1)');bg.addColorStop(1,'rgba(13,17,23,1)');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    stars.forEach(s=>{s.ph+=.008;s.x+=s.vx;s.y+=s.vy;if(s.x<0)s.x=W;if(s.x>W)s.x=0;if(s.y<0)s.y=H;if(s.y>H)s.y=0;const dx=s.x-mouse.x,dy=s.y-mouse.y,d=Math.sqrt(dx*dx+dy*dy);if(d<MOUSE_R&&d>0){const f=(MOUSE_R-d)/MOUSE_R*.5;s.x+=dx/d*f;s.y+=dy/d*f;}});
    for(let i=0;i<stars.length;i++){for(let j=i+1;j<stars.length;j++){const dx=stars[i].x-stars[j].x,dy=stars[i].y-stars[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<CONNECT){const a=(1-d/CONNECT)*.14;ctx.beginPath();ctx.strokeStyle=`rgba(58,189,188,${a})`;ctx.lineWidth=.5;ctx.moveTo(stars[i].x,stars[i].y);ctx.lineTo(stars[j].x,stars[j].y);ctx.stroke();}}const dx=stars[i].x-mouse.x,dy=stars[i].y-mouse.y,d=Math.sqrt(dx*dx+dy*dy);if(d<MOUSE_R){const a=(1-d/MOUSE_R)*.35;ctx.beginPath();ctx.strokeStyle=`rgba(58,189,188,${a})`;ctx.lineWidth=.7;ctx.moveTo(stars[i].x,stars[i].y);ctx.lineTo(mouse.x,mouse.y);ctx.stroke();}}
    stars.forEach(s=>{const pulse=.5+Math.sin(s.ph)*.28;ctx.beginPath();ctx.arc(s.x,s.y,s.r*pulse,0,Math.PI*2);ctx.fillStyle=`rgba(191,239,239,${s.op*pulse})`;ctx.fill();});
    requestAnimationFrame(draw);
  }
  const hero=canvas.closest('.hero');
  if(hero){hero.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;});hero.addEventListener('mouseleave',()=>{mouse.x=-9999;mouse.y=-9999;});}
  window.addEventListener('resize',()=>{resize();init();});
  resize();init();draw();
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":35333,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

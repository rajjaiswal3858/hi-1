(function(){
var root=document.getElementById('gendd-loop-widget');
var colors={context:'#1a9e3f',plan:'#c96a15',confirm:'#b8a008',execute:'#14917e',validate:'#1e6ea0'};
var order=['context','plan','confirm','execute','validate'];
var active='context';
var timer=null;
var paused=false;

function activate(name){
  active=name;
  var nodes=root.querySelectorAll('.lw-node');
  for(var i=0;i<nodes.length;i++){
    if(nodes[i].getAttribute('data-n')===name){nodes[i].classList.add('active')}
    else{nodes[i].classList.remove('active')}
  }
  var steps=root.querySelectorAll('.lw-step');
  for(var i=0;i<steps.length;i++){
    if(steps[i].getAttribute('data-n')===name){steps[i].classList.add('active')}
    else{steps[i].classList.remove('active')}
  }
}

function advance(){
  if(paused) return;
  var idx=order.indexOf(active);
  var next=order[(idx+1)%order.length];
  activate(next);
}

var svgNodes=root.querySelectorAll('.lw-node');
for(var i=0;i<svgNodes.length;i++){
  (function(el){
    el.addEventListener('click',function(){activate(el.getAttribute('data-n'))});
    el.addEventListener('mouseenter',function(){paused=true});
    el.addEventListener('mouseleave',function(){paused=false});
  })(svgNodes[i]);
}

var stepEls=root.querySelectorAll('.lw-step');
for(var i=0;i<stepEls.length;i++){
  (function(el){
    el.addEventListener('click',function(){activate(el.getAttribute('data-n'))});
    el.addEventListener('mouseenter',function(){paused=true});
    el.addEventListener('mouseleave',function(){paused=false});
  })(stepEls[i]);
}

activate('context');
timer=setInterval(advance,3500);

// Orbiting flow particles
var orbitG=document.getElementById('lwOrbitParticles');
var orbitCount=8;
var orbitParticles=[];
for(var i=0;i<orbitCount;i++){
  var circle=document.createElementNS('http://www.w3.org/2000/svg','circle');
  circle.setAttribute('r',i%3===0?'3':'1.8');
  circle.setAttribute('fill','rgba(20,145,126,.35)');
  orbitG.appendChild(circle);
  var trail=document.createElementNS('http://www.w3.org/2000/svg','circle');
  trail.setAttribute('r',i%3===0?'1.5':'.8');
  trail.setAttribute('fill','rgba(20,145,126,.12)');
  orbitG.appendChild(trail);
  orbitParticles.push({el:circle,trail:trail,offset:i*(Math.PI*2/orbitCount),speed:.0008+Math.random()*.0003});
}

var orbitAngle=0;
function animateOrbit(){
  orbitAngle+=.006;
  for(var i=0;i<orbitParticles.length;i++){
    var p=orbitParticles[i];
    var a=orbitAngle+p.offset;
    var trailA=a-.12;
    var x=260+Math.cos(a)*192;
    var y=260+Math.sin(a)*192;
    var tx=260+Math.cos(trailA)*192;
    var ty=260+Math.sin(trailA)*192;
    p.el.setAttribute('cx',x);
    p.el.setAttribute('cy',y);
    p.trail.setAttribute('cx',tx);
    p.trail.setAttribute('cy',ty);
    var normA=((a%(Math.PI*2))+(Math.PI*2))%(Math.PI*2);
    var col='rgba(20,145,126,';
    if(normA<1.2) col='rgba(26,158,63,';
    else if(normA<2.4) col='rgba(201,106,21,';
    else if(normA<3.6) col='rgba(184,160,8,';
    else if(normA<4.8) col='rgba(20,145,126,';
    else col='rgba(30,110,160,';
    p.el.setAttribute('fill',col+'.4)');
    p.trail.setAttribute('fill',col+'.12)');
  }
  requestAnimationFrame(animateOrbit);
}
animateOrbit();

// Canvas particles — light theme
var c=document.getElementById('lwCanvas');
var ctx=c.getContext('2d');
var CW,CH,pts=[];
var mx=-9999,my=-9999;

function resize(){
  CW=c.width=root.offsetWidth;
  CH=c.height=root.offsetHeight;
  var count=Math.round(CW*CH/18000);
  pts=[];
  for(var i=0;i<count;i++){
    pts.push({
      x:Math.random()*CW,
      y:Math.random()*CH,
      vx:(Math.random()-0.5)*0.18,
      vy:(Math.random()-0.5)*0.18,
      r:Math.random()<0.06?1.5:0.7,
      k:Math.random()<0.06
    });
  }
}

function draw(){
  ctx.clearRect(0,0,CW,CH);
  for(var i=0;i<pts.length;i++){
    var a=pts[i];
    a.x+=a.vx;
    a.y+=a.vy;
    if(a.x<0||a.x>CW) a.vx*=-1;
    if(a.y<0||a.y>CH) a.vy*=-1;
    var dm=Math.sqrt((a.x-mx)*(a.x-mx)+(a.y-my)*(a.y-my));
    if(dm<140&&dm>0){
      var f=0.008*(140-dm);
      a.vx+=(a.x-mx)/dm*f;
      a.vy+=(a.y-my)/dm*f;
      var sp=Math.sqrt(a.vx*a.vx+a.vy*a.vy);
      if(sp>1.4){a.vx*=1.4/sp;a.vy*=1.4/sp}
    }
    ctx.beginPath();
    ctx.arc(a.x,a.y,a.r,0,6.283);
    ctx.fillStyle=a.k?'rgba(20,145,126,0.25)':'rgba(26,26,46,0.07)';
    ctx.fill();
    for(var j=i+1;j<pts.length;j++){
      var b=pts[j];
      var dx=a.x-b.x,dy=a.y-b.y;
      var d=Math.sqrt(dx*dx+dy*dy);
      if(d<100){
        ctx.beginPath();
        ctx.moveTo(a.x,a.y);
        ctx.lineTo(b.x,b.y);
        ctx.strokeStyle='rgba(20,145,126,'+(0.06*(1-d/100))+')';
        ctx.lineWidth=0.3;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}

resize();
draw();
window.addEventListener('resize',resize);
root.addEventListener('mousemove',function(e){
  var r=root.getBoundingClientRect();
  mx=e.clientX-r.left;
  my=e.clientY-r.top;
});
root.addEventListener('mouseleave',function(){mx=-9999;my=-9999});
root.addEventListener('touchmove',function(e){
  var t=e.touches[0];
  var r=root.getBoundingClientRect();
  mx=t.clientX-r.left;
  my=t.clientY-r.top;
},{passive:true});
root.addEventListener('touchend',function(){mx=-9999;my=-9999});

// Entrance
var obs=new IntersectionObserver(function(entries){
  for(var i=0;i<entries.length;i++){
    if(entries[i].isIntersecting){
      entries[i].target.classList.add('lw-v');
      obs.unobserve(entries[i].target);
    }
  }
},{threshold:0.12});
var animEls=root.querySelectorAll('.lw-a');
for(var i=0;i<animEls.length;i++) obs.observe(animEls[i]);

})();

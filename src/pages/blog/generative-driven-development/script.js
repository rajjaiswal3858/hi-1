(function(){
var root=document.getElementById('gendd-quote-section');
var obs=new IntersectionObserver(function(entries){
  for(var i=0;i<entries.length;i++){
    if(entries[i].isIntersecting){
      entries[i].target.classList.add('gq-v');
      root.classList.add('gq-vis');
      obs.unobserve(entries[i].target);
    }
  }
},{threshold:0.12});
var anims=root.querySelectorAll('.gq-a');
for(var i=0;i<anims.length;i++)obs.observe(anims[i]);
})();
;
(function(){
var root=document.getElementById('gendd-dash-section');

var DATA={
  '30d':{kpis:[{v:'480',u:'hrs',c:'#7dd3fc',d:'↓ -40%',dc:'#0ea5e9',db:'rgba(14,165,233,.1)'},{v:'347',u:'hrs',c:'#3abdbc',d:'▲ Ramping',dc:'#3abdbc',db:'rgba(58,189,188,.1)'},{v:'42',u:'%',c:'#22d3ee',d:'▲ +8% WoW',dc:'#4ade80',db:'rgba(74,222,128,.1)'},{v:'1.7',u:'×',c:'#e97845',d:'▲ Above baseline',dc:'#e97845',db:'rgba(233,120,69,.1)'}],spark:[2,3.2,3.8,4.5,5.1,5.8,6.2,6.9,7.3,7.8,8.0,8.4],sparkLabel:'8.4',sparkBadge:'+22%',axL:'Week 1',axR:'Week 4',donut:42,progs:[88,46,28]},
  '90d':{kpis:[{v:'1,280',u:'hrs',c:'#7dd3fc',d:'↓ -47%',dc:'#0ea5e9',db:'rgba(14,165,233,.1)'},{v:'1,340',u:'hrs',c:'#3abdbc',d:'▲ +286%',dc:'#3abdbc',db:'rgba(58,189,188,.1)'},{v:'54',u:'%',c:'#22d3ee',d:'▲ +12% QoQ',dc:'#4ade80',db:'rgba(74,222,128,.1)'},{v:'2.1',u:'×',c:'#e97845',d:'▲ Accelerating',dc:'#e97845',db:'rgba(233,120,69,.1)'}],spark:[3,4.5,5.8,6.5,7.2,8.0,8.8,9.5,10.2,11.0,12.1,13.0,13.8,14.8],sparkLabel:'14.8',sparkBadge:'+38%',axL:'Month 1',axR:'Month 3',donut:54,progs:[94,60,38]},
  '6m':{kpis:[{v:'2,240',u:'hrs',c:'#7dd3fc',d:'↓ -53%',dc:'#0ea5e9',db:'rgba(14,165,233,.1)'},{v:'3,200',u:'hrs',c:'#3abdbc',d:'▲ +340%',dc:'#3abdbc',db:'rgba(58,189,188,.1)'},{v:'64',u:'%',c:'#22d3ee',d:'▲ +18% HoH',dc:'#4ade80',db:'rgba(74,222,128,.1)'},{v:'2.6',u:'×',c:'#e97845',d:'▲ Compounding',dc:'#e97845',db:'rgba(233,120,69,.1)'}],spark:[3,4.8,6.2,7.5,8.6,9.8,10.8,11.5,12.8,14.0,15.2,16.0,17.1,17.8,18.6],sparkLabel:'18.6',sparkBadge:'+48%',axL:'Month 1',axR:'Month 6',donut:64,progs:[97,72,48]},
  '1y':{kpis:[{v:'3,840',u:'hrs',c:'#7dd3fc',d:'↓ -60%',dc:'#0ea5e9',db:'rgba(14,165,233,.1)'},{v:'7,680',u:'hrs',c:'#3abdbc',d:'▲ +480%',dc:'#3abdbc',db:'rgba(58,189,188,.1)'},{v:'75',u:'%',c:'#22d3ee',d:'▲ +22% YoY',dc:'#4ade80',db:'rgba(74,222,128,.1)'},{v:'3.2',u:'×',c:'#e97845',d:'▲ Peak',dc:'#e97845',db:'rgba(233,120,69,.1)'}],spark:[2,4,5.5,7,8.2,9.5,10.8,12,13.2,14.5,15.8,17,18.2,19.2,20.1,21.0,21.8,22.4],sparkLabel:'22.4',sparkBadge:'+62%',axL:'Q1',axR:'Q4',donut:75,progs:[100,82,64]}
};

function buildPath(vals,w,h){var pad=4,min=Infinity,max=-Infinity;for(var i=0;i<vals.length;i++){if(vals[i]<min)min=vals[i];if(vals[i]>max)max=vals[i]}var range=max-min||1;var pts=[];for(var i=0;i<vals.length;i++){pts.push({x:pad+(i/(vals.length-1))*(w-pad*2),y:h-pad-((vals[i]-min)/range)*(h-pad*2)})}var d='M'+pts[0].x+' '+pts[0].y;for(var i=1;i<pts.length;i++){var cpx=(pts[i-1].x+pts[i].x)/2;d+=' C'+cpx+' '+pts[i-1].y+' '+cpx+' '+pts[i].y+' '+pts[i].x+' '+pts[i].y}return{d:d,last:pts[pts.length-1]}}

function render(key,animate){var d=DATA[key];if(!d)return;for(var i=0;i<4;i++){var el=document.getElementById('kv'+i);var dl=document.getElementById('kd'+i);el.style.color=d.kpis[i].c;el.innerHTML=d.kpis[i].v+'<sub>'+d.kpis[i].u+'</sub>';dl.textContent=d.kpis[i].d;dl.style.color=d.kpis[i].dc;dl.style.background=d.kpis[i].db}var sp=buildPath(d.spark,400,72);var lineEl=document.getElementById('spLine');var fillEl=document.getElementById('spFill');var dotEl=document.getElementById('spDot');lineEl.setAttribute('d',sp.d);fillEl.setAttribute('d',sp.d+' L396 72 L4 72 Z');dotEl.setAttribute('cx',sp.last.x);dotEl.setAttribute('cy',sp.last.y);if(animate){var len=lineEl.getTotalLength?lineEl.getTotalLength():600;lineEl.style.transition='none';lineEl.style.strokeDasharray=len;lineEl.style.strokeDashoffset=len;dotEl.style.opacity='0';setTimeout(function(){lineEl.style.transition='stroke-dashoffset 1.2s cubic-bezier(.23,1,.32,1)';lineEl.style.strokeDashoffset='0';setTimeout(function(){dotEl.style.opacity='1';dotEl.style.transition='opacity .3s'},1000)},30)}else{lineEl.style.strokeDasharray='none';lineEl.style.strokeDashoffset='0';dotEl.style.opacity='1'}document.getElementById('chBig0').innerHTML=d.sparkLabel+' <span>hrs / sprint</span>';document.getElementById('chBadge0').textContent=d.sparkBadge;document.getElementById('axL').textContent=d.axL;document.getElementById('axR').textContent=d.axR;var circ=Math.round(2*Math.PI*27);var aiLen=Math.round(circ*(d.donut/100));document.getElementById('donutAI').style.strokeDasharray=aiLen+' '+(circ-aiLen);document.getElementById('donutTxt').textContent=d.donut+'%';document.getElementById('chBig1').innerHTML=d.donut+'<span>% AI</span>';for(var i=0;i<3;i++){document.getElementById('pv'+i).textContent=d.progs[i]+'%';var bar=document.getElementById('pf'+i);if(animate){bar.style.width='0';(function(b,v,delay){setTimeout(function(){b.style.width=v+'%'},delay)})(bar,d.progs[i],200+i*100)}else{bar.style.width=d.progs[i]+'%'}}}

var sparkSvg=document.getElementById('dwSpark');
sparkSvg.addEventListener('mousemove',function(e){var rect=sparkSvg.getBoundingClientRect();var x=(e.clientX-rect.left)/rect.width;var dot=document.getElementById('spDot');var line=document.getElementById('spLine');if(line.getTotalLength){var pt=line.getPointAtLength(x*line.getTotalLength());dot.setAttribute('cx',pt.x);dot.setAttribute('cy',pt.y);dot.style.opacity='1'}});
sparkSvg.addEventListener('mouseleave',function(){var activeKey=root.querySelector('.dw-tab.on').getAttribute('data-t');var d=DATA[activeKey];var sp=buildPath(d.spark,400,72);var dot=document.getElementById('spDot');dot.setAttribute('cx',sp.last.x);dot.setAttribute('cy',sp.last.y)});

var tabs=root.querySelectorAll('.dw-tab');
for(var i=0;i<tabs.length;i++){(function(tab){tab.addEventListener('click',function(){for(var j=0;j<tabs.length;j++)tabs[j].classList.remove('on');tab.classList.add('on');render(tab.getAttribute('data-t'),true)})})(tabs[i])}

var obs=new IntersectionObserver(function(entries){for(var i=0;i<entries.length;i++){if(entries[i].isIntersecting){entries[i].target.classList.add('dw-v');render('30d',true);obs.unobserve(entries[i].target)}}},{threshold:0.12});
var anims=root.querySelectorAll('.dw-a');
for(var i=0;i<anims.length;i++)obs.observe(anims[i]);
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":33312,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":3486,"estimatedReadTimeSeconds":879,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

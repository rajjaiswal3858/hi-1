(function(){
var root=document.getElementById('gendd-quadrant');
var cells=root.querySelectorAll('.gq-cell');
var chart=root.querySelector('.gq-chart');
var activeQ=null;
var hideTimeout=null;

/* Desktop tooltip elements */
var tip=document.getElementById('gqTip');
var tDot=document.getElementById('gqTDot');
var tName=document.getElementById('gqTName');
var tDesc=document.getElementById('gqTDesc');
var tTag=document.getElementById('gqTTag');

/* Mobile info bar elements */
var infoBar=document.getElementById('gqInfo');
var iDot=document.getElementById('gqIDot');
var iName=document.getElementById('gqIName');
var iDesc=document.getElementById('gqIDesc');
var iTag=document.getElementById('gqITag');
var iPlaceholder=document.getElementById('gqIPlaceholder');

var info={
  ai:{name:'AI-Assisted Development',desc:'AI helps at the edges — code completion, basic generation. Without governance, speed gains introduce new risk. Fast-ish, but fragile.',tag:'Low Speed · High Risk',color:'#b07e28',bg:'rgba(176,126,40,.08)',border:'rgba(176,126,40,.18)'},
  vibe:{name:'Vibecoding',desc:'Fast but ungoverned. AI generates code without structure, review, or quality gates. Speed today, rework and risk tomorrow.',tag:'High Speed · High Risk',color:'#be3c2d',bg:'rgba(190,60,45,.08)',border:'rgba(190,60,45,.18)'},
  trad:{name:'Traditional Development',desc:'Manual processes, waterfall handoffs, and slow delivery. Structured and familiar, but you leave all the speed on the table.',tag:'Low Speed · Low Risk',color:'#c93a2a',bg:'rgba(201,58,42,.08)',border:'rgba(201,58,42,.18)'},
  gendd:{name:'GenDD',desc:'The AI-native operating model. Structured execution loop, governance built in, production-grade quality at speed. The standard.',tag:'High Speed · Low Risk',color:'#1a9e9d',bg:'rgba(26,158,157,.08)',border:'rgba(26,158,157,.18)'}
};

function isMobile(){return window.innerWidth<=700}

function showDesktopTip(q,cellEl){
  var d=info[q];if(!d)return;
  tDot.style.background=d.color;
  tName.textContent=d.name;
  tName.style.color=d.color;
  tDesc.textContent=d.desc;
  tTag.textContent=d.tag;
  tTag.style.background=d.bg;
  tTag.style.color=d.color;
  tTag.style.border='1px solid '+d.border;

  var cr=cellEl.getBoundingClientRect();
  var pr=chart.getBoundingClientRect();
  var cellLeft=cr.left-pr.left;
  var cellTop=cr.top-pr.top;
  var tipW=Math.min(240,cr.width*.8);
  var tx=cellLeft+(cr.width-tipW)/2;

  tip.style.width=tipW+'px';
  tip.style.left=tx+'px';
  tip.classList.add('show');

  requestAnimationFrame(function(){
    var tipH=tip.offsetHeight;
    var ty=cellTop+(cr.height-tipH)/2;
    if(ty<cellTop+6) ty=cellTop+6;
    if(ty+tipH>cellTop+cr.height-6) ty=cellTop+cr.height-tipH-6;
    tip.style.top=ty+'px';
  });
}

function hideDesktopTip(){
  tip.classList.remove('show');
}

function showMobileInfo(q){
  var d=info[q];if(!d)return;
  iPlaceholder.style.display='none';
  iName.style.display='';iDesc.style.display='';iTag.style.display='';
  iDot.style.background=d.color;
  iName.textContent=d.name;
  iName.style.color=d.color;
  iDesc.textContent=d.desc;
  iTag.textContent=d.tag;
  iTag.style.background=d.bg;
  iTag.style.color=d.color;
  iTag.style.border='1px solid '+d.border;
  infoBar.classList.add('active');
}

function hideMobileInfo(){
  infoBar.classList.remove('active');
  iPlaceholder.style.display='';
  iName.style.display='none';iDesc.style.display='none';iTag.style.display='none';
  iDot.style.background='rgba(26,26,46,.15)';
}

function activate(q,cellEl){
  if(hideTimeout){clearTimeout(hideTimeout);hideTimeout=null}
  activeQ=q;
  for(var i=0;i<cells.length;i++) cells[i].classList.toggle('on',cells[i].getAttribute('data-q')===q);
  if(isMobile()){
    showMobileInfo(q);
  } else {
    showDesktopTip(q,cellEl);
  }
}

function deactivate(){
  hideTimeout=setTimeout(function(){
    activeQ=null;
    for(var i=0;i<cells.length;i++) cells[i].classList.remove('on');
    hideDesktopTip();
    hideMobileInfo();
    hideTimeout=null;
  },80);
}

function deactivateNow(){
  if(hideTimeout){clearTimeout(hideTimeout);hideTimeout=null}
  activeQ=null;
  for(var i=0;i<cells.length;i++) cells[i].classList.remove('on');
  hideDesktopTip();
  hideMobileInfo();
}

/* Hover for desktop */
for(var i=0;i<cells.length;i++){
  (function(cell){
    cell.addEventListener('mouseenter',function(){
      if(!isMobile()) activate(cell.getAttribute('data-q'),cell);
    });
    cell.addEventListener('mouseleave',function(){
      if(!isMobile()) deactivate();
    });
    /* Tap for mobile */
    cell.addEventListener('click',function(e){
      e.stopPropagation();
      var q=cell.getAttribute('data-q');
      if(activeQ===q){deactivateNow()}
      else{activate(q,cell)}
    });
  })(cells[i]);
}

tip.addEventListener('mouseenter',function(){
  if(hideTimeout){clearTimeout(hideTimeout);hideTimeout=null}
});
tip.addEventListener('mouseleave',function(){
  deactivate();
});

document.addEventListener('click',function(){
  if(activeQ) deactivateNow();
});

/* Entrance */
var obs=new IntersectionObserver(function(entries){
  for(var i=0;i<entries.length;i++){
    if(entries[i].isIntersecting){entries[i].target.classList.add('gq-v');obs.unobserve(entries[i].target)}
  }
},{threshold:0.08});
var anims=root.querySelectorAll('.gq-a');
for(var i=0;i<anims.length;i++) obs.observe(anims[i]);
})();

(function(){
  var charts=document.querySelectorAll('.hw-chart');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('hw-in');io.unobserve(e.target);}});},{threshold:.3});
    charts.forEach(function(c){io.observe(c);});
  } else { charts.forEach(function(c){c.classList.add('hw-in');}); }

  var t=document.getElementById('hw-tasks'),p=document.getElementById('hw-price');
  if(!t||!p) return;
  var to=document.getElementById('hw-tasks-out'),po=document.getElementById('hw-price-out'),r=document.getElementById('hw-calc-result');
  var base=10000;
  function fmt(n){return '$'+Math.round(n).toLocaleString('en-US');}
  function upd(){
    var tasks=+t.value,price=+p.value,bill=tasks*price,ch=Math.round((bill-base)/base*100);
    to.textContent=tasks.toLocaleString('en-US');
    po.textContent='$'+price.toFixed(2);
    var dir=ch>0?'up '+ch+'%':(ch<0?'down '+Math.abs(ch)+'%':'unchanged');
    r.innerHTML='New bill: <strong>'+fmt(bill)+'/mo</strong>, '+dir+(ch===0?' from':' from')+' the $10,000 baseline.';
  }
  t.addEventListener('input',upd);p.addEventListener('input',upd);
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":37909,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":1551,"estimatedReadTimeSeconds":391,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

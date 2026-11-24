(function(){
  var root=document.getElementById('hwca-test');if(!root)return;
  var answers={};
  var box=root.querySelector('.hwca-test__result');
  var verdict=root.querySelector('.hwca-test__verdict');
  var detail=root.querySelector('.hwca-test__detail');
  function render(){
    var keys=Object.keys(answers),n=keys.length,yes=0;
    keys.forEach(function(k){yes+=answers[k];});
    if(n<4){
      box.setAttribute('data-state','idle');
      verdict.textContent='Go agnostic only when at least two tests are true.';
      detail.innerHTML='<span class="hwca-test__score">'+n+' of 4</span> answered so far.';
      return;
    }
    var score='<span class="hwca-test__score">'+yes+' of 4 true.</span> ';
    if(yes>=2&&answers['1']===1){
      box.setAttribute('data-state','go');
      verdict.textContent='Pay for portability in this layer.';
      detail.innerHTML=score+'Build the abstraction from the second real implementation, not before it. The first one always encodes the wrong assumptions.';
    }else if(yes>=2){
      box.setAttribute('data-state','wait');
      verdict.textContent='Not yet. The second target is not real.';
      detail.innerHTML=score+'Never build the abstraction before the second real implementation exists. Keep the option value cheap instead: code over cloud DSLs, standard interfaces, mirrored artifacts.';
    }else{
      box.setAttribute('data-state','stop');
      verdict.textContent='Stay native in this layer.';
      detail.innerHTML=score+'Lock-in here is cheap to undo. Use the cloud’s native option and spend the effort somewhere the price is higher.';
    }
  }
  root.querySelectorAll('.hwca-test__q').forEach(function(q){
    var id=q.getAttribute('data-q');
    var btns=q.querySelectorAll('button');
    btns.forEach(function(b){
      b.addEventListener('click',function(){
        btns.forEach(function(o){o.setAttribute('aria-pressed','false');});
        b.setAttribute('aria-pressed','true');
        answers[id]=parseInt(b.getAttribute('data-v'),10);
        render();
      });
    });
  });
})();
;
(function(){
  var root=document.getElementById('hwca-map');if(!root)return;
  var rows=root.querySelectorAll('.hwca-map__row');
  rows.forEach(function(r,i){
    var why=document.getElementById(r.getAttribute('aria-controls'));
    if(i>0&&why){why.hidden=true;}else{r.setAttribute('aria-expanded','true');}
    r.addEventListener('click',function(){
      var open=r.getAttribute('aria-expanded')==='true';
      r.setAttribute('aria-expanded',open?'false':'true');
      if(why)why.hidden=open;
    });
  });
  var filters=root.querySelectorAll('[data-filter]');
  var items=root.querySelectorAll('.hwca-map__stack li[data-kind]');
  filters.forEach(function(f){
    f.addEventListener('click',function(){
      var k=f.getAttribute('data-filter');
      filters.forEach(function(o){o.setAttribute('aria-pressed',o===f?'true':'false');});
      items.forEach(function(li){
        var match=k==='all'||li.getAttribute('data-kind')===k;
        li.classList.toggle('is-dim',!match);
        var btn=li.querySelector('.hwca-map__row'),why=li.querySelector('.hwca-map__why');
        if(k!=='all'&&match&&btn&&why){btn.setAttribute('aria-expanded','true');why.hidden=false;}
      });
    });
  });
})();
;
(function(){
  var root=document.getElementById('hwca-cost');if(!root)return;
  var MAX=17;
  var D={
    core:{first:3,second:1.5,fl:'About 3 weeks',sl:'About 1.5 weeks',stat:'<strong>About 2x faster</strong> for network, Kubernetes, and data.'},
    parity:{first:17,second:4,fl:'About 4 months',sl:'About 4 weeks',stat:'<strong>About 4x faster</strong> to full parity across streaming, workflows, search, cache, GitOps, and app config.'}
  };
  var btns=root.querySelectorAll('[data-m]');
  function set(m){
    var d=D[m];
    btns.forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-m')===m?'true':'false');});
    root.querySelector('[data-fill="first"]').style.width=(d.first/MAX*100)+'%';
    root.querySelector('[data-fill="second"]').style.width=(d.second/MAX*100)+'%';
    root.querySelector('[data-out="first"]').textContent=d.fl;
    root.querySelector('[data-out="second"]').textContent=d.sl;
    root.querySelector('[data-out="stat"]').innerHTML=d.stat;
  }
  btns.forEach(function(b){b.addEventListener('click',function(){set(b.getAttribute('data-m'));});});
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":37655,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":3238,"estimatedReadTimeSeconds":816,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

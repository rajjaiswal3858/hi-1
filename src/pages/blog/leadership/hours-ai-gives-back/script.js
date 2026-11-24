(function(){
  /* Ledger: what you can prove about 20 freed hours */
  document.querySelectorAll('.hwhr-viz[data-hwhr="ledger"]').forEach(function(root){
    if(root.dataset.ready){return;} root.dataset.ready='1';
    var rows=root.querySelectorAll('.hwhr-row');
    var a=root.querySelector('.hwhr-seg-a'), b=root.querySelector('.hwhr-seg-b'), sum=root.querySelector('[data-sum]');
    var msgs={
      none:['is-leak','<strong>0 of 20 hours provable.</strong> This is a savings estimate. The hours went to whatever was nearest, and nobody can say what they produced.'],
      dest:['is-partial','<strong>A plan, not a result.</strong> The hours have a destination, but nobody answers for it and nothing shows whether it happened.'],
      owner:['is-partial','<strong>Someone owns the hours, but owns them for what?</strong> Without a named destination, the owner has nothing to deliver.'],
      base:['is-partial','<strong>You can measure, but measure what?</strong> A baseline needs a destination and an owner before it proves anything.'],
      dest_owner:['is-partial','<strong>Close.</strong> The destination and the owner are set, but without a baseline you cannot show the output moved.'],
      dest_base:['is-partial','<strong>Measurable, but orphaned.</strong> When the metric stalls, nobody is accountable for reassigning the hours.'],
      owner_base:['is-partial','<strong>Owned and measured, but aimed at nothing.</strong> Name the output the hours will fund.'],
      all:['is-roi','<strong>20 of 20 hours provable.</strong> A named output, one accountable leader, and a baseline to check against. This is ROI you can show the CFO.']
    };
    function render(){
      var on=[];rows.forEach(function(r){if(r.getAttribute('aria-checked')==='true'){on.push(r.dataset.k);}});
      var key=on.length===0?'none':on.length===3?'all':on.join('_');
      var pct=on.length===3?100:0;
      a.style.width=pct+'%'; b.style.width=(100-pct)+'%';
      var m=msgs[key]||msgs.none; sum.className='hwhr-sum '+m[0]; sum.innerHTML=m[1];
    }
    rows.forEach(function(r){
      function toggle(){r.setAttribute('aria-checked',r.getAttribute('aria-checked')==='true'?'false':'true');render();}
      r.addEventListener('click',toggle);
      r.addEventListener('keydown',function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();toggle();}});
    });
    render();
  });

  /* Pool: fragments versus a usable block */
  document.querySelectorAll('.hwhr-viz[data-hwhr="pool"]').forEach(function(root){
    if(root.dataset.ready){return;} root.dataset.ready='1';
    var wrap=root.querySelector('[data-people]'), tabs=root.querySelectorAll('.hwhr-tab');
    var lefts=[18,62,35,81,9,47,70,26,55,90], chips=[];
    for(var i=0;i<10;i++){
      var row=document.createElement('div');row.className='hwhr-person';
      row.innerHTML='<span class="hwhr-name">Person '+(i+1)+'</span><span class="hwhr-track"><span class="hwhr-chip"></span></span>';
      wrap.appendChild(row);chips.push(row.querySelector('.hwhr-chip'));
    }
    var stats={total:root.querySelector('[data-s="total"]'),block:root.querySelector('[data-s="block"]'),people:root.querySelector('[data-s="people"]')};
    function render(mode){
      chips.forEach(function(c,i){
        if(mode==='pool'){
          c.classList.toggle('is-block',i===0);
          c.style.left=i===0?'10%':'0%'; c.style.width=i===0?'25%':'0%';
        }else{
          c.classList.remove('is-block'); c.style.left=lefts[i]+'%'; c.style.width='2.5%';
        }
      });
      stats.block.textContent=mode==='pool'?'2 hrs':'12 min';
      stats.people.textContent=mode==='pool'?'1':'0';
      tabs.forEach(function(t){var on=t.dataset.mode===mode;t.setAttribute('aria-selected',on?'true':'false');t.setAttribute('tabindex',on?'0':'-1');});
    }
    tabs.forEach(function(t){
      t.addEventListener('click',function(){render(t.dataset.mode);});
      t.addEventListener('keydown',function(e){
        if(e.key===' '||e.key==='Enter'){e.preventDefault();render(t.dataset.mode);}
        if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();var n=t.dataset.mode==='frag'?'pool':'frag';render(n);root.querySelector('[data-mode="'+n+'"]').focus();}
      });
    });
    render('frag');
  });
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":37890,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":1886,"estimatedReadTimeSeconds":475,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

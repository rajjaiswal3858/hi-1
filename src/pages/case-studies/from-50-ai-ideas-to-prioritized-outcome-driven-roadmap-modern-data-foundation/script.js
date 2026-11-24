(function(){
  var root=document.getElementById('hw-haydon-cs');
  if(!root||root.dataset.hwInit)return; root.dataset.hwInit='1';
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el){
    var target=parseInt(el.getAttribute('data-count'),10)||0;
    if(reduce){el.textContent=target;return;}
    var dur=1100,start=null;
    function tick(ts){if(!start)start=ts;var p=Math.min((ts-start)/dur,1);var e=1-Math.pow(1-p,3);el.textContent=Math.round(e*target);if(p<1)requestAnimationFrame(tick);}
    requestAnimationFrame(tick);
  }

  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(!e.isIntersecting)return;
        e.target.classList.add('is-in');
        e.target.querySelectorAll('[data-count]').forEach(function(n){if(!n.dataset.done){n.dataset.done='1';countUp(n);}});
        io.unobserve(e.target);
      });
    },{threshold:.2});
    root.querySelectorAll('.hw-reveal').forEach(function(el){io.observe(el);});
    var m=root.querySelector('#hw-metrics'); if(m)io.observe(m);
  }else{
    root.querySelectorAll('.hw-reveal').forEach(function(el){el.classList.add('is-in');});
    root.querySelectorAll('[data-count]').forEach(function(n){n.textContent=n.getAttribute('data-count');});
  }

  /* Accordions */
  root.querySelectorAll('[data-acc]').forEach(function(acc){
    var btns=acc.querySelectorAll('.hw-acc__btn');
    function setOpen(btn,open){var p=document.getElementById(btn.getAttribute('aria-controls'));btn.setAttribute('aria-expanded',open?'true':'false');p.style.maxHeight=open?(p.firstElementChild.offsetHeight+'px'):'0px';}
    btns.forEach(function(btn){
      setOpen(btn,btn.getAttribute('aria-expanded')==='true');
      btn.addEventListener('click',function(){var isOpen=btn.getAttribute('aria-expanded')==='true';btns.forEach(function(b){if(b!==btn)setOpen(b,false);});setOpen(btn,!isOpen);});
    });
    window.addEventListener('resize',function(){btns.forEach(function(b){if(b.getAttribute('aria-expanded')==='true')setOpen(b,true);});});
  });

  /* Journey stepper (+ image swap) */
  (function(){
    var box=root.querySelector('[data-stepper]'); if(!box)return;
    var panel=root.querySelector('[data-step-panel]');
    var imgs=panel.querySelectorAll('[data-step-img]');
    var data=[
      {k:'Stakeholder discovery',d:"HatchWorks interviewed the senior leadership team and key subject-matter experts across the business. The goal was to build a deep understanding of the client's people, processes, technology, and data landscape before moving into solution mode.",img:'/assets/wp-content/uploads/2026/06/stakeholder1.jpg',alt:'Stakeholder discovery interviews with construction leadership and subject-matter experts',ph:'Discovery'},
      {k:'Use case identification',d:'Through interviews and cross-functional workshops, the team surfaced more than 50 potential AI use cases spanning business units, ranging from operational efficiency gains to revenue-driving opportunities.',img:'/assets/wp-content/uploads/2026/06/Use-case-identification-.jpg',alt:'Cross-functional workshops identifying AI use cases across construction business units',ph:'Use cases'},
      {k:'Qualification & prioritization',d:'Each use case ran through a structured qualification process scoring feasibility, business impact, data readiness, and implementation complexity. The highest-priority opportunities received lightweight business cases with projected ROI.',img:'/assets/wp-content/uploads/2026/06/Qualification-prioritization-.jpg',alt:'Qualifying and prioritizing AI use cases by feasibility, business impact, and data readiness',ph:'Scoring'},
      {k:'Data maturity assessment',d:'A critical finding: the data platform needed to evolve before most use cases could be implemented effectively. The engagement mapped that evolution and which data investments unlock the highest-value use cases.',img:'/assets/wp-content/uploads/2026/06/data-maturity-assesment.jpg',alt:'Assessing data maturity to sequence the highest-value AI use cases',ph:'Data'},
      {k:'Roadmap delivery',d:'The final deliverable was a phased roadmap connecting data platform maturation to AI use case implementation, organized around five workstreams across three delivery phases.',img:'/assets/wp-content/uploads/2026/06/roadmap-delivery.jpg',alt:'Phased 2026 AI roadmap connecting the data platform to use case delivery',ph:'Roadmap'}
    ];
    var steps=box.querySelectorAll('.hw-step');
    var tNum=panel.querySelector('[data-step-num]'),tTitle=panel.querySelector('[data-step-title]'),tDesc=panel.querySelector('[data-step-desc]');
    function select(idx){
      steps.forEach(function(s,i){s.setAttribute('aria-selected',i===idx?'true':'false');});
      tNum.textContent=idx+1;tTitle.textContent=data[idx].k;tDesc.textContent=data[idx].d;
      panel.setAttribute('aria-labelledby','hw-step-'+idx);
      imgs.forEach(function(im){im.classList.toggle('is-active', parseInt(im.getAttribute('data-step-img'),10)===idx);});
      if(!reduce){panel.classList.remove('is-anim');void panel.offsetWidth;panel.classList.add('is-anim');}
    }
    steps.forEach(function(s,i){
      s.addEventListener('click',function(){select(i);});
      s.addEventListener('keydown',function(ev){
        if(ev.key==='ArrowRight'||ev.key==='ArrowDown'){ev.preventDefault();var n=(i+1)%steps.length;steps[n].focus();select(n);}
        if(ev.key==='ArrowLeft'||ev.key==='ArrowUp'){ev.preventDefault();var p=(i-1+steps.length)%steps.length;steps[p].focus();select(p);}
      });
    });
  })();

  /* Portfolio expanders */
  root.querySelectorAll('[data-port] .hw-pcard__more').forEach(function(btn){
    var d=document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click',function(){var open=btn.getAttribute('aria-expanded')==='true';btn.setAttribute('aria-expanded',open?'false':'true');d.style.maxHeight=open?'0px':(d.firstElementChild.offsetHeight+18+'px');});
  });

  /* Before / After */
  (function(){
    var box=root.querySelector('[data-ba]'); if(!box)return;
    var tabs=box.querySelectorAll('[data-ba-tab]');
    var panes={before:box.querySelector('[data-ba-pane="before"]'),after:box.querySelector('[data-ba-pane="after"]')};
    tabs.forEach(function(t){
      t.addEventListener('click',function(){
        var key=t.getAttribute('data-ba-tab');
        tabs.forEach(function(x){x.setAttribute('aria-selected',x===t?'true':'false');});
        Object.keys(panes).forEach(function(k){var p=panes[k];if(!p)return;if(k===key){p.hidden=false;if(!reduce){p.classList.remove('is-anim');void p.offsetWidth;p.classList.add('is-anim');}}else{p.hidden=true;}});
      });
    });
  })();

  /* Roadmap phase tabs */
  (function(){
    var box=root.querySelector('[data-road]'); if(!box)return;
    var phases=box.querySelectorAll('.hw-phase');
    phases.forEach(function(p){p.addEventListener('click',function(){phases.forEach(function(x){x.setAttribute('aria-selected',x===p?'true':'false');});});});
  })();

  /* Full-width hero parallax */
  (function(){
    var bands=root.querySelectorAll('[data-parallax]'); if(!bands.length)return;
    if(reduce){bands.forEach(function(b){var im=b.querySelector('.hw-hero-band__img');if(im){im.style.top='0';im.style.height='100%';im.style.transform='none';}});return;}
    var ticking=false;
    function apply(){
      ticking=false;
      var vh=window.innerHeight||document.documentElement.clientHeight;
      bands.forEach(function(b){
        var im=b.querySelector('.hw-hero-band__img'); if(!im)return;
        var r=b.getBoundingClientRect();
        if(r.bottom<-40||r.top>vh+40)return;
        var center=r.top+r.height/2;
        var prog=(center-vh/2)/(vh/2+r.height/2);
        if(prog>1)prog=1; else if(prog<-1)prog=-1;
        im.style.transform='translate3d(0,'+(-prog*r.height*0.15).toFixed(2)+'px,0)';
      });
    }
    function onScroll(){ if(!ticking){ticking=true;requestAnimationFrame(apply);} }
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',onScroll,{passive:true});
    apply();
  })();

})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":35449,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

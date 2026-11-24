(function(){
  var root = document.currentScript.previousElementSibling;
  while(root && !(root.classList && root.classList.contains('hwau-root'))){ root = root.previousElementSibling; }
  if(!root) root = document.getElementById('hwau');
  if(!root) return;

  /* scroll reveal */
  var reveals = root.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('hwau-in'); io.unobserve(e.target); }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('hwau-in'); });
  }

  /* timeline controls */
  var track = root.querySelector('#hwau-tl-track');
  var prev = root.querySelector('.hwau-tl-prev');
  var next = root.querySelector('.hwau-tl-next');
  var bar = root.querySelector('#hwau-tl-progress-bar');
  if(track){
    function cardWidth(){
      var item = track.querySelector('.hwau-tl-item');
      if(!item) return 320;
      var style = window.getComputedStyle(track);
      var gap = parseFloat(style.columnGap || style.gap || 22) || 22;
      return item.getBoundingClientRect().width + gap;
    }
    if(prev) prev.addEventListener('click', function(){ track.scrollBy({left:-cardWidth(), behavior:'smooth'}); });
    if(next) next.addEventListener('click', function(){ track.scrollBy({left:cardWidth(), behavior:'smooth'}); });
    function updateBar(){
      var max = track.scrollWidth - track.clientWidth;
      var ratio = max > 0 ? track.scrollLeft / max : 0;
      var w = 14;
      if(bar){ bar.style.width = w + '%'; bar.style.marginLeft = (ratio * (100 - w)) + '%'; }
      if(prev) prev.disabled = track.scrollLeft <= 2;
      if(next) next.disabled = track.scrollLeft >= max - 2;
    }
    track.addEventListener('scroll', function(){ window.requestAnimationFrame(updateBar); }, {passive:true});
    updateBar();
    var down=false, sx=0, sl=0;
    track.addEventListener('pointerdown', function(e){ down=true; sx=e.clientX; sl=track.scrollLeft; track.style.cursor='grabbing'; });
    window.addEventListener('pointerup', function(){ down=false; track.style.cursor=''; });
    track.addEventListener('pointermove', function(e){ if(!down) return; track.scrollLeft = sl - (e.clientX - sx); });
  }

  /* interactive network texture in hero */
  var canvas = root.querySelector('#hwau-hero-net');
  var hero = root.querySelector('.hwau-hero');
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(canvas && hero && canvas.getContext && !prefersReduced){
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W=0, H=0, nodes=[], raf=null, visible=true;
    var mouse = {x:-9999, y:-9999, active:false};
    var TEAL = '58,189,188';

    function resize(){
      var r = hero.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = Math.floor(W*dpr);
      canvas.height = Math.floor(H*dpr);
      canvas.style.width = W+'px';
      canvas.style.height = H+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
      seed();
    }
    function seed(){
      var density = Math.max(28, Math.min(70, Math.round((W*H)/22000)));
      nodes = [];
      for(var i=0;i<density;i++){
        nodes.push({
          x: Math.random()*W,
          y: Math.random()*H,
          vx: (Math.random()-0.5)*0.28,
          vy: (Math.random()-0.5)*0.28,
          r: Math.random()*1.6+1
        });
      }
    }
    function step(){
      ctx.clearRect(0,0,W,H);
      var linkDist = 130, mouseDist = 170;
      for(var i=0;i<nodes.length;i++){
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if(n.x<0||n.x>W) n.vx*=-1;
        if(n.y<0||n.y>H) n.vy*=-1;
        /* gentle pull toward cursor */
        if(mouse.active){
          var dxm = mouse.x-n.x, dym = mouse.y-n.y;
          var dm = Math.sqrt(dxm*dxm+dym*dym);
          if(dm<mouseDist && dm>0.1){
            var f = (1-dm/mouseDist)*0.5;
            n.x += (dxm/dm)*f;
            n.y += (dym/dm)*f;
          }
        }
        /* node */
        ctx.beginPath();
        ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
        ctx.fillStyle = 'rgba('+TEAL+',0.55)';
        ctx.fill();
      }
      /* links */
      for(var a=0;a<nodes.length;a++){
        for(var b=a+1;b<nodes.length;b++){
          var dx=nodes[a].x-nodes[b].x, dy=nodes[a].y-nodes[b].y;
          var d=Math.sqrt(dx*dx+dy*dy);
          if(d<linkDist){
            var o=(1-d/linkDist)*0.32;
            ctx.strokeStyle='rgba('+TEAL+','+o.toFixed(3)+')';
            ctx.lineWidth=0.7;
            ctx.beginPath();
            ctx.moveTo(nodes[a].x,nodes[a].y);
            ctx.lineTo(nodes[b].x,nodes[b].y);
            ctx.stroke();
          }
        }
        /* link to cursor */
        if(mouse.active){
          var mdx=nodes[a].x-mouse.x, mdy=nodes[a].y-mouse.y;
          var md=Math.sqrt(mdx*mdx+mdy*mdy);
          if(md<mouseDist){
            var mo=(1-md/mouseDist)*0.5;
            ctx.strokeStyle='rgba('+TEAL+','+mo.toFixed(3)+')';
            ctx.lineWidth=0.9;
            ctx.beginPath();
            ctx.moveTo(nodes[a].x,nodes[a].y);
            ctx.lineTo(mouse.x,mouse.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(step);
    }
    function start(){ if(!raf) raf=requestAnimationFrame(step); }
    function stop(){ if(raf){ cancelAnimationFrame(raf); raf=null; } }

    hero.addEventListener('pointermove', function(e){
      var r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    });
    hero.addEventListener('pointerleave', function(){ mouse.active=false; mouse.x=-9999; mouse.y=-9999; });

    var ro;
    if('ResizeObserver' in window){ ro=new ResizeObserver(resize); ro.observe(hero); }
    else { window.addEventListener('resize', resize); }

    /* pause when hero scrolls out of view */
    if('IntersectionObserver' in window){
      var vio = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          visible = en.isIntersecting;
          if(visible) start(); else stop();
        });
      }, {threshold:0});
      vio.observe(hero);
    }

    resize();
    start();
  }
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":29970,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

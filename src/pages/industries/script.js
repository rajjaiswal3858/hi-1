// ── Scroll reveal ──────────────────────────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }});
}, {threshold:0.06});
document.querySelectorAll('.hw-ind .rv').forEach(el => obs.observe(el));

// ── Constellation + interactive background ─────────────────
(function(){
  const canvas = document.getElementById('hiCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], mouse = {x: -1000, y: -1000};
  const STAR_COUNT = 120;
  const CONNECT_DIST = 130;
  const MOUSE_DIST = 160;

  function resize(){
    const container = canvas.closest('.hw-ind');
    W = canvas.width  = container.offsetWidth;
    H = canvas.height = container.offsetHeight;
  }

  function Star(){
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - .5) * .25;
    this.vy = (Math.random() - .5) * .25;
    this.r  = Math.random() * 1.4 + .4;
    this.opacity = Math.random() * .5 + .2;
    this.pulse = Math.random() * Math.PI * 2;
  }

  function init(){
    stars = [];
    for(let i = 0; i < STAR_COUNT; i++) stars.push(new Star());
  }

  function draw(){
    ctx.clearRect(0, 0, W, H);

    // update
    stars.forEach(s => {
      s.pulse += .012;
      s.x += s.vx;
      s.y += s.vy;
      if(s.x < 0) s.x = W;
      if(s.x > W) s.x = 0;
      if(s.y < 0) s.y = H;
      if(s.y > H) s.y = 0;

      // mouse repulsion — gentle
      const dx = s.x - mouse.x, dy = s.y - mouse.y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if(d < MOUSE_DIST && d > 0){
        const force = (MOUSE_DIST - d) / MOUSE_DIST * .6;
        s.x += (dx/d) * force;
        s.y += (dy/d) * force;
      }
    });

    // connections
    for(let i = 0; i < stars.length; i++){
      for(let j = i+1; j < stars.length; j++){
        const a = stars[i], b = stars[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if(d < CONNECT_DIST){
          const alpha = (1 - d/CONNECT_DIST) * .18;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(58,189,188,${alpha})`;
          ctx.lineWidth = .6;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      // mouse connections
      const dx = stars[i].x - mouse.x, dy = stars[i].y - mouse.y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if(d < MOUSE_DIST){
        const alpha = (1 - d/MOUSE_DIST) * .38;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(58,189,188,${alpha})`;
        ctx.lineWidth = .8;
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    // dots
    stars.forEach(s => {
      const pulse = .5 + Math.sin(s.pulse) * .3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * pulse, 0, Math.PI*2);
      ctx.fillStyle = `rgba(191,239,239,${s.opacity * pulse})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  // mouse tracking — relative to container
  const container = canvas.closest('.hw-ind');
  container.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  container.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

  window.addEventListener('resize', () => { resize(); init(); });

  resize(); init(); draw();
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":35298,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

(function(){
  if(window.__hwhHomeBooted) return;
  function boot(){
    if(window.__hwhHomeBooted) return;
    var root = document.getElementById('hwh');
    if(!root) return;
    window.__hwhHomeBooted = true;
    try {
      var root = document.getElementById('hwh');
      if(!root || root.dataset.hwhInit) return;
      root.dataset.hwhInit = '1';

      var props = window.HWH_CONFIG || {};
      var useSpot = props.spotlight !== false;
      var useNet = props.heroNetwork !== false;
      var subtle = props.motionLevel === 'subtle';
      var mqReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
      var reduced = (mqReduce && mqReduce.matches) || subtle;
      var canHover = !window.matchMedia || window.matchMedia('(hover:hover) and (pointer:fine)').matches;
      var narrow = Math.min(window.innerWidth, window.screen ? window.screen.width : 9999) <= 760;
      var conn = navigator.connection || {};
      var thrifty = conn.saveData === true || /^(slow-2g|2g|3g)$/.test(conn.effectiveType || '');
      var raf = window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f){ return setTimeout(f, 16); };

      /* ---------- hero background video ----------
         Skipped on phones, metered connections and reduced-motion: the mesh
         gradient underneath is a complete background on its own. */
      var mesh = root.querySelector('.hwh-hero-mesh');
      if(mesh && !reduced && !narrow && !thrifty){
        var vid = document.createElement('video');
        vid.className = 'hwh-hero-vid';
        vid.autoplay = true; vid.muted = true; vid.defaultMuted = true; vid.loop = true;
        vid.playsInline = true; vid.preload = 'auto'; vid.tabIndex = -1;
        vid.setAttribute('muted',''); vid.setAttribute('playsinline',''); vid.setAttribute('aria-hidden','true');
        vid.disablePictureInPicture = true;
        ['/assets/wp-content/uploads/2026/02/0209.webm'].forEach(function(u){
          var src = document.createElement('source'); src.src = u; src.type = 'video/webm'; vid.appendChild(src);
        });
        var play = function(){ var p = vid.play(); if(p && p.catch) p.catch(function(){}); };
        var drop = function(){ if(vid.parentNode) vid.parentNode.removeChild(vid); mesh.classList.remove('has-video'); };
        vid.addEventListener('error', drop, {once:true});
        vid.addEventListener('loadeddata', function(){ mesh.classList.add('has-video'); play(); }, {once:true});
        vid.addEventListener('stalled', function(){ setTimeout(function(){ if(vid.readyState < 2) drop(); }, 6000); }, {once:true});
        document.addEventListener('visibilitychange', function(){ if(!document.hidden && vid.paused) play(); });
        mesh.insertBefore(vid, mesh.querySelector('.hwh-hero-veil'));
      }

      /* partner logo that fails to load falls back to its typeset wordmark */
      root.querySelectorAll('.hwh-pl img').forEach(function(img){
        var swap = function(){
          var t = document.createElement('span');
          t.className = 'hwh-pl-text';
          t.textContent = img.getAttribute('alt') || '';
          if(img.parentNode) img.parentNode.replaceChild(t, img);
        };
        if(img.complete && img.naturalWidth === 0) swap();
        else img.addEventListener('error', swap, {once:true});
      });

      /* ---------- seamless logo marquee ----------
         The duplicate half is decorative: hidden from assistive tech and removed
         from the tab order so the same 25 logos are not announced twice. */
      var track = root.querySelector('#hwh-trust-track');
      if(track && !track.dataset.hwhCloned){
        track.dataset.hwhCloned = '1';
        var originals = Array.prototype.slice.call(track.children);
        var ghost = document.createDocumentFragment();
        originals.forEach(function(n){
          var c = n.cloneNode(true);
          c.setAttribute('aria-hidden','true');
          if(c.tagName === 'A') c.setAttribute('tabindex','-1');
          c.querySelectorAll('a,[tabindex]').forEach(function(k){ k.setAttribute('tabindex','-1'); });
          c.removeAttribute('data-tip');
          ghost.appendChild(c);
        });
        track.appendChild(ghost);

        /* Two drive modes for one strip.

           Pointer devices keep the CSS transform: cheap, compositor-only, and
           hover pauses it. Touch devices — and anyone with reduced motion — get
           a scroll-driven strip instead, because a transform cannot be grabbed:
           with the animation off, a phone would show two logos and hide the
           other twenty-three with no way to reach them. */
        var marquee = track.parentNode;
        var swipe = reduced || !window.matchMedia('(hover:hover)').matches;

        if(swipe){
          marquee.classList.add('is-swipe');
          track.classList.add('is-swipe');

          var half = 0, auto = null, held = false, idle = null;
          var measure = function(){
            half = track.scrollWidth / 2;
            /* park one pixel in, so the backward wrap below can tell "the user
               dragged past the start" from "the strip just loaded" */
            if(half > 2 && marquee.scrollLeft < 1) marquee.scrollLeft = 1;
          };
          measure();
          if(window.ResizeObserver) new ResizeObserver(measure).observe(track);

          /* keep the loop seamless: the second half is a copy, so crossing it
             rewinds by exactly one copy and nothing visibly jumps */
          var wrap = function(){
            if(half < 2) return;
            if(marquee.scrollLeft >= half) marquee.scrollLeft -= half;
            else if(marquee.scrollLeft <= 0) marquee.scrollLeft += half;
          };
          marquee.addEventListener('scroll', wrap, {passive:true});

          if(!reduced){
            var last = 0;
            var step = function(now){
              auto = requestAnimationFrame(step);
              if(held) { last = now; return; }
              if(!last) last = now;
              var dt = Math.min(now - last, 64);
              last = now;
              marquee.scrollLeft += dt * 0.055;   /* ~55px/s, matched to the CSS rate */
              wrap();
            };
            var run = function(){ if(!auto){ last = 0; auto = requestAnimationFrame(step); } };
            var halt = function(){ if(auto){ cancelAnimationFrame(auto); auto = null; } };

            /* a finger on the strip takes over; the drift resumes once it settles */
            var hold = function(){ held = true; clearTimeout(idle); };
            var release = function(){ if(!held) return; clearTimeout(idle); idle = setTimeout(function(){ held = false; }, 1400); };
            marquee.addEventListener('touchstart', hold, {passive:true});
            marquee.addEventListener('pointerdown', hold, {passive:true});
            marquee.addEventListener('touchend', release, {passive:true});
            marquee.addEventListener('touchcancel', release, {passive:true});
            marquee.addEventListener('pointerup', release, {passive:true});
            marquee.addEventListener('scroll', release, {passive:true});

            if('IntersectionObserver' in window){
              var live = false, onScreen = false;
              new IntersectionObserver(function(en){
                en.forEach(function(x){
                  onScreen = x.isIntersecting;
                  if(onScreen){ live = true; run(); } else if(live){ halt(); }
                });
              }, {threshold:0}).observe(marquee);
              document.addEventListener('visibilitychange', function(){
                if(document.hidden) halt(); else if(onScreen) run();
              });
            } else {
              run();
              document.addEventListener('visibilitychange', function(){ document.hidden ? halt() : run(); });
            }
          }
        } else {
          /* one rate on every screen: the strip is far wider at 2560px than at
             1024px, so a fixed duration would crawl on one and race on the other */
          var pace = function(){
            var w = track.scrollWidth / 2;
            if(w > 10) track.style.animationDuration = Math.round(w / 100) + 's';
          };
          pace();
          if(window.ResizeObserver) new ResizeObserver(pace).observe(track);

          /* a marquee scrolled past is still compositing — pause it off-screen.
             Only ever pause after the observer has proven it reports intersections,
             for the same reason the reveals wait: a frame that never reports would
             otherwise leave the strip frozen. */
          if('IntersectionObserver' in window){
            var seen = false;
            new IntersectionObserver(function(en){
              en.forEach(function(x){
                if(x.isIntersecting){ seen = true; track.style.animationPlayState = ''; }
                else if(seen){ track.style.animationPlayState = 'paused'; }
              });
            }, {threshold:0}).observe(track);
          }
        }
      }

      /* ---------- scroll reveal ----------
         The hidden state is set by JS, and only after the observer has proven it
         runs. No JS, a stalled observer or a re-render can never blank a section. */
      var reveals = Array.prototype.slice.call(root.querySelectorAll('.reveal'));
      function show(el){ el.style.opacity = ''; el.style.transform = ''; el.classList.add('hwh-in'); }
      if('IntersectionObserver' in window && !reduced){
        var armed = false;
        var io = new IntersectionObserver(function(entries){
          var sees = false, k;
          for(k=0;k<entries.length;k++){ if(entries[k].isIntersecting){ sees = true; break; } }
          /* Arm only once the observer has reported a real intersection. In a
             backgrounded or zero-size frame it reports nothing, and hiding on
             that signal is what blanks a page. Seeing something proves it works. */
          if(!armed && sees){
            armed = true;
            var vh = window.innerHeight || document.documentElement.clientHeight;
            reveals.forEach(function(el){
              if(el.classList.contains('hwh-in')) return;
              if(el.getBoundingClientRect().top > vh * 0.92){ el.style.opacity = '0'; el.style.transform = 'translateY(26px)'; }
            });
          }
          entries.forEach(function(e){ if(e.isIntersecting){ show(e.target); io.unobserve(e.target); } });
        }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
        reveals.forEach(function(el){ io.observe(el); });
      } else { reveals.forEach(show); }

      /* cursor spotlight on cards */
      if(useSpot && canHover){
        var spotEl = null, spotX = 0, spotY = 0, spotQueued = false;
        root.addEventListener('pointermove', function(e){
          if(e.pointerType && e.pointerType !== 'mouse') return;
          var el = e.target && e.target.closest ? e.target.closest('.hwh-spot') : null;
          if(!el) return;
          spotEl = el; spotX = e.clientX; spotY = e.clientY;
          if(spotQueued) return;
          spotQueued = true;
          raf(function(){
            spotQueued = false;
            if(!spotEl) return;
            var r = spotEl.getBoundingClientRect();
            if(!r.width || !r.height) return;
            spotEl.style.setProperty('--mx', ((spotX - r.left) / r.width * 100).toFixed(1) + '%');
            spotEl.style.setProperty('--my', ((spotY - r.top) / r.height * 100).toFixed(1) + '%');
          });
        }, {passive:true});
      }

      /* magnetic primary CTAs */
      if(!reduced && canHover){
        root.querySelectorAll('.hwh-magnet').forEach(function(btn){
          var queued = false, mx = 0, my = 0;
          btn.addEventListener('pointermove', function(e){
            mx = e.clientX; my = e.clientY;
            if(queued) return;
            queued = true;
            raf(function(){
              queued = false;
              var r = btn.getBoundingClientRect();
              if(!r.width) return;
              var dx = (mx - (r.left + r.width/2)) / r.width;
              var dy = (my - (r.top + r.height/2)) / r.height;
              btn.style.transform = 'translate(' + (dx*9).toFixed(1) + 'px,' + (dy*7 - 2).toFixed(1) + 'px)';
            });
          }, {passive:true});
          var reset = function(){ btn.style.transform = ''; };
          btn.addEventListener('pointerleave', reset);
          btn.addEventListener('blur', reset);
        });
      }

      if(!reduced){
        var bar = document.createElement('div');
        bar.className = 'hwh-progress';
        bar.setAttribute('aria-hidden','true');
        root.appendChild(bar);

        var hero = root.querySelector('.hwh-hero');
        var ticking = false;
        var pending = reveals.slice();

        function onScroll(){
          if(ticking) return;
          ticking = true;
          raf(function(){
            ticking = false;
            var vh = window.innerHeight || document.documentElement.clientHeight;

            if(pending.length){
              var keep = [];
              for(var i=0;i<pending.length;i++){
                var el = pending[i];
                if(el.classList.contains('hwh-in')) continue;
                var bb = el.getBoundingClientRect();
                if(bb.bottom < 0 || bb.top < vh * 0.92) show(el); else keep.push(el);
              }
              pending = keep;
            }

            var r = root.getBoundingClientRect();
            var total = r.height - vh;
            var scrolled = Math.min(Math.max(-r.top, 0), Math.max(total, 1));
            bar.style.transform = 'scaleX(' + (total > 0 ? (scrolled / total).toFixed(4) : 0) + ')';
            if(hero) hero.classList.toggle('is-scrolled', (window.scrollY || window.pageYOffset) > 80);
          });
        }
        window.addEventListener('scroll', onScroll, {passive:true});
        window.addEventListener('resize', onScroll, {passive:true});
        window.addEventListener('orientationchange', onScroll, {passive:true});
        /* a frame requested while the tab is hidden never resolves — unstick on return */
        document.addEventListener('visibilitychange', function(){ if(!document.hidden){ ticking = false; onScroll(); } });
        onScroll();

        /* count-up on stats */
        function easeOut(t){ return 1 - Math.pow(1 - t, 3); }
        function animateCount(node){
          var raw = node.getAttribute('data-count') || node.textContent;
          var m = raw.match(/^([^\d]*)(\d[\d,\.]*)(.*)$/);
          if(!m){ node.textContent = raw; return; }
          var prefix = m[1], numStr = m[2], suffix = m[3];
          var target = parseFloat(numStr.replace(/,/g,''));
          var decimals = (numStr.split('.')[1] || '').length;
          var dur = 1100, t0 = null;
          node.setAttribute('aria-label', raw);
          function frame(ts){
            if(t0 === null) t0 = ts;
            var p = Math.min((ts - t0)/dur, 1);
            node.textContent = prefix + (target * easeOut(p)).toFixed(decimals) + suffix;
            if(p < 1) raf(frame); else node.textContent = raw;
          }
          raf(frame);
        }
        if('IntersectionObserver' in window){
          var cio = new IntersectionObserver(function(es){
            es.forEach(function(e){ if(e.isIntersecting){ animateCount(e.target); cio.unobserve(e.target); } });
          }, {threshold:0.6});
          root.querySelectorAll('[data-count]').forEach(function(n){ cio.observe(n); });
        }
      }

      /* ---------- hover card on client logos ----------
         Pointer-only affordance. Every logo that has one is already a real link,
         so keyboard and touch users reach the same case study without it. */
      if(canHover){
        var tip = document.createElement('div');
        tip.className = 'hwh-tip';
        tip.setAttribute('role','presentation');
        tip.setAttribute('aria-hidden','true');
        root.appendChild(tip);

        var hideTimer = null, overTip = false, overEl = false;
        function scheduleHide(){
          clearTimeout(hideTimer);
          hideTimer = setTimeout(function(){
            if(!overTip && !overEl) tip.classList.remove('is-on','is-card');
          }, 180);
        }
        function place(x, y){
          var w = tip.offsetWidth || 260;
          var pad = 12;
          var min = w/2 + pad, max = (document.documentElement.clientWidth || window.innerWidth) - w/2 - pad;
          tip.style.left = Math.max(min, Math.min(x, max)) + 'px';
          tip.style.top = Math.max(y, tip.offsetHeight + pad) + 'px';
        }
        tip.addEventListener('mouseenter', function(){ overTip = true; clearTimeout(hideTimer); });
        tip.addEventListener('mouseleave', function(){ overTip = false; scheduleHide(); });

        /* GenDD mark inside the award card: its own click target */
        root.querySelectorAll('.hwh-gendd-mark').forEach(function(el){
          var go = function(ev){ ev.preventDefault(); ev.stopPropagation(); window.location.href = el.getAttribute('data-href'); };
          el.addEventListener('click', go);
          el.addEventListener('keydown', function(ev){ if(ev.key === 'Enter' || ev.key === ' ') go(ev); });
        });

        root.querySelectorAll('[data-tip]').forEach(function(el){
          var url = el.getAttribute('href');
          var isCase = el.classList.contains('hwh-tlogo--cs') && url;
          el.addEventListener('mouseenter', function(e){
            overEl = true;
            clearTimeout(hideTimer);
            if(isCase){
              var img = el.getAttribute('data-cs-img');
              var html = '';
              if(img){
                html += '<span class="hwh-tip-media"><img src="' + img + '" alt="" loading="lazy" decoding="async">' +
                        '<span class="hwh-tip-play"><i class="ti ti-arrow-up-right"></i></span></span>';
              }
              html += '<span class="hwh-tip-cta"><span>View case study</span><i class="ti ti-arrow-right"></i></span>';
              tip.innerHTML = html;
              tip.classList.add('is-card');
              var r = el.getBoundingClientRect();
              place(r.left + r.width/2, r.top);
            } else {
              tip.classList.remove('is-card');
              tip.textContent = el.getAttribute('data-tip') || '';
              place(e.clientX, e.clientY);
            }
            tip.classList.add('is-on');
          });
          el.addEventListener('mousemove', function(e){ if(!isCase) place(e.clientX, e.clientY); }, {passive:true});
          el.addEventListener('mouseleave', function(){ overEl = false; scheduleHide(); });
        });
        window.addEventListener('scroll', function(){
          if(tip.classList.contains('is-on')){ overEl = false; overTip = false; tip.classList.remove('is-on','is-card'); }
        }, {passive:true});
      }

      /* ---------- interactive network texture in the hero ---------- */
      var canvas = root.querySelector('#hwh-hero-net');
      var heroEl = root.querySelector('.hwh-hero');
      if(useNet && canvas && heroEl && canvas.getContext && !reduced && !thrifty){
        var ctx = canvas.getContext('2d', {alpha:true});
        var W = 0, H = 0, nodes = [], loop = null, visible = false;
        var mouse = {x:-9999, y:-9999, active:false};
        var TEAL = '58,189,188';

        function dpr(){ return Math.min(window.devicePixelRatio || 1, narrow ? 1.5 : 2); }
        function resize(){
          var r = heroEl.getBoundingClientRect();
          if(r.width < 2 || r.height < 2) return;
          var pw = W, ph = H;
          W = r.width; H = r.height;
          var d = dpr();
          canvas.width = Math.floor(W * d); canvas.height = Math.floor(H * d);
          canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
          ctx.setTransform(d, 0, 0, d, 0, 0);
          /* a phone hiding its URL bar changes height only — rescale, don't reshuffle */
          if(nodes.length && pw && Math.abs(W - pw) < 2){
            var sy = ph ? H / ph : 1;
            for(var i=0;i<nodes.length;i++){ nodes[i].y *= sy; }
            return;
          }
          seed();
        }
        function seed(){
          var target = Math.round((W * H) / (narrow ? 34000 : 20000));
          var count = Math.max(24, Math.min(narrow ? 40 : 76, target));
          nodes = [];
          for(var i=0;i<count;i++){
            nodes.push({x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-0.5)*0.26, vy:(Math.random()-0.5)*0.26, r:Math.random()*1.6+1});
          }
        }
        function step(){
          ranAFrame = true;
          if(!W || !H){ loop = sched(step); return; }
          ctx.clearRect(0, 0, W, H);
          var LINK = narrow ? 110 : 140, PULL = 180, LINK2 = LINK*LINK, PULL2 = PULL*PULL, i, j;
          for(i=0;i<nodes.length;i++){
            var n = nodes[i];
            n.x += n.vx; n.y += n.vy;
            if(n.x < 0 || n.x > W) n.vx *= -1;
            if(n.y < 0 || n.y > H) n.vy *= -1;
            if(mouse.active){
              var ax = mouse.x - n.x, ay = mouse.y - n.y, am = Math.sqrt(ax*ax + ay*ay);
              if(am < PULL && am > 0.1){ var f = (1 - am/PULL) * 0.5; n.x += (ax/am)*f; n.y += (ay/am)*f; }
            }
            ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
            ctx.fillStyle = 'rgba(' + TEAL + ',0.5)'; ctx.fill();
          }
          for(i=0;i<nodes.length;i++){
            for(j=i+1;j<nodes.length;j++){
              var dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, q = dx*dx + dy*dy;
              if(q < LINK2){
                var d = Math.sqrt(q);
                ctx.strokeStyle = 'rgba(' + TEAL + ',' + ((1 - d/LINK) * 0.3).toFixed(3) + ')';
                ctx.lineWidth = 0.7;
                ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
              }
            }
            if(mouse.active){
              var mx = nodes[i].x - mouse.x, my = nodes[i].y - mouse.y, mq = mx*mx + my*my;
              if(mq < PULL2){
                var md = Math.sqrt(mq);
                ctx.strokeStyle = 'rgba(' + TEAL + ',' + ((1 - md/PULL) * 0.5).toFixed(3) + ')';
                ctx.lineWidth = 0.9;
                ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
              }
            }
          }
          loop = sched(step);
        }
        /* Same guard as the reveals and the marquee: a document that boots hidden
           and never fires a visibility transition would otherwise never schedule
           a frame, leaving the hero mesh with no network over it. So the first
           run is unconditional; only once a visibilitychange has actually been
           observed does document.hidden get a say in pausing.

           A hidden document also suspends requestAnimationFrame outright, so a
           scheduled frame can simply never arrive. The watchdog below notices
           that and switches the loop to a timer, which keeps running. */
        var vizSeen = false, ranAFrame = false, timed = false;
        function sched(fn){ return timed ? setTimeout(fn, 32) : raf(fn); }
        function start(){
          if(loop || !visible || (vizSeen && document.hidden)) return;
          loop = sched(step);
          if(!ranAFrame && !timed){
            setTimeout(function(){
              if(ranAFrame || !loop || !visible) return;
              timed = true;
              (window.cancelAnimationFrame || clearTimeout)(loop);
              loop = setTimeout(step, 0);
            }, 500);
          }
        }
        function stop(){ if(loop){ (timed ? clearTimeout : (window.cancelAnimationFrame || clearTimeout))(loop); loop = null; } }

        if(canHover){
          heroEl.addEventListener('pointermove', function(e){
            if(e.pointerType && e.pointerType !== 'mouse') return;
            var r = heroEl.getBoundingClientRect();
            mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
          }, {passive:true});
          heroEl.addEventListener('pointerleave', function(){ mouse.active = false; mouse.x = mouse.y = -9999; });
        }

        var rt = null;
        var onResize = function(){ clearTimeout(rt); rt = setTimeout(resize, 160); };
        if('ResizeObserver' in window){ new ResizeObserver(onResize).observe(heroEl); }
        else { window.addEventListener('resize', onResize, {passive:true}); }
        window.addEventListener('orientationchange', onResize, {passive:true});
        document.addEventListener('visibilitychange', function(){ vizSeen = true; if(document.hidden) stop(); else start(); });

        if('IntersectionObserver' in window){
          new IntersectionObserver(function(en){
            en.forEach(function(x){ visible = x.isIntersecting; if(visible) start(); else stop(); });
          }, {threshold:0}).observe(heroEl);
        } else { visible = true; }

        resize();
        visible = true;
        start();
      }


      /* motion preference can change mid-session */
      if(mqReduce && mqReduce.addEventListener){
        mqReduce.addEventListener('change', function(e){
          if(e.matches) reveals.forEach(show);
        });
      }
    } catch(err){
      if(window.console && console.warn) console.warn('[hwh] enhancement skipped:', err);
    }
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', boot); }
  else { boot(); }
  window.addEventListener('load', boot);
  if(window.jQuery){ jQuery(window).on('elementor/frontend/init', boot); }
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":15878,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

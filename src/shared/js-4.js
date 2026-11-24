(function() {
  var root = document.getElementById('hw-anth-root');
  if (!root) return;
  // Reveal-on-scroll
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });
    root.querySelectorAll('.hw-anth-reveal').forEach(function(el) { io.observe(el); });
  } else {
    root.querySelectorAll('.hw-anth-reveal').forEach(function(el) { el.classList.add('is-visible'); });
  }
  // Smooth anchor scroll
  root.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href').slice(1);
      var target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  // ----- SLIDER -----
  var slider = root.querySelector('.hw-anth-slider');
  if (slider) {
    var slides = slider.querySelectorAll('.hw-anth-slide');
    var steps = slider.querySelectorAll('.hw-anth-timeline__step');
    var total = slides.length;
    var current = 1;
    function setActive(n) {
      n = Math.max(1, Math.min(total, n));
      current = n;
      slider.setAttribute('data-active', String(n));
      slides.forEach(function(slide, i) {
        slide.setAttribute('aria-hidden', String(i + 1 !== n));
      });
      steps.forEach(function(step, i) {
        var stepNum = i + 1;
        step.classList.toggle('hw-anth-timeline__step--active', stepNum === n);
        step.classList.toggle('hw-anth-timeline__step--completed', stepNum < n);
      });
    }
    steps.forEach(function(step) {
      step.addEventListener('click', function() {
        var n = parseInt(step.getAttribute('data-step'), 10);
        if (!isNaN(n)) setActive(n);
      });
    });
    slider.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft')  setActive(current - 1);
      else if (e.key === 'ArrowRight') setActive(current + 1);
    });
    // Touch swipe
    var touchStartX = 0, touchEndX = 0;
    var slidesWrap = slider.querySelector('.hw-anth-slides-wrap');
    if (slidesWrap) {
      slidesWrap.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      slidesWrap.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) setActive(current + 1);
          else setActive(current - 1);
        }
      }, { passive: true });
    }
  }
  // ----- FAQ ACCORDION -----
  root.querySelectorAll('.hw-anth-faq__item').forEach(function(item) {
    var btn = item.querySelector('.hw-anth-faq__q');
    if (!btn) return;
    btn.addEventListener('click', function() {
      var open = item.getAttribute('data-open') === 'true';
      item.setAttribute('data-open', open ? 'false' : 'true');
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });
  // ----- RIBBON ITEM REVEAL on entering viewport -----
  if ('IntersectionObserver' in window) {
    var metricIo = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          metricIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    root.querySelectorAll('.hw-anth-ribbon__item').forEach(function(el, i) {
      el.style.transitionDelay = (i * 120) + 'ms';
      metricIo.observe(el);
    });
  }
  // ----- HERO SUBTLE PARALLAX on pointer (desktop only) -----
  var isCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (!isCoarse) {
    var hero = root.querySelector('.hw-anth-hero');
    var heroGrid = root.querySelector('.hw-anth-hero__grid-bg');
    if (hero && heroGrid) {
      hero.addEventListener('pointermove', function(e) {
        var rect = hero.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        heroGrid.style.transform = 'translate(' + (x * -14) + 'px, ' + (y * -10) + 'px)';
      });
      hero.addEventListener('pointerleave', function() {
        heroGrid.style.transform = '';
      });
    }
    // ----- HERO PIXEL PARTICLES: lifecycle-based scatter with cursor interaction -----
    var heroDots = root.querySelectorAll('.hw-anth-hero__dot');
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hero && heroDots.length && !prefersReduced) {
      var dotState = [];
      var pointerX = -9999, pointerY = -9999;
      var heroRect = null;
      var lastFrame = 0;
      function spawnParticle(d, isInitial) {
        d.originX = Math.random() * heroRect.width;
        d.originY = Math.random() * heroRect.height;
        d.ox = 0;
        d.oy = 0;
        var driftAngle = Math.random() * Math.PI * 2;
        var driftSpeed = 0.15 + Math.random() * 0.25;
        d.vx = Math.cos(driftAngle) * driftSpeed;
        d.vy = Math.sin(driftAngle) * driftSpeed;
        d.peakOpacity = 0.30 + Math.random() * 0.55;
        d.fadeInDur = 700 + Math.random() * 700;
        d.fadeOutDur = 1200 + Math.random() * 800;
        d.lifeDur = 6000 + Math.random() * 9000;
        d.flutterPhase = Math.random() * Math.PI * 2;
        d.flutterSpeed = 0.0008 + Math.random() * 0.0012;
        d.age = isInitial ? Math.random() * d.lifeDur * 0.7 : 0;
        d.el.style.left = d.originX + 'px';
        d.el.style.top = d.originY + 'px';
        d.el.classList.remove('is-near');
      }
      function initParticles() {
        heroRect = hero.getBoundingClientRect();
        dotState = Array.prototype.map.call(heroDots, function(dot) {
          var size = parseFloat(getComputedStyle(dot).width) || 3;
          var mass = 0.45 + (size - 2) * 0.20;
          var d = { el: dot, mass: mass };
          spawnParticle(d, true);
          return d;
        });
      }
      function step(now) {
        if (!lastFrame) lastFrame = now;
        var dt = Math.min(now - lastFrame, 50);
        lastFrame = now;
        var frameScale = dt / 16.67;
        var radius = 240;
        var maxForce = 0.10;
        var friction = Math.pow(0.965, frameScale);
        var maxVel = 3.5;
        var cursorActive = pointerX > -9000;
        var glowRadius = 110;
        for (var i = 0; i < dotState.length; i++) {
          var d = dotState[i];
          d.age += dt;
          if (cursorActive) {
            var px = d.originX + d.ox;
            var py = d.originY + d.oy;
            var dx = px - pointerX;
            var dy = py - pointerY;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < radius && dist > 0.01) {
              var falloff = (1 - dist / radius);
              var force = falloff * maxForce * dt / d.mass;
              d.vx += (dx / dist) * force;
              d.vy += (dy / dist) * force;
            }
          }
          d.vx *= friction;
          d.vy *= friction;
          if (Math.abs(d.vx) + Math.abs(d.vy) < 0.04) {
            d.vx += (Math.random() - 0.5) * 0.025 * frameScale;
            d.vy += (Math.random() - 0.5) * 0.025 * frameScale;
          }
          var sp2 = d.vx * d.vx + d.vy * d.vy;
          if (sp2 > maxVel * maxVel) {
            var sp = Math.sqrt(sp2);
            d.vx = (d.vx / sp) * maxVel;
            d.vy = (d.vy / sp) * maxVel;
          }
          d.ox += d.vx * frameScale;
          d.oy += d.vy * frameScale;
          var op;
          if (d.age < d.fadeInDur) {
            op = (d.age / d.fadeInDur) * d.peakOpacity;
          } else if (d.age > d.lifeDur - d.fadeOutDur) {
            var fadeRemain = (d.lifeDur - d.age) / d.fadeOutDur;
            op = Math.max(0, fadeRemain) * d.peakOpacity;
          } else {
            var flutter = 0.88 + 0.12 * Math.sin(d.age * d.flutterSpeed + d.flutterPhase);
            op = d.peakOpacity * flutter;
          }
          var isNear = false;
          if (cursorActive) {
            var cdx = (d.originX + d.ox) - pointerX;
            var cdy = (d.originY + d.oy) - pointerY;
            var cd = Math.sqrt(cdx * cdx + cdy * cdy);
            if (cd < glowRadius) {
              var nearFactor = 1 - cd / glowRadius;
              op = Math.min(1, op + nearFactor * 0.5);
              if (cd < glowRadius * 0.55) isNear = true;
            }
          }
          if (isNear && !d.nearState) {
            d.el.classList.add('is-near');
            d.nearState = true;
          } else if (!isNear && d.nearState) {
            d.el.classList.remove('is-near');
            d.nearState = false;
          }
          d.el.style.opacity = op.toFixed(2);
          d.el.style.setProperty('--push-x', d.ox.toFixed(1) + 'px');
          d.el.style.setProperty('--push-y', d.oy.toFixed(1) + 'px');
          var absX = d.originX + d.ox;
          var absY = d.originY + d.oy;
          var pad = 40;
          var offScreen = absX < -pad || absX > heroRect.width + pad ||
                          absY < -pad || absY > heroRect.height + pad;
          if (d.age >= d.lifeDur || offScreen) {
            spawnParticle(d, false);
          }
        }
        requestAnimationFrame(step);
      }
      window.addEventListener('load', initParticles);
      window.addEventListener('resize', initParticles);
      setTimeout(function() {
        initParticles();
        requestAnimationFrame(step);
      }, 100);
      hero.addEventListener('pointermove', function(e) {
        if (!heroRect) return;
        pointerX = e.clientX - heroRect.left;
        pointerY = e.clientY - heroRect.top;
      });
      hero.addEventListener('pointerleave', function() {
        pointerX = -9999;
        pointerY = -9999;
      });
    }
  }
  // ----- AUTO-ADVANCE slider on viewport (slow) -----
  if (slider && 'IntersectionObserver' in window) {
    var sliderInView = false;
    var autoTimer = null;
    var userInteracted = false;
    function startAuto() {
      if (autoTimer || userInteracted) return;
      autoTimer = setInterval(function() {
        if (!sliderInView || userInteracted) return;
        var next = current + 1;
        if (next > total) next = 1;
        setActive(next);
      }, 7000);
    }
    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }
    var sliderIo = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        sliderInView = entry.isIntersecting;
        if (sliderInView) startAuto();
        else stopAuto();
      });
    }, { threshold: 0.4 });
    sliderIo.observe(slider);
    ['click', 'touchstart', 'keydown'].forEach(function(evt) {
      slider.addEventListener(evt, function() {
        userInteracted = true;
        stopAuto();
      }, { once: true });
    });
  }
  // ----- TIMELINE STEP - keyboard focus moves between steps -----
  var tlSteps = root.querySelectorAll('.hw-anth-timeline__step');
  tlSteps.forEach(function(step, i) {
    step.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft' && i > 0) {
        tlSteps[i - 1].focus();
      } else if (e.key === 'ArrowRight' && i < tlSteps.length - 1) {
        tlSteps[i + 1].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        step.click();
      }
    });
  });
})();

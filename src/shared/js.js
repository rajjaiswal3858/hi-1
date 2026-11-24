(function() {
  var root = document.getElementById('hw-gcp-root');
  if (!root) return;

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    root.querySelectorAll('.hw-gcp-reveal').forEach(function(el) { io.observe(el); });
  } else {
    root.querySelectorAll('.hw-gcp-reveal').forEach(function(el) { el.classList.add('is-visible'); });
  }

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

  // ----- SLIDER (How We Engage) -----
  var slider = root.querySelector('.hw-gcp-slider');
  if (slider) {
    var slides = slider.querySelectorAll('.hw-gcp-slide');
    var steps = slider.querySelectorAll('.hw-gcp-timeline__step');
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
        step.classList.toggle('hw-gcp-timeline__step--active', stepNum === n);
        step.classList.toggle('hw-gcp-timeline__step--completed', stepNum < n);
      });
    }

    steps.forEach(function(step) {
      step.addEventListener('click', function() {
        var n = parseInt(step.getAttribute('data-step'), 10);
        if (!isNaN(n)) setActive(n);
      });
    });

    // Keyboard navigation
    slider.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') { setActive(current - 1); }
      else if (e.key === 'ArrowRight') { setActive(current + 1); }
    });

    // Touch/swipe support
    var touchStartX = 0;
    var touchEndX = 0;
    var slidesWrap = slider.querySelector('.hw-gcp-slides-wrap');
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
})();

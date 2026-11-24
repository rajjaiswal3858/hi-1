(function () {
  var bg = document.getElementById('hwch-bg');
  if (!bg) return;
  document.addEventListener('mousemove', function(e) {
    var cx = e.clientX / window.innerWidth  - 0.5;
    var cy = e.clientY / window.innerHeight - 0.5;
    bg.style.transform = 'scale(1.03) translate(' + (cx*7) + 'px,' + (cy*5) + 'px)';
  });
})();
;
const def1Text = "An innovator, technologist, designer and/or builder who creates software products that people love";
  const def2Text = "A person who is passionate, selfless, intuitive, creative, curious, and driven.";

  const text1El = document.getElementById('text1');
  const text2El = document.getElementById('text2');
  const def1El  = document.getElementById('def1');
  const def2El  = document.getElementById('def2');

  function typeText(targetEl, parentEl, text, delay, onDone) {
    // Reveal the parent row
    parentEl.classList.add('visible');

    // Create cursor
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    targetEl.appendChild(cursor);

    let i = 0;
    const speed = 28; // ms per character

    setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          // Insert character before cursor
          cursor.insertAdjacentText('beforebegin', text[i]);
          i++;
        } else {
          clearInterval(interval);
          // Fade out cursor after short pause
          setTimeout(() => {
            cursor.classList.add('done');
            if (onDone) onDone();
          }, 500);
        }
      }, speed);
    }, delay);
  }

  // Chain: def1 starts at 900ms, def2 starts when def1 finishes
  window.addEventListener('DOMContentLoaded', () => {
    const def1Delay = 900;
    const def1Duration = def1Text.length * 28 + 600; // type time + pause

    typeText(text1El, def1El, def1Text, def1Delay, () => {
      typeText(text2El, def2El, def2Text, 200, null);
    });
  });
;
(function () {
  var cards = document.querySelectorAll('#hwbn .hwbn-card');
  if (!cards.length) return;

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('hwbn-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    cards.forEach(function(c) { io.observe(c); });
  } else {
    cards.forEach(function(c) { c.classList.add('hwbn-visible'); });
  }
})();
;
(function () {
  var tabs  = document.querySelectorAll('#hwtq .hwtq-tab');
  var cards = document.querySelectorAll('#hwtq .hwtq-card');
  var dots  = document.querySelectorAll('#hwtq .hwtq-dot');
  var current = 0;
  var autoTimer;

  function show(idx) {
    // deactivate all
    [tabs, cards, dots].forEach(function(col) {
      col.forEach(function(el) {
        el.classList.remove('active', 'visible');
        el.setAttribute && el.setAttribute('aria-selected', 'false');
      });
    });

    // activate target
    tabs[idx].classList.add('active');
    tabs[idx].setAttribute('aria-selected', 'true');
    dots[idx].classList.add('active');
    cards[idx].classList.add('active');

    // trigger animation next frame
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        cards[idx].classList.add('visible');
      });
    });

    current = idx;
  }

  // Click on tab
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      clearInterval(autoTimer);
      show(parseInt(tab.dataset.idx));
      startAuto();
    });
  });

  // Click on dot
  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      clearInterval(autoTimer);
      show(parseInt(dot.dataset.idx));
      startAuto();
    });
  });

  // Keyboard nav on tabs
  tabs.forEach(function(tab, i) {
    tab.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowRight') show((i + 1) % tabs.length);
      if (e.key === 'ArrowLeft')  show((i - 1 + tabs.length) % tabs.length);
    });
    tab.setAttribute('tabindex', '0');
  });

  // Auto-advance every 5s
  function startAuto() {
    autoTimer = setInterval(function() {
      show((current + 1) % tabs.length);
    }, 5000);
  }

  // Init: show first card
  show(0);
  startAuto();

  // Pause on hover
  var stage = document.querySelector('#hwtq .hwtq-stage');
  stage.addEventListener('mouseenter', function() { clearInterval(autoTimer); });
  stage.addEventListener('mouseleave', function() { startAuto(); });
})();
;
(function () {
  var cards = document.querySelectorAll('#hwcv .hwcv-card');
  if (!cards.length) return;

  // Scroll reveal
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('hwcv-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    cards.forEach(function(c) { io.observe(c); });
  } else {
    cards.forEach(function(c) { c.classList.add('hwcv-in'); });
  }

  // Touch toggle
  cards.forEach(function(card) {
    card.addEventListener('touchend', function(e) {
      e.preventDefault();
      var isActive = card.classList.contains('hwcv-active');
      cards.forEach(function(c) { c.classList.remove('hwcv-active'); });
      if (!isActive) card.classList.add('hwcv-active');
    });
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('hwcv-active');
      }
    });
  });
})();
;
// Force video play on mobile (some browsers need a nudge)
(function () {
  var v = document.querySelector('#hwfut .hwfut-video');
  if (!v) return;
  v.muted = true;
  var p = v.play();
  if (p && p.catch) p.catch(function() {});

  // If video fails to load, the CSS gradient fallback stays
  v.addEventListener('error', function() {
    v.style.display = 'none';
  });
})();
;
(function () {
  var items   = Array.from(document.querySelectorAll('#hwgl .hwgl-item'));
  var lb      = document.getElementById('hwgl-lb');
  var lbImg   = document.getElementById('hwgl-lb-img');
  var lbClose = document.getElementById('hwgl-lb-close');
  var lbPrev  = document.getElementById('hwgl-lb-prev');
  var lbNext  = document.getElementById('hwgl-lb-next');
  var lbDots  = document.getElementById('hwgl-lb-counter');
  var current = 0;
  var srcs    = items.map(function(i) { return i.querySelector('img').src; });
  var alts    = items.map(function(i) { return i.querySelector('img').alt; });

  // Build dots
  srcs.forEach(function(_, i) {
    var d = document.createElement('span');
    d.className = 'hwgl-lb-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', function() { showLb(i); });
    lbDots.appendChild(d);
  });

  function showLb(idx) {
    current = (idx + srcs.length) % srcs.length;
    lbImg.src = srcs[current];
    lbImg.alt = alts[current];
    document.querySelectorAll('.hwgl-lb-dot').forEach(function(d, i) {
      d.classList.toggle('active', i === current);
    });
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function() { lbImg.src = ''; }, 300);
  }

  items.forEach(function(item) {
    item.addEventListener('click', function() { showLb(parseInt(item.dataset.idx)); });
    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showLb(parseInt(item.dataset.idx)); }
    });
  });

  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click',  function() { showLb(current - 1); });
  lbNext.addEventListener('click',  function() { showLb(current + 1); });

  lb.addEventListener('click', function(e) { if (e.target === lb) closeLb(); });

  document.addEventListener('keydown', function(e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLb();
    if (e.key === 'ArrowLeft')  showLb(current - 1);
    if (e.key === 'ArrowRight') showLb(current + 1);
  });

  // Touch swipe on lightbox
  var touchX = 0;
  lbImg.addEventListener('touchstart', function(e) { touchX = e.touches[0].clientX; }, { passive: true });
  lbImg.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) dx < 0 ? showLb(current + 1) : showLb(current - 1);
  });

  // Scroll reveal
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('hwgl-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    items.forEach(function(i) { io.observe(i); });
  } else {
    items.forEach(function(i) { i.classList.add('hwgl-in'); });
  }
})();
;
(function () {
  var items    = Array.from(document.querySelectorAll('#hwfq .hwfq-item'));
  var cats     = document.querySelectorAll('#hwfq .hwfq-cat');
  var searchEl = document.getElementById('hwfq-search-input');
  var countEl  = document.getElementById('hwfq-count');
  var emptyEl  = document.getElementById('hwfq-empty');
  var activeCat = 'all';

  // ── ACCORDION ──
  items.forEach(function(item) {
    var btn = item.querySelector('.hwfq-q');
    btn.addEventListener('click', function() { toggle(item); });
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(item); }
    });
  });

  function toggle(item) {
    var isOpen = item.classList.contains('open');
    // close all
    items.forEach(function(i) {
      i.classList.remove('open');
      i.querySelector('.hwfq-q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      item.querySelector('.hwfq-q').setAttribute('aria-expanded', 'true');
    }
  }

  // ── FILTER ──
  window.hwfqFilter = function() {
    var q = searchEl.value.trim().toLowerCase();
    var visible = 0;

    items.forEach(function(item) {
      var cat   = item.dataset.cat;
      var text  = item.querySelector('.hwfq-q-text').textContent.toLowerCase();
      var aText = item.querySelector('.hwfq-a-inner').textContent.toLowerCase();
      var catOk = activeCat === 'all' || cat === activeCat;
      var srchOk = !q || text.includes(q) || aText.includes(q);

      if (catOk && srchOk) {
        item.classList.remove('hwfq-hidden');
        visible++;
      } else {
        item.classList.add('hwfq-hidden');
        item.classList.remove('open');
      }
    });

    countEl.textContent = visible + (visible === 1 ? ' question' : ' questions');
    emptyEl.classList.toggle('visible', visible === 0);
  };

  // ── CATEGORY CLICK ──
  cats.forEach(function(cat) {
    cat.addEventListener('click', function() {
      cats.forEach(function(c) { c.classList.remove('active'); });
      cat.classList.add('active');
      activeCat = cat.dataset.cat;
      hwfqFilter();
    });
  });

  // ── SEARCH ──
  searchEl.addEventListener('input', hwfqFilter);

  // Init count
  hwfqFilter();
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":28960,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

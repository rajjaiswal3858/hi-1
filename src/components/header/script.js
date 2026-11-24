(function () {
/* Elementor "Sticky" clones the widget into a placeholder on scroll.
   Init every copy (expando flag — cloneNode doesn't copy it) and pick up
   new copies as they appear, so whichever one is on screen is live. */
function initNav(root) {
  if (root.__hwInit) return;
  root.__hwInit = true;

  var OPEN_DELAY = 90, CLOSE_DELAY = 220;
  var openT, closeT, current = null;
  var mqDesktop = window.matchMedia('(min-width: 1160px)');

  /* position:sticky dies inside a clipping / transformed ancestor —
     Elementor containers often are one. Detect it and go fixed instead. */
  function ensureSticky() {
    var el = root.parentElement, clipped = false;
    while (el && el !== document.documentElement) {
      var cs = getComputedStyle(el);
      if (cs.overflow !== 'visible' || cs.overflowX !== 'visible' || cs.overflowY !== 'visible' ||
          cs.transform !== 'none' || cs.filter !== 'none' || cs.perspective !== 'none' ||
          cs.contain.indexOf('paint') > -1 || cs.contain.indexOf('layout') > -1) { clipped = true; break; }
      el = el.parentElement;
    }
    root.classList.toggle('is-fixed', clipped);
  }
  ensureSticky();
  window.addEventListener('load', ensureSticky);

  var menus = {};
  Array.prototype.forEach.call(root.querySelectorAll('[data-hw-menu]'), function (li) {
    var id = li.getAttribute('data-hw-menu');
    menus[id] = {
      li: li,
      trigger: li.querySelector('[data-hw-trigger]'),
      panel: root.querySelector('[data-hw-panel="' + id + '"]')
    };
  });

  function setOpen(id) {
    Object.keys(menus).forEach(function (k) {
      var m = menus[k], on = k === id;
      m.panel.classList.toggle('is-open', on);
      m.trigger.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    current = id;
  }
  function closeAll() { setOpen(null); }

  Object.keys(menus).forEach(function (id) {
    var m = menus[id];

    function enter() {
      if (!mqDesktop.matches) return;
      clearTimeout(closeT); clearTimeout(openT);
      if (current && current !== id) return setOpen(id);   // instant switch
      if (current === id) return;
      openT = setTimeout(function () { setOpen(id); }, OPEN_DELAY);
    }
    function leave() {
      if (!mqDesktop.matches) return;
      clearTimeout(openT); clearTimeout(closeT);
      closeT = setTimeout(closeAll, CLOSE_DELAY);
    }

    m.li.addEventListener('mouseenter', enter);
    m.li.addEventListener('mouseleave', leave);
    m.panel.addEventListener('mouseenter', function () { clearTimeout(closeT); clearTimeout(openT); });
    m.panel.addEventListener('mouseleave', leave);

    m.trigger.addEventListener('click', function (e) {
      e.preventDefault();
      clearTimeout(openT); clearTimeout(closeT);
      setOpen(current === id ? null : id);
    });
    m.trigger.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        clearTimeout(openT); clearTimeout(closeT);
        setOpen(id);
      }
    });
  });

  document.addEventListener('mousedown', function (e) {
    if (!root.contains(e.target)) closeAll();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (current) { var t = menus[current].trigger; closeAll(); t.focus(); }
    closeDrawer();
  });

  /* drawer */
  var burger = root.querySelector('[data-hw-burger]');
  var scrim = root.querySelector('[data-hw-scrim]');

  function openDrawer() {
    root.classList.add('is-drawer-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (!root.classList.contains('is-drawer-open')) return;
    root.classList.remove('is-drawer-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
    Array.prototype.forEach.call(root.querySelectorAll('[data-hw-acc]'), function (b) {
      b.setAttribute('aria-expanded', 'false');
    });
  }
  burger.addEventListener('click', function () {
    root.classList.contains('is-drawer-open') ? closeDrawer() : openDrawer();
  });
  scrim.addEventListener('click', closeDrawer);

  var drawerBody = root.querySelector('.hw-drawer-body');

  Array.prototype.forEach.call(root.querySelectorAll('[data-hw-acc]'), function (btn) {
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      Array.prototype.forEach.call(root.querySelectorAll('[data-hw-acc]'), function (b) {
        b.setAttribute('aria-expanded', 'false');
      });
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      /* bring the section header to the top of the scroller so the freshly
         revealed links are on screen rather than below the fold */
      if (!isOpen && drawerBody) {
        var top = btn.getBoundingClientRect().top - drawerBody.getBoundingClientRect().top + drawerBody.scrollTop;
        var dest = Math.max(0, top - 4);
        var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (smooth) {
          try { drawerBody.scrollTo({ top: dest, behavior: 'smooth' }); }
          catch (err) { drawerBody.scrollTop = dest; }
        } else { drawerBody.scrollTop = dest; }
      }
    });
  });

  function onBreak() { if (mqDesktop.matches) closeDrawer(); else closeAll(); }
  mqDesktop.addEventListener ? mqDesktop.addEventListener('change', onBreak) : mqDesktop.addListener(onBreak);
}

function boot() {
  Array.prototype.forEach.call(document.querySelectorAll('[id="hwnav"]'), initNav);
}
boot();
var pending = false;
new MutationObserver(function () {
  if (pending) return;
  pending = true;
  requestAnimationFrame(function () { pending = false; boot(); });
}).observe(document.body, { childList: true, subtree: true });
})();

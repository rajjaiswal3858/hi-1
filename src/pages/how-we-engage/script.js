(function(){
  var root = document.querySelector(".hw-engage");
  if (!root || root.getAttribute("data-hw-init")) return;
  root.setAttribute("data-hw-init", "1");

  /* Fallback height of your sticky site header, in px. The script measures the real
     header first and only falls back to this if it cannot find one. */
  var NAV_OFFSET = 100;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  var saveData = !!(conn && conn.saveData);
  var hasIO = "IntersectionObserver" in window;
  var each = function(list, fn){ Array.prototype.forEach.call(list, fn); };

  /* ---------- glossary: parsed from the <dl> in the page, one source of truth ---------- */
  var TERMS = {}, ORDER = [];
  each(root.querySelectorAll("[data-term-id]"), function(n){
    var id = n.getAttribute("data-term-id");
    var dt = n.querySelector("dt");
    var short = n.querySelector("[data-short]");
    var body = [];
    each(n.querySelectorAll("dd p"), function(p){
      if (!p.hasAttribute("data-short")) body.push(p.textContent.trim());
    });
    TERMS[id] = {
      label: dt ? dt.textContent.trim() : id,
      short: short ? short.textContent.trim() : "",
      body: body,
      related: (n.getAttribute("data-related") || "").split(/\s+/).filter(Boolean)
    };
    ORDER.push(id);
  });

  /* ---------- hero background video: in-view only, skipped on save-data ---------- */
  var heroVideo = root.querySelector("[data-hero-video]");
  if (heroVideo) {
    heroVideo.addEventListener("error", function(){ heroVideo.style.display = "none"; });
    if (reduced || saveData) {
      heroVideo.style.display = "none";
    } else {
      heroVideo.muted = true; heroVideo.defaultMuted = true; heroVideo.loop = true; heroVideo.playsInline = true;
      heroVideo.setAttribute("preload", "metadata");
      heroVideo.src = "/assets/wp-content/uploads/2026/02/0209.webm";
      var playHero = function(){ var p = heroVideo.play(); if (p && p.catch) p.catch(function(){}); };
      playHero();
      if (hasIO) {
        new IntersectionObserver(function(entries){
          each(entries, function(e){ if (e.isIntersecting) { playHero(); } else { heroVideo.pause(); } });
        }, { threshold: 0 }).observe(heroVideo);
      }
    }
  }

  /* ---------- logo marquee: pause offscreen and in background tabs ---------- */
  var marquee = root.querySelector("[data-marquee]");
  var marqueeVisible = true;
  function syncMarquee(){
    if (!marquee) return;
    marquee.style.animationPlayState = (marqueeVisible && !document.hidden) ? "running" : "paused";
  }
  if (marquee && hasIO) {
    new IntersectionObserver(function(entries){
      each(entries, function(e){ marqueeVisible = e.isIntersecting; });
      syncMarquee();
    }, { threshold: 0 }).observe(marquee);
  }

  /* ---------- graphics only. text and images are never hidden by script. ----------
     The scroll-in fade was removed: a host that throttles observers or transitions
     could leave content stuck at opacity 0. Only charts animate now, and they
     always end painted whatever the browser does. */
  function paint(scope) {
    each(scope.querySelectorAll("[data-draw]"), function(p){ p.style.strokeDashoffset = "0"; });
    each(scope.querySelectorAll("[data-grow]"), function(b){ b.style.width = b.getAttribute("data-grow") + "%"; });
    each(scope.querySelectorAll("[data-pop]"), function(p){ p.style.opacity = "1"; });
  }
  var charts = [];
  if (!reduced) {
    var vh0 = window.innerHeight || 800;
    each(root.querySelectorAll("[data-reveal]"), function(el){
      if (!el.querySelector("[data-draw],[data-grow],[data-pop]")) return;
      if (el.getBoundingClientRect().top < vh0 - 48) { paint(el); return; }
      charts.push(el);
      each(el.querySelectorAll("[data-pop]"), function(p){ p.style.opacity = "0"; });
      each(el.querySelectorAll("[data-grow]"), function(g){ g.style.width = "0%"; });
    });
  } else {
    paint(root);
  }
  function armPaint(el){
    if (el.getAttribute("data-painted")) return;
    el.setAttribute("data-painted", "1");
    paint(el);
  }
  if (charts.length && hasIO) {
    var io = new IntersectionObserver(function(entries){
      each(entries, function(e){ if (e.isIntersecting) { armPaint(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -48px 0px" });
    charts.forEach(function(el){ io.observe(el); });
  }
  function chartScan(){
    if (!charts.length) return;
    var vh = window.innerHeight || 800;
    charts = charts.filter(function(el){
      var r = el.getBoundingClientRect();
      if (r.top < vh - 48 && r.bottom > 0) { armPaint(el); return false; }
      return true;
    });
  }
  var chartQueued = false;
  document.addEventListener("scroll", function(){
    if (chartQueued || !charts.length) return;
    chartQueued = true;
    window.requestAnimationFrame(function(){ chartQueued = false; chartScan(); });
  }, { passive: true, capture: true });
  window.addEventListener("resize", chartScan);
  window.setTimeout(function(){ paint(root); charts = []; }, 4000);

  /* ---------- metric count-up ---------- */
  if (!reduced && hasIO) {
    var io2 = new IntersectionObserver(function(entries){
      each(entries, function(e){
        if (!e.isIntersecting) return;
        io2.unobserve(e.target);
        var el = e.target, target = Number(el.getAttribute("data-countup") || 0), suffix = el.getAttribute("data-suffix") || "";
        var t0 = performance.now();
        (function tick(t){
          var p = Math.min(1, ((t || performance.now()) - t0) / 1000);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })();
      });
    }, { threshold: 0.4 });
    each(root.querySelectorAll("[data-countup]"), function(el){ io2.observe(el); });
  }

  /* ---------- hero list: auto-cycling highlight ---------- */
  var rows = root.querySelectorAll("[data-hero]");
  var active = 0, locked = false, heroTimer = null, rowsVisible = true;
  function drawRows(){
    each(rows, function(row, i){
      var on = i === active;
      var bar = row.children[0];
      var box = row.children[1];
      var svg = row.querySelector("svg");
      if (bar) bar.style.height = on ? "48px" : "0px";
      if (box) box.style.borderColor = on ? "rgba(58,189,188,.55)" : "rgba(255,255,255,.10)";
      if (svg) svg.setAttribute("stroke", on ? "#3ABDBC" : "#8A8F99");
    });
  }
  function hold(i){ active = i; locked = true; drawRows(); }
  each(rows, function(row, i){
    row.addEventListener("mouseenter", function(){ hold(i); });
    row.addEventListener("mouseleave", function(){ locked = false; });
    row.addEventListener("focus", function(){ hold(i); });
    row.addEventListener("blur", function(){ locked = false; });
  });
  drawRows();
  function syncCycle(){
    var run = !reduced && rows.length && rowsVisible && !document.hidden;
    if (run && !heroTimer) {
      heroTimer = window.setInterval(function(){
        if (!locked) { active = (active + 1) % rows.length; drawRows(); }
      }, 3200);
    } else if (!run && heroTimer) {
      window.clearInterval(heroTimer); heroTimer = null;
    }
  }
  if (rows.length && hasIO) {
    new IntersectionObserver(function(entries){
      each(entries, function(e){ rowsVisible = e.isIntersecting; });
      syncCycle();
    }, { threshold: 0 }).observe(rows[0].parentNode);
  }
  syncCycle();
  document.addEventListener("visibilitychange", function(){ syncCycle(); syncMarquee(); });

  /* ---------- anchor jumps, measured against the real sticky header ---------- */
  function navOffset(){
    var best = 0;
    each(document.querySelectorAll("header, .elementor-location-header, [data-elementor-type='header'], .site-header"), function(h){
      var cs = window.getComputedStyle(h);
      if (cs.position !== "fixed" && cs.position !== "sticky") return;
      var r = h.getBoundingClientRect();
      if (r.top <= 8 && r.height > best) best = r.height;
    });
    return best ? Math.round(best) + 12 : NAV_OFFSET;
  }
  function jump(id){
    var el = document.getElementById(id);
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.pageYOffset - navOffset();
    if ("scrollBehavior" in document.documentElement.style) {
      window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
    } else {
      window.scrollTo(0, y);
    }
  }

  /* ---------- plain-language glossary drawer ---------- */
  var dock = null, lastFocus = null, prevHtmlOverflow = "", prevBodyOverflow = "";
  function el(tag, style, html){
    var n = document.createElement(tag);
    if (style) n.setAttribute("style", style);
    if (html != null) n.innerHTML = html;
    return n;
  }
  function btn(style, html){
    var n = el("span", style, html);
    n.setAttribute("role", "button");
    n.setAttribute("tabindex", "0");
    n.addEventListener("keydown", function(e){
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); n.click(); }
    });
    return n;
  }
  function closeDock(){
    if (!dock) return;
    dock.remove(); dock = null;
    document.documentElement.style.overflow = prevHtmlOverflow;
    document.body.style.overflow = prevBodyOverflow;
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (err) { lastFocus.focus(); } }
    lastFocus = null;
  }
  function focusables(){
    return dock ? dock.querySelectorAll('a[href], [role="button"], button, [tabindex]:not([tabindex="-1"])') : [];
  }
  function openDock(view, id){
    var restore = dock ? lastFocus : document.activeElement;
    if (dock) { dock.remove(); dock = null; }
    else {
      prevHtmlOverflow = document.documentElement.style.overflow;
      prevBodyOverflow = document.body.style.overflow;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
    lastFocus = restore;

    dock = el("div", "position:fixed;inset:0;z-index:2147483000");
    dock.id = "hw-glossary";
    dock.setAttribute("role", "dialog");
    dock.setAttribute("aria-modal", "true");
    dock.setAttribute("aria-label", "Plain-language glossary");

    var scrim = el("div", "position:absolute;inset:0;background:rgba(0,0,0,.6);animation:hw-scrim 200ms cubic-bezier(.2,.8,.2,1) both");
    scrim.addEventListener("click", closeDock);
    var panel = el("aside", "position:absolute;top:0;right:0;bottom:0;width:min(440px,100vw);background:#14181f;border-left:1px solid rgba(255,255,255,.07);overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;animation:hw-dock 320ms cubic-bezier(.2,.8,.2,1) both");
    var head = el("div", "position:sticky;top:0;z-index:1;display:flex;align-items:center;gap:16px;padding:20px 24px;background:#14181f;border-bottom:1px solid rgba(255,255,255,.07)");
    head.appendChild(el("span", "font-family:'Space Grotesk',sans-serif;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#3abdbc", "Plain-language glossary"));
    var x = btn("margin-left:auto;width:44px;height:44px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#c9ccd3;font-size:16px;cursor:pointer", "&#10005;");
    x.setAttribute("aria-label", "Close glossary");
    x.addEventListener("click", closeDock);
    head.appendChild(x);
    panel.appendChild(head);

    var body = el("div", "padding:26px 24px calc(40px + env(safe-area-inset-bottom, 0px))");
    if (view === "term" && TERMS[id]) {
      var t = TERMS[id];
      var back = btn("display:inline-flex;align-items:center;gap:8px;min-height:44px;color:#8a8f99;font-size:13px;cursor:pointer", "&#8592; All terms");
      back.addEventListener("click", function(){ openDock("index"); });
      body.appendChild(back);
      body.appendChild(el("h3", "margin-top:14px;font-size:30px;font-weight:700;letter-spacing:-.01em;line-height:1.15;color:#fff", t.label));
      body.appendChild(el("p", "margin-top:10px;font-size:19px;line-height:1.4;color:#bfefef", t.short));
      body.appendChild(el("div", "height:1px;background:rgba(255,255,255,.07);margin:24px 0"));
      t.body.forEach(function(par){ body.appendChild(el("p", "margin-bottom:14px;font-size:16px;line-height:1.7;color:#c9ccd3", par)); });
      var rel = t.related.filter(function(r){ return TERMS[r]; });
      if (rel.length) {
        body.appendChild(el("div", "margin-top:28px;margin-bottom:12px;font-family:'Space Grotesk',sans-serif;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8a8f99", "Related"));
        var wrap = el("div", "display:flex;flex-wrap:wrap;gap:8px");
        rel.forEach(function(r){
          var chip = btn("display:inline-flex;align-items:center;min-height:44px;padding:8px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);color:#c9ccd3;font-size:13px;cursor:pointer", TERMS[r].label);
          chip.addEventListener("click", function(){ openDock("term", r); });
          wrap.appendChild(chip);
        });
        body.appendChild(wrap);
      }
    } else {
      body.appendChild(el("p", "margin-bottom:20px;font-size:14px;line-height:1.5;color:#8a8f99", "Every term used on this page, in one place. Select one for the plain-language definition."));
      ORDER.forEach(function(k){
        var b = btn("width:100%;display:block;text-align:left;padding:16px 4px;border-top:1px solid rgba(255,255,255,.07);cursor:pointer",
          "<span style=\"display:block;font-size:16px;font-weight:700;color:#fff\">" + TERMS[k].label + "</span><span style=\"display:block;padding-top:4px;font-size:14px;color:#8a8f99\">" + TERMS[k].short + "</span>");
        b.addEventListener("click", function(){ openDock("term", k); });
        body.appendChild(b);
      });
    }
    panel.appendChild(body);
    dock.appendChild(scrim);
    dock.appendChild(panel);
    document.body.appendChild(dock);
    panel.scrollTop = 0;
    var f = focusables();
    if (f.length) { try { f[0].focus({ preventScroll: true }); } catch (err) { f[0].focus(); } }
  }

  function handle(e, isKey){
    var t = e.target;
    if (!t || !t.closest) return;
    var term = t.closest("[data-term]");
    if (term) { if (isKey) e.preventDefault(); openDock("term", term.getAttribute("data-term")); return; }
    if (t.closest("[data-dock-index]")) { if (isKey) e.preventDefault(); openDock("index"); return; }
    var j = t.closest("[data-jump]");
    if (j) { e.preventDefault(); jump(j.getAttribute("data-jump")); }
  }
  root.addEventListener("click", function(e){ handle(e, false); });
  root.addEventListener("keydown", function(e){
    if (e.key !== "Enter" && e.key !== " ") return;
    handle(e, true);
  });
  window.addEventListener("keydown", function(e){
    if (!dock) return;
    if (e.key === "Escape") { e.preventDefault(); closeDock(); return; }
    if (e.key !== "Tab") return;
    var f = focusables();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":36543,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

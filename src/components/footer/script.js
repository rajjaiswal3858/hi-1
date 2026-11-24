(function(){var f=document.getElementById('hwf');if(f)f.className+=' hwf-js';})();
;

/* ============================================================
   HATCHWORKS AI · FOOTER v5 runtime
   Idempotent · multi-instance safe · re-inits inside the Elementor editor.
   Every block is independently try/caught: one failure cannot take the
   rest of the footer down.
   ============================================================ */
(function(){
  'use strict';
  var FONT_HREF = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap';

  function guard(fn){ try{ fn(); }catch(e){ if(window.console && console.warn){ console.warn('[hwf]', e); } } }
  function mq(q){ return window.matchMedia ? window.matchMedia(q) : {matches:false, addEventListener:function(){}}; }

  /* ---- fonts: injected into the document head, never render-blocking ---- */
  guard(function loadFonts(){
    if(document.querySelector('link[data-hwf-font]')) return;
    var head = document.head || document.getElementsByTagName('head')[0];
    if(!head) return;
    [['preconnect','https://fonts.googleapis.com',false],['preconnect','https://fonts.gstatic.com',true]].forEach(function(p){
      var l = document.createElement('link');
      l.rel = p[0]; l.href = p[1]; if(p[2]) l.crossOrigin = 'anonymous';
      l.setAttribute('data-hwf-font','pre');
      head.appendChild(l);
    });
    var css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = FONT_HREF; css.media = 'print';
    css.setAttribute('data-hwf-font','css');
    css.onload = function(){ css.media = 'all'; };
    head.appendChild(css);
    /* watchdog: if onload is stripped by a security plugin, swap anyway */
    setTimeout(function(){ if(css.media !== 'all') css.media = 'all'; }, 2500);
  });

  function init(root){
    if(!root || root.getAttribute('data-hwf-ready') === '1') return;
    root.setAttribute('data-hwf-ready','1');

    var reduceMQ = mq('(prefers-reduced-motion: reduce)');
    var reduce   = !!reduceMQ.matches;
    if(reduceMQ.addEventListener){ reduceMQ.addEventListener('change', function(e){ reduce = e.matches; }); }
    var $  = function(s){ return root.querySelector(s); };
    var $$ = function(s){ return Array.prototype.slice.call(root.querySelectorAll(s)); };
    var say = $('[data-hwf-say]');

    /* ---- touch flag ---- */
    guard(function(){
      function markTouch(e){
        if(e.type === 'touchstart' || (e.pointerType && e.pointerType !== 'mouse')){ root.classList.add('hwf-touch'); }
      }
      window.addEventListener('touchstart', markTouch, {passive:true, once:true});
      window.addEventListener('pointerdown', markTouch, {passive:true});
    });

    /* ---- reveal on scroll, with a fail-open sweep that detaches itself ---- */
    guard(function(){
      var reveals = $$('.reveal');
      if(!reveals.length) return;
      if('IntersectionObserver' in window){
        var io = new IntersectionObserver(function(es){
          es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('hwf-in'); io.unobserve(e.target); } });
        }, {threshold:0.1, rootMargin:'0px 0px -5% 0px'});
        reveals.forEach(function(el){ io.observe(el); });
      } else {
        reveals.forEach(function(el){ el.classList.add('hwf-in'); });
        return;
      }
      var pending = reveals.slice();
      function sweep(){
        var vh = window.innerHeight || 800;
        pending = pending.filter(function(el){
          if(el.classList.contains('hwf-in')) return false;
          if(el.getBoundingClientRect().top < vh * 1.5){ el.classList.add('hwf-in'); return false; }
          return true;
        });
        if(!pending.length){ window.removeEventListener('scroll', sweep); }
      }
      window.addEventListener('load', sweep);
      window.addEventListener('scroll', sweep, {passive:true});
      setTimeout(sweep, 1200);
      setTimeout(function(){ reveals.forEach(function(el){ el.classList.add('hwf-in'); }); window.removeEventListener('scroll', sweep); }, 6000);
    });

    /* ---- tabs: sliding glider + height-morphing panels ---- */
    guard(function(){
      var tabs   = $$('.hwf-tab');
      var panels = $$('.hwf-panel');
      var glider = $('.hwf-tab-glider');
      var stack  = $('.hwf-panels');
      var bar    = $('.hwf-tabs');
      if(!tabs.length || !stack) return;

      function moveGlider(tab){
        if(!glider || !tab || !bar) return;
        var t = tab.getBoundingClientRect(), b = bar.getBoundingClientRect();
        if(!t.width) return;
        var w = t.width + 'px', x = 'translateX(' + (t.left - b.left - bar.clientLeft) + 'px)';
        if(glider.style.width === w && glider.style.transform === x) return; /* skip no-op writes */
        glider.style.setProperty('width', w, 'important');
        glider.style.setProperty('transform', x, 'important');
      }
      function activeTab(){
        for(var i=0;i<tabs.length;i++){ if(tabs[i].classList.contains('is-active')) return tabs[i]; }
        return tabs[0];
      }
      function syncHeight(){
        var on = stack.querySelector('.hwf-panel.is-active');
        if(!on) return;
        var h = Math.round(on.getBoundingClientRect().height);
        if(h < 1) return;
        /* Compare against what is actually written, never a cached value: a
           cache seeded from the outgoing panel makes the height grow but
           never shrink. The 2px epsilon still absorbs sub-pixel flip-flop. */
        var cur = parseFloat(stack.style.height);
        if(!isNaN(cur) && Math.abs(h - cur) < 2) return;
        stack.style.height = h + 'px';
      }
      var morphT = 0;
      function activate(tab){
        /* lock the outgoing height so the swap has something to animate from */
        stack.style.height = Math.round(stack.getBoundingClientRect().height) + 'px';
        stack.classList.add('is-morphing');
        clearTimeout(morphT);
        morphT = setTimeout(function(){ stack.classList.remove('is-morphing'); syncHeight(); }, 400);
        tabs.forEach(function(t){
          var on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.setAttribute('tabindex', on ? '0' : '-1');
        });
        panels.forEach(function(p){
          var on = p.id === tab.getAttribute('aria-controls');
          p.classList.toggle('is-active', on);
          if(on){ p.removeAttribute('hidden'); } else { p.setAttribute('hidden',''); }
        });
        moveGlider(tab);
        /* two frames: the incoming panel is not laid out on the first one,
           so a single rAF measures the outgoing height and the shrink is lost */
        requestAnimationFrame(function(){ requestAnimationFrame(syncHeight); });
      }
      tabs.forEach(function(t, i){
        t.addEventListener('click', function(){ activate(t); });
        t.addEventListener('keydown', function(e){
          var k = e.key, last = tabs.length - 1, next = null;
          if(k === 'ArrowRight'){ next = tabs[(i + 1) % tabs.length]; }
          else if(k === 'ArrowLeft'){ next = tabs[(i - 1 + tabs.length) % tabs.length]; }
          else if(k === 'Home'){ next = tabs[0]; }
          else if(k === 'End'){ next = tabs[last]; }
          if(next){ e.preventDefault(); activate(next); next.focus(); }
        });
      });

      function reflow(){ moveGlider(activeTab()); syncHeight(); }
      requestAnimationFrame(reflow);
      window.addEventListener('load', reflow);
      if(document.fonts && document.fonts.ready){ document.fonts.ready.then(reflow).catch(function(){}); }
      var raf = 0;
      window.addEventListener('resize', function(){
        if(raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(reflow);
      }, {passive:true});
      window.addEventListener('orientationchange', function(){ setTimeout(reflow, 200); });
      /* content-driven resync — the validation hint used to be clipped here */
      if('ResizeObserver' in window){
        /* debounced to one frame: an undebounced callback that writes layout
           re-triggers itself and shows up as jitter (and a console loop warning) */
        var roRaf = 0, burst = 0, windowAt = 0, mutedUntil = 0;
        var ro = new ResizeObserver(function(){
          var now = Date.now();
          if(now < mutedUntil) return;
          if(now - windowAt > 1000){ windowAt = now; burst = 0; }
          /* Self-healing breaker: a burst only mutes the observer for half a
             second. Never disconnect — a legitimate flurry (window drag, font
             swap) would otherwise kill the resync for the rest of the session. */
          if(++burst > 40){ mutedUntil = now + 500; burst = 0; return; }
          if(roRaf) cancelAnimationFrame(roRaf);
          roRaf = requestAnimationFrame(function(){ roRaf = 0; syncHeight(); moveGlider(activeTab()); });
        });
        panels.forEach(function(p){ ro.observe(p); });
        if(bar) ro.observe(bar);
      }
      setTimeout(reflow, 400);
      setTimeout(reflow, 1500);
      root.__hwfReflow = reflow;
    });

    /* ---- cursor-tracked spotlight (fine pointers only) ---- */
    guard(function(){
      var band = $('.hwf-top'), spot = $('.hwf-top-spot');
      if(!band || !spot || reduce || !mq('(hover: hover)').matches) return;
      var px = 0, py = 0, queued = false;
      band.addEventListener('pointermove', function(e){
        if(e.pointerType && e.pointerType !== 'mouse') return;
        var r = band.getBoundingClientRect();
        px = e.clientX - r.left; py = e.clientY - r.top;
        if(queued) return;
        queued = true;
        requestAnimationFrame(function(){
          queued = false;
          spot.style.transform = 'translate3d(' + px + 'px,' + py + 'px,0)';
        });
      }, {passive:true});
    });

    /* ---- recognition ticker ----
       pauses off-screen (battery), while hovered on a mouse, and while held
       on touch. Under reduced motion the CSS turns it into a scroller and we
       leave it alone. */
    guard(function(){
      var rail  = $('.hwf-tick');
      var track = $('.hwf-tick-track');
      if(!rail || !track) return;

      if('IntersectionObserver' in window){
        var vio = new IntersectionObserver(function(es){
          es.forEach(function(e){ track.classList.toggle('is-off', !e.isIntersecting); });
        }, {threshold:0});
        vio.observe(rail);
      }
      if(document.addEventListener){
        document.addEventListener('visibilitychange', function(){
          track.classList.toggle('is-off', document.hidden);
        });
      }
      var hoverable = mq('(hover: hover)').matches;
      if(hoverable){
        rail.addEventListener('mouseenter', function(){ track.classList.add('is-hold'); rail.classList.add('is-held'); });
        rail.addEventListener('mouseleave', function(){ track.classList.remove('is-hold'); rail.classList.remove('is-held'); });
      }
      /* touch: hold to read, release to resume */
      var holdT = 0;
      function hold(){ clearTimeout(holdT); track.classList.add('is-hold'); rail.classList.add('is-held'); }
      function release(){ clearTimeout(holdT); holdT = setTimeout(function(){ track.classList.remove('is-hold'); rail.classList.remove('is-held'); }, 1400); }
      rail.addEventListener('touchstart', hold, {passive:true});
      rail.addEventListener('touchend', release, {passive:true});
      rail.addEventListener('touchcancel', release, {passive:true});
      /* keyboard: focusing the rail stops it so it can be read */
      rail.addEventListener('focus', hold);
      rail.addEventListener('blur', function(){ track.classList.remove('is-hold'); rail.classList.remove('is-held'); });
    });

    /* re-measure the open panel across the frames a content change needs */
    function resync(){
      var f = function(){ if(root.__hwfReflow) root.__hwfReflow(); };
      requestAnimationFrame(function(){ requestAnimationFrame(f); });
      setTimeout(f, 260);
      setTimeout(f, 700);
    }

    /* ---- newsletter: HubSpot form, lazy-loaded and spam-guarded ----
       The embed is NOT in the page source. It loads only after a trusted
       pointer/keyboard interaction with the tabs, so scrapers and headless
       crawlers that never touch the footer never see a form to post to.
       Before HubSpot's own handler runs, every submit is checked against:
       a random-named honeypot, a minimum fill time, proof of real typing,
       a per-browser rate limit, disposable-domain and link-stuffing rules. */
    guard(function(){
      var host = $('#hwf-hs-news'), act = $('#hwf-news-act'), hint = $('.hwf-news-hint');
      var tab = $('#hwf-tab-news'), bar = $('.hwf-tabs');
      if(!host || !act || !tab) return;
      var PORTAL = '6632357', FORM = 'c8829588-7319-414c-a034-6a95c1028b81';
      var SRC = '/scripts/hubspot-forms.js';
      var MIN_MS = 3000, MAX_SUBS = 3, WINDOW_MS = 3600000, KEY = 'hwf_hs_subs';
      var DISPOSABLE = /@(?:[a-z0-9-]+\.)*(?:mailinator|guerrillamail|sharklasers|10minutemail|temp-?mail|tempmail|yopmail|trashmail|getnada|dispostable|maildrop|throwawaymail|fakeinbox|mailnesia|moakt|emailondeck|mintemail|spamgourmet|mohmal|burnermail)\./i;
      var LINKY = /(?:https?:\/\/|www\.|\[url|<a\s)/i;
      var state = 0, readyAt = 0, human = false, timer = 0;

      var SHEET = [
        'P{background:transparent!important;margin:0}',
        'P .hs-form{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:center;gap:8px;margin:0;font-family:"Open Sans","Helvetica Neue",Arial,sans-serif}',
        'P .hs-form fieldset{max-width:none!important;flex:1 1 250px;min-width:0;margin:0!important;padding:0;border:0}',
        'P .hs-form .hs-form-field{flex:1 1 250px;min-width:0;margin:0!important}',
        'P .hs-form .hs-form-field>label{position:absolute!important;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}',
        'P .hs-form .input{margin:0!important}',
        'P .hs-input{box-sizing:border-box;width:100%!important;height:46px;padding:0 16px;border-radius:10px;background:rgba(255,255,255,.04)!important;border:1px solid rgba(255,255,255,.14)!important;color:#FFFFFF!important;font:400 16px/1.2 "Open Sans","Helvetica Neue",Arial,sans-serif;outline:none;box-shadow:none;transition:border-color 200ms cubic-bezier(.2,.8,.2,1),background-color 200ms cubic-bezier(.2,.8,.2,1),box-shadow 200ms cubic-bezier(.2,.8,.2,1)}',
        'P .hs-input::placeholder{color:#8A8F99;opacity:1}',
        'P .hs-input:focus{border-color:#3ABDBC!important;background:rgba(58,189,188,.06)!important;box-shadow:0 0 0 3px rgba(58,189,188,.16)}',
        'P .hs-input.invalid,P .hs-input.error{border-color:#F8C811!important}',
        'P .hs_submit{flex:none}',
        'P .hs_submit .actions{margin:0!important;padding:0!important}',
        'P .hs-button{box-sizing:border-box;height:46px;padding:0 20px;border:1px solid #3ABDBC;border-radius:10px;background:transparent;color:#3ABDBC;font:700 15px/1 "Open Sans","Helvetica Neue",Arial,sans-serif;letter-spacing:-.01em;cursor:pointer;-webkit-appearance:none;appearance:none;box-shadow:none;transition:color 200ms cubic-bezier(.2,.8,.2,1),background-color 200ms cubic-bezier(.2,.8,.2,1),border-color 200ms cubic-bezier(.2,.8,.2,1)}',
        'P .hs-button:hover{background:rgba(58,189,188,.14);color:#BFEFEF;border-color:#BFEFEF}',
        'P .hs-button:focus-visible{outline:2px solid #3ABDBC;outline-offset:2px}',
        'P .hs-button[disabled]{opacity:.5;cursor:default}',
        'P .hs-error-msgs{list-style:none;margin:6px 0 0!important;padding:0!important;text-align:left}',
        'P .hs-error-msgs label,P .hs-error-msg{font-size:13px;color:#F8C811}',
        'P .hs_error_rollup{display:none!important}',
        /* reCAPTCHA badge: collapsed out of the layout but still running (display:none
           breaks it). Google allows hiding it when the attribution line is shown,
           which .hwf-news-note carries. */
        'P .hs_recaptcha,P .hs-recaptcha{position:absolute!important;width:1px!important;height:1px!important;margin:0!important;padding:0!important;overflow:hidden!important;clip-path:inset(50%)!important;white-space:nowrap}',
        'P .grecaptcha-badge{visibility:hidden!important;box-shadow:none!important}',
        'P .submitted-message{font-size:15px;line-height:1.5;color:#BFEFEF;text-align:center}',
        'P .legal-consent-container,P .hs-richtext{flex-basis:100%;font-size:13px;line-height:1.5;color:#8A8F99}',
        'P iframe.hs-form-iframe{width:100%!important}',
        '@media(max-width:640px){P .hs_submit,P .hs-button{width:100%}}'
      ].join('\n');
      function styleDoc(doc, prefix){
        if(!doc || doc.getElementById('hwf-hs-sheet')) return;
        var s = doc.createElement('style'); s.id = 'hwf-hs-sheet';
        s.textContent = SHEET.split('P').join(prefix);
        (doc.head || doc.documentElement).appendChild(s);
      }
      function say2(msg){
        if(!hint) return;
        hint.textContent = msg || '';
        hint.classList.toggle('is-on', !!msg);
        resync();
      }
      function subs(){
        try{
          var now = Date.now();
          return JSON.parse(localStorage.getItem(KEY) || '[]').filter(function(t){ return now - t < WINDOW_MS; });
        }catch(e){ return []; }
      }
      function record(){ try{ var l = subs(); l.push(Date.now()); localStorage.setItem(KEY, JSON.stringify(l)); }catch(e){} }

      function fail(){
        if(state === 2) return;
        state = 3; clearTimeout(timer);
        act.classList.remove('is-loading', 'is-ready'); act.classList.add('is-failed');
        resync();
      }
      function create(){
        if(!window.hbspt || !window.hbspt.forms || !window.hbspt.forms.create){ fail(); return; }
        window.hbspt.forms.create({
          region: 'na1', portalId: PORTAL, formId: FORM,
          target: '#hwf-hs-news', css: '',
          onFormReady: function(f){
            /* v2 passes a bare FORM (indexable — f[0] is its first input) or a jQuery wrapper */
            var el = (f && f.tagName === 'FORM') ? f : ((f && f.jquery && f[0]) || host.querySelector('form'));
            arm(el);
          },
          onFormSubmitted: function(){ record(); say2(''); resync(); }
        });
      }
      function load(e){
        if(state || (e && e.isTrusted === false)) return;
        state = 1;
        act.classList.add('is-loading');
        styleDoc(document, '#hwf-hs-news');
        timer = setTimeout(fail, 10000);
        if(window.hbspt && window.hbspt.forms){ create(); return; }
        var s = document.querySelector('script[src*="js.hsforms.net/forms/embed/v2.js"]');
        if(!s){
          s = document.createElement('script');
          s.src = SRC; s.async = true; s.charset = 'utf-8';
          (document.head || document.documentElement).appendChild(s);
        }
        s.addEventListener('load', create);
        s.addEventListener('error', fail);
      }

      function arm(form){
        if(!form || !form.querySelector || form.__hwfArmed) return;
        form.__hwfArmed = true;
        state = 2; clearTimeout(timer); readyAt = Date.now(); human = false;
        act.classList.remove('is-loading', 'is-failed');
        act.classList.add('is-ready');
        var doc = form.ownerDocument || document;
        if(doc !== document) styleDoc(doc, 'body');

        var hp = doc.createElement('input');
        hp.type = 'text'; hp.tabIndex = -1;
        hp.name = 'hwf_' + Math.random().toString(36).slice(2, 9);
        hp.setAttribute('autocomplete', 'off');
        hp.setAttribute('aria-hidden', 'true');
        hp.style.cssText = 'position:absolute!important;left:-10000px!important;top:auto!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important;';
        form.appendChild(hp);

        var email = form.querySelector('input[type="email"], input[name="email"]');
        if(email){
          email.setAttribute('autocomplete', 'email');
          email.setAttribute('inputmode', 'email');
          email.setAttribute('spellcheck', 'false');
          email.setAttribute('autocapitalize', 'off');
          if(!email.getAttribute('placeholder')) email.setAttribute('placeholder', 'Email*');
          if(!email.getAttribute('aria-label')) email.setAttribute('aria-label', 'Email');
        }
        ['keydown', 'input', 'paste', 'change'].forEach(function(t){
          form.addEventListener(t, function(e){ if(e.isTrusted && e.target !== hp) human = true; }, true);
        });

        function verdict(){
          if(hp.value) return {silent:true};
          if(Date.now() - readyAt < MIN_MS) return {msg:'Please wait a moment and try again.'};
          if(!human) return {msg:'Type your email address to subscribe.'};
          if(subs().length >= MAX_SUBS) return {msg:'This browser subscribed recently. Try again later.'};
          var v = email ? String(email.value).trim() : '';
          if(v.length > 254 || DISPOSABLE.test(v)) return {msg:'Use a work or personal email address.'};
          var fields = form.querySelectorAll('input[type="text"], input:not([type]), textarea');
          for(var i = 0; i < fields.length; i++){
            if(fields[i] !== hp && LINKY.test(fields[i].value)) return {msg:'Remove links from the form.'};
          }
          return null;
        }
        /* document-level capture runs before any HubSpot / React handler */
        function gate(e){
          var t = e.target;
          if(!t || !form.contains(t)) return;
          if(e.type === 'click' && !(t.closest && t.closest('input[type="submit"], button[type="submit"], .hs-button'))) return;
          var v = verdict();
          if(!v){ say2(''); return; }
          e.preventDefault(); e.stopImmediatePropagation(); e.stopPropagation();
          /* bots that tripped the honeypot get no signal they were caught */
          say2(v.silent ? '' : v.msg);
        }
        doc.addEventListener('click', gate, true);
        doc.addEventListener('submit', gate, true);
        resync();
      }

      ['pointerenter', 'pointerdown', 'focus', 'click'].forEach(function(t){
        tab.addEventListener(t, load, {passive:true});
      });
      if(bar) bar.addEventListener('keydown', load, {passive:true});
    });

    /* ---- copy the phone number ---- */
    guard(function(){
      var btn = $('.hwf-cpy');
      if(!btn) return;
      btn.addEventListener('click', function(){
        var num = btn.getAttribute('data-phone') || '';
        var done = function(){
          btn.classList.add('is-done');
          if(say) say.textContent = 'Phone number copied';
          setTimeout(function(){ btn.classList.remove('is-done'); if(say) say.textContent = ''; }, 1800);
        };
        if(navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(num).then(done, done);
          return;
        }
        var ta = document.createElement('textarea');
        ta.value = num; ta.setAttribute('readonly','');
        ta.style.cssText = 'position:absolute;left:-9999px;top:0;';
        document.body.appendChild(ta);
        ta.select(); ta.setSelectionRange(0, num.length);
        try{ document.execCommand('copy'); }catch(err){}
        document.body.removeChild(ta);
        done();
      });
    });

    /* ---- trust badge: hide the slot if the asset 404s, never a broken box ---- */
    guard(function(){
      var wrap = $('.hwf-soc2');
      if(!wrap) return;
      var img = wrap.querySelector('img');
      if(!img) return;
      var fail = function(){ wrap.style.display = 'none'; };
      if(img.complete && img.naturalWidth === 0){ fail(); return; }
      img.addEventListener('error', fail);
    });

    /* ---- back to top ---- */
    guard(function(){
      var btn = $('.hwf-top-btn');
      if(!btn) return;
      btn.addEventListener('click', function(){
        var behavior = reduce ? 'auto' : 'smooth';
        try{ window.scrollTo({top:0, left:0, behavior:behavior}); }
        catch(err){ window.scrollTo(0,0); }
      });
    });
  }

  function initAll(){ Array.prototype.slice.call(document.querySelectorAll('footer.hwf')).forEach(init); }

  initAll();
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', initAll); }
  window.addEventListener('load', initAll);
  /* Elementor editor re-renders the widget; re-init the fresh DOM */
  window.addEventListener('elementor/frontend/init', initAll);
  if(window.jQuery){ window.jQuery(window).on('elementor/frontend/init', initAll); }
  setTimeout(initAll, 1500);
})();

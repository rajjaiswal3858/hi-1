(function(){
  if(window.__hwtsBooted) return;
  window.__hwtsBooted = true;

  /* ---------- THE LOGO LIST · edit here ----------
     name  : alt text and accessible name
     logo  : SVG url (144x144, #404040)
     tip   : hover text
     href  : case study url (optional; makes the logo a link with a hover card)
     card  : 16:9 image for the hover card (optional, only with href) */
  var HW_TRUST_LOGOS = [
    {"name":"Cox","logo":"/assets/wp-content/uploads/2026/02/COX.svg","tip":"Velocity up almost 300% with bugs cut to near zero. Read the COX story.","href":"/case-studies/helping-deliver-real-time-fleet-insights-with-retrieval-augmented-generation-rag/","card":"/assets/wp-content/uploads/2024/10/cox2m--768x432.jpg"},
    {"name":"Dun & Bradstreet","logo":"/assets/wp-content/uploads/2026/10/db.svg","tip":"Global business data and analytics leader partnering with HatchWorks AI."},
    {"name":"TrueBlue","logo":"/assets/wp-content/uploads/2026/02/Trueblue.svg","tip":"A game-changer for our software development practice. President and CEO.","href":"/case-studies/"},
    {"name":"AT&T","logo":"/assets/wp-content/uploads/2026/02/ATYT.svg","tip":"Global connectivity leader partnering with HatchWorks AI."},
    {"name":"Aero Star","logo":"/assets/wp-content/uploads/2026/02/Aerostar.svg","tip":"An assistant our team actually trusts. AVA keeps knowledge inside their walls.","href":"/case-studies/ai-virtual-assistant-aircraft-maintenance/","card":"/assets/wp-content/uploads/2025/12/aero-thumbnail-768x432.jpg"},
    {"name":"DronePort","logo":"/assets/wp-content/uploads/2026/02/Droneport.svg","tip":"Not scraping the web, pulling real-time ADS-B data. CEO, DronePort Network.","href":"/case-studies/ai-airspace-insights-made-simple/","card":"/assets/wp-content/uploads/2026/09/meerir-new.jpg"},
    {"name":"PwC","logo":"/assets/wp-content/uploads/2026/10/pwc.svg","tip":"Global professional services firm partnering with HatchWorks AI."},
    {"name":"Diebold Nixdorf","logo":"/assets/wp-content/uploads/2026/02/Diebold-Nixdorf.svg","tip":"A true product partner, not just a delivery shop. VP, Global Product Management.","href":"/case-studies/diebold-nixdorf/","card":"/assets/wp-content/uploads/2023/11/diebold-hatchworks-jpg.webp"},
    {"name":"Kemper","logo":"/assets/wp-content/uploads/2026/02/KEMPER.svg","tip":"Insurance leader partnering with HatchWorks AI."},
    {"name":"DesignIntelligence","logo":"/assets/wp-content/uploads/2026/02/Design-Intelligence.svg","tip":"Exactly what you said, in exactly the budget and timeline. Managing Partner.","href":"/case-studies/designintelligence/","card":"/assets/wp-content/uploads/2023/11/design-intelligence-hatchworks-768x432.jpg"},
    {"name":"Vanco","logo":"/assets/wp-content/uploads/2026/02/Vanco.svg","tip":"A strong philosophy and core fundamentals that lift the whole team. CPTO.","href":"/case-studies/from-ad-hoc-ai-to-enterprise-operating-model/","card":"/assets/wp-content/uploads/2026/03/Vanco-GenDD-1-768x432.jpg"},
    {"name":"Xometry","logo":"/assets/wp-content/uploads/2026/10/xometry.svg","tip":"AI-powered manufacturing marketplace partnering with HatchWorks AI."},
    {"name":"Juice Plus+","logo":"/assets/wp-content/uploads/2026/02/Juice-Plus.svg","tip":"Global user research turned into a clear product roadmap. Read the story.","href":"/case-studies/juice-plus/","card":"/assets/wp-content/uploads/2023/11/juice-plus-hatchworks-768x432.jpg"},
    {"name":"Recruitics","logo":"/assets/wp-content/uploads/2026/02/Recruitics.svg","tip":"An AI agent that makes every recruitment dollar work harder. Read the story.","href":"/case-studies/empowering-recruitment-marketing-ai-agents-smarter-hiring/","card":"/assets/wp-content/uploads/2025/03/recruitics-768x432.jpg"},
    {"name":"Anchor Healthcare","logo":"/assets/wp-content/uploads/2026/02/Anchor-Healthcare.svg","tip":"Combined best-in-class tools into something that works, and fast. CTO.","href":"/case-studies/ai-driven-video-platform-improves-healthcare-literacy-at-scale/","card":"/assets/wp-content/uploads/2025/07/anchor-768x432.jpg"},
    {"name":"Integrated Care Solutions","logo":"/assets/wp-content/uploads/2026/02/ICS.svg","tip":"Cost of care down 11% and length of stay down 25%. Read the story.","href":"/case-studies/ics/","card":"/assets/wp-content/uploads/2023/11/ics-hatchworks-768x432.jpg"},
    {"name":"NV5","logo":"/assets/wp-content/uploads/2026/02/NV5.svg","tip":"Engineering and support teams rated fantastic by their Software Engineering Director."},
    {"name":"AdventHealth","logo":"/assets/wp-content/uploads/2026/02/Advent-Health.svg","tip":"Decentralized system delivered ahead of schedule. Director of Program Management."},
    {"name":"Cricket Wireless","logo":"/assets/wp-content/uploads/2026/02/Cricket.svg","tip":"Wireless carrier partnering with HatchWorks AI."},
    {"name":"PeopleScout","logo":"/assets/wp-content/uploads/2026/02/Peoplescout.svg","tip":"50+ nearshore engineers across 5 years accelerating their transformation."},
    {"name":"CEO Coaching International","logo":"/assets/wp-content/uploads/2026/10/ceoci.svg","tip":"An AI coaching assistant taken from proof of concept to production. Read the story.","href":"/case-studies/scaling-ai-coaching-assistant-for-top-ceos/","card":"/assets/wp-content/uploads/2025/07/ceoci-768x432.jpg"},
    {"name":"DIRECTV","logo":"/assets/wp-content/uploads/2026/02/DIRECTV.svg","tip":"Streaming provider scaling AI-driven personalization across millions of subscribers."},
    {"name":"Spring Hills","logo":"/assets/wp-content/uploads/2026/02/Springhills.svg","tip":"90-day readmissions now under 10% for its managed population. Read the story.","href":"/case-studies/springhills/","card":"/assets/wp-content/uploads/2023/11/springhills-hatchworks-768x432.jpg"},
    {"name":"Viasat","logo":"/assets/wp-content/uploads/2026/02/Viasat.svg","tip":"Satellite and connectivity leader modernizing data pipelines for AI."},
    {"name":"Clearway Health","logo":"/assets/wp-content/uploads/2026/02/Clearway-Health.svg","tip":"99% faster client onboarding for specialty pharmacy. Read the story.","href":"/case-studies/proprietary-patient-system-faster-onboarding/","card":"/assets/wp-content/uploads/2025/02/cwh-hw-768x432.jpg"},
    {"name":"World 50","logo":"/assets/wp-content/uploads/2026/10/50.svg","tip":"Executive peer community partnering with HatchWorks AI."},
    {"name":"Tevora","logo":"/assets/wp-content/uploads/2026/02/Tevora.svg","tip":"Cybersecurity and compliance firm partnering with HatchWorks AI."},
    {"name":"Hinge Health","logo":"/assets/wp-content/uploads/2026/02/Hinge-Health.svg","tip":"Digital health platform building AI experiences patients trust."},
    {"name":"Rollins","logo":"/assets/wp-content/uploads/2026/02/Rollins.svg","tip":"Home-services leader applying predictive AI to cut recurring issues."},
    {"name":"Stanley Black and Decker","logo":"/assets/wp-content/uploads/2026/02/Stanley-Black-and-Decker.svg","tip":"Global tools manufacturer modernizing engineering with AI."},
    {"name":"WealthAbility","logo":"/assets/wp-content/uploads/2026/02/Wealthability.svg","tip":"Tax and wealth projections automated for the sales team. Read the story.","href":"/case-studies/scaling-financial-health-with-a-shift-to-digital-sales-and-automation/","card":"/assets/wp-content/uploads/2021/07/wealthability-jpg.webp"},
    {"name":"Charter","logo":"/assets/wp-content/uploads/2026/02/Charter.svg","tip":"Connectivity provider accelerating delivery with nearshore AI engineering teams."},
    {"name":"Kimberly Clark","logo":"/assets/wp-content/uploads/2026/02/Kimberly-Clark.svg","tip":"Global consumer brand applying AI to operations and analytics."},
    {"name":"Carter's","logo":"/assets/wp-content/uploads/2026/02/Carters.svg","tip":"Specialty retailer using AI to personalize and forecast demand."},
    {"name":"Capital Choice","logo":"/assets/wp-content/uploads/2026/02/Capital-Choice.svg","tip":"It was that personal touch that keeps us coming back. SVP.","href":"/case-studies/innovative-platform-next-generation-sales-enablement-financial-wellness/","card":"/assets/wp-content/uploads/2023/11/capital-choice-thumbnail-768x432.jpg"},
    {"name":"Anthem","logo":"/assets/wp-content/uploads/2026/02/Anthem.svg","tip":"Insurance leader putting AI to work across claims and analytics."},
    {"name":"The Honey Baked Ham","logo":"/assets/wp-content/uploads/2026/02/The-Honey-Baked-Ham.svg","tip":"Delivered an easy-to-use, stable enrollment platform ahead of plan. VP of Technology."},
    {"name":"Fleetcor","logo":"/assets/wp-content/uploads/2026/02/Fleetcor.svg","tip":"Payments leader scaling AI across financial operations."}
  ];
  var LABEL = 'Trusted by industry leaders';

  function esc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function itemHTML(l){
    var img = '<img loading="lazy" width="192" height="192" src="' + esc(l.logo) + '" alt="' + esc(l.name) + '" loading="lazy" decoding="async">';
    if(l.href){
      return '<a class="hwts-logo hwts-logo--cs" href="' + esc(l.href) + '"' + (l.card ? ' data-cs-img="' + esc(l.card) + '"' : '') +
        ' data-tip="' + esc(l.tip) + '" aria-label="' + esc(l.name) + ' case study" target="_self">' + img + '</a>';
    }
    return '<span class="hwts-logo" data-tip="' + esc(l.tip) + '">' + img + '</span>';
  }

  var mqReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = !!(mqReduce && mqReduce.matches);
  var canHover = !window.matchMedia || window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------- marquee: same two drive modes as the home strip ---------- */
  function drive(track){
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
    var marquee = track.parentNode;
    var swipe = reduced || !window.matchMedia('(hover:hover)').matches;

    if(swipe){
      marquee.classList.add('is-swipe');
      track.classList.add('is-swipe');
      var half = 0, auto = null, held = false, idle = null;
      var measure = function(){
        half = track.scrollWidth / 2;
        if(half > 2 && marquee.scrollLeft < 1) marquee.scrollLeft = 1;
      };
      measure();
      if(window.ResizeObserver) new ResizeObserver(measure).observe(track);
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
          if(held){ last = now; return; }
          if(!last) last = now;
          var dt = Math.min(now - last, 64);
          last = now;
          marquee.scrollLeft += dt * 0.055;
          wrap();
        };
        var run = function(){ if(!auto){ last = 0; auto = requestAnimationFrame(step); } };
        var halt = function(){ if(auto){ cancelAnimationFrame(auto); auto = null; } };
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
          document.addEventListener('visibilitychange', function(){ if(document.hidden) halt(); else if(onScreen) run(); });
        } else {
          run();
          document.addEventListener('visibilitychange', function(){ if(document.hidden) halt(); else run(); });
        }
      }
    } else {
      var pace = function(){
        var w = track.scrollWidth / 2;
        if(w > 10) track.style.animationDuration = Math.round(w / 100) + 's';
      };
      pace();
      if(window.ResizeObserver) new ResizeObserver(pace).observe(track);
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

  /* ---------- hover card / tooltip (pointer only; every case logo is a real link) ---------- */
  var tip = null, hideTimer = null, overTip = false, overEl = false;
  function ensureTip(){
    if(tip || !canHover) return;
    tip = document.createElement('div');
    tip.className = 'hwts-tip';
    tip.setAttribute('role','presentation');
    tip.setAttribute('aria-hidden','true');
    document.body.appendChild(tip);
    tip.addEventListener('mouseenter', function(){ overTip = true; clearTimeout(hideTimer); });
    tip.addEventListener('mouseleave', function(){ overTip = false; scheduleHide(); });
    window.addEventListener('scroll', function(){
      if(tip.classList.contains('is-on')){ overEl = false; overTip = false; tip.classList.remove('is-on','is-card'); }
    }, {passive:true});
  }
  function scheduleHide(){
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function(){ if(!overTip && !overEl) tip.classList.remove('is-on','is-card'); }, 180);
  }
  function place(x, y){
    var w = tip.offsetWidth || 260, pad = 12;
    var min = w/2 + pad, max = (document.documentElement.clientWidth || window.innerWidth) - w/2 - pad;
    tip.style.left = Math.max(min, Math.min(x, max)) + 'px';
    tip.style.top = Math.max(y, tip.offsetHeight + pad) + 'px';
  }
  function bindTips(scope){
    if(!canHover) return;
    ensureTip();
    scope.querySelectorAll('[data-tip]').forEach(function(el){
      var url = el.getAttribute('href');
      var isCase = el.classList.contains('hwts-logo--cs') && url;
      el.addEventListener('mouseenter', function(e){
        overEl = true;
        clearTimeout(hideTimer);
        if(isCase){
          var img = el.getAttribute('data-cs-img'), html = '';
          if(img){
            html += '<span class="hwts-tip-media"><img src="' + esc(img) + '" alt="" loading="lazy" decoding="async">' +
                    '<span class="hwts-tip-play"><i class="ti ti-arrow-up-right"></i></span></span>';
          }
          html += '<span class="hwts-tip-cta"><span>View case study</span><i class="ti ti-arrow-right"></i></span>';
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
  }

  /* ---------- mount every [data-hw-trust] slot ---------- */
  function mount(slot){
    if(slot.getAttribute('data-hwts-ready')) return;
    slot.setAttribute('data-hwts-ready','1');
    slot.classList.add('hwts');
    var label = slot.getAttribute('data-label') || LABEL;
    if(!slot.getAttribute('aria-label')) slot.setAttribute('aria-label', label);
    slot.setAttribute('role','region');
    slot.innerHTML = '<span class="hwts-label">' + esc(label) + '</span>' +
      '<div class="hwts-marquee"><div class="hwts-track">' + HW_TRUST_LOGOS.map(itemHTML).join('') + '</div></div>';
    var track = slot.querySelector('.hwts-track');
    drive(track);
    bindTips(slot);
  }
  /* slots can live in the page or inside an open shadow root (some page widgets isolate their markup that way) */
  function roots(){
    var out = [document];
    document.querySelectorAll('*').forEach(function(e){ if(e.shadowRoot) out.push(e.shadowRoot); });
    return out;
  }
  function mountAll(){
    var css = document.getElementById('hwts-css');
    roots().forEach(function(root){
      var slots = root.querySelectorAll('[data-hw-trust]');
      if(!slots.length) return;
      if(root !== document && css && !root.querySelector('#hwts-css')) root.appendChild(css.cloneNode(true));
      slots.forEach(mount);
    });
  }
  window.HWTrustStrip = { mountAll: mountAll, logos: HW_TRUST_LOGOS };

  mountAll();
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountAll);
  window.addEventListener('load', mountAll);
  /* Elementor popups and the editor preview render widgets late */
  if(window.jQuery) jQuery(window).on('elementor/frontend/init', function(){
    if(window.elementorFrontend && elementorFrontend.hooks) elementorFrontend.hooks.addAction('frontend/element_ready/html.default', mountAll);
  });
})();

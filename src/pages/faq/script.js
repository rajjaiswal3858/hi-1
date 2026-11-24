(function(){
  "use strict";

  var ICONS = {
    approach: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5L12 2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    services: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/></svg>',
    results:  '<svg viewBox="0 0 24 24" fill="none"><path d="M3 17l5-5 4 4 8-9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 7h6v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    training: '<svg viewBox="0 0 24 24" fill="none"><path d="M2 9l10-5 10 5-10 5L2 9z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    company:  '<svg viewBox="0 0 24 24" fill="none"><path d="M3 21V8l9-5 9 5v13" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 21v-7h6v7" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    trust:    '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  var FAQS = [
    { cat: "approach", catLabel: "Our Approach", q: "What does HatchWorks AI actually do?",
      a: "We help enterprises turn AI into ROI. We automate high-impact work and build AI-native products grounded in your data, using our proprietary Generative-Driven Development (GenDD) methodology." },
    { cat: "approach", catLabel: "Our Approach", q: "What is Generative-Driven Development?",
      a: "GenDD is our proprietary AI-native methodology. A repeatable path from idea to production that blends AI, agents, and engineering to ship software faster with less risk." },
    { cat: "approach", catLabel: "Our Approach", q: "How is HatchWorks AI different from a dev shop?",
      a: "We are not a legacy firm retrofitting AI. AI is our entire business. Built around it, with AI-certified teams, GenDD at every step, and accountability for outcomes, not just deliverables." },
    { cat: "services", catLabel: "Services", q: "What services does HatchWorks AI offer?",
      a: "AI Strategy & Roadmap, AI-Powered Software Development, Data Engineering & Analytics, AI Teams & Talent, and Agentic AI Automation, plus accelerators like RAG, GenIQ, and our AI Solution Accelerator." },
    { cat: "services", catLabel: "Services", q: "Which industries do you work with?",
      a: "Communications & IoT, Technology, Healthcare, Finance, and Retail. We have delivered for enterprises including TrueBlue, Cox, Vanco, DronePort Network, and Aero Star Aviation." },
    { cat: "services", catLabel: "Services", q: "What partnerships do you have?",
      a: "We partner with Anthropic, Databricks, Google Cloud, AWS, and Glean to deliver scalable, unified AI and data solutions for enterprise clients." },
    { cat: "results", catLabel: "Results", q: "How fast can we see results with AI?",
      a: "Our accelerators compress timelines dramatically. Clients have seen 20 days of work delivered in under 5, 99% faster client onboarding, and 47% of sales emails handled by AI. Measurable ROI in weeks." },
    { cat: "results", catLabel: "Results", q: "Can you share real client outcomes?",
      a: "Cox improved velocity by almost 300% while reducing bugs to near zero. Aero Star Aviation built an AI assistant their team actually trusts. DronePort uses real-time ADS-B data, not web scraping." },
    { cat: "training", catLabel: "Training", q: "Do you offer AI training for our team?",
      a: "Yes. AI Training for Teams, Executive AI Training, AI Roadmap & ROI Workshops, and a GenDD Training Workshop, all designed to accelerate adoption with hands-on, role-specific learning." },
    { cat: "training", catLabel: "Training", q: "Do you train non-technical leaders?",
      a: "Absolutely. Our Executive AI Training gives strategic AI guidance for leaders to drive impact and lead with confidence. No tech background required." },
    { cat: "company", catLabel: "Company", q: "Where is HatchWorks AI located?",
      a: "Headquartered in Atlanta, Georgia, with US offices in Chicago and Dallas, and Latin American offices in San Jose (Costa Rica), Medellin (Colombia), and Lima (Peru). 4 countries, 2 continents." },
    { cat: "company", catLabel: "Company", q: "Who founded HatchWorks AI?",
      a: "Brandon Powell founded HatchWorks in 2016 in Atlanta. After ChatGPT launched in late 2022, the company pivoted entirely around generative AI, retraining teams and refocusing offerings." },
    { cat: "company", catLabel: "Company", q: "How do we get started?",
      a: "Start with a conversation. Book a call with our AI experts to explore your goals and challenges. We will build a tailored plan that turns AI into ROI." },
    { cat: "trust", catLabel: "Trust & Security", q: "Who owns the IP and the roadmap?",
      a: "You do. Always. With HatchWorks AI as your guide, you maintain full ownership of your roadmap, your intellectual property, and your outcomes." },
    { cat: "trust", catLabel: "Trust & Security", q: "Are you secure and compliant?",
      a: "Yes. HatchWorks AI is SOC 2 Type 1 compliant. We follow enterprise-grade security practices and protect your data and IP throughout every engagement." }
  ];

  var sky          = document.getElementById("hwai-faq-sky");
  var modal        = document.getElementById("hwai-faq-modal");
  var modalCard    = modal && modal.querySelector(".hwai-faq__modal-card");
  var modalQ       = document.getElementById("hwai-faq-modal-q");
  var modalA       = document.getElementById("hwai-faq-modal-a");
  var modalTagLabel = document.getElementById("hwai-faq-modal-tag-label");
  var modalTagIcon = document.getElementById("hwai-faq-modal-tag-icon");
  var modalCount   = document.getElementById("hwai-faq-modal-count");
  var chips        = document.querySelectorAll(".hwai-faq__chip");
  var searchInput  = document.getElementById("hwai-faq-search");
  var searchClear  = document.getElementById("hwai-faq-search-clear");
  var status       = document.getElementById("hwai-faq-status");
  var emptyState   = document.getElementById("hwai-faq-empty");
  var resetBtn     = document.getElementById("hwai-faq-reset");

  if (!sky || !modal) return;

  var currentIdx = 0;
  var currentFilter = "all";
  var currentQuery = "";

  function escHtml(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
    });
  }

  function highlight(text, query){
    if (!query) return escHtml(text);
    var escaped = escHtml(text);
    var pattern = query.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    return escaped.replace(new RegExp("(" + pattern + ")", "ig"), "<mark>$1</mark>");
  }

  function renderOrbs(){
    var html = "";
    FAQS.forEach(function(item, i){
      var delay = (i % 8) * 0.05;
      html += '<div class="hwai-faq__orb" data-cat="' + item.cat + '" data-idx="' + i + '" style="--d:' + delay + 's" role="button" tabindex="0" aria-label="' + escHtml(item.q) + '">'
            +   '<div>'
            +     '<div class="hwai-faq__orb-head">'
            +       '<span class="hwai-faq__orb-icon" aria-hidden="true">' + ICONS[item.cat] + '</span>'
            +       '<span class="hwai-faq__orb-cat">' + escHtml(item.catLabel) + '</span>'
            +     '</div>'
            +     '<h3 class="hwai-faq__orb-q">' + escHtml(item.q) + '</h3>'
            +   '</div>'
            +   '<span class="hwai-faq__orb-cue">Tap to reveal '
            +     '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            +   '</span>'
            + '</div>';
    });
    sky.innerHTML = html;

    sky.querySelectorAll(".hwai-faq__orb").forEach(function(orb){
      orb.addEventListener("click", function(){
        openModal(parseInt(orb.getAttribute("data-idx"), 10));
      });
      orb.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(parseInt(orb.getAttribute("data-idx"), 10));
        }
      });
    });
  }

  function applyFilters(){
    var query = currentQuery.trim().toLowerCase();
    var visibleCount = 0;

    sky.querySelectorAll(".hwai-faq__orb").forEach(function(orb){
      var idx = parseInt(orb.getAttribute("data-idx"), 10);
      var item = FAQS[idx];
      var matchCat = (currentFilter === "all" || item.cat === currentFilter);
      var matchQ = !query
        || item.q.toLowerCase().indexOf(query) !== -1
        || item.a.toLowerCase().indexOf(query) !== -1
        || item.catLabel.toLowerCase().indexOf(query) !== -1;

      var visible = matchCat && matchQ;
      orb.classList.toggle("is-hidden", !visible);
      if (visible) {
        visibleCount++;
        var qEl = orb.querySelector(".hwai-faq__orb-q");
        if (qEl) qEl.innerHTML = highlight(item.q, query);
      }
    });

    if (visibleCount === 0) {
      emptyState.hidden = false;
      sky.style.display = "none";
      status.innerHTML = "";
    } else {
      emptyState.hidden = true;
      sky.style.display = "";
      var label;
      if (query) {
        label = '<strong>' + visibleCount + '</strong> match' + (visibleCount === 1 ? '' : 'es') + ' for &ldquo;' + escHtml(query) + '&rdquo;';
      } else if (currentFilter !== "all") {
        label = '<strong>' + visibleCount + '</strong> question' + (visibleCount === 1 ? '' : 's') + ' in this category';
      } else {
        label = '<strong>' + visibleCount + '</strong> questions total';
      }
      status.innerHTML = label;
    }

    chips.forEach(function(c){
      c.classList.toggle("is-active", c.getAttribute("data-cat") === currentFilter);
    });
  }

  function getVisibleIndices(){
    var query = currentQuery.trim().toLowerCase();
    return FAQS.map(function(f, i){ return i; }).filter(function(i){
      var item = FAQS[i];
      var matchCat = (currentFilter === "all" || item.cat === currentFilter);
      var matchQ = !query
        || item.q.toLowerCase().indexOf(query) !== -1
        || item.a.toLowerCase().indexOf(query) !== -1
        || item.catLabel.toLowerCase().indexOf(query) !== -1;
      return matchCat && matchQ;
    });
  }

  function openModal(idx){
    currentIdx = idx;
    var f = FAQS[idx];
    modalCard.setAttribute("data-cat", f.cat);
    modalTagLabel.textContent = f.catLabel;
    modalTagIcon.innerHTML = ICONS[f.cat] || "";
    modalQ.textContent = f.q;
    modalA.textContent = f.a;

    var visible = getVisibleIndices();
    var pos = visible.indexOf(idx);
    modalCount.textContent = pos !== -1 ? (pos + 1) + " / " + visible.length : "";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal(){
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function navigate(direction){
    var visible = getVisibleIndices();
    if (!visible.length) return;
    var pos = visible.indexOf(currentIdx);
    if (pos === -1) pos = 0;
    pos = (pos + direction + visible.length) % visible.length;
    openModal(visible[pos]);
  }

  chips.forEach(function(chip){
    chip.addEventListener("click", function(){
      currentFilter = chip.getAttribute("data-cat");
      applyFilters();
    });
  });

  var searchTimer;
  searchInput.addEventListener("input", function(){
    currentQuery = searchInput.value;
    searchClear.hidden = !currentQuery;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilters, 80);
  });
  searchInput.addEventListener("keydown", function(e){
    if (e.key === "Escape") {
      searchInput.value = "";
      currentQuery = "";
      searchClear.hidden = true;
      applyFilters();
    }
  });
  searchClear.addEventListener("click", function(){
    searchInput.value = "";
    currentQuery = "";
    searchClear.hidden = true;
    applyFilters();
    searchInput.focus();
  });
  resetBtn.addEventListener("click", function(){
    searchInput.value = "";
    currentQuery = "";
    currentFilter = "all";
    searchClear.hidden = true;
    applyFilters();
  });

  modal.querySelectorAll("[data-close]").forEach(function(el){
    el.addEventListener("click", closeModal);
  });
  modal.querySelector(".hwai-faq__modal-prev").addEventListener("click", function(){ navigate(-1); });
  modal.querySelector(".hwai-faq__modal-next").addEventListener("click", function(){ navigate(1); });

  document.addEventListener("keydown", function(e){
    if (!modal.classList.contains("is-open")) return;
    if (e.key === "Escape")    closeModal();
    if (e.key === "ArrowRight") navigate(1);
    if (e.key === "ArrowLeft")  navigate(-1);
  });

  renderOrbs();
  applyFilters();
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":30507,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

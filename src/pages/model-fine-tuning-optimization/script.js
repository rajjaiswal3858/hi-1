(function(){
  /* Raise this if a sticky header covers the section an anchor jumps to. */
  var NAV_OFFSET = 96;

  

  var roots = document.querySelectorAll(".hw-model");
  var root = roots[roots.length - 1];
  if (!root || root.getAttribute("data-hw-init") === "1") return;
  root.setAttribute("data-hw-init", "1");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var TERMS = {
    "fine-tuning": { label: "Fine-tuning", short: "Training an existing model further on your own data.", body: ["Fine-tuning takes a capable base model and continues training it on examples from your business \u2014 your documents, your terminology, your workflows, the way your people actually phrase things.", "The model keeps its general ability and gains depth on your domain. It is the difference between a strong generalist and someone who already knows your business."], related: ["open-model", "deployment", "benchmark"] },
    "open-model": { label: "Open model", short: "A model whose weights you can run yourself.", body: ["Open models are published so they can be downloaded, tuned, and hosted in your own environment rather than called only as a vendor API.", "That is what makes deeper specialization and tighter control over data and deployment possible."], related: ["fine-tuning", "frontier", "deployment"] },
    frontier: { label: "Frontier model", short: "The most capable general-purpose models available.", body: ["Frontier models are the newest, largest models from labs such as Anthropic, OpenAI, and Google. They set the ceiling on what a system can reason about.", "They are also the most expensive per token, which is why sending every task to one is rarely the right economics."], related: ["token", "routing", "multi-model"] },
    token: { label: "Token", short: "The unit models read, write, and charge by.", body: ["Text is split into tokens \u2014 roughly a word or a fragment of one. Every prompt, document, and response is counted in tokens.", "Because pricing and speed are both per token, prompt design, context size, and model choice show up directly on the bill."], related: ["frontier", "routing", "latency"] },
    routing: { label: "Model routing", short: "Sending each task to the model that fits it.", body: ["A router inspects the task \u2014 its complexity, its accuracy bar, its latency budget \u2014 and picks the model to handle it.", "Routine work goes to a small or specialized model. The hardest steps escalate to a higher-capability model, so the expensive option is used where it changes the answer."], related: ["multi-model", "orchestration", "token"] },
    orchestration: { label: "Orchestration", short: "Coordinating several models into one system.", body: ["Orchestration is the layer that decides the order of operations: which model runs, what context it receives, when to retry, and when to hand off.", "It is how a set of models behaves like one dependable system instead of a collection of separate calls."], related: ["routing", "multi-model", "deployment"] },
    "multi-model": { label: "Multi-model architecture", short: "More than one model behind the same product.", body: ["A multi-model architecture treats models as interchangeable components chosen per task, rather than standardizing on one for everything.", "It also reduces exposure to any single vendor's pricing, availability, and release cycle."], related: ["routing", "model-portfolio", "frontier"] },
    "model-portfolio": { label: "Model portfolio", short: "The full set of models your business runs on.", body: ["Every model in production, what it is used for, what it costs, and how well it performs \u2014 managed as one portfolio rather than a series of independent choices.", "Portfolio thinking is what makes quality, cost, and speed comparable across use cases."], related: ["model-sprawl", "multi-model", "benchmark"] },
    "model-sprawl": { label: "Model sprawl", short: "Many models in production, no strategy.", body: ["Sprawl is what accumulates when each team picks a model on its own: duplicated capability, inconsistent quality, unclear ownership, and costs no one can explain.", "The fix is not fewer models. It is a deliberate portfolio with reasons behind each choice."], related: ["model-portfolio", "benchmark", "orchestration"] },
    benchmark: { label: "Benchmarking", short: "Measuring models on your work, not a leaderboard.", body: ["A useful benchmark runs candidate models against your real tasks and scores what you care about: accuracy on your data, latency, and cost per outcome.", "Public leaderboards rank general ability. They cannot tell you which model is right for your use case."], related: ["model-portfolio", "latency", "token"] },
    latency: { label: "Latency", short: "How long one response takes.", body: ["Latency is the wait a user or system experiences on a single request. Larger models generally take longer.", "Interactive products live or die on it, which is why the fastest acceptable model often beats the most capable one."], related: ["throughput", "routing", "token"] },
    throughput: { label: "Throughput", short: "How much work the system handles at once.", body: ["Throughput is volume over time \u2014 requests or tokens per second across the whole workload, not the speed of one call.", "High-volume pipelines are usually a throughput problem, and the model and infrastructure choices that solve it differ from the ones that reduce latency."], related: ["latency", "deployment", "multi-model"] },
    deployment: { label: "Deployment", short: "Where the model runs and who controls it.", body: ["Deployment covers the hosting decision: a vendor API, your cloud account, a private region, or your own hardware.", "It determines where data travels, what you can audit, and which compliance requirements you can actually satisfy."], related: ["open-model", "throughput", "orchestration"] },
    "pure-play": { label: "Pure-play AI partner", short: "AI and data work is the whole business.", body: ["A pure-play partner does AI and data only. There is no general consulting or staffing practice for the work to fall back into.", "The practical effect: the same approach and the same practitioners carry across every engagement."], related: ["fine-tuning", "model-portfolio"] }
  };
  var ORDER = ["fine-tuning", "open-model", "frontier", "model-portfolio", "model-sprawl", "routing", "orchestration", "multi-model", "token", "benchmark", "latency", "throughput", "deployment", "pure-play"];

  /* hero background video */
  var video = root.querySelector("video");
  if (video) {
    video.muted = true; video.defaultMuted = true; video.loop = true; video.playsInline = true;
    if (reduced) video.pause();
    else { var pr = video.play(); if (pr && pr.catch) pr.catch(function(){}); }
  }

  /* fan: hide the outermost cards on narrow screens */
  (function(){
    var fan = root.querySelector("[data-fan]");
    if (!fan) return;
    /* Drop outer cards until the whole spread fits its own box. Measured, not
       guessed, so it is correct at every width including odd tablet sizes. */
    var wrap = fan.lastElementChild;
    function setHidden(n){
      for (var i = 0; i < wrap.children.length; i++){
        var c = wrap.children[i], lvl = Number(c.getAttribute("data-edge") || 0);
        c.style.display = (lvl && lvl <= n) ? "none" : "grid";
      }
    }
    function fits(){
      var wr = wrap.getBoundingClientRect();
      for (var i = 0; i < wrap.children.length; i++){
        var c = wrap.children[i];
        if (c.style.display === "none") continue;
        var b = c.getBoundingClientRect();
        if (b.left < wr.left - 1 || b.right > wr.right + 1) return false;
      }
      return true;
    }
    function fitEdges(){
      for (var n = 0; n <= 2; n++){ setHidden(n); if (fits()) break; }
    }
    fitEdges();
    var fitQueued = false;
    window.addEventListener("resize", function(){
      if (fitQueued) return;
      fitQueued = true;
      window.requestAnimationFrame(function(){ fitQueued = false; fitEdges(); });
    }, { passive: true });
  })();

  /* anchor jumps, offset for a sticky header */
  function jump(id){
    var target = document.getElementById(id);
    if (!target) return;
    var y = Math.max(0, target.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET);
    var from = window.pageYOffset;
    if (reduced || Math.abs(y - from) < 2) { window.scrollTo(0, y); return; }
    var dur = Math.min(560, 220 + Math.abs(y - from) * 0.12);
    var t0 = performance.now();
    (function step(now){
      var p = Math.min(1, ((now || performance.now()) - t0) / dur);
      window.scrollTo(0, from + (y - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })();
  }

  /* plain-language glossary, rendered at body level so no theme transform can clip it */
  var dock = null, dockOpenedAt = 0;
  function el(tag, style, html){
    var n = document.createElement(tag);
    if (style) n.setAttribute("style", style);
    if (html != null) n.innerHTML = html;
    return n;
  }
  function closeDock(){ if (dock) { dock.remove(); dock = null; } }
  function openDock(view, id){
    closeDock();
    dockOpenedAt = Date.now();
    dock = el("div", "position:fixed;inset:0;z-index:99999");
    dock.id = "hw-glossary";
    var scrim = el("div", "position:absolute;inset:0;background:rgba(0,0,0,.6)");
    scrim.addEventListener("click", closeDock);
    var panel = el("aside", "position:absolute;top:0;right:0;bottom:0;width:min(440px,100vw);background:#14181f;border-left:1px solid rgba(255,255,255,.07);overflow-y:auto");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    var head = el("div", "position:sticky;top:0;display:flex;align-items:center;gap:16px;padding:20px 24px;background:#14181f;border-bottom:1px solid rgba(255,255,255,.07)");
    head.appendChild(el("span", "font-family:'Space Grotesk',sans-serif;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#3abdbc", "Plain-language glossary"));
    var x = el("button", "margin-left:auto;width:44px;height:44px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#c9ccd3;font-size:16px;cursor:pointer", "&#10005;");
    x.setAttribute("aria-label", "Close glossary");
    x.addEventListener("click", closeDock);
    head.appendChild(x);
    panel.appendChild(head);
    var body = el("div", "padding:26px 24px 40px");
    if (view === "term" && TERMS[id]) {
      var term = TERMS[id];
      var back = el("button", "display:inline-flex;align-items:center;gap:8px;min-height:36px;color:#8a8f99;font-size:13px;cursor:pointer", "&#8592; All terms");
      back.addEventListener("click", function(){ openDock("index"); });
      body.appendChild(back);
      body.appendChild(el("h3", "margin-top:18px;font-size:30px;font-weight:700;letter-spacing:-.01em;line-height:1.15;color:#fff", term.label));
      body.appendChild(el("p", "margin-top:10px;font-size:19px;line-height:1.4;color:#bfefef", term.short));
      body.appendChild(el("div", "height:1px;background:rgba(255,255,255,.07);margin:24px 0"));
      term.body.forEach(function(par){ body.appendChild(el("p", "margin-bottom:14px;font-size:16px;line-height:1.7;color:#c9ccd3", par)); });
      var rel = (term.related || []).filter(function(r){ return TERMS[r]; });
      if (rel.length) {
        body.appendChild(el("div", "margin-top:28px;margin-bottom:12px;font-family:'Space Grotesk',sans-serif;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8a8f99", "Related"));
        var wrap = el("div", "display:flex;flex-wrap:wrap;gap:8px");
        rel.forEach(function(r){
          var chip = el("button", "min-height:36px;padding:8px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);color:#c9ccd3;font-size:13px;cursor:pointer", TERMS[r].label);
          chip.addEventListener("click", function(){ openDock("term", r); });
          wrap.appendChild(chip);
        });
        body.appendChild(wrap);
      }
    } else {
      body.appendChild(el("p", "margin-bottom:20px;font-size:14px;line-height:1.5;color:#8a8f99", "Every term used on this page, in one place. Select one for the plain-language definition."));
      ORDER.filter(function(k){ return TERMS[k]; }).forEach(function(k){
        var b = el("button", "width:100%;display:block;text-align:left;padding:16px 4px;border-top:1px solid rgba(255,255,255,.07);cursor:pointer",
          '<span style="display:block;font-size:16px;font-weight:700;color:#fff">' + TERMS[k].label + '</span><span style="display:block;padding-top:4px;font-size:14px;color:#8a8f99">' + TERMS[k].short + '</span>');
        b.addEventListener("click", function(){ openDock("term", k); });
        body.appendChild(b);
      });
    }
    panel.appendChild(body);
    dock.appendChild(scrim);
    dock.appendChild(panel);
    document.body.appendChild(dock);
  }
  /* no scroll lock (themes fight it): scrolling simply dismisses the panel */
  window.addEventListener("scroll", function(){
    if (dock && Date.now() - dockOpenedAt > 400) closeDock();
  }, { passive: true });

  root.addEventListener("click", function(e){
    var term = e.target.closest("[data-term]");
    if (term) { openDock("term", term.getAttribute("data-term")); return; }
    if (e.target.closest("[data-dock-index]")) { openDock("index"); return; }
    var j = e.target.closest("[data-jump]");
    if (j) { e.preventDefault(); jump(j.getAttribute("data-jump")); }
  });
  root.addEventListener("keydown", function(e){
    if (e.key !== "Enter" && e.key !== " ") return;
    var term = e.target.closest && e.target.closest("[data-term]");
    if (term && e.target.tagName !== "BUTTON") { e.preventDefault(); openDock("term", term.getAttribute("data-term")); }
  });
  window.addEventListener("keydown", function(e){ if (e.key === "Escape") closeDock(); });
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":36601,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

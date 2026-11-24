(function(){
    var root = document.getElementById("hwtc-root");
    if(!root) return;
    var tablist = root.querySelector(".hwtc-tabs");
    var tabs = Array.prototype.slice.call(root.querySelectorAll(".hwtc-tab"));
    var cellBtns = Array.prototype.slice.call(root.querySelectorAll(".hwtc-cell-btn"));

    /* Collapse every cell now that JS is running. Without JS they stay open and readable. */
    cellBtns.forEach(function(btn){
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      btn.setAttribute("aria-expanded","false");
      if(panel) panel.hidden = true;
      btn.addEventListener("click", function(){
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        var sign = btn.querySelector(".hwtc-sign");
        if(sign) sign.textContent = open ? "+" : "−";
        if(panel) panel.hidden = open;
      });
    });

    /* Filter-button group, not a tablist: the default view shows all three
       columns at once, which no single tabpanel can represent honestly. */
    function selectView(tab){
      tabs.forEach(function(t){
        t.setAttribute("aria-pressed", t === tab ? "true" : "false");
      });
      root.setAttribute("data-view", tab.getAttribute("data-view"));
    }

    tabs.forEach(function(tab){
      tab.addEventListener("click", function(){ selectView(tab); });
    });

    root.setAttribute("data-view","all");
    root.classList.add("hwtc-ready");
    if(tablist) tablist.setAttribute("aria-label","Filter the comparison by concept");
  })();
;
(function(){
    var root = document.getElementById("hwsel-root");
    if(!root) return;
    var stage = document.getElementById("hwsel-stage");
    var stepEl = document.getElementById("hwsel-step");
    var trailEl = document.getElementById("hwsel-trail");
    var backBtn = document.getElementById("hwsel-back");
    var restartBtn = document.getElementById("hwsel-restart");

    var FT_WARNING = "<strong>Platform risk, dated August 2026.</strong> OpenAI announced on May 7, 2026 that it is winding down self-serve fine-tuning. Organizations without recent fine-tuning activity lost the ability to create new jobs on July 2, 2026, and all remaining customers lose it on January 6, 2027. Build on an open-weight model or a provider with no announced end date, and keep your training data and adapters portable.";

    var OUTCOMES = {
      prompting: {
        name: "Start with better prompting and structured outputs",
        why: "You cannot supervise what you cannot describe. With no labelled examples and no automatic grader, any training run is optimising against a target you have not defined, and you will not be able to tell afterwards whether it helped. Tighten the instructions, add few-shot examples, force a schema with structured outputs, and use the failures you collect as the beginning of the evaluation set that every later option depends on. This resolves more cases than teams expect, and it costs nothing but attention.",
        cost: "Free, beyond engineering time. Model choice matters more than provider choice here: OpenAI's list prices span $2.50/$15.00 per million tokens for gpt-5.6-sol down to $0.10/$0.60 for gpt-5.6-luna.",
        costSrc: "Source: OpenAI pricing, accessed August 2026.",
        href: "/",
        cta: "See AI training for teams",
        warn: null
      },
      rag: {
        name: "Retrieval-augmented generation (RAG)",
        why: "Your gap is information, not behaviour, and training is the wrong instrument for information. A fine-tuned model still will not know yesterday's price change, and re-training every time a document changes is neither affordable nor auditable. A retrieval pipeline keeps the source of truth outside the model, updates the moment your content does, and lets you show a user which document an answer came from. It is also the cheapest of the real options, because it is inference plus a lookup.",
        cost: "Inference-priced, with cached input discounted 90% on Vertex AI — Gemini 3.1 Flash-Lite lists at $0.25/$1.50 per million tokens, Gemini 3.1 Pro Preview at $2/$12.",
        costSrc: "Source: Google Cloud Vertex AI generative AI pricing, accessed August 2026.",
        href: "/rag/",
        cta: "See our RAG practice",
        warn: null
      },
      lora: {
        name: "LoRA fine-tuning",
        why: "You have labelled examples of the behaviour you want and the gap is consistency rather than knowledge, which is exactly the case fine-tuning was built for. LoRA freezes the original weights and trains a small adapter alongside them — about 16% of the model in the walkthrough above — so the job fits inside a modest budget and stays reversible. Hold out a test set before you start, because a tuned model that sounds better and scores worse is a real and common outcome. Budget most of your effort for the dataset, not the training run.",
        cost: "From $4 per job on the standard bands. Together AI lists LoRA supervised fine-tuning at $0.48 per million training tokens up to 16B parameters, $1.50 for 17–69B and $2.90 for 70–100B, with a $4 job minimum. Specialised models carry higher minimums: $20 for DeepSeek LoRA SFT, $60 for GLM-5.",
        costSrc: "Source: Together AI pricing, accessed August 2026.",
        href: "/data-modernization/",
        cta: "See data engineering and analytics",
        warn: FT_WARNING
      },
      distillation: {
        name: "Distillation, ideally on-policy",
        why: "A large model already produces the quality you need and your constraint is the recurring cost or latency of serving it, which is the precise problem distillation solves. Train a small student to imitate the teacher and you keep most of the capability at a fraction of the per-request bill — and since inference is the expense that repeats forever, that is where the money actually is. On-policy variants, where the student generates and the teacher grades token by token, are currently the strongest price-performance result in the category. Confirm your licence permits distilling from that teacher before you plan a roadmap on it; open-weight teachers are the safer foundation.",
        cost: "Roughly 1,800 GPU hours against reinforcement learning's 17,920 to beat it on AIME'24 (74.4% against 67.6%), which the source calls one-tenth the cost of RL. Measured against off-policy distillation instead, the saving is 9x to 30x.",
        costSrc: "Source: Thinking Machines Lab, \"On-Policy Distillation\", October 2025.",
        href: "/ai-native-product-development-services/",
        cta: "See AI-powered software development",
        warn: null
      },
      rft: {
        name: "Reinforcement fine-tuning (RFT) — with eyes open",
        why: "You can score a good answer but cannot write one down, and that is the narrow case where RFT genuinely earns its place. Be clear about the odds: in the only useful public head-to-head, RFT won once out of three tasks, cost 100x to 700x more than supervised fine-tuning every time, and actively degraded performance on customer service. It also inherits every failure mode of optimising against a proxy, reward hacking first among them, so your grader becomes the thing most likely to break. Pilot it against an SFT baseline on the same held-out set before it enters a roadmap.",
        cost: "$100 per hour of active training on OpenAI, grader tokens billed separately. TensorZero measured $65.07 against SFT's $0.09 on data extraction, $168.57 against $0.70 on agentic coding, and $201.85 against $1.80 on customer service.",
        costSrc: "Sources: OpenAI RFT billing guide, accessed August 2026; TensorZero, September 2025.",
        href: "/ai-strategy-roadmap/",
        cta: "Pressure-test this with AI Strategy &amp; Roadmap",
        warn: FT_WARNING
      }
    };

    var QUESTIONS = {
      q1: {
        n: 1,
        q: "Is the gap knowledge or behaviour?",
        opts: [
          { label: "Knowledge — the model lacks information", hint: "It does not know your documents, prices, policies or anything that changed recently.", answer: "Knowledge gap", go: "rag" },
          { label: "Behaviour — it knows enough but acts wrongly", hint: "Wrong format, wrong tone, wrong reasoning style, or a task it keeps fumbling.", answer: "Behaviour gap", go: "q2" }
        ]
      },
      q2: {
        n: 2,
        q: "Do labelled correct outputs exist?",
        opts: [
          { label: "Yes — we have, or can produce, examples of the right answer", hint: "Hundreds to tens of thousands of input/output pairs.", answer: "Labelled examples available", go: "q3" },
          { label: "No, but we can score an answer automatically", hint: "We can write a grader even though we cannot write the answer.", answer: "No labels, but scoreable", go: "rft" },
          { label: "No, and we cannot score it either", hint: "\"Good\" is still a judgement call nobody has written down.", answer: "No labels, not scoreable", go: "prompting" }
        ]
      },
      q3: {
        n: 3,
        q: "What is the binding constraint?",
        opts: [
          { label: "Quality and consistency of the behaviour", hint: "The best model available still gets it wrong too often.", answer: "Constraint is quality", go: "lora" },
          { label: "Cost or latency — a big model already does the job", hint: "Quality is fine; the bill or the response time is not.", answer: "Constraint is cost or latency", go: "q4" }
        ]
      },
      q4: {
        n: 4,
        q: "Do you have a teacher model you are permitted to distil from?",
        opts: [
          { label: "Yes — open-weight, or licensed for distillation", hint: "We have checked the terms, not assumed them.", answer: "Permitted teacher available", go: "distillation" },
          { label: "No, or the terms are unclear", hint: "Provider terms restrict it, or nobody has confirmed.", answer: "No permitted teacher", go: "lora" }
        ]
      }
    };

    var path = [];

    function esc(s){
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function renderTrail(){
      trailEl.innerHTML = path.map(function(p){
        return "<li>" + esc(p.answer) + "</li>";
      }).join("");
    }

    function renderQuestion(key){
      var q = QUESTIONS[key];
      stepEl.textContent = "Question " + q.n + " of 4";
      var html = "<p class=\"hwsel-q\" id=\"hwsel-q-" + key + "\">" + q.q + "</p>";
      html += "<div class=\"hwsel-opts\" role=\"group\" aria-labelledby=\"hwsel-q-" + key + "\">";
      q.opts.forEach(function(o, i){
        html += "<button class=\"hwsel-opt\" type=\"button\" data-i=\"" + i + "\">" +
                "<span class=\"hwsel-opt-label\">" + o.label + "</span>" +
                "<span class=\"hwsel-opt-hint\">" + o.hint + "</span></button>";
      });
      html += "</div>";
      stage.innerHTML = html;
      Array.prototype.forEach.call(stage.querySelectorAll(".hwsel-opt"), function(btn){
        btn.addEventListener("click", function(){
          var o = q.opts[parseInt(btn.getAttribute("data-i"), 10)];
          path.push({ key: key, answer: o.answer });
          go(o.go, true);
        });
      });
      backBtn.disabled = path.length === 0;
      var first = stage.querySelector(".hwsel-opt");
      if(first && path.length > 0) first.focus();
    }

    function renderOutcome(key){
      var o = OUTCOMES[key];
      stepEl.textContent = "Recommendation";
      var html = "<p class=\"hwsel-badge\">Your recommendation</p>";
      html += "<p class=\"hwsel-rec\">" + o.name + "</p>";
      html += "<p class=\"hwsel-why\">" + o.why + "</p>";
      html += "<p class=\"hwsel-cost\"><strong>Indicative 2026 cost:</strong> " + o.cost + "<span>" + o.costSrc + "</span></p>";
      if(o.warn) html += "<p class=\"hwsel-warn\">" + o.warn + "</p>";
      html += "<p><a class=\"hwsel-cta\" href=\"" + o.href + "\">" + o.cta + "</a></p>";
      stage.innerHTML = html;
      backBtn.disabled = path.length === 0;
    }

    function go(key, moveFocus){
      renderTrail();
      if(QUESTIONS[key]) renderQuestion(key);
      else renderOutcome(key);
      if(moveFocus && OUTCOMES[key]){
        var rec = stage.querySelector(".hwsel-rec");
        if(rec){ rec.setAttribute("tabindex","-1"); rec.focus(); }
      }
    }

    backBtn.addEventListener("click", function(){
      if(path.length === 0) return;
      var last = path.pop();
      go(last.key, false);
      var first = stage.querySelector(".hwsel-opt");
      if(first) first.focus();
    });

    restartBtn.addEventListener("click", function(){
      path = [];
      go("q1", false);
      var first = stage.querySelector(".hwsel-opt");
      if(first) first.focus();
    });

    root.classList.add("hwsel-ready");
    go("q1", false);
  })();
;
(function(){
    var root = document.getElementById("hwpit-root");
    if(!root) return;
    var btns = Array.prototype.slice.call(root.querySelectorAll(".hwpit-btn"));
    var toggleAll = document.getElementById("hwpit-toggle-all");

    function setRow(btn, open){
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      var chev = btn.querySelector(".hwpit-chev");
      if(chev) chev.textContent = open ? "−" : "+";
      if(panel) panel.hidden = !open;
    }

    function syncToggleAll(){
      var anyClosed = btns.some(function(b){ return b.getAttribute("aria-expanded") !== "true"; });
      toggleAll.setAttribute("aria-expanded", anyClosed ? "false" : "true");
      toggleAll.textContent = anyClosed ? "Expand all" : "Collapse all";
    }

    /* Collapsed by default, but only once JS confirms it can reopen them. */
    btns.forEach(function(btn, i){
      setRow(btn, false);
      btn.addEventListener("click", function(){
        setRow(btn, btn.getAttribute("aria-expanded") !== "true");
        syncToggleAll();
      });
      btn.addEventListener("keydown", function(e){
        var next = null;
        if(e.key === "ArrowDown") next = btns[(i + 1) % btns.length];
        else if(e.key === "ArrowUp") next = btns[(i - 1 + btns.length) % btns.length];
        else if(e.key === "Home") next = btns[0];
        else if(e.key === "End") next = btns[btns.length - 1];
        if(next){ e.preventDefault(); next.focus(); }
      });
    });

    toggleAll.addEventListener("click", function(){
      var open = toggleAll.getAttribute("aria-expanded") !== "true";
      btns.forEach(function(b){ setRow(b, open); });
      syncToggleAll();
    });

    root.classList.add("hwpit-ready");
    syncToggleAll();
  })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":31999,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":6927,"estimatedReadTimeSeconds":1746,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

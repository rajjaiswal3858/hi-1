(function() {
      var root = document.currentScript.closest('.hw-gendd-score');
      if (!root) return;

      var states = {
        traditional: {
          cost:    { inPct: 30, outPct: 70 },
          quality: { inPct: 75, outPct: 25 },
          speed:   { inPct: 35, outPct: 65 },
          scale:   { inPct: 25, outPct: 75 },
          talent:  { inPct: 30, outPct: 70 },
          takeaway: "Even before AI-native methodology entered the picture, outsourcing held a meaningful lead on cost, speed, scalability, and talent access. In-house held its advantage on quality and control."
        },
        ai: {
          cost:    { inPct: 20, outPct: 80 },
          quality: { inPct: 60, outPct: 40 },
          speed:   { inPct: 20, outPct: 80 },
          scale:   { inPct: 15, outPct: 85 },
          talent:  { inPct: 20, outPct: 80 },
          takeaway: "AI-native methodology widens outsourcing's lead on cost, speed, scalability, and talent, while narrowing in-house's lead on quality. The hybrid model that captures both is the dominant pattern in 2026."
        }
      };

      var reasons = {
        traditional: {
          cost: "Outsourcing's cost advantage comes from labor arbitrage and the elimination of recruitment, benefits, and overhead. The hourly rate is the obvious part; the bigger savings come from what you don't have to spend on hiring infrastructure.",
          quality: "Direct oversight produces tighter quality control. In-house teams adhere to one set of standards, attend one set of code reviews, and ship under one definition of done. Outsourcing has historically been uneven on engineering discipline across vendors.",
          speed: "Outsourcing partners can have teams ready to start in weeks, where in-house hiring takes months. Specialized focus on your project, without the context-switching that comes with internal teams juggling multiple priorities.",
          scale: "Outsourced teams scale up or down based on project demand. In-house scaling requires hiring (slow) or layoffs (politically costly and slow). The flexibility difference is structural.",
          talent: "Outsourcing opens a global talent pool. In-house is constrained to your local labor market, which is competitive almost everywhere. 53% of companies report struggling to find in-house developers with the skills they need."
        },
        ai: {
          cost: "<span class=\"hw-gendd-score-row-reason-strong\">AI-native widens this gap.</span> The labor arbitrage is unchanged, but the productivity multiplier from AI-native methodology compounds on top of it. Same per-engineer rate buys 2-3x the output of a traditional outsourced engineer.",
          quality: "<span class=\"hw-gendd-score-row-reason-strong\">AI-native narrows this gap.</span> A governed methodology (Plan/Confirm gates, Context Pack discipline, structured AI use) imposes engineering rigor that historically was where outsourcing fell short. In-house still wins, but by less.",
          speed: "<span class=\"hw-gendd-score-row-reason-strong\">AI-native widens this gap.</span> Outsourcing's existing speed advantage compounds with methodology that compresses the time between intent and shipped code. An AI-native nearshore pod can be productive in week 2; in-house AI capability takes 4-6 months to build.",
          scale: "<span class=\"hw-gendd-score-row-reason-strong\">AI-native widens this gap.</span> Methodology is rentable, and it scales with the engagement. Spinning up a 6-person AI-native pod is a matter of weeks; building an equivalent in-house capability is a matter of quarters.",
          talent: "<span class=\"hw-gendd-score-row-reason-strong\">AI-native widens this gap.</span> The global talent pool now includes engineers practicing AI-native methodology at scale. Sourcing AI-fluent senior engineers in your local market is much harder than sourcing them from a vetted nearshore pool."
        }
      };

      var toggleBtns = root.querySelectorAll('.hw-gendd-score-toggle-btn');
      var rows = root.querySelectorAll('.hw-gendd-score-row');
      var takeaway = root.querySelector('[data-takeaway]');

      function activate(mode) {
        var state = states[mode];
        if (!state) return;

        toggleBtns.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.mode === mode ? 'true' : 'false');
        });

        rows.forEach(function(row) {
          var dim = row.dataset.dim;
          if (!state[dim]) return;
          var bar = row.querySelector('.hw-gendd-score-bar');
          var inBar = bar.querySelector('.hw-gendd-score-bar-half-in');
          var outBar = bar.querySelector('.hw-gendd-score-bar-half-out');
          inBar.style.width = state[dim].inPct + '%';
          outBar.style.width = state[dim].outPct + '%';

          // Show winner label only on the dominant side
          if (state[dim].inPct >= state[dim].outPct) {
            inBar.textContent = state[dim].inPct >= 50 ? 'In-house' : '';
            outBar.textContent = '';
          } else {
            inBar.textContent = '';
            outBar.textContent = state[dim].outPct >= 50 ? 'Outsourcing' : '';
          }

          var reasonEl = row.querySelector('[data-reason]');
          var reasonKey = reasonEl.getAttribute('data-reason');
          reasonEl.innerHTML = reasons[mode][reasonKey];
        });

        takeaway.textContent = state.takeaway;
      }

      toggleBtns.forEach(function(b) {
        b.addEventListener('click', function() { activate(b.dataset.mode); });
      });

      // Initial: AI-native view
      activate('ai');
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-iod');
      if (!root) return;

      var answers = { urgency: null, context: null };
      var labels = {
        urgency: {
          soon: "Soon (1-3 months)",
          standard: "Standard (3-12 months)",
          long: "Long-term (12+ months)"
        },
        context: {
          high: "High business context",
          mixed: "Mixed context",
          lower: "Lower context / well-defined"
        }
      };

      // 9-cell decision matrix
      var matrix = {
        'soon:high': {
          kind: 'hybrid', pill: 'Hybrid', headline: 'Best fit',
          reason: "You need to ship quickly and the work requires deep business context. Building in-house can't meet the timeline. Pure outsourcing can't bring the context you'd need to transfer. The hybrid model captures both: your in-house product owner and tech lead hold the context, while an AI-native nearshore pod delivers the execution capacity at speed. This is one of the canonical hybrid cases."
        },
        'soon:mixed': {
          kind: 'outsource', pill: 'Outsourced (Nearshore)', headline: 'Likely fit',
          reason: "Tight timeline with mixed context needs usually maps to nearshore outsourcing. An AI-native partner can deliver execution speed without you needing to transfer all of your business context, since the work isn't uniformly context-heavy. If you want methodology to persist after the engagement, staff augmentation under nearshore is the structural choice. Otherwise, a dedicated nearshore pod handles it cleanly."
        },
        'soon:lower': {
          kind: 'outsource', pill: 'Outsourced (Nearshore)', headline: 'Best fit',
          reason: "Tight timeline plus well-defined execution work is the textbook case for outsourcing. A nearshore AI-native team can engage within weeks, deliver under their methodology, and ship on your timeline. The work doesn't require context transfer that would slow the engagement down. Project outsourcing or dedicated pod, depending on whether you want milestone-based or capacity-based engagement."
        },
        'standard:high': {
          kind: 'hybrid', pill: 'Hybrid', headline: 'Best fit',
          reason: "Standard timeline plus high context is a strong hybrid case. You have time to either build in-house or run a hybrid engagement, and the high context need argues for an in-house presence. A small in-house core (product owner, tech lead, domain experts) paired with an AI-native nearshore pod gives you the context retention without the cost and time of fully staffing an in-house team."
        },
        'standard:mixed': {
          kind: 'hybrid', pill: 'Hybrid', headline: 'Best fit',
          reason: "Standard timeline plus mixed context is the most common 2026 case, and the hybrid model is purpose-built for it. The in-house team handles context-heavy work; the nearshore AI-native pod handles execution-heavy work; both share the same backlog and methodology. Most software-driven businesses end up here once they look at the actual shape of their work."
        },
        'standard:lower': {
          kind: 'outsource', pill: 'Outsourced (Nearshore)', headline: 'Likely fit',
          reason: "Standard timeline plus well-defined execution work maps cleanly to outsourcing. A nearshore AI-native team can engage, deliver, and wind down without you needing to build internal capacity. If the work might recur or expand, a dedicated pod is more flexible; if it's truly self-contained, project outsourcing works."
        },
        'long:high': {
          kind: 'inhouse', pill: 'In-House', headline: 'Best fit',
          reason: "Long-term timeline plus genuinely high business context is one of the few cases where building in-house is the clear winner. The context investment pays back over years, the timeline makes the 4-6 month build viable, and the work justifies owning capability outright. The hybrid model is still worth considering if you want execution capacity in parallel with building the in-house team, but the strategic answer here is in-house."
        },
        'long:mixed': {
          kind: 'hybrid', pill: 'Hybrid', headline: 'Best fit',
          reason: "Long-term timeline with mixed context creates space for a hybrid that evolves over time. Start with a hybrid engagement that delivers current work; let the in-house core grow over time on the context-heavy pieces while the nearshore pod continues to handle execution capacity. This shape is more resilient than committing fully to either in-house or outsourcing early in the timeline."
        },
        'long:lower': {
          kind: 'outsource', pill: 'Outsourced (Nearshore)', headline: 'Likely fit',
          reason: "Long-term timeline plus low context means the work doesn't justify in-house investment, since context accumulation isn't the bottleneck. An ongoing nearshore engagement (dedicated pod or rolling staff augmentation) delivers the work without the carrying cost of permanent headcount you don't need."
        }
      };

      var resultEl = root.querySelector('[data-result]');
      var resultLabel = root.querySelector('[data-result-label]');
      var resultHeadline = root.querySelector('[data-result-headline]');
      var resultReasoning = root.querySelector('[data-result-reasoning]');
      var resultFactors = root.querySelector('[data-result-factors]');
      var factorEls = {
        urgency: root.querySelector('[data-factor="urgency"]'),
        context: root.querySelector('[data-factor="context"]')
      };
      var resetWrap = root.querySelector('[data-reset-wrap]');
      var resetBtn = root.querySelector('[data-reset]');

      var options = root.querySelectorAll('.hw-gendd-iod-option');

      function render() {
        var allAnswered = answers.urgency && answers.context;
        if (!allAnswered) {
          var answered = (answers.urgency ? 1 : 0) + (answers.context ? 1 : 0);
          resultEl.classList.remove('is-complete', 'is-inhouse', 'is-hybrid', 'is-outsource');
          resultLabel.textContent = answered === 0 ? 'Answer both questions above' : '1 more to go';
          resultHeadline.textContent = 'Your recommendation will appear here';
          resultReasoning.textContent = 'Based on your answers, we\u2019ll suggest the engagement shape that best fits your situation.';
          resultFactors.style.display = 'none';
          resetWrap.style.display = 'none';
          return;
        }

        var key = answers.urgency + ':' + answers.context;
        var data = matrix[key];

        resultEl.classList.add('is-complete');
        resultEl.classList.remove('is-inhouse', 'is-hybrid', 'is-outsource');
        resultEl.classList.add('is-' + data.kind);
        resultLabel.textContent = 'Recommendation';
        resultHeadline.innerHTML = '<span class="hw-gendd-iod-result-headline-pill">' + data.pill + '</span>' + data.headline;
        resultReasoning.textContent = data.reason;
        resultFactors.style.display = '';
        factorEls.urgency.textContent = labels.urgency[answers.urgency];
        factorEls.context.textContent = labels.context[answers.context];
        resetWrap.style.display = '';
      }

      options.forEach(function(opt) {
        opt.addEventListener('click', function() {
          var q = opt.dataset.q;
          var v = opt.dataset.value;
          answers[q] = v;
          var siblings = root.querySelectorAll('.hw-gendd-iod-option[data-q="' + q + '"]');
          siblings.forEach(function(s) { s.setAttribute('aria-pressed', s === opt ? 'true' : 'false'); });
          render();
        });
      });

      resetBtn.addEventListener('click', function() {
        answers = { urgency: null, context: null };
        options.forEach(function(o) { o.setAttribute('aria-pressed', 'false'); });
        render();
      });

      render();
    })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":30436,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":4739,"estimatedReadTimeSeconds":1195,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

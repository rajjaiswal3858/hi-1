(function() {
      var root = document.currentScript.closest('.hw-gendd-mstack');
      if (!root) return;

      var toggleBtns = root.querySelectorAll('.hw-gendd-mstack-toggle-btn');
      var traditionalCol = root.querySelector('[data-col="traditional"]');
      var aiCol = root.querySelector('[data-col="ai"]');
      var colsContainer = root.querySelector('.hw-gendd-mstack-cols');

      function activate(mode) {
        toggleBtns.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.mode === mode ? 'true' : 'false');
        });
        if (mode === 'traditional') {
          traditionalCol.style.display = '';
          aiCol.style.display = 'none';
          colsContainer.style.gridTemplateColumns = '1fr';
        } else if (mode === 'ai') {
          traditionalCol.style.display = 'none';
          aiCol.style.display = '';
          colsContainer.style.gridTemplateColumns = '1fr';
        } else {
          traditionalCol.style.display = '';
          aiCol.style.display = '';
          if (window.matchMedia('(max-width: 800px)').matches) {
            colsContainer.style.gridTemplateColumns = '1fr';
          } else {
            colsContainer.style.gridTemplateColumns = '1fr 1fr';
          }
        }
      }

      toggleBtns.forEach(function(b) {
        b.addEventListener('click', function() { activate(b.dataset.mode); });
      });

      // Handle resize when in 'both' mode
      window.addEventListener('resize', function() {
        var current = root.querySelector('.hw-gendd-mstack-toggle-btn[aria-pressed="true"]');
        if (current && current.dataset.mode === 'both') activate('both');
      });
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-saug');
      if (!root) return;

      var dimensions = {
        control: {
          winner: "Staff Augmentation",
          staffaug: {
            verdict: "HIGH", verdictClass: "good",
            text: "You retain direct control over project execution, technical decisions, and day-to-day work. Augmented engineers report to your leads.",
            detail: "Engineers attend your standups, follow your code review process, work in your tools."
          },
          outsource: {
            verdict: "LOW", verdictClass: "ok",
            text: "Less direct control over execution. You define scope, accept deliverables, and trust the vendor's process for what happens in between.",
            detail: "Vendor manages its own team, process, and engineering practices."
          }
        },
        integration: {
          winner: "Staff Augmentation",
          staffaug: {
            verdict: "SEAMLESS", verdictClass: "good",
            text: "Engineers integrate into your team and operate inside your existing culture, tools, and codebase. They look like contractors on an org chart and function like team members in practice.",
            detail: "Onboarding is similar to a new hire's: faster ramp because the engineer arrives skill-ready."
          },
          outsource: {
            verdict: "SEPARATE", verdictClass: "ok",
            text: "External team operates under its own culture and methodologies. Hand-offs at scope boundaries; less interleaving with your existing engineering practice.",
            detail: "Communication happens through PMs and stand-ups at the engagement level, not the engineer level."
          }
        },
        flexibility: {
          winner: "Staff Augmentation",
          staffaug: {
            verdict: "VERY HIGH", verdictClass: "good",
            text: "Scale team size up or down week-by-week as project demands change. Add engineers when a deadline looms; release them when capacity is no longer needed.",
            detail: "Typical engagements run weeks to months; ramps up or down in days, not quarters."
          },
          outsource: {
            verdict: "DEFINED", verdictClass: "ok",
            text: "Team size and scope are predetermined in the contract. Strong partners can adjust mid-engagement, but it's not the default mode.",
            detail: "Scope changes typically require contract amendments, not a Slack message."
          }
        },
        cost: {
          winner: "Depends on the work",
          staffaug: {
            verdict: "PER-PERSON", verdictClass: "good",
            text: "Pay for specific skills only when you need them. Hourly or monthly rate per engineer; cost ends when the engagement ends.",
            detail: "Best fit when you can identify exactly the gap you're filling."
          },
          outsource: {
            verdict: "PER-OUTCOME", verdictClass: "good",
            text: "Cost can be structured around deliverables rather than hours, which can be efficient for well-scoped projects. The vendor absorbs internal coordination cost.",
            detail: "Best fit when the outcome is well-defined and the vendor's risk tolerance is part of the contract."
          }
        },
        overhead: {
          winner: "Project Outsourcing",
          staffaug: {
            verdict: "INTERNAL", verdictClass: "ok",
            text: "Requires your internal management bandwidth to direct, coordinate, and review the augmented engineers' work. They report to your leads, which means your leads manage them.",
            detail: "Same coordination cost as a senior hire; same fast feedback loops."
          },
          outsource: {
            verdict: "VENDOR-MANAGED", verdictClass: "good",
            text: "Outsourced projects are typically self-managed by the service provider. You receive deliverables and status reports; you don't run sprint planning.",
            detail: "Lower internal coordination cost, with a corresponding tradeoff in visibility."
          }
        },
        culture: {
          winner: "Staff Augmentation",
          staffaug: {
            verdict: "ABSORBED", verdictClass: "good",
            text: "Augmented engineers absorb your company's culture, communication norms, and decision-making style. Temporary, but inside the same culture as your team.",
            detail: "Brief acclimation period; ongoing alignment is automatic because they're embedded."
          },
          outsource: {
            verdict: "VARIES", verdictClass: "ok",
            text: "External team has its own culture. Cultural and communication mismatches are manageable but require intentional bridging, particularly across borders or time zones.",
            detail: "Stronger partners invest in culture-fit on their side; weaker ones leave it to you to bridge."
          }
        },
        duration: {
          winner: "Project Outsourcing",
          staffaug: {
            verdict: "SHORT-TO-MEDIUM", verdictClass: "ok",
            text: "Best fit for engagements measured in months. Long, continuous engagements drift toward functional permanent hires, which is what the model is designed to avoid.",
            detail: "Multi-year continuous engagements usually warrant a different structure."
          },
          outsource: {
            verdict: "ANY DURATION", verdictClass: "good",
            text: "Comfortable across short engagements, single-project work, and long-term ongoing needs. Knowledge stays with the vendor across renewals.",
            detail: "Continuity is part of the vendor's value proposition over time."
          }
        },
        methodology: {
          winner: "Staff Augmentation",
          staffaug: {
            verdict: "TRANSFERRED IN", verdictClass: "good",
            text: "When the augmented engineer practices AI-native methodology, that methodology shows up in your repo, your code reviews, and your in-house engineers' habits. It crosses the boundary.",
            detail: "The engineer leaves; the way of working remains."
          },
          outsource: {
            verdict: "STAYS WITH VENDOR", verdictClass: "ok",
            text: "Methodology lives inside the vendor's process. You see the output, not the practice. Useful for delivery, less useful if your goal is capability uplift.",
            detail: "The deliverable arrives; the methodology that produced it stays where it started."
          }
        }
      };

      var dimButtons = root.querySelectorAll('.hw-gendd-saug-dim-btn');
      var sides = ['staffaug', 'outsource'];
      var elements = {};
      sides.forEach(function(side) {
        var body = root.querySelector('[data-side="' + side + '"]');
        elements[side] = {
          body: body,
          verdict: body.querySelector('[data-verdict]'),
          text: body.querySelector('[data-text]'),
          detail: body.querySelector('[data-detail]')
        };
      });
      var winnerEl = root.querySelector('[data-winner]');

      function applyVerdict(el, klass) {
        el.className = 'hw-gendd-saug-card-verdict hw-gendd-saug-card-verdict--' + klass;
      }

      function activate(dimKey) {
        var data = dimensions[dimKey];
        if (!data) return;

        dimButtons.forEach(function(btn) {
          btn.setAttribute('aria-pressed', btn.dataset.dim === dimKey ? 'true' : 'false');
        });

        sides.forEach(function(side) {
          elements[side].body.style.opacity = '0';
        });

        setTimeout(function() {
          sides.forEach(function(side) {
            var sideData = data[side];
            elements[side].verdict.textContent = sideData.verdict;
            applyVerdict(elements[side].verdict, sideData.verdictClass);
            elements[side].text.textContent = sideData.text;
            elements[side].detail.textContent = sideData.detail;
            elements[side].body.style.opacity = '1';
          });
          winnerEl.innerHTML = '<span class="hw-gendd-saug-medal">&#127942;</span>' + data.winner;
        }, 180);
      }

      dimButtons.forEach(function(btn) {
        btn.addEventListener('click', function() { activate(btn.dataset.dim); });
      });
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-tcm');
      if (!root) return;

      // Monthly figures
      var inHouseMonthly = {
        salary: 160000 / 12,        // ~$13,333/mo loaded salary
        benefits: 44000 / 12,       // ~$3,667/mo benefits + overhead (~27.5% of salary)
        recruit: 24000,             // one-time
        rampMonths: 3,              // 3 months of ~50% productivity loss
        rampLossPerMonth: 13000     // half of monthly fully-loaded rate
      };

      var saugMonthly = {
        rate: 72000 / 6,            // $75/hr * 160 hr/mo = $12,000/mo
        rampWeeks: 2,
        rampLossPerWeek: 1125       // small ramp cost
      };

      var durButtons = root.querySelectorAll('.hw-gendd-tcm-dur-btn');

      var elInhouseSalary = root.querySelector('[data-inhouse-salary]');
      var elInhouseBenefits = root.querySelector('[data-inhouse-benefits]');
      var elInhouseRecruit = root.querySelector('[data-inhouse-recruit]');
      var elInhouseRamp = root.querySelector('[data-inhouse-ramp]');
      var elInhouseTotal = root.querySelector('[data-inhouse-total]');

      var elSaugRate = root.querySelector('[data-saug-rate]');
      var elSaugRamp = root.querySelector('[data-saug-ramp]');
      var elSaugTotal = root.querySelector('[data-saug-total]');

      var elSavingsValue = root.querySelector('[data-savings-value]');
      var elSavingsText = root.querySelector('[data-savings-text]');

      function fmt(n) {
        return '$' + Math.round(n).toLocaleString();
      }

      function compute(months) {
        // In-house
        var inSalary = inHouseMonthly.salary * months;
        var inBenefits = inHouseMonthly.benefits * months;
        var inRecruit = inHouseMonthly.recruit;
        // ramp cost capped at engagement length
        var rampMonths = Math.min(inHouseMonthly.rampMonths, months);
        var inRamp = rampMonths * inHouseMonthly.rampLossPerMonth;
        var inTotal = inSalary + inBenefits + inRecruit + inRamp;

        // Staff aug
        var saRate = saugMonthly.rate * months;
        var saRamp = saugMonthly.rampWeeks * saugMonthly.rampLossPerWeek;
        var saTotal = saRate + saRamp;

        var savingsPct = Math.round((1 - saTotal / inTotal) * 100);
        var savingsAbs = inTotal - saTotal;

        return {
          inSalary: inSalary, inBenefits: inBenefits, inRecruit: inRecruit, inRamp: inRamp, inTotal: inTotal,
          saRate: saRate, saRamp: saRamp, saTotal: saTotal,
          savingsPct: savingsPct, savingsAbs: savingsAbs
        };
      }

      function activate(durationStr) {
        var months = parseInt(durationStr, 10);
        var c = compute(months);

        durButtons.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.duration === durationStr ? 'true' : 'false');
        });

        elInhouseSalary.textContent = fmt(c.inSalary);
        elInhouseBenefits.textContent = fmt(c.inBenefits);
        elInhouseRecruit.textContent = fmt(c.inRecruit);
        elInhouseRamp.textContent = fmt(c.inRamp);
        elInhouseTotal.textContent = fmt(c.inTotal);

        elSaugRate.textContent = fmt(c.saRate);
        elSaugRamp.textContent = fmt(c.saRamp);
        elSaugTotal.textContent = fmt(c.saTotal);

        elSavingsValue.textContent = '~' + c.savingsPct + '%';
        elSavingsText.textContent = 'Approximately ' + fmt(c.savingsAbs) +
          ' less over ' + months + ' months, with the productivity multiplier still to come. AI-native methodology layered on top means same per-engineer output buys you more.';
      }

      durButtons.forEach(function(b) {
        b.addEventListener('click', function() { activate(b.dataset.duration); });
      });

      activate('6');
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-efit');
      if (!root) return;

      var answers = { scope: null, control: null };
      var labels = {
        scope: {
          capacity: "Capacity / skill gap",
          initiative: "Defined initiative",
          delegated: "Self-contained scope"
        },
        control: {
          high: "High control",
          medium: "Medium control",
          low: "Low control"
        }
      };

      // Decision matrix
      var matrix = {
        'capacity:high': {
          kind: 'staffaug', pill: 'Staff Augmentation', headline: 'Best fit',
          reason: "You need extra hands inside your existing team's work, with engineers operating under your direction. Staff augmentation is purpose-built for this. If you can find an AI-native partner, the methodology transfer is a bonus that compounds the engagement value over time."
        },
        'capacity:medium': {
          kind: 'staffaug', pill: 'Staff Augmentation', headline: 'Likely fit',
          reason: "A capacity or skill gap usually maps to staff augmentation, even if you don't need engineer-by-engineer control. The flexibility to scale up or down without long-term commitment is the key advantage."
        },
        'capacity:low': {
          kind: 'pod', pill: 'Dedicated Pod', headline: 'Consider this',
          reason: "If you want lower day-to-day involvement but still need engineers integrated with your work, a dedicated team or pod sits in the middle. You set direction; the pod manages execution. AI-native pods are particularly effective in this shape because the methodology runs internally to the pod."
        },
        'initiative:high': {
          kind: 'staffaug', pill: 'Staff Augmentation', headline: 'Possible fit',
          reason: "A defined initiative with high control needs can work as staff augmentation if you're augmenting an existing team that owns the initiative. If you'd be standing up a new team for the work, a dedicated pod is usually a cleaner shape."
        },
        'initiative:medium': {
          kind: 'pod', pill: 'Dedicated Pod', headline: 'Best fit',
          reason: "A defined initiative with medium control needs is the canonical case for a dedicated AI-native pod. You get an integrated team running its own cadence under your strategic direction. The methodology stays consistent across the engagement and the team can absorb scope changes without contractual gymnastics."
        },
        'initiative:low': {
          kind: 'outsource', pill: 'Project Outsourcing', headline: 'Likely fit',
          reason: "A defined initiative with low control needs maps well to project outsourcing. The vendor owns execution end-to-end; you own scope and acceptance. Pick a vendor whose engineering practices and quality bar you actually trust, since you'll see less of the day-to-day."
        },
        'delegated:high': {
          kind: 'pod', pill: 'Dedicated Pod', headline: 'Consider this',
          reason: "Self-contained scopes usually trend toward outsourcing, but if you want high control over execution, you actually want a dedicated pod with a clear scope. Pure outsourcing won't give you the control you're describing; staff augmentation will give you control but not the self-contained shape."
        },
        'delegated:medium': {
          kind: 'outsource', pill: 'Project Outsourcing', headline: 'Likely fit',
          reason: "Self-contained scope plus medium control aligns with project outsourcing under a strong partner. You define the outcome and milestones, the vendor manages execution. Methodology stays with the vendor."
        },
        'delegated:low': {
          kind: 'outsource', pill: 'Project Outsourcing', headline: 'Best fit',
          reason: "Self-contained scope plus low day-to-day involvement is the textbook case for project outsourcing. Define what good looks like, set the milestones, accept the deliverables. Methodology transfer isn't a goal here; outcome delivery is."
        }
      };

      var resultEl = root.querySelector('[data-result]');
      var resultLabel = root.querySelector('[data-result-label]');
      var resultHeadline = root.querySelector('[data-result-headline]');
      var resultReasoning = root.querySelector('[data-result-reasoning]');
      var resultFactors = root.querySelector('[data-result-factors]');
      var factorEls = {
        scope: root.querySelector('[data-factor="scope"]'),
        control: root.querySelector('[data-factor="control"]')
      };
      var resetWrap = root.querySelector('[data-reset-wrap]');
      var resetBtn = root.querySelector('[data-reset]');

      var options = root.querySelectorAll('.hw-gendd-efit-option');

      function render() {
        var allAnswered = answers.scope && answers.control;
        if (!allAnswered) {
          var answered = (answers.scope ? 1 : 0) + (answers.control ? 1 : 0);
          resultEl.classList.remove('is-complete', 'is-staffaug', 'is-pod', 'is-outsource');
          resultLabel.textContent = answered === 0 ? 'Answer both questions above' : '1 more to go';
          resultHeadline.textContent = 'Your recommendation will appear here';
          resultReasoning.textContent = 'Based on your answers, we\u2019ll suggest the engagement shape that best fits your needs.';
          resultFactors.style.display = 'none';
          resetWrap.style.display = 'none';
          return;
        }

        var key = answers.scope + ':' + answers.control;
        var data = matrix[key];

        resultEl.classList.add('is-complete');
        resultEl.classList.remove('is-staffaug', 'is-pod', 'is-outsource');
        resultEl.classList.add('is-' + data.kind);
        resultLabel.textContent = 'Recommendation';
        resultHeadline.innerHTML = '<span class="hw-gendd-efit-result-headline-pill">' + data.pill + '</span>' + data.headline;
        resultReasoning.textContent = data.reason;
        resultFactors.style.display = '';
        factorEls.scope.textContent = labels.scope[answers.scope];
        factorEls.control.textContent = labels.control[answers.control];
        resetWrap.style.display = '';
      }

      options.forEach(function(opt) {
        opt.addEventListener('click', function() {
          var q = opt.dataset.q;
          var v = opt.dataset.value;
          answers[q] = v;
          var siblings = root.querySelectorAll('.hw-gendd-efit-option[data-q="' + q + '"]');
          siblings.forEach(function(s) { s.setAttribute('aria-pressed', s === opt ? 'true' : 'false'); });
          render();
        });
      });

      resetBtn.addEventListener('click', function() {
        answers = { scope: null, control: null };
        options.forEach(function(o) { o.setAttribute('aria-pressed', 'false'); });
        render();
      });

      render();
    })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":30661,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":4347,"estimatedReadTimeSeconds":1096,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

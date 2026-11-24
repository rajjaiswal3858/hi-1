(function() {
      var root = document.currentScript.closest('.hw-gendd-gap');
      if (!root) return;

      var eras = {
        early: {
          title: "Cost Era",
          text: "Offshore led on hourly rate. Most outsourcing decisions ended there. Nearshore existed but was a minority choice for buyers prioritizing quality or collaboration over raw cost.",
          nearshore: { score: 70, layers: [{ label: "GEOGRAPHY", kind: "base" }] },
          offshore: { score: 60, layers: [{ label: "COST", kind: "base" }] },
          gapValue: "+10%",
          gapText: "A modest nearshore lead. Most buyers still chose offshore on price.",
          widening: false
        },
        agile: {
          title: "Collaboration Era",
          text: "Agile and distributed work made time-zone overlap matter. Nearshore's structural advantage in real-time collaboration started showing up in delivery velocity. Offshore worked, but the coordination tax was visible in every sprint.",
          nearshore: { score: 88, layers: [{ label: "GEOGRAPHY", kind: "base" }, { label: "+ AGILE FIT", kind: "base" }] },
          offshore: { score: 62, layers: [{ label: "COST", kind: "base" }] },
          gapValue: "+26%",
          gapText: "The gap widened. Agile and remote work amplified the value of real-time collaboration.",
          widening: false
        },
        ai: {
          title: "AI-Native Era",
          text: "Methodology becomes the third axis. Nearshore partners running governed AI-native methodology compound their geographic advantages with smaller, more productive teams. Offshore can't replicate this easily because the time-zone friction that broke their Agile process also breaks the Plan/Confirm gate that AI-native methodology depends on.",
          nearshore: { score: 100, layers: [{ label: "GEOGRAPHY", kind: "base" }, { label: "+ AGILE", kind: "base" }, { label: "+ METHODOLOGY", kind: "methodology" }] },
          offshore: { score: 55, layers: [{ label: "COST", kind: "base" }] },
          gapValue: "+45%",
          gapText: "Nearshore now delivers nearly double per engineer compared to offshore once methodology is part of the picture.",
          widening: true
        }
      };

      var eraButtons = root.querySelectorAll('.hw-gendd-gap-era-btn');
      var nearshoreBar = root.querySelector('[data-bar="nearshore"]');
      var offshoreBar = root.querySelector('[data-bar="offshore"]');
      var nearshoreLayers = root.querySelector('[data-layers="nearshore"]');
      var offshoreLayers = root.querySelector('[data-layers="offshore"]');
      var nearshoreScore = root.querySelector('[data-score="nearshore"]');
      var offshoreScore = root.querySelector('[data-score="offshore"]');
      var calloutValue = root.querySelector('[data-callout="value"]');
      var calloutText = root.querySelector('[data-callout="text"]');
      var descTitle = root.querySelector('[data-desc="title"]');
      var descText = root.querySelector('[data-desc="text"]');

      function renderLayers(container, layerList) {
        container.innerHTML = '';
        layerList.forEach(function(layer, i) {
          var chip = document.createElement('span');
          chip.className = 'hw-gendd-gap-layer';
          if (layer.kind === 'methodology') {
            chip.className += ' hw-gendd-gap-layer--methodology';
          }
          chip.textContent = layer.label;
          container.appendChild(chip);
          setTimeout(function() { chip.classList.add('is-visible'); }, 200 + i * 150);
        });
      }

      function activate(eraKey) {
        var data = eras[eraKey];
        if (!data) return;

        eraButtons.forEach(function(btn) {
          btn.setAttribute('aria-pressed', btn.dataset.era === eraKey ? 'true' : 'false');
        });

        nearshoreBar.style.width = data.nearshore.score + '%';
        offshoreBar.style.width = data.offshore.score + '%';
        nearshoreScore.textContent = data.nearshore.score + '%';
        offshoreScore.textContent = data.offshore.score + '%';

        // delay layer rendering until bars settle
        setTimeout(function() {
          renderLayers(nearshoreLayers, data.nearshore.layers);
          renderLayers(offshoreLayers, data.offshore.layers);
        }, 300);

        calloutValue.textContent = data.gapValue;
        calloutValue.classList.toggle('is-widening', data.widening);
        calloutText.textContent = data.gapText;
        descTitle.textContent = data.title;
        descText.textContent = data.text;
      }

      eraButtons.forEach(function(btn) {
        btn.addEventListener('click', function() { activate(btn.dataset.era); });
      });

      // Initialize with AI-native era (active default)
      activate('ai');
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-vs');
      if (!root) return;

      var dimensions = {
        timezone: {
          winner: "Nearshore",
          nearshore: {
            verdict: "STRONG FIT", verdictClass: "good",
            text: "Same or similar time zone enables real-time collaboration. Daily standups, pair programming, and sprint ceremonies happen during shared business hours.",
            detail: "Typical overlap: 6\u20139 hours of shared workday with U.S. teams."
          },
          offshore: {
            verdict: "WEAK FIT", verdictClass: "bad",
            text: "5\u201312 hour time zone gap forces async-first collaboration. Day-long handoffs replace real-time problem solving.",
            detail: "Typical overlap: 0\u20133 hours, often outside one party's business hours."
          }
        },
        cost: {
          winner: "Offshore (but close)",
          nearshore: {
            verdict: "STRONG VALUE", verdictClass: "ok",
            text: "Meaningfully cheaper than onshore. Slightly more expensive than offshore on hourly rate, but typically lower total cost of engagement when coordination overhead and quality variance are included.",
            detail: "Mid-level developer: roughly $53\u2013$66/hr."
          },
          offshore: {
            verdict: "LOWEST RATE", verdictClass: "good",
            text: "Lowest hourly rate of the three models. The headline number is attractive; the realized cost depends heavily on whether the engagement actually delivers what was scoped.",
            detail: "Mid-level developer: roughly $27\u2013$65/hr."
          }
        },
        culture: {
          winner: "Nearshore",
          nearshore: {
            verdict: "HIGH AFFINITY", verdictClass: "good",
            text: "Latin America shares substantial cultural overlap with the U.S.: business practices, holidays, communication norms, direct feedback styles. Onboarding feels familiar.",
            detail: "Most senior engineers and leads are fluent or near-fluent in English."
          },
          offshore: {
            verdict: "VARIABLE FIT", verdictClass: "ok",
            text: "Cultural differences are real and manageable, but they cost time and process discipline to bridge. Communication norms around disagreement, hierarchy, and completion vary by region.",
            detail: "English proficiency ranges widely; senior leadership is usually strong, broader teams less so."
          }
        },
        quality: {
          winner: "Nearshore",
          nearshore: {
            verdict: "ONSHORE-COMPARABLE", verdictClass: "good",
            text: "Latin American senior engineers operate at the same quality bar as U.S. engineers across most domains. Talent pool depth has grown faster than the comparable onshore market.",
            detail: "Largest tech sectors: Brazil, Mexico, Argentina, Colombia, Chile, Costa Rica."
          },
          offshore: {
            verdict: "WIDE VARIANCE", verdictClass: "ok",
            text: "Quality varies substantially by partner and team. Top-tier offshore engineers match anyone; mid-tier and below require strong vendor management to extract consistent output.",
            detail: "Partner selection matters more than country selection."
          }
        },
        risk: {
          winner: "Nearshore",
          nearshore: {
            verdict: "MEDIUM RISK", verdictClass: "ok",
            text: "Lower turnover than aggressive offshore markets, easier escalation due to time-zone overlap, more direct oversight of project status. Country-level political and currency risk is usually manageable.",
            detail: "Retention rates among established LATAM partners are generally on par with U.S. firms."
          },
          offshore: {
            verdict: "HIGHER RISK", verdictClass: "bad",
            text: "Turnover in hot offshore markets can disrupt project continuity in ways that erase hourly-rate savings. Time-zone friction makes issues harder to catch early.",
            detail: "Mitigation requires more process discipline and longer vendor management cycles."
          }
        },
        travel: {
          winner: "Nearshore",
          nearshore: {
            verdict: "ACCESSIBLE", verdictClass: "good",
            text: "2\u20135 hour flights from most U.S. cities. Same-day travel and overnight return is routinely possible.",
            detail: "Atlanta to San Jos\u00e9, Costa Rica is comparable to a domestic flight."
          },
          offshore: {
            verdict: "EXPENSIVE", verdictClass: "bad",
            text: "8+ hour flights, overnight accommodations, often requires a multi-day on-site visit to justify the trip. Cost and time investment per visit is significant.",
            detail: "Most engagements minimize travel and operate fully remote as a result."
          }
        },
        security: {
          winner: "Nearshore",
          nearshore: {
            verdict: "ALIGNED FRAMEWORKS", verdictClass: "good",
            text: "Most LATAM countries operate under data protection laws compatible with U.S. and EU expectations. Cross-border compliance is manageable for typical engagements.",
            detail: "Mexico's adherence to USMCA digital provisions has further simplified compliance."
          },
          offshore: {
            verdict: "VARIES WIDELY", verdictClass: "ok",
            text: "Data protection frameworks differ substantially across offshore destinations. Regulated industries (healthcare, finance) face higher diligence requirements.",
            detail: "Some offshore markets have strong frameworks; others require contractual workarounds."
          }
        },
        methodology: {
          winner: "Nearshore",
          nearshore: {
            verdict: "STRUCTURAL FIT", verdictClass: "good",
            text: "AI-native methodology requires the same conditions Agile requires: real-time collaboration, fast Plan/Confirm cycles, tight feedback loops. Nearshore has these by default.",
            detail: "GenDD Pods (3-person AI-augmented teams) deliver work normally requiring 8\u201312 people."
          },
          offshore: {
            verdict: "STRUCTURAL FRICTION", verdictClass: "bad",
            text: "The Plan/Confirm gate that prevents vibecoding requires same-day back-and-forth between engineer and lead. Time-zone gap turns this into an overnight cycle.",
            detail: "Offshore can buy AI tools. It can't easily buy the geometry the methodology depends on."
          }
        }
      };

      var dimButtons = root.querySelectorAll('.hw-gendd-vs-dim-btn');
      var sides = ['nearshore', 'offshore'];
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
        el.className = 'hw-gendd-vs-card-verdict hw-gendd-vs-card-verdict--' + klass;
      }

      function activate(dimKey) {
        var data = dimensions[dimKey];
        if (!data) return;

        dimButtons.forEach(function(btn) {
          btn.setAttribute('aria-pressed', btn.dataset.dim === dimKey ? 'true' : 'false');
        });

        // fade-swap
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
          winnerEl.innerHTML = '<span class="hw-gendd-vs-medal">&#127942;</span>' + data.winner;
        }, 180);
      }

      dimButtons.forEach(function(btn) {
        btn.addEventListener('click', function() { activate(btn.dataset.dim); });
      });
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-cost');
      if (!root) return;

      // [onshore_low, onshore_high, nearshore_low, nearshore_high, offshore_low, offshore_high]
      var rates = {
        'architect':         { name: 'Architect', onshore: [140, 190], nearshore: [72, 96], offshore: [47, 95] },
        'business-analyst':  { name: 'Business Analyst', onshore: [110, 154], nearshore: [54, 68], offshore: [31, 81] },
        'scrum-master':      { name: 'Scrum Master', onshore: [120, 153], nearshore: [50, 79], offshore: [44, 74] },
        'ux-designer':       { name: 'UX/UI Designer', onshore: [85, 130], nearshore: [48, 75], offshore: [29, 71] },
        'devops':            { name: 'DevOps', onshore: [114, 148], nearshore: [59, 82], offshore: [29, 79] },
        'lead-developer':    { name: 'Lead Developer', onshore: [160, 210], nearshore: [66, 82], offshore: [41, 82] },
        'assoc-developer':   { name: 'Associate Developer', onshore: [80, 120], nearshore: [41, 53], offshore: [21, 53] },
        'mid-developer':     { name: 'Mid-Level Developer', onshore: [120, 150], nearshore: [53, 66], offshore: [27, 65] },
        'senior-developer':  { name: 'Senior Developer', onshore: [145, 175], nearshore: [65, 82], offshore: [34, 76] },
        'qa-manual':         { name: 'Mid-Level QA Engineer (Manual)', onshore: [100, 126], nearshore: [42, 59], offshore: [22, 59] },
        'qa-auto':           { name: 'Mid-Level QA Engineer (Automated)', onshore: [125, 151], nearshore: [48, 62], offshore: [25, 63] },
        'senior-qa-auto':    { name: 'Senior QA Engineer (Automated)', onshore: [140, 167], nearshore: [59, 72], offshore: [29, 74] }
      };

      var roleButtons = root.querySelectorAll('.hw-gendd-cost-role-btn');
      var roleNameEl = root.querySelector('[data-role-name]');
      var bars = {
        onshore: root.querySelector('[data-bar="onshore"]'),
        nearshore: root.querySelector('[data-bar="nearshore"]'),
        offshore: root.querySelector('[data-bar="offshore"]')
      };
      var values = {
        onshore: root.querySelector('[data-value="onshore"]'),
        nearshore: root.querySelector('[data-value="nearshore"]'),
        offshore: root.querySelector('[data-value="offshore"]')
      };
      var savingsOnshore = root.querySelector('[data-savings="vs-onshore"]');
      var savingsOffshore = root.querySelector('[data-savings="vs-offshore"]');

      function midpoint(range) { return (range[0] + range[1]) / 2; }
      function fmtRange(range) { return '$' + range[0] + ' \u2013 $' + range[1]; }

      function activate(roleKey) {
        var data = rates[roleKey];
        if (!data) return;

        roleButtons.forEach(function(btn) {
          btn.setAttribute('aria-pressed', btn.dataset.role === roleKey ? 'true' : 'false');
        });

        // Find max rate to scale bars
        var maxRate = Math.max(data.onshore[1], data.nearshore[1], data.offshore[1]);

        // Update role name (preserve the tier badge span)
        roleNameEl.innerHTML = data.name + '<span class="hw-gendd-cost-role-name-tier">2026 rates</span>';

        // Animate bars and update values
        // Use the midpoint for bar width
        bars.onshore.style.width = (midpoint(data.onshore) / maxRate * 100) + '%';
        bars.nearshore.style.width = (midpoint(data.nearshore) / maxRate * 100) + '%';
        bars.offshore.style.width = (midpoint(data.offshore) / maxRate * 100) + '%';

        values.onshore.innerHTML = fmtRange(data.onshore);
        values.nearshore.innerHTML = fmtRange(data.nearshore);
        values.offshore.innerHTML = fmtRange(data.offshore);

        // Savings calculations using midpoints
        var nearMid = midpoint(data.nearshore);
        var onMid = midpoint(data.onshore);
        var offMid = midpoint(data.offshore);
        var vsOnshore = Math.round((1 - nearMid / onMid) * 100);
        var vsOffshore = Math.round((nearMid / offMid - 1) * 100);

        savingsOnshore.textContent = '~' + vsOnshore + '%';
        savingsOffshore.textContent = (vsOffshore >= 0 ? '~+' : '~') + vsOffshore + '%';
      }

      roleButtons.forEach(function(btn) {
        btn.addEventListener('click', function() { activate(btn.dataset.role); });
      });

      // Initial render
      activate('mid-developer');
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-decide');
      if (!root) return;

      var answers = { collab: null, ambiguity: null, priority: null };
      var labels = {
        collab: { high: "High real-time", medium: "Mixed", low: "Async-tolerant" },
        ambiguity: { high: "High", medium: "Medium", low: "Low" },
        priority: { velocity: "Velocity + quality", balanced: "Balanced", cost: "Lowest rate" }
      };

      var resultEl = root.querySelector('[data-result]');
      var resultLabel = root.querySelector('[data-result-label]');
      var resultHeadline = root.querySelector('[data-result-headline]');
      var resultReasoning = root.querySelector('[data-result-reasoning]');
      var resultFactors = root.querySelector('[data-result-factors]');
      var factorEls = {
        collab: root.querySelector('[data-factor="collab"]'),
        ambiguity: root.querySelector('[data-factor="ambiguity"]'),
        priority: root.querySelector('[data-factor="priority"]')
      };
      var resetWrap = root.querySelector('[data-reset-wrap]');
      var resetBtn = root.querySelector('[data-reset]');

      var options = root.querySelectorAll('.hw-gendd-decide-option');

      function score() {
        // Simple weighted scoring
        var n = 0, o = 0;
        // Collaboration
        if (answers.collab === 'high') { n += 3; }
        else if (answers.collab === 'medium') { n += 1; o += 1; }
        else { o += 2; }
        // Ambiguity
        if (answers.ambiguity === 'high') { n += 3; }
        else if (answers.ambiguity === 'medium') { n += 1; o += 1; }
        else { o += 2; }
        // Priority
        if (answers.priority === 'velocity') { n += 3; }
        else if (answers.priority === 'balanced') { n += 1; o += 1; }
        else { o += 2; }

        return { nearshore: n, offshore: o };
      }

      function render() {
        var allAnswered = answers.collab && answers.ambiguity && answers.priority;
        if (!allAnswered) {
          var answered = (answers.collab ? 1 : 0) + (answers.ambiguity ? 1 : 0) + (answers.priority ? 1 : 0);
          resultEl.classList.remove('is-complete', 'is-nearshore', 'is-offshore', 'is-either');
          resultLabel.textContent = answered === 0 ? 'Answer the three questions above' :
                                    answered === 1 ? '2 more to go' : '1 more to go';
          resultHeadline.textContent = 'Your recommendation will appear here';
          resultReasoning.textContent = 'Based on your answers, we\u2019ll suggest the model that best fits your project profile.';
          resultFactors.style.display = 'none';
          resetWrap.style.display = 'none';
          return;
        }

        var s = score();
        var pickKind, pillText, headline, reasoning;

        if (s.nearshore - s.offshore >= 3) {
          pickKind = 'nearshore';
          pillText = 'Nearshore';
          headline = 'Best fit';
          reasoning = "Your project profile leans heavily on real-time collaboration, evolving requirements, or velocity. Nearshore's structural advantages in time-zone alignment and methodology fit make it the natural choice. If your nearshore partner runs an AI-native methodology, the gap widens further.";
        } else if (s.offshore - s.nearshore >= 3) {
          pickKind = 'offshore';
          pillText = 'Offshore';
          headline = 'Reasonable fit';
          reasoning = "Your project profile tolerates async collaboration, has low ambiguity, and prioritizes hourly rate. Offshore can be the right answer here, particularly for well-scoped, repetitive, or support-heavy work. Just go in with eyes open about the coordination tax.";
        } else {
          pickKind = 'either';
          pillText = 'Either could work';
          headline = 'Could go either way';
          reasoning = "Your profile sits in the middle. Both models could deliver. Nearshore typically wins on velocity, quality, and methodology fit; offshore wins on hourly rate. Choose based on which dimension matters more for your specific engagement.";
        }

        resultEl.classList.add('is-complete');
        resultEl.classList.remove('is-nearshore', 'is-offshore', 'is-either');
        resultEl.classList.add('is-' + pickKind);
        resultLabel.textContent = 'Recommendation';
        resultHeadline.innerHTML = '<span class="hw-gendd-decide-result-headline-pill">' + pillText + '</span>' + headline;
        resultReasoning.textContent = reasoning;
        resultFactors.style.display = '';
        factorEls.collab.textContent = labels.collab[answers.collab];
        factorEls.ambiguity.textContent = labels.ambiguity[answers.ambiguity];
        factorEls.priority.textContent = labels.priority[answers.priority];
        resetWrap.style.display = '';
      }

      options.forEach(function(opt) {
        opt.addEventListener('click', function() {
          var q = opt.dataset.q;
          var v = opt.dataset.value;
          answers[q] = v;
          // toggle pressed state for siblings in this question only
          var siblings = root.querySelectorAll('.hw-gendd-decide-option[data-q="' + q + '"]');
          siblings.forEach(function(s) { s.setAttribute('aria-pressed', s === opt ? 'true' : 'false'); });
          render();
        });
      });

      resetBtn.addEventListener('click', function() {
        answers = { collab: null, ambiguity: null, priority: null };
        options.forEach(function(o) { o.setAttribute('aria-pressed', 'false'); });
        render();
      });

      render();
    })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":28852,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":3326,"estimatedReadTimeSeconds":838,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

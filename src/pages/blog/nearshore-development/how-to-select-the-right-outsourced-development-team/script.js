(function() {
      var root = document.currentScript.closest('.hw-gendd-emp');
      if (!root) return;

      var cards = root.querySelectorAll('.hw-gendd-emp-card');
      var details = root.querySelectorAll('.hw-gendd-emp-detail');

      function activate(model) {
        cards.forEach(function(c) {
          c.setAttribute('aria-pressed', c.dataset.model === model ? 'true' : 'false');
        });
        details.forEach(function(d) {
          if (d.dataset.detail === model) {
            d.classList.add('is-active');
          } else {
            d.classList.remove('is-active');
          }
        });
      }

      cards.forEach(function(c) {
        c.addEventListener('click', function() { activate(c.dataset.model); });
        c.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activate(c.dataset.model);
          }
        });
      });

      activate('integrated');
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-funnel');
      if (!root) return;

      var stages = root.querySelectorAll('.hw-gendd-funnel-stage');
      var toggleBtns = root.querySelectorAll('.hw-gendd-funnel-toggle-btn');
      var takeaway = root.querySelector('[data-takeaway]');

      var states = {
        typical: {
          top:    { time: "Over-invested (weeks)", classMod: "typical-top" },
          mid:    { time: "Often rushed", classMod: "typical-mid" },
          bottom: { time: "Often skipped", classMod: "typical-bottom" },
          takeaway: '<span class="hw-gendd-funnel-takeaway-strong">The typical pattern:</span> Teams spend weeks building a long list, do a single hour-long call with each shortlisted partner, and then make their decision based on price and gut feel. The signal that actually predicts engagement success (methodology fluency, references from real clients, working session quality) is in the bottom of the funnel where most teams under-invest.'
        },
        better: {
          top:    { time: "Modest (days)", classMod: "better-top" },
          mid:    { time: "Substantial", classMod: "better-mid" },
          bottom: { time: "Heavy", classMod: "better-bottom" },
          takeaway: '<span class="hw-gendd-funnel-takeaway-strong">The pattern that works:</span> Spend less time building the long list (most partners on the directories are fine) and invest the savings in deep shortlist evaluation. Run a real working session with each finalist. Ask for references and actually call them. Sit in on a sprint review. The cost of a wrong partner is much higher than the cost of an extra two weeks of evaluation.'
        }
      };

      function activate(view) {
        var state = states[view];
        toggleBtns.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.view === view ? 'true' : 'false');
        });
        stages.forEach(function(stage) {
          var key = stage.dataset.stage;
          // remove previous mode classes
          stage.classList.remove('hw-gendd-funnel-stage--typical-top','hw-gendd-funnel-stage--typical-mid','hw-gendd-funnel-stage--typical-bottom','hw-gendd-funnel-stage--better-top','hw-gendd-funnel-stage--better-mid','hw-gendd-funnel-stage--better-bottom');
          stage.classList.add('hw-gendd-funnel-stage--' + state[key].classMod);
          var timeEl = stage.querySelector('[data-time]');
          if (timeEl) timeEl.textContent = state[key].time;
        });
        takeaway.innerHTML = state.takeaway;
      }

      toggleBtns.forEach(function(b) {
        b.addEventListener('click', function() { activate(b.dataset.view); });
      });

      activate('typical');
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-evalmx');
      if (!root) return;

      var criteria = {
        geo: { name: "Geography & time-zone", high: "Prioritize nearshore partners with development hubs in your time zone. Confirm overlap with your working hours and how decisions get made across the engagement.", med: "Confirm reasonable time-zone overlap with your team. A 4-6 hour working overlap is workable.", low: "Geography is not a constraint. Focus on the other criteria." },
        model: { name: "Operating model", high: "Verify the partner's default engagement model matches what you need. Ask how they have structured similar engagements and what their contract templates look like.", med: "Confirm the partner can support the model you want, even if it's not their default.", low: "You're flexible on engagement model. Most credible partners can adapt." },
        domain: { name: "Domain expertise", high: "Demand specific industry or technical domain references. Ask to talk to a client in your sector. Domain expertise gap is hard to close mid-engagement.", med: "Confirm the partner has shipped at least adjacent work. Pure greenfield in their experience is a yellow flag.", low: "Domain expertise is not critical for this project. Look elsewhere for differentiation." },
        track: { name: "Track record", high: "Run at least 3 reference calls per finalist. Ask about engagements that ended 6-12 months ago, not their current darlings.", med: "Read case studies, do at least one reference call per finalist.", low: "Past track record is less critical (e.g., early-stage partner, new domain). Focus on team quality directly." },
        speed: { name: "Speed to start", high: "Ask about bench size, recruitment process, and earliest realistic start. Get this in writing. Partners pitching a 3-week start who actually need 8 are a common failure mode.", med: "Confirm the partner can start within a window you can live with. Get the date in the SOW.", low: "Speed to start is not critical. Use the runway for deeper evaluation." },
        culture: { name: "Culture & retention", high: "Ask the partner their annual engineer turnover rate. Verify it via references. Above 20% is a yellow flag; above 30% is red.", med: "Ask about retention casually; cross-check with references.", low: "Short engagement, lower stakes on retention. Move on." },
        methodology: { name: "Methodology fluency", high: "Demand a walkthrough of how the partner uses AI in production work. Look for governed methodology (e.g., Generative-Driven Development) not ad-hoc tool use. See the next section for the signals to watch for.", med: "Ask the partner to describe their methodology and what makes their AI use different from in-house teams. Listen for substance vs buzzwords.", low: "Methodology isn't a focus for this engagement. Most projects underweight this; reconsider unless you have a specific reason." }
      };

      var summaries = {
        // Profile based on which criteria the user rated High
        defaultMsg: "Most projects benefit from rating every criterion, even if just to confirm what's not a constraint."
      };

      var answers = {};
      Object.keys(criteria).forEach(function(k) { answers[k] = null; });

      var buttons = root.querySelectorAll('.hw-gendd-evalmx-weight-btn');
      var headline = root.querySelector('[data-headline]');
      var summary = root.querySelector('[data-summary]');
      var priorities = root.querySelector('[data-priorities]');

      function buildHeadline() {
        var highs = Object.keys(answers).filter(function(k) { return answers[k] === 'high'; });
        var rated = Object.keys(answers).filter(function(k) { return answers[k] !== null; });

        if (rated.length < 3) {
          return { headline: "Rate at least three criteria above to see guidance", summary: '<span class="hw-gendd-evalmx-result-empty">' + summaries.defaultMsg + '</span>', items: null };
        }

        // Build profile based on highs
        var profile, summaryText;

        var hasMethodology = answers.methodology === 'high';
        var hasDomain = answers.domain === 'high';
        var hasSpeed = answers.speed === 'high';
        var hasGeo = answers.geo === 'high';
        var hasTrack = answers.track === 'high';
        var hasCulture = answers.culture === 'high';
        var hasModel = answers.model === 'high';

        if (hasMethodology && hasDomain) {
          profile = "AI-native delivery on a domain-specialized engagement";
          summaryText = "You're looking for a partner who can ship in your domain AND apply methodology that compounds delivery velocity. This is the highest-bar profile. Plan for a longer evaluation phase, do real working sessions, and verify both methodology and domain expertise with reference calls.";
        } else if (hasMethodology) {
          profile = "Methodology-led engagement";
          summaryText = "Methodology is your top criterion, which is the right instinct for most 2026 engagements. Demand specifics, not slogans. The next visual covers the signals that separate governed AI-native development from vibecoding dressed up.";
        } else if (hasDomain && hasTrack) {
          profile = "Track-record-led domain engagement";
          summaryText = "You're optimizing for a partner who has shipped your kind of work before. Lean heavily on reference calls in your industry. Make sure references are recent, not from five years ago.";
        } else if (hasSpeed && hasModel) {
          profile = "Time-sensitive structural fit";
          summaryText = "You need to start fast under a specific engagement model. Get start date and model commitments in writing in the SOW. Partners often promise a 3-week start and need 8.";
        } else if (hasGeo && hasCulture) {
          profile = "Long-term integrated partnership";
          summaryText = "You're optimizing for a partner you can work with for years. Time-zone alignment and stable team retention are both signals of long-engagement fit. Verify retention numbers via references.";
        } else if (highs.length === 0) {
          profile = "Balanced evaluation";
          summaryText = "No single criterion dominates your priorities, which means every shortlisted partner needs to be solid across the board. Don't accept weakness on any one criterion in exchange for excellence on another.";
        } else {
          profile = "Mixed-priority engagement";
          summaryText = "Your priorities are mixed, which is fine. Focus your evaluation depth on the criteria you rated High; allow trade-offs on the others.";
        }

        var items = rated.map(function(k) {
          return { name: criteria[k].name, weight: answers[k], advice: criteria[k][answers[k]] };
        });

        return { headline: "Profile: " + profile, summary: summaryText, items: items };
      }

      function render() {
        var data = buildHeadline();
        headline.textContent = data.headline;
        if (typeof data.summary === 'string' && data.summary.indexOf('<') === 0) {
          summary.innerHTML = data.summary;
        } else {
          summary.textContent = data.summary;
        }

        if (data.items && data.items.length) {
          priorities.style.display = '';
          var html = data.items
            .sort(function(a, b) {
              var w = { high: 0, med: 1, low: 2 };
              return w[a.weight] - w[b.weight];
            })
            .map(function(item) {
              var weightLabel = { high: 'High priority', med: 'Medium priority', low: 'Low priority' }[item.weight];
              return '<div class="hw-gendd-evalmx-result-priority">' +
                '<div class="hw-gendd-evalmx-result-priority-label">' + weightLabel + '</div>' +
                '<div class="hw-gendd-evalmx-result-priority-value">' + item.name + '</div>' +
                '<div class="hw-gendd-evalmx-result-priority-value" style="font-weight: 400; color: rgba(255,255,255,0.78); font-size: 12px; margin-top: 4px;">' + item.advice + '</div>' +
                '</div>';
            }).join('');
          priorities.innerHTML = html;
        } else {
          priorities.style.display = 'none';
        }
      }

      buttons.forEach(function(b) {
        b.addEventListener('click', function() {
          var c = b.dataset.criterion;
          var w = b.dataset.weight;
          answers[c] = w;
          var siblings = root.querySelectorAll('.hw-gendd-evalmx-weight-btn[data-criterion="' + c + '"]');
          siblings.forEach(function(s) { s.setAttribute('aria-pressed', s === b ? 'true' : 'false'); });
          render();
        });
      });

      render();
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-tells');
      if (!root) return;

      var data = {
        process: {
          green: [
            { strong: "A defined execution loop.", rest: " The partner can name the stages of their methodology and explain what happens in each one. Context, Plan, Confirm, Execute, Validate is one version; the specifics matter less than that a defined loop exists." },
            { strong: "Plan/Confirm gates before code is written.", rest: " AI is used to draft a plan; humans review and approve the plan before the AI generates code. The gate is documented." },
            { strong: "Context Packs maintained in the repo.", rest: " Project context lives in version-controlled artifacts, not in an engineer's head. When the engineer rolls off, the context survives." },
            { strong: "AI use is reviewed in code review.", rest: " The same standards apply to AI-generated code as to human-written code. PR discussions mention the methodology by name." }
          ],
          red: [
            { strong: "Methodology is described as 'we use AI.'", rest: " No stages, no gates, no process. Engineers use Cursor or Copilot at their discretion." },
            { strong: "No Plan/Confirm step before AI generates code.", rest: " Engineers ask the AI to build features directly. Review happens (if at all) after the code is already written." },
            { strong: "Context lives in chat threads or in heads.", rest: " When you ask how project context is preserved, the answer is hand-wavy. Engineers say they keep it in their heads or in old Slack channels." },
            { strong: "AI-generated code is reviewed lightly or not at all.", rest: " The assumption is 'the AI is pretty good now.' Standards for AI-generated code are softer than for human-written code." }
          ]
        },
        artifacts: {
          green: [
            { strong: "Real repos with methodology artifacts.", rest: " The partner can show you a recent repo where you can see Context Packs, Plan/Confirm discussions in PRs, structured prompt/output records." },
            { strong: "Documentation of the methodology.", rest: " A written description of how the team applies their methodology, with examples. Not just a sales deck." },
            { strong: "Training program for engineers.", rest: " New engineers go through onboarding that teaches the methodology before they ship production code. The training is documented." },
            { strong: "Methodology evolution log.", rest: " The methodology has changed over time as the team has learned. A real practice has version history; a marketing label doesn't." }
          ],
          red: [
            { strong: "Methodology only exists in the sales deck.", rest: " The partner can't show you the artifacts in a real repo. The methodology is described abstractly." },
            { strong: "No written documentation outside marketing.", rest: " Ask for the internal methodology doc and get pointed to a customer-facing white paper. There's nothing for engineers." },
            { strong: "No structured onboarding for new engineers.", rest: " New engineers learn by watching the senior engineers, who learned by watching their senior engineers. Methodology is folk knowledge." },
            { strong: "Methodology is described as 'how we've always worked.'", rest: " If the AI revolution didn't change anything about how the team works, the team probably isn't doing AI-native development." }
          ]
        },
        team: {
          green: [
            { strong: "Senior engineers can teach the methodology.", rest: " You can talk to a senior engineer on the partner's team and they explain methodology cleanly without referring back to marketing materials." },
            { strong: "Engineers are paired with mentors during ramp.", rest: " Methodology is transmitted through deliberate mentorship, not osmosis." },
            { strong: "Engineers cite specific tools and techniques.", rest: " 'We use Cursor with this specific prompt pattern' or 'we structure our PRs this way to make Plan/Confirm reviewable.' Specificity is the tell." },
            { strong: "Engineers have opinions about AI use.", rest: " They have positions on what AI does well and what it doesn't, when to lean on it, when to override it. The opinions are informed by practice." }
          ],
          red: [
            { strong: "Engineers can't articulate the methodology.", rest: " When you ask a senior engineer how the team applies AI, the answer is 'we just use Cursor.'" },
            { strong: "New engineers figure it out themselves.", rest: " No structured handoff of methodology. New engineers either bring their own AI practice or develop one in isolation." },
            { strong: "Engineers speak in generalities.", rest: " 'AI helps us ship faster.' 'We use modern tools.' No specifics; no preferences; no opinions formed by repetition." },
            { strong: "Engineers are uncomfortable being asked about AI use.", rest: " The defensiveness is signal. Engineers who actually have a methodology enjoy talking about it." }
          ]
        },
        answers: {
          green: [
            { strong: "Specific answer to 'how does an engineer roll off mid-project?'", rest: " The partner has a clear process: Context Pack handoff, paired transition, documented in the repo. They've done it." },
            { strong: "Specific answer to 'what happens when a feature is harder than the AI estimated?'", rest: " The partner describes the escalation: re-plan, human-led decomposition, methodology evolution. Not just 'we adjust.'" },
            { strong: "Specific answer to 'show me a recent example.'", rest: " Without hesitation, they can pull up a recent engagement and walk you through how methodology showed up in the work." },
            { strong: "Honest acknowledgment of where AI struggles.", rest: " A serious AI-native partner has positions about what AI does poorly. That honesty is itself a credibility signal." }
          ],
          red: [
            { strong: "'Our methodology is proprietary, we can't share the details.'", rest: " A real methodology is teachable. Saying it's secret usually means it doesn't exist in a teachable form." },
            { strong: "'We adapt our methodology to each client.'", rest: " Usually a euphemism for 'we don't have one and we'll wing it.' Real methodologies adapt at the edges, not the core." },
            { strong: "'We don't believe in being prescriptive about AI use.'", rest: " Sounds principled, but in practice means engineers are on their own. Lack of prescription is the problem." },
            { strong: "Sales-deck answers with no underlying substance.", rest: " 'AI-first.' 'AI-augmented.' 'AI-powered.' Buzzwords without an explanation of what's actually done differently." }
          ]
        }
      };

      var catBtns = root.querySelectorAll('.hw-gendd-tells-cat-btn');
      var greenList = root.querySelector('[data-list="green"]');
      var redList = root.querySelector('[data-list="red"]');

      function render(cat) {
        var items = data[cat];
        if (!items) return;

        catBtns.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.cat === cat ? 'true' : 'false');
        });

        function buildItems(arr, mark) {
          return arr.map(function(it) {
            return '<li class="hw-gendd-tells-item">' +
              '<div class="hw-gendd-tells-item-mark">' + mark + '</div>' +
              '<div><span class="hw-gendd-tells-item-strong">' + it.strong + '</span>' + it.rest + '</div>' +
              '</li>';
          }).join('');
        }

        greenList.innerHTML = buildItems(items.green, '&#10003;');
        redList.innerHTML = buildItems(items.red, '&times;');
      }

      catBtns.forEach(function(b) {
        b.addEventListener('click', function() { render(b.dataset.cat); });
      });

      render('process');
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-qbank');
      if (!root) return;

      var topicLabels = {
        methodology: "Methodology",
        domain: "Domain",
        team: "Team",
        model: "Engagement",
        risk: "Risk",
        commercials: "Commercials"
      };

      var bank = {
        methodology: [
          { q: "Walk me through a recent PR from a real engagement. Where did AI help, and what did the engineer do differently because of it?", hint: "Listen for specificity. Vagueness here is the strongest red flag." },
          { q: "What's the difference between how your team uses AI today and how you used it 12 months ago?", hint: "A team practicing real methodology has an evolution story. A team without one says 'we just got better at it.'" },
          { q: "Show me how you preserve project context across engineer rolloffs.", hint: "Should produce specific artifacts: Context Packs in the repo, structured handoff documents, paired transition periods." },
          { q: "What's a recent case where your methodology caught a problem that ad-hoc AI use would have missed?", hint: "Real methodology has war stories. If they can't name one, the methodology probably isn't real." }
        ],
        domain: [
          { q: "Tell me about your most recent engagement in our industry (or an adjacent one). What did you wish you'd known going in?", hint: "The 'what you wish you'd known' framing pulls out real learnings rather than rehearsed case-study highlights." },
          { q: "Which engineers on your bench have direct domain experience with the type of work we're describing? Can we talk to them?", hint: "Bench engineers with real domain expertise should be able to discuss your problem space credibly." },
          { q: "What's a domain-specific gotcha in our industry that you learned the hard way?", hint: "Real expertise has scars. Generic answers (\"compliance is important\") suggest superficial exposure." }
        ],
        team: [
          { q: "What's your annual engineer turnover rate? How has it trended over the last 24 months?", hint: "Above 20% is a yellow flag, above 30% is red. Trending up over time is worse than a stable higher number." },
          { q: "How long do senior engineers typically stay at the company?", hint: "Median tenure tells you whether senior expertise compounds or churns." },
          { q: "What happens when an engineer is being underutilized between client engagements?", hint: "Answer reveals whether the partner invests in retention or treats engineers as interchangeable." }
        ],
        model: [
          { q: "Which engagement model is your default, and which is your second most common? What kinds of projects fit each?", hint: "Specific examples should follow. A partner who can't differentiate by model probably only does one well." },
          { q: "If we change our minds about engagement model partway through (e.g., from staff aug to dedicated pod), what does that look like contractually?", hint: "Flexibility matters. Listen for whether they've done it before or whether the question seems novel." },
          { q: "Show me a recent SOW for the engagement model we're considering.", hint: "Real partners can share redacted SOWs. Hesitation here is signal." }
        ],
        risk: [
          { q: "Tell me about an engagement that didn't go well. What happened and what did your team do?", hint: "Every partner has them. The ones who pretend otherwise are either lying or have very few engagements." },
          { q: "What's your process when a sprint goal slips? Who escalates, and how fast?", hint: "Specific escalation paths, named roles, time bounds. Vague answers mean nothing escalates until it's too late." },
          { q: "If a key engineer leaves your company mid-engagement, what's your continuity plan?", hint: "Should include rapid backfill, documented context, and clear communication. Not vague reassurance." }
        ],
        commercials: [
          { q: "What's the realistic earliest start date for an engagement of our size? What determines that?", hint: "Specific answer with named gating items (recruitment, SOW signature, partner availability). Not 'whenever you're ready.'" },
          { q: "Walk me through your typical contract terms: notice period, scope changes, payment terms, IP assignment.", hint: "Should be able to describe without checking notes. Surprises later are easier to avoid by surfacing now." },
          { q: "What happens at the end of the engagement? How is knowledge transferred, and what do we keep?", hint: "Should include code, documentation, methodology artifacts, and a transition plan if needed." }
        ]
      };

      var selected = { methodology: true, domain: false, team: false, model: false, risk: false, commercials: false };

      var topicBtns = root.querySelectorAll('.hw-gendd-qbank-topic-btn');
      var questionsEl = root.querySelector('[data-questions]');
      var countEl = root.querySelector('[data-count]');
      var actionsEl = root.querySelector('[data-actions]');
      var resetBtn = root.querySelector('[data-reset]');

      function render() {
        var activeTopics = Object.keys(selected).filter(function(k) { return selected[k]; });

        if (activeTopics.length === 0) {
          questionsEl.innerHTML = '<div class="hw-gendd-qbank-agenda-empty">Select at least one topic above to build your agenda.</div>';
          countEl.textContent = '';
          actionsEl.style.display = 'none';
          return;
        }

        var allQuestions = [];
        activeTopics.forEach(function(t) {
          bank[t].forEach(function(q) {
            allQuestions.push({ topic: t, q: q.q, hint: q.hint });
          });
        });

        countEl.textContent = allQuestions.length + ' question' + (allQuestions.length === 1 ? '' : 's') + ' across ' + activeTopics.length + ' topic' + (activeTopics.length === 1 ? '' : 's');

        questionsEl.innerHTML = allQuestions.map(function(item, i) {
          return '<div class="hw-gendd-qbank-question">' +
            '<div class="hw-gendd-qbank-q-num">' + (i + 1) + '</div>' +
            '<div class="hw-gendd-qbank-q-body">' +
              '<div class="hw-gendd-qbank-q-topic">' + topicLabels[item.topic] + '</div>' +
              '<div class="hw-gendd-qbank-q-text">' + item.q + '</div>' +
              '<div class="hw-gendd-qbank-q-hint">' + item.hint + '</div>' +
            '</div>' +
          '</div>';
        }).join('');

        actionsEl.style.display = '';
      }

      topicBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var t = btn.dataset.topic;
          selected[t] = !selected[t];
          btn.setAttribute('aria-pressed', selected[t] ? 'true' : 'false');
          render();
        });
      });

      resetBtn.addEventListener('click', function() {
        Object.keys(selected).forEach(function(k) { selected[k] = false; });
        topicBtns.forEach(function(b) { b.setAttribute('aria-pressed', 'false'); });
        render();
      });

      render();
    })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":28939,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":4220,"estimatedReadTimeSeconds":1064,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

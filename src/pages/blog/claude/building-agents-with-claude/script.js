(function() {
      var root = document.currentScript.closest('.hw-gendd-arc');
      if (!root) return;

      var stages = {
        '1': {
          label: 'Stage 1',
          headline: 'Manual conversation',
          body: "A human types a prompt. Claude responds. The whole interaction lives inside the chat. Real intelligence is on offer, but every turn requires a human at the keyboard. This is where most teams start, and for some kinds of work (thinking, drafting, analysis) it's also where they should stay.",
          who: "A human, every turn.",
          progress: 25,
          products: [
            { strong: "Claude.ai", rest: " (web, desktop, mobile chat). The conversation is the work. No file access, no autonomous execution." }
          ]
        },
        '2': {
          label: 'Stage 2',
          headline: 'Delegated execution',
          body: "A human gives Claude a goal, and Claude executes a multi-step plan against files, tools, or external systems. The human is still the one starting the work, but isn't watching every step. The agent reads, writes, runs commands, calls APIs, and reports back when done.",
          who: "A human starts each task; the agent runs each step.",
          progress: 50,
          products: [
            { strong: "Claude Code", rest: " for engineering work in a terminal." },
            { strong: "Claude Cowork", rest: " for desktop file and knowledge work." },
            { strong: "Claude Agent SDK", rest: " for custom agents in your code." },
            { strong: "Sub-agents and Agent Teams", rest: " for delegating inside a session." }
          ]
        },
        '3': {
          label: 'Stage 3',
          headline: 'Triggered execution',
          body: "Something other than a human starts the work: a clock strikes nine, a webhook fires from your monitoring tool, a pull request opens on GitHub, a file event matches. The human designed the trigger and the prompt, and reviews the output, but no human invokes each individual run. This is where Claude becomes genuinely agentic.",
          who: "A trigger starts the work. The human reviews the result.",
          progress: 75,
          products: [
            { strong: "Cowork Scheduled Tasks", rest: " (April 2026): hourly, daily, weekly, or weekday cadence for desktop knowledge work." },
            { strong: "Code Routines", rest: " (research preview): scheduled, API webhook, or GitHub event triggers running on Anthropic's cloud infrastructure." }
          ]
        },
        '4': {
          label: 'Stage 4',
          headline: 'Multi-agent autonomy',
          body: "Several agents coordinate on triggered work, with sub-agent delegation and Agent Team patterns inside. The system runs itself; human oversight is at the output level (was this work good?) and at the trigger level (should this still be running?), not the moment-to-moment execution.",
          who: "Triggers start the system. Multiple agents coordinate inside it.",
          progress: 100,
          products: [
            { strong: "Routines + Agent Teams", rest: ": a triggered routine spawns an Agent Team for the parallel phase, synthesizes, and reports." },
            { strong: "Managed Agents", rest: ": durable session log, stateless harness, designed for production multi-agent work." },
            { strong: "GenDD Pods", rest: ": HatchWorks' methodology layer that defines roles, permissions, and human checkpoints across the whole stack." }
          ]
        }
      };

      var stepBtns = root.querySelectorAll('.hw-gendd-arc-step');
      var labelEl = root.querySelector('[data-detail-label]');
      var headlineEl = root.querySelector('[data-detail-headline]');
      var bodyEl = root.querySelector('[data-detail-body]');
      var whoEl = root.querySelector('[data-detail-who]');
      var progressEl = root.querySelector('[data-progress]');
      var productsEl = root.querySelector('[data-products]');

      function activate(key) {
        var d = stages[key];
        if (!d) return;
        stepBtns.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.stage === key ? 'true' : 'false');
        });
        labelEl.textContent = d.label;
        headlineEl.textContent = d.headline;
        bodyEl.textContent = d.body;
        whoEl.textContent = d.who;
        progressEl.style.width = d.progress + '%';
        productsEl.innerHTML = d.products.map(function(p) {
          return '<li class="hw-gendd-arc-products-item">' +
            '<div class="hw-gendd-arc-products-dot"></div>' +
            '<div class="hw-gendd-arc-products-text"><strong>' + p.strong + '</strong>' + p.rest + '</div>' +
          '</li>';
        }).join('');
      }

      stepBtns.forEach(function(b) {
        b.addEventListener('click', function() { activate(b.dataset.stage); });
        b.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(b.dataset.stage); }
        });
      });

      activate('1');
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-stvr');
      if (!root) return;

      var data = {
        cowork: {
          name: 'Cowork Scheduled Tasks',
          rowClass: 'hw-gendd-stvr-detail-row-cowork',
          who: "Analysts, marketers, researchers, ops people, finance teams. Anyone doing knowledge work in Cowork who finds themselves running the same kind of task repeatedly.",
          runs: "Locally on your machine, inside the Claude Desktop app. Uses your local connectors, plugins, and Skills.",
          triggers: "Schedule only. Frequencies: hourly, daily, weekdays, weekly, manual. Plus run-on-demand from the dashboard.",
          when: "Only when your computer is awake AND the Claude Desktop app is open. If asleep or closed, the task is skipped and re-runs when you wake up your machine. You get a notification.",
          fit: "Daily briefings, weekly reports, recurring research, file organization, status summaries. Anything that operates on local files or your personal credentials, where missing a run by an hour or two is fine.",
        },
        code: {
          name: 'Code Routines',
          rowClass: 'hw-gendd-stvr-detail-row-code',
          who: "Engineering teams shipping AI into production workflows. Pro/Max/Team/Enterprise plans with Claude Code on the web enabled.",
          runs: "Anthropic-managed cloud infrastructure. Runs whether your laptop is closed or not. Repositories are cloned per run; environment is configurable.",
          triggers: "Three types, stackable on one routine: scheduled (1-hour minimum interval), API (per-routine /fire endpoint with bearer token), GitHub event (PR and release events with filter support).",
          when: "Continuously. The platform fires the trigger and runs the routine regardless of human presence. Scheduled runs convert local time to UTC automatically.",
          fit: "Pull-request review, deploy verification, alert triage, docs drift, library port. Anything that needs to fire reliably on production timing, against repositories, or in response to external events.",
        }
      };

      var cardBtns = root.querySelectorAll('.hw-gendd-stvr-card');
      var dimBtns = root.querySelectorAll('.hw-gendd-stvr-dim');
      var rowsEl = root.querySelector('[data-rows]');

      var state = { card: 'cowork', dim: 'who' };

      function render() {
        cardBtns.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.card === state.card ? 'true' : 'false');
        });
        dimBtns.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.dim === state.dim ? 'true' : 'false');
        });

        var order = ['cowork', 'code'];
        rowsEl.innerHTML = order.map(function(key) {
          var d = data[key];
          var emphasis = key === state.card ? 'style="background-color: rgba(233, 120, 69, 0.06);"' : '';
          return '<div class="hw-gendd-stvr-detail-row ' + d.rowClass + '" ' + emphasis + '>' +
            '<div class="hw-gendd-stvr-detail-row-name">' + d.name + '</div>' +
            '<div class="hw-gendd-stvr-detail-row-body">' + d[state.dim] + '</div>' +
          '</div>';
        }).join('');
      }

      cardBtns.forEach(function(b) {
        b.addEventListener('click', function() { state.card = b.dataset.card; render(); });
        b.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); state.card = b.dataset.card; render(); }
        });
      });
      dimBtns.forEach(function(b) {
        b.addEventListener('click', function() { state.dim = b.dataset.dim; render(); });
        b.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); state.dim = b.dataset.dim; render(); }
        });
      });

      render();
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-trig');
      if (!root) return;

      var answers = { initiator: null, frequency: null, 'cadence-tolerance': null };

      function recommend() {
        var i = answers.initiator, f = answers.frequency, c = answers['cadence-tolerance'];
        if (!i || !f || !c) return null;

        // Repo-driven: GitHub trigger, regardless of frequency
        if (i === 'repo') {
          return {
            kind: 'github', pill: 'GitHub event trigger', head: 'React to PRs and releases directly',
            reason: "When the work naturally starts with a code change, a GitHub event trigger is the right answer. Subscribe to pull_request.opened (or release events), add filters (author, base branch, draft state) to narrow the cases that fire, and the routine runs immediately when the event lands. Configure this on Code Routines; the Claude GitHub App handles delivery."
          };
        }

        // External-system-driven: API webhook, regardless of frequency
        if (i === 'external') {
          return {
            kind: 'api', pill: 'API webhook trigger', head: 'Wire your external system to the routine',
            reason: "When the work is initiated by an external system (an alert, a deploy, a status change), an API trigger gives that system a dedicated HTTP POST endpoint to call. Pass run-specific context in the request body's text field. Configure this on Code Routines; rotate the bearer token periodically. Add deduplication on the caller side to avoid over-firing on retries."
          };
        }

        // Clock-driven
        if (i === 'clock') {
          if (f === 'rare') {
            return {
              kind: 'manual', pill: 'On-demand or one-off schedule', head: "Don't put it on a recurring schedule",
              reason: "If the work runs days or weeks apart on an unpredictable cadence, a recurring schedule will fire it most of the time when there's nothing useful to do. Better: leave it as a regular Cowork task or Claude Code session and invoke it manually when needed. If you do know a specific future date, Code Routines supports one-off scheduled runs that fire once and disable themselves."
            };
          }
          if (c === 'tight' && f === 'steady') {
            return {
              kind: 'schedule', pill: 'Code Routine on a schedule', head: 'Use cloud schedules for tight timing',
              reason: "If timing matters and the cadence is predictable, use Code Routines on a schedule. The cloud infrastructure fires the routine reliably regardless of whether your laptop is on. Avoid Cowork Scheduled Tasks for tight-timing work; Cowork only fires when your computer is awake and Desktop is open, which means a 7 AM task can become a 9 AM task depending on when you log in."
            };
          }
          return {
            kind: 'schedule', pill: 'Schedule trigger', head: 'Run on a clock',
            reason: "Clock-driven, steady, with timing tolerance to spare: this is the canonical scheduled task. Use Cowork Scheduled Tasks if the work operates on your local files or personal credentials. Use Code Routines on a schedule if it should run reliably regardless of whether your computer is on, or if it operates on repositories rather than desktop files. Review the prompt every few months to catch drift."
          };
        }

        // Multiple starts
        if (i === 'multiple') {
          return {
            kind: 'combined', pill: 'Combined triggers', head: 'Stack triggers on one routine',
            reason: "When the work has several legitimate reasons to start, Code Routines lets you attach multiple triggers to the same configuration. A PR review routine can fire on pull_request.opened (GitHub trigger), also run nightly against unreviewed PRs (schedule trigger), and also expose an API endpoint for explicit re-checks (API trigger). One configuration, three reasons it might fire. Write the routine's prompt to handle whichever way it was started."
          };
        }

        return null;
      }

      var optBtns = root.querySelectorAll('.hw-gendd-trig-opt');
      var resultEl = root.querySelector('[data-result]');
      var labelEl = root.querySelector('[data-result-label]');
      var headEl = root.querySelector('[data-result-headline]');
      var reasonEl = root.querySelector('[data-result-reasoning]');
      var resetWrap = root.querySelector('[data-reset-wrap]');
      var resetBtn = root.querySelector('[data-reset]');

      function render() {
        var rec = recommend();
        if (!rec) {
          var answered = Object.values(answers).filter(function(v) { return v !== null; }).length;
          resultEl.classList.remove('is-complete','is-schedule','is-api','is-github','is-combined','is-manual');
          labelEl.textContent = answered === 0 ? 'Answer all three questions above' : (3 - answered) + ' more to go';
          headEl.textContent = 'Your recommendation will appear here';
          reasonEl.textContent = 'The right trigger type depends on what starts the work, how often it runs, and whether timing matters.';
          resetWrap.style.display = 'none';
          return;
        }
        resultEl.classList.add('is-complete');
        ['is-schedule','is-api','is-github','is-combined','is-manual'].forEach(function(c) { resultEl.classList.remove(c); });
        resultEl.classList.add('is-' + rec.kind);
        labelEl.textContent = 'Recommendation';
        headEl.innerHTML = '<span class="hw-gendd-trig-result-pill">' + rec.pill + '</span>' + rec.head;
        reasonEl.textContent = rec.reason;
        resetWrap.style.display = '';
      }

      optBtns.forEach(function(b) {
        b.addEventListener('click', function() {
          var q = b.dataset.q, v = b.dataset.v;
          answers[q] = v;
          var sibs = root.querySelectorAll('.hw-gendd-trig-opt[data-q="' + q + '"]');
          sibs.forEach(function(s) { s.setAttribute('aria-pressed', s === b ? 'true' : 'false'); });
          render();
        });
        b.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); }
        });
      });

      resetBtn.addEventListener('click', function() {
        answers = { initiator: null, frequency: null, 'cadence-tolerance': null };
        optBtns.forEach(function(o) { o.setAttribute('aria-pressed', 'false'); });
        render();
      });
      resetBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); resetBtn.click(); }
      });

      render();
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-stack');
      if (!root) return;

      var layers = {
        trigger: {
          eyebrow: 'Top layer',
          headline: 'Trigger \u2014 what starts the work',
          body: "The trigger answers \"why is this running right now?\" Schedule, API webhook, GitHub event, or some combination. Without a trigger, the agent only runs when a human invokes it. With a trigger, the agent runs when the work needs doing, on its own schedule."
        },
        capability: {
          eyebrow: 'Layer 4',
          headline: 'Capability \u2014 what the agent knows how to do',
          body: "Skills are the unit. A Skill is a markdown file with optional code that gets loaded when relevant, packaged into a reusable bundle. Skills carry the team's checklists, conventions, voice, and procedures. Progressive disclosure keeps context lean: only the relevant Skills load for any given task."
        },
        delegation: {
          eyebrow: 'Layer 3',
          headline: 'Delegation \u2014 how the work splits up',
          body: "Sub-agents (hierarchical, ~4-7x tokens) for work where pieces are independent and synthesis happens at the end. Agent Teams (peer, ~15x tokens) for work where pieces benefit from seeing each other's findings during the work. Most systems use sub-agents; reach for Agent Teams when peer coordination is genuinely needed."
        },
        runtime: {
          eyebrow: 'Layer 2',
          headline: 'Runtime \u2014 where the agent loop runs',
          body: "Agent SDK runs the loop in your process; Managed Agents runs it on Anthropic's infrastructure with durable session logs and stateless harnesses. For triggered work especially, the recovery guarantees of Managed Agents matter: a routine that crashes mid-run resumes from the last event rather than starting over."
        },
        governance: {
          eyebrow: 'Foundation',
          headline: 'Governance \u2014 what the agent is allowed to do',
          body: "Minimum-permission scoping (only the tools and connectors the work needs), explicit network access policy, branch-push restrictions, output review gates. This is the layer that's easy to skip and impossible to skip well. Governance is what makes autonomous execution actually safe to deploy."
        }
      };

      var cases = {
        pr: {
          label: 'Pull-request review example',
          trigger: "Code Routine subscribed to pull_request.opened events. Filters: skip drafts, require a specific label on PRs that touch sensitive areas.",
          capability: "Bundle of Skills: code review checklist, security review patterns, performance review patterns, team's output format. Only the relevant ones load per PR.",
          delegation: "Sub-agents handle parallel review of different concerns (security, performance, style). Each returns a structured finding list; the orchestrator merges and ranks by severity.",
          runtime: "Anthropic-managed cloud infrastructure (the routine's default runtime). Durable session log, stateless harness, automatic recovery if anything fails mid-review.",
          governance: "Read-only repo access, write access on PR comment thread, Trusted network, prompt explicitly tells the routine to skip and report rather than produce partial output if the PR is too large or touches protected areas."
        },
        brief: {
          label: 'Daily briefing example',
          trigger: "Cowork Scheduled Task on a daily cadence (7 AM local), with notification when the run completes.",
          capability: "Skills for summarizing Slack threads, parsing email, extracting calendar context, and formatting the briefing in the team's preferred shape.",
          delegation: "Usually single-session for a personal briefing. Sub-agents help if the briefing involves parallel research across several topics; rarely needed for a basic briefing.",
          runtime: "Cowork runs the task locally on the desktop. Only fires while the computer is awake and Desktop is open; missed runs re-fire on wake with a notification.",
          governance: "Connectors scoped to the specific Slack workspace, calendar, and email account this user owns. The briefing writes to a specific folder rather than anywhere on the filesystem."
        },
        alert: {
          label: 'Alert triage example',
          trigger: "API webhook fired by the monitoring tool when an error threshold is crossed. The alert body comes through in the request's text field; the routine receives it as run-specific context.",
          capability: "Skills for parsing stack traces, correlating logs with recent commits, drafting incident summaries, and posting structured proposed-fix PRs.",
          delegation: "Sub-agents in parallel: one investigates recent commits, one analyzes the stack trace, one searches similar past incidents. Orchestrator synthesizes findings into a single proposed-fix PR.",
          runtime: "Code Routine on Anthropic-managed cloud. Durable session means the on-call engineer can open the session URL hours later and continue the investigation if the auto-fix isn't accepted.",
          governance: "Connectors include the monitoring tool (read-only), the repository (read + claude/-prefixed branch push), and Slack (write to on-call channel only). The deduplication is on the caller side: the monitor only fires the webhook once per incident ID."
        }
      };

      var caseBtns = root.querySelectorAll('.hw-gendd-stack-case');
      var layerBtns = root.querySelectorAll('.hw-gendd-stack-layer');
      var eyebrowEl = root.querySelector('[data-detail-eyebrow]');
      var headlineEl = root.querySelector('[data-detail-headline]');
      var bodyEl = root.querySelector('[data-detail-body]');
      var exLabelEl = root.querySelector('[data-example-label]');
      var exTextEl = root.querySelector('[data-example-text]');

      var state = { case: 'pr', layer: 'trigger' };

      function render() {
        caseBtns.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.case === state.case ? 'true' : 'false');
        });
        layerBtns.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.layer === state.layer ? 'true' : 'false');
        });
        var l = layers[state.layer];
        var c = cases[state.case];
        eyebrowEl.textContent = l.eyebrow;
        headlineEl.textContent = l.headline;
        bodyEl.textContent = l.body;
        exLabelEl.textContent = c.label;
        exTextEl.textContent = c[state.layer];
      }

      caseBtns.forEach(function(b) {
        b.addEventListener('click', function() { state.case = b.dataset.case; render(); });
        b.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); state.case = b.dataset.case; render(); }
        });
      });
      layerBtns.forEach(function(b) {
        b.addEventListener('click', function() { state.layer = b.dataset.layer; render(); });
        b.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); state.layer = b.dataset.layer; render(); }
        });
      });

      render();
    })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":35376,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":5165,"estimatedReadTimeSeconds":1302,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

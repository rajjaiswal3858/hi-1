(function() {
      var root = document.currentScript.closest('.hw-gendd-topo');
      if (!root) return;

      // Hierarchical diagram: orchestrator at top, 3 sub-agents below
      var svgHier = '<svg viewBox="0 0 440 280" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
          '<marker id="tp-arr-hier" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">' +
            '<path class="hw-gendd-topo-arrowhead" d="M0,0 L0,6 L9,3 z"/>' +
          '</marker>' +
        '</defs>' +
        // Orchestrator
        '<rect class="hw-gendd-topo-node-orch" x="160" y="20" width="120" height="48" rx="6"/>' +
        '<text class="hw-gendd-topo-node-text-dark" x="220" y="42" text-anchor="middle" font-size="13">Orchestrator</text>' +
        '<text class="hw-gendd-topo-node-text-dark" x="220" y="58" text-anchor="middle" font-size="10" font-weight="400">main Claude session</text>' +
        // Edges down to sub-agents
        '<path class="hw-gendd-topo-edge" d="M220 68 L220 100 L80 100 L80 130" marker-end="url(#tp-arr-hier)"/>' +
        '<path class="hw-gendd-topo-edge" d="M220 68 L220 130" marker-end="url(#tp-arr-hier)"/>' +
        '<path class="hw-gendd-topo-edge" d="M220 68 L220 100 L360 100 L360 130" marker-end="url(#tp-arr-hier)"/>' +
        // Down-arrow labels (assigns)
        '<text class="hw-gendd-topo-label" x="142" y="116">assigns</text>' +
        '<text class="hw-gendd-topo-label" x="230" y="116">assigns</text>' +
        '<text class="hw-gendd-topo-label" x="320" y="116">assigns</text>' +
        // Sub-agents
        '<rect class="hw-gendd-topo-node-sub" x="30" y="140" width="100" height="46" rx="6"/>' +
        '<text class="hw-gendd-topo-node-text-light" x="80" y="160" text-anchor="middle" font-size="12">Sub-agent A</text>' +
        '<text class="hw-gendd-topo-node-text-light" x="80" y="175" text-anchor="middle" font-size="9" font-weight="400">own context</text>' +
        '<rect class="hw-gendd-topo-node-sub" x="170" y="140" width="100" height="46" rx="6"/>' +
        '<text class="hw-gendd-topo-node-text-light" x="220" y="160" text-anchor="middle" font-size="12">Sub-agent B</text>' +
        '<text class="hw-gendd-topo-node-text-light" x="220" y="175" text-anchor="middle" font-size="9" font-weight="400">own context</text>' +
        '<rect class="hw-gendd-topo-node-sub" x="310" y="140" width="100" height="46" rx="6"/>' +
        '<text class="hw-gendd-topo-node-text-light" x="360" y="160" text-anchor="middle" font-size="12">Sub-agent C</text>' +
        '<text class="hw-gendd-topo-node-text-light" x="360" y="175" text-anchor="middle" font-size="9" font-weight="400">own context</text>' +
        // Returns arrows (up to orchestrator)
        '<path class="hw-gendd-topo-edge" d="M80 186 L80 240 L220 240 L220 68" marker-end="url(#tp-arr-hier)" opacity="0.45"/>' +
        '<path class="hw-gendd-topo-edge" d="M220 186 L220 230 L221 230" marker-end="url(#tp-arr-hier)" opacity="0.45"/>' +
        '<path class="hw-gendd-topo-edge" d="M360 186 L360 240 L220 240" opacity="0.45"/>' +
        '<text class="hw-gendd-topo-label" x="160" y="255" text-anchor="middle">results return to orchestrator only</text>' +
      '</svg>';

      // Peer diagram: shared task list in middle, 3 teammates around it, lines to/from
      var svgPeer = '<svg viewBox="0 0 440 280" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
          '<marker id="tp-arr-peer" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">' +
            '<path class="hw-gendd-topo-arrowhead-teal" d="M0,0 L0,6 L9,3 z"/>' +
          '</marker>' +
        '</defs>' +
        // Shared state in middle
        '<rect class="hw-gendd-topo-node-state" x="155" y="105" width="130" height="70" rx="6"/>' +
        '<text class="hw-gendd-topo-node-text-light" x="220" y="128" text-anchor="middle" font-size="12">Shared task list</text>' +
        '<text class="hw-gendd-topo-node-text-light" x="220" y="144" text-anchor="middle" font-size="9" font-weight="400">.claude/tasks.md</text>' +
        '<text class="hw-gendd-topo-node-text-light" x="220" y="160" text-anchor="middle" font-size="9" font-weight="400">file on disk</text>' +
        // Teammates around it
        '<rect class="hw-gendd-topo-node-team" x="30" y="30" width="100" height="46" rx="6"/>' +
        '<text class="hw-gendd-topo-node-text-light" x="80" y="50" text-anchor="middle" font-size="12">Teammate A</text>' +
        '<text class="hw-gendd-topo-node-text-light" x="80" y="65" text-anchor="middle" font-size="9" font-weight="400">claims + writes</text>' +
        '<rect class="hw-gendd-topo-node-team" x="310" y="30" width="100" height="46" rx="6"/>' +
        '<text class="hw-gendd-topo-node-text-light" x="360" y="50" text-anchor="middle" font-size="12">Teammate B</text>' +
        '<text class="hw-gendd-topo-node-text-light" x="360" y="65" text-anchor="middle" font-size="9" font-weight="400">claims + writes</text>' +
        '<rect class="hw-gendd-topo-node-team" x="170" y="208" width="100" height="46" rx="6"/>' +
        '<text class="hw-gendd-topo-node-text-light" x="220" y="228" text-anchor="middle" font-size="12">Teammate C</text>' +
        '<text class="hw-gendd-topo-node-text-light" x="220" y="243" text-anchor="middle" font-size="9" font-weight="400">claims + writes</text>' +
        // Bidirectional edges between each teammate and the shared state
        '<path class="hw-gendd-topo-edge-dashed" d="M125 70 L165 110" marker-end="url(#tp-arr-peer)"/>' +
        '<path class="hw-gendd-topo-edge-dashed" d="M170 105 L130 75" marker-end="url(#tp-arr-peer)"/>' +
        '<path class="hw-gendd-topo-edge-dashed" d="M315 70 L280 110" marker-end="url(#tp-arr-peer)"/>' +
        '<path class="hw-gendd-topo-edge-dashed" d="M275 105 L310 75" marker-end="url(#tp-arr-peer)"/>' +
        '<path class="hw-gendd-topo-edge-dashed" d="M220 208 L220 178" marker-end="url(#tp-arr-peer)"/>' +
        '<path class="hw-gendd-topo-edge-dashed" d="M218 175 L218 205" marker-end="url(#tp-arr-peer)"/>' +
      '</svg>';

      var topos = {
        hier: {
          svg: svgHier,
          label: 'Hierarchical',
          headline: 'Orchestrator-led delegation',
          rows: [
            { label: 'Coordination', value: "An orchestrator (the main Claude session) breaks the work down, assigns tasks to sub-agents, and synthesizes their results." },
            { label: 'Communication', value: "One-way down (orchestrator \u2192 sub-agent), one-way up (results \u2192 orchestrator). Sub-agents never talk to each other." },
            { label: 'Context model', value: "Each sub-agent has its own isolated context window. The orchestrator's context stays clean." },
            { label: 'Token cost', value: "~4\u20137x a single-agent session, per Anthropic's documentation. Each sub-agent runs in its own session." },
            { label: 'Best for', value: "Tasks where the decomposition strategy is clear and results from one sub-task don't affect another." },
          ]
        },
        peer: {
          svg: svgPeer,
          label: 'Peer',
          headline: 'Self-distributed collaboration',
          rows: [
            { label: 'Coordination', value: "There is no orchestrator. Teammates read and write to a shared task list on disk. They claim work as they finish previous tasks." },
            { label: 'Communication', value: "All through the shared file. Teammates leave findings, mark dependencies, and reference each other's work via the file system." },
            { label: 'Context model', value: "Each teammate has its own isolated context. The shared file is the only common state. No central session holds the whole picture." },
            { label: 'Token cost', value: "~15x a single-agent session, per Anthropic's documentation. Coordination overhead is real and meaningful." },
            { label: 'Best for', value: "Large volumes of independent work where teammates benefit from seeing each other's findings: research, parallel module builds, debugging with competing hypotheses." },
          ]
        }
      };

      var tabs = root.querySelectorAll('.hw-gendd-topo-tab');
      var svgWrap = root.querySelector('[data-svg-wrap]');
      var labelEl = root.querySelector('[data-detail-label]');
      var headlineEl = root.querySelector('[data-detail-headline]');
      var rowsEl = root.querySelector('[data-detail-rows]');

      function activate(key) {
        var data = topos[key];
        if (!data) return;
        tabs.forEach(function(t) {
          t.setAttribute('aria-pressed', t.dataset.topo === key ? 'true' : 'false');
        });
        svgWrap.innerHTML = data.svg;
        labelEl.textContent = data.label;
        headlineEl.textContent = data.headline;
        rowsEl.innerHTML = data.rows.map(function(r) {
          return '<div class="hw-gendd-topo-detail-row">' +
            '<div class="hw-gendd-topo-detail-rowlbl">' + r.label + '</div>' +
            '<div class="hw-gendd-topo-detail-rowval">' + r.value + '</div>' +
          '</div>';
        }).join('');
      }

      tabs.forEach(function(t) {
        t.addEventListener('click', function() { activate(t.dataset.topo); });
        t.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(t.dataset.topo); }
        });
      });

      activate('hier');
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-saatv');
      if (!root) return;

      var data = {
        sub: {
          name: 'Sub-agents',
          rowClass: 'hw-gendd-saatv-detail-row-sub',
          coord: "Orchestrator-led. The main Claude session decomposes the work, assigns tasks, and synthesizes results. One-way down, one-way up.",
          cost: "~4\u20137x a single-agent session, per Anthropic. Each sub-agent is its own Claude session with its own startup overhead.",
          status: "Generally available since 2025. Stable and well-documented.",
          fit: "Work that benefits from context isolation: code review, documentation generation, test running, anything where intermediate steps would clutter the main thread.",
          failure: "Two opposite failure modes: (1) under-invocation, because auto-routing is unreliable and Claude often handles tasks in the main session even when a sub-agent matches; (2) over-delegation, especially with Opus 4.6, which tends to spawn sub-agents for work the main session could do directly.",
        },
        team: {
          name: 'Agent Teams',
          rowClass: 'hw-gendd-saatv-detail-row-team',
          coord: "Self-distributed. Teammates read and write to a shared task list on disk. No central session routes work in real time; the file is the coordination layer.",
          cost: "~15x a single-agent session, per Anthropic. Coordination overhead is real and significant.",
          status: "Research preview, launched February 2026. Disabled by default; enabled via CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 environment variable.",
          fit: "Work that benefits from teammates seeing each other's findings: research with multiple competing investigations, parallel module development, debugging with competing hypotheses, cross-layer changes.",
          failure: "Token cost burn from spinning up teams where the work doesn't actually benefit from peer coordination. If teammates don't reference each other's work, you're paying the 15x multiplier for nothing.",
        }
      };

      var dimLabels = {
        coord: 'Coordination',
        cost: 'Token cost',
        status: 'Availability',
        fit: 'Best fit',
        failure: 'Common failure',
      };

      var cardBtns = root.querySelectorAll('.hw-gendd-saatv-card');
      var dimBtns = root.querySelectorAll('.hw-gendd-saatv-dim');
      var rowsEl = root.querySelector('[data-rows]');

      var state = { card: 'sub', dim: 'coord' };

      function render() {
        cardBtns.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.card === state.card ? 'true' : 'false');
        });
        dimBtns.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.dim === state.dim ? 'true' : 'false');
        });

        var order = ['sub', 'team'];
        rowsEl.innerHTML = order.map(function(key) {
          var d = data[key];
          var emphasis = key === state.card ? 'style="background-color: rgba(233, 120, 69, 0.06);"' : '';
          return '<div class="hw-gendd-saatv-detail-row ' + d.rowClass + '" ' + emphasis + '>' +
            '<div class="hw-gendd-saatv-detail-row-name">' + d.name + '</div>' +
            '<div class="hw-gendd-saatv-detail-row-body">' + d[state.dim] + '</div>' +
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
      var root = document.currentScript.closest('.hw-gendd-deleg');
      if (!root) return;

      var answers = { parallel: null, visibility: null, phases: null };

      function recommend() {
        var p = answers.parallel, v = answers.visibility, ph = answers.phases;
        if (!p || !v || !ph) return null;

        // No parallelism at all → single session
        if (p === 'no') {
          return {
            kind: 'single', pill: 'Single session', head: 'Stay in one Claude session',
            reason: "If the work is sequential or single-threaded, multi-agent setups add cost without benefit. A single focused session has roughly the same effective capability as one engineer with good context, and there's no coordination overhead. Use sub-agents inside the session only if specific subtasks would clutter the main context (a long code review that returns three findings, for example)."
          };
        }

        // Parallelism + phased → hybrid
        if (ph === 'yes') {
          return {
            kind: 'hybrid', pill: 'Hybrid', head: 'Orchestrator at the top, Agent Team inside',
            reason: "Multi-phase projects often want both patterns. The top-level orchestrator owns the overall shape and decomposes the work. When you hit the parallel phase, spawn an Agent Team for the parts that benefit from peer coordination, and have the team synthesize back to the orchestrator. This is Anthropic's recommended pattern for complex workflows. You get top-down control where you need it and lateral coordination where the work calls for it."
          };
        }

        // Parallelism + no phases + workers independent → sub-agents
        if (v === 'no') {
          return {
            kind: 'sub', pill: 'Sub-agents', head: 'Hierarchical, orchestrator-led',
            reason: "If workers are independent and don't need to see each other's findings during the work, sub-agents are the right call. Each sub-agent gets a focused task in an isolated context, returns a result, and the orchestrator synthesizes. ~4-7x token cost vs a single session. Examples: parallel code review across many files, generating documentation across multiple modules, running independent test suites."
          };
        }

        // Parallelism + no phases + workers need visibility → Agent Team
        return {
          kind: 'team', pill: 'Agent Team', head: 'Peer collaboration with shared task list',
          reason: "If workers benefit from seeing each other's progress, Agent Teams is the call. Teammates share a task list on disk, claim work, write findings back, and reference each other's outputs. ~15x token cost vs a single session, but the cost pays for itself when the work genuinely benefits from peer coordination. Examples: research with competing hypotheses, parallel module builds where teammates need to reconcile interfaces, debugging that converges on a root cause from multiple angles. Enable with CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1."
        };
      }

      var optBtns = root.querySelectorAll('.hw-gendd-deleg-opt');
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
          resultEl.classList.remove('is-complete','is-single','is-sub','is-team','is-hybrid');
          labelEl.textContent = answered === 0 ? 'Answer all three questions above' : (3 - answered) + ' more to go';
          headEl.textContent = 'Your recommendation will appear here';
          reasonEl.textContent = 'The choice depends on whether the work parallelizes, whether workers benefit from seeing each other, and whether the project has distinct phases.';
          resetWrap.style.display = 'none';
          return;
        }
        resultEl.classList.add('is-complete');
        ['is-single','is-sub','is-team','is-hybrid'].forEach(function(c) { resultEl.classList.remove(c); });
        resultEl.classList.add('is-' + rec.kind);
        labelEl.textContent = 'Recommendation';
        headEl.innerHTML = '<span class="hw-gendd-deleg-result-pill">' + rec.pill + '</span>' + rec.head;
        reasonEl.textContent = rec.reason;
        resetWrap.style.display = '';
      }

      optBtns.forEach(function(b) {
        b.addEventListener('click', function() {
          var q = b.dataset.q, v = b.dataset.v;
          answers[q] = v;
          var sibs = root.querySelectorAll('.hw-gendd-deleg-opt[data-q="' + q + '"]');
          sibs.forEach(function(s) { s.setAttribute('aria-pressed', s === b ? 'true' : 'false'); });
          render();
        });
        b.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); }
        });
      });

      resetBtn.addEventListener('click', function() {
        answers = { parallel: null, visibility: null, phases: null };
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
      var root = document.currentScript.closest('.hw-gendd-dpat');
      if (!root) return;

      // SVG: Map-Reduce — orchestrator → fan out → fan back
      var svgMap = '<svg viewBox="0 0 420 240" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="dp-arr-map" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">' +
        '<path class="hw-gendd-dpat-svg-arrowhead" d="M0,0 L0,6 L9,3 z"/></marker></defs>' +
        // Orchestrator
        '<rect class="hw-gendd-dpat-svg-orch" x="160" y="14" width="100" height="38" rx="5"/>' +
        '<text class="hw-gendd-dpat-svg-text-dark" x="210" y="38" text-anchor="middle" font-size="12">Orchestrator</text>' +
        // Fan-out arrows
        '<path class="hw-gendd-dpat-svg-edge" d="M210 52 L210 80 L60 80 L60 100" marker-end="url(#dp-arr-map)"/>' +
        '<path class="hw-gendd-dpat-svg-edge" d="M210 52 L210 100" marker-end="url(#dp-arr-map)"/>' +
        '<path class="hw-gendd-dpat-svg-edge" d="M210 52 L210 80 L360 80 L360 100" marker-end="url(#dp-arr-map)"/>' +
        // Sub-agents
        '<rect class="hw-gendd-dpat-svg-sub" x="20" y="108" width="80" height="38" rx="5"/>' +
        '<text class="hw-gendd-dpat-svg-text-light" x="60" y="132" text-anchor="middle" font-size="11">Worker 1</text>' +
        '<rect class="hw-gendd-dpat-svg-sub" x="170" y="108" width="80" height="38" rx="5"/>' +
        '<text class="hw-gendd-dpat-svg-text-light" x="210" y="132" text-anchor="middle" font-size="11">Worker 2</text>' +
        '<rect class="hw-gendd-dpat-svg-sub" x="320" y="108" width="80" height="38" rx="5"/>' +
        '<text class="hw-gendd-dpat-svg-text-light" x="360" y="132" text-anchor="middle" font-size="11">Worker 3</text>' +
        // Reduce arrows back up
        '<path class="hw-gendd-dpat-svg-edge" d="M60 146 L60 175 L210 175 L210 52" stroke-dasharray="3 3" opacity="0.45" marker-end="url(#dp-arr-map)"/>' +
        '<path class="hw-gendd-dpat-svg-edge" d="M210 146 L210 165" stroke-dasharray="3 3" opacity="0.45" marker-end="url(#dp-arr-map)"/>' +
        '<path class="hw-gendd-dpat-svg-edge" d="M360 146 L360 175 L210 175" stroke-dasharray="3 3" opacity="0.45"/>' +
        '<text x="210" y="200" text-anchor="middle" font-size="10" fill="#5b6470">Workers \u2192 results \u2192 orchestrator synthesizes</text>' +
      '</svg>';

      // SVG: Scrum — shared task list in middle, teammates around it pulling work
      var svgScrum = '<svg viewBox="0 0 420 240" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="dp-arr-scrum" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">' +
        '<path class="hw-gendd-dpat-svg-arrowhead-teal" d="M0,0 L0,6 L9,3 z"/></marker></defs>' +
        // Shared task list center
        '<rect class="hw-gendd-dpat-svg-state" x="155" y="92" width="110" height="60" rx="5"/>' +
        '<text class="hw-gendd-dpat-svg-text-light" x="210" y="115" text-anchor="middle" font-size="11">Shared task list</text>' +
        '<text class="hw-gendd-dpat-svg-text-light" x="210" y="132" text-anchor="middle" font-size="9" font-weight="400">file on disk</text>' +
        // Three teammates
        '<rect class="hw-gendd-dpat-svg-team" x="20" y="20" width="90" height="38" rx="5"/>' +
        '<text class="hw-gendd-dpat-svg-text-light" x="65" y="44" text-anchor="middle" font-size="11">Teammate 1</text>' +
        '<rect class="hw-gendd-dpat-svg-team" x="310" y="20" width="90" height="38" rx="5"/>' +
        '<text class="hw-gendd-dpat-svg-text-light" x="355" y="44" text-anchor="middle" font-size="11">Teammate 2</text>' +
        '<rect class="hw-gendd-dpat-svg-team" x="165" y="186" width="90" height="38" rx="5"/>' +
        '<text class="hw-gendd-dpat-svg-text-light" x="210" y="210" text-anchor="middle" font-size="11">Teammate 3</text>' +
        // Bidirectional dashed edges
        '<path class="hw-gendd-dpat-svg-edge-dashed" d="M110 50 L160 95" marker-end="url(#dp-arr-scrum)"/>' +
        '<path class="hw-gendd-dpat-svg-edge-dashed" d="M165 92 L115 55" marker-end="url(#dp-arr-scrum)"/>' +
        '<path class="hw-gendd-dpat-svg-edge-dashed" d="M310 50 L262 95" marker-end="url(#dp-arr-scrum)"/>' +
        '<path class="hw-gendd-dpat-svg-edge-dashed" d="M256 92 L305 55" marker-end="url(#dp-arr-scrum)"/>' +
        '<path class="hw-gendd-dpat-svg-edge-dashed" d="M210 186 L210 156" marker-end="url(#dp-arr-scrum)"/>' +
        '<path class="hw-gendd-dpat-svg-edge-dashed" d="M205 152 L205 184" marker-end="url(#dp-arr-scrum)"/>' +
      '</svg>';

      // SVG: Hybrid — orchestrator at top, fans out to an Agent Team, results come back
      var svgHybrid = '<svg viewBox="0 0 420 240" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="dp-arr-hyb" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">' +
        '<path class="hw-gendd-dpat-svg-arrowhead" d="M0,0 L0,6 L9,3 z"/></marker>' +
        '<marker id="dp-arr-hyb-teal" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">' +
        '<path class="hw-gendd-dpat-svg-arrowhead-teal" d="M0,0 L0,6 L9,3 z"/></marker></defs>' +
        // Orchestrator
        '<rect class="hw-gendd-dpat-svg-orch" x="160" y="10" width="100" height="38" rx="5"/>' +
        '<text class="hw-gendd-dpat-svg-text-dark" x="210" y="34" text-anchor="middle" font-size="12">Orchestrator</text>' +
        // Phase boundary - dashed box around the team
        '<rect x="40" y="76" width="340" height="135" rx="6" fill="rgba(59,173,188,0.07)" stroke="#3badbc" stroke-dasharray="4 3" stroke-width="1.2"/>' +
        '<text x="60" y="92" font-size="10" fill="#3badbc" font-weight="700">PARALLEL PHASE: AGENT TEAM</text>' +
        // Down arrow from orchestrator
        '<path class="hw-gendd-dpat-svg-edge" d="M210 48 L210 70" marker-end="url(#dp-arr-hyb)"/>' +
        // Shared state for team
        '<rect class="hw-gendd-dpat-svg-state" x="170" y="116" width="80" height="40" rx="5"/>' +
        '<text class="hw-gendd-dpat-svg-text-light" x="210" y="140" text-anchor="middle" font-size="10">Task list</text>' +
        // Teammates
        '<rect class="hw-gendd-dpat-svg-team" x="60" y="106" width="80" height="32" rx="5"/>' +
        '<text class="hw-gendd-dpat-svg-text-light" x="100" y="126" text-anchor="middle" font-size="10">Teammate 1</text>' +
        '<rect class="hw-gendd-dpat-svg-team" x="280" y="106" width="80" height="32" rx="5"/>' +
        '<text class="hw-gendd-dpat-svg-text-light" x="320" y="126" text-anchor="middle" font-size="10">Teammate 2</text>' +
        '<rect class="hw-gendd-dpat-svg-team" x="170" y="170" width="80" height="32" rx="5"/>' +
        '<text class="hw-gendd-dpat-svg-text-light" x="210" y="190" text-anchor="middle" font-size="10">Teammate 3</text>' +
        // Dashed edges between teammates and shared state
        '<path class="hw-gendd-dpat-svg-edge-dashed" d="M140 122 L170 135"/>' +
        '<path class="hw-gendd-dpat-svg-edge-dashed" d="M280 122 L250 135"/>' +
        '<path class="hw-gendd-dpat-svg-edge-dashed" d="M210 170 L210 156"/>' +
        // Synthesis back to orchestrator (curved arrow)
        '<path class="hw-gendd-dpat-svg-edge" d="M380 100 C 395 70, 380 50, 270 30" stroke-dasharray="3 3" opacity="0.5" marker-end="url(#dp-arr-hyb)"/>' +
        '<text x="395" y="55" font-size="9" fill="#5b6470" transform="rotate(-15 395 55)">synthesis</text>' +
      '</svg>';

      var pats = {
        map: {
          svg: svgMap,
          best: "Lots of independent units of work, each producing a small result that gets rolled up. The orchestrator decomposes once, each worker does its piece, the orchestrator synthesizes.",
          avoid: "Workers need to see each other's findings, or the decomposition itself depends on results from earlier work. The flat fan-out can't accommodate dependencies that emerge mid-flight.",
          example: "Reviewing fifty source files: spawn one sub-agent per file (or batch), have each return findings in a structured format, orchestrator merges the lists and ranks by severity."
        },
        scrum: {
          svg: svgScrum,
          best: "Work where teammates benefit from seeing each other's progress: research with multiple hypotheses, parallel module builds where interfaces need to match, debugging that converges from multiple angles.",
          avoid: "Sequential work, same-file edits, or anything where one teammate's output blocks all the others. The peer model can't enforce strict ordering, and coordination overhead dominates when the work doesn't actually need it.",
          example: "Researching three competing approaches to a database migration: one teammate per approach, all reading and updating a shared findings file, converging on which approach handles the edge cases best."
        },
        hybrid: {
          svg: svgHybrid,
          best: "Complex projects with distinct phases. Orchestrator handles overall shape and the parts that are sequential or single-threaded; spawns an Agent Team for the parallel-and-coordinated phase, then takes the team's synthesis and continues.",
          avoid: "Simple, single-phase work. The hybrid adds infrastructure overhead that only pays off when the project genuinely has both shapes inside it.",
          example: "Refactoring across frontend, backend, and tests. Orchestrator plans the change; spawns an Agent Team where each teammate owns one layer and reads the others' changes through the shared file; orchestrator integrates and runs the final test pass."
        }
      };

      var cardBtns = root.querySelectorAll('.hw-gendd-dpat-card');
      var svgEl = root.querySelector('[data-svg]');
      var bestEl = root.querySelector('[data-best]');
      var avoidEl = root.querySelector('[data-avoid]');
      var exampleEl = root.querySelector('[data-example]');

      function activate(key) {
        var p = pats[key];
        if (!p) return;
        cardBtns.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.pat === key ? 'true' : 'false');
        });
        svgEl.innerHTML = p.svg;
        bestEl.textContent = p.best;
        avoidEl.textContent = p.avoid;
        exampleEl.textContent = p.example;
      }

      cardBtns.forEach(function(b) {
        b.addEventListener('click', function() { activate(b.dataset.pat); });
        b.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(b.dataset.pat); }
        });
      });

      activate('map');
    })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":35373,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":3963,"estimatedReadTimeSeconds":999,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

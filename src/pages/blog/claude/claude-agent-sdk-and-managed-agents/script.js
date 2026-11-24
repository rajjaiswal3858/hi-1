(function() {
      var root = document.currentScript.closest('.hw-gendd-arch');
      if (!root) return;

      // SVG: Coupled — single container holds brain + hands + session
      var svgCoupled = '<svg viewBox="0 0 440 320" xmlns="http://www.w3.org/2000/svg">' +
        // Container boundary
        '<rect x="50" y="40" width="340" height="240" rx="10" fill="rgba(176,70,70,0.06)" stroke="#b04646" stroke-width="1.5" stroke-dasharray="5 3"/>' +
        '<text x="220" y="62" text-anchor="middle" font-size="11" fill="#b04646" font-weight="700" letter-spacing="0.08em">ONE CONTAINER (PET)</text>' +
        // Brain
        '<rect x="80" y="92" width="120" height="50" rx="6" fill="#e97845"/>' +
        '<text x="140" y="115" text-anchor="middle" font-size="12" font-weight="700" fill="#151920">Brain</text>' +
        '<text x="140" y="131" text-anchor="middle" font-size="10" fill="#151920">Claude + harness</text>' +
        // Hands
        '<rect x="240" y="92" width="120" height="50" rx="6" fill="#10758b"/>' +
        '<text x="300" y="115" text-anchor="middle" font-size="12" font-weight="700" fill="#ffffff">Hands</text>' +
        '<text x="300" y="131" text-anchor="middle" font-size="10" fill="#ffffff">Sandbox + tools</text>' +
        // Session
        '<rect x="160" y="180" width="120" height="50" rx="6" fill="#151920"/>' +
        '<text x="220" y="203" text-anchor="middle" font-size="12" font-weight="700" fill="#ffffff">Session</text>' +
        '<text x="220" y="219" text-anchor="middle" font-size="10" fill="#ffffff">Event log</text>' +
        // Connecting lines (tightly coupled - solid double lines)
        '<line x1="200" y1="117" x2="240" y2="117" stroke="#363943" stroke-width="2"/>' +
        '<line x1="170" y1="142" x2="190" y2="180" stroke="#363943" stroke-width="2"/>' +
        '<line x1="270" y1="142" x2="250" y2="180" stroke="#363943" stroke-width="2"/>' +
        // Warning label
        '<text x="220" y="262" text-anchor="middle" font-size="11" fill="#b04646" font-weight="700">If anything fails, the whole thing fails</text>' +
      '</svg>';

      // SVG: Decoupled — three separate boxes with interface arrows
      var svgDecoupled = '<svg viewBox="0 0 440 320" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
          '<marker id="ar-arr" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">' +
            '<path d="M0,0 L0,6 L9,3 z" fill="#363943"/>' +
          '</marker>' +
        '</defs>' +
        // Three labeled regions, none containing the others
        // Brain region
        '<rect x="20" y="32" width="170" height="100" rx="10" fill="rgba(233,120,69,0.06)" stroke="#e97845" stroke-width="1.5" stroke-dasharray="4 3"/>' +
        '<text x="105" y="52" text-anchor="middle" font-size="10" fill="#e97845" font-weight="700" letter-spacing="0.08em">BRAIN</text>' +
        '<rect x="40" y="62" width="130" height="56" rx="6" fill="#e97845"/>' +
        '<text x="105" y="84" text-anchor="middle" font-size="12" font-weight="700" fill="#151920">Harness</text>' +
        '<text x="105" y="100" text-anchor="middle" font-size="9" fill="#151920">Claude + the loop</text>' +
        '<text x="105" y="111" text-anchor="middle" font-size="9" fill="#151920">stateless, cattle</text>' +
        // Hands region
        '<rect x="250" y="32" width="170" height="100" rx="10" fill="rgba(16,117,139,0.06)" stroke="#10758b" stroke-width="1.5" stroke-dasharray="4 3"/>' +
        '<text x="335" y="52" text-anchor="middle" font-size="10" fill="#10758b" font-weight="700" letter-spacing="0.08em">HANDS</text>' +
        '<rect x="270" y="62" width="130" height="56" rx="6" fill="#10758b"/>' +
        '<text x="335" y="84" text-anchor="middle" font-size="12" font-weight="700" fill="#ffffff">Sandbox</text>' +
        '<text x="335" y="100" text-anchor="middle" font-size="9" fill="#ffffff">Container, tools, MCP</text>' +
        '<text x="335" y="111" text-anchor="middle" font-size="9" fill="#ffffff">replaceable, cattle</text>' +
        // Session region
        '<rect x="135" y="180" width="170" height="100" rx="10" fill="rgba(21,25,32,0.06)" stroke="#151920" stroke-width="1.5" stroke-dasharray="4 3"/>' +
        '<text x="220" y="200" text-anchor="middle" font-size="10" fill="#151920" font-weight="700" letter-spacing="0.08em">SESSION</text>' +
        '<rect x="155" y="210" width="130" height="56" rx="6" fill="#151920"/>' +
        '<text x="220" y="232" text-anchor="middle" font-size="12" font-weight="700" fill="#ffffff">Event log</text>' +
        '<text x="220" y="248" text-anchor="middle" font-size="9" fill="#ffffff">append-only, durable</text>' +
        '<text x="220" y="259" text-anchor="middle" font-size="9" fill="#ffffff">survives crashes</text>' +
        // Interface arrows with labels
        '<path d="M170 90 L270 90" stroke="#363943" stroke-width="1.5" marker-end="url(#ar-arr)" fill="none"/>' +
        '<text x="220" y="82" text-anchor="middle" font-size="9" fill="#5b6470" font-family="ui-monospace, monospace">execute()</text>' +
        '<path d="M270 95 L170 95" stroke="#363943" stroke-width="1.5" marker-end="url(#ar-arr)" fill="none"/>' +
        '<text x="220" y="108" text-anchor="middle" font-size="9" fill="#5b6470" font-family="ui-monospace, monospace">result</text>' +
        '<path d="M150 120 L195 210" stroke="#363943" stroke-width="1.5" marker-end="url(#ar-arr)" fill="none"/>' +
        '<text x="148" y="170" text-anchor="middle" font-size="9" fill="#5b6470" font-family="ui-monospace, monospace" transform="rotate(60 148 170)">emitEvent()</text>' +
        '<path d="M218 210 L172 130" stroke="#363943" stroke-width="1.5" marker-end="url(#ar-arr)" fill="none"/>' +
        '<text x="200" y="170" text-anchor="middle" font-size="9" fill="#5b6470" font-family="ui-monospace, monospace" transform="rotate(60 200 170)">getEvents()</text>' +
      '</svg>';

      var data = {
        coupled: {
          svg: svgCoupled,
          label: 'Coupled',
          headline: 'Everything in one container ("pet")',
          rows: [
            { label: 'Mental model', val: "Brain, hands, and session live together in a single named container. When the container is healthy, the agent is healthy. When the container is sick, every component is sick at once." },
            { label: 'Failure mode', val: "A bug in the harness, a packet drop in the event stream, or a container going offline all look the same from outside. Debugging means opening a shell inside the container, which often holds user data, so you essentially can't debug." },
            { label: 'Scaling problem', val: "Every session pays the full container setup cost up front, even sessions that don't need a sandbox. Every brain needs its own container before it can do any work." },
            { label: 'Security problem', val: "Untrusted code generated by Claude runs in the same container as credentials. A prompt injection only has to convince Claude to read its own environment to get tokens." },
          ]
        },
        decoupled: {
          svg: svgDecoupled,
          label: 'Decoupled',
          headline: 'Independent interfaces ("cattle")',
          rows: [
            { label: 'Mental model', val: "Three components, three interfaces. The brain calls hands via execute(). Hands return results. The session is queried by getEvents() and updated by emitEvent(). Each component can fail and be replaced without touching the others." },
            { label: 'Recovery', val: "Container dies? Harness catches it as a tool-call error and Claude can retry with a fresh container. Harness crashes? A new one boots, reads the session log, picks up from the last event. Nothing in the harness needs to survive a crash." },
            { label: 'Scaling win', val: "Inference can start as soon as the orchestration layer reads pending events from the session log. Containers are provisioned only if needed. Anthropic reports p50 TTFT dropped ~60% and p95 dropped over 90% with this change." },
            { label: 'Security win', val: "Credentials live in a vault outside the sandbox. Auth tokens are wired into resources during sandbox init (e.g. git remote) so Claude can act without ever holding the token. MCP calls go through a proxy that fetches credentials from the vault." },
          ]
        }
      };

      var tabs = root.querySelectorAll('.hw-gendd-arch-tab');
      var svgEl = root.querySelector('[data-svg]');
      var labelEl = root.querySelector('[data-info-label]');
      var headlineEl = root.querySelector('[data-info-headline]');
      var rowsEl = root.querySelector('[data-info-rows]');

      function activate(key) {
        var d = data[key];
        if (!d) return;
        tabs.forEach(function(t) {
          t.setAttribute('aria-pressed', t.dataset.arch === key ? 'true' : 'false');
        });
        svgEl.innerHTML = d.svg;
        labelEl.textContent = d.label;
        headlineEl.textContent = d.headline;
        rowsEl.innerHTML = d.rows.map(function(r) {
          return '<div class="hw-gendd-arch-info-row">' +
            '<div class="hw-gendd-arch-info-rowlbl">' + r.label + '</div>' +
            '<div class="hw-gendd-arch-info-rowval">' + r.val + '</div>' +
          '</div>';
        }).join('');
      }

      tabs.forEach(function(t) {
        t.addEventListener('click', function() { activate(t.dataset.arch); });
        t.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(t.dataset.arch); }
        });
      });

      activate('coupled');
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-write');
      if (!root) return;

      // Helper to compose color-tagged code lines into HTML
      function code(lines) {
        return lines.map(function(line) {
          if (typeof line === 'string') return line;
          // Array of segments
          return line.map(function(seg) {
            if (typeof seg === 'string') return seg;
            var cls = 'hw-gendd-write-code-' + (seg.kind || 'plain');
            return '<span class="' + cls + '">' + seg.t + '</span>';
          }).join('');
        }).join('\n');
      }

      var tasks = {
        bug: {
          sdk: {
            lines: [
              [{ kind: 'comment', t: '# Agent runs in your Python process' }],
              [{ kind: 'key', t: 'from' }, { kind: 'plain', t: ' claude_agent_sdk ' }, { kind: 'key', t: 'import' }, { kind: 'plain', t: ' query, ClaudeAgentOptions' }],
              '',
              [{ kind: 'key', t: 'async for' }, { kind: 'plain', t: ' message ' }, { kind: 'key', t: 'in' }, { kind: 'plain', t: ' query(' }],
              [{ kind: 'plain', t: '    prompt=' }, { kind: 'str', t: '"Find and fix the bug in auth.py"' }, { kind: 'plain', t: ',' }],
              [{ kind: 'plain', t: '    options=ClaudeAgentOptions(' }],
              [{ kind: 'plain', t: '        allowed_tools=[' }, { kind: 'str', t: '"Read"' }, { kind: 'plain', t: ', ' }, { kind: 'str', t: '"Edit"' }, { kind: 'plain', t: ', ' }, { kind: 'str', t: '"Bash"' }, { kind: 'plain', t: '],' }],
              '    ),',
              '):',
              '    print(message)',
            ],
            notes: [
              "Claude reads your local auth.py via direct file access",
              "Tool execution happens in the same process as your code",
              "Session state is stored as JSONL on your filesystem",
              "You operate the agent lifecycle yourself",
            ],
          },
          managed: {
            lines: [
              [{ kind: 'comment', t: '# Agent runs on Anthropic; you send REST calls' }],
              [{ kind: 'call', t: 'POST' }, { kind: 'plain', t: ' /v1/sessions' }],
              [{ kind: 'plain', t: '  { ' }, { kind: 'key', t: '"task"' }, { kind: 'plain', t: ': ' }, { kind: 'str', t: '"Find and fix the bug in auth.py"' }, { kind: 'plain', t: ' }' }],
              [{ kind: 'comment', t: '# -> { sessionId: "s_abc123" }' }],
              '',
              [{ kind: 'call', t: 'POST' }, { kind: 'plain', t: ' /v1/sessions/s_abc123/events' }],
              [{ kind: 'plain', t: '  { ' }, { kind: 'key', t: '"type"' }, { kind: 'plain', t: ': ' }, { kind: 'str', t: '"start"' }, { kind: 'plain', t: ', ' }, { kind: 'key', t: '"sandbox"' }, { kind: 'plain', t: ': ' }, { kind: 'str', t: '"managed"' }, { kind: 'plain', t: ' }' }],
              '',
              [{ kind: 'call', t: 'GET' }, { kind: 'plain', t: ' /v1/sessions/s_abc123/events' }],
              [{ kind: 'comment', t: '# stream of events as Claude works' }],
            ],
            notes: [
              "Claude reads auth.py from a managed sandbox (or your VPC)",
              "Anthropic operates the harness, sandbox, and session log",
              "You stream events back to your application",
              "Crash recovery is built into the platform",
            ],
          }
        },
        resume: {
          sdk: {
            lines: [
              [{ kind: 'comment', t: '# Capture session id, resume later' }],
              [{ kind: 'plain', t: 'session_id = ' }, { kind: 'key', t: 'None' }],
              '',
              [{ kind: 'key', t: 'async for' }, { kind: 'plain', t: ' message ' }, { kind: 'key', t: 'in' }, { kind: 'plain', t: ' query(' }],
              [{ kind: 'plain', t: '    prompt=' }, { kind: 'str', t: '"Read the auth module"' }, { kind: 'plain', t: ',' }],
              '):',
              [{ kind: 'plain', t: '    ' }, { kind: 'key', t: 'if' }, { kind: 'plain', t: ' message.subtype == ' }, { kind: 'str', t: '"init"' }, { kind: 'plain', t: ':' }],
              '        session_id = message.data[' + '"session_id"]',
              '',
              [{ kind: 'comment', t: '# Later, resume with full context' }],
              [{ kind: 'key', t: 'async for' }, { kind: 'plain', t: ' message ' }, { kind: 'key', t: 'in' }, { kind: 'plain', t: ' query(' }],
              [{ kind: 'plain', t: '    prompt=' }, { kind: 'str', t: '"Now find places that call it"' }, { kind: 'plain', t: ',' }],
              [{ kind: 'plain', t: '    options=ClaudeAgentOptions(resume=session_id),' }],
              '):',
              '    print(message)',
            ],
            notes: [
              "Session ID is captured from the SystemMessage init event",
              "Resume reads JSONL from .claude/sessions on disk",
              "Forking a session for parallel exploration also works locally",
              "If your process restarts, the JSONL is still there",
            ],
          },
          managed: {
            lines: [
              [{ kind: 'comment', t: '# Wake a harness for an existing session' }],
              [{ kind: 'call', t: 'POST' }, { kind: 'plain', t: ' /v1/sessions/s_abc123/wake' }],
              '',
              [{ kind: 'comment', t: '# Query past events; brain picks up' }],
              [{ kind: 'call', t: 'GET' }, { kind: 'plain', t: ' /v1/sessions/s_abc123/events?from=last' }],
              '',
              [{ kind: 'comment', t: '# Send the next event' }],
              [{ kind: 'call', t: 'POST' }, { kind: 'plain', t: ' /v1/sessions/s_abc123/events' }],
              [{ kind: 'plain', t: '  { ' }, { kind: 'key', t: '"type"' }, { kind: 'plain', t: ': ' }, { kind: 'str', t: '"user_message"' }, { kind: 'plain', t: ',' }],
              [{ kind: 'plain', t: '    ' }, { kind: 'key', t: '"text"' }, { kind: 'plain', t: ': ' }, { kind: 'str', t: '"Now find places that call it"' }, { kind: 'plain', t: ' }' }],
            ],
            notes: [
              "Harness is stateless; wake() boots a fresh one",
              "It reads the session log via getEvents()",
              "Resumes from the last event automatically",
              "Even after crashes, network blips, or new model versions",
            ],
          }
        },
        long: {
          sdk: {
            lines: [
              [{ kind: 'comment', t: '# A multi-hour task; you keep the process alive' }],
              [{ kind: 'key', t: 'async for' }, { kind: 'plain', t: ' message ' }, { kind: 'key', t: 'in' }, { kind: 'plain', t: ' query(' }],
              [{ kind: 'plain', t: '    prompt=' }, { kind: 'str', t: '"Refactor all 50 modules"' }, { kind: 'plain', t: ',' }],
              [{ kind: 'plain', t: '    options=ClaudeAgentOptions(' }],
              [{ kind: 'plain', t: '        allowed_tools=[' }, { kind: 'str', t: '"Read"' }, { kind: 'plain', t: ', ' }, { kind: 'str', t: '"Edit"' }, { kind: 'plain', t: ', ' }, { kind: 'str', t: '"Bash"' }, { kind: 'plain', t: '],' }],
              [{ kind: 'plain', t: '        hooks={' }, { kind: 'str', t: '"PostToolUse"' }, { kind: 'plain', t: ': [audit_hook]},' }],
              '    ),',
              '):',
              '    handle(message)',
              [{ kind: 'comment', t: '# Process must stay running; you own restart logic' }],
            ],
            notes: [
              "Your process holds the agent loop for the full duration",
              "If the process restarts mid-task, you handle recovery",
              "Hooks let you audit and intervene during execution",
              "Sandbox isolation is your responsibility",
            ],
          },
          managed: {
            lines: [
              [{ kind: 'comment', t: '# Fire and forget; check back later' }],
              [{ kind: 'call', t: 'POST' }, { kind: 'plain', t: ' /v1/sessions' }],
              [{ kind: 'plain', t: '  { ' }, { kind: 'key', t: '"task"' }, { kind: 'plain', t: ': ' }, { kind: 'str', t: '"Refactor all 50 modules"' }, { kind: 'plain', t: ' }' }],
              [{ kind: 'comment', t: '# -> { sessionId: "s_long" }' }],
              '',
              [{ kind: 'comment', t: '# Hours later, retrieve results' }],
              [{ kind: 'call', t: 'GET' }, { kind: 'plain', t: ' /v1/sessions/s_long/events' }],
              [{ kind: 'comment', t: '# Anthropic handled crashes, retries, scaling' }],
            ],
            notes: [
              "Anthropic operates the agent for the full duration",
              "Crash recovery is automatic; session survives anything",
              "Sandboxes are provisioned per session, isolated by default",
              "Designed for asynchronous, long-running production work",
            ],
          }
        }
      };

      var tabs = root.querySelectorAll('.hw-gendd-write-tab');
      var sdkCodeEl = root.querySelector('[data-sdk-code]');
      var sdkNotesEl = root.querySelector('[data-sdk-notes]');
      var managedCodeEl = root.querySelector('[data-managed-code]');
      var managedNotesEl = root.querySelector('[data-managed-notes]');

      function activate(key) {
        var t = tasks[key];
        if (!t) return;
        tabs.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.task === key ? 'true' : 'false');
        });
        sdkCodeEl.innerHTML = code(t.sdk.lines);
        sdkNotesEl.innerHTML = t.sdk.notes.map(function(n) { return '<li>' + n + '</li>'; }).join('');
        managedCodeEl.innerHTML = code(t.managed.lines);
        managedNotesEl.innerHTML = t.managed.notes.map(function(n) { return '<li>' + n + '</li>'; }).join('');
      }

      tabs.forEach(function(b) {
        b.addEventListener('click', function() { activate(b.dataset.task); });
        b.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(b.dataset.task); }
        });
      });

      activate('bug');
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-cmp');
      if (!root) return;

      var data = {
        sdk: {
          name: 'Agent SDK',
          rowClass: 'hw-gendd-cmp-detail-row-sdk',
          runs: "Your process, your infrastructure. The agent loop executes inside your Python or TypeScript application; tool calls hit your filesystem and your network directly.",
          interface: "A library you import: query(), ClaudeAgentOptions, AgentDefinition, HookMatcher. You call functions and iterate over async messages.",
          state: "JSONL files on your filesystem. Session resume reads from disk. You control retention, backup, and cleanup.",
          tools: "In-process Python or TypeScript functions. You write the tool, register it in the options, and it runs in the same process as the agent.",
          fit: "Local prototyping, CI/CD pipelines, agents that work directly on your filesystem and services, custom applications where you want full control of the runtime.",
        },
        managed: {
          name: 'Managed Agents',
          rowClass: 'hw-gendd-cmp-detail-row-managed',
          runs: "Anthropic's infrastructure. The harness, the sandbox, and the session log all run as hosted services in the Claude Platform.",
          interface: "REST API. POST to create sessions, POST to emit events, GET to stream events back. Your application is a client; the agent runs server-side.",
          state: "Anthropic-hosted, durable event log. Queryable via getEvents(). Survives crashes, harness restarts, network issues without any work from you.",
          tools: "Custom tools go through MCP servers. Claude triggers the tool via a proxy; your service returns results. OAuth tokens stored in a vault, never reachable from the sandbox.",
          fit: "Production agents you want to operate without running sandbox or session infrastructure yourself. Long-running and asynchronous sessions. Multi-tenant SaaS applications.",
        }
      };

      var cardBtns = root.querySelectorAll('.hw-gendd-cmp-card');
      var dimBtns = root.querySelectorAll('.hw-gendd-cmp-dim');
      var rowsEl = root.querySelector('[data-rows]');

      var state = { card: 'sdk', dim: 'runs' };

      function render() {
        cardBtns.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.card === state.card ? 'true' : 'false');
        });
        dimBtns.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.dim === state.dim ? 'true' : 'false');
        });

        var order = ['sdk', 'managed'];
        rowsEl.innerHTML = order.map(function(key) {
          var d = data[key];
          var emphasis = key === state.card ? 'style="background-color: rgba(233, 120, 69, 0.06);"' : '';
          return '<div class="hw-gendd-cmp-detail-row ' + d.rowClass + '" ' + emphasis + '>' +
            '<div class="hw-gendd-cmp-detail-row-name">' + d.name + '</div>' +
            '<div class="hw-gendd-cmp-detail-row-body">' + d[state.dim] + '</div>' +
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
      var root = document.currentScript.closest('.hw-gendd-pick');
      if (!root) return;

      var answers = { stage: null, lifecycle: null, data: null };

      function recommend() {
        var s = answers.stage, l = answers.lifecycle, d = answers.data;
        if (!s || !l || !d) return null;

        // Data residency trumps: if data can't leave, SDK regardless
        if (d === 'local') {
          return {
            kind: 'sdk', pill: 'Agent SDK', head: 'Run it in your process',
            reason: "Data residency, regulatory, or VPC constraints make Managed Agents a non-starter for this work. The SDK is the right answer because the agent runs entirely inside your own infrastructure. You'll take on the operational work (sandbox isolation, session storage, crash recovery), but the data stays where it has to stay. If you need parts of the agent's reasoning hosted but the sandbox local, look at Managed Agents' VPC-connection options as a possible middle path."
          };
        }

        // Prototyping: SDK regardless of lifecycle (data-flexible already established)
        if (s === 'prototype') {
          return {
            kind: 'sdk', pill: 'Agent SDK', head: 'Iterate locally first',
            reason: "Start with the SDK. The tight feedback loop (write, run, observe, rewrite) is the fastest way to learn what your agent should actually do. Watch every message, inspect every tool call, change behavior in seconds. Once the agent's shape is clear, graduating to Managed Agents is comparatively mechanical: the agent definition (tools, hooks, subagents, MCP servers) is largely portable. Don't optimize infrastructure before optimizing the agent."
          };
        }

        // Production
        if (s === 'production') {
          if (l === 'long') {
            return {
              kind: 'managed', pill: 'Managed Agents', head: "Hand off the operational work",
              reason: "Long-running asynchronous agents or many concurrent sessions is exactly the workload Managed Agents was designed for. The durable session log means anything in flight survives crashes. Sandboxes are provisioned per session and isolated by default. Crash recovery is automatic. You don't operate the infrastructure. This is the case where the hosted operational model earns its keep most clearly."
            };
          }
          // Production, short-lived
          return {
            kind: 'both', pill: 'Both, deliberately', head: 'SDK in pipeline, Managed for orchestration',
            reason: "For production agents that complete inside a single process invocation, the answer is usually both: the SDK for the part that runs inside your CI/CD or application code, Managed Agents for any orchestration that needs to survive across invocations. The SDK gives you in-process speed for the tight loops; Managed Agents handles the persistence and resilience for anything that crosses application boundaries. Decide per agent rather than treating it as one choice for the whole system."
          };
        }

        return null;
      }

      var optBtns = root.querySelectorAll('.hw-gendd-pick-opt');
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
          resultEl.classList.remove('is-complete','is-sdk','is-managed','is-both','is-graduate');
          labelEl.textContent = answered === 0 ? 'Answer all three questions above' : (3 - answered) + ' more to go';
          headEl.textContent = 'Your recommendation will appear here';
          reasonEl.textContent = 'The right tool depends on where the agent is in its lifecycle, how long it runs, and where the work needs to happen.';
          resetWrap.style.display = 'none';
          return;
        }
        resultEl.classList.add('is-complete');
        ['is-sdk','is-managed','is-both','is-graduate'].forEach(function(c) { resultEl.classList.remove(c); });
        resultEl.classList.add('is-' + rec.kind);
        labelEl.textContent = 'Recommendation';
        headEl.innerHTML = '<span class="hw-gendd-pick-result-pill">' + rec.pill + '</span>' + rec.head;
        reasonEl.textContent = rec.reason;
        resetWrap.style.display = '';
      }

      optBtns.forEach(function(b) {
        b.addEventListener('click', function() {
          var q = b.dataset.q, v = b.dataset.v;
          answers[q] = v;
          var sibs = root.querySelectorAll('.hw-gendd-pick-opt[data-q="' + q + '"]');
          sibs.forEach(function(s) { s.setAttribute('aria-pressed', s === b ? 'true' : 'false'); });
          render();
        });
        b.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); }
        });
      });

      resetBtn.addEventListener('click', function() {
        answers = { stage: null, lifecycle: null, data: null };
        optBtns.forEach(function(o) { o.setAttribute('aria-pressed', 'false'); });
        render();
      });
      resetBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); resetBtn.click(); }
      });

      render();
    })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":35375,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":3474,"estimatedReadTimeSeconds":876,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

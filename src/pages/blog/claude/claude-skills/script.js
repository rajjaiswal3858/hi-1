(function() {
      var root = document.currentScript.closest('.hw-gendd-anatomy');
      if (!root) return;

      var levels = {
        '1': {
          label: 'Level 1: Always loaded',
          headline: 'Metadata pre-loaded at startup',
          detail: "At session start, Claude pre-loads the <span class=\"hw-gendd-anatomy-loaded-strong\">name</span> and <span class=\"hw-gendd-anatomy-loaded-strong\">description</span> from every available Skill's YAML frontmatter. That's all. Claude doesn't read the SKILL.md body yet, and doesn't touch the bundled files. The point is just to give Claude enough context to recognize when the Skill might be relevant later.",
          cost: "Cost: <span class=\"hw-gendd-anatomy-loaded-cost-num\">~50\u2013100 tokens</span> per Skill, always",
          highlight: ['meta'],
          fade: ['body','ref','scripts','assets']
        },
        '2': {
          label: 'Level 2: Loaded when the Skill triggers',
          headline: 'SKILL.md body loaded on trigger',
          detail: "When Claude decides the Skill is relevant to the current task (matching the description against what the user is asking for), it reads the full <span class=\"hw-gendd-anatomy-loaded-strong\">SKILL.md body</span>. This is the markdown content after the YAML frontmatter: workflows, conventions, examples, references to the bundled files. The bundled files themselves still aren't loaded.",
          cost: "Cost: <span class=\"hw-gendd-anatomy-loaded-cost-num\">~1k\u20135k tokens</span>, only when Claude activates the Skill",
          highlight: ['meta','body'],
          fade: ['ref','scripts','assets']
        },
        '3': {
          label: 'Level 3: Loaded only as the task requires',
          headline: 'Bundled files loaded on demand',
          detail: "If the task needs detailed content, Claude navigates to the specific files SKILL.md points to. A complex brand review might pull in <span class=\"hw-gendd-anatomy-loaded-strong\">references/voice.md</span>; a script-based validation might run <span class=\"hw-gendd-anatomy-loaded-strong\">scripts/validate_copy.py</span>. Each file is loaded only when needed. Scripts can be executed without being loaded as context at all.",
          cost: "Cost: <span class=\"hw-gendd-anatomy-loaded-cost-num\">Only what the task actually requires</span>",
          highlight: ['meta','body','ref','scripts','assets'],
          fade: []
        }
      };

      var btns = root.querySelectorAll('.hw-gendd-anatomy-level-btn');
      var labelEl = root.querySelector('[data-level-label]');
      var headlineEl = root.querySelector('[data-level-headline]');
      var detailEl = root.querySelector('[data-level-detail]');
      var costEl = root.querySelector('[data-level-cost]');
      var treeLines = root.querySelectorAll('[data-tree-line]');

      function activate(lv) {
        var data = levels[lv];
        if (!data) return;

        btns.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.level === lv ? 'true' : 'false');
        });

        labelEl.textContent = data.label;
        headlineEl.textContent = data.headline;
        detailEl.innerHTML = data.detail;
        costEl.innerHTML = data.cost;

        treeLines.forEach(function(line) {
          var key = line.dataset.treeLine;
          line.classList.remove('is-highlighted','is-faded');
          if (data.highlight.indexOf(key) !== -1) line.classList.add('is-highlighted');
          if (data.fade.indexOf(key) !== -1) line.classList.add('is-faded');
        });
      }

      btns.forEach(function(b) {
        b.addEventListener('click', function() { activate(b.dataset.level); });
        b.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activate(b.dataset.level);
          }
        });
      });

      activate('1');
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-layers');
      if (!root) return;

      var data = {
        skills: {
          name: 'Skills',
          rowClass: 'hw-gendd-layers-detail-row-skills',
          purpose: "Procedural knowledge. The how-to for a specific kind of work: brand style application, code review conventions, document generation, finance workflow steps.",
          context: "Very low. ~50\u2013100 tokens per Skill always loaded (metadata only); the full body loads only when the Skill is triggered.",
          when: "When you find yourself re-explaining the same approach to Claude across multiple sessions. Or when the work is repeatable and you want consistent output every time.",
          example: "A Skill that applies your company's brand voice to marketing copy. It includes guidance, a banned-phrase list, a tone reference document, and a script that validates copy before shipping."
        },
        mcp: {
          name: 'MCP',
          rowClass: 'hw-gendd-layers-detail-row-mcp',
          purpose: "External system access. A standardized way for Claude to connect to data sources, APIs, and tools: GitHub, Linear, your database, your design files, your monitoring stack.",
          context: "Varies; can be significant. A typical 5-server setup with 58 tools uses around 55,000 tokens before any conversation starts. Tool Search reduces this by roughly 85% via on-demand discovery.",
          when: "When Claude needs to read from or write to a system it doesn't currently have access to. The problem is connectivity, not procedural knowledge.",
          example: "An MCP server that exposes your Linear workspace to Claude, so Claude can read sprints, create tickets, and update statuses through the standard Linear API."
        },
        sub: {
          name: 'Subagents',
          rowClass: 'hw-gendd-layers-detail-row-sub',
          purpose: "Isolated execution. A specialized Claude instance with its own context window, system prompt, and tool permissions. The main orchestrator delegates a task and receives the final result.",
          context: "Each subagent has its own context. The main agent's context stays clean; the subagent's context can be filled with task-specific material that doesn't pollute the parent session.",
          when: "When a task is complex enough that letting the main agent handle it would clutter the parent context. Or when you need parallel execution. Or when the work needs different tool permissions than the parent.",
          example: "A security-review subagent that runs after every PR is opened. It loads a security Skill, has read-only access to the repo via MCP, scans the diff, and returns only its findings to the parent agent."
        }
      };

      var dims = {
        purpose: "What it's for",
        context: "Context cost",
        when: "When to use",
        example: "Concrete example"
      };

      var cardBtns = root.querySelectorAll('.hw-gendd-layers-card');
      var dimBtns = root.querySelectorAll('.hw-gendd-layers-dim-btn');
      var rowsEl = root.querySelector('[data-rows]');

      var state = { card: 'skills', dim: 'purpose' };

      function render() {
        cardBtns.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.card === state.card ? 'true' : 'false');
        });
        dimBtns.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.dim === state.dim ? 'true' : 'false');
        });

        // Show one row for each layer, so they can compare across at a glance
        var order = ['skills','mcp','sub'];
        rowsEl.innerHTML = order.map(function(key) {
          var d = data[key];
          var emphasis = key === state.card ? 'style="background-color: rgba(233, 120, 69, 0.06);"' : '';
          return '<div class="hw-gendd-layers-detail-row ' + d.rowClass + '" ' + emphasis + '>' +
            '<div class="hw-gendd-layers-detail-row-name">' + d.name + '</div>' +
            '<div class="hw-gendd-layers-detail-row-body">' + d[state.dim] + '</div>' +
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
      var root = document.currentScript.closest('.hw-gendd-skdec');
      if (!root) return;

      var answers = { repeats: null, shape: null, scope: null };

      // Decision matrix logic
      function recommend() {
        var r = answers.repeats, s = answers.shape, sc = answers.scope;
        if (!r || !s || !sc) return null;

        // Access problem trumps everything: it's MCP regardless of repeat/scope
        if (s === 'access') {
          return {
            kind: 'mcp', pill: 'MCP', head: 'Connectivity, not procedural knowledge',
            reason: "The frustration is that Claude can't see or interact with a system. That's an access problem, and a Skill won't fix it. You need MCP (Model Context Protocol) to give Claude a connection to that system. Once the access is there, you might separately build a Skill that teaches Claude how to use the new connection well."
          };
        }
        // Context clutter trumps: subagent regardless of repeat
        if (s === 'context') {
          return {
            kind: 'sub', pill: 'Subagent', head: 'Isolation, not packaging',
            reason: "If Claude's main context is getting cluttered trying to handle the whole flow, a Skill won't help (Skills load into the same context). What you actually want is a subagent with its own context window, that can take the work and return only the result. Often paired with a Skill: the subagent loads a Skill on activation, so the procedural knowledge is there without bloating the parent."
          };
        }
        // How-problem (procedural)
        if (s === 'how') {
          if (r === 'no') {
            return {
              kind: 'prompt', pill: 'Better prompt', head: "It's a one-off; a prompt is enough",
              reason: "If this isn't going to repeat, a Skill is overkill. Write a well-structured prompt that includes the context, the instructions, and the desired output format. Skills earn their cost through repetition; one-off tasks don't repay the authoring time."
            };
          }
          // repeats yes
          if (sc === 'team') {
            return {
              kind: 'skill', pill: 'Build a Skill', head: 'Procedural knowledge that benefits the team',
              reason: "This is the canonical Skill case. The work repeats, the right approach is non-obvious, and consistency matters across people or agents. Build a Skill with a clear description (so it triggers reliably), keep the SKILL.md body lean, and move detailed content to references/ that Claude loads only when needed."
            };
          }
          // repeats yes, just me
          return {
            kind: 'claudemd', pill: 'Personal CLAUDE.md or Skill', head: 'Skill works; CLAUDE.md may be lighter',
            reason: "For repeatable but personal work, you have two reasonable options. A personal CLAUDE.md captures rules that apply to your own work without the overhead of authoring a full Skill. A custom Skill makes sense if the work is task-specific (only relevant for some sessions) rather than universal. If you're not sure, start with CLAUDE.md and graduate to a Skill if the pattern is clearly task-scoped."
          };
        }
        return null;
      }

      var optBtns = root.querySelectorAll('.hw-gendd-skdec-opt');
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
          resultEl.classList.remove('is-complete','is-skill','is-mcp','is-sub','is-prompt','is-claudemd');
          labelEl.textContent = answered === 0 ? 'Answer all three questions above' : (3 - answered) + ' more to go';
          headEl.textContent = 'Your recommendation will appear here';
          reasonEl.textContent = 'The choice depends on the shape of the problem, how often it recurs, and who needs to benefit from the answer being consistent.';
          resetWrap.style.display = 'none';
          return;
        }
        resultEl.classList.add('is-complete');
        ['is-skill','is-mcp','is-sub','is-prompt','is-claudemd'].forEach(function(c) { resultEl.classList.remove(c); });
        resultEl.classList.add('is-' + rec.kind);
        labelEl.textContent = 'Recommendation';
        headEl.innerHTML = '<span class="hw-gendd-skdec-result-pill">' + rec.pill + '</span>' + rec.head;
        reasonEl.textContent = rec.reason;
        resetWrap.style.display = '';
      }

      optBtns.forEach(function(b) {
        b.addEventListener('click', function() {
          var q = b.dataset.q, v = b.dataset.v;
          answers[q] = v;
          var siblings = root.querySelectorAll('.hw-gendd-skdec-opt[data-q="' + q + '"]');
          siblings.forEach(function(s) { s.setAttribute('aria-pressed', s === b ? 'true' : 'false'); });
          render();
        });
        b.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); }
        });
      });

      resetBtn.addEventListener('click', function() {
        answers = { repeats: null, shape: null, scope: null };
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
      var root = document.currentScript.closest('.hw-gendd-desc');
      if (!root) return;

      var examples = {
        brand: {
          bad: {
            title: 'Brand helper',
            name: 'brand-helper',
            desc: 'Helps with brand stuff and content.',
            reason: '"Brand stuff" doesn\'t pattern-match to anything Claude can recognize. No trigger phrases, no specific use cases. Claude has no way to know when this Skill applies, so it almost never activates on its own.'
          },
          good: {
            title: 'Brand style guide',
            name: 'brand-style-guide',
            desc: 'Applies our brand voice, tone, and visual style to marketing copy, blog posts, and customer-facing content. Use when the user asks to write, edit, or review anything that will be seen by customers, including triggers like "draft a blog post," "brand check this," or "write a customer email."',
            reason: 'Names a specific capability (brand voice, tone, visual style), names the audience (customer-facing content), names the actions (write, edit, review), and names the trigger phrases. Claude has multiple pattern matches to recognize the situation.'
          }
        },
        security: {
          bad: {
            title: 'Security checker',
            name: 'security',
            desc: 'For security work.',
            reason: 'Sounds reasonable but Claude has no way to know what "security work" means in this codebase. Does it run on every PR? Only when the user asks? Against what checklist? The Skill will rarely trigger because there\'s nothing concrete to match.'
          },
          good: {
            title: 'Security review (OWASP-aligned)',
            name: 'security-review',
            desc: 'Runs an OWASP-aligned security review against changed code: SQL injection, secrets in source, broken access control, dependency CVEs. Use when the user opens a PR for review, mentions "security review," "vuln check," "OWASP check," or pushes changes touching auth, crypto, or data access paths.',
            reason: 'Names the checklist (OWASP), names the categories (SQL injection, secrets, CVEs), names the trigger events (PR opens, mentions of specific phrases), and names the code paths (auth, crypto, data access) that should activate it.'
          }
        },
        finance: {
          bad: {
            title: 'Finance helper',
            name: 'finance',
            desc: 'Helps the finance team.',
            reason: '"Helps the finance team" tells Claude nothing about which tasks, which workflows, which inputs, or which outputs. The finance team does many things; this could apply to any of them, which means in practice it applies to none.'
          },
          good: {
            title: 'Month-end close reconciliation',
            name: 'month-end-close',
            desc: 'Runs our standard month-end reconciliation procedure: GL-to-subledger tie-out, bank rec, intercompany matching, accruals review. Use when the user mentions "month-end close," "monthly reconciliation," "tie out," "GL rec," or asks for help with closing the books.',
            reason: 'Specific procedure name, specific steps, specific trigger phrases. The Skill activates on the exact moments it\'s designed for and ignores adjacent finance work it isn\'t designed for.'
          }
        },
        docs: {
          bad: {
            title: 'Docs tool',
            name: 'docs',
            desc: 'Documentation skill.',
            reason: 'Documentation what? For what audience? Generated how? Reviewed against what? Claude has nothing to match against. A description this short is functionally invisible to the routing layer.'
          },
          good: {
            title: 'API reference generator',
            name: 'api-reference-gen',
            desc: 'Generates and updates OpenAPI-format API reference documentation from our codebase, following our doc style guide and including code samples in TypeScript and curl. Use when the user asks to "document an endpoint," "update the API docs," "generate reference for this route," or modifies handler files in /api/.',
            reason: 'Specific output format (OpenAPI), specific style (our doc style guide), specific languages (TypeScript, curl), and both phrase-based and file-path triggers. The Skill knows when to wake up and when to stay quiet.'
          }
        }
      };

      var pickBtns = root.querySelectorAll('.hw-gendd-desc-pick-btn');
      var badTitle = root.querySelector('[data-bad-title]');
      var badName = root.querySelector('[data-bad-name]');
      var badDesc = root.querySelector('[data-bad-desc]');
      var badReason = root.querySelector('[data-bad-reason]');
      var goodTitle = root.querySelector('[data-good-title]');
      var goodName = root.querySelector('[data-good-name]');
      var goodDesc = root.querySelector('[data-good-desc]');
      var goodReason = root.querySelector('[data-good-reason]');

      function activate(key) {
        var ex = examples[key];
        if (!ex) return;
        pickBtns.forEach(function(b) {
          b.setAttribute('aria-pressed', b.dataset.ex === key ? 'true' : 'false');
        });
        badTitle.textContent = ex.bad.title;
        badName.textContent = ex.bad.name;
        badDesc.textContent = ex.bad.desc;
        badReason.textContent = ex.bad.reason;
        goodTitle.textContent = ex.good.title;
        goodName.textContent = ex.good.name;
        goodDesc.textContent = ex.good.desc;
        goodReason.textContent = ex.good.reason;
      }

      pickBtns.forEach(function(b) {
        b.addEventListener('click', function() { activate(b.dataset.ex); });
        b.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(b.dataset.ex); }
        });
      });

      activate('brand');
    })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":35372,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":3618,"estimatedReadTimeSeconds":912,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

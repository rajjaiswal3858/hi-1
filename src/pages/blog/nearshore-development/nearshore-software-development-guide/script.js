(function() {
      var root = document.currentScript.closest('.hw-gendd-tvn');
      if (!root || !('IntersectionObserver' in window)) {
        if (root) root.querySelectorAll('.hw-gendd-tvn-column').forEach(function(el){ el.classList.add('is-visible'); });
        return;
      }
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      root.querySelectorAll('.hw-gendd-tvn-column').forEach(function(el) { observer.observe(el); });
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-loop');
      if (!root) return;
      var stages = root.querySelectorAll('.hw-gendd-loop-stage');
      var panel = root.querySelector('.hw-gendd-loop-detail');
      var inner = root.querySelector('.hw-gendd-loop-detail-inner');
      var labelEl = root.querySelector('[data-detail="label"]');
      var titleEl = root.querySelector('[data-detail="title"]');
      var bodyEl = root.querySelector('[data-detail="body"]');
      var calloutEl = root.querySelector('[data-detail="callout"]');

      var stageData = {
        context: { label: "Stage 01", title: "Context",
          body: "Load the relevant codebase, requirements, and constraints into the AI tool through governed artifacts called Context Packs. Without proper context, every AI tool starts cold and guesses at conventions, architecture, and intent.",
          callout: "Context Packs live in the repository's <code>.cursor/</code> directory and replace tribal knowledge with machine-readable context." },
        plan: { label: "Stage 02", title: "Plan",
          body: "The AI produces a written approach to the work: architecture decisions, files to be modified, expected test changes, and known unknowns. The human engineer reviews this plan before any code is generated.",
          callout: "A written plan is reviewable. Code is reviewable too, but it is far more expensive to walk back." },
        confirm: { label: "Stage 03 \u2014 The Gate", title: "Confirm",
          body: "A deliberate, non-negotiable gate. The engineer signs off on the plan or sends it back for revision. Nothing is generated until the plan is approved. This is the stage that separates AI-native development from vibecoding.",
          callout: "Most \"AI-assisted\" workflows skip this stage. GenDD treats it as load-bearing because AI makes confident, plausible, and wrong decisions at speed." },
        execute: { label: "Stage 04", title: "Execute",
          body: "With the plan confirmed, the AI writes the code. The engineer supervises but does not have to micromanage, because the plan has already established what the code should do and how it should do it.",
          callout: "Execute is fast. It can afford to be, because the slow thinking happened in Plan and Confirm." },
        validate: { label: "Stage 05", title: "Validate",
          body: "The engineer reviews the generated code, runs tests, verifies behavior against the plan, and confirms the change is ready to ship. Anything the plan did not anticipate gets caught here.",
          callout: "Validate closes the loop. The next unit of work starts from the updated Context." }
      };

      function activate(stage) {
        var key = stage.dataset.stage;
        var data = stageData[key];
        if (!data) return;
        stages.forEach(function(s) { s.setAttribute('aria-pressed', s === stage ? 'true' : 'false'); });
        panel.setAttribute('data-active', key);
        inner.style.opacity = '0';
        setTimeout(function() {
          labelEl.textContent = data.label;
          titleEl.textContent = data.title;
          bodyEl.textContent = data.body;
          calloutEl.innerHTML = data.callout;
          inner.style.opacity = '1';
        }, 150);
      }

      stages.forEach(function(stage, idx) {
        stage.addEventListener('click', function() { activate(stage); });
        stage.addEventListener('keydown', function(e) {
          var next = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = stages[idx + 1] || stages[0];
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = stages[idx - 1] || stages[stages.length - 1];
          if (next) { e.preventDefault(); next.focus(); activate(next); }
        });
      });
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-pod');
      if (!root) return;
      var toggleBtns = root.querySelectorAll('.hw-gendd-pod-toggle-btn');
      var views = root.querySelectorAll('.hw-gendd-pod-view');
      toggleBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var target = btn.dataset.view;
          toggleBtns.forEach(function(b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
          views.forEach(function(v) { v.classList.toggle('is-active', v.dataset.view === target); });
        });
      });
    })();
;
(function() {
      var root = document.currentScript.closest('.hw-gendd-bf');
      if (!root) return;
      var passes = root.querySelectorAll('.hw-gendd-bf-pass');
      var inner = root.querySelector('.hw-gendd-bf-detail-inner');
      var labelEl = root.querySelector('[data-detail="label"]');
      var titleEl = root.querySelector('[data-detail="title"]');
      var bodyEl = root.querySelector('[data-detail="body"]');

      var passData = {
        scan: { label: "Pass 01 \u2014 Automated", title: "Scan",
          body: "Automated traversal of the codebase to produce a structural map: modules, dependencies, integration points, and data flows. Runs in minutes on most repositories. Identifies the bones of the system without any human interpretation." },
        infer: { label: "Pass 02 \u2014 AI-driven", title: "Infer",
          body: "AI surfaces intent, patterns, and conventions from the code itself. What was this module trying to do? What conventions are the team following? What does the architecture suggest about the system's history and constraints? Produces hypotheses for human review." },
        validate: { label: "Pass 03 \u2014 Human in loop", title: "Validate",
          body: "A human engineer verifies the inferences with the client's team. Corrections, additions, and context that only living engineers know get folded back into the analysis. This is where the methodology earns its trustworthiness." },
        document: { label: "Pass 04 \u2014 Output", title: "Document",
          body: "Produces a ten-section documentation pack covering architecture, conventions, dependencies, integrations, data, testing, deployment, known issues, technical debt, and open questions. The output feeds directly into Context Packs." }
      };

      function activate(pass) {
        var key = pass.dataset.pass;
        var data = passData[key];
        if (!data) return;
        passes.forEach(function(p) { p.setAttribute('aria-pressed', p === pass ? 'true' : 'false'); });
        inner.style.opacity = '0';
        setTimeout(function() {
          labelEl.textContent = data.label;
          titleEl.textContent = data.title;
          bodyEl.textContent = data.body;
          inner.style.opacity = '1';
        }, 150);
      }

      passes.forEach(function(pass, idx) {
        pass.addEventListener('click', function() { activate(pass); });
        pass.addEventListener('keydown', function(e) {
          var next = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = passes[idx + 1] || passes[0];
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = passes[idx - 1] || passes[passes.length - 1];
          if (next) { e.preventDefault(); next.focus(); activate(next); }
        });
      });
    })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":28816,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":4664,"estimatedReadTimeSeconds":1176,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

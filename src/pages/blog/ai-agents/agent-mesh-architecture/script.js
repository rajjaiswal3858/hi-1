(function(){
  var hwAmeshData = [
    { title: "Inventory your AI agents and workflows", desc: "Know what you have before you build anything. Flag high-risk edges first.", tasks: ["List every agent, internal builds and third-party tools","Note where each runs and what data it touches","Catalog the tools each agent can invoke","Flag high-risk edges: financial, customer data, production"] },
    { title: "Define trust boundaries for agentic systems", desc: "Map boundaries by team, data sensitivity, and risk tier.", tasks: ["Map boundaries across cloud environments","Classify by team, data sensitivity, and risk tier","Make an explicit trust decision for every external system"] },
    { title: "Standardize agent identity and ownership", desc: "Every agent gets a birth certificate before it ships.", tasks: ["Define an agent identity schema","Assign unique ID, purpose, permissions, approved tools, eval plan","Assign a human owner to every agent","Define an on-call escalation path"] },
    { title: "Stand up the agent gateway", desc: "Single enforcement point for all agent traffic, minimum controls first.", tasks: ["Deploy gateway with auth and authorization","Add rate limiting","Add request and response logging","Configure tool allowlists","Layer on routing logic by task type or risk tier"] },
    { title: "Build the tool layer", desc: "Define contracts and adopt interop standards to avoid lock-in.", tasks: ["Define tool contracts: inputs, outputs, side effects","Specify required permissions per tool","Set timeout and failure behavior","Adopt MCP for tool access","Adopt A2A-style patterns for agent-to-agent comms"] },
    { title: "Add observability", desc: "Distributed traces, cost telemetry, and alerts before scale.", tasks: ["Instrument every agent with distributed traces","Correlate traces to user sessions and outcomes","Add cost telemetry: tokens, tool calls, retries, runtime","Set alerting thresholds before costs go unpredictable"] },
    { title: "Add evaluation", desc: "Three layers: per-step, end-to-end, long-horizon drift.", tasks: ["Build unit-like checks per step","Build workflow regression tests for end-to-end behavior","Build long-horizon tests to surface drift","Define acceptance metrics: accuracy, latency, escalation rate"] },
    { title: "Production readiness", desc: "Canary rollouts, versioned changes, and a kill switch.", tasks: ["Use canary rollouts for new agents","Version every prompt and tool change","Document instant rollback procedure","Wire a tool disable switch per agent","Define human-in-the-loop escalation for high-risk decisions"] }
  ];
  var STORAGE_KEY = "hw_amesh_checklist_v1";
  var state = {};
  try { var raw = window.localStorage.getItem(STORAGE_KEY); if (raw) state = JSON.parse(raw); } catch(e){}

  function save() { try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e){} }

  function render() {
    var container = document.getElementById("hw-amesh-checklist-steps");
    if (!container) return;
    var html = "";
    for (var i = 0; i < hwAmeshData.length; i++) {
      var step = hwAmeshData[i];
      var checks = state["s" + i] || {};
      var checkedCount = 0;
      for (var j = 0; j < step.tasks.length; j++) { if (checks[j]) checkedCount++; }
      var allDone = checkedCount === step.tasks.length;
      var isOpen = state["open_" + i];
      var tasksHtml = "";
      for (var k = 0; k < step.tasks.length; k++) {
        tasksHtml += '<div class="hw-amesh-checklist-task ' + (checks[k] ? 'hw-amesh-checked' : '') + '" onclick="hwAmeshChecklistCheck(' + i + ',' + k + ')">' +
                     '<div class="hw-amesh-checklist-check ' + (checks[k] ? 'hw-amesh-checked' : '') + '"></div>' +
                     '<div class="hw-amesh-checklist-text">' + step.tasks[k] + '</div></div>';
      }
      html += '<div class="hw-amesh-checklist-step ' + (allDone ? 'hw-amesh-done' : '') + ' ' + (isOpen ? 'hw-amesh-open' : '') + '">' +
              '<div class="hw-amesh-checklist-head" onclick="hwAmeshChecklistToggle(' + i + ')">' +
              '<div class="hw-amesh-checklist-num">' + (allDone ? '✓' : (i + 1)) + '</div>' +
              '<div class="hw-amesh-checklist-title">' + step.title + '</div>' +
              '<div class="hw-amesh-checklist-meta">' + checkedCount + '/' + step.tasks.length + '</div>' +
              '<div class="hw-amesh-checklist-chev"></div></div>' +
              '<div class="hw-amesh-checklist-body">' +
              '<p class="hw-amesh-checklist-desc">' + step.desc + '</p>' + tasksHtml + '</div></div>';
    }
    container.innerHTML = html;

    var stepsDone = 0;
    for (var n = 0; n < hwAmeshData.length; n++) {
      var c = state["s" + n] || {};
      var done = true;
      for (var m = 0; m < hwAmeshData[n].tasks.length; m++) { if (!c[m]) { done = false; break; } }
      if (done) stepsDone++;
    }
    var pct = Math.round((stepsDone / 8) * 100);
    var fillEl = document.getElementById("hw-amesh-checklist-fill");
    var countEl = document.getElementById("hw-amesh-checklist-count");
    if (fillEl) fillEl.style.width = pct + "%";
    if (countEl) countEl.textContent = stepsDone + " of 8 steps";
  }

  window.hwAmeshChecklistToggle = function(i) { state["open_" + i] = !state["open_" + i]; save(); render(); };
  window.hwAmeshChecklistCheck = function(i, j) {
    var k = "s" + i;
    if (!state[k]) state[k] = {};
    state[k][j] = !state[k][j];
    save();
    render();
  };
  window.hwAmeshChecklistReset = function() {
    if (!confirm("Reset all checklist progress?")) return;
    state = {};
    save();
    render();
  };

  render();
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":35424,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":2500,"estimatedReadTimeSeconds":630,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

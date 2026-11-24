(function(){
function tabs(items, onSelect){
items = [].slice.call(items);
function pick(el, focus){
items.forEach(function(t){ var on = t === el; t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1; });
if (focus) el.focus();
onSelect(el);
}
items.forEach(function(t, i){
t.addEventListener('click', function(){ pick(t); });
t.addEventListener('keydown', function(e){
var k = e.key, n = null;
if (k === 'Enter' || k === ' ') { e.preventDefault(); pick(t); return; }
if (k === 'ArrowRight' || k === 'ArrowDown') n = items[(i + 1) % items.length];
if (k === 'ArrowLeft' || k === 'ArrowUp') n = items[(i - 1 + items.length) % items.length];
if (n) { e.preventDefault(); pick(n, true); }
});
});
var start = items.filter(function(t){ return t.getAttribute('aria-selected') === 'true'; })[0] || items[0];
if (start) onSelect(start);
}

/* Visual 1: bubble chart */
var v1 = document.getElementById('hwpd-v1');
if (v1) {
var c1 = v1.querySelector('[data-call]');
var bubbles = [].slice.call(v1.querySelectorAll('.hwpd-b'));
var info = [
['Onboarding friction', 34, 'High', 'High', 'Focus here first. Users feel it hard and the fix is within reach.'],
['Missing integration', 26, 'High', 'Medium to high', 'Focus here first. A strong candidate for an early hypothesis.'],
['Pricing confusion', 18, 'Medium', 'High', 'Easy to address, but users feel it less. A quick win, not a lead bet.'],
['Slow reporting', 22, 'High', 'Low', 'Real pain that is hard to solve today. Check readiness before you commit.'],
['Export formatting', 10, 'Low', 'High', 'Simple to fix, rarely mentioned. Leave it in the backlog.'],
['Mobile access', 12, 'Low', 'Low', 'Low intensity and hard to address. Not worth a test yet.']
];
var intro = '<strong>Select any bubble</strong> to see how often the theme came up and where it lands.';
function show(b){
bubbles.forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
var d = info[+b.getAttribute('data-i')];
c1.innerHTML = '<strong>' + d[0] + '</strong>: mentioned ' + d[1] + ' times. Need intensity: ' + d[2] + '. Addressability: ' + d[3] + '. ' + d[4];
}
bubbles.forEach(function(b){
b.addEventListener('click', function(){ show(b); });
b.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(b); } });
});
tabs(v1.querySelectorAll('.hwpd-seg [role="tab"]'), function(el){
var quad = el.getAttribute('data-mode') === 'quad';
v1.className = 'hwpd-viz' + (quad ? ' is-quad' : '');
bubbles.forEach(function(x){ x.setAttribute('aria-pressed', 'false'); });
c1.innerHTML = quad
? '<strong>Two themes clear both bars.</strong> Onboarding friction and missing integration are where early product ideas should start.'
: intro;
});
}

/* Visual 2: hypothesis card */
var v2 = document.getElementById('hwpd-v2');
if (v2) {
var head = v2.querySelector('[data-head]'), status = v2.querySelector('[data-status]'), body = v2.querySelector('[data-body]');
function kv(k, v){ return '<div class="hwpd-kv"><span>' + k + '</span><span>' + v + '</span></div>'; }
var views = [
{h:'Test plan: guided onboarding checklist', s:'Draft for review', b:
kv('Hypothesis', 'If new accounts get a guided setup checklist, more of them will build their first report in week one, because discovery flagged onboarding friction as the top theme. We are wrong if the share stays flat.') +
kv('Target metric', 'Time-to-first-value: share of new accounts that build a first report within 7 days') +
kv('Audience segment', 'New self-serve accounts, small business tier') +
kv('Guardrail', 'Support tickets per new account') +
kv('Est. run time', '14 days to reach significance')},
{h:'Results summary: guided onboarding checklist', s:'Test complete', b:
kv('Plain-language read', 'The checklist worked. More new accounts reached their first report in week one, and support load did not rise.') +
kv('First report in 7 days', 'Checklist: 41%<span class="hwpd-meter"><i data-w="41"></i></span>Control: 33%<span class="hwpd-meter is-b"><i data-w="33"></i></span>') +
kv('Guardrail', 'Support tickets per new account held flat') +
kv('Confidence', 'Reached significance on day 13')},
{h:'Next experiment: shorter checklist, new segment', s:'Suggested by AI', b:
kv('Why this test', 'Most drop-off happened at step 4 of 6. A shorter path may lift completion further.') +
kv('Hypothesis', 'A three-step checklist will match or beat the six-step version for mid-market accounts.') +
kv('Target metric', 'Time-to-first-value, same 7-day window') +
kv('Audience segment', 'New mid-market accounts') +
kv('Decision owner', 'Product manager approves before launch')}
];
tabs(v2.querySelectorAll('.hwpd-seg [role="tab"]'), function(el){
var d = views[+el.getAttribute('data-i')];
head.textContent = d.h; status.textContent = d.s; body.innerHTML = d.b;
setTimeout(function(){ [].slice.call(body.querySelectorAll('[data-w]')).forEach(function(i){ i.style.width = i.getAttribute('data-w') + '%'; }); }, 30);
});
}

/* Visual 3: evaluation matrix */
var v3 = document.getElementById('hwpd-v3');
if (v3) {
var grid = v3.querySelector('[data-grid]'), c3 = v3.querySelector('[data-call]');
var outs = ['Output A','Output B','Output C','Output D'];
var rows = [
{k:'Accuracy', v:[5,4,3,5], f:function(x){ return x + ' / 5'; }, p:function(x){ return x >= 4; }},
{k:'Relevance', v:[4,5,4,5], f:function(x){ return x + ' / 5'; }, p:function(x){ return x >= 4; }},
{k:'Safety', v:[1,1,1,0], f:function(x){ return x ? 'Pass' : 'Fail'; }, p:function(x){ return !!x; }},
{k:'Latency', v:[1.4,2.8,0.9,1.6], f:function(x){ return x.toFixed(1) + 's'; }, p:function(x){ return x <= 2.0; }}
];
function render(gate){
var h = '<span class="h">Criteria</span>' + outs.map(function(o){ return '<span class="h">' + o.replace('Output ', '') + '</span>'; }).join('');
var ship = [true,true,true,true];
rows.forEach(function(r){
h += '<span class="r">' + r.k + '</span>';
r.v.forEach(function(x, j){
var ok = r.p(x); if (!ok) ship[j] = false;
var cls = gate ? (ok ? ' is-pass' : ' is-fail') : '';
var txt = gate ? (ok ? '&#10003; ' : '&#10007; ') + r.f(x) : r.f(x);
h += '<span class="c' + cls + '">' + txt + '</span>';
});
});
if (gate) {
h += '<span class="r v">Verdict</span>' + ship.map(function(s){ return '<span class="c v ' + (s ? 'is-ship' : 'is-hold') + '">' + (s ? 'Ship' : 'Hold') + '</span>'; }).join('');
}
grid.innerHTML = h;
c3.innerHTML = gate
? '<strong>One of four outputs clears every gate.</strong> B is too slow, C is not accurate enough, and D fails safety despite top scores elsewhere.'
: '<strong>On raw scores, D looks like the winner.</strong> Switch to the ship gate to see why it never reaches a user.';
}
tabs(v3.querySelectorAll('.hwpd-seg [role="tab"]'), function(el){ render(el.getAttribute('data-mode') === 'gate'); });
}

/* Visual 4: agent stack */
var v4 = document.getElementById('hwpd-v4');
if (v4) {
var c4 = v4.querySelector('[data-call]'), mode = 'own';
var layers = [].slice.call(v4.querySelectorAll('.hwpd-layer'));
var raci = [
'<strong>Planner.</strong> Responsible: the agent drafts the plan. Accountable: the engineer who confirms it. Consulted: product, for acceptance criteria. Informed: the wider team.',
'<strong>Tools.</strong> Responsible and accountable for execution: the agent, inside permissions a human set. Consulted: engineering, on which tools it may call. Informed: reviewers, through logs.',
'<strong>Memory.</strong> Responsible: the agent keeps context across steps. Accountable: the engineer who curates context files and conventions. Informed: anyone picking up the work next.',
'<strong>Evaluator.</strong> Responsible: the agent runs tests and checks. Accountable: the human who defined the criteria and signs off. Consulted: product and governance.'
];
var gates = '<strong>Three gates, one rule.</strong> Confirm the plan before execution, review the output before it moves forward, and validate against acceptance criteria before anything ships. Vibe coding skips all three.';
var current = layers[0];
function paint(){ c4.innerHTML = mode === 'gates' ? gates : raci[+current.getAttribute('data-i')]; }
tabs(layers, function(el){ current = el; if (mode === 'gates') { mode = 'own'; syncSeg(); } paint(); });
var segTabs = v4.querySelectorAll('.hwpd-seg [role="tab"]');
function syncSeg(){ [].slice.call(segTabs).forEach(function(t){ var on = t.getAttribute('data-mode') === mode; t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1; }); v4.className = 'hwpd-viz' + (mode === 'gates' ? ' is-gates' : ''); }
tabs(segTabs, function(el){ mode = el.getAttribute('data-mode'); v4.className = 'hwpd-viz' + (mode === 'gates' ? ' is-gates' : ''); paint(); });
}
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":37767,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":4147,"estimatedReadTimeSeconds":1045,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

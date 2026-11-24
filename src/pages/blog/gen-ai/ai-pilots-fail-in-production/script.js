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

/* Visual 1: subsidies */
var v1 = document.getElementById('hwap-v1');
if (v1) {
var subs = v1.querySelector('[data-subs]'), c1 = v1.querySelector('[data-call]');
var rows = [
['Data', 'Hand-picked, cleaner than what normally arrives', 'Messy real data, all of it'],
['Scope', 'Narrow, few inputs outside its design', 'The full range of inputs'],
['Users', 'Volunteers who tolerate rough edges', 'Busy users who signed up for none of it'],
['Workflow', 'Sits beside the workflow', 'Has to live inside it'],
['Governance', 'Light, nothing customer-facing yet', 'Permissions and approvals'],
['Support', 'The builder is nearby', 'A defined escalation path']
];
tabs(v1.querySelectorAll('.hwap-seg [role="tab"]'), function(el){
var prod = el.getAttribute('data-mode') === 'prod';
v1.className = 'hwap-viz' + (prod ? ' is-prod' : '');
subs.innerHTML = rows.map(function(r){
return '<div class="hwap-sub"><small>' + r[0] + '</small><span class="v">' + (prod ? r[2] : r[1]) + '</span><span class="hwap-pill ' + (prod ? 'is-no">Withdrawn' : 'is-go">Subsidized') + '</span></div>';
}).join('');
c1.innerHTML = prod
? '<strong>Production withdraws all six at once.</strong> Edge cases arrive by the thousand, errors need an owner, and costs land on a P&amp;L.'
: '<strong>Every one of these is a subsidy.</strong> The model worked, but it worked under conditions production was never going to repeat.';
});
}

/* Visual 2: readiness checklist */
var v2 = document.getElementById('hwap-v2');
if (v2) {
var qs = [].slice.call(v2.querySelectorAll('.hwap-q')), meter = v2.querySelector('[data-meter]'), c2 = v2.querySelector('[data-call]');
function paint2(){
var on = qs.filter(function(q){ return q.getAttribute('aria-checked') === 'true'; }).length;
var open = qs.filter(function(q){ return q.getAttribute('aria-checked') !== 'true'; }).map(function(q){ return q.getAttribute('data-m'); });
meter.className = 'hwap-meter' + (on === 8 ? ' is-done' : (on >= 4 ? ' is-mid' : ''));
meter.querySelector('i').style.width = (on / 8 * 100) + '%';
if (on === 8) c2.innerHTML = '<strong>8 of 8 answered.</strong> This pilot has a real path to production. Use it to learn what only a pilot can teach you.';
else if (on === 0) c2.innerHTML = '<strong>0 of 8 answered.</strong> Select each question your team can already answer for the pilot on your desk.';
else c2.innerHTML = '<strong>' + on + ' of 8 answered.</strong> Still open: ' + open.join(', ') + '.';
}
qs.forEach(function(q){
function toggle(){ q.setAttribute('aria-checked', q.getAttribute('aria-checked') === 'true' ? 'false' : 'true'); paint2(); }
q.addEventListener('click', toggle);
q.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
});
paint2();
}

/* Visual 3: case study flow */
var v3 = document.getElementById('hwap-v3');
if (v3) {
var c3 = v3.querySelector('[data-call]'), bars = [].slice.call(v3.querySelectorAll('[data-funnel] i'));
var steps = [
'<strong>50+ use cases.</strong> Interviews with leadership and subject-matter experts surfaced ideas across estimating, project management, field operations, procurement, safety, and finance.',
'<strong>4 priorities.</strong> Each use case was qualified and prioritized. Four rose to the top.',
'<strong>Phase 1: foundation first.</strong> Critical data was fragmented across disconnected systems, so the first phase paired data and infrastructure investment with a few early generative AI wins that could prove value quickly.',
'<strong>Later phases.</strong> The priority use cases build on that foundation instead of stalling at implementation.'
];
tabs(v3.querySelectorAll('.hwap-node'), function(el){
var i = +el.getAttribute('data-i');
c3.innerHTML = steps[i];
bars.forEach(function(b, j){ b.className = j <= i ? 'is-on' : ''; });
});
}

/* Visual 4: GenROI dimensions */
var v4 = document.getElementById('hwap-v4');
if (v4) {
var c4 = v4.querySelector('[data-call]');
var dims = [
'<strong>Value.</strong> Is the opportunity attached to a business problem worth solving, in a unit finance recognizes?',
'<strong>Feasibility.</strong> Can it be built with the technology and data available today?',
'<strong>Strategic fit.</strong> Does it move the outcomes the business has said matter most?',
'<strong>Organizational readiness changes the sequence.</strong><ul><li>A high-value opportunity may wait for its data foundation.</li><li>Another may depend on an integration that should be built first.</li><li>A promising use case may need a workflow owner before anyone writes code.</li><li>A less exciting initiative may reach production faster and create value sooner.</li></ul>'
];
tabs(v4.querySelectorAll('.hwap-dim'), function(el){ c4.innerHTML = dims[+el.getAttribute('data-i')]; });
}

/* Visual 5: approve / stop */
var v5 = document.getElementById('hwap-v5');
if (v5) {
var pairs = [].slice.call(v5.querySelectorAll('.hwap-pair')), sum = v5.querySelector('[data-sum]');
function paint5(){
var a = 0, s = [];
pairs.forEach(function(p){
var sel = p.querySelector('[aria-checked="true"]');
if (!sel) return;
if (sel.classList.contains('a')) a++; else s.push(p.getAttribute('data-k'));
});
var done = a + s.length;
if (!done) { sum.className = 'hwap-sum'; sum.innerHTML = '<strong>Nothing selected yet.</strong><p>Choose one side for each of the six rows.</p>'; return; }
if (s.length) { sum.className = 'hwap-sum is-stop'; sum.innerHTML = '<strong>Stop and say why: ' + s.length + ' open.</strong><p>Still open: ' + s.join(', ') + '. ' + (s.length === 1 ? 'That is' : 'Each is') + ' a question you have chosen to answer later, when changing direction costs more.</p>'; return; }
if (done < pairs.length) { sum.className = 'hwap-sum'; sum.innerHTML = '<strong>' + a + ' of ' + pairs.length + ' in place so far.</strong><p>Keep going through the remaining rows.</p>'; return; }
sum.className = 'hwap-sum is-go'; sum.innerHTML = '<strong>Approve it.</strong><p>All six are in place. Use the pilot to learn what only a pilot can teach you.</p>';
}
pairs.forEach(function(p){
var opts = [].slice.call(p.querySelectorAll('.hwap-opt'));
opts.forEach(function(o, i){
function pick(){ opts.forEach(function(x){ x.setAttribute('aria-checked', x === o ? 'true' : 'false'); x.tabIndex = x === o ? 0 : -1; }); paint5(); }
o.addEventListener('click', pick);
o.addEventListener('keydown', function(e){
if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); }
if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); var n = opts[(i + 1) % 2]; n.focus(); n.click(); }
});
});
});
paint5();
}
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":37769,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":2285,"estimatedReadTimeSeconds":576,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

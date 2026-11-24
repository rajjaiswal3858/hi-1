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

/* Visual 1: animate bars into view */
var v1 = document.getElementById('hwht-v1');
if (v1) {
var fills = [].slice.call(v1.querySelectorAll('[data-w]'));
var grow = function(){ fills.forEach(function(f){ f.style.width = Math.max(+f.getAttribute('data-w'), 1.5) + '%'; }); };
if ('IntersectionObserver' in window) {
var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) { grow(); io.disconnect(); } }); }, {threshold: .3});
io.observe(v1);
} else { grow(); }
}

/* Visual 2: what rides along */
var v2 = document.getElementById('hwht-v2');
if (v2) {
var calls = v2.querySelector('[data-calls]'), tl = v2.querySelector('[data-tl]'), tools = v2.querySelector('[data-tools]'), c2 = v2.querySelector('[data-call]');
var mode = 'full', n = 3;
var cfg = {
full: {sys: 18, tools: 26, label: 'Loaded before work begins',
chips: '<span>Detailed system instructions</span><span>Broad built-in tool set</span><span>Permission modes</span><span>Hooks</span><span>Deny rules</span><span>Managed settings</span>',
call: '<strong>A full-featured harness</strong> describes every built-in tool and its instructions to the model before work begins. Those controls make shell access safe. The question is whether your task uses them.'},
min: {sys: 5, tools: 6, label: 'Pi in Arena’s configuration: four tools, extensions opt-in',
chips: '<span>read</span><span>write</span><span>edit</span><span>bash</span><span class="is-ext">+ plan mode (extension)</span><span class="is-ext">+ subagents (extension)</span>',
call: '<strong>A minimal harness</strong> gives the model four tools: read, write, edit, and bash. Plan mode and subagents are added through extensions only when a team wants them.'}
};
function seg(cls, grow, txt){ return '<span class="hwht-seg-i ' + cls + '" style="flex:' + grow + ' 1 0" title="' + txt + '">' + (grow >= 12 ? txt : '') + '</span>'; }
function draw(){
var c = cfg[mode], h = '';
for (var i = 0; i < n; i++) {
var tot = c.sys + c.tools + i * 12 + 14;
h += '<div class="hwht-call-row"><small>Call ' + (i + 1) + '</small><div class="hwht-stack" style="width:' + (tot / 106 * 100).toFixed(1) + '%">' +
seg('k-sys', c.sys, 'Instructions') + seg('k-tools', c.tools, 'Tool definitions') + (i ? seg('k-conv', i * 12, 'Conversation') : '') + seg('k-task', 14, 'Work') +
'</div></div>';
}
calls.innerHTML = h; tl.textContent = c.label; tools.innerHTML = c.chips; c2.innerHTML = c.call;
}
tabs(v2.querySelectorAll('.hwht-seg [role="tab"]'), function(el){ mode = el.getAttribute('data-mode'); draw(); });
var radios = [].slice.call(v2.querySelectorAll('.hwht-turns [role="radio"]'));
radios.forEach(function(r, i){
function pick(focus){ radios.forEach(function(x){ var on = x === r; x.setAttribute('aria-checked', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1; }); n = +r.getAttribute('data-n'); if (focus) r.focus(); draw(); }
r.addEventListener('click', function(){ pick(); });
r.addEventListener('keydown', function(e){
if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); }
if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); var nx = radios[(i + (e.key === 'ArrowRight' ? 1 : radios.length - 1)) % radios.length]; nx.click(); nx.focus(); }
});
});
}

/* Visual 3: what to measure */
var v3 = document.getElementById('hwht-v3');
if (v3) {
var ms = [].slice.call(v3.querySelectorAll('.hwht-metric')), c3 = v3.querySelector('[data-call]');
var info = [
{hot: [0, 1, 2], t: '<strong>Swap the model</strong> and success, cost per successful task, and latency move first. This is the comparison leaderboards already make.'},
{hot: [1, 5, 0], t: '<strong>Swap the harness</strong> and hold the model constant. In Arena’s study this moved cost by 1.5x to 2x while success moved 2% to 5%.'},
{hot: [1, 3, 4], t: '<strong>Change the tools</strong> loaded for a job and you change what is described on every call, how often the agent has to recover, and how much steering it needs.'},
{hot: [5, 1, 0], t: '<strong>Change the context</strong> each task starts with. It compounds across turns, so growth here shows up in both quality and the bill.'},
{hot: [4, 2, 3], t: '<strong>Change the workflow</strong> around the agent: where humans review, how tasks are scoped, and when a session ends.'}
];
tabs(v3.querySelectorAll('.hwht-factor'), function(el){
var d = info[+el.getAttribute('data-i')];
ms.forEach(function(m, j){ m.className = 'hwht-metric' + (j === 1 ? ' is-key' : '') + (d.hot.indexOf(j) > -1 ? ' is-hot' : ''); });
c3.innerHTML = d.t;
});
}
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":37770,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":1611,"estimatedReadTimeSeconds":406,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

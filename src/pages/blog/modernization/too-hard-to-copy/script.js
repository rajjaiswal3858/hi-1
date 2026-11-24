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

/* Visual 1: bottleneck */
var v1 = document.getElementById('hwtc-v1');
if (v1) {
var st = [].slice.call(v1.querySelectorAll('.hwtc-stage')), c1 = v1.querySelector('[data-call]');
var modes = {
then: [['Scarce expert time spent reading decompiler output by hand.', 'Bottleneck', 'is-neck'], ['Experts judged the result as they went.', 'Built into step 1', 'is-dark']],
now: [['Agents paired with Ghidra and similar tools do much of the reading, for weeks at a time.', 'Largely automated', 'is-easy'], ['Something has to prove the output is right. Agents will cheat a loose check.', 'Bottleneck', 'is-neck']]
};
tabs(v1.querySelectorAll('.hwtc-seg [role="tab"]'), function(el){
var m = el.getAttribute('data-mode');
v1.className = 'hwtc-viz' + (m === 'now' ? ' is-now' : '');
st.forEach(function(s, i){
var d = modes[m][i];
s.className = 'hwtc-stage' + (d[2] === 'is-neck' ? ' is-neck' : (d[2] === 'is-easy' ? ' is-easy' : ''));
s.querySelector('[data-d]').textContent = d[0];
var p = s.querySelector('[data-p]'); p.textContent = d[1]; p.className = 'hwtc-pill ' + (d[2] === 'is-neck' ? 'is-no' : (d[2] === 'is-easy' ? 'is-go' : 'is-part'));
});
c1.innerHTML = m === 'now'
? '<strong>The limit is verification now.</strong> Where a task has a referee, agents grind until it passes. Where it doesn’t, code can look right and stay wrong.'
: '<strong>Understanding was the expensive part.</strong> The technique is decades old. Expert time to make sense of the output was what kept copying slow.';
});
}

/* Visual 2: week in numbers */
var v2 = document.getElementById('hwtc-v2');
if (v2) {
var panel = v2.querySelector('[data-panel]'), c2 = v2.querySelector('[data-call]'), src = v2.querySelector('[data-src]');
function tile(b, s){ return '<div class="hwtc-tile"><b>' + b + '</b><span>' + s + '</span></div>'; }
function bar(l, v, t){ return '<div class="hwtc-bar"><span>' + l + '</span><span class="hwtc-track"><i class="hwtc-fill" data-w="' + v + '"></i></span><span class="hwtc-val">' + t + '</span></div>'; }
var sets = [
{p: '<div class="hwtc-tiles">' + tile('7', 'free, open-source apps mirroring the Adobe suite') + tile('Rust', 'built, the developer says, with Claude Opus 5.5') + tile('134 / 135', 'Photoshop test files opened and resaved byte for byte') + '</div>' + bar('PSD files that round-trip', 99, '~99%'),
c: '<strong>File compatibility is closest to done,</strong> because a file either round-trips or it does not. The rest of the suite is "janky for now."',
s: 'Sources: Artcraft project page, HotHardware, Gizmodo.'},
{p: '<div class="hwtc-tiles">' + tile('~3 months', 'one researcher, about one quarter') + tile('15+', 'agents across Claude and Codex subscriptions') + tile('600B to 700B', 'estimated tokens used') + '</div>' + bar('Functions present', 99, '99%') + bar('Byte-exact', 83, '83%'),
c: '<strong>Roughly five in six functions are provably identical</strong> to the original, in a game that plays.',
s: 'Source: Maurice Heumann’s project write-up, October 9, 2026.'},
{p: '<div class="hwtc-tiles">' + tile('100K+', 'GitHub stars in about a week') + tile('5 of 7', 'days at the top of GitHub Trending through October 12') + tile('5 agents', 'connected to Ghidra, IDA Pro and other tools') + '</div>',
c: '<strong>Reverse engineering is now a plug-in.</strong> The README says analysis runs locally, but the agent’s model provider still receives the results.',
s: 'Sources: REA repository, DEV Community.'}
];
tabs(v2.querySelectorAll('.hwtc-seg [role="tab"]'), function(el){
var s = sets[+el.getAttribute('data-i')];
panel.innerHTML = s.p; c2.innerHTML = s.c; src.textContent = s.s;
setTimeout(function(){ [].slice.call(panel.querySelectorAll('[data-w]')).forEach(function(i){ i.style.width = i.getAttribute('data-w') + '%'; }); }, 30);
});
}

/* Visual 3: exposure check */
var v3 = document.getElementById('hwtc-v3');
if (v3) {
var rows = [].slice.call(v3.querySelectorAll('.hwtc-row')), sum = v3.querySelector('[data-sum]');
function paint(){
var on = rows.filter(function(r){ return r.getAttribute('aria-checked') === 'true'; });
if (!on.length) { sum.className = 'hwtc-sum'; sum.innerHTML = '<strong>Nothing selected yet.</strong><p>Pick every place your product’s advantage actually lives.</p>'; return; }
var hi = on.filter(function(r){ return r.getAttribute('data-x') === '3'; }).length;
var mid = on.filter(function(r){ return r.getAttribute('data-x') === '2'; }).length;
var low = on.length - hi - mid;
if (hi) { sum.className = 'hwtc-sum is-high'; sum.innerHTML = '<strong>High exposure: ' + hi + ' of ' + on.length + ' selected.</strong><p>Start with the defend moves below: map what runs on the device and re-price around what can’t be copied.</p>'; }
else if (mid) { sum.className = 'hwtc-sum is-mid'; sum.innerHTML = '<strong>Medium exposure.</strong><p>Copies will arrive rough. Release speed and support keep you ahead while they catch up.</p>'; }
else { sum.className = 'hwtc-sum is-low'; sum.innerHTML = '<strong>Low exposure: ' + low + ' of ' + on.length + ' selected.</strong><p>Your advantage lives off the device. Govern how your own teams use these tools, then put them to work on legacy code.</p>'; }
}
rows.forEach(function(r){
function toggle(){ r.setAttribute('aria-checked', r.getAttribute('aria-checked') === 'true' ? 'false' : 'true'); paint(); }
r.addEventListener('click', toggle);
r.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
});
paint();
}

/* Visual 4: plan */
var v4 = document.getElementById('hwtc-v4');
if (v4) {
var panels = [].slice.call(v4.querySelectorAll('[role="tabpanel"]'));
tabs(v4.querySelectorAll('.hwtc-seg [role="tab"]'), function(el){
var i = +el.getAttribute('data-i');
panels.forEach(function(p, j){ if (j === i) p.removeAttribute('hidden'); else p.setAttribute('hidden', ''); });
});
}
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":37768,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":1940,"estimatedReadTimeSeconds":489,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

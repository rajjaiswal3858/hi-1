(function(){
var root=document.getElementById('hwae-v1'); if(!root) return;
var D=[
{tests:'Routers, tools, and skills, each one in isolation.',q:'Given this input, did the agent pick the right tool or skill, with the right parameters?',catches:'Wrong tool choices, bad parameters, failed API calls, and outputs that break the required schema.',grade:'Fast, cheap, and usually deterministic. Unit-test thinking still works here.',skip:'you’ll know something broke, but not where.'},
{tests:'The full path the agent took from start to finish.',q:'Did it loop, retry more than it should have, recover cleanly from a tool failure, or lose track of the goal?',catches:'The agent that gets the right answer after 14 tool calls when three would do.',grade:'Score the sequence of steps and tool calls, not just the final answer.',skip:'you’ll miss the agent that loops for ten minutes and still “passes.”'},
{tests:'The business outcome and the user experience.',q:'Did the workflow complete correctly and safely, at an acceptable latency and cost?',catches:'Jobs that look fine step by step but don’t deliver. For a support agent: was the refund processed, the policy respected, and the customer notified on time?',grade:'The layer stakeholders care about, and the one that decides whether the agent goes live.',skip:'every step can pass while the job itself still fails.'}];
var tabs=root.querySelectorAll('.hwae-layer'), panel=root.querySelector('.hwae-panel');
function show(i){
for(var t=0;t<tabs.length;t++){tabs[t].setAttribute('aria-selected',t===i?'true':'false');tabs[t].tabIndex=t===i?0:-1;}
['tests','q','catches','grade'].forEach(function(k){panel.querySelector('[data-k="'+k+'"]').textContent=D[i][k];});
panel.querySelector('[data-k="skip"]').innerHTML='<strong>Skip it and</strong> '+D[i].skip;
}
for(var t=0;t<tabs.length;t++){(function(i){
tabs[i].addEventListener('click',function(){show(i);});
tabs[i].addEventListener('keydown',function(e){if(e.key==='ArrowUp'||e.key==='ArrowRight'){e.preventDefault();var n=(i+1)%3;show(n);tabs[n].focus();}if(e.key==='ArrowDown'||e.key==='ArrowLeft'){e.preventDefault();var p=(i+2)%3;show(p);tabs[p].focus();}});
})(t);}
show(0);
})();
;
(function(){
var root=document.getElementById('hwae-v2'); if(!root) return;
var p=document.getElementById('hwae-v2-p'),k=document.getElementById('hwae-v2-k'),bars=document.getElementById('hwae-v2-bars');
for(var i=1;i<=10;i++){var d=document.createElement('div');d.className='hwae-bar';d.appendChild(document.createElement('i'));bars.appendChild(d);}
function fmt(x){x=x*100;if(x>=99.95)return '>99.9%';return (x>=99?x.toFixed(1):x>=10?Math.round(x):x.toFixed(1))+'%';}
function draw(){
var pv=+p.value/100,kv=+k.value;
document.getElementById('hwae-v2-po').textContent=p.value+'%';
document.getElementById('hwae-v2-ko').textContent=kv;
document.getElementById('hwae-v2-all').textContent=fmt(Math.pow(pv,kv));
document.getElementById('hwae-v2-any').textContent=fmt(1-Math.pow(1-pv,kv));
var b=bars.children;
for(var j=0;j<10;j++){b[j].firstChild.style.height=(Math.pow(pv,j+1)*100)+'%';b[j].className='hwae-bar'+(j+1===kv?' is-on':j+1<kv?' is-past':'');}
}
p.addEventListener('input',draw);k.addEventListener('input',draw);draw();
})();
;
(function(){
var root=document.getElementById('hwae-v3'); if(!root) return;
var items=root.querySelectorAll('.hwae-check'),bar=root.querySelector('.hwae-meter i'),out=root.querySelector('.hwae-result');
function upd(){
var gaps=[],n=0;
for(var i=0;i<items.length;i++){if(items[i].getAttribute('aria-pressed')==='true')n++;else gaps.push(items[i].getAttribute('data-n'));}
bar.style.width=(n/items.length*100)+'%';
var msg;
if(n===0) msg='Start with the happy path, then work down the list.';
else if(n===items.length) msg='Full coverage. Keep adding scenarios from real production failures.';
else msg='Gaps to fill: '+gaps.join(', ')+'.';
out.innerHTML='<strong>'+n+' of '+items.length+' covered.</strong> '+msg;
}
for(var i=0;i<items.length;i++){items[i].addEventListener('click',function(){this.setAttribute('aria-pressed',this.getAttribute('aria-pressed')==='true'?'false':'true');upd();});}
upd();
})();
;
(function(){
var root=document.getElementById('hwae-v4'); if(!root) return;
var D=[
['Step 1: Define evaluation goals and success metrics','Write down the agent’s purpose, what counts as success, and the cost, latency, and safety constraints it must respect. Turn each one into a metric with a target.','#hwae-s-measure','What to Measure'],
['Step 2: Build representative test cases','Start with around 20 scenarios that cover every supported intent and tool path, plus refusals and edge cases. Grow the suite from real inputs once you have traffic.','#hwae-s-suites','Designing Test Suites'],
['Step 3: Decompose the agent into steps','Map the router, skills, tool calls, retrieval, and API calls as separate units, so a failure points to the step that broke.','#hwae-s-capability','Evaluating by Capability'],
['Step 4: Choose a grader for each step','Code-based checks wherever possible, LLM judges for subjective quality, and human review for high-stakes outputs. Write the rubric first.','#hwae-s-graders','Graders, Rubrics, and Scoring'],
['Step 5: Run experiments and prevent regressions','Run each scenario multiple times, track pass^k, compare every change against your baseline, and let safety failures block a release automatically.','#hwae-s-nondeterministic','Evaluating Non-deterministic Agents'],
['Step 6: Monitor in production','Instrument traces so you can replay any run, then watch for drift and new failure patterns.','#hwae-s-online','Online Evaluation and Observability'],
['Step 7: Feed production learnings back into your test suite','Every production failure becomes a new test case, and every borderline human review sharpens a rubric. Give the loop an owner and a regular cadence.','#hwae-s-release','Release Gates and Evaluation Ownership']];
var tabs=root.querySelectorAll('.hwae-step'),panel=root.querySelector('.hwae-panel'),cur=0;
function show(i){
cur=(i+7)%7;
for(var t=0;t<tabs.length;t++){tabs[t].setAttribute('aria-selected',t===cur?'true':'false');tabs[t].tabIndex=t===cur?0:-1;}
panel.querySelector('h4').textContent=D[cur][0];
panel.querySelector('p').textContent=D[cur][1];
var a=panel.querySelector('a');a.setAttribute('href',D[cur][2]);a.textContent='Go to: '+D[cur][3];
}
for(var t=0;t<tabs.length;t++){(function(i){tabs[i].addEventListener('click',function(){show(i);});})(t);}
var nav=panel.querySelectorAll('.hwae-nav button');
for(var n=0;n<nav.length;n++){nav[n].addEventListener('click',function(){show(cur+(+this.getAttribute('data-d')));});}
show(0);
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":38031,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":5194,"estimatedReadTimeSeconds":1309,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

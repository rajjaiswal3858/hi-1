(function(){
    var box=document.getElementById('hw-cah-loopviz'); if(!box) return;
    var turns=[
      {stage:1,gate:'loop',label:'Iteration 1',final:false,turn:'Iteration 1',text:'Reasons that it must see the code first. Requests Read(auth.py). Harness returns 40 lines.'},
      {stage:1,gate:'loop',label:'Iteration 2',final:false,turn:'Iteration 2',text:'Reasons it should reproduce the failure. Requests Bash(pytest). Harness returns one failing assertion.'},
      {stage:1,gate:'loop',label:'Iteration 3',final:false,turn:'Iteration 3',text:'Locates the off-by-one in the token check. Requests Edit(auth.py). Harness applies the change.'},
      {stage:1,gate:'loop',label:'Iteration 4',final:false,turn:'Iteration 4',text:'Reasons it must confirm the fix. Requests Bash(pytest). Harness returns all tests passing.'},
      {stage:0,gate:'done',label:'Loop ends',final:true,turn:'Final answer',text:'No tool requested. The stop check passes and the harness ends the loop, returning the result to the caller.'}
    ];
    var i=-1;
    var stages=box.querySelectorAll('.hw-cah-stage');
    var iter=box.querySelector('[data-loop="iter"]');
    var gate=box.querySelector('[data-loop="gate"]');
    var gatepill=box.querySelector('[data-loop="gatepill"]');
    var log=box.querySelector('[data-loop="log"]');
    var prev=box.querySelector('[data-loop="prev"]');
    var next=box.querySelector('[data-loop="next"]');
    var reset=box.querySelector('[data-loop="reset"]');
    function render(){
      for(var s=0;s<stages.length;s++){stages[s].classList.remove('hw-cah-on');}
      log.innerHTML='';
      if(i<0){
        iter.textContent='Press start';
        gate.className='hw-cah-gate hw-cah-gate-loop'; gatepill.textContent='waiting';
      } else {
        for(var k=0;k<=i;k++){
          var t=turns[k];
          var li=document.createElement('li');
          li.className='hw-cah-log-li'+(t.final?' hw-cah-log-final':'');
          var sp=document.createElement('span'); sp.className='hw-cah-log-turn'; sp.textContent=t.turn+': ';
          li.appendChild(sp); li.appendChild(document.createTextNode(t.text));
          log.appendChild(li);
        }
        var cur=turns[i];
        iter.textContent=cur.label;
        if(!cur.final){ for(var a=0;a<stages.length;a++){stages[a].classList.add('hw-cah-on');} }
        if(cur.gate==='done'){ gate.className='hw-cah-gate hw-cah-gate-done'; gatepill.textContent='done, exit loop'; }
        else { gate.className='hw-cah-gate hw-cah-gate-loop'; gatepill.textContent='not done, loop again'; }
      }
      prev.setAttribute('aria-disabled', i<0?'true':'false');
      next.setAttribute('aria-disabled', i>=turns.length-1?'true':'false');
    }
    function go(n){ i=Math.max(-1,Math.min(turns.length-1,n)); render(); }
    function bind(node,fn){ if(!node)return; node.addEventListener('click',fn); node.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){e.preventDefault();fn();} }); }
    bind(next,function(){go(i+1);}); bind(prev,function(){go(i-1);}); bind(reset,function(){go(-1);});
    render();
  })();
;
(function(){
    var root=document.getElementById('hw-cah-router'); if(!root) return;
    var data={
      code:{name:'Claude Code',why:'Interactive, hands-on work suits the harness as a finished runtime. You drive it in a terminal and it brings the loop, tools, and context handling with it.',combine:'Graduate to the Agent SDK when you want that same behavior embedded in your own code rather than driven by hand.'},
      sdk:{name:'Agent SDK',why:'Embedding an agent in your own product or pipeline is exactly the SDK case. You call it, pass a prompt and options, and it owns the loop, tool execution, and context for you.',combine:'Move to Managed Agents for production scale, and keep your Skills and MCP tools, which carry across both.'},
      api:{name:'Raw Messages API',why:'A single response with no tools, or total control of a custom loop, is the raw API. There is no harness here, which is the point: you build exactly what you need and nothing else.',combine:'If you find yourself hand-writing a tool-execution loop, that is the signal to move up to the Agent SDK.'},
      managed:{name:'Managed Agents',why:'Running many agents in production without operating sandboxes and sessions is what the hosted layer is for. The runtime, sandboxes, and session log are run for you.',combine:'Prototype first with the Agent SDK locally, then graduate the same agent to managed infrastructure.'}
    };
    var opts=root.querySelectorAll('.hw-cah-router-opt');
    var badge=root.querySelector('[data-router="badge"]');
    var why=root.querySelector('[data-router="why"]');
    var combine=root.querySelector('[data-router="combine"]');
    function select(key,node){
      for(var j=0;j<opts.length;j++){opts[j].setAttribute('aria-pressed','false');}
      node.setAttribute('aria-pressed','true');
      var d=data[key]; badge.textContent=d.name; why.textContent=d.why; combine.textContent=d.combine;
      root.classList.add('hw-cah-answered');
    }
    for(var k=0;k<opts.length;k++){
      (function(node){
        var key=node.getAttribute('data-key');
        node.addEventListener('click',function(){select(key,node);});
        node.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){e.preventDefault();select(key,node);} });
      })(opts[k]);
    }
  })();
;
(function(){
    var root=document.getElementById('hw-cah-acc'); if(!root) return;
    function toggle(head){
      var item=head.parentNode;
      var open=item.classList.toggle('hw-cah-open');
      head.setAttribute('aria-expanded',open?'true':'false');
      var sign=head.querySelector('.hw-cah-acc-sign'); if(sign)sign.textContent=open?'\u2212':'+';
    }
    var heads=root.querySelectorAll('.hw-cah-acc-head');
    for(var i=0;i<heads.length;i++){
      (function(head){
        head.addEventListener('click',function(){toggle(head);});
        head.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){e.preventDefault();toggle(head);} });
      })(heads[i]);
    }
  })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":35534,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":2389,"estimatedReadTimeSeconds":602,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

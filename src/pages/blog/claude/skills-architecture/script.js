(function(){
    var box=document.getElementById('hw-cska-pdsim'); if(!box) return;
    var L1='Skill metadata x3', L2='pdf SKILL.md body', L3a='forms.md (reference)';
    var steps=[
      {w:8, t:'At startup', d:'Claude loads only the name and description of every installed Skill into the system prompt. It knows each Skill exists and roughly when it applies, nothing more.', note:'Cost so far: a few tokens per Skill.', loads:[[L1,1]]},
      {w:8, t:'A task arrives', d:'The user says: "Fill out this PDF form." Claude scans the metadata it already holds and matches the pdf-processing Skill.', note:'Still only metadata in context. The match is made from Level 1 alone.', loads:[[L1,1]]},
      {w:40, t:'The Skill triggers', d:'Claude reads SKILL.md for the matched Skill. Its procedural core enters context. The other two Skills stay untouched on disk.', note:'Level 2 loads on match, not at startup.', loads:[[L1,1],[L2,2]]},
      {w:55, t:'A detail is needed', d:'The task involves form fields, so Claude opens the referenced forms.md. The API reference and the other Skills remain unread.', note:'Level 3 references load only along the path the task actually takes.', loads:[[L1,1],[L2,2],[L3a,3]]},
      {w:55, t:'A script runs', d:'Claude executes extract.py as a tool to pull the form fields, then returns the result.', note:'Key insight: the script ran without ever entering the context window. The meter does not move.', loads:[[L1,1],[L2,2],[L3a,3]]}
    ];
    var i=0;
    var el={
      step:box.querySelector('[data-pdsim="step"]'),
      fill:box.querySelector('[data-pdsim="fill"]'),
      loads:box.querySelector('[data-pdsim="loads"]'),
      title:box.querySelector('[data-pdsim="title"]'),
      desc:box.querySelector('[data-pdsim="desc"]'),
      note:box.querySelector('[data-pdsim="note"]'),
      prev:box.querySelector('[data-pdsim="prev"]'),
      next:box.querySelector('[data-pdsim="next"]'),
      reset:box.querySelector('[data-pdsim="reset"]')
    };
    function render(){
      var s=steps[i];
      el.step.textContent='Step '+(i+1)+' of '+steps.length;
      el.fill.style.width=s.w+'%';
      el.title.textContent=s.t;
      el.desc.textContent=s.d;
      el.note.textContent=s.note;
      el.loads.innerHTML='';
      for(var k=0;k<s.loads.length;k++){
        var li=document.createElement('li');
        li.className='hw-cska-sim-chip hw-cska-sim-chip-l'+s.loads[k][1];
        li.textContent=s.loads[k][0];
        el.loads.appendChild(li);
      }
      el.prev.setAttribute('aria-disabled', i===0?'true':'false');
      el.next.setAttribute('aria-disabled', i===steps.length-1?'true':'false');
    }
    function go(n){ i=Math.max(0,Math.min(steps.length-1,n)); render(); }
    function bind(node,fn){
      if(!node)return;
      node.addEventListener('click',fn);
      node.addEventListener('keydown',function(e){
        if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){e.preventDefault();fn();}
      });
    }
    bind(el.next,function(){go(i+1);});
    bind(el.prev,function(){go(i-1);});
    bind(el.reset,function(){go(0);});
    render();
  })();
;
(function(){
    var root=document.getElementById('hw-cska-router'); if(!root) return;
    var data={
      prompt:{name:'Prompt',role:'Reactive direction',why:'A one-time, conversational instruction is exactly what a prompt is for. It is ephemeral and applies to the task in front of you, so there is nothing to codify yet.',combine:'Combine with a Skill: let the Skill carry the repeatable method, then use a prompt to refine the result for this specific case.'},
      skill:{name:'Skill',role:'Method, the how',why:'Repeatable procedure that should run the same way every time is the definition of a Skill. Package the steps once and Claude applies them consistently across conversations and surfaces.',combine:'Combine with MCP for live data and with subagents that load the Skill to do specialized work.'},
      project:{name:'Project',role:'Context, the what',why:'Standing background knowledge about one initiative belongs in a Project. It gives Claude the facts and instructions for that body of work, not a reusable procedure.',combine:'Combine with a Skill: the Project supplies the what, the Skill supplies the how. If you keep copying the same instructions into Projects, promote them to a Skill.'},
      mcp:{name:'MCP server',role:'Connectivity',why:'Reaching live data or acting on an external system is connectivity, which a Skill cannot provide. An MCP server exposes the tool or data source Claude connects to.',combine:'Combine with a Skill: MCP gets Claude to the data, the Skill tells Claude what to do with it once it is there.'},
      subagent:{name:'Subagent',role:'Division of labor',why:'Isolated or parallel execution with its own tools and context is what a subagent gives you. It runs a discrete task independently and returns a result.',combine:'Combine with a Skill: keep shared expertise in a Skill the subagent loads, rather than hardcoding it into the subagent prompt.'}
    };
    var opts=root.querySelectorAll('.hw-cska-router-opt');
    var ans=root.querySelector('[data-router="ans"]');
    var badge=root.querySelector('[data-router="badge"]');
    var role=root.querySelector('[data-router="role"]');
    var why=root.querySelector('[data-router="why"]');
    var combine=root.querySelector('[data-router="combine"]');
    function select(key,node){
      for(var j=0;j<opts.length;j++){opts[j].setAttribute('aria-pressed','false');}
      node.setAttribute('aria-pressed','true');
      var d=data[key];
      badge.textContent=d.name;
      role.textContent=d.role;
      why.textContent=d.why;
      combine.textContent=d.combine;
      root.classList.add('hw-cska-answered');
    }
    for(var k=0;k<opts.length;k++){
      (function(node){
        var key=node.getAttribute('data-key');
        node.addEventListener('click',function(){select(key,node);});
        node.addEventListener('keydown',function(e){
          if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){e.preventDefault();select(key,node);}
        });
      })(opts[k]);
    }
  })();
;
(function(){
    var root=document.getElementById('hw-cska-acc'); if(!root) return;
    function toggle(head){
      var item=head.parentNode;
      var open=item.classList.toggle('hw-cska-open');
      head.setAttribute('aria-expanded',open?'true':'false');
      var sign=head.querySelector('.hw-cska-acc-sign');
      if(sign)sign.textContent=open?'\u2212':'+';
    }
    var heads=root.querySelectorAll('.hw-cska-acc-head');
    for(var i=0;i<heads.length;i++){
      (function(head){
        head.addEventListener('click',function(){toggle(head);});
        head.addEventListener('keydown',function(e){
          if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){e.preventDefault();toggle(head);}
        });
      })(heads[i]);
    }
  })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":35515,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":2718,"estimatedReadTimeSeconds":685,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

(function(){
    var box=document.getElementById('hw-csdk-builder'); if(!box) return;
    var ORDER=['Read','Grep','Glob','Edit','Bash'];
    var tools={Read:true,Grep:true,Glob:true,Edit:false,Bash:false};
    var mode='plan', turns='30', mcp=false;
    var behavior=box.querySelector('[data-bld="behavior"]');
    var snippet=box.querySelector('[data-bld="snippet"]');
    function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
    function render(){
      var list=ORDER.filter(function(t){return tools[t];});
      var toolStr=list.map(function(t){return '"'+t+'"';}).join(', ');
      var lines=[];
      lines.push('options: {');
      lines.push('  allowedTools: ['+toolStr+'],');
      lines.push('  permissionMode: "'+mode+'",');
      lines.push('  maxTurns: '+turns+(mcp?',':''));
      if(mcp){ lines.push('  mcpServers: { db: myDatabaseServer }'); }
      lines.push('}');
      snippet.innerHTML=esc(lines.join('\n'));
      var canWrite=tools.Edit||tools.Bash;
      var msg;
      if(mode==='plan'){ msg='Plan mode. It analyzes and proposes a plan but makes no changes, whatever tools are listed.'; }
      else if(mode==='bypassPermissions'){ msg='Every tool runs with no prompt. Reserve this for sandboxed, trusted, throwaway environments only.'; }
      else if(!canWrite){ msg='Read-only. It can analyze the codebase but cannot change anything.'; }
      else if(mode==='acceptEdits'){ msg='File edits apply without prompting; other actions like Bash still prompt for approval.'; }
      else { msg='Pre-approved tools run automatically; anything else routes to your canUseTool callback for a decision.'; }
      if(mcp){ msg+=' It can also reach an external system through your MCP server.'; }
      msg+=' Capped at '+turns+' turns.';
      behavior.textContent=msg;
    }
    function bindToggle(node,fn){
      node.addEventListener('click',fn);
      node.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){e.preventDefault();fn();} });
    }
    // tools (multi-select)
    var toolEls=box.querySelectorAll('[data-tool]');
    for(var i=0;i<toolEls.length;i++){(function(node){
      var t=node.getAttribute('data-tool');
      bindToggle(node,function(){ tools[t]=!tools[t]; node.setAttribute('aria-pressed',tools[t]?'true':'false'); render(); });
    })(toolEls[i]);}
    // mode (single-select)
    var modeEls=box.querySelectorAll('[data-mode]');
    for(var m=0;m<modeEls.length;m++){(function(node){
      bindToggle(node,function(){ mode=node.getAttribute('data-mode'); for(var k=0;k<modeEls.length;k++){modeEls[k].setAttribute('aria-pressed','false');} node.setAttribute('aria-pressed','true'); render(); });
    })(modeEls[m]);}
    // turns (single-select)
    var turnEls=box.querySelectorAll('[data-turns]');
    for(var n=0;n<turnEls.length;n++){(function(node){
      bindToggle(node,function(){ turns=node.getAttribute('data-turns'); for(var k=0;k<turnEls.length;k++){turnEls[k].setAttribute('aria-pressed','false');} node.setAttribute('aria-pressed','true'); render(); });
    })(turnEls[n]);}
    // mcp (toggle)
    var mcpEl=box.querySelector('[data-mcp]');
    bindToggle(mcpEl,function(){ mcp=!mcp; mcpEl.setAttribute('aria-pressed',mcp?'true':'false'); render(); });
    render();
  })();
;
(function(){
    var root=document.getElementById('hw-csdk-canuse'); if(!root) return;
    var data={
      read:{v:'allow',cls:'hw-csdk-v-allow',ret:'{ behavior: "allow",\n  updatedInput: input }',note:'A read-only operation. It is allowed and the input passes through unchanged.'},
      env:{v:'deny',cls:'hw-csdk-v-deny',ret:'{ behavior: "deny",\n  message: "Cannot modify .env files" }',note:'A secret-bearing file. The callback blocks it by name, regardless of the model\u0027s intent.'},
      rm:{v:'deny',cls:'hw-csdk-v-deny',ret:'{ behavior: "deny",\n  message: "Destructive command blocked" }',note:'Denied as defense in depth, even if Bash is otherwise allowed. The riskiest calls get a hard stop.'},
      edit:{v:'allow with modified input',cls:'hw-csdk-v-modify',ret:'{ behavior: "allow",\n  updatedInput: scopedToSrc(input) }',note:'Allowed, but the callback narrows the input first, for example confining the edit to the src directory.'}
    };
    var opts=root.querySelectorAll('.hw-csdk-sel-opt');
    var verdict=root.querySelector('[data-sel="verdict"]');
    var ret=root.querySelector('[data-sel="ret"]');
    var note=root.querySelector('[data-sel="note"]');
    function select(key,node){
      for(var j=0;j<opts.length;j++){opts[j].setAttribute('aria-pressed','false');}
      node.setAttribute('aria-pressed','true');
      var d=data[key];
      verdict.className='hw-csdk-verdict '+d.cls; verdict.textContent=d.v;
      ret.textContent=d.ret; note.textContent=d.note;
      root.classList.add('hw-csdk-answered');
    }
    for(var k=0;k<opts.length;k++){(function(node){
      var key=node.getAttribute('data-key');
      node.addEventListener('click',function(){select(key,node);});
      node.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){e.preventDefault();select(key,node);} });
    })(opts[k]);}
  })();
;
(function(){
    var root=document.getElementById('hw-csdk-acc'); if(!root) return;
    function toggle(head){
      var item=head.parentNode;
      var open=item.classList.toggle('hw-csdk-open');
      head.setAttribute('aria-expanded',open?'true':'false');
      var sign=head.querySelector('.hw-csdk-acc-sign'); if(sign)sign.textContent=open?'\u2212':'+';
    }
    var heads=root.querySelectorAll('.hw-csdk-acc-head');
    for(var i=0;i<heads.length;i++){(function(head){
      head.addEventListener('click',function(){toggle(head);});
      head.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){e.preventDefault();toggle(head);} });
    })(heads[i]);}
  })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":35587,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":2193,"estimatedReadTimeSeconds":553,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

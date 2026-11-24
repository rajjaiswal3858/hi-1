(function(){
    var root=document.getElementById('hw-ccode-modes'); if(!root) return;
    var data={
      default:{name:'Default',out:[['ask','Asks you before edits and before running commands'],['ok','Pre-approved tools in your allow rules run without asking'],['block','Anything in your deny rules is refused']],note:'The safe starting point. You see and approve each consequential action.'},
      accept:{name:'Auto-Accept edits',out:[['ok','File reads and edits run without prompting'],['ask','Non-filesystem actions like shell commands still prompt'],['block','Deny rules and hooks can still stop a call']],note:'Faster iteration when you trust the edits, such as prototyping in an isolated directory.'},
      plan:{name:'Plan',out:[['ok','Claude analyzes the code and proposes a plan'],['block','No changes are made and no tools that act are run'],['ask','Claude may ask clarifying questions before finalizing the plan']],note:'Use it to review the approach before a single line changes. Approve, then switch modes to execute.'},
      bypass:{name:'Bypass permissions',out:[['ok','Every tool is auto-approved with no prompts'],['block','Deny rules and hooks are still evaluated first and can block'],['ask','Nothing prompts, so there is no human checkpoint']],note:'Use with extreme caution and only in controlled, sandboxed environments. The allow list does not constrain this mode; every tool is approved.'}
    };
    var opts=root.querySelectorAll('.hw-ccode-sel-opt');
    var badge=root.querySelector('[data-sel="badge"]');
    var out=root.querySelector('[data-sel="out"]');
    var note=root.querySelector('[data-sel="note"]');
    function select(key,node){
      for(var j=0;j<opts.length;j++){opts[j].setAttribute('aria-pressed','false');}
      node.setAttribute('aria-pressed','true');
      var d=data[key]; badge.textContent=d.name; note.textContent=d.note; out.innerHTML='';
      for(var k=0;k<d.out.length;k++){
        var li=document.createElement('li');
        li.className='hw-ccode-modeout-li hw-ccode-'+d.out[k][0];
        li.textContent=d.out[k][1];
        out.appendChild(li);
      }
      root.classList.add('hw-ccode-answered');
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
    var root=document.getElementById('hw-ccode-prims'); if(!root) return;
    var data={
      claudemd:{name:'CLAUDE.md',meta:'Lives at the project root and in your user folder',why:'A markdown file that loads at session start and stays for the whole session. It anchors the facts Claude should always hold: build commands, directory layout, conventions, and team norms.',note:'Best for: standing facts, not procedures and not hard rules. It is treated as context, so it influences behavior rather than enforcing it.'},
      skills:{name:'Skills',meta:'Lives under .claude/skills/<name>/ as SKILL.md plus files',why:'A reusable bundle of instructions, scripts, and resources the harness loads on demand when a request matches its description. It can also be invoked by name.',note:'Best for: a repeatable procedure with real domain logic or helper files that should run the same way every time.'},
      subagents:{name:'Subagents',meta:'Lives under .claude/agents/ as markdown with frontmatter',why:'A specialized agent with its own context window, prompt, and tool permissions. The main agent delegates a task and gets back a summary, keeping intermediate work out of the main thread.',note:'Best for: isolated or parallel work like deep search or a focused review that would otherwise clutter the main context.'},
      commands:{name:'Slash commands',meta:'Lives under .claude/commands/<name>.md',why:'A saved prompt template you trigger by name. The markdown body is sent as a prompt; Claude decides what to run from there.',note:'Best for: a prompt you type often, turned into one shortcut. If it needs real logic or files, reach for a Skill instead.'},
      hooks:{name:'Hooks',meta:'Configured in settings.json, fire on lifecycle events',why:'User-defined code that runs at fixed points in the loop, such as before or after a tool call. A pre-tool hook can inspect a call and block it outright.',note:'Best for: deterministic enforcement. This is a real guardrail because it is code, not a request the model can fail to follow.'},
      mcp:{name:'MCP servers',meta:'Configured per project or user, local or remote',why:'A Model Context Protocol server that exposes external tools and live data through one standard interface, which is how the agent reaches your database, tickets, or internal APIs.',note:'Best for: connectivity. When the agent needs current external state, this is the layer that provides it.'}
    };
    var opts=root.querySelectorAll('.hw-ccode-sel-opt');
    var badge=root.querySelector('[data-sel="badge"]');
    var meta=root.querySelector('[data-sel="meta"]');
    var why=root.querySelector('[data-sel="why"]');
    var note=root.querySelector('[data-sel="note"]');
    function select(key,node){
      for(var j=0;j<opts.length;j++){opts[j].setAttribute('aria-pressed','false');}
      node.setAttribute('aria-pressed','true');
      var d=data[key]; badge.textContent=d.name; meta.textContent=d.meta; why.textContent=d.why; note.textContent=d.note;
      root.classList.add('hw-ccode-answered');
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
    var root=document.getElementById('hw-ccode-acc'); if(!root) return;
    function toggle(head){
      var item=head.parentNode;
      var open=item.classList.toggle('hw-ccode-open');
      head.setAttribute('aria-expanded',open?'true':'false');
      var sign=head.querySelector('.hw-ccode-acc-sign'); if(sign)sign.textContent=open?'\u2212':'+';
    }
    var heads=root.querySelectorAll('.hw-ccode-acc-head');
    for(var i=0;i<heads.length;i++){
      (function(head){
        head.addEventListener('click',function(){toggle(head);});
        head.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){e.preventDefault();toggle(head);} });
      })(heads[i]);
    }
  })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":35555,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":2076,"estimatedReadTimeSeconds":523,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

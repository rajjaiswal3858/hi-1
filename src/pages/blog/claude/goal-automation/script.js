(function(){
    var root=document.getElementById('hw-cgoal-gradient'); if(!root) return;
    var data={
      suggest:{badge:'Lowest autonomy',cls:'hw-cgoal-b-low',agent:'Analyzes and recommends. It proposes a plan or an answer but executes nothing.',human:'Performs every action, using the agent as an adviser.',note:'Use when the cost of error is high or trust is still being built. Safe, but slow, and most of the work is still yours.'},
      approve:{badge:'Low autonomy',cls:'hw-cgoal-b-low',agent:'Plans and proposes each action, then waits.',human:'Approves or rejects each step before it runs.',note:'Use for consequential or irreversible actions, and in early rollout. The risk is approval fatigue, which pushes people to rubber-stamp.'},
      checkpoint:{badge:'Moderate autonomy',cls:'hw-cgoal-b-mid',agent:'Runs most steps on its own, pausing at defined checkpoints and before anything irreversible.',human:'Signs off at the checkpoints that matter and reviews progress.',note:'Use for verifiable work with a few high-stakes gates. The art is placing checkpoints where a mistake would be costly and hard to undo.'},
      autonomous:{badge:'Highest autonomy',cls:'hw-cgoal-b-high',agent:'Works the goal to completion inside its guardrails, verifying its own progress as it goes.',human:'Sets the bounds up front and reviews the outcome after.',note:'Use only when the work is reversible, the success check is reliable, and the blast radius is bounded. It demands strong verification and hard deny rules.'}
    };
    var opts=root.querySelectorAll('.hw-cgoal-sel-opt');
    var badge=root.querySelector('[data-sel="badge"]');
    var agent=root.querySelector('[data-sel="agent"]');
    var human=root.querySelector('[data-sel="human"]');
    var note=root.querySelector('[data-sel="note"]');
    function select(key,node){
      for(var j=0;j<opts.length;j++){opts[j].setAttribute('aria-pressed','false');}
      node.setAttribute('aria-pressed','true');
      var d=data[key];
      badge.className='hw-cgoal-badge '+d.cls; badge.textContent=d.badge;
      agent.textContent=d.agent; human.textContent=d.human; note.textContent=d.note;
      root.classList.add('hw-cgoal-answered');
    }
    for(var k=0;k<opts.length;k++){(function(node){
      var key=node.getAttribute('data-key');
      node.addEventListener('click',function(){select(key,node);});
      node.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){e.preventDefault();select(key,node);} });
    })(opts[k]);}
  })();
;
(function(){
    var root=document.getElementById('hw-cgoal-boundary'); if(!root) return;
    var data={
      format:{badge:'Agent autonomous',cls:'hw-cgoal-b-low',note:'Fully reversible and instantly verifiable by the test result. The agent does it and you review the outcome, no checkpoint needed.'},
      pr:{badge:'Agent autonomous',cls:'hw-cgoal-b-low',note:'A draft changes nothing on its own and is easy to discard. The agent can open it freely; the merge is a separate, higher tier.'},
      email:{badge:'Human approved',cls:'hw-cgoal-b-mid',note:'External and reputational, and hard to take back. The agent drafts it, but a human reads and sends.'},
      deploy:{badge:'Human approved',cls:'hw-cgoal-b-mid',note:'Consequential and not cleanly reversible. The agent can prepare and stage the release, but a human authorizes the push.'},
      architecture:{badge:'Human owned',cls:'hw-cgoal-b-high',note:'A judgment call with long-lived consequences and no objective success check. The agent can analyze options and recommend, but the decision stays with a person.'}
    };
    var opts=root.querySelectorAll('.hw-cgoal-sel-opt');
    var badge=root.querySelector('[data-sel="badge"]');
    var note=root.querySelector('[data-sel="note"]');
    function select(key,node){
      for(var j=0;j<opts.length;j++){opts[j].setAttribute('aria-pressed','false');}
      node.setAttribute('aria-pressed','true');
      var d=data[key];
      badge.className='hw-cgoal-badge '+d.cls; badge.textContent=d.badge; note.textContent=d.note;
      root.classList.add('hw-cgoal-answered');
    }
    for(var k=0;k<opts.length;k++){(function(node){
      var key=node.getAttribute('data-key');
      node.addEventListener('click',function(){select(key,node);});
      node.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){e.preventDefault();select(key,node);} });
    })(opts[k]);}
  })();
;
(function(){
    var root=document.getElementById('hw-cgoal-acc'); if(!root) return;
    function toggle(head){
      var item=head.parentNode;
      var open=item.classList.toggle('hw-cgoal-open');
      head.setAttribute('aria-expanded',open?'true':'false');
      var sign=head.querySelector('.hw-cgoal-acc-sign'); if(sign)sign.textContent=open?'\u2212':'+';
    }
    var heads=root.querySelectorAll('.hw-cgoal-acc-head');
    for(var i=0;i<heads.length;i++){(function(head){
      head.addEventListener('click',function(){toggle(head);});
      head.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '||e.key==='Spacebar'){e.preventDefault();toggle(head);} });
    })(heads[i]);}
  })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":35592,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":2651,"estimatedReadTimeSeconds":668,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

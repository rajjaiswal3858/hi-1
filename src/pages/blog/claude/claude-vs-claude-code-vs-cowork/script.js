(function(){
  var root=document.querySelector('[data-hw-cmp]'); if(!root) return;
  var btns=root.querySelectorAll('.hw-cmp-fbtn');
  var cards=root.querySelectorAll('.hw-cmp-card');
  var why=root.querySelector('[data-why]');
  var reasons={
    claude:'Claude the app keeps you in control of every decision. Reach for it when the value is in the quality of the thinking, not in the file work.',
    code:'Claude Code is built for engineers. Reach for it when the work touches a codebase, the terminal, or git.',
    cowork:'Cowork brings the same agent power to non-developers. Reach for it when you want a finished document or workflow, not a terminal.'
  };
  function apply(role){
    btns.forEach(function(b){b.setAttribute('aria-pressed', b.getAttribute('data-role')===role ? 'true':'false');});
    cards.forEach(function(c){
      c.classList.remove('hw-dim','hw-on');
      if(role!=='all'){ if(c.getAttribute('data-card')===role){c.classList.add('hw-on');} else {c.classList.add('hw-dim');} }
    });
    why.textContent = role==='all' ? '' : (reasons[role]||'');
  }
  btns.forEach(function(b){
    b.addEventListener('click',function(){apply(b.getAttribute('data-role'));});
    b.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();apply(b.getAttribute('data-role'));}});
  });
})();
;
(function(){
  var root=document.querySelector('[data-hw-pick]'); if(!root) return;
  var steps=root.querySelectorAll('.hw-pk-step');
  var box=root.querySelector('[data-resultbox]');
  var pill=root.querySelector('[data-rpill]'), rt=root.querySelector('[data-rtitle]'), rx=root.querySelector('[data-rtxt]');
  var data={
    code:{pill:'Claude Code',title:'Claude Code',txt:'You are doing engineering work. Use Claude Code in the terminal or your IDE, lean on Plan Mode for anything consequential, and review every diff before it merges. Pair it with Cowork later for the non-coding tasks around the product.'},
    cowork:{pill:'Cowork',title:'Cowork',txt:'You want a result, not a recipe. Open Cowork in the Claude desktop app, point it at the relevant folder, and describe the outcome. Keep a human review step before anything goes out, since consequential calls stay with you.'},
    claude:{pill:'Claude',title:'Claude (the app)',txt:'The value here is in the thinking. Use the Claude app to draft, analyze, and decide with full control over each step. When the thinking turns into file work or code, move to Cowork or Claude Code.'}
  };
  function show(sel){steps.forEach(function(s){s.classList.remove('hw-show');});box.classList.remove('hw-show');
    if(sel==='result')return; var t=root.querySelector('.hw-pk-step[data-step="'+sel+'"]'); if(t)t.classList.add('hw-show');}
  function result(key){steps.forEach(function(s){s.classList.remove('hw-show');});var d=data[key];pill.textContent=d.pill;rt.textContent=d.title;rx.textContent=d.txt;box.classList.add('hw-show');}
  root.querySelectorAll('.hw-pk-opt').forEach(function(o){
    function act(){var go=o.getAttribute('data-go'); if(go==='result'){result(o.getAttribute('data-result'));} else {show(go);}}
    o.addEventListener('click',act);
    o.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();act();}});
  });
  var rb=root.querySelector('[data-reset]');
  function doReset(){box.classList.remove('hw-show');show('1');}
  rb.addEventListener('click',doReset);
  rb.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();doReset();}});
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":35374,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":2725,"estimatedReadTimeSeconds":687,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

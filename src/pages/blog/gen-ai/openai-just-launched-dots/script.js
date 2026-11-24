(function(){
  document.querySelectorAll('.hwd-visual[data-hwd="tabs"]').forEach(function(root){
    var tabs = root.querySelectorAll('.hwd-tab');
    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        tabs.forEach(function(t){ t.setAttribute('aria-selected','false'); });
        root.querySelectorAll('.hwd-panel').forEach(function(p){ p.classList.remove('is-active'); });
        tab.setAttribute('aria-selected','true');
        var panel = root.querySelector('#' + tab.getAttribute('data-target'));
        if (panel) panel.classList.add('is-active');
      });
    });
  });
  document.querySelectorAll('.hwd-visual[data-hwd="checklist"]').forEach(function(root){
    var items = root.querySelectorAll('.hwd-check');
    var meter = root.querySelector('.hwd-meter');
    var bar = root.querySelector('.hwd-bar span');
    function update(){
      var on = 0;
      items.forEach(function(item){
        var box = item.querySelector('input');
        item.classList.toggle('is-on', box.checked);
        item.querySelector('.hwd-box').textContent = box.checked ? '✓' : '';
        if (box.checked) on++;
      });
      var msg = on + ' of ' + items.length + ' ready';
      if (on === items.length) msg += '. Now test one real customer journey end to end.';
      meter.textContent = msg;
      bar.style.width = (on / items.length * 100) + '%';
    }
    items.forEach(function(item){ item.querySelector('input').addEventListener('change', update); });
    update();
  });
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":37469,"isReadableSinglePost":true,"hasVimeoEmbed":false,"wordCount":2171,"estimatedReadTimeSeconds":547,"isLastPageOfMultiPagePost":true,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

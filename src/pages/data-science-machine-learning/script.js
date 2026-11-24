(function () {
  var root = document.getElementById('dsx');
  if (!root) return;
  var targets = root.querySelectorAll('[data-reveal]');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function showAll() { for (var i = 0; i < targets.length; i++) { targets[i].classList.add('dsx-in'); } }
  if (!('IntersectionObserver' in window) || reduce) { root.classList.add('dsx-no-js'); showAll(); return; }
  function sweep() {
    var pending = root.querySelectorAll('[data-reveal]:not(.dsx-in)');
    for (var i = 0; i < pending.length; i++) {
      if (pending[i].getBoundingClientRect().top < window.innerHeight * 0.92) pending[i].classList.add('dsx-in');
    }
  }
  var io = new IntersectionObserver(function (entries, obs) {
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      if (!e.isIntersecting) continue;
      e.target.classList.add('dsx-in');
      obs.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
  for (var i = 0; i < targets.length; i++) { io.observe(targets[i]); }
  sweep();
  window.addEventListener('scroll', sweep, { passive: true });
  window.addEventListener('load', sweep);
  setTimeout(showAll, 2500);
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":32796,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

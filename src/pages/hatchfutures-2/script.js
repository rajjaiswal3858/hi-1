(function () {
  var v = document.querySelector('#hf .hf-hero-video');
  if (v) { v.muted = true; var p = v.play(); if (p && p.catch) p.catch(function(){}); }

  var revEls = document.querySelectorAll('#hf .hf-prog-card');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('hf-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    revEls.forEach(function(el) { io.observe(el); });
  } else {
    revEls.forEach(function(el) { el.classList.add('hf-in'); });
  }
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":35217,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

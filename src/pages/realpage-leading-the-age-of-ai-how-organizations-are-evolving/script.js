(function () {
    var root = (document.currentScript && document.currentScript.closest('.hw-rf')) || document.querySelector('.hw-rf');
    if (!root || root.dataset.hwRf) { return; }
    root.dataset.hwRf = '1';

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) { return; }

    var cards = Array.prototype.slice.call(root.querySelectorAll('.hw-rf__card'));
    root.classList.add('hw-rf--js');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) { return; }
        var i = cards.indexOf(en.target);
        en.target.style.setProperty('--d', (Math.min(i, 9) * 45) + 'ms');
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });

    cards.forEach(function (c) { io.observe(c); });
  })();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":36139,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

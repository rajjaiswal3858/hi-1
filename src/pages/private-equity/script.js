/* FAQ */
function faqOpen(btn) {
  const item = btn.closest('.fi');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.fi.open').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.fq').setAttribute('aria-expanded','false');
  });
  if (!isOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded','true'); }
}

/* Scroll reveal */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); ro.unobserve(e.target); } });
}, { threshold: 0.07, rootMargin: '0px 0px -32px 0px' });
document.querySelectorAll('.rv').forEach(el => ro.observe(el));
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":35351,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

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

/* Count-up for stats */
function countUp(el) {
  const to = parseInt(el.dataset.count);
  const suf = el.dataset.suffix || '';
  if (!to) return;
  let s = null;
  const run = ts => {
    if (!s) s = ts;
    const p = Math.min((ts - s) / 1600, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(e * to) + suf;
    if (p < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}
const co = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); co.unobserve(e.target); } });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => co.observe(el));

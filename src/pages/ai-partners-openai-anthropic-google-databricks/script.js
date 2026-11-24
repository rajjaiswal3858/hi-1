(function(){var r=document.getElementById('hw-partners-root');if(!r||r.getAttribute('data-hwp-init'))return;r.setAttribute('data-hwp-init','1');
var spotSel='.hw-partners-tile,.hw-partners-card,.hw-partners-model,.hw-partners-option,.hw-partners-metric,.hw-partners-award';
r.addEventListener('pointermove',function(e){var t=e.target&&e.target.closest?e.target.closest(spotSel):null;if(!t)return;var b=t.getBoundingClientRect();t.style.setProperty('--hwp-mx',(e.clientX-b.left)+'px');t.style.setProperty('--hwp-my',(e.clientY-b.top)+'px');},{passive:true});
var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(rm||!('IntersectionObserver' in window))return;
r.classList.add('hw-partners-js');
var sel='.hw-partners-hero-copy > *,.hw-partners-tiles > li,.hw-partners-short,.hw-partners-head > *,.hw-partners-grid2 > *,.hw-partners-grid3 > *,.hw-partners-layers-copy > *,.hw-partners-stack > li,.hw-partners-band,.hw-partners-table-scroll,.hw-partners-table-note,.hw-partners-steps > li,.hw-partners-metrics > div,.hw-partners-awards > li,.hw-partners-clients > li,.hw-partners-faq > details,.hw-partners-subhead,.hw-partners-links';
var els=r.querySelectorAll(sel);
function done(el){el.classList.remove('hw-partners-rv','hw-partners-in');el.style.removeProperty('--hwp-d');}
Array.prototype.forEach.call(els,function(el){var kids=el.parentNode.children,i=Array.prototype.indexOf.call(kids,el);if(el.parentNode.classList.contains('hw-partners-stack'))i=kids.length-1-i;el.style.setProperty('--hwp-d',Math.min(i,8)*90+'ms');el.classList.add('hw-partners-rv');});
var io=new IntersectionObserver(function(es){es.forEach(function(en){if(!en.isIntersecting)return;var el=en.target;io.unobserve(el);el.classList.add('hw-partners-in');var d=parseInt(el.style.getPropertyValue('--hwp-d'))||0;setTimeout(function(){done(el);},d+760);});},{rootMargin:'0px 0px -6% 0px',threshold:0.1});
Array.prototype.forEach.call(els,function(el){io.observe(el);});
var cs=r.querySelectorAll('.hw-partners-metric dd,.hw-partners-hero-proof strong');
var io2=new IntersectionObserver(function(es){es.forEach(function(en){if(!en.isIntersecting)return;io2.unobserve(en.target);var n=en.target.firstChild;if(!n||n.nodeType!==3)return;var m=n.nodeValue.match(/^(\s*)(\d+(?:\.\d+)?)(%?)([\s\S]*)$/);if(!m)return;var to=parseFloat(m[2]),dec=(m[2].split('.')[1]||'').length,t0=performance.now(),D=1400;(function f(t){var p=Math.min(1,(t-t0)/D);p=1-Math.pow(1-p,3);n.nodeValue=m[1]+(to*p).toFixed(dec)+m[3]+m[4];if(p<1)requestAnimationFrame(f);})(t0);});},{threshold:0.6});
Array.prototype.forEach.call(cs,function(el){io2.observe(el);});
})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":37753,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

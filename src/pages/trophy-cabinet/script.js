/* ── ICONS ── */
const IC={
  trophy:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M6 5h12v4a6 6 0 0 1-12 0V5z"/></svg>`,
  star:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  brain:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/></svg>`,
  ai:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/><circle cx="18.5" cy="5.5" r="1" fill="currentColor" stroke="none"/></svg>`,
  growth:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  clutch:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M9 14v8"/><path d="M15 14v8"/><path d="M6 22h12"/></svg>`,
  inc:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
  chart:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>`,
  shield:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  health:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  ux:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg>`,
  design:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="3.5"/><circle cx="17.5" cy="15.5" r="3.5"/><circle cx="8.5" cy="15.5" r="3.5"/></svg>`,
  globe:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  file:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  react:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="12" rx="10" ry="3.5"/><ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(120 12 12)"/></svg>`,
  home:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  screen:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
};

/* ── DATA ──
   cat a=company(teal) b=leadership(blue) c=culture(mist)
   link = award page URL when known */
const DATA=[
  {year:2026,cat:'a',icon:'trophy', title:'Top Software Development Companies in the USA — 2026',                    src:'Techreviewer.co',           link:'/news/top-software-development-companies/',isNew:true},
  {year:2026,cat:'b',icon:'star',   title:'Brandon Powell — 2026 Georgia Titan 100 Hall of Fame Inductee',           src:'Titan 100',                 link:'/news/titan-100-hall-of-fame/',isNew:true},
  {year:2026,cat:'b',icon:'brain',  title:'Brandon Powell — 2026 Dallas Innovates AI 75',                            src:'Dallas Innovates',          link:'/news/dallas-innovates-ai-75/',isNew:true},
  {year:2025,cat:'a',icon:'inc',    title:'Inc. Power Partner — AI & Software Development (2nd consecutive)',         src:'Inc. Business Media',       link:'/news/2025-inc-power-partner/'},
  {year:2025,cat:'a',icon:'trophy', title:'Top 100 Enterprise Software Development Companies of 2025',               src:'Techreviewer.co',           link:'/news/enterprise-software-development/'},
  {year:2025,cat:'a',icon:'trophy', title:'Top 100 Fintech Software Development Companies of 2025',                  src:'Techreviewer.co',           link:'/news/top-100-fintech-software-development-companies/'},
  {year:2025,cat:'a',icon:'clutch', title:'2025 Fall Clutch Global Award — AI & Software Development',               src:'Clutch',                    link:'/news/2025-fall-clutch-global-award/'},
  {year:2025,cat:'b',icon:'shield', title:'Brandon Powell & Rajeev Kapur — Forbes Top 5 AI Leaders',                 src:'Forbes',                    link:'/news/forbes-top-5-ai-leaders/'},
  {year:2025,cat:'b',icon:'star',   title:'Brandon Powell — Titan 100 Returning Honoree, Georgia',                   src:'Titan 100',                 link:'/news/brandon-powell-titan-100/'},
  {year:2025,cat:'c',icon:'screen', title:'25 Best Startups to Work For in Atlanta — #18',                           src:'Built In',                  link:'/news/top-atlanta-startup/'},
  {year:2025,cat:'a',icon:'trophy', title:'Top US Software Development Company 2025',                                src:'Techreviewer.co',           link:'/news/top-us-software-development-company-2025/'},
  {year:2024,cat:'a',icon:'ai',     title:'Winner — Generative AI Solution Providers Category',                      src:'Global Generative AI Awards',link:'/news/global-generative-ai-awards/'},
  {year:2024,cat:'a',icon:'health', title:'Top Healthcare Software Development Company 2024',                        src:'Techreviewer.co',           link:'/news/top-healthcare-software-developer/'},
  {year:2024,cat:'a',icon:'growth', title:"Georgia Fast 40 — One of Georgia's Fastest-Growing Companies",            src:'ACG Atlanta',               link:'/news/georgias-fastest-growing-companies/'},
  {year:2024,cat:'a',icon:'clutch', title:'Clutch Global Leader — Spring 2024 (AI & Software Development)',          src:'Clutch',                    link:'/news/clutch-global-leader/'},
  {year:2024,cat:'a',icon:'clutch', title:'Top Software Developers — Georgia 2024',                                  src:'Clutch',                    link:'/news/clutch-global-leader/'},
  {year:2024,cat:'a',icon:'clutch', title:'Top Software Developers — Atlanta 2024',                                  src:'Clutch',                    link:'/news/clutch-global-leader/'},
  {year:2024,cat:'a',icon:'ux',     title:'Top User Experience Company — Atlanta 2024',                              src:'Clutch',                    link:'/news/clutch-global-leader/'},
  {year:2024,cat:'a',icon:'design', title:'Top Design Company — Georgia 2024',                                       src:'Clutch',                    link:'/news/clutch-global-leader/'},
  {year:2023,cat:'a',icon:'clutch', title:'Clutch 1000 — Top Global B2B Company (280K+ evaluated)',                  src:'Clutch',                    link:'/news/hatchworks-clutch-1000/'},
  {year:2023,cat:'a',icon:'clutch', title:'Clutch Global Award — Fall 2023',                                         src:'Clutch',                    link:'/news/hatchworks-clutch-1000/'},
  {year:2023,cat:'a',icon:'clutch', title:'Clutch Champion Award — Fall 2023 (top 10% of winners)',                  src:'Clutch',                    link:'/news/hatchworks-clutch-1000/'},
  {year:2023,cat:'a',icon:'inc',    title:'Inc. Power Partner — Software Development & AI, 1st recognition',         src:'Inc. Business Media',       link:'/news/inc-power-partner-awards-2023/'},
  {year:2023,cat:'b',icon:'globe',  title:'Brandon Powell — Nearshore Entrepreneur of the Year',                     src:'Nearshore Americas',        link:'/news/brandon-powell-nearshore-entrepreneur-of-the-year-2023/'},
  {year:2023,cat:'a',icon:'file',   title:'Most Reviewed B2B Company in Colombia',                                   src:'The Manifest',              link:'/news/most-reviewed-big-data-companies/'},
  {year:2023,cat:'a',icon:'react',  title:'Top 100 React.js Development Companies',                                  src:'Techreviewer.co',           link:'/news/top-100-react-js-development-companies/'},
  {year:2023,cat:'a',icon:'clutch', title:"#1 on Clutch — Georgia's Leading B2B Companies",                          src:'Clutch',                    link:'/news/hatchworks-clutch-1000/'},
  {year:2023,cat:'c',icon:'home',   title:'Best Place to Work — 3rd consecutive year',                               src:'Atlanta Business Chronicle',link:'/news/hatchworks-receives-best-places-to-work-award-for-3rd-consecutive-year-by-atlanta-business-chronicle/'},
  {year:2022,cat:'c',icon:'home',   title:'Best Workplaces 2022 — Among highest-scoring nationally',                 src:'Inc. Magazine',             link:'/news/hatchworks-ranks-among-highest-scoring-businesses-on-inc-magazines-annual-list-of-best-workplaces-for-2022/'},
  {year:2022,cat:'c',icon:'home',   title:'Best Place to Work — 2nd consecutive year',                               src:'Atlanta Business Chronicle',link:'/news/hatchworks-receives-best-places-to-work-award-for-3rd-consecutive-year-by-atlanta-business-chronicle/'},
  {year:2021,cat:'a',icon:'chart',  title:'Inc. 5000 — Top quarter, fastest-growing private companies in the US',    src:'Inc. Magazine',             link:'/news/hatchworks-named-one-of-inc-5000s-fastest-growing-companies-in-the-u-s-joining-ranks-of-alumni-businesses-including-microsoft-dell-and-linkedin/'},
  {year:2021,cat:'c',icon:'home',   title:'Best Place to Work — 1st recognition',                                    src:'Atlanta Business Chronicle',link:'/news/hatchworks-receives-best-places-to-work-award-for-3rd-consecutive-year-by-atlanta-business-chronicle/'},
  {year:2021,cat:'a',icon:'file',   title:'Most Reviewed Big Data Companies Globally',                               src:'The Manifest',              link:'/news/most-reviewed-big-data-companies/'},
];

const LABEL={a:'Company & Growth',b:'Leadership',c:'Culture & Workplace'};
let curFilter='all', curView='timeline';
const NOW=new Date().getFullYear();

function filtered(){
  return DATA.filter(d=>curFilter==='all'||d.cat===curFilter);
}
function years(list){
  return [...new Set(list.map(d=>d.year))].sort((a,b)=>b-a);
}

/* ── FILTER ── */
function setFilter(cat){
  curFilter=cat;
  document.querySelectorAll('.fb').forEach(b=>b.classList.toggle('active',b.dataset.cat===cat));
  render();
}

/* ── VIEW SWITCH ── */
function setView(v){
  curView=v;
  document.querySelectorAll('.vb').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
  ['timeline','table','horizontal'].forEach(id=>{
    document.getElementById('view-'+id).style.display=id===v?'block':'none';
  });
  render();
}

/* ══ RENDER TIMELINE ══ */
function renderTimeline(list){
  const inner=document.getElementById('tl-inner');
  inner.innerHTML='';
  let gi=0;
  years(list).forEach(year=>{
    const yl=list.filter(d=>d.year===year);
    const yEl=document.createElement('div');
    yEl.className='tl-year';
    const ytints=['yr-teal','yr-blue','yr-mist'];
    const ytint=ytints[years(list).indexOf(year)%3];
    yEl.innerHTML=`<div class="tl-yr-row"><div class="tl-yr-tag ${ytint}${year>=NOW?' now':''}">${year}</div></div>`;
    inner.appendChild(yEl);
    yl.forEach((a,i)=>{
      const row=document.createElement('div');
      row.className='tl-row cat-'+a.cat;
      const left=i%2===0;
      const dot=document.createElement('div');
      dot.className='tl-dot-col';
      dot.innerHTML='<div class="tl-dot"></div>';
      const side=document.createElement('div');
      side.className=(left?'tl-L':'tl-R')+' cat-'+a.cat;
      side.innerHTML=`<div class="tl-card">
        <div class="nub"></div>
        <div class="c-head">
          <div class="c-ico ico-${a.cat}">${IC[a.icon]||IC.trophy}</div>
          <div class="c-body">
            <div class="c-title">${a.title}</div>
            <div class="c-src">${a.link?`<a href="${a.link}" target="_blank" rel="noopener">${a.src}</a>`:a.src} · ${a.year}</div>
          </div>
        </div>
        <div class="c-foot">
          <span class="chip chip-${a.cat}">${LABEL[a.cat]}</span>
          ${a.isNew?'<span class="chip-new">New</span>':''}
        </div>
      </div>`;
      const blank=document.createElement('div');
      blank.className='tl-blank';
      if(left){row.appendChild(side);row.appendChild(dot);row.appendChild(blank)}
      else     {row.appendChild(blank);row.appendChild(dot);row.appendChild(side)}
      inner.appendChild(row);
      const card=side.querySelector('.tl-card');
      setTimeout(()=>card.classList.add('in'),640+gi*60);
      gi++;
    });
  });
  const fill=document.getElementById('tl-fill');
  fill.classList.remove('on');
  requestAnimationFrame(()=>setTimeout(()=>fill.classList.add('on'),700));
  // IO for below-fold cards
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target)}});
  },{threshold:.1,rootMargin:'0px 0px -20px 0px'});
  setTimeout(()=>document.querySelectorAll('.tl-card:not(.in)').forEach(c=>obs.observe(c)),200);
}

/* ══ RENDER TABLE ══ */
function renderTable(list){
  const tbody=document.getElementById('tbl-body');
  tbody.innerHTML='';
  list.forEach(a=>{
    const tr=document.createElement('tr');
    tr.className='cat-'+a.cat;
    tr.innerHTML=`
      <td class="td-year">${a.year}</td>
      <td class="td-title">${a.title}</td>
      <td class="td-src">${a.link?`<a href="${a.link}" target="_blank" rel="noopener">${a.src}</a>`:a.src}</td>
      <td class="td-cat"><span class="chip chip-${a.cat}">${LABEL[a.cat]}</span></td>
      <td class="td-new">${a.isNew?'<span class="chip-new">New</span>':''}</td>`;
    tbody.appendChild(tr);
  });
}

/* ══ RENDER HORIZONTAL ══ */
function renderHorizontal(list){
  const inner=document.getElementById('hz-inner');
  inner.innerHTML='';
  let gi=0;
  years(list).forEach(year=>{
    const yl=list.filter(d=>d.year===year);
    const group=document.createElement('div');
    group.className='hz-group';
    const groupInner=document.createElement('div');
    groupInner.className='hz-group-inner';
    // year col
    const ycol=document.createElement('div');
    ycol.className='hz-year-col';
    const hztints=['hz-teal','hz-blue','hz-mist'];
    const hztint=hztints[years(list).indexOf(year)%3];
    ycol.innerHTML=`
      <div class="hz-year-dot ${hztint}"></div>
      <div class="hz-year-label${year>=NOW?' now':''}">${year}</div>`;
    groupInner.appendChild(ycol);
    // cards col
    const cards=document.createElement('div');
    cards.className='hz-cards';
    yl.forEach(a=>{
      const card=document.createElement('div');
      card.className='hz-card cat-'+a.cat;
      card.innerHTML=`
        <div class="hz-ico-row">
          <div class="hz-ico ico-${a.cat}">${IC[a.icon]||IC.trophy}</div>
          ${a.isNew?'<span class="chip-new" style="margin-left:auto">New</span>':''}
        </div>
        <div class="c-title">${a.title}</div>
        <div class="c-src" style="margin-top:4px">${a.link?`<a href="${a.link}" target="_blank" rel="noopener">${a.src}</a>`:a.src}</div>
        <div style="margin-top:8px"><span class="chip chip-${a.cat}">${LABEL[a.cat]}</span></div>`;
      cards.appendChild(card);
      setTimeout(()=>card.classList.add('in'),640+gi*55);
      gi++;
    });
    groupInner.appendChild(cards);
    group.appendChild(groupInner);
    inner.appendChild(group);
    // spacer between groups
    const sp=document.createElement('div');
    sp.style.cssText='width:32px;flex-shrink:0';
    inner.appendChild(sp);
  });
  const hfill=document.getElementById('hz-fill');
  hfill.classList.remove('on');
  requestAnimationFrame(()=>setTimeout(()=>hfill.classList.add('on'),700));
  // drag scroll
  initDrag(document.getElementById('hz-track'));
}

/* ── drag-to-scroll ── */
function initDrag(el){
  let isDown=false,startX,scrollLeft;
  el.addEventListener('mousedown',e=>{isDown=true;el.style.cursor='grabbing';startX=e.pageX-el.offsetLeft;scrollLeft=el.scrollLeft});
  el.addEventListener('mouseleave',()=>{isDown=false;el.style.cursor='grab'});
  el.addEventListener('mouseup',()=>{isDown=false;el.style.cursor='grab'});
  el.addEventListener('mousemove',e=>{if(!isDown)return;e.preventDefault();const x=e.pageX-el.offsetLeft;el.scrollLeft=scrollLeft-(x-startX)*1.2});
}

/* ── MAIN RENDER ── */
function render(){
  const list=filtered();
  const empty=document.getElementById('empty');
  empty.style.display=list.length===0?'block':'none';
  if(list.length===0)return;
  if(curView==='timeline') renderTimeline(list);
  if(curView==='table')    renderTable(list);
  if(curView==='horizontal') renderHorizontal(list);
}

render();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":35219,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

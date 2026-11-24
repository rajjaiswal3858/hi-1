(function() {
'use strict';

/* ── Shadow DOM for true Elementor isolation ── */
const host = document.getElementById('hwa-host');
const shadow = host.attachShadow({ mode: 'open' });

const DATA = [
  {year:2026,cat:'a',icon:'trophy',title:'Top Software Development Companies in the USA',src:'Techreviewer.co',link:'/news/top-software-development-companies/',isNew:true},
  {year:2026,cat:'b',icon:'star',title:'Brandon Powell — Georgia Titan 100 Hall of Fame',src:'Titan 100',link:'/news/titan-100-hall-of-fame/',isNew:true},
  {year:2026,cat:'b',icon:'brain',title:'Brandon Powell — Dallas Innovates AI 75',src:'Dallas Innovates',link:'/news/dallas-innovates-ai-75/',isNew:true},
  {year:2025,cat:'a',icon:'inc',title:'Inc. Power Partner — AI & Software Development',src:'Inc. Business Media',link:'/news/2025-inc-power-partner/'},
  {year:2025,cat:'a',icon:'trophy',title:'Top 100 Enterprise Software Development Companies',src:'Techreviewer.co',link:'/news/enterprise-software-development/'},
  {year:2025,cat:'a',icon:'trophy',title:'Top 100 Fintech Software Development Companies',src:'Techreviewer.co',link:'/news/top-100-fintech-software-development-companies/'},
  {year:2025,cat:'a',icon:'clutch',title:'Fall Clutch Global Award — AI & Software Development',src:'Clutch',link:'/news/2025-fall-clutch-global-award/'},
  {year:2025,cat:'b',icon:'shield',title:'Forbes Top 5 AI Leaders — Powell & Kapur',src:'Forbes',link:'/news/forbes-top-5-ai-leaders/'},
  {year:2025,cat:'b',icon:'star',title:'Brandon Powell — Titan 100 Returning Honoree',src:'Titan 100',link:'/news/brandon-powell-titan-100/'},
  {year:2025,cat:'c',icon:'people',title:'25 Best Startups to Work For in Atlanta — #18',src:'Built In',link:'/news/top-atlanta-startup/'},
  {year:2025,cat:'a',icon:'trophy',title:'Top US Software Development Company',src:'Techreviewer.co',link:'/news/top-us-software-development-company-2025/'},
  {year:2024,cat:'a',icon:'ai',title:'Winner — Generative AI Solution Providers Category',src:'Global GenAI Awards',link:'/news/global-generative-ai-awards/'},
  {year:2024,cat:'a',icon:'health',title:'Top Healthcare Software Development Company',src:'Techreviewer.co',link:'/news/top-healthcare-software-developer/'},
  {year:2024,cat:'a',icon:'growth',title:"Georgia Fast 40 — Fastest-Growing Company",src:'ACG Atlanta',link:'/news/georgias-fastest-growing-companies/'},
  {year:2024,cat:'a',icon:'clutch',title:'Clutch Global Leader — AI & Software Development',src:'Clutch',link:'/news/clutch-global-leader/'},
  {year:2024,cat:'a',icon:'clutch',title:'Top Software Developers — Georgia',src:'Clutch',link:'/news/clutch-global-leader/'},
  {year:2024,cat:'a',icon:'clutch',title:'Top Software Developers — Atlanta',src:'Clutch',link:'/news/clutch-global-leader/'},
  {year:2024,cat:'a',icon:'ux',title:'Top User Experience Company — Atlanta',src:'Clutch',link:'/news/clutch-global-leader/'},
  {year:2024,cat:'a',icon:'design',title:'Top Design Company — Georgia',src:'Clutch',link:'/news/clutch-global-leader/'},
  {year:2023,cat:'a',icon:'clutch',title:'Clutch 1000 — Top Global B2B Company',src:'Clutch',link:'/news/hatchworks-clutch-1000/'},
  {year:2023,cat:'a',icon:'clutch',title:'Clutch Global Award — Fall 2023',src:'Clutch',link:'/news/hatchworks-clutch-1000/'},
  {year:2023,cat:'a',icon:'clutch',title:'Clutch Champion Award — Top 10% of Winners',src:'Clutch',link:'/news/hatchworks-clutch-1000/'},
  {year:2023,cat:'a',icon:'inc',title:'Inc. Power Partner — Software Development & AI',src:'Inc. Business Media',link:'/news/inc-power-partner-awards-2023/'},
  {year:2023,cat:'b',icon:'globe',title:'Nearshore Entrepreneur of the Year',src:'Nearshore Americas',link:'/news/brandon-powell-nearshore-entrepreneur-of-the-year-2023/'},
  {year:2023,cat:'a',icon:'file',title:'Most Reviewed B2B Company in Colombia',src:'The Manifest',link:'/news/most-reviewed-big-data-companies/'},
  {year:2023,cat:'a',icon:'react',title:'Top 100 React.js Development Companies',src:'Techreviewer.co',link:'/news/top-100-react-js-development-companies/'},
  {year:2023,cat:'a',icon:'clutch',title:"#1 on Clutch — Georgia's Leading B2B Companies",src:'Clutch',link:'/news/hatchworks-clutch-1000/'},
  {year:2023,cat:'c',icon:'people',title:'Best Place to Work — 3rd Consecutive Year',src:'Atlanta Business Chronicle',link:'/news/hatchworks-receives-best-places-to-work-award-for-3rd-consecutive-year-by-atlanta-business-chronicle/'},
  {year:2022,cat:'c',icon:'people',title:'Best Workplaces — Among Highest-Scoring Nationally',src:'Inc. Magazine',link:'/news/hatchworks-ranks-among-highest-scoring-businesses-on-inc-magazines-annual-list-of-best-workplaces-for-2022/'},
  {year:2022,cat:'c',icon:'people',title:'Best Place to Work — 2nd Consecutive Year',src:'Atlanta Business Chronicle',link:'/news/hatchworks-receives-best-places-to-work-award-for-3rd-consecutive-year-by-atlanta-business-chronicle/'},
  {year:2021,cat:'a',icon:'chart',title:'Inc. 5000 — Fastest-Growing Private Companies in the US',src:'Inc. Magazine',link:'/news/hatchworks-named-one-of-inc-5000s-fastest-growing-companies-in-the-u-s-joining-ranks-of-alumni-businesses-including-microsoft-dell-and-linkedin/'},
  {year:2021,cat:'c',icon:'people',title:'Best Place to Work — 1st Recognition',src:'Atlanta Business Chronicle',link:'/news/hatchworks-receives-best-places-to-work-award-for-3rd-consecutive-year-by-atlanta-business-chronicle/'},
  {year:2021,cat:'a',icon:'file',title:'Most Reviewed Big Data Companies Globally',src:'The Manifest',link:'/news/most-reviewed-big-data-companies/'},
];

const ICONS = {
  trophy:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M6 5h12v4a6 6 0 0 1-12 0V5z"/></svg>`,
  star:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  brain:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/></svg>`,
  ai:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>`,
  growth:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  clutch:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M9 14v8"/><path d="M15 14v8"/><path d="M6 22h12"/></svg>`,
  inc:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
  chart:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>`,
  shield:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  health:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  ux:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>`,
  design:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="3.5"/><circle cx="17.5" cy="15.5" r="3.5"/><circle cx="8.5" cy="15.5" r="3.5"/></svg>`,
  globe:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  file:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  react:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="12" rx="10" ry="3.5"/><ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(120 12 12)"/></svg>`,
  people:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="3"/><path d="M3 21v-1a6 6 0 0 1 12 0v1"/><circle cx="17" cy="9" r="2.5"/><path d="M21 21v-1a4 4 0 0 0-5-3.87"/></svg>`,
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:host {
  display: block;
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  color: rgba(255,255,255,.88);
  background: transparent;
  --t: #3ABDBC;
  --amb: #F59E0B;
  --org: #F97316;
  --n: #151920;
  --s: #1b2230;
  --s2: #212a3a;
  --s3: #272f40;
}

/* ══ NAV — single centered row ══ */
.nav {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 28px;
}

/* Segmented control */
.tabs {
  display: inline-flex;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.10);
  border-radius: 5px;
  padding: 3px;
  gap: 2px;
}
.tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  font-family: 'Open Sans', sans-serif;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: .03em;
  color: rgba(255,255,255,.42);
  background: transparent;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: color .16s, background .16s;
  white-space: nowrap;
}
.tab svg { width: 13px; height: 13px; flex-shrink: 0; }
.tab:hover { color: rgba(255,255,255,.72); background: rgba(255,255,255,.06); }
.tab.on {
  background: rgba(255,255,255,.94);
  color: #151920;
  font-weight: 700;
  box-shadow: 0 1px 4px rgba(0,0,0,.25);
}
.tab.on svg { stroke: #151920; }

/* Separator between view switcher and filter pills */
.nav-sep {
  width: 1px;
  height: 28px;
  background: rgba(255,255,255,.10);
  flex-shrink: 0;
}

/* Light-themed filter chips */
.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Open Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 13px;
  border-radius: 3px;
  border: 1.5px solid rgba(255,255,255,.12);
  color: rgba(255,255,255,.45);
  background: rgba(255,255,255,.04);
  cursor: pointer;
  transition: all .18s;
  white-space: nowrap;
}
.pill svg { width: 12px; height: 12px; flex-shrink: 0; }
.pill:hover { transform: translateY(-1px); }
.pill:active { transform: scale(.97); }

/* All — white/neutral */
.pill.all { border-color: rgba(255,255,255,.15); color: rgba(255,255,255,.5); }
.pill.all:hover { border-color: rgba(255,255,255,.45); color: rgba(255,255,255,.9); background: rgba(255,255,255,.07); }
.pill.all.on { background: rgba(255,255,255,.92); border-color: rgba(255,255,255,.92); color: #151920; font-weight: 700; }

/* Company & Growth — Amber, light surface */
.pill.pa {
  border-color: rgba(245,158,11,.35);
  color: #D97706;
  background: rgba(245,158,11,.08);
}
.pill.pa svg { stroke: #D97706; }
.pill.pa:hover { border-color: #F59E0B; color: #F59E0B; background: rgba(245,158,11,.13); }
.pill.pa.on {
  background: #F59E0B;
  border-color: #F59E0B;
  color: #151920;
  font-weight: 700;
  box-shadow: 0 2px 10px rgba(245,158,11,.3);
}
.pill.pa.on svg { stroke: #151920; }

/* Leadership — Orange */
.pill.pb {
  border-color: rgba(249,115,22,.35);
  color: #EA6B0C;
  background: rgba(249,115,22,.08);
}
.pill.pb svg { stroke: #EA6B0C; }
.pill.pb:hover { border-color: #F97316; color: #F97316; background: rgba(249,115,22,.13); }
.pill.pb.on {
  background: #F97316;
  border-color: #F97316;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 2px 10px rgba(249,115,22,.3);
}
.pill.pb.on svg { stroke: #fff; }

/* Culture — Teal */
.pill.pc {
  border-color: rgba(58,189,188,.35);
  color: #2AA09F;
  background: rgba(58,189,188,.08);
}
.pill.pc svg { stroke: #2AA09F; }
.pill.pc:hover { border-color: #3ABDBC; color: #3ABDBC; background: rgba(58,189,188,.13); }
.pill.pc.on {
  background: #3ABDBC;
  border-color: #3ABDBC;
  color: #151920;
  font-weight: 700;
  box-shadow: 0 2px 10px rgba(58,189,188,.28);
}
.pill.pc.on svg { stroke: #151920; }

/* ── VIEWS ── */
#v-grid, #v-tl, #v-tb { display: none; }
#v-grid.show, #v-tl.show, #v-tb.show { display: block; }

/* ════════════════════════
   GALLERY GRID
════════════════════════ */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
}

.tile {
  position: relative;
  background: #1b2230;
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 4px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: default;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: border-color .22s, box-shadow .25s, transform .25s;
  animation: fadeUp .4s ease forwards;
  opacity: 0;
}
.tile:hover {
  border-color: rgba(255,255,255,.18);
  box-shadow: 0 6px 24px rgba(0,0,0,.3);
  transform: translateY(-2px);
}
.tile.ca { border-top: 2px solid rgba(245,158,11,.5); }
.tile.cb { border-top: 2px solid rgba(249,115,22,.5); }
.tile.cc { border-top: 2px solid rgba(58,189,188,.5); }
.tile.ca:hover { box-shadow: 0 6px 24px rgba(245,158,11,.1); }
.tile.cb:hover { box-shadow: 0 6px 24px rgba(249,115,22,.1); }
.tile.cc:hover { box-shadow: 0 6px 24px rgba(58,189,188,.1); }

/* Year badge — top right */
.tile-year {
  position: absolute;
  top: 10px; right: 10px;
  font-family: 'Open Sans', sans-serif;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .06em;
  color: rgba(255,255,255,.3);
  background: rgba(255,255,255,.05);
  padding: 2px 7px;
  border-radius: 2px;
}
.tile.ca .tile-year { color: rgba(245,158,11,.6); }
.tile.cb .tile-year { color: rgba(249,115,22,.6); }
.tile.cc .tile-year { color: rgba(58,189,188,.6); }

/* Icon circle */
.tile-ico {
  width: 38px; height: 38px;
  border-radius: 3px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: transform .22s;
}
.tile:hover .tile-ico { transform: scale(1.08) rotate(-3deg); }
.tile.ca .tile-ico { background: rgba(245,158,11,.1); color: #F59E0B; }
.tile.cb .tile-ico { background: rgba(249,115,22,.1); color: #F97316; }
.tile.cc .tile-ico { background: rgba(58,189,188,.1); color: #3ABDBC; }

/* Title */
.tile-title {
  font-family: 'Open Sans', sans-serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
  color: rgba(255,255,255,.88);
  flex: 1;
}

/* Footer row */
.tile-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding-top: 8px;
  border-top: 1px solid rgba(255,255,255,.05);
}
.tile-src {
  font-family: 'Open Sans', sans-serif;
  font-size: 10.5px;
  font-weight: 500;
  color: rgba(255,255,255,.35);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.new-badge {
  font-family: 'Open Sans', sans-serif;
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 2px;
  background: #3ABDBC;
  color: #151920;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ════════════════════════
   TIMELINE — column-per-year
════════════════════════ */
.htl {
  overflow-x: auto;
  overflow-y: hidden;
  cursor: grab;
  user-select: none;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(58,189,188,.2) transparent;
  padding-bottom: 4px;
  width: 100%;
}
.htl:active { cursor: grabbing; }
.htl::-webkit-scrollbar { height: 4px; }
.htl::-webkit-scrollbar-thumb { background: rgba(58,189,188,.2); border-radius: 2px; }

.htl-inner {
  display: flex;
  align-items: stretch;
  gap: 0;
  width: 100%;
}

/* Year column */
.htl-col {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  border-right: 1px solid rgba(255,255,255,.06);
  padding-bottom: 0;
}
.htl-col:last-child { border-right: none; }

/* Year header */
.htl-col-hd {
  padding: 0 10px 10px;
  border-bottom: 1px solid rgba(255,255,255,.07);
  margin-bottom: 10px;
  flex-shrink: 0;
}
.htl-yr-num {
  font-family: 'Open Sans', sans-serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -.03em;
  line-height: 1;
  color: rgba(255,255,255,.15);
}
.htl-yr-num.ya { color: rgba(245,158,11,.45); }
.htl-yr-num.yb { color: rgba(249,115,22,.45); }
.htl-yr-num.yc { color: rgba(58,189,188,.45); }
.htl-yr-num.now { color: #3ABDBC; }
.htl-yr-count {
  font-family: 'Open Sans', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .05em;
  color: rgba(255,255,255,.2);
  margin-top: 2px;
}

/* Award cards in column */
.htl-items {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0 8px 12px;
  flex: 1;
}

/* Individual award item */
.htl-item {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  padding: 8px 10px;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  transition: background .16s, transform .16s;
  position: relative;
}
.htl-item:hover { transform: translateX(2px); }

.htl-item.ia {
  background: rgba(245,158,11,.07);
  border-left: 2px solid rgba(245,158,11,.5);
}
.htl-item.ib {
  background: rgba(249,115,22,.07);
  border-left: 2px solid rgba(249,115,22,.5);
}
.htl-item.ic {
  background: rgba(58,189,188,.07);
  border-left: 2px solid rgba(58,189,188,.5);
}
.htl-item.ia:hover { background: rgba(245,158,11,.13); }
.htl-item.ib:hover { background: rgba(249,115,22,.13); }
.htl-item.ic:hover { background: rgba(58,189,188,.13); }

/* Icon */
.htl-item-ico {
  width: 22px; height: 22px;
  border-radius: 3px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 1px;
}
.htl-item-ico svg { width: 12px; height: 12px; stroke-width: 1.8; }
.ia .htl-item-ico { background: rgba(245,158,11,.12); }
.ia .htl-item-ico svg { stroke: #F59E0B; }
.ib .htl-item-ico { background: rgba(249,115,22,.12); }
.ib .htl-item-ico svg { stroke: #F97316; }
.ic .htl-item-ico { background: rgba(58,189,188,.12); }
.ic .htl-item-ico svg { stroke: #3ABDBC; }

/* Text */
.htl-item-body { flex: 1; min-width: 0; }
.htl-item-title {
  font-family: 'Open Sans', sans-serif;
  font-size: 11.5px;
  font-weight: 700;
  line-height: 1.38;
  display: block;
  /* two-line clamp */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.ia .htl-item-title { color: rgba(255,197,80,.9); }
.ib .htl-item-title { color: rgba(255,163,100,.9); }
.ic .htl-item-title { color: rgba(100,220,215,.9); }

.htl-item-src {
  font-family: 'Open Sans', sans-serif;
  font-size: 9.5px;
  font-weight: 500;
  color: rgba(255,255,255,.28);
  display: block;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* New badge */
.htl-new {
  position: absolute;
  top: 6px; right: 6px;
  font-family: 'Open Sans', sans-serif;
  font-size: 8px; font-weight: 800;
  letter-spacing: .07em; text-transform: uppercase;
  padding: 1px 5px; border-radius: 2px;
  background: #3ABDBC; color: #151920;
}

/* Legend + drag hint row */
.htl-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 8px 0;
  border-top: 1px solid rgba(255,255,255,.05);
  margin-top: 4px;
}
.htl-legend {
  display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
}
.htl-leg-item {
  display: flex; align-items: center; gap: 5px;
  font-family: 'Open Sans', sans-serif;
  font-size: 10px; font-weight: 600;
  letter-spacing: .05em; text-transform: uppercase;
}
.htl-leg-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
.htl-leg-item.la { color: rgba(245,158,11,.7); }
.htl-leg-item.la .htl-leg-dot { background: rgba(245,158,11,.5); }
.htl-leg-item.lb { color: rgba(249,115,22,.7); }
.htl-leg-item.lb .htl-leg-dot { background: rgba(249,115,22,.5); }
.htl-leg-item.lc { color: rgba(58,189,188,.7); }
.htl-leg-item.lc .htl-leg-dot { background: rgba(58,189,188,.5); }
.htl-drag {
  font-family: 'Open Sans', sans-serif;
  font-size: 9.5px; font-weight: 600;
  letter-spacing: .07em; text-transform: uppercase;
  color: rgba(255,255,255,.18);
}

/* ════════════════════════
   TABLE
════════════════════════ */
.tbl-wrap { overflow-x: auto; border: 1px solid rgba(255,255,255,.07); border-radius: 4px; }
table { width: 100%; border-collapse: collapse; }
thead tr { background: #212a3a; }
th {
  font-family: 'Open Sans', sans-serif;
  font-size: 9.5px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
  color: rgba(255,255,255,.38); padding: 10px 14px;
  text-align: left; border-bottom: 1px solid rgba(255,255,255,.07); white-space: nowrap;
}
tbody tr { border-bottom: 1px solid rgba(255,255,255,.04); transition: background .12s; }
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: rgba(255,255,255,.025); }
tbody tr.ca td:first-child { border-left: 2px solid rgba(245,158,11,.5); }
tbody tr.cb td:first-child { border-left: 2px solid rgba(249,115,22,.5); }
tbody tr.cc td:first-child { border-left: 2px solid rgba(58,189,188,.5); }
td { padding: 10px 14px; vertical-align: middle; color: rgba(255,255,255,.65); }
.td-yr { font-size: 11.5px; font-weight: 800; color: rgba(255,255,255,.38); white-space: nowrap; }
.td-ti { font-size: 13px; font-weight: 600; color: rgba(255,255,255,.88); line-height: 1.35; }
.td-src { font-size: 11px; font-weight: 500; color: rgba(255,255,255,.38); white-space: nowrap; }
.td-src a { color: inherit; text-decoration: none; }
.td-src a:hover { color: #3ABDBC; }
.tb-chip {
  font-size: 9.5px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase;
  padding: 2px 7px; border-radius: 2px; white-space: nowrap;
}
tr.ca .tb-chip { background: rgba(245,158,11,.09); color: #F59E0B; }
tr.cb .tb-chip { background: rgba(249,115,22,.09); color: #F97316; }
tr.cc .tb-chip { background: rgba(58,189,188,.09); color: #3ABDBC; }

/* ── EMPTY ── */
.empty {
  text-align: center; padding: 52px 20px;
  color: rgba(255,255,255,.3); display: none;
}
.empty p { font-size: 13px; font-weight: 500; margin-top: 8px; }

/* ── ANIMATIONS ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}
@keyframes ring {
  from { opacity: .5; transform: scale(1); }
  to   { opacity: 0;  transform: scale(2); }
}

/* ── MOBILE ── */
@media (max-width: 480px) {
  .grid { grid-template-columns: repeat(2, 1fr); gap: 6px; }
  .tl { padding-left: 38px; }
  .tl::before { left: 12px; }
  .tl-fill { left: 12px; }
  .tl-yr-node { left: -38px; width: 26px; height: 26px; }
  .tl-yr-num { font-size: 9px; }
  .tab span { display: none; }
  .tab { padding: 11px; }
}
`;

const LB = { a:'Company & Growth', b:'Leadership', c:'Culture & Workplace' };
const TC = { a:'ya', b:'yb', c:'yc' };
const NOW = new Date().getFullYear();
let curF = 'all', curV = 'grid';

/* ── Build shadow DOM ── */
shadow.innerHTML = `
<style>${CSS}</style>
<div class="nav">
  <div class="tabs">
    <button class="tab on" data-v="grid">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
      Gallery
    </button>
    <button class="tab" data-v="tl">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="5" cy="6" r="2" fill="currentColor" stroke="none"/><line x1="10" y1="6" x2="20" y2="6"/><circle cx="5" cy="12" r="2" fill="currentColor" stroke="none"/><line x1="10" y1="12" x2="20" y2="12"/><circle cx="5" cy="18" r="2" fill="currentColor" stroke="none"/><line x1="10" y1="18" x2="20" y2="18"/></svg>
      Timeline
    </button>
    <button class="tab" data-v="tb">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="1"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/></svg>
      Table
    </button>
  </div>

  <div class="nav-sep"></div>

  <button class="pill all on" data-cat="all">All</button>
  <button class="pill pa" data-cat="a">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
    Company &amp; Growth
  </button>
  <button class="pill pb" data-cat="b">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    Leadership
  </button>
  <button class="pill pc" data-cat="c">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="3"/><path d="M3 21v-1a6 6 0 0 1 12 0v1"/><circle cx="17" cy="9" r="2.5"/><path d="M21 21v-1a4 4 0 0 0-5-3.87"/></svg>
    Culture
  </button>
</div>
<div id="v-grid" class="show"></div>
<div id="v-tl"></div>
<div id="v-tb"></div>
<div class="empty" id="hwa-empty">
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r=".5" fill="currentColor" stroke="none"/></svg>
  <p>No awards match this filter.</p>
</div>`;

/* ── Event handlers ── */
shadow.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    curV = btn.dataset.v;
    shadow.querySelectorAll('.tab').forEach(b => b.classList.toggle('on', b === btn));
    shadow.querySelectorAll('#v-grid,#v-tl,#v-tb').forEach(el => el.classList.remove('show'));
    shadow.getElementById('v-' + curV).classList.add('show');
    render();
  });
});

shadow.querySelectorAll('.pill').forEach(btn => {
  btn.addEventListener('click', () => {
    curF = btn.dataset.cat;
    shadow.querySelectorAll('.pill').forEach(b => b.classList.toggle('on', b === btn));
    render();
  });
});

function fil() { return DATA.filter(d => curF === 'all' || d.cat === curF); }
function yrs(l) { return [...new Set(l.map(d => d.year))].sort((a,b) => b-a); }

/* ── GALLERY GRID ── */
function renderGrid(list) {
  const el = shadow.getElementById('v-grid');
  el.innerHTML = '';
  const g = document.createElement('div');
  g.className = 'grid';
  list.forEach((a, i) => {
    const tile = document.createElement('a');
    tile.className = 'tile c' + a.cat;
    tile.href = a.link;
    tile.target = '_blank';
    tile.rel = 'noopener';
    tile.style.animationDelay = (i * 40) + 'ms';
    tile.innerHTML =
      '<div class="tile-year">' + a.year + '</div>' +
      '<div class="tile-ico">' + ICONS[a.icon] + '</div>' +
      '<div class="tile-title">' + a.title + '</div>' +
      '<div class="tile-foot">' +
        '<span class="tile-src">' + a.src + '</span>' +
        (a.isNew ? '<span class="new-badge">New</span>' : '') +
      '</div>';
    g.appendChild(tile);
  });
  el.appendChild(g);
}

/* ── TIMELINE — column-per-year ── */
function renderTL(list) {
  const el = shadow.getElementById('v-tl');
  el.innerHTML = '';

  /* Build year -> items map */
  const yearMap = {};
  const allYears = [...new Set(list.map(d => d.year))].sort((a,b) => a-b);
  allYears.forEach(y => { yearMap[y] = list.filter(d => d.year === y); });

  /* Dominant cat for a year (most awards) */
  function domCat(items) {
    const ct = {a:0,b:0,c:0};
    items.forEach(x => ct[x.cat]++);
    return Object.entries(ct).sort((a,b)=>b[1]-a[1])[0][0];
  }

  const wrap = document.createElement('div');
  wrap.className = 'htl';

  const inner = document.createElement('div');
  inner.className = 'htl-inner';

  allYears.forEach(yr => {
    const items = yearMap[yr];
    const dc = domCat(items);
    const isNow = yr >= NOW;
    const yrCls = isNow ? 'now' : ('y'+dc);

    const col = document.createElement('div');
    col.className = 'htl-col';

    /* Header */
    const hd = document.createElement('div');
    hd.className = 'htl-col-hd';
    hd.innerHTML =
      '<div class="htl-yr-num ' + yrCls + '">' + yr + '</div>' +
      '<div class="htl-yr-count">' + items.length + ' award' + (items.length !== 1 ? 's' : '') + '</div>';
    col.appendChild(hd);

    /* Items */
    const itemsEl = document.createElement('div');
    itemsEl.className = 'htl-items';

    items.forEach((a, idx) => {
      const item = document.createElement('a');
      item.className = 'htl-item i' + a.cat;
      item.href = a.link;
      item.target = '_blank';
      item.rel = 'noopener';
      item.style.animationDelay = (idx * 40) + 'ms';
      item.innerHTML =
        '<div class="htl-item-ico">' + ICONS[a.icon] + '</div>' +
        '<div class="htl-item-body">' +
          '<span class="htl-item-title">' + a.title + '</span>' +
          '<span class="htl-item-src">' + a.src + '</span>' +
        '</div>' +
        (a.isNew ? '<span class="htl-new">New</span>' : '');
      itemsEl.appendChild(item);
    });

    col.appendChild(itemsEl);
    inner.appendChild(col);
  });

  wrap.appendChild(inner);

  /* Footer: legend + drag hint */
  const footer = document.createElement('div');
  footer.className = 'htl-footer';
  footer.innerHTML =
    '<div class="htl-legend">' +
      '<div class="htl-leg-item la"><div class="htl-leg-dot"></div>Company & Growth</div>' +
      '<div class="htl-leg-item lb"><div class="htl-leg-dot"></div>Leadership</div>' +
      '<div class="htl-leg-item lc"><div class="htl-leg-dot"></div>Culture</div>' +
    '</div>' +
    '<div class="htl-drag">&#8592; drag to scroll &#8594;</div>';
  wrap.appendChild(footer);

  el.appendChild(wrap);

  /* Drag-to-scroll */
  let dn=false, sx, sl;
  wrap.addEventListener('mousedown', e => { dn=true; wrap.style.cursor='grabbing'; sx=e.pageX-wrap.offsetLeft; sl=wrap.scrollLeft; });
  wrap.addEventListener('mouseleave', () => { dn=false; wrap.style.cursor='grab'; });
  wrap.addEventListener('mouseup', () => { dn=false; wrap.style.cursor='grab'; });
  wrap.addEventListener('mousemove', e => { if(!dn) return; e.preventDefault(); wrap.scrollLeft = sl-(e.pageX-wrap.offsetLeft-sx)*1.1; });
}


/* ── TABLE ── */
function renderTB(list) {
  const el = shadow.getElementById('v-tb');
  el.innerHTML =
    '<div class="tbl-wrap">' +
      '<table>' +
        '<thead><tr><th>Year</th><th>Award</th><th>Source</th><th>Category</th><th></th></tr></thead>' +
        '<tbody id="hwa-tb-body"></tbody>' +
      '</table>' +
    '</div>';
  const tb = el.querySelector('#hwa-tb-body');
  list.forEach(a => {
    const tr = document.createElement('tr');
    tr.className = 'c' + a.cat;
    tr.innerHTML =
      '<td class="td-yr">' + a.year + '</td>' +
      '<td class="td-ti">' + a.title + '</td>' +
      '<td class="td-src"><a href="' + a.link + '" target="_blank" rel="noopener">' + a.src + '</a></td>' +
      '<td><span class="tb-chip">' + LB[a.cat] + '</span></td>' +
      '<td>' + (a.isNew ? '<span class="chip-new">New</span>' : '') + '</td>';
    tb.appendChild(tr);
  });
}

function render() {
  const list = fil();
  const empty = shadow.getElementById('hwa-empty');
  empty.style.display = list.length ? 'none' : 'block';
  if (!list.length) return;
  if (curV === 'grid') renderGrid(list);
  if (curV === 'tl')   renderTL(list);
  if (curV === 'tb')   renderTB(list);
}

render();

})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":35259,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

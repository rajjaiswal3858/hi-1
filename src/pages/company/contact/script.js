(function () {

  var host   = document.getElementById('hw-left-root');
  var shadow = host.attachShadow({ mode: 'open' });

  /* ── Google Fonts ─────────────────────────────────────────── */
  var fontLink = document.createElement('link');
  fontLink.rel  = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap';
  shadow.appendChild(fontLink);

  /* ── Styles ───────────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [

    '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }',

    ':host { display: block; width: 100%; font-family: "Open Sans", sans-serif; }',

    '.hw-left { font-family: "Open Sans", sans-serif; width: 100%; padding: 12px 0; -webkit-font-smoothing: antialiased; }',

    /* ── Heading ── */
    '.hw-heading { font-family: "Open Sans", sans-serif; font-size: clamp(32px, 5vw, 52px); font-weight: 800; line-height: 1.08; letter-spacing: -1px; color: #111111; margin: 0 0 24px; }',

    '.hw-heading .light { font-weight: 300; color: #111111; }',

    /* ── Subtext ── */
    '.hw-sub { font-family: "Open Sans", sans-serif; font-size: 16px; font-weight: 400; line-height: 1.65; color: #444444; margin: 0 0 44px; max-width: 480px; }',

    /* ── Contact items ── */
    '.hw-contacts { display: flex; flex-direction: column; gap: 28px; margin-bottom: 44px; }',

    '.hw-contact-item { display: flex; flex-direction: column; gap: 2px; }',

    '.hw-contact-label { display: flex; align-items: center; gap: 10px; font-family: "Open Sans", sans-serif; font-size: 15px; font-weight: 600; color: #111111; margin-bottom: 2px; }',

    '.hw-contact-label svg { flex-shrink: 0; color: #555555; }',

    '.hw-contact-value { font-family: "Open Sans", sans-serif; font-size: 20px; font-weight: 700; color: #00A99D; text-decoration: none; letter-spacing: -0.2px; transition: color 0.18s ease; padding-left: 28px; }',

    '.hw-contact-value:hover { color: #007A71; }',

    /* ── Divider ── */
    '.hw-divider { width: 100%; height: 1px; background: #E5E7EB; margin-bottom: 32px; }',

    /* ── Social ── */
    '.hw-social-label { display: flex; align-items: center; gap: 10px; font-family: "Open Sans", sans-serif; font-size: 15px; font-weight: 600; color: #111111; margin-bottom: 18px; }',

    '.hw-social-label svg { flex-shrink: 0; color: #555555; }',

    '.hw-social-icons { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }',

    '.hw-social-link { display: flex; align-items: center; justify-content: center; width: 46px; height: 46px; background: #00A99D; border-radius: 10px; color: #FFFFFF; text-decoration: none; transition: background 0.18s ease, transform 0.15s ease, box-shadow 0.18s ease; flex-shrink: 0; }',

    '.hw-social-link:hover { background: #007A71; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,169,157,0.30); }',

    '.hw-social-link svg { display: block; }',

    '@media (max-width: 640px) { .hw-heading { font-size: clamp(28px, 8vw, 40px); } .hw-contact-value { font-size: 17px; } }'

  ].join('\n');
  shadow.appendChild(style);

  /* ── HTML ─────────────────────────────────────────────────── */
  var wrap = document.createElement('div');
  wrap.className = 'hw-left';
  wrap.innerHTML =

    /* Heading */
    '<h2 class="hw-heading">' +
      'Start Your AI<br>' +
      '<span>Journey</span> <span class="light">with Us</span>' +
    '</h2>' +

    /* Subtext */
    '<p class="hw-sub">' +
      'Transform your business with cutting-edge AI solutions tailored to your needs. ' +
      'Tell us what you\'re looking for, and let\'s build the future together.' +
    '</p>' +

    /* Contact items */
    '<div class="hw-contacts">' +

      /* Phone */
      '<div class="hw-contact-item">' +
        '<span class="hw-contact-label">' +
          '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.59.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.59 1 1 0 01-.25 1.01l-2.2 2.19z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
          'Let\'s talk.' +
        '</span>' +
        '<a class="hw-contact-value" href="tel:18006217063">1-800-621-7063</a>' +
      '</div>' +

      /* Email */
      '<div class="hw-contact-item">' +
        '<span class="hw-contact-label">' +
          '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/>' +
            '<path d="M2 7l10 7 10-7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
          '</svg>' +
          'Drop us a line.' +
        '</span>' +
        '<a class="hw-contact-value" href="mailto:connect' + '@' + 'hatchworks' + '.com">connect' + '@' + 'hatchworks' + '.com</a>' +
      '</div>' +

    '</div>' +

    /* Divider */
    '<div class="hw-divider"></div>' +

    /* Social */
    '<div class="hw-social-label">' +
      '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.6"/>' +
        '<rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.6"/>' +
        '<rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.6"/>' +
        '<rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.6"/>' +
      '</svg>' +
      'Follow us for updates' +
    '</div>' +

    '<div class="hw-social-icons">' +

      /* LinkedIn */
      '<a class="hw-social-link" href="https://www.linkedin.com/company/hatchworksai" target="_blank" rel="noopener" aria-label="LinkedIn">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>' +
          '<circle cx="4" cy="4" r="2"/>' +
        '</svg>' +
      '</a>' +

      /* YouTube */
      '<a class="hw-social-link" href="https://www.youtube.com/@hatchworksai" target="_blank" rel="noopener" aria-label="YouTube">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>' +
          '<polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#00A99D"/>' +
        '</svg>' +
      '</a>' +

      /* Instagram */
      '<a class="hw-social-link" href="https://www.instagram.com/hatchworksinc/" target="_blank" rel="noopener" aria-label="Instagram">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">' +
          '<rect x="2" y="2" width="20" height="20" rx="5"/>' +
          '<circle cx="12" cy="12" r="4"/>' +
          '<circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>' +
        '</svg>' +
      '</a>' +

      /* TikTok */
      '<a class="hw-social-link" href="https://www.tiktok.com/@hatchworksinc" target="_blank" rel="noopener" aria-label="TikTok">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.79a8.18 8.18 0 004.78 1.52V6.85a4.85 4.85 0 01-1.01-.16z"/>' +
        '</svg>' +
      '</a>' +

      /* Facebook */
      '<a class="hw-social-link" href="https://www.facebook.com/hatchworksinc/" target="_blank" rel="noopener" aria-label="Facebook">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>' +
        '</svg>' +
      '</a>' +

    '</div>';

  shadow.appendChild(wrap);

})();
;
(function () {

  var host   = document.getElementById('hw-hubs-root');
  var shadow = host.attachShadow({ mode: 'open' });

  /* Google Fonts */
  var fontLink = document.createElement('link');
  fontLink.rel  = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap';
  shadow.appendChild(fontLink);

  /* Hubs data */
var hubs = [
    {
      id: 'atl', city: 'Atlanta', country: 'GA, USA', flag: '🇺🇸',
      addr: '3280 Peachtree Rd NE, 7th floor, 30305',
      facts: [
        'Where HatchWorks AI was founded and Generative-Driven Development™ was born.',
        'Our delivery, AI strategy and client success teams are based here.',
        'Atlanta sits in GMT-5 — the same time zone as our LatAm engineering hubs.'
      ]
    },
    {
      id: 'chi', city: 'Chicago', country: 'IL, USA', flag: '🇺🇸',
      addr: '220 N Green Street, Suite 538, 60607',
      facts: [
        'Our Midwest base for client partnerships in finance, retail and healthcare.',
        '4th largest tech market in the U.S. — and a key node in our delivery network.',
        'Aligned with Costa Rica time zone for full-day collaboration with engineering teams.'
      ]
    },
    {
      id: 'dal', city: 'Dallas', country: 'TX, USA', flag: '🇺🇸',
      addr: '1920 McKinney Ave, Dallas, TX 75201',
      facts: [
        'Strategic hub for enterprise clients across Texas and the Southwest.',
        '24 Fortune 500 HQs in DFW — the largest concentration we serve in one metro.',
        'Same time zone as San Jose, CR — zero friction between sales and delivery.'
      ]
    },
    {
      id: 'sjo', city: 'San Jose', country: 'Costa Rica', flag: '🇨🇷',
      addr: 'Plaza Cronos, Office #25-26, Curridabat, 11801',
      facts: [
        'Our LatAm headquarters and largest engineering hub.',
        'Costa Rica has the highest English proficiency in LatAm (82.5%).',
        '#1 IT services exporter per capita in LatAm — a backbone of our delivery.',
        'Home to many of our GenDD-trained AI engineers.'
      ]
    },
    {
      id: 'mde', city: 'Medellin', country: 'Colombia', flag: '🇨🇴',
      addr: 'Co-Work Latam Astorga, Cl. 8 #43C-68',
      facts: [
        'Known as the "Silicon Valley of LatAm" — and a core source of our top talent.',
        'GMT-5 means full overlap with U.S. East Coast clients.',
        'Senior engineers here power data, AI/ML and full-stack delivery.',
        'Ruta N is one of the largest innovation districts in the region.'
      ]
    },
    {
      id: 'lim', city: 'Lima', country: 'Peru', flag: '🇵🇪',
      addr: 'Calle Las Orquideas 585, San Isidro, 15046',
      facts: [
        '#1 in LatAm for engineering tertiary degrees (29.6%).',
        '"Cutting-edge" by Coursera in 6 IT skill areas — a key recruiting pool.',
        'Strong specialization in databases, cloud and statistical programming.',
        'A growing hub for our nearshore Agile teams.'
      ]
    }
  ];

  /* Styles */
  var style = document.createElement('style');
  style.textContent = [

    '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }',

    ':host { display: block; width: 100%; font-family: "Open Sans", sans-serif; }',

    '.hw-wrap { font-family: "Open Sans", sans-serif; width: 100%; color: #FFFFFF; -webkit-font-smoothing: antialiased; }',

    /* Grid */
    '.hw-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 0; border-top: 1px solid rgba(255,255,255,0.12); border-left: 1px solid rgba(255,255,255,0.12); }',

    /* Card */
    '.hw-card { position: relative; padding: 32px 24px 28px; border-right: 1px solid rgba(255,255,255,0.12); border-bottom: 1px solid rgba(255,255,255,0.12); min-height: 300px; display: flex; flex-direction: column; }',

    /* Flag — top right */
    '.hw-flag { position: absolute; top: 28px; right: 24px; font-size: 18px; line-height: 1; opacity: 0.6; }',

    /* Head — city, country, address all visible */
    '.hw-head { margin-bottom: auto; padding-right: 32px; }',

    '.hw-city { font-family: "Open Sans", sans-serif; font-size: 28px; font-weight: 800; color: #FFFFFF; line-height: 1; letter-spacing: -0.9px; margin-bottom: 8px; }',

    '.hw-country { font-family: "Open Sans", sans-serif; font-size: 13px; font-weight: 300; color: rgba(255,255,255,0.55); letter-spacing: 0.2px; margin-bottom: 18px; }',

    '.hw-addr { font-family: "Open Sans", sans-serif; font-size: 12px; font-weight: 400; line-height: 1.55; color: rgba(255,255,255,0.65); }',

    /* Fact block */
    '.hw-fact-wrap { padding-top: 18px; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.12); min-height: 70px; }',

    '.hw-fact-label { display: flex; align-items: center; gap: 8px; font-family: "Open Sans", sans-serif; font-size: 9px; font-weight: 700; color: #00C2B5; letter-spacing: 1.8px; text-transform: uppercase; margin-bottom: 8px; }',

    '.hw-fact-dot { width: 4px; height: 4px; background: #00C2B5; border-radius: 50%; }',

    '.hw-fact { font-family: "Open Sans", sans-serif; font-size: 12.5px; font-weight: 500; line-height: 1.5; color: rgba(255,255,255,0.92); transition: opacity 0.5s ease; }',

    '.hw-fact.is-fading { opacity: 0; }',

    /* Responsive */
    '@media (max-width: 1100px) { .hw-grid { grid-template-columns: repeat(3, 1fr); } }',

    '@media (max-width: 720px) { .hw-grid { grid-template-columns: repeat(2, 1fr); } .hw-card { padding: 28px 22px 24px; } }',

    '@media (max-width: 440px) { .hw-card { padding: 24px 18px 20px; min-height: 280px; } .hw-city { font-size: 24px; } .hw-flag { top: 22px; right: 18px; } }'

  ].join('\n');
  shadow.appendChild(style);

  /* Build cards */
  var cardsHTML = '';
  hubs.forEach(function (h) {
    cardsHTML +=
      '<div class="hw-card" data-id="' + h.id + '">' +
        '<div class="hw-flag">' + h.flag + '</div>' +

        '<div class="hw-head">' +
          '<div class="hw-city">' + h.city + '</div>' +
          '<div class="hw-country">' + h.country + '</div>' +
          '<div class="hw-addr">' + h.addr + '</div>' +
        '</div>' +

        '<div class="hw-fact-wrap">' +
          '<div class="hw-fact-label"><span class="hw-fact-dot"></span>Did you know</div>' +
          '<div class="hw-fact" data-fact-for="' + h.id + '">' + h.facts[0] + '</div>' +
        '</div>' +
      '</div>';
  });

  var wrap = document.createElement('div');
  wrap.className = 'hw-wrap';
  wrap.innerHTML = '<div class="hw-grid">' + cardsHTML + '</div>';
  shadow.appendChild(wrap);

  /* Fact rotation — gentle cross-fade */
  var ROTATION_MS = 5000;
  var FADE_MS     = 500;
  var factIndexes = {};
  hubs.forEach(function (h) { factIndexes[h.id] = 0; });

  function rotateFact(hubId) {
    var hub = hubs.find(function (h) { return h.id === hubId; });
    if (!hub || hub.facts.length < 2) return;

    var factEl = shadow.querySelector('[data-fact-for="' + hubId + '"]');
    if (!factEl) return;

    factEl.classList.add('is-fading');

    setTimeout(function () {
      var nextIdx = (factIndexes[hubId] + 1) % hub.facts.length;
      factIndexes[hubId] = nextIdx;
      factEl.textContent = hub.facts[nextIdx];
      factEl.classList.remove('is-fading');
    }, FADE_MS);
  }

  hubs.forEach(function (h, i) {
    setTimeout(function () {
      setInterval(function () { rotateFact(h.id); }, ROTATION_MS);
    }, i * 800);
  });

})();
;
window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.contentEvents = {"postID":28232,"isReadableSinglePost":false,"hasVimeoEmbed":false,"wordCount":0,"estimatedReadTimeSeconds":0,"isLastPageOfMultiPagePost":false,"readTimeThresholdPercent":85,"minimumReadTimeSeconds":5};
//# sourceURL=googlesitekit-events-provider-content-events-js-before

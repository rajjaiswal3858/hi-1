(function () {
  /* ====== EDITA ESTO ====== */
  var HW_CATS = [
    { name: "AI Agents",             url: "/resources/blog/",             hot: true },
    { name: "GenDD",                 url: "/resources/blog/",                 hot: true },
    { name: "Forward Deployed",      url: "/resources/blog/",                   hot: true },
    { name: "Software Development",  url: "/resources/blog/",  hot: true },
    { name: "Modernization",         url: "/resources/blog/",         hot: true },
    { name: "Talking AI",            url: "/talking-ai/" },
    { name: "Product + Design",      url: "/resources/blog/" },
    { name: "Nearshore Development", url: "/resources/blog/" },
    { name: "Agile",                 url: "/resources/blog/" },
    { name: "Culture",               url: "/resources/blog/" },
    { name: "Talent",                url: "/resources/blog/" }
  ];
  /* ====== fin de la edición ====== */

  var root = document.getElementById("hwcats");
  if (!root || root.dataset.hwcReady) return;
  root.dataset.hwcReady = "1";

  var input   = root.querySelector("[data-hwc-input]");
  var clear   = root.querySelector("[data-hwc-clear]");
  var empty   = root.querySelector("[data-hwc-empty]");
  var lists   = { hot: root.querySelector('[data-hwc-list="hot"]'), more: root.querySelector('[data-hwc-list="more"]') };
  var groups  = { hot: root.querySelector('[data-hwc-group="hot"]'), more: root.querySelector('[data-hwc-group="more"]') };

  var ARROW = '<svg class="hwc-arw" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h14"/><path d="M13 7l5 5-5 5"/></svg>';

  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var rows = [];
  HW_CATS.forEach(function (cat) {
    var a = document.createElement("a");
    a.className = "hwc-row";
    a.href = cat.url;
    a.innerHTML = '<span class="hwc-name">' + esc(cat.name) + "</span>" + ARROW;
    (cat.hot ? lists.hot : lists.more).appendChild(a);
    rows.push({ el: a, label: a.querySelector(".hwc-name"), name: cat.name, key: cat.name.toLowerCase() });
  });

  function paint(row, q) {
    if (!q) { row.label.textContent = row.name; return; }
    var i = row.key.indexOf(q);
    if (i < 0) { row.label.textContent = row.name; return; }
    row.label.innerHTML = esc(row.name.slice(0, i)) + "<b>" + esc(row.name.slice(i, i + q.length)) + "</b>" + esc(row.name.slice(i + q.length));
  }

  var firstMatch = null;

  function apply() {
    var q = input.value.trim().toLowerCase();
    var shown = { hot: 0, more: 0 };
    firstMatch = null;

    rows.forEach(function (row) {
      var hit = !q || row.key.indexOf(q) > -1;
      row.el.hidden = !hit;
      row.el.classList.remove("is-first-match");
      if (hit) {
        paint(row, q);
        shown[row.el.parentNode === lists.hot ? "hot" : "more"]++;
        if (!firstMatch) firstMatch = row.el;
      }
    });

    groups.hot.hidden = shown.hot === 0;
    groups.more.hidden = shown.more === 0;
    root.classList.toggle("is-empty", shown.hot + shown.more === 0);
    root.classList.toggle("is-filtering", q.length > 0);
    if (q && firstMatch) firstMatch.classList.add("is-first-match");
  }

  input.addEventListener("input", apply);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && firstMatch) { e.preventDefault(); window.location.href = firstMatch.href; }
    if (e.key === "Escape") { input.value = ""; apply(); }
  });
  clear.addEventListener("click", function () { input.value = ""; apply(); input.focus(); });

  apply();
})();

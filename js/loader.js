/* ══════════════════════════════
   LOADER / ENTRY TUNNEL
══════════════════════════════ */
(function () {
  var tunnel = document.getElementById("tunnel");
  var grid = document.getElementById("tunnel-grid");
  var logo = document.getElementById("tun-logo");
  var site = document.getElementById("site");
  var nav = document.getElementById("main-nav");

  if (!tunnel) return;

  /* ── Grid canvas ── */
  var ctx = grid.getContext("2d");
  var W, H;

  function resize() {
    W = grid.width = grid.offsetWidth || window.innerWidth;
    H = grid.height = grid.offsetHeight || window.innerHeight;
  }
  resize();

  var COLS = 22,
    ROWS = 14;
  var segs = [],
    gridRaf = null,
    gridStart = null;
  var GDUR = 1100;

  function buildGrid() {
    segs = [];
    var cw = W / COLS,
      ch = H / ROWS;
    var cx = COLS / 2,
      cy = ROWS / 2;
    for (var r = 0; r <= ROWS; r++) {
      for (var c = 0; c <= COLS; c++) {
        var d = Math.sqrt(Math.pow(c - cx, 2) + Math.pow(r - cy, 2));
        if (c < COLS)
          segs.push({
            x1: c * cw,
            y1: r * ch,
            x2: (c + 1) * cw,
            y2: r * ch,
            d: d,
          });
        if (r < ROWS)
          segs.push({
            x1: c * cw,
            y1: r * ch,
            x2: c * cw,
            y2: (r + 1) * ch,
            d: d,
          });
      }
    }
    segs.sort(function (a, b) {
      return a.d - b.d;
    });
  }
  buildGrid();

  function drawGrid(ts) {
    if (!gridStart) gridStart = ts;
    var pct = Math.min((ts - gridStart) / GDUR, 1);
    var show = Math.floor(pct * segs.length);
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < show; i++) {
      var s = segs[i];
      var outer = s.d > COLS * 0.35;
      ctx.beginPath();
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(s.x2, s.y2);
      ctx.strokeStyle = outer ? "rgba(200,255,0,0.22)" : "rgba(200,255,0,0.07)";
      ctx.lineWidth = outer ? 1 : 0.5;
      ctx.stroke();
    }
    if (pct < 1) gridRaf = requestAnimationFrame(drawGrid);
  }
  gridRaf = requestAnimationFrame(drawGrid);

  /* ── Terminal text ── */
  var LINES = [
    { id: "tl0", text: "initializing ziyad.dev...", delay: 80 },
    { id: "tl1", text: "loading: identity · craft · work", delay: 600 },
    { id: "tl2", text: "compiling experience...", delay: 1180 },
    { id: "tl3", text: "all systems ready.", delay: 1750 },
  ];

  function typeInto(id, text, done) {
    var el = document.getElementById(id);
    if (!el) {
      if (done) done();
      return;
    }
    var tspan = el.querySelector(".tl-text");
    if (!tspan) {
      if (done) done();
      return;
    }
    tspan.textContent = "";
    var i = 0;
    function step() {
      tspan.textContent += text[i++];
      if (i < text.length) setTimeout(step, 24 + Math.random() * 14);
      else if (done) setTimeout(done, 180);
    }
    step();
  }

  /* ── Exit sequence ── */
  var exited = false;

  function exit() {
    if (exited) return;
    exited = true;
    if (gridRaf) cancelAnimationFrame(gridRaf);

    logo.classList.add("show");

    setTimeout(function () {
      logo.classList.add("implode");
      setTimeout(function () {
        tunnel.classList.add("out");
        if (site) site.classList.add("show");
        if (nav) nav.classList.add("ready");
        setTimeout(function () {
          tunnel.style.display = "none";
          document.body.classList.remove("is-loading");
          if (window._heroInit) window._heroInit();
        }, 750);
      }, 380);
    }, 480);
  }

  /* Failsafe */
  var fs = setTimeout(exit, 6500);

  /* Sequence */
  var done = 0;
  LINES.forEach(function (l, i) {
    setTimeout(function () {
      if (i > 0) {
        var prev = document.getElementById(LINES[i - 1].id);
        var c = prev && prev.querySelector(".tl-caret");
        if (c) c.style.display = "none";
      }
      typeInto(l.id, l.text, function () {
        done++;
        if (done === LINES.length) {
          clearTimeout(fs);
          setTimeout(exit, 480);
        }
      });
    }, l.delay);
  });
})();

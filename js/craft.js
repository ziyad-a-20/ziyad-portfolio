/* ══════════════════════════════
   CRAFT — skill constellation
══════════════════════════════ */
(function () {
  var canvas = document.getElementById("craft-canvas");
  var tip = document.getElementById("skill-tip");
  if (!canvas || !tip) return;

  var ctx = canvas.getContext("2d");
  var W,
    H,
    rafId = null;

  var NODES = [
    {
      l: "Python",
      desc: "Core backend — Flask apps, scripting, data processing.",
      g: "be",
      nx: 0.3,
      ny: 0.42,
    },
    {
      l: "Flask",
      desc: "Web framework — routing, REST APIs, Blueprints, middleware.",
      g: "be",
      nx: 0.48,
      ny: 0.28,
    },
    {
      l: "MySQL",
      desc: "Relational DB — normalised schemas, joins, role queries.",
      g: "be",
      nx: 0.3,
      ny: 0.65,
    },
    {
      l: "HTML5",
      desc: "Semantic markup — accessibility, SEO, progressive loading.",
      g: "fe",
      nx: 0.68,
      ny: 0.26,
    },
    {
      l: "CSS3",
      desc: "Layouts, animations, custom properties, responsive design.",
      g: "fe",
      nx: 0.78,
      ny: 0.48,
    },
    {
      l: "JavaScript",
      desc: "Vanilla JS — DOM, fetch, async, GSAP.",
      g: "fe",
      nx: 0.68,
      ny: 0.68,
    },
    {
      l: "Tailwind",
      desc: "Utility-first CSS — rapid UI with design constraints.",
      g: "fe",
      nx: 0.88,
      ny: 0.68,
    },
    {
      l: "Git",
      desc: "Version control — branching, commits, collaborative flows.",
      g: "tl",
      nx: 0.14,
      ny: 0.32,
    },
    {
      l: "GitHub",
      desc: "Remote hosting, PRs, code review, project boards.",
      g: "tl",
      nx: 0.14,
      ny: 0.52,
    },
    {
      l: "Vercel",
      desc: "Deployment — instant builds, edge CDN, env vars.",
      g: "tl",
      nx: 0.14,
      ny: 0.72,
    },
    {
      l: "Netlify",
      desc: "Static deploys, form handling, continuous integration.",
      g: "tl",
      nx: 0.05,
      ny: 0.52,
    },
  ];

  var EDGES = [
    [0, 1],
    [0, 2],
    [1, 2],
    [1, 3],
    [1, 5],
    [3, 4],
    [3, 5],
    [4, 5],
    [4, 6],
    [5, 6],
    [0, 7],
    [7, 8],
    [8, 9],
    [8, 10],
  ];

  var GC = {
    be: "rgba(200,255,0,",
    fe: "rgba(255,107,53,",
    tl: "rgba(61,220,132,",
  };

  function setPos() {
    NODES.forEach(function (n) {
      n.x = n.nx * W;
      n.y = n.ny * H;
      n.ox = n.x;
      n.oy = n.y;
      n.s = Math.random() * 100;
    });
  }

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    setPos();
  }
  resize();
  window.addEventListener("resize", resize);

  var hov = -1,
    assT = 0,
    assMax = 80,
    assed = false,
    time = 0;

  function connected(idx) {
    var s = new Set([idx]);
    EDGES.forEach(function (e) {
      if (e[0] === idx) s.add(e[1]);
      if (e[1] === idx) s.add(e[0]);
    });
    return s;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    time += 0.005;
    var ap = assed ? 1 : Math.min(assT / assMax, 1);
    if (!assed) {
      assT++;
      if (assT >= assMax) assed = true;
    }

    var hi = hov >= 0 ? connected(hov) : null;

    NODES.forEach(function (n, i) {
      n.ca = Math.min(Math.max(ap * NODES.length - i, 0), 1);
      if (assed) {
        n.x = n.ox + noise(time * 0.5 + n.s) * 9;
        n.y = n.oy + noise(time * 0.5 + n.s + 8) * 9;
      } else {
        n.x = lerp(W * 0.5, n.ox, ap);
        n.y = lerp(H * 0.5, n.oy, ap);
      }
    });

    EDGES.forEach(function (e) {
      var a = NODES[e[0]],
        b = NODES[e[1]];
      if (a.ca < 0.01 || b.ca < 0.01) return;
      var dim = hi && (!hi.has(e[0]) || !hi.has(e[1]));
      var alpha = dim ? 0.02 : 0.13 * Math.min(a.ca, b.ca);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = GC[a.g] + alpha + ")";
      ctx.lineWidth = dim ? 0.4 : 0.9;
      ctx.stroke();
    });

    NODES.forEach(function (n, i) {
      if (n.ca < 0.01) return;
      var isH = i === hov;
      var inHi = hi && hi.has(i);
      var dim = hi && !inHi;
      var alph = dim ? 0.15 * n.ca : n.ca;
      var r = isH ? 9 : 6;

      if (isH || inHi) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = GC[n.g] + "0.07)";
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = GC[n.g] + alph * 0.88 + ")";
      ctx.fill();

      ctx.fillStyle =
        "rgba(242,240,232," + (dim ? 0.12 * n.ca : alph * 0.88) + ")";
      ctx.font = (isH ? "500 14px" : "300 11px") + " Inter,sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(n.l, n.x, n.y + r + 5);
    });

    rafId = requestAnimationFrame(draw);
  }

  /* Tooltip */
  function showTip(n) {
    tip.querySelector(".st-name").textContent = n.l;
    tip.querySelector(".st-desc").textContent = n.desc;
    tip.classList.add("on");
    tip.setAttribute("aria-hidden", "false");
  }
  function hideTip() {
    tip.classList.remove("on");
    tip.setAttribute("aria-hidden", "true");
    hov = -1;
  }
  function moveTip(x, y) {
    tip.style.left = x + 16 + "px";
    tip.style.top = y - 10 + "px";
  }

  function hitTest(cx, cy) {
    var rect = canvas.getBoundingClientRect();
    var mx = cx - rect.left,
      my = cy - rect.top;
    var best = -1,
      bd = 22;
    NODES.forEach(function (n, i) {
      var d = Math.sqrt(Math.pow(n.x - mx, 2) + Math.pow(n.y - my, 2));
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    return best;
  }

  if (!isTouchDevice()) {
    canvas.addEventListener("mousemove", function (e) {
      var idx = hitTest(e.clientX, e.clientY);
      hov = idx;
      if (idx >= 0) {
        showTip(NODES[idx]);
        moveTip(e.clientX, e.clientY);
        canvas.style.cursor = "pointer";
      } else {
        hideTip();
        canvas.style.cursor = "";
      }
    });
    canvas.addEventListener("mouseleave", hideTip);
  } else {
    canvas.addEventListener("click", function (e) {
      var idx = hitTest(e.clientX, e.clientY);
      if (idx >= 0) {
        hov = idx;
        showTip(NODES[idx]);
        moveTip(e.clientX, e.clientY);
        setTimeout(hideTip, 2200);
      }
    });
  }

  var cObs = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting && !rafId) {
        rafId = requestAnimationFrame(draw);
      } else if (!entries[0].isIntersecting && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    { threshold: 0.1 },
  );
  cObs.observe(canvas);
})();

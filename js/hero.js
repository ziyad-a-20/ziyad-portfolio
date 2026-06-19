/* ══════════════════════════════
   HERO — particle field canvas
   + text entrance animation
══════════════════════════════ */
(function () {
  window._heroInit = function () {
    var sec = document.getElementById("hero");
    var canvas = document.getElementById("hero-canvas");
    if (!canvas || !sec) return;

    var ctx = canvas.getContext("2d");
    var W, H;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    /* Particles */
    var COUNT = isTouchDevice() ? 45 : 110;
    var pts = Array.from({ length: COUNT }, function () {
      return {
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.00035,
        vy: (Math.random() - 0.5) * 0.00035,
        r: Math.random() * 1.6 + 0.4,
        a: Math.random() * 0.55 + 0.1,
        seed: Math.random() * 100,
      };
    });

    var mx = 0.5,
      my = 0.5;
    var heroVis = true,
      tabVis = !document.hidden;
    var rafId = null;

    if (!isTouchDevice()) {
      document.addEventListener(
        "mousemove",
        function (e) {
          mx = e.clientX / W;
          my = e.clientY / H;
        },
        { passive: true },
      );
    }

    var heroObs = new IntersectionObserver(
      function (en) {
        heroVis = en[0].isIntersecting;
        sync();
      },
      { threshold: 0.01 },
    );
    heroObs.observe(sec);

    document.addEventListener("visibilitychange", function () {
      tabVis = !document.hidden;
      sync();
    });

    function sync() {
      if (heroVis && tabVis) {
        if (!rafId) rafId = requestAnimationFrame(draw);
      } else {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    }

    var t = 0;

    function draw() {
      rafId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);
      t += 0.003;

      /* Cursor glow */
      var gx = mx * W,
        gy = my * H;
      var g = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.min(W, H) * 0.5);
      g.addColorStop(0, "rgba(200,255,0,0.05)");
      g.addColorStop(1, "rgba(200,255,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      /* Connections + dots */
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx + noise(t + p.seed) * 0.00008;
        p.y += p.vy + noise(t + p.seed + 5) * 0.00008;
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;
        if (p.y > 1) p.y = 0;

        var px = p.x * W,
          py = p.y * H;
        var nearMouse =
          Math.sqrt(Math.pow(p.x - mx, 2) + Math.pow(p.y - my, 2)) < 0.12;

        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j];
          var dx = (p.x - q.x) * W;
          var dy = (p.y - q.y) * H;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            var alpha = (1 - d / 110) * 0.07 * (nearMouse ? 2.5 : 1);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(q.x * W, q.y * H);
            ctx.strokeStyle = "rgba(200,255,0," + alpha + ")";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        var dotA = p.a * (nearMouse ? 1.8 : 1);
        var dotR = p.r * (nearMouse ? 2.2 : 1);
        ctx.beginPath();
        ctx.arc(px, py, dotR, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,255,0," + dotA + ")";
        ctx.fill();
      }
    }

    rafId = requestAnimationFrame(draw);

    /* ── Text entrance ── */
    function revealHero() {
      var top = document.querySelector(".hero-top");
      var name = document.getElementById("hero-name");
      var sub = document.querySelector(".hero-sub");
      var actions = document.querySelector(".hero-actions");

      if (top) top.classList.add("in");
      if (name)
        setTimeout(function () {
          name.classList.add("in");
        }, 120);
      if (sub) sub.classList.add("in");
      if (actions) actions.classList.add("in");
    }

    setTimeout(revealHero, 180);
  };
})();

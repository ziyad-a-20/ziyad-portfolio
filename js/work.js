/* ══════════════════════════════
   WORK — project card reveals
   + Tokyo canvas
══════════════════════════════ */
(function () {
  /* ── Staggered card reveal ── */
  var cards = document.querySelectorAll(".proj-card");
  var cardObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          var idx = Array.from(cards).indexOf(e.target);
          setTimeout(function () {
            e.target.classList.add("reveal");
          }, idx * 100);
          cardObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08 },
  );

  cards.forEach(function (c) {
    cardObs.observe(c);
  });

  /* ── Tokyo Revengers — slash rain ── */
  (function () {
    var canvas = document.getElementById("pc-tok");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var W,
      H,
      rafId = null;

    function resize() {
      W = canvas.width = canvas.offsetWidth || canvas.parentElement.offsetWidth;
      H = canvas.height =
        canvas.offsetHeight || canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener("resize", function () {
      resize();
    });

    var N = isTouchDevice() ? 20 : 48;
    var ANG = -Math.PI / 10;
    var slashes = Array.from({ length: N }, function () {
      return {
        x: Math.random() * 1.2 - 0.1,
        y: Math.random(),
        spd: 0.0007 + Math.random() * 0.0012,
        len: 15 + Math.random() * 30,
        a: 0.04 + Math.random() * 0.09,
      };
    });

    function draw() {
      ctx.clearRect(0, 0, W, H);
      slashes.forEach(function (s) {
        s.y += s.spd;
        if (s.y > 1.1) {
          s.y = -0.1;
          s.x = Math.random() * 1.2 - 0.1;
        }
        ctx.beginPath();
        ctx.moveTo(s.x * W, s.y * H);
        ctx.lineTo(
          s.x * W + Math.cos(ANG) * s.len,
          s.y * H + Math.sin(ANG) * s.len,
        );
        ctx.strokeStyle = "rgba(160,80,255," + s.a + ")";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
      rafId = requestAnimationFrame(draw);
    }

    var parent = canvas.closest(".proj-card") || canvas;
    var tokObs = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting && !rafId) {
          resize();
          rafId = requestAnimationFrame(draw);
        } else if (!entries[0].isIntersecting && rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      { threshold: 0.1 },
    );
    tokObs.observe(parent);
  })();
})();

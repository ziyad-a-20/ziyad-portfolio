/* ══════════════════════════════
   CURSOR — desktop only
   Reliable: starts off-screen,
   snaps on first mousemove
══════════════════════════════ */
(function () {
  if (isTouchDevice()) return;

  var dot = document.getElementById("cur-dot");
  var ring = document.getElementById("cur-ring");
  if (!dot || !ring) return;

  /* Start both off-screen */
  var mx = -300,
    my = -300;
  var rx = -300,
    ry = -300;
  var ready = false;
  var scrollTimer = null;

  /* Position helpers — use left/top not transform to avoid conflict */
  function setDot(x, y) {
    dot.style.left = x + "px";
    dot.style.top = y + "px";
  }
  function setRing(x, y) {
    ring.style.left = x + "px";
    ring.style.top = y + "px";
  }

  /* Init both off-screen */
  setDot(-300, -300);
  setRing(-300, -300);

  document.addEventListener(
    "mousemove",
    function (e) {
      mx = e.clientX;
      my = e.clientY;
      if (!ready) {
        rx = mx;
        ry = my;
        setDot(mx, my);
        setRing(rx, ry);
        ready = true;
      }
      dot.classList.remove("off");
      ring.classList.remove("off");
    },
    { passive: true },
  );

  /* Smooth ring follow */
  (function loop() {
    if (ready) {
      rx = lerp(rx, mx, 0.1);
      ry = lerp(ry, my, 0.1);
      setDot(mx, my);
      setRing(rx, ry);
    }
    requestAnimationFrame(loop);
  })();

  /* Hide on scroll, show after */
  window.addEventListener(
    "scroll",
    function () {
      dot.classList.add("off");
      ring.classList.add("off");
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        if (ready) {
          dot.classList.remove("off");
          ring.classList.remove("off");
        }
      }, 200);
    },
    { passive: true },
  );

  /* Hide when pointer leaves window */
  document.addEventListener("mouseleave", function () {
    dot.classList.add("off");
    ring.classList.add("off");
    ready = false;
  });
  document.addEventListener("mouseenter", function () {
    ready = true;
  });

  /* Hover state on interactive elements */
  document.addEventListener("mouseover", function (e) {
    var el = e.target.closest("a, button, .proj-card, .tl-card");
    if (el) ring.classList.add("hov");
  });
  document.addEventListener("mouseout", function (e) {
    var el = e.target.closest("a, button, .proj-card, .tl-card");
    if (el) ring.classList.remove("hov");
  });
})();

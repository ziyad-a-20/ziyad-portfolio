/* ══════════════════════════════
   UTILS — loads first
   Lenis MUST init here so all
   other defer scripts can use it
══════════════════════════════ */

/* ── Helpers ── */
function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches;
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function clamp(v, mn, mx) {
  return Math.min(Math.max(v, mn), mx);
}
function noise(x) {
  return (
    Math.sin(x * 0.8) * Math.cos(x * 1.3) * 0.5 +
    Math.sin(x * 2.1) * 0.3 +
    Math.cos(x * 0.4) * 0.2
  );
}

/* ── Lenis — init immediately ── */
window.__lenis = null;

window.addEventListener("DOMContentLoaded", function () {
  var lenis = new Lenis({
    duration: 1.1,
    easing: function (t) {
      return Math.min(1, 1.001 - Math.pow(2, -10 * t));
    },
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.8,
    infinite: false,
  });

  /* Plain rAF loop — most reliable, no GSAP dependency */
  function lenisRaf(time) {
    lenis.raf(time);
    requestAnimationFrame(lenisRaf);
  }
  requestAnimationFrame(lenisRaf);

  window.__lenis = lenis;

  /* Sync GSAP ScrollTrigger if loaded */
  if (typeof ScrollTrigger !== "undefined") {
    lenis.on("scroll", ScrollTrigger.update);
  }

  /* Scroll progress bar */
  var fill = document.getElementById("scroll-fill");
  lenis.on("scroll", function (e) {
    if (fill) fill.style.width = (e.progress * 100).toFixed(2) + "%";
  });

  /* Footer year */
  var yr = document.getElementById("ft-yr");
  if (yr) yr.textContent = new Date().getFullYear();
});

/* Service worker */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js").catch(function () {});
  });
}

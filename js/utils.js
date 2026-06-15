/* ── TOUCH DETECTION ── */
function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches;
}

/* ── LENIS SMOOTH SCROLL ── */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.5,
});

function lenisRaf(time) {
  lenis.raf(time);
  requestAnimationFrame(lenisRaf);
}
requestAnimationFrame(lenisRaf);

/* Expose lenis globally so nav.js can use lenis.scrollTo() */
window.__lenis = lenis;

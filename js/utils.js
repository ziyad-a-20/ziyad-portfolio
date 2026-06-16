/* TOUCH DETECTION */
function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches;
}

/* LENIS SMOOTH SCROLL */
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

window.__lenis = lenis;

/* SERVICE WORKER — offline support + faster repeat visits */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* registration failure shouldn't block the page */
    });
  });
}

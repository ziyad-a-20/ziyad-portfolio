// Lightweight, production-safe Lenis smooth scroll. Lenis eases the
// *rate* of native browser scrolling — it does not replace or
// virtualize it, and needs no wrapper markup. That means every
// position: fixed element on the site (nav, mobile nav, custom
// cursor, resume modal, command palette) keeps working exactly as
// before, with zero HTML restructuring required.
export function initSmoothScroll(prefersReducedMotion) {
  if (prefersReducedMotion) return null;
  if (typeof Lenis === "undefined") {
    console.warn(
      "[smooth-scroll] Lenis did not load; falling back to native scroll.",
    );
    return null;
  }

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    // Touch scrolling is left native — smoothing touch input tends to
    // fight the momentum scrolling mobile users already expect, and
    // most mobile browsers already scroll acceptably smoothly.
    syncTouch: false,
    // nav-scroll.js and command-palette.js already handle anchor
    // clicks explicitly (with their own reduced-motion checks), so
    // Lenis doesn't need to intercept anchor clicks a second time.
    anchors: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return lenis;
}

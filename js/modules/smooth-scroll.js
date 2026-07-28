// Lightweight, production-safe Lenis smooth scroll. Lenis eases the
// *rate* of native browser scrolling — it does not replace or
// virtualize it, and needs no wrapper markup. That means every
// position: fixed element on the site (nav, mobile nav, custom
// cursor, resume modal, command palette) keeps working exactly as
// before, with zero HTML restructuring required.
//
// syncTouch is enabled so the eased feel is consistent on phones and
// tablets, not just desktop mouse-wheel scrolling. Touch scrolling is
// tuned with a shorter lerp/inertia so it still feels responsive to a
// finger drag rather than laggy — the most common complaint people
// have with synced-touch smooth scroll libraries.
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
    syncTouch: true,
    syncTouchLerp: 0.075, // lower = snappier response to the finger, less "floaty"
    touchInertiaMultiplier: 25, // shorter momentum coast than the default, keeps it feeling controlled
    anchors: false, // nav-scroll.js / command-palette.js already handle anchor clicks explicitly
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return lenis;
}

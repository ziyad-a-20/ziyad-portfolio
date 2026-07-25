// Intercepts same-origin, same-tab link clicks and plays a short cover
// animation before navigating, then plays a reveal animation once the
// next page loads. Falls back to instant navigation entirely when
// prefers-reduced-motion is set, or if anything about the click looks
// like the user wants default browser behavior (new tab, download, etc).

const COVER_DURATION_MS = 480;

export function initPageTransitions(prefersReducedMotion) {
  const overlay = document.getElementById("page-transition-overlay");

  // Reveal on load (skip entirely for reduced motion — overlay stays hidden).
  if (overlay && !prefersReducedMotion) {
    requestAnimationFrame(() => {
      overlay.classList.add("revealing");
    });
    overlay.addEventListener("animationend", () => {
      overlay.classList.remove("revealing");
    });
  }

  if (prefersReducedMotion) return;

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented) return;
    const link = e.target.closest("a[href]");
    if (!link) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
      return;

    let url;
    try {
      url = new URL(link.href, window.location.href);
    } catch {
      return;
    }

    if (url.origin !== window.location.origin) return;

    // Pure in-page anchor (handled by nav-scroll.js's own smooth scroll) — skip.
    const samePage = url.pathname === window.location.pathname && url.hash;
    if (samePage) return;

    e.preventDefault();

    if (!overlay) {
      window.location.href = link.href;
      return;
    }

    overlay.classList.add("covering");
    overlay.addEventListener(
      "animationend",
      () => {
        window.location.href = link.href;
      },
      { once: true },
    );

    // Safety net in case the animationend event doesn't fire for any reason.
    setTimeout(() => {
      window.location.href = link.href;
    }, COVER_DURATION_MS + 150);
  });
}

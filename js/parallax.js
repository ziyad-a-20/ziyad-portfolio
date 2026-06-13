/* ══════════════════════════════════════════
   HERO PARALLAX — desktop only, scroll-driven
══════════════════════════════════════════ */
if (!isTouchDevice()) {
  const heroGlowEl = document.querySelector(".hero-glow");
  const heroCanvasEl = document.getElementById("hero-canvas");
  const heroSection = document.getElementById("hero");

  let parallaxTicking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    if (scrollY > heroHeight) {
      parallaxTicking = false;
      return;
    }
    const progress = scrollY / heroHeight;
    const glowOffset = progress * 60; /* glow drifts down slower */
    const canvasOffset = progress * 30;

    if (heroGlowEl) {
      heroGlowEl.style.transform = `translate(-50%, calc(-50% + ${glowOffset}px))`;
    }
    if (heroCanvasEl) {
      heroCanvasEl.style.transform = `translateY(${canvasOffset}px)`;
    }
    parallaxTicking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    },
    { passive: true },
  );
}

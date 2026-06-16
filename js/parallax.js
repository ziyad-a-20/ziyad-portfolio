/* ══════════════════════════════════════════
   HERO SCROLL-LINKED PARALLAX — desktop only
   Canvas + glow scale down and fade as a function
   of scroll progress through the hero section,
   instead of just sliding via translateY.
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

    /* progress: 0 at top of hero, 1 once fully scrolled past */
    const progress = Math.min(scrollY / heroHeight, 1);

    /* canvas: scales down to 85% and fades to 0.2 opacity as user leaves the hero */
    const canvasScale = 1 - progress * 0.15;
    const canvasOpacity = 1 - progress * 0.8;
    const canvasOffset = progress * 30;

    /* glow: drifts down slower than canvas, fades out a bit faster */
    const glowOffset = progress * 60;
    const glowOpacity = 1 - progress * 0.9;

    if (heroCanvasEl) {
      heroCanvasEl.style.transform = `translateY(${canvasOffset}px) scale(${canvasScale})`;
      heroCanvasEl.style.opacity = canvasOpacity;
    }
    if (heroGlowEl) {
      heroGlowEl.style.transform = `translate(-50%, calc(-50% + ${glowOffset}px))`;
      heroGlowEl.style.opacity = glowOpacity;
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

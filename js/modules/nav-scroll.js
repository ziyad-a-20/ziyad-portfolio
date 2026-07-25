// Consolidates what used to be three independent scroll listeners
// (nav-scrolled state, scroll-progress bar, mobile scrollspy) into a
// single rAF-batched handler, and gives desktop nav links the same
// smooth-scroll behavior the mobile nav already had.

export function initNavScroll(prefersReducedMotion) {
  const siteNav = document.getElementById("site-nav");
  const scrollProgress = document.getElementById("scroll-progress");
  const mnavItems = document.querySelectorAll(".mnav-item");
  const sections = [...mnavItems]
    .map((item) => document.getElementById(item.dataset.section))
    .filter(Boolean);

  let ticking = false;

  function update() {
    // Nav scrolled state
    if (siteNav) siteNav.classList.toggle("scrolled", window.scrollY > 40);

    // Scroll progress bar
    if (scrollProgress) {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = `${pct}%`;
    }

    // Scrollspy
    if (sections.length) {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      let currentId = sections[0].id;

      for (const sec of sections) {
        if (sec.offsetTop <= scrollPos) {
          currentId = sec.id;
        } else {
          break;
        }
      }

      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
      if (nearBottom) currentId = sections[sections.length - 1].id;

      mnavItems.forEach((item) => {
        const isActive = item.dataset.section === currentId;
        item.classList.toggle("active", isActive);
        if (isActive) item.setAttribute("aria-current", "true");
        else item.removeAttribute("aria-current");
      });
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update);
  update();

  // Smooth scroll for both desktop and mobile in-page nav links
  document.querySelectorAll(".nav-scroll-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || !targetId.startsWith("#")) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });

  // Back to top
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }
}

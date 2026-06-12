/* ══════════════════════════════════════════
   SCROLL REVEAL — shared observer
══════════════════════════════════════════ */
const revObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        revObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
);

document.querySelectorAll(".reveal-item").forEach((el) => revObs.observe(el));

const titleObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        titleObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 },
);
document
  .querySelectorAll(".section-title")
  .forEach((el) => titleObs.observe(el));

/* ══════════════════════════════════════════
   3D CARD TILT — desktop only, RAF throttled
══════════════════════════════════════════ */
if (!isTouchDevice()) {
  document.querySelectorAll(".project-card, .skill-card").forEach((card) => {
    let tiltFrame = null;
    card.addEventListener("mousemove", (e) => {
      if (tiltFrame) return;
      tiltFrame = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-5px)`;
        tiltFrame = null;
      });
    });
    card.addEventListener("mouseleave", () => {
      if (tiltFrame) {
        cancelAnimationFrame(tiltFrame);
        tiltFrame = null;
      }
      card.style.transform = "";
    });
  });
}

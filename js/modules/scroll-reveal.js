export function initScrollReveal(prefersReducedMotion) {
  if (prefersReducedMotion) {
    document
      .querySelectorAll(".stagger-reveal")
      .forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );

  document
    .querySelectorAll(".stagger-reveal")
    .forEach((el) => observer.observe(el));
}

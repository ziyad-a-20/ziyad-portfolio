/* ══════════════════════════════════════════
   BENTO SWIPE DOTS — mobile only
══════════════════════════════════════════ */
const bento = document.querySelector(".bento");
const dots = document.querySelectorAll(".bento-hint span");

if (bento && dots.length) {
  bento.addEventListener(
    "scroll",
    () => {
      const cardWidth = bento.children[0].offsetWidth + 14; /* gap */
      const index = Math.round(bento.scrollLeft / cardWidth);
      dots.forEach((d, i) => d.classList.toggle("active", i === index));
    },
    { passive: true },
  );
}

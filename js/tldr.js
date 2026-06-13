/* ══════════════════════════════════════════
   TL;DR MODE — mobile quick-scan toggle
══════════════════════════════════════════ */
const tldrToggle = document.getElementById("tldr-toggle");

if (tldrToggle) {
  tldrToggle.addEventListener("click", () => {
    const active = document.body.classList.toggle("tldr-mode");
    tldrToggle.classList.toggle("active", active);
    tldrToggle.setAttribute("aria-pressed", active);
    tldrToggle.querySelector(".tldr-text").textContent = active
      ? "Full Details"
      : "TL;DR Mode";
  });
}

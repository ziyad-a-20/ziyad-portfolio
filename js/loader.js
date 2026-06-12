/* ══════════════════════════════════════════
   LOADER
══════════════════════════════════════════ */
(function () {
  const loader = document.getElementById("loader");
  const pctEl = document.getElementById("loader-pct");
  let pct = 0;
  const iv = setInterval(() => {
    pct += Math.floor(Math.random() * 12) + 4;
    if (pct >= 100) {
      pct = 100;
      clearInterval(iv);
    }
    pctEl.textContent = pct + "%";
  }, 80);

  window.addEventListener("load", () => {
    pct = 100;
    pctEl.textContent = "100%";
    setTimeout(() => {
      loader.classList.add("hide");
      document.body.classList.remove("loading");
      document.getElementById("hero").classList.add("hero-in");

      const nameEms = document.querySelectorAll(".hero-name span em");
      if (nameEms.length > 0) {
        const lastEm = nameEms[nameEms.length - 1];
        lastEm.addEventListener("animationend", startScramble, { once: true });
        setTimeout(startScramble, 1100);
      } else {
        startScramble();
      }

      startTerminalType();
      startSubtitleLoop();
      setTimeout(() => {
        if (window.scrollY > 80) navbar.classList.add("visible");
      }, 600);
    }, 400);
  });
})();

/* ══════════════════════════════════════════
   FOOTER YEAR
══════════════════════════════════════════ */
const yearEl = document.getElementById("footer-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

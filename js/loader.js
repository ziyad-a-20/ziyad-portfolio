/* ══════════════════════════════════════════
   LOADER — gradient ring synced with JS counter,
   label text shifts as progress increases for a
   more premium, alive feel
══════════════════════════════════════════ */
(function () {
  const loader = document.getElementById("loader");
  const pctEl = document.getElementById("loader-pct");
  const ringEl = document.getElementById("loader-ring-progress");
  const labelEl = document.querySelector(".loader-label");
  const CIRCUMFERENCE = 276.5; /* 2 * PI * 44 */

  const STAGES = [
    { at: 0, text: "Loading experience" },
    { at: 35, text: "Preparing visuals" },
    { at: 70, text: "Almost ready" },
  ];

  let pct = 0;
  let stageIdx = 0;

  function setPct(val) {
    pct = Math.min(val, 100);
    pctEl.textContent = pct + "%";
    const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
    ringEl.style.strokeDashoffset = offset;

    while (stageIdx < STAGES.length - 1 && pct >= STAGES[stageIdx + 1].at) {
      stageIdx++;
      if (labelEl) labelEl.textContent = STAGES[stageIdx].text;
    }
  }

  const iv = setInterval(() => {
    setPct(pct + Math.floor(Math.random() * 10) + 3);
    if (pct >= 100) clearInterval(iv);
  }, 90);

  window.addEventListener("load", () => {
    setPct(100);
    if (labelEl) labelEl.textContent = "Ready";
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
    }, 450);
  });
})();

/* ══════════════════════════════════════════
   FOOTER YEAR
══════════════════════════════════════════ */
const yearEl = document.getElementById("footer-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

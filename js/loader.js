(function () {
  const loader = document.getElementById("loader");
  const pctEl = document.getElementById("loader-pct");
  const ringEl = document.getElementById("loader-ring-progress");
  const barFillEl = document.getElementById("loader-bar-fill");
  const labelEl = document.querySelector(".loader-label");
  const CIRCUMFERENCE = 276.5;

  const STAGES = [
    { at: 0, text: "Loading experience" },
    { at: 35, text: "Preparing visuals" },
    { at: 70, text: "Almost ready" },
  ];

  let targetPct = 0;
  let displayedPct = 0;
  let stageIdx = 0;
  let rafActive = false;

  function applyPct(rounded) {
    pctEl.textContent = rounded + "%";
    const offset = CIRCUMFERENCE - (rounded / 100) * CIRCUMFERENCE;
    ringEl.style.strokeDashoffset = offset;
    if (barFillEl) barFillEl.style.width = rounded + "%";

    while (stageIdx < STAGES.length - 1 && rounded >= STAGES[stageIdx + 1].at) {
      stageIdx++;
      if (labelEl) labelEl.textContent = STAGES[stageIdx].text;
    }
  }

  function tick() {
    displayedPct += (targetPct - displayedPct) * 0.14;
    if (Math.abs(targetPct - displayedPct) < 0.4) displayedPct = targetPct;
    applyPct(Math.round(displayedPct));

    if (displayedPct < targetPct) {
      requestAnimationFrame(tick);
    } else {
      rafActive = false;
    }
  }

  function setTarget(val) {
    targetPct = Math.min(val, 100);
    if (!rafActive) {
      rafActive = true;
      requestAnimationFrame(tick);
    }
  }

  const iv = setInterval(() => {
    setTarget(targetPct + Math.floor(Math.random() * 10) + 3);
    if (targetPct >= 100) clearInterval(iv);
  }, 90);

  window.addEventListener("load", () => {
    setTarget(100);

    setTimeout(() => {
      displayedPct = 100;
      applyPct(100);
      if (labelEl) labelEl.textContent = "Ready";

      setTimeout(() => {
        loader.classList.add("hide");
        document.body.classList.remove("loading");
        document.getElementById("hero").classList.add("hero-in");

        const nameEms = document.querySelectorAll(".hero-name span em");
        if (nameEms.length > 0) {
          const lastEm = nameEms[nameEms.length - 1];
          lastEm.addEventListener("animationend", startScramble, {
            once: true,
          });
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
    }, 300);
  });
})();

/* FOOTER YEAR */
const yearEl = document.getElementById("footer-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

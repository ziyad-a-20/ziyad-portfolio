// Premium boot-sequence loader: cycles through real status lines tied to
// your actual stack instead of a single generic message, with a slower,
// more deliberate easing curve on the fill so it reads as "engineered"
// rather than "waiting."

const STATUS_LINES = [
  "INITIALIZING PORTFOLIO",
  "MOUNTING RENDER LAYER",
  "LOADING TYPE SYSTEM",
  "COMPILING SHADERS",
  "SYNCING PROJECT DATA",
  "READY",
];

export function initLoader(prefersReducedMotion) {
  const loader = document.getElementById("loader");
  const percentageEl = document.getElementById("loader-percentage");
  const statusEl = document.getElementById("loader-status");
  if (!loader || !percentageEl || !statusEl) return;

  if (prefersReducedMotion) {
    loader.style.display = "none";
    document.body.classList.remove("loading");
    return;
  }

  let progress = 0;
  let statusIndex = 0;
  statusEl.textContent = STATUS_LINES[0];

  const duration = 1800; // total loader duration in ms
  const start = performance.now();

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function tick(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    progress = Math.round(easeOutExpo(t) * 100);
    percentageEl.textContent = String(progress).padStart(3, "0");

    const nextStatusIndex = Math.min(
      Math.floor(t * STATUS_LINES.length),
      STATUS_LINES.length - 1,
    );
    if (nextStatusIndex !== statusIndex) {
      statusIndex = nextStatusIndex;
      statusEl.textContent = STATUS_LINES[statusIndex];
    }

    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      finish();
    }
  }

  function finish() {
    loader.classList.add("loader-done");
    document.body.classList.remove("loading");
    setTimeout(() => {
      loader.style.display = "none";
    }, 700); // matches the CSS transition duration below
  }

  requestAnimationFrame(tick);
}

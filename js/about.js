/* ══════════════════════════════════════════
   TERMINAL
══════════════════════════════════════════ */
const terminalLines = [
  { type: "prompt", text: "whoami" },
  { type: "output", text: "ziyad@dev — student & builder" },
  { type: "blank" },
  { type: "prompt", text: "cat stack.txt" },
  { type: "output", text: "→ Python · Flask · MySQL" },
  { type: "output", text: "→ HTML · CSS · JavaScript" },
  { type: "output", text: "→ Tailwind CSS" },
  { type: "output", text: "→ Git · GitHub · Vercel · Netlify" },
  { type: "blank" },
  { type: "prompt", text: "cat status.txt" },
  { type: "green", text: "● Open to work — let's build something" },
];

let terminalRunning = false;
let terminalCycleCount = 0;

function runTerminal() {
  if (terminalRunning) return;
  terminalRunning = true;

  const body = document.getElementById("terminal-body");
  if (!body) {
    terminalRunning = false;
    return;
  }
  body.innerHTML = "";

  if (terminalCycleCount >= 2) body.setAttribute("aria-live", "off");

  let lineIdx = 0,
    charIdx = 0,
    currentLineEl = null;

  function tick() {
    if (lineIdx >= terminalLines.length) {
      terminalCycleCount++;
      setTimeout(() => {
        terminalRunning = false;
        runTerminal();
      }, 3000);
      return;
    }
    const line = terminalLines[lineIdx];

    if (line.type === "blank") {
      body.appendChild(document.createElement("br"));
      lineIdx++;
      charIdx = 0;
      setTimeout(tick, 120);
      return;
    }

    if (charIdx === 0) {
      currentLineEl = document.createElement("div");
      if (line.type === "prompt") {
        const sp = document.createElement("span");
        sp.className = "tp";
        sp.textContent = "~ ";
        const cm = document.createElement("span");
        cm.className = "tc";
        currentLineEl.appendChild(sp);
        currentLineEl.appendChild(cm);
      } else if (line.type === "green") {
        currentLineEl.className = "tg";
      } else {
        currentLineEl.className = "to";
      }
      body.appendChild(currentLineEl);
    }

    const target =
      line.type === "prompt"
        ? currentLineEl.querySelector(".tc")
        : currentLineEl;

    if (charIdx < line.text.length) {
      target.textContent += line.text[charIdx];
      charIdx++;
      setTimeout(tick, line.type === "prompt" ? 55 : 18);
    } else {
      lineIdx++;
      charIdx = 0;
      setTimeout(tick, line.type === "prompt" ? 300 : 60);
    }
  }
  setTimeout(tick, 600);
}

function startTerminalType() {
  runTerminal();
}

/* ══════════════════════════════════════════
   COUNTER ANIMATION
══════════════════════════════════════════ */
const counterObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1200;
      const start = performance.now();
      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      counterObs.unobserve(el);
    });
  },
  { threshold: 0.5 },
);
document
  .querySelectorAll(".stat-num[data-target]")
  .forEach((el) => counterObs.observe(el));

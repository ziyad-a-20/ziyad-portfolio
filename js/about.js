/* ══════════════════════════════════════════
   TERMINAL — loop with proper cleanup
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
let _terminalRecycleTimer = null; /* stored so we can cancel it */

function runTerminal() {
  if (terminalRunning) return;
  terminalRunning = true;

  const body = document.getElementById("terminal-body");
  if (!body) {
    terminalRunning = false;
    return;
  }
  body.innerHTML = "";

  /* Stop announcing to screen readers after 2 full cycles */
  if (terminalCycleCount >= 2) body.setAttribute("aria-live", "off");

  let lineIdx = 0,
    charIdx = 0,
    currentLineEl = null;

  function tick() {
    if (lineIdx >= terminalLines.length) {
      terminalCycleCount++;
      /* Store the timeout ID so visibility change can cancel it */
      _terminalRecycleTimer = setTimeout(() => {
        terminalRunning = false;
        _terminalRecycleTimer = null;
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

/* Cancel pending recycle when the tab is hidden; restart when visible again */
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (_terminalRecycleTimer !== null) {
      clearTimeout(_terminalRecycleTimer);
      _terminalRecycleTimer = null;
      terminalRunning = false;
    }
  } else {
    if (!terminalRunning) runTerminal();
  }
});

function startTerminalType() {
  runTerminal();
}

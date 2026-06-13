/* ══════════════════════════════════════════
   TERMINAL COLLAPSE — tablet/mobile only
══════════════════════════════════════════ */
const terminalToggle = document.getElementById("terminal-toggle");
const terminalEl = document.querySelector(".terminal");

function applyTerminalCollapse() {
  if (window.innerWidth <= 900) {
    terminalEl.classList.add("collapsed");
    terminalToggle.style.display = "flex";
    terminalToggle.setAttribute("aria-expanded", "false");
  } else {
    terminalEl.classList.remove("collapsed");
    terminalToggle.style.display = "none";
  }
}
applyTerminalCollapse();
window.addEventListener("resize", applyTerminalCollapse);

if (terminalToggle) {
  terminalToggle.addEventListener("click", () => {
    const collapsed = terminalEl.classList.toggle("collapsed");
    terminalToggle.setAttribute("aria-expanded", !collapsed);
    const svg = terminalToggle.querySelector("svg");
    svg.style.transform = collapsed ? "rotate(0deg)" : "rotate(180deg)";
  });
}

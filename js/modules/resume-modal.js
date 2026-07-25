import { createFocusTrap } from "./focus-trap.js";

export function initResumeModal(resumePath = "assets/resume.pdf") {
  const modal = document.getElementById("resume-modal");
  const backdrop = document.getElementById("resume-modal-backdrop");
  const closeBtn = document.getElementById("resume-modal-close");
  const frame = document.getElementById("resume-modal-frame");
  if (!modal || !frame) return { open: () => {}, close: () => {} };

  const trap = createFocusTrap(modal);
  let loaded = false;

  function open() {
    if (!loaded) {
      frame.src = `${resumePath}#view=FitH`;
      loaded = true;
    }
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    trap.activate(closeBtn);
  }

  function close() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    trap.deactivate();
  }

  [
    "resume-preview-trigger",
    "resume-preview-trigger-contact",
    "resume-preview-trigger-footer",
  ].forEach((id) => {
    const trigger = document.getElementById(id);
    if (trigger) trigger.addEventListener("click", open);
  });

  if (closeBtn) closeBtn.addEventListener("click", close);
  if (backdrop) backdrop.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) close();
  });

  return { open, close };
}

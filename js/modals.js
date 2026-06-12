/* ══════════════════════════════════════════
   RESUME MODAL
══════════════════════════════════════════ */
const resumeModal = document.getElementById("resume-modal");
const resumeIframe = document.getElementById("resume-iframe");
const resumeClose = document.getElementById("resume-close");

const RESUME_DOWNLOAD_URL =
  "https://www.dropbox.com/scl/fi/tx5bahwrs4xzsmofb6xyk/ziyad-resume.pdf?rlkey=5up0dw63amdlqkgx957fblytk&st=xud27njm&dl=1";

const RESUME_VIEWER_URL =
  "https://docs.google.com/viewer?url=" +
  encodeURIComponent(RESUME_DOWNLOAD_URL) +
  "&embedded=true";

const resumeDownloadBtn = document.querySelector(".resume-download-btn");
if (resumeDownloadBtn) resumeDownloadBtn.href = RESUME_DOWNLOAD_URL;

let iframeLoaded = false;

function openResumeModal() {
  if (!iframeLoaded) {
    resumeIframe.src = RESUME_VIEWER_URL;
    iframeLoaded = true;
  }
  resumeModal.classList.add("open");
  resumeModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  resumeClose.focus();
}

function closeResumeModal() {
  resumeModal.classList.remove("open");
  resumeModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

const resumeTriggers = [
  "nav-resume-btn",
  "hero-resume-btn",
  "mobile-resume-btn",
  "footer-resume-btn",
];
resumeTriggers.forEach((id) => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener("click", openResumeModal);
});

resumeClose.addEventListener("click", closeResumeModal);
resumeModal.addEventListener("click", (e) => {
  if (e.target === resumeModal) closeResumeModal();
});

/* ══════════════════════════════════════════
   KEYBOARD SHORTCUTS MODAL
══════════════════════════════════════════ */
const shortcutsModal = document.getElementById("shortcuts-modal");
const shortcutsClose = document.getElementById("shortcuts-close");
const shortcutsHintBtn = document.getElementById("shortcuts-hint-btn");

function openShortcutsModal() {
  shortcutsModal.classList.add("open");
  shortcutsModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  shortcutsClose.focus();
}
function closeShortcutsModal() {
  shortcutsModal.classList.remove("open");
  shortcutsModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

shortcutsHintBtn.addEventListener("click", openShortcutsModal);
shortcutsClose.addEventListener("click", closeShortcutsModal);
shortcutsModal.addEventListener("click", (e) => {
  if (e.target === shortcutsModal) closeShortcutsModal();
});

/* ══════════════════════════════════════════
   KEYBOARD SHORTCUTS HANDLER
══════════════════════════════════════════ */
const SECTION_KEYS = {
  1: "about",
  2: "skills",
  3: "experience",
  4: "projects",
  5: "contact",
};

document.addEventListener("keydown", (e) => {
  const tag = document.activeElement.tagName;
  const isInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

  if (e.key === "Escape") {
    if (shortcutsModal.classList.contains("open")) {
      closeShortcutsModal();
      return;
    }
    if (resumeModal.classList.contains("open")) {
      closeResumeModal();
      return;
    }
    if (!isInput) window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (isInput) return;

  if (e.key === "/") {
    e.preventDefault();
    const firstNavLink = document.querySelector(".nav-links a");
    if (firstNavLink) firstNavLink.focus();
    return;
  }

  if (e.key === "?") {
    e.preventDefault();
    openShortcutsModal();
    return;
  }

  if (SECTION_KEYS[e.key]) {
    e.preventDefault();
    const target = document.getElementById(SECTION_KEYS[e.key]);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      const label = target.querySelector(".section-label");
      if (label) {
        label.classList.remove("flash");
        void label.offsetWidth;
        label.classList.add("flash");
        setTimeout(() => label.classList.remove("flash"), 800);
      }
    }
  }
});

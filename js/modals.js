/* ══════════════════════════════════════════
   RESUME MODAL — direct PDF, no Google Docs Viewer
   (that was the cause of the 5-10s desktop delay
   and the mobile blank-screen failure)
══════════════════════════════════════════ */
const resumeModal = document.getElementById("resume-modal");
const resumeModalBody = document.getElementById("resume-modal-body");
const resumeClose = document.getElementById("resume-close");

const RESUME_DOWNLOAD_URL =
  "https://www.dropbox.com/scl/fi/tx5bahwrs4xzsmofb6xyk/ziyad-resume.pdf?rlkey=5up0dw63amdlqkgx957fblytk&st=xud27njm&dl=1";

const resumeDownloadBtn = document.querySelector(".resume-download-btn");
if (resumeDownloadBtn) resumeDownloadBtn.href = RESUME_DOWNLOAD_URL;

let resumeContentBuilt = false;

function buildResumeContent() {
  if (resumeContentBuilt) return;
  resumeContentBuilt = true;

  if (isTouchDevice()) {
    /* Mobile: native in-modal PDF rendering is unreliable across browsers.
       A direct "open in new tab" card uses the OS's own PDF viewer instead,
       which always works and opens instantly. */
    resumeModalBody.innerHTML = `
      <div class="resume-fallback-card">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
        </svg>
        <p>Your browser will open the resume using its built-in PDF viewer for the best reading experience.</p>
        <a href="${RESUME_DOWNLOAD_URL}" target="_blank" rel="noopener" class="resume-fallback-open-btn">
          Open Resume ↗
        </a>
      </div>
    `;
  } else {
    /* Desktop: direct <object> embed renders natively via the browser's
       built-in PDF engine (Chrome PDFium / Safari PDFKit / Firefox pdf.js).
       No server round-trip, loads near-instantly. */
    resumeModalBody.innerHTML = `
      <object data="${RESUME_DOWNLOAD_URL}" type="application/pdf">
        <div class="resume-fallback-card">
          <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
          </svg>
          <p>Preview isn't available in this browser.</p>
          <a href="${RESUME_DOWNLOAD_URL}" target="_blank" rel="noopener" class="resume-fallback-open-btn">
            Open Resume ↗
          </a>
        </div>
      </object>
    `;
  }
}

function openResumeModal() {
  buildResumeContent();
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
    if (!isInput) {
      if (window.__lenis) window.__lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
      if (window.__lenis) window.__lenis.scrollTo(target, { offset: -80 });
      else target.scrollIntoView({ behavior: "smooth" });

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

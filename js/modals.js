/* RESUME MODAL — self-hosted PDF, no third-party Dropbox dependency.
   Make sure your actual resume file is placed at assets/resume.pdf */
const resumeModal = document.getElementById("resume-modal");
const resumeModalBody = document.getElementById("resume-modal-body");
const resumeClose = document.getElementById("resume-close");

const RESUME_DOWNLOAD_URL = "assets/resume.pdf";
const RESUME_EMBED_URL = "assets/resume.pdf";

const resumeDownloadBtn = document.querySelector(".resume-download-btn");
if (resumeDownloadBtn) resumeDownloadBtn.href = RESUME_DOWNLOAD_URL;

let resumeContentBuilt = false;
let resumeLastFocused = null;

function buildResumeContent() {
  if (resumeContentBuilt) return;
  resumeContentBuilt = true;

  const isMobile = isTouchDevice() || window.innerWidth <= 768;

  if (isMobile) {
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
    resumeModalBody.innerHTML = `
      <object data="${RESUME_EMBED_URL}" type="application/pdf">
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

/* Generic focus trap, shared by both modals */
function getFocusableEls(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => el.offsetParent !== null);
}

function trapFocus(modalEl) {
  function handleKeydown(e) {
    if (e.key !== "Tab") return;
    const focusable = getFocusableEls(modalEl);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  modalEl.addEventListener("keydown", handleKeydown);
  modalEl._focusTrapHandler = handleKeydown;
}

function releaseFocusTrap(modalEl) {
  if (modalEl._focusTrapHandler) {
    modalEl.removeEventListener("keydown", modalEl._focusTrapHandler);
    modalEl._focusTrapHandler = null;
  }
}

function openResumeModal() {
  resumeLastFocused = document.activeElement;

  if (
    typeof hamburger !== "undefined" &&
    hamburger.classList.contains("open")
  ) {
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", false);
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", true);
  }

  buildResumeContent();
  resumeModal.classList.add("open");
  resumeModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  resumeClose.focus();
  trapFocus(resumeModal);
}

function closeResumeModal() {
  releaseFocusTrap(resumeModal);
  resumeModal.classList.remove("open");
  resumeModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (resumeLastFocused && typeof resumeLastFocused.focus === "function") {
    resumeLastFocused.focus();
  }
  resumeLastFocused = null;
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

/* KEYBOARD SHORTCUTS MODAL */
const shortcutsModal = document.getElementById("shortcuts-modal");
const shortcutsClose = document.getElementById("shortcuts-close");
const shortcutsHintBtn = document.getElementById("shortcuts-hint-btn");
let shortcutsLastFocused = null;

function openShortcutsModal() {
  shortcutsLastFocused = document.activeElement;
  shortcutsModal.classList.add("open");
  shortcutsModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  shortcutsClose.focus();
  trapFocus(shortcutsModal);
}
function closeShortcutsModal() {
  releaseFocusTrap(shortcutsModal);
  shortcutsModal.classList.remove("open");
  shortcutsModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (
    shortcutsLastFocused &&
    typeof shortcutsLastFocused.focus === "function"
  ) {
    shortcutsLastFocused.focus();
  }
  shortcutsLastFocused = null;
}

shortcutsHintBtn.addEventListener("click", openShortcutsModal);
shortcutsClose.addEventListener("click", closeShortcutsModal);
shortcutsModal.addEventListener("click", (e) => {
  if (e.target === shortcutsModal) closeShortcutsModal();
});

/* KEYBOARD SHORTCUTS HANDLER */
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

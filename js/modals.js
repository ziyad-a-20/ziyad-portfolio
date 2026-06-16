/* ══════════════════════════════════════════
   RESUME MODAL
   — Desktop embed uses raw=1 (inline-renderable),
     NOT dl=1 (forces attachment disposition, which
     is why <object> rendered a blank white box)
   — Download button keeps dl=1, since forcing a
     download there is correct
   — Mobile gets a direct "open in new tab" card
══════════════════════════════════════════ */
const resumeModal = document.getElementById("resume-modal");
const resumeModalBody = document.getElementById("resume-modal-body");
const resumeClose = document.getElementById("resume-close");

/* dl=1 forces Content-Disposition: attachment — correct for the Download button,
   wrong for embedding. Used only for the explicit download link. */
const RESUME_DOWNLOAD_URL =
  "https://www.dropbox.com/scl/fi/v3vu8xhp6od1gbu3yl3xd/ziyad-resume.pdf?rlkey=3glln5w6k3ow0ws2aqbf3jgtc&st=4l2tuyi6&dl=1";

/* raw=1 serves the file inline (no forced download) — this is what <object>/<iframe>
   actually need to render the PDF instead of showing a blank box. */
const RESUME_EMBED_URL =
  "https://www.dropbox.com/scl/fi/v3vu8xhp6od1gbu3yl3xd/ziyad-resume.pdf?rlkey=3glln5w6k3ow0ws2aqbf3jgtc&st=4l2tuyi6&raw=1";

const resumeDownloadBtn = document.querySelector(".resume-download-btn");
if (resumeDownloadBtn) resumeDownloadBtn.href = RESUME_DOWNLOAD_URL;

let resumeContentBuilt = false;

function buildResumeContent() {
  if (resumeContentBuilt) return;
  resumeContentBuilt = true;

  /* Use both the media-query check AND a width check as a fallback signal —
     belt-and-suspenders so mobile never accidentally gets the desktop embed path. */
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

function openResumeModal() {
  /* Close the mobile hamburger menu first if it's open — otherwise it sits
     on top of/behind the resume modal and the button appears to do nothing */
  if (typeof hamburger !== "undefined" && hamburger.classList.contains("open")) {
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
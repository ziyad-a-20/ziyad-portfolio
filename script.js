/* ══════════════════════════════════════════
   LOADER
══════════════════════════════════════════ */
(function () {
  const loader = document.getElementById("loader");
  const pctEl = document.getElementById("loader-pct");
  let pct = 0;
  const iv = setInterval(() => {
    pct += Math.floor(Math.random() * 12) + 4;
    if (pct >= 100) {
      pct = 100;
      clearInterval(iv);
    }
    pctEl.textContent = pct + "%";
  }, 80);

  window.addEventListener("load", () => {
    pct = 100;
    pctEl.textContent = "100%";
    setTimeout(() => {
      loader.classList.add("hide");
      document.body.classList.remove("loading");
      document.getElementById("hero").classList.add("hero-in");

      /* Scramble fires after slide-up animation ends (~900ms) */
      const nameEms = document.querySelectorAll(".hero-name span em");
      if (nameEms.length > 0) {
        const lastEm = nameEms[nameEms.length - 1];
        lastEm.addEventListener("animationend", startScramble, { once: true });
        /* Fallback if animationend never fires */
        setTimeout(startScramble, 1100);
      } else {
        startScramble();
      }

      startTerminalType();
      startSubtitleLoop();
      setTimeout(() => {
        if (window.scrollY > 80) navbar.classList.add("visible");
      }, 600);
    }, 400);
  });
})();

/* ══════════════════════════════════════════
   FOOTER YEAR
══════════════════════════════════════════ */
const yearEl = document.getElementById("footer-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ══════════════════════════════════════════
   TOUCH DETECTION
══════════════════════════════════════════ */
const isTouchDevice = () => window.matchMedia("(pointer: coarse)").matches;

/* ══════════════════════════════════════════
   CURSOR — desktop only
══════════════════════════════════════════ */
const cur = document.getElementById("cursor");
const ring = document.getElementById("cursor-ring");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
let scrollTimer = null;

/* ── Cursor trail ── */
const TRAIL_COUNT = 5;
const trailDots = [];
const trailPos = [];

if (!isTouchDevice()) {
  for (let i = 0; i < TRAIL_COUNT; i++) {
    const dot = document.createElement("div");
    dot.className = "trail-dot";
    document.body.appendChild(dot);
    trailDots.push(dot);
    trailPos.push({ x: 0, y: 0 });
  }

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + "px";
    cur.style.top = my + "px";
    cur.classList.remove("hidden");
    ring.classList.remove("hidden");
  });

  (function animRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";

    /* Trail: each dot chases the one ahead of it */
    trailPos[0].x += (mx - trailPos[0].x) * 0.28;
    trailPos[0].y += (my - trailPos[0].y) * 0.28;
    for (let i = 1; i < TRAIL_COUNT; i++) {
      trailPos[i].x += (trailPos[i - 1].x - trailPos[i].x) * 0.32;
      trailPos[i].y += (trailPos[i - 1].y - trailPos[i].y) * 0.32;
    }
    trailDots.forEach((dot, i) => {
      const alpha = (1 - i / TRAIL_COUNT) * 0.35;
      const size = 4 - i * 0.5;
      dot.style.left = trailPos[i].x + "px";
      dot.style.top = trailPos[i].y + "px";
      dot.style.width = size + "px";
      dot.style.height = size + "px";
      dot.style.opacity = alpha;
    });

    requestAnimationFrame(animRing);
  })();

  document
    .querySelectorAll("a, button, .skill-card, .project-card")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => {
        ring.style.width = "56px";
        ring.style.height = "56px";
        ring.style.borderColor = "rgba(74,144,217,0.9)";
      });
      el.addEventListener("mouseleave", () => {
        ring.style.width = "36px";
        ring.style.height = "36px";
        ring.style.borderColor = "rgba(255,255,255,0.4)";
      });
    });
}

/* ══════════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════════ */
const progressBar = document.getElementById("scroll-progress");
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = p + "%";
}

/* ══════════════════════════════════════════
   NAV
══════════════════════════════════════════ */
const navbar = document.getElementById("navbar");

window.addEventListener(
  "scroll",
  () => {
    navbar.classList.toggle("visible", window.scrollY > 80);
    updateActiveNav();
    updateBackToTop();
    updateScrollProgress();
    updateTimelineHighlight();

    if (!isTouchDevice()) {
      cur.classList.add("hidden");
      ring.classList.add("hidden");
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        cur.classList.remove("hidden");
        ring.classList.remove("hidden");
      }, 300);
    }
  },
  { passive: true },
);

function updateActiveNav() {
  const sections = ["about", "skills", "experience", "projects", "contact"];
  let current = "";
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.scrollY >= el.offsetTop - 160) current = id;
  });
  document.querySelectorAll(".nav-links a[data-section]").forEach((a) => {
    a.classList.toggle("active", a.dataset.section === current);
  });
}

/* ══════════════════════════════════════════
   TIMELINE ACTIVE HIGHLIGHT (subtle)
══════════════════════════════════════════ */
function updateTimelineHighlight() {
  const items = document.querySelectorAll(".timeline-item");
  items.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const inView =
      rect.top < window.innerHeight * 0.65 &&
      rect.bottom > window.innerHeight * 0.2;
    item.classList.toggle("tl-active", inView);
  });
}

/* ══════════════════════════════════════════
   HAMBURGER
══════════════════════════════════════════ */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");

hamburger.addEventListener("click", () => {
  const isOpen = hamburger.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", isOpen);
  mobileMenu.classList.toggle("open", isOpen);
  mobileMenu.setAttribute("aria-hidden", !isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
});

document.querySelectorAll(".mobile-links a").forEach((a) => {
  a.addEventListener("click", () => {
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", false);
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", true);
    document.body.style.overflow = "";
  });
});

/* ══════════════════════════════════════════
   BACK TO TOP
══════════════════════════════════════════ */
const btt = document.getElementById("back-to-top");
btt.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);
function updateBackToTop() {
  btt.classList.toggle("visible", window.scrollY > 400);
}

/* ══════════════════════════════════════════
   SMOOTH HASH NAVIGATION — section label flash
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    /* Flash the section-label of the target section */
    const label = target.querySelector(".section-label");
    if (label) {
      label.classList.remove("flash");
      void label.offsetWidth; /* reflow to re-trigger */
      label.classList.add("flash");
      setTimeout(() => label.classList.remove("flash"), 800);
    }
  });
});

/* ══════════════════════════════════════════
   COPY EMAIL BUTTON
══════════════════════════════════════════ */
const copyBtn = document.getElementById("copy-email-btn");
if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    const EMAIL = "ziyad.official.a@gmail.com";
    const label = copyBtn.querySelector(".copy-label");

    function onCopied() {
      copyBtn.classList.add("copied");
      label.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.classList.remove("copied");
        label.textContent = "Copy";
      }, 2200);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(EMAIL)
        .then(onCopied)
        .catch(() => fallbackCopy(EMAIL, onCopied));
    } else {
      fallbackCopy(EMAIL, onCopied);
    }
  });
}

function fallbackCopy(text, cb) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.cssText = "position:fixed;opacity:0;pointer-events:none;";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  let success = false;
  try {
    success = document.execCommand("copy");
  } catch (e) {
    /* ignore */
  }
  document.body.removeChild(ta);
  if (success) {
    cb();
  } else {
    /* Surface a non-intrusive notice if both methods fail */
    const label = copyBtn.querySelector(".copy-label");
    if (label) {
      label.textContent = "Failed";
      setTimeout(() => {
        label.textContent = "Copy";
      }, 2000);
    }
  }
}

/* ══════════════════════════════════════════
   RESUME MODAL
══════════════════════════════════════════ */
const resumeModal = document.getElementById("resume-modal");
const resumeIframe = document.getElementById("resume-iframe");
const resumeClose = document.getElementById("resume-close");

/* Direct PDF download link (dl=1 forces download) */
const RESUME_DOWNLOAD_URL =
  "https://www.dropbox.com/scl/fi/3r2evgkvyho0s8pgnl2rs/ziyad-resume.pdf?rlkey=i2k579y2b60du4okse057ijpa&st=gqwryl3x&dl=1";

/* Google Docs viewer can embed any publicly accessible PDF */
const RESUME_PDF_DIRECT =
  "https://www.dropbox.com/scl/fi/3r2evgkvyho0s8pgnl2rs/ziyad-resume.pdf?rlkey=i2k579y2b60du4okse057ijpa&st=gqwryl3x&raw=1";
const RESUME_VIEWER_URL =
  "https://docs.google.com/viewer?url=" +
  encodeURIComponent(RESUME_PDF_DIRECT) +
  "&embedded=true";

/* Update download button href dynamically */
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
  /* Ignore when typing in form inputs */
  const tag = document.activeElement.tagName;
  const isInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

  /* Escape closes any open modal, or scrolls to top */
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

  /* / — focus first nav link */
  if (e.key === "/") {
    e.preventDefault();
    const firstNavLink = document.querySelector(".nav-links a");
    if (firstNavLink) firstNavLink.focus();
    return;
  }

  /* ? — show shortcuts */
  if (e.key === "?") {
    e.preventDefault();
    openShortcutsModal();
    return;
  }

  /* 1–5 — jump to sections */
  if (SECTION_KEYS[e.key]) {
    e.preventDefault();
    const target = document.getElementById(SECTION_KEYS[e.key]);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      /* Flash the section label */
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

/* ══════════════════════════════════════════
   CONTACT FORM — Formspree
══════════════════════════════════════════ */
const FORMSPREE_URL = "https://formspree.io/f/xnjydrlk";

const formSubmitBtn = document.getElementById("form-submit-btn");
const formSuccess = document.getElementById("form-success");
const charCount = document.getElementById("cf-char-count");
const messageField = document.getElementById("cf-message");

/* Character counter */
if (messageField && charCount) {
  messageField.addEventListener("input", () => {
    const len = messageField.value.length;
    const max = parseInt(messageField.getAttribute("maxlength")) || 500;
    charCount.textContent = len + " / " + max;
    charCount.classList.remove("warn", "danger");
    if (len >= max * 0.9) charCount.classList.add("danger");
    else if (len >= max * 0.75) charCount.classList.add("warn");
  });
}

function getField(id) {
  return document.getElementById(id);
}
function getError(id) {
  return document.getElementById(id + "-err");
}

function setError(fieldId, msg) {
  const input = getField(fieldId);
  const err = getError(fieldId);
  if (input) input.classList.toggle("error", !!msg);
  if (err) err.textContent = msg || "";
}

function clearErrors() {
  ["cf-name", "cf-email", "cf-subject", "cf-message"].forEach((id) =>
    setError(id, ""),
  );
}

function validateForm() {
  let valid = true;
  const name = getField("cf-name").value.trim();
  const email = getField("cf-email").value.trim();
  const subject = getField("cf-subject").value.trim();
  const message = getField("cf-message").value.trim();

  if (!name) {
    setError("cf-name", "Name is required");
    valid = false;
  } else setError("cf-name", "");

  if (!email) {
    setError("cf-email", "Email is required");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("cf-email", "Enter a valid email");
    valid = false;
  } else setError("cf-email", "");

  if (!subject) {
    setError("cf-subject", "Subject is required");
    valid = false;
  } else setError("cf-subject", "");

  if (!message) {
    setError("cf-message", "Message is required");
    valid = false;
  } else if (message.length < 10) {
    setError("cf-message", "Too short — say a little more");
    valid = false;
  } else setError("cf-message", "");

  return valid;
}

/* Live error clearing */
["cf-name", "cf-email", "cf-subject", "cf-message"].forEach((id) => {
  const el = getField(id);
  if (el) el.addEventListener("input", () => setError(id, ""));
});

if (formSubmitBtn) {
  formSubmitBtn.addEventListener("click", async () => {
    clearErrors();
    if (!validateForm()) return;

    /* Prevent double-submit immediately */
    formSubmitBtn.disabled = true;
    formSubmitBtn.classList.add("sending");
    formSubmitBtn.querySelector(".form-submit-text").textContent = "Sending…";

    const payload = {
      name: getField("cf-name").value.trim(),
      email: getField("cf-email").value.trim(),
      subject: getField("cf-subject").value.trim(),
      message: getField("cf-message").value.trim(),
    };

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        ["cf-name", "cf-email", "cf-subject", "cf-message"].forEach((id) => {
          const el = getField(id);
          if (el) el.value = "";
        });
        if (charCount) {
          charCount.textContent = "0 / 500";
          charCount.classList.remove("warn", "danger");
        }

        formSubmitBtn.style.transition =
          "opacity 0.4s ease, transform 0.4s ease";
        formSubmitBtn.style.opacity = "0";
        formSubmitBtn.style.transform = "translateY(6px)";

        setTimeout(() => {
          formSubmitBtn.style.display = "none";
          formSuccess.classList.add("show");
        }, 400);

        setTimeout(() => {
          formSuccess.style.transition =
            "opacity 0.5s ease, transform 0.5s ease";
          formSuccess.style.opacity = "0";
          formSuccess.style.transform = "translateY(-6px)";

          setTimeout(() => {
            formSuccess.classList.remove("show");
            formSuccess.style.opacity = "";
            formSuccess.style.transform = "";
            formSuccess.style.transition = "";

            formSubmitBtn.disabled = false;
            formSubmitBtn.classList.remove("sending");
            formSubmitBtn.querySelector(".form-submit-text").textContent =
              "Send Message";
            formSubmitBtn.style.display = "";
            formSubmitBtn.style.opacity = "0";
            formSubmitBtn.style.transform = "translateY(6px)";

            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                formSubmitBtn.style.opacity = "1";
                formSubmitBtn.style.transform = "translateY(0)";
                setTimeout(() => {
                  formSubmitBtn.style.transition = "";
                  formSubmitBtn.style.opacity = "";
                  formSubmitBtn.style.transform = "";
                }, 450);
              });
            });
          }, 500);
        }, 4000);
      } else {
        let errMsg = "Something went wrong. Please email me directly.";
        try {
          const json = await res.json();
          if (json.errors && json.errors.length > 0)
            errMsg = json.errors.map((e) => e.message).join(" ");
        } catch (_) {
          /* ignore */
        }
        formSubmitBtn.disabled = false;
        formSubmitBtn.classList.remove("sending");
        formSubmitBtn.querySelector(".form-submit-text").textContent =
          "Send Message";
        setError("cf-message", errMsg);
      }
    } catch (networkErr) {
      formSubmitBtn.disabled = false;
      formSubmitBtn.classList.remove("sending");
      formSubmitBtn.querySelector(".form-submit-text").textContent =
        "Send Message";
      setError(
        "cf-message",
        "Network error — please check your connection or email me directly.",
      );
    }
  });
}

/* ══════════════════════════════════════════
   HERO 3D CANVAS
   Paused via IntersectionObserver when hero is off-screen
══════════════════════════════════════════ */
const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");
let W,
  H,
  t = 0;
let mouseX = 0,
  mouseY = 0;
let heroVisible = true;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

if (!isTouchDevice()) {
  document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / W - 0.5) * 2;
    mouseY = (e.clientY / H - 0.5) * 2;
  });
}

/* Pause globe RAF when hero is not visible */
const heroObs = new IntersectionObserver(
  (entries) => {
    heroVisible = entries[0].isIntersecting;
  },
  { threshold: 0.01 },
);
heroObs.observe(document.getElementById("hero"));

function proj3D(x, y, z, rX, rY) {
  const cX = Math.cos(rX),
    sX = Math.sin(rX);
  const cY = Math.cos(rY),
    sY = Math.sin(rY);
  const y2 = y * cX - z * sX;
  const z2 = y * sX + z * cX;
  const x3 = x * cY + z2 * sY;
  const z3 = -x * sY + z2 * cY;
  const f = 480;
  const s = f / (f + z3);
  return { x: x3 * s, y: y2 * s, z: z3, s };
}

function drawGlobe(rX, rY, R, cx, cy, numParticles) {
  for (let r = 0; r < 6; r++) {
    const lat = (r / 5 - 0.5) * Math.PI;
    const cL = Math.cos(lat),
      sL = Math.sin(lat);
    ctx.beginPath();
    for (let p = 0; p <= 50; p++) {
      const lng = (p / 50) * Math.PI * 2;
      const pt = proj3D(
        R * cL * Math.cos(lng),
        R * sL,
        R * cL * Math.sin(lng),
        rX,
        rY,
      );
      p === 0
        ? ctx.moveTo(cx + pt.x, cy + pt.y)
        : ctx.lineTo(cx + pt.x, cy + pt.y);
    }
    ctx.strokeStyle = `rgba(74,144,217,${0.05 + 0.1 * (r / 6)})`;
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
  for (let m = 0; m < 14; m++) {
    const lng = (m / 14) * Math.PI * 2;
    ctx.beginPath();
    for (let p = 0; p <= 30; p++) {
      const lat = (p / 30 - 0.5) * Math.PI;
      const cL = Math.cos(lat),
        sL = Math.sin(lat);
      const pt = proj3D(
        R * cL * Math.cos(lng),
        R * sL,
        R * cL * Math.sin(lng),
        rX,
        rY,
      );
      p === 0
        ? ctx.moveTo(cx + pt.x, cy + pt.y)
        : ctx.lineTo(cx + pt.x, cy + pt.y);
    }
    ctx.strokeStyle = "rgba(74,144,217,0.04)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  for (let i = 0; i < numParticles; i++) {
    const a = i * 137.508 * (Math.PI / 180) + t * 0.04;
    const rad = 38 + i * 2.6;
    const pt = proj3D(
      rad * Math.cos(a) * 0.85,
      rad * Math.sin(a) * 0.5,
      Math.sin(i * 0.38 + t) * 42,
      rX,
      rY,
    );
    const alpha = Math.max(0, (pt.z + 220) / 420) * 0.48;
    ctx.beginPath();
    ctx.arc(cx + pt.x, cy + pt.y, pt.s * 1.4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(190,215,255,${alpha})`;
    ctx.fill();
  }
}

function drawHero() {
  if (!heroVisible || document.hidden) {
    t += 0; /* freeze time */
    requestAnimationFrame(drawHero);
    return;
  }
  ctx.clearRect(0, 0, W, H);
  const cx = W / 2,
    cy = H / 2;
  const mobile = W < 768;
  let rX, rY, R, particles;
  if (mobile) {
    rX = t * 0.15;
    rY = t * 0.3;
    R = Math.min(W, H) * 0.28;
    particles = 30;
  } else {
    rX = t * 0.14 + mouseY * 0.22;
    rY = t * 0.28 + mouseX * 0.38;
    R = 140;
    particles = 68;
  }
  drawGlobe(rX, rY, R, cx, cy, particles);
  t += 0.006;
  requestAnimationFrame(drawHero);
}
drawHero();

/* ══════════════════════════════════════════
   SUBTITLE LOOP
══════════════════════════════════════════ */
const subtitles = [
  "Building the web, one line at a time",
  "Solving real problems with clean code",
  "Full-stack · Flask · MySQL · JavaScript",
  "Open to work — let's build together",
];
let subIdx = 0;

function typeSubtitle(el, text, cb) {
  el.textContent = "";
  let i = 0;
  const iv = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(iv);
      setTimeout(cb, 2200);
    }
  }, 38);
}
function eraseSubtitle(el, cb) {
  const iv = setInterval(() => {
    el.textContent = el.textContent.slice(0, -1);
    if (el.textContent.length === 0) {
      clearInterval(iv);
      cb();
    }
  }, 22);
}
function startSubtitleLoop() {
  const el = document.getElementById("hero-sub");
  if (!el) return;
  setTimeout(() => {
    function cycle() {
      subIdx = (subIdx + 1) % subtitles.length;
      eraseSubtitle(el, () => typeSubtitle(el, subtitles[subIdx], cycle));
    }
    typeSubtitle(el, subtitles[0], cycle);
  }, 1800);
}

/* ══════════════════════════════════════════
   TEXT SCRAMBLE
══════════════════════════════════════════ */
const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
let scrambleStarted = false;

function scrambleText(el, finalText, duration) {
  const totalFrames = Math.round(duration / 16);
  let frame = 0;
  function step() {
    frame++;
    const progress = frame / totalFrames;
    const revealCount = Math.floor(progress * finalText.length);
    let display = "";
    for (let i = 0; i < finalText.length; i++) {
      if (finalText[i] === " ") {
        display += " ";
        continue;
      }
      display +=
        i < revealCount
          ? finalText[i]
          : CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    el.textContent = display;
    if (frame < totalFrames) requestAnimationFrame(step);
    else el.textContent = finalText;
  }
  requestAnimationFrame(step);
}

function startScramble() {
  if (scrambleStarted) return;
  scrambleStarted = true;
  document.querySelectorAll("[data-scramble]").forEach((el) => {
    const final = el.dataset.scramble;
    setTimeout(() => scrambleText(el, final, 1000), 300);
  });
}

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

  /* Silence aria-live after first two cycles */
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
   SCROLL REVEAL — shared observer
══════════════════════════════════════════ */
const revObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        revObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
);

document.querySelectorAll(".reveal-item").forEach((el) => revObs.observe(el));

/* Section title underline: triggered by reveal observer — no extra JS needed
   because .section-title::after transitions on .reveal-item.visible.
   But .section-title is a child of .reveal-item, so we need to handle it directly. */
const titleObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        titleObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 },
);
document
  .querySelectorAll(".section-title")
  .forEach((el) => titleObs.observe(el));

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
        /* Ease out cubic */
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

/* ══════════════════════════════════════════
   3D CARD TILT — desktop only, RAF throttled
══════════════════════════════════════════ */
if (!isTouchDevice()) {
  document.querySelectorAll(".project-card, .skill-card").forEach((card) => {
    let tiltFrame = null;
    card.addEventListener("mousemove", (e) => {
      if (tiltFrame) return;
      tiltFrame = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-5px)`;
        tiltFrame = null;
      });
    });
    card.addEventListener("mouseleave", () => {
      if (tiltFrame) {
        cancelAnimationFrame(tiltFrame);
        tiltFrame = null;
      }
      card.style.transform = "";
    });
  });
}

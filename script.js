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
      startScramble();
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
const isTouchDevice = () =>
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

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

if (!isTouchDevice()) {
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
        .catch(() => {
          fallbackCopy(EMAIL, onCopied);
        });
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
  try {
    document.execCommand("copy");
    cb();
  } catch (e) {
    console.warn("Copy failed:", e);
  }
  document.body.removeChild(ta);
}

/* ══════════════════════════════════════════
   CONTACT FORM — Formspree
══════════════════════════════════════════ */
const FORMSPREE_URL = "https://formspree.io/f/xnjydrlk";

const formSubmitBtn = document.getElementById("form-submit-btn");
const formSuccess = document.getElementById("form-success");

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

/* Live clear errors on input */
["cf-name", "cf-email", "cf-subject", "cf-message"].forEach((id) => {
  const el = getField(id);
  if (el) el.addEventListener("input", () => setError(id, ""));
});

if (formSubmitBtn) {
  formSubmitBtn.addEventListener("click", async () => {
    clearErrors();
    if (!validateForm()) return;

    /* Lock the button while sending */
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
        /* ── Success ── */
        formSubmitBtn.style.display = "none";
        formSuccess.classList.add("show");
        /* Clear all fields */
        ["cf-name", "cf-email", "cf-subject", "cf-message"].forEach((id) => {
          const el = getField(id);
          if (el) el.value = "";
        });
      } else {
        /* ── Formspree returned an error (e.g. spam, domain mismatch) ── */
        let errMsg = "Something went wrong. Please email me directly.";
        try {
          const json = await res.json();
          if (json.errors && json.errors.length > 0) {
            errMsg = json.errors.map((e) => e.message).join(" ");
          }
        } catch (_) {
          /* ignore parse error */
        }

        /* Unlock button and show error under message field */
        formSubmitBtn.classList.remove("sending");
        formSubmitBtn.querySelector(".form-submit-text").textContent =
          "Send Message";
        setError("cf-message", errMsg);
      }
    } catch (networkErr) {
      /* ── Network / fetch failure ── */
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
══════════════════════════════════════════ */
const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");
let W,
  H,
  t = 0;
let mouseX = 0,
  mouseY = 0;

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
  /* latitude rings */
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
  /* meridian lines */
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
  /* particles */
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
  /* Skip draw when tab is hidden — saves battery */
  if (document.hidden) {
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
  document.querySelectorAll("[data-scramble]").forEach((el) => {
    const final = el.dataset.scramble;
    setTimeout(() => scrambleText(el, final, 1000), 300);
  });
}

/* ══════════════════════════════════════════
   TERMINAL — with double-trigger guard
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

function runTerminal() {
  if (terminalRunning) return;
  terminalRunning = true;

  const body = document.getElementById("terminal-body");
  if (!body) {
    terminalRunning = false;
    return;
  }
  body.innerHTML = "";
  let lineIdx = 0,
    charIdx = 0,
    currentLineEl = null;

  function tick() {
    if (lineIdx >= terminalLines.length) {
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

const terminalObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const body = document.getElementById("terminal-body");
        if (body && body.innerHTML === "" && !terminalRunning) runTerminal();
      }
    });
  },
  { threshold: 0.3 },
);

const aboutSection = document.getElementById("about");
if (aboutSection) terminalObs.observe(aboutSection);

/* ══════════════════════════════════════════
   SCROLL REVEAL
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
  {
    threshold: 0.08,
    rootMargin: "0px 0px -20px 0px",
  },
);

document.querySelectorAll(".reveal-item").forEach((el) => revObs.observe(el));

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

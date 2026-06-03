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
   CURSOR — desktop only, hidden on touch
══════════════════════════════════════════ */
const isTouchDevice = () =>
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

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
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + "%";
}

/* ══════════════════════════════════════════
   NAV — visible on scroll + active section
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
   HAMBURGER MOBILE MENU
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
   HERO 3D CANVAS
   — Full animation on desktop
   — Animated globe on mobile (no mouse track)
══════════════════════════════════════════ */
const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");
let W,
  H,
  t = 0,
  mouseX = 0,
  mouseY = 0;

function resize() {
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
}
resize();
window.addEventListener("resize", resize);

document.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / W - 0.5) * 2;
  mouseY = (e.clientY / H - 0.5) * 2;
});

function proj3D(x, y, z, rX, rY) {
  const cX = Math.cos(rX),
    sX = Math.sin(rX),
    cY = Math.cos(rY),
    sY = Math.sin(rY);
  let y2 = y * cX - z * sX,
    z2 = y * sX + z * cX;
  let x3 = x * cY + z2 * sY,
    z3 = -x * sY + z2 * cY;
  const f = 480,
    s = f / (f + z3);
  return { x: x3 * s, y: y2 * s, z: z3, s };
}

function drawGlobe(rX, rY, R, cx, cy, particleCount) {
  // latitude rings
  for (let r = 0; r < 6; r++) {
    const lat = (r / 5 - 0.5) * Math.PI,
      cL = Math.cos(lat),
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
  // meridian lines
  for (let m = 0; m < 14; m++) {
    const lng = (m / 14) * Math.PI * 2;
    ctx.beginPath();
    for (let p = 0; p <= 30; p++) {
      const lat = (p / 30 - 0.5) * Math.PI,
        cL = Math.cos(lat),
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
  // particles
  for (let i = 0; i < particleCount; i++) {
    const a = i * 137.508 * (Math.PI / 180) + t * 0.04,
      rad = 38 + i * 2.6;
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
  ctx.clearRect(0, 0, W, H);
  const cx = W / 2,
    cy = H / 2;
  const mobile = isTouchDevice() || W < 768;

  if (mobile) {
    // globe still animates on mobile — no mouse parallax, fewer particles
    const rY = t * 0.28;
    const rX = t * 0.14;
    const R = Math.min(W, H) * 0.22; // responsive radius on mobile
    drawGlobe(rX, rY, R, cx, cy, 30);
  } else {
    const rY = t * 0.28 + mouseX * 0.38;
    const rX = t * 0.14 + mouseY * 0.22;
    drawGlobe(rX, rY, 140, cx, cy, 68);
  }

  t += 0.006;
  requestAnimationFrame(drawHero);
}
drawHero();

/* ══════════════════════════════════════════
   HERO SUBTITLE LOOP
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
   TERMINAL TYPING — loops
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

function runTerminal() {
  const body = document.getElementById("terminal-body");
  if (!body) return;
  body.innerHTML = "";
  let lineIdx = 0,
    charIdx = 0,
    currentLineEl = null;

  function tick() {
    if (lineIdx >= terminalLines.length) {
      setTimeout(runTerminal, 3000);
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
        if (body && body.innerHTML === "") runTerminal();
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
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
);
document.querySelectorAll(".sr").forEach((el) => revObs.observe(el));

/* ══════════════════════════════════════════
   SKILL BARS
══════════════════════════════════════════ */
const barObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const b = e.target.querySelector(".skill-bar");
        if (b) b.style.width = b.dataset.w + "%";
      }
    });
  },
  { threshold: 0.4 },
);
document.querySelectorAll(".skill-card").forEach((c) => barObs.observe(c));

/* ══════════════════════════════════════════
   3D CARD TILT — desktop only
══════════════════════════════════════════ */
document.querySelectorAll(".project-card, .skill-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    if (isTouchDevice()) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-5px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

/* ══════════════════════════════════════════
   HERO FADE IN
══════════════════════════════════════════ */
document.getElementById("hero").style.opacity = "0";
document.getElementById("hero").style.transition = "opacity .8s ease";
setTimeout(() => {
  document.getElementById("hero").style.opacity = "1";
}, 100);

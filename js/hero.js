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
    t += 0;
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

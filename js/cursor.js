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

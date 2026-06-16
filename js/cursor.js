/* ══════════════════════════════════════════
   CURSOR — desktop only
   Links/buttons/skill-cards: ring scales up (unchanged)
   Project cards: ring disappears, "View →" label
   follows the cursor instead — content-aware cursor
══════════════════════════════════════════ */
const cur = document.getElementById("cursor");
const ring = document.getElementById("cursor-ring");
const label = document.getElementById("cursor-label");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
let _cursorScrollTimer = null;
let overProjectCard = false;

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
    if (!overProjectCard) {
      cur.classList.remove("hidden");
      ring.classList.remove("hidden");
    }
    if (label) {
      label.style.left = mx + "px";
      label.style.top = my + "px";
    }
  });

  (function animRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";

    trailPos[0].x += (mx - trailPos[0].x) * 0.28;
    trailPos[0].y += (my - trailPos[0].y) * 0.28;
    for (let i = 1; i < TRAIL_COUNT; i++) {
      trailPos[i].x += (trailPos[i - 1].x - trailPos[i].x) * 0.32;
      trailPos[i].y += (trailPos[i - 1].y - trailPos[i].y) * 0.32;
    }
    trailDots.forEach((dot, i) => {
      const alpha = overProjectCard ? 0 : (1 - i / TRAIL_COUNT) * 0.35;
      const size = 4 - i * 0.5;
      dot.style.left = trailPos[i].x + "px";
      dot.style.top = trailPos[i].y + "px";
      dot.style.width = size + "px";
      dot.style.height = size + "px";
      dot.style.opacity = alpha;
    });

    requestAnimationFrame(animRing);
  })();

  /* Standard ring-scale hover for links, buttons, skill cards */
  document.querySelectorAll("a, button, .skill-card").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      if (overProjectCard) return;
      ring.style.width = "56px";
      ring.style.height = "56px";
      ring.style.borderColor = "rgba(74,144,217,0.9)";
    });
    el.addEventListener("mouseleave", () => {
      if (overProjectCard) return;
      ring.style.width = "36px";
      ring.style.height = "36px";
      ring.style.borderColor = "rgba(255,255,255,0.4)";
    });
  });

  /* Content-aware cursor: project cards swap the ring for a "View →" label */
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      overProjectCard = true;
      cur.classList.add("hidden");
      ring.classList.add("hidden");
      if (label) label.classList.add("visible");
    });
    card.addEventListener("mouseleave", () => {
      overProjectCard = false;
      cur.classList.remove("hidden");
      ring.classList.remove("hidden");
      if (label) label.classList.remove("visible");
    });
  });

  /* Hide cursor during scroll, restore after */
  window.addEventListener(
    "scroll",
    () => {
      if (!overProjectCard) {
        cur.classList.add("hidden");
        ring.classList.add("hidden");
      }
      clearTimeout(_cursorScrollTimer);
      _cursorScrollTimer = setTimeout(() => {
        if (!overProjectCard) {
          cur.classList.remove("hidden");
          ring.classList.remove("hidden");
        }
      }, 300);
    },
    { passive: true },
  );
}

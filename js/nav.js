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

    const label = target.querySelector(".section-label");
    if (label) {
      label.classList.remove("flash");
      void label.offsetWidth;
      label.classList.add("flash");
      setTimeout(() => label.classList.remove("flash"), 800);
    }
  });
});

/* ══════════════════════════════
   NAV + SMOOTH SCROLL
   Uses window.__lenis (set in utils.js)
   Falls back to native if not ready
══════════════════════════════ */
(function () {
  var nav = document.getElementById("main-nav");
  var burger = document.getElementById("nav-burger");
  var mobMenu = document.getElementById("mob-menu");
  var navAs = document.querySelectorAll(".nav-a");
  var SECS = ["work", "craft", "story", "signal"];

  /* ── Scroll to section ── */
  function goTo(id) {
    var target = typeof id === "string" ? document.getElementById(id) : id;
    if (!target) return;
    var offset =
      target.id === "hero" || target === document.getElementById("hero")
        ? 0
        : -72;

    /* Try Lenis first */
    if (window.__lenis) {
      window.__lenis.scrollTo(target, {
        offset: offset,
        duration: 1.1,
        easing: function (t) {
          return Math.min(1, 1.001 - Math.pow(2, -10 * t));
        },
      });
    } else {
      /* Fallback — poll until Lenis is ready (handles timing edge case) */
      var attempts = 0;
      var poll = setInterval(function () {
        attempts++;
        if (window.__lenis) {
          clearInterval(poll);
          window.__lenis.scrollTo(target, { offset: offset, duration: 1.1 });
        } else if (attempts > 20) {
          clearInterval(poll);
          var top =
            target.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top: top, behavior: "smooth" });
        }
      }, 80);
    }
  }

  /* ── All anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var hash = a.getAttribute("href");
      if (!hash || hash === "#") return;
      var id = hash.replace("#", "");
      var el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      closeMob();
      goTo(id);
    });
  });

  /* ── Active link state ── */
  function updateActive() {
    var scrollY = window.scrollY;
    var cur = "";
    SECS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && scrollY >= el.offsetTop - 130) cur = id;
    });
    navAs.forEach(function (a) {
      a.classList.toggle("on", a.dataset.target === cur);
    });
    if (nav) nav.classList.toggle("scrolled", scrollY > 60);
  }

  window.addEventListener("scroll", updateActive, { passive: true });
  updateActive();

  /* ── Burger / mobile menu ── */
  function closeMob() {
    if (!mobMenu) return;
    if (!mobMenu.classList.contains("open")) return;
    mobMenu.classList.remove("open");
    mobMenu.setAttribute("aria-hidden", "true");
    if (burger) {
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
    document.body.style.overflow = "";
  }

  if (burger) {
    burger.addEventListener("click", function () {
      var isOpen = burger.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(isOpen));
      if (mobMenu) {
        mobMenu.classList.toggle("open", isOpen);
        mobMenu.setAttribute("aria-hidden", String(!isOpen));
      }
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMob();
  });

  /* Expose goTo globally for hero buttons and other uses */
  window.__goTo = goTo;
})();

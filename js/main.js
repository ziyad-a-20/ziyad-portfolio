/* ══════════════════════════════
   MAIN — orchestration only
   Lenis is in utils.js
   Resume modal lives here
══════════════════════════════ */
(function () {
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━
     RESUME MODAL
  ━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  var RESUME_URL = "assets/resume.pdf";
  var modal = document.getElementById("resume-modal");
  var modalBody = document.getElementById("resume-body");
  var closeBtn = document.getElementById("resume-close");
  var built = false;
  var lastFocused = null;

  function buildContent() {
    if (built || !modalBody) return;
    built = true;
    var mobile = isTouchDevice() || window.innerWidth <= 768;
    if (mobile) {
      modalBody.innerHTML =
        '<div class="r-fallback">' +
        "<p>Tap below to open the resume in your browser's PDF viewer.</p>" +
        '<a href="' +
        RESUME_URL +
        '" target="_blank" rel="noopener" class="r-fallback-open">Open Resume ↗</a>' +
        "</div>";
    } else {
      modalBody.innerHTML =
        '<object data="' +
        RESUME_URL +
        '" type="application/pdf" style="width:100%;height:100%;border:none;">' +
        '<div class="r-fallback">' +
        "<p>PDF preview unavailable in this browser.</p>" +
        '<a href="' +
        RESUME_URL +
        '" target="_blank" rel="noopener" class="r-fallback-open">Open Resume ↗</a>' +
        "</div>" +
        "</object>";
    }
  }

  function openModal() {
    if (!modal) return;
    lastFocused = document.activeElement;
    buildContent();
    /* Close mobile menu first */
    var mob = document.getElementById("mob-menu");
    var burg = document.getElementById("nav-burger");
    if (mob && mob.classList.contains("open")) {
      mob.classList.remove("open");
      mob.setAttribute("aria-hidden", "true");
      if (burg) {
        burg.classList.remove("open");
        burg.setAttribute("aria-expanded", "false");
      }
      document.body.style.overflow = "";
    }
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (closeBtn)
      setTimeout(function () {
        closeBtn.focus();
      }, 60);
    document.addEventListener("keydown", onKeydown);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  function onKeydown(e) {
    if (e.key === "Escape") closeModal();
  }

  /* Wire all resume triggers */
  ["nav-resume-btn", "mob-resume-btn", "sig-resume-btn"].forEach(function (id) {
    var btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", openModal);
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━
     GLOBAL SCROLL REVEAL
  ━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  var revObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("reveal");
          revObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
  );

  document.querySelectorAll(".will-reveal").forEach(function (el) {
    revObs.observe(el);
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━
     FAILSAFE — 7s
  ━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  setTimeout(function () {
    var site = document.getElementById("site");
    var tun = document.getElementById("tunnel");
    var nav = document.getElementById("main-nav");
    if (site && !site.classList.contains("show")) {
      if (tun) tun.style.display = "none";
      site.classList.add("show");
      if (nav) nav.classList.add("ready");
      if (window._heroInit) window._heroInit();
    }
  }, 7000);
})();

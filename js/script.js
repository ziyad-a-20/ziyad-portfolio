document.addEventListener("DOMContentLoaded", () => {
  /* ============ PREFERS-REDUCED-MOTION ============ */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ============ DARK MODE ============ */
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  function isDarkNow() {
    return root.getAttribute("data-theme") === "dark";
  }

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    root.setAttribute("data-theme", "dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nowDark = !isDarkNow();
      if (nowDark) {
        root.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      }
      document.dispatchEvent(
        new CustomEvent("themechange", { detail: { dark: nowDark } }),
      );
    });
  }

  /* ============ VISUALS: start immediately, independent of the loader ============ */
  initShader();
  initThree();

  /* ============ LOADER ============ */
  const loader = document.getElementById("loader");
  const percentageText = document.getElementById("loader-percentage");
  const statusText = document.getElementById("loader-status");
  const loaderName = document.querySelector("#loader-name span");

  const hasVisited = sessionStorage.getItem("hasVisited");
  const skipLoaderAnim = prefersReducedMotion || hasVisited;

  const statuses = [
    "INITIALIZING PORTFOLIO",
    "LOADING CORE",
    "PREPARING EXPERIENCE",
    "RENDERING INTERFACE",
  ];

  function finishLoader() {
    if (loader) loader.style.display = "none";
    document.body.classList.remove("loading");
  }

  if (skipLoaderAnim) {
    if (percentageText) percentageText.innerText = "100";
    if (statusText) statusText.innerText = statuses[statuses.length - 1];
    finishLoader();
  } else {
    let loadData = { val: 0 };
    const timeline = gsap.timeline({ onComplete: finishLoader });

    timeline.to(loadData, {
      val: 100,
      duration: 3,
      ease: "power2.inOut",
      onUpdate: () => {
        const percentage = Math.floor(loadData.val);
        percentageText.innerText = percentage.toString().padStart(3, "0");
        const statusIndex = Math.floor((percentage / 100) * statuses.length);
        if (statusIndex < statuses.length)
          statusText.innerText = statuses[statusIndex];
      },
    });

    timeline.to(
      loaderName,
      { scale: 1.5, opacity: 0, duration: 0.8, ease: "expo.inOut" },
      "-=0.2",
    );

    timeline.to(
      loader,
      {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.2,
        ease: "expo.inOut",
      },
      "-=0.4",
    );
  }
  sessionStorage.setItem("hasVisited", "true");

  /* ============ CUSTOM CURSOR ============ */
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursor-follower");
  let followerHovering = false;

  function renderFollowerTransform(x, y) {
    const base = `translate(${x - 20}px, ${y - 20}px)`;
    follower.style.transform = followerHovering ? `${base} scale(1.6)` : base;
  }

  let lastMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  document.addEventListener("mousemove", (e) => {
    lastMouse = { x: e.clientX, y: e.clientY };
    cursor.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
    renderFollowerTransform(e.clientX, e.clientY);
  });

  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      followerHovering = true;
      renderFollowerTransform(lastMouse.x, lastMouse.y);
    });
    el.addEventListener("mouseleave", () => {
      followerHovering = false;
      renderFollowerTransform(lastMouse.x, lastMouse.y);
    });
  });

  /* ============ NAV SCROLL STATE ============ */
  const siteNav = document.getElementById("site-nav");
  function updateNavScrollState() {
    if (!siteNav) return;
    siteNav.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", updateNavScrollState, { passive: true });
  updateNavScrollState();

  /* ============ SCROLL PROGRESS BAR (desktop/tablet only, hidden on mobile via CSS) ============ */
  const scrollProgress = document.getElementById("scroll-progress");
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${pct}%`;
  }
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
  updateScrollProgress();

  /* ============ BACK TO TOP ============ */
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  /* ============ SCROLL REVEAL ============ */
  if (prefersReducedMotion) {
    document
      .querySelectorAll(".stagger-reveal")
      .forEach((el) => el.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    document
      .querySelectorAll(".stagger-reveal")
      .forEach((el) => observer.observe(el));
  }

  /* ============ LOCAL TIME — ASIA/KOLKATA ============ */
  function updateTime() {
    const timeEl = document.getElementById("local-time");
    if (!timeEl) return;
    const timeString = new Date().toLocaleTimeString("en-IN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Kolkata",
    });
    timeEl.textContent = `LOCAL TIME (IST) / ${timeString}`;
  }
  setInterval(updateTime, 1000);
  updateTime();

  /* ============ MOBILE NAV — SMOOTH SCROLL ============ */
  const mnavItems = document.querySelectorAll(".mnav-item");
  const sections = [...mnavItems]
    .map((item) => document.getElementById(item.dataset.section))
    .filter(Boolean);

  mnavItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(item.dataset.section);
      if (target)
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
    });
  });

  /* ============ MOBILE NAV — DETERMINISTIC SCROLLSPY ============ */
  let ticking = false;

  function updateActiveNav() {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    let currentId = sections[0] ? sections[0].id : null;

    for (const sec of sections) {
      if (sec.offsetTop <= scrollPos) {
        currentId = sec.id;
      } else {
        break;
      }
    }

    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
    if (nearBottom && sections.length) {
      currentId = sections[sections.length - 1].id;
    }

    mnavItems.forEach((item) => {
      const isActive = item.dataset.section === currentId;
      item.classList.toggle("active", isActive);
      if (isActive) {
        item.setAttribute("aria-current", "true");
      } else {
        item.removeAttribute("aria-current");
      }
    });
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateActiveNav);
        ticking = true;
      }
    },
    { passive: true },
  );

  window.addEventListener("resize", updateActiveNav);
  updateActiveNav();

  /* ============ CASE STUDY MODAL (short form) ============ */
  const caseStudies = {
    redline: {
      eyebrow: "CASE STUDY / 04",
      title: "RedLine — Blood Bank & Emergency Donor Network",
      summary:
        "A multi-role Flask + MySQL platform (Admin, Donor, Hospital, Recipient) built around a 3NF schema modeling the full donation lifecycle.",
      points: [
        "Donor matching engine checks blood compatibility, cooldown periods, and availability using indexed queries rather than full-table scans.",
        "APScheduler runs background jobs for inventory expiry and donor eligibility, keeping data current without manual admin work.",
        "Next up: SMS/email alerts for critical requests and geolocation-based matching.",
      ],
    },
    library: {
      eyebrow: "CASE STUDY / 01",
      title: "Library Management System",
      summary:
        "Full-stack Flask + MySQL app with role-based access, replacing manual borrow/return tracking with a live system.",
      points: [
        "Normalized schema separates active loans from return history for cleaner overdue and fine-calculation logic.",
        "Integrates Gmail SMTP for reminders/verification, ReportLab for PDF reports, and a MySQL connection pool for efficient queries.",
        "Next up: refactor into Flask Blueprints and add automated testing.",
      ],
    },
    himalaya: {
      eyebrow: "CASE STUDY / 03",
      title: "Himalaya Lip Balm Showcase",
      summary:
        "A modular vanilla-JS PWA product page — no backend, fully client-side cart, wishlist, and animation logic.",
      points: [
        "ES6 modules keep navigation, cart, wishlist, and animation code independently maintainable.",
        "Service Worker enables offline support and faster repeat visits; animations respect prefers-reduced-motion.",
        "Next up: connect a real backend and payment flow to make it a working store.",
      ],
    },
    tokyo: {
      eyebrow: "CASE STUDY / 02",
      title: "Tokyo Revengers Fan Portal",
      summary:
        "Flask + MySQL fan portal with a normalized schema modeling many-to-many relationships between characters, gangs, and episodes.",
      points: [
        "Junction tables (character_gangs, episode_characters) keep related data modular instead of duplicated.",
        "SQL joins and GROUP_CONCAT pull connected data (relationships, quotes, appearances) in minimal queries.",
        "Next up: add authentication so users can save favorites and bookmarks.",
      ],
    },
  };

  const caseModal = document.getElementById("case-modal");
  const caseModalBackdrop = document.getElementById("case-modal-backdrop");
  const caseModalClose = document.getElementById("case-modal-close");
  const caseModalTitle = document.getElementById("case-modal-title");
  const caseModalEyebrow = document.getElementById("case-modal-eyebrow");
  const caseModalBody = document.getElementById("case-modal-body");
  let lastFocusedEl = null;

  function renderCaseStudy(key) {
    const data = caseStudies[key];
    if (!data) return;
    caseModalEyebrow.textContent = data.eyebrow;
    caseModalTitle.textContent = data.title;
    caseModalBody.innerHTML = `
      <p class="case-summary">${data.summary}</p>
      <ul class="case-points">
        ${data.points.map((p) => `<li>${p}</li>`).join("")}
      </ul>
    `;
  }

  function openCaseModal(key) {
    lastFocusedEl = document.activeElement;
    renderCaseStudy(key);
    caseModal.classList.add("open");
    caseModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    caseModalClose.focus();
  }

  function closeCaseModal() {
    caseModal.classList.remove("open");
    caseModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  document.querySelectorAll(".case-study-btn").forEach((btn) => {
    btn.addEventListener("click", () => openCaseModal(btn.dataset.project));
  });

  if (caseModalClose) caseModalClose.addEventListener("click", closeCaseModal);
  if (caseModalBackdrop)
    caseModalBackdrop.addEventListener("click", closeCaseModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && caseModal.classList.contains("open"))
      closeCaseModal();
  });

  /* ============ WEBGL SHADER ============ */
  function initShader() {
    const canvas = document.getElementById("shader-canvas");
    const wrap = document.getElementById("shader-wrap");
    if (!canvas || !wrap) return;
    if (prefersReducedMotion) {
      wrap.style.display = "none";
      return;
    }

    let isVisible = true;
    let rafId = null;

    function syncSize() {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    if (typeof ResizeObserver !== "undefined")
      new ResizeObserver(syncSize).observe(canvas);
    syncSize();
    window.addEventListener("resize", syncSize);

    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      return;
    }

    const vs = `attribute vec2 a_position;
    varying vec2 v_texCoord;
    void main() {
      v_texCoord = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }`;

    const fs = `precision highp float;
    varying vec2 v_texCoord;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      vec2 uv = v_texCoord;
      vec2 mouse = u_mouse / u_resolution;
      float t = u_time * 0.2;
      vec2 p = uv * 3.0;

      for(int i=1; i<4; i++) {
        float fi = float(i);
        p.x += 0.3 / fi * sin(fi * 3.0 * p.y + t + mouse.x * 2.0);
        p.y += 0.3 / fi * cos(fi * 3.0 * p.x + t + mouse.y * 2.0);
      }

      vec3 color1 = vec3(0.976, 0.973, 0.965);
      vec3 color2 = vec3(0.886, 0.886, 0.886);
      vec3 color3 = vec3(0.941, 0.945, 0.953);

      float mask = 0.5 + 0.5 * sin(p.x + p.y);
      vec3 finalColor = mix(color1, color2, mask);
      finalColor = mix(finalColor, color3, 0.2 * sin(u_time * 0.5));

      float n = (noise(uv * u_time) - 0.5) * 0.02;
      finalColor += n;

      gl_FragColor = vec4(finalColor, 1.0);
    }`;

    function compileShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    window.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    });

    document.addEventListener("visibilitychange", () => {
      isVisible = !document.hidden;
      if (isVisible && rafId === null) render(performance.now());
    });

    function render(t) {
      if (!isVisible) {
        rafId = null;
        return;
      }
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    }
    render(0);
  }

  /* ============ THREE.JS — ICOSAHEDRON + PARTICLES ============ */
  function initThree() {
    const container = document.getElementById("threejs-container");
    if (!container) return;
    if (typeof THREE === "undefined") {
      console.warn("Three.js did not load; hero 3D visual skipped.");
      return;
    }
    if (prefersReducedMotion) {
      container.style.display = "none";
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    function themeColors(dark) {
      return {
        sphereColor: dark ? 0x5c8dff : 0x1a1a1a,
        sphereOpacity: dark ? 0.32 : 0.18,
        particleColor: dark ? 0x6ea0ff : 0x0066ff,
        ambientIntensity: dark ? 0.9 : 0.6,
        pointIntensity: dark ? 2.4 : 2,
      };
    }

    const startDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    const c0 = themeColors(startDark);

    const geometry = new THREE.IcosahedronGeometry(1.5, 6);
    const material = new THREE.MeshStandardMaterial({
      color: c0.sphereColor,
      wireframe: true,
      transparent: true,
      opacity: c0.sphereOpacity,
      metalness: 0.9,
      roughness: 0.1,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++)
      posArray[i] = (Math.random() - 0.5) * 10;
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3),
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: c0.particleColor,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial,
    );
    scene.add(particlesMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, c0.ambientIntensity);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x0066ff, c0.pointIntensity);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    camera.position.z = 5;

    let mouseX = 0,
      mouseY = 0;
    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX / window.innerWidth - 0.5;
      mouseY = event.clientY / window.innerHeight - 0.5;
    });

    window.addEventListener("resize", () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    document.addEventListener("themechange", (e) => {
      const c = themeColors(e.detail.dark);
      material.color.setHex(c.sphereColor);
      material.opacity = c.sphereOpacity;
      particlesMaterial.color.setHex(c.particleColor);
      ambientLight.intensity = c.ambientIntensity;
      pointLight.intensity = c.pointIntensity;
    });

    let heroVisible = true;
    let tabVisible = !document.hidden;
    let animId = null;

    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          heroVisible = entry.isIntersecting;
          if (heroVisible && tabVisible && animId === null) animate();
        });
      },
      { threshold: 0 },
    );
    heroObserver.observe(container);

    document.addEventListener("visibilitychange", () => {
      tabVisible = !document.hidden;
      if (heroVisible && tabVisible && animId === null) animate();
    });

    function animate() {
      if (!heroVisible || !tabVisible) {
        animId = null;
        return;
      }
      animId = requestAnimationFrame(animate);
      sphere.rotation.y += 0.005;
      sphere.rotation.x += 0.002;
      sphere.position.x += (mouseX * 0.5 - sphere.position.x) * 0.05;
      sphere.position.y += (-mouseY * 0.5 - sphere.position.y) * 0.05;
      particlesMesh.rotation.y += 0.001;
      particlesMesh.position.x +=
        (mouseX * 0.2 - particlesMesh.position.x) * 0.05;
      renderer.render(scene, camera);
    }
    animate();
  }
});
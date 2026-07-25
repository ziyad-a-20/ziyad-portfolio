import { createFocusTrap } from "./focus-trap.js";

const DESKTOP_BREAKPOINT = 900;

function isDesktopViewport() {
  return window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`).matches;
}

export function initCommandPalette({
  onOpenResume,
  onToggleTheme,
  homeUrl = "./",
  resumePath = "assets/resume.pdf",
} = {}) {
  const palette = document.getElementById("command-palette");
  const backdrop = document.getElementById("command-palette-backdrop");
  const input = document.getElementById("command-palette-input");
  const list = document.getElementById("command-palette-list");
  const trigger = document.getElementById("palette-trigger");
  if (!palette || !input || !list) return;

  const trap = createFocusTrap(palette);
  let activeIndex = 0;
  let filtered = [];

  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (target) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
      return;
    }
    window.location.href = `${homeUrl}#${id}`;
  }

  function triggerDownload(path) {
    const a = document.createElement("a");
    a.href = path;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fails silently without clipboard permission; no UI regression.
    }
  }

  const commands = [
    {
      id: "nav-home",
      label: "Go to Home",
      icon: "home",
      hint: "Section",
      action: () => scrollToSection("home"),
    },
    {
      id: "nav-about",
      label: "Go to About",
      icon: "person",
      hint: "Section",
      action: () => scrollToSection("about"),
    },
    {
      id: "nav-stack",
      label: "Go to Stack",
      icon: "layers",
      hint: "Section",
      action: () => scrollToSection("stack"),
    },
    {
      id: "nav-work",
      label: "Go to Work",
      icon: "work",
      hint: "Section",
      action: () => scrollToSection("work"),
    },
    {
      id: "nav-contact",
      label: "Go to Contact",
      icon: "mail",
      hint: "Section",
      action: () => scrollToSection("contact"),
    },
    {
      id: "toggle-theme",
      label: "Toggle Light / Dark Mode",
      icon: "contrast",
      hint: "Action",
      action: () => onToggleTheme && onToggleTheme(),
    },
    {
      id: "view-resume",
      label: "View Resume",
      icon: "description",
      hint: "Action",
      action: () => onOpenResume && onOpenResume(),
    },
    {
      id: "download-resume",
      label: "Download Resume",
      icon: "download",
      hint: "Action",
      action: () => triggerDownload(resumePath),
    },
    {
      id: "copy-email",
      label: "Copy Email Address",
      icon: "content_copy",
      hint: "ziyad-a-tech@gmail.com",
      action: () => copyToClipboard("ziyad-a-tech@gmail.com"),
    },
    {
      id: "open-github",
      label: "Open GitHub Profile",
      icon: "code",
      hint: "External",
      action: () => window.open("https://github.com/ziyad-a-20", "_blank"),
    },
    {
      id: "open-linkedin",
      label: "Open LinkedIn Profile",
      icon: "badge",
      hint: "External",
      action: () =>
        window.open("https://www.linkedin.com/in/ziyad-a-tech/", "_blank"),
    },
    {
      id: "view-library",
      label: "View Project — Library Management System",
      icon: "menu_book",
      hint: "Project",
      action: () => (window.location.href = `${homeUrl}projects/library.html`),
    },
    {
      id: "view-tokyo",
      label: "View Project — Tokyo Revengers Fan Portal",
      icon: "movie",
      hint: "Project",
      action: () => (window.location.href = `${homeUrl}projects/tokyo.html`),
    },
    {
      id: "view-himalaya",
      label: "View Project — Himalaya Lip Balm Showcase",
      icon: "storefront",
      hint: "Project",
      action: () => (window.location.href = `${homeUrl}projects/himalaya.html`),
    },
    {
      id: "view-redline",
      label: "View Project — RedLine Donor Network",
      icon: "bloodtype",
      hint: "Project",
      action: () => (window.location.href = `${homeUrl}projects/redline.html`),
    },
  ];

  // Full rebuild — only called when the list's CONTENT actually changes
  // (opening the palette, typing a filter). Never called from a hover
  // handler, which is what caused the original click bug: rebuilding
  // the DOM mid-hover could swap out the node the user was about to
  // click, breaking the browser's mousedown→mouseup→click contract.
  function renderList() {
    list.replaceChildren();

    if (!filtered.length) {
      const empty = document.createElement("li");
      empty.className = "command-palette-empty";
      empty.textContent = "No matching commands";
      list.append(empty);
      return;
    }

    filtered.forEach((cmd, i) => {
      const item = document.createElement("li");
      item.className = `command-palette-item${i === activeIndex ? " active" : ""}`;
      item.setAttribute("role", "option");
      item.id = `cmd-${cmd.id}`;
      item.dataset.index = String(i);

      const icon = document.createElement("span");
      icon.className = "material-symbols-outlined";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = cmd.icon;

      const label = document.createElement("span");
      label.className = "command-palette-item-label";
      label.textContent = cmd.label;

      const hint = document.createElement("span");
      hint.className = "command-palette-item-hint";
      hint.textContent = cmd.hint;

      item.append(icon, label, hint);
      list.append(item);
    });

    const activeEl = list.querySelector(".command-palette-item.active");
    if (activeEl) activeEl.scrollIntoView({ block: "nearest" });
  }

  // Cheap update — just moves the .active class between existing
  // nodes. No DOM teardown, so it's safe to call from mouseover/hover
  // without risking the click-breaking bug above.
  function setActiveIndex(idx) {
    if (idx === activeIndex || idx < 0 || idx >= filtered.length) return;
    const prevEl = list.querySelector(".command-palette-item.active");
    if (prevEl) prevEl.classList.remove("active");
    activeIndex = idx;
    const nextEl = list.querySelector(
      `.command-palette-item[data-index="${idx}"]`,
    );
    if (nextEl) nextEl.classList.add("active");
  }

  function filterCommands(query) {
    const q = query.trim().toLowerCase();
    filtered = !q
      ? commands
      : commands.filter((c) => c.label.toLowerCase().includes(q));
    activeIndex = 0;
    renderList();
  }

  function runCommandAt(idx) {
    const cmd = filtered[idx];
    if (!cmd) return;
    close();
    cmd.action();
  }

  function runActive() {
    runCommandAt(activeIndex);
  }

  // ============ EVENT DELEGATION ============
  // One listener each on the (never-destroyed) <ul>, instead of a
  // listener per <li> that gets rebuilt. This is the actual fix: it's
  // impossible for a hover-triggered rebuild to orphan a click handler
  // when the handler lives on the stable parent, not the child nodes.

  list.addEventListener("mouseover", (e) => {
    const item = e.target.closest(".command-palette-item");
    if (!item || !list.contains(item)) return;
    const idx = Number(item.dataset.index);
    if (!Number.isNaN(idx)) setActiveIndex(idx);
  });

  list.addEventListener("mousedown", (e) => {
    // Keep focus on the text input rather than shifting it to the
    // list item; doesn't affect whether the click event itself fires.
    const item = e.target.closest(".command-palette-item");
    if (item) e.preventDefault();
  });

  list.addEventListener("click", (e) => {
    const item = e.target.closest(".command-palette-item");
    if (!item || !list.contains(item)) return;
    const idx = Number(item.dataset.index);
    if (!Number.isNaN(idx)) runCommandAt(idx);
  });

  function open() {
    if (!isDesktopViewport()) return;
    palette.classList.add("open");
    palette.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    input.value = "";
    filterCommands("");
    trap.activate(input);
  }

  function close() {
    palette.classList.remove("open");
    palette.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    trap.deactivate();
  }

  input.addEventListener("input", () => filterCommands(input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(Math.min(activeIndex + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(Math.max(activeIndex - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runActive();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!isDesktopViewport()) return;

    const isMac = navigator.platform.toUpperCase().includes("MAC");
    const modifierPressed = isMac ? e.metaKey : e.ctrlKey;
    if (modifierPressed && e.key.toLowerCase() === "k") {
      e.preventDefault();
      palette.classList.contains("open") ? close() : open();
    } else if (e.key === "Escape" && palette.classList.contains("open")) {
      close();
    }
  });

  window.addEventListener("resize", () => {
    if (!isDesktopViewport() && palette.classList.contains("open")) {
      close();
    }
  });

  if (trigger) trigger.addEventListener("click", open);
  if (backdrop) backdrop.addEventListener("click", close);

  filterCommands("");
}

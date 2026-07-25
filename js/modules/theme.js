export function initTheme() {
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  function isDarkNow() {
    return root.getAttribute("data-theme") === "dark";
  }

  function syncToggleState() {
    if (!themeToggle) return;
    themeToggle.setAttribute("aria-pressed", String(isDarkNow()));
  }

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    root.setAttribute("data-theme", "dark");
  }
  syncToggleState();

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
      syncToggleState();
      document.dispatchEvent(
        new CustomEvent("themechange", { detail: { dark: nowDark } }),
      );
    });
  }

  return { isDarkNow, toggle: () => themeToggle && themeToggle.click() };
}

// The theme itself is now decided and applied before this module ever
// loads: a small synchronous inline script in each page's <head> (see
// index.html / project pages / 404.html) sets data-theme on <html> as
// the very first thing that happens, before the stylesheets even
// finish loading. That removes the flash-of-wrong-theme that used to
// happen here, since this module is a deferred ES module and previously
// ran (and decided light vs dark) only after first paint.
//
// initTheme() no longer decides the theme — it only wires up the
// toggle button to match whatever the inline script already applied.
export function initTheme() {
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");

  function isDarkNow() {
    return root.getAttribute("data-theme") === "dark";
  }

  function syncToggleState() {
    if (!themeToggle) return;
    themeToggle.setAttribute("aria-pressed", String(isDarkNow()));
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

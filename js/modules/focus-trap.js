// Shared focus-trap utility used by every modal/overlay (case study,
// resume preview, command palette). Fixes the WCAG 2.4.3 gap where Tab
// could previously escape into background content while a modal was open.

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function createFocusTrap(container) {
  let lastFocused = null;

  function getFocusable() {
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
      (el) => el.offsetParent !== null,
    );
  }

  function handleKeydown(e) {
    if (e.key !== "Tab") return;
    const focusable = getFocusable();
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return {
    activate(initialFocusEl) {
      lastFocused = document.activeElement;
      container.addEventListener("keydown", handleKeydown);
      const target = initialFocusEl || getFocusable()[0];
      if (target) target.focus();
    },
    deactivate() {
      container.removeEventListener("keydown", handleKeydown);
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    },
  };
}

import { initShared } from "./modules/init-shared.js";

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (!document.getElementById("command-palette")) {
  console.warn(
    "[project-page] #command-palette element missing from this page's HTML.",
  );
}
if (!document.getElementById("palette-trigger")) {
  console.warn(
    "[project-page] #palette-trigger button missing from this page's HTML.",
  );
}

initShared({ basePath: "../", prefersReducedMotion });

document.body.classList.remove("loading");

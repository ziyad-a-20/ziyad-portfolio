import { initShared } from "./modules/init-shared.js";
import { initLoader } from "./modules/loader.js";
import { initThree } from "./modules/three-scene.js";
import { initContactForm } from "./modules/contact-form.js";

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

initShared({ basePath: "./", prefersReducedMotion });

// Visuals start immediately, independent of the loader.
initThree(prefersReducedMotion);

initLoader(prefersReducedMotion);
initContactForm();

import { initTheme } from "./theme.js";
import { initCursor } from "./cursor.js";
import { initNavScroll } from "./nav-scroll.js";
import { initScrollReveal } from "./scroll-reveal.js";
import { initClock } from "./clock.js";
import { initResumeModal } from "./resume-modal.js";
import { initCommandPalette } from "./command-palette.js";
import { initShader } from "./shader-bg.js";
import { initPageTransitions } from "./page-transitions.js";
import { initSmoothScroll } from "./smooth-scroll.js";

// Initialization shared by every page on the site (the home page and all
// four project case studies). Only main.js layers extra setup on top of
// this — the Three.js hero scene, the loading screen, and the contact
// form — since those only exist on the home page.
//
// basePath lets the same wiring work from both index.html ("./") and
// projects/*.html ("../"), since resume/nav/command-palette links need
// different relative paths depending on how deep the page is nested.
export function initShared({ basePath = "./", prefersReducedMotion } = {}) {
  initPageTransitions(prefersReducedMotion);

  const lenis = initSmoothScroll(prefersReducedMotion);

  const themeApi = initTheme();

  initShader(prefersReducedMotion);
  initCursor();
  initNavScroll(prefersReducedMotion, lenis);
  initScrollReveal(prefersReducedMotion);
  initClock();

  const resumePath = `${basePath}assets/resume.pdf`;
  const resumeModal = initResumeModal(resumePath);

  initCommandPalette({
    onOpenResume: () => resumeModal.open(),
    onToggleTheme: () => themeApi.toggle(),
    homeUrl: basePath,
    resumePath,
    lenis,
  });

  return { themeApi, resumeModal, lenis };
}

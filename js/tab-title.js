/* ══════════════════════════════════════════
   TAB TITLE SWITCH — re-engagement on blur
══════════════════════════════════════════ */
const ORIGINAL_TITLE = document.title;
const AWAY_TITLE = "<- Come back!";

document.addEventListener("visibilitychange", () => {
  document.title = document.hidden ? AWAY_TITLE : ORIGINAL_TITLE;
});

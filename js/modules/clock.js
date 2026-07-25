export function initClock() {
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
}

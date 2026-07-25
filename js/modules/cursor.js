export function initCursor() {
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursor-follower");
  if (!cursor || !follower) return;

  let followerHovering = false;
  let lastMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  function renderFollowerTransform(x, y) {
    const base = `translate(${x - 20}px, ${y - 20}px)`;
    follower.style.transform = followerHovering ? `${base} scale(1.6)` : base;
  }

  document.addEventListener("mousemove", (e) => {
    lastMouse = { x: e.clientX, y: e.clientY };
    cursor.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
    renderFollowerTransform(e.clientX, e.clientY);
  });

  // Event delegation instead of querySelectorAll("a, button").forEach(...).
  // The old approach only wired up hover listeners on elements that existed
  // at initCursor() time — anything rendered later (command palette items,
  // future dynamic content) silently never got the hover effect. mouseover/
  // mouseout bubble (mouseenter/mouseleave don't), so listening on document
  // and using closest() covers every current AND future a/button with zero
  // extra wiring, and requires no re-init after a DOM update.
  document.addEventListener("mouseover", (e) => {
    const target = e.target.closest("a, button");
    if (!target) return;
    // Ignore moves between a parent and its own child (e.g. an icon
    // inside a button) — only fire when genuinely entering a new target.
    if (e.relatedTarget && target.contains(e.relatedTarget)) return;
    followerHovering = true;
    renderFollowerTransform(lastMouse.x, lastMouse.y);
  });

  document.addEventListener("mouseout", (e) => {
    const target = e.target.closest("a, button");
    if (!target) return;
    if (e.relatedTarget && target.contains(e.relatedTarget)) return;
    followerHovering = false;
    renderFollowerTransform(lastMouse.x, lastMouse.y);
  });
}

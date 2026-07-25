export function initLoader(prefersReducedMotion) {
  const loader = document.getElementById("loader");
  const percentageText = document.getElementById("loader-percentage");
  const statusText = document.getElementById("loader-status");
  const loaderName = document.querySelector("#loader-name span");

  const hasVisited = sessionStorage.getItem("hasVisited");
  const skipLoaderAnim = prefersReducedMotion || hasVisited;

  const statuses = [
    "INITIALIZING PORTFOLIO",
    "LOADING CORE",
    "PREPARING EXPERIENCE",
    "RENDERING INTERFACE",
  ];

  function finishLoader() {
    if (loader) loader.style.display = "none";
    document.body.classList.remove("loading");
  }

  if (skipLoaderAnim) {
    if (percentageText) percentageText.innerText = "100";
    if (statusText) statusText.innerText = statuses[statuses.length - 1];
    finishLoader();
  } else {
    const loadData = { val: 0 };
    const timeline = gsap.timeline({ onComplete: finishLoader });

    timeline.to(loadData, {
      val: 100,
      duration: 3,
      ease: "power2.inOut",
      onUpdate: () => {
        const percentage = Math.floor(loadData.val);
        percentageText.innerText = percentage.toString().padStart(3, "0");
        const statusIndex = Math.floor((percentage / 100) * statuses.length);
        if (statusIndex < statuses.length)
          statusText.innerText = statuses[statusIndex];
      },
    });

    timeline.to(
      loaderName,
      { scale: 1.5, opacity: 0, duration: 0.8, ease: "expo.inOut" },
      "-=0.2",
    );

    timeline.to(
      loader,
      { clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "expo.inOut" },
      "-=0.4",
    );
  }
  sessionStorage.setItem("hasVisited", "true");
}

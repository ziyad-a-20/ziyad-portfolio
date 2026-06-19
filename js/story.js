/* ══════════════════════════════
   STORY — timeline reveals
══════════════════════════════ */
(function () {
  /* Timeline items */
  var items = document.querySelectorAll(".tl-item");
  var itemObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          var idx = Array.from(items).indexOf(e.target);
          setTimeout(function () {
            e.target.classList.add("reveal");
          }, idx * 100);
          itemObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  items.forEach(function (it) {
    itemObs.observe(it);
  });

  /* Generic will-reveal elements in story */
  var wills = document.querySelectorAll("#story .will-reveal");
  var willObs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("reveal");
          willObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  wills.forEach(function (w) {
    willObs.observe(w);
  });
})();

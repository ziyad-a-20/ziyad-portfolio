/* ══════════════════════════════
   CONTACT — copy + form toggle + submit
══════════════════════════════ */
(function () {
  var FORMSPREE = "https://formspree.io/f/xnjydrlk";

  /* ── Copy email ── */
  var copyBtn = document.getElementById("sig-copy");
  var copyLbl = copyBtn && copyBtn.querySelector(".copy-lbl");

  function onCopied() {
    if (!copyBtn) return;
    copyBtn.classList.add("copied");
    if (copyLbl) copyLbl.textContent = "Copied!";
    setTimeout(function () {
      copyBtn.classList.remove("copied");
      if (copyLbl) copyLbl.textContent = "Copy";
    }, 2200);
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;opacity:0;pointer-events:none;";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
      onCopied();
    } catch (e) {}
    document.body.removeChild(ta);
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var E = "ziyad-a-tech@gmail.com";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(E)
          .then(onCopied)
          .catch(function () {
            fallbackCopy(E);
          });
      } else {
        fallbackCopy(E);
      }
    });
  }

  /* ── Form toggle ── */
  var tog = document.getElementById("form-tog");
  var formWrap = document.getElementById("contact-form");

  if (tog && formWrap) {
    tog.addEventListener("click", function () {
      var open = formWrap.classList.toggle("open");
      tog.setAttribute("aria-expanded", String(open));
      formWrap.setAttribute("aria-hidden", String(!open));
      tog.textContent = open ? "↑ Close" : "→ Prefer a form?";
    });
  }

  /* ── Form submit ── */
  var sendBtn = document.getElementById("cf-send");
  var okMsg = document.getElementById("cf-ok");

  function g(id) {
    return document.getElementById(id);
  }
  function setErr(field, msg) {
    var inp = g(field);
    var err = g(field + "-e");
    if (inp) inp.classList.toggle("err", !!msg);
    if (err) err.textContent = msg || "";
  }

  function validate() {
    var ok = true;
    var name = g("cf-name") ? g("cf-name").value.trim() : "";
    var email = g("cf-email") ? g("cf-email").value.trim() : "";
    var msg = g("cf-msg") ? g("cf-msg").value.trim() : "";

    if (!name) {
      setErr("cf-name", "Required.");
      ok = false;
    } else setErr("cf-name", "");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("cf-email", "Valid email required.");
      ok = false;
    } else {
      setErr("cf-email", "");
    }

    if (!msg || msg.length < 10) {
      setErr("cf-msg", "Too short — say a bit more.");
      ok = false;
    } else {
      setErr("cf-msg", "");
    }

    return ok;
  }

  ["cf-name", "cf-email", "cf-msg"].forEach(function (id) {
    var el = g(id);
    if (el)
      el.addEventListener("input", function () {
        setErr(id, "");
      });
  });

  if (sendBtn) {
    sendBtn.addEventListener("click", function () {
      if (!validate()) return;
      sendBtn.classList.add("sending");
      sendBtn.textContent = "Sending…";

      fetch(FORMSPREE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: g("cf-name") ? g("cf-name").value.trim() : "",
          email: g("cf-email") ? g("cf-email").value.trim() : "",
          message: g("cf-msg") ? g("cf-msg").value.trim() : "",
        }),
      })
        .then(function (res) {
          if (res.ok) {
            ["cf-name", "cf-email", "cf-msg"].forEach(function (id) {
              var el = g(id);
              if (el) el.value = "";
            });
            sendBtn.style.display = "none";
            if (okMsg) {
              okMsg.textContent = "✓ Message received — I'll be in touch.";
              okMsg.classList.add("show");
            }
          } else {
            sendBtn.classList.remove("sending");
            sendBtn.textContent = "Send Message";
            setErr("cf-msg", "Something went wrong — email me directly.");
          }
        })
        .catch(function () {
          sendBtn.classList.remove("sending");
          sendBtn.textContent = "Send Message";
          setErr("cf-msg", "Network error — check your connection.");
        });
    });
  }
})();

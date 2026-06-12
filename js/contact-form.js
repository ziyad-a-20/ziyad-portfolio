/* ══════════════════════════════════════════
   COPY EMAIL BUTTON
══════════════════════════════════════════ */
const copyBtn = document.getElementById("copy-email-btn");
if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    const EMAIL = "ziyad.official.a@gmail.com";
    const label = copyBtn.querySelector(".copy-label");

    function onCopied() {
      copyBtn.classList.add("copied");
      label.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.classList.remove("copied");
        label.textContent = "Copy";
      }, 2200);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(EMAIL)
        .then(onCopied)
        .catch(() => fallbackCopy(EMAIL, onCopied));
    } else {
      fallbackCopy(EMAIL, onCopied);
    }
  });
}

function fallbackCopy(text, cb) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.cssText = "position:fixed;opacity:0;pointer-events:none;";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  let success = false;
  try {
    success = document.execCommand("copy");
  } catch (e) {
    /* ignore */
  }
  document.body.removeChild(ta);
  if (success) {
    cb();
  } else {
    const label = copyBtn.querySelector(".copy-label");
    if (label) {
      label.textContent = "Failed";
      setTimeout(() => {
        label.textContent = "Copy";
      }, 2000);
    }
  }
}

/* ══════════════════════════════════════════
   CONTACT FORM — Formspree
══════════════════════════════════════════ */
const FORMSPREE_URL = "https://formspree.io/f/xnjydrlk";

const formSubmitBtn = document.getElementById("form-submit-btn");
const formSuccess = document.getElementById("form-success");
const charCount = document.getElementById("cf-char-count");
const messageField = document.getElementById("cf-message");

if (messageField && charCount) {
  messageField.addEventListener("input", () => {
    const len = messageField.value.length;
    const max = parseInt(messageField.getAttribute("maxlength")) || 500;
    charCount.textContent = len + " / " + max;
    charCount.classList.remove("warn", "danger");
    if (len >= max * 0.9) charCount.classList.add("danger");
    else if (len >= max * 0.75) charCount.classList.add("warn");
  });
}

function getField(id) {
  return document.getElementById(id);
}
function getError(id) {
  return document.getElementById(id + "-err");
}

function setError(fieldId, msg) {
  const input = getField(fieldId);
  const err = getError(fieldId);
  if (input) input.classList.toggle("error", !!msg);
  if (err) err.textContent = msg || "";
}

function clearErrors() {
  ["cf-name", "cf-email", "cf-subject", "cf-message"].forEach((id) =>
    setError(id, ""),
  );
}

function validateForm() {
  let valid = true;
  const name = getField("cf-name").value.trim();
  const email = getField("cf-email").value.trim();
  const subject = getField("cf-subject").value.trim();
  const message = getField("cf-message").value.trim();

  if (!name) {
    setError("cf-name", "Name is required");
    valid = false;
  } else setError("cf-name", "");

  if (!email) {
    setError("cf-email", "Email is required");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("cf-email", "Enter a valid email");
    valid = false;
  } else setError("cf-email", "");

  if (!subject) {
    setError("cf-subject", "Subject is required");
    valid = false;
  } else setError("cf-subject", "");

  if (!message) {
    setError("cf-message", "Message is required");
    valid = false;
  } else if (message.length < 10) {
    setError("cf-message", "Too short — say a little more");
    valid = false;
  } else setError("cf-message", "");

  return valid;
}

["cf-name", "cf-email", "cf-subject", "cf-message"].forEach((id) => {
  const el = getField(id);
  if (el) el.addEventListener("input", () => setError(id, ""));
});

if (formSubmitBtn) {
  formSubmitBtn.addEventListener("click", async () => {
    clearErrors();
    if (!validateForm()) return;

    formSubmitBtn.disabled = true;
    formSubmitBtn.classList.add("sending");
    formSubmitBtn.querySelector(".form-submit-text").textContent = "Sending…";

    const payload = {
      name: getField("cf-name").value.trim(),
      email: getField("cf-email").value.trim(),
      subject: getField("cf-subject").value.trim(),
      message: getField("cf-message").value.trim(),
    };

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        ["cf-name", "cf-email", "cf-subject", "cf-message"].forEach((id) => {
          const el = getField(id);
          if (el) el.value = "";
        });
        if (charCount) {
          charCount.textContent = "0 / 500";
          charCount.classList.remove("warn", "danger");
        }

        formSubmitBtn.style.transition =
          "opacity 0.4s ease, transform 0.4s ease";
        formSubmitBtn.style.opacity = "0";
        formSubmitBtn.style.transform = "translateY(6px)";

        setTimeout(() => {
          formSubmitBtn.style.display = "none";
          formSuccess.classList.add("show");
        }, 400);

        setTimeout(() => {
          formSuccess.style.transition =
            "opacity 0.5s ease, transform 0.5s ease";
          formSuccess.style.opacity = "0";
          formSuccess.style.transform = "translateY(-6px)";

          setTimeout(() => {
            formSuccess.classList.remove("show");
            formSuccess.style.opacity = "";
            formSuccess.style.transform = "";
            formSuccess.style.transition = "";

            formSubmitBtn.disabled = false;
            formSubmitBtn.classList.remove("sending");
            formSubmitBtn.querySelector(".form-submit-text").textContent =
              "Send Message";
            formSubmitBtn.style.display = "";
            formSubmitBtn.style.opacity = "0";
            formSubmitBtn.style.transform = "translateY(6px)";

            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                formSubmitBtn.style.opacity = "1";
                formSubmitBtn.style.transform = "translateY(0)";
                setTimeout(() => {
                  formSubmitBtn.style.transition = "";
                  formSubmitBtn.style.opacity = "";
                  formSubmitBtn.style.transform = "";
                }, 450);
              });
            });
          }, 500);
        }, 4000);
      } else {
        let errMsg = "Something went wrong. Please email me directly.";
        try {
          const json = await res.json();
          if (json.errors && json.errors.length > 0)
            errMsg = json.errors.map((e) => e.message).join(" ");
        } catch (_) {
          /* ignore */
        }
        formSubmitBtn.disabled = false;
        formSubmitBtn.classList.remove("sending");
        formSubmitBtn.querySelector(".form-submit-text").textContent =
          "Send Message";
        setError("cf-message", errMsg);
      }
    } catch (networkErr) {
      formSubmitBtn.disabled = false;
      formSubmitBtn.classList.remove("sending");
      formSubmitBtn.querySelector(".form-submit-text").textContent =
        "Send Message";
      setError(
        "cf-message",
        "Network error — please check your connection or email me directly.",
      );
    }
  });
}

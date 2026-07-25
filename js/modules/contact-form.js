const FORMSPREE_ENDPOINT = "https://formspree.io/f/xnjydrlk";
const MIN_FILL_TIME_MS = 2500;
const STATUS_VISIBLE_MS = 4000;

export function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("cf-name");
  const emailInput = document.getElementById("cf-email");
  const messageInput = document.getElementById("cf-message");
  const submitBtn = document.getElementById("cf-submit");
  const statusEl = document.getElementById("cf-status");
  const renderedAt = Date.now();
  let statusTimer = null;

  const fields = {
    name: {
      input: nameInput,
      errorEl: document.getElementById("cf-name-error"),
      validate: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
    },
    email: {
      input: emailInput,
      errorEl: document.getElementById("cf-email-error"),
      validate: (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
          ? ""
          : "Please enter a valid email address.",
    },
    message: {
      input: messageInput,
      errorEl: document.getElementById("cf-message-error"),
      validate: (v) =>
        v.trim().length >= 10
          ? ""
          : "Message should be at least 10 characters.",
    },
  };

  function setFieldError(field, message) {
    field.input.closest(".form-field").classList.toggle("invalid", !!message);
    field.errorEl.textContent = message;
  }

  function validateField(key) {
    const field = fields[key];
    const message = field.validate(field.input.value);
    setFieldError(field, message);
    return !message;
  }

  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener("blur", () => validateField(key));
    fields[key].input.addEventListener("input", () => {
      if (
        fields[key].input.closest(".form-field").classList.contains("invalid")
      ) {
        validateField(key);
      }
    });
  });

  function clearStatusTimer() {
    if (statusTimer) {
      clearTimeout(statusTimer);
      statusTimer = null;
    }
  }

  function showStatus(message, type, autoHide) {
    clearStatusTimer();
    statusEl.textContent = message;
    statusEl.className = `form-status show ${type}`;

    if (autoHide) {
      statusTimer = setTimeout(() => {
        statusEl.classList.remove("show");
        statusTimer = setTimeout(() => {
          statusEl.textContent = "";
          statusEl.className = "form-status";
        }, 400); // matches the CSS opacity/transform transition duration
      }, STATUS_VISIBLE_MS);
    }
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle("is-loading", isLoading);
  }

  function resetFormState() {
    form.reset();
    Object.keys(fields).forEach((key) => setFieldError(fields[key], ""));
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const allValid = Object.keys(fields).every((key) => validateField(key));
    if (!allValid) {
      showStatus("Please fix the highlighted fields.", "error", true);
      return;
    }

    const honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value) {
      resetFormState();
      showStatus("Message sent — thanks for reaching out!", "success", true);
      return;
    }

    if (Date.now() - renderedAt < MIN_FILL_TIME_MS) {
      showStatus("Please try again.", "error", true);
      return;
    }

    setLoading(true);
    showStatus("Sending…", "", false);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (response.ok) {
        resetFormState();
        showStatus(
          "Message sent — I'll get back to you soon.",
          "success",
          true,
        );
      } else {
        showStatus(
          "Something went wrong. Please try emailing me directly.",
          "error",
          true,
        );
      }
    } catch {
      showStatus(
        "Network error — please try emailing me directly.",
        "error",
        true,
      );
    } finally {
      setLoading(false);
    }
  });
}

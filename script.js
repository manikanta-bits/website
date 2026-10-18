const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const systemPreview = document.querySelector("#system-preview");
const previewTabs = Array.from(document.querySelectorAll(".preview-tab"));
const previewTitle = document.querySelector("#preview-title");
const previewSummary = document.querySelector("#preview-summary");
const previewPanel = document.querySelector("#preview-panel");

function selectPreviewTab(tab, moveFocus = false) {
  previewTabs.forEach((previewTab) => {
    const isSelected = previewTab === tab;
    previewTab.setAttribute("aria-selected", String(isSelected));
    previewTab.tabIndex = isSelected ? 0 : -1;
  });

  systemPreview.dataset.mode = tab.dataset.mode;
  previewTitle.textContent = tab.dataset.title;
  previewSummary.textContent = tab.dataset.summary;
  previewPanel.setAttribute("aria-labelledby", tab.id);
  if (moveFocus) tab.focus();
}

previewTabs.forEach((tab) => {
  tab.addEventListener("click", () => selectPreviewTab(tab));
  tab.addEventListener("keydown", (event) => {
    const currentIndex = previewTabs.indexOf(tab);
    let nextIndex;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % previewTabs.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + previewTabs.length) % previewTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = previewTabs.length - 1;

    if (nextIndex !== undefined) {
      event.preventDefault();
      selectPreviewTab(previewTabs[nextIndex], true);
    }
  });
});

document.querySelector("#contact-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const subject = `Project inquiry from ${formData.get("name")}`;
  const message = [
    `Name: ${formData.get("name")}`,
    `Email: ${formData.get("email")}`,
    "",
    formData.get("message"),
  ].join("\n");
  const draft = `To: machkurimanikanta53@gmail.com\nSubject: ${subject}\n\n${message}`;
  const status = document.querySelector("#form-status");
  const draftField = document.querySelector("#form-draft");
  const mailLink = document.querySelector("#form-mail-link");
  const submitButton = form.querySelector("[type='submit']");
  const originalButtonText = submitButton.innerHTML;

  draftField.value = draft;
  mailLink.href = `mailto:machkurimanikanta53@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  mailLink.hidden = true;
  draftField.hidden = true;
  status.textContent = "Sending your message...";
  status.hidden = false;
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  try {
    const response = await fetch("https://formsubmit.co/ajax/machkurimanikanta53@gmail.com", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
        _subject: subject,
        _replyto: formData.get("email"),
        _template: "table",
      }),
    });
    const result = await response.json();
    if (!response.ok || result.success === false || result.success === "false") {
      throw new Error(result.message || "The form service could not accept your message.");
    }

    status.textContent = "Thanks, your inquiry was sent. We’ll be in touch soon.";
    form.reset();
  } catch {
    mailLink.hidden = false;
    draftField.hidden = false;
    status.textContent = "We couldn’t send your inquiry. Copy the draft below or use the email app link instead.";
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
});
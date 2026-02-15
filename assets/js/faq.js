document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".faq-toggle");
  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      if (panel) {
        panel.style.maxHeight = expanded ? "0px" : panel.scrollHeight + "px";
      }
      const icon = btn.querySelector(".faq-icon");
      if (icon) {
        icon.textContent = expanded ? "＋" : "−";
      }
    });
  });

  window.addEventListener("resize", () => {
    document.querySelectorAll(".faq-toggle[aria-expanded='true']").forEach((btn) => {
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (panel) {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
});

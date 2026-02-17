document.addEventListener("DOMContentLoaded", () => {
  const normalizePath = (path) => {
    let normalized = path.replace(/index\.html$/, "");
    if (!normalized.endsWith("/")) {
      normalized += "/";
    }
    return normalized;
  };

  const current = normalizePath(window.location.pathname || "/");
  document.querySelectorAll(".nav-link").forEach((link) => {
    const target = normalizePath(link.dataset.path || link.getAttribute("href") || "/");
    if (target === current) {
      link.classList.add("nav-link-active");
    }
  });

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.getElementById("mobile-menu");
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      mobileMenu.classList.toggle("hidden");
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});

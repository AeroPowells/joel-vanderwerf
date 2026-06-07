(function () {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const yearEl = document.getElementById("year");
  const toast = document.getElementById("toast");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get("sent") === "1" && toast) {
    toast.hidden = false;
    toast.classList.add("is-visible");
    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => {
        toast.hidden = true;
        window.history.replaceState({}, "", window.location.pathname);
      }, 300);
    }, 3500);
  }

  const contactForm = document.querySelector(".contact-form");
  const formNext = document.getElementById("form-next");
  if (contactForm && formNext) {
    contactForm.addEventListener("submit", () => {
      formNext.value = window.location.origin + window.location.pathname + "?sent=1";
    });
  }
})();

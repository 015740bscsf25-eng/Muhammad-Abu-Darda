document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const isCurrent = link.getAttribute("href") === currentPath;
    link.classList.toggle("active", isCurrent);
    if (isCurrent) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  document.querySelectorAll(".nav-toggle").forEach((toggle) => {
    const shell = toggle.closest(".nav-shell");
    if (!shell) return;

    toggle.addEventListener("click", () => {
      const isOpen = shell.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });
    shell.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        shell.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation menu");
      });
    });
  });

  document.querySelectorAll("img[data-fallback]").forEach((image) => {
    const useFallback = () => {
      if (image.dataset.fallbackApplied) return;
      image.dataset.fallbackApplied = "true";
      const text = encodeURIComponent(image.dataset.fallback);
      image.src = `https://placehold.co/900x600/1E293B/06B6D4?text=${text}`;
    };
    image.addEventListener("error", useFallback);
    if (image.complete && image.naturalWidth === 0) useFallback();
  });

  const filterButtons = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll(".project-card");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      projectCards.forEach((card) => {
        const visible = filter === "all" || card.dataset.category === filter;
        card.hidden = !visible;
      });
    });
  });

  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const fullscreenButton = document.querySelector("[data-modal-fullscreen]");
  let lastFocusedElement = null;

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  const openModal = (trigger) => {
    if (!modal || !modalImage) return;
    lastFocusedElement = trigger;
    modalImage.src = trigger.dataset.certImage;
    modalImage.alt = `${trigger.dataset.certTitle} preview`;
    modalTitle.textContent = trigger.dataset.certTitle;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modal.querySelector("[data-modal-close]").focus();
  };

  document.querySelectorAll("[data-cert-image]").forEach((trigger) => {
    trigger.addEventListener("click", () => openModal(trigger));
  });
  const modalCloseButton = document.querySelector("[data-modal-close]");
  if (modalCloseButton) modalCloseButton.addEventListener("click", closeModal);
  if (fullscreenButton) {
    fullscreenButton.addEventListener("click", () => {
      if (modalImage && modalImage.requestFullscreen) modalImage.requestFullscreen();
    });
  }
  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && modal.classList.contains("is-open")) closeModal();
    if (event.key === "Tab" && modal && modal.classList.contains("is-open")) {
      const focusable = modal.querySelectorAll("button, img");
      if (focusable.length && event.target === focusable[focusable.length - 1] && !event.shiftKey) {
        event.preventDefault();
        focusable[0].focus();
      }
    }
  });
});

(() => {
  const burger = document.querySelector(".hamburger-menu");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".nav__overlay");
  const closeBtn = document.querySelector(".sidebar__close");

  if (!burger || !sidebar || !overlay || !closeBtn) return;

  let lastFocusedEl = null;

  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  const getFocusableEls = () =>
    Array.from(sidebar.querySelectorAll(focusableSelector)).filter(
      (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
    );

  const onEsc = (e) => {
    if (e.key === "Escape") closeMenu();
  };

  const onTabTrap = (e) => {
    if (e.key !== "Tab") return;

    const focusables = getFocusableEls();
    if (focusables.length === 0) {
      e.preventDefault();
      closeBtn.focus();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const openMenu = () => {
    if (burger.getAttribute("aria-expanded") === "true") return;

    lastFocusedEl = document.activeElement;

    sidebar.classList.add("is-open");
    overlay.hidden = false;

    burger.setAttribute("aria-expanded", "true");
    sidebar.setAttribute("aria-hidden", "false");

    sidebar.removeAttribute("inert");

    document.body.classList.add("nav-locked");

    document.addEventListener("keydown", onEsc);
    document.addEventListener("keydown", onTabTrap);

    closeBtn.focus();
  };

  const closeMenu = () => {
    if (burger.getAttribute("aria-expanded") === "false") return;

    sidebar.classList.remove("is-open");
    overlay.hidden = true;

    burger.setAttribute("aria-expanded", "false");
    sidebar.setAttribute("aria-hidden", "true");

    sidebar.setAttribute("inert", "");

    document.body.classList.remove("nav-locked");

    document.removeEventListener("keydown", onEsc);
    document.removeEventListener("keydown", onTabTrap);

    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      lastFocusedEl.focus();
    } else {
      burger.focus();
    }

    lastFocusedEl = null;
  };

  burger.addEventListener("click", () => {
    const isOpen = burger.getAttribute("aria-expanded") === "true";
    if (isOpen) closeMenu();
    else openMenu();
  });

  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  sidebar.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });

  burger.setAttribute("aria-expanded", "false");
  sidebar.setAttribute("aria-hidden", "true");
  overlay.hidden = true;

  sidebar.setAttribute("inert", "");
})();



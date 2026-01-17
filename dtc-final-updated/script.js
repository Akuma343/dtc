// ===============================
// NAVBAR SCROLL EFFECT (COBUILD STYLE)
// ===============================
const header = document.querySelector(".header");
if (header) {
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Check on load
}

// ===============================
// NAV MENU (MOBILE)
// ===============================
function initMobileMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  if (!menuBtn || !navLinks) {
    console.warn("Menu button or nav links not found");
    return;
  }

  // Initialize menu button
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Toggle navigation menu");

  // Mobile menu toggle
  menuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    navLinks.classList.toggle("active");

    // Update button text/icon when menu is open
    if (navLinks.classList.contains("active")) {
      menuBtn.textContent = "✕";
      menuBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      menuBtn.textContent = "☰";
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = ""; // Restore scroll
    }
  });

  // Close menu when a nav link is clicked (mobile UX)
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuBtn.textContent = "☰";
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = ""; // Restore scroll
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navLinks.classList.contains("active")) return;

    const clickedInsideNav = navLinks.contains(e.target) || menuBtn.contains(e.target);
    if (!clickedInsideNav) {
      navLinks.classList.remove("active");
      menuBtn.textContent = "☰";
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = ""; // Restore scroll
    }
  });

  // Close menu on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      menuBtn.textContent = "☰";
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = ""; // Restore scroll
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMobileMenu);
} else {
  initMobileMenu();
}

// ===============================
// TEAM SHOW MORE (GALLERY TOGGLE)
// ===============================
const teamGallery = document.getElementById("teamGallery");
const teamMoreBtn = document.getElementById("teamMoreBtn");

if (teamGallery && teamMoreBtn) {
  teamMoreBtn.addEventListener("click", () => {
    const collapsed = teamGallery.getAttribute("data-collapsed") === "true";

    // toggle
    teamGallery.setAttribute("data-collapsed", collapsed ? "false" : "true");
    teamMoreBtn.classList.toggle("is-open", collapsed);

    // aria + label
    teamMoreBtn.setAttribute("aria-expanded", collapsed ? "true" : "false");
    const txt = teamMoreBtn.querySelector(".txt");
    if (txt) txt.textContent = collapsed ? "Show less" : "Show more";

    // when closing, scroll back to gallery top
    if (!collapsed) {
      teamGallery.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

// ===============================
// PORTFOLIO: TOGGLE PICTURES
// ===============================
document.querySelectorAll(".pf-item").forEach((item) => {
  const button = item.querySelector(".pf-toggle");
  const media = item.querySelector(".pf-media");
  if (!button || !media) return;

  button.addEventListener("click", () => {
    const isOpen = !media.hasAttribute("hidden");

    if (isOpen) {
      media.setAttribute("hidden", "");
      button.textContent = "Show Pictures";
      button.setAttribute("aria-expanded", "false");
    } else {
      media.removeAttribute("hidden");
      button.textContent = "Hide Pictures";
      button.setAttribute("aria-expanded", "true");
    }
  });
});

// ===============================
// PORTFOLIO: SHOW 3 + MORE BTN
// ===============================
(function () {
  const wrap = document.querySelector(".pf-wrap");
  const btn = document.getElementById("pfMoreBtn");
  if (!wrap || !btn) return;

  const items = Array.from(wrap.querySelectorAll(".pf-item"));
  const SHOW_COUNT = 3;

  // If only 3 or less, hide the button
  if (items.length <= SHOW_COUNT) {
    btn.style.display = "none";
    return;
  }

  function collapse() {
    items.forEach((item, i) => item.classList.toggle("is-hidden", i >= SHOW_COUNT));
    btn.textContent = "More Projects";
    btn.setAttribute("aria-expanded", "false");
  }

  function expand() {
    items.forEach((item) => item.classList.remove("is-hidden"));
    btn.textContent = "Show Less";
    btn.setAttribute("aria-expanded", "true");
  }

  let expanded = false;
  collapse();

  btn.addEventListener("click", () => {
    expanded = !expanded;
    expanded ? expand() : collapse();

    if (!expanded) {
      wrap.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
})();

// ===============================
// MOBILE: COLLAPSE SECTIONS + MODAL
// - about / mission / vision (first sentence + More)
// - process (mobile shows intro+highlight only; modal shows full)
// REQUIREMENTS IN HTML:
// 1) modal container exists:
//    #contentModal, #contentModalTitle, #contentModalBody
// 2) modal body contains: <div class="modal-theme"></div>
// ===============================
(function () {
  const MOBILE_MAX = 600;

  const modal = document.getElementById("contentModal");
  const modalTitle = document.getElementById("contentModalTitle");
  const modalBody = document.getElementById("contentModalBody");
  const modalTheme = modalBody ? modalBody.querySelector(".modal-theme") : null;

  // Don't break if modal isn't present
  if (!modal || !modalTitle || !modalBody || !modalTheme) return;

  function isMobile() {
    return window.matchMedia(`(max-width:${MOBILE_MAX}px)`).matches;
  }

  function splitFirstSentence(text) {
    const t = (text || "").trim().replace(/\s+/g, " ");
    if (!t) return { first: "", rest: "" };

    const m = t.match(/(.+?[.!?])(\s+|$)(.*)/);
    if (m) return { first: m[1].trim(), rest: (m[3] || "").trim() };

    return { first: t, rest: "" };
  }

  function collapseSection(root) {
    if (!root) return;

    const kind = root.getAttribute("data-collapsible") || "";

    // PROCESS: keep intro + highlight only on mobile
    if (kind === "process") {
      root.querySelectorAll(".process-hide-mobile").forEach((el) => {
        el.classList.add("hide-on-mobile");
      });
      root.classList.add("is-collapsed");
      return;
    }

    // ABOUT/VISION paragraphs
    const ps = Array.from(root.querySelectorAll("p:not(.about-lead)"));
    // MISSION bullets
    const lis = Array.from(root.querySelectorAll("li"));

    if (ps.length) {
      const firstP = ps[0];
      const full = firstP.dataset.fullText || firstP.textContent;
      firstP.dataset.fullText = full;

      const parts = splitFirstSentence(full);
      firstP.textContent = parts.first || full;

      // hide the rest
      ps.slice(1).forEach((p) => p.classList.add("hide-on-mobile"));
      const note = root.querySelector(".about-note");
      if (note && note !== firstP) note.classList.add("hide-on-mobile");
    }

    if (lis.length) {
      lis.forEach((li, idx) => {
        if (idx > 0) li.classList.add("hide-on-mobile");
      });
    }

    root.classList.add("is-collapsed");
  }

  function expandSection(root) {
    if (!root) return;

    // restore full paragraph text
    root.querySelectorAll("p").forEach((p) => {
      if (p.dataset && p.dataset.fullText) {
        p.textContent = p.dataset.fullText;
      }
    });

    // unhide everything
    root.querySelectorAll(".hide-on-mobile").forEach((el) => el.classList.remove("hide-on-mobile"));
    root.classList.remove("is-collapsed");
  }

  function applyResponsiveCollapse() {
    document.querySelectorAll("[data-collapsible]").forEach((sec) => {
      if (isMobile()) collapseSection(sec);
      else expandSection(sec);
    });
  }

  // ✅ UPDATED: add modal type class so CSS can target "process" modal only
  function openModalFor(section) {
    if (!section) return;

    const kind = section.getAttribute("data-collapsible") || "details";
    const niceTitle =
      kind === "about"
        ? "About Us"
        : kind === "mission"
        ? "Mission"
        : kind === "vision"
        ? "Vision"
        : kind === "process"
        ? "Our Process"
        : "Details";

    modalTitle.textContent = niceTitle;

    // Add state class for styling (e.g., #contentModal.is-process)
    modal.classList.remove("is-about", "is-mission", "is-vision", "is-process");
    modal.classList.add(`is-${kind}`);

    // Clone the current section (may be collapsed on mobile)
    const clone = section.cloneNode(true);

    // Remove "More" button(s) inside modal content
    clone.querySelectorAll(".more-btn").forEach((btn) => btn.remove());

    // Restore full truncated paragraph
    clone.querySelectorAll("p").forEach((p) => {
      if (p.dataset && p.dataset.fullText) {
        p.textContent = p.dataset.fullText;
      }
    });

    // IMPORTANT: Unhide everything for modal
    clone.querySelectorAll(".hide-on-mobile").forEach((el) => el.classList.remove("hide-on-mobile"));
    clone.querySelectorAll(".process-hide-mobile").forEach((el) => el.classList.remove("process-hide-mobile"));

    // Inject into theme wrapper so modal keeps your design
    modalTheme.innerHTML = clone.innerHTML;

    // Reset scroll to top each open
    modalBody.scrollTop = 0;

    // Show modal
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    // Prevent background scroll
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }

  // ✅ UPDATED: remove modal type class on close
  function closeModal() {
    modal.classList.remove("is-open");
    modal.classList.remove("is-about", "is-mission", "is-vision", "is-process");
    modal.setAttribute("aria-hidden", "true");
    modalTheme.innerHTML = "";

    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  // Click handler: More + close buttons
  document.addEventListener("click", (e) => {
    const moreBtn = e.target.closest(".more-btn");
    if (moreBtn && isMobile()) {
      const section = moreBtn.closest("[data-collapsible]");
      openModalFor(section);
    }

    if (e.target.matches("[data-close]") || e.target.closest("[data-close]")) {
      closeModal();
    }
  });

  // ESC closes modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  // Apply on load + resize
  window.addEventListener("DOMContentLoaded", applyResponsiveCollapse);
  window.addEventListener("resize", applyResponsiveCollapse);
})();

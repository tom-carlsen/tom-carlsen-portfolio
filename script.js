/* ═══════════════════════════════════════════════
   PORTFOLIO — script.js
   Micro-interactions:
     1. Custom lerp cursor
     2. Scroll progress bar
     3. Active nav on scroll
     4. Smooth scroll
     5. Fade-in via Intersection Observer
     6. Hero text stagger reveal
     7. Magnetic buttons
     8. Card 3D tilt (journey items, story cards)
     9. Journey item mouse-glow tracking
═══════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ─────────────────────────────────────────────
     1. CUSTOM CURSOR (lerp)
  ───────────────────────────────────────────── */
  const cursor    = document.getElementById("cursor");
  const cursorDot = document.getElementById("cursorDot");
  const isTouchDevice = window.matchMedia("(hover: none)").matches;

  if (!isTouchDevice && cursor && cursorDot) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lerpX  = mouseX;
    let lerpY  = mouseY;
    let visible = false;
    let rafId;

    document.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dot snaps immediately
      cursorDot.style.transform = "translate(" + mouseX + "px, " + mouseY + "px) translate(-50%, -50%)";

      if (!visible) {
        visible = true;
        cursor.classList.add("visible");
        cursorDot.classList.add("visible");
      }
    });

    document.addEventListener("mouseleave", function () {
      visible = false;
      cursor.classList.remove("visible");
      cursorDot.classList.remove("visible");
    });

    function animateCursor() {
      lerpX += (mouseX - lerpX) * 0.12;
      lerpY += (mouseY - lerpY) * 0.12;
      cursor.style.transform = "translate(" + lerpX + "px, " + lerpY + "px) translate(-50%, -50%)";
      rafId = requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Expand cursor over interactive elements
    const interactiveEls = document.querySelectorAll("a, button, [data-tilt], .journey-item");
    interactiveEls.forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursor.classList.add("expanded"); });
      el.addEventListener("mouseleave", function () { cursor.classList.remove("expanded"); });
    });
  }

  /* ─────────────────────────────────────────────
     2. SCROLL PROGRESS BAR
  ───────────────────────────────────────────── */
  const progressBar = document.getElementById("scrollProgress");

  function updateProgress() {
    if (!progressBar) return;
    const scrolled  = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct       = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
    progressBar.style.width = pct + "%";
  }

  window.addEventListener("scroll", updateProgress, { passive: true });

  /* ─────────────────────────────────────────────
     3. ACTIVE NAV ON SCROLL
  ───────────────────────────────────────────── */
  const navLinks  = document.querySelectorAll(".nav-links a");
  const header    = document.getElementById("site-header");

  const sectionIds = Array.from(navLinks)
    .map(function (a) { return a.getAttribute("href").replace("#", ""); })
    .filter(Boolean);

  function updateNav() {
    const offset = (header ? header.offsetHeight : 60) + 32;
    let current  = "";

    sectionIds.forEach(function (id) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= offset) {
        current = id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }

  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  /* ─────────────────────────────────────────────
     4. SMOOTH SCROLL (polyfill for older Safari)
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top     = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ─────────────────────────────────────────────
     5. FADE-IN OBSERVER
  ───────────────────────────────────────────── */
  const fadeEls = document.querySelectorAll(".fade-in");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
    );

    // Stagger siblings inside containers
    document.querySelectorAll(".journey-list, .stories-duo, .beliefs").forEach(function (container) {
      container.querySelectorAll(".fade-in").forEach(function (el, i) {
        el.style.transitionDelay = (i * 90) + "ms";
      });
    });

    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ─────────────────────────────────────────────
     6. HERO TEXT STAGGER REVEAL (on load)
  ───────────────────────────────────────────── */
  const revealLines = document.querySelectorAll(".reveal-line");

  function revealHero() {
    revealLines.forEach(function (el, i) {
      el.style.transitionDelay = (i * 110 + 100) + "ms";
      // Small timeout so first paint is done
      setTimeout(function () {
        el.classList.add("revealed");
      }, 60);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", revealHero);
  } else {
    revealHero();
  }

  /* ─────────────────────────────────────────────
     7. MAGNETIC BUTTONS
  ───────────────────────────────────────────── */
  if (!isTouchDevice) {
    document.querySelectorAll(".magnetic").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        const rect = btn.getBoundingClientRect();
        const dx   = e.clientX - (rect.left + rect.width  / 2);
        const dy   = e.clientY - (rect.top  + rect.height / 2);
        btn.style.transform = "translate(" + dx * 0.18 + "px, " + dy * 0.18 + "px)";
      });

      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
        btn.style.transition = "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)";
        setTimeout(function () { btn.style.transition = ""; }, 450);
      });
    });
  }

  /* ─────────────────────────────────────────────
     8. CARD 3D TILT
  ───────────────────────────────────────────── */
  if (!isTouchDevice) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        const rect  = card.getBoundingClientRect();
        const x     = (e.clientX - rect.left) / rect.width  - 0.5;
        const y     = (e.clientY - rect.top)  / rect.height - 0.5;
        const rotX  = -y * 5;
        const rotY  =  x * 5;
        card.style.transform =
          "perspective(800px) rotateX(" + rotX + "deg) rotateY(" + rotY + "deg) scale3d(1.01, 1.01, 1.01)";
      });

      card.addEventListener("mouseleave", function () {
        card.style.transition = "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        card.style.transform  = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
        setTimeout(function () { card.style.transition = ""; }, 500);
      });
    });
  }

  /* ─────────────────────────────────────────────
     9. JOURNEY ITEM MOUSE-GLOW TRACKING
  ───────────────────────────────────────────── */
  document.querySelectorAll(".journey-item").forEach(function (item) {
    item.addEventListener("mousemove", function (e) {
      const rect = item.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width)  * 100;
      const y    = ((e.clientY - rect.top)  / rect.height) * 100;
      item.style.setProperty("--mouse-x", x + "%");
      item.style.setProperty("--mouse-y", y + "%");
    });
  });

})();

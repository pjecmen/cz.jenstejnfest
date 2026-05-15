/* JenštejnFest 26 — app.js
   - Countdown to 2026-06-20T15:15:00+02:00 (gates open)
   - FAQ accordion (single open at a time)
   - Smooth scroll for anchor links
   - Hamburger toggle (icon-only for MVP)
*/

(function () {
  'use strict';

  /* ───── Countdown ───── */
  function initCountdown() {
    const root = document.querySelector('[data-countdown]');
    if (!root) return;

    const target = new Date(root.dataset.countdown).getTime();
    const cells = {
      days:  root.querySelector('[data-countdown-cell="days"]'),
      hours: root.querySelector('[data-countdown-cell="hours"]'),
      mins:  root.querySelector('[data-countdown-cell="mins"]'),
      secs:  root.querySelector('[data-countdown-cell="secs"]'),
    };
    const pad = (n) => String(n).padStart(2, '0');

    function tick() {
      const diff = Math.max(0, target - Date.now());
      const days  = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins  = Math.floor((diff % 3600000) / 60000);
      const secs  = Math.floor((diff % 60000) / 1000);
      if (cells.days)  cells.days.textContent  = pad(days);
      if (cells.hours) cells.hours.textContent = pad(hours);
      if (cells.mins)  cells.mins.textContent  = pad(mins);
      if (cells.secs)  cells.secs.textContent  = pad(secs);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ───── FAQ accordion ───── */
  function initFaq() {
    const items = document.querySelectorAll('[data-faq-item]');
    if (!items.length) return;

    items.forEach((item) => {
      const trigger = item.querySelector('[data-faq-trigger]');
      if (!trigger) return;
      trigger.addEventListener('click', () => {
        const wasOpen = item.classList.contains('is-open');
        items.forEach((o) => {
          o.classList.remove('is-open');
          const t = o.querySelector('[data-faq-trigger]');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ───── Smooth scroll for in-page anchors ───── */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ───── Hamburger + mobile menu ───── */
  function initHamburger() {
    const btn = document.querySelector('[data-hamburger]');
    const nav = document.querySelector('.site-nav');
    if (!btn || !nav) return;

    function openMenu() {
      nav.classList.add('is-menu-open');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Zavřít menu');
    }
    function closeMenu() {
      nav.classList.remove('is-menu-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Otevřít menu');
    }

    btn.addEventListener('click', () => {
      if (nav.classList.contains('is-menu-open')) closeMenu();
      else openMenu();
    });

    // Click on a menu link closes the menu (smooth scroll handles navigation)
    nav.querySelectorAll('[data-mobile-menu] a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Escape closes the menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-menu-open')) {
        closeMenu();
      }
    });
  }

  /* ───── Boot ───── */
  function init() {
    initCountdown();
    initFaq();
    initSmoothScroll();
    initHamburger();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

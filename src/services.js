import { setupNavThemeSwap } from './scripts/nav-theme.js';
import { initSmoothScroll } from './scripts/smooth-scroll.js';
import { initPageLoader } from './scripts/page-loader.js';

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initSmoothScroll();
  setupNavThemeSwap();

  // Smooth scroll for anchor jump tabs
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

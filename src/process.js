import { setupNavThemeSwap } from './scripts/nav-theme.js';
import { initSmoothScroll } from './scripts/smooth-scroll.js';
import { initPageLoader } from './scripts/page-loader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initSmoothScroll();
  setupNavThemeSwap();

  // Spark Travel Micro-Animation along the process blueprint path
  const sparkHead = document.getElementById('spark-head');
  if (sparkHead && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.to(sparkHead, {
      scrollTrigger: {
        trigger: '.process-schematic-grid',
        start: 'top 80%',
        end: 'bottom 40%',
        scrub: 0.3,
      },
      attr: { cx: 950 },
      ease: 'none',
    });

    // Pulsing glow
    gsap.to(sparkHead, {
      attr: { r: 9 },
      yoyo: true,
      repeat: -1,
      duration: 0.8,
      ease: 'sine.inOut'
    });
  }
});

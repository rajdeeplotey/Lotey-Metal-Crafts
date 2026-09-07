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

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Subtle editorial fade-in
    gsap.from('.editorial-headline, .editorial-lead, .pull-quote', {
      opacity: 0,
      y: 25,
      stagger: 0.15,
      duration: 1,
      ease: 'power2.out'
    });

    gsap.from('.photo-frame-main, .photo-frame-offset', {
      opacity: 0,
      scale: 0.95,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power2.out'
    });

    // Timeline node triggers
    gsap.utils.toArray('.timeline-node').forEach((node) => {
      gsap.from(node, {
        scrollTrigger: {
          trigger: node,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -30,
        duration: 0.8,
        ease: 'power2.out'
      });
    });
  }
});

import { setupNavThemeSwap } from './scripts/nav-theme.js';
import { initHeroScrollScrub } from './scripts/hero-scrub.js';
import { initSmoothScroll } from './scripts/smooth-scroll.js';
import { initPageLoader } from './scripts/page-loader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Page Loader & Scroll to Top
  initPageLoader();

  // Initialize Smooth Scrolling
  initSmoothScroll();

  // Initialize Sticky Nav with Theme Inversion & Logo Swap
  setupNavThemeSwap();

  // Initialize Canvas Scroll-Scrub Hero
  initHeroScrollScrub();

  // Numbers Count-up Animation
  initNumbersCounter();

  // 4-Step Story Scroll Pinning & Image Switcher
  initStorySection();

  // Showcase Carousel Auto-Slide & Manual Navigation
  initShowcaseCarousel();
});

function initNumbersCounter() {
  const counterSection = document.querySelector('#numbers-section');
  if (!counterSection) return;

  const counters = document.querySelectorAll('.counter-num');

  ScrollTrigger.create({
    trigger: counterSection,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            counter.innerText = Math.floor(obj.val);
          }
        });
      });
    }
  });
}

function initStorySection() {
  const storyItems = document.querySelectorAll('.story-step-item');
  const previewImages = document.querySelectorAll('.story-preview-img');
  if (!storyItems.length || !previewImages.length) return;

  storyItems.forEach((item, index) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 55%',
      end: 'bottom 55%',
      onEnter: () => switchPreviewImage(index),
      onEnterBack: () => switchPreviewImage(index),
    });
  });

  function switchPreviewImage(targetIndex) {
    previewImages.forEach((img, idx) => {
      if (idx === targetIndex) {
        img.classList.add('is-active');
      } else {
        img.classList.remove('is-active');
      }
    });
  }
}

function initShowcaseCarousel() {
  const container = document.querySelector('.showcase-scroll-container');
  const prevBtn = document.querySelector('.showcase-nav-prev');
  const nextBtn = document.querySelector('.showcase-nav-next');
  const cards = document.querySelectorAll('.showcase-card');
  
  if (!container || !prevBtn || !nextBtn || !cards.length) return;

  let currentIndex = 0;
  let autoSlideInterval;
  const autoSlideDelay = 4000; // 4 seconds per card
  let isPaused = false;
  let isCarouselInView = false;

  function scrollToCard(index) {
    const card = cards[index];
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      currentIndex = index;
    }
  }

  function nextCard() {
    currentIndex = (currentIndex + 1) % cards.length;
    scrollToCard(currentIndex);
  }

  function prevCard() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    scrollToCard(currentIndex);
  }

  function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      if (!isPaused && isCarouselInView) {
        nextCard();
      }
    }, autoSlideDelay);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }

  // Check if carousel is in viewport
  const carouselObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isCarouselInView = entry.isIntersecting;
    });
  }, { threshold: 0.3 });

  carouselObserver.observe(container);

  // Manual navigation with arrows
  nextBtn.addEventListener('click', () => {
    stopAutoSlide();
    nextCard();
    startAutoSlide();
  });

  prevBtn.addEventListener('click', () => {
    stopAutoSlide();
    prevCard();
    startAutoSlide();
  });

  // Pause on hover over container
  container.addEventListener('mouseenter', () => {
    isPaused = true;
  });

  container.addEventListener('mouseleave', () => {
    isPaused = false;
  });

  // Start auto-sliding
  startAutoSlide();
}

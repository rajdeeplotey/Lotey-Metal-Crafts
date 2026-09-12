import { setupNavThemeSwap } from './scripts/nav-theme.js';
import { initSmoothScroll } from './scripts/smooth-scroll.js';
import { initPageLoader } from './scripts/page-loader.js';

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initSmoothScroll();
  setupNavThemeSwap();
  initChapterLightbox();

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

function initChapterLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const cards = document.querySelectorAll('.material-chapter .tilt-card');

  if (!modal || !modalImg) return;

  function openModalForCard(card) {
    const img = card.querySelector('.tilt-card-img');
    if (!img) return;

    modalImg.src = img.src;
    modalImg.alt = img.alt || 'Master Fabrication Full Image';

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => openModalForCard(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModalForCard(card);
      }
    });
  });

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

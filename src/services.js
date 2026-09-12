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
  const modalTitle = document.getElementById('lightbox-title');
  const modalMeta = document.getElementById('lightbox-meta');
  const modalInquire = document.getElementById('lightbox-inquire');
  const closeBtn = document.getElementById('lightbox-close');
  const cards = document.querySelectorAll('.material-chapter .tilt-card');

  if (!modal || !modalImg) return;

  function openModalForCard(card) {
    const img = card.querySelector('.tilt-card-img');
    const chapterSection = card.closest('.material-chapter');
    const submark = chapterSection?.querySelector('.submark-tag')?.innerText.trim() || '';
    const title = chapterSection?.querySelector('h2')?.innerText.trim() || img?.alt || 'Master Fabrication';
    const badge = card.querySelector('.tilt-card-badge')?.innerText.trim() || '';

    if (!img) return;

    modalImg.src = img.src;
    modalImg.alt = img.alt || title;
    modalTitle.innerText = submark ? `${submark}: ${title}` : title;
    modalMeta.innerText = badge ? `${badge} • Master Engineering by Lotey Metalcrafts` : 'Lotey Metalcrafts Ludhiana';

    if (modalInquire) {
      modalInquire.href = `https://wa.me/917888909390?text=Hi%20Inderjit%20Ji,%20I'm%20interested%20in%20custom%20fabrication%20for%20${encodeURIComponent(title)}.`;
    }

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

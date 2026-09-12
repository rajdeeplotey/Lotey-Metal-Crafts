import { setupNavThemeSwap } from './scripts/nav-theme.js';
import { initSmoothScroll } from './scripts/smooth-scroll.js';
import { initPageLoader } from './scripts/page-loader.js';
import { initComparisonSlider } from './scripts/tilt.js';

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initSmoothScroll();
  setupNavThemeSwap();
  initComparisonSlider();
  initGalleryFilters();
  initLightbox();
});

function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  const mobileDotsBtn = document.getElementById('mobile-dots-btn');
  const mobileCategoryFab = document.getElementById('mobile-category-fab');
  const mobileModal = document.getElementById('mobile-category-modal');
  const mobileBackdrop = document.getElementById('mobile-category-backdrop');
  const mobileCloseBtn = document.getElementById('mobile-sheet-close');
  const mobileOptions = document.querySelectorAll('.mobile-cat-option');
  const currentCatLabel = document.getElementById('mobile-current-cat');
  const currentCatCount = document.getElementById('mobile-cat-count');
  const fabLabel = document.getElementById('mobile-fab-label');
  const masonryGrid = document.getElementById('masonry-grid');

  // Compute item counts dynamically
  const counts = { all: items.length };
  items.forEach((item) => {
    const cat = item.getAttribute('data-category');
    if (cat) {
      counts[cat] = (counts[cat] || 0) + 1;
    }
  });

  // Update badge counts in mobile category sheet
  document.querySelectorAll('.mobile-cat-badge').forEach((badge) => {
    const filterKey = badge.getAttribute('data-badge-for');
    if (filterKey && counts[filterKey] !== undefined) {
      badge.textContent = `${counts[filterKey]}`;
    }
  });

  // Set initial count on mobile category bar
  if (currentCatCount) {
    currentCatCount.textContent = `(${counts.all})`;
  }

  // Unified filter function
  function applyFilter(filterValue, categoryName, shouldScroll = false) {
    // 1. Update Desktop filter buttons
    filterBtns.forEach((b) => {
      if (b.getAttribute('data-filter') === filterValue) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    // 2. Update Mobile options in sheet
    mobileOptions.forEach((opt) => {
      if (opt.getAttribute('data-filter') === filterValue) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });

    // 3. Update Mobile bar labels
    if (currentCatLabel) {
      currentCatLabel.textContent = categoryName;
    }
    if (currentCatCount && counts[filterValue] !== undefined) {
      currentCatCount.textContent = `(${counts[filterValue]})`;
    }
    if (fabLabel) {
      fabLabel.textContent = filterValue === 'all' ? 'Category' : categoryName.split(' ')[0];
    }

    // 4. Show/Hide items with animation
    items.forEach((item) => {
      const itemCategory = item.getAttribute('data-category');
      if (filterValue === 'all' || itemCategory === filterValue) {
        item.style.display = 'block';
        item.style.animation = 'fadeIn 0.4s ease';
      } else {
        item.style.display = 'none';
      }
    });

    // 5. Optionally smooth scroll to masonry grid
    if (shouldScroll && masonryGrid && window.innerWidth <= 768) {
      const headerOffset = 80;
      const elementPosition = masonryGrid.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  // Desktop buttons click handler
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');
      const categoryName = btn.innerText.trim();
      applyFilter(filterValue, categoryName, false);
    });
  });

  // Modal open / close handlers
  function openCategoryModal() {
    if (!mobileModal) return;
    mobileModal.classList.add('is-open');
    mobileModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCategoryModal() {
    if (!mobileModal) return;
    mobileModal.classList.remove('is-open');
    mobileModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (mobileDotsBtn) {
    mobileDotsBtn.addEventListener('click', openCategoryModal);
  }

  if (mobileCategoryFab) {
    mobileCategoryFab.addEventListener('click', openCategoryModal);
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeCategoryModal);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeCategoryModal);
  }

  // Mobile option select handler
  mobileOptions.forEach((option) => {
    option.addEventListener('click', () => {
      const filterValue = option.getAttribute('data-filter');
      const optionName = option.querySelector('.mobile-cat-option-name')?.innerText.trim() || 'Category';
      applyFilter(filterValue, optionName, true);
      closeCategoryModal();
    });
  });

  // Escape key closes modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileModal && mobileModal.classList.contains('is-open')) {
      closeCategoryModal();
    }
  });
}

function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalMeta = document.getElementById('lightbox-meta');
  const modalInquire = document.getElementById('lightbox-inquire');
  const closeBtn = document.getElementById('lightbox-close');
  const items = document.querySelectorAll('.gallery-item');

  if (!modal || !modalImg) return;

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.getAttribute('data-title') || item.querySelector('.gallery-item-title')?.innerText;
      const location = item.getAttribute('data-location') || 'Custom Project';

      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modalTitle.innerText = title;
      modalMeta.innerText = `Location: ${location} • Fabricated by Lotey Metalcrafts`;
      modalInquire.href = `https://wa.me/917888909390?text=Hi%20Inderjit%20Ji,%20I'm%20interested%20in%20a%20design%20like:%20"${encodeURIComponent(title)}"`;

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

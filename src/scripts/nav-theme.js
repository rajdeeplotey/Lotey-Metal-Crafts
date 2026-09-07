/**
 * LOTEY METALCRAFTS - Sticky Navigation & Dynamic Theme Inversion
 * Uses IntersectionObserver to watch [data-theme] sections and swap colors & logo files.
 */

export function setupNavThemeSwap() {
  const nav = document.querySelector('.site-nav');
  const logo = document.getElementById('nav-logo');
  if (!nav) return;

  const darkLogoSrc = '/logos/logo-emblem-gold.png';
  const lightLogoSrc = '/logos/logo-emblem-gold.png';

  const sections = document.querySelectorAll('[data-theme]');

  // Check section at the nav bar line (top ~80px)
  const observerOptions = {
    root: null,
    rootMargin: '-80px 0px 0px 0px',
    threshold: 0
  };

  const themeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const theme = entry.target.getAttribute('data-theme');
        applyNavTheme(theme);
      }
    });
  }, observerOptions);

  sections.forEach((sec) => themeObserver.observe(sec));

  function applyNavTheme(theme) {
    if (theme === 'light') {
      nav.classList.add('theme-light');
      if (logo && logo.getAttribute('src') !== lightLogoSrc) {
        logo.src = lightLogoSrc;
      }
    } else {
      nav.classList.remove('theme-light');
      if (logo && logo.getAttribute('src') !== darkLogoSrc) {
        logo.src = darkLogoSrc;
      }
    }
  }

  // Fallback initial theme detection on page load / refresh
  const scrollPos = window.scrollY + 90;
  for (let sec of sections) {
    const rect = sec.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const bottom = top + rect.height;
    if (scrollPos >= top && scrollPos <= bottom) {
      applyNavTheme(sec.getAttribute('data-theme'));
      break;
    }
  }

  // Mobile drawer toggle
  const toggleBtn = document.querySelector('.nav-mobile-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close drawer when clicking any link
    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        drawer.classList.remove('is-open');
        toggleBtn.innerHTML = '☰';
      });
    });
  }
}

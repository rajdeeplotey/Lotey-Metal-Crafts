/**
 * Global Page Loader & Scroll to Top
 */
export function initPageLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;

  // Hide loader after page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 300);
  });

  // Scroll to top on page load/refresh
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

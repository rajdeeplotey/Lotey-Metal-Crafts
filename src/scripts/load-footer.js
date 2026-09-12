/**
 * Load common footer from external file
 */
export function loadFooter() {
  fetch('/footer.html')
    .then(response => response.text())
    .then(html => {
      // Find the current footer and replace it
      const currentFooter = document.querySelector('.site-footer');
      if (currentFooter) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const newFooter = tempDiv.querySelector('.site-footer');
        if (newFooter) {
          currentFooter.replaceWith(newFooter);
        }
      }

      // Handle WhatsApp floating button
      const currentWhatsApp = document.querySelector('.whatsapp-float');
      const newWhatsApp = tempDiv.querySelector('.whatsapp-float');
      if (currentWhatsApp && newWhatsApp) {
        currentWhatsApp.replaceWith(newWhatsApp);
      }
    })
    .catch(error => console.error('Error loading footer:', error));
}

// Auto-load footer when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadFooter);
} else {
  loadFooter();
}
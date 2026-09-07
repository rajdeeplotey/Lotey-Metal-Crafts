import { setupNavThemeSwap } from './scripts/nav-theme.js';
import { initSmoothScroll } from './scripts/smooth-scroll.js';
import { initPageLoader } from './scripts/page-loader.js';

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initSmoothScroll();
  setupNavThemeSwap();

  const form = document.getElementById('project-enquiry-form');
  const feedback = document.getElementById('form-feedback');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('client-name').value;
      const phone = document.getElementById('client-phone').value;
      const city = document.getElementById('client-city').value;
      const workType = document.getElementById('work-type').value;
      const notes = document.getElementById('project-notes').value || 'None specified';

      const message = `*New Metalwork Inquiry from Website*%0A` +
        `*Name:* ${encodeURIComponent(name)}%0A` +
        `*Phone:* ${encodeURIComponent(phone)}%0A` +
        `*City / Location:* ${encodeURIComponent(city)}%0A` +
        `*Category:* ${encodeURIComponent(workType)}%0A` +
        `*Project Details:* ${encodeURIComponent(notes)}`;

      const whatsappUrl = `https://wa.me/917888909390?text=${message}`;

      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.background = '#EBF9F1';
        feedback.style.color = '#155724';
        feedback.style.border = '1px solid #C3E6CB';
        feedback.innerHTML = `<strong>Thank you, ${name}!</strong> Your inquiry has been formatted. Opening WhatsApp to connect directly with Inderjit Singh... <br/><br/><a href="${whatsappUrl}" target="_blank" class="btn btn-whatsapp" style="display:inline-flex; font-size:0.85rem; padding:0.5rem 1rem;">Click here if WhatsApp didn't open automatically</a>`;
      }

      // Open WhatsApp after brief delay
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 700);
    });
  }
});

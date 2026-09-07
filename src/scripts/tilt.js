/**
 * 3D Tilt Card Effect for Product / Fabrication Cards
 */
export function init3DTiltCards() {
  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length) return;

  cards.forEach((card) => {
    const height = card.clientHeight;
    const width = card.clientWidth;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const xVal = e.clientX - rect.left;
      const yVal = e.clientY - rect.top;

      const yRotation = 14 * ((xVal - width / 2) / width);
      const xRotation = -14 * ((yVal - height / 2) / height);

      card.style.transform = `perspective(800px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/**
 * Interactive Before / After Image Comparison Slider
 */
export function initComparisonSlider() {
  const wrapper = document.querySelector('.comparison-wrapper');
  if (!wrapper) return;

  const overlay = wrapper.querySelector('.comparison-overlay-img');
  const handle = wrapper.querySelector('.comparison-handle');
  if (!overlay || !handle) return;

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = wrapper.getBoundingClientRect();
    let posX = x - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;

    const percentage = (posX / rect.width) * 100;
    overlay.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  wrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  // Touch support for mobile
  wrapper.addEventListener('touchstart', (e) => {
    isDragging = true;
    setSliderPosition(e.touches[0].clientX);
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.touches[0].clientX);
  });
}

/**
 * LOTEY METALCRAFTS - Scroll-Scrubbed Canvas Hero
 * 
 * Features:
 * - 479 desktop / 320 mobile high-definition fabrication gate frames.
 * - Directional lookahead preloading with non-blocking idle sequence caching.
 * - Nearest-frame fallback resolver (eliminates frame 1 strobing/flicker during rapid scrolling).
 * - Native CSS sticky backdrop integration (zero pin-spacer conflicts / boundary jitter).
 * - Snappy, responsive scrub directly synced with smooth scrolling.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const CONFIG = {
  desktop: {
    frameCount: 479,
    path: '/hero-frames-desktop/',
  },
  mobile: {
    frameCount: 320,
    path: '/hero-frames-mobile/',
  },
};

// Sequence state tracking current frame position
export const sequenceState = { frame: 1 };

export function initHeroScrollScrub() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  const loader = document.querySelector('.hero-loader');
  const loaderFill = document.querySelector('.hero-loader-fill');
  const wordmark = document.querySelector('.hero-wordmark');
  const submark = document.querySelector('.hero-submark');

  // Handle Reduced Motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile vs Desktop frame setup
  const isMobile = window.innerWidth < 768;
  const activeConfig = isMobile ? CONFIG.mobile : CONFIG.desktop;
  const frameCount = activeConfig.frameCount;

  // State & Cache
  const imageCache = new Map();
  sequenceState.frame = 1;
  let lastDrawnIndex = 1;
  let lastDrawnImage = null;
  let hasFirstFrameLoaded = false;

  // Helper to format frame path (e.g. /hero-frames-desktop/001.jpg)
  function getFrameSrc(index) {
    const safeIndex = Math.max(1, Math.min(frameCount, index));
    const padded = String(safeIndex).padStart(3, '0');
    return `${activeConfig.path}${padded}.jpg`;
  }

  // Load initial fallback frame
  const fallbackImage = new Image();
  fallbackImage.src = getFrameSrc(1);
  fallbackImage.onload = () => {
    if (!hasFirstFrameLoaded) {
      lastDrawnImage = fallbackImage;
      drawToCanvas(fallbackImage);
    }
  };

  // Responsive Canvas Sizing with Retina DPI scaling
  let lastWidth = 0;
  let lastHeight = 0;

  function resizeCanvas() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w === lastWidth && h === lastHeight) return;
    lastWidth = w;
    lastHeight = h;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    renderFrame(Math.round(sequenceState.frame));
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Draw image to canvas with cover fit (no clearRect to prevent 1-frame blanking)
  function drawToCanvas(img) {
    if (!ctx || !img || !img.complete || img.naturalWidth === 0) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const hRatio = cw / iw;
    const vRatio = ch / ih;
    const ratio = Math.max(hRatio, vRatio);

    const drawW = Math.ceil(iw * ratio);
    const drawH = Math.ceil(ih * ratio);
    const centerShiftX = Math.floor((cw - drawW) / 2);
    const centerShiftY = Math.floor((ch - drawH) / 2);

    ctx.drawImage(img, 0, 0, iw, ih, centerShiftX, centerShiftY, drawW, drawH);
  }

  // Load a single frame with memoization
  function loadFrame(index) {
    const safeIndex = Math.max(1, Math.min(frameCount, index));
    if (imageCache.has(safeIndex)) {
      return Promise.resolve(imageCache.get(safeIndex));
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.src = getFrameSrc(safeIndex);
      img.onload = () => {
        imageCache.set(safeIndex, img);
        // If user stopped on or is near this frame, render immediately
        const currentTarget = Math.round(sequenceState.frame);
        if (currentTarget === safeIndex || (Math.abs(currentTarget - safeIndex) <= 2 && lastDrawnIndex !== currentTarget)) {
          renderFrame(currentTarget);
        }
        resolve(img);
      };
      img.onerror = () => {
        resolve(null);
      };
    });
  }

  // Directional lookahead preloading
  function preloadDirectional(currentIndex, direction = 1) {
    if (direction >= 0) {
      // Scrolling Down: aggressive forward lookahead
      const forwardEnd = Math.min(frameCount, currentIndex + 45);
      for (let i = currentIndex; i <= forwardEnd; i++) {
        if (!imageCache.has(i)) loadFrame(i);
      }
      const backStart = Math.max(1, currentIndex - 10);
      for (let i = backStart; i < currentIndex; i++) {
        if (!imageCache.has(i)) loadFrame(i);
      }
    } else {
      // Scrolling Up: aggressive backward lookahead
      const backStart = Math.max(1, currentIndex - 45);
      for (let i = currentIndex; i >= backStart; i--) {
        if (!imageCache.has(i)) loadFrame(i);
      }
      const forwardEnd = Math.min(frameCount, currentIndex + 10);
      for (let i = currentIndex; i <= forwardEnd; i++) {
        if (!imageCache.has(i)) loadFrame(i);
      }
    }
  }

  // Find nearest cached frame (never flash to frame 1!)
  function getBestAvailableFrame(targetIndex) {
    // 1. Direct hit
    const exact = imageCache.get(targetIndex);
    if (exact && exact.complete && exact.naturalWidth > 0) {
      return { img: exact, index: targetIndex };
    }

    // 2. Search nearest loaded neighbor (+/- 35 frames)
    for (let offset = 1; offset <= 35; offset++) {
      const prev = targetIndex - offset;
      if (prev >= 1) {
        const imgPrev = imageCache.get(prev);
        if (imgPrev && imgPrev.complete && imgPrev.naturalWidth > 0) {
          return { img: imgPrev, index: prev };
        }
      }
      const next = targetIndex + offset;
      if (next <= frameCount) {
        const imgNext = imageCache.get(next);
        if (imgNext && imgNext.complete && imgNext.naturalWidth > 0) {
          return { img: imgNext, index: next };
        }
      }
    }

    // 3. Fallback to last drawn image
    if (lastDrawnImage && lastDrawnImage.complete && lastDrawnImage.naturalWidth > 0) {
      return { img: lastDrawnImage, index: lastDrawnIndex };
    }

    // 4. Initial fallback
    if (fallbackImage && fallbackImage.complete && fallbackImage.naturalWidth > 0) {
      return { img: fallbackImage, index: 1 };
    }

    return null;
  }

  function renderFrame(targetIndex) {
    const safeIndex = Math.max(1, Math.min(frameCount, targetIndex));
    const best = getBestAvailableFrame(safeIndex);
    if (best && best.img) {
      lastDrawnImage = best.img;
      lastDrawnIndex = best.index;
      hasFirstFrameLoaded = true;
      drawToCanvas(best.img);
    }
  }

  // Background idle sequence cache (steadily loads remaining frames in background)
  function startBackgroundPreload() {
    let nextIndex = 41;
    function preloadChunk() {
      if (nextIndex > frameCount) return;
      const end = Math.min(frameCount, nextIndex + 3);
      for (let i = nextIndex; i <= end; i++) {
        if (!imageCache.has(i)) loadFrame(i);
      }
      nextIndex = end + 1;
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(preloadChunk, { timeout: 120 });
      } else {
        setTimeout(preloadChunk, 25);
      }
    }
    setTimeout(preloadChunk, 400);
  }

  // Initial Boot: Eagerly load first ~40 frames + last 5 frames
  const initialBatch = Math.min(40, frameCount);
  let loadedCount = 0;

  const safetyTimeout = setTimeout(() => {
    if (loader && !loader.classList.contains('done')) {
      loader.classList.add('done');
    }
  }, 1000);

  for (let i = 1; i <= initialBatch; i++) {
    loadFrame(i).then((img) => {
      loadedCount++;
      if (loaderFill) {
        loaderFill.style.width = `${Math.round((loadedCount / initialBatch) * 100)}%`;
      }
      if (i === 1 && img) {
        renderFrame(1);
      }
      if (loadedCount >= Math.min(3, initialBatch)) {
        if (loader && !loader.classList.contains('done')) {
          loader.classList.add('done');
          clearTimeout(safetyTimeout);
        }
      }
      if (loadedCount === initialBatch) {
        // Kick off idle preloading once initial batch is done
        startBackgroundPreload();
      }
    });
  }

  // Eagerly preload final frames for instant hold state
  for (let i = Math.max(1, frameCount - 4); i <= frameCount; i++) {
    loadFrame(i);
  }

  // Reduced motion handling
  if (prefersReducedMotion) {
    if (wordmark) gsap.to(wordmark, { opacity: 1, y: 0, duration: 1 });
    if (submark) gsap.to(submark, { opacity: 1, y: 0, duration: 1, delay: 0.2 });
    if (loader) loader.classList.add('done');
    return;
  }

  // Pin canvas backdrop across the entire extended hero wrapper
  ScrollTrigger.create({
    trigger: '#hero-scroll-wrapper',
    start: 'top top',
    end: 'bottom bottom',
    pin: '.hero-backdrop-container',
    pinSpacing: false,
    anticipatePin: 1
  });

  // Scrub the frame sequence and branding reveal during the branding stage
  // Responsive scrub (0.15s) provides immediate responsiveness when reversing direction
  const scrubTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.hero-branding-section',
      start: 'top top',
      end: 'bottom bottom',
      scrub: isMobile ? 0.3 : 0.15,
      onUpdate: (self) => {
        const frameIndex = Math.max(1, Math.min(frameCount, Math.round(sequenceState.frame)));
        renderFrame(frameIndex);
        const direction = self.direction || 1;
        preloadDirectional(frameIndex, direction);
      }
    }
  });

  // Scrub through frame numbers from 1 to frameCount
  scrubTl.to(sequenceState, {
    frame: frameCount,
    ease: 'none',
    duration: 1
  }, 0);

  // Typography overlay animation
  if (wordmark && submark) {
    scrubTl.to([wordmark, submark], {
      opacity: 0,
      y: -30,
      stagger: 0.05,
      duration: 0.3,
      ease: 'power2.in'
    }, 0.5);
  }

  const indicator = document.querySelector('.hero-scroll-indicator');
  if (indicator) {
    scrubTl.to(indicator, {
      opacity: 0,
      duration: 0.15,
      ease: 'power1.out'
    }, 0.05);
  }
}

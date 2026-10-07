/**
 * ==============================================================================
 * SCROLL-DRIVEN IMAGE SEQUENCE ENGINE (NO CANVAS)
 * Smoothly scrubs an <img> src through 50 JPG frames with preloading & rAF
 * ==============================================================================
 */

(function initImageSequenceScroll() {
  const TOTAL_FRAMES = 50;
  const FRAME_PREFIX = 'images/ezgif-frame-';
  const FRAME_EXTENSION = '.jpg';

  // Format frame number with 3 digits (e.g., 1 -> "001")
  function getFrameSrc(index) {
    const paddedIndex = String(index).padStart(3, '0');
    return `${FRAME_PREFIX}${paddedIndex}${FRAME_EXTENSION}`;
  }

  // Preload all image frames in memory to eliminate flash, flicker, or lag
  const preloadedImages = new Map();
  let loadedCount = 0;

  function preloadFrames() {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const src = getFrameSrc(i);
      img.src = src;
      img.onload = () => {
        loadedCount++;
      };
      img.onerror = () => {
        // Fallback or retry silently
      };
      preloadedImages.set(i, img);
    }
  }

  // Preload immediately
  preloadFrames();

  document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('sequence-section');
    const sequenceImg = document.getElementById('sequence-frame');

    if (!section || !sequenceImg) return;

    let currentRenderedFrame = 1;
    let ticking = false;

    function updateFrameOnScroll() {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Section total scrollable travel distance
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance <= 0) {
        ticking = false;
        return;
      }

      // Progress: 0 when top of section meets top of viewport, 1 when bottom meets bottom
      const scrolledPastTop = -rect.top;
      const progress = Math.min(Math.max(scrolledPastTop / totalScrollableDistance, 0), 1);

      // Map progress [0, 1] to frame index [1, 50]
      const frameIndex = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.floor(progress * (TOTAL_FRAMES - 1)) + 1)
      );

      if (frameIndex !== currentRenderedFrame) {
        currentRenderedFrame = frameIndex;
        // Swap src using the cached preloaded image
        sequenceImg.src = getFrameSrc(frameIndex);
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateFrameOnScroll);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateFrameOnScroll);
        ticking = true;
      }
    }, { passive: true });

    // Initial positioning check
    updateFrameOnScroll();
  });
})();

/**
 * ==============================================================================
 * FULL-SCREEN FIXED BACKGROUND IMAGE SEQUENCE SCROLL ENGINE (NO CANVAS)
 * Smoothly scrubs background <img> through 50 JPG frames across entire document
 * ==============================================================================
 */

(function initBackgroundSequenceScroll() {
  const TOTAL_FRAMES = 50;
  const FRAME_PREFIX = 'images/ezgif-frame-';
  const FRAME_EXTENSION = '.jpg';

  // Format frame number with 3 digits (e.g. 1 -> "001")
  function getFrameSrc(index) {
    const padded = String(index).padStart(3, '0');
    return `${FRAME_PREFIX}${padded}${FRAME_EXTENSION}`;
  }

  // Preload all 50 frames into memory immediately to prevent flashing/lag
  const preloadedFrames = new Map();
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = getFrameSrc(i);
    preloadedFrames.set(i, img);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const bgImg = document.getElementById('bg-sequence-frame');
    if (!bgImg) return;

    let currentFrame = 1;
    let ticking = false;

    function onScrollUpdate() {
      // Calculate overall scroll percentage across the entire document
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = window.innerHeight || document.documentElement.clientHeight;

      const maxScrollable = scrollHeight - clientHeight;

      if (maxScrollable <= 0) {
        ticking = false;
        return;
      }

      // Progress normalized from 0.0 to 1.0
      const scrollProgress = Math.min(Math.max(scrollTop / maxScrollable, 0), 1);

      // Map progress [0, 1] across [1, 50] frames
      const targetFrame = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.floor(scrollProgress * (TOTAL_FRAMES - 1)) + 1)
      );

      // Only touch DOM if the frame changed
      if (targetFrame !== currentFrame) {
        currentFrame = targetFrame;
        bgImg.src = getFrameSrc(targetFrame);
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(onScrollUpdate);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (!ticking) {
        window.requestAnimationFrame(onScrollUpdate);
        ticking = true;
      }
    }, { passive: true });

    // Initial sync
    onScrollUpdate();
  });
})();

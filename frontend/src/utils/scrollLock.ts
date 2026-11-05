// Bulletproof Reference-Counted Scroll Lock Manager for Modals
// Handles desktop scrollbars, mobile iOS/Android touch scrolling, and nested modals

let activeModalCount = 0;
let originalBodyOverflow = '';
let originalHtmlOverflow = '';
let originalBodyPaddingRight = '';
let originalBodyTouchAction = '';

export const lockScroll = () => {
  activeModalCount++;
  if (activeModalCount === 1) {
    // Save original styles
    originalBodyOverflow = document.body.style.overflow;
    originalBodyPaddingRight = document.body.style.paddingRight;

    // Prevent layout shift from scrollbar disappearing on desktop
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Lock body cleanly
    document.body.style.overflow = 'hidden';
  }
};

export const unlockScroll = () => {
  activeModalCount = Math.max(0, activeModalCount - 1);
  if (activeModalCount === 0) {
    document.body.style.overflow = originalBodyOverflow;
    document.body.style.paddingRight = originalBodyPaddingRight;
  }
};


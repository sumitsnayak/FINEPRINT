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
    originalHtmlOverflow = document.documentElement.style.overflow;
    originalBodyPaddingRight = document.body.style.paddingRight;
    originalBodyTouchAction = document.body.style.touchAction;

    // Prevent layout shift from scrollbar disappearing on desktop
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Lock both html and body to prevent all background scrolling
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Lock touch action for iOS Safari / Mobile browsers
    document.body.style.touchAction = 'none';
  }
};

export const unlockScroll = () => {
  activeModalCount = Math.max(0, activeModalCount - 1);
  if (activeModalCount === 0) {
    document.body.style.overflow = originalBodyOverflow;
    document.documentElement.style.overflow = originalHtmlOverflow;
    document.body.style.paddingRight = originalBodyPaddingRight;
    document.body.style.touchAction = originalBodyTouchAction;
  }
};


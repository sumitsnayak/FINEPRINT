// Device and Operating System detection for cross-platform support

export type PlatformType = 'android' | 'ios' | 'mac' | 'windows' | 'other';

export function getPlatform(): {
  platform: PlatformType;
  label: string;
  isMobile: boolean;
  isPWA: boolean;
  installInstructions: string;
} {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      platform: 'other',
      label: 'Web Browser',
      isMobile: false,
      isPWA: false,
      installInstructions: 'Add to Bookmarks',
    };
  }

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;

  // iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return {
      platform: 'ios',
      label: 'Apple iOS (iPhone / iPad)',
      isMobile: true,
      isPWA,
      installInstructions: 'Tap the Share icon ⎋ below, then choose "Add to Home Screen ⊕"',
    };
  }

  // Android detection
  if (/android/i.test(userAgent)) {
    return {
      platform: 'android',
      label: 'Android Phone / Tablet',
      isMobile: true,
      isPWA,
      installInstructions: 'Tap menu ⋮ in Chrome, then select "Install app" or "Add to Home screen"',
    };
  }

  // macOS detection
  if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) {
    return {
      platform: 'mac',
      label: 'Apple macOS',
      isMobile: false,
      isPWA,
      installInstructions: 'Click the Install icon in Safari / Chrome address bar, or use Cmd+D to save app',
    };
  }

  // Windows detection
  if (/Win32|Win64|Windows|WinCE/.test(userAgent)) {
    return {
      platform: 'windows',
      label: 'Microsoft Windows',
      isMobile: false,
      isPWA,
      installInstructions: 'Click the App Install icon in your browser address bar to install as a Windows Desktop App',
    };
  }

  return {
    platform: 'other',
    label: 'Modern Web Browser',
    isMobile: false,
    isPWA,
    installInstructions: 'Add to Home Screen or Desktop',
  };
}


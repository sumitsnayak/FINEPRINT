// Web Audio API Synthesizer for Interactive Sound & Haptics
// Cross-platform compatible: iOS Safari, Android Chrome, macOS, Windows

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private lastClickTime: number = 0;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Trigger subtle, gentle tactile vibration on Android & mobile devices
  public vibrate(pattern: number | number[] = 6) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (typeof pattern === 'number') {
          // Cap button clicks & single haptics to feather-light duration (max 12ms)
          const gentleDuration = Math.min(pattern, 12);
          navigator.vibrate(gentleDuration);
        } else if (Array.isArray(pattern)) {
          // Keep intervals while dampening vibration pulses to gentle levels (max 20ms)
          const gentlePattern = pattern.map((duration, idx) =>
            idx % 2 === 0 ? Math.min(duration, 20) : Math.min(duration, 40)
          );
          navigator.vibrate(gentlePattern);
        }
      } catch {}
    }
  }

  // Futuristic Laser Scanner Beep
  public playScanBeep() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    this.vibrate(12);

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  // Success Chime for Clean & Safe Food (Score 7.5 - 10.0)
  public playSafeChime() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    this.vibrate([8, 25, 8]);

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 major chord

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = now + idx * 0.05;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch {}
  }

  // Warning Buzz for Harmful Additives / High Sodium / Palm Oil
  public playWarningBuzz() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    this.vibrate([15, 30, 15]);

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.setValueAtTime(140, now + 0.08);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  // Soft Click Tone for UI Buttons
  public playClick() {
    if (!this.enabled) return;
    const nowMs = Date.now();
    if (nowMs - this.lastClickTime < 45) return;
    this.lastClickTime = nowMs;

    this.initCtx();
    if (!this.ctx) return;
    this.vibrate(6);

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }
}

export const sounds = new SoundEngine();


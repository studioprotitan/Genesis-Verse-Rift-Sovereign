/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AmbientSoundscapeService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private lfo: OscillatorNode | null = null;
  private isPlaying: boolean = false;

  public start() {
    if (this.isPlaying) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      
      // Master Gain for smooth fade-in
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 3.0); // Low, non-intrusive 4% volume
      this.masterGain.connect(this.ctx.destination);

      // Lowpass filter with sweeping resonance for cosmic feel
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.8, this.ctx.currentTime);
      filter.connect(this.masterGain);

      // Drone base oscillator: 55Hz (Deep resonance)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(55, this.ctx.currentTime);
      
      const gain1 = this.ctx.createGain();
      gain1.gain.setValueAtTime(0.7, this.ctx.currentTime);
      osc1.connect(gain1).connect(filter);

      // Soft subharmonic hum: 110.2Hz (Detuned sawtooth)
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(110.2, this.ctx.currentTime);
      
      const gain2 = this.ctx.createGain();
      gain2.gain.setValueAtTime(0.12, this.ctx.currentTime);
      osc2.connect(gain2).connect(filter);

      // Ambient chord interval: 165Hz (Fifth harmonic)
      const osc3 = this.ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(165, this.ctx.currentTime);
      
      const gain3 = this.ctx.createGain();
      gain3.gain.setValueAtTime(0.4, this.ctx.currentTime);
      osc3.connect(gain3).connect(filter);

      // Ultra-slow LFO to shift ambient filter, simulating solar winds
      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.07, this.ctx.currentTime); // 0.07 Hz sweep

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(110, this.ctx.currentTime); // modulate filter frequency +/- 110Hz

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      // Activate nodes
      osc1.start();
      osc2.start();
      osc3.start();
      lfo.start();

      this.oscillators = [osc1, osc2, osc3];
      this.lfo = lfo;
      this.isPlaying = true;

      // Handle browser autoplay policies gracefully
      if (this.ctx.state === 'suspended') {
        const resumeCtx = () => {
          this.ctx?.resume();
          window.removeEventListener('click', resumeCtx);
          window.removeEventListener('keydown', resumeCtx);
        };
        window.addEventListener('click', resumeCtx);
        window.addEventListener('keydown', resumeCtx);
      }
    } catch (e) {
      console.warn("Web Audio Context not supported or failed to initialize:", e);
    }
  }

  public stop() {
    if (!this.isPlaying) return;
    const now = this.ctx ? this.ctx.currentTime : 0;
    
    if (this.masterGain && this.ctx) {
      // Fade out over 1.5s to prevent abrupt clicks
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0, now + 1.2);
      
      const activeOscs = [...this.oscillators];
      const activeLfo = this.lfo;
      const activeCtx = this.ctx;

      setTimeout(() => {
        try {
          activeOscs.forEach(o => o.stop());
          activeLfo?.stop();
          activeCtx.close();
        } catch (_) {}
      }, 1500);
    }
    
    this.oscillators = [];
    this.lfo = null;
    this.masterGain = null;
    this.ctx = null;
    this.isPlaying = false;
  }

  public isActive(): boolean {
    return this.isPlaying;
  }
}

export const ambientSoundscape = new AmbientSoundscapeService();

/**
 * Simulates high-fidelity electronic synthesizer wave forms for core system diagnostic feedback.
 */
export function playSyntheticDiagnosticSound(type: 'click' | 'alert' | 'peak' | 'laser' | 'success', force: boolean = false) {
  // Check if Sound Diagnostics toggle state is active in local storage (unless force-playing inside tester)
  const soundDiagnosticsEnabled = localStorage.getItem('genesis-verse-sound-diagnostics') !== 'false';
  if (!soundDiagnosticsEnabled && !force) return;

  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start();
      osc.stop(now + 0.1);
    } else if (type === 'alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(330, now + 0.3);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.05);
      gain.gain.linearRampToValueAtTime(0, now + 0.35);
      
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2).connect(ctx.destination);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.linearRampToValueAtTime(660, now + 0.3);
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(0.03, now + 0.05);
      gain2.gain.linearRampToValueAtTime(0, now + 0.35);
      
      osc.start();
      osc.stop(now + 0.35);
      osc2.start();
      osc2.stop(now + 0.35);
    } else if (type === 'peak') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.18);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.03);
      gain.gain.linearRampToValueAtTime(0, now + 0.18);
      
      osc.start();
      osc.stop(now + 0.18);
    } else if (type === 'laser') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.45);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.45);
      
      osc.start();
      osc.stop(now + 0.45);
    } else if (type === 'success') {
      osc.type = 'triangle';
      // Arpeggio sequence
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.setValueAtTime(554.37, now + 0.08); // C#5
      osc.frequency.setValueAtTime(659.25, now + 0.16); // E5
      osc.frequency.setValueAtTime(880, now + 0.24); // A5
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.04);
      gain.gain.setValueAtTime(0.05, now + 0.08);
      gain.gain.setValueAtTime(0.05, now + 0.16);
      gain.gain.setValueAtTime(0.05, now + 0.24);
      gain.gain.linearRampToValueAtTime(0, now + 0.42);
      
      osc.start();
      osc.stop(now + 0.42);
    }
  } catch (err) {
    console.warn("Synth diagnostic feedback error:", err);
  }
}

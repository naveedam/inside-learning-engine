/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientOsc: OscillatorNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private ambientGain: GainNode | null = null;

  constructor() {
    // We defer initialization until the user's first interaction to bypass browser policies
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.isMuted) {
      this.stopAmbient();
    } else {
      this.startAmbient();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }

  // -------------------------------------------------------------
  // SYNTH SOUND EFFECTS (Oscillators for pure programmatic audio)
  // -------------------------------------------------------------

  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    // High frequency rapid decay click
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playDiagnostic() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Play two quick high-tech chirps
    this.playTone(880, 0.03, 0.03, "square");
    setTimeout(() => {
      this.playTone(1760, 0.03, 0.03, "sine");
    }, 45);
  }

  public playSuccess() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Elegant minor/major interstellar chord (arpeggio)
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (this.isMuted || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.8);
      }, idx * 100);
    });
  }

  public playFailure() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // Dramatic falling bass sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = "triangle";
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.55);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.6);
  }

  public startAmbient() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || this.ambientOsc) return;

    try {
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientFilter = this.ctx.createBiquadFilter();
      this.ambientGain = this.ctx.createGain();

      this.ambientOsc.connect(this.ambientFilter);
      this.ambientFilter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      // Low cosmic cockpit hum (55Hz / A1 note + 110Hz harmonic)
      this.ambientOsc.type = "sawtooth";
      this.ambientOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

      // Low pass filter to create deep ambient background hum
      this.ambientFilter.type = "lowpass";
      this.ambientFilter.frequency.setValueAtTime(120, this.ctx.currentTime);
      this.ambientFilter.Q.setValueAtTime(1, this.ctx.currentTime);

      // Very soft volume
      this.ambientGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

      this.ambientOsc.start();
    } catch (err) {
      console.warn("Could not start ambient space hum:", err);
    }
  }

  public stopAmbient() {
    if (this.ambientOsc) {
      try {
        this.ambientOsc.stop();
        this.ambientOsc.disconnect();
      } catch (e) {}
      this.ambientOsc = null;
    }
    this.ambientFilter = null;
    this.ambientGain = null;
  }

  private playTone(freq: number, duration: number, volume: number, type: OscillatorType = "sine") {
    if (this.isMuted || !this.ctx) return;
    
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (err) {}
  }
}

export const audioEngine = new AudioEngine();
export default audioEngine;

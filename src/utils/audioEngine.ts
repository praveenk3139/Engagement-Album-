// Web Audio API Sound and Music Engine for Wedding Album

class AudioEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private soundGain: GainNode | null = null;
  private isMusicPlaying = false;
  private musicInterval: any = null;
  private soundEnabled = true;
  private musicEnabled = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        
        // Sound effects master gain
        this.soundGain = this.ctx.createGain();
        this.soundGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.soundGain.connect(this.ctx.destination);

        // Music master gain
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.musicGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Realistic Paper Turn Sound Synthesis
  public playPageTurn() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.soundGain) return;

      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.35; // 350ms duration
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate pink/brownian textured noise for paper friction
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Dynamic Bandpass Filter for paper frequency sweep
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(450, now + 0.25);
      filter.Q.setValueAtTime(1.2, now);

      // Gain Envelope
      const env = this.ctx.createGain();
      env.gain.setValueAtTime(0.001, now);
      env.gain.linearRampToValueAtTime(0.6, now + 0.04);
      env.gain.exponentialRampToValueAtTime(0.15, now + 0.18);
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      noiseSource.connect(filter);
      filter.connect(env);
      env.connect(this.soundGain);

      noiseSource.start(now);
      noiseSource.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio page turn failed', e);
    }
  }

  // Heavy Hardcover Open/Close Thud
  public playCoverThud() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.soundGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.28);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.soundGain);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn('Audio cover thud failed', e);
    }
  }

  // Play a soft romantic bell/piano note
  private playRomanticNote(freq: number, startTime: number, duration: number = 2.5, velocity: number = 0.25) {
    if (!this.ctx || !this.musicGain) return;

    // Fundamental oscillator (Warm Rhodes/Piano)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Overtone harmonic
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    // Filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, startTime);
    filter.frequency.exponentialRampToValueAtTime(600, startTime + duration);

    // Note Envelope
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(velocity, startTime + 0.03);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.musicGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  // Romantic Wedding Arpeggiated Melody Progression
  public startMusic() {
    this.initContext();
    if (!this.ctx || this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    this.musicEnabled = true;

    // Note frequencies in Hz
    const NOTES = {
      C3: 130.81, E3: 164.81, G3: 196.00, B3: 246.94,
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
      G4: 392.00, A4: 440.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99
    };

    // Romantic Wedding chord arpeggios
    const chordSequences = [
      // C Major (Love & Purity)
      [NOTES.C3, NOTES.G3, NOTES.C4, NOTES.E4, NOTES.G4, NOTES.C5, NOTES.E5, NOTES.G4],
      // G/B (Gentle transition)
      [NOTES.B3, NOTES.G3, NOTES.D4, NOTES.G4, NOTES.B4, NOTES.D5, NOTES.G4, NOTES.D4],
      // A Minor (Depth & Emotion)
      [NOTES.A4, NOTES.E3, NOTES.A4, NOTES.C4, NOTES.E4, NOTES.A4, NOTES.C5, NOTES.E4],
      // F Major 7 (Romance)
      [NOTES.F4, NOTES.C4, NOTES.E4, NOTES.A4, NOTES.C5, NOTES.E5, NOTES.A4, NOTES.C4],
      // E Minor (Harmony)
      [NOTES.E3, NOTES.B3, NOTES.E4, NOTES.G4, NOTES.B4, NOTES.E5, NOTES.G4, NOTES.E4],
      // F Major add9 (Blessings)
      [NOTES.F4, NOTES.A4, NOTES.C4, NOTES.G4, NOTES.C5, NOTES.G5, NOTES.C5, NOTES.A4],
      // G Sus4 -> G (Celebration)
      [NOTES.G3, NOTES.D4, NOTES.G4, NOTES.C5, NOTES.D5, NOTES.B4, NOTES.G4, NOTES.D4]
    ];

    let currentChord = 0;
    const tempo = 450; // ms per note

    const playChordLoop = () => {
      if (!this.isMusicPlaying || !this.ctx) return;
      const notes = chordSequences[currentChord];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const time = now + (idx * tempo) / 1000;
        this.playRomanticNote(freq, time, 3.2, idx === 0 ? 0.28 : 0.18);
      });

      currentChord = (currentChord + 1) % chordSequences.length;
    };

    playChordLoop();
    this.musicInterval = setInterval(playChordLoop, chordSequences[0].length * tempo);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    this.musicEnabled = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public setSoundEnabled(val: boolean) {
    this.soundEnabled = val;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }

  public setMusicVolume(vol: number) {
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }
}

export const audioEngine = new AudioEngine();

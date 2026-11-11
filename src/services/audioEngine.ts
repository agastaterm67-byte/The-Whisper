/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class HorrorAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  
  // Continuous audio nodes
  private ambientGain: GainNode | null = null;
  private droneOscL: OscillatorNode | null = null;
  private droneOscR: OscillatorNode | null = null;
  
  // Heartbeat state
  private heartbeatInterval: number | null = null;
  private currentBpm: number = 60;
  
  // Clock ticking
  private clockTickToggle: boolean = false;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.startAmbientDrone();
    } catch (e) {
      console.warn("AudioContext init error:", e);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.7, this.ctx.currentTime, 0.05);
    }
  }

  public getIsMuted() {
    return this.isMuted;
  }

  private startAmbientDrone() {
    if (!this.ctx || !this.masterGain) return;

    // Binaural Theta Beat: 108Hz (left) and 112Hz (right) => 4Hz psychoacoustic binaural beat
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    // Left channel
    const merger = this.ctx.createChannelMerger(2);
    
    this.droneOscL = this.ctx.createOscillator();
    this.droneOscL.type = 'sawtooth';
    this.droneOscL.frequency.setValueAtTime(108, this.ctx.currentTime);
    const filterL = this.ctx.createBiquadFilter();
    filterL.type = 'lowpass';
    filterL.frequency.setValueAtTime(160, this.ctx.currentTime);
    this.droneOscL.connect(filterL);
    filterL.connect(merger, 0, 0);

    // Right channel
    this.droneOscR = this.ctx.createOscillator();
    this.droneOscR.type = 'sawtooth';
    this.droneOscR.frequency.setValueAtTime(112, this.ctx.currentTime);
    const filterR = this.ctx.createBiquadFilter();
    filterR.type = 'lowpass';
    filterR.frequency.setValueAtTime(160, this.ctx.currentTime);
    this.droneOscR.connect(filterR);
    filterR.connect(merger, 0, 1);

    merger.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);

    this.droneOscL.start();
    this.droneOscR.start();
  }

  public playClockTick() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    
    // High-precision vintage escapement mechanical pendulum tick
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

    this.clockTickToggle = !this.clockTickToggle;
    osc.frequency.setValueAtTime(this.clockTickToggle ? 1400 : 1050, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    if (panner) {
      panner.pan.setValueAtTime(this.clockTickToggle ? 0.35 : -0.35, now);
      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.masterGain);
    } else {
      osc.connect(gain);
      gain.connect(this.masterGain);
    }

    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playFootstep(isPlayer: boolean = true, isGhost: boolean = false) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Wood floor creak / heel impact
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = isGhost ? 'bandpass' : 'lowpass';
    filter.frequency.setValueAtTime(isGhost ? 450 : 220, now);
    filter.Q.setValueAtTime(2, now);

    const gain = this.ctx.createGain();
    const vol = isGhost ? 0.25 : (isPlayer ? 0.3 : 0.6);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (panner && isGhost) {
      // Panned to an eerie behind/left angle
      panner.pan.setValueAtTime(Math.sin(now * 2) * 0.8, now);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(panner);
      panner.connect(this.masterGain);
    } else {
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
    }

    noise.start(now);
  }

  public playHeartbeat(bpm: number = 70) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    this.currentBpm = bpm;

    // Lub (lower, rounder)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.frequency.setValueAtTime(55, now);
    osc1.frequency.exponentialRampToValueAtTime(32, now + 0.12);
    gain1.gain.setValueAtTime(0.5, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(now);
    osc1.stop(now + 0.13);

    // Dub (slightly higher, after 0.14s)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.frequency.setValueAtTime(65, now + 0.14);
    osc2.frequency.exponentialRampToValueAtTime(38, now + 0.25);
    gain2.gain.setValueAtTime(0.35, now + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start(now + 0.14);
    osc2.stop(now + 0.26);
  }

  public updateSanityAudio(sanity: number) {
    if (!this.ctx || this.isMuted) return;
    // Map sanity 0-100 to heartbeat BPM (140 to 60)
    const targetBpm = Math.round(140 - (sanity / 100) * 80);
    this.currentBpm = targetBpm;

    // Adjust ambient drone tension
    if (this.ambientGain && this.ctx) {
      const tensionGain = 0.12 + ((100 - sanity) / 100) * 0.25;
      this.ambientGain.gain.setTargetAtTime(tensionGain, this.ctx.currentTime, 0.5);
    }
  }

  public playBlackoutSlam() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // 1. Industrial high-voltage breaker disconnect (sharp metallic clack)
    const oscClick = this.ctx.createOscillator();
    const gainClick = this.ctx.createGain();
    oscClick.type = 'triangle';
    oscClick.frequency.setValueAtTime(800, now);
    oscClick.frequency.exponentialRampToValueAtTime(80, now + 0.08);
    gainClick.gain.setValueAtTime(0.8, now);
    gainClick.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    oscClick.connect(gainClick);
    gainClick.connect(this.masterGain);
    oscClick.start(now);
    oscClick.stop(now + 0.1);

    // 2. Heavy sub-bass building shudder
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(90, now);
    subOsc.frequency.exponentialRampToValueAtTime(25, now + 1.2);
    subGain.gain.setValueAtTime(0.9, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + 1.3);

    // 3. Electrical spark / whine dying out
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.4, this.ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * Math.sin(i * 0.05);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.4);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(now);
  }

  public playWhisper(pannedLeft: boolean = true) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Resonant formant filter cluster over white noise to simulate eerie human whisper
    const duration = 1.4;
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / data.length) * Math.PI);
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    // Formant 1: ~700Hz, Formant 2: ~1800Hz
    const f1 = this.ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.setValueAtTime(750, now);
    f1.Q.setValueAtTime(4, now);

    const f2 = this.ctx.createBiquadFilter();
    f2.type = 'bandpass';
    f2.frequency.setValueAtTime(1900, now);
    f2.Q.setValueAtTime(5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(pannedLeft ? -0.85 : 0.85, now);
      source.connect(f1);
      source.connect(f2);
      f1.connect(gain);
      f2.connect(gain);
      gain.connect(panner);
      panner.connect(this.masterGain);
    } else {
      source.connect(f1);
      source.connect(f2);
      f1.connect(gain);
      f2.connect(gain);
      gain.connect(this.masterGain);
    }

    source.start(now);
  }

  public playPanicGasp() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Sharp intake of air (breath fail)
    const duration = 0.55;
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(i / data.length, 1.5);
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.linearRampToValueAtTime(1400, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start(now);
  }

  public playFlashlightClick(turnOn: boolean) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(turnOn ? 1800 : 900, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  public playPillsTake() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Plastic bottle rattle + swallow tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.18);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playShiftEndBell() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // 04:00 AM Town Hall / Archive shift bell chime (triumphant relief)
    [392, 523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.3);
      gain.gain.setValueAtTime(0.4, now + idx * 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.3 + 2.5);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + idx * 0.3);
      osc.stop(now + idx * 0.3 + 2.6);
    });
  }
}

export const audioEngine = new HorrorAudioEngine();

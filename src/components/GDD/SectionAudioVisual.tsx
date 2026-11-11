/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, Sliders, Film, Tv, Radio, Headphones } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

export const SectionAudioVisual: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Visual Pipeline & Shader Specifications */}
      <div className="p-6 rounded-xl bg-[#0f1117] border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2.5 text-zinc-100 font-bold text-lg font-cinzel">
          <Tv className="w-5 h-5 text-amber-500" />
          <h3>Retro VHS & Analog Surveillance Post-Processing Pipeline</h3>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          The retro analog aesthetic in "The 3 AM Whisper" is constructed via a sequence of full-screen fragment shader passes designed to simulate a 1990s magnetic tape playback through a low-grade institutional surveillance CRT monitor.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-code">
          <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 space-y-2">
            <span className="text-amber-400 font-bold block">1. Chromatic Aberration & Lens Curvature</span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Red and Blue color channels are displaced radially using barrel distortion. Channel offsets scale dynamically with player panic and sanity degradation:
            </p>
            <div className="p-2 bg-[#08090d] rounded text-[10px] text-zinc-300">
              vec2 uv_r = uv + (dir * offset * sanity_loss);<br />
              vec2 uv_b = uv - (dir * offset * sanity_loss);
            </div>
          </div>

          <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 space-y-2">
            <span className="text-amber-400 font-bold block">2. Interlaced Scanlines & Tape Tracking Jitter</span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Alternating 3px scanline bars modulated by a periodic sine wave. A rolling horizontal tracking noise band traverses vertically every 8 seconds, mimicking worn tape heads.
            </p>
            <div className="p-2 bg-[#08090d] rounded text-[10px] text-zinc-300">
              float scan = sin(uv.y * screen_height * 0.5) * 0.28;<br />
              float tracking_bar = smoothstep(0.0, 0.05, abs(uv.y - tracking_y));
            </div>
          </div>
        </div>
      </div>

      {/* Audio Design & Psychoacoustics */}
      <div className="p-6 rounded-xl bg-[#0f1117] border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-zinc-100 font-bold text-lg font-cinzel">
            <Headphones className="w-5 h-5 text-cyan-400" />
            <h3>Binaural Psychoacoustic Audio Design Specifications</h3>
          </div>
          <span className="text-xs font-mono-code text-cyan-400">Headphones Recommended</span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          Standard jump-scare audio is replaced by psychoacoustic tension building. Infrasonic frequencies and binaural beat interference produce involuntary physiological dread.
        </p>

        {/* Audio Layer Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono-code">
          <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 space-y-2">
            <span className="text-cyan-400 font-bold block">4Hz Theta Binaural Drone</span>
            <div className="text-[10px] text-zinc-400">Frequency: 108Hz (L) / 112Hz (R)</div>
            <p className="text-zinc-400 text-[11px]">
              Subtle difference creates a 4Hz neural entrainment beat associated with hypnagogia, sleep paralysis, and intense foreboding.
            </p>
          </div>

          <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 space-y-2">
            <span className="text-amber-400 font-bold block">Grandfather Clock Escapement</span>
            <div className="text-[10px] text-zinc-400">Frequency: 1400Hz Tick / 1050Hz Tock</div>
            <p className="text-zinc-400 text-[11px]">
              Spatialized across 70% stereo field. Constant reminder of the relentless countdown towards the 03:00 blackout.
            </p>
          </div>

          <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 space-y-2">
            <span className="text-rose-400 font-bold block">Formant Whisper Cluster</span>
            <div className="text-[10px] text-zinc-400">Bandpass: F1=750Hz, F2=1900Hz</div>
            <p className="text-zinc-400 text-[11px]">
              White noise filtered through human vocal tract formants to synthesize disembodied whispers directly into the player's ear canal.
            </p>
          </div>
        </div>

        {/* Interactive Soundboard Test Controls */}
        <div className="pt-4 border-t border-zinc-800">
          <div className="text-xs font-mono-code text-zinc-400 mb-2 uppercase flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Sound Engine Demo Triggers (Click to preview Web Audio API)</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => audioEngine.playClockTick()}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md font-mono-code text-xs border border-zinc-700"
            >
              Tick Clock (Escapement)
            </button>
            <button
              onClick={() => audioEngine.playWhisper(true)}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md font-mono-code text-xs border border-zinc-700"
            >
              Binaural Whisper (Left Ear)
            </button>
            <button
              onClick={() => audioEngine.playWhisper(false)}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md font-mono-code text-xs border border-zinc-700"
            >
              Binaural Whisper (Right Ear)
            </button>
            <button
              onClick={() => audioEngine.playHeartbeat(130)}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-rose-300 rounded-md font-mono-code text-xs border border-zinc-700"
            >
              Tachycardia Heartbeat (130 BPM)
            </button>
            <button
              onClick={() => audioEngine.playBlackoutSlam()}
              className="px-3 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-200 rounded-md font-mono-code text-xs border border-rose-800"
            >
              03:00 Breaker Slam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

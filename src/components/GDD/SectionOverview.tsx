/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Eye, Radio, Film, Compass, ShieldAlert, Sparkles } from 'lucide-react';

export const SectionOverview: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* High Concept Hero Box */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#131620] via-[#0d0f15] to-[#07080b] border border-zinc-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2 text-xs font-mono-code text-amber-500 uppercase tracking-widest mb-2">
          <span>Project Codex</span>
          <span>·</span>
          <span>Survival Psychological Stealth</span>
          <span>·</span>
          <span>PC / Console Blueprint</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold font-cinzel text-zinc-100 tracking-tight mb-4">
          The 3 AM Whisper
        </h2>

        <p className="text-base text-zinc-300 leading-relaxed max-w-3xl">
          A tension-fueled first-person psychological survival horror game set inside a forgotten municipal historical archives center secretly built above a colonial-era psychiatric asylum. You play as a solitary night archivist navigating a solitary three-hour shift (01:00 AM to 04:00 AM) where cataloging decaying case files becomes a desperate fight for survival against sensory-reactive horrors and a mandatory 10-minute total blackout.
        </p>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-zinc-800/80">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="text-amber-400 font-mono-code text-xs font-bold uppercase mb-1">
              01. Claustrophobic Darkness
            </div>
            <div className="text-sm font-semibold text-zinc-200 mb-1">Limited Light as a Double-Edged Sword</div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your flashlight wards off crippling sanity decay, but casts harsh beam silhouettes that summon entities lurking in adjacent hallways.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="text-rose-400 font-mono-code text-xs font-bold uppercase mb-1">
              02. Mandatory 03:00 Blackout
            </div>
            <div className="text-sm font-semibold text-zinc-200 mb-1">The 10-Minute Terror Shift</div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every night at exactly 03:00 AM, the facility grid collapses. The Caretaker awakens to patrol the aisles. Stealth and breath suppression become sole survival vectors.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="text-cyan-400 font-mono-code text-xs font-bold uppercase mb-1">
              03. Psychoacoustic Immersion
            </div>
            <div className="text-sm font-semibold text-zinc-200 mb-1">Binaural Hallucinations</div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Synthesized 3D spatial audio blurs the line between real threats and sanity-induced phantom footsteps, whispers, and erratic heartbeats.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Concept & Atmosphere Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visual Style & Camera */}
        <div className="p-6 rounded-xl bg-[#0f1117] border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2.5 text-zinc-100 font-bold text-lg font-cinzel">
            <Film className="w-5 h-5 text-amber-500" />
            <h3>Visual Style & VHS Aesthetic</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The game evokes late-90s analog surveillance and found-footage psychological horror, utilizing physical shader layers:
          </p>
          
          <ul className="space-y-2.5 text-xs text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">·</span>
              <span><strong>Analog CRT / VHS Post-Processing:</strong> Dynamic scanline distortion, tape tracking wobble, subtle RGB chromatic displacement, and authentic camcorder OSD (REC, SP mode, timestamp).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">·</span>
              <span><strong>Dramatic Shadow Mapping:</strong> High-contrast volumetric flashlight cone with physical inverse-square falloff and sharp shadow projection behind archive shelving units.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">·</span>
              <span><strong>Claustrophobic Lighting Palette:</strong> Deep institutional obsidians, sickly pale fluorescent greens (banker lamp), and emergency sodium red flashes during blackout.</span>
            </li>
          </ul>
        </div>

        {/* Audio Design & Psychoacoustics */}
        <div className="p-6 rounded-xl bg-[#0f1117] border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2.5 text-zinc-100 font-bold text-lg font-cinzel">
            <Radio className="w-5 h-5 text-cyan-400" />
            <h3>Audio Design & Binaural Soundscape</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Minimalist music design prioritizing psychoacoustics and environmental Foley rather than orchestral scoring:
          </p>

          <ul className="space-y-2.5 text-xs text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">·</span>
              <span><strong>4Hz Theta Binaural Drone:</strong> Continuous dual-frequency subsonic hum (108Hz Left, 112Hz Right) creating an involuntary feeling of anxiety in stereo headphones.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">·</span>
              <span><strong>Mechanical Grandfather Clock:</strong> Loud pendulum escapement clicks that establish rhythm, pacing, and shift dread.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">·</span>
              <span><strong>Dynamic Spatial Whispers:</strong> Stereo panning whisper phrases ("He's behind you", "Don't breathe") trigger at close proximity or low sanity.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">·</span>
              <span><strong>Acoustic Echoes & Floor Creaks:</strong> Wood floorboard stresses that betray player movement to The Patient crawling overhead.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

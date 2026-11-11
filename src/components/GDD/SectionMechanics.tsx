/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Brain, Wind, Battery, FileText, Activity, Shield, AlertTriangle } from 'lucide-react';

export const SectionMechanics: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* 1. Sanity System & Decay Formula */}
      <div className="p-6 rounded-xl bg-[#0f1117] border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2.5 text-zinc-100 font-bold text-lg font-cinzel">
          <Brain className="w-5 h-5 text-purple-400" />
          <h3>Sanity Meter & Psychological Degradation Formula</h3>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          Sanity is represented as a float from 0.0 to 100.0. Unlike health, it governs the player's perceptual reliability. The degradation function is modeled as:
        </p>

        {/* Formula Display Box */}
        <div className="p-4 rounded-lg bg-[#08090d] border border-zinc-800 text-xs font-mono-code text-zinc-200 space-y-2">
          <div className="text-purple-400 font-bold">
            ΔSanity = - [ (DarknessRate × IsDark) + (EntityProximityRate × (1 / Distance²)) ] + (LightRecoveryRate × IsNearSafeLamp)
          </div>
          <div className="text-[11px] text-zinc-500">
            Where DarknessRate = 1.8/sec, EntityProximityRate = 45.0, SafeLampRecovery = +2.2/sec, and Sedative Pill = +35.0 instant.
          </div>
        </div>

        {/* Sanity Stages Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-code border border-zinc-800 rounded-lg overflow-hidden">
            <thead className="bg-[#141722] text-zinc-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Sanity Range</th>
                <th className="p-3">Psychological State</th>
                <th className="p-3">Visual Distortion</th>
                <th className="p-3">Auditory Hallucinations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
              <tr className="bg-zinc-900/30">
                <td className="p-3 text-emerald-400 font-bold">100% - 75%</td>
                <td className="p-3">Lucid & Composed</td>
                <td className="p-3 text-zinc-400">None (Clean VHS view)</td>
                <td className="p-3 text-zinc-400">Resting 60 BPM heartbeat</td>
              </tr>
              <tr className="bg-zinc-900/30">
                <td className="p-3 text-amber-400 font-bold">74% - 50%</td>
                <td className="p-3">Mild Paranoia</td>
                <td className="p-3 text-zinc-400">Subtle edge vignette darkening</td>
                <td className="p-3 text-zinc-400">Faint binaural whispers in stereo</td>
              </tr>
              <tr className="bg-zinc-900/30">
                <td className="p-3 text-orange-400 font-bold">49% - 25%</td>
                <td className="p-3">Acute Hallucination</td>
                <td className="p-3 text-zinc-400">Chromatic aberration, camera sway</td>
                <td className="p-3 text-zinc-400">Ghost footstep echoes behind player</td>
              </tr>
              <tr className="bg-rose-950/20">
                <td className="p-3 text-rose-500 font-bold">24% - 0%</td>
                <td className="p-3">Psychotic Breakdown</td>
                <td className="p-3 text-rose-300 font-bold">Radial lens blur, shadow figures</td>
                <td className="p-3 text-rose-300 font-bold">Involuntary ragged gasping (95dB noise)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Hiding & Breath-Holding QTE Mechanics */}
      <div className="p-6 rounded-xl bg-[#0f1117] border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2.5 text-zinc-100 font-bold text-lg font-cinzel">
          <Wind className="w-5 h-5 text-cyan-400" />
          <h3>Hiding Spots & Rhythmic Breath-Holding QTE</h3>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          The player cannot fight the paranormal entities. Survival depends entirely on environmental concealment and physiologic breath control.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-2">
            <h4 className="text-sm font-bold text-zinc-200 font-cinzel">Hiding Spot Types</h4>
            <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
              <li><strong>Tall Steel Filing Cabinets:</strong> Enclosed locker view looking through narrow horizontal vent slats. 100% optical concealment.</li>
              <li><strong>Archivist Oak Desks:</strong> Ducking under the kneehole recess. Provides 80% concealment from distant entities, but requires keeping the flashlight completely off.</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-2">
            <h4 className="text-sm font-bold text-zinc-200 font-cinzel">The Breath-Holding Mechanics</h4>
            <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
              <li><strong>Lung Capacity (100%):</strong> While holding [SPACE], noise drops to 0 dB, but lungs deplete in ~7 seconds.</li>
              <li><strong>Heartbeat Rhythm Timing:</strong> A pulsing timing reticle matches character BPM. Mistimed releases cause a chest clutch.</li>
              <li><strong>Exhaustion Gasp:</strong> If lung capacity hits 0%, an involuntary gasp triggers (95 dB noise), immediately alerting The Caretaker to breach the cabinet.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Resource Management & Archival Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl bg-[#0f1117] border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm font-cinzel">
            <Battery className="w-4 h-4" />
            <h4>Flashlight Battery</h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Halogen bulb draws 100% battery over 4 minutes of continuous usage. Below 20%, the beam flickers erratically, accelerating player sanity loss. Scavenge high-capacity D-cell batteries in storage lockers.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#0f1117] border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm font-cinzel">
            <Activity className="w-4 h-4" />
            <h4>Phenobarbital Sedatives</h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Amber pharmaceutical bottles containing sedative tablets. Instantly restores +35% Sanity, suppresses ragged breathing, and stabilizes heartbeat for 30 seconds. Finite quantity (3-4 bottles per shift).
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#0f1117] border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm font-cinzel">
            <FileText className="w-4 h-4" />
            <h4>Asylum File Cataloging</h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Players must find 4 historical intake files hidden in different rooms, bring them to the central microfilm reader, and sort them into the catalog. Completing all 4 files unlocks the shift pay and true survival ending.
          </p>
        </div>
      </div>
    </div>
  );
};

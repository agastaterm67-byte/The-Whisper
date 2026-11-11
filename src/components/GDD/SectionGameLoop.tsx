/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clock, Search, Zap, Skull, Bell, ArrowRight, ShieldCheck } from 'lucide-react';

export const SectionGameLoop: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Shift Timeline Banner */}
      <div className="p-6 rounded-xl bg-[#0f1117] border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono-code text-amber-500 uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Shift Progression Architecture (01:00 AM – 04:00 AM)</span>
          </div>
          <span className="text-xs font-mono-code text-zinc-500">Total Shift Length: 180 In-Game Mins</span>
        </div>

        {/* Phase Bar Visual */}
        <div className="w-full h-8 rounded-lg overflow-hidden flex border border-zinc-700/80 text-[11px] font-mono-code font-bold">
          <div className="w-[66%] bg-cyan-950/80 border-r border-cyan-800 text-cyan-300 flex items-center justify-center px-2">
            Phase 1: Exploration & Scavenging (01:00 - 02:59)
          </div>
          <div className="w-[6%] bg-rose-950 border-r border-rose-700 text-rose-300 flex items-center justify-center animate-pulse px-1 text-[10px]">
            03:00
          </div>
          <div className="w-[28%] bg-amber-950/80 text-amber-300 flex items-center justify-center px-2">
            Phase 3: Escalation (03:11 - 04:00)
          </div>
        </div>

        <div className="flex justify-between text-[11px] font-mono-code text-zinc-500">
          <span>01:00 AM (Clock In)</span>
          <span>02:00 AM</span>
          <span className="text-rose-400 font-bold">03:00 AM (Blackout)</span>
          <span>03:10 AM</span>
          <span className="text-emerald-400 font-bold">04:00 AM (Shift Bell)</span>
        </div>
      </div>

      {/* 3 Core Phases Breakdown */}
      <div className="space-y-6">
        {/* Phase 1 */}
        <div className="p-6 rounded-xl bg-[#0f1117] border border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-bold text-xs font-mono-code">
                P1
              </span>
              <h4 className="text-lg font-bold font-cinzel text-zinc-100">
                Phase 1: Exploration, Cataloging & Scavenging (01:00 – 02:59)
              </h4>
            </div>
            <span className="text-xs font-mono-code text-cyan-400">119 Minutes</span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed mb-4">
            The archivist enters the facility. Main overhead lights buzz intermittently. The primary task is to explore archival aisles, locate 4 classified intake files, scan them at the microfilm terminal, and scavenge spare flashlight batteries and sedative pill bottles.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono-code">
            <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
              <span className="text-zinc-400 block text-[10px] uppercase">Threat Level</span>
              <span className="text-emerald-400 font-bold">Low / Dormant</span>
              <span className="text-zinc-500 block text-[10px] mt-1">The Patient twitches on ceiling; reactivates only upon running.</span>
            </div>
            <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
              <span className="text-zinc-400 block text-[10px] uppercase">Sanity Drain</span>
              <span className="text-cyan-400 font-bold">Moderate (Dark Aisles)</span>
              <span className="text-zinc-500 block text-[10px] mt-1">Easily mitigated by the banker desk lamp.</span>
            </div>
            <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
              <span className="text-zinc-400 block text-[10px] uppercase">Player Priority</span>
              <span className="text-amber-400 font-bold">Memorize Hiding Spots</span>
              <span className="text-zinc-500 block text-[10px] mt-1">Locate desks & filing lockers before the clock strikes 03:00.</span>
            </div>
          </div>
        </div>

        {/* Phase 2: The Blackout */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-rose-950/40 via-[#0f1117] to-[#0f1117] border border-rose-900/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-rose-950 text-rose-400 border border-rose-700 flex items-center justify-center font-bold text-xs font-mono-code">
                P2
              </span>
              <h4 className="text-lg font-bold font-cinzel text-zinc-100 flex items-center gap-2">
                <span>Phase 2: Total Blackout Phase (03:00 – 03:10)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-600/30 text-rose-300 font-mono-code uppercase">
                  Mandatory Stealth
                </span>
              </h4>
            </div>
            <span className="text-xs font-mono-code text-rose-400 font-bold">10 Minutes</span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed mb-4">
            At exactly 03:00 AM, the central power breakers trip with a thunderous clank. All standard lights extinguish, leaving only an ominous spinning red emergency beacon. The Caretaker awakens at the north corridor gates and patrols aisle by aisle. Flashlights must be extinguished immediately.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono-code">
            <div className="p-3 bg-rose-950/30 rounded-lg border border-rose-900/40">
              <span className="text-zinc-400 block text-[10px] uppercase">Active Entity</span>
              <span className="text-rose-400 font-bold">The Caretaker</span>
              <span className="text-zinc-400 block text-[10px] mt-1">Instant death on direct visual or auditory contact.</span>
            </div>
            <div className="p-3 bg-rose-950/30 rounded-lg border border-rose-900/40">
              <span className="text-zinc-400 block text-[10px] uppercase">Core Mechanic</span>
              <span className="text-amber-400 font-bold">Rhythmic Breath Hold [QTE]</span>
              <span className="text-zinc-400 block text-[10px] mt-1">Player must tap/hold Space while hidden as footsteps pass.</span>
            </div>
            <div className="p-3 bg-rose-950/30 rounded-lg border border-rose-900/40">
              <span className="text-zinc-400 block text-[10px] uppercase">Failure Consequence</span>
              <span className="text-rose-500 font-bold">Gasp & Locker Breach</span>
              <span className="text-zinc-400 block text-[10px] mt-1">Failing breath hold spikes noise to 95dB, prompting fatal attack.</span>
            </div>
          </div>
        </div>

        {/* Phase 3 */}
        <div className="p-6 rounded-xl bg-[#0f1117] border border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center font-bold text-xs font-mono-code">
                P3
              </span>
              <h4 className="text-lg font-bold font-cinzel text-zinc-100">
                Phase 3: Escalating Aggression to the 04:00 Bell (03:11 – 04:00)
              </h4>
            </div>
            <span className="text-xs font-mono-code text-amber-400">49 Minutes</span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed mb-4">
            Emergency power flickers back online, but only at 30% intensity. The Caretaker retreats into deep shadows, while The Patient becomes hyper-aggressive, descending to shoulder height along ceiling conduits. The archivist must rush to catalog the final documents while managing depleted sedatives until the town hall church bell rings at 04:00 AM.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono-code">
            <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
              <span className="text-zinc-400 block text-[10px] uppercase">Environmental Tone</span>
              <span className="text-amber-400 font-bold">Flickering Dim Light</span>
              <span className="text-zinc-500 block text-[10px] mt-1">Unreliable circuits cause mini 5-second brownouts.</span>
            </div>
            <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
              <span className="text-zinc-400 block text-[10px] uppercase">Escalation Formula</span>
              <span className="text-rose-400 font-bold">Aggression = (Time - 190) * 1.5</span>
              <span className="text-zinc-500 block text-[10px] mt-1">Entity speed and sensory cones expand exponentially.</span>
            </div>
            <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
              <span className="text-zinc-400 block text-[10px] uppercase">Victory Condition</span>
              <span className="text-emerald-400 font-bold">Survive until 04:00 AM Bell</span>
              <span className="text-zinc-500 block text-[10px] mt-1">Entities dissolve into floor vents; shift pay envelope awarded.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

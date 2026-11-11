/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GDDTab } from '../../types/game';
import { SectionOverview } from './SectionOverview';
import { SectionLore } from './SectionLore';
import { SectionGameLoop } from './SectionGameLoop';
import { SectionMechanics } from './SectionMechanics';
import { SectionLevelBlueprint } from './SectionLevelBlueprint';
import { SectionScriptTemplates } from './SectionScriptTemplates';
import { SectionAudioVisual } from './SectionAudioVisual';
import { 
  BookOpen, 
  Layers, 
  Activity, 
  Map, 
  FileCode, 
  Headphones, 
  Download, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface GDDViewerProps {
  onSwitchToSimulation: () => void;
}

export const GDDViewer: React.FC<GDDViewerProps> = ({ onSwitchToSimulation }) => {
  const [activeTab, setActiveTab] = useState<GDDTab>('overview');

  const navItems: Array<{ id: GDDTab; label: string; icon: React.ReactNode; num: string }> = [
    { id: 'overview', label: '1. Executive Pitch & Pillars', icon: <BookOpen className="w-4 h-4" />, num: '01' },
    { id: 'lore', label: '2. Lore, Protagonist & Entities', icon: <Layers className="w-4 h-4" />, num: '02' },
    { id: 'loop', label: '3. 01:00-04:00 Shift Game Loop', icon: <Activity className="w-4 h-4" />, num: '03' },
    { id: 'mechanics', label: '4. Systems: Sanity, Hiding & Breath', icon: <Activity className="w-4 h-4" />, num: '04' },
    { id: 'blueprint', label: '5. Facility Architectural Blueprint', icon: <Map className="w-4 h-4" />, num: '05' },
    { id: 'scripts', label: '6. Unity & Godot Script Templates', icon: <FileCode className="w-4 h-4" />, num: '06' },
    { id: 'audio-visual', label: '7. Binaural Audio & VHS Shaders', icon: <Headphones className="w-4 h-4" />, num: '07' }
  ];

  const exportGDDMarkdown = () => {
    const content = `# The 3 AM Whisper - Game Design Document (GDD)
Genre: Psychological Horror / Survival Stealth
Visual Style: Dark, Claustrophobic, Retro VHS Aesthetic
Setting: Blackwood Historical Archives over Colonial-Era Insane Asylum

## 1. Concept & Atmosphere
- Visual Style: Heavy shadow mapping, volumetric flashlight cone, 90s CRT/VHS analog filter.
- Audio Design: 4Hz Theta binaural drone, pendulum clock escapement, binaural whisper formants, spatial footstep echoes.

## 2. Core Game Loop
- 01:00 - 02:59: Exploration, document collection, scanning files, and scavenging flashlight batteries and sedatives.
- 03:00 - 03:10: Total Blackout Phase. Power grid fails. The Caretaker patrols the halls. Pure hiding & breath suppression.
- 03:11 - 04:00: Emergency power restores at 30%. Entities become aggressive until the 04:00 AM church bell rings.

## 3. Core Mechanics
- Sanity Meter: Decays in darkness and near entities. Induces chromatic aberration, tunnel vision, ghost footsteps, and heavy breathing.
- Hiding & Breath-Holding QTE: Hide inside steel filing cabinets or under wooden desks. Press [SPACE] to hold breath; lung capacity depletes over 7 seconds. Exhaustion causes a loud 95dB panic gasp.
- Resource Economy: Flashlight battery decay (4 mins), sedative pills (+35% sanity), classified asylum files.

## 4. Production Script Architecture
Includes full production C# (Unity) and GDScript (Godot 4) templates for GameClockManager, SanitySystem, HidingAndBreathController, and CaretakerAI.
`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'The_3_AM_Whisper_GDD.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#090a0f]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-[#0c0e14] border-r border-zinc-800 flex flex-col justify-between shrink-0">
        <div className="p-5 space-y-5">
          <div>
            <div className="text-[10px] font-mono-code uppercase tracking-widest text-amber-500 mb-1">
              Game Design Document
            </div>
            <h1 className="text-base font-bold font-cinzel text-zinc-100">
              The 3 AM Whisper
            </h1>
            <p className="text-[11px] text-zinc-500 font-mono-code mt-0.5">
              Rev 1.4 · Master Blueprint
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-mono-code transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-amber-400' : 'text-zinc-500'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-zinc-600'}`} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Launch Simulation & Export GDD */}
        <div className="p-4 border-t border-zinc-800/80 bg-[#0e1017] space-y-2">
          <button
            onClick={onSwitchToSimulation}
            className="w-full py-2.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono-code text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50"
          >
            <span>Launch 3D Simulation</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={exportGDDMarkdown}
            className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono-code text-[11px] transition-colors flex items-center justify-center gap-1.5 border border-zinc-700/60"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export GDD (Markdown)</span>
          </button>
        </div>
      </aside>

      {/* Main GDD Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#08090d]">
        {activeTab === 'overview' && <SectionOverview />}
        {activeTab === 'lore' && <SectionLore />}
        {activeTab === 'loop' && <SectionGameLoop />}
        {activeTab === 'mechanics' && <SectionMechanics />}
        {activeTab === 'blueprint' && <SectionLevelBlueprint />}
        {activeTab === 'scripts' && <SectionScriptTemplates />}
        {activeTab === 'audio-visual' && <SectionAudioVisual />}
      </main>
    </div>
  );
};

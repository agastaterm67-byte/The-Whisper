/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, BookOpen, Volume2, VolumeX } from 'lucide-react';

interface TopNavProps {
  currentView: 'simulation' | 'gdd';
  onViewChange: (view: 'simulation' | 'gdd') => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onViewChange,
  isMuted,
  onToggleMute
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-zinc-800 bg-[#090b10] shrink-0 select-none">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onViewChange('gdd'); }}
          className="text-base font-bold tracking-wider text-zinc-100 font-cinzel whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors"
        >
          The 3 AM Whisper
        </a>
        <span className="text-zinc-600 font-mono-code text-xs">/</span>
        <span className="text-xs font-mono-code text-zinc-400">Game Design Blueprint</span>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-mono-code font-medium text-zinc-400">
        <button 
          onClick={() => onViewChange('gdd')} 
          className={`hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'gdd' ? 'text-amber-400 font-bold' : ''
          }`}
        >
          Design Document
        </button>
        <button 
          onClick={() => onViewChange('simulation')} 
          className={`hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'simulation' ? 'text-cyan-400 font-bold' : ''
          }`}
        >
          3D Simulation Chamber
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMute}
          className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
          title={isMuted ? 'Unmute Binaural Audio' : 'Mute Binaural Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {currentView === 'gdd' ? (
          <button
            onClick={() => onViewChange('simulation')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-mono-code font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-lg shadow-cyan-950/40"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play 3D Shift Prototype</span>
          </button>
        ) : (
          <button
            onClick={() => onViewChange('gdd')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-mono-code font-bold text-zinc-100 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Full GDD</span>
          </button>
        )}
      </div>
    </header>
  );
};

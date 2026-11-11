/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameClockState, PlayerState, EntityState } from '../../types/game';
import { audioEngine } from '../../services/audioEngine';
import { Sliders, FastForward, Play, Pause, Zap, Skull, Volume2, ShieldAlert } from 'lucide-react';

interface DevControlsProps {
  clockState: GameClockState;
  playerState: PlayerState;
  entityState: EntityState;
  onSetTimeMinutes: (minutes: number) => void;
  onSetTimeScale: (scale: number) => void;
  onSetSanity: (sanity: number) => void;
  onSetFlashlightBattery: (battery: number) => void;
  onTriggerBlackout: () => void;
  onToggleEntityActive: (entity: 'caretaker' | 'patient') => void;
}

export const DevControls: React.FC<DevControlsProps> = ({
  clockState,
  playerState,
  entityState,
  onSetTimeMinutes,
  onSetTimeScale,
  onSetSanity,
  onSetFlashlightBattery,
  onTriggerBlackout,
  onToggleEntityActive
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute bottom-4 right-4 z-40">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/95 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 shadow-2xl text-xs font-mono-code transition-colors backdrop-blur-md"
      >
        <Sliders className="w-3.5 h-3.5 text-amber-400" />
        <span>{isOpen ? 'Close Shift Test Harness' : 'Shift Test Harness / Dev Tools'}</span>
      </button>

      {/* Expanded Control Drawer */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-80 bg-[#0d0f14]/95 backdrop-blur-md border border-zinc-700/90 rounded-xl p-4 shadow-2xl space-y-4 text-xs font-mono-code text-zinc-200">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-bold text-amber-400 uppercase tracking-wider">
              Shift Simulator Controls
            </span>
            <span className="text-[10px] text-zinc-400">{clockState.formattedTime}</span>
          </div>

          {/* Quick Shift Timetable Jumps */}
          <div>
            <div className="text-[10px] text-zinc-400 uppercase mb-1.5 flex items-center gap-1">
              <FastForward className="w-3 h-3 text-cyan-400" /> Jump Shift Phase
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onSetTimeMinutes(60)}
                className="py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 rounded text-left text-[11px] truncate"
              >
                01:00 AM (Start)
              </button>
              <button
                onClick={() => onSetTimeMinutes(178)}
                className="py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 rounded text-left text-[11px] truncate text-amber-300"
              >
                02:58 AM (Pre-Blackout)
              </button>
              <button
                onClick={() => {
                  onSetTimeMinutes(180);
                  onTriggerBlackout();
                }}
                className="py-1.5 px-2 bg-rose-950/80 hover:bg-rose-900 rounded text-left text-[11px] truncate text-rose-300 font-bold col-span-2 flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-rose-400" /> 03:00 AM (Total Blackout Trigger)
              </button>
              <button
                onClick={() => onSetTimeMinutes(191)}
                className="py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 rounded text-left text-[11px] truncate"
              >
                03:11 AM (Aggression)
              </button>
              <button
                onClick={() => onSetTimeMinutes(239)}
                className="py-1.5 px-2 bg-emerald-950/80 hover:bg-emerald-900 rounded text-left text-[11px] truncate text-emerald-300"
              >
                03:59 AM (04:00 Bell)
              </button>
            </div>
          </div>

          {/* Time Scale Multipliers */}
          <div>
            <div className="text-[10px] text-zinc-400 uppercase mb-1 flex items-center justify-between">
              <span>Time Progression Speed</span>
              <span className="text-cyan-400">{clockState.timeScale}x</span>
            </div>
            <div className="flex gap-1.5">
              {[1, 5, 15, 30].map(scale => (
                <button
                  key={scale}
                  onClick={() => onSetTimeScale(scale)}
                  className={`flex-1 py-1 rounded text-center text-xs transition-colors ${
                    clockState.timeScale === scale
                      ? 'bg-cyan-600 text-white font-bold'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {scale}x
                </button>
              ))}
            </div>
          </div>

          {/* Sanity Slider */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase mb-1">
              <span>Sanity Override</span>
              <span className="text-purple-300 font-bold">{Math.round(playerState.sanity)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={playerState.sanity}
              onChange={e => onSetSanity(Number(e.target.value))}
              className="w-full accent-purple-500 bg-zinc-800 h-1.5 rounded-lg"
            />
            <div className="flex justify-between text-[9px] text-zinc-500 mt-0.5">
              <span>0% (Psychosis)</span>
              <span>50% (Hallucinations)</span>
              <span>100% (Calm)</span>
            </div>
          </div>

          {/* Sound FX triggers */}
          <div>
            <div className="text-[10px] text-zinc-400 uppercase mb-1 flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-emerald-400" /> Audio Foley Test Triggers
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => audioEngine.playWhisper(true)}
                className="py-1 px-2 bg-zinc-800 hover:bg-zinc-700 rounded text-left text-[10px]"
              >
                Binaural Whisper L
              </button>
              <button
                onClick={() => audioEngine.playWhisper(false)}
                className="py-1 px-2 bg-zinc-800 hover:bg-zinc-700 rounded text-left text-[10px]"
              >
                Binaural Whisper R
              </button>
              <button
                onClick={() => audioEngine.playFootstep(false, true)}
                className="py-1 px-2 bg-zinc-800 hover:bg-zinc-700 rounded text-left text-[10px]"
              >
                Ghost Footstep
              </button>
              <button
                onClick={() => audioEngine.playBlackoutSlam()}
                className="py-1 px-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 rounded text-left text-[10px]"
              >
                Breaker Trip Slam
              </button>
            </div>
          </div>

          {/* Quick Refill */}
          <div className="flex gap-2 pt-1 border-t border-zinc-800">
            <button
              onClick={() => onSetFlashlightBattery(100)}
              className="flex-1 py-1 bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 rounded text-[11px]"
            >
              Refill Battery (100%)
            </button>
            <button
              onClick={() => onSetSanity(100)}
              className="flex-1 py-1 bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 rounded text-[11px]"
            >
              Restore Sanity (100%)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

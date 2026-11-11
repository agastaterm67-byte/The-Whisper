/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlayerState, GameClockState, EntityState } from '../../types/game';
import { 
  Flashlight, 
  Battery, 
  Brain, 
  Pill, 
  FileText, 
  Volume2, 
  VolumeX, 
  Eye, 
  Video, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

interface HUDOverlayProps {
  playerState: PlayerState;
  clockState: GameClockState;
  entityState: EntityState;
  cameraMode: 'fps' | 'cctv';
  isMuted: boolean;
  onToggleFlashlight: () => void;
  onUseSedative: () => void;
  onToggleCamera: () => void;
  onToggleMute: () => void;
  onOpenDocumentScanner: () => void;
  interactPrompt: { type: string; label: string } | null;
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({
  playerState,
  clockState,
  entityState,
  cameraMode,
  isMuted,
  onToggleFlashlight,
  onUseSedative,
  onToggleCamera,
  onToggleMute,
  onOpenDocumentScanner,
  interactPrompt
}) => {
  // Compute sanity status copy
  const getSanityStatus = (sanity: number) => {
    if (sanity > 75) return { label: 'Lucid / Composed', color: 'text-emerald-400' };
    if (sanity > 50) return { label: 'Mild Paranoia (Whispers)', color: 'text-amber-400' };
    if (sanity > 25) return { label: 'Acute Hallucinations (Ghost Steps)', color: 'text-orange-500' };
    return { label: 'Psychotic Breakdown (Lethal)', color: 'text-rose-500' };
  };

  const sanityStatus = getSanityStatus(playerState.sanity);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4">
      {/* Top Header Bar: Clock, Blackout Alert, Objective */}
      <div className="flex items-start justify-between gap-4 pointer-events-auto">
        {/* Game Clock Display */}
        <div className="bg-black/80 backdrop-blur-md px-4 py-2.5 rounded-lg border border-zinc-800 shadow-xl flex items-center gap-3">
          <Clock className={`w-5 h-5 ${clockState.isBlackout ? 'text-rose-500 animate-spin' : 'text-zinc-400'}`} />
          <div>
            <div className="text-sm font-mono-code font-bold text-zinc-100 flex items-center gap-2">
              <span>{clockState.formattedTime}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase font-sans font-medium">
                Shift 01:00 - 04:00
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">
              Shift Progress: {Math.round(((clockState.currentMinutes - 60) / 180) * 100)}%
            </div>
          </div>
        </div>

        {/* Blackout Warning Banner (Active between 03:00 - 03:10) */}
        {clockState.isBlackout && (
          <div className="bg-rose-950/90 border border-rose-600/80 px-4 py-2 rounded-lg text-rose-200 text-xs font-mono-code font-bold flex items-center gap-2.5 shadow-[0_0_25px_rgba(225,29,72,0.4)] animate-pulse">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>TOTAL BLACKOUT ACTIVE [03:00 - 03:10] · MAIN POWER FAULT · SURVIVE AND HIDE</span>
          </div>
        )}

        {/* Right Tools: Camera mode, Audio toggle, Microfilm task */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDocumentScanner}
            className="flex items-center gap-1.5 bg-zinc-900/90 hover:bg-zinc-800 text-amber-200 px-3 py-1.5 rounded-md border border-amber-900/40 text-xs font-mono-code transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Files ({playerState.documentsSorted}/{playerState.totalDocuments})</span>
          </button>

          <button
            onClick={onToggleCamera}
            className="flex items-center gap-1.5 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-md border border-zinc-800 text-xs font-mono-code transition-colors"
            title="Toggle between First-Person and CCTV Isometric camera"
          >
            {cameraMode === 'fps' ? <Eye className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{cameraMode === 'fps' ? '1st Person' : 'CCTV Cam'}</span>
          </button>

          <button
            onClick={onToggleMute}
            className="p-2 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 rounded-md border border-zinc-800 transition-colors"
            title={isMuted ? 'Unmute Binaural Audio' : 'Mute Binaural Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Center Interaction Prompt Prompt (e.g. "[E] Crawl Under Desk to Hide") */}
      {interactPrompt && !playerState.isHidden && (
        <div className="mx-auto my-auto pointer-events-auto bg-black/85 backdrop-blur-md px-5 py-2.5 rounded-full border border-amber-500/50 shadow-2xl flex items-center gap-2 text-xs font-mono-code text-amber-300 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>PRESS [E] · {interactPrompt.label}</span>
        </div>
      )}

      {/* Bottom Status Bar: Sanity, Flashlight Battery, Noise, Inventory */}
      <div className="flex items-end justify-between gap-4 pointer-events-auto">
        {/* Left: Sanity System HUD */}
        <div className="bg-black/80 backdrop-blur-md px-4 py-3 rounded-lg border border-zinc-800 min-w-64 max-w-xs shadow-xl">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Brain className={`w-4 h-4 ${playerState.sanity < 30 ? 'text-rose-500 animate-bounce' : 'text-purple-400'}`} />
              <span className="text-xs font-mono-code font-bold uppercase text-zinc-300">Sanity Meter</span>
            </div>
            <span className="text-xs font-mono-code font-bold text-zinc-200">
              {Math.round(playerState.sanity)}%
            </span>
          </div>

          {/* Sanity Bar */}
          <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
            <div
              className={`h-full transition-all duration-300 ${
                playerState.sanity < 25
                  ? 'bg-rose-600'
                  : playerState.sanity < 50
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${playerState.sanity}%` }}
            />
          </div>

          <div className={`text-[10px] font-mono-code mt-1.5 ${sanityStatus.color}`}>
            State: {sanityStatus.label}
          </div>
        </div>

        {/* Center: Noise Level (Acoustic Stealth) */}
        <div className="bg-black/80 backdrop-blur-md px-4 py-2.5 rounded-lg border border-zinc-800 flex flex-col items-center shadow-xl">
          <div className="text-[10px] font-mono-code text-zinc-400 uppercase tracking-wider mb-1">
            Acoustic Noise (Patient Detection)
          </div>
          <div className="flex items-center gap-1.5 h-4">
            {[...Array(12)].map((_, idx) => {
              const active = idx * 8.3 < playerState.noiseLevel;
              return (
                <div
                  key={idx}
                  className={`w-1.5 rounded-sm transition-all duration-75 ${
                    active 
                      ? idx > 8 ? 'h-4 bg-rose-500' : idx > 5 ? 'h-3 bg-amber-400' : 'h-2 bg-emerald-400'
                      : 'h-1.5 bg-zinc-800'
                  }`}
                />
              );
            })}
          </div>
          <div className="text-[9px] font-mono-code text-zinc-500 mt-1">
            {playerState.noiseLevel > 60 ? 'ALERT! NOISE TOO HIGH' : playerState.noiseLevel > 20 ? 'DETECTABLE FOOTFALL' : 'SILENT STEALTH'}
          </div>
        </div>

        {/* Right: Flashlight & Consumables Inventory */}
        <div className="bg-black/80 backdrop-blur-md px-4 py-3 rounded-lg border border-zinc-800 flex items-center gap-4 shadow-xl">
          {/* Flashlight toggle */}
          <div className="flex flex-col items-center">
            <button
              onClick={onToggleFlashlight}
              className={`p-2 rounded-md border transition-all ${
                playerState.isFlashlightOn
                  ? 'bg-amber-500/20 border-amber-500/80 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-500'
              }`}
              title="Toggle Flashlight [F]"
            >
              <Flashlight className="w-4 h-4" />
            </button>
            <div className="text-[10px] font-mono-code text-zinc-400 mt-1">
              [F] {playerState.isFlashlightOn ? 'ON' : 'OFF'}
            </div>
          </div>

          {/* Flashlight Battery Bar */}
          <div className="w-20">
            <div className="flex items-center justify-between text-[10px] font-mono-code text-zinc-400 mb-1">
              <span className="flex items-center gap-1">
                <Battery className="w-3 h-3" /> Batt
              </span>
              <span>{Math.round(playerState.flashlightBattery)}%</span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
              <div
                className={`h-full transition-all duration-200 ${
                  playerState.flashlightBattery < 20 ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'
                }`}
                style={{ width: `${playerState.flashlightBattery}%` }}
              />
            </div>
          </div>

          <div className="w-px h-8 bg-zinc-800" />

          {/* Sedative pills consumable */}
          <button
            onClick={onUseSedative}
            disabled={playerState.sedativesCount <= 0}
            className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors ${
              playerState.sedativesCount > 0 
                ? 'bg-purple-950/40 hover:bg-purple-900/60 border-purple-800/80 text-purple-200' 
                : 'bg-zinc-900/40 border-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
            title="Use Sedative [Q] (+35 Sanity)"
          >
            <Pill className="w-4 h-4 text-purple-400" />
            <div className="text-left font-mono-code">
              <div className="text-xs font-bold">{playerState.sedativesCount}x Pills</div>
              <div className="text-[9px] text-zinc-400">[Q] Calms Mind</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { audioEngine } from '../../services/audioEngine';

interface BreathHoldingQTEProps {
  hidingSpot: 'desk' | 'cabinet';
  isHoldingBreath: boolean;
  breathCapacity: number;
  caretakerDistance: number;
  onHoldBreathToggle: (holding: boolean) => void;
  onPanicGasp: () => void;
  onExitHiding: () => void;
}

export const BreathHoldingQTE: React.FC<BreathHoldingQTEProps> = ({
  hidingSpot,
  isHoldingBreath,
  breathCapacity,
  caretakerDistance,
  onHoldBreathToggle,
  onPanicGasp,
  onExitHiding
}) => {
  const [pulseScale, setPulseScale] = useState(1);
  const rhythmIntervalRef = useRef<number | null>(null);

  // Rhythmic pulse matching heartbeat / lung strain
  useEffect(() => {
    let growing = true;
    const interval = window.setInterval(() => {
      setPulseScale(prev => {
        if (prev >= 1.35) growing = false;
        if (prev <= 0.85) growing = true;
        return growing ? prev + 0.08 : prev - 0.08;
      });
    }, 50);

    rhythmIntervalRef.current = interval;
    return () => clearInterval(interval);
  }, []);

  // Listen for Space key down/up
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        onHoldBreathToggle(true);
      }
      if (e.key.toLowerCase() === 'e') {
        onExitHiding();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        onHoldBreathToggle(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onHoldBreathToggle, onExitHiding]);

  // Check if breath depleted while holding
  useEffect(() => {
    if (isHoldingBreath && breathCapacity <= 1) {
      audioEngine.playPanicGasp();
      onPanicGasp();
      onHoldBreathToggle(false);
    }
  }, [isHoldingBreath, breathCapacity, onPanicGasp, onHoldBreathToggle]);

  return (
    <div className="absolute inset-0 z-30 pointer-events-auto flex flex-col justify-between p-6">
      {/* Claustrophobic locker slats or desk overhang overlay */}
      {hidingSpot === 'cabinet' ? (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between opacity-85">
          <div className="w-full h-16 bg-black" />
          <div className="w-full flex-1 flex flex-col justify-around py-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full h-6 bg-black/90 shadow-2xl" />
            ))}
          </div>
          <div className="w-full h-24 bg-black" />
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-36 bg-gradient-to-b from-black via-black/95 to-transparent" />
          <div className="absolute top-28 left-0 right-0 h-4 bg-amber-950/80 shadow-2xl" />
        </div>
      )}

      {/* Top Status Bar: Hidden Location & Entity Proximity Warning */}
      <div className="relative z-10 flex items-center justify-between bg-black/80 backdrop-blur-md px-5 py-3 rounded-lg border border-zinc-800 max-w-xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          <div>
            <div className="text-xs font-mono-code font-bold tracking-wider text-amber-400 uppercase">
              HIDDEN: {hidingSpot === 'cabinet' ? 'FILE LOCKER #04' : 'ARCHIVIST DESK UNDERSIDE'}
            </div>
            <div className="text-[11px] text-zinc-400">
              Hold [SPACE] to suppress breath. Release when footsteps fade.
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-mono-code text-zinc-500">ENTITY PROXIMITY</div>
          <div className={`text-xs font-mono-code font-bold ${
            caretakerDistance < 12 ? 'text-rose-500 animate-pulse' : 'text-zinc-300'
          }`}>
            {caretakerDistance < 8 ? 'EXTREMELY CLOSE (< 8m)' : caretakerDistance < 18 ? 'PROWLING HALLWAY (~15m)' : 'DISTANT'}
          </div>
        </div>
      </div>

      {/* Center QTE Heartbeat & Breath Gauge */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center">
        {/* Rhythmic Breathing Ring */}
        <div className="relative flex items-center justify-center w-40 h-40">
          {/* Outer Pulsing Heartbeat Guide */}
          <div
            className={`absolute rounded-full border-2 transition-transform duration-75 ${
              isHoldingBreath 
                ? 'border-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.25)]' 
                : 'border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
            }`}
            style={{
              width: '120px',
              height: '120px',
              transform: `scale(${pulseScale})`
            }}
          />

          {/* Inner Core Dial */}
          <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border transition-all ${
            isHoldingBreath 
              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200' 
              : 'bg-black/90 border-zinc-700 text-zinc-300'
          }`}>
            <span className="text-[10px] font-mono-code tracking-widest uppercase">
              {isHoldingBreath ? 'SUPPRESSED' : 'NORMAL'}
            </span>
            <span className="text-lg font-bold font-mono-code">
              {Math.round(breathCapacity)}%
            </span>
            <span className="text-[9px] text-zinc-400 uppercase">LUNGS</span>
          </div>
        </div>

        {/* Breath Capacity Bar */}
        <div className="w-64 mt-4 bg-zinc-900 border border-zinc-800 rounded-full h-3 overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-100 ${
              breathCapacity < 25
                ? 'bg-rose-500 animate-pulse'
                : breathCapacity < 50
                ? 'bg-amber-500'
                : 'bg-cyan-400'
            }`}
            style={{ width: `${breathCapacity}%` }}
          />
        </div>

        {breathCapacity < 25 && isHoldingBreath && (
          <div className="text-rose-400 text-xs font-mono-code mt-2 animate-bounce">
            WARNING: LUNG COLLAPSE IMMINENT - GASP RISK!
          </div>
        )}
      </div>

      {/* Bottom Controls / Actions */}
      <div className="relative z-10 flex items-center justify-center gap-4 max-w-md mx-auto w-full">
        <button
          onMouseDown={() => onHoldBreathToggle(true)}
          onMouseUp={() => onHoldBreathToggle(false)}
          onTouchStart={() => onHoldBreathToggle(true)}
          onTouchEnd={() => onHoldBreathToggle(false)}
          className={`flex-1 py-3 px-4 rounded-lg font-mono-code text-xs font-bold uppercase transition-all shadow-lg ${
            isHoldingBreath
              ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/50 scale-95'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700'
          }`}
        >
          {isHoldingBreath ? 'HOLDING BREATH...' : 'PRESS & HOLD [SPACE] TO HOLD BREATH'}
        </button>

        <button
          onClick={onExitHiding}
          className="py-3 px-5 rounded-lg font-mono-code text-xs font-bold bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800/60 uppercase transition-all"
        >
          EXIT HIDING [E]
        </button>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameClockState } from '../../types/game';

interface VHSOverlayProps {
  clockState: GameClockState;
  sanity: number;
  enabled: boolean;
}

export const VHSOverlay: React.FC<VHSOverlayProps> = ({
  clockState,
  sanity,
  enabled
}) => {
  if (!enabled) return null;

  // Sanity distortion multiplier
  const sanityRatio = (100 - sanity) / 100;
  const blurAmount = Math.max(0, (sanityRatio - 0.3) * 6); // blurs when sanity < 70
  const chromaticShift = Math.max(0, sanityRatio * 4);

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-20 overflow-hidden vhs-overlay vhs-tracking"
      style={{
        filter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined
      }}
    >
      {/* Moving scanline bar */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white/[0.025] scanline-bar" />

      {/* Top Left: Vintage Camcorder REC display */}
      <div className="absolute top-4 left-6 flex items-center gap-3 text-white/80 font-mono-code text-xs tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          <span className="font-bold text-red-500">REC</span>
        </div>
        <span className="text-zinc-400">·</span>
        <span className="text-zinc-200">SP [120 MIN]</span>
        <span className="text-zinc-400">·</span>
        <span className="text-zinc-300">CAM-03 // ARCHIVE BSMT</span>
      </div>

      {/* Top Right: Time Stamp synchronized to shift clock */}
      <div className="absolute top-4 right-6 text-right font-mono-code text-white/80 text-xs tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
        <div className="text-emerald-400 font-bold">{clockState.formattedTime}</div>
        <div className="text-[10px] text-zinc-400">OCT 24 1998</div>
      </div>

      {/* Bottom Left: VCR Tracking indicator & audio mode */}
      <div className="absolute bottom-4 left-6 text-zinc-500 font-mono-code text-[10px] tracking-widest drop-shadow">
        TRACKING: AUTO · HI-FI STEREO BINAURAL · NOISE REDUCTION [OFF]
      </div>

      {/* Low Sanity Hallucinatory Red Tint & Edge Vignette */}
      {sanity < 50 && (
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle, transparent 40%, rgba(153, 27, 27, ${0.45 * (1 - sanity / 50)}) 100%)`
          }}
        />
      )}

      {/* Extreme Sanity Static Glitch Flash (< 25 Sanity) */}
      {sanity < 25 && (
        <div className="absolute inset-0 bg-red-950/20 mix-blend-color-dodge animate-pulse" />
      )}
    </div>
  );
};

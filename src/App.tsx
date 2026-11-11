/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameClockState, PlayerState, EntityState, ArchiveDocument } from './types/game';
import { INITIAL_ARCHIVE_DOCUMENTS } from './data/archiveLore';
import { audioEngine } from './services/audioEngine';
import { TopNav } from './components/Navigation/TopNav';
import { SimulationCanvas } from './components/PlayableSimulation/SimulationCanvas';
import { VHSOverlay } from './components/PlayableSimulation/VHSOverlay';
import { HUDOverlay } from './components/PlayableSimulation/HUDOverlay';
import { BreathHoldingQTE } from './components/PlayableSimulation/BreathHoldingQTE';
import { DocumentScannerModal } from './components/PlayableSimulation/DocumentScannerModal';
import { DevControls } from './components/PlayableSimulation/DevControls';
import { GDDViewer } from './components/GDD/GDDViewer';
import { Bell, Trophy, RotateCcw } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'simulation' | 'gdd'>('simulation');
  const [isMuted, setIsMuted] = useState(false);
  const [cameraMode, setCameraMode] = useState<'fps' | 'cctv'>('fps');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [documents, setDocuments] = useState<ArchiveDocument[]>(INITIAL_ARCHIVE_DOCUMENTS);
  const [interactPrompt, setInteractPrompt] = useState<{ type: string; id: string; label: string } | null>(null);

  // Core Game Clock State (60 = 01:00 AM, 180 = 03:00 AM, 240 = 04:00 AM)
  const [clockState, setClockState] = useState<GameClockState>({
    currentMinutes: 60,
    timeScale: 1,
    isBlackout: false,
    shiftCompleted: false,
    formattedTime: '01:00 AM'
  });

  // Core Player State
  const [playerState, setPlayerState] = useState<PlayerState>({
    sanity: 100,
    flashlightBattery: 100,
    isFlashlightOn: true,
    isHidden: false,
    hidingSpot: null,
    breathCapacity: 100,
    isHoldingBreath: false,
    noiseLevel: 12,
    sedativesCount: 2,
    batteryCount: 1,
    documentsSorted: 1,
    totalDocuments: 4
  });

  // Core Entity State
  const [entityState, setEntityState] = useState<EntityState>({
    caretakerDistance: 38,
    caretakerActive: false,
    caretakerState: 'dormant',
    patientDistance: 12,
    patientActive: true,
    patientState: 'stalking'
  });

  // Format in-game minute to string
  const formatTime = (mins: number) => {
    const total = Math.floor(mins);
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m} AM`;
  };

  // Initialize audio engine on user interaction
  const initAudio = () => {
    audioEngine.init();
  };

  // Clock progression loop
  useEffect(() => {
    const interval = window.setInterval(() => {
      setClockState(prev => {
        if (prev.shiftCompleted) return prev;

        // Advance minutes based on timeScale (1x = ~0.2 mins per sec, 15x = fast)
        const step = 0.25 * prev.timeScale;
        const newMins = prev.currentMinutes + step;
        const formatted = formatTime(newMins);

        // Check 03:00 Blackout Trigger (180 mins)
        const justHitBlackout = prev.currentMinutes < 180 && newMins >= 180;
        const justEndedBlackout = prev.currentMinutes < 190 && newMins >= 190;
        const reachedShiftEnd = newMins >= 240;

        if (justHitBlackout) {
          audioEngine.playBlackoutSlam();
          setEntityState(e => ({
            ...e,
            caretakerActive: true,
            caretakerState: 'patrolling',
            caretakerDistance: 24
          }));
        }

        if (justEndedBlackout) {
          setEntityState(e => ({
            ...e,
            caretakerActive: false,
            caretakerState: 'dormant'
          }));
        }

        if (reachedShiftEnd) {
          audioEngine.playShiftEndBell();
        }

        // Mechanical clock tick sound
        audioEngine.playClockTick();

        return {
          ...prev,
          currentMinutes: Math.min(newMins, 240),
          isBlackout: newMins >= 180 && newMins < 190,
          shiftCompleted: reachedShiftEnd,
          formattedTime: formatted
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Flashlight battery & Sanity drain loop
  useEffect(() => {
    const interval = window.setInterval(() => {
      // 1. Flashlight Battery Drain
      setPlayerState(prev => {
        let newBatt = prev.flashlightBattery;
        if (prev.isFlashlightOn && newBatt > 0) {
          newBatt = Math.max(0, newBatt - 0.4);
        }

        // 2. Sanity Decay
        let newSanity = prev.sanity;
        const isInDarkness = !prev.isFlashlightOn || newBatt <= 0 || clockState.isBlackout;
        
        if (isInDarkness) {
          newSanity = Math.max(0, newSanity - 0.55);
        }

        if (entityState.caretakerActive && entityState.caretakerDistance < 15) {
          newSanity = Math.max(0, newSanity - 1.2);
        }

        // 3. Lung capacity drain if holding breath
        let newLung = prev.breathCapacity;
        if (prev.isHidden && prev.isHoldingBreath) {
          newLung = Math.max(0, newLung - 3.5);
        } else if (prev.isHidden && !prev.isHoldingBreath) {
          newLung = Math.min(100, newLung + 4.5);
        }

        // Audio update
        audioEngine.updateSanityAudio(newSanity);

        return {
          ...prev,
          flashlightBattery: newBatt,
          sanity: newSanity,
          breathCapacity: newLung
        };
      });

      // Random psychological audio hallucinations if sanity is low
      if (playerState.sanity < 50 && Math.random() < 0.15) {
        audioEngine.playWhisper(Math.random() < 0.5);
      }
      if (playerState.sanity < 35 && Math.random() < 0.2) {
        audioEngine.playFootstep(false, true);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [clockState.isBlackout, entityState.caretakerActive, entityState.caretakerDistance, playerState.sanity]);

  // Caretaker distance creep during blackout
  useEffect(() => {
    if (!clockState.isBlackout) return;

    const interval = window.setInterval(() => {
      setEntityState(prev => {
        if (!prev.caretakerActive) return prev;
        
        let newDist = prev.caretakerDistance;
        // If player is not hidden or makes noise, entity closes in quickly
        if (!playerState.isHidden || playerState.noiseLevel > 40) {
          newDist = Math.max(2, newDist - 1.8);
        } else {
          // Patrol sweeps back and forth
          newDist = Math.max(6, Math.min(26, newDist + (Math.random() * 4 - 2)));
        }

        return {
          ...prev,
          caretakerDistance: newDist
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [clockState.isBlackout, playerState.isHidden, playerState.noiseLevel]);

  // Handle Interact (E key)
  const handleInteract = useCallback(() => {
    if (!interactPrompt) return;

    if (interactPrompt.type === 'desk') {
      setPlayerState(prev => ({
        ...prev,
        isHidden: true,
        hidingSpot: 'desk',
        isHoldingBreath: false
      }));
    } else if (interactPrompt.type === 'cabinet') {
      setPlayerState(prev => ({
        ...prev,
        isHidden: true,
        hidingSpot: 'cabinet',
        isHoldingBreath: false
      }));
    } else if (interactPrompt.type === 'document') {
      setIsScannerOpen(true);
    } else if (interactPrompt.type === 'battery') {
      setPlayerState(prev => ({
        ...prev,
        flashlightBattery: 100,
        batteryCount: prev.batteryCount + 1
      }));
    } else if (interactPrompt.type === 'sedative') {
      setPlayerState(prev => ({
        ...prev,
        sedativesCount: prev.sedativesCount + 1
      }));
    }
  }, [interactPrompt]);

  // Keyboard shortcut listener for F, E, Q
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      initAudio();
      const k = e.key.toLowerCase();
      if (k === 'f') {
        setPlayerState(prev => {
          const next = !prev.isFlashlightOn;
          audioEngine.playFlashlightClick(next);
          return { ...prev, isFlashlightOn: next };
        });
      }
      if (k === 'e') {
        if (playerState.isHidden) {
          setPlayerState(prev => ({ ...prev, isHidden: false, hidingSpot: null }));
        } else {
          handleInteract();
        }
      }
      if (k === 'q') {
        handleUseSedative();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInteract, playerState.isHidden]);

  const handleUseSedative = () => {
    if (playerState.sedativesCount <= 0) return;
    audioEngine.playPillsTake();
    setPlayerState(prev => ({
      ...prev,
      sedativesCount: prev.sedativesCount - 1,
      sanity: Math.min(100, prev.sanity + 35)
    }));
  };

  const handlePanicGasp = () => {
    setPlayerState(prev => ({
      ...prev,
      noiseLevel: 95,
      isHoldingBreath: false
    }));

    // Entity rushes close immediately
    setEntityState(prev => ({
      ...prev,
      caretakerDistance: Math.max(2, prev.caretakerDistance - 10)
    }));

    // Reset noise level after 2 seconds
    setTimeout(() => {
      setPlayerState(prev => ({ ...prev, noiseLevel: 15 }));
    }, 2000);
  };

  const handleSortDocument = (docId: string) => {
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, isSorted: true } : d));
    setPlayerState(prev => ({
      ...prev,
      documentsSorted: Math.min(prev.totalDocuments, prev.documentsSorted + 1)
    }));
  };

  const handleRestartShift = () => {
    setClockState({
      currentMinutes: 60,
      timeScale: 1,
      isBlackout: false,
      shiftCompleted: false,
      formattedTime: '01:00 AM'
    });
    setPlayerState({
      sanity: 100,
      flashlightBattery: 100,
      isFlashlightOn: true,
      isHidden: false,
      hidingSpot: null,
      breathCapacity: 100,
      isHoldingBreath: false,
      noiseLevel: 12,
      sedativesCount: 2,
      batteryCount: 1,
      documentsSorted: 1,
      totalDocuments: 4
    });
    setEntityState({
      caretakerDistance: 38,
      caretakerActive: false,
      caretakerState: 'dormant',
      patientDistance: 12,
      patientActive: true,
      patientState: 'stalking'
    });
  };

  return (
    <div 
      onClick={initAudio}
      className="flex flex-col h-screen w-screen overflow-hidden bg-[#07080b] text-zinc-100 font-sans"
    >
      {/* Universal Top Bar */}
      <TopNav
        currentView={view}
        onViewChange={setView}
        isMuted={isMuted}
        onToggleMute={() => {
          setIsMuted(!isMuted);
          audioEngine.setMuted(!isMuted);
        }}
      />

      {/* Main View Area: Simulation or GDD */}
      {view === 'gdd' ? (
        <GDDViewer onSwitchToSimulation={() => setView('simulation')} />
      ) : (
        <div className="relative flex-1 overflow-hidden">
          {/* 3D WebGL Simulation Canvas */}
          <SimulationCanvas
            playerState={playerState}
            clockState={clockState}
            entityState={entityState}
            cameraMode={cameraMode}
            onPlayerMove={() => {
              setPlayerState(p => ({ ...p, noiseLevel: Math.min(50, p.noiseLevel + 4) }));
            }}
            onInteractAvailable={item => setInteractPrompt(item)}
            onFootstepTrigger={() => audioEngine.playFootstep(true, false)}
          />

          {/* Retro VHS Scanline & Camcorder Overlay */}
          <VHSOverlay
            clockState={clockState}
            sanity={playerState.sanity}
            enabled={true}
          />

          {/* Core HUD Overlay */}
          <HUDOverlay
            playerState={playerState}
            clockState={clockState}
            entityState={entityState}
            cameraMode={cameraMode}
            isMuted={isMuted}
            onToggleFlashlight={() => {
              setPlayerState(prev => {
                const next = !prev.isFlashlightOn;
                audioEngine.playFlashlightClick(next);
                return { ...prev, isFlashlightOn: next };
              });
            }}
            onUseSedative={handleUseSedative}
            onToggleCamera={() => setCameraMode(prev => prev === 'fps' ? 'cctv' : 'fps')}
            onToggleMute={() => {
              setIsMuted(!isMuted);
              audioEngine.setMuted(!isMuted);
            }}
            onOpenDocumentScanner={() => setIsScannerOpen(true)}
            interactPrompt={interactPrompt}
          />

          {/* Rhythmic Breath-Holding QTE (Visible when hidden in cabinet or under desk) */}
          {playerState.isHidden && playerState.hidingSpot && (
            <BreathHoldingQTE
              hidingSpot={playerState.hidingSpot}
              isHoldingBreath={playerState.isHoldingBreath}
              breathCapacity={playerState.breathCapacity}
              caretakerDistance={entityState.caretakerDistance}
              onHoldBreathToggle={holding => {
                setPlayerState(prev => ({
                  ...prev,
                  isHoldingBreath: holding,
                  noiseLevel: holding ? 0 : 25
                }));
              }}
              onPanicGasp={handlePanicGasp}
              onExitHiding={() => setPlayerState(prev => ({ ...prev, isHidden: false, hidingSpot: null }))}
            />
          )}

          {/* Microfilm Document Scanner Modal */}
          {isScannerOpen && (
            <DocumentScannerModal
              documents={documents}
              onSortDocument={handleSortDocument}
              onClose={() => setIsScannerOpen(false)}
            />
          )}

          {/* Developer / Game Design Testing Harness */}
          <DevControls
            clockState={clockState}
            playerState={playerState}
            entityState={entityState}
            onSetTimeMinutes={m => {
              setClockState(prev => ({
                ...prev,
                currentMinutes: m,
                isBlackout: m >= 180 && m < 190,
                formattedTime: formatTime(m)
              }));
            }}
            onSetTimeScale={s => setClockState(prev => ({ ...prev, timeScale: s }))}
            onSetSanity={s => setPlayerState(prev => ({ ...prev, sanity: s }))}
            onSetFlashlightBattery={b => setPlayerState(prev => ({ ...prev, flashlightBattery: b }))}
            onTriggerBlackout={() => {
              audioEngine.playBlackoutSlam();
              setClockState(prev => ({ ...prev, isBlackout: true }));
              setEntityState(e => ({ ...e, caretakerActive: true, caretakerDistance: 16 }));
            }}
            onToggleEntityActive={e => {
              if (e === 'caretaker') {
                setEntityState(prev => ({ ...prev, caretakerActive: !prev.caretakerActive }));
              }
            }}
          />

          {/* Victory Bell Shift Completion Banner */}
          {clockState.shiftCompleted && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-6">
              <div className="max-w-md w-full bg-[#11141c] border border-emerald-500/60 rounded-2xl p-8 text-center space-y-5 shadow-2xl">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <Trophy className="w-7 h-7" />
                </div>

                <div>
                  <div className="text-xs font-mono-code text-emerald-400 uppercase tracking-widest mb-1">
                    04:00 AM Shift Bell Rings
                  </div>
                  <h2 className="text-2xl font-bold font-cinzel text-zinc-100">
                    Shift Survived
                  </h2>
                  <p className="text-xs text-zinc-400 mt-2">
                    The morning church bells chime across the harbor. The Blackwood sub-basement doors click unlocked. You survived the 3 AM Whisper.
                  </p>
                </div>

                <div className="p-4 bg-zinc-900/60 rounded-lg border border-zinc-800 text-xs font-mono-code text-zinc-300 space-y-1">
                  <div><strong>Files Archived:</strong> {playerState.documentsSorted} / {playerState.totalDocuments}</div>
                  <div><strong>Remaining Sanity:</strong> {Math.round(playerState.sanity)}%</div>
                  <div><strong>Wage Earned:</strong> $43.50 (3 Hours)</div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleRestartShift}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono-code font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Replay Shift</span>
                  </button>
                  <button
                    onClick={() => setView('gdd')}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono-code font-bold transition-colors"
                  >
                    Inspect Full GDD
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

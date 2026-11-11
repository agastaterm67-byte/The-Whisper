/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GameClockState {
  currentMinutes: number; // 60 = 01:00 AM, 240 = 04:00 AM
  timeScale: number; // 1 = real time, 5 = fast, 15 = ultra
  isBlackout: boolean; // true during 03:00 - 03:10 (minutes 180 to 190)
  shiftCompleted: boolean; // reached 04:00 (240 mins)
  formattedTime: string; // e.g. "03:04 AM"
}

export interface PlayerState {
  sanity: number; // 0 - 100
  flashlightBattery: number; // 0 - 100
  isFlashlightOn: boolean;
  isHidden: boolean;
  hidingSpot: 'desk' | 'cabinet' | null;
  breathCapacity: number; // 0 - 100
  isHoldingBreath: boolean;
  noiseLevel: number; // 0 - 100 (walk = 20, run = 60, gasp = 90)
  sedativesCount: number;
  batteryCount: number;
  documentsSorted: number;
  totalDocuments: number;
}

export interface EntityState {
  caretakerDistance: number; // 0 (caught) to 50 (far)
  caretakerActive: boolean;
  caretakerState: 'dormant' | 'patrolling' | 'hunting' | 'searching';
  patientDistance: number;
  patientActive: boolean;
  patientState: 'stalking' | 'alert' | 'pouncing';
}

export interface ArchiveDocument {
  id: string;
  title: string;
  date: string;
  classification: string;
  content: string;
  location: string;
  isSorted: boolean;
}

export type GDDTab = 
  | 'overview'
  | 'lore'
  | 'loop'
  | 'mechanics'
  | 'blueprint'
  | 'scripts'
  | 'audio-visual';

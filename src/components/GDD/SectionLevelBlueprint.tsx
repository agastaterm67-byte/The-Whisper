/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Map, ShieldAlert, Key, Zap, CheckCircle2, Eye } from 'lucide-react';

interface RoomData {
  id: string;
  name: string;
  type: string;
  danger: 'low' | 'medium' | 'extreme';
  hidingSpots: string[];
  loot: string[];
  patrolEntity: string;
  description: string;
}

const ROOMS: RoomData[] = [
  {
    id: 'vestibule',
    name: 'Security Vestibule & Time Clock',
    type: 'Entrance / Shift Gate',
    danger: 'low',
    hidingSpots: ['Oak Guard Counter Desk'],
    loot: ['Shift Punch Card', 'D-Cell Flashlight Battery'],
    patrolEntity: 'Safe Zone (until 03:00)',
    description: 'The front entrance where Samuel starts the shift. Heavy iron turnstile is locked from outside until the 04:00 AM bell triggers the municipal solenoid.'
  },
  {
    id: 'central_hall',
    name: 'Central Microfilm & Restoration Room',
    type: 'Core Work Hub',
    danger: 'medium',
    hidingSpots: ['Archivist Restoration Desk (Banker Lamp)', 'Filing Locker A-02'],
    loot: ['Classified Intake File #01', 'Phenobarbital Pills'],
    patrolEntity: 'The Patient (Crawls along overhead ceiling conduits)',
    description: 'Home of the central microfilm scanner and green banker desk lamp. The banker lamp serves as the primary safe sanity recovery haven.'
  },
  {
    id: 'north_aisles',
    name: 'North Corridors & St. Jude Vaults',
    type: 'High-Density Archive',
    danger: 'extreme',
    hidingSpots: ['File Cabinet Row C', 'Decommissioned Morgue Drawer'],
    loot: ['Intake File #02 & #03', 'Industrial Battery Pack'],
    patrolEntity: 'The Caretaker (Main Blackout Patrol Corridor)',
    description: 'Narrow 3-foot wide aisles between 12-foot rusted metal shelving. Line of sight is severely restricted. When the 03:00 blackout starts, The Caretaker spawns at the north iron gate.'
  },
  {
    id: 'breaker_vault',
    name: 'Sub-Level Breaker & Generator Vault',
    type: 'Electrical Infrastructure',
    danger: 'extreme',
    hidingSpots: ['Under High-Voltage Transformer Workbench'],
    loot: ['Backup Fuse Relay', 'Sedative Pill Bottle'],
    patrolEntity: 'The Caretaker & The Patient convergence',
    description: 'A damp room with leaking ceiling pipes and a high-voltage breaker board. At 03:00, circuit breakers mechanically snap downward with an ear-splitting bang.'
  }
];

export const SectionLevelBlueprint: React.FC = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>('central_hall');
  const activeRoom = ROOMS.find(r => r.id === selectedRoomId) || ROOMS[1];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Blueprint Header */}
      <div className="flex items-center justify-between p-6 bg-[#0f1117] border border-zinc-800 rounded-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 uppercase tracking-wider mb-1">
            <Map className="w-4 h-4" />
            <span>Architectural Level Schematic · St. Jude Archive Sub-Basement</span>
          </div>
          <h3 className="text-xl font-bold font-cinzel text-zinc-100">
            Facility Blueprint & Entity Patrol Geometry
          </h3>
        </div>
        <div className="text-right text-xs font-mono-code text-zinc-400 hidden sm:block">
          <div>SCALE: 1:50 METRIC</div>
          <div className="text-[10px] text-zinc-500">MUNICIPAL SURVEY 1971</div>
        </div>
      </div>

      {/* Interactive Blueprint Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Architectural Grid / Schematic (2 Columns) */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-[#090b10] border border-cyan-950/80 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[420px]">
          {/* Blueprint Grid Lines Background */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 1px), linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Blueprint Title Badge */}
          <div className="relative z-10 flex items-center justify-between text-xs font-mono-code text-cyan-300 border-b border-cyan-900/40 pb-2">
            <span>LEVEL -1 : BLACKWOOD RESTORATION SUITE</span>
            <span className="text-zinc-500">CLICK ROOM TO INSPECT SCHEMATICS</span>
          </div>

          {/* Interactive Room Layout Box Visuals */}
          <div className="relative z-10 my-auto grid grid-cols-2 gap-4 py-6">
            {ROOMS.map(room => {
              const isSelected = room.id === activeRoom.id;
              const dangerColors = {
                low: 'border-emerald-800/80 text-emerald-300 hover:border-emerald-500',
                medium: 'border-amber-800/80 text-amber-300 hover:border-amber-500',
                extreme: 'border-rose-800/80 text-rose-300 hover:border-rose-500'
              };

              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400'
                      : `bg-[#0c0f16]/90 ${dangerColors[room.danger]}`
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono-code mb-1">
                    <span className="text-zinc-400 uppercase">{room.type}</span>
                    <span className={`font-bold ${
                      room.danger === 'extreme' ? 'text-rose-400' : room.danger === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {room.danger.toUpperCase()} RISK
                    </span>
                  </div>
                  <div className="text-xs font-bold font-cinzel text-zinc-100">
                    {room.name}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono-code mt-2 flex items-center gap-1">
                    <span>Hiding Spots:</span>
                    <span className="text-zinc-300 font-bold">{room.hidingSpots.length}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Blueprint Footer Legend */}
          <div className="relative z-10 flex flex-wrap items-center gap-4 text-[10px] font-mono-code text-zinc-400 pt-3 border-t border-cyan-950">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Safe Banker Lamp
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Hiding Desks & Cabinets
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Caretaker Patrol Vector
            </span>
          </div>
        </div>

        {/* Selected Room Deep Dive Dossier */}
        <div className="p-6 rounded-xl bg-[#0f1117] border border-zinc-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-widest mb-1">
              Sector Inspection
            </div>
            <h4 className="text-lg font-bold font-cinzel text-zinc-100 mb-2">
              {activeRoom.name}
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed mb-4">
              {activeRoom.description}
            </p>

            <div className="space-y-3 pt-3 border-t border-zinc-800 text-xs font-mono-code">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Designated Hiding Spots:</span>
                <ul className="text-amber-300 space-y-1 mt-1">
                  {activeRoom.hidingSpots.map((spot, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-amber-500">▸</span> {spot}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Scavenge Loot Spawns:</span>
                <ul className="text-zinc-300 space-y-1 mt-1">
                  {activeRoom.loot.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-cyan-400">▸</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Entity Threat Vector:</span>
                <div className="text-rose-400 font-bold mt-1">
                  {activeRoom.patrolEntity}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

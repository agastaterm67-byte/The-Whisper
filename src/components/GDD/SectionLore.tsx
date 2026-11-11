/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ENTITY_DOSSIERS } from '../../data/archiveLore';
import { Skull, User, Building2, AlertOctagon, FileCheck } from 'lucide-react';
import archiveHallwayImg from '../../assets/images/archive_hallway_vhs_1794361857529.jpg';
import caretakerImg from '../../assets/images/entity_caretaker_1794361857176.jpg';
import patientImg from '../../assets/images/entity_patient_1794361857733.jpg';
import deskImg from '../../assets/images/document_restoration_desk_1794361858533.jpg';

export const SectionLore: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Setting & World Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 p-6 rounded-xl bg-[#0f1117] border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code text-amber-500 uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" />
              <span>Setting & Historical Cover-Up</span>
            </div>
            <h3 className="text-xl font-bold font-cinzel text-zinc-100 mb-3">
              The Blackwood Historical Archives & St. Jude Asylum
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed space-y-2">
              Tucked away on a cobblestone corner of Old Port Town, the Blackwood Document Restoration Center serves as the municipal repository for 19th-century county census, property deeds, and microfilm records.
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed mt-2.5">
              Beneath the damp limestone flooring lies a horrifying secret erased from county maps: in 1928, the St. Jude Colonial Insane Asylum was condemned following a catastrophic basement fire and illegal psychiatric experiments. Rather than demolishing the subterranean solitary wards, the municipal board simply poured concrete over the cell hatches and built the archival storage directly above. The entities trapped within never departed.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center gap-4 text-xs font-mono-code text-zinc-400">
            <div><strong>Location:</strong> Old Port Sector 4</div>
            <div>·</div>
            <div><strong>Sub-levels:</strong> Sealed Asylum Wards A-D</div>
            <div>·</div>
            <div><strong>Incident Year:</strong> 1928 Fire</div>
          </div>
        </div>

        {/* Setting Concept Art Card */}
        <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-black min-h-64 shadow-xl">
          <img
            src={archiveHallwayImg}
            alt="Blackwood Archive Corridor"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-4 flex flex-col justify-end">
            <span className="text-[10px] font-mono-code text-amber-400">CONCEPT VISUAL · CORRIDOR 03</span>
            <span className="text-xs font-bold text-zinc-200">The Subterranean Archive Aisles</span>
          </div>
        </div>
      </div>

      {/* Protagonist Dossier */}
      <div className="p-6 rounded-xl bg-[#0f1117] border border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 uppercase tracking-wider mb-2">
          <User className="w-4 h-4" />
          <span>Protagonist Profile</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-xl font-bold font-cinzel text-zinc-100">
              Samuel Vance (Age 31) · Night Shift Archivist
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Desperate to settle spiraling medical bills from his late mother's hospice care, Samuel agreed to take the graveyard shift (01:00 AM – 04:00 AM) that three prior archivists abandoned within 48 hours.
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Armed only with a heavy halogen flashlight, an inventory clipboard, and a bottle of prescribed phenobarbital sedatives, Samuel quickly realizes why the contract pays double: the archival tasks aren't paperwork—they are an unwitting ritual cataloging the identities of asylum souls bound to the foundation.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/80 min-w-56 text-xs font-mono-code space-y-2 text-zinc-300">
            <div className="text-[10px] text-zinc-500 uppercase">Employee ID: ARC-8831</div>
            <div><strong>Shift Wage:</strong> $14.50 / hour</div>
            <div><strong>Primary Tool:</strong> Halogen Flashlight</div>
            <div><strong>Medication:</strong> Sedative Pills</div>
            <div><strong>Shift Objective:</strong> Sort 4 Asylum Files</div>
          </div>
        </div>

        {/* Desk Concept Art Thumbnail Banner */}
        <div className="mt-4 relative rounded-lg overflow-hidden border border-zinc-800 h-44 bg-black shadow-inner">
          <img
            src={deskImg}
            alt="Archivist Restoration Desk & Tape Recorder"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-3 flex flex-col justify-end">
            <span className="text-[10px] font-mono-code text-amber-400">ARCHIVIST WORKSTATION · LEVEL -1</span>
            <span className="text-xs font-medium text-zinc-200">Restoration Desk, Banker Lamp & Case Files</span>
          </div>
        </div>
      </div>

      {/* Primary Antagonists Dossiers */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono-code text-rose-500 uppercase tracking-wider mb-4">
          <Skull className="w-4 h-4" />
          <span>Primary Antagonist Entities</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. The Caretaker */}
          <div className="rounded-xl border border-zinc-800 bg-[#0f1117] overflow-hidden flex flex-col shadow-xl">
            <div className="h-56 relative bg-black">
              <img
                src={caretakerImg}
                alt="The Caretaker Entity"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-rose-950/90 border border-rose-600 px-2 py-0.5 rounded text-[10px] font-mono-code text-rose-300 uppercase">
                Active: 03:00 - 03:10 Blackout
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-lg font-bold font-cinzel text-zinc-100">
                  {ENTITY_DOSSIERS.caretaker.name}
                </h4>
                <div className="text-xs text-rose-400 font-mono-code mb-2">
                  {ENTITY_DOSSIERS.caretaker.subtitle}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                  {ENTITY_DOSSIERS.caretaker.appearance}
                </p>
                <div className="text-xs text-zinc-400 leading-relaxed">
                  <strong>Behavior:</strong> {ENTITY_DOSSIERS.caretaker.behavior}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 text-[11px] font-mono-code text-amber-300">
                <strong>Countermeasure:</strong> {ENTITY_DOSSIERS.caretaker.countermeasure}
              </div>
            </div>
          </div>

          {/* 2. The Patient */}
          <div className="rounded-xl border border-zinc-800 bg-[#0f1117] overflow-hidden flex flex-col shadow-xl">
            <div className="h-56 relative bg-black">
              <img
                src={patientImg}
                alt="The Patient Entity"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-amber-950/90 border border-amber-600 px-2 py-0.5 rounded text-[10px] font-mono-code text-amber-300 uppercase">
                Acoustic Reactive Lurker
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-lg font-bold font-cinzel text-zinc-100">
                  {ENTITY_DOSSIERS.patient.name}
                </h4>
                <div className="text-xs text-amber-400 font-mono-code mb-2">
                  {ENTITY_DOSSIERS.patient.subtitle}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                  {ENTITY_DOSSIERS.patient.appearance}
                </p>
                <div className="text-xs text-zinc-400 leading-relaxed">
                  <strong>Behavior:</strong> {ENTITY_DOSSIERS.patient.behavior}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 text-[11px] font-mono-code text-amber-300">
                <strong>Countermeasure:</strong> {ENTITY_DOSSIERS.patient.countermeasure}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

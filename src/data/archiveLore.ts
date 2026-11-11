/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArchiveDocument } from '../types/game';

export const INITIAL_ARCHIVE_DOCUMENTS: ArchiveDocument[] = [
  {
    id: 'DOC-1928-04',
    title: 'Ward 4 Floorplan & Sub-Level Foundation',
    date: 'OCTOBER 14, 1928',
    classification: 'RESTRICTED / TOP SECRET',
    location: 'Filing Cabinet C-03 (Basement North)',
    content: 'Blueprints for the St. Jude Colonial Asylum foundation. Hand-written note in margin: "Concrete depth increased to 18 feet. Sub-basement cell doors bolted from external corridor only. No release protocol approved by Governor council. Under no circumstances unseal the ventilation shafts connecting to municipal sewer."',
    isSorted: false
  },
  {
    id: 'DOC-1952-19',
    title: 'Incident Report: Orderly Disappearance',
    date: 'NOVEMBER 03, 1952',
    classification: 'CONFIDENTIAL',
    location: 'Archivist Restoration Desk',
    content: 'Night watch orderly Marcus E. reported missing during the 03:00 generator cycle. Personal items left intact at security booth. Flashlight recovered near ventilation grating with battery casing crushed inward. Heavy scrape marks found along ceiling masonry, 12 feet above ground level.',
    isSorted: false
  },
  {
    id: 'DOC-1971-88',
    title: 'Decommissioning Protocol & Coverup Mandate',
    date: 'AUGUST 19, 1971',
    classification: 'DIRECTIVE LEVEL 5',
    location: 'Microfilm Scanner Drawer B',
    content: 'Municipal Archives Dept took official title of the St. Jude property. Construction order states: "Surface structure repurposed for municipal microfiche and census records. All subterranean levels backfilled with crushed limestone. Do not attempt structural excavation below elevation -4.2m."',
    isSorted: false
  },
  {
    id: 'DOC-1998-02',
    title: 'Night Archivist Shift Log #409',
    date: 'FEBRUARY 27, 1998',
    classification: 'INTERNAL LOG',
    location: 'Shelf Unit 12 (South Wall)',
    content: 'Shift archivist Henderson: "The 3 AM power fluctuation is not mechanical. The breakers trip simultaneously regardless of grid load. If you hear rhythmic tapping on the ceiling tin, turn off the banker lamp and crawl beneath Desk 2. Do not breathe until the hallway footsteps fade toward the furnace room."',
    isSorted: false
  }
];

export const ENTITY_DOSSIERS = {
  caretaker: {
    name: 'The Caretaker',
    subtitle: 'The Blackout Stalker (Entity #01)',
    appearance: 'A tall (9 ft), emaciated, faceless silhouette dressed in decaying asylum orderly uniform. Long slender limbs extending past knees. Eyes replaced by deep hollow pits that catch red emergency light reflections.',
    behavior: 'Manifests strictly during the 03:00 - 03:10 Total Blackout window. Moves with slow, deliberate, heavy footsteps. Follows fixed corridor patrol routes but will pivot immediately toward any light source or heavy breathing sound.',
    countermeasure: 'Absolute stillness in an enclosed hiding spot (inside metal filing cabinets or ducked under heavy wooden desks). Flashlights must be turned OFF immediately when hearing footsteps.',
    dangerLevel: 'LETHAL - Instant Game Over on direct visual line-of-sight in open corridor.'
  },
  patient: {
    name: 'The Patient',
    subtitle: 'Ceiling Lurker (Entity #02)',
    appearance: 'A severely contorted humanoid with hyper-extended joints and pale mottled skin, inverted upside down along rusted water pipes and industrial girders.',
    behavior: 'Dormant until sudden acoustic spikes. Highly sensitive to running footsteps, flashlight clicks, and panic gasps. Creeps along ceiling shadows, making wet bone-popping clicks.',
    countermeasure: 'Crouch-walking, pacing breath control, and keeping the flashlight aimed low away from ceiling vents and high girders.',
    dangerLevel: 'ACOUSTIC THREAT - Triggers high sanity drain and aggressive pounce if player runs.'
  }
};

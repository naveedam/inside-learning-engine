/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurriculumPack } from "../types";
import { physicsClass11Curriculum } from "./physics_class_11/kinematics";
import { newtonsLawsChapter } from "./physics_class_11/newtons_laws";
import { energyDepthsChapter } from "./physics_class_11/energy_depths";
import { chemistryClass11Curriculum } from "./chemistry_class_11/stoichiometry";
import { historyClass11Curriculum } from "./history_class_11/french_revolution";
import { literatureClass11Curriculum } from "./literature_class_11/frankenstein";
import { mathematicsClass11Curriculum } from "./mathematics_class_11/limits_and_derivatives";
import { biologyClass11Curriculum } from "./biology_class_11/plant_physiology";

// Inject Newton's Laws as Expedition 02
if (!physicsClass11Curriculum.chapters.some(ch => ch.id === "newtons-laws")) {
  physicsClass11Curriculum.chapters.push(newtonsLawsChapter);
}

// Inject Energy Depths as Expedition 03
if (!physicsClass11Curriculum.chapters.some(ch => ch.id === "energy-depths")) {
  physicsClass11Curriculum.chapters.push(energyDepthsChapter);
}

export const curriculumRegistry: Record<string, CurriculumPack> = {
  "physics-class-11": physicsClass11Curriculum,
  "mathematics-class-11": mathematicsClass11Curriculum,
  "chemistry-class-11": chemistryClass11Curriculum,
  "biology-class-11": biologyClass11Curriculum,
  "history-class-11": historyClass11Curriculum,
  "literature-class-11": literatureClass11Curriculum
};

export function getAllCurriculumPacks(): CurriculumPack[] {
  return Object.values(curriculumRegistry);
}

export function getCurriculumPackById(id: string): CurriculumPack | undefined {
  return curriculumRegistry[id];
}

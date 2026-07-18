/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurriculumPack } from "../types";
import { physicsClass11Curriculum } from "./physics_class_11/kinematics";
import { newtonsLawsChapter } from "./physics_class_11/newtons_laws";
import { chemistryClass11Curriculum } from "./chemistry_class_11/stoichiometry";
import { historyClass11Curriculum } from "./history_class_11/french_revolution";
import { literatureClass11Curriculum } from "./literature_class_11/frankenstein";

// Inject Newton's Laws as Expedition 02
if (!physicsClass11Curriculum.chapters.some(ch => ch.id === "newtons-laws")) {
  physicsClass11Curriculum.chapters.push(newtonsLawsChapter);
}

export const curriculumRegistry: Record<string, CurriculumPack> = {
  "physics-class-11": physicsClass11Curriculum,
  "chemistry-class-11": chemistryClass11Curriculum,
  "history-class-11": historyClass11Curriculum,
  "literature-class-11": literatureClass11Curriculum
};

export function getAllCurriculumPacks(): CurriculumPack[] {
  return Object.values(curriculumRegistry);
}

export function getCurriculumPackById(id: string): CurriculumPack | undefined {
  return curriculumRegistry[id];
}

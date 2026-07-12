/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurriculumPack } from "../types";
import { physicsClass11Curriculum } from "./physics_class_11/kinematics";

export const curriculumRegistry: Record<string, CurriculumPack> = {
  "physics-class-11": physicsClass11Curriculum
  // Future expansion blocks:
  // "chemistry-class-11": chemistryClass11Curriculum,
  // "history-class-11": historyClass11Curriculum,
  // etc.
};

export function getAllCurriculumPacks(): CurriculumPack[] {
  return Object.values(curriculumRegistry);
}

export function getCurriculumPackById(id: string): CurriculumPack | undefined {
  return curriculumRegistry[id];
}

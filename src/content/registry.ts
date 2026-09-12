/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurriculumPack, Chapter } from "../types";
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

// Full ISC Class XI Physics Expedition Roadmap Chapters (from PHYSICS_EXPEDITION_ROADMAP.md)
const physicsRoadmapSyllabusChapters: Chapter[] = [
  {
    id: "gravitation",
    title: "Kepler's Gravity: Gravitation",
    shortDescription: "Orbital speed vectors, escape velocity, and planetary gravitation fields.",
    longDescription: "Calibrate orbital insertion trajectories around ultra-dense stellar cores. Balance gravitational attraction with tangential velocity to discover Kepler's laws.",
    difficulty: "Intermediate",
    estimatedMinutes: 30,
    constellationPosition: { x: 25, y: 35 },
    curricularRequirements: [
      "Kepler's Laws of Planetary Motion and empirical verification of orbital area sweeps.",
      "Universal Law of Gravitation, acceleration due to gravity, and variation with altitude.",
      "Gravitational potential energy, orbital velocity, and escape velocity derivation."
    ],
    missions: []
  },
  {
    id: "rotational-motion",
    title: "Torque & Spin: Rotational Kinematics & Rigid Bodies",
    shortDescription: "Angular velocity, torque, moment of inertia, and angular momentum conservation.",
    longDescription: "Control internal mass distribution, radius of gyration, and rolling-without-slipping conditions across steep planetary inclines.",
    difficulty: "Advanced",
    estimatedMinutes: 25,
    constellationPosition: { x: 35, y: 25 },
    curricularRequirements: [
      "Centre of mass of a two-particle system, momentum conservation, and center of mass motion.",
      "Moment of a force, torque, angular momentum, and conservation of angular momentum.",
      "Moment of inertia, radius of gyration, and parallel and perpendicular axes theorems."
    ],
    missions: []
  },
  {
    id: "mechanical-properties-solids",
    title: "Stress & Strain: Properties of Bulk Matter",
    shortDescription: "Hooke's Law, Young's Modulus, elastic limits, and stress-strain curves.",
    longDescription: "Strain-test suspension bridge alloys under simulated tectonic loads. Discover how macroscopic material limits emerge from microscopic atomic bonds.",
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    constellationPosition: { x: 45, y: 20 },
    curricularRequirements: [
      "Elastic behavior, stress-strain relationship, Hooke's law, and elastic moduli.",
      "Young's modulus, bulk modulus, shear modulus of rigidity, and Poisson's ratio.",
      "Elastic energy density and materials fracture boundary curves."
    ],
    missions: []
  },
  {
    id: "fluid-mechanics",
    title: "Fluid Currents: Fluid Mechanics",
    shortDescription: "Pressure variations with depth, Pascal's Law, viscosity, and Bernoulli's Principle.",
    longDescription: "Guide a deep-sea submersible through narrow geothermal vent tubes. Resolve the Venturi paradox where fluid speed increases as static pressure plummets.",
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    constellationPosition: { x: 58, y: 22 },
    curricularRequirements: [
      "Pressure due to a fluid column, Pascal's law, and hydraulic systems.",
      "Viscosity, Stokes' law, terminal velocity, and streamline flow.",
      "Bernoulli's principle and its applications to venturi tubes and aerodynamic lift."
    ],
    missions: []
  },
  {
    id: "thermodynamics",
    title: "Thermal Engines: Thermodynamics",
    shortDescription: "First & Second Laws of Thermodynamics, PV gas cycles, and Carnot efficiency.",
    longDescription: "Tune a geothermal power core's thermodynamic cycle. Balance isothermal expansions with adiabatic compression to discover Carnot's inescapable efficiency ceiling.",
    difficulty: "Advanced",
    estimatedMinutes: 25,
    constellationPosition: { x: 70, y: 28 },
    curricularRequirements: [
      "Thermal equilibrium and definition of temperature (zeroth law of thermodynamics).",
      "First law of thermodynamics: work, heat, and internal energy changes.",
      "Second law of thermodynamics: reversible and irreversible processes, Carnot engine efficiency."
    ],
    missions: []
  },
  {
    id: "kinetic-theory",
    title: "Kinetic Swarms: Behavior of Gases",
    shortDescription: "Kinetic Theory of Gases, RMS molecular speeds, and Maxwell-Boltzmann distributions.",
    longDescription: "Track atomic collisions inside life-support gas chambers. Discover how macroscopic temperature and pressure emerge from chaotic statistical distributions.",
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    constellationPosition: { x: 80, y: 38 },
    curricularRequirements: [
      "Equation of state of a perfect gas, work done on compressing a gas.",
      "Kinetic theory of gases - assumptions, concept of pressure, and kinetic energy.",
      "RMS speed of gas molecules, degrees of freedom, and law of equipartition of energy."
    ],
    missions: []
  },
  {
    id: "oscillations-waves",
    title: "Harmonic Echoes: Oscillations & Waves",
    shortDescription: "Simple Harmonic Motion, restoring force, resonance, and wave interference.",
    longDescription: "Calibrate a seismic sound array across glacial ice sheets. Tune physical pendulums to resonance frequencies to bounce waves through hidden cavern profiles.",
    difficulty: "Advanced",
    estimatedMinutes: 30,
    constellationPosition: { x: 90, y: 50 },
    curricularRequirements: [
      "Periodic motion - time period, frequency, displacement as a function of time.",
      "Simple harmonic motion (SHM) and its equation, phase, oscillations of a spring and pendulum.",
      "Wave motion, longitudinal and transverse waves, speed of wave motion, and principle of superposition."
    ],
    missions: []
  }
];

// Inject remaining Physics syllabus chapters if not already present
for (const roadmapChapter of physicsRoadmapSyllabusChapters) {
  if (!physicsClass11Curriculum.chapters.some(ch => ch.id === roadmapChapter.id)) {
    physicsClass11Curriculum.chapters.push(roadmapChapter);
  }
}

export const curriculumRegistry: Record<string, CurriculumPack> = {
  "physics-class-11": physicsClass11Curriculum,
  "mathematics-class-11": mathematicsClass11Curriculum,
  "chemistry-class-11": chemistryClass11Curriculum,
  "biology-class-11": biologyClass11Curriculum,
  "history-class-11": historyClass11Curriculum,
  "literature-class-11": literatureClass11Curriculum
};

/**
 * Pure dynamic status check derived from whether a chapter contains
 * real registered Mission content in the curriculum registry.
 * Never hand-maintained.
 */
export function isChapterActive(chapter: Chapter): boolean {
  if (!chapter || !Array.isArray(chapter.missions)) return false;
  return chapter.missions.length > 0 && chapter.missions.some(m => Boolean(m && m.id));
}

export function getChapterStatus(chapter: Chapter): "Active" | "Coming Online" {
  return isChapterActive(chapter) ? "Active" : "Coming Online";
}

export function getPackActiveChaptersCount(pack: CurriculumPack): { active: number; total: number } {
  const total = pack.chapters.length;
  const active = pack.chapters.filter(isChapterActive).length;
  return { active, total };
}

export function getAllCurriculumPacks(): CurriculumPack[] {
  return Object.values(curriculumRegistry);
}

export function getCurriculumPackById(id: string): CurriculumPack | undefined {
  return curriculumRegistry[id];
}


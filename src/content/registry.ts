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
import { orbitalInsertionMission } from "./physics_class_11/gravitation";
import { rollingInertiaMission } from "./physics_class_11/rotational_motion";
import { tensileStressMission } from "./physics_class_11/mechanical_properties_solids";
import { venturiNavigationMission } from "./physics_class_11/fluid_mechanics";
import { carnotEfficiencyMission } from "./physics_class_11/thermodynamics";
import { gasIdentificationMission } from "./physics_class_11/kinetic_theory";
import { seismicResonanceMission } from "./physics_class_11/oscillations_waves";
import { atmosphericVentingMission } from "./chemistry_class_11/states_of_matter";
import { spontaneityThresholdMission } from "./chemistry_class_11/chemical_thermodynamics";
import { equilibriumConstantMission } from "./chemistry_class_11/equilibrium";
import { cellPotentialCalibrationMission } from "./chemistry_class_11/redox_reactions";
import { bohrModelMission } from "./chemistry_class_11/atomic_structure";

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
    missions: [orbitalInsertionMission]
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
    missions: [rollingInertiaMission]
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
    missions: [tensileStressMission]
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
    missions: [venturiNavigationMission]
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
    missions: [carnotEfficiencyMission]
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
    missions: [gasIdentificationMission]
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
    missions: [seismicResonanceMission]
  }
];

// Inject remaining Physics syllabus chapters if not already present
for (const roadmapChapter of physicsRoadmapSyllabusChapters) {
  if (!physicsClass11Curriculum.chapters.some(ch => ch.id === roadmapChapter.id)) {
    physicsClass11Curriculum.chapters.push(roadmapChapter);
  }
}

// Full ISC Class XI Chemistry Roadmap Chapters
const chemistryRoadmapChapters: Chapter[] = [
  {
    id: "atomic-structure",
    title: "Atomic Structure: Quantum Orbitals & Spectral Lines",
    shortDescription: "Bohr model, de Broglie wavelength, Heisenberg uncertainty, and electron orbital probability clouds.",
    longDescription: "Calibrate spectrometer frequencies to analyze emission spectra of distant stellar gas clouds. Probe energy quantizations and orbital electron densities.",
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    constellationPosition: { x: 25, y: 65 },
    curricularRequirements: [
      "Bohr's model and limitations, dual nature of matter and radiation, de Broglie relation.",
      "Heisenberg uncertainty principle, concept of orbitals, quantum numbers, shapes of s, p and d orbitals.",
      "Aufbau principle, Pauli exclusion principle, Hund's rule of maximum multiplicity, and electronic configurations."
    ],
    missions: [bohrModelMission]
  },
  {
    id: "periodicity",
    title: "Periodicity: Elemental Trends & Valence Shells",
    shortDescription: "Periodic trends in atomic radii, ionization enthalpy, electron gain enthalpy, and electronegativity.",
    longDescription: "Synthesize novel alloy shields for deep space radiation. Balance periodic shell shielding and effective nuclear charges across elemental groups.",
    difficulty: "Beginner",
    estimatedMinutes: 20,
    constellationPosition: { x: 35, y: 70 },
    curricularRequirements: [
      "Modern periodic law and present form of periodic table, s, p, d, f block elements.",
      "Periodic trends in properties of elements: atomic and ionic radii, inert gas radii.",
      "Ionization enthalpy, electron gain enthalpy, electronegativity, and valence state periodicity."
    ],
    missions: []
  },
  {
    id: "chemical-bonding",
    title: "Chemical Bonding & Molecular Architecture",
    shortDescription: "Lewis structures, VSEPR geometry, orbital hybridization, and molecular orbital theory.",
    longDescription: "Predict molecular geometries of exotic atmospheric volatiles. Construct hybrid orbitals and calculate bond orders to stabilize atmospheric scrubbers.",
    difficulty: "Advanced",
    estimatedMinutes: 30,
    constellationPosition: { x: 45, y: 60 },
    curricularRequirements: [
      "Valence electrons, ionic and covalent bonds, bond parameters, Lewis structures, polar character of covalent bond.",
      "Valence Shell Electron Pair Repulsion (VSEPR) theory and geometry of molecules.",
      "Hybridization involving s, p and d orbitals, and Molecular Orbital Theory of homonuclear diatomic molecules."
    ],
    missions: []
  },
  {
    id: "states-of-matter",
    title: "States of Matter: Planetary Gases & Intermolecular Fields",
    shortDescription: "Gas laws, ideal gas equation, van der Waals real gas corrections, and critical liquefaction.",
    longDescription: "Maintain cryo-storage pressures in high-pressure Jovian atmospheres. Analyze deviation from ideal gas behavior under extreme planetary compression.",
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    constellationPosition: { x: 55, y: 65 },
    curricularRequirements: [
      "Three states of matter, intermolecular interactions, types of bonding, melting and boiling points.",
      "Gas laws: Boyle's, Charles's, Gay Lussac's, Avogadro's laws, and ideal gas equation.",
      "Deviation from ideal behavior, van der Waals equation, liquefaction of gases, and critical temperature."
    ],
    missions: [atmosphericVentingMission]
  },
  {
    id: "chemical-thermodynamics",
    title: "Thermodynamics: Enthalpy, Entropy & Free Energy",
    shortDescription: "First & Second Laws, Hess's Law, lattice enthalpy, entropy, and Gibbs free energy spontaneity.",
    longDescription: "Fuel thermal thrusters with exothermic hypergolic reactions. Calculate Gibbs free energy differentials (ΔG = ΔH - TΔS) to determine spontaneous reaction boundaries.",
    difficulty: "Advanced",
    estimatedMinutes: 30,
    constellationPosition: { x: 65, y: 70 },
    curricularRequirements: [
      "Concepts of system and surroundings, work, heat, energy, extensive and intensive properties, state functions.",
      "First law of thermodynamics - internal energy and enthalpy, heat capacity, Hess's law of constant heat summation.",
      "Second law of thermodynamics: entropy as a state function, Gibbs energy change for spontaneous and non-spontaneous processes."
    ],
    missions: [spontaneityThresholdMission]
  },
  {
    id: "equilibrium",
    title: "Equilibrium: Dynamic Shifts & Le Chatelier's Law",
    shortDescription: "Chemical equilibrium constants (Kc, Kp), Le Chatelier's principle, and ionic solubility products.",
    longDescription: "Balance closed-loop atmospheric life support. Stress-test gas yields against temperature, volume, and pressure shifts to maintain continuous catalytic equilibrium.",
    difficulty: "Advanced",
    estimatedMinutes: 25,
    constellationPosition: { x: 75, y: 60 },
    curricularRequirements: [
      "Equilibrium in physical and chemical processes, dynamic nature of equilibrium, law of mass action, equilibrium constant.",
      "Factors affecting equilibrium: Le Chatelier's principle - concentration, temperature, pressure effect.",
      "Ionic equilibrium: ionization of acids and bases, pH scale, buffer solutions, solubility product and common ion effect."
    ],
    missions: [equilibriumConstantMission]
  },
  {
    id: "redox-reactions",
    title: "Redox Reactions: Electron Transfer & Electrochemical Potentials",
    shortDescription: "Oxidation numbers, redox balancing, half-reactions, and standard electrode potentials.",
    longDescription: "Recharge deep-space galvanic storage cells through controlled electron transfer. Track electrochemical oxidation states to prevent fuel cell degradation.",
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    constellationPosition: { x: 80, y: 50 },
    curricularRequirements: [
      "Concept of oxidation and reduction, redox reactions, oxidation number balancing.",
      "Balancing redox reactions: loss and gain of electrons, half-reaction method, oxidation number method.",
      "Electrochemical cells, standard electrode potentials, and applications of redox reactions."
    ],
    missions: [cellPotentialCalibrationMission]
  },
  {
    id: "hydrogen-s-p-block",
    title: "Hydrogen & s/p-Block Elements: Hydride & Alkali Chemistry",
    shortDescription: "Position of hydrogen, hydrides, alkali and alkaline earth metals, and Group 13/14 anomalous properties.",
    longDescription: "Extract hydrogen fuel from cometary ice and refine lightweight boron/aluminum alloys for station hulls.",
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    constellationPosition: { x: 70, y: 40 },
    curricularRequirements: [
      "Position of hydrogen in periodic table, isotopes, preparation, hydrides, hydrogen peroxide.",
      "Group 1 and Group 2 elements: general electronic configuration, anomalous properties, diagonal relationship.",
      "Group 13 and Group 14 elements: oxidation states, trends in chemical reactivity, inert pair effect."
    ],
    missions: []
  },
  {
    id: "organic-chemistry-basics",
    title: "Organic Chemistry: Carbon Frameworks & Reaction Mechanisms",
    shortDescription: "IUPAC nomenclature, electronic displacements (inductive, electromeric, resonance, hyperconjugation), and reactive intermediates.",
    longDescription: "Map organic reaction pathways and analyze electron displacements through carbocation, carbanion, and free-radical intermediates.",
    difficulty: "Advanced",
    estimatedMinutes: 30,
    constellationPosition: { x: 60, y: 35 },
    curricularRequirements: [
      "Classification and IUPAC nomenclature of organic compounds, structural and stereoisomerism.",
      "Electronic displacements: inductive effect, electromeric effect, resonance and hyperconjugation.",
      "Homolytic and heterolytic fission, reactive intermediates: carbocations, carbanions, free radicals, electrophiles and nucleophiles."
    ],
    missions: []
  },
  {
    id: "hydrocarbons",
    title: "Hydrocarbons: Alkanes, Alkenes, Alkynes & Aromatic Systems",
    shortDescription: "Conformations of ethane, Markovnikov addition, ozonolysis, and electrophilic aromatic substitution.",
    longDescription: "Synthesize high-energy hydrocarbon fuels and aromatic polymers for planetary rover components.",
    difficulty: "Advanced",
    estimatedMinutes: 30,
    constellationPosition: { x: 50, y: 45 },
    curricularRequirements: [
      "Alkanes: nomenclature, conformations of ethane, physical properties, chemical reactions including free radical halogenation.",
      "Alkenes and Alkynes: structure of double and triple bonds, geometrical isomerism, electrophilic addition mechanisms, Markovnikov's rule.",
      "Aromatic hydrocarbons: benzene structure, resonance, aromaticity (Huckel's rule), electrophilic substitution mechanisms."
    ],
    missions: []
  }
];

// Inject remaining Chemistry syllabus chapters
for (const ch of chemistryRoadmapChapters) {
  if (!chemistryClass11Curriculum.chapters.some(existing => existing.id === ch.id)) {
    chemistryClass11Curriculum.chapters.push(ch);
  }
}

// Full ISC Class XI Mathematics Roadmap Chapters
const mathematicsRoadmapChapters: Chapter[] = [
  {
    id: "sets-and-functions",
    title: "Sets & Functions: Mappings & Relations",
    shortDescription: "Venn logic, Cartesian products, relation equivalence, and function domain-range mappings.",
    longDescription: "Catalog stellar telemetry sets and establish one-to-one and onto mappings for astronomical positioning databases.",
    difficulty: "Beginner",
    estimatedMinutes: 20,
    constellationPosition: { x: 20, y: 40 },
    curricularRequirements: [
      "Sets and their representations, empty set, finite and infinite sets, subsets, power set, universal set, Venn diagrams.",
      "Ordered pairs, Cartesian product of sets, relations, domain, codomain and range of a relation.",
      "Functions as special types of relations, pictorial representation of a function, domain, codomain and range."
    ],
    missions: []
  },
  {
    id: "trigonometric-functions",
    title: "Trigonometric Functions: Waveforms & Periodic Ratios",
    shortDescription: "Radian measures, unit circle trigonometry, sign of functions in quadrants, and sum-to-product identities.",
    longDescription: "Calibrate frequency modulations and radio interferometer dishes using sinusoidal transformations across angular phases.",
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    constellationPosition: { x: 25, y: 35 },
    curricularRequirements: [
      "Positive and negative angles, measuring angles in radians and in degrees, conversion from one measure to another.",
      "Definition of trigonometric functions with the help of unit circle, truth of identities sin²x + cos²x = 1.",
      "Signs of trigonometric functions, domain and range of trigonometric functions, and addition/subtraction trigonometric identities."
    ],
    missions: []
  },
  {
    id: "mathematical-induction",
    title: "Mathematical Induction: Inductive Proofs & Peano Axioms",
    shortDescription: "Principle of mathematical induction, base step verification, inductive hypothesis, and axiomatic validation.",
    longDescription: "Formally verify recurring algorithm stability across arbitrary communication relay node depths n and n+1.",
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    constellationPosition: { x: 30, y: 30 },
    curricularRequirements: [
      "Process of the proof by induction, motivating the application of the method by looking at natural numbers as least inductive subset of real numbers.",
      "The principle of mathematical induction and simple applications to sum formulas and divisibility properties."
    ],
    missions: []
  },
  {
    id: "complex-numbers-quadratics",
    title: "Complex Numbers & Quadratic Equations: The Argand Plane",
    shortDescription: "Imaginary unit i, modulus-argument form, Argand diagrams, and quadratic roots in complex domains.",
    longDescription: "Map alternating electromagnetic phase angles onto the Argand plane. Resolve negative discriminants into orthogonal real and imaginary vectors.",
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    constellationPosition: { x: 35, y: 35 },
    curricularRequirements: [
      "Need for complex numbers, algebraic properties of complex numbers, Argand plane and polar representation.",
      "Fundamental Theorem of Algebra, solutions of quadratic equations with non-real roots in the complex number system."
    ],
    missions: []
  },
  {
    id: "linear-inequalities",
    title: "Linear Inequalities: Coordinate Constraints & Feasible Bounds",
    shortDescription: "Algebraic solutions of linear inequalities in one variable and graphical representation on Cartesian planes.",
    longDescription: "Solve resource allocation corridors and power-distribution boundary conditions under competing life-support constraints.",
    difficulty: "Beginner",
    estimatedMinutes: 15,
    constellationPosition: { x: 40, y: 40 },
    curricularRequirements: [
      "Linear inequalities, algebraic solutions of linear inequalities in one variable and their representation on the number line.",
      "Graphical solution of linear inequalities in two variables, graphical method of finding a solution of system of linear inequalities."
    ],
    missions: []
  },
  {
    id: "permutations-combinations",
    title: "Permutations & Combinations: Combinatorial Spaces",
    shortDescription: "Fundamental counting principle, factorial notation, permutations nPr, and combinations nCr.",
    longDescription: "Calculate cryptographic key spaces and orbital transfer scheduling combinations across exploration fleets.",
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    constellationPosition: { x: 45, y: 30 },
    curricularRequirements: [
      "Fundamental principle of counting, factorial n, permutations and combinations, derivation of formulae and their connections.",
      "Simple practical applications of permutations and combinations."
    ],
    missions: []
  },
  {
    id: "binomial-theorem",
    title: "Binomial Theorem: Series Expansions & Pascal Fields",
    shortDescription: "Binomial theorem for positive integral indices, Pascal's triangle, and general/middle terms.",
    longDescription: "Derive power series approximations for relativistic velocity terms in high-energy engine exhaust streams.",
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    constellationPosition: { x: 50, y: 35 },
    curricularRequirements: [
      "History, statement and proof of the binomial theorem for positive integral indices.",
      "Pascal's triangle, general and middle term in binomial expansion, simple applications."
    ],
    missions: []
  },
  {
    id: "sequences-and-series",
    title: "Sequences & Series: Geometric & Arithmetic Progressions",
    shortDescription: "AP, GP, arithmetic/geometric means, and sum of infinite convergent progressions.",
    longDescription: "Calculate orbital decay series, compounding gravitational slingshot boosts, and infinite convergent harmonic sums.",
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    constellationPosition: { x: 55, y: 25 },
    curricularRequirements: [
      "Arithmetic Progression (A.P.), Arithmetic Mean (A.M.), Geometric Progression (G.P.), general term of a G.P.",
      "Sum of n terms of a G.P., infinite G.P. and its sum, geometric mean (G.M.), relation between A.M. and G.M."
    ],
    missions: []
  },
  {
    id: "straight-lines",
    title: "Straight Lines: Coordinate Slopes & Linear Loci",
    shortDescription: "Slope of a line, angle between lines, intercept and normal forms, distance of point to line.",
    longDescription: "Map linear laser communication lines and compute intersection corridors through asteroid defense sectors.",
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    constellationPosition: { x: 60, y: 30 },
    curricularRequirements: [
      "Brief recall of two dimensional geometry from earlier classes, slope of a line and angle between two lines.",
      "Various forms of equations of a line: parallel to axis, point-slope form, slope-intercept form, two-point form, intercept form, and normal form.",
      "General equation of a line, distance of a point from a line."
    ],
    missions: []
  },
  {
    id: "conic-sections",
    title: "Conic Sections: Ellipses, Parabolas & Hyperbolas",
    shortDescription: "Sections of a cone, standard equations of circle, ellipse, parabola, hyperbola, and eccentricity.",
    longDescription: "Plot planetary flybys, focal eccentricity, and hyperbolic escape trajectories through celestial gravity wells.",
    difficulty: "Advanced",
    estimatedMinutes: 30,
    constellationPosition: { x: 65, y: 35 },
    curricularRequirements: [
      "Sections of a cone: circles, ellipse, parabola, hyperbola, a point, a straight line and a pair of intersecting lines as a degenerated case of a conic section.",
      "Standard equations and simple properties of parabola, ellipse and hyperbola, standard equation of a circle."
    ],
    missions: []
  },
  {
    id: "three-dimensional-geometry",
    title: "3D Geometry: Coordinate Spaces & Spatial Projections",
    shortDescription: "Coordinate planes, octants, distance formula in 3D, and section formulas.",
    longDescription: "Plot three-dimensional coordinates in deep space star charts. Compute 3D Euclidean distances across spatial octants.",
    difficulty: "Beginner",
    estimatedMinutes: 15,
    constellationPosition: { x: 75, y: 55 },
    curricularRequirements: [
      "Coordinate axes and coordinate planes in three dimensions, coordinates of a point, octants.",
      "Distance between two points and section formula in 3-dimensional space."
    ],
    missions: []
  },
  {
    id: "mathematical-reasoning",
    title: "Mathematical Reasoning: Propositional Logic",
    shortDescription: "Deductive statements, implications, negations, contrapositive proofs, and truth tables.",
    longDescription: "Analyze formal deductive propositional logic and contrapositive verification proofs for automated station verification systems.",
    difficulty: "Beginner",
    estimatedMinutes: 15,
    constellationPosition: { x: 80, y: 60 },
    curricularRequirements: [
      "Mathematically acceptable statements, connecting words/phrases: and, or, implies, if and only if.",
      "Validating statements: direct proof, contrapositive proof, method of contradiction, and counterexamples."
    ],
    missions: []
  },
  {
    id: "statistics",
    title: "Statistics: Measures of Dispersion & Variance",
    shortDescription: "Range, mean deviation, variance and standard deviation of ungrouped and grouped frequency distributions.",
    longDescription: "Filter noise from deep space sensor arrays. Compute standard deviations and variance envelopes for anomaly detection.",
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    constellationPosition: { x: 85, y: 45 },
    curricularRequirements: [
      "Measures of dispersion: range, mean deviation, variance and standard deviation of ungrouped/grouped data.",
      "Analysis of frequency distributions with equal means but different variances."
    ],
    missions: []
  },
  {
    id: "probability",
    title: "Probability: Axiomatic Distributions & Random Events",
    shortDescription: "Sample spaces, events, mutually exclusive events, independent trials, and axiomatic probability.",
    longDescription: "Calculate risk probabilities and Monte Carlo failure likelihoods for delicate atmospheric reentry vectors.",
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    constellationPosition: { x: 90, y: 40 },
    curricularRequirements: [
      "Random experiments: outcomes, sample spaces (set representation), events: occurrence of events, 'not', 'and' & 'or' events, exhaustive events, mutually exclusive events.",
      "Axiomatic (set theoretic) probability, connections with the theories of earlier classes, probability of an event, probability of 'not', 'and' & 'or' events."
    ],
    missions: []
  }
];

// Inject remaining Mathematics syllabus chapters
for (const ch of mathematicsRoadmapChapters) {
  if (!mathematicsClass11Curriculum.chapters.some(existing => existing.id === ch.id)) {
    mathematicsClass11Curriculum.chapters.push(ch);
  }
}

// Full ISC Class XI Biology Roadmap Chapters (18 additional placeholder chapters)
const biologyRoadmapChapters: Chapter[] = [
  {
    id: "the-living-world",
    title: "The Living World: Biodiversity & Taxonomy",
    shortDescription: "Biodiversity, taxonomical hierarchy, binomial nomenclature, and herbarium/zoological park systems.",
    longDescription: "Establish initial classification criteria for extremophilic planetary specimens using universal binomial nomenclature.",
    difficulty: "Beginner",
    estimatedMinutes: 20,
    constellationPosition: { x: 15, y: 70 },
    curricularRequirements: [
      "What is living? Biodiversity, need for classification, three domains of life.",
      "Taxonomy & Systematics, concept of species and taxonomical hierarchy, binomial nomenclature.",
      "Tools for study of taxonomy: museums, zoological parks, herbaria, and botanical gardens."
    ],
    missions: []
  },
  {
    id: "biological-classification",
    title: "Biological Classification: Five Kingdom Systems",
    shortDescription: "Monera, Protista, Fungi, Lichens, Viruses, and Viroids classification criteria.",
    longDescription: "Classify primitive unicellular organisms isolated from geothermal deep vents into kingdom taxa.",
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    constellationPosition: { x: 22, y: 75 },
    curricularRequirements: [
      "Five kingdom classification; salient features and classification of Monera, Protista and Fungi into major groups.",
      "Lichens, Viruses, Viroids and Prions: structural organization and biological nature."
    ],
    missions: []
  },
  {
    id: "plant-kingdom",
    title: "Plant Kingdom: Cryptogams & Phanerogams",
    shortDescription: "Algae, Bryophytes, Pteridophytes, Gymnosperms, and Angiosperms life cycles.",
    longDescription: "Map evolutionary transitions in alternation of generations and vascularization across aquatic and terrestrial flora.",
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    constellationPosition: { x: 30, y: 72 },
    curricularRequirements: [
      "Salient features and classification of plants into major groups: Algae, Bryophytes, Pteridophytes, Gymnosperms.",
      "Angiosperms: classification up to class, characteristic features and examples.",
      "Plant life cycles and alternation of generations."
    ],
    missions: []
  },
  {
    id: "animal-kingdom",
    title: "Animal Kingdom: Non-Chordates & Chordates",
    shortDescription: "Levels of organisation, symmetry, coelom, and phylum characteristics from Porifera to Mammalia.",
    longDescription: "Survey morphological adaptations and coelomic architecture across non-chordate and chordate phyla.",
    difficulty: "Advanced",
    estimatedMinutes: 30,
    constellationPosition: { x: 36, y: 80 },
    curricularRequirements: [
      "Basis of classification: levels of organisation, symmetry, diploblastic and triploblastic organisation, coelom.",
      "Salient features and classification of non-chordates up to phyla level and chordates up to class level."
    ],
    missions: []
  },
  {
    id: "morphology-flowering-plants",
    title: "Morphology of Flowering Plants: Floral Architecture",
    shortDescription: "Root, stem, leaf modifications, inflorescence, flower anatomy, and family descriptions.",
    longDescription: "Examine anatomical adaptations of angiosperms engineered for hydroponic food modules.",
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    constellationPosition: { x: 44, y: 76 },
    curricularRequirements: [
      "Morphology and modifications of root, stem, leaf, inflorescence: racemose and cymose.",
      "Flower, fruit and seed; description of representative angiospermic families."
    ],
    missions: []
  },
  {
    id: "anatomy-flowering-plants",
    title: "Anatomy of Flowering Plants: Tissues & Meristems",
    shortDescription: "Meristematic & permanent tissues, tissue systems, and internal structure of dicot/monocot organs.",
    longDescription: "Cross-section plant stems to resolve vascular cambium function and secondary xylem growth rings.",
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    constellationPosition: { x: 50, y: 72 },
    curricularRequirements: [
      "Anatomy and functions of tissue systems in dicots and monocots.",
      "Internal structure of root, stem, and leaf; secondary growth in dicot stem and root."
    ],
    missions: []
  },
  {
    id: "structural-organisation-animals",
    title: "Structural Organisation in Animals: Tissues & Systems",
    shortDescription: "Epithelial, connective, muscular, and nervous tissues, plus organ system morphology.",
    longDescription: "Analyze cellular junctions, collagen matrices, and myofibril alignments in animal tissues.",
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    constellationPosition: { x: 56, y: 78 },
    curricularRequirements: [
      "Animal tissues: epithelial, connective, muscular, and nervous tissues.",
      "Morphology, anatomy and functions of different systems (digestive, circulatory, respiratory, nervous and reproductive) of representative organisms."
    ],
    missions: []
  },
  {
    id: "cell-the-unit-of-life",
    title: "Cell: The Unit of Life: Organelles & Membranes",
    shortDescription: "Fluid mosaic model, endomembrane system, mitochondria, chloroplasts, and cytoskeleton.",
    longDescription: "Probe lipid bilayers and active transport pumps using virtual nanoscale scanning probes.",
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    constellationPosition: { x: 62, y: 70 },
    curricularRequirements: [
      "Cell theory and cell as basic unit of life, structure of prokaryotic and eukaryotic cells.",
      "Plant cell and animal cell, cell envelope, cell membrane, cell wall, cell organelles: structure and function."
    ],
    missions: []
  },
  {
    id: "biomolecules",
    title: "Biomolecules: Proteins, Carbohydrates, Lipids & Enzymes",
    shortDescription: "Amino acids, peptide bonds, nucleic acid polymers, and enzyme kinetics (Michaelis-Menten dynamics).",
    longDescription: "Synthesize synthetic peptide catalysts and measure activation energy reductions across temperature curves.",
    difficulty: "Advanced",
    estimatedMinutes: 30,
    constellationPosition: { x: 68, y: 75 },
    curricularRequirements: [
      "Chemical constituents of living cells: biomolecules, structure and function of proteins, carbohydrates, lipids, nucleic acids.",
      "Enzymes: types, properties, enzyme action, factors affecting enzyme activity."
    ],
    missions: []
  },
  {
    id: "cell-cycle-cell-division",
    title: "Cell Cycle & Cell Division: Mitosis & Meiosis",
    shortDescription: "G1, S, G2 phases, mitotic chromosome segregation, and meiotic crossing over.",
    longDescription: "Trace chromosomal spindle attachments and homologous recombination events under simulated microgravity.",
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    constellationPosition: { x: 74, y: 70 },
    curricularRequirements: [
      "Cell cycle, mitosis, meiosis and their significance.",
      "Stages of mitosis and meiosis: prophase, metaphase, anaphase, telophase, cytokinesis."
    ],
    missions: []
  },
  {
    id: "transport-in-plants",
    title: "Transport in Plants: Water Potential & Translocation",
    shortDescription: "Diffusion, osmosis, water potential, transpiration pull, and phloem mass flow hypothesis.",
    longDescription: "Regulate transpiration pull and xylem negative hydrostatic pressures in high-canopy hydroponic crops.",
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    constellationPosition: { x: 78, y: 64 },
    curricularRequirements: [
      "Movement of water, gases and nutrients, cell-to-cell transport, diffusion, facilitated diffusion, active transport.",
      "Plant-water relations: water potential, osmosis, plasmolysis, transpiration pull.",
      "Translocation in phloem: mass flow hypothesis."
    ],
    missions: []
  },
  {
    id: "mineral-nutrition",
    title: "Mineral Nutrition: Essential Elements & Nitrogen Metabolism",
    shortDescription: "Macro- and micro-nutrients, deficiency symptoms, and biological nitrogen fixation (nitrogenase).",
    longDescription: "Balance nutrient hydro-solutions and culture symbiotic Rhizobium bacteroids to maximize nitrogen reduction.",
    difficulty: "Beginner",
    estimatedMinutes: 20,
    constellationPosition: { x: 82, y: 72 },
    curricularRequirements: [
      "Essential minerals, macro and micronutrients and their role, deficiency symptoms, mineral toxicity.",
      "Elementary idea of hydroponics, nitrogen metabolism: nitrogen cycle, biological nitrogen fixation."
    ],
    missions: []
  },
  {
    id: "respiration-in-plants",
    title: "Respiration in Plants: Glycolysis & Chemiosmosis",
    shortDescription: "Cellular respiration, glycolysis, TCA cycle, electron transport system (ETS), and ATP synthesis.",
    longDescription: "Track proton gradient generation across mitochondrial cristae to calculate net ATP yield per mole of glucose.",
    difficulty: "Advanced",
    estimatedMinutes: 30,
    constellationPosition: { x: 86, y: 65 },
    curricularRequirements: [
      "Cellular respiration: glycolysis, fermentation (anaerobic), TCA cycle and electron transport system (aerobic).",
      "Energy relations: number of ATP molecules generated, amphibolic pathways, respiratory quotient."
    ],
    missions: []
  },
  {
    id: "plant-growth-development",
    title: "Plant Growth & Development: Phytohormones & Photoperiodism",
    shortDescription: "Auxin, gibberellin, cytokinin, abscisic acid, ethylene, photoperiodism, and vernalization.",
    longDescription: "Calibrate spectral day-length cycles to trigger synchronous flowering in orbital food crops.",
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    constellationPosition: { x: 90, y: 72 },
    curricularRequirements: [
      "Phases of plant growth, growth rate, conditions of growth, differentiation, dedifferentiation and redifferentiation.",
      "Plant growth regulators: auxin, gibberellin, cytokinin, ethylene, ABA.",
      "Photoperiodism and vernalization."
    ],
    missions: []
  },
  {
    id: "digestion-absorption",
    title: "Digestion & Absorption: Alimentary Biomechanics",
    shortDescription: "Human alimentary canal, digestive enzymes, peristalsis, and nutrient absorption mechanics.",
    longDescription: "Model enzymatic cleavage of proteins, polysaccharides, and lipids along the gastrointestinal tract.",
    difficulty: "Intermediate",
    estimatedMinutes: 20,
    constellationPosition: { x: 88, y: 80 },
    curricularRequirements: [
      "Alimentary canal and digestive glands, role of digestive enzymes and gastrointestinal hormones.",
      "Peristalsis, digestion, absorption and assimilation of proteins, carbohydrates and fats."
    ],
    missions: []
  },
  {
    id: "breathing-gas-exchange",
    title: "Breathing & Gas Exchange: Pulmonary Dynamics",
    shortDescription: "Respiratory volumes/capacities, partial pressure gradients, and oxyhemoglobin dissociation.",
    longDescription: "Calibrate life-support ambient oxygen partial pressures to match alveolar diffusion rates.",
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    constellationPosition: { x: 84, y: 86 },
    curricularRequirements: [
      "Respiratory organs in animals, respiratory system in humans, mechanism of breathing and its regulation.",
      "Respiratory volumes and capacities, exchange of gases, transport of gases (oxygen and carbon dioxide)."
    ],
    missions: []
  },
  {
    id: "body-fluids-circulation",
    title: "Body Fluids & Circulation: Cardiac Hemodynamics",
    shortDescription: "Blood composition, ABO grouping, double circulation, cardiac cycle, and ECG waveforms.",
    longDescription: "Decode electrocardiogram (ECG) P-QRS-T complexes to assess ventricular depolarization during high-G burns.",
    difficulty: "Advanced",
    estimatedMinutes: 25,
    constellationPosition: { x: 78, y: 90 },
    curricularRequirements: [
      "Composition of blood, blood groups, coagulation of blood, composition of lymph and its function.",
      "Human circulatory system: structure of human heart and blood vessels, cardiac cycle, cardiac output, ECG, double circulation."
    ],
    missions: []
  },
  {
    id: "excretory-products-elimination",
    title: "Excretory Products & Elimination: Nephron Countercurrent",
    shortDescription: "Ammonotelism, ureotelism, uricotelism, nephron filtration, and countercurrent multiplier.",
    longDescription: "Regulate loop of Henle medullary osmolarity gradients to prevent dehydration under low ambient humidity.",
    difficulty: "Advanced",
    estimatedMinutes: 25,
    constellationPosition: { x: 70, y: 88 },
    curricularRequirements: [
      "Modes of excretion: ammonotelism, ureotelism, uricotelism, human excretory system: structure and function.",
      "Urine formation, osmoregulation, regulation of kidney function: renin-angiotensin, atrial natriuretic factor, ADH and diabetes insipidus."
    ],
    missions: []
  }
];

// Inject remaining Biology syllabus chapters
for (const ch of biologyRoadmapChapters) {
  if (!biologyClass11Curriculum.chapters.some(existing => existing.id === ch.id)) {
    biologyClass11Curriculum.chapters.push(ch);
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

export function getChapterStatus(chapter: Chapter): "Active" | "Coming Online" | "Not Planned" {
  if (isChapterActive(chapter)) return "Active";
  if (chapter.id === "mathematical-reasoning" || chapter.id === "three-dimensional-geometry") {
    return "Not Planned";
  }
  return "Coming Online";
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


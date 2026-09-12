/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ============================================================================
// CURRICULUM SCHEMA & PLUGIN ARCHITECTURE
// ============================================================================

export interface CurriculumPack {
  id: string; // e.g., "physics-class-11"
  subject: string; // e.g., "Physics"
  grade: string; // e.g., "ISC Class XI"
  icon: string; // Lucide icon key
  accentColor: string; // Tailwind accent color token, e.g., "cyan"
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  constellationPosition: { x: number; y: number }; // Relative percentage coordinates for constellation map (0-100)
  missions: Mission[];
  curricularRequirements?: string[];
}

export interface Mission {
  id: string;
  title: string;
  codename: string; // e.g., "OPERATION: CRATE DROP"
  description: string;
  objectives: string[];
  steps: MissionStep[];

  // --- REUSABLE MISSION FACTORY SCHEMA ADDITIONS (Milestone 3) ---
  subject: string; // e.g., "Physics", "Chemistry", "History", "Literature"
  chapterName: string; // Name of parent chapter
  learningObjectives: string[];
  storyNarrative: string;
  world: {
    environmentName: string;
    visualAtmosphere: string; // e.g., "Martian Sunset", "Neon Laboratory", "Smoky Cobblestone"
    audioLandscape: string; // e.g., "Wind hum and magnetic charges", "Glass clinks and bubbling liquids"
  };
  coreScientificConcept: {
    name: string;
    description: string;
    equationLatex?: string;
  };
  coreInteraction: "PROJECTILE_AIMING" | "TITRATION_BALANCE" | "DECISION_TIMELINE" | "THEMATIC_ANALYSIS" | "INERTIA_BOUNDS" | "ENERGY_CONSERVATION" | "PARAMETER_SANDBOX";
  predictionPrompt: string;
  predictionPresets: {
    id: string;
    label: string;
    isMisconception: boolean;
    misconceptionId?: string;
    explanation?: string;
  }[];
  experimentFlow: {
    parameters: {
      name: string;
      label: string;
      symbol?: string;
      min: number;
      max: number;
      step: number;
      defaultValue: number;
      unit: string;
    }[];
    targets: {
      name: string;
      label: string;
      min: number;
      max: number;
      unit: string;
      hint: string;
    };
  };
  reflectionPrompts: string[];
  commonMisconceptions: {
    id: string;
    name: string;
    triggerCondition: string; // e.g., "mass selector !== 100", "too aggressive troop deployment"
    pedagogicalAction: string; // Socratic prompt or secondary overlay simulation
  }[];
  socraticMentorDialogue: {
    character: string;
    avatar: "GALILEO" | "NEWTON" | "FEYNMAN" | "CURIE" | "SYSTEM";
    introductoryRemark: string;
  }[];
  successConditions: {
    criteriaText: string;
    rewardXP: number;
    badgeUnlocked?: {
      id: string;
      name: string;
    };
  };
  failureBehaviors: {
    impactCraters: boolean;
    previousTrajectories: boolean;
    radioTransmissions: string[];
  };
  worldMemory: {
    persistenceEnabled: boolean;
    maxMemorySlots: number;
  };
  scientificDiscoveries: {
    id: string;
    title: string;
    description: string;
    scientificInsight: string; // Feynman-style explanation
  }[];
  rewards: {
    xp: number;
    badges: string[];
  };
  teacherNotes: string;
  assessmentStrategy: string;
  accessibilityNotes: string;
  unlockConditions: {
    minXP?: number;
    prerequisites?: string[];
  };
  missionDuration: number; // in minutes
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  prerequisites: string[];
  guidedInquiries?: { label: string; text: string; }[];
  parameterSandboxConfig?: {
    relationshipType: "LINEAR" | "QUADRATIC" | "INVERSE" | "EXPONENTIAL" | "RATE_LIMITED";
    primaryParamKey: string;
    outputKey: string;
    outputLabel: string;
    outputUnit: string;
    coefficients: {
      a?: number;
      b?: number;
      c?: number;
      k?: number;
    };
    yRange?: {
      min: number;
      max: number;
    };
    targetBand?: {
      min: number;
      max: number;
      label?: string;
    };
    formulaDisplayLatex?: string;
  };
}

export type MissionStepType = 
  | "BRIEFING" 
  | "DIALOGUE" 
  | "SANDBOX_EXPLORATION" 
  | "CHALLENGE_EXPERIMENT" 
  | "DEBRIEF";

export interface MissionStep {
  id: string;
  type: MissionStepType;
  title: string;
  content: {
    narrative?: string;
    dialogue?: DialogueSegment[];
    simulationConfig?: SimulationConfig;
    challengeQuestion?: ChallengeQuestion;
  };
}

export interface DialogueSegment {
  speaker: string;
  avatar: "NEWTON" | "FEYNMAN" | "GALILEO" | "EINSTEIN" | "CURIE" | "SYSTEM";
  message: string;
}

export interface SimulationConfig {
  simId: string; // e.g., "PROJECTILE", "VECTOR_ADDITION", "PENDULUM"
  initialParameters: Record<string, number>;
  minMaxLimits: Record<string, [number, number]>;
  targetFormula: {
    latex: string;
    description: string;
    variableLabels: Record<string, string>;
  };
}

export interface ChallengeQuestion {
  questionText: string;
  formulaTrigger: string; // The physics event identifier to evaluate
  targetValueRange: { min: number; max: number; targetVar: string };
  hint: string;
  completionRewardXP: number;
}

// ============================================================================
// SOCRATIC AI MENTOR DEFINITIONS
// ============================================================================

export interface AISocraticProfile {
  id: "NEWTON" | "FEYNMAN" | "GALILEO" | "EINSTEIN" | "CURIE";
  name: string;
  era: string;
  avatarEmoji: string;
  accentColor: string; // CSS color
  systemPrompt: string;
}

// ============================================================================
// SIMULATION DEFINITIONS & INTERFACES
// ============================================================================

export interface InteractiveSimulation {
  id: string;
  name: string;
  defaultParams: Record<string, number>;
  integrate: (
    currentParams: Record<string, number>,
    deltaTime: number,
    stateVars: Record<string, number>
  ) => { nextParams: Record<string, number>; nextStateVars: Record<string, number> };
  render: (
    ctx: CanvasRenderingContext2D,
    params: Record<string, number>,
    stateVars: Record<string, number>,
    dimensions: { width: number; height: number },
    trail: Record<string, number>[]
  ) => void;
}

// ============================================================================
// COGNITIVE LEARNING ENGINE SCHEMA & DATA MODELS
// ============================================================================

export interface StudentSession {
  sessionId: string;
  currentSubject: "PHYSICS" | "CHEMISTRY" | "HISTORY" | "LITERATURE";
  currentMissionId: string;
  knowledgeMap: string[]; // List of unlocked Discovery IDs
  activeMisconceptions: string[]; // Identified student misconceptions
  investigations: InvestigationRecord[];
}

export interface InvestigationRecord {
  id: string;
  timestamp: string;
  loopIteration: number;
  
  // Polymorphic state representing the student's prediction
  prediction: {
    type: "TRAJECTORY" | "DECISION" | "EQUILIBRIUM" | "RESPONSE";
    serializedValue: string; // JSON-stringified raw data (e.g., coordinate paths, chosen options, or flag x coords)
    rationalePrompt: string; // The student's qualitative reasoning
    angle?: number;
    velocity?: number;
    flagX?: number;
  };

  // Polymorphic state representing the actual experimental results
  experimentResult: {
    telemetry: Record<string, any>; // Physics velocities, Chemistry yields, Historical path outcomes
    isSuccess: boolean;
  };

  // Student observations post-experiment
  reflection: {
    prompt: string;
    studentResponse: string;
    identifiedConceptIds: string[];
  };

  discoveriesMade: string[];
}

export interface Discovery {
  id: string;
  title: string;
  description: string;
  scientificInsight: string; // Richard Feynman style explanation
  unlockedAt: string;
}

export type CognitiveLoopState = "PREDICT" | "EXPERIMENT" | "REFLECT";

// ============================================================================
// CENTRAL EVENT BUS DEFINITIONS
// ============================================================================

export type EngineEvent =
  | { type: "MISSION_STARTED"; payload: { missionId: string } }
  | { type: "MISSION_STEP_CHANGED"; payload: { stepId: string; stepType: MissionStepType; stepIndex: number } }
  | { type: "OBJECT_SELECTED"; payload: { objectId: string } }
  | { type: "SIMULATION_TICK"; payload: { timestamp: number; values: Record<string, number> } }
  | { type: "SIMULATION_COMPLETED"; payload: { simId: string; finalState: Record<string, number> } }
  | { type: "FORMULA_DISCOVERED"; payload: { formulaLatex: string; label: string } }
  | { type: "ASSESSMENT_COMPLETED"; payload: { challengeId: string; success: boolean; xpEarned: number } }
  | { type: "BADGE_UNLOCKED"; payload: { badgeId: string; badgeName: string } }
  | { type: "AI_HINT_REQUESTED"; payload: { speaker: string; query: string } }
  | { type: "UI_SOUND_TRIGGER"; payload: { cue: "CLICK" | "SUCCESS" | "FAILURE" | "HUM" | "DIAGNOSTIC" } };

export type EventCallback = (event: EngineEvent) => void;

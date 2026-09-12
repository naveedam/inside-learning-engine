/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";
import { MissionStepType, CognitiveLoopState, InvestigationRecord } from "../types";
import { globalEventBus } from "./EventBus";
import { audioEngine } from "./audio";

// ============================================================================
// ENGINE STORE (Progression, Navigation, and Profiles)
// ============================================================================

export type ActiveView = "constellation" | "mission-details" | "mission-active" | "journal";

export interface NotebookEntry {
  id: string;
  title: string;
  text: string;
  date: string;
  subject: string;
}

interface EngineState {
  currentView: ActiveView;
  selectedSubjectId: string | null;
  selectedChapterId: string | null;
  activeMissionId: string | null;
  activeStepIndex: number;
  completedMissions: string[];
  unlockedBadges: string[];
  xp: number;
  streak: number;
  notebook: NotebookEntry[];
  soundEnabled: boolean;

  // --- Cognitive Learning Engine Fields ---
  cognitiveLoopState: CognitiveLoopState;
  investigations: InvestigationRecord[];
  knowledgeMap: string[]; // Set of unlocked Discovery IDs
  activeMisconceptions: string[]; // Identified student misconceptions
  predictionFlagX: number | null; // Selected prediction landing x-coordinate
  predictionAngle: number | null;
  predictionVelocity: number | null;
  predictionRationale: string;
  misconceptionDemoMode: boolean; // Simultaneous double mass drops, vacuum tubes, etc.

  // Actions
  setView: (view: ActiveView) => void;
  selectSubject: (subjectId: string | null) => void;
  selectChapter: (chapterId: string | null) => void;
  startMission: (missionId: string) => void;
  setStepIndex: (index: number) => void;
  nextStep: (totalSteps: number) => void;
  prevStep: () => void;
  awardXP: (amount: number) => void;
  unlockBadge: (badgeId: string, badgeName: string) => void;
  completeMission: (missionId: string) => void;
  addNotebookEntry: (title: string, text: string, subject: string) => void;
  toggleSound: () => void;
  resetProgress: () => void;

  // --- Cognitive Learning Engine Actions ---
  setCognitiveLoopState: (state: CognitiveLoopState) => void;
  setPredictionFlagX: (x: number | null) => void;
  commitPrediction: (angle: number, velocity: number, rationale: string) => void;
  commitExperimentResult: (telemetry: Record<string, any>, isSuccess: boolean) => void;
  submitReflection: (prompt: string, studentResponse: string) => void;
  unlockDiscovery: (discoveryId: string) => void;
  triggerMisconceptionDemo: (active: boolean) => void;
  addMisconception: (misconceptionId: string) => void;
  removeMisconception: (misconceptionId: string) => void;
  clearInvestigations: () => void;
}

export const useEngineStore = create<EngineState>((set) => ({
  currentView: "constellation",
  selectedSubjectId: null,
  selectedChapterId: null,
  activeMissionId: null,
  activeStepIndex: 0,
  completedMissions: [],
  unlockedBadges: [],
  xp: 0,
  streak: 5, // Bootstrapped high-streak for engagement feel
  notebook: [
    {
      id: "entry-1",
      title: "The Galileo Principle",
      text: "Discovered that vertical vector acceleration under gravity is completely independent of uniform horizontal velocity. Parabolas emerge from this vector coupling.",
      date: "2026-07-11",
      subject: "Physics"
    }
  ],
  soundEnabled: true,

  // --- Cognitive Learning Engine initial values ---
  cognitiveLoopState: "PREDICT",
  investigations: [],
  knowledgeMap: ["horizontal-independence"], // Preload the first discovery or keep empty. Let's keep it empty to let them discover it! Actually, let's keep it empty to start fresh.
  activeMisconceptions: [],
  predictionFlagX: null,
  predictionAngle: null,
  predictionVelocity: null,
  predictionRationale: "",
  misconceptionDemoMode: false,

  setView: (view) => {
    audioEngine.playClick();
    set({ currentView: view });
  },

  selectSubject: (subjectId) => {
    audioEngine.playClick();
    set({
      selectedSubjectId: subjectId,
      selectedChapterId: null,
      currentView: "constellation"
    });
  },

  selectChapter: (chapterId) => {
    audioEngine.playClick();
    set({
      selectedChapterId: chapterId,
      currentView: chapterId ? "mission-details" : "constellation"
    });
  },

  startMission: (missionId) => {
    audioEngine.playDiagnostic();
    globalEventBus.publish({ type: "MISSION_STARTED", payload: { missionId } });
    set({
      activeMissionId: missionId,
      activeStepIndex: 0,
      currentView: "mission-active",
      cognitiveLoopState: "PREDICT",
      predictionFlagX: null,
      predictionAngle: null,
      predictionVelocity: null,
      predictionRationale: "",
      misconceptionDemoMode: false
    });
  },

  setStepIndex: (index) => {
    set({ activeStepIndex: index });
  },

  nextStep: (totalSteps) => {
    audioEngine.playClick();
    set((state) => {
      const nextIndex = Math.min(totalSteps - 1, state.activeStepIndex + 1);
      return { activeStepIndex: nextIndex };
    });
  },

  prevStep: () => {
    audioEngine.playClick();
    set((state) => ({ activeStepIndex: Math.max(0, state.activeStepIndex - 1) }));
  },

  awardXP: (amount) => {
    set((state) => ({ xp: state.xp + amount }));
  },

  unlockBadge: (badgeId, badgeName) => {
    set((state) => {
      if (state.unlockedBadges.includes(badgeId)) return {};
      audioEngine.playSuccess();
      globalEventBus.publish({ type: "BADGE_UNLOCKED", payload: { badgeId, badgeName } });
      return { unlockedBadges: [...state.unlockedBadges, badgeId] };
    });
  },

  completeMission: (missionId) => {
    set((state) => {
      if (state.completedMissions.includes(missionId)) return {};
      return { completedMissions: [...state.completedMissions, missionId] };
    });
  },

  addNotebookEntry: (title, text, subject) => {
    audioEngine.playDiagnostic();
    set((state) => ({
      notebook: [
        {
          id: `entry-${Date.now()}`,
          title,
          text,
          date: new Date().toISOString().split("T")[0],
          subject
        },
        ...state.notebook
      ]
    }));
  },

  toggleSound: () => {
    set((state) => {
      const nextVal = !state.soundEnabled;
      audioEngine.setMute(!nextVal);
      return { soundEnabled: nextVal };
    });
  },

  resetProgress: () => {
    set({
      completedMissions: [],
      unlockedBadges: [],
      xp: 0,
      streak: 0,
      activeMissionId: null,
      activeStepIndex: 0,
      currentView: "constellation",
      cognitiveLoopState: "PREDICT",
      investigations: [],
      knowledgeMap: [],
      activeMisconceptions: [],
      predictionFlagX: null,
      predictionAngle: null,
      predictionVelocity: null,
      predictionRationale: "",
      misconceptionDemoMode: false
    });
  },

  // --- Cognitive Learning Engine Actions implementation ---
  setCognitiveLoopState: (loopState) => {
    set({ cognitiveLoopState: loopState });
  },

  setPredictionFlagX: (x) => {
    set({ predictionFlagX: x });
  },

  commitPrediction: (angle, velocity, rationale) => {
    set({
      predictionAngle: angle,
      predictionVelocity: velocity,
      predictionRationale: rationale,
      cognitiveLoopState: "EXPERIMENT"
    });
  },

  commitExperimentResult: (telemetry, isSuccess) => {
    set((state) => {
      const loopIteration = state.investigations.length + 1;
      const newInvestigation: InvestigationRecord = {
        id: `inv-${Date.now()}`,
        timestamp: new Date().toISOString(),
        loopIteration,
        prediction: {
          type: "TRAJECTORY",
          serializedValue: JSON.stringify({
            angle: state.predictionAngle,
            velocity: state.predictionVelocity,
            flagX: state.predictionFlagX
          }),
          rationalePrompt: state.predictionRationale,
          angle: state.predictionAngle || undefined,
          velocity: state.predictionVelocity || undefined,
          flagX: state.predictionFlagX || undefined
        },
        experimentResult: {
          telemetry,
          isSuccess
        },
        reflection: {
          prompt: "",
          studentResponse: "",
          identifiedConceptIds: []
        },
        discoveriesMade: []
      };

      return {
        investigations: [newInvestigation, ...state.investigations],
        cognitiveLoopState: "REFLECT"
      };
    });
  },

  submitReflection: (prompt, studentResponse) => {
    set((state) => {
      if (state.investigations.length === 0) return {};
      
      const updated = [...state.investigations];
      const current = { ...updated[0] };
      
      current.reflection = {
        prompt,
        studentResponse,
        identifiedConceptIds: []
      };
      
      const discoveriesMade: string[] = [];
      const latestTelemetry = current.experimentResult.telemetry;
      const actualRange = latestTelemetry?.impactX || 0;
      const angleUsed = latestTelemetry?.angle || 0;
      const gravityUsed = latestTelemetry?.gravity || 3.72;
      const massUsed = latestTelemetry?.mass || 100;
      const isSuccess = current.experimentResult.isSuccess;

      // 1. Independent horizontal motion discovery
      if (!state.knowledgeMap.includes("horizontal-independence")) {
        discoveriesMade.push("horizontal-independence");
      }

      // 2. Max range on Mars discovery
      if (Math.abs(angleUsed - 45) <= 2 && isSuccess && !state.knowledgeMap.includes("max-range-mars")) {
        discoveriesMade.push("max-range-mars");
      }

      // 3. Gravity shapes trajectories
      if (gravityUsed !== 3.72 && !state.knowledgeMap.includes("gravity-shape")) {
        discoveriesMade.push("gravity-shape");
      }

      // 4. Galileo's principle of mass independence under gravity
      if (state.activeMisconceptions.includes("MISCONCEPTION_MASS_DEPENDENT_GRAVITY") && state.misconceptionDemoMode) {
        discoveriesMade.push("mass-independence");
      } else if (massUsed !== 100 && !state.knowledgeMap.includes("mass-independence")) {
        discoveriesMade.push("mass-independence");
      }

      current.discoveriesMade = discoveriesMade;
      updated[0] = current;

      const nextKnowledgeMap = [...state.knowledgeMap];
      discoveriesMade.forEach((d) => {
        if (!nextKnowledgeMap.includes(d)) {
          nextKnowledgeMap.push(d);
        }
      });

      const nextMisconceptions = state.activeMisconceptions.filter(
        (m) => !(m === "MISCONCEPTION_MASS_DEPENDENT_GRAVITY" && discoveriesMade.includes("mass-independence"))
      );

      return {
        investigations: updated,
        knowledgeMap: nextKnowledgeMap,
        activeMisconceptions: nextMisconceptions,
        cognitiveLoopState: "PREDICT",
        predictionFlagX: null,
        predictionAngle: null,
        predictionVelocity: null,
        predictionRationale: "",
        misconceptionDemoMode: false
      };
    });
  },

  unlockDiscovery: (discoveryId) => {
    set((state) => {
      if (state.knowledgeMap.includes(discoveryId)) return {};
      audioEngine.playSuccess();
      return { knowledgeMap: [...state.knowledgeMap, discoveryId] };
    });
  },

  triggerMisconceptionDemo: (active) => {
    set({ misconceptionDemoMode: active });
  },

  addMisconception: (misconceptionId) => {
    set((state) => {
      if (state.activeMisconceptions.includes(misconceptionId)) return {};
      return { activeMisconceptions: [...state.activeMisconceptions, misconceptionId] };
    });
  },

  removeMisconception: (misconceptionId) => {
    set((state) => ({
      activeMisconceptions: state.activeMisconceptions.filter((m) => m !== misconceptionId)
    }));
  },

  clearInvestigations: () => {
    set({ investigations: [], knowledgeMap: [], activeMisconceptions: [] });
  }
}));

// ============================================================================
// SIMULATION STORE (Replay, Chrono Scrubbing, and Playback Mechanics)
// ============================================================================

export type PlaybackStatus = "PAUSED" | "PLAYING" | "REPLAY_SCRUBBING";

interface SimulationState {
  isPlaying: PlaybackStatus;
  currentTime: number; // Simulated clock time
  maxTime: number; // Highest simulated clock time recorded
  playbackRate: number; // Speed scale multiplier: 0.25, 0.5, 1, 1.5, 2
  historyFrames: Record<string, number>[]; // Cumulative array of frame objects recorded during active ticks
  currentFrameIndex: number;
  
  // Controls
  setPlaying: (status: PlaybackStatus) => void;
  tickFrame: (deltaTime: number, frameValues: Record<string, number>) => void;
  scrubToFrame: (index: number) => void;
  setPlaybackRate: (rate: number) => void;
  resetSimulation: (defaultValues?: Record<string, number>) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  isPlaying: "PAUSED",
  currentTime: 0,
  maxTime: 0,
  playbackRate: 1,
  historyFrames: [],
  currentFrameIndex: 0,

  setPlaying: (status) => {
    audioEngine.playClick();
    set({ isPlaying: status });
  },

  tickFrame: (deltaTime, frameValues) => set((state) => {
    if (state.isPlaying !== "PLAYING") return {};
    const newHistory = [...state.historyFrames, frameValues];
    const newTime = state.currentTime + deltaTime * state.playbackRate;
    return {
      historyFrames: newHistory,
      currentTime: newTime,
      maxTime: Math.max(state.maxTime, newTime),
      currentFrameIndex: newHistory.length - 1
    };
  }),

  scrubToFrame: (index) => set((state) => {
    const frame = state.historyFrames[index];
    if (!frame) return {};
    
    // Calculate fractional progress
    const progressFraction = state.historyFrames.length > 1 ? index / (state.historyFrames.length - 1) : 0;
    const newTime = progressFraction * state.maxTime;

    return {
      currentFrameIndex: index,
      currentTime: newTime,
      isPlaying: "REPLAY_SCRUBBING"
    };
  }),

  setPlaybackRate: (rate) => {
    audioEngine.playClick();
    set({ playbackRate: rate });
  },

  resetSimulation: (defaultValues) => set({
    isPlaying: "PAUSED",
    currentTime: 0,
    maxTime: 0,
    playbackRate: 1,
    historyFrames: defaultValues ? [defaultValues] : [],
    currentFrameIndex: 0
  })
}));

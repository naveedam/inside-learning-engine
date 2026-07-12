# Inside Learning Engine: Software Design Document (SDD) v1.0
## Product Identity: Cinematic Spatial Experiential Platform

This document serves as the canonical architectural blueprint and technical specification for the **Inside Learning Engine (ILE)**. It details a framework-agnostic, plugin-driven, state-authoritative immersive software system capable of delivering award-winning, game-like educational experiences across multiple disciplines.

---

## Foundational Learning Principles

To deliver experiences that transcend traditional educational software and create lifelong memories, every module of the Inside Learning Engine must adhere to these guiding pedagogical and experiential frameworks.

### Principle #1: Social Contract #1 — Prediction → Experiment → Reflection
The core learning engine is mathematically and structurally designed around a three-stage cognitive feedback cycle:
1. **Prediction ("What do I think will happen?")**: The student commits to an intuitive hypothesis before executing a simulation or taking action.
2. **Experiment ("Let's test it.")**: The student triggers the real physical or systematic simulation (e.g., launching a supply canister under Martian gravity using direct spatial manipulation).
3. **Reflection ("Why did it happen?")**: Socratic AI guides, logbook ledgers, and interactive debrief cards help the learner deconstruct differences between their initial prediction, the empirical outcomes, and the underlying natural formulas.

### Principle #2: The World is the Interface
Direct spatial manipulation is preferred over traditional abstract controls (sliders, forms, inputs) wherever feasible. Students interact directly with physical objects—dragging launchers, stretching springs, swinging pendulums—to touch Physics directly. Precision control decks remain available as secondary accessibility overlays.

### Principle #3: Natural Disciplinary Interactions
Interaction models match the nature of the studied discipline:
- **Physics**: Direct spatial manipulation, vector dragging, and momentum tracking.
- **Chemistry**: Material combining, state transformations, and molecular lattice manipulation.
- **History**: Decisive exploration, chronological path divergence, and consequence predictions.
- **Literature**: Interactive conversation, socratic dialogue, perspective taking, and thematic interpretation.

---

## 1. System & Module Architecture

The Inside Learning Engine is structured around a **Core Shell** that coordinates application state, virtual routing, and UI rendering, while delegating subject-specific behaviors (such as Physics, Chemistry, History) to a decoupled **Plugin Framework**.

```
+-------------------------------------------------------------------------+
|                              THE CORE SHELL                            |
|                                                                         |
|  +---------------------+   +---------------------+   +---------------+  |
|  |     State Engine    |   |     Event Bus       |   | Virtual Router|  |
|  |      (Zustand)      |   |   (Event Emitter)   |   | (Shell State) |  |
|  +----------+----------+   +----------+----------+   +-------+-------+  |
|             |                         |                      |          |
|             +------------+------------+                      |          |
|                          v                                   v          |
|                 +------------------+                 +---------------+  |
|                 |  Socratic Agent  |                 |   HUD Frame   |  |
|                 |  (API Proxy)     |                 |  (Spatial UI) |  |
|                 +--------+---------+                 +-------+-------+  |
|                          |                                   |          |
+--------------------------|-----------------------------------|----------+
                           |                                   |
                           v                                   v
+--------------------------|-----------------------------------|----------+
|                     PLUGINS (e.g., PHYSICS PLUGIN)           |          |
|                          |                                   |          |
|  +-----------------------v-----------------------+           |          |
|  |                 Subject Content               |           |          |
|  |             (JSON Chapter Definitions)        |           |          |
|  +-----------------------------------------------+           |          |
|                                                              |          |
|  +-----------------------------------------------------------v-------+  |
|  |                     Simulation Sandbox                            |  |
|  |      +---------------------------------------------------------+  |  |
|  |      |                   Simulation Library                    |  |  |
|  |      |   (ProjectileSim, VectorSim, PendulumSim, SpringSim)    |  |  |
|  |      +---------------------------------------------------------+  |  |
|  +-------------------------------------------------------------------+  |
+-------------------------------------------------------------------------+
```

### 1.1 Core Modules
1. **State Engine**: Authoritative game loop and progression tracking managed by Zustand. Renders the interactive curriculum constellation maps and persistent notebook entries.
2. **Event Bus**: The asynchronous heart of the application, decoupling user interaction, simulation triggers, and UI state change sequences.
3. **Socratic AI Gateway**: A clean client-server proxy system designed to communicate with Gemini 2.5 Flash. It forces LLM responses into highly structured, context-rich, Socratic dialogue formats without leaking keys.
4. **Cinematic Spatial HUD**: Built with Tailwind CSS and Framer Motion, it projects structural spatial cards, absolute dials, active vector readings, and futuristic overlays to evoke NASA Mission Control, Apple Vision Pro, and iron Man's HUD.
5. **Universal Mission Controller**: Orchestrates the multi-stage mission transitions:
   `BRIEFING` (Lore) $\rightarrow$ `DIALOGUE` (Mentor interaction) $\rightarrow$ `SANDBOX_EXPLORATION` (Hands-on parameter play) $\rightarrow$ `CHALLENGE_EXPERIMENT` (Target assessment) $\rightarrow$ `DEBRIEF` (Success metrics/Reward reveal).

---

## 2. Package Architecture (Turborepo Monorepo)

To target both Web (React/Vite PWA) and Native Mobile (Expo) platforms seamlessly, the codebase is architected as a modular monorepo. This separates business logic, assets, audio cues, and simulation mathematical engines into reusable npm workspace dependencies.

### 2.1 Workspace Structure
```
inside-learning-engine/
├── apps/
│   ├── web/                    # React 19 + Vite 6 PWA application
│   └── mobile/                 # React Native + Expo App (Future Phase)
│
└── packages/
    ├── engine-core/            # Pure TypeScript State Machine, Event Bus & Core logic
    ├── ui-spatial/             # Core design system library (cards, buttons, telemetries)
    ├── simulation-lib/         # Math & rendering code for all simulation components
    ├── audio-engine/           # HTML5 Audio Web Synthesizer and spatial audio managers
    ├── content-schema/         # Common TypeScript interfaces and curriculum JSON schemas
    │
    └── plugins/                # Subject-specific curriculums & simulation adapters
        ├── physics-plugin/     # Kinematics, orbits, vectors, wave math & content
        ├── chemistry-plugin/   # (Future) Atomic lattices, gas law equations & content
        └── history-plugin/     # (Future) Chronological timeline sandboxes & content
```

---

## 3. TypeScript Interfaces (`packages/content-schema`)

```typescript
/**
 * Unified Curriculum Definitions
 */

export interface CurriculumPack {
  id: string; // e.g., "physics-class-11"
  subject: string; // e.g., "Physics"
  grade: string; // e.g., "ISC Class XI"
  icon: string; // Lucide icon identifier
  accentColor: string; // Tailwind tint value, e.g., "cyan-400"
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  constellationPosition: { x: number; y: number }; // Star Map constellation coords
  missions: Mission[];
}

export interface Mission {
  id: string;
  title: string;
  codename: string; // e.g., "OPERATION: CRATE DROP"
  description: string;
  objectives: string[];
  steps: MissionStep[];
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
  avatar: "NEWTON" | "FEYNMAN" | "GALILEO" | "EINSTEIN" | "CURIE" | "DARWIN" | "SYSTEM";
  message: string;
}

export interface SimulationConfig {
  simId: string; // e.g., "PROJECTILE", "ORBITAL_SLINGSHOT", "PENDULUM"
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
```

---

## 4. Event Bus Design

Inside Learning Engine utilizes a strongly typed, asynchronous central Event Bus to handle progression, achievements, audio updates, and canvas telemetry metrics without hardcoding references.

```typescript
export type EngineEvent =
  | { type: "MISSION_STARTED"; payload: { missionId: string } }
  | { type: "MISSION_STEP_CHANGED"; payload: { stepId: string; stepType: MissionStepType } }
  | { type: "OBJECT_SELECTED"; payload: { objectId: string } }
  | { type: "SIMULATION_TICK"; payload: { timestamp: number; vectors: Record<string, number> } }
  | { type: "SIMULATION_COMPLETED"; payload: { simId: string; finalState: Record<string, number> } }
  | { type: "FORMULA_DISCOVERED"; payload: { formulaLatex: string; label: string } }
  | { type: "ASSESSMENT_COMPLETED"; payload: { challengeId: string; success: boolean; xpEarned: number } }
  | { type: "BADGE_UNLOCKED"; payload: { badgeId: string; badgeName: string } }
  | { type: "AI_HINT_REQUESTED"; payload: { speaker: string; query: string } }
  | { type: "UI_SOUND_TRIGGER"; payload: { cue: "CLICK" | "SUCCESS" | "FAILURE" | "HUM" | "DIAGNOSTIC" } };

type EventCallback = (event: EngineEvent) => void;

class EventBus {
  private listeners = new Map<string, Set<EventCallback>>();

  public subscribe(eventType: EngineEvent["type"] | "*", callback: EventCallback): () => void {
    const key = eventType;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    // Unsubscribe closure
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  public publish(event: EngineEvent): void {
    // Notify type-specific subscribers
    this.listeners.get(event.type)?.forEach((callback) => callback(event));
    
    // Notify catch-all ("*") subscribers
    this.listeners.get("*")?.forEach((callback) => callback(event));
  }
}

export const globalEventBus = new EventBus();
```

---

## 5. Zustand State Management

To avoid React context re-render overhead during high-frequency updates, state is divided into clean, decoupled stores. Zustand is configured to handle granular select operations.

### 5.1 Engine Store
Tracks curriculum packages, current mission routes, completed progression logs, and user performance indexes.

```typescript
import { create } from "zustand";

interface EngineState {
  currentPackId: string | null;
  activeChapterId: string | null;
  activeMissionId: string | null;
  activeStepIndex: number;
  completedMissions: string[];
  unlockedBadges: string[];
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  
  // Actions
  loadPack: (packId: string) => void;
  selectChapter: (chapterId: string | null) => void;
  startMission: (missionId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  awardXP: (amount: number) => void;
  unlockBadge: (badgeId: string) => void;
  resetProgress: () => void;
}

export const useEngineStore = create<EngineState>((set) => ({
  currentPackId: null,
  activeChapterId: null,
  activeMissionId: null,
  activeStepIndex: 0,
  completedMissions: [],
  unlockedBadges: [],
  xp: 0,
  streak: 0,
  lastActiveDate: null,

  loadPack: (packId) => set({ currentPackId: packId }),
  selectChapter: (chapterId) => set({ activeChapterId: chapterId }),
  startMission: (missionId) => set({ activeMissionId: missionId, activeStepIndex: 0 }),
  nextStep: () => set((state) => ({ activeStepIndex: state.activeStepIndex + 1 })),
  prevStep: () => set((state) => ({ activeStepIndex: Math.max(0, state.activeStepIndex - 1) })),
  awardXP: (amount) => set((state) => ({ xp: state.xp + amount })),
  unlockBadge: (badgeId) => set((state) => {
    if (state.unlockedBadges.includes(badgeId)) return {};
    return { unlockedBadges: [...state.unlockedBadges, badgeId] };
  }),
  resetProgress: () => set({ completedMissions: [], unlockedBadges: [], xp: 0, streak: 0, lastActiveDate: null })
}));
```

### 5.2 Simulation Replay & Playback Store
To implement frame scrubbing, timeline rewind, and playback speeds without triggering full React UI tree updates:

```typescript
export type PlaybackStatus = "PAUSED" | "PLAYING" | "REPLAY_SCRUBBING";

interface SimulationState {
  isPlaying: PlaybackStatus;
  currentTime: number; // Current simulated seconds
  maxTime: number; // Furthest simulated seconds
  playbackRate: number; // 0.25x, 0.5x, 1x, 2x, etc.
  historyFrames: Record<string, number>[]; // Frame logs for rewinds/scrubs
  currentFrameIndex: number;
  
  // Controls
  setPlaying: (status: PlaybackStatus) => void;
  tickFrame: (deltaTime: number, currentValues: Record<string, number>) => void;
  scrubToFrame: (index: number) => void;
  setPlaybackRate: (rate: number) => void;
  resetSimulation: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  isPlaying: "PAUSED",
  currentTime: 0,
  maxTime: 0,
  playbackRate: 1,
  historyFrames: [],
  currentFrameIndex: 0,

  setPlaying: (status) => set({ isPlaying: status }),
  tickFrame: (deltaTime, currentValues) => set((state) => {
    if (state.isPlaying !== "PLAYING") return {};
    const newHistory = [...state.historyFrames, currentValues];
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
    return {
      currentFrameIndex: index,
      currentTime: (index / state.historyFrames.length) * state.maxTime
    };
  }),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  resetSimulation: () => set({
    isPlaying: "PAUSED",
    currentTime: 0,
    maxTime: 0,
    playbackRate: 1,
    historyFrames: [],
    currentFrameIndex: 0
  })
}));
```

---

## 6. Simulation Interfaces & Replay Lifecycle

### 6.1 Generic Simulation Interface
Every simulation plugin must register an object adhering to the `InteractiveSimulation` interface:

```typescript
export interface InteractiveSimulation {
  id: string; // Unique id e.g. "PROJECTILE"
  name: string;
  defaultParams: Record<string, number>;
  
  // Physics Integration Logic (Math Tick)
  integrate: (
    currentParams: Record<string, number>,
    deltaTime: number
  ) => Record<string, number>;

  // Rendering hook targeting the canvas context
  render: (
    ctx: CanvasRenderingContext2D,
    params: Record<string, number>,
    dimensions: { width: number; height: number },
    trail: Record<string, number>[]
  ) => void;
}
```

### 6.2 Physics Replay Mechanics
By separating **numerical state updates** (Integration step) from **canvas painting** (Rendering step), we achieve flawless replay:
1. When `isPlaying === "PLAYING"`, the simulation canvas updates by calling `integrate(currentParams, dt)` on every `requestAnimationFrame` loop, compiling the output vectors into `historyFrames` in Zustand.
2. When the user scrubs the timeline slider, `isPlaying` transitions to `"REPLAY_SCRUBBING"`.
3. The engine skips the integration mathematical step completely and pulls the corresponding frame directly from `historyFrames[targetIndex]`, painting the vectors live to the Canvas.

---

## 7. Subject Plugin Specification

Each discipline acts as a modular package that implements a standard registry configuration interface.

```typescript
export interface LearningPlugin {
  subjectId: string; // e.g. "physics"
  displayName: string;
  curriculumPack: CurriculumPack;
  simulations: InteractiveSimulation[];
  mentors: AISocraticProfile[];
}

export interface AISocraticProfile {
  id: "NEWTON" | "FEYNMAN" | "GALILEO" | "EINSTEIN" | "CURIE";
  name: string;
  era: string;
  systemPrompt: string; // Custom instruction to enforce Socratic style and context boundaries
}
```

This guarantees the core shell is completely agnostic. Adding "Inside History" simply requires loading a `history-plugin` with a registered curriculum containing history chapters and historical timelines as simulations.

---

## 8. State-Based Virtual Routing Strategy

Because the application must run elegantly in a single-view containment within browser frames, we employ a high-fidelity **Virtual Router** decoupled from traditional window URL parsing.

### 8.1 Router Flow Structure
```
+-----------------------------------------------------------------------------------+
|                                 Virtual Path Engine                               |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
                      +------------------+------------------+
                      |                                     |
                      v                                     v
            +---------+--------+                  +---------+--------+
            |  Dashboard View  |                  |  Lab Journal     |
            |  (Star Constell) |                  |  (Unlock Notebook|
            +---------+--------+                  +------------------+
                      |
                      v
            +---------+--------+
            |  Mission Hub     |
            |  (Chapter Specs) |
            +---------+--------+
                      |
                      v
            +---------+--------+
            |  Active Mission  |
            |  (The Cinematic) |
            +---------+--------+
                      |
        +-------------+-------------+
        |             |             |
        v             v             v
+-------+-------+ +---+---+   +-----+-----+
| BRIEF / DIALOG| | SANDB |   | CHALLENGE |
+---------------+ +-------+   +-----------+
```

Pathways are saved as clean enum variables inside Zustand. This enables instant view recovery, facilitates state preservation across tabs, and enables unified transition animations.

---

## 9. Mobile Code-Sharing Architecture (Expo Integration)

The Inside Learning Engine is engineered to target web platforms and native mobile environments using a shared-code paradigm:

- **Logic Layer (100% Shared)**: The Zustand stores, event bus, Socratic API adapters, and mathematical solvers reside in pure ESM packages (`@learning-engine/core`) which run identically in Node, browsers, and Hermès JS (React Native runtime).
- **UI Render Layer (Pluggable CSS)**: 
  - Web utilizes `@tailwindcss/vite` for styling.
  - Mobile references custom Tailwind adapters (e.g. `nativewind`) or translates atomic class components to react-native components.
- **Canvas Simulators (90% Shared)**:
  - Both web and mobile use the same mathematical models.
  - Native rendering leverages lightweight HTML5 WebViews or React Native Canvas libraries (e.g., `react-native-skia` or `@shopify/react-native-skia`) to match 60 FPS performance budgets.

---

## 10. Animation Lifecycles

Animations are integrated to simulate spatial depth and system readiness. Gratuitous, unrequested moving indicators are banned.

### 10.1 Element Lifecycles
- **Entrance Sequences**: Elements stagger using a fluid deceleration physics spring: `damping: 24, stiffness: 100, mass: 1`. 
- **HUD Diagnostics Sequence**: Text symbols undergo subtle, programmatic character replacements (scrambling strings to emulate system boot sequences).
- **Interactive Scaling**: Interactive items utilize safe micro-feedback limits: scale hover threshold $+1.2\%$ max; scale compression limit $-2.5\%$.

---

## 11. Socratic AI Mentor Architecture

To keep the system highly responsive while supporting rich educational prompts, the AI Mentor interfaces through a dedicated client proxy.

```
[Client UI] --(Asks Newton/Feynman)--> [Express /api/mentor Proxy]
                                                      |
                                         (Format system prompt with schema)
                                                      |
                                                      v
                                            [Gemini 2.5 Flash SDK]
```

### 11.1 Socratic System Directives
The Express middleware injects system constraints before contacting Gemini:
- **Never provide the direct mathematical solution.**
- **Identify variables currently manipulated in the active simulation.**
- **Provide questions based on historical thought experiments** (e.g., Galileo's drop from Pisa, Newton's falling apple).

---

## 12. Quality Assurance & Performance Optimization

### 12.1 Performance Budgets
- **Frame Rate**: Target $60\text{ FPS}$ on typical modern devices; minimum threshold $45\text{ FPS}$ on legacy mobile.
- **Garbage Collection Optimization**: Math integrators must recycle coordinate buffers rather than allocating new objects on every animation tick to avoid garbage-collection-induced frame stutter.
- **Canvas Off-screen Pre-rendering**: Vector paths and mountain terrains are rendered to invisible off-screen canvases once, and then rapidly painted back via `drawImage` during active ticks.

---

## 13. Release & Evolution Roadmap

### Milestone 1: Core Learning Engine (The Immediate Target)
1. **Initialize Monorepo Environment**: Create unified type boundaries (`src/types.ts`) and launch core state engines (`src/context/EngineContext.tsx`).
2. **Launch spatial UX components**: Set up deep cosmic themes, customized modular HUD overlays, and glowing canvas components.
3. **Build Kinematics Chapter Package**: Supply full JSON curriculum declarations and build **`ProjectileSim.tsx`** featuring live vector rendering, parameter adjustment sliders, and target calibration zones.
4. **Implement Socratic Sidebar Panels**: Design interactive character dialog cards allowing students to access hints and explanations.

---

## 14. Approval & Next Steps

This Software Design Document specifies the complete business logic, rendering mechanics, state boundaries, and plugin hooks for version 1.0 of the **Inside Learning Engine**.

**Ready to build Milestone 1.** Please signal your confirmation to commence writing codebase files.

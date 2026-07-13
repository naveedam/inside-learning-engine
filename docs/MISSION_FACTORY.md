# Inside Learning Engine: Reusable Mission Factory Spec (v0.3.0)

This document describes the architectural specifications for the **Reusable Mission Factory** introduced in **Version 0.3.0** of the Inside Learning Engine (ILE).

---

## 🌌 Overview

The **Mission Factory** is the core design pattern that allows the Inside Learning Engine to operate as a **framework-agnostic curriculum processor**. 

Rather than hardcoding individual scenes or custom simulation screens, the engine's views and states are driven by a dynamic JSON metadata structure. By parsing a standardized set of unified attributes, the factory automatically calibrates:
1.  **Immersive Environments:** Colors, backdrop glows, atmospheric styles, and sound landscapes.
2.  **The Interactive Sandbox:** Physical parameters, bounds, sliders, and target calibration zones.
3.  **The Cognitive Feedback Loop:** Predictive presets, custom misconception triggers, and Socratic debrief paths.
4.  **Socratic Mentorship:** historical avatar guides (Galileo, Feynman, Curie, etc.) with custom system personas.

This architecture enables seamless expansion across **multiple school disciplines** (such as physics, chemistry, history, and literature) without rewriting core UI or layout components.

---

## 📋 Unified Mission Schema (`src/types.ts`)

Every mission in the registry conforms to this comprehensive schema, added in the `Version 0.3.0` update:

```typescript
export interface Mission {
  id: string;                                           // Unique identifier (e.g. "mission-projectile-1")
  title: string;                                        // Human-readable title
  codename: string;                                     // High-flavor cinematic code (e.g., "OPERATION: CRATE DROP")
  description: string;                                  // Short overview of the narrative context
  objectives: string[];                                 // Core learner milestones
  steps: MissionStep[];                                 // Sequence of loop stages (BRIEFING -> DEBRIEF)

  // --- REUSABLE MISSION FACTORY SCHEMA ADDITIONS (Version 0.3.0) ---
  subject: string;                                      // "Physics" | "Chemistry" | "History" | "Literature"
  chapterName: string;                                  // Grouping name of the parent module
  learningObjectives: string[];                         // Curriculum-aligned key competencies
  storyNarrative: string;                               // Full back-story for the briefing overlay
  
  world: {
    environmentName: string;                            // e.g. "Tharsis Ridge, Mars" or "Paris Streets, 1789"
    visualAtmosphere: string;                           // Color temperature and backdrop profile description
    audioLandscape: string;                             // Custom spatial audio ambient soundtrack descriptor
  };

  coreScientificConcept: {
    name: string;                                       // Core principle being explored
    description: string;                                // Phenomenological description
    equationLatex?: string;                             // LaTeX string of the target physical formula
  };

  coreInteraction: "PROJECTILE_AIMING" | "TITRATION_BALANCE" | "DECISION_TIMELINE" | "THEMATIC_ANALYSIS";

  predictionPrompt: string;                             // Question asked during the PREDICT phase
  predictionPresets: {                                  // Choices presented to the student
    id: string;
    label: string;
    isMisconception: boolean;                           // Marks if this selection represents a conceptual error
    misconceptionId?: string;                           // Specific diagnostic key (e.g., "MISCONCEPTION_MASS_DEPENDENT_GRAVITY")
    explanation?: string;                               // Socratic hints for immediate correction
  }[];

  experimentFlow: {
    parameters: {                                       // Slider controls calibrated dynamically
      name: string;
      label: string;
      symbol?: string;
      min: number;
      max: number;
      step: number;
      defaultValue: number;
      unit: string;
    }[];
    targets: {                                          // Empirical goal conditions
      name: string;
      label: string;
      min: number;
      max: number;
      unit: string;
      hint: string;
    };
  };

  reflectionPrompts: string[];                          // Direct questions to ask during the Socratic notebook step
  
  commonMisconceptions: {                               // Trigger patterns that alter server behavior
    id: string;
    name: string;
    triggerCondition: string;
    pedagogicalAction: string;
  }[];

  socraticMentorDialogue: {                             // Active Socratic guide profile
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
    impactCraters: boolean;                             // If true, logs craters on the Canvas stage
    previousTrajectories: boolean;                      // If true, overlays previous trials in low-opacity
    radioTransmissions: string[];                       // List of warning messages shown on failure
  };

  worldMemory: {
    persistenceEnabled: boolean;                        // Tracks across user sessions
    maxMemorySlots: number;
  };

  scientificDiscoveries: {                              // Real scientific laws the student "discovers"
    id: string;
    title: string;
    description: string;
    scientificInsight: string;                         // Richard Feynman style conversational debrief
  }[];

  rewards: {
    xp: number;
    badges: string[];
  };

  teacherNotes: string;                                 // Tips for classroom demonstration
  assessmentStrategy: string;                           // Evaluation parameters
  accessibilityNotes: string;                           // Touch target, high contrast, and screen reader configurations
  
  unlockConditions: {
    minXP?: number;
    prerequisites?: string[];
  };
  
  missionDuration: number;                              // Expected completion time (minutes)
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  prerequisites: string[];
}
```

---

## 🛠️ Dynamic Environmental Tuning

The `world` and `coreInteraction` blocks completely rewire the visual layout and interactivity of the `MissionActiveView` component:

### 1. Projectile Aiming (Physics)
*   **Canvas Grid:** Translates standard coordinates into vertical and horizontal vectors.
*   **Aesthetic Profile:** Applied a **Charcoal & Mars Crimson** theme with rich back-glows.
*   **Dual-Mass Activation:** If a mass misconception is triggered (e.g. testing different cargo weights), the factory splits the canvas into parallel, dual-rendering streams: drawing a **500kg Iron Safe** and a **10kg Wood Crate** in synchronized flight to visually prove mass-independence.

### 2. Titration Balance (Chemistry)
*   **Canvas Grid:** Renders an acid-base buret and indicator flask.
*   **Aesthetic Profile:** Soft, sterile **Neon Cyan & Bio-hazard Amber** palette.
*   **Dynamic Elements:** Tracks droplet count, color shade changes, and pH curves dynamically as sliders change.

### 3. Decision Timeline (History)
*   **Canvas Grid:** Renders chronological branch nodes representing historical paths.
*   **Aesthetic Profile:** Rich **Smoky Parchment & Royal Gold** colors.
*   **Dynamic Elements:** Triggers choices, timeline progression maps, and custom consequences.

### 4. Thematic Analysis (Literature)
*   **Canvas Grid:** Renders a conceptual character-network map.
*   **Aesthetic Profile:** Introspective **Gothic Indigo & Deep Violet** colors.
*   **Dynamic Elements:** Highlights textual nodes, semantic threads, and thematic relationships.

---

## ⚡ Cognitive Feedback Loop Implementation

The factory coordinates with the server-side LLM gateway to handle active student states:

1.  **Hypothesis Locking:** When the student selects a preset, the misconception triggers are analyzed.
2.  **Socratic Prompt Injection:** If the student chooses a misconception choice, a cognitive flag is sent to the Express backend. The backend constructs a targeted prompt for Gemini:
    *   *Socratic Directive:* *"Never provide the direct mathematical solution. Gently ask leading questions about inertia and force cancelation."*
3.  **Empirical Overlays:** The canvas responds to diagnostic states by displaying comparison trails (such as Galileo's dual-drop experiment).
4.  **Socratic Notebook Archival:** Success records get saved to the Zustand `useEngineStore` and render onto the tactile, split-page Lab Notebook layout.

---

## 💎 Design and Accessibility Focus

To maintain native-feeling PWA quality:
*   **Dynamic Touch Targets:** All dynamic sliders and control elements maintain an interactive target density of at least $44\text{px} \times 44\text{px}$.
*   **Aesthetic Rhythm:** Negative space scales gracefully across mobile, tablet, and desktop viewports, avoiding cluttered margins.
*   **Glow Layers:** Visual cues use high-contrast drop-shadows with low computational overhead to keep animations performing at a steady $60\text{ FPS}$.

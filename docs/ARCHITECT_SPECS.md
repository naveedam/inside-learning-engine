# Inside Physics: Immersive Experiential Learning Platform
## Comprehensive Architectural Specification & Product Requirements Document (PRD)

---

## 1. Product Requirements Document (PRD)

### 1.1. Product Vision
**Inside Physics** is an immersive, cinematic, experiential learning platform built specifically for **ISC Class XI Physics** students. 
Instead of reproducing textbook exercises or traditional video-lecture interfaces (EdTech "slop"), Inside Physics treats learning as an active exploration. The interface and user experience borrow paradigms from:
- **Apple Vision Pro**: High spatial depth, refined glassmorphism, soft back-glows, and elegant physical responsiveness.
- **Interstellar & Apollo 13**: Dark, high-contrast, atmospheric cosmic realism combined with mission-oriented mechanics.
- **Iron Man HUD / NASA Mission Control**: Data-rich telemetry overlays, real-time vector graphs, and interactive dials that make formula derivation feel like system calibration.
- **AAA Game UI & Modern Science Museums**: Staggered cinematic reveals, audio-visual feedback loops, and highly responsive tactile simulations.

---

### 1.2. Core Philosophy: The Phenomenological Flow
Students do not study a formula first. They encounter a physical scenario, interact with variables, observe the emergent behavior, and subsequently "discover" the underlying law:
1. **The Mission Briefing (Hook)**: A cinematic contextual challenge (e.g., "Calculate the launch angle to clear the Martian mountain range with an emergency supply crate").
2. **Interactive Telemetry (Phenomenon)**: Tactile sliders that control speed, launch angle, and gravity, showing vector trajectories in real-time.
3. **The Empirical Derivation (Formula Emergence)**: The interactive graph plots data-points in real-time. As the student matches the curve, the equation locks into place, transitioning from an abstract mathematical string to a functional utility.
4. **AI Socratic Guide (Mentor)**: A modular mentor panel modeled after history's greatest minds (Newton, Feynman, Einstein) who don't provide answers but ask guiding questions.
5. **The Journal & Achievements (Reflection)**: Successful runs compile into a stylized mission log with high-quality badges.

---

### 1.3. Target User Personas
- **Primary - ISC Class XI Students**: Preparing for highly challenging academic standards, searching for deep conceptual understanding rather than rote memorization. Needs high visual stimulation, instant physical feedback, and intuitive touch controls.
- **Secondary - Physics Educators**: Looking for high-quality sandbox tools to demonstrate physical concepts dynamically in class.
- **Secondary - Parents & Schools**: Seeking measurable engagement metrics, high curriculum alignment (ISC Board scope), and installable app capabilities for high accessibility.

---

### 1.4. Progressive Web App (PWA) Specifications
To meet our target of a high-performance, native-feeling, installable mobile application, the engine will feature:
- **Service Worker Caching**: Offline-first access to core JSON schemas, layout stylesheets, standard assets, and font files.
- **Installability (Manifest JSON)**: Native app installation banner support, custom retro-futuristic icons, landscape locked-aspect scaling, and splash screen sequences.
- **Local SQLite / IndexedDB Storage**: Local caching of mission states, customized logs, streak data, and notebook updates.

---

### 1.5. Non-Functional Requirements (Performance & Accessibility)
- **Time to Interactive (TTI)**: $< 1.5\text{s}$ on mid-range mobile devices via lightweight Vector/Canvas physics and lazy-loading of simulations.
- **Touch-First Target Density**: Minimum interactive touch zone of $44\text{px} \times 44\text{px}$ for all controls, satisfying physical accessibility standards on tablets and phones.
- **Contrast & Typography**: Highly legible text contrast (exceeding WCAG AAA) utilizing crisp fonts paired with deep space backgrounds (`#030712`) and neon primary telemetry curves.

---

## 2. Technical Architecture Document

### 2.1. The Agnostic Engine Pattern
To prevent hardcoded curriculum lock-in, Inside Physics is designed as a **Universal Experiential Engine**.
The user interface, state machine, dialogue system, and achievements are completely decoupled from the subject matter. The subject is loaded dynamically via a **Content Pack JSON Schema**. By swaping out the curriculum pack, the engine can instantly render **Inside Chemistry**, **Inside Biology**, or **Inside History**.

```
                           +------------------------+
                           |  Dynamic JSON Content   |
                           |   (Curriculum Pack)    |
                           +-----------+------------+
                                       |
                                       v
                     +-----------------+-----------------+
                     |    Universal Experiential Engine   |
                     |  (Manages state, navigation, UI) |
                     +-----------------+-----------------+
                                       |
         +-----------------------------+-----------------------------+
         |                             |                             |
         v                             v                             v
+--------+--------+           +--------+--------+           +--------+--------+
|  Scene Module   |           | Dialogue Module |           | Sandbox Module  |
|  (Renders HUD)  |           | (Socratic AI)   |           | (HTML5 Physics) |
+-----------------+           +-----------------+           +-----------------+
```

---

### 2.2. Architectural Layers
1. **Config/Data Layer (JSON)**: Declare chapters, narratives, characters, formulas, simulation properties, and challenge questions.
2. **Physics Sandbox Engine (Canvas/WebGL)**: Uses lightweight mathematical integrations (Verlet or Euler Integration) implemented natively inside React canvas modules for precise, high-performance interactions.
3. **Dialogue & Socratic Agent Adapter**: An extensible gateway designed to hook up with server-side LLMs (such as Gemini 2.5 Flash via our server-side API proxy) using structured system prompts representing Galileo, Newton, or Feynman.
4. **Telemetry & View Layer (React + Tailwind + Framer Motion)**: Custom HUD UI overlays built with absolute styling and CSS-glow properties.

---

## 3. Folder Structure Specification

A highly scalable, modular directory layout designed for professional Git operations, decoupling engine systems from dynamic content.

```
/
├── .env.example
├── .gitignore
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── docs/                      # Architectural documents and design assets
│   └── ARCHITECT_SPECS.md
├── public/                    # Static assets, fonts, icons, PWA manifests
│   ├── manifest.json
│   └── assets/
└── src/
    ├── main.tsx               # Main React entry point
    ├── index.css              # Global tailwind styles, font imports & glow variables
    ├── App.tsx                # Layout wrapper & main view router
    ├── types.ts               # Unified TS interfaces (Engine, Content, State)
    │
    ├── content/               # THE CORE CONTENT PACKS (Pure JSON or Static TS objects)
    │   ├── physics_class_11/  # Dynamic curriculum structure for ISC Class XI
    │   │   ├── kinematics.json
    │   │   ├── dynamics.json
    │   │   └── vectors.json
    │   └── registry.ts        # Content pack loader & validator
    │
    ├── core/                  # UNIVERSAL ENGINE CORE (Framework-agnostic logic)
    │   ├── physics/           # Lightweight math utilities, kinematics formulas, vectors
    │   │   └── integrator.ts  
    │   └── ai/                # API Client wrappers & custom AI prompt templates
    │       └── mentors.ts
    │
    ├── hooks/                 # Custom reusable hooks
    │   ├── useAudio.ts        # Sound FX, cinematic hums, spatial audio
    │   ├── useMissionState.ts # Active mission flow step controller
    │   └── usePhysicsSim.ts   # Custom Hook to drive simulation animation frames
    │
    ├── components/            # REUSABLE ENGINE COMPONENTS
    │   ├── shared/            # Ground-level UI atoms
    │   │   ├── Button.tsx     # Futuristic glass button with custom borders
    │   │   ├── Card.tsx       # Glassmorphism container
    │   │   └── Telemetry.tsx  # Dynamic numeric readouts and graphs
    │   │
    │   ├── layout/            # Layout shells
    │   │   ├── HUDFrame.tsx   # NASA-like status bars, battery/power indices, compasses
    │   │   └── MissionCard.tsx# Chapter explorer cards
    │   │
    │   ├── mission/           # Mission flow wrappers
    │   │   ├── MissionBrief.tsx # Animated overlay before starting a challenge
    │   │   ├── MissionDialogue.tsx # Socratic character dialogue view
    │   │   ├── MissionSandbox.tsx # Custom UI layout combining Simulation + Telemetry Sliders
    │   │   └── MissionDebrief.tsx # Rewards, streaks and achievements recap
    │   │
    │   └── simulations/       # CONCRETE PHYSICS SIMULATORS (Decoupled & dynamic)
    │       ├── ProjectileSim.tsx # Projectile Motion / Crate drop canvas
    │       ├── VectorAdditionSim.tsx # Grid based vector addition simulation
    │       └── OrbitSim.tsx      # Gravitational slingshot orbital simulation
    │
    └── context/               # APP-WIDE PERSISTENT STATE
        └── EngineContext.tsx  # Shared game-loop state (scores, unlocked badges, streaks)
```

---

## 4. Routing & State Management Strategy

### 4.1. Routing Strategy
To support instant PWA state restoration and smooth Framer Motion transitions, the application uses **State-Driven Virtual Routing** inside a single-page architecture rather than a heavy, state-clearing traditional router:
- **Main Views (`view` state)**:
  - `home` / `dashboard`: Interactive cosmic map showing unlocked chapters as stellar constellations.
  - `mission-hub`: Interactive details of the selected chapter (missions, quizzes, sandbox).
  - `active-mission`: Full-screen cinematic container hosting the HUD, Dialogue system, and active simulation.
  - `journal`: Personal lab notebook, formula vault, and high-tech badge showcase.
- **Active Mission Transitions (`missionStep` state)**:
  - Guided sequence: `BRIEFING` $\rightarrow$ `DIALOGUE` $\rightarrow$ `EXPLORATION` $\rightarrow$ `EXPERIMENT` $\rightarrow$ `DEBRIEF`.

---

### 4.2. State Management Strategy
The global state must hold:
1. **User Profile & Progression**: Unlocked chapters, total XP, current streak, and compiled journal formulas.
2. **Active Mission State**: Current mission id, current step, collected telemetry variables, and AI Socratic prompt logs.
3. **Simulation Playback Parameters**: Live simulation speed, state vectors, trajectory logs, and animation tick controls.

We will build a high-performance **EngineContext** combining React's native state with highly reactive React refs for animation frames. This keeps the virtual routing instantly responsive, preserves state when navigating views, and eliminates re-render bottlenecks during high-frequency Canvas animation ticks.

---

## 5. Design System Specification

### 5.1. Color Palette (Cinematic Space Theme)
- **Deep Slate/Charcoal Canvas**: `#030712` (Base), `#090d16` (Card Background), `#111827` (Card Border)
- **NASA Orange (Highlight/Caret)**: `#ff6b00` / `#ea580c`
- **Telemetry Cyan (Vectors/Graphs)**: `#06b6d4` / `#0891b2`
- **Emerald Green (Success Indicators)**: `#10b981` / `#059669`
- **Glassmorphism Specular Accent**: `rgba(255, 255, 255, 0.05)`

---

### 5.2. Glassmorphism & Glooming Spec (Tailwind Implementation)
To achieve the premium, floating spatial quality of Apple Vision Pro interfaces:
- **Card Styling**: 
  ```html
  <div class="bg-gray-950/45 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_-12px_rgba(6,182,212,0.15)] shadow-cyan-500/10">
  ```
- **HUD Telemetry Text (Glow Effect)**:
  ```html
  <span class="text-cyan-400 font-mono tracking-widest uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
  ```

---

### 5.3. Typography Pairing
- **Header Fonts (Cinematic, Modern)**: `Space Grotesk` or `Outfit` (sans-serif) - bold, tight tracking (`tracking-tight`), futuristic and wide.
- **Body Fonts (Intellectual, Clean)**: `Inter` (sans-serif) - highly readable at small sizes with open counters and generous line heights.
- **Telemetry & Formula Fonts (Data)**: `JetBrains Mono` - perfectly aligned tabular digits, explicit vector symbols, and clean math notations.

---

## 6. Animation Guidelines

To evoke the premium feel of an interactive museum or high-tech spacecraft HUD, all animations must align with physical principles:

- **Cinematic Entrance (Easer: Decelerate)**:
  - Transition elements using a physical spring curve: `damping: 25`, `stiffness: 120`.
  - Staggered entrances for list components or telemetry readings to simulate a system diagnostic sequence.
- **Micro-interactions (Tactile Feedback)**:
  - Button presses shrink slightly: `whileTap={{ scale: 0.98 }}`.
  - Hover states expand gently with soft neon glows: `whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}`.
- **Graceful Degradation Policy**:
  - Automatically detect low-end devices or battery saver modes, disabling expensive canvas-level overlay glow computations and falling back to solid backgrounds.

---

## 7. JSON Schema Specifications

Below are the exact schemas that structure our universal dynamic experiential engine.

### 7.1. Curriculum Schema (`types.ts`)
```typescript
export interface CurriculumPack {
  id: string;
  subject: string;
  grade: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  constellationPosition: { x: number; y: number }; // Relative coordinates for Star Map UI
  missions: Mission[];
}

export interface Mission {
  id: string;
  title: string;
  codename: string;
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
    dialogue?: DialogueSegment[];
    narrative?: string;
    simulationConfig?: SimulationConfig;
    challengeQuestion?: ChallengeQuestion;
  };
}

export interface DialogueSegment {
  speaker: string;
  avatar: string; // "NEWTON" | "FEYNMAN" | "GALILEO" | "EINSTEIN"
  message: string;
}

export interface SimulationConfig {
  simId: "PROJECTILE" | "ORBITAL_SLINGSHOT" | "VECTOR_FORCE";
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
  formulaTrigger: string; // The physical rule that unlocks success
  targetValueRange: { min: number; max: number; targetVar: string };
  hint: string;
  completionRewardXP: number;
}
```

---

### 7.2. Concrete Curriculum JSON Example (Class XI Kinematics)
```json
{
  "id": "chapter-2-kinematics",
  "title": "Kinematics: Launch Dynamics",
  "shortDescription": "Master the geometry of motion, vector acceleration, and parabolic paths.",
  "longDescription": "Embark on an emergency Martian landing operation. Discover how gravity, launching velocities, and mathematical vectors control physical trajectories.",
  "difficulty": "Intermediate",
  "estimatedMinutes": 25,
  "constellationPosition": { "x": 30, "y": 45 },
  "missions": [
    {
      "id": "mission-projectile-1",
      "codename": "OPERATION: CRATE DROP",
      "title": "Parabolic Precision on Mars",
      "description": "Calculate launch velocities to deliver emergency scientific supplies over a 150m Martian mountain range.",
      "objectives": [
        "Experience projectile acceleration independently on x and y axes.",
        "Derive the parabolic trajectory equation.",
        "Clear the Martian peak and land the module in the safe coordinates."
      ],
      "steps": [
        {
          "id": "step-1-brief",
          "type": "BRIEFING",
          "title": "Astraea Base SOS",
          "content": {
            "narrative": "A major dust storm has blocked critical passes on the Tharsis volcanic plateau. Our exploration rover is depleted of oxygen reserves. Standard supply drones cannot launch due to dust interference; we must use the electromagnetic linear projectile platform."
          }
        },
        {
          "id": "step-2-dialogue",
          "type": "DIALOGUE",
          "title": "Galileo's Insight",
          "content": {
            "dialogue": [
              {
                "speaker": "Galileo Galilei",
                "avatar": "GALILEO",
                "message": "Welcome back, Operator. To defeat the mountain, we must realize that horizontal motion is completely independent of the vertical fall of gravity. This horizontal inertia proceeds uniformly, whilst the vertical fall accelerates!"
              },
              {
                "speaker": "Galileo Galilei",
                "avatar": "GALILEO",
                "message": "Try operating the simulation. Change the horizontal propulsion and the vertical boost separately and watch how the motion splits into two components."
              }
            ]
          }
        },
        {
          "id": "step-3-sandbox",
          "type": "SANDBOX_EXPLORATION",
          "title": "Atmospheric Vector Testbed",
          "content": {
            "simulationConfig": {
              "simId": "PROJECTILE",
              "initialParameters": {
                "velocity": 50,
                "angle": 45,
                "gravity": 3.72
              },
              "minMaxLimits": {
                "velocity": [10, 120],
                "angle": [0, 90],
                "gravity": [1, 20]
              },
              "targetFormula": {
                "latex": "y = x \\tan(\\theta) - \\frac{g x^2}{2 v_0^2 \\cos^2(\\theta)}",
                "description": "Equation of Projectile Path",
                "variableLabels": {
                  "v_0": "Launch Velocity (m/s)",
                  "theta": "Angle (deg)",
                  "g": "Gravity Acceleration (m/s²)"
                }
              }
            }
          }
        },
        {
          "id": "step-4-challenge",
          "type": "CHALLENGE_EXPERIMENT",
          "title": "The Tharsis Pass Challenge",
          "content": {
            "challengeQuestion": {
              "questionText": "A 150m mountain rises 400m away from the launcher. The target landing pad is at x = 800m. Given Martian gravity (g = 3.72 m/s²), adjust your launch angle to exactly 45 degrees, and adjust the launch velocity so that the crate successfully clears the peak and lands in the target zone (780m - 820m)!",
              "formulaTrigger": "range_equation",
              "targetValueRange": {
                "min": 780,
                "max": 820,
                "targetVar": "range"
              },
              "hint": "Use the Range formula: R = (v² * sin(2θ)) / g. Rearrange to solve for velocity v when R = 800m and θ = 45°.",
              "completionRewardXP": 500
            }
          }
        },
        {
          "id": "step-5-debrief",
          "type": "DEBRIEF",
          "title": "Mission Accomplished",
          "content": {
            "narrative": "Sensors confirm a direct hit. The cargo module landed securely at x = 803m, delivering oxygen cylinders to the Tharsis Rover crew. Galileo is pleased with your empirical mastery of parabolas."
          }
        }
      ]
    }
  ]
}
```

---

## 8. Comprehensive Development Roadmap

### Phase 1: Core Experiential Engine (Current Milestone Target)
- Set up **EngineContext** and state-based navigation mapping.
- Implement global glassmorphism layout framing (retro-futuristic HUD, telemetry badges, glowing accents).
- Build the **Universal Mission Controller**: Orchestrates transitions between `BRIEFING`, `DIALOGUE`, `SANDBOX_EXPLORATION`, `CHALLENGE_EXPERIMENT`, and `DEBRIEF`.
- Program the first rich, highly interactive interactive component: **`ProjectileSim.tsx`** with real-time vector graphs and dynamic mathematical updates.

### Phase 2: Curriculum Scaling & Socratic Mentors
- Expand Chapter Constellation Map showing multiple modules (Kinematics, Newton's Laws, Gravitational Orbits).
- Structure the Socratic Dialogue module with pre-loaded mentor templates (Galileo, Newton, Feynman).
- Add server-side AI endpoints using the **Gemini 2.5 Flash** server adapter to power real-time "Ask Feynman" Socratic prompts during active sandboxes.

### Phase 3: Gamification, Progression, & PWA
- Standardize local storage persistence for completed challenges, XP progression, and formula collections.
- Launch the **Lab Journal** section where students can audit their unlocked accomplishments and replay past simulations.
- Complete the PWA build pipeline with service workers and offline loading systems.

---

## 9. Recommended First Milestone Specification (MVP)

We will build the entire **Phase 1: Core Experiential Engine** inside our workspace immediately. This single-screen high-tech experience will allow users to:
1. View an exquisite cinematic Dashboard detailing our first active chapter constellations.
2. Launch directly into **"Operation: Crate Drop" (Class XI Kinematics: Projectile Motion)**.
3. Advance through the full cinematic flow:
   - **Mission Brief**: Dramatic narration card detailing the Martian base emergency.
   - **Galileo's Dialogue Segment**: Interactive avatar window explaining physical vectors.
   - **Active Sandbox Simulation**: An HTML5 Canvas-based Projectile Simulator with real-time vector paths, telemetry sliders (Launch Velocity, Launch Angle, Martian Gravity), and real-time path equation visualizers.
   - **The Socratic Guide Overlay**: An active panel allowing students to ask history's greatest mentors for hints on how to derive the formulas.
   - **The Precision Challenge**: Live telemetry target zone challenge. Successfully landing the crate updates the state, yields a high-fidelity reward panel, unlocks a physics badge, and awards XP!

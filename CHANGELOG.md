# Changelog - Inside Learning Engine

All notable changes to the Inside Learning Engine will be documented in this file.

---

## [1.4.0] - 2026-09-12
### Phase 3: Mathematics Curriculum Pack & "The Vanishing Secant"

Introduced the **Mathematics Class XI Curriculum Pack** (`mathematics-class-11`) along with its inaugural mission, **"The Vanishing Secant"**, in the **Limits & Derivatives** chapter, powered entirely by the reusable `PARAMETER_SANDBOX` engine.

### Added
*   **Mathematics Class XI Curriculum Pack (`src/content/mathematics_class_11/limits_and_derivatives.ts`):**
    *   Curriculum Pack ID: `mathematics-class-11`, Subject: Mathematics, Grade: ISC Class XI.
    *   Visual identity: `Compass` icon with a warm `amber` accent color, distinctly contrasting with the physics palette.
    *   Chapter: **Limits & Derivatives** (`limits-and-derivatives`), introducing differential calculus conceptually through geometric rate convergence.
*   **Mission: "The Vanishing Secant" (`vanishing-secant`):**
    *   **Narrative World:** Astraea Orbital Observatory with a glowing star-chart drafting-table aesthetic charting an archipelagic coastline $f(x) = x^2$ from above.
    *   **Predict Phase:** Custom prediction presets targeting fundamental calculus misconceptions:
        *   `slope-shrinks-to-zero` (Zero Delta Fallacy: assuming $\Delta x \to 0 \implies m \to 0$).
        *   `slope-diverges` (Division by Zero Fallacy: assuming $0$ denominator causes infinite explosion).
        *   `slope-stabilizes` (Correct convergence to the instantaneous tangent rate $m = 2.0$).
    *   **Experiment Phase:** Powered by `PARAMETER_SANDBOX` with dynamic parameter $x$ (secondary survey probe position) sliding toward the anchor $x_0 = 1.0$, evaluating $m_{\text{sec}} = \frac{x^2 - 1}{x - 1} = x + 1$ into target band $[2.0, 2.3]$.
    *   **Reflect Phase:** Pedagogical confrontation refuting the misconception that a derivative is merely a very steep or tiny secant line, framing the discovery of **"The Instantaneous Rate"** as a qualitative threshold shift.
    *   **Socratic Voice:** Dr. Richard Feynman configured as the primary leading voice in the dialogue array, utilizing intuitive, jargon-free speed and slope analogies.
*   **Curriculum Registry Integration (`src/content/registry.ts`):**
    *   Registered `mathematicsClass11Curriculum` in `curriculumRegistry`, enabling seamless constellation browsing and mission dispatching.

---

## [1.3.0] - 2026-09-12
### Phase 2: PARAMETER_SANDBOX Reusable Interaction Engine

Introduced the **`PARAMETER_SANDBOX`** interaction engine to the Inside Learning Engine, extending the Universal Mission Factory with a general-purpose, cross-disciplinary 2D Cartesian function plotter and empirical parameter-fitting workbench.

### Added
*   **Type System Extension (`src/types.ts`):**
    *   Added `"PARAMETER_SANDBOX"` to `CoreInteraction` union.
    *   Defined `ParameterSandboxConfig` interface supporting mathematical relationships: `LINEAR`, `QUADRATIC`, `INVERSE`, `EXPONENTIAL`, and `RATE_LIMITED`.
    *   Integrated optional dynamic coefficients (`a`, `b`, `c`, `k`), target bands (`min`, `max`), and coordinate range bounds (`xRange`, `yRange`).
*   **2D Cartesian Simulation & Canvas HUD (`src/components/layout/MissionActiveView.tsx`):**
    *   Standardized 2D Cartesian coordinate plane with auto-calibrated domain and range margins, axis tick marks, and zero-crossings.
    *   Real-time mathematical curve evaluation based on calibrated formula models.
    *   Dynamic target-band shading illustrating the tolerance region.
    *   Interactive multi-run trail plotting: persistent trial markers showing historical parameter sweeps and outcomes.
    *   Real-time evaluation of outcomes into `SECURED` (target achieved), `UNDERSHOT`, or `OVERSHOT`.
*   **Full Predict ➔ Experiment ➔ Reflect Social Contract #5 Loop:**
    *   **Pre-experiment Hypothesis Reception:** Socratic mentor pre-responses from Newton, Feynman, or Galileo reacting to the learner's committed hypothesis and misconception flags.
    *   **Spontaneous Trial Feedback:** Post-run guidance conditioning on target band achievement across all three mentors.
    *   **Post-experiment Telemetry Confrontation:** Mentor remarks highlighting the empirical outcome vs. the learner's initial hypothesis upon entering reflection.
    *   **Cognitive Alignment Card:** Custom alignment display contextualizing whether data matched the prediction and prompting deep reflection on the underlying mathematical relationship.
*   **Server AI Synthesis & Offline Fallback (`server.ts`):**
    *   Added `isParameterSandbox` detection in the `/api/mentor` endpoint for Gemini context injection.
    *   Implemented persona-specific offline fallback mock replies for Newton, Feynman, and Galileo tailored to parametric models and mathematical relationships.
*   **Mission Factory Documentation (`docs/MISSION_FACTORY.md`):**
    *   Documented the `PARAMETER_SANDBOX` engine specification, relationship formulas, telemetry features, and Social Contract #5 feedback loop.

---

## [1.2.0] - 2026-09-12
### Phase 1: Physics Expedition 03 — "Energy Depths" (Work, Energy & Power)

Introduced **Expedition 03: Energy Depths** to the ISC Class XI Physics Curriculum, completing the triumvirate of classical mechanics expeditions (Kinematics, Newton's First Law, and Work-Energy Theorem).

### Added
*   **Expedition 03 Mission Data (`src/content/physics_class_11/energy_depths.ts`):**
    *   Set in the Challenger Deep Mariana Trench (-10,994m) featuring an orbital space elevator arrest buffer.
    *   Configured cognitive predictions targeting the linear vs. quadratic spring compression misconception ($W = \frac{1}{2}kx^2$) and the point of peak velocity ($kx = mg$ equilibrium vs. initial contact).
    *   Calibrated 4-step mission arc with live parameter tuning ($h = 20-80\text{m}$, $m = 1000-4000\text{kg}$, $k = 10000-40000\text{N/m}$).
    *   Registered as `energyDepthsChapter` in `src/content/registry.ts`.
*   **Real-Time Energy Conservation Simulation & Canvas HUD (`src/components/layout/MissionActiveView.tsx`):**
    *   Analytical closed-form simulation of vertical freefall into a damped elastic spring buffer ($mg(h + x) = \frac{1}{2}kx^2$).
    *   Dynamic canvas rendering of the deep Mariana abyssal shaft with bioluminescence, vertical guide rails, bedrock plate, and animated spring coils that physically compress in real time.
    *   Live Work-Energy Conversion HUD with dynamic percentage bars for Gravitational PE ($U_g = mgh$), Kinetic Energy ($K = \frac{1}{2}mv^2$), Elastic PE ($U_e = \frac{1}{2}kx^2$), and strict total energy conservation indicator.
    *   Dynamic equilibrium marker ($kx = mg$) on the shaft illustrating that velocity peaks after spring contact until upward restorative force equals downward weight.
    *   Safety threshold target zone ($10.0\text{m} - 12.0\text{m}$) and real-time deceleration G-force gauge.
*   **Social Contract #5 Conditioning for Socratic Mentors:**
    *   Integrated tailored pre-experiment responses, spontaneous post-trial feedback, and reflection debrief dialogue across Newton, Feynman, and Galileo conditioning on student predictions (`energy-linear`, `energy-impact-max`, `energy-conserved`).
    *   Updated `server.ts` AI prompt synthesizer and fallback mock engines to support `energy-depths`.

---

## [0.3.0] - 2026-07-12
### Milestone 3: Reusable Mission Factory & Multi-Disciplinary Curriculums

This release introduces the **Universal Mission Factory** pattern, transforming the application into an agnostic curriculum engine. It expands the platform to support Physics, Chemistry, History, and Literature modules through a single, highly flexible schema.

### Added
*   **Universal Reusable Mission Factory Schema:**
    *   Defined comprehensive metadata attributes for curriculum subjects in `src/types.ts`.
    *   Created full, rich subject content configurations for **Physics** (Mars Crate Drop Kinematics), **Chemistry** (Stoichiometry and titration simulation), **History** (French Revolution timeline and branch decisions), and **Literature** (Frankenstein thematic and semantic graph analysis).
*   **Aesthetic Theme Adaptability:**
    *   The engine dynamically tunes the spatial HUD color schemes, canvas viewport grids, and ambient soundscapes based on the active curriculum's visual atmosphere.
*   **Galileo Dual-Mass Co-Observation Overlays:**
    *   Designed dynamic trajectory tracks drawing both a **500kg Iron Safe** and a **10kg Wood Crate** traveling side-by-side to visually disprove mass-dependence in projectile motion.
    *   Wired dual-mass cognitive monitoring flags directly to the server-side Gemini prompt builder for custom Socratic interactions regarding Galileo's paradox.
*   **Socratic Debrief System Update:**
    *   Designed specialized interactive question card overlays in the Reflection step for dual-mass trials, guiding students towards resolving acceleration ratios.

### Changed
*   **Responsive Canvas Geometry:**
    *   Implemented adaptive Canvas resizing and robust touch zone dimensions (minimum 44px) across standard mobile, tablet, and desktop viewports.
*   **Server API Resilience:**
    *   Configured CJS bundled server builds using esbuild with sourcemap generation and optimized Node-native external resolution.

---

## [0.2.0] - 2026-07-12
### Milestone 2: The Social Contract Cognitive Loop & Lab Notebook

This major release achieves the complete implementation of **Social Contract #1 (Predict → Experiment → Reflect)**, establishing an immersive, interactive, and academically rigorous learning cycle for spatial physics.

### Added
*   **Active Cognitive Loop State Controller (`useEngineStore`):**
    *   Designed a centralized 3-phase finite state machine representing `PREDICT` ➔ `EXPERIMENT` ➔ `REFLECT`.
    *   Synchronized active states to coordinate UI elements (e.g., locking launchers during experiments, highlighting telemetry during reflections).
*   **Spatial Hypothesis Ground Flag (`predictionFlagX`):**
    *   Enabled direct HTML Canvas interaction where clicking or tapping the ground stage drops an orange 🚩 **Predicted Landing Flag**.
    *   Visualized spatial prediction offsets dynamically with responsive HUD labels.
*   **Qualitative Hypothesis System:**
    *   Created physical rationale buttons targeting common gravity and mass misconceptions (e.g., lighter objects float vs. heavier objects fall faster).
    *   Included custom free-text hypothesis inputs to let students elaborate in their own words.
*   **Misconception Diagnosis & Galileo's Co-Observation Mode:**
    *   Created automatic tracking for students manifesting the "mass-dependent gravity" misconception.
    *   Built a custom **Co-Observation Simultaneous Test Trigger** allowing dual, parallel launches of Wood and Iron cargo capsules. Trajectories overlay on the canvas to visually falsify gravity-mass dependence.
*   **Tactile Split-Page Research Journal:**
    *   Created a beautiful, multi-page spatial lab notebook.
    *   **Left Page (Empirical Log):** Real-time database listing every scientific run, showing hypotheses, rationale, actual landings, and delta variations.
    *   **Right Page (Discovery Maps):** Interactive nodes highlighting core scientific mechanics (conic splits, perfect elevation angles, orbital curves, mass independence).
*   **Telemetry & Socratic Guide Interactivity:**
    *   Enhanced real-time vector paths, showing the decoupled velocity axes.
    *   Connected HUD indicators displaying real-time velocities, gravitational forces, and heights.

### Changed
*   **Launcher Locking System:** Secures all precision slider controls and canvas barrel dragging during the active experiment and reflection states to ensure scientific validity.
*   **Visual Styling:** Retuned colors, borders, and lighting to emphasize a modern, premium "Cosmic Science" UI, avoiding generic dark gradients and prioritizing rich, high-contrast, glowing accents.

### Fixed
*   Resolved high-frequency render triggers on the Canvas frame using optimized `useRef` states for state-authoritative mathematical game ticks.
*   Eliminated React strict types warning by adding standard enum values and mapping types appropriately.

---

## [0.1.0] - 2026-06-15
### Milestone 1: Core Physics & Spatial HUD Core
*   Initial setup of React, Vite, Tailwind CSS, and Zustand.
*   Basic 2D Projectile Math engine rendering on HTML5 Canvas.
*   Socratic Mentor Sidebar (Galileo, Newton, Currie, Hypatia) with mock interactive replies.
*   Basic Mars simulation biome layout with simple launcher settings.

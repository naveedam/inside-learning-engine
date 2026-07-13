# Changelog - Inside Learning Engine

All notable changes to the Inside Learning Engine will be documented in this file.

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

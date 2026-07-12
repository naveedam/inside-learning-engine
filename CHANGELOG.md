# Changelog - Inside Learning Engine

All notable changes to the Inside Learning Engine will be documented in this file.

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

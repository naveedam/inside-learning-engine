# Inside Learning Engine (ILE) - Version 0.3.0

Welcome to the **Inside Learning Engine (ILE)**, a cinematic, spatial, and highly interactive experiential learning platform designed to teach physics and deep sciences through active exploration, predictive simulation, and Socratic debriefing.

This project is built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**, and uses state-authoritative architectures via **Zustand** and **Framer Motion** for premium interactive physics simulations.

---

## 🚀 Key Capabilities (Version 0.3.0)

Version 0.3.0 delivers the full implementation of **Social Contract #1: Predict → Experiment → Reflection**, paired with a **Universal Reusable Mission Factory** supporting multi-disciplinary curriculum packs:

### 1. The Universal Mission Factory (New in v0.3.0)
*   **Subject Agnostic Framework:** Run different academic modules utilizing a single standardized JSON schema.
*   **Multi-Subject Showcase:** Added fully spec'd out curriculums for **Physics** (Kinematics), **Chemistry** (Stoichiometry Titration), **History** (French Revolution Decision Lines), and **Literature** (Frankenstein Character Analysis).
*   **Aesthetic Theme Adaptability:** Instantly adapts canvas views, HUD color schemes, and ambient audios based on the active curriculum's visual atmosphere.

### 2. The Cognitive Learning Loop
*   **Predict Phase (🚩 PREDICT):**
    *   **Tactile Railgun Launcher Controls:** Adjust elevation angle, muzzle velocity, and Mars gravitational strength.
    *   **Spatial Hypothesis Placement:** Clicking or tapping directly on the terrain ground drops an orange 🚩 **Predicted Landing Flag**, visually recording the student's spatial hypothesis on the Canvas stage.
    *   **Qualitative Rationale:** Students select common conceptual presets or write custom text reasoning to justify their physics prediction before locking the launcher.
*   **Experiment Phase (⚡ EXPERIMENT):**
    *   **Launcher Locks:** Sliders and barrel manipulation are secured during active runs to enforce scientific rigor.
    *   **Cargo Payload Customization:** Select between various mass types: Wood Crate (10kg), Heavy Iron Safe (500kg), or Lithium Battery (10kg).
    *   **Real-Time Vector Telemetry:** Watch force vectors, horizontal velocities, and gravity shapes curves in real-time.
*   **Reflect Phase (📝 REFLECT):**
    *   **Socratic Comparison Analysis:** Displays target predictions side-by-side with actual empirical landing coordinates, calculating absolute delta margins.
    *   **Co-Observation Simultaneous Test:** Identified mass misconceptions trigger an interactive overlay allowing dual wood/iron comparative drops to visually prove Galileo's Principle of Mass Independence under gravity.
    *   **Research Notebook Archival:** Students record qualitative Socratic observations directly to their permanent record.

### 3. The Researcher's Journal (Lab Notebook)
*   **Tactile Split-Page Book Layout:** Framed as a beautiful, glowing HUD ledger of scientific exploration.
*   **Empirical Record Ledger (Left Page):** Lists full chronological loop iterations containing quantitative telemetry, delta values, qualitative hypotheses, and reflection observations.
*   **Cognitive Knowledge Map (Right Page):** Interactive node-network tracking key scientific discoveries:
    *   *Independent Horizontal Motion (Galileo's Conic Split)*
    *   *Ideal Launch Angle (45° Ultimate Compromise)*
    *   *Gravity Shapes Trajectories (Mars vs. Earth bends)*
    *   *Mass Independence in Vacuo (Galileo's Tower proof)*
*   **Feynman-Style Insights:** Unlocking discoveries displays deep, Socratic explanations in the charming, intuitive style of Richard Feynman.

---

## 🛠️ Tech Stack & Architecture

*   **UI Framework:** React (Functional components & hooks)
*   **Build Toolchain:** Vite + HMR disabled for incremental stability
*   **State Management:** Zustand (centralized, state-authoritative stores for persistent logs & progress)
*   **Animations:** Framer Motion (`motion/react`) for spatial HUD cards and transitions
*   **Styles:** Tailwind CSS + Google Fonts (Inter, Space Grotesk, JetBrains Mono)
*   **Icons:** Lucide React (pure vectors, zero external rasterized icons)
*   **Linter & Build Validation:** TypeScript strict types (`tsc --noEmit`)

---

## 📦 Getting Started

To run the application locally:

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start development server:**
    ```bash
    npm run dev
    ```
3.  **Build production artifacts:**
    ```bash
    npm run build
    ```

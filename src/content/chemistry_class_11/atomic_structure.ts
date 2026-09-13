/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mission } from "../../types";

export const bohrModelMission: Mission = {
  id: "bohr-model-electron-shells",
  title: "Atomic Structure: Electron Shell Mapping",
  codename: "OPERATION: NUCLEAR CARTOGRAPHY",
  description: "A damaged atomic-scale imaging array has captured a Bohr-model scan of an unknown element, but its shell labels have been corrupted. Identify each structure - nucleus and electron shells - to restore the atomic map.",
  objectives: [
    "Discover that electrons occupy discrete, quantized energy shells rather than orbiting at arbitrary distances.",
    "Identify each shell's maximum electron capacity (K=2, L=8, M up to 8 for this element).",
    "Correctly map the nucleus and all three electron shells of the scanned atom."
  ],
  steps: [
    {
      id: "briefing",
      type: "BRIEFING",
      title: "Atomic Cartography Briefing",
      content: {
        narrative: `### MISSION ADVISORY: SHELL IDENTIFICATION REQUIRED
A deep-field atomic imaging array has captured a Bohr-model scan of an unknown element - a dense central nucleus surrounded by three concentric electron shells. A data corruption event has wiped every label from the scan.

Electrons do not orbit at arbitrary distances - they occupy discrete, quantized energy shells, each with a strict maximum capacity:

- **K shell (n=1):** holds at most 2 electrons
- **L shell (n=2):** holds at most 8 electrons
- **M shell (n=3):** holds up to 8 electrons for this element (its outermost, valence shell)

Click each structure on the scan and identify it correctly to restore the atomic map.`
      }
    },
    {
      id: "dialogue",
      type: "DIALOGUE",
      title: "Imaging Array Uplink",
      content: {
        dialogue: [
          {
            speaker: "Sir Isaac Newton",
            avatar: "NEWTON",
            message: "Do not imagine these shells as a planet's orbit, sweeping freely at any distance you please. An electron is bound to one of a strict set of permitted energies - it may leap between shells, but it may never rest in the empty space between them."
          },
          {
            speaker: "Imaging Array Control",
            avatar: "SYSTEM",
            message: "Structure identification telemetry unlocked. Click a highlighted region on the scan to begin identification."
          }
        ]
      }
    },
    {
      id: "debrief",
      type: "DEBRIEF",
      title: "Atomic Map Restored",
      content: {
        narrative: `### TARGET SECURED: ATOMIC MAP FULLY RESTORED
Every structure on the scan has been correctly identified. The imaging array confirms the scanned element: **Sodium (Na)**, atomic number 11, electron configuration 2, 8, 1.

Notice what the corrupted labels never changed: the underlying physics. Whether labeled or not, those electrons were always confined to exactly three shells, in exactly those quantities - 2, then 8, then a single valence electron sitting alone in the outermost shell, eager to be lost in a chemical reaction.

**Achievement Unlocked: The Quantized Atom (ISC Class XI Chemistry — Structure of Atom)**`
      }
    }
  ],

  subject: "Chemistry",
  chapterName: "Structure of Atom: Electron Configuration & Quantum Numbers",
  learningObjectives: [
    "Discover that electrons occupy discrete, quantized energy shells rather than orbiting at arbitrary distances.",
    "Identify each shell's maximum electron capacity (K=2, L=8, M up to 8 for this element).",
    "Correctly map the nucleus and all three electron shells of the scanned atom."
  ],
  storyNarrative: "A damaged atomic-scale imaging array has captured a Bohr-model scan of an unknown element, but its shell labels have been corrupted by a data event. Identify each structure to restore the atomic map and reveal the element's identity.",
  world: {
    environmentName: "Deep-Field Atomic Imaging Array",
    visualAtmosphere: "Glowing Concentric Energy Shells & Scanning Grid Overlays",
    audioLandscape: "Low electromagnetic hum, scanning array pulses, data-restoration chimes"
  },
  coreScientificConcept: {
    name: "Bohr's Model & Quantized Electron Shells",
    description: "Electrons occupy discrete energy shells (K, L, M...) rather than arbitrary orbits, each with a fixed maximum electron capacity. This quantization explains why atoms have well-defined, repeatable chemical properties.",
    equationLatex: "n = 1, 2, 3, \\ldots \\quad (\\text{K, L, M shells})"
  },
  coreInteraction: "STRUCTURE_EXPLORER",
  structureExplorerConfig: {
    diagramTitle: "Corrupted Atomic Scan — Unknown Element",
    svgViewBox: "0 0 400 400",
    backgroundSvg: `
      <circle cx="200" cy="200" r="180" fill="none" stroke="#334155" stroke-width="1" stroke-dasharray="2 4" />
      <circle cx="200" cy="200" r="125" fill="none" stroke="#334155" stroke-width="1" stroke-dasharray="2 4" />
      <circle cx="200" cy="200" r="70" fill="none" stroke="#334155" stroke-width="1" stroke-dasharray="2 4" />
      <text x="200" y="24" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="monospace">UNKNOWN ELEMENT — SHELL LABELS CORRUPTED</text>
      <circle cx="270" cy="200" r="4" fill="#fbbf24" />
      <circle cx="130" cy="200" r="4" fill="#fbbf24" />
      <circle cx="325" cy="200" r="4" fill="#38bdf8" />
      <circle cx="288" cy="288" r="4" fill="#38bdf8" />
      <circle cx="200" cy="325" r="4" fill="#38bdf8" />
      <circle cx="112" cy="288" r="4" fill="#38bdf8" />
      <circle cx="75" cy="200" r="4" fill="#38bdf8" />
      <circle cx="112" cy="112" r="4" fill="#38bdf8" />
      <circle cx="200" cy="75" r="4" fill="#38bdf8" />
      <circle cx="288" cy="112" r="4" fill="#38bdf8" />
      <circle cx="380" cy="200" r="5" fill="#f472b6" />
    `,
    regions: [
      {
        id: "m-shell",
        label: "M Shell (n=3) — outermost valence shell, holds 1 electron here",
        shapeType: "circle",
        cx: 200,
        cy: 200,
        r: 180,
        distractors: [
          "K Shell (n=1) — innermost shell, holds 2 electrons",
          "L Shell (n=2) — second shell, holds 8 electrons",
          "Nucleus — contains protons and neutrons"
        ],
        explanation: "The M shell (n=3) is this element's outermost, valence shell. With only 1 electron here, this atom readily loses it in chemical reactions - the signature behavior of an alkali metal."
      },
      {
        id: "l-shell",
        label: "L Shell (n=2) — second shell, holds 8 electrons",
        shapeType: "circle",
        cx: 200,
        cy: 200,
        r: 125,
        distractors: [
          "K Shell (n=1) — innermost shell, holds 2 electrons",
          "M Shell (n=3) — outermost valence shell",
          "Nucleus — contains protons and neutrons"
        ],
        explanation: "The L shell (n=2) is completely filled with 8 electrons - the maximum this second energy level can hold, matching the octet rule's origin point."
      },
      {
        id: "k-shell",
        label: "K Shell (n=1) — innermost shell, holds 2 electrons",
        shapeType: "circle",
        cx: 200,
        cy: 200,
        r: 70,
        distractors: [
          "L Shell (n=2) — second shell, holds 8 electrons",
          "M Shell (n=3) — outermost valence shell",
          "Nucleus — contains protons and neutrons"
        ],
        explanation: "The K shell (n=1) is the innermost, lowest-energy shell, completely filled at its maximum capacity of 2 electrons."
      },
      {
        id: "nucleus",
        label: "Nucleus — contains protons and neutrons",
        shapeType: "circle",
        cx: 200,
        cy: 200,
        r: 25,
        distractors: [
          "K Shell (n=1) — innermost shell, holds 2 electrons",
          "L Shell (n=2) — second shell, holds 8 electrons",
          "M Shell (n=3) — outermost valence shell"
        ],
        explanation: "The nucleus holds all of the atom's protons and neutrons - over 99.9% of its mass, packed into a space thousands of times smaller than the electron shells surrounding it."
      }
    ]
  },
  predictionPrompt: "Could an electron settle into a stable orbit exactly halfway between the K shell and the L shell, if given precisely the right amount of energy?",
  predictionPresets: [
    {
      id: "electron-any-distance",
      label: "🌀 Yes - with the right energy input, an electron can stabilize at any distance from the nucleus.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_CONTINUOUS_ORBITS",
      explanation: "Electron shells are quantized - only specific, discrete energy levels are permitted. An electron cannot stably exist at an 'in-between' distance; it must occupy one of the fixed shells (K, L, M...) or transition instantly between them."
    },
    {
      id: "shells-equal-capacity",
      label: "🔢 No - every shell holds the same maximum number of electrons regardless of its distance from the nucleus.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_EQUAL_SHELL_CAPACITY",
      explanation: "Shell capacity increases with distance from the nucleus - K holds 2, L holds 8, M holds up to 18 in general (8 for elements in this range) - they are not all equal."
    },
    {
      id: "shells-quantized-fixed",
      label: "🎯 No - electrons are confined to a fixed set of quantized shells, each with a distinct, non-equal capacity.",
      isMisconception: false,
      explanation: "Correct! Bohr's model quantizes electron energy into discrete shells - no stable 'in-between' state exists, and each shell has its own fixed capacity."
    }
  ],
  experimentFlow: {
    parameters: [
      {
        name: "shellIdentification",
        label: "Shell Identification Progress",
        symbol: "n",
        min: 0,
        max: 4,
        step: 1,
        defaultValue: 0,
        unit: "structures identified"
      }
    ],
    targets: {
      name: "structuresIdentified",
      label: "Full Atomic Map Restoration",
      min: 4,
      max: 4,
      unit: "structures",
      hint: "Click each highlighted ring, starting from the outside in, and select its correct identity from the options shown."
    }
  },
  reflectionPrompts: [
    "Explain why an electron cannot stably exist at a distance exactly between two shells.",
    "Describe what this element's single M-shell electron suggests about its likely chemical behavior.",
    "Why does shell capacity increase with distance from the nucleus rather than staying constant?"
  ],
  commonMisconceptions: [
    {
      id: "MISCONCEPTION_CONTINUOUS_ORBITS",
      name: "Continuous Orbit Fallacy",
      triggerCondition: "predictionPreset === 'electron-any-distance'",
      pedagogicalAction: "Reinforce via the diagram itself that only three discrete shells exist on the scan - no continuum of intermediate orbits is present or possible."
    },
    {
      id: "MISCONCEPTION_EQUAL_SHELL_CAPACITY",
      name: "Equal Shell Capacity Fallacy",
      triggerCondition: "predictionPreset === 'shells-equal-capacity'",
      pedagogicalAction: "Show via the identification challenge that K, L, and M shells hold visibly different electron counts (2, 8, and 1 respectively in this scan)."
    }
  ],
  socraticMentorDialogue: [
    {
      character: "Sir Isaac Newton",
      avatar: "NEWTON",
      introductoryRemark: "Welcome, cadet. What appears at first as a simple planetary diagram conceals a far stranger truth: these shells permit no in-between resting place, no matter how precisely you might try to place an electron there."
    },
    {
      character: "Dr. Richard Feynman",
      avatar: "FEYNMAN",
      introductoryRemark: "Think of it like a staircase, not a ramp. You can stand on any step, but you can't hover in the air between two steps - electrons are exactly that stubborn about which shell they're willing to occupy."
    }
  ],
  successConditions: {
    criteriaText: "All four structures (nucleus, K shell, L shell, M shell) correctly identified, fully restoring the atomic map.",
    rewardXP: 450,
    badgeUnlocked: {
      id: "quantized-atom",
      name: "The Quantized Atom"
    }
  },
  failureBehaviors: {
    impactCraters: false,
    previousTrajectories: false,
    radioTransmissions: [
      "Notice: incorrect identification - review shell capacities and try again.",
      "Alert: scan restoration incomplete - continue identifying remaining structures."
    ]
  },
  worldMemory: {
    persistenceEnabled: true,
    maxMemorySlots: 5
  },
  scientificDiscoveries: [
    {
      id: "quantized-atom",
      title: "The Quantized Atom",
      description: "Electrons are confined to discrete, quantized energy shells with fixed maximum capacities, never resting in the space between them.",
      scientificInsight: "Feynman says: It's a staircase, not a ramp - you can stand on any step, but you can never hover in the gap between two of them."
    }
  ],
  rewards: {
    xp: 450,
    badges: ["quantized-atom"]
  },
  teacherNotes: "This is the first mission built on the new STRUCTURE_EXPLORER engine - a click-to-identify diagram interaction, distinct from PARAMETER_SANDBOX's slider-driven graphs. It renders via a new, self-contained component (StructureExplorerView.tsx) rather than the shared canvas-based MissionActiveView render branches, so it does not yet route through the same PREDICT/EXPERIMENT/REFLECT cognitive loop state or live mentor chat/voice hooks that the other engines use - predictionPrompt, predictionPresets, and experimentFlow are populated for schema completeness and future integration, but are not currently rendered by this engine. The element scanned is Sodium (Na, Z=11, configuration 2,8,1); shell capacities shown (K=2, L=8, M=1-of-8-max-for-this-range) are chemically accurate.",
  assessmentStrategy: "Formative evaluation via direct structure identification - each correct/incorrect selection provides immediate feedback tied to shell capacity rules.",
  accessibilityNotes: "High-contrast dark scanning-grid backdrop with color-coded electron markers (amber for K shell, cyan for L shell, pink for M shell) and clear text labels in the identification panel.",
  unlockConditions: {
    prerequisites: ["stoichiometry"]
  },
  missionDuration: 20,
  difficulty: "Beginner",
  prerequisites: ["stoichiometry"],
  guidedInquiries: [
    { label: "🍎 Ask Newton about the staircase of shells", text: "Why can't an electron settle at a distance between two shells?" },
    { label: "🥁 Ask Feynman about shell capacity", text: "Why does each shell hold a different maximum number of electrons?" }
  ]
};

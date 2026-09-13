/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mission } from "../../types";

export const tensileStressMission: Mission = {
  id: "obsidian-cable-stress-test",
  title: "Stress & Strain: Obsidian Cable Test",
  codename: "OPERATION: GORGE ANCHOR",
  description: "A towering suspension bridge spanning a volcanic gorge is undergoing tectonic stress. Strain-test the obsidian-lattice alloy cables under simulated load, staying as close as possible to their elastic limit without crossing into permanent deformation.",
  objectives: [
    "Discover that stress and strain are linearly related within the elastic region: stress = Young's Modulus × strain.",
    "Identify the elastic limit before the cable enters plastic deformation.",
    "Calibrate applied strain to approach, but not exceed, the alloy's elastic limit."
  ],
  steps: [
    {
      id: "briefing",
      type: "BRIEFING",
      title: "Obsidian Gorge Structural Briefing",
      content: {
        narrative: `### MISSION ADVISORY: TECTONIC LOAD TEST
Below the bridge, rivers of glowing orange lava cut through the Obsidian Gorge. Tectonic shifts are loading the bridge's suspension cables, forged from a proprietary obsidian-lattice alloy.

Within the **elastic region**, stress and strain follow a simple linear law:

$$\\sigma = E \\cdot \\varepsilon$$

where $\\sigma$ is stress (MPa), $\\varepsilon$ is strain (‰, parts per thousand), and $E$ is the alloy's Young's Modulus, **150,000 MPa**.

Push strain past **2.0‰**, and the cable crosses its elastic limit — permanent, plastic deformation follows, and the cable never fully recovers its original length even once the load is removed.

Your task: calibrate applied strain until stress reads between **270 and 300 MPa** — as close to the elastic limit as engineering tolerance allows, without crossing it.`
      }
    },
    {
      id: "dialogue",
      type: "DIALOGUE",
      title: "Gorge Structural Uplink",
      content: {
        dialogue: [
          {
            speaker: "Sir Isaac Newton",
            avatar: "NEWTON",
            message: "Consider the cable not as a single solid thing, but as an immense lattice of atomic springs, each obeying my own law: force proportional to displacement. Stretch gently, and every spring returns home. Stretch too far, and the lattice itself is rearranged, never to return."
          },
          {
            speaker: "Gorge Structural Control",
            avatar: "SYSTEM",
            message: "Cable load telemetry unlocked. Adjust applied strain and observe resulting stress update in real time."
          }
        ]
      }
    },
    {
      id: "sandbox",
      type: "SANDBOX_EXPLORATION",
      title: "Tensile Stress Sandbox",
      content: {
        simulationConfig: {
          simId: "STRESS_STRAIN",
          initialParameters: {
            appliedStrain: 1.0
          },
          minMaxLimits: {
            appliedStrain: [0, 3.0]
          },
          targetFormula: {
            latex: "\\sigma = E \\cdot \\varepsilon = 150{,}000 \\cdot \\varepsilon\\ \\text{MPa}",
            description: "Cable Stress vs. Applied Strain (Elastic Region)",
            variableLabels: {
              "epsilon": "Applied Strain (‰)",
              "sigma": "Stress (MPa)",
              "E": "Young's Modulus (150,000 MPa, fixed)"
            }
          }
        }
      }
    },
    {
      id: "challenge",
      type: "CHALLENGE_EXPERIMENT",
      title: "Elastic-Limit Approach",
      content: {
        challengeQuestion: {
          questionText: "The alloy's elastic limit sits at 2.0‰ strain (300 MPa stress). Calibrate applied strain until stress reads between 270 and 300 MPa - as close to the limit as safety tolerance allows.",
          formulaTrigger: "tensile_stress",
          targetValueRange: {
            min: 270,
            max: 300,
            targetVar: "stress"
          },
          hint: "Stress = 150,000 × strain(‰). A strain near 1.8-2.0‰ lands you in the target band.",
          completionRewardXP: 500
        }
      }
    },
    {
      id: "debrief",
      type: "DEBRIEF",
      title: "Structural Telemetry Debrief",
      content: {
        narrative: `### TARGET SECURED: MAXIMUM SAFE LOAD CALIBRATED
The cable holds firm at the very edge of its elastic capacity, straining under tectonic load without a single atomic bond permanently displaced.

Notice how perfectly linear the relationship stayed throughout the elastic region — double the strain, and stress doubled exactly with it. That straight line is the signature of Hooke's Law, written at engineering scale: an entire suspension cable behaving, in aggregate, like one enormous spring.

**Achievement Unlocked: Hooke's Molecular Spring (ISC Class XI Physics — Mechanical Properties of Solids)**`
      }
    }
  ],

  subject: "Physics",
  chapterName: "Stress & Strain: Properties of Bulk Matter",
  learningObjectives: [
    "Discover that stress and strain are linearly related within the elastic region: stress = Young's Modulus × strain.",
    "Identify the elastic limit before the cable enters plastic deformation.",
    "Calibrate applied strain to approach, but not exceed, the alloy's elastic limit."
  ],
  storyNarrative: "A towering suspension bridge spanning a volcanic gorge is undergoing tectonic stress. Strain-test different material alloys under simulated weight loads - exceed the elastic limit, and the cables undergo plastic deformation and fail.",
  world: {
    environmentName: "The Obsidian Gorge",
    visualAtmosphere: "Jagged Dark Glass Valley & Glowing Orange Lava Rivers",
    audioLandscape: "Groaning steel anchors, distant lava hiss, deep structural creaks"
  },
  coreScientificConcept: {
    name: "Hooke's Law & the Elastic Limit",
    description: "Within the elastic region, stress is directly proportional to strain: σ = Eε, where E (Young's Modulus) is a material property. Beyond the elastic limit, this proportionality breaks down and permanent plastic deformation begins.",
    equationLatex: "\\sigma = E \\cdot \\varepsilon"
  },
  coreInteraction: "PARAMETER_SANDBOX",
  parameterSandboxConfig: {
    relationshipType: "LINEAR",
    primaryParamKey: "appliedStrain",
    outputKey: "stress",
    outputLabel: "Cable Stress",
    outputUnit: "MPa",
    coefficients: {
      a: 150000,
      b: 0
    },
    yRange: {
      min: 0,
      max: 450
    },
    targetBand: {
      min: 270,
      max: 300,
      label: "Maximum Safe Elastic Load"
    },
    formulaDisplayLatex: "\\sigma = 150{,}000 \\cdot \\varepsilon\\ \\text{MPa}\\ (\\varepsilon\\ \\text{in}\\ \\text{\\textperthousand})"
  },
  predictionPrompt: "As applied strain increases from 0 to 2.0‰, will the cable's stress increase in a straight line, or curve as it approaches the elastic limit?",
  predictionPresets: [
    {
      id: "stress-curves-early",
      label: "📈 Stress will curve and level off well before the elastic limit, since materials resist increasing strain.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_STRENGTH_IS_ELASTICITY",
      explanation: "Within the true elastic region, the relationship stays perfectly linear all the way to the elastic limit - the curve only appears once plastic deformation begins, beyond the limit this mission stays within."
    },
    {
      id: "stress-independent-of-area",
      label: "📏 Stress depends only on the applied force, not on the cable's cross-sectional dimensions.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_DIMENSION_INDEPENDENT_STRESS",
      explanation: "Stress is force per unit area (σ = F/A) - a thicker cable under the same force experiences proportionally less stress, since the same force is distributed across more cross-sectional area."
    },
    {
      id: "stress-linear-to-limit",
      label: "🎯 Stress increases in a perfectly straight line with strain, all the way up to the elastic limit.",
      isMisconception: false,
      explanation: "Correct! Hooke's Law holds exactly within the elastic region: σ = Eε is a straight line, with the elastic limit marking where this linear relationship ends."
    }
  ],
  experimentFlow: {
    parameters: [
      {
        name: "appliedStrain",
        label: "Applied Strain (ε)",
        symbol: "ε",
        min: 0,
        max: 3.0,
        step: 0.05,
        defaultValue: 1.0,
        unit: "‰"
      }
    ],
    targets: {
      name: "stress",
      label: "Maximum Safe Load",
      min: 270,
      max: 300,
      unit: "MPa",
      hint: "Bring applied strain close to 1.8-2.0‰ to approach the elastic limit safely."
    }
  },
  reflectionPrompts: [
    "Explain why the stress-strain graph stays perfectly straight within the elastic region, rather than curving.",
    "Describe what would happen to the cable if strain were pushed past 2.0‰, beyond the target band tested in this mission.",
    "Why does a thicker cable of the same material experience less stress under identical applied force?"
  ],
  commonMisconceptions: [
    {
      id: "MISCONCEPTION_STRENGTH_IS_ELASTICITY",
      name: "Strength-Elasticity Confusion",
      triggerCondition: "predictionPreset === 'stress-curves-early'",
      pedagogicalAction: "Show via the sandbox graph that stress rises in a perfectly straight line across the entire elastic region tested, only curving (in real materials) once the elastic limit is exceeded."
    },
    {
      id: "MISCONCEPTION_DIMENSION_INDEPENDENT_STRESS",
      name: "Dimension-Independent Stress Fallacy",
      triggerCondition: "predictionPreset === 'stress-independent-of-area'",
      pedagogicalAction: "Clarify that stress (σ = F/A) explicitly depends on cross-sectional area, distinguishing it from raw applied force."
    }
  ],
  socraticMentorDialogue: [
    {
      character: "Sir Isaac Newton",
      avatar: "NEWTON",
      introductoryRemark: "Welcome, engineer. What you call a solid cable is, at its heart, a lattice of countless atomic springs - each obeying the very law of proportional restoring force I first described in a coiled wire."
    },
    {
      character: "Dr. Richard Feynman",
      avatar: "FEYNMAN",
      introductoryRemark: "Here's the beautiful part: zoom in far enough on any solid material, and you'll find it's basically a bunch of atoms connected by tiny springs. Stretch it a little, they pull back. Stretch it too far, and the springs snap into a new arrangement - permanently."
    }
  ],
  successConditions: {
    criteriaText: "Applied strain calibrated so cable stress falls between 270 and 300 MPa, approaching but not exceeding the elastic limit.",
    rewardXP: 500,
    badgeUnlocked: {
      id: "hookes-molecular-spring",
      name: "Hooke's Molecular Spring"
    }
  },
  failureBehaviors: {
    impactCraters: false,
    previousTrajectories: true,
    radioTransmissions: [
      "Warning: strain approaching elastic limit - plastic deformation imminent above 2.0‰.",
      "Alert: applied load insufficient - cable is not being adequately load-tested."
    ]
  },
  worldMemory: {
    persistenceEnabled: true,
    maxMemorySlots: 5
  },
  scientificDiscoveries: [
    {
      id: "hookes-molecular-spring",
      title: "Hooke's Molecular Spring",
      description: "Solid metals behave, in aggregate, as vast networks of atomic springs obeying F = -kx, giving rise to the macroscopic linear stress-strain relationship within the elastic region.",
      scientificInsight: "Newton says: The restoring force of a single coiled spring and the restoring force of an entire suspension cable differ only in scale, not in kind."
    }
  ],
  rewards: {
    xp: 500,
    badges: ["hookes-molecular-spring"]
  },
  teacherNotes: "This mission uses an exact linear fit: σ = Eε with E = 150,000 MPa maps directly onto the engine's LINEAR relationship type (a·x+b with a=150000, b=0) - genuinely exact within the elastic region being modeled, no approximation needed. The 150,000 MPa figure represents a fictional obsidian-lattice alloy rather than a real-world material, chosen to keep on-screen numbers clean; real structural steel's Young's Modulus is approximately 200,000 MPa.",
  assessmentStrategy: "Formative Socratic evaluation of whether the student distinguishes stress (force per unit area) from raw force, and correctly identifies the linear elastic region.",
  accessibilityNotes: "High-contrast obsidian-black backdrop with glowing orange stress gauge and clear numeric readout of strain and stress values.",
  unlockConditions: {
    prerequisites: ["energy-depths"]
  },
  missionDuration: 20,
  difficulty: "Intermediate",
  prerequisites: ["energy-depths"],
  guidedInquiries: [
    { label: "🍎 Ask Newton about atomic springs", text: "How does a single spring's restoring force relate to an entire cable's stress-strain behavior?" },
    { label: "🥁 Ask Feynman about elastic limits", text: "What actually happens inside a material's atomic lattice once it crosses the elastic limit?" }
  ]
};

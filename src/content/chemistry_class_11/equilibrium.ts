/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mission } from "../../types";

export const equilibriumConstantMission: Mission = {
  id: "equilibrium-constant-calibration",
  title: "Equilibrium: Dynamic Balance Calibration",
  codename: "OPERATION: DYNAMIC BALANCE",
  description: "A reversible A ⇌ B reaction inside a sealed reactor has settled into equilibrium, but sensor drift has left the exact equilibrium constant uncertain. Adjust your concentration hypothesis for [A] until the calculated equilibrium constant matches independent spectroscopic telemetry.",
  objectives: [
    "Discover that the equilibrium constant Kc = [B]/[A] shifts predictably as [A] changes, given fixed total concentration.",
    "Observe that equilibrium is dynamic, not static - forward and reverse reactions continue at equal rates.",
    "Calibrate [A] until the calculated Kc matches the sensor-confirmed value."
  ],
  steps: [
    {
      id: "briefing",
      type: "BRIEFING",
      title: "Dynamic Balance Briefing",
      content: {
        narrative: `### MISSION ADVISORY: EQUILIBRIUM CONSTANT VERIFICATION
A sealed reactor holds a fixed total concentration of **2.0 mol/L**, split between reactant A and product B in a reversible reaction:

$$A \\rightleftharpoons B$$

At equilibrium, the equilibrium constant is:

$$K_c = \\frac{[B]}{[A]} = \\frac{2.0 - [A]}{[A]}$$

Independent spectroscopic sensors have confirmed $K_c$ falls between **3.5 and 4.5** — but a display malfunction has left $[A]$ itself uncertain. Adjust your hypothesis for $[A]$ until the calculated $K_c$ matches sensor telemetry.`
      }
    },
    {
      id: "dialogue",
      type: "DIALOGUE",
      title: "Reactor Equilibrium Uplink",
      content: {
        dialogue: [
          {
            speaker: "Sir Isaac Newton",
            avatar: "NEWTON",
            message: "Do not mistake equilibrium for stillness, cadet. Within that reactor, A converts to B and B reverts to A without pause - equilibrium is not the absence of motion, but a perfect balance between two opposing motions."
          },
          {
            speaker: "Reactor Equilibrium Control",
            avatar: "SYSTEM",
            message: "Concentration hypothesis telemetry unlocked. Adjust [A] and observe calculated equilibrium constant update in real time."
          }
        ]
      }
    },
    {
      id: "sandbox",
      type: "SANDBOX_EXPLORATION",
      title: "Equilibrium Constant Sandbox",
      content: {
        simulationConfig: {
          simId: "EQUILIBRIUM_KC",
          initialParameters: {
            concentrationA: 1.0
          },
          minMaxLimits: {
            concentrationA: [0.1, 1.8]
          },
          targetFormula: {
            latex: "K_c = \\frac{[B]}{[A]} = \\frac{2.0 - [A]}{[A]}",
            description: "Equilibrium Constant vs. Hypothesized [A]",
            variableLabels: {
              "[A]": "Hypothesized Equilibrium Concentration of A (mol/L)",
              "K_c": "Equilibrium Constant",
              "[A]+[B]": "Total Concentration (2.0 mol/L, fixed)"
            }
          }
        }
      }
    },
    {
      id: "challenge",
      type: "CHALLENGE_EXPERIMENT",
      title: "Sensor-Matched Calibration",
      content: {
        challengeQuestion: {
          questionText: "Spectroscopic sensors confirm Kc between 3.5 and 4.5. Adjust your hypothesis for [A] until calculated Kc matches. What is the actual equilibrium concentration of A?",
          formulaTrigger: "equilibrium_kc",
          targetValueRange: {
            min: 3.5,
            max: 4.5,
            targetVar: "equilibriumConstant"
          },
          hint: "Kc = (2.0-[A])/[A]. A concentration near 0.36-0.44 mol/L lands you in the target band.",
          completionRewardXP: 500
        }
      }
    },
    {
      id: "debrief",
      type: "DEBRIEF",
      title: "Equilibrium Telemetry Debrief",
      content: {
        narrative: `### TARGET SECURED: EQUILIBRIUM STATE CONFIRMED
Your hypothesis for [A] now matches independent spectroscopic telemetry precisely. The reactor's true equilibrium state is confirmed: mostly converted to product B, with only a small remaining pool of A.

Notice what this equilibrium constant actually tells you: not that the reaction has stopped, but that it favors product B strongly and consistently. Millions of A molecules are still converting to B, and B molecules reverting to A, every second - but always in that same 4-to-1 ratio, forever balanced.

**Achievement Unlocked: The Dynamic Balance (ISC Class XI Chemistry — Equilibrium)**`
      }
    }
  ],

  subject: "Chemistry",
  chapterName: "Equilibrium: Dynamic Shifts & Le Chatelier's Law",
  learningObjectives: [
    "Discover that the equilibrium constant Kc = [B]/[A] shifts predictably as [A] changes, given fixed total concentration.",
    "Observe that equilibrium is dynamic, not static - forward and reverse reactions continue at equal rates.",
    "Calibrate [A] until the calculated Kc matches the sensor-confirmed value."
  ],
  storyNarrative: "A reversible A ⇌ B reaction inside a sealed reactor has settled into equilibrium, but sensor drift has left the exact equilibrium constant uncertain. Calibrate your concentration hypothesis against independent spectroscopic telemetry.",
  world: {
    environmentName: "Sealed Equilibrium Reactor Bay",
    visualAtmosphere: "Glowing Dual-Chamber Reaction Vessel & Spectroscopic Sensor Arrays",
    audioLandscape: "Low reactor hum, sensor pings, equilibrium gauge oscillation"
  },
  coreScientificConcept: {
    name: "Chemical Equilibrium & the Equilibrium Constant",
    description: "At equilibrium, Kc = [products]/[reactants] describes the ratio at which forward and reverse reaction rates balance. Equilibrium is dynamic - both reactions continue indefinitely at equal rates, not a static endpoint.",
    equationLatex: "K_c = \\frac{[B]}{[A]}"
  },
  coreInteraction: "PARAMETER_SANDBOX",
  parameterSandboxConfig: {
    relationshipType: "INVERSE",
    primaryParamKey: "concentrationA",
    outputKey: "equilibriumConstant",
    outputLabel: "Calculated Equilibrium Constant",
    outputUnit: "",
    coefficients: {
      a: 2.0,
      b: 0,
      c: -1
    },
    yRange: {
      min: 0,
      max: 20
    },
    targetBand: {
      min: 3.5,
      max: 4.5,
      label: "Sensor-Confirmed Kc Band"
    },
    formulaDisplayLatex: "K_c = \\frac{2.0}{[A]} - 1"
  },
  predictionPrompt: "Once this reaction reaches equilibrium, do the forward (A→B) and reverse (B→A) reactions stop, or do they continue?",
  predictionPresets: [
    {
      id: "equilibrium-reactions-stop",
      label: "🛑 Both reactions stop completely once equilibrium is reached.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_EQUILIBRIUM_IS_STATIC",
      explanation: "Equilibrium is dynamic, not static - both the forward and reverse reactions continue indefinitely, but at precisely equal rates, so concentrations no longer change even though molecules keep converting back and forth."
    },
    {
      id: "kc-independent-of-concentration",
      label: "🔢 The equilibrium constant Kc depends on the total amount of substance placed in the reactor.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_KC_DEPENDS_ON_TOTAL",
      explanation: "Kc is a fixed ratio for a given reaction at a given temperature - it does not depend on the starting amounts, only on the proportions reached once equilibrium is established."
    },
    {
      id: "equilibrium-dynamic-balance",
      label: "🎯 Both reactions continue indefinitely at equal rates, keeping concentrations constant despite ongoing conversion.",
      isMisconception: false,
      explanation: "Correct! Equilibrium is a dynamic balance - forward and reverse reaction rates become equal, not zero, so the system appears static while remaining chemically active."
    }
  ],
  experimentFlow: {
    parameters: [
      {
        name: "concentrationA",
        label: "Hypothesized [A]",
        symbol: "[A]",
        min: 0.1,
        max: 1.8,
        step: 0.02,
        defaultValue: 1.0,
        unit: "mol/L"
      }
    ],
    targets: {
      name: "equilibriumConstant",
      label: "Sensor-Confirmed Kc",
      min: 3.5,
      max: 4.5,
      unit: "",
      hint: "Bring your [A] hypothesis close to 0.36-0.44 mol/L to match sensor-confirmed Kc."
    }
  },
  reflectionPrompts: [
    "Explain why an equilibrium mixture can appear unchanging while both the forward and reverse reactions continue.",
    "Describe what a Kc value much greater than 1 tells you about which side of the reaction is favored.",
    "How would adding more A to the sealed reactor, per Le Chatelier's principle, affect the new equilibrium position?"
  ],
  commonMisconceptions: [
    {
      id: "MISCONCEPTION_EQUILIBRIUM_IS_STATIC",
      name: "Static Equilibrium Fallacy",
      triggerCondition: "predictionPreset === 'equilibrium-reactions-stop'",
      pedagogicalAction: "Clarify that equilibrium is dynamic - reinforced narratively in the debrief and mentor dialogue emphasizing continuous forward/reverse conversion at equal rates."
    },
    {
      id: "MISCONCEPTION_KC_DEPENDS_ON_TOTAL",
      name: "Total-Amount-Dependent Kc Fallacy",
      triggerCondition: "predictionPreset === 'kc-independent-of-concentration'",
      pedagogicalAction: "Clarify that Kc is a ratio determined by the reaction and temperature alone, not the initial quantities placed in the reactor."
    }
  ],
  socraticMentorDialogue: [
    {
      character: "Sir Isaac Newton",
      avatar: "NEWTON",
      introductoryRemark: "Welcome, cadet. What appears still to the eye may yet be in perpetual motion - two opposing currents, each canceling the other's visible effect while never truly ceasing."
    },
    {
      character: "Dr. Richard Feynman",
      avatar: "FEYNMAN",
      introductoryRemark: "Picture two crowds trading places through a doorway at exactly the same rate - the room counts never change, but nobody's actually standing still. That's your equilibrium."
    }
  ],
  successConditions: {
    criteriaText: "Concentration hypothesis for [A] calibrated so calculated Kc falls between 3.5 and 4.5, matching sensor telemetry.",
    rewardXP: 500,
    badgeUnlocked: {
      id: "dynamic-balance",
      name: "The Dynamic Balance"
    }
  },
  failureBehaviors: {
    impactCraters: false,
    previousTrajectories: true,
    radioTransmissions: [
      "Warning: calculated Kc does not match sensor telemetry - hypothesis concentration incorrect.",
      "Alert: equilibrium calibration inconclusive - refine [A] hypothesis and retry."
    ]
  },
  worldMemory: {
    persistenceEnabled: true,
    maxMemorySlots: 5
  },
  scientificDiscoveries: [
    {
      id: "dynamic-balance",
      title: "The Dynamic Balance",
      description: "Chemical equilibrium is a dynamic state where forward and reverse reactions proceed at equal, non-zero rates, not a static endpoint where reactions cease.",
      scientificInsight: "Feynman says: Two crowds trading places through the same door at the same rate - the count in each room never changes, but nothing has stopped moving."
    }
  ],
  rewards: {
    xp: 500,
    badges: ["dynamic-balance"]
  },
  teacherNotes: "This mission uses an exact fit: Kc = (2.0-[A])/[A] = 2.0/[A] - 1 maps directly onto the engine's INVERSE relationship type (a/(x+b)+c with a=2.0, b=0, c=-1) - genuinely exact algebraic rearrangement, no approximation needed.",
  assessmentStrategy: "Formative Socratic evaluation of whether the student understands equilibrium as dynamic rather than static, and correctly interprets Kc as reaction-favoring ratio.",
  accessibilityNotes: "High-contrast dual-chamber reactor backdrop with clear numeric readout of concentration hypothesis and calculated Kc.",
  unlockConditions: {
    prerequisites: ["chemical-thermodynamics"]
  },
  missionDuration: 25,
  difficulty: "Advanced",
  prerequisites: ["chemical-thermodynamics"],
  guidedInquiries: [
    { label: "🍎 Ask Newton about hidden motion", text: "How can a system appear unchanging while chemical reactions continue inside it?" },
    { label: "🥁 Ask Feynman about the trading crowds", text: "Why is the crowds-through-a-doorway analogy a good way to picture chemical equilibrium?" }
  ]
};

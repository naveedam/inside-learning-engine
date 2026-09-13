/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mission } from "../../types";

export const atmosphericVentingMission: Mission = {
  id: "atmospheric-venting-calibration",
  title: "States of Matter: Atmospheric Venting",
  codename: "OPERATION: PRESSURE CHAMBER",
  description: "A planetary atmospheric processing chamber holds a fixed molar sample of gas at controlled temperature. Adjust chamber volume to bring pressure to the exact level required for safe venting to the surface.",
  objectives: [
    "Discover that pressure and volume are inversely related at fixed temperature and moles (Boyle's Law, a special case of the Ideal Gas Law).",
    "Observe that PV = nRT governs the relationship between all four state variables.",
    "Calibrate chamber volume to reach the target safe venting pressure."
  ],
  steps: [
    {
      id: "briefing",
      type: "BRIEFING",
      title: "Atmospheric Chamber Briefing",
      content: {
        narrative: `### MISSION ADVISORY: VENTING PRESSURE CALIBRATION
The processing chamber holds exactly **1 mole** of gas at a controlled **300 K**. Before venting to the thin planetary surface atmosphere, chamber pressure must be brought to a precise safe level.

The Ideal Gas Law governs the relationship between pressure, volume, moles, and temperature:

$$PV = nRT$$

With $n$ and $T$ held fixed, pressure and volume trade off directly: shrink the chamber, and pressure climbs; expand it, and pressure falls.

Your task: adjust chamber volume until pressure reads between **4.5 and 5.5 atm** — the certified safe venting range.`
      }
    },
    {
      id: "dialogue",
      type: "DIALOGUE",
      title: "Processing Chamber Uplink",
      content: {
        dialogue: [
          {
            speaker: "Sir Isaac Newton",
            avatar: "NEWTON",
            message: "Consider the gas within as countless particles, each striking the chamber walls in ceaseless bombardment. Shrink the walls inward, and those same particles strike more often, in less space, less time between each collision - and pressure is nothing more than the sum of that battering."
          },
          {
            speaker: "Chamber Control",
            avatar: "SYSTEM",
            message: "Volume calibration telemetry unlocked. Adjust chamber volume and observe pressure update in real time."
          }
        ]
      }
    },
    {
      id: "sandbox",
      type: "SANDBOX_EXPLORATION",
      title: "Pressure-Volume Sandbox",
      content: {
        simulationConfig: {
          simId: "IDEAL_GAS_PV",
          initialParameters: {
            chamberVolume: 8
          },
          minMaxLimits: {
            chamberVolume: [1, 10]
          },
          targetFormula: {
            latex: "P = \\frac{nRT}{V} = \\frac{24.63}{V}\\ \\text{atm}",
            description: "Chamber Pressure vs. Chamber Volume (n = 1 mol, T = 300 K, fixed)",
            variableLabels: {
              "V": "Chamber Volume (L)",
              "P": "Chamber Pressure (atm)",
              "n,T": "Moles and Temperature (fixed)"
            }
          }
        }
      }
    },
    {
      id: "challenge",
      type: "CHALLENGE_EXPERIMENT",
      title: "Safe Venting Calibration",
      content: {
        challengeQuestion: {
          questionText: "Adjust chamber volume until pressure reads between 4.5 and 5.5 atm - the certified safe venting range. What volume achieves this?",
          formulaTrigger: "ideal_gas_pv",
          targetValueRange: {
            min: 4.5,
            max: 5.5,
            targetVar: "pressure"
          },
          hint: "Pressure = 24.63/V. A chamber volume near 4.5-5.5 L lands you in the target band.",
          completionRewardXP: 500
        }
      }
    },
    {
      id: "debrief",
      type: "DEBRIEF",
      title: "Venting Telemetry Debrief",
      content: {
        narrative: `### TARGET SECURED: SAFE VENTING PRESSURE ACHIEVED
Chamber pressure locks into the safe venting range. The airlock cycles open, releasing gas smoothly into the planetary atmosphere.

Notice the shape of what you just calibrated: double the volume, and pressure fell by exactly half. Halve it again, and pressure doubled again. That perfect inverse relationship - discovered by Robert Boyle centuries before anyone knew what a gas molecule even was - still governs every pressurized chamber built today.

**Achievement Unlocked: Boyle's Inverse Law (ISC Class XI Chemistry — States of Matter)**`
      }
    }
  ],

  subject: "Chemistry",
  chapterName: "States of Matter: Planetary Gases & Intermolecular Fields",
  learningObjectives: [
    "Discover that pressure and volume are inversely related at fixed temperature and moles (Boyle's Law, a special case of the Ideal Gas Law).",
    "Observe that PV = nRT governs the relationship between all four state variables.",
    "Calibrate chamber volume to reach the target safe venting pressure."
  ],
  storyNarrative: "A planetary atmospheric processing chamber holds a fixed molar sample of gas. Adjust chamber volume to bring pressure to the exact level required for safe venting to the surface atmosphere.",
  world: {
    environmentName: "Planetary Atmospheric Processing Facility",
    visualAtmosphere: "Sealed Gas Chambers & Pressurized Venting Ducts",
    audioLandscape: "Hissing pressure valves, mechanical chamber hum, venting airlock cycles"
  },
  coreScientificConcept: {
    name: "The Ideal Gas Law & Boyle's Law",
    description: "PV = nRT relates pressure, volume, moles, and temperature. Holding n and T fixed, PV = constant - pressure and volume vary inversely, a relationship first observed by Robert Boyle.",
    equationLatex: "PV = nRT"
  },
  coreInteraction: "PARAMETER_SANDBOX",
  parameterSandboxConfig: {
    relationshipType: "INVERSE",
    primaryParamKey: "chamberVolume",
    outputKey: "pressure",
    outputLabel: "Chamber Pressure",
    outputUnit: "atm",
    coefficients: {
      a: 24.63,
      b: 0,
      c: 0
    },
    yRange: {
      min: 2,
      max: 28
    },
    targetBand: {
      min: 4.5,
      max: 5.5,
      label: "Certified Safe Venting Range"
    },
    formulaDisplayLatex: "P = \\frac{24.63}{V}\\ \\text{atm}"
  },
  predictionPrompt: "As chamber volume is reduced, what happens to gas pressure - and does the relationship change if temperature and moles stay fixed throughout?",
  predictionPresets: [
    {
      id: "pressure-volume-independent",
      label: "➡️ Pressure stays roughly constant regardless of volume, as long as the same gas sample remains inside.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_PV_INDEPENDENT",
      explanation: "Pressure changes substantially and predictably with volume - shrink the chamber, and the same number of particles collide with the walls far more frequently, raising pressure."
    },
    {
      id: "pressure-volume-linear",
      label: "📉 Pressure decreases in a straight line as volume increases.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_PV_LINEAR",
      explanation: "The relationship is inverse, not linear - doubling volume doesn't subtract a fixed amount from pressure, it halves it, producing a curve rather than a straight line."
    },
    {
      id: "pressure-volume-inverse",
      label: "🎯 Pressure and volume are inversely related - doubling volume halves pressure, at fixed temperature and moles.",
      isMisconception: false,
      explanation: "Correct! This is Boyle's Law: PV = constant at fixed n and T, meaning pressure and volume are inversely proportional."
    }
  ],
  experimentFlow: {
    parameters: [
      {
        name: "chamberVolume",
        label: "Chamber Volume (V)",
        symbol: "V",
        min: 1,
        max: 10,
        step: 0.1,
        defaultValue: 8,
        unit: "L"
      }
    ],
    targets: {
      name: "pressure",
      label: "Safe Venting Pressure",
      min: 4.5,
      max: 5.5,
      unit: "atm",
      hint: "Bring chamber volume close to 4.5-5.5 L to land pressure in the safe venting range."
    }
  },
  reflectionPrompts: [
    "Explain why halving chamber volume doubles pressure, using the idea of particle collision frequency.",
    "Describe what would happen to pressure if temperature were also increased while volume stayed fixed.",
    "Why is Boyle's Law considered a special case of the Ideal Gas Law rather than an entirely separate law?"
  ],
  commonMisconceptions: [
    {
      id: "MISCONCEPTION_PV_INDEPENDENT",
      name: "Pressure-Volume Independence Fallacy",
      triggerCondition: "predictionPreset === 'pressure-volume-independent'",
      pedagogicalAction: "Demonstrate via the live graph that pressure changes substantially and predictably as chamber volume is adjusted across its full range."
    },
    {
      id: "MISCONCEPTION_PV_LINEAR",
      name: "Linear Pressure-Volume Fallacy",
      triggerCondition: "predictionPreset === 'pressure-volume-linear'",
      pedagogicalAction: "Show that the pressure-volume curve is distinctly non-linear - it falls steeply at small volumes and flattens at large volumes, the signature of an inverse relationship."
    }
  ],
  socraticMentorDialogue: [
    {
      character: "Sir Isaac Newton",
      avatar: "NEWTON",
      introductoryRemark: "Welcome, cadet. What you perceive as a single force called pressure is, at its heart, nothing more than the accumulated impact of countless tiny collisions - each obeying the very laws of motion I set down centuries ago."
    },
    {
      character: "Dr. Richard Feynman",
      avatar: "FEYNMAN",
      introductoryRemark: "Think of it like a room full of ping-pong balls bouncing off the walls. Shrink the room, and the balls hit the walls way more often - that's pressure going up, plain and simple."
    }
  ],
  successConditions: {
    criteriaText: "Chamber volume calibrated so pressure falls between 4.5 and 5.5 atm, within the certified safe venting range.",
    rewardXP: 500,
    badgeUnlocked: {
      id: "boyles-inverse-law",
      name: "Boyle's Inverse Law"
    }
  },
  failureBehaviors: {
    impactCraters: false,
    previousTrajectories: true,
    radioTransmissions: [
      "Warning: chamber pressure exceeds safe venting threshold.",
      "Alert: chamber pressure insufficient for venting cycle initiation."
    ]
  },
  worldMemory: {
    persistenceEnabled: true,
    maxMemorySlots: 5
  },
  scientificDiscoveries: [
    {
      id: "boyles-inverse-law",
      title: "Boyle's Inverse Law",
      description: "At fixed temperature and moles, pressure and volume are inversely proportional - a foundational relationship within the broader Ideal Gas Law.",
      scientificInsight: "Newton says: A gas exerts pressure through the sum of countless individual collisions - compress its container, and those collisions simply happen more often."
    }
  ],
  rewards: {
    xp: 500,
    badges: ["boyles-inverse-law"]
  },
  teacherNotes: "This mission uses an exact fit: P = nRT/V with n=1 mol, T=300K, R=0.0821 L*atm/(mol*K) gives P = 24.63/V atm, mapping directly onto the engine's INVERSE relationship type (a/(x+b)+c with a=24.63, b=0, c=0) - genuinely exact, no approximation needed, since Boyle's Law really is a pure inverse relationship.",
  assessmentStrategy: "Formative Socratic evaluation of whether the student correctly identifies the inverse (not linear or independent) relationship between pressure and volume.",
  accessibilityNotes: "High-contrast industrial chamber backdrop with clear numeric readout of volume and pressure values.",
  unlockConditions: {
    prerequisites: ["stoichiometry"]
  },
  missionDuration: 20,
  difficulty: "Beginner",
  prerequisites: ["stoichiometry"],
  guidedInquiries: [
    { label: "🍎 Ask Newton about collision pressure", text: "How does pressure emerge from countless individual particle collisions?" },
    { label: "🥁 Ask Feynman about the ping-pong analogy", text: "Why does shrinking a container's volume make pressure rise so predictably?" }
  ]
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mission } from "../../types";

export const gasIdentificationMission: Mission = {
  id: "gas-leak-identification",
  title: "Kinetic Swarms: Gas Leak Identification",
  codename: "OPERATION: LIFE SUPPORT DIAGNOSTIC",
  description: "A leak has occurred in a life-support gas tank on a space cruiser. Identify the escaping gas by its molecular speed distribution - adjust the molar mass hypothesis until the predicted RMS speed matches the sensor reading.",
  objectives: [
    "Discover that RMS molecular speed depends on molar mass: heavier molecules move slower at the same temperature.",
    "Observe that average kinetic energy depends only on temperature, never on molar mass.",
    "Identify the leaking gas by matching predicted RMS speed to sensor telemetry."
  ],
  steps: [
    {
      id: "briefing",
      type: "BRIEFING",
      title: "Life Support Diagnostic Briefing",
      content: {
        narrative: `### MISSION ADVISORY: UNKNOWN GAS LEAK
Cold steam vents from a burst valve on the Life Support Engineering Deck. Sensors have picked up an escaping gas at a fixed cabin temperature of **300 K**, with a measured RMS molecular speed — but the gas identity itself is unknown.

At a fixed temperature, RMS molecular speed depends on molar mass:

$$v_{rms} = \\sqrt{\\frac{3RT}{M}}$$

Heavier molecules move slower at the same temperature — but critically, their **average kinetic energy** stays identical to lighter molecules', since $K_{avg} = \\frac{3}{2}k_BT$ depends only on temperature, never on mass.

Your task: adjust your molar mass hypothesis until predicted RMS speed matches the sensor reading of **500–535 m/s**, identifying the leaking gas.`
      }
    },
    {
      id: "dialogue",
      type: "DIALOGUE",
      title: "Engineering Deck Uplink",
      content: {
        dialogue: [
          {
            speaker: "Dr. Richard Feynman",
            avatar: "FEYNMAN",
            message: "Here's the surprising part: heat up a mix of light helium and heavy carbon dioxide together, and they end up with the exact same average kinetic energy - not the same speed, the same energy! The light ones just have to move a lot faster to carry that same punch."
          },
          {
            speaker: "Life Support Diagnostic",
            avatar: "SYSTEM",
            message: "Molar mass hypothesis telemetry unlocked. Adjust your hypothesis and observe predicted RMS speed update in real time."
          }
        ]
      }
    },
    {
      id: "sandbox",
      type: "SANDBOX_EXPLORATION",
      title: "Molecular Speed Sandbox",
      content: {
        simulationConfig: {
          simId: "KINETIC_RMS_SPEED",
          initialParameters: {
            molarMassHypothesis: 40
          },
          minMaxLimits: {
            molarMassHypothesis: [16, 44]
          },
          targetFormula: {
            latex: "v_{rms} = \\sqrt{\\frac{3RT}{M}}\\ \\approx\\ \\frac{14{,}476}{M}\\ \\text{m/s (fitted near the target gas)}",
            description: "Predicted RMS Speed vs. Molar Mass Hypothesis (T = 300 K, fixed)",
            variableLabels: {
              "M": "Molar Mass Hypothesis (g/mol)",
              "v_rms": "Predicted RMS Speed (m/s)",
              "T": "Cabin Temperature (300 K, fixed)"
            }
          }
        }
      }
    },
    {
      id: "challenge",
      type: "CHALLENGE_EXPERIMENT",
      title: "Gas Identification",
      content: {
        challengeQuestion: {
          questionText: "Sensor telemetry reads an RMS speed of 500-535 m/s. Adjust your molar mass hypothesis until predicted RMS speed matches. Which gas is leaking - Methane (16 g/mol), Nitrogen (28 g/mol), or Carbon Dioxide (44 g/mol)?",
          formulaTrigger: "kinetic_rms",
          targetValueRange: {
            min: 500,
            max: 535,
            targetVar: "rmsSpeed"
          },
          hint: "Predicted speed falls as molar mass increases. A hypothesis near 27-29 g/mol lands you in the target band.",
          completionRewardXP: 500
        }
      }
    },
    {
      id: "debrief",
      type: "DEBRIEF",
      title: "Diagnostic Debrief",
      content: {
        narrative: `### TARGET SECURED: LEAK IDENTIFIED AS NITROGEN
Sensor telemetry confirms it: the escaping gas is nitrogen, molar mass 28 g/mol, matching the predicted RMS speed precisely.

Notice what stayed hidden throughout this diagnosis: every gas in that cabin — light or heavy — carried the exact same average kinetic energy at 300 K. Only their speeds differed, because moving slower is how a heavier molecule carries the same thermal punch as a lighter, faster one.

**Achievement Unlocked: Boltzmann's Statistical Dance (ISC Class XI Physics — Kinetic Theory)**`
      }
    }
  ],

  subject: "Physics",
  chapterName: "Kinetic Swarms: Behavior of Gases",
  learningObjectives: [
    "Discover that RMS molecular speed depends on molar mass: heavier molecules move slower at the same temperature.",
    "Observe that average kinetic energy depends only on temperature, never on molar mass.",
    "Identify the leaking gas by matching predicted RMS speed to sensor telemetry."
  ],
  storyNarrative: "A leak has occurred in a life-support gas tank on a space cruiser. Identify the gas composition based on the molecular speed distributions of escape particles.",
  world: {
    environmentName: "Life Support Engineering Deck",
    visualAtmosphere: "Sterile White Walls, Warning Lights & Cold Venting Steam",
    audioLandscape: "Hissing steam valves, warning klaxons, holographic collision hum"
  },
  coreScientificConcept: {
    name: "Kinetic Theory of Gases & RMS Molecular Speed",
    description: "RMS molecular speed v_rms = sqrt(3RT/M) depends on both temperature and molar mass. Critically, average kinetic energy K_avg = (3/2)k_BT depends only on temperature - heavier molecules simply move slower to carry the same average energy as lighter ones.",
    equationLatex: "v_{rms} = \\sqrt{\\frac{3RT}{M}}"
  },
  coreInteraction: "PARAMETER_SANDBOX",
  parameterSandboxConfig: {
    relationshipType: "INVERSE",
    primaryParamKey: "molarMassHypothesis",
    outputKey: "rmsSpeed",
    outputLabel: "Predicted RMS Speed",
    outputUnit: "m/s",
    coefficients: {
      a: 14476,
      b: 0,
      c: 0
    },
    yRange: {
      min: 250,
      max: 950
    },
    targetBand: {
      min: 500,
      max: 535,
      label: "Sensor-Matched Speed Band"
    },
    formulaDisplayLatex: "v_{rms} \\approx \\frac{14{,}476}{M}\\ \\text{m/s}"
  },
  predictionPrompt: "If you heat a container of mixed light Helium atoms and heavy Carbon Dioxide molecules to the same temperature, which will have the higher average kinetic energy? Which will move faster?",
  predictionPresets: [
    {
      id: "heavy-gas-more-ke",
      label: "⚖️ Heavier Carbon Dioxide molecules will have both higher average kinetic energy and higher speed.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_HEAVY_GAS_HAS_MORE_KE",
      explanation: "Average kinetic energy K_avg = (3/2)k_BT depends only on temperature, not mass - at the same temperature, both light Helium and heavy Carbon Dioxide carry identical average kinetic energy."
    },
    {
      id: "cold-gas-uniform-speed",
      label: "🧊 Cooling a gas slows all its molecules down to roughly the same uniform speed.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_COLD_IS_SLOW_STATIC",
      explanation: "Cooling shifts the entire statistical speed distribution downward, but molecules still move at a wide range of individual speeds - there is no single uniform speed, even at lower temperature."
    },
    {
      id: "equal-ke-different-speed",
      label: "🎯 Both gases share the same average kinetic energy, but the lighter Helium atoms move faster.",
      isMisconception: false,
      explanation: "Correct! K_avg depends only on temperature and is identical for both gases - but since K_avg = ½Mv², the lighter Helium must move faster to carry that same energy."
    }
  ],
  experimentFlow: {
    parameters: [
      {
        name: "molarMassHypothesis",
        label: "Molar Mass Hypothesis (M)",
        symbol: "M",
        min: 16,
        max: 44,
        step: 0.5,
        defaultValue: 40,
        unit: "g/mol"
      }
    ],
    targets: {
      name: "rmsSpeed",
      label: "Sensor-Matched RMS Speed",
      min: 500,
      max: 535,
      unit: "m/s",
      hint: "Bring your molar mass hypothesis close to 27-29 g/mol to match sensor telemetry."
    }
  },
  reflectionPrompts: [
    "Explain why average kinetic energy stays identical across gases of different molar mass at the same temperature.",
    "Describe how you would distinguish between Methane (16 g/mol) and Carbon Dioxide (44 g/mol) using RMS speed sensor data alone.",
    "Why does cooling a gas shift its entire speed distribution, rather than slowing every molecule to a single common speed?"
  ],
  commonMisconceptions: [
    {
      id: "MISCONCEPTION_HEAVY_GAS_HAS_MORE_KE",
      name: "Heavy-Gas-More-Energy Fallacy",
      triggerCondition: "predictionPreset === 'heavy-gas-more-ke'",
      pedagogicalAction: "Clarify that K_avg = (3/2)k_BT depends solely on temperature - demonstrate that a light and heavy gas at the same temperature carry identical average kinetic energy despite very different RMS speeds."
    },
    {
      id: "MISCONCEPTION_COLD_IS_SLOW_STATIC",
      name: "Uniform-Slow-Speed Fallacy",
      triggerCondition: "predictionPreset === 'cold-gas-uniform-speed'",
      pedagogicalAction: "Explain that cooling shifts the Maxwell-Boltzmann distribution as a whole, not toward a single uniform speed - molecules continue to exhibit a spread of speeds at any temperature."
    }
  ],
  socraticMentorDialogue: [
    {
      character: "Dr. Richard Feynman",
      avatar: "FEYNMAN",
      introductoryRemark: "Welcome to the engineering deck! Here's a puzzle: how do you tell two invisible gases apart just from how fast their molecules zip around? Let's use the numbers to do some real detective work."
    },
    {
      character: "Sir Isaac Newton",
      avatar: "NEWTON",
      introductoryRemark: "Consider, cadet: kinetic energy is but half the mass times the square of speed. If two bodies share equal energy yet differ vastly in mass, their speeds cannot possibly be equal."
    }
  ],
  successConditions: {
    criteriaText: "Molar mass hypothesis calibrated so predicted RMS speed falls between 500 and 535 m/s, correctly identifying the leaking gas as Nitrogen.",
    rewardXP: 500,
    badgeUnlocked: {
      id: "boltzmanns-statistical-dance",
      name: "Boltzmann's Statistical Dance"
    }
  },
  failureBehaviors: {
    impactCraters: false,
    previousTrajectories: true,
    radioTransmissions: [
      "Warning: predicted speed does not match sensor telemetry - hypothesis mass incorrect.",
      "Alert: diagnostic inconclusive - refine molar mass hypothesis and retry."
    ]
  },
  worldMemory: {
    persistenceEnabled: true,
    maxMemorySlots: 5
  },
  scientificDiscoveries: [
    {
      id: "boltzmanns-statistical-dance",
      title: "Boltzmann's Statistical Dance",
      description: "Temperature is not a uniform speed, but a collective statistical spread of microscopic kinetic energies, identical in average across gases of any molar mass.",
      scientificInsight: "Feynman says: Light Helium spheres zip around like frantic fireflies while massive Carbon Dioxide blocks lumber along slowly - yet both carry the exact same average thermal punch."
    }
  ],
  rewards: {
    xp: 500,
    badges: ["boltzmanns-statistical-dance"]
  },
  teacherNotes: "IMPORTANT APPROXIMATION NOTE: the true relationship v_rms = sqrt(3RT/M) is a square-root (power -0.5) function of M, but the PARAMETER_SANDBOX engine only supports LINEAR/QUADRATIC/INVERSE/EXPONENTIAL/RATE_LIMITED curve types - none represent a square root exactly. This mission uses INVERSE (a/M) fitted to be EXACT at the target gas (M=28g/mol Nitrogen, v_rms=517m/s, using a=14476). Real v_rms values at the domain extremes: M=16 (Methane) gives a true v_rms of about 684 m/s, but the fitted curve shows about 905 m/s (~32% high); M=44 (CO2) gives a true v_rms of about 412 m/s, but the fitted curve shows about 329 m/s (~20% low). The core lesson - mass-independence of average kinetic energy and the qualitative inverse relationship between mass and speed - remains valid and testable regardless of this curve-fit imprecision, but be aware the exact numeric curve shown will diverge from a real Maxwell-Boltzmann calculation away from the Nitrogen target point.",
  assessmentStrategy: "Formative Socratic evaluation of whether the student separates average kinetic energy (mass-independent) from RMS speed (mass-dependent).",
  accessibilityNotes: "High-contrast sterile white backdrop with glowing molecular collision holograms and clear numeric readout of molar mass and predicted speed.",
  unlockConditions: {
    prerequisites: ["energy-depths", "thermodynamics"]
  },
  missionDuration: 20,
  difficulty: "Intermediate",
  prerequisites: ["energy-depths", "thermodynamics"],
  guidedInquiries: [
    { label: "🥁 Ask Feynman about the fireflies and blocks", text: "How can two gases carry the same average kinetic energy while moving at such different speeds?" },
    { label: "🍎 Ask Newton about the energy-speed relationship", text: "How does the kinetic energy formula explain why heavier molecules must move slower?" }
  ]
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mission } from "../../types";

export const venturiNavigationMission: Mission = {
  id: "venturi-vent-navigation",
  title: "Fluid Currents: Venturi Vent Navigation",
  codename: "OPERATION: HYDROTHERMAL THROAT",
  description: "A deep-sea geothermal valve is leaking. Guide a miniature repair sub through a narrow, variable-width vent pipe by tracking pressure drops - accelerate the flow too much, and the plunging pressure will pull the sub off course into the volcanic exhaust.",
  objectives: [
    "Discover that fluid pressure drops as flow speed increases, resolving the Venturi paradox.",
    "Observe the quadratic relationship between throat velocity and pressure change (Bernoulli's principle).",
    "Navigate the sub by keeping throat pressure within a safe operating band."
  ],
  steps: [
    {
      id: "briefing",
      type: "BRIEFING",
      title: "Hydrothermal Vent Navigation Briefing",
      content: {
        narrative: `### MISSION ADVISORY: NARROW THROAT TRANSIT
Pitch-black seawater surrounds us, lit only by roaring white-smoker geysers and our sub's own headlights. A leaking geothermal valve has narrowed a critical vent pipe's throat, and our miniature repair sub must pass through.

Along a single streamline, Bernoulli's principle holds:

$$P + \\frac{1}{2}\\rho v^2 = \\text{constant}$$

At the wide upstream section, water flows at a gentle **2 m/s**, with ambient pressure of **252 kPa**. As the throat narrows, the water must accelerate to conserve flow — and as it speeds up, static pressure *drops*.

Push the throat velocity too high, and pressure plunges dangerously low, risking the sub being pulled toward the volcanic exhaust. Your task: navigate the throat velocity to keep static pressure within the safe transit band of **205–215 kPa**.`
      }
    },
    {
      id: "dialogue",
      type: "DIALOGUE",
      title: "Hydrothermal Uplink",
      content: {
        dialogue: [
          {
            speaker: "Dr. Richard Feynman",
            avatar: "FEYNMAN",
            message: "Here's a fun paradox: you'd think squeezing water into a narrower pipe would squeeze up the pressure, right? Nope! It squeezes up the speed instead, and the pressure actually drops. Energy has to go somewhere - if it's not going into extra pressure, it's going into extra kinetic energy of motion."
          },
          {
            speaker: "Vent Navigation Control",
            avatar: "SYSTEM",
            message: "Flow telemetry unlocked. Adjust throat velocity and observe static pressure update in real time."
          }
        ]
      }
    },
    {
      id: "sandbox",
      type: "SANDBOX_EXPLORATION",
      title: "Venturi Flow Sandbox",
      content: {
        simulationConfig: {
          simId: "VENTURI_PRESSURE",
          initialParameters: {
            throatVelocity: 3
          },
          minMaxLimits: {
            throatVelocity: [2, 10]
          },
          targetFormula: {
            latex: "P_2 = P_1 + \\frac{1}{2}\\rho(v_1^2 - v_2^2) = 252 - 0.5 v_2^2\\ \\text{kPa}",
            description: "Throat Static Pressure vs. Throat Velocity",
            variableLabels: {
              "v_2": "Throat Velocity (m/s)",
              "P_2": "Throat Static Pressure (kPa)",
              "rho": "Seawater Density (1000 kg/m³, fixed)"
            }
          }
        }
      }
    },
    {
      id: "challenge",
      type: "CHALLENGE_EXPERIMENT",
      title: "Safe Throat Transit",
      content: {
        challengeQuestion: {
          questionText: "Navigate the sub through the throat by keeping static pressure between 205 and 215 kPa - fast enough to make progress, slow enough to avoid the exhaust pull. What throat velocity achieves this?",
          formulaTrigger: "venturi_pressure",
          targetValueRange: {
            min: 205,
            max: 215,
            targetVar: "throatPressure"
          },
          hint: "Pressure falls as velocity² grows. A throat velocity near 8.6-9.7 m/s lands you in the safe band.",
          completionRewardXP: 500
        }
      }
    },
    {
      id: "debrief",
      type: "DEBRIEF",
      title: "Vent Transit Debrief",
      content: {
        narrative: `### TARGET SECURED: SAFE THROAT TRANSIT
The sub threads the narrow throat, headlights catching glowing flow-indicator particles as they accelerate past, pressure gauges holding steady within the safe band.

Notice the paradox you just resolved: speeding up the water didn't raise the pressure, it lowered it. Every joule of energy that went into extra kinetic energy of motion had to come from somewhere else along that streamline — and there was nowhere else for it to come from but static pressure.

**Achievement Unlocked: The Venturi Paradox (ISC Class XI Physics — Fluid Mechanics)**`
      }
    }
  ],

  subject: "Physics",
  chapterName: "Fluid Currents: Fluid Mechanics",
  learningObjectives: [
    "Discover that fluid pressure drops as flow speed increases, resolving the Venturi paradox.",
    "Observe the quadratic relationship between throat velocity and pressure change (Bernoulli's principle).",
    "Navigate the sub by keeping throat pressure within a safe operating band."
  ],
  storyNarrative: "A deep-sea geothermal valve is leaking, and a miniature repair sub must navigate a narrow, variable-width vent pipe by tracking pressure drops to avoid being crushed or pulled into the volcanic exhaust.",
  world: {
    environmentName: "Abyssal Trench Hydrothermal Vents",
    visualAtmosphere: "Pitch-Black Seawater & Roaring White-Smoker Geysers",
    audioLandscape: "Muffled deep-sea pressure groans, geyser roar, sub thruster hum"
  },
  coreScientificConcept: {
    name: "Bernoulli's Principle",
    description: "Along a streamline, P + ½ρv² remains constant. As fluid speed increases through a constriction, static pressure must fall to compensate - kinetic energy and pressure energy trade off directly.",
    equationLatex: "P + \\frac{1}{2}\\rho v^2 = \\text{constant}"
  },
  coreInteraction: "PARAMETER_SANDBOX",
  parameterSandboxConfig: {
    relationshipType: "QUADRATIC",
    primaryParamKey: "throatVelocity",
    outputKey: "throatPressure",
    outputLabel: "Throat Static Pressure",
    outputUnit: "kPa",
    coefficients: {
      a: -0.5,
      b: 0,
      c: 252
    },
    yRange: {
      min: 190,
      max: 260
    },
    targetBand: {
      min: 205,
      max: 215,
      label: "Safe Throat Transit Band"
    },
    formulaDisplayLatex: "P_2 = 252 - 0.5v_2^2\\ \\text{kPa}"
  },
  predictionPrompt: "As the pipe narrows and water accelerates through the throat, will the static pressure at the throat rise, fall, or stay the same compared to the wide upstream section?",
  predictionPresets: [
    {
      id: "pressure-rises-in-throat",
      label: "📈 Pressure will rise in the throat, since squeezing the pipe compresses the water.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_COMPRESSION_INCREASES_PRESSURE",
      explanation: "Water is essentially incompressible - narrowing the pipe doesn't 'squeeze' it into higher pressure, it forces it to speed up instead, and that extra speed comes at the direct expense of static pressure."
    },
    {
      id: "pressure-unchanged-narrower",
      label: "➡️ Pressure stays roughly the same, since it's the same water flowing through the whole pipe.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_PRESSURE_FLOW_INDEPENDENT",
      explanation: "Pressure changes substantially with velocity along a streamline - the sandbox graph shows a clear quadratic drop as throat velocity increases."
    },
    {
      id: "pressure-falls-in-throat",
      label: "🎯 Pressure will fall in the throat, since the water's kinetic energy increases at the expense of pressure energy.",
      isMisconception: false,
      explanation: "Correct! By Bernoulli's principle, P + ½ρv² stays constant along the streamline - as v increases, P must decrease to compensate."
    }
  ],
  experimentFlow: {
    parameters: [
      {
        name: "throatVelocity",
        label: "Throat Velocity (v₂)",
        symbol: "v₂",
        min: 2,
        max: 10,
        step: 0.1,
        defaultValue: 3,
        unit: "m/s"
      }
    ],
    targets: {
      name: "throatPressure",
      label: "Safe Transit Pressure",
      min: 205,
      max: 215,
      unit: "kPa",
      hint: "Bring throat velocity close to 8.6-9.7 m/s to land pressure in the safe transit band."
    }
  },
  reflectionPrompts: [
    "Explain why narrowing a pipe causes fluid to speed up rather than simply increasing its pressure.",
    "Describe what would happen to the sub if throat velocity were pushed to the maximum available (10 m/s).",
    "How does Bernoulli's principle relate the Venturi effect to phenomena like aircraft lift?"
  ],
  commonMisconceptions: [
    {
      id: "MISCONCEPTION_COMPRESSION_INCREASES_PRESSURE",
      name: "Compression-Pressure Fallacy",
      triggerCondition: "predictionPreset === 'pressure-rises-in-throat'",
      pedagogicalAction: "Show via the sandbox graph that pressure falls, not rises, as the water is forced to accelerate through the narrower throat - the energy goes into speed, not pressure."
    },
    {
      id: "MISCONCEPTION_PRESSURE_FLOW_INDEPENDENT",
      name: "Pressure-Flow Independence Fallacy",
      triggerCondition: "predictionPreset === 'pressure-unchanged-narrower'",
      pedagogicalAction: "Demonstrate the quadratic pressure drop directly via the live graph as throat velocity is adjusted across its full range."
    }
  ],
  socraticMentorDialogue: [
    {
      character: "Dr. Richard Feynman",
      avatar: "FEYNMAN",
      introductoryRemark: "Welcome to the vents! People get this backwards all the time - they think a narrow pipe means high pressure. Nope, it's the opposite. Watch what happens to the gauge as the water speeds up."
    },
    {
      character: "Sir Isaac Newton",
      avatar: "NEWTON",
      introductoryRemark: "Observe how energy conserved along one streamline must be traded between forms - kinetic and pressure - precisely as my own laws of motion permit no energy to simply vanish."
    }
  ],
  successConditions: {
    criteriaText: "Throat velocity calibrated so static pressure falls between 205 and 215 kPa, holding safe transit through the vent.",
    rewardXP: 500,
    badgeUnlocked: {
      id: "venturi-paradox",
      name: "The Venturi Paradox"
    }
  },
  failureBehaviors: {
    impactCraters: false,
    previousTrajectories: true,
    radioTransmissions: [
      "Warning: throat velocity too low - insufficient progress through the vent.",
      "Alert: pressure critically low - sub at risk of exhaust pull at this velocity."
    ]
  },
  worldMemory: {
    persistenceEnabled: true,
    maxMemorySlots: 5
  },
  scientificDiscoveries: [
    {
      id: "venturi-paradox",
      title: "The Venturi Paradox",
      description: "Kinetic energy increases at the direct expense of static pressure when a fluid is forced to speed up through a constriction.",
      scientificInsight: "Feynman says: Nothing is free in physics - speed up the water, and something else has to give. That something is pressure."
    }
  ],
  rewards: {
    xp: 500,
    badges: ["venturi-paradox"]
  },
  teacherNotes: "This mission uses an exact quadratic fit derived directly from Bernoulli's equation: P2 = P1 + 0.5*rho*(v1^2 - v2^2) with rho=1000 kg/m^3, v1=2 m/s (fixed upstream velocity), P1=250 kPa gives P2 = 252 - 0.5*v2^2 - genuinely exact, no approximation needed, since Bernoulli's relationship is already quadratic in velocity.",
  assessmentStrategy: "Formative Socratic evaluation of whether the student correctly attributes the pressure drop to the speed-pressure energy tradeoff rather than a compression effect.",
  accessibilityNotes: "High-contrast dark seawater backdrop with glowing flow-indicator particles and clear numeric pressure/velocity readouts.",
  unlockConditions: {
    prerequisites: ["energy-depths"]
  },
  missionDuration: 25,
  difficulty: "Intermediate",
  prerequisites: ["energy-depths"],
  guidedInquiries: [
    { label: "🥁 Ask Feynman about the Venturi paradox", text: "Why does squeezing a pipe speed up water instead of squeezing up its pressure?" },
    { label: "🍎 Ask Newton about energy tradeoffs", text: "How does Bernoulli's principle relate to the conservation of energy along a streamline?" }
  ]
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mission } from "../../types";

export const carnotEfficiencyMission: Mission = {
  id: "geothermal-carnot-tuning",
  title: "Thermal Engines: Carnot Tuning",
  codename: "OPERATION: CALDERA CORE",
  description: "A geothermal power core on a volcanic island is destabilizing. Tune the cooling system's sink temperature to extract maximum safe work from the heat engine, discovering along the way why no engine - however well built - can ever reach 100% efficiency.",
  objectives: [
    "Discover that Carnot efficiency depends only on the ratio of sink to source temperature: η = 1 - T_C/T_H.",
    "Observe that lowering sink temperature increases efficiency, but never to 100%.",
    "Tune the cooling system to reach a target efficiency band."
  ],
  steps: [
    {
      id: "briefing",
      type: "BRIEFING",
      title: "Volcanic Caldera Power Core Briefing",
      content: {
        narrative: `### MISSION ADVISORY: THERMAL EFFICIENCY CALIBRATION
Deep beneath the basalt rock of Mauna Loa's caldera, a geothermal power core draws heat from a source at a fixed **600 K**. The engine's efficiency depends entirely on how cold we can drive the cooling sink.

The absolute efficiency limit for any heat engine operating between a hot source $T_H$ and cold sink $T_C$ is the Carnot efficiency:

$$\\eta = 1 - \\frac{T_C}{T_H}$$

No engine — however friction-free, however perfectly built — can exceed this limit. Some heat *must* be rejected to the cold sink; none can be fully converted to work.

Your task: tune the cooling system's sink temperature until efficiency reads between **38% and 42%**.`
      }
    },
    {
      id: "dialogue",
      type: "DIALOGUE",
      title: "Caldera Core Uplink",
      content: {
        dialogue: [
          {
            speaker: "Sir Isaac Newton",
            avatar: "NEWTON",
            message: "Hear this well, cadet: even in a universe free of every mote of friction, heat demands a colder place to flow toward. No engine, however perfectly constructed, escapes this tax. It is not a failure of engineering — it is a law of the universe itself."
          },
          {
            speaker: "Caldera Core Control",
            avatar: "SYSTEM",
            message: "Cooling system telemetry unlocked. Adjust sink temperature and observe efficiency update in real time."
          }
        ]
      }
    },
    {
      id: "sandbox",
      type: "SANDBOX_EXPLORATION",
      title: "Carnot Efficiency Sandbox",
      content: {
        simulationConfig: {
          simId: "CARNOT_EFFICIENCY",
          initialParameters: {
            sinkTemperature: 450
          },
          minMaxLimits: {
            sinkTemperature: [250, 500]
          },
          targetFormula: {
            latex: "\\eta = \\left(1 - \\frac{T_C}{600}\\right) \\times 100\\%",
            description: "Carnot Efficiency vs. Sink Temperature (Source fixed at 600 K)",
            variableLabels: {
              "T_C": "Sink Temperature (K)",
              "eta": "Carnot Efficiency (%)",
              "T_H": "Source Temperature (600 K, fixed)"
            }
          }
        }
      }
    },
    {
      id: "challenge",
      type: "CHALLENGE_EXPERIMENT",
      title: "Target Efficiency Calibration",
      content: {
        challengeQuestion: {
          questionText: "Tune the cooling system's sink temperature until Carnot efficiency reads between 38% and 42%. What sink temperature achieves this?",
          formulaTrigger: "carnot_efficiency",
          targetValueRange: {
            min: 38,
            max: 42,
            targetVar: "efficiency"
          },
          hint: "Efficiency = (1 - T_C/600) × 100%. A sink temperature near 348-372 K lands you in the target band.",
          completionRewardXP: 500
        }
      }
    },
    {
      id: "debrief",
      type: "DEBRIEF",
      title: "Caldera Core Debrief",
      content: {
        narrative: `### TARGET SECURED: STABLE EFFICIENCY ACHIEVED
The power core stabilizes, converting a solid fraction of its geothermal heat into usable work, with waste heat safely rejected to the cooling sink.

Notice what never happened, no matter how far you drove sink temperature down: efficiency never touched 100%. Even at absolute zero — a temperature no cooling system could ever truly reach — the Carnot formula only approaches, never reaches, perfect conversion. Waste heat is not an engineering flaw to be eliminated. It is the price every heat engine in the universe must pay.

**Achievement Unlocked: Carnot's Unreachable Star (ISC Class XI Physics — Thermodynamics)**`
      }
    }
  ],

  subject: "Physics",
  chapterName: "Thermal Engines: Thermodynamics",
  learningObjectives: [
    "Discover that Carnot efficiency depends only on the ratio of sink to source temperature: η = 1 - T_C/T_H.",
    "Observe that lowering sink temperature increases efficiency, but never to 100%.",
    "Tune the cooling system to reach a target efficiency band."
  ],
  storyNarrative: "A geothermal power core on a volcanic island is destabilizing. Tune a thermodynamic gas cycle, balancing heat addition, expansion work, and waste heat rejection, discovering the absolute Carnot efficiency limit.",
  world: {
    environmentName: "The Volcanic Caldera of Mauna Loa",
    visualAtmosphere: "Glowing Magma Rivers & High-Tech Basalt-Rock Facility",
    audioLandscape: "Rattling earth plates, deep geothermal rumble, cooling system hum"
  },
  coreScientificConcept: {
    name: "Carnot Efficiency & the Second Law of Thermodynamics",
    description: "The maximum possible efficiency of any heat engine operating between a hot source and cold sink is η = 1 - T_C/T_H. This limit is absolute - no real or ideal engine can exceed it, and 100% efficiency would require an unreachable T_C = 0 K.",
    equationLatex: "\\eta = 1 - \\frac{T_C}{T_H}"
  },
  coreInteraction: "PARAMETER_SANDBOX",
  parameterSandboxConfig: {
    relationshipType: "LINEAR",
    primaryParamKey: "sinkTemperature",
    outputKey: "efficiency",
    outputLabel: "Carnot Efficiency",
    outputUnit: "%",
    coefficients: {
      a: -0.16667,
      b: 100
    },
    yRange: {
      min: 0,
      max: 70
    },
    targetBand: {
      min: 38,
      max: 42,
      label: "Stable Operating Efficiency Band"
    },
    formulaDisplayLatex: "\\eta = 100 - 0.1667 \\cdot T_C\\ \\%"
  },
  predictionPrompt: "Can we design a perfect thermodynamic heat engine that converts 100% of absorbed geothermal heat into useful electrical work, given a sufficiently well-engineered, friction-free design?",
  predictionPresets: [
    {
      id: "carnot-100-percent-possible",
      label: "⚙️ Yes - with zero friction and perfect materials, 100% efficiency is achievable.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_100_PERCENT_EFFICIENCY",
      explanation: "Even a perfectly frictionless, ideal engine is bound by the Second Law - some heat must always be rejected to a colder sink, capping efficiency at η = 1 - T_C/T_H, which reaches 100% only if T_C = 0 K (absolutely unreachable)."
    },
    {
      id: "carnot-efficiency-fixed",
      label: "🔒 Efficiency is a fixed property of the engine design and cannot be changed by adjusting temperatures.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_EFFICIENCY_FIXED",
      explanation: "Efficiency is directly determined by the source and sink temperatures - the sandbox graph shows it changing substantially as sink temperature is adjusted, with no change to any physical engine part."
    },
    {
      id: "carnot-bounded-below-100",
      label: "🎯 No - even a perfect engine is bounded by η = 1 - T_C/T_H, which never reaches 100% at any achievable sink temperature.",
      isMisconception: false,
      explanation: "Correct! The Second Law of Thermodynamics guarantees some heat rejection is unavoidable - Carnot efficiency approaches but never reaches 100%, no matter how well-engineered the system."
    }
  ],
  experimentFlow: {
    parameters: [
      {
        name: "sinkTemperature",
        label: "Cooling Sink Temperature (T_C)",
        symbol: "T_C",
        min: 250,
        max: 500,
        step: 5,
        defaultValue: 450,
        unit: "K"
      }
    ],
    targets: {
      name: "efficiency",
      label: "Stable Operating Efficiency",
      min: 38,
      max: 42,
      unit: "%",
      hint: "Bring sink temperature close to 348-372 K to land efficiency in the target band."
    }
  },
  reflectionPrompts: [
    "Explain why Carnot efficiency can never reach 100%, even for a perfectly frictionless, ideal engine.",
    "Describe what sink temperature would be required to reach exactly 50% efficiency, and whether that temperature is physically achievable.",
    "Why does lowering the sink temperature increase efficiency, when the source temperature never changes?"
  ],
  commonMisconceptions: [
    {
      id: "MISCONCEPTION_100_PERCENT_EFFICIENCY",
      name: "Perfect Efficiency Fallacy",
      triggerCondition: "predictionPreset === 'carnot-100-percent-possible'",
      pedagogicalAction: "Show that even at the coldest achievable sink temperature in the sandbox (250 K), efficiency caps well below 100% - and explain that reaching true 100% would require an unreachable T_C = 0 K."
    },
    {
      id: "MISCONCEPTION_EFFICIENCY_FIXED",
      name: "Fixed-Efficiency Fallacy",
      triggerCondition: "predictionPreset === 'carnot-efficiency-fixed'",
      pedagogicalAction: "Demonstrate via the live graph that efficiency changes substantially as sink temperature is adjusted, with the engine's physical design held entirely constant."
    }
  ],
  socraticMentorDialogue: [
    {
      character: "Sir Isaac Newton",
      avatar: "NEWTON",
      introductoryRemark: "Welcome, engineer. You seek to extract work from heat - a noble aim, but bounded by a law deeper than mere friction or imperfection. Even a perfect machine cannot escape the universe's insistence that heat flow toward cold."
    },
    {
      character: "Dr. Richard Feynman",
      avatar: "FEYNMAN",
      introductoryRemark: "People always want a free lunch - convert all the heat into work, none wasted. But nature's stubborn about this one. Watch what happens to efficiency as you chase a colder and colder sink - it keeps climbing, but it never, ever gets to 100."
    }
  ],
  successConditions: {
    criteriaText: "Sink temperature calibrated so Carnot efficiency falls between 38% and 42%.",
    rewardXP: 500,
    badgeUnlocked: {
      id: "carnots-unreachable-star",
      name: "Carnot's Unreachable Star"
    }
  },
  failureBehaviors: {
    impactCraters: true,
    previousTrajectories: true,
    radioTransmissions: [
      "Warning: sink temperature too high - core efficiency critically low.",
      "Alert: efficiency exceeding safe operating band - verify sink temperature calibration."
    ]
  },
  worldMemory: {
    persistenceEnabled: true,
    maxMemorySlots: 5
  },
  scientificDiscoveries: [
    {
      id: "carnots-unreachable-star",
      title: "Carnot's Unreachable Star",
      description: "Heat's conversion to work is fundamentally limited by the absolute temperature ratio of source and sink - a limit no engineering can overcome.",
      scientificInsight: "Newton says: Even in an ideal, frictionless universe, heat requires a colder place to go, leaving a tax of warm chaos behind it."
    }
  ],
  rewards: {
    xp: 500,
    badges: ["carnots-unreachable-star"]
  },
  teacherNotes: "This mission uses an exact linear fit: eta = 1 - T_C/T_H with T_H = 600 K fixed maps directly onto the engine's LINEAR relationship type (a*x+b with a=-1/600≈-0.16667, b=100, output in percent) - genuinely exact, since Carnot efficiency really is linear in T_C when T_H is held constant.",
  assessmentStrategy: "Formative Socratic evaluation of whether the student correctly attributes efficiency limits to the Second Law rather than treating them as an engineering imperfection to be eliminated.",
  accessibilityNotes: "High-contrast magma-orange PV-cycle backdrop with clear numeric readout of sink temperature and resulting efficiency percentage.",
  unlockConditions: {
    prerequisites: ["energy-depths"]
  },
  missionDuration: 25,
  difficulty: "Advanced",
  prerequisites: ["energy-depths"],
  guidedInquiries: [
    { label: "🍎 Ask Newton about heat's inescapable law", text: "Why can't even a perfectly frictionless engine reach 100% efficiency?" },
    { label: "🥁 Ask Feynman about the efficiency chase", text: "Why does efficiency keep climbing as sink temperature drops, but never quite reach 100%?" }
  ]
};

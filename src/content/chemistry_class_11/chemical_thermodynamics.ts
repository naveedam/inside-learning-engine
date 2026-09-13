/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mission } from "../../types";

export const spontaneityThresholdMission: Mission = {
  id: "gibbs-spontaneity-threshold",
  title: "Chemical Thermodynamics: Spontaneity Threshold",
  codename: "OPERATION: REACTION CROSSOVER",
  description: "An endothermic but entropy-favored reaction inside a research reactor refuses to proceed at low temperature. Tune the reactor's operating temperature until the reaction crosses into spontaneity.",
  objectives: [
    "Discover that spontaneity depends on both enthalpy and entropy through ΔG = ΔH - TΔS.",
    "Observe that an endothermic, entropy-favored reaction becomes spontaneous above a crossover temperature.",
    "Tune reactor temperature to find the spontaneity threshold."
  ],
  steps: [
    {
      id: "briefing",
      type: "BRIEFING",
      title: "Reaction Crossover Briefing",
      content: {
        narrative: `### MISSION ADVISORY: SPONTANEITY THRESHOLD SEARCH
A candidate reaction inside the research reactor absorbs heat (endothermic, $\\Delta H = +40\\ \\text{kJ/mol}$) while increasing disorder ($\\Delta S = +0.100\\ \\text{kJ/(mol·K)}$). At low temperature, it simply refuses to proceed.

Gibbs free energy determines spontaneity:

$$\\Delta G = \\Delta H - T\\Delta S$$

A reaction proceeds spontaneously only when $\\Delta G < 0$. Since this reaction's entropy term grows with temperature while enthalpy stays fixed, there exists a **crossover temperature** above which it suddenly becomes spontaneous.

Your task: tune reactor temperature until $\\Delta G$ reads between **-2 and 0 kJ/mol** — just past the spontaneity threshold.`
      }
    },
    {
      id: "dialogue",
      type: "DIALOGUE",
      title: "Reactor Control Uplink",
      content: {
        dialogue: [
          {
            speaker: "Dr. Richard Feynman",
            avatar: "FEYNMAN",
            message: "Here's a reaction that hates the cold and loves the heat! It costs energy to run - that's the plus-forty enthalpy - but it makes a mess, and nature secretly loves a mess. Crank up the temperature, and that love of disorder eventually wins out over the energy cost."
          },
          {
            speaker: "Reactor Control",
            avatar: "SYSTEM",
            message: "Temperature telemetry unlocked. Adjust reactor temperature and observe Gibbs free energy update in real time."
          }
        ]
      }
    },
    {
      id: "sandbox",
      type: "SANDBOX_EXPLORATION",
      title: "Gibbs Free Energy Sandbox",
      content: {
        simulationConfig: {
          simId: "GIBBS_FREE_ENERGY",
          initialParameters: {
            reactorTemperature: 300
          },
          minMaxLimits: {
            reactorTemperature: [250, 500]
          },
          targetFormula: {
            latex: "\\Delta G = \\Delta H - T\\Delta S = 40 - 0.1T\\ \\text{kJ/mol}",
            description: "Gibbs Free Energy vs. Reactor Temperature",
            variableLabels: {
              "T": "Reactor Temperature (K)",
              "\\Delta G": "Gibbs Free Energy (kJ/mol)",
              "\\Delta H, \\Delta S": "Enthalpy (+40 kJ/mol) and Entropy (+0.100 kJ/(mol·K)), fixed"
            }
          }
        }
      }
    },
    {
      id: "challenge",
      type: "CHALLENGE_EXPERIMENT",
      title: "Threshold Crossing",
      content: {
        challengeQuestion: {
          questionText: "Tune reactor temperature until Gibbs free energy reads between -2 and 0 kJ/mol - just past the spontaneity threshold. What temperature achieves this?",
          formulaTrigger: "gibbs_free_energy",
          targetValueRange: {
            min: -2,
            max: 0,
            targetVar: "gibbsEnergy"
          },
          hint: "ΔG = 40 - 0.1T. The crossover occurs at T = 400 K; a temperature near 400-420 K lands you in the target band.",
          completionRewardXP: 500
        }
      }
    },
    {
      id: "debrief",
      type: "DEBRIEF",
      title: "Threshold Telemetry Debrief",
      content: {
        narrative: `### TARGET SECURED: SPONTANEITY THRESHOLD CROSSED
The reaction chamber begins to proceed on its own, no longer requiring continuous external energy input. The reactor has crossed into spontaneous operation.

Notice what changed: not the reaction's fundamental chemistry, but the balance between two competing terms. Below 400 K, the energy cost of the reaction outweighed its entropy reward. Above it, disorder won out. That crossover point wasn't arbitrary - it fell exactly where ΔH and TΔS became equal.

**Achievement Unlocked: The Spontaneity Threshold (ISC Class XI Chemistry — Chemical Thermodynamics)**`
      }
    }
  ],

  subject: "Chemistry",
  chapterName: "Thermodynamics: Enthalpy, Entropy & Free Energy",
  learningObjectives: [
    "Discover that spontaneity depends on both enthalpy and entropy through ΔG = ΔH - TΔS.",
    "Observe that an endothermic, entropy-favored reaction becomes spontaneous above a crossover temperature.",
    "Tune reactor temperature to find the spontaneity threshold."
  ],
  storyNarrative: "An endothermic but entropy-favored reaction inside a research reactor refuses to proceed at low temperature. Tune the reactor's operating temperature until the reaction crosses into spontaneity.",
  world: {
    environmentName: "Research Reactor Control Bay",
    visualAtmosphere: "Glowing Reaction Chamber & Layered Thermodynamic Gauges",
    audioLandscape: "Low reactor hum, thermal regulator clicks, control panel chimes"
  },
  coreScientificConcept: {
    name: "Gibbs Free Energy & Reaction Spontaneity",
    description: "ΔG = ΔH - TΔS determines whether a reaction proceeds spontaneously (ΔG < 0). An endothermic, entropy-favored reaction (positive ΔH, positive ΔS) becomes spontaneous only above a crossover temperature where TΔS exceeds ΔH.",
    equationLatex: "\\Delta G = \\Delta H - T\\Delta S"
  },
  coreInteraction: "PARAMETER_SANDBOX",
  parameterSandboxConfig: {
    relationshipType: "LINEAR",
    primaryParamKey: "reactorTemperature",
    outputKey: "gibbsEnergy",
    outputLabel: "Gibbs Free Energy",
    outputUnit: "kJ/mol",
    coefficients: {
      a: -0.1,
      b: 40
    },
    yRange: {
      min: -12,
      max: 18
    },
    targetBand: {
      min: -2,
      max: 0,
      label: "Spontaneity Threshold Band"
    },
    formulaDisplayLatex: "\\Delta G = 40 - 0.1T\\ \\text{kJ/mol}"
  },
  predictionPrompt: "This reaction absorbs heat (ΔH is positive) but increases disorder (ΔS is positive). Will it ever become spontaneous, and if so, does raising or lowering temperature help?",
  predictionPresets: [
    {
      id: "endothermic-never-spontaneous",
      label: "🚫 An endothermic reaction can never be spontaneous, since it requires energy input.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_ENDOTHERMIC_NEVER_SPONTANEOUS",
      explanation: "Spontaneity depends on both enthalpy and entropy together - an endothermic reaction with a large enough favorable entropy change becomes spontaneous once TΔS exceeds ΔH, which this sandbox demonstrates directly."
    },
    {
      id: "lower-temp-more-spontaneous",
      label: "❄️ Lowering temperature will help this reaction become spontaneous.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_TEMPERATURE_DIRECTION_REVERSED",
      explanation: "For this entropy-favored reaction, RAISING temperature increases the favorable -TΔS term, pushing ΔG more negative - lowering temperature moves it further from spontaneity, not closer."
    },
    {
      id: "raise-temp-crosses-threshold",
      label: "🎯 Raising temperature will eventually make ΔG negative, since the favorable entropy term grows with T.",
      isMisconception: false,
      explanation: "Correct! Since ΔS is positive, the -TΔS term becomes more negative as T increases, eventually overtaking the positive ΔH term and making ΔG negative."
    }
  ],
  experimentFlow: {
    parameters: [
      {
        name: "reactorTemperature",
        label: "Reactor Temperature (T)",
        symbol: "T",
        min: 250,
        max: 500,
        step: 5,
        defaultValue: 300,
        unit: "K"
      }
    ],
    targets: {
      name: "gibbsEnergy",
      label: "Spontaneity Threshold",
      min: -2,
      max: 0,
      unit: "kJ/mol",
      hint: "Bring reactor temperature close to 400-420 K to cross just past the spontaneity threshold."
    }
  },
  reflectionPrompts: [
    "Explain why an endothermic reaction can still be spontaneous at sufficiently high temperature.",
    "Describe what would happen to the crossover temperature if ΔS were larger (more positive) than 0.100 kJ/(mol·K).",
    "Why does raising temperature help this particular reaction, when it would hurt an exothermic, entropy-decreasing reaction instead?"
  ],
  commonMisconceptions: [
    {
      id: "MISCONCEPTION_ENDOTHERMIC_NEVER_SPONTANEOUS",
      name: "Endothermic-Never-Spontaneous Fallacy",
      triggerCondition: "predictionPreset === 'endothermic-never-spontaneous'",
      pedagogicalAction: "Show via the live graph that ΔG crosses from positive to negative as temperature rises, demonstrating that this endothermic reaction does become spontaneous above 400 K."
    },
    {
      id: "MISCONCEPTION_TEMPERATURE_DIRECTION_REVERSED",
      name: "Reversed Temperature-Direction Fallacy",
      triggerCondition: "predictionPreset === 'lower-temp-more-spontaneous'",
      pedagogicalAction: "Clarify that the correct direction depends on the signs of ΔH and ΔS - for this specific entropy-favored reaction, higher temperature is what favors spontaneity, the opposite of an entropy-decreasing reaction."
    }
  ],
  socraticMentorDialogue: [
    {
      character: "Dr. Richard Feynman",
      avatar: "FEYNMAN",
      introductoryRemark: "Welcome to the reactor bay! Here's the deal: this reaction costs energy but makes disorder, and nature's got a soft spot for disorder. Turn up the heat, and watch that soft spot start winning."
    },
    {
      character: "Sir Isaac Newton",
      avatar: "NEWTON",
      introductoryRemark: "Consider two competing quantities, one fixed, one scaling with temperature. As you raise T, observe precisely where their balance tips from favoring order to favoring chaos."
    }
  ],
  successConditions: {
    criteriaText: "Reactor temperature calibrated so Gibbs free energy falls between -2 and 0 kJ/mol, just past the spontaneity threshold.",
    rewardXP: 500,
    badgeUnlocked: {
      id: "spontaneity-threshold",
      name: "The Spontaneity Threshold"
    }
  },
  failureBehaviors: {
    impactCraters: false,
    previousTrajectories: true,
    radioTransmissions: [
      "Warning: reactor temperature too low - reaction remains non-spontaneous.",
      "Alert: reactor temperature overshoot - well past threshold, verify calibration."
    ]
  },
  worldMemory: {
    persistenceEnabled: true,
    maxMemorySlots: 5
  },
  scientificDiscoveries: [
    {
      id: "spontaneity-threshold",
      title: "The Spontaneity Threshold",
      description: "A reaction's spontaneity is decided by the balance between enthalpy and the temperature-scaled entropy term, producing a precise crossover temperature.",
      scientificInsight: "Feynman says: Nature doesn't just chase low energy - it chases disorder too. Crank up the temperature, and sometimes disorder simply wins the argument."
    }
  ],
  rewards: {
    xp: 500,
    badges: ["spontaneity-threshold"]
  },
  teacherNotes: "This mission uses an exact linear fit: Delta-G = Delta-H - T*Delta-S with Delta-H=+40 kJ/mol, Delta-S=+0.100 kJ/(mol*K) fixed maps directly onto the engine's LINEAR relationship type (a*x+b with a=-0.1, b=40) - genuinely exact, since Gibbs free energy really is linear in T when Delta-H and Delta-S are held constant.",
  assessmentStrategy: "Formative Socratic evaluation of whether the student correctly reasons about the temperature-dependence direction based on the signs of ΔH and ΔS for this specific reaction.",
  accessibilityNotes: "High-contrast reactor-bay backdrop with clear numeric readout of temperature and Gibbs free energy.",
  unlockConditions: {
    prerequisites: ["states-of-matter"]
  },
  missionDuration: 25,
  difficulty: "Advanced",
  prerequisites: ["states-of-matter"],
  guidedInquiries: [
    { label: "🥁 Ask Feynman about disorder's appeal", text: "Why does nature sometimes favor a reaction that costs energy, just because it makes more disorder?" },
    { label: "🍎 Ask Newton about the balance point", text: "How is the exact crossover temperature determined from the competing enthalpy and entropy terms?" }
  ]
};

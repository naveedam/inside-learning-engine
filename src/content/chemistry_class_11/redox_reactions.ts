/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mission } from "../../types";

export const cellPotentialCalibrationMission: Mission = {
  id: "nernst-cell-calibration",
  title: "Redox Reactions: Cell Potential Calibration",
  codename: "OPERATION: ELECTROCHEMICAL DRIFT",
  description: "A backup electrochemical cell's concentration ratio has drifted from standard conditions, shifting its output voltage. Calibrate the concentration ratio until cell potential matches the reference voltage required for docking-bay power systems.",
  objectives: [
    "Discover that cell potential shifts predictably with concentration ratio via the Nernst equation.",
    "Observe that standard electrode potential (E°) is only achieved at standard 1 M concentrations - real cells drift from it.",
    "Calibrate the reaction quotient to reach the reference docking-bay voltage."
  ],
  steps: [
    {
      id: "briefing",
      type: "BRIEFING",
      title: "Electrochemical Drift Briefing",
      content: {
        narrative: `### MISSION ADVISORY: CELL POTENTIAL RECALIBRATION
A two-electron transfer redox cell (standard potential $E^\\circ = +0.34\\ \\text{V}$) powers the docking bay's backup systems. Its concentration ratio has drifted from standard 1 M conditions, shifting output voltage away from spec.

The Nernst equation governs how cell potential responds to non-standard concentrations:

$$E = E^\\circ - \\frac{0.0592}{n}\\log Q$$

where $n = 2$ (electrons transferred) and $Q$ is the reaction quotient — the ratio of product to reactant concentrations. As $\\log Q$ increases, cell potential falls.

Your task: calibrate $\\log Q$ until cell potential reads between **0.29 and 0.31 V** — the docking-bay reference voltage.`
      }
    },
    {
      id: "dialogue",
      type: "DIALOGUE",
      title: "Docking Bay Power Uplink",
      content: {
        dialogue: [
          {
            speaker: "Sir Isaac Newton",
            avatar: "NEWTON",
            message: "The standard potential you find tabulated in any reference is but a single point - measured under one precise condition, all concentrations equal to one. Shift those concentrations even slightly, and the cell's true voltage shifts with them, exactly as the Nernst relation predicts."
          },
          {
            speaker: "Docking Bay Power Control",
            avatar: "SYSTEM",
            message: "Concentration ratio telemetry unlocked. Adjust log(Q) and observe cell potential update in real time."
          }
        ]
      }
    },
    {
      id: "sandbox",
      type: "SANDBOX_EXPLORATION",
      title: "Nernst Equation Sandbox",
      content: {
        simulationConfig: {
          simId: "NERNST_POTENTIAL",
          initialParameters: {
            logQ: -1
          },
          minMaxLimits: {
            logQ: [-3, 3]
          },
          targetFormula: {
            latex: "E = E^\\circ - \\frac{0.0592}{n}\\log Q = 0.34 - 0.0296 \\log Q\\ \\text{V}",
            description: "Cell Potential vs. log(Reaction Quotient)",
            variableLabels: {
              "\\log Q": "log(Reaction Quotient)",
              "E": "Cell Potential (V)",
              "E^\\circ, n": "Standard Potential (0.34 V) and Electron Count (n=2), fixed"
            }
          }
        }
      }
    },
    {
      id: "challenge",
      type: "CHALLENGE_EXPERIMENT",
      title: "Reference Voltage Calibration",
      content: {
        challengeQuestion: {
          questionText: "Calibrate log(Q) until cell potential reads between 0.29 and 0.31 V - the docking-bay reference voltage. What concentration ratio achieves this?",
          formulaTrigger: "nernst_potential",
          targetValueRange: {
            min: 0.29,
            max: 0.31,
            targetVar: "cellPotential"
          },
          hint: "E = 0.34 - 0.0296·log(Q). A log(Q) near 1.0-1.7 lands you in the target band.",
          completionRewardXP: 500
        }
      }
    },
    {
      id: "debrief",
      type: "DEBRIEF",
      title: "Power Systems Debrief",
      content: {
        narrative: `### TARGET SECURED: REFERENCE VOLTAGE RESTORED
The backup cell now outputs precisely the docking-bay reference voltage, concentration ratio calibrated to compensate for the drift from standard conditions.

Notice what you never touched: the standard potential itself, fixed at 0.34 V by the cell's chemistry alone. What you adjusted was the concentration ratio - and the Nernst equation translated that adjustment into a precise, predictable voltage shift.

**Achievement Unlocked: The Nernst Correction (ISC Class XI Chemistry — Redox Reactions)**`
      }
    }
  ],

  subject: "Chemistry",
  chapterName: "Redox Reactions: Electron Transfer & Electrochemical Potentials",
  learningObjectives: [
    "Discover that cell potential shifts predictably with concentration ratio via the Nernst equation.",
    "Observe that standard electrode potential (E°) is only achieved at standard 1 M concentrations - real cells drift from it.",
    "Calibrate the reaction quotient to reach the reference docking-bay voltage."
  ],
  storyNarrative: "A backup electrochemical cell's concentration ratio has drifted from standard conditions, shifting its output voltage. Calibrate the concentration ratio until cell potential matches the reference voltage required for docking-bay power systems.",
  world: {
    environmentName: "Docking Bay Backup Power Systems",
    visualAtmosphere: "Glowing Electrode Cells & Layered Voltage Readout Panels",
    audioLandscape: "Electrical hum, relay clicks, voltage gauge oscillation"
  },
  coreScientificConcept: {
    name: "The Nernst Equation & Non-Standard Cell Potential",
    description: "E = E° - (0.0592/n)log Q describes how cell potential shifts away from the standard value as concentrations deviate from 1 M. Standard electrode potentials are reference points, not fixed real-world voltages.",
    equationLatex: "E = E^\\circ - \\frac{0.0592}{n}\\log Q"
  },
  coreInteraction: "PARAMETER_SANDBOX",
  parameterSandboxConfig: {
    relationshipType: "LINEAR",
    primaryParamKey: "logQ",
    outputKey: "cellPotential",
    outputLabel: "Cell Potential",
    outputUnit: "V",
    coefficients: {
      a: -0.0296,
      b: 0.34
    },
    yRange: {
      min: 0.2,
      max: 0.45
    },
    targetBand: {
      min: 0.29,
      max: 0.31,
      label: "Docking-Bay Reference Voltage"
    },
    formulaDisplayLatex: "E = 0.34 - 0.0296\\log Q\\ \\text{V}"
  },
  predictionPrompt: "If concentrations in this cell deviate from standard 1 M conditions, will the cell's actual output voltage still equal its tabulated standard potential (E°)?",
  predictionPresets: [
    {
      id: "voltage-always-equals-standard",
      label: "📋 Yes - cell potential always equals the tabulated standard potential, regardless of concentration.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_VOLTAGE_ALWAYS_STANDARD",
      explanation: "The standard potential E° applies only at standard 1 M concentrations - the Nernst equation shows real cell potential shifts continuously as concentrations deviate from that reference point."
    },
    {
      id: "voltage-independent-of-ratio",
      label: "➡️ Cell potential depends only on which electrodes are used, not on the concentration ratio between them.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_VOLTAGE_ELECTRODE_ONLY",
      explanation: "While the electrode materials set the standard potential baseline, the actual operating voltage depends significantly on the concentration ratio, exactly as the Nernst equation's log(Q) term shows."
    },
    {
      id: "voltage-shifts-with-log-q",
      label: "🎯 Cell potential shifts predictably away from E° as log(Q) changes, following the Nernst equation.",
      isMisconception: false,
      explanation: "Correct! E = E° - (0.0592/n)log Q shows cell potential is E° only when Q = 1 (standard conditions) - otherwise it shifts linearly with log Q."
    }
  ],
  experimentFlow: {
    parameters: [
      {
        name: "logQ",
        label: "log(Reaction Quotient)",
        symbol: "log Q",
        min: -3,
        max: 3,
        step: 0.1,
        defaultValue: -1,
        unit: ""
      }
    ],
    targets: {
      name: "cellPotential",
      label: "Docking-Bay Reference Voltage",
      min: 0.29,
      max: 0.31,
      unit: "V",
      hint: "Bring log(Q) close to 1.0-1.7 to reach the docking-bay reference voltage."
    }
  },
  reflectionPrompts: [
    "Explain why a cell's real-world voltage can differ from its tabulated standard potential.",
    "Describe what log(Q) = 0 (i.e. Q = 1) represents physically, and why the cell potential equals E° exactly there.",
    "Why does the Nernst equation use log(Q) rather than Q itself?"
  ],
  commonMisconceptions: [
    {
      id: "MISCONCEPTION_VOLTAGE_ALWAYS_STANDARD",
      name: "Always-Standard-Voltage Fallacy",
      triggerCondition: "predictionPreset === 'voltage-always-equals-standard'",
      pedagogicalAction: "Show via the live graph that cell potential shifts substantially away from 0.34 V as log(Q) moves away from zero."
    },
    {
      id: "MISCONCEPTION_VOLTAGE_ELECTRODE_ONLY",
      name: "Electrode-Only Voltage Fallacy",
      triggerCondition: "predictionPreset === 'voltage-independent-of-ratio'",
      pedagogicalAction: "Demonstrate that concentration ratio, via log(Q), produces a real and substantial voltage shift even with the same electrode materials throughout."
    }
  ],
  socraticMentorDialogue: [
    {
      character: "Sir Isaac Newton",
      avatar: "NEWTON",
      introductoryRemark: "Welcome, engineer. What you call a fixed voltage is, in truth, only a single reference point upon a continuous curve - shift the concentrations, and the true voltage shifts with them, precisely and predictably."
    },
    {
      character: "Dr. Richard Feynman",
      avatar: "FEYNMAN",
      introductoryRemark: "Standard potential is like a photo of a race at the starting line - useful, but the race keeps moving! Change the concentrations, and you're looking at a different moment in that race entirely."
    }
  ],
  successConditions: {
    criteriaText: "log(Q) calibrated so cell potential falls between 0.29 and 0.31 V, matching the docking-bay reference voltage.",
    rewardXP: 500,
    badgeUnlocked: {
      id: "nernst-correction",
      name: "The Nernst Correction"
    }
  },
  failureBehaviors: {
    impactCraters: true,
    previousTrajectories: true,
    radioTransmissions: [
      "Warning: cell potential too high - concentration ratio requires further adjustment.",
      "Alert: cell potential below reference - docking bay power insufficient."
    ]
  },
  worldMemory: {
    persistenceEnabled: true,
    maxMemorySlots: 5
  },
  scientificDiscoveries: [
    {
      id: "nernst-correction",
      title: "The Nernst Correction",
      description: "Standard electrode potentials are reference values at 1 M concentration - the Nernst equation translates real, non-standard concentrations into the actual cell potential.",
      scientificInsight: "Newton says: A tabulated standard potential is a single fixed point; the Nernst equation is the law that lets you move continuously away from it."
    }
  ],
  rewards: {
    xp: 500,
    badges: ["nernst-correction"]
  },
  teacherNotes: "This mission uses an exact linear fit: E = E_standard - (0.0592/n)*log(Q) with E_standard=0.34V, n=2 fixed maps directly onto the engine's LINEAR relationship type (a*x+b with a=-0.0296, b=0.34, x=log(Q)) - genuinely exact, since the Nernst equation really is linear in log(Q). Framing the slider as log(Q) directly (rather than Q itself) is what makes this an exact fit; Q itself would require a logarithmic curve type the engine does not support.",
  assessmentStrategy: "Formative Socratic evaluation of whether the student distinguishes standard potential (a fixed reference) from actual cell potential (concentration-dependent).",
  accessibilityNotes: "High-contrast electrode-cell backdrop with clear numeric readout of log(Q) and resulting cell potential.",
  unlockConditions: {
    prerequisites: ["equilibrium"]
  },
  missionDuration: 25,
  difficulty: "Advanced",
  prerequisites: ["equilibrium"],
  guidedInquiries: [
    { label: "🍎 Ask Newton about the reference point", text: "Why is the standard potential just one point on a continuous curve rather than a fixed universal voltage?" },
    { label: "🥁 Ask Feynman about the race-line photo", text: "How is a standard potential like a photo taken at a race's starting line?" }
  ]
};

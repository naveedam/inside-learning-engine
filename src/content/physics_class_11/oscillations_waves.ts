/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mission } from "../../types";

export const seismicResonanceMission: Mission = {
  id: "seismic-pendulum-tuning",
  title: "Harmonic Echoes: Seismic Pendulum Tuning",
  codename: "OPERATION: ICE-SHEET RESONANCE",
  description: "To map the interior of a massive, hollow ice-sheet on Enceladus, tune a seismic pendulum to the ice shelf's natural resonant period, bouncing longitudinal waves deep into the core to recover hidden cavern profiles.",
  objectives: [
    "Discover that a pendulum's period depends on its length, not on the mass of its bob.",
    "Observe the relationship between pendulum length and oscillation period.",
    "Tune pendulum length to match the target resonant period for the ice-sheet survey array."
  ],
  steps: [
    {
      id: "briefing",
      type: "BRIEFING",
      title: "Ice-Sheet Resonance Briefing",
      content: {
        narrative: `### MISSION ADVISORY: RESONANT PENDULUM CALIBRATION
Towering crystal ice spires catch the golden glare of Saturn's distant rings. Beneath them lies a hollow cavern network we cannot see directly — but we can *hear* it, if our seismic pendulum resonates at the right frequency.

A simple pendulum's period is governed by:

$$T = 2\\pi\\sqrt{\\frac{L}{g}}$$

Critically, this depends only on pendulum length $L$ and gravitational acceleration $g$ — **never** on the mass of the bob itself. A heavy bob and a light bob of identical length swing with identical period.

Your task: tune the pendulum's length until its period matches the ice shelf's natural resonant window of **2.3–2.6 seconds**, allowing longitudinal waves to bounce deep into the hidden cavern network.`
      }
    },
    {
      id: "dialogue",
      type: "DIALOGUE",
      title: "Ice Spire Uplink",
      content: {
        dialogue: [
          {
            speaker: "Galileo Galilei",
            avatar: "GALILEO",
            message: "I once timed the swinging of a cathedral lamp against my own pulse, and found something remarkable: its period held steady, swing after swing, whether it swung wide or narrow. Today you shall find something stranger still — that period cares nothing for the weight of the bob at all."
          },
          {
            speaker: "Ice-Sheet Survey Control",
            avatar: "SYSTEM",
            message: "Pendulum length telemetry unlocked. Adjust length and observe oscillation period update in real time."
          }
        ]
      }
    },
    {
      id: "sandbox",
      type: "SANDBOX_EXPLORATION",
      title: "Pendulum Resonance Sandbox",
      content: {
        simulationConfig: {
          simId: "PENDULUM_PERIOD",
          initialParameters: {
            pendulumLength: 0.8
          },
          minMaxLimits: {
            pendulumLength: [0.5, 3.0]
          },
          targetFormula: {
            latex: "T = 2\\pi\\sqrt{\\frac{L}{g}}\\ \\approx\\ 0.82L + 1.01\\ \\text{s (linear fit across this range)}",
            description: "Oscillation Period vs. Pendulum Length",
            variableLabels: {
              "L": "Pendulum Length (m)",
              "T": "Oscillation Period (s)",
              "g": "Gravitational Acceleration (9.8 m/s², fixed)"
            }
          }
        }
      }
    },
    {
      id: "challenge",
      type: "CHALLENGE_EXPERIMENT",
      title: "Resonance Lock",
      content: {
        challengeQuestion: {
          questionText: "The ice shelf resonates at a period between 2.3 and 2.6 seconds. Adjust pendulum length until oscillation period locks into that window. What length achieves resonance?",
          formulaTrigger: "pendulum_period",
          targetValueRange: {
            min: 2.3,
            max: 2.6,
            targetVar: "period"
          },
          hint: "Period grows with length. A pendulum length near 1.6-1.9 m lands you in the target band.",
          completionRewardXP: 500
        }
      }
    },
    {
      id: "debrief",
      type: "DEBRIEF",
      title: "Resonance Telemetry Debrief",
      content: {
        narrative: `### TARGET SECURED: RESONANCE ACHIEVED
The ice spires begin to glow with internal turquoise light as the pendulum's swing locks into resonance with the shelf itself. Longitudinal waves bounce deep into the hidden cavern network, and the survey array begins recovering a profile of chambers no eye has ever seen.

Notice what you never had to adjust: the mass of the bob. Whether heavy or light, only length and gravity dictated the swing's rhythm — the same clean mathematics that governs a cathedral lamp, a playground swing, and this alien ice shelf alike.

**Achievement Unlocked: The Harmonic Signature (ISC Class XI Physics — Oscillations & Waves)**`
      }
    }
  ],

  subject: "Physics",
  chapterName: "Harmonic Echoes: Oscillations & Waves",
  learningObjectives: [
    "Discover that a pendulum's period depends on its length, not on the mass of its bob.",
    "Observe the relationship between pendulum length and oscillation period.",
    "Tune pendulum length to match the target resonant period for the ice-sheet survey array."
  ],
  storyNarrative: "To map the interior of a massive, hollow ice-sheet, a seismic pendulum must be tuned to the ice shelf's natural resonant frequency, bouncing longitudinal waves deep into the core to recover hidden cavern profiles.",
  world: {
    environmentName: "The Crystal Spires of Enceladus",
    visualAtmosphere: "Towering Ice Sheets & Saturn's Distant Ring-Light",
    audioLandscape: "Deep ice groans, resonant hums, distant ring-system static"
  },
  coreScientificConcept: {
    name: "Simple Harmonic Motion & the Pendulum Period",
    description: "A simple pendulum's period T = 2π√(L/g) depends only on its length and local gravitational acceleration - never on the mass of the bob, since both the restoring force and inertia scale with mass identically.",
    equationLatex: "T = 2\\pi\\sqrt{\\frac{L}{g}}"
  },
  coreInteraction: "PARAMETER_SANDBOX",
  parameterSandboxConfig: {
    relationshipType: "LINEAR",
    primaryParamKey: "pendulumLength",
    outputKey: "period",
    outputLabel: "Oscillation Period",
    outputUnit: "s",
    coefficients: {
      a: 0.8232,
      b: 1.0074
    },
    yRange: {
      min: 1.0,
      max: 4.0
    },
    targetBand: {
      min: 2.3,
      max: 2.6,
      label: "Ice-Shelf Resonant Window"
    },
    formulaDisplayLatex: "T \\approx 0.82L + 1.01\\ \\text{s}"
  },
  predictionPrompt: "Will a heavy pendulum bob oscillate faster, slower, or at the same rate as a light bob of identical length, when released from the same angle?",
  predictionPresets: [
    {
      id: "shm-heavy-bob-slower",
      label: "🐢 The heavy bob will oscillate slower, since it takes more force to move a larger mass.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_SHM_MASS_DEPENDENCE",
      explanation: "For a gravity pendulum, both the restoring force and the inertia scale with mass identically, so mass cancels out entirely - T = 2π√(L/g) contains no mass term at all."
    },
    {
      id: "shm-wave-carries-matter",
      label: "🌊 The wave carried down the ice by the pendulum physically transports ice particles forward across the shelf.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_WAVE_TRANSPORTS_MATTER",
      explanation: "Waves transport energy, not matter - individual ice particles oscillate in place, passing energy to their neighbors, without being carried forward themselves."
    },
    {
      id: "shm-mass-independent",
      label: "🎯 Both bobs will oscillate at exactly the same period, since it depends only on length and gravity.",
      isMisconception: false,
      explanation: "Correct! T = 2π√(L/g) has no mass term - a heavy and light bob of identical length swing in perfect synchrony."
    }
  ],
  experimentFlow: {
    parameters: [
      {
        name: "pendulumLength",
        label: "Pendulum Length (L)",
        symbol: "L",
        min: 0.5,
        max: 3.0,
        step: 0.05,
        defaultValue: 0.8,
        unit: "m"
      }
    ],
    targets: {
      name: "period",
      label: "Ice-Shelf Resonant Window",
      min: 2.3,
      max: 2.6,
      unit: "s",
      hint: "Bring pendulum length close to 1.6-1.9 m to lock into the resonant window."
    }
  },
  reflectionPrompts: [
    "Explain why a heavier pendulum bob does not swing slower than a lighter one of the same length.",
    "Describe what would happen to the resonance if pendulum length were doubled from the value found in this mission.",
    "How does a wave carry energy through the ice sheet without carrying ice particles forward with it?"
  ],
  commonMisconceptions: [
    {
      id: "MISCONCEPTION_SHM_MASS_DEPENDENCE",
      name: "Mass-Dependent Period Fallacy",
      triggerCondition: "predictionPreset === 'shm-heavy-bob-slower'",
      pedagogicalAction: "Show that the sandbox's period-length relationship contains no mass parameter at all - period depends purely on length across the entire tested range."
    },
    {
      id: "MISCONCEPTION_WAVE_TRANSPORTS_MATTER",
      name: "Matter-Transport Wave Fallacy",
      triggerCondition: "predictionPreset === 'shm-wave-carries-matter'",
      pedagogicalAction: "Clarify the distinction between energy transport (what waves do) and matter transport (what waves do not do), using the seismic survey context as a concrete example."
    }
  ],
  socraticMentorDialogue: [
    {
      character: "Galileo Galilei",
      avatar: "GALILEO",
      introductoryRemark: "Welcome, cadet. I first noticed this myself, watching a lamp swing in a cathedral - its rhythm held steady regardless of how far it swung. Today, you shall discover it holds steady regardless of weight, too."
    },
    {
      character: "Sir Isaac Newton",
      avatar: "NEWTON",
      introductoryRemark: "Observe how the restoring force pulling the bob back to center, and the inertia resisting that pull, both scale with mass in perfect proportion - leaving the period untouched by mass entirely."
    }
  ],
  successConditions: {
    criteriaText: "Pendulum length calibrated so oscillation period falls between 2.3 and 2.6 seconds, locking into ice-shelf resonance.",
    rewardXP: 500,
    badgeUnlocked: {
      id: "harmonic-signature",
      name: "The Harmonic Signature"
    }
  },
  failureBehaviors: {
    impactCraters: false,
    previousTrajectories: true,
    radioTransmissions: [
      "Warning: pendulum period too short - resonance window not reached.",
      "Alert: pendulum period too long - ice shelf resonance overshoot."
    ]
  },
  worldMemory: {
    persistenceEnabled: true,
    maxMemorySlots: 5
  },
  scientificDiscoveries: [
    {
      id: "harmonic-signature",
      title: "The Harmonic Signature",
      description: "Nature's most diverse cycles - from pendulums to springs to orbits - are bound to the same clean, cyclical mathematics of a circle.",
      scientificInsight: "Galileo says: I measured this cathedral lamp against my own pulse and found a rhythm that cared nothing for how wide it swung - only for its length."
    }
  ],
  rewards: {
    xp: 500,
    badges: ["harmonic-signature"]
  },
  teacherNotes: "IMPORTANT APPROXIMATION NOTE: the true relationship T = 2*pi*sqrt(L/g) is a square-root function of L, but the PARAMETER_SANDBOX engine only supports LINEAR/QUADRATIC/INVERSE/EXPONENTIAL/RATE_LIMITED types. A LINEAR two-point fit across the domain (L=0.5m to L=3.0m) was used, since it's the least-distorting available option for a mildly-curved concave function over a modest ~6x domain range (unlike an INVERSE or QUADRATIC fit, which would show the wrong curvature direction entirely). At the domain midpoint (L=1.5m), the linear approximation gives T≈2.24s vs the true value of T≈2.46s (roughly 9% low) - a real but moderate deviation. The core lesson - mass-independence of pendulum period - remains valid and fully testable regardless of this curve-fit imprecision.",
  assessmentStrategy: "Formative Socratic evaluation of whether the student correctly identifies that pendulum period depends only on length and gravity, never on bob mass.",
  accessibilityNotes: "High-contrast crystal-blue ice backdrop with glowing sine-wave trace and clear numeric readout of pendulum length and period.",
  unlockConditions: {
    prerequisites: ["kinematics", "gravitation"]
  },
  missionDuration: 30,
  difficulty: "Advanced",
  prerequisites: ["kinematics", "gravitation"],
  guidedInquiries: [
    { label: "🔭 Ask Galileo about the cathedral lamp", text: "How did you first notice that a pendulum's period doesn't depend on how far it swings?" },
    { label: "🍎 Ask Newton about mass cancellation", text: "Why does a pendulum's restoring force and inertia cancel out to leave no mass term in the period?" }
  ]
};

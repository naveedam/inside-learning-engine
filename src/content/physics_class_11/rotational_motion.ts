/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mission } from "../../types";

export const rollingInertiaMission: Mission = {
  id: "gyration-tuning-descent",
  title: "Torque & Spin: Gyration Tuning",
  codename: "OPERATION: WIND-FIELD DESCENT",
  description: "An automated drone-wheel must traverse a steep planetary wind-turbine field. By shifting its internal mass distribution, it can trade rolling acceleration against spin - too much mass at the rim, and it lumbers down the slope in a lazy spin; too little, and it barely rotates at all.",
  objectives: [
    "Discover that linear acceleration down a slope depends on how mass is distributed relative to the axis (radius of gyration), not just on total mass.",
    "Observe that a = g·sinθ / (1 + k²), where k² is the dimensionless radius-of-gyration factor.",
    "Tune the drone's internal mass distribution to match a solid sphere's descent profile."
  ],
  steps: [
    {
      id: "briefing",
      type: "BRIEFING",
      title: "Wind-Turbine Field Descent Briefing",
      content: {
        narrative: `### MISSION ADVISORY: GYRATION CALIBRATION
Massive, storm-battered wind turbines pierce the swirling emerald clouds of this high-altitude planetary field. Our drone-wheel must descend a steep 30° maintenance ramp to reach a damaged turbine base.

The drone can dynamically shift internal counterweights — pulling mass inward toward the axle increases rolling acceleration but reduces stability; pushing mass outward to the rim increases stability but slows the descent, since more of its energy goes into spin rather than forward motion.

For any rolling body released from rest on a ramp of angle $\\theta$, the linear acceleration down the slope is:

$$a = \\frac{g \\sin\\theta}{1 + k^2}$$

where $k^2$ is the **radius of gyration factor** — a dimensionless number describing how far, on average, the drone's mass sits from its spin axis (a solid disk has $k^2 = 0.5$; a solid sphere, $k^2 = 0.4$; a thin hoop, $k^2 = 1.0$).

Engineering requires the drone match a **solid sphere's** descent profile — an acceleration between **3.3 and 3.7 m/s²** — to synchronize with the rest of the recovery convoy.`
      }
    },
    {
      id: "dialogue",
      type: "DIALOGUE",
      title: "Wind-Field Uplink",
      content: {
        dialogue: [
          {
            speaker: "Sir Isaac Newton",
            avatar: "NEWTON",
            message: "Take heed, cadet: two bodies of identical mass need not accelerate identically down this slope. A body's resistance to being spun depends not merely on how much matter it contains, but on how that matter is arranged about its axis of rotation."
          },
          {
            speaker: "Wind-Field Control",
            avatar: "SYSTEM",
            message: "Internal mass redistribution telemetry unlocked. Adjust the gyration factor and observe descent acceleration update in real time."
          }
        ]
      }
    },
    {
      id: "sandbox",
      type: "SANDBOX_EXPLORATION",
      title: "Gyration Calibration Sandbox",
      content: {
        simulationConfig: {
          simId: "ROTATIONAL_DESCENT",
          initialParameters: {
            gyrationFactor: 1.0
          },
          minMaxLimits: {
            gyrationFactor: [0, 1.2]
          },
          targetFormula: {
            latex: "a = \\frac{g \\sin\\theta}{1 + k^2} = \\frac{4.9}{1 + k^2}\\ \\text{m/s}^2",
            description: "Linear Descent Acceleration vs. Radius of Gyration Factor",
            variableLabels: {
              "k^2": "Radius of Gyration Factor (dimensionless)",
              "a": "Linear Descent Acceleration (m/s²)",
              "theta": "Ramp Angle (30°, fixed)"
            }
          }
        }
      }
    },
    {
      id: "challenge",
      type: "CHALLENGE_EXPERIMENT",
      title: "Solid-Sphere Synchronization",
      content: {
        challengeQuestion: {
          questionText: "The recovery convoy descends at a solid sphere's acceleration profile: between 3.3 and 3.7 m/s². Adjust the drone's gyration factor k² until its descent acceleration synchronizes with the convoy. What mass distribution does this correspond to?",
          formulaTrigger: "rotational_descent",
          targetValueRange: {
            min: 3.3,
            max: 3.7,
            targetVar: "descentAcceleration"
          },
          hint: "Lower k² means acceleration closer to g·sinθ (a point mass sliding, no rotation). A solid sphere's k² = 0.4 sits near the middle of your available range.",
          completionRewardXP: 500
        }
      }
    },
    {
      id: "debrief",
      type: "DEBRIEF",
      title: "Gyration Telemetry Debrief",
      content: {
        narrative: `### TARGET SECURED: SOLID-SPHERE PROFILE MATCHED
The drone-wheel's descent now synchronizes precisely with the recovery convoy, rolling in perfect formation down the ramp.

Notice what changed: not the drone's total mass, but *where* that mass sits relative to its axle. Pull mass toward the rim, and more of the available gravitational energy is diverted into spin rather than forward motion — the drone lags. Pull mass toward the center, and it accelerates like a body sliding freely, barely spinning at all.

**Achievement Unlocked: Gyroscope Pivot (ISC Class XI Physics — Rotational Motion)**`
      }
    }
  ],

  subject: "Physics",
  chapterName: "Torque & Spin: Rotational Kinematics & Rigid Bodies",
  learningObjectives: [
    "Discover that linear acceleration down a slope depends on how mass is distributed relative to the axis (radius of gyration), not just on total mass.",
    "Observe that a = g·sinθ / (1 + k²), where k² is the dimensionless radius-of-gyration factor.",
    "Tune the drone's internal mass distribution to match a solid sphere's descent profile."
  ],
  storyNarrative: "An automated drone-wheel must traverse a steep mountain pass by dynamically shifting its internal mass distribution: expanding weights outward increases inertia, pulling them inward increases spin speed.",
  world: {
    environmentName: "High-Altitude Planetary Wind-Turbine Field",
    visualAtmosphere: "Massive Spinning Turbine Blades & Swirling Emerald Storms",
    audioLandscape: "Howling wind, groaning turbine gears, distant electrical crackle"
  },
  coreScientificConcept: {
    name: "Moment of Inertia & Rolling Descent Acceleration",
    description: "A rolling body's linear acceleration down an incline is a = g sinθ / (1 + k²), where k² (radius of gyration squared, normalized by radius) captures how far its mass is distributed from the rotation axis. Two bodies of equal mass but different mass distribution accelerate differently.",
    equationLatex: "a = \\frac{g\\sin\\theta}{1+k^2}"
  },
  coreInteraction: "PARAMETER_SANDBOX",
  parameterSandboxConfig: {
    relationshipType: "INVERSE",
    primaryParamKey: "gyrationFactor",
    outputKey: "descentAcceleration",
    outputLabel: "Descent Acceleration",
    outputUnit: "m/s²",
    coefficients: {
      a: 4.9,
      b: 1,
      c: 0
    },
    yRange: {
      min: 2.0,
      max: 5.0
    },
    targetBand: {
      min: 3.3,
      max: 3.7,
      label: "Solid-Sphere Synchronization Band"
    },
    formulaDisplayLatex: "a = \\frac{4.9}{1+k^2}\\ \\text{m/s}^2"
  },
  predictionPrompt: "If a solid sphere and a thin hoop of identical mass and radius are released together down the same ramp, which reaches the bottom first?",
  predictionPresets: [
    {
      id: "rotation-mass-only",
      label: "⚖️ They reach the bottom at the same time, since they have identical mass and radius.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_INERTIA_IS_JUST_MASS",
      explanation: "Equal mass does not mean equal rotational inertia - the hoop's mass sits entirely at the rim (k²=1.0), while the sphere's mass is distributed throughout its volume (k²=0.4), giving them very different resistances to being spun."
    },
    {
      id: "rotation-hoop-faster",
      label: "🌀 The hoop reaches the bottom first, since it can spin more easily.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_HOOP_SPINS_FASTER",
      explanation: "Spinning more easily is not the same as accelerating down the slope faster - the hoop's rim-concentrated mass actually resists linear acceleration more than the sphere's does, since a = g sinθ/(1+k²) shrinks as k² grows."
    },
    {
      id: "rotation-sphere-faster",
      label: "🎯 The solid sphere reaches the bottom first, since its mass sits closer to the axis and less energy goes into spin.",
      isMisconception: false,
      explanation: "Correct! Lower k² (0.4 for a solid sphere vs 1.0 for a hoop) means more of the available energy converts to forward motion rather than rotation, giving a higher descent acceleration."
    }
  ],
  experimentFlow: {
    parameters: [
      {
        name: "gyrationFactor",
        label: "Radius of Gyration Factor (k²)",
        symbol: "k²",
        min: 0,
        max: 1.2,
        step: 0.02,
        defaultValue: 1.0,
        unit: "dimensionless"
      }
    ],
    targets: {
      name: "descentAcceleration",
      label: "Convoy-Synchronized Descent",
      min: 3.3,
      max: 3.7,
      unit: "m/s²",
      hint: "Bring the gyration factor close to 0.4 (a solid sphere's value) to synchronize with the convoy."
    }
  },
  reflectionPrompts: [
    "Explain why a hoop and a sphere of equal mass and radius do not accelerate identically down the same ramp.",
    "What mass distribution (what value of k²) would allow the fastest possible descent, and what physical object would that represent?",
    "Why does pulling mass toward the rim of a rotating body increase its resistance to changes in rotational speed?"
  ],
  commonMisconceptions: [
    {
      id: "MISCONCEPTION_INERTIA_IS_JUST_MASS",
      name: "Mass-Only Inertia Fallacy",
      triggerCondition: "predictionPreset === 'rotation-mass-only'",
      pedagogicalAction: "Show via the sandbox graph that descent acceleration changes substantially as the gyration factor k² varies, even though total mass never changes in this simulation."
    },
    {
      id: "MISCONCEPTION_HOOP_SPINS_FASTER",
      name: "Spin-Speed vs. Descent-Speed Confusion",
      triggerCondition: "predictionPreset === 'rotation-hoop-faster'",
      pedagogicalAction: "Clarify the distinction between angular velocity (how fast something spins) and linear descent acceleration (how fast it moves down the slope) - the hoop may spin at a high angular rate while still lagging in linear descent."
    }
  ],
  socraticMentorDialogue: [
    {
      character: "Sir Isaac Newton",
      avatar: "NEWTON",
      introductoryRemark: "Welcome, cadet. Observe how a body's resistance to rotation depends not on mass alone, but on the geometry of its arrangement about the axis - a lesson every bit as fundamental as my laws of straight-line motion."
    },
    {
      character: "Galileo Galilei",
      avatar: "GALILEO",
      introductoryRemark: "Greetings. I once rolled spheres down inclines to study falling bodies free of air's interference. Today, you shall discover that even the shape of the rolling body itself changes the story."
    }
  ],
  successConditions: {
    criteriaText: "Gyration factor tuned so descent acceleration falls between 3.3 and 3.7 m/s², matching a solid sphere's profile.",
    rewardXP: 500,
    badgeUnlocked: {
      id: "gyroscope-pivot",
      name: "Gyroscope Pivot"
    }
  },
  failureBehaviors: {
    impactCraters: false,
    previousTrajectories: true,
    radioTransmissions: [
      "Warning: descent acceleration too low - drone lagging behind convoy formation.",
      "Alert: descent acceleration too high - drone risks overtaking and colliding with convoy."
    ]
  },
  worldMemory: {
    persistenceEnabled: true,
    maxMemorySlots: 5
  },
  scientificDiscoveries: [
    {
      id: "gyroscope-pivot",
      title: "The Gyroscope Pivot",
      description: "Mass distribution relative to the rotation axis is as vital to rolling descent as total mass is to straight-line acceleration.",
      scientificInsight: "Newton says: Two bodies may share a mass, yet differ entirely in their resistance to a change in rotation - geometry itself becomes a kind of inertia."
    }
  ],
  rewards: {
    xp: 500,
    badges: ["gyroscope-pivot"]
  },
  teacherNotes: "This mission uses an exact closed-form fit: a = g·sinθ/(1+k²) with θ=30°, g=9.8 m/s² maps precisely onto the engine's INVERSE relationship type (a/(x+b)+c with a=4.9, b=1, c=0) - no approximation is needed here, unlike the Gravitation and later Kinetic Theory / Oscillations missions where the true relationship involves a square root the engine cannot represent exactly.",
  assessmentStrategy: "Formative Socratic evaluation of whether the student distinguishes angular velocity from linear descent acceleration, and correctly attributes the difference to mass distribution rather than total mass.",
  accessibilityNotes: "High-contrast emerald storm backdrop with clear numeric readout of gyration factor and descent acceleration.",
  unlockConditions: {
    prerequisites: ["newtons-laws", "energy-depths"]
  },
  missionDuration: 25,
  difficulty: "Advanced",
  prerequisites: ["newtons-laws", "energy-depths"],
  guidedInquiries: [
    { label: "🍎 Ask Newton about rotational resistance", text: "Why does a body's arrangement of mass matter as much as its total mass when it comes to rotation?" },
    { label: "🔭 Ask Galileo about rolling bodies", text: "How did your inclined-plane experiments relate to how rolling bodies behave today?" }
  ]
};

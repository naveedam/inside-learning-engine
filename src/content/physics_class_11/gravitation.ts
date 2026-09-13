/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mission } from "../../types";

export const orbitalInsertionMission: Mission = {
  id: "kepler-orbital-insertion",
  title: "Kepler's Gravity: Orbital Insertion",
  codename: "OPERATION: STABLE PERIAPSIS",
  description: "A mapping probe must enter a stable circular orbit around a dense neutron star remnant. Too slow, and it spirals into the crushing gravitational well; too fast, and it escapes the system forever. Calibrate the injection distance to find the velocity band that holds.",
  objectives: [
    "Discover that required orbital velocity v = √(GM/r) depends only on orbital distance and the star's mass, never on the probe's own mass.",
    "Observe that orbital velocity decreases as orbital distance increases.",
    "Find the injection distance that yields a stable, achievable orbital velocity within the propulsion system's safe band."
  ],
  steps: [
    {
      id: "briefing",
      type: "BRIEFING",
      title: "Deep Space Orbital Insertion Briefing",
      content: {
        narrative: `### MISSION ADVISORY: STELLAR REMNANT SURVEY
Our mapping probe has reached the edge of a dying star system, dominated by a single, impossibly dense neutron star remnant. Violet gravitational lensing warps the starfield behind it.

The probe's mission is to settle into a **stable circular orbit** — close enough to map the surface in detail, far enough to survive the tidal forces.

For any circular orbit at distance $r$ from a mass $M$, the required tangential velocity is:

$$v = \\sqrt{\\frac{GM}{r}}$$

Too slow at a given $r$, and the probe spirals inward, crushed against the remnant. Too fast, and it escapes into deep space, never to map anything.

Our propulsion system can reliably inject the probe at velocities between **190 km/s and 210 km/s**. Your task: calibrate the orbital insertion distance $r$ until the required velocity for a stable circular orbit falls inside that safe band.`
      }
    },
    {
      id: "dialogue",
      type: "DIALOGUE",
      title: "Deep Space Uplink",
      content: {
        dialogue: [
          {
            speaker: "Sir Isaac Newton",
            avatar: "NEWTON",
            message: "Observe, cadet: the force that holds a falling apple to the earth is the very same force that must balance the probe's flight around this remnant. Neither the apple's weight nor the probe's mass enters into the velocity required — only the distance, and the mass of the star it circles."
          },
          {
            speaker: "Mission Control",
            avatar: "SYSTEM",
            message: "Orbital insertion telemetry unlocked. Adjust the target orbital distance and observe the required circular-orbit velocity update in real time."
          }
        ]
      }
    },
    {
      id: "sandbox",
      type: "SANDBOX_EXPLORATION",
      title: "Orbital Insertion Sandbox",
      content: {
        simulationConfig: {
          simId: "ORBITAL_VELOCITY",
          initialParameters: {
            orbitalDistance: 16000
          },
          minMaxLimits: {
            orbitalDistance: [8000, 20000]
          },
          targetFormula: {
            latex: "v = \\sqrt{\\frac{GM}{r}} \\approx \\frac{2{,}000{,}000}{r}\\ \\text{(fitted near the target orbit)}",
            description: "Required Circular Orbital Velocity vs. Orbital Distance",
            variableLabels: {
              "r": "Orbital Distance (km)",
              "v": "Required Tangential Velocity (km/s)",
              "GM": "Standard Gravitational Parameter of the Remnant"
            }
          }
        }
      }
    },
    {
      id: "challenge",
      type: "CHALLENGE_EXPERIMENT",
      title: "Safe Injection Window",
      content: {
        challengeQuestion: {
          questionText: "The probe's propulsion system can safely inject at velocities between 190 and 210 km/s. Adjust the orbital distance r until the required orbital velocity falls inside that band. What distance stabilizes the orbit?",
          formulaTrigger: "orbital_velocity",
          targetValueRange: {
            min: 190,
            max: 210,
            targetVar: "requiredVelocity"
          },
          hint: "Required velocity falls as orbital distance grows. Near r = 10,000 km, the velocity lands close to 200 km/s.",
          completionRewardXP: 500
        }
      }
    },
    {
      id: "debrief",
      type: "DEBRIEF",
      title: "Orbital Telemetry Debrief",
      content: {
        narrative: `### TARGET SECURED: STABLE ORBIT ACHIEVED
Injection burn complete. The probe has settled into a stable circular orbit, sweeping equal areas of space in equal intervals of time — Kepler's Second Law, written directly into its flight path.

Notice what the required velocity never depended on: the probe's own mass. Whether it weighed ten kilograms or ten tonnes, the same orbital distance would demand the same velocity. Gravity accelerates every mass identically — the heavier probe would need more force to hold it in orbit, but gravity supplies exactly that much more, in perfect proportion.

**Achievement Unlocked: Stable Periapsis (ISC Class XI Physics — Gravitation)**`
      }
    }
  ],

  subject: "Physics",
  chapterName: "Kepler's Gravity: Gravitation",
  learningObjectives: [
    "Discover that required orbital velocity v = √(GM/r) depends only on orbital distance and the star's mass, never on the probe's own mass.",
    "Observe that orbital velocity decreases as orbital distance increases.",
    "Find the injection distance that yields a stable, achievable orbital velocity within the propulsion system's safe band."
  ],
  storyNarrative: "A mapping probe needs to enter a stable orbit around a dense neutron star remnant. If its speed is too slow for the chosen distance, it falls into the gravitational well; if too fast, it escapes the system forever.",
  world: {
    environmentName: "Edge of a Dying Star System",
    visualAtmosphere: "Violet Gravitational Lensing & Glowing Accretion Disk",
    audioLandscape: "Deep space hum, distant stellar static, soft telemetry pings"
  },
  coreScientificConcept: {
    name: "Universal Law of Gravitation & Circular Orbital Velocity",
    description: "For a stable circular orbit at distance r around a mass M, the required tangential velocity is v = √(GM/r) — independent of the orbiting body's own mass, since both gravitational force and inertia scale with that mass identically.",
    equationLatex: "v = \\sqrt{\\frac{GM}{r}}"
  },
  coreInteraction: "PARAMETER_SANDBOX",
  parameterSandboxConfig: {
    relationshipType: "INVERSE",
    primaryParamKey: "orbitalDistance",
    outputKey: "requiredVelocity",
    outputLabel: "Required Orbital Velocity",
    outputUnit: "km/s",
    coefficients: {
      a: 2000000,
      b: 0,
      c: 0
    },
    yRange: {
      min: 50,
      max: 280
    },
    targetBand: {
      min: 190,
      max: 210,
      label: "Safe Injection Velocity Band"
    },
    formulaDisplayLatex: "v \\approx \\frac{2{,}000{,}000}{r}\\ \\xrightarrow{r \\to 10{,}000\\text{km}} 200\\ \\text{km/s}"
  },
  predictionPrompt: "As the probe's target orbital distance r increases, what happens to the velocity required to hold a stable circular orbit — and does that required velocity depend on how heavy the probe itself is?",
  predictionPresets: [
    {
      id: "orbit-mass-dependent",
      label: "⚖️ A heavier probe needs a faster injection velocity to hold the same orbit than a lighter one.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_MASS_DEPENDENT_ORBIT",
      explanation: "Gravitational force and inertia both scale with the probe's mass identically, so the mass cancels out of the orbital velocity equation entirely — a heavier and lighter probe need the exact same velocity at the same distance."
    },
    {
      id: "orbit-velocity-independent-radius",
      label: "➡️ Required orbital velocity stays roughly the same regardless of orbital distance.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_ORBIT_VELOCITY_CONSTANT",
      explanation: "Required velocity falls as distance grows — a probe orbiting closer to the remnant must move much faster to avoid falling in, while a distant probe can orbit much more slowly."
    },
    {
      id: "orbit-inverse-sqrt-radius",
      label: "🎯 Required orbital velocity decreases as orbital distance increases, and never depends on the probe's own mass.",
      isMisconception: false,
      explanation: "Correct! v = √(GM/r) — velocity falls off as distance grows, and the probe's own mass never appears in the equation at all."
    }
  ],
  experimentFlow: {
    parameters: [
      {
        name: "orbitalDistance",
        label: "Target Orbital Distance (r)",
        symbol: "r",
        min: 8000,
        max: 20000,
        step: 250,
        defaultValue: 16000,
        unit: "km"
      }
    ],
    targets: {
      name: "requiredVelocity",
      label: "Safe Injection Velocity",
      min: 190,
      max: 210,
      unit: "km/s",
      hint: "Bring the orbital distance close to 10,000 km to land the required velocity inside the safe injection band."
    }
  },
  reflectionPrompts: [
    "Explain why the probe's own mass never appears in the orbital velocity equation, even though heavier objects feel more gravitational force.",
    "Describe what would physically happen to the probe if it were injected at 210 km/s while targeting an orbital distance of 20,000 km.",
    "Why does a closer orbit demand a faster velocity than a farther one, even though both are stable circular orbits?"
  ],
  commonMisconceptions: [
    {
      id: "MISCONCEPTION_MASS_DEPENDENT_ORBIT",
      name: "Mass-Dependent Orbit Fallacy",
      triggerCondition: "predictionPreset === 'orbit-mass-dependent'",
      pedagogicalAction: "Show algebraically that setting gravitational force equal to centripetal force (GMm/r² = mv²/r) cancels the probe's mass m from both sides, leaving v = √(GM/r) with no dependence on m."
    },
    {
      id: "MISCONCEPTION_ORBIT_VELOCITY_CONSTANT",
      name: "Distance-Independent Velocity Fallacy",
      triggerCondition: "predictionPreset === 'orbit-velocity-independent-radius'",
      pedagogicalAction: "Demonstrate via the sandbox graph that required velocity falls measurably as orbital distance increases across the full 8,000-20,000 km range."
    }
  ],
  socraticMentorDialogue: [
    {
      character: "Sir Isaac Newton",
      avatar: "NEWTON",
      introductoryRemark: "Welcome, cadet. The same universal force that pulls an apple to the ground holds this probe in its endless fall around the remnant — a fall that simply never reaches the ground, because the ground curves away beneath it."
    },
    {
      character: "Galileo Galilei",
      avatar: "GALILEO",
      introductoryRemark: "Greetings. Consider: a cannonball fired fast enough never lands at all, but circles the world forever. This probe is no different — merely falling around a star instead of a planet."
    },
    {
      character: "Dr. Richard Feynman",
      avatar: "FEYNMAN",
      introductoryRemark: "Here's the fun part: astronauts don't float because there's no gravity up there. There's plenty of gravity! They float because they, their ship, and everything in it are all falling together, at exactly the same rate. Let's find the exact fall that becomes an orbit."
    }
  ],
  successConditions: {
    criteriaText: "Orbital distance calibrated so the required circular orbital velocity falls between 190 and 210 km/s.",
    rewardXP: 500,
    badgeUnlocked: {
      id: "stable-periapsis",
      name: "Stable Periapsis"
    }
  },
  failureBehaviors: {
    impactCraters: true,
    previousTrajectories: true,
    radioTransmissions: [
      "Warning: required velocity exceeds safe injection range - orbit unreachable at this distance.",
      "Alert: probe trajectory unstable - recalibrate orbital distance before injection burn."
    ]
  },
  worldMemory: {
    persistenceEnabled: true,
    maxMemorySlots: 5
  },
  scientificDiscoveries: [
    {
      id: "mass-independent-orbit",
      title: "The Mass-Independent Orbit",
      description: "Required orbital velocity depends only on orbital distance and the central mass, never on the orbiting body's own mass.",
      scientificInsight: "Newton says: The same proportion that gives a body its weight also gives it its resistance to being moved. Increase the mass, and both grow together, canceling out perfectly."
    },
    {
      id: "continuous-freefall",
      title: "Orbit as Continuous Freefall",
      description: "An object in stable orbit is not experiencing zero gravity - it is in continuous freefall, moving fast enough sideways that the ground curves away beneath it at the same rate it falls.",
      scientificInsight: "Feynman says: There's no such place as 'zero gravity' near a planet or star. What astronauts feel is weightlessness from falling, not an absence of gravitational pull."
    }
  ],
  rewards: {
    xp: 500,
    badges: ["stable-periapsis"]
  },
  teacherNotes: "This mission uses the engine's INVERSE curve type (v = a/r) as a pedagogical approximation of the true v = √(GM/r) relationship, since the underlying PARAMETER_SANDBOX engine supports only integer-power relationship types. Coefficients are fitted so the curve is exact at the target orbit (r=10,000km, v=200km/s, matching the roadmap's example) - the displayed curve shape deviates modestly from true 1/√r behavior at the extremes of the slider range (roughly +12% at r=8,000km and -29% at r=20,000km relative to true values), which is worth mentioning explicitly if a student asks why the graph's exact shape differs slightly from the textbook curve. The core physics lesson - mass-independence and the inverse relationship with distance - is preserved and testable regardless of the curve-fit imprecision.",
  assessmentStrategy: "Formative Socratic evaluation of whether the student correctly separates the roles of orbital distance and probe mass in determining required orbital velocity.",
  accessibilityNotes: "High-contrast violet-on-black orbital HUD with clear numeric readout of required velocity and target band highlighting.",
  unlockConditions: {
    prerequisites: ["kinematics"]
  },
  missionDuration: 30,
  difficulty: "Intermediate",
  prerequisites: ["kinematics"],
  guidedInquiries: [
    { label: "🍎 Ask Newton why mass cancels out", text: "Why doesn't a heavier probe need a different orbital velocity than a lighter one at the same distance?" },
    { label: "🔭 Ask Galileo about the cannonball", text: "How is a stable orbit related to a cannonball fired fast enough to never land?" },
    { label: "🥁 Ask Feynman about zero gravity", text: "If astronauts feel weightless, does that mean there's no gravity where they are?" }
  ]
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurriculumPack, Chapter } from "../../types";

export const limitsAndDerivativesChapter: Chapter = {
  id: "limits-and-derivatives",
  title: "Limits & Derivatives",
  shortDescription: "Transition from average secant intervals to instantaneous tangential rates.",
  longDescription: "Stand at the orbital drafting tables of the Celestial Observatory. Zoom into non-linear coastline trajectories, shrink secant intervals toward zero, and witness the emergence of the derivative.",
  difficulty: "Intermediate",
  estimatedMinutes: 25,
  constellationPosition: { x: 45, y: 55 },
  curricularRequirements: [
    "Understanding the difference between average rate of change (secant) and instantaneous rate of change (tangent).",
    "Evaluation of limits of difference quotients as the increment approaches zero (lim Δx -> 0 [f(x0 + Δx) - f(x0)] / Δx).",
    "Overcoming the misconception that a derivative is merely a very steep or microscopic secant line."
  ],
  missions: [
    {
      id: "vanishing-secant",
      title: "The Vanishing Secant",
      codename: "OPERATION: APEX TANGENT",
      description: "Chart an uncharted archipelagic coastline curve from orbital survey imagery. Slide the survey probe coordinate toward the anchor point to discover the exact instantaneous steepness at a single point.",
      objectives: [
        "Calculate the secant slope m_sec = (f(x) - f(x_0)) / (x - x_0) across varying chord intervals.",
        "Observe the stabilization of the difference quotient as x approaches x_0.",
        "Discover that instantaneous rate (derivative) is a distinct point-specific property, not just a small secant."
      ],
      steps: [
        {
          id: "briefing",
          type: "BRIEFING",
          title: "Astraea Orbital Observatory Cartography Briefing",
          content: {
            narrative: `### MISSION ADVISORY: ORBITAL CHARTING
Welcome to the high cupola of the Astraea Orbital Observatory. Below us, the glaciated jagged headland of Cape Archimedes follows a parabolic profile $f(x) = x^2$ on our glowing cartographic drafting table.

Our automated survey probe needs to execute a laser surface scan precisely along the coastline's **instantaneous direction of travel** at anchor coordinate $x_0 = 1.0\\text{ km}$ (where $y_0 = 1.0\\text{ km}$).

When our survey points are distant (e.g., measuring between $x_0 = 1.0$ and $x = 5.0$), the chord line—the **secant line**—drastically cuts across bays and open water, giving a misleading average slope of $\\frac{25 - 1}{5 - 1} = 6.0$.

To align the orbital spectrometer with the true shoreline contour, we must bring the secondary survey coordinate $x$ closer and closer to $x_0 = 1.0$.

$$\\lim_{x \\to 1.0} \\frac{f(x) - f(1.0)}{x - 1.0} = \\lim_{x \\to 1.0} \\frac{x^2 - 1}{x - 1} = \\lim_{x \\to 1.0} (x + 1) = 2.0$$

Your task: Calibrate the secondary probe position $x$ down toward $x_0 = 1.0$ until the secant slope stabilizes inside the precision tolerance band of $[2.0, 2.3]$.`
          }
        },
        {
          id: "dialogue",
          type: "DIALOGUE",
          title: "Observatory Socratic Uplink",
          content: {
            dialogue: [
              {
                speaker: "Dr. Richard Feynman",
                avatar: "FEYNMAN",
                message: "Hey! When people first hear about calculus, they think it's some terrifying algebraic monster. But look at that curve on your drafting table! You pick two dots, draw a ruler between them, that's an average slope. But what happens if you slide the second dot right on top of the first dot? Does the slope blow up to infinity? Does it disappear into zero? Let's find out!"
              },
              {
                speaker: "Observatory Cartographer",
                avatar: "SYSTEM",
                message: "Secondary survey probe telemetry is unlocked. The anchor is locked at x_0 = 1.0. We are ready to slide the survey coordinate along the parabolic coast."
              }
            ]
          }
        },
        {
          id: "sandbox",
          type: "SANDBOX_EXPLORATION",
          title: "Cartographic Secant Sandbox",
          content: {
            simulationConfig: {
              simId: "SECANT_LIMIT",
              initialParameters: {
                xPosition: 4.0
              },
              minMaxLimits: {
                xPosition: [1.05, 6.0]
              },
              targetFormula: {
                latex: "m_{\\text{sec}} = \\frac{f(x) - f(x_0)}{x - x_0} = \\frac{x^2 - 1}{x - 1} = x + 1",
                description: "Secant Slope to Tangent Limit on f(x) = x²",
                variableLabels: {
                  "x": "Position of Secondary Probe (km)",
                  "x_0": "Fixed Anchor Point (1.0 km)",
                  "m_sec": "Secant Slope (Steepness)"
                }
              }
            }
          }
        },
        {
          id: "challenge",
          type: "CHALLENGE_EXPERIMENT",
          title: "The Vanishing Secant Alignment",
          content: {
            challengeQuestion: {
              questionText: "The orbital laser requires an instantaneous slope reading within [2.00, 2.30] to lock its focal mirrors. Slide the secondary probe position x down from 5.0 towards 1.0 on the drafting table. At what value of x does the slope stabilize inside the target band?",
              formulaTrigger: "secant_slope",
              targetValueRange: {
                min: 2.0,
                max: 2.3,
                targetVar: "slope"
              },
              hint: "Notice that for f(x) = x² at x_0 = 1, the secant slope simplifies to m_sec = x + 1. If you set x = 1.2 km, what does the slope become? How close can you get before 0/0 occurs?",
              completionRewardXP: 500
            }
          }
        },
        {
          id: "debrief",
          type: "DEBRIEF",
          title: "Cartographic Telemetry Debrief",
          content: {
            narrative: `### TARGET SECURED: THE TANGENT EMERGES
Spectrometer locked at $m = 2.00$! The laser beam traces the sheer cliff edge of Cape Archimedes with sub-millimeter precision.

By sliding the secondary survey dot down toward $x_0 = 1.0$, you watched the difference quotient $\\frac{\\Delta y}{\\Delta x}$ stabilize rather than collapse to zero or blow up to infinity.

You did not merely find a 'very short secant line'—you crossed the threshold of the limit to discover the **instantaneous rate of change**: the tangent vector.

**Achievement Unlocked: The Vanishing Secant (ISC Class XI Mathematics)**`
          }
        }
      ],

      // --- CURRICULUM & REUSABLE ENGINE METADATA ---
      subject: "Mathematics",
      chapterName: "Limits & Derivatives: Tangents & Rates of Change",
      learningObjectives: [
        "Calculate the secant slope m_sec = (f(x) - f(x_0)) / (x - x_0) across varying chord intervals.",
        "Observe the stabilization of the difference quotient as x approaches x_0.",
        "Discover that instantaneous rate (derivative) is a distinct point-specific property, not just a small secant."
      ],
      storyNarrative: "A cartographer in an orbital observatory charting a coastline curve from above, needing the exact steepness at a single point rather than between two distant points.",
      world: {
        environmentName: "Astraea Orbital Observatory, High Orbit",
        visualAtmosphere: "Golden Starlight & Cyan Grid Drafting Table",
        audioLandscape: "Whispering servo motors and cosmic optical telescope hum"
      },
      coreScientificConcept: {
        name: "Limit of the Difference Quotient (The Derivative)",
        description: "As the interval Δx shrinks toward zero, the secant slope between two points stabilizes to the slope of the tangent line at that single point: f'(x) = lim_{h -> 0} [f(x+h) - f(x)] / h.",
        equationLatex: "f'(x_0) = \\lim_{x \\to x_0} \\frac{f(x) - f(x_0)}{x - x_0}"
      },
      coreInteraction: "PARAMETER_SANDBOX",
      parameterSandboxConfig: {
        relationshipType: "LINEAR",
        primaryParamKey: "xPosition",
        outputKey: "secantSlope",
        outputLabel: "Secant Slope (m)",
        outputUnit: "slope",
        coefficients: {
          a: 1.0, // m_sec = 1.0 * x + 1.0
          b: 1.0
        },
        yRange: {
          min: 0,
          max: 8.0
        },
        targetBand: {
          min: 2.0,
          max: 2.3,
          label: "Instantaneous Tangent Band"
        },
        formulaDisplayLatex: "m_{\\text{sec}} = x + 1.0 \\xrightarrow{x \\to 1.0} 2.0"
      },
      predictionPrompt: "For the curve f(x) = x² anchored at x₀ = 1.0, as the secondary probe x slides down from 5.0 toward 1.0, what will happen to the computed secant slope m_sec = (x² - 1)/(x - 1)?",
      predictionPresets: [
        {
          id: "slope-shrinks-to-zero",
          label: "📉 The slope shrinks to zero because the distance Δx between the points vanishes.",
          isMisconception: true,
          misconceptionId: "MISCONCEPTION_DERIVATIVE_VANISHES_TO_ZERO",
          explanation: "Although the interval Δx goes to zero, the vertical drop Δy also goes to zero at the exact same rate, forming a finite 0/0 limit!"
        },
        {
          id: "slope-diverges",
          label: "💥 The slope diverges to infinity because dividing by Δx = 0 produces an infinite spike.",
          isMisconception: true,
          misconceptionId: "MISCONCEPTION_DERIVATIVE_BLOWS_UP",
          explanation: "Division by an approaching zero is balanced by the numerator also approaching zero: (x² - 1)/(x - 1) = x + 1, which smoothly approaches 2."
        },
        {
          id: "slope-stabilizes",
          label: "🎯 The slope stabilizes to a finite constant (m = 2.0), revealing the exact tangent rate.",
          isMisconception: false,
          explanation: "Correct! As x → 1.0, m_sec = (x² - 1)/(x - 1) = x + 1 → 2.0. The secant line becomes the tangent line!"
        }
      ],
      experimentFlow: {
        parameters: [
          {
            name: "xPosition",
            label: "Secondary Probe Position (x)",
            symbol: "x",
            min: 1.05,
            max: 6.0,
            step: 0.05,
            defaultValue: 4.5,
            unit: "km"
          }
        ],
        targets: {
          name: "secantSlope",
          label: "Instantaneous Tangent Target",
          min: 2.0,
          max: 2.3,
          unit: "slope",
          hint: "Bring the probe closer to x = 1.0 km to enter the tangent target band [2.00, 2.30]."
        }
      },
      reflectionPrompts: [
        "Shrinking the distance between two points does not make the slope zero; both Δy and Δx shrink together into a finite ratio.",
        "The derivative is not merely a very small secant line—it is a point-specific property describing instantaneous steepness.",
        "As x approaches 1.0 km, the geometric secant chord rotates and locks into the unique tangent line of Cape Archimedes."
      ],
      commonMisconceptions: [
        {
          id: "MISCONCEPTION_DERIVATIVE_VANISHES_TO_ZERO",
          name: "Zero Delta Fallacy",
          triggerCondition: "predictionPreset === 'slope-shrinks-to-zero'",
          pedagogicalAction: "Show that Δy/Δx is an indeterminate form 0/0 that simplifies to (x + 1), stabilizing at 2.0."
        },
        {
          id: "MISCONCEPTION_DERIVATIVE_BLOWS_UP",
          name: "Division By Zero Fallacy",
          triggerCondition: "predictionPreset === 'slope-diverges'",
          pedagogicalAction: "Demonstrate algebraic cancellation of the (x - 1) factor, preventing any infinite explosion."
        }
      ],
      socraticMentorDialogue: [
        {
          character: "Dr. Richard Feynman",
          avatar: "FEYNMAN",
          introductoryRemark: "Welcome to the drafting table! People get hung up on calculus formulas, but it's just about speedometers and slopes. Let's see what happens to our secant line when you push that second dot right up against the first one!"
        },
        {
          character: "Sir Isaac Newton",
          avatar: "NEWTON",
          introductoryRemark: "Welcome, geometer. The ratio of vanishing increments—the ultimate ratio of fluxions—is not zero, but a definite proportion. Observe the approach to the tangent."
        },
        {
          character: "Galileo Galilei",
          avatar: "GALILEO",
          introductoryRemark: "Greetings, cartographer of the skies. Let us measure the steepness of this coastal arc by the true geometry of lines."
        }
      ],
      successConditions: {
        criteriaText: "Probe position adjusted to yield a secant slope between 2.00 and 2.30.",
        rewardXP: 500,
        badgeUnlocked: {
          id: "tangent-cartographer",
          name: "Tangent Cartographer"
        }
      },
      failureBehaviors: {
        impactCraters: false,
        previousTrajectories: true,
        radioTransmissions: [
          "Warning: Survey probe too distant from anchor! Secant cutting across open waters (overshot slope).",
          "Alert: Secondary probe position is yielding excessive chord divergence."
        ]
      },
      worldMemory: {
        persistenceEnabled: true,
        maxMemorySlots: 5
      },
      scientificDiscoveries: [
        {
          id: "instantaneous-rate",
          title: "The Instantaneous Rate",
          description: "The slope stabilizes to a fixed value (m = 2.0) independent of the second point's position once close enough.",
          scientificInsight: "Feynman says: That's the derivative right there! When you look at an infinitesimal slice of a smooth curve, it looks like a straight line with a definite slope."
        },
        {
          id: "algebraic-vanishing",
          title: "Indeterminate Resolution",
          description: "The 0/0 ratio cancels algebraically into a continuous polynomial (x + 1) that evaluates smoothly at x = 1.",
          scientificInsight: "Newton says: The ultimate ratio is not the ratio of nothing to nothing, but the limit to which the ratios ever approach."
        }
      ],
      rewards: {
        xp: 500,
        badges: ["tangent-cartographer"]
      },
      teacherNotes: "This mission introduces the fundamental definition of the derivative as the limit of a difference quotient for f(x) = x² at x = 1. Guide students to observe the cancellation (x²-1)/(x-1) = x+1.",
      assessmentStrategy: "Formative Socratic evaluation on student's understanding of indeterminate 0/0 forms and limit stabilization.",
      accessibilityNotes: "High-contrast golden drafting table grid with clear numeric readouts of secant slope m_sec and coordinates.",
      unlockConditions: {
        minXP: 0
      },
      missionDuration: 20,
      difficulty: "Intermediate",
      prerequisites: [],
      guidedInquiries: [
        { label: "🥁 Ask Feynman what a derivative really means", text: "Why do we say the derivative at a point is qualitatively different from just a very tiny secant line?" },
        { label: "🍎 Ask Newton about vanishing fluxions", text: "How did you resolve the paradox of dividing by an increment that is becoming zero without producing infinity?" },
        { label: "🔭 Ask Galileo about parabolic geometry", text: "How does the geometry of a parabola dictate that its tangent steepness increases linearly with position?" }
      ]
    }
  ]
};

export const mathematicsClass11Curriculum: CurriculumPack = {
  id: "mathematics-class-11",
  subject: "Mathematics",
  grade: "ISC Class XI",
  icon: "Compass",
  accentColor: "amber",
  chapters: [limitsAndDerivativesChapter]
};

export default mathematicsClass11Curriculum;

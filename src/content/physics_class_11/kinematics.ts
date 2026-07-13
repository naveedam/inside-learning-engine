/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurriculumPack } from "../../types";

export const physicsClass11Curriculum: CurriculumPack = {
  id: "physics-class-11",
  subject: "Physics",
  grade: "ISC Class XI",
  icon: "Atom",
  accentColor: "cyan",
  chapters: [
    {
      id: "kinematics",
      title: "Kinematics: Vector Fields & Parabolic Paths",
      shortDescription: "Master the geometry of motion, split vector components, and conquer gravity fields.",
      longDescription: "Calibrate thrust and project trajectories on foreign worlds. Discover how uniform horizontal velocities combine with accelerated gravitational falls to shape perfect parabolas.",
      difficulty: "Intermediate",
      estimatedMinutes: 20,
      constellationPosition: { x: 32, y: 48 },
      curricularRequirements: [
        "Study of motion in two dimensions: separating vector velocity components on orthogonal plane coordinates.",
        "Investigation of parabolic kinematics trails: establishing peak height trajectory bounds under gravitational force fields.",
        "Deriving the Range formula of a projectile and using quadratic ratios to determine perfect impact coordinates."
      ],
      missions: [
        {
          id: "crate-drop",
          title: "Parabolic Precision on Mars",
          codename: "OPERATION: CRATE DROP",
          description: "Launch an electromagnetic linear payload module across a Martian mountain range to deliver oxygen reserves to a stranded survey team.",
          objectives: [
            "Deconstruct a projectile's path into independent horizontal and vertical vectors.",
            "Derive the parabolic trajectory mathematical equation empirically.",
            "Clear a 140m volcanic peak and land the cargo in a narrow 780m-820m safety zone."
          ],
          steps: [
            {
              id: "briefing",
              type: "BRIEFING",
              title: "Astraea Base Emergency Briefing",
              content: {
                narrative: `### CRISIS DECLARED: THARSIS PLATEAU
An intense dust storm has isolated our Tharsis Survey Team. Atmospheric density is highly unstable, preventing traditional quadcopter flight. 

Our team is down to 4 hours of emergency oxygen. 

To deliver survival canisters, we must utilize our **High-Velocity Linear Railgun Launcher**. The canisters must clear a **140-meter tall volcanic ridge** situated exactly **400 meters away** from our launchpad, and land safely in the Tharsis Basin target coordinates between **780m and 820m**.

You are the Mission Control Trajectory Operator. Your commands control the electromagnetic launch velocity ($v_0$) and projection angle ($\\theta$). Martian gravity ($g = 3.72 \\text{ m/s}^2$) is constant.`
              }
            },
            {
              id: "dialogue",
              type: "DIALOGUE",
              title: "Astraea Base Socratic Uplink",
              content: {
                dialogue: [
                  {
                    speaker: "Galileo Galilei",
                    avatar: "GALILEO",
                    message: "Greetings, Operator. To conquer this mountain, do not see a single path. See two. One path runs horizontally, unaffected by gravity, preserving its horizontal velocity. The other path rises and falls, driven by the steady pull of acceleration."
                  },
                  {
                    speaker: "Galileo Galilei",
                    avatar: "GALILEO",
                    message: "Operate the telemetry sandbox in the next step. Adjust the horizontal push and gravity and see how they combine. Nature writes her secrets in coordinate lines. What shape emerges when you combine steady motion with acceleration?"
                  }
                ]
              }
            },
            {
              id: "sandbox",
              type: "SANDBOX_EXPLORATION",
              title: "Atmospheric Vector Testbed",
              content: {
                simulationConfig: {
                  simId: "PROJECTILE_MOTION",
                  initialParameters: {
                    velocity: 55,
                    angle: 45,
                    gravity: 3.72
                  },
                  minMaxLimits: {
                    velocity: [20, 110],
                    angle: [15, 85],
                    gravity: [1.62, 24.79]
                  },
                  targetFormula: {
                    latex: "y = x \\tan(\\theta) - \\frac{g x^2}{2 v_0^2 \\cos^2(\\theta)}",
                    description: "Equation of Projectile Trajectory",
                    variableLabels: {
                      "v_0": "Launch Velocity (m/s)",
                      "theta": "Elevation Angle (degrees)",
                      "g": "Gravitational Acceleration (m/s²)"
                    }
                  }
                }
              }
            },
            {
              id: "challenge",
              type: "CHALLENGE_EXPERIMENT",
              title: "The Tharsis Pass Challenge",
              content: {
                challengeQuestion: {
                  questionText: "The ridge peak rises 140 meters high at x = 400m. The Tharsis Landing Zone lies between 780m and 820m. Lock your elevation angle to exactly 45 degrees, and calibrate your launch velocity ($v_0$) so that your supply crate clears the peak and lands successfully inside the designated zone!",
                  formulaTrigger: "projectile_range",
                  targetValueRange: {
                    min: 780,
                    max: 820,
                    targetVar: "range"
                  },
                  hint: "Recall that at 45 degrees, the Range equation simplifies beautifully: $R = v_0^2 / g$. If your target landing coordinate is $R = 800\\text{ m}$, use $v_0 = \\sqrt{R \\times g}$. Double-check if that velocity is sufficient to clear the 140m peak!",
                  completionRewardXP: 500
                }
              }
            },
            {
              id: "debrief",
              type: "DEBRIEF",
              title: "Mission Debriefing",
              content: {
                narrative: `### TARGET SECURED: SUPPLIES DELIVERED
Telemetry readings confirm a perfect landing coordinates touchdown. The survival capsule came to a rest safely within the basin floor.

Oxygen replenishment lines have been connected. The Tharsis survey crew has been stabilized.

By decoupling independent vectors, you have proven that physical mathematics is not a set of memorized rules. It is an instrument of cosmic survival.

**Achievement Unlocked: Kinematics Pioneer (ISC Class XI Module 1)**`
              }
            }
          ],

          // --- REUSABLE MISSION FACTORY SCHEMA ADDITIONS (Milestone 3) ---
          subject: "Physics",
          chapterName: "Kinematics: Vector Fields & Parabolic Paths",
          learningObjectives: [
            "Deconstruct a projectile's path into independent horizontal and vertical vectors.",
            "Derive the parabolic trajectory mathematical equation empirically.",
            "Clear a 140m volcanic peak and land the cargo in a narrow 780m-820m safety zone."
          ],
          storyNarrative: "Launch an electromagnetic linear payload module across a Martian mountain range to deliver oxygen reserves to a stranded survey team.",
          world: {
            environmentName: "Astraea Base Ridge, Mars",
            visualAtmosphere: "Martian Sunset (Dust and Crimson Sky)",
            audioLandscape: "Wind hum and magnetic railgun charges"
          },
          coreScientificConcept: {
            name: "Vector Decomposition of Projectile Trajectories",
            description: "A projectile's vertical flight decelerates and accelerates symmetrically under gravity while its horizontal glide remains at constant velocity, tracing a parabolic curve.",
            equationLatex: "y = x \\tan(\\theta) - \\frac{g x^2}{2 v_0^2 \\cos^2(\\theta)}"
          },
          coreInteraction: "PROJECTILE_AIMING",
          predictionPrompt: "Where will the supply canister land under Mars gravity if launched at 45 degrees elevation angle? What will happen if we change the payload weight?",
          predictionPresets: [
            {
              id: "mass-float",
              label: "📦 Lighter Wood/Lithium is buoyant, so it travels further",
              isMisconception: true,
              misconceptionId: "MISCONCEPTION_MASS_DEPENDENT_GRAVITY",
              explanation: "Gravity accelerates all masses at the exact same rate in vacuo."
            },
            {
              id: "mass-heavy",
              label: "⛓️ Heavy Iron Safe falls much faster under Mars gravity",
              isMisconception: true,
              misconceptionId: "MISCONCEPTION_MASS_DEPENDENT_GRAVITY",
              explanation: "Mass cancels out in the equations of motion; acceleration is constant."
            },
            {
              id: "mass-equal",
              label: "⚖️ Gravity is independent of mass; the arc will be identical",
              isMisconception: false,
              explanation: "Excellent! Galileo proven."
            },
            {
              id: "angle-45",
              label: "📐 45° splits horizontal & vertical velocities equally for peak distance",
              isMisconception: false
            }
          ],
          experimentFlow: {
            parameters: [
              {
                name: "velocity",
                label: "Muzzle Velocity",
                symbol: "v_0",
                min: 30,
                max: 150,
                step: 1,
                defaultValue: 55,
                unit: "m/s"
              },
              {
                name: "angle",
                label: "Elevation Angle",
                symbol: "\\theta",
                min: 10,
                max: 85,
                step: 1,
                defaultValue: 45,
                unit: "°"
              },
              {
                name: "gravity",
                label: "Mars Gravity",
                symbol: "g",
                min: 1.0,
                max: 9.8,
                step: 0.1,
                defaultValue: 3.72,
                unit: "m/s²"
              }
            ],
            targets: {
              name: "range",
              label: "Tharsis Recovery Zone",
              min: 780,
              max: 820,
              unit: "m",
              hint: "Aim to land exactly between 780m and 820m."
            }
          },
          reflectionPrompts: [
            "We found out that gravity exerts equal acceleration regardless of the cargo's mass.",
            "The low gravity of Mars means we need less angle to clear the Tharsis basalt peak.",
            "Splitting the vectors proved that horizontal speed stays perfectly constant during flight."
          ],
          commonMisconceptions: [
            {
              id: "MISCONCEPTION_MASS_DEPENDENT_GRAVITY",
              name: "Mass-Dependent Gravity",
              triggerCondition: "cargoMass !== 100",
              pedagogicalAction: "Trigger simultaneous comparative drop of Wood crate and Iron safe on the Canvas stage to visually falsify."
            }
          ],
          socraticMentorDialogue: [
            {
              character: "Galileo Galilei",
              avatar: "GALILEO",
              introductoryRemark: "Greetings, Operator. To conquer this mountain, do not see a single path. See two. One horizontal, one vertical."
            }
          ],
          successConditions: {
            criteriaText: "Canister clears the 140m peak at 400m and lands within the 780m to 820m zone.",
            rewardXP: 500,
            badgeUnlocked: {
              id: "kinematics-pioneer",
              name: "Kinematics Pioneer"
            }
          },
          failureBehaviors: {
            impactCraters: true,
            previousTrajectories: true,
            radioTransmissions: [
              "Warning: Canister undershot the target area! Atmosphere sensor reports crash.",
              "Caution: Payload overshot into Tharsis Canyon! Supply lost."
            ]
          },
          worldMemory: {
            persistenceEnabled: true,
            maxMemorySlots: 5
          },
          scientificDiscoveries: [
            {
              id: "horizontal-independence",
              title: "Horizontal Independence",
              description: "Horizontal velocity remains constant and independent of vertical gravitational pull.",
              scientificInsight: "Nature splits vectors cleanly! The horizontal motion doesn't care that gravity is pulling the object downwards."
            },
            {
              id: "mass-independence",
              title: "Mass Independence",
              description: "Objects of different masses fall with equal acceleration in vacuo.",
              scientificInsight: "Feynman says: All things fall together! A brick and a feather fall at the same rate when air resistance is stripped away."
            }
          ],
          rewards: {
            xp: 500,
            badges: ["kinematics-pioneer"]
          },
          teacherNotes: "This mission teaches standard Grade 11 kinematics vector decompositions using a Martian colonizing storyline. Guide students to use v_0 = sqrt(R * g) for 45 degree calculations.",
          assessmentStrategy: "Formative Socratic response scoring based on qualitative rationale vs. quantitative landing accuracy.",
          accessibilityNotes: "Visual trajectories include high-contrast lines. Audio cues signify click calibration adjustments and successful landing hums.",
          unlockConditions: {
            minXP: 0
          },
          missionDuration: 20,
          difficulty: "Intermediate",
          prerequisites: [],
          guidedInquiries: [
            { label: "🔭 Ask Galileo about vector deconstruction", text: "How does splitting the trajectory into constant horizontal velocity and accelerated vertical fall help me clear Tharsis Peak?" },
            { label: "🍎 Ask Newton about Mars gravity ratio", text: "Since gravity on Mars is 3.72 m/s², how does this lower gravitational pull alter our projectile apex compared to Earth's 9.8 m/s²?" },
            { label: "🥁 Ask Feynman to visualize the apex speed", text: "At the exact peak of flight (the apex), is the horizontal speed zero? Help me visualize the speed vectors at the top." }
          ]
        }
      ]
    }
  ]
};

export default physicsClass11Curriculum;

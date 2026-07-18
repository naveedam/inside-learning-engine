/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chapter } from "../../types";

export const newtonsLawsChapter: Chapter = {
  id: "newtons-laws",
  title: "Newton's Laws: Inertia Bounds on Europa",
  shortDescription: "Master inertia, force, acceleration, and impulse on the cryogenic ice fields of Europa.",
  longDescription: "Deploy impulses to steer an inactive science rover across Jovian ice plains. Discover how velocity behaves when force is zero, and apply balanced impulses to dock safely.",
  difficulty: "Intermediate",
  estimatedMinutes: 20,
  constellationPosition: { x: 45, y: 35 },
  curricularRequirements: [
    "Newton's First Law of Motion: The concepts of inertia and motion in the absence of net external force.",
    "Newton's Second Law of Motion: The quantitative relationship between force, mass, and acceleration (F = ma).",
    "Impulse-Momentum Relationship: Restoring state-of-motion equilibrium by applying equal and opposite impulses."
  ],
  missions: [
    {
      id: "inertia-bounds",
      title: "Inertia Bounds on Europa",
      codename: "OPERATION: INERTIA BOUNDS",
      description: "Steer a stranded science rover across the icy plains of Europa to the thermal shelter. Calibrate forward and brake thrusters to halt perfectly in the docking gate.",
      objectives: [
        "Observe the rover's behavior when net force is zero (F = 0).",
        "Analyze the spacing of position beacons dropped at equal time intervals during unpowered glide.",
        "Apply a matching counter-impulse to halt the rover precisely in the docking target (58m - 62m)."
      ],
      steps: [
        {
          id: "briefing",
          type: "BRIEFING",
          title: "Europa Cryo-Plain Crisis",
          content: {
            narrative: `### CRYOGENIC RESCUE DECLARED: EUROPA ICE FIELDS
Our autonomous science rover **Arion** is stranded on the Galilean ice plains of Europa. Its steering systems are offline. Only manual thruster impulses remain.

We must steer the rover across the frozen plains to the **Thermal Shelter Docking Gate** located exactly **60 meters** away (between 58m and 62m).

Your controls direct the **engine fire durations**:
1. **Forward Thrust duration** ($t_{\\text{acc}}$) with a force of $1000\\text{ N}$.
2. **Unpowered Glide duration** ($t_{\\text{glide}}$) during which the engine is completely off ($F = 0$).
3. **Reverse Thrust duration** ($t_{\\text{dec}}$) with a braking force of $1000\\text{ N}$ to bring the rover to a halt.

You must calibrate these three durations so that the rover arrives and stops perfectly within the shelter!`
          }
        },
        {
          id: "sandbox",
          type: "SANDBOX_EXPLORATION",
          title: "Thrust Testbed",
          content: {
            simulationConfig: {
              simId: "INERTIA_BOUNDS",
              initialParameters: {
                mass: 200,
                forwardDuration: 2.0,
                glideDuration: 4.0,
                reverseDuration: 2.0
              },
              minMaxLimits: {
                mass: [100, 500],
                forwardDuration: [0.5, 4.0],
                glideDuration: [1.0, 10.0],
                reverseDuration: [0.5, 4.0]
              },
              targetFormula: {
                latex: "J = F \\cdot \\Delta t = m \\cdot \\Delta v",
                description: "Impulse-Momentum Theorem",
                variableLabels: {
                  "mass": "Rover Mass (kg)",
                  "forwardDuration": "Thrust Duration (s)",
                  "glideDuration": "Glide Duration (s)",
                  "reverseDuration": "Brake Duration (s)"
                }
              }
            }
          }
        },
        {
          id: "dialogue",
          type: "DIALOGUE",
          title: "Sir Isaac Newton Socratic Uplink",
          content: {
            dialogue: [
              {
                speaker: "Sir Isaac Newton",
                avatar: "NEWTON",
                message: "Greetings, Operator. You have observed the true essence of inertia. When the thruster goes dark, the force is absolute zero, yet the rover does not halt. It continues its lateral sweep at an unchanging, constant speed."
              },
              {
                speaker: "Sir Isaac Newton",
                avatar: "NEWTON",
                message: "Observe the glowing emerald beacon points dropped at equal time ticks on the ice during the glide. Notice how their spacing is perfectly uniform. In the absence of an impressed force, the quantity of motion remains eternal. This is my First Law."
              },
              {
                speaker: "Sir Isaac Newton",
                avatar: "NEWTON",
                message: "But to bring the vessel to rest, you must destroy this momentum. You must impress a second, opposite force. By my second and third laws, this braking impulse must exactly equal the starting forward impulse. Let us test this theory in the docking challenge!"
              }
            ]
          }
        },
        {
          id: "challenge",
          type: "CHALLENGE_EXPERIMENT",
          title: "The Europa Docking Challenge",
          content: {
            challengeQuestion: {
              questionText: "The Thermal Shelter is centered at exactly 60 meters. Calibrate your forward thrust duration, glide duration, and reverse braking duration such that the rover clears the icy plain and comes to a complete rest (final velocity = 0) perfectly inside the shelter zone (58m to 62m)!",
              formulaTrigger: "inertia_dock",
              targetValueRange: {
                min: 58,
                max: 62,
                targetVar: "dock_position"
              },
              hint: "To stop the rover completely, your reverse braking duration must EXACTLY equal your forward thrust duration (since forces are equal at 1000N). If they match, use the formula for total distance: $D = a \\cdot t_{\\text{acc}} \\cdot (t_{\\text{acc}} + t_{\\text{glide}})$. For a $200\\text{ kg}$ rover, $a = 5\\text{ m/s}^2$. With $t_{\\text{acc}} = 2.0\\text{ s}$, $D = 10 \\times (2 + t_{\\text{glide}})$. To reach $60\\text{ m}$, set $t_{\\text{glide}} = 4.0\\text{ s}$!",
              completionRewardXP: 500
            }
          }
        },
        {
          id: "debrief",
          type: "DEBRIEF",
          title: "Rescue Secured",
          content: {
            narrative: `### MISSION SECURED: ROVER RETRIEVED
The telemetry indicators confirm a flawless docking. Rover Arion has come to a complete rest inside the thermal shelter, and recharge coupling has been established.

By experiencing the frictionless ice of Europa, you have witnessed what Earth's friction obscures: motion does not require a force to persist. It only requires a force to change.

**Achievement Unlocked: Inertia Scholar (ISC Class XI Module 2)**`
          }
        }
      ],

      // --- REUSABLE MISSION FACTORY SCHEMA ADDITIONS ---
      subject: "Physics",
      chapterName: "Newton's Laws: Inertia Bounds on Europa",
      learningObjectives: [
        "Observe that motion continues at constant velocity when net force is zero (F = 0).",
        "Discover the uniform spacing of position beacons dropped at equal time intervals during unpowered glide.",
        "Apply a matching counter-impulse to halt the rover precisely in the docking target (58m - 62m)."
      ],
      storyNarrative: "Rescue a stranded robotic science rover on the plains of Europa. Calibrate thruster impulses to halt perfectly in the docking shelter.",
      world: {
        environmentName: "Europa Ice Plain, Galilean Basin",
        visualAtmosphere: "Blue Icy Twilight (Jovian Horizon)",
        audioLandscape: "Cryo-cracks and thruster impulse surges"
      },
      coreScientificConcept: {
        name: "Newton's First Law and Impulse-Momentum",
        description: "A body persists in its state of uniform motion unless compelled to change by an external force. To bring a drifting body to a halt on a frictionless surface, an equal and opposite force-time impulse must be applied.",
        equationLatex: "J = F \\cdot \\Delta t = m \\cdot \\Delta v"
      },
      coreInteraction: "INERTIA_BOUNDS",
      predictionPrompt: "If we turn off the thruster (Force = 0) on the ice of Europa, what will happen to the velocity of the science rover?",
      predictionPresets: [
        {
          id: "inertia-slow",
          label: "🛑 The rover will slowly decelerate and stop as soon as thrust becomes zero.",
          isMisconception: true,
          misconceptionId: "MISCONCEPTION_FORCE_MAINTAINS_MOTION",
          explanation: "Frictionless plains offer zero resistance! An object in motion stays in motion at constant velocity."
        },
        {
          id: "inertia-instant",
          label: "🛸 The rover will instantly drop to zero velocity as soon as the thruster is dark.",
          isMisconception: true,
          misconceptionId: "MISCONCEPTION_FORCE_MAINTAINS_MOTION",
          explanation: "Velocity cannot change instantaneously without an infinite force. The rover continues drifting."
        },
        {
          id: "inertia-constant",
          label: "🟢 The rover will drift at constant velocity because there is no friction to slow it down.",
          isMisconception: false,
          explanation: "Correct! Newton's First Law of Motion."
        }
      ],
      experimentFlow: {
        parameters: [
          {
            name: "mass",
            label: "Rover Mass",
            symbol: "m",
            min: 100,
            max: 500,
            step: 50,
            defaultValue: 200,
            unit: "kg"
          },
          {
            name: "forwardDuration",
            label: "Thrust Duration",
            symbol: "t_acc",
            min: 0.5,
            max: 4.0,
            step: 0.1,
            defaultValue: 2.0,
            unit: "s"
          },
          {
            name: "glideDuration",
            label: "Glide Duration",
            symbol: "t_glide",
            min: 1.0,
            max: 10.0,
            step: 0.1,
            defaultValue: 4.0,
            unit: "s"
          },
          {
            name: "reverseDuration",
            label: "Brake Duration",
            symbol: "t_dec",
            min: 0.5,
            max: 4.0,
            step: 0.1,
            defaultValue: 2.0,
            unit: "s"
          }
        ],
        targets: {
          name: "dock_position",
          label: "Thermal Shelter Zone",
          min: 58,
          max: 62,
          unit: "m",
          hint: "Aim to halt the rover exactly between 58m and 62m with 0 final velocity."
        }
      },
      reflectionPrompts: [
        "We observed that the rover kept moving at a perfectly constant speed even when the force was zero.",
        "The beacon drops were spaced perfectly evenly, proving that velocity did not decrease during the glide.",
        "To stop the rover completely, we had to apply an equal and opposite brake duration to cancel the forward momentum."
      ],
      commonMisconceptions: [
        {
          id: "MISCONCEPTION_FORCE_MAINTAINS_MOTION",
          name: "Force is Required to Maintain Motion",
          triggerCondition: "reverseDuration !== forwardDuration",
          pedagogicalAction: "Observe the constant velocity segment where thrusters are dark yet motion continues completely unabated."
        }
      ],
      socraticMentorDialogue: [
        {
          character: "Sir Isaac Newton",
          avatar: "NEWTON",
          introductoryRemark: "Greetings, Operator. We must steer the rover Arion across the cryogenic plains. Adjust the thrust durations and observe the inertial beacons carefully."
        },
        {
          character: "Dr. Richard Feynman",
          avatar: "FEYNMAN",
          introductoryRemark: "Hey! Friction is zero on Europa! That means if you push Arion, it keeps moving at that exact speed forever unless you pull back on it! How neat is that?"
        },
        {
          character: "Galileo Galilei",
          avatar: "GALILEO",
          introductoryRemark: "Greetings, young scholar. Earthly friction hides the true, eternal nature of motion. Here on the ice of Europa, the heavens reveal the perfect geometric sweep."
        }
      ],
      successConditions: {
        criteriaText: "Rover comes to a complete halt (v_final = 0) between 58m and 62m.",
        rewardXP: 500,
        badgeUnlocked: {
          id: "inertia-scholar",
          name: "Inertia Scholar"
        }
      },
      failureBehaviors: {
        impactCraters: false,
        previousTrajectories: true,
        radioTransmissions: [
          "Warning: Rover has not stopped! It is drifting endlessly across the Europa plains.",
          "Warning: Brakes applied too early! Rover stopped short of the thermal shelter.",
          "Warning: Brakes applied for too long! Rover reversed and is drifting backward.",
          "Warning: Brakes applied too late! Rover collided with the shelter back wall."
        ]
      },
      worldMemory: {
        persistenceEnabled: true,
        maxMemorySlots: 5
      },
      scientificDiscoveries: [
        {
          id: "newtons-first-law",
          title: "Newton's First Law of Motion",
          description: "An object in motion remains in motion at constant velocity unless acted upon by a net external force.",
          scientificInsight: "When the thruster shuts off, the force is zero. Yet the Arion rover glides on! Friction is what deceives our earthly senses; in the true vacuum of space, motion persists eternally."
        },
        {
          id: "impulse-momentum",
          title: "The Impulse-Momentum Equality",
          description: "A change in momentum is equal to the applied force multiplied by the duration of its application.",
          scientificInsight: "Feynman says: If you push a cart forward, you give it momentum. To stop it, you must pull it back with the exact same amount of oomph! Equal force for equal time kills the momentum perfectly."
        }
      ],
      rewards: {
        xp: 500,
        badges: ["inertia-scholar"]
      },
      teacherNotes: "This mission teaches Newton's First and Second Laws on a frictionless Jovian moon. Guide students to see that v_final remains constant at zero thrust, and that forward thrust time must equal reverse thrust time.",
      assessmentStrategy: "Formative Socratic inquiry verifying whether students understand that F=0 corresponds to uniform, non-decelerating motion.",
      accessibilityNotes: "Inertial beacons glow brightly and provide clear rhythmic pacing visual indicators for students with diverse needs.",
      unlockConditions: {
        minXP: 0
      },
      missionDuration: 20,
      difficulty: "Intermediate",
      prerequisites: [],
      guidedInquiries: [
        {
          label: "🍎 Ask Newton about the uniform beacons",
          text: "Why are the glowing beacons spaced exactly the same distance apart during the unpowered glide?"
        },
        {
          label: "🥁 Ask Feynman about the braking force",
          text: "If we double the mass of the rover, why does it take the exact same braking time to stop it?"
        },
        {
          label: "🔭 Ask Galileo about earthly friction",
          text: "Why does everything on Earth eventually stop moving if Newton's First Law says it should slide forever?"
        }
      ]
    }
  ]
};

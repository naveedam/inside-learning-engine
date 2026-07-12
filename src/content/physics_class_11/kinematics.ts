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
      constellationPosition: { x: 32, y: 48 }, // Coordinates on Star constellation Map
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
                    gravity: [1.62, 24.79] // Lunar to Jupiter gravity
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
          ]
        }
      ]
    }
  ]
};
export default physicsClass11Curriculum;

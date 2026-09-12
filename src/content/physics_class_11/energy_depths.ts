/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chapter } from "../../types";

export const energyDepthsChapter: Chapter = {
  id: "energy-depths",
  title: "Work, Energy & Power: Energy Depths in Mariana Trench",
  shortDescription: "Master the Work-Energy Theorem, mechanical energy conservation, and spring potential in an abyssal elevator shaft.",
  longDescription: "Calibrate emergency electromagnetic spring dampeners at the bottom of the Mariana Trench orbital elevator shaft. Discover how gravitational potential energy transforms into kinetic energy and quadratic elastic potential.",
  difficulty: "Intermediate",
  estimatedMinutes: 25,
  constellationPosition: { x: 60, y: 25 },
  curricularRequirements: [
    "Work-Energy Theorem: The change in kinetic energy of a body equals the net work done on it by conservative forces.",
    "Conservation of Mechanical Energy: In an isolated conservative system, total mechanical energy (Ug + K + Ue) remains strictly invariant.",
    "Spring Potential Energy: Hooke's law restorative force leads to quadratic stored energy Ue = 1/2 k x².",
    "Mechanical Equilibrium & Terminal Peak Velocity: Maximum kinetic energy occurs at the point where spring restorative force balances gravity (kx = mg)."
  ],
  missions: [
    {
      id: "energy-depths",
      title: "Energy Depths: Mariana Buffer",
      codename: "OPERATION: ENERGY DEPTHS",
      description: "An orbital elevator descent car is in freefall toward the Mariana Trench ocean bedrock. Calibrate the hydraulic spring dampener to arrest the descent safely between 10.0m and 12.0m of compression.",
      objectives: [
        "Track the transformation between Gravitational Potential Energy (Ug), Kinetic Energy (K), and Spring Elastic Potential Energy (Ue).",
        "Identify the equilibrium point (kx = mg) where kinetic energy peaks, debunking the misconception that speed peaks upon first contact.",
        "Calibrate drop height, capsule mass, and spring constant to stop the capsule safely within the compression zone (10.0m - 12.0m)."
      ],
      steps: [
        {
          id: "briefing",
          type: "BRIEFING",
          title: "Mariana Shaft Crisis",
          content: {
            narrative: `### EMERGENCY DECLARATION: MARIANA OCEAN SHAFT
An orbital elevator descent capsule carrying research crew has suffered total brake failure at the abyssal floor of the Mariana Trench (-11,000 meters below sea level).

The capsule is hurtling down the vacuum evacuation shaft toward bedrock. The only survival mechanism is an **Electromagnetic Spring Buffer** installed at the base of the shaft.

Your task is to calibrate the emergency arrest system:
1. **Drop Height ($h$)**: The vertical distance fallen before making contact with the spring buffer.
2. **Capsule Mass ($m$)**: The total mass of the descent module and crew.
3. **Spring Constant ($k$)**: The stiffness of the electromagnetic arresting coil.

**Target Safety Zone**: The capsule must compress the buffer between **10.0 meters and 12.0 meters** to avoid bottoming out against the bedrock while keeping deceleration forces safe!`
          }
        },
        {
          id: "sandbox",
          type: "SANDBOX_EXPLORATION",
          title: "Shaft Energy Simulator",
          content: {
            simulationConfig: {
              simId: "ENERGY_CONSERVATION",
              initialParameters: {
                dropHeight: 50,
                capsuleMass: 2000,
                springConstant: 20000
              },
              minMaxLimits: {
                dropHeight: [10, 80],
                capsuleMass: [500, 4000],
                springConstant: [5000, 40000]
              },
              targetFormula: {
                latex: "E_{\\text{total}} = mgh + \\frac{1}{2}mv^2 + \\frac{1}{2}kx^2 = \\text{constant}",
                description: "Conservation of Mechanical Energy & Work-Energy Theorem",
                variableLabels: {
                  "dropHeight": "Drop Height (m)",
                  "capsuleMass": "Capsule Mass (kg)",
                  "springConstant": "Spring Stiffness (N/m)"
                }
              }
            }
          }
        },
        {
          id: "dialogue",
          type: "DIALOGUE",
          title: "Dr. Richard Feynman Socratic Uplink",
          content: {
            dialogue: [
              {
                speaker: "Dr. Richard Feynman",
                avatar: "FEYNMAN",
                message: "Hey there! Energy is one of nature's sneakiest accountants. You can never create it and you can never destroy it—it just keeps swapping costumes!"
              },
              {
                speaker: "Dr. Richard Feynman",
                avatar: "FEYNMAN",
                message: "Watch the energy bars in the shaft: at the top, it's 100% Gravitational Potential. As it drops, that turns into pure Kinetic Energy. And when it hits the spring, that speed gets crammed into Elastic Potential!"
              },
              {
                speaker: "Sir Isaac Newton",
                avatar: "NEWTON",
                message: "Indeed. And mark this subtle truth: when the capsule first touches the top of the spring, the spring force is zero. Gravity continues to accelerate the capsule downwards until the spring compresses to the point where k·x equals m·g! Only after that point does deceleration begin."
              }
            ]
          }
        },
        {
          id: "challenge",
          type: "CHALLENGE_EXPERIMENT",
          title: "The Mariana Buffer Challenge",
          content: {
            challengeQuestion: {
              questionText: "Calibrate the drop height, capsule mass, and spring constant such that the capsule comes to a complete rest at a maximum compression between 10.0m and 12.0m! Notice the quadratic spring energy formula: mg(h + x) = 1/2 k x².",
              formulaTrigger: "energy_buffer",
              targetValueRange: {
                min: 10.0,
                max: 12.0,
                targetVar: "max_compression"
              },
              hint: "At maximum compression x, all mechanical energy has converted to spring potential: mg(h + x) = 1/2 k x². For m = 2000kg, g = 9.8m/s², and h = 50m, total energy at x = 11m is 2000 * 9.8 * 61 ≈ 1,195,600 J. Solving 1/2 k (11)² = 1,195,600 yields k ≈ 19,760 N/m. Set k = 20,000 N/m!",
              completionRewardXP: 500
            }
          }
        },
        {
          id: "debrief",
          type: "DEBRIEF",
          title: "Abyssal Extraction Secured",
          content: {
            narrative: `### MISSION SECURED: MARIANA DESCENT ARRESTED
The telemetry indicators confirm a flawless arrest. The electromagnetic spring buffer absorbed the full kinetic energy of the 2,000kg capsule, halting smoothly inside the 10.0m - 12.0m safety zone.

You have demonstrated the Work-Energy Theorem in its purest form: mechanical energy is never lost, only transferred between height, velocity, and spring compression.

**Achievement Unlocked: Energy Architect (ISC Class XI Module 3)**`
          }
        }
      ],

      // --- REUSABLE MISSION FACTORY SCHEMA ADDITIONS ---
      subject: "Physics",
      chapterName: "Work, Energy & Power: Energy Depths in Mariana Trench",
      learningObjectives: [
        "Prove the Work-Energy Theorem by demonstrating that net work done equals the change in kinetic energy.",
        "Observe the exact trade-off between Gravitational Potential Energy (Ug = mgh), Kinetic Energy (K = 1/2 mv²), and Elastic Potential Energy (Ue = 1/2 kx²).",
        "Discover that peak velocity occurs at the mechanical equilibrium point (kx = mg) rather than the instant of initial contact."
      ],
      storyNarrative: "An orbital elevator descent car is in freefall toward the Mariana Trench ocean bedrock. Calibrate the hydraulic spring dampener to arrest the descent safely.",
      world: {
        environmentName: "Mariana Trench Subterranean Elevator Core",
        visualAtmosphere: "Abyssal Bioluminescence & Deep Aqua Hum",
        audioLandscape: "Sub-oceanic pressure creaks and electromagnetic coil whine"
      },
      coreScientificConcept: {
        name: "Conservation of Mechanical Energy & Spring Elastic Potential",
        description: "In a conservative system without non-conservative dissipation, mechanical energy remains invariant: E_total = U_g + K + U_e = constant. Work done by the spring is quadratic in compression: W_s = 1/2 k x².",
        equationLatex: "E_{\\text{total}} = mgh + \\frac{1}{2}mv^2 + \\frac{1}{2}kx^2 = \\text{constant}"
      },
      coreInteraction: "ENERGY_CONSERVATION",
      predictionPrompt: "If an escape capsule falls from a 50m height onto an emergency spring buffer, how does energy transfer, and where does maximum speed occur?",
      predictionPresets: [
        {
          id: "energy-linear",
          label: "📏 Doubling the drop height will double the maximum spring compression distance (believing Δx ∝ h).",
          isMisconception: true,
          misconceptionId: "MISCONCEPTION_SPRING_CONSTANT_LINEAR_ENERGY",
          explanation: "Elastic potential energy is quadratic: U_e = 1/2 k x²! Doubling drop height doubles potential energy, but compression scales with √h (≈1.41x), not 2x."
        },
        {
          id: "energy-impact-max",
          label: "💥 The capsule reaches its absolute maximum speed at the exact instant it first touches the spring (x = 0).",
          isMisconception: true,
          misconceptionId: "MISCONCEPTION_PEAK_SPEED_AT_IMPACT",
          explanation: "At first contact (x=0), the spring exerts 0 upward force. Downward gravity still accelerates the capsule until spring force equals weight (kx = mg), where speed truly peaks!"
        },
        {
          id: "energy-conserved",
          label: "⚖️ Total mechanical energy is constant; the capsule accelerates past contact until spring force equals weight (kx = mg).",
          isMisconception: false,
          explanation: "Correct! Energy simply shifts between gravitational, kinetic, and elastic forms. Peak speed occurs at equilibrium (kx = mg) where net force is zero."
        }
      ],
      experimentFlow: {
        parameters: [
          {
            name: "dropHeight",
            label: "Drop Height",
            symbol: "h",
            min: 10,
            max: 80,
            step: 5,
            defaultValue: 50,
            unit: "m"
          },
          {
            name: "capsuleMass",
            label: "Capsule Mass",
            symbol: "m",
            min: 500,
            max: 4000,
            step: 250,
            defaultValue: 2000,
            unit: "kg"
          },
          {
            name: "springConstant",
            label: "Spring Stiffness",
            symbol: "k",
            min: 5000,
            max: 40000,
            step: 1000,
            defaultValue: 20000,
            unit: "N/m"
          }
        ],
        targets: {
          name: "max_compression",
          label: "Buffer Compression Zone",
          min: 10.0,
          max: 12.0,
          unit: "m",
          hint: "Tune height, mass, and spring constant so the capsule comes to rest between 10.0m and 12.0m of spring compression."
        }
      },
      reflectionPrompts: [
        "We observed that the capsule continued to accelerate even after touching the spring, reaching maximum speed where spring force equaled weight (kx = mg).",
        "The three energy bars (Ug, K, Ue) dynamically exchanged magnitude, while their total sum remained perfectly constant throughout the entire drop.",
        "Doubling the drop height did not double the compression distance, confirming the quadratic nature of spring potential energy (Ue = 1/2 k x²)."
      ],
      commonMisconceptions: [
        {
          id: "MISCONCEPTION_SPRING_CONSTANT_LINEAR_ENERGY",
          name: "Linear Spring Compression Energy",
          triggerCondition: "selectedPresetId === 'energy-linear'",
          pedagogicalAction: "Examine the quadratic energy bar: note that doubling compression quadruples the stored elastic energy."
        },
        {
          id: "MISCONCEPTION_PEAK_SPEED_AT_IMPACT",
          name: "Peak Velocity at Initial Contact",
          triggerCondition: "selectedPresetId === 'energy-impact-max'",
          pedagogicalAction: "Look at the velocity vector past x=0: the capsule keeps accelerating until spring upward force balances gravity (kx = mg)."
        }
      ],
      socraticMentorDialogue: [
        {
          character: "Dr. Richard Feynman",
          avatar: "FEYNMAN",
          introductoryRemark: "Hey! Ready to watch energy do its conservation dance? In this deep trench, gravity, speed, and spring coils are going to trade energy back and forth like clockwork!"
        },
        {
          character: "Sir Isaac Newton",
          avatar: "NEWTON",
          introductoryRemark: "Greetings, Operator. We must arrest the capsule before it strikes the ocean bedrock. Calibrate the spring constant and observe the exact point of dynamic equilibrium."
        },
        {
          character: "Galileo Galilei",
          avatar: "GALILEO",
          introductoryRemark: "Welcome, scholar. Notice how the vertical fall obeys gravity, yet once the coils engage, the upward restorative force challenges the fall. Let us observe the symmetry of nature."
        }
      ],
      successConditions: {
        criteriaText: "Capsule comes to rest with maximum spring compression between 10.0m and 12.0m.",
        rewardXP: 500,
        badgeUnlocked: {
          id: "energy-architect",
          name: "Energy Architect"
        }
      },
      failureBehaviors: {
        impactCraters: false,
        previousTrajectories: true,
        radioTransmissions: [
          "Warning: Spring too soft! Buffer bottomed out against the bedrock of Mariana Trench!",
          "Warning: Spring too stiff! Lethal deceleration threshold exceeded upon impact!",
          "Warning: Compression undershot safety zone! Insufficient energy absorption."
        ]
      },
      worldMemory: {
        persistenceEnabled: true,
        maxMemorySlots: 5
      },
      scientificDiscoveries: [
        {
          id: "conservative-energy",
          title: "The Conservative Conservation",
          description: "Total mechanical energy remains pristine, simply shifting forms from gravitational height to kinetic speed to elastic spring compression.",
          scientificInsight: "Feynman says: Energy is never lost! It's like pouring water between three glasses: Gravitational PE pours into Kinetic, which then pours into Elastic PE. The total amount of water never changes!"
        },
        {
          id: "equilibrium-peak-velocity",
          title: "The Equilibrium Velocity Peak",
          description: "Maximum speed occurs not at first contact with the spring, but at the equilibrium point where spring force equals capsule weight (kx = mg).",
          scientificInsight: "Newton says: At first contact, the spring is uncompressed, so upward force is zero. Since gravity mg is greater than zero, downward acceleration continues! Speed only peaks when upward force kx exactly equals downward gravity mg."
        }
      ],
      rewards: {
        xp: 500,
        badges: ["energy-architect"]
      },
      teacherNotes: "Demonstrates the Work-Energy Theorem in vertical spring systems: mg(h + x) = 1/2 k x². Highlight that velocity peaks at the equilibrium point kx = mg, not at contact x = 0.",
      assessmentStrategy: "Verify that students recognize total mechanical energy is conserved and can explain why peak velocity occurs below the contact point.",
      accessibilityNotes: "Tri-bar energy visualizer uses distinct high-contrast colors (amber Ug, cyan K, emerald Ue) with textual percentage indicators.",
      unlockConditions: {
        minXP: 0,
        prerequisites: ["newtons-laws"]
      },
      missionDuration: 25,
      difficulty: "Intermediate",
      prerequisites: ["newtons-laws"],
      guidedInquiries: [
        {
          label: "🥁 Ask Feynman why velocity peaks below the spring top",
          text: "Why does the capsule keep speeding up even after it has touched the top of the spring?"
        },
        {
          label: "🍎 Ask Newton about the quadratic energy relationship",
          text: "Why does doubling the drop height not double the spring compression distance?"
        },
        {
          label: "🔭 Ask Galileo about the total energy bar",
          text: "Why does the total mechanical energy bar remain at exactly 100% throughout the entire fall and compression?"
        }
      ]
    }
  ]
};

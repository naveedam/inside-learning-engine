/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurriculumPack } from "../../types";

export const chemistryClass11Curriculum: CurriculumPack = {
  id: "chemistry-class-11",
  subject: "Chemistry",
  grade: "ISC Class XI",
  icon: "Beaker",
  accentColor: "emerald",
  chapters: [
    {
      id: "stoichiometry",
      title: "Stoichiometry & Titration Equilibrium",
      shortDescription: "Stabilize reactant concentrations and balance equilibrium pH curves.",
      longDescription: "Calibrate indicator dyes, drop flow-rates, and base molarities. Experience how stoichiometric equivalences control pH log curves and chemical color transitions.",
      difficulty: "Intermediate",
      estimatedMinutes: 25,
      constellationPosition: { x: 50, y: 30 },
      missions: [
        {
          id: "titration-balance",
          title: "Acid-Base Waste Stabilization",
          codename: "OPERATION: NEUTRALIZER",
          description: "Balance the acidity of toxic industrial runoffs at Astraea Base by dripping sodium hydroxide to hit the perfect pH 7 equivalence point.",
          objectives: [
            "Explain how logarithmic pH shifts occur around the equivalence point.",
            "Formulate the stoichiometric balance between strong acids and bases.",
            "Achieve perfect pH stabilization (pH 6.8 - 7.2) with precise drop calibrations."
          ],
          steps: [
            {
              id: "briefing",
              type: "BRIEFING",
              title: "Fluorite Waste Recycler Briefing",
              content: {
                narrative: `### CRISIS DECLARED: WASTE RUNOFF
A main piping line of our hydrofluoric cooling unit has ruptured, sending 500 liters of highly acidic run-off (0.1M Hydrochloric Acid) heading towards our hydroponic farming basin.

If the acid enters the crop water supply, the crops will be completely destroyed.

To stabilize the water, we must perform a high-volume **In-Line Neutralization Titration** by adding Sodium Hydroxide (NaOH). 

You must calibrate the concentration of the NaOH base ($M_b$) and the volumetric drip flow rate ($V_d$) to reach a perfectly neutral, stable basin state (pH 7.0) before the storage tanks overflow in 30 seconds.

Martian thermal conditions are nominal.`
              }
            },
            {
              id: "dialogue",
              type: "DIALOGUE",
              title: "Chemical Lab Uplink",
              content: {
                dialogue: [
                  {
                    speaker: "Marie Curie",
                    avatar: "CURIE",
                    message: "Welcome, researcher. Do not fear the logarithmic power of the pH scale. It is merely a mirror of active hydrogen ion exponents."
                  },
                  {
                    speaker: "Marie Curie",
                    avatar: "CURIE",
                    message: "A single excess drop can trigger an explosive jump across the logarithmic divide, turning our acidic water into a harsh alkaline solution. We must seek the perfect equivalence point, where acid and base moles balance exactly. Observe the color indicator in the experiment stage!"
                  }
                ]
              }
            },
            {
              id: "sandbox",
              type: "SANDBOX_EXPLORATION",
              title: "Stoichiometric Sandbox",
              content: {
                simulationConfig: {
                  simId: "TITRATION_BALANCE",
                  initialParameters: {
                    baseMolarity: 0.1,
                    dripVolume: 50,
                    acidVolume: 50
                  },
                  minMaxLimits: {
                    baseMolarity: [0.01, 1.0],
                    dripVolume: [10, 150],
                    acidVolume: [20, 100]
                  },
                  targetFormula: {
                    latex: "\\text{pH} = -\\log_{10}([\\text{H}^+])",
                    description: "Logarithmic Concentration Scale",
                    variableLabels: {
                      "baseMolarity": "Base Molarity (M)",
                      "dripVolume": "Drip Drop Volume (mL)",
                      "acidVolume": "Acid Volume (mL)"
                    }
                  }
                }
              }
            },
            {
              id: "challenge",
              type: "CHALLENGE_EXPERIMENT",
              title: "The pH Equivalence Challenge",
              content: {
                challengeQuestion: {
                  questionText: "We have exactly 50mL of 0.1M Hydrochloric Acid. Calibrate your sodium hydroxide base molarity to 0.1M, and determine the exact target volume of base drops required to neutralize the basin. Drip exactly the correct amount to hit the pH 7 endpoint!",
                  formulaTrigger: "titration_neutralized",
                  targetValueRange: {
                    min: 48,
                    max: 52,
                    targetVar: "neutralizedVolume"
                  },
                  hint: "Since HCl and NaOH are strong acids/bases reacting in a 1:1 molar ratio, the equivalence moles are: M_a * V_a = M_b * V_b. With M_a = 0.1M, V_a = 50mL, and M_b = 0.1M, your target volume V_b is exactly 50mL! Dripping too much will shoot pH to 12!",
                  completionRewardXP: 500
                }
              }
            },
            {
              id: "debrief",
              type: "DEBRIEF",
              title: "Recycling Complete",
              content: {
                narrative: `### WASTE STABILIZED: WATER SECURED
The pH readout has flattened exactly at 7.00. The indicator color transitioned from bright acid crimson into a beautiful, neutral grass green.

The water recycling gates are now open. The safe water has been routed into the hydroponic growing trays.

By balancing molecular equivalence, you have proven that chemistry isn't just dry textbook coefficients — it is a shield that safeguards living biomes.

**Achievement Unlocked: Titration Master (ISC Class XI Module 2)**`
              }
            }
          ],

          // --- REUSABLE MISSION FACTORY SCHEMA ADDITIONS (Milestone 3) ---
          subject: "Chemistry",
          chapterName: "Stoichiometry & Titration Equilibrium",
          learningObjectives: [
            "Explain how logarithmic pH shifts occur around the equivalence point.",
            "Formulate the stoichiometric balance between strong acids and bases.",
            "Achieve perfect pH stabilization (pH 6.8 - 7.2) with precise drop calibrations."
          ],
          storyNarrative: "Balance the acidity of toxic industrial runoffs at Astraea Base by dripping sodium hydroxide to hit the perfect pH 7 equivalence point.",
          world: {
            environmentName: "Astraea Chemical Recycling Bay",
            visualAtmosphere: "Neon Laboratory (Glass glow and Emerald accents)",
            audioLandscape: "Glass clinks, bubbling fluids, and liquid drips"
          },
          coreScientificConcept: {
            name: "Logarithmic Acid-Base Neutralization",
            description: "Stoichiometric equivalence of H+ and OH- moles determines pH values on a logarithmic scale. Neutralization triggers a rapid sigmoidal transition curve.",
            equationLatex: "\\text{H}^+ + \\text{OH}^- \\rightleftharpoons \\text{H}_2\\text{O}"
          },
          coreInteraction: "TITRATION_BALANCE",
          predictionPrompt: "At what exact volume of 0.1M NaOH base will 50mL of 0.1M HCl acid reach pH 7? What shape will the pH change curve trace?",
          predictionPresets: [
            {
              id: "ph-linear",
              label: "📈 pH rises linearly as base is added drop-by-drop",
              isMisconception: true,
              misconceptionId: "MISCONCEPTION_LOGARITHMIC_PH",
              explanation: "pH is a logarithmic scale; it rises very slowly initially, then skyrockets at the equivalence threshold."
            },
            {
              id: "ph-instant",
              label: "⚡ Titration transitions instantly to alkaline with the first base drop",
              isMisconception: true,
              misconceptionId: "MISCONCEPTION_BUFFER_THRESHOLD",
              explanation: "The solution stays highly acidic until moles of base nearly equal moles of acid."
            },
            {
              id: "ph-sigmoidal",
              label: "⚖️ pH curves in a sigmoidal S-shape, peaking at exactly 50mL",
              isMisconception: false,
              explanation: "Perfect! Logarithmic curves are naturally sigmoidal in strong titration reactions."
            }
          ],
          experimentFlow: {
            parameters: [
              {
                name: "baseMolarity",
                label: "Base Concentration (NaOH)",
                symbol: "M_b",
                min: 0.05,
                max: 0.5,
                step: 0.01,
                defaultValue: 0.1,
                unit: "M"
              },
              {
                name: "dripVolume",
                label: "Base Drip Target",
                symbol: "V_b",
                min: 10,
                max: 90,
                step: 1,
                defaultValue: 30,
                unit: "mL"
              }
            ],
            targets: {
              name: "neutralizedVolume",
              label: "Chemical Neutralization (pH 7.0)",
              min: 48,
              max: 52,
              unit: "mL",
              hint: "Aim to add exactly equal moles of acid and base."
            }
          },
          reflectionPrompts: [
            "We found out that pH stays surprisingly low until we approach the equivalence threshold.",
            "Dripping just 1mL of excess base after equivalence caused the pH to instantly jump to 11.5.",
            "Stoichiometric ratios can be used to mathematically calculate neutralization down to a single drop."
          ],
          commonMisconceptions: [
            {
              id: "MISCONCEPTION_LOGARITHMIC_PH",
              name: "Linear pH Myth",
              triggerCondition: "baseMolarity !== 0.1",
              pedagogicalAction: "Graph a real logarithmic sigmoidal curve alongside a linear curve on the telemetry HUD to show the actual jump."
            }
          ],
          socraticMentorDialogue: [
            {
              character: "Marie Curie",
              avatar: "CURIE",
              introductoryRemark: "Greetings, researcher. Balance the molarity of your solutions and look for the sudden, beautiful shift in colors."
            }
          ],
          successConditions: {
            criteriaText: "Achieve pH values between 6.8 and 7.2 by adding base within the safe equivalence volume.",
            rewardXP: 500,
            badgeUnlocked: {
              id: "titration-master",
              name: "Titration Master"
            }
          },
          failureBehaviors: {
            impactCraters: false,
            previousTrajectories: false,
            radioTransmissions: [
              "Warning: Base volume was insufficient! Runoff remains toxic and highly acidic.",
              "Caution: Solution has oversaturated! pH spiked to 12.0 - crop leaves are burning!"
            ]
          },
          worldMemory: {
            persistenceEnabled: true,
            maxMemorySlots: 3
          },
          scientificDiscoveries: [
            {
              id: "sigmoidal-equivalence",
              title: "Sigmoidal Titration Curve",
              description: "Strong acid/base neutralization manifests a steep, non-linear sigmoidal pH transition.",
              scientificInsight: "The math is logarithmic! Ten-fold concentration changes mean equal steps on the pH meter, causing the spectacular equivalence spike."
            }
          ],
          rewards: {
            xp: 500,
            badges: ["titration-master"]
          },
          teacherNotes: "Explains standard high school acid-base equivalence molar ratios. Perfect for demonstrating chemical indicators and logarithmic behavior.",
          assessmentStrategy: "Formative evaluation measuring understanding of sigmoidal pH response graphs.",
          accessibilityNotes: "Titration color shifts feature high-contrast patterns and supplementary pH numerical readouts for red-green colorblindness.",
          unlockConditions: {
            minXP: 300
          },
          missionDuration: 25,
          difficulty: "Intermediate",
          prerequisites: ["crate-drop"]
        }
      ]
    }
  ]
};

export default chemistryClass11Curriculum;

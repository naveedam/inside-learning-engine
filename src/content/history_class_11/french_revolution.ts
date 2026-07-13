/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurriculumPack } from "../../types";

export const historyClass11Curriculum: CurriculumPack = {
  id: "history-class-11",
  subject: "History",
  grade: "ISC Class XI",
  icon: "Compass",
  accentColor: "orange",
  chapters: [
    {
      id: "french-revolution",
      title: "Enlightenment, Monarchies & Socio-Political Tipping Points",
      shortDescription: "Navigate public unrest, economic strain, and revolutionary trigger events.",
      longDescription: "Calibrate variables of municipal security, bread subsidies, and citizen assemblies. Experience how minor policy triggers cause societal systems to hit historical tipping points.",
      difficulty: "Intermediate",
      estimatedMinutes: 20,
      constellationPosition: { x: 75, y: 55 },
      missions: [
        {
          id: "bastille-breach",
          title: "The Bastille Tipping Point",
          codename: "OPERATION: JULY 14",
          description: "Balance security, food supply bread prices, and popular assemblies in revolutionary Paris to stabilize the state or understand the trigger that breached the Bastille.",
          objectives: [
            "Deconstruct the economic and military factors leading to the collapse of French absolutism.",
            "Explain how the convergence of high food costs and military mobilization triggers popular uprisings.",
            "Simulate the tipping point that leads to the storming of the Bastille on July 14, 1789."
          ],
          steps: [
            {
              id: "briefing",
              type: "BRIEFING",
              title: "Paris Municipal Council Briefing",
              content: {
                narrative: `### CRISIS DECLARED: PARIS UNREST
It is July 1789. The Estates-General is in a deadlock, and King Louis XVI has suddenly dismissed the reformist finance minister, Jacques Necker. 

Famine is looming. The price of a single loaf of bread in Paris has spiked to equal 80% of an average laborer's daily wages.

The city is a tinderbox.

You are the Military Governor of Paris. You must calibrate the **Fortress Garrison Defense Forces** ($G_d$) inside the Bastille, and the level of municipal **Bread Price Subsidies** ($B_s$) to keep peace. 

If bread prices stay high while Swiss mercenaries surround Paris, citizen outrage will breach the tipping point, causing a massive, historic charge on the fortress.`
              }
            },
            {
              id: "dialogue",
              type: "DIALOGUE",
              title: "Socrates-History Uplink",
              content: {
                dialogue: [
                  {
                    speaker: "Hypatia of Alexandria",
                    avatar: "SYSTEM",
                    message: "Greetings, governor. History is not a series of inert dates. It is a dynamic, living system of human currents."
                  },
                  {
                    speaker: "Hypatia of Alexandria",
                    avatar: "SYSTEM",
                    message: "A society is like an overloaded scale. Add one weight — high taxes — and it strains. Add another weight — visible soldiers — and the scale snaps. Let us adjust the scales in Paris to see what causes citizens to charge the Bastille."
                  }
                ]
              }
            },
            {
              id: "sandbox",
              type: "SANDBOX_EXPLORATION",
              title: "Socio-Political Simulator",
              content: {
                simulationConfig: {
                  simId: "DECISION_TIMELINE",
                  initialParameters: {
                    garrisonSize: 100,
                    breadPrice: 15,
                    mercenaryTension: 50
                  },
                  minMaxLimits: {
                    garrisonSize: [20, 300],
                    breadPrice: [2, 30],
                    mercenaryTension: [10, 100]
                  },
                  targetFormula: {
                    latex: "\\text{Outrage} = \\frac{\\text{Garrison} \\times \\text{Price}}{\\text{Subsidy}}",
                    description: "Popular Societal Outrage Formula",
                    variableLabels: {
                      "garrisonSize": "Swiss Garrison Troops",
                      "breadPrice": "Bread Price (Sous per loaf)",
                      "mercenaryTension": "Mercenary Proximity Tension (%)"
                    }
                  }
                }
              }
            },
            {
              id: "challenge",
              type: "CHALLENGE_EXPERIMENT",
              title: "The July 14 Tipping Point Challenge",
              content: {
                challengeQuestion: {
                  questionText: "To reconstruct the historical storming of the Bastille, set the bread price to a high 15 sous and Swiss garrison troops to 110. Watch how public outrage passes the 80% tipping threshold, triggering the historical citizen storming. Run the simulation to trigger the breach!",
                  formulaTrigger: "bastille_stormed",
                  targetValueRange: {
                    min: 100,
                    max: 120,
                    targetVar: "historicalTension"
                  },
                  hint: "On July 14, 1789, bread prices were indeed at record highs (around 15 sous per loaf, where 12 sous was a full daily wage), and the garrison troops numbered exactly 114. This perfect storm made the breach inevitable as the crowd sought gunpowder.",
                  completionRewardXP: 500
                }
              }
            },
            {
              id: "debrief",
              type: "DEBRIEF",
              title: "Historical Flashpoint",
              content: {
                narrative: `### TIPPING POINT BREACHED: BASTILLE STORMED
The garrison gates have collapsed. Citizens have seized the gunpowder, and the fortress is being dismantled cobblestone by cobblestone.

The fall of the Bastille marks the birth of the National Assembly's popular authority.

By balancing social tension equations, you have realized that history is not arbitrary. It is the physics of collective human necessity.

**Achievement Unlocked: Citizen Sovereign (ISC Class XI Module 3)**`
              }
            }
          ],

          // --- REUSABLE MISSION FACTORY SCHEMA ADDITIONS (Milestone 3) ---
          subject: "History",
          chapterName: "Enlightenment, Monarchies & Socio-Political Tipping Points",
          learningObjectives: [
            "Deconstruct the economic and military factors leading to the collapse of French absolutism.",
            "Explain how the convergence of high food costs and military mobilization triggers popular uprisings.",
            "Simulate the tipping point that leads to the storming of the Bastille on July 14, 1789."
          ],
          storyNarrative: "Balance security, food supply bread prices, and popular assemblies in revolutionary Paris to stabilize the state or understand the trigger that breached the Bastille.",
          world: {
            environmentName: "Faubourg Saint-Antoine, Paris",
            visualAtmosphere: "Smoky Cobblestone (Dusk sky and torchlights)",
            audioLandscape: "Chanting crowds, iron gates clinking, and distant musket fires"
          },
          coreScientificConcept: {
            name: "Socio-Economic Outrage Threshold",
            description: "Societal systems hit structural tipping points when primary economic strain (food access) intersects with visible security containment forces.",
            equationLatex: "\\text{Outrage} = \\frac{\\text{Bread Price} \\times \\text{Military Presence}}{\\text{Public Trust}}"
          },
          coreInteraction: "DECISION_TIMELINE",
          predictionPrompt: "How will public outrage change if the King doubles the fortress garrison Swiss troops while bread prices remain at near-famine heights?",
          predictionPresets: [
            {
              id: "hist-scared",
              label: "🛡️ Heavy troop presence scares citizens into absolute submission",
              isMisconception: true,
              misconceptionId: "MISCONCEPTION_REPRESSION_STABILITY",
              explanation: "Repression works temporarily, but visible weapons in a famine act as an accelerant of desperation."
            },
            {
              id: "hist-unconcerned",
              label: "🥖 Citizens only care about bread; military actions are ignored",
              isMisconception: true,
              misconceptionId: "MISCONCEPTION_ECONOMIC_ISOLATION",
              explanation: "Economics is the cause, but military threat provides the target. Gunpowder storage at the Bastille unified these forces."
            },
            {
              id: "hist-tipping",
              label: "🔥 Military encirclement acts as a trigger, breaching the tipping point",
              isMisconception: false,
              explanation: "Excellent! Famine combined with threat triggers popular revolutions."
            }
          ],
          experimentFlow: {
            parameters: [
              {
                name: "garrisonSize",
                label: "Swiss Garrison Troops",
                symbol: "G_d",
                min: 20,
                max: 200,
                step: 1,
                defaultValue: 60,
                unit: "soldiers"
              },
              {
                name: "breadPrice",
                label: "Bread Price",
                symbol: "P_b",
                min: 3,
                max: 25,
                step: 1,
                defaultValue: 8,
                unit: "sous"
              }
            ],
            targets: {
              name: "historicalTension",
              label: "Bastille Breach Threat",
              min: 100,
              max: 120,
              unit: "index",
              hint: "Match historical variables of July 14, 1789."
            }
          },
          reflectionPrompts: [
            "We found out that military presence is viewed as hostile encirclement during food crises.",
            "Lowering bread prices to 4 sous completely avoided the storming, even with troops present.",
            "The Bastille's actual breach was driven by a need for gunpowder, connecting military fear with concrete action."
          ],
          commonMisconceptions: [
            {
              id: "MISCONCEPTION_REPRESSION_STABILITY",
              name: "Stability Through Force",
              triggerCondition: "garrisonSize > 150",
              pedagogicalAction: "Show a historical diagram of Necker's dismissal triggering municipal arming of the Paris militia on the canvas."
            }
          ],
          socraticMentorDialogue: [
            {
              character: "Hypatia of Alexandria",
              avatar: "SYSTEM",
              introductoryRemark: "Greetings, administrator. Look beyond the palace walls and compute the pressure in the cobblestone streets."
            }
          ],
          successConditions: {
            criteriaText: "Trigger the historical storming of the Bastille on July 14, 1789, by matching high food costs and Swiss troops.",
            rewardXP: 500,
            badgeUnlocked: {
              id: "citizen-sovereign",
              name: "Citizen Sovereign"
            }
          },
          failureBehaviors: {
            impactCraters: false,
            previousTrajectories: false,
            radioTransmissions: [
              "Notice: Public unrest has quieted down temporarily but the systemic crisis remains unresolved.",
              "Alert: Municipal garrison is too small to record historical threshold data!"
            ]
          },
          worldMemory: {
            persistenceEnabled: true,
            maxMemorySlots: 2
          },
          scientificDiscoveries: [
            {
              id: "societal-tipping-point",
              title: "Socio-Political Tipping Point",
              description: "Societal balance snaps non-linearly when multiple structural stressors overlap.",
              scientificInsight: "Feynman style: Outrage spreads like a fire! A single spark doesn't burn a log, but dried leaves and heat make the entire forest go up instantly."
            }
          ],
          rewards: {
            xp: 500,
            badges: ["citizen-sovereign"]
          },
          teacherNotes: "Designed for Class 11 World History. Demonstrates systemic causes of the French Revolution, focusing on the convergence of economic strain and military threat.",
          assessmentStrategy: "Socratic debrief comparing historical triggers with student experimental outcomes.",
          accessibilityNotes: "Socio-political heat maps on the Bastille fortress model include high-contrast red/blue boundary indicators.",
          unlockConditions: {
            minXP: 500
          },
          missionDuration: 20,
          difficulty: "Intermediate",
          prerequisites: ["titration-balance"]
        }
      ]
    }
  ]
};

export default historyClass11Curriculum;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurriculumPack } from "../../types";

export const literatureClass11Curriculum: CurriculumPack = {
  id: "literature-class-11",
  subject: "Literature",
  grade: "ISC Class XI",
  icon: "BookOpen",
  accentColor: "purple",
  chapters: [
    {
      id: "frankenstein-gothic",
      title: "Romanticism, Ambition & Gothic Bioethics",
      shortDescription: "Analyze the boundary of science, human empathy, and creative responsibility.",
      longDescription: "Calibrate Victor's ambition indexes and societal rejection coefficients. Observe how Mary Shelley weaves a cautionary tale contrasting pure Enlightenment reason with Romantic empathy.",
      difficulty: "Advanced",
      estimatedMinutes: 25,
      constellationPosition: { x: 88, y: 25 },
      curricularRequirements: [
        "Analyzing Shelley's juxtaposition of Enlightenment science vs Romantic bioethical caution.",
        "Evaluating the literary tropes of double characters, parent-child obligations, and societal rejection.",
        "Deconstructing the frame narrative structure (Walton-Victor-Creature) and dynamic theme coefficients."
      ],
      missions: [
        {
          id: "frankenstein-debate",
          title: "Frankenstein: The Bioethical Mirror",
          codename: "OPERATION: CAUTIONARY TALE",
          description: "Explore the tragic clash between raw intellectual ambition and maternal/paternal duty in Mary Shelley's Frankenstein by balancing the variables of Enlightenment Hubris.",
          objectives: [
            "Deconstruct Shelley's narrative frame structures (Walton, Victor, and the Creature).",
            "Evaluate the Romantic critique of pure, unbridled scientific rationalism.",
            "Deconstruct how the Creature's societal rejection causes the spiral into gothic tragedy."
          ],
          steps: [
            {
              id: "briefing",
              type: "BRIEFING",
              title: "Ingolstadt Laboratory Briefing",
              content: {
                narrative: `### CRISIS DECLARED: GALVANIC CREATION
It is a dreary night in November. Rain patters dismally against the window-panes, and Victor Frankenstein's candle is nearly burnt out. 

The galvanic spark has been infused. The dull yellow eye of the creature has opened.

It breathes hard, and a convulsive motion agitates its limbs.

You are the Literary Analytical Director. You must calibrate **Victor's Scientific Ambition Coefficient** ($A_c$) and the level of **Maternal/Paternal Responsibility** ($R_m$) to understand how Mary Shelley structures the warning of her novel.

If Victor's ambition remains at 100% while his responsibility drops to zero, the Creature is abandoned into a hostile world, initiating the inevitable cycle of gothic tragedy.`
              }
            },
            {
              id: "dialogue",
              type: "DIALOGUE",
              title: "Socratic Literary Uplink",
              content: {
                dialogue: [
                  {
                    speaker: "Dr. Richard Feynman",
                    avatar: "FEYNMAN",
                    message: "Hey! Let's look at this like a real machine of human emotions. A guy builds a living person, gets spooked, and runs away. What a colossal failure of project management!"
                  },
                  {
                    speaker: "Dr. Richard Feynman",
                    avatar: "FEYNMAN",
                    message: "Shelley is telling us that science isn't just about what we can construct in a vacuum. It's about what we are willing to love and take responsibility for once it's out there in the wild."
                  }
                ]
              }
            },
            {
              id: "sandbox",
              type: "SANDBOX_EXPLORATION",
              title: "Gothic Narrative Sandbox",
              content: {
                simulationConfig: {
                  simId: "THEMATIC_ANALYSIS",
                  initialParameters: {
                    ambitionLevel: 80,
                    responsibilityLevel: 20,
                    socialEmpathy: 30
                  },
                  minMaxLimits: {
                    ambitionLevel: [10, 100],
                    responsibilityLevel: [0, 100],
                    socialEmpathy: [5, 100]
                  },
                  targetFormula: {
                    latex: "\\text{Tragedy} = \\frac{\\text{Ambition}}{\\text{Responsibility} \\times \\text{Social Empathy}}",
                    description: "Gothic Tragic Resonance Equation",
                    variableLabels: {
                      "ambitionLevel": "Victor's Enlightenment Hubris (%)",
                      "responsibilityLevel": "Creator Responsibility (%)",
                      "socialEmpathy": "Genevan Societal Empathy (%)"
                    }
                  }
                }
              }
            },
            {
              id: "challenge",
              type: "CHALLENGE_EXPERIMENT",
              title: "The Cautionary Hubris Challenge",
              content: {
                challengeQuestion: {
                  questionText: "Recreate Victor's historical mistake. Maximize intellectual ambition to 100% and drop responsibility to 0%. Observe how the Gothic tragedy index peaks, triggering the Creature's rejection and the inevitable downfall. Run the simulation to trigger this warning!",
                  formulaTrigger: "hubris_warning",
                  targetValueRange: {
                    min: 95,
                    max: 105,
                    targetVar: "gothicTension"
                  },
                  hint: "Historically, Victor escapes his laboratory immediately after creation, leaving the Creature completely abandoned and cold. This hubris is what makes Frankenstein the premier cautionary tale of science.",
                  completionRewardXP: 500
                }
              }
            },
            {
              id: "debrief",
              type: "DEBRIEF",
              title: "Romantic Realization",
              content: {
                narrative: `### THE CAUTIONARY TALE SEALED: WARNING HEEDED
The tragedy index has reached its zenith. Victor's loved ones have perished, and he pursues his creation across the desolate Arctic ice.

Shelley's bioethical warning stands complete.

By modeling narrative tensions, you have proven that classic literature is not an ornament. It is a precise emotional blueprint warning us against intellectual arrogance.

**Achievement Unlocked: Gothic Ethicist (ISC Class XI Module 4)**`
              }
            }
          ],

          // --- REUSABLE MISSION FACTORY SCHEMA ADDITIONS (Milestone 3) ---
          subject: "Literature",
          chapterName: "Romanticism, Ambition & Gothic Bioethics",
          learningObjectives: [
            "Deconstruct Shelley's narrative frame structures (Walton, Victor, and the Creature).",
            "Evaluate the Romantic critique of pure, unbridled scientific rationalism.",
            "Deconstruct how the Creature's societal rejection causes the spiral into gothic tragedy."
          ],
          storyNarrative: "Explore the tragic clash between raw intellectual ambition and maternal/paternal duty in Mary Shelley's Frankenstein by balancing the variables of Enlightenment Hubris.",
          world: {
            environmentName: "University of Ingolstadt, Germany",
            visualAtmosphere: "Attic Lab (Rainstorm and flickering candlelight)",
            audioLandscape: "Thunderclaps, rain patters, and rapid quill scratching"
          },
          coreScientificConcept: {
            name: "Enlightenment Hubris vs. Romantic Empathy",
            description: "Mary Shelley's novel serves as a cautionary tale of the Enlightenment, demonstrating that pure empirical progress stripped of ethical responsibility triggers destructive isolation.",
            equationLatex: "\\text{Hubris} = \\text{Intellect} - \\text{Empathy}"
          },
          coreInteraction: "THEMATIC_ANALYSIS",
          predictionPrompt: "How will the Creature's temperament react if Victor abandons his responsibility while the surrounding Swiss society exhibits low social empathy?",
          predictionPresets: [
            {
              id: "lit-docile",
              label: "🕊️ The Creature stays peaceful and serves Genevan society quietly",
              isMisconception: true,
              misconceptionId: "MISCONCEPTION_BLANK_SLATE",
              explanation: "Human interaction is transactional; systematic violence and rejection inevitably breeds defensive hostility."
            },
            {
              id: "lit-evil",
              label: "👿 The Creature is born inherently evil and malicious by nature",
              isMisconception: true,
              misconceptionId: "MISCONCEPTION_INHERENT_EVIL",
              explanation: "Shelley utilizes Rousseau's theory: the creature is born benevolent but corrupted by societal prejudice."
            },
            {
              id: "lit-gothic",
              label: "🩸 Abandonment and social hatred force a tragic spiral into revenge",
              isMisconception: false,
              explanation: "Incredible! Rejection acts as the emotional catalyst for Shelley's narrative engine."
            }
          ],
          experimentFlow: {
            parameters: [
              {
                name: "ambitionLevel",
                label: "Enlightenment Hubris",
                symbol: "A_c",
                min: 10,
                max: 100,
                step: 1,
                defaultValue: 80,
                unit: "%"
              },
              {
                name: "responsibilityLevel",
                label: "Creator Responsibility",
                symbol: "R_m",
                min: 0,
                max: 100,
                step: 1,
                defaultValue: 20,
                unit: "%"
              }
            ],
            targets: {
              name: "gothicTension",
              label: "Gothic Tragedy Resonance",
              min: 95,
              max: 105,
              unit: "index",
              hint: "Recreate the historical hubris trigger of Shelley's text."
            }
          },
          reflectionPrompts: [
            "We found out that Victor's escape is the precise point where the Creature's tragedy begins.",
            "The Creature's initial actions were completely benign, showing that prejudice, not birth, creates the monster.",
            "Mary Shelley warns us that scientists bear ultimate stewardship over their technical creations."
          ],
          commonMisconceptions: [
            {
              id: "MISCONCEPTION_INHERENT_EVIL",
              name: "Natural Monster Theory",
              triggerCondition: "responsibilityLevel > 50",
              pedagogicalAction: "Show an interactive excerpt of the Creature's speech in the Alps describing his love for the cottage family."
            }
          ],
          socraticMentorDialogue: [
            {
              character: "Sir Isaac Newton",
              avatar: "NEWTON",
              introductoryRemark: "Greetings, analyst. Let us gauge the proportions of action and reaction. If a creator exerts zero attraction, what repulsion occurs?"
            }
          ],
          successConditions: {
            criteriaText: "Match Victor's original hubris (100% ambition, 0% responsibility) to trigger the Cautionary Tale's moral arc.",
            rewardXP: 500,
            badgeUnlocked: {
              id: "gothic-ethicist",
              name: "Gothic Ethicist"
            }
          },
          failureBehaviors: {
            impactCraters: false,
            previousTrajectories: false,
            radioTransmissions: [
              "Warning: Your settings represent an alternative happy ending which does not match Mary Shelley's primary gothic text.",
              "Caution: Hubris level too low to trigger the Cautionary warning thresholds."
            ]
          },
          worldMemory: {
            persistenceEnabled: true,
            maxMemorySlots: 2
          },
          scientificDiscoveries: [
            {
              id: "cautionary-bioethics",
              title: "Cautionary Bioethics",
              description: "Technical capability must match psychological and social responsibility.",
              scientificInsight: "Feynman style: You can't just build things because they're cool! You've gotta think about the aftermath, otherwise the system backfires in your face."
            }
          ],
          rewards: {
            xp: 500,
            badges: ["gothic-ethicist"]
          },
          teacherNotes: "Perfect for Grade 11 Romantic Literature. Focuses on Mary Shelley's critique of Enlightenment hubris, Rousseau's noble savage, and the Gothic narrative frame.",
          assessmentStrategy: "Formative evaluation measuring analysis of the Socratic debate between Victor and his creation.",
          accessibilityNotes: "Socratic dialogue panels feature adjustable text sizes and high-contrast parchment colors.",
          unlockConditions: {
            minXP: 800
          },
          missionDuration: 25,
          difficulty: "Advanced",
          prerequisites: ["bastille-breach"],
          guidedInquiries: [
            { label: "🏛️ Ask Hypatia about system dynamics", text: "How can minor feedback loops in high pressure systems create non-linear collapse thresholds?" },
            { label: "🏛️ Ask Hypatia about balancing parameters", text: "Can you provide a conceptual Socratic hint regarding the variables of this conflict?" }
          ]
        }
      ]
    }
  ]
};

export default literatureClass11Curriculum;

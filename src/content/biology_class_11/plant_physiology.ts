/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurriculumPack, Chapter } from "../../types";

export const plantPhysiologyChapter: Chapter = {
  id: "plant-physiology",
  title: "Plant Physiology: Light, Carbon & Limiting Factors",
  shortDescription: "Investigate photosynthesis kinetics, test Blackman's Law, and discover rate-limiting saturation plateaus.",
  longDescription: "Step inside the greenhouse biosphere chambers. Measure oxygen bubble evolution as a function of photon flux density, ambient carbon dioxide partial pressure, and enzymatic temperature boundaries.",
  difficulty: "Intermediate",
  estimatedMinutes: 20,
  constellationPosition: { x: 38, y: 72 },
  curricularRequirements: [
    "Study of photosynthesis in higher plants: light reaction energetics and dark reaction carbon fixation.",
    "Empirical formulation of Blackman's Principle of Limiting Factors (1905).",
    "Analysis of saturation plateaus: identifying when photon absorption saturates and CO2 availability becomes the rate bottleneck."
  ],
  missions: [
    {
      id: "photosynthesis-rate",
      title: "The Law of Limiting Factors: Photosynthesis Chamber",
      codename: "OPERATION: CHLOROPLAST FLUX",
      description: "Calibrate incident light intensity on aquatic sprigs, monitor real-time oxygen evolution, and discover why rate curves flatten into Blackman saturation plateaus.",
      objectives: [
        "Measure photosynthesis rate as a direct function of incident photon flux density.",
        "Observe the linear-to-plateau transition governed by Blackman's Law of Limiting Factors.",
        "Demonstrate that increasing light intensity past saturation yields zero marginal gain when CO₂ is limiting."
      ],
      steps: [
        {
          id: "briefing",
          type: "BRIEFING",
          title: "Eden-4 Phytotron Biosphere Briefing",
          content: {
            narrative: `### LIFE SUPPORT EQUILIBRIUM: SECTOR EDEN-4
Our closed-loop orbital greenhouse depends on high-yield aquatic *Elodea* and hydroponic crop canopies to replenish breathable oxygen for the station.

Telemetry reports an energy spike: the agricultural grid is pouring massive electrical power into high-intensity grow lamps, yet station oxygen generation has stalled at a flat ceiling!

Station engineers assume more light must yield more photosynthesis: "If 400 μmol photons yields 40 units of oxygen, then 1,200 μmol photons must yield triple!"

Your assignment as Biosphere Research Officer:
1. Conduct a precision parameter sweep of incident **Light Intensity** ($I$) from $50$ to $1200 \\text{ \\mu mol/m}^2\\text{/s}$.
2. Measure the net photosynthetic rate via dissolved oxygen evolution.
3. Determine why the response curve flattens and establish the optimal operating zone inside the **[42.0 - 46.0 \\mu mol O}_2\\text{/m}^2\\text{/s}]$ saturation plateau.`
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
                message: "Hey there! People look at a green leaf and imagine some kind of mystical magic. But look closer: a chloroplast is essentially a miniature factory with an assembly line!"
              },
              {
                speaker: "Dr. Richard Feynman",
                avatar: "FEYNMAN",
                message: "Imagine you've got workers bolting wheels on cars, and trucks arriving outside delivering engine blocks. If you only have one truck bringing engines, what happens if you hire fifty more wheel workers? Do more cars roll out the door? Not a single one! The cars can only roll out as fast as the slowest part of the line!"
              },
              {
                speaker: "Sir Isaac Newton",
                avatar: "NEWTON",
                message: "Quite so. In 1905, Frederick Blackman formulated this universal law: when a process is conditioned by several separate factors, its rate is governed by the pace of the slowest factor. Observe the curve carefully as you raise the illumination."
              }
            ]
          }
        },
        {
          id: "sandbox",
          type: "SANDBOX_EXPLORATION",
          title: "Chloroplast Photon & Carbon Testbed",
          content: {
            simulationConfig: {
              simId: "PHOTOSYNTHESIS_RATE",
              initialParameters: {
                lightIntensity: 200,
                co2Concentration: 400,
                temperature: 25
              },
              minMaxLimits: {
                lightIntensity: [50, 1200],
                co2Concentration: [100, 1000],
                temperature: [10, 45]
              },
              targetFormula: {
                latex: "\\text{Rate} = \\frac{V_{\\max} \\cdot I}{I + K_I}",
                description: "Photosynthesis Saturation Kinetics (Blackman's Law)",
                variableLabels: {
                  lightIntensity: "Light Intensity / PPFD (μmol/m²/s)",
                  co2Concentration: "Ambient CO2 Concentration (ppm)",
                  temperature: "Chamber Temperature (°C)"
                }
              }
            }
          }
        },
        {
          id: "challenge",
          type: "CHALLENGE_EXPERIMENT",
          title: "The Limiting Factor Calibration Challenge",
          content: {
            challengeQuestion: {
              questionText: "Calibrate the light intensity to drive photosynthesis into its optimal saturation plateau between 42.0 and 46.0 μmol O₂/m²/s. Notice how past ~700 μmol/m²/s, the curve flattens completely as carbon fixation enzymes (RuBisCO) become saturated by ambient CO₂.",
              formulaTrigger: "photosynthesis_rate",
              targetValueRange: {
                min: 42.0,
                max: 46.0,
                targetVar: "oxygenRate"
              },
              hint: "With asymptotic capacity V_max = 50.0 and half-saturation K_I = 100 μmol/m²/s: at I = 700, Rate = (50 * 700) / 800 = 43.75 μmol O₂/m²/s. Sweep light intensity into the 700–1000 μmol/m²/s range to lock into the target band [42.0, 46.0]!",
              completionRewardXP: 500
            }
          }
        },
        {
          id: "debrief",
          type: "DEBRIEF",
          title: "Biosphere Saturation Confirmed",
          content: {
            narrative: `### MISSION SECURED: BIOSPHERE EQUILIBRIUM ACHIEVED
Telemetry confirms the photosynthetic reaction rate is locked firmly within the **[42.0 - 46.0 \\mu mol O}_2\\text{/m}^2\\text{/s}]$** target band.

The excessive power drain to the grow lamps has been halted. By proving that irradiance past 800 μmol/m²/s yielded diminishing marginal returns under ambient 400 ppm CO₂, you saved station energy reserves while preserving peak oxygen generation.

You have demonstrated **Blackman's Principle of Limiting Factors**: biological throughput is always governed by the scarcest reagent, never the arithmetic sum of favorable inputs.

**Achievement Unlocked: Blackman Botanist (ISC Class XI Plant Physiology)**`
          }
        }
      ],

      // --- CURRICULUM & REUSABLE ENGINE METADATA ---
      subject: "Biology",
      chapterName: "Plant Physiology: Light, Carbon & Limiting Factors",
      learningObjectives: [
        "Measure the net photosynthesis rate across an irradiance gradient from 50 to 1200 μmol/m²/s.",
        "Identify the light saturation point where photosynthetic rate transitions from photon-limited to CO₂-limited.",
        "Demonstrate Blackman's Law: multi-factor chemical velocity is dictated by the scarcest available factor."
      ],
      storyNarrative: "Inside the Eden Orbital Biosphere, balance grow-lamp illumination and carbon dioxide supply to maximize oxygen yield without wasting power on saturated chloroplasts.",
      world: {
        environmentName: "Eden-4 Orbital Phytotron & Biosphere Lab",
        visualAtmosphere: "Warm Growth-Lamp Green & Botanical Mist",
        audioLandscape: "Gentle hydroponic trickles, bubbling oxygen diffusers, and warm ballast hum"
      },
      coreScientificConcept: {
        name: "Blackman's Principle of Limiting Factors (Photosynthetic Saturation)",
        description: "When a process is conditioned as to its rapidity by several separate factors, the rate of the process is limited by the pace of the slowest factor. Beyond the light saturation point, additional photon flux cannot accelerate carbon fixation without increasing CO₂ or temperature.",
        equationLatex: "\\text{Rate} = \\frac{V_{\\max} \\cdot I}{I + K_I} \\quad \\text{where } V_{\\max} = f([\\text{CO}_2], T)"
      },
      coreInteraction: "PARAMETER_SANDBOX",
      parameterSandboxConfig: {
        relationshipType: "RATE_LIMITED",
        primaryParamKey: "lightIntensity",
        outputKey: "oxygenRate",
        outputLabel: "Photosynthesis Rate",
        outputUnit: "μmol O₂/m²/s",
        coefficients: {
          a: 50.0, // V_max saturation plateau
          k: 100.0 // K_I half-saturation irradiance
        },
        yRange: {
          min: 0,
          max: 60.0
        },
        targetBand: {
          min: 42.0,
          max: 46.0,
          label: "Light-Saturation Plateau"
        },
        formulaDisplayLatex: "\\text{Rate} = \\frac{50.0 \\cdot I}{I + 100.0} \\xrightarrow{I \\to \\infty} 50.0 \\text{ (CO}_2 \\text{ Limited)}"
      },
      predictionPrompt: "If we steadily increase incident light intensity from 50 to 1200 μmol·m⁻²·s⁻¹ while holding CO₂ (400 ppm) and temperature (25°C) fixed, what will happen to the photosynthetic oxygen production rate?",
      predictionPresets: [
        {
          id: "rate-increases-forever",
          label: "📈 Rate increases indefinitely without limit because more light always provides more photon energy.",
          isMisconception: true,
          misconceptionId: "MISCONCEPTION_UNLIMITED_LIGHT_ACCELERATION",
          explanation: "Photosynthesis is not just light harvesting! Once light-dependent reactions saturate, carbon fixation enzymes (RuBisCO) become the bottleneck. Rate cannot exceed the capacity of the dark reactions."
        },
        {
          id: "rate-plateaus-temperature",
          label: "❄️ Rate stays completely flat from the start because temperature alone dictates the ceiling of biological reactions.",
          isMisconception: true,
          misconceptionId: "MISCONCEPTION_TEMPERATURE_ALWAYS_DOMINATES",
          explanation: "At low irradiance, light is strictly rate-limiting regardless of temperature. Photons excite reaction centers proportionally until biochemical saturation occurs."
        },
        {
          id: "rate-plateaus-co2",
          label: "⚖️ Rate rises roughly linearly at low light, then plateaus as carbon dioxide fixation becomes the rate-limiting factor.",
          isMisconception: false,
          explanation: "Correct! By Blackman's Law of Limiting Factors, light intensity governs the rate at low irradiance. Once chlorophyll captures photons faster than RuBisCO can fix CO₂, CO₂ availability limits the plateau."
        }
      ],
      experimentFlow: {
        parameters: [
          {
            name: "lightIntensity",
            label: "Light Intensity (PPFD)",
            symbol: "I",
            min: 50,
            max: 1200,
            step: 25,
            defaultValue: 200,
            unit: "μmol/m²/s"
          },
          {
            name: "co2Concentration",
            label: "Ambient CO₂ Level",
            symbol: "CO₂",
            min: 100,
            max: 1000,
            step: 50,
            defaultValue: 400,
            unit: "ppm"
          },
          {
            name: "temperature",
            label: "Chamber Temperature",
            symbol: "T",
            min: 10,
            max: 45,
            step: 1,
            defaultValue: 25,
            unit: "°C"
          }
        ],
        targets: {
          name: "oxygenRate",
          label: "Light-Saturation Plateau",
          min: 42.0,
          max: 46.0,
          unit: "μmol O₂/m²/s",
          hint: "Increase light intensity past 700 μmol/m²/s to reach the saturation plateau governed by CO₂ limitation."
        }
      },
      reflectionPrompts: [
        "Increasing light intensity past the saturation threshold yields diminishing marginal gains because RuBisCO carbon fixation becomes the bottleneck.",
        "Blackman's Law dictates that the pace of a multi-step biological process is capped by the single slowest factor, not the average of all conditions.",
        "To shift the plateau higher, an agricultural scientist cannot simply add more lighting—they must enrich ambient CO₂ or optimize temperature."
      ],
      commonMisconceptions: [
        {
          id: "MISCONCEPTION_UNLIMITED_LIGHT_ACCELERATION",
          name: "Unlimited Light Acceleration Fallacy",
          triggerCondition: "predictionPreset === 'rate-increases-forever'",
          pedagogicalAction: "Highlight that biochemical dark reactions have a maximum enzymatic turnover independent of photon flux."
        },
        {
          id: "MISCONCEPTION_TEMPERATURE_ALWAYS_DOMINATES",
          name: "Single-Variable Dominance Fallacy",
          triggerCondition: "predictionPreset === 'rate-plateaus-temperature'",
          pedagogicalAction: "Demonstrate that at low irradiance, light reactions are photon-limited regardless of enzyme temperature."
        }
      ],
      socraticMentorDialogue: [
        {
          character: "Dr. Richard Feynman",
          avatar: "FEYNMAN",
          introductoryRemark: "Think of the chloroplast like an assembly line! If you have five workers assembling frames and only one truck delivering wheels, hiring fifty more frame workers won't produce cars any faster. Watch that curve flatten out—that plateau is nature telling you the wheels have run out!"
        },
        {
          character: "Sir Isaac Newton",
          avatar: "NEWTON",
          introductoryRemark: "Observe the asymptotic behavior of the rate function. The curve does not ascend without bounds; it approaches an upper bound determined by the scarcest reagent."
        },
        {
          character: "Galileo Galilei",
          avatar: "GALILEO",
          introductoryRemark: "Let us measure the bubbles of life emerging from the green sprig under varying candles of illumination. Direct observation reveals the boundary of growth."
        }
      ],
      successConditions: {
        criteriaText: "Light intensity calibrated to reach the saturation plateau between 42.0 and 46.0 μmol O₂/m²/s.",
        rewardXP: 500,
        badgeUnlocked: {
          id: "blackman-botanist",
          name: "Blackman Botanist"
        }
      },
      failureBehaviors: {
        impactCraters: false,
        previousTrajectories: true,
        radioTransmissions: [
          "Warning: Chamber irradiance insufficient! Chloroplasts starved of photons (operating in linear growth zone).",
          "Alert: Excessive irradiance detected! Chloroplasts saturated; excess power dissipating as wasted thermal load."
        ]
      },
      worldMemory: {
        persistenceEnabled: true,
        maxMemorySlots: 5
      },
      scientificDiscoveries: [
        {
          id: "blackmans-law",
          title: "The Law of Limiting Factors",
          description: "When a process depends on multiple independent inputs, its velocity is governed by the factor present in the least favorable amount.",
          scientificInsight: "Feynman says: Nature doesn't take an average of your good conditions. The bottleneck is boss!"
        },
        {
          id: "light-saturation-point",
          title: "Light Saturation Point (LSP)",
          description: "The irradiance intensity beyond which further photon absorption produces no additional photosynthetic rate under fixed CO₂.",
          scientificInsight: "At high light, RuBisCO enzymes are working at V_max. Adding more photons just creates excess heat unless CO₂ is enriched."
        }
      ],
      rewards: {
        xp: 500,
        badges: ["blackman-botanist"]
      },
      teacherNotes: "This mission demonstrates Blackman's Law of Limiting Factors (1905) through real-time oxygen evolution kinetics. Students explore how light intensity drives photosynthesis until a biochemical plateau is reached.",
      assessmentStrategy: "Formative Socratic assessment on student's recognition of enzymatic saturation and the single limiting factor concept.",
      accessibilityNotes: "High-contrast botanical testbed with clear readouts of photon flux density (PPFD) and net photosynthetic rate in μmol O₂/m²/s.",
      unlockConditions: {
        minXP: 0
      },
      missionDuration: 20,
      difficulty: "Intermediate",
      prerequisites: [],
      guidedInquiries: [
        { label: "🥁 Ask Feynman why more light doesn't help at high levels", text: "Why does photosynthesis flatten out into a ceiling even if we shine ten times more light on the leaf?" },
        { label: "🍎 Ask Newton about the asymptotic rate curve", text: "How does Blackman's Law create an asymptotic curve rather than a simple straight line?" },
        { label: "🌿 Ask Galileo about the bubbles of oxygen", text: "How did early natural philosophers use bubble counts in water sprigs to discover photosynthetic rates?" }
      ]
    }
  ]
};

export const biologyClass11Curriculum: CurriculumPack = {
  id: "biology-class-11",
  subject: "Biology",
  grade: "ISC Class XI",
  icon: "Dna",
  accentColor: "rose",
  chapters: [plantPhysiologyChapter]
};

export default biologyClass11Curriculum;

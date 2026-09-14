/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mission } from "../../types";

export const hydrocarbonClassMission: Mission = {
  id: "hydrocarbon-class-identification",
  title: "Hydrocarbons: Fuel Class Identification",
  codename: "OPERATION: ROVER FUEL SYNTHESIS",
  description: "A planetary rover fuel synthesis array has produced four hydrocarbon samples, but their class labels were lost during transit. Identify each sample's bonding pattern and predict its dominant reaction type.",
  objectives: [
    "Discover that hydrocarbon reactivity is determined by bond type: single, double, triple, or delocalized aromatic.",
    "Identify why aromatic rings favor substitution over addition, despite containing multiple double bonds.",
    "Correctly map all four fuel samples to their hydrocarbon class."
  ],
  steps: [
    {
      id: "briefing",
      type: "BRIEFING",
      title: "Rover Fuel Synthesis Briefing",
      content: {
        narrative: `### MISSION ADVISORY: FUEL CLASS VERIFICATION
The rover fuel synthesis array has produced four hydrocarbon samples for testing, but a transit data-loss event erased every class label.

Hydrocarbon reactivity follows directly from bond type:

- **Single bonds only (alkanes):** saturated, relatively unreactive, undergo free-radical substitution
- **One double bond (alkenes):** undergo electrophilic addition, following Markovnikov's rule
- **One triple bond (alkynes):** even more reactive toward addition than alkenes
- **Delocalized ring (aromatics):** despite containing alternating double bonds, favors **substitution** over addition, to preserve its exceptionally stable delocalized π system

Your task: identify each sample's class and predict its dominant reaction type.`
      }
    },
    {
      id: "dialogue",
      type: "DIALOGUE",
      title: "Fuel Synthesis Uplink",
      content: {
        dialogue: [
          {
            speaker: "Dr. Richard Feynman",
            avatar: "FEYNMAN",
            message: "Benzene's the trickster of this bunch. It's got double bonds just like an alkene - you'd think it'd add things eagerly. But mess with that ring, and you break a beautifully stable, spread-out electron cloud. So it substitutes instead, swapping one atom for another rather than ruining the ring."
          },
          {
            speaker: "Fuel Synthesis Control",
            avatar: "SYSTEM",
            message: "Class identification telemetry unlocked. Click a highlighted sample to begin identification."
          }
        ]
      }
    },
    {
      id: "debrief",
      type: "DEBRIEF",
      title: "Fuel Classification Complete",
      content: {
        narrative: `### TARGET SECURED: ALL FUEL SAMPLES CLASSIFIED
Every sample has been correctly classified, from unreactive alkane to the delocalized aromatic ring that defies the simple addition pattern its double bonds might suggest.

Notice the thread running through all four: reactivity traces directly back to bond type, with exactly one exception that proves the rule. Benzene's double bonds look just like an alkene's - until you remember that breaking even one of them costs the whole ring its exceptional stability, a price high enough to redirect its entire reaction pathway.

**Achievement Unlocked: The Aromatic Exception (ISC Class XI Chemistry — Hydrocarbons)**`
      }
    }
  ],

  subject: "Chemistry",
  chapterName: "Hydrocarbons: Alkanes, Alkenes, Alkynes & Aromatic Systems",
  learningObjectives: [
    "Discover that hydrocarbon reactivity is determined by bond type: single, double, triple, or delocalized aromatic.",
    "Identify why aromatic rings favor substitution over addition, despite containing multiple double bonds.",
    "Correctly map all four fuel samples to their hydrocarbon class."
  ],
  storyNarrative: "A planetary rover fuel synthesis array has produced four hydrocarbon samples, but their class labels were lost during transit. Identify each sample's bonding pattern and predict its dominant reaction type.",
  world: {
    environmentName: "Planetary Rover Fuel Synthesis Facility",
    visualAtmosphere: "Glowing Hydrocarbon Sample Chambers & Molecular Bond Displays",
    audioLandscape: "Synthesis chamber hum, fuel sample pulses, classification chimes"
  },
  coreScientificConcept: {
    name: "Hydrocarbon Bond Type & Reactivity",
    description: "Hydrocarbon reactivity is governed by bond type - saturated alkanes undergo substitution, unsaturated alkenes and alkynes undergo addition, and aromatic rings favor substitution over addition despite their double bonds, to preserve delocalized ring stability.",
    equationLatex: "\\text{C-C} < \\text{C=C} < \\text{C}\\equiv\\text{C} \\quad (\\text{reactivity toward addition})"
  },
  coreInteraction: "STRUCTURE_EXPLORER",
  structureExplorerConfig: {
    diagramTitle: "Fuel Samples — Class Labels Lost in Transit",
    svgViewBox: "0 0 660 220",
    backgroundSvg: `
      <text x="330" y="24" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="monospace">FOUR HYDROCARBON FUEL SAMPLES</text>
      <line x1="60" y1="110" x2="120" y2="110" stroke="#38bdf8" stroke-width="2" />
      <circle cx="60" cy="110" r="6" fill="#f472b6" /><circle cx="120" cy="110" r="6" fill="#f472b6" />
      <line x1="220" y1="106" x2="280" y2="106" stroke="#38bdf8" stroke-width="2" />
      <line x1="220" y1="114" x2="280" y2="114" stroke="#38bdf8" stroke-width="2" />
      <circle cx="220" cy="110" r="6" fill="#f472b6" /><circle cx="280" cy="110" r="6" fill="#f472b6" />
      <line x1="380" y1="103" x2="440" y2="103" stroke="#38bdf8" stroke-width="2" />
      <line x1="380" y1="110" x2="440" y2="110" stroke="#38bdf8" stroke-width="2" />
      <line x1="380" y1="117" x2="440" y2="117" stroke="#38bdf8" stroke-width="2" />
      <circle cx="380" cy="110" r="6" fill="#f472b6" /><circle cx="440" cy="110" r="6" fill="#f472b6" />
      <polygon points="580,75 615,95 615,135 580,155 545,135 545,95" fill="none" stroke="#38bdf8" stroke-width="2" />
      <circle cx="580" cy="115" r="22" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3 2" />
    `,
    regions: [
      {
        id: "alkane",
        label: "Alkane (e.g., Ethane) — saturated, only single C-C bonds, undergoes free-radical substitution reactions",
        shapeType: "circle",
        cx: 90,
        cy: 110,
        r: 65,
        distractors: [
          "Alkene (e.g., Ethene) — contains a C=C double bond, undergoes electrophilic addition (Markovnikov's rule)",
          "Alkyne (e.g., Ethyne) — contains a C≡C triple bond, even more reactive toward addition than alkenes",
          "Aromatic (e.g., Benzene) — delocalized ring, undergoes electrophilic substitution to preserve ring stability"
        ],
        explanation: "Correct - a single C-C bond means full saturation. With no double or triple bonds to attack, this class primarily undergoes substitution rather than addition."
      },
      {
        id: "alkene",
        label: "Alkene (e.g., Ethene) — contains a C=C double bond, undergoes electrophilic addition (Markovnikov's rule)",
        shapeType: "circle",
        cx: 250,
        cy: 110,
        r: 65,
        distractors: [
          "Alkane (e.g., Ethane) — saturated, only single C-C bonds, undergoes free-radical substitution reactions",
          "Alkyne (e.g., Ethyne) — contains a C≡C triple bond, even more reactive toward addition than alkenes",
          "Aromatic (e.g., Benzene) — delocalized ring, undergoes electrophilic substitution to preserve ring stability"
        ],
        explanation: "Correct - the double bond's exposed pi electrons are readily attacked by electrophiles, driving addition reactions that follow Markovnikov's rule."
      },
      {
        id: "alkyne",
        label: "Alkyne (e.g., Ethyne) — contains a C≡C triple bond, even more reactive toward addition than alkenes",
        shapeType: "circle",
        cx: 410,
        cy: 110,
        r: 65,
        distractors: [
          "Alkane (e.g., Ethane) — saturated, only single C-C bonds, undergoes free-radical substitution reactions",
          "Alkene (e.g., Ethene) — contains a C=C double bond, undergoes electrophilic addition (Markovnikov's rule)",
          "Aromatic (e.g., Benzene) — delocalized ring, undergoes electrophilic substitution to preserve ring stability"
        ],
        explanation: "Correct - the triple bond packs even more exposed pi electron density into a smaller space, making it even more reactive toward addition than a simple alkene."
      },
      {
        id: "aromatic",
        label: "Aromatic (e.g., Benzene) — delocalized ring, undergoes electrophilic substitution to preserve ring stability",
        shapeType: "circle",
        cx: 580,
        cy: 115,
        r: 65,
        distractors: [
          "Alkane (e.g., Ethane) — saturated, only single C-C bonds, undergoes free-radical substitution reactions",
          "Alkene (e.g., Ethene) — contains a C=C double bond, undergoes electrophilic addition (Markovnikov's rule)",
          "Alkyne (e.g., Ethyne) — contains a C≡C triple bond, even more reactive toward addition than alkenes"
        ],
        explanation: "Correct - despite looking like it contains alternating double bonds, benzene's delocalized ring is so stabilized that addition would destroy that stability. It substitutes instead, preserving the ring."
      }
    ]
  },
  predictionPrompt: "Benzene's structure is often drawn with alternating double bonds, similar to an alkene chain. Should benzene react with electrophiles the same way an alkene does - through addition?",
  predictionPresets: [
    {
      id: "benzene-adds-like-alkene",
      label: "➕ Yes - since benzene has double bonds, it should undergo addition just like an alkene.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_BENZENE_ADDS_LIKE_ALKENE",
      explanation: "Benzene's double bonds are delocalized around the entire ring, not localized like a normal alkene's - addition would break that exceptional stability, so benzene substitutes instead to preserve it."
    },
    {
      id: "aromatic-rings-unreactive",
      label: "🛡️ No - aromatic rings are completely unreactive and don't participate in any reactions.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_AROMATIC_TOTALLY_UNREACTIVE",
      explanation: "Aromatic rings are quite reactive toward electrophilic substitution specifically - they aren't unreactive, they simply favor a different reaction pathway than a normal alkene would."
    },
    {
      id: "benzene-substitutes-preserves-ring",
      label: "🎯 No - benzene favors substitution over addition, since addition would destroy its delocalized ring stability.",
      isMisconception: false,
      explanation: "Correct! Benzene's aromatic stability comes from its fully delocalized ring of pi electrons - electrophilic substitution lets it react while keeping that ring, and its stability, fully intact."
    }
  ],
  experimentFlow: {
    parameters: [
      {
        name: "structuresIdentified",
        label: "Fuel Samples Classified",
        symbol: "n",
        min: 0,
        max: 4,
        step: 1,
        defaultValue: 0,
        unit: "samples"
      }
    ],
    targets: {
      name: "totalIdentified",
      label: "Full Fuel Classification",
      min: 4,
      max: 4,
      unit: "samples",
      hint: "Count the bonds between carbons: one line means single, two means double, three means triple, and a hexagon with a ring inside means aromatic."
    }
  },
  reflectionPrompts: [
    "Explain why benzene undergoes substitution rather than addition, despite appearing to contain double bonds.",
    "Describe the reactivity trend from alkane to alkyne, and explain what structural feature drives it.",
    "Why is 'delocalization' the key word in explaining benzene's unusual reactivity?"
  ],
  commonMisconceptions: [
    {
      id: "MISCONCEPTION_BENZENE_ADDS_LIKE_ALKENE",
      name: "Benzene-Behaves-Like-Alkene Fallacy",
      triggerCondition: "predictionPreset === 'benzene-adds-like-alkene'",
      pedagogicalAction: "Reinforce via the aromatic sample's correct label that delocalization, not simple double-bond presence, is what determines benzene's substitution-favoring reactivity."
    },
    {
      id: "MISCONCEPTION_AROMATIC_TOTALLY_UNREACTIVE",
      name: "Aromatic-Totally-Unreactive Fallacy",
      triggerCondition: "predictionPreset === 'aromatic-rings-unreactive'",
      pedagogicalAction: "Clarify that aromatic rings are reactive toward electrophilic substitution specifically, not universally unreactive."
    }
  ],
  socraticMentorDialogue: [
    {
      character: "Dr. Richard Feynman",
      avatar: "FEYNMAN",
      introductoryRemark: "Welcome to the fuel bay! Four samples, four bonding patterns - and one of them is going to surprise you by refusing to follow the pattern you'd expect from its own drawing."
    },
    {
      character: "Sir Isaac Newton",
      avatar: "NEWTON",
      introductoryRemark: "Consider stability itself as a kind of inertia - the more stable a structure, the more it resists any reaction that would disturb it, however tempting that reaction might otherwise seem."
    }
  ],
  successConditions: {
    criteriaText: "All four fuel samples (alkane, alkene, alkyne, aromatic) correctly classified by bond type and dominant reaction pathway.",
    rewardXP: 500,
    badgeUnlocked: {
      id: "aromatic-exception",
      name: "The Aromatic Exception"
    }
  },
  failureBehaviors: {
    impactCraters: false,
    previousTrajectories: false,
    radioTransmissions: [
      "Notice: incorrect classification - recount the bonds between carbons and try again.",
      "Alert: fuel classification incomplete - continue identifying remaining samples."
    ]
  },
  worldMemory: {
    persistenceEnabled: true,
    maxMemorySlots: 5
  },
  scientificDiscoveries: [
    {
      id: "aromatic-exception",
      title: "The Aromatic Exception",
      description: "Benzene's delocalized ring of pi electrons is so stable that it favors electrophilic substitution over addition, breaking the simple pattern that bond type alone would predict.",
      scientificInsight: "Feynman says: benzene's the trickster of the bunch - double bonds that look like an alkene's, but a stability too precious to give up for simple addition."
    }
  ],
  rewards: {
    xp: 500,
    badges: ["aromatic-exception"]
  },
  teacherNotes: "This mission uses four non-overlapping side-by-side regions with simple decorative bond-line diagrams (single, double, triple line, and a hexagon-with-inscribed-circle for the aromatic ring). The reactivity reasoning given for each class, including benzene's substitution-over-addition preference, is chemically accurate and directly addresses a well-known ISC exam misconception.",
  assessmentStrategy: "Formative evaluation via direct classification - correct/incorrect selections tied immediately to bond-type/reactivity reasoning.",
  accessibilityNotes: "High-contrast dark backdrop with clear bond-line counts per sample and a distinctly outlined aromatic ring for visual differentiation.",
  unlockConditions: {
    prerequisites: ["reactive-intermediate-classification"]
  },
  missionDuration: 30,
  difficulty: "Advanced",
  prerequisites: ["reactive-intermediate-classification"],
  guidedInquiries: [
    { label: "🥁 Ask Feynman about the trickster ring", text: "Why does benzene refuse to react like a normal alkene, despite its double bonds?" },
    { label: "🍎 Ask Newton about stability as inertia", text: "How does thinking of stability as a kind of inertia explain benzene's unusual behavior?" }
  ]
};

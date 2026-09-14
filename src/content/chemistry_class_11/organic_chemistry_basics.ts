/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mission } from "../../types";

export const reactiveIntermediatesMission: Mission = {
  id: "reactive-intermediate-classification",
  title: "Organic Chemistry: Reactive Intermediate Mapping",
  codename: "OPERATION: BOND FISSION ANALYSIS",
  description: "A bond-fission spectrometer has captured three reactive carbon intermediates mid-reaction, but their charge and electron-count labels were lost to sensor noise. Classify each intermediate by how its parent bond broke.",
  objectives: [
    "Discover that a covalent bond can break homolytically (one electron to each fragment) or heterolytically (both electrons to one fragment).",
    "Identify the three resulting reactive carbon intermediates: free radical, carbocation, and carbanion.",
    "Correctly map all three captured intermediates to their fission mechanism and charge."
  ],
  steps: [
    {
      id: "briefing",
      type: "BRIEFING",
      title: "Bond Fission Spectrometer Briefing",
      content: {
        narrative: `### MISSION ADVISORY: INTERMEDIATE CLASSIFICATION
A bond-fission spectrometer has captured three reactive carbon species mid-reaction, each formed the instant a C-X bond broke apart. Sensor noise has erased which species came from which type of fission.

A covalent bond's two shared electrons can split in exactly two ways:

$$\\text{Homolytic fission: } A{:}B \\rightarrow A^{\\bullet} + B^{\\bullet}$$
$$\\text{Heterolytic fission: } A{:}B \\rightarrow A^{+} + B^{:-} \\quad \\text{or} \\quad A^{:-} + B^{+}$$

**Homolytic** fission splits the electron pair evenly - one electron to each fragment, producing a **free radical**. **Heterolytic** fission sends both electrons to one fragment - producing a **carbocation** (electron-deficient) on one side and a **carbanion** (electron-rich) on the other.

Your task: classify each captured intermediate correctly.`
      }
    },
    {
      id: "dialogue",
      type: "DIALOGUE",
      title: "Spectrometer Uplink",
      content: {
        dialogue: [
          {
            speaker: "Dr. Richard Feynman",
            avatar: "FEYNMAN",
            message: "Picture two kids sharing a toy. Homolytic fission is a fair split - each kid walks away with exactly one piece, both a little unhappy but equal. Heterolytic fission is one kid grabbing the whole toy - one walks away rich, the other walks away with nothing at all."
          },
          {
            speaker: "Spectrometer Control",
            avatar: "SYSTEM",
            message: "Intermediate classification telemetry unlocked. Click a highlighted species to begin identification."
          }
        ]
      }
    },
    {
      id: "debrief",
      type: "DEBRIEF",
      title: "Fission Analysis Complete",
      content: {
        narrative: `### TARGET SECURED: ALL INTERMEDIATES CLASSIFIED
Every captured species has been correctly traced back to its fission mechanism - the evenly-split free radical, the electron-poor carbocation, and the electron-rich carbanion.

Notice what determined each outcome: not the atoms involved, but simply how the shared electron pair divided at the moment of breaking. That single choice - fair split or unequal grab - decided whether the resulting carbon center would be neutral with an unpaired electron, positively charged, or negatively charged.

**Achievement Unlocked: The Fission Ledger (ISC Class XI Chemistry — Organic Chemistry Basics)**`
      }
    }
  ],

  subject: "Chemistry",
  chapterName: "Organic Chemistry: Carbon Frameworks & Reaction Mechanisms",
  learningObjectives: [
    "Discover that a covalent bond can break homolytically (one electron to each fragment) or heterolytically (both electrons to one fragment).",
    "Identify the three resulting reactive carbon intermediates: free radical, carbocation, and carbanion.",
    "Correctly map all three captured intermediates to their fission mechanism and charge."
  ],
  storyNarrative: "A bond-fission spectrometer has captured three reactive carbon intermediates mid-reaction, but their charge and electron-count labels were lost to sensor noise. Classify each intermediate by how its parent bond broke.",
  world: {
    environmentName: "Bond Fission Spectrometer Bay",
    visualAtmosphere: "Glowing Molecular Fragment Capture Chambers & Electron-Trace Displays",
    audioLandscape: "Spectrometer hum, fission capture pulses, electron-trace chimes"
  },
  coreScientificConcept: {
    name: "Homolytic & Heterolytic Bond Fission",
    description: "A covalent bond's electron pair can split evenly (homolytic fission, producing a free radical with an unpaired electron on each fragment) or unevenly (heterolytic fission, producing a carbocation and carbanion pair).",
    equationLatex: "A{:}B \\rightarrow A^{\\bullet} + B^{\\bullet} \\quad (\\text{homolytic})"
  },
  coreInteraction: "STRUCTURE_EXPLORER",
  structureExplorerConfig: {
    diagramTitle: "Captured Intermediates — Fission Origin Unknown",
    svgViewBox: "0 0 640 220",
    backgroundSvg: `
      <text x="320" y="24" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="monospace">THREE CAPTURED CARBON INTERMEDIATES</text>
      <circle cx="110" cy="120" r="30" fill="none" stroke="#38bdf8" stroke-width="2" />
      <text x="110" y="128" text-anchor="middle" fill="#e2e8f0" font-size="18" font-family="monospace">C</text>
      <circle cx="140" cy="95" r="3" fill="#fbbf24" />
      <circle cx="320" cy="120" r="30" fill="none" stroke="#f472b6" stroke-width="2" />
      <text x="320" y="128" text-anchor="middle" fill="#e2e8f0" font-size="18" font-family="monospace">C</text>
      <text x="352" y="100" fill="#f472b6" font-size="20" font-family="monospace">+</text>
      <circle cx="530" cy="120" r="30" fill="none" stroke="#38bdf8" stroke-width="2" />
      <text x="530" y="128" text-anchor="middle" fill="#e2e8f0" font-size="18" font-family="monospace">C</text>
      <circle cx="558" cy="98" r="3" fill="#fbbf24" /><circle cx="566" cy="105" r="3" fill="#fbbf24" />
      <text x="560" y="80" fill="#38bdf8" font-size="20" font-family="monospace">-</text>
    `,
    regions: [
      {
        id: "free-radical",
        label: "Free Radical — formed by homolytic fission; each fragment keeps one electron from the broken bond, leaving an unpaired electron",
        shapeType: "circle",
        cx: 110,
        cy: 120,
        r: 65,
        distractors: [
          "Carbocation — formed by heterolytic fission; carbon loses both bonding electrons, becoming positively charged",
          "Carbanion — formed by heterolytic fission; carbon keeps both bonding electrons as a lone pair, becoming negatively charged",
          "Formed by simply adding a hydrogen atom to the parent molecule"
        ],
        explanation: "Correct - the single dot marks an unpaired electron, the signature of homolytic fission's fair, one-electron-each split."
      },
      {
        id: "carbocation",
        label: "Carbocation — formed by heterolytic fission; carbon loses both bonding electrons, becoming positively charged",
        shapeType: "circle",
        cx: 320,
        cy: 120,
        r: 65,
        distractors: [
          "Free Radical — formed by homolytic fission; each fragment keeps one electron, leaving an unpaired electron",
          "Carbanion — formed by heterolytic fission; carbon keeps both bonding electrons as a lone pair, becoming negatively charged",
          "Formed by simply adding a hydrogen atom to the parent molecule"
        ],
        explanation: "Correct - the plus sign marks a carbon that lost both bonding electrons entirely to the other fragment, leaving it positively charged and electron-deficient."
      },
      {
        id: "carbanion",
        label: "Carbanion — formed by heterolytic fission; carbon keeps both bonding electrons as a lone pair, becoming negatively charged",
        shapeType: "circle",
        cx: 530,
        cy: 120,
        r: 65,
        distractors: [
          "Free Radical — formed by homolytic fission; each fragment keeps one electron, leaving an unpaired electron",
          "Carbocation — formed by heterolytic fission; carbon loses both bonding electrons, becoming positively charged",
          "Formed by simply adding a hydrogen atom to the parent molecule"
        ],
        explanation: "Correct - the lone pair and minus sign mark a carbon that kept both bonding electrons for itself, leaving it negatively charged and electron-rich."
      }
    ]
  },
  predictionPrompt: "When a C-X bond breaks, does it always split its electron pair evenly between the two resulting fragments?",
  predictionPresets: [
    {
      id: "bonds-always-split-evenly",
      label: "⚖️ Yes - a bond's shared electrons always split one-to-each when the bond breaks.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_FISSION_ALWAYS_EVEN",
      explanation: "Bond fission can also be heterolytic - both electrons going to just one fragment, producing a charged carbocation/carbanion pair rather than two neutral radicals."
    },
    {
      id: "charged-intermediates-impossible",
      label: "🚫 No - but heterolytic fission is rare and produces only unstable, non-existent species.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_HETEROLYTIC_IMPOSSIBLE",
      explanation: "Heterolytic fission is common and produces genuinely important reactive intermediates - carbocations and carbanions are central to many real organic reaction mechanisms."
    },
    {
      id: "fission-can-be-either",
      label: "🎯 No - fission can be homolytic (even split, forming radicals) or heterolytic (uneven split, forming ions).",
      isMisconception: false,
      explanation: "Correct! Both fission types occur regularly in organic chemistry, producing three distinct reactive intermediates: free radicals, carbocations, and carbanions."
    }
  ],
  experimentFlow: {
    parameters: [
      {
        name: "structuresIdentified",
        label: "Intermediates Classified",
        symbol: "n",
        min: 0,
        max: 3,
        step: 1,
        defaultValue: 0,
        unit: "species"
      }
    ],
    targets: {
      name: "totalIdentified",
      label: "Full Fission Analysis",
      min: 3,
      max: 3,
      unit: "species",
      hint: "Look for the marker: a single dot means an unpaired electron (radical), a plus sign means positive charge (cation), a lone pair with a minus sign means negative charge (anion)."
    }
  },
  reflectionPrompts: [
    "Explain the electron-counting difference between homolytic and heterolytic bond fission.",
    "Describe which of the three intermediates you would expect to act as a nucleophile, and why.",
    "Why does a carbocation have only six electrons around its central carbon instead of eight?"
  ],
  commonMisconceptions: [
    {
      id: "MISCONCEPTION_FISSION_ALWAYS_EVEN",
      name: "Always-Even-Fission Fallacy",
      triggerCondition: "predictionPreset === 'bonds-always-split-evenly'",
      pedagogicalAction: "Show via the three distinct captured species that fission outcomes vary - two of the three intermediates are charged ions, not neutral radicals, proving fission isn't always even."
    },
    {
      id: "MISCONCEPTION_HETEROLYTIC_IMPOSSIBLE",
      name: "Heterolytic-Impossible Fallacy",
      triggerCondition: "predictionPreset === 'charged-intermediates-impossible'",
      pedagogicalAction: "Reinforce that carbocations and carbanions are genuine, well-characterized reactive intermediates central to many real organic reaction mechanisms, not rare oddities."
    }
  ],
  socraticMentorDialogue: [
    {
      character: "Dr. Richard Feynman",
      avatar: "FEYNMAN",
      introductoryRemark: "Welcome to the spectrometer bay! Three ways a bond can break, three completely different characters left behind - let's figure out which is which by looking at what each one kept."
    },
    {
      character: "Sir Isaac Newton",
      avatar: "NEWTON",
      introductoryRemark: "Consider the shared pair as a possession divided between two parties at the moment of separation - equal division, or one party's complete claim upon it."
    }
  ],
  successConditions: {
    criteriaText: "All three intermediates (free radical, carbocation, carbanion) correctly classified by fission mechanism.",
    rewardXP: 500,
    badgeUnlocked: {
      id: "fission-ledger",
      name: "The Fission Ledger"
    }
  },
  failureBehaviors: {
    impactCraters: false,
    previousTrajectories: false,
    radioTransmissions: [
      "Notice: incorrect classification - review the electron/charge marker and try again.",
      "Alert: fission analysis incomplete - continue classifying remaining species."
    ]
  },
  worldMemory: {
    persistenceEnabled: true,
    maxMemorySlots: 5
  },
  scientificDiscoveries: [
    {
      id: "fission-ledger",
      title: "The Fission Ledger",
      description: "A bond's electron pair can split evenly (homolytic, forming radicals) or unevenly (heterolytic, forming ion pairs) - a simple electron-counting choice that determines an intermediate's entire chemical character.",
      scientificInsight: "Feynman says: it's a fair split producing two equally unhappy fragments, or one side grabbing the whole toy - either way, the electron count tells the whole story."
    }
  ],
  rewards: {
    xp: 500,
    badges: ["fission-ledger"]
  },
  teacherNotes: "This mission uses three non-overlapping side-by-side regions, each with a simple decorative marker (single dot for radical, plus sign for cation, lone pair + minus sign for anion). The electron-counting and charge reasoning given for each intermediate is chemically accurate and central to the ISC curriculum's reactive intermediates topic.",
  assessmentStrategy: "Formative evaluation via direct classification - correct/incorrect selections tied immediately to electron-count/charge reasoning.",
  accessibilityNotes: "High-contrast dark backdrop with distinct color-coded markers (amber dots for radical electrons, pink for cation charge, cyan for anion lone pair) and clear text labels in the identification panel.",
  unlockConditions: {
    prerequisites: ["hydrogen-periodic-position"]
  },
  missionDuration: 30,
  difficulty: "Advanced",
  prerequisites: ["hydrogen-periodic-position"],
  guidedInquiries: [
    { label: "🥁 Ask Feynman about the fair split", text: "How does the toy-sharing analogy explain the difference between homolytic and heterolytic fission?" },
    { label: "🍎 Ask Newton about the electron possession", text: "How does electron 'possession' after fission determine an intermediate's charge?" }
  ]
};

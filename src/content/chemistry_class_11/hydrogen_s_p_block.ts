/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mission } from "../../types";

export const hydrogenPositionMission: Mission = {
  id: "hydrogen-periodic-position",
  title: "Hydrogen & s/p-Block: The Anomalous Element",
  codename: "OPERATION: COMETARY EXTRACTION",
  description: "A cometary ice extraction array has captured hydrogen alongside its periodic neighbors, but the classification database crashed mid-analysis. Resolve hydrogen's dual identity by comparing it against a true alkali metal and a true halogen.",
  objectives: [
    "Discover that hydrogen shares properties with both Group 1 alkali metals and Group 17 halogens.",
    "Identify the specific electron configuration reasoning behind each element's classification.",
    "Correctly map hydrogen, lithium, and fluorine to their periodic identities."
  ],
  steps: [
    {
      id: "briefing",
      type: "BRIEFING",
      title: "Cometary Extraction Briefing",
      content: {
        narrative: `### MISSION ADVISORY: ELEMENTAL CLASSIFICATION CRASH
Our cometary ice extraction array has captured three elemental samples for hull-alloy and fuel research, but the classification database crashed mid-analysis, scrambling every identity marker.

One sample poses a genuine puzzle: it fits comfortably into no single periodic group. It has just **one valence electron** like the alkali metals - but it can also **gain one electron** to complete a stable shell, exactly like the halogens.

Your task: reason through electron configuration to correctly classify all three captured samples.`
      }
    },
    {
      id: "dialogue",
      type: "DIALOGUE",
      title: "Extraction Array Uplink",
      content: {
        dialogue: [
          {
            speaker: "Sir Isaac Newton",
            avatar: "NEWTON",
            message: "One sample defies easy placement, cadet. It behaves as an alkali metal when it loses its lone electron, yet behaves as a halogen when it gains one to complete its shell. The periodic table's neat columns strain to contain it."
          },
          {
            speaker: "Extraction Array Control",
            avatar: "SYSTEM",
            message: "Classification telemetry unlocked. Click a highlighted sample to begin identification."
          }
        ]
      }
    },
    {
      id: "debrief",
      type: "DEBRIEF",
      title: "Classification Restored",
      content: {
        narrative: `### TARGET SECURED: ALL SAMPLES CLASSIFIED
All three samples are correctly classified - Lithium confidently in Group 1, Fluorine confidently in Group 17, and Hydrogen resolved as the periodic table's genuine anomaly, belonging fully to neither.

Notice what made hydrogen so resistant to easy classification: it has only one shell to work with at all, unlike every other element on the table. That single fact lets it mimic an alkali metal's electron loss and a halogen's electron gain, depending entirely on what it reacts with.

**Achievement Unlocked: The Periodic Table's Wildcard (ISC Class XI Chemistry — Hydrogen & s/p-Block Elements)**`
      }
    }
  ],

  subject: "Chemistry",
  chapterName: "Hydrogen & s/p-Block Elements: Hydride & Alkali Chemistry",
  learningObjectives: [
    "Discover that hydrogen shares properties with both Group 1 alkali metals and Group 17 halogens.",
    "Identify the specific electron configuration reasoning behind each element's classification.",
    "Correctly map hydrogen, lithium, and fluorine to their periodic identities."
  ],
  storyNarrative: "A cometary ice extraction array has captured hydrogen alongside its periodic neighbors, but the classification database crashed mid-analysis. Resolve hydrogen's dual identity by comparing it against a true alkali metal and a true halogen.",
  world: {
    environmentName: "Cometary Ice Extraction Facility",
    visualAtmosphere: "Frozen Comet Fragments & Glowing Elemental Capture Chambers",
    audioLandscape: "Ice-drill hum, extraction chamber pulses, classification database chimes"
  },
  coreScientificConcept: {
    name: "Hydrogen's Anomalous Periodic Position",
    description: "Hydrogen has a single valence electron (like Group 1) and can also gain one electron to complete a duplet (like Group 17's octet completion). This dual resemblance, combined with hydrogen's unique single-shell structure, makes it resist clean classification into any one periodic group.",
    equationLatex: "H \\rightarrow H^+ \\text{(Group 1-like)} \\quad\\text{or}\\quad H \\rightarrow H^- \\text{(Group 17-like)}"
  },
  coreInteraction: "STRUCTURE_EXPLORER",
  structureExplorerConfig: {
    diagramTitle: "Captured Samples — Classification Database Crashed",
    svgViewBox: "0 0 640 220",
    backgroundSvg: `
      <text x="320" y="24" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="monospace">THREE CAPTURED SAMPLES — RESOLVE THEIR PERIODIC IDENTITY</text>
      <circle cx="110" cy="120" r="4" fill="#fbbf24" />
      <text x="110" y="95" text-anchor="middle" fill="#64748b" font-size="11" font-family="monospace">1 valence e-</text>
      <circle cx="320" cy="120" r="4" fill="#f472b6" />
      <text x="320" y="95" text-anchor="middle" fill="#64748b" font-size="11" font-family="monospace">1 electron, 1 shell</text>
      <circle cx="530" cy="115" r="4" fill="#38bdf8" /><circle cx="530" cy="125" r="4" fill="#38bdf8" />
      <circle cx="545" cy="115" r="4" fill="#38bdf8" /><circle cx="545" cy="125" r="4" fill="#38bdf8" />
      <circle cx="515" cy="115" r="4" fill="#38bdf8" /><circle cx="515" cy="125" r="4" fill="#38bdf8" />
      <circle cx="530" cy="105" r="4" fill="#38bdf8" />
      <text x="530" y="85" text-anchor="middle" fill="#64748b" font-size="11" font-family="monospace">7 valence e-</text>
    `,
    regions: [
      {
        id: "lithium",
        label: "Lithium (Li) — Group 1 alkali metal; 1 valence electron, readily lost to form a +1 ion",
        shapeType: "circle",
        cx: 110,
        cy: 130,
        r: 70,
        distractors: [
          "Hydrogen (H) — anomalous position; resembles both Group 1 and Group 17 depending on reaction",
          "Fluorine (F) — Group 17 halogen; needs 1 electron to complete its valence shell",
          "Hydrogen firmly belongs to Group 1 only, with no halogen-like behavior"
        ],
        explanation: "Correct - Lithium is a confident, unambiguous Group 1 alkali metal: one valence electron, readily lost to achieve a stable configuration."
      },
      {
        id: "hydrogen",
        label: "Hydrogen (H) — anomalous position; resembles both Group 1 (loses 1 electron) and Group 17 (gains 1 electron)",
        shapeType: "circle",
        cx: 320,
        cy: 130,
        r: 70,
        distractors: [
          "Lithium (Li) — Group 1 alkali metal; 1 valence electron, readily lost to form a +1 ion",
          "Fluorine (F) — Group 17 halogen; needs 1 electron to complete its valence shell",
          "Hydrogen firmly belongs to Group 1 only, with no halogen-like behavior"
        ],
        explanation: "Correct - Hydrogen's single electron in a single shell lets it behave like an alkali metal (losing that electron) or like a halogen (gaining one to complete a stable 2-electron duplet), resisting clean classification into either group."
      },
      {
        id: "fluorine",
        label: "Fluorine (F) — Group 17 halogen; needs 1 electron to complete its valence shell, forming a -1 ion",
        shapeType: "circle",
        cx: 530,
        cy: 130,
        r: 70,
        distractors: [
          "Lithium (Li) — Group 1 alkali metal; 1 valence electron, readily lost to form a +1 ion",
          "Hydrogen (H) — anomalous position; resembles both Group 1 and Group 17 depending on reaction",
          "Hydrogen firmly belongs to Group 1 only, with no halogen-like behavior"
        ],
        explanation: "Correct - Fluorine is a confident, unambiguous Group 17 halogen: seven valence electrons, needing just one more to complete a stable octet."
      }
    ]
  },
  predictionPrompt: "Hydrogen appears at the very top of the periodic table, often placed above Group 1. Does this mean hydrogen is chemically identical to Lithium and the other alkali metals?",
  predictionPresets: [
    {
      id: "hydrogen-is-pure-group1",
      label: "🔤 Yes - hydrogen's table position confirms it belongs fully to Group 1, just like Lithium.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_HYDROGEN_PURE_GROUP1",
      explanation: "Hydrogen's table position is a matter of convenience, not full chemical identity - unlike true alkali metals, hydrogen can also gain an electron to behave like a halogen, something Lithium cannot do."
    },
    {
      id: "hydrogen-no-relation-to-either",
      label: "🚫 No - hydrogen has no meaningful chemical resemblance to either Group 1 or Group 17.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_HYDROGEN_UNRELATED",
      explanation: "Hydrogen genuinely does resemble both groups in specific, real ways - it loses its electron like an alkali metal, and gains one to complete a stable shell like a halogen."
    },
    {
      id: "hydrogen-dual-resemblance",
      label: "🎯 No - hydrogen genuinely resembles both groups, depending on whether it loses or gains its single electron.",
      isMisconception: false,
      explanation: "Correct! Hydrogen's single electron in a single shell gives it genuine dual character - alkali-metal-like when losing that electron, halogen-like when gaining one."
    }
  ],
  experimentFlow: {
    parameters: [
      {
        name: "structuresIdentified",
        label: "Samples Classified",
        symbol: "n",
        min: 0,
        max: 3,
        step: 1,
        defaultValue: 0,
        unit: "samples"
      }
    ],
    targets: {
      name: "totalIdentified",
      label: "Full Classification Restoration",
      min: 3,
      max: 3,
      unit: "samples",
      hint: "Count valence electrons: 1 suggests alkali-metal-like behavior, 7 suggests halogen-like behavior, and hydrogen alone can act as either."
    }
  },
  reflectionPrompts: [
    "Explain why hydrogen resists clean classification into either Group 1 or Group 17.",
    "Describe a specific chemical reaction where hydrogen behaves like an alkali metal, and one where it behaves like a halogen.",
    "Why doesn't Lithium show the same dual behavior that hydrogen does?"
  ],
  commonMisconceptions: [
    {
      id: "MISCONCEPTION_HYDROGEN_PURE_GROUP1",
      name: "Hydrogen-Is-Pure-Group-1 Fallacy",
      triggerCondition: "predictionPreset === 'hydrogen-is-pure-group1'",
      pedagogicalAction: "Clarify that hydrogen's table position is conventional, not a full chemical identity match - reinforce via the identification challenge that hydrogen's correct label explicitly notes its dual resemblance."
    },
    {
      id: "MISCONCEPTION_HYDROGEN_UNRELATED",
      name: "Hydrogen-Unrelated-to-Either Fallacy",
      triggerCondition: "predictionPreset === 'hydrogen-no-relation-to-either'",
      pedagogicalAction: "Show via the side-by-side comparison with Lithium and Fluorine that hydrogen genuinely shares real, specific electron-configuration behavior with both."
    }
  ],
  socraticMentorDialogue: [
    {
      character: "Sir Isaac Newton",
      avatar: "NEWTON",
      introductoryRemark: "Welcome, cadet. Here sits an element that belongs fully to no column - not from any flaw in our table, but from a genuine duality in its own nature."
    },
    {
      character: "Dr. Richard Feynman",
      avatar: "FEYNMAN",
      introductoryRemark: "Hydrogen's like a guy who can join either team depending on the game being played - hand him an electron to lose, he's an alkali metal; hand him one to gain, he's basically a halogen."
    }
  ],
  successConditions: {
    criteriaText: "All three samples (Lithium, Hydrogen, Fluorine) correctly classified by periodic identity.",
    rewardXP: 450,
    badgeUnlocked: {
      id: "periodic-wildcard",
      name: "The Periodic Table's Wildcard"
    }
  },
  failureBehaviors: {
    impactCraters: false,
    previousTrajectories: false,
    radioTransmissions: [
      "Notice: incorrect classification - reconsider valence electron count and try again.",
      "Alert: classification database incomplete - continue identifying remaining samples."
    ]
  },
  worldMemory: {
    persistenceEnabled: true,
    maxMemorySlots: 5
  },
  scientificDiscoveries: [
    {
      id: "periodic-wildcard",
      title: "The Periodic Table's Wildcard",
      description: "Hydrogen's single electron in a single shell gives it genuine dual chemical character, resembling both Group 1 alkali metals and Group 17 halogens depending on the reaction.",
      scientificInsight: "Feynman says: hydrogen can join either team depending on the game being played - lose an electron like an alkali metal, or gain one like a halogen."
    }
  ],
  rewards: {
    xp: 450,
    badges: ["periodic-wildcard"]
  },
  teacherNotes: "This mission uses three non-overlapping side-by-side regions comparing Hydrogen against a true Group 1 element (Lithium) and a true Group 17 element (Fluorine), directly addressing the ISC curriculum's 'position of hydrogen' topic. The electron configuration reasoning given for each element is chemically accurate.",
  assessmentStrategy: "Formative evaluation via direct classification - correct/incorrect selections tied immediately to electron configuration reasoning.",
  accessibilityNotes: "High-contrast dark backdrop with color-coded valence electron markers (amber for Li, pink for H, cyan for F) and clear text labels in the identification panel.",
  unlockConditions: {
    prerequisites: ["vsepr-molecular-geometry"]
  },
  missionDuration: 20,
  difficulty: "Intermediate",
  prerequisites: ["vsepr-molecular-geometry"],
  guidedInquiries: [
    { label: "🍎 Ask Newton about the wildcard element", text: "Why does hydrogen resist fitting neatly into either Group 1 or Group 17?" },
    { label: "🥁 Ask Feynman about switching teams", text: "How can the same element behave like an alkali metal in one reaction and a halogen in another?" }
  ]
};

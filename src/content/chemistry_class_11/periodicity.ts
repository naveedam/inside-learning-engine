/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mission } from "../../types";

export const atomicRadiusTrendMission: Mission = {
  id: "period-2-radius-trend",
  title: "Periodicity: Atomic Radius Trend Mapping",
  codename: "OPERATION: SHIELD ALLOY SYNTHESIS",
  description: "A radiation-shielding alloy synthesis array has scanned five Period 2 elements, but sizing labels were lost in transit. Identify each element by reasoning about the atomic radius trend across a period.",
  objectives: [
    "Discover that atomic radius decreases across a period as effective nuclear charge increases.",
    "Reason from relative circle size to element identity, rather than memorizing raw values.",
    "Correctly map all five Period 2 elements shown in the scan."
  ],
  steps: [
    {
      id: "briefing",
      type: "BRIEFING",
      title: "Alloy Synthesis Scan Briefing",
      content: {
        narrative: `### MISSION ADVISORY: RADIUS TREND IDENTIFICATION
The alloy synthesis array has scanned five neighboring Period 2 elements for a radiation-shielding composite, but a labeling malfunction has erased which circle corresponds to which element.

Across a period, atomic radius shrinks steadily as protons are added to the nucleus:

$$Z_{\\text{eff}} \\uparrow \\implies r_{\\text{atomic}} \\downarrow$$

Each added proton pulls the same outer shell inward more tightly — even as electrons are also being added, the electrons stay in the *same* shell, so the stronger pull wins. Your task: reason from the relative sizes shown to correctly identify each element, from largest radius to smallest.`
      }
    },
    {
      id: "dialogue",
      type: "DIALOGUE",
      title: "Synthesis Array Uplink",
      content: {
        dialogue: [
          {
            speaker: "Sir Isaac Newton",
            avatar: "NEWTON",
            message: "Do not mistake this for a matter of mere electron count, cadet. Each element here has more electrons than the last - and yet grows smaller, not larger. The nucleus's growing pull outpaces the crowding of its shell."
          },
          {
            speaker: "Synthesis Array Control",
            avatar: "SYSTEM",
            message: "Structure identification telemetry unlocked. Click a highlighted circle to begin identification."
          }
        ]
      }
    },
    {
      id: "debrief",
      type: "DEBRIEF",
      title: "Radius Scan Restored",
      content: {
        narrative: `### TARGET SECURED: FULL PERIOD 2 TREND RESTORED
Every element in the scan has been correctly identified, from Lithium's expansive outer shell down to Nitrogen's tightly-pulled electron cloud.

Notice what stayed constant across all five: the same principal shell (n=2) holding the outermost electrons. What changed was purely nuclear pull - each additional proton drew that shell in a little tighter, shrinking radius steadily left to right.

**Achievement Unlocked: The Shrinking Shell (ISC Class XI Chemistry — Periodicity)**`
      }
    }
  ],

  subject: "Chemistry",
  chapterName: "Periodicity: Elemental Trends & Valence Shells",
  learningObjectives: [
    "Discover that atomic radius decreases across a period as effective nuclear charge increases.",
    "Reason from relative circle size to element identity, rather than memorizing raw values.",
    "Correctly map all five Period 2 elements shown in the scan."
  ],
  storyNarrative: "A radiation-shielding alloy synthesis array has scanned five Period 2 elements, but sizing labels were lost in transit. Identify each element by reasoning about the atomic radius trend across a period.",
  world: {
    environmentName: "Deep Space Alloy Synthesis Array",
    visualAtmosphere: "Glowing Elemental Scan Chambers & Radiation Shield Schematics",
    audioLandscape: "Synthesis chamber hum, scanning pulses, alloy-forge resonance"
  },
  coreScientificConcept: {
    name: "Periodic Trend: Atomic Radius Across a Period",
    description: "Atomic radius decreases steadily across a period as increasing effective nuclear charge pulls the same outer shell inward more tightly, even as electrons are also being added to that same shell.",
    equationLatex: "Z_{eff} \\uparrow \\implies r_{atomic} \\downarrow"
  },
  coreInteraction: "STRUCTURE_EXPLORER",
  structureExplorerConfig: {
    diagramTitle: "Period 2 Atomic Radius Scan — Labels Lost",
    svgViewBox: "0 0 480 220",
    backgroundSvg: `
      <text x="240" y="24" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="monospace">INCREASING EFFECTIVE NUCLEAR CHARGE →</text>
      <line x1="30" y1="40" x2="450" y2="40" stroke="#334155" stroke-width="1" stroke-dasharray="4 3" marker-end="url(#arrow)" />
    `,
    regions: [
      {
        id: "lithium",
        label: "Lithium (Li) — largest atomic radius shown; lowest effective nuclear charge in this set",
        shapeType: "circle",
        cx: 70,
        cy: 130,
        r: 45,
        distractors: [
          "Nitrogen (N) — smallest atomic radius shown; highest effective nuclear charge in this set",
          "Carbon (C) — second-smallest atomic radius, four valence electrons pulled inward",
          "Radius increases left-to-right across a period as more electrons are added"
        ],
        explanation: "Correct - Lithium has the fewest protons of this set, giving it the weakest nuclear pull on its single n=2 electron, and therefore the largest radius."
      },
      {
        id: "beryllium",
        label: "Beryllium (Be) — second-largest radius; nuclear charge increases, radius shrinks from Lithium",
        shapeType: "circle",
        cx: 180,
        cy: 130,
        r: 38,
        distractors: [
          "Boron (B) — third-largest radius shown here",
          "Lithium (Li) — largest atomic radius shown; lowest effective nuclear charge",
          "Radius increases left-to-right across a period as more electrons are added"
        ],
        explanation: "Correct - Beryllium has one more proton than Lithium, pulling its n=2 shell in slightly tighter despite also gaining one more electron in that same shell."
      },
      {
        id: "boron",
        label: "Boron (B) — continuing the decrease in radius across Period 2",
        shapeType: "circle",
        cx: 280,
        cy: 130,
        r: 32,
        distractors: [
          "Beryllium (Be) — second-largest radius; nuclear charge increases, radius shrinks",
          "Nitrogen (N) — smallest atomic radius shown; highest effective nuclear charge",
          "Radius increases left-to-right across a period as more electrons are added"
        ],
        explanation: "Correct - Boron's radius continues the steady shrinkage, its five protons pulling the n=2 shell tighter than Beryllium's four."
      },
      {
        id: "carbon",
        label: "Carbon (C) — second-smallest radius, six protons pulling the shell in further",
        shapeType: "circle",
        cx: 360,
        cy: 130,
        r: 27,
        distractors: [
          "Lithium (Li) — largest atomic radius shown; lowest effective nuclear charge",
          "Boron (B) — continuing the decrease in radius across Period 2",
          "Radius increases left-to-right across a period as more electrons are added"
        ],
        explanation: "Correct - Carbon's six protons pull its n=2 shell in tighter still, continuing the steady shrinkage across the period."
      },
      {
        id: "nitrogen",
        label: "Nitrogen (N) — smallest atomic radius shown; highest effective nuclear charge in this set",
        shapeType: "circle",
        cx: 425,
        cy: 130,
        r: 23,
        distractors: [
          "Lithium (Li) — largest atomic radius shown; lowest effective nuclear charge",
          "Beryllium (Be) — second-largest radius; nuclear charge increases, radius shrinks",
          "Radius increases left-to-right across a period as more electrons are added"
        ],
        explanation: "Correct - Nitrogen's seven protons give it the strongest pull on its n=2 shell of any element in this set, producing the smallest radius."
      }
    ]
  },
  predictionPrompt: "As you move across Period 2 from Lithium to Nitrogen, each element has more electrons than the last. Does atomic radius grow or shrink as a result?",
  predictionPresets: [
    {
      id: "radius-grows-with-electrons",
      label: "📈 Radius grows steadily, since more electrons means a bigger electron cloud.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_MORE_ELECTRONS_BIGGER_ATOM",
      explanation: "The added electrons stay in the SAME outer shell (n=2) across this period, so the dominant effect is the growing nuclear charge pulling that shell in tighter - radius actually shrinks."
    },
    {
      id: "radius-unrelated-to-charge",
      label: "➡️ Radius stays roughly constant, since the number of occupied shells doesn't change.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_RADIUS_SHELL_COUNT_ONLY",
      explanation: "Radius depends on nuclear pull as well as shell count - within the same shell, increasing nuclear charge still produces a substantial, measurable radius decrease."
    },
    {
      id: "radius-shrinks-nuclear-charge",
      label: "🎯 Radius shrinks steadily, since increasing nuclear charge outweighs the extra electron in the same shell.",
      isMisconception: false,
      explanation: "Correct! Effective nuclear charge grows faster than electron-electron shielding within the same shell, pulling the whole electron cloud in tighter across the period."
    }
  ],
  experimentFlow: {
    parameters: [
      {
        name: "structuresIdentified",
        label: "Elements Identified",
        symbol: "n",
        min: 0,
        max: 5,
        step: 1,
        defaultValue: 0,
        unit: "elements"
      }
    ],
    targets: {
      name: "totalIdentified",
      label: "Full Trend Restoration",
      min: 5,
      max: 5,
      unit: "elements",
      hint: "The largest circle is leftmost on the period; radius shrinks steadily as you move right."
    }
  },
  reflectionPrompts: [
    "Explain why atomic radius shrinks across a period even as more electrons are added.",
    "Describe what would happen to this trend if you instead moved DOWN a group rather than across a period.",
    "Why does the added electron not fully cancel out the added proton's pull, within the same shell?"
  ],
  commonMisconceptions: [
    {
      id: "MISCONCEPTION_MORE_ELECTRONS_BIGGER_ATOM",
      name: "More-Electrons-Bigger-Atom Fallacy",
      triggerCondition: "predictionPreset === 'radius-grows-with-electrons'",
      pedagogicalAction: "Show via the diagram that circle size shrinks steadily left to right, directly contradicting the idea that more electrons alone means a bigger atom."
    },
    {
      id: "MISCONCEPTION_RADIUS_SHELL_COUNT_ONLY",
      name: "Shell-Count-Only Fallacy",
      triggerCondition: "predictionPreset === 'radius-unrelated-to-charge'",
      pedagogicalAction: "Clarify that even within a single shell, nuclear charge produces a real, substantial radius change - shell count is not the only factor."
    }
  ],
  socraticMentorDialogue: [
    {
      character: "Sir Isaac Newton",
      avatar: "NEWTON",
      introductoryRemark: "Welcome, cadet. Five elements, each with more electrons than the last - and yet each one smaller. Let the nucleus's growing pull explain what electron count alone cannot."
    },
    {
      character: "Dr. Richard Feynman",
      avatar: "FEYNMAN",
      introductoryRemark: "Think of it like adding more magnets to the center of a room while only adding a few more people to the same crowded ring around it - the room gets pulled in tighter, not bigger."
    }
  ],
  successConditions: {
    criteriaText: "All five Period 2 elements (Li, Be, B, C, N) correctly identified by relative atomic radius.",
    rewardXP: 450,
    badgeUnlocked: {
      id: "shrinking-shell",
      name: "The Shrinking Shell"
    }
  },
  failureBehaviors: {
    impactCraters: false,
    previousTrajectories: false,
    radioTransmissions: [
      "Notice: incorrect identification - reconsider the size ordering and try again.",
      "Alert: scan restoration incomplete - continue identifying remaining elements."
    ]
  },
  worldMemory: {
    persistenceEnabled: true,
    maxMemorySlots: 5
  },
  scientificDiscoveries: [
    {
      id: "shrinking-shell",
      title: "The Shrinking Shell",
      description: "Atomic radius decreases across a period because growing nuclear charge outweighs the shielding effect of electrons added to the same shell.",
      scientificInsight: "Feynman says: more magnets at the center pull the same crowded ring in tighter - it doesn't matter that a few more people also joined that ring."
    }
  ],
  rewards: {
    xp: 450,
    badges: ["shrinking-shell"]
  },
  teacherNotes: "This is the second STRUCTURE_EXPLORER mission, using non-overlapping side-by-side circles rather than nested ones (a deliberately simpler, lower-risk region geometry than Atomic Structure's concentric shells, now that the underlying click-detection pattern is confirmed working). Radii shown are illustrative and ordered correctly relative to each other (decreasing Li>Be>B>C>N, matching the real periodic trend) but are not to any particular real-world scale.",
  assessmentStrategy: "Formative evaluation via direct identification - correct/incorrect selections tied immediately to the periodic trend reasoning.",
  accessibilityNotes: "High-contrast dark backdrop with clearly differentiated circle sizes and a directional trend arrow for orientation.",
  unlockConditions: {
    prerequisites: ["bohr-model-electron-shells"]
  },
  missionDuration: 20,
  difficulty: "Beginner",
  prerequisites: ["bohr-model-electron-shells"],
  guidedInquiries: [
    { label: "🍎 Ask Newton about the growing pull", text: "Why does adding more protons shrink the atom even as electrons are also added?" },
    { label: "🥁 Ask Feynman about the magnet analogy", text: "How does the magnets-in-a-room analogy explain the atomic radius trend?" }
  ]
};

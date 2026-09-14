/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mission } from "../../types";

export const vseprGeometryMission: Mission = {
  id: "vsepr-molecular-geometry",
  title: "Chemical Bonding: VSEPR Geometry Mapping",
  codename: "OPERATION: ATMOSPHERIC SCRUBBER",
  description: "An atmospheric scrubber array has captured four volatile molecules for analysis, but their geometry classifications were corrupted mid-transmission. Identify each molecule's VSEPR shape to stabilize the scrubber's filtration lattice.",
  objectives: [
    "Discover that molecular geometry is determined by the number of bonding pairs and lone pairs around a central atom.",
    "Identify how lone pairs distort geometry away from the 'ideal' bonding-pair-only shape.",
    "Correctly map all four captured molecules to their VSEPR geometries."
  ],
  steps: [
    {
      id: "briefing",
      type: "BRIEFING",
      title: "Scrubber Array Briefing",
      content: {
        narrative: `### MISSION ADVISORY: MOLECULAR GEOMETRY VERIFICATION
The atmospheric scrubber has captured four volatile molecules for filtration analysis, but a data corruption event erased their geometry classifications mid-transmission.

VSEPR theory predicts molecular shape from one simple rule: electron pairs around a central atom - whether bonding pairs or lone pairs - arrange themselves to be as far apart as possible.

$$\\text{Shape} = f(\\text{bonding pairs}, \\text{lone pairs})$$

Critically, **lone pairs count toward repulsion but aren't part of the visible shape** - they push bonding pairs closer together, bending what would otherwise be a symmetric geometry. Your task: identify each molecule's correct VSEPR geometry.`
      }
    },
    {
      id: "dialogue",
      type: "DIALOGUE",
      title: "Scrubber Array Uplink",
      content: {
        dialogue: [
          {
            speaker: "Dr. Richard Feynman",
            avatar: "FEYNMAN",
            message: "Here's the trick: a lone pair is invisible in the final shape, but it still shoves everything else out of its way. That's why water bends instead of going straight - there's an unseen pair of electrons elbowing the two hydrogens closer together."
          },
          {
            speaker: "Scrubber Array Control",
            avatar: "SYSTEM",
            message: "Molecular geometry telemetry unlocked. Click a highlighted molecule to begin classification."
          }
        ]
      }
    },
    {
      id: "debrief",
      type: "DEBRIEF",
      title: "Scrubber Lattice Stabilized",
      content: {
        narrative: `### TARGET SECURED: ALL GEOMETRIES CLASSIFIED
Every captured molecule has been correctly classified, and the scrubber's filtration lattice recalibrates around their true shapes.

Notice the pattern beneath all four: from linear CO2's zero lone pairs, through water's two, each additional lone pair bent the shape further away from a simple, symmetric arrangement - invisible electrons, visible consequences.

**Achievement Unlocked: The Invisible Architect (ISC Class XI Chemistry — Chemical Bonding)**`
      }
    }
  ],

  subject: "Chemistry",
  chapterName: "Chemical Bonding & Molecular Architecture",
  learningObjectives: [
    "Discover that molecular geometry is determined by the number of bonding pairs and lone pairs around a central atom.",
    "Identify how lone pairs distort geometry away from the 'ideal' bonding-pair-only shape.",
    "Correctly map all four captured molecules to their VSEPR geometries."
  ],
  storyNarrative: "An atmospheric scrubber array has captured four volatile molecules for analysis, but their geometry classifications were corrupted mid-transmission. Identify each molecule's VSEPR shape to stabilize the scrubber's filtration lattice.",
  world: {
    environmentName: "Atmospheric Scrubber Filtration Array",
    visualAtmosphere: "Glowing Molecular Capture Chambers & Lattice Stabilization Grids",
    audioLandscape: "Filtration hum, molecular capture chimes, lattice stabilization pulses"
  },
  coreScientificConcept: {
    name: "VSEPR Theory & Molecular Geometry",
    description: "Valence Shell Electron Pair Repulsion theory predicts molecular shape from the principle that electron pairs (bonding and lone) arrange to minimize repulsion. Lone pairs occupy space and influence geometry without appearing in the visible molecular shape.",
    equationLatex: "\\text{Shape} = f(\\text{bonding pairs}, \\text{lone pairs})"
  },
  coreInteraction: "STRUCTURE_EXPLORER",
  structureExplorerConfig: {
    diagramTitle: "Captured Volatiles — Geometry Labels Corrupted",
    svgViewBox: "0 0 640 220",
    backgroundSvg: `
      <text x="320" y="24" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="monospace">FOUR CAPTURED MOLECULES — CLASSIFY EACH GEOMETRY</text>
      <line x1="10" y1="110" x2="170" y2="110" stroke="#38bdf8" stroke-width="2" />
      <circle cx="90" cy="110" r="8" fill="#f472b6" />
      <circle cx="30" cy="110" r="6" fill="#38bdf8" />
      <circle cx="150" cy="110" r="6" fill="#38bdf8" />
      <line x1="230" y1="130" x2="270" y2="90" stroke="#38bdf8" stroke-width="2" />
      <line x1="270" y1="90" x2="310" y2="130" stroke="#38bdf8" stroke-width="2" />
      <circle cx="270" cy="90" r="8" fill="#f472b6" />
      <circle cx="230" cy="130" r="6" fill="#38bdf8" />
      <circle cx="310" cy="130" r="6" fill="#38bdf8" />
      <circle cx="270" cy="65" r="3" fill="#fbbf24" /><circle cx="278" cy="60" r="3" fill="#fbbf24" />
      <line x1="380" y1="140" x2="420" y2="90" stroke="#38bdf8" stroke-width="2" />
      <line x1="420" y1="90" x2="460" y2="140" stroke="#38bdf8" stroke-width="2" />
      <line x1="420" y1="90" x2="420" y2="140" stroke="#38bdf8" stroke-width="2" />
      <circle cx="420" cy="90" r="8" fill="#f472b6" />
      <circle cx="380" cy="140" r="6" fill="#38bdf8" />
      <circle cx="460" cy="140" r="6" fill="#38bdf8" />
      <circle cx="420" cy="140" r="6" fill="#38bdf8" />
      <circle cx="420" cy="65" r="3" fill="#fbbf24" />
      <line x1="540" y1="80" x2="580" y2="110" stroke="#38bdf8" stroke-width="2" />
      <line x1="580" y1="110" x2="540" y2="140" stroke="#38bdf8" stroke-width="2" />
      <line x1="580" y1="110" x2="620" y2="80" stroke="#38bdf8" stroke-width="2" />
      <line x1="580" y1="110" x2="620" y2="140" stroke="#38bdf8" stroke-width="2" />
      <circle cx="580" cy="110" r="8" fill="#f472b6" />
      <circle cx="540" cy="80" r="6" fill="#38bdf8" />
      <circle cx="540" cy="140" r="6" fill="#38bdf8" />
      <circle cx="620" cy="80" r="6" fill="#38bdf8" />
      <circle cx="620" cy="140" r="6" fill="#38bdf8" />
    `,
    regions: [
      {
        id: "co2",
        label: "Carbon Dioxide (CO2) — Linear geometry, 180° bond angle, 0 lone pairs on central atom",
        shapeType: "circle",
        cx: 90,
        cy: 110,
        r: 70,
        distractors: [
          "Water (H2O) — Bent geometry, ~104.5° bond angle, 2 lone pairs on central atom",
          "Ammonia (NH3) — Trigonal Pyramidal geometry, ~107° bond angle, 1 lone pair on central atom",
          "Methane (CH4) — Tetrahedral geometry, 109.5° bond angle, 0 lone pairs on central atom"
        ],
        explanation: "Correct - with zero lone pairs and two bonding regions, the two C=O bonds push as far apart as possible: directly opposite each other, giving a perfectly linear 180° shape."
      },
      {
        id: "h2o",
        label: "Water (H2O) — Bent geometry, ~104.5° bond angle, 2 lone pairs on central atom",
        shapeType: "circle",
        cx: 270,
        cy: 110,
        r: 70,
        distractors: [
          "Carbon Dioxide (CO2) — Linear geometry, 180° bond angle, 0 lone pairs on central atom",
          "Ammonia (NH3) — Trigonal Pyramidal geometry, ~107° bond angle, 1 lone pair on central atom",
          "Methane (CH4) — Tetrahedral geometry, 109.5° bond angle, 0 lone pairs on central atom"
        ],
        explanation: "Correct - oxygen's two lone pairs take up significant space, pushing the two O-H bonds together into a bent shape noticeably less than the ideal tetrahedral 109.5°."
      },
      {
        id: "nh3",
        label: "Ammonia (NH3) — Trigonal Pyramidal geometry, ~107° bond angle, 1 lone pair on central atom",
        shapeType: "circle",
        cx: 420,
        cy: 110,
        r: 70,
        distractors: [
          "Carbon Dioxide (CO2) — Linear geometry, 180° bond angle, 0 lone pairs on central atom",
          "Water (H2O) — Bent geometry, ~104.5° bond angle, 2 lone pairs on central atom",
          "Methane (CH4) — Tetrahedral geometry, 109.5° bond angle, 0 lone pairs on central atom"
        ],
        explanation: "Correct - nitrogen's single lone pair pushes the three N-H bonds slightly together, producing a pyramidal shape with a bond angle just under the ideal tetrahedral value."
      },
      {
        id: "ch4",
        label: "Methane (CH4) — Tetrahedral geometry, 109.5° bond angle, 0 lone pairs on central atom",
        shapeType: "circle",
        cx: 580,
        cy: 110,
        r: 70,
        distractors: [
          "Carbon Dioxide (CO2) — Linear geometry, 180° bond angle, 0 lone pairs on central atom",
          "Water (H2O) — Bent geometry, ~104.5° bond angle, 2 lone pairs on central atom",
          "Ammonia (NH3) — Trigonal Pyramidal geometry, ~107° bond angle, 1 lone pair on central atom"
        ],
        explanation: "Correct - with zero lone pairs and four identical bonding pairs, methane achieves the ideal, undistorted tetrahedral geometry at exactly 109.5°."
      }
    ]
  },
  predictionPrompt: "Water (H2O) and Methane (CH4) both have a central atom bonded to other atoms, yet their bond angles differ substantially (104.5° vs 109.5°). What causes this difference?",
  predictionPresets: [
    {
      id: "bond-angle-atom-size",
      label: "⚛️ The difference comes from oxygen and carbon being different sizes.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_ANGLE_FROM_ATOM_SIZE",
      explanation: "Bond angle differences here come from lone pair count, not central atom size - oxygen's two lone pairs actively push the bonding pairs closer together, which carbon (with zero lone pairs in methane) doesn't experience."
    },
    {
      id: "lone-pairs-dont-affect-shape",
      label: "👻 Lone pairs don't affect molecular shape since they aren't shown in the final structure.",
      isMisconception: true,
      misconceptionId: "MISCONCEPTION_LONE_PAIRS_INVISIBLE_NO_EFFECT",
      explanation: "Lone pairs are invisible in the final drawn shape, but they still occupy space and repel bonding pairs - their effect on geometry is real even though they aren't part of the visible molecular outline."
    },
    {
      id: "lone-pairs-compress-angle",
      label: "🎯 Oxygen's two lone pairs push the bonding pairs closer together than methane's zero lone pairs do.",
      isMisconception: false,
      explanation: "Correct! Each lone pair exerts extra repulsion that compresses the remaining bond angles - water's two lone pairs compress its angle well below methane's undistorted 109.5°."
    }
  ],
  experimentFlow: {
    parameters: [
      {
        name: "structuresIdentified",
        label: "Molecules Classified",
        symbol: "n",
        min: 0,
        max: 4,
        step: 1,
        defaultValue: 0,
        unit: "molecules"
      }
    ],
    targets: {
      name: "totalIdentified",
      label: "Full Geometry Classification",
      min: 4,
      max: 4,
      unit: "molecules",
      hint: "Count lone pairs on the central atom: 0 gives linear/tetrahedral shapes, 1 gives pyramidal, 2 gives bent."
    }
  },
  reflectionPrompts: [
    "Explain why lone pairs affect molecular geometry despite not appearing in the drawn shape.",
    "Describe how you would predict the geometry of a molecule with 3 bonding pairs and 1 lone pair.",
    "Why does CO2 remain perfectly linear while H2O bends, given both have a central atom bonded to two other atoms?"
  ],
  commonMisconceptions: [
    {
      id: "MISCONCEPTION_ANGLE_FROM_ATOM_SIZE",
      name: "Atom-Size-Determines-Angle Fallacy",
      triggerCondition: "predictionPreset === 'bond-angle-atom-size'",
      pedagogicalAction: "Reinforce via the identification challenge that geometry changes track lone pair count directly, not the identity or size of the central atom."
    },
    {
      id: "MISCONCEPTION_LONE_PAIRS_INVISIBLE_NO_EFFECT",
      name: "Invisible-Means-No-Effect Fallacy",
      triggerCondition: "predictionPreset === 'lone-pairs-dont-affect-shape'",
      pedagogicalAction: "Show via the four contrasting geometries that lone pair count directly predicts how far each shape deviates from the ideal bonding-pair-only geometry."
    }
  ],
  socraticMentorDialogue: [
    {
      character: "Dr. Richard Feynman",
      avatar: "FEYNMAN",
      introductoryRemark: "Welcome to the scrubber array! Four molecules, four different shapes - and the secret ingredient nobody draws is the lone pair, quietly shoving everything else out of its way."
    },
    {
      character: "Sir Isaac Newton",
      avatar: "NEWTON",
      introductoryRemark: "Consider each electron pair, whether bonded or lone, as a body repelling its neighbors - the final geometry is nothing more than the equilibrium of those mutual repulsions."
    }
  ],
  successConditions: {
    criteriaText: "All four molecules (CO2, H2O, NH3, CH4) correctly classified by VSEPR geometry.",
    rewardXP: 500,
    badgeUnlocked: {
      id: "invisible-architect",
      name: "The Invisible Architect"
    }
  },
  failureBehaviors: {
    impactCraters: false,
    previousTrajectories: false,
    radioTransmissions: [
      "Notice: incorrect classification - review lone pair count and try again.",
      "Alert: lattice stabilization incomplete - continue classifying remaining molecules."
    ]
  },
  worldMemory: {
    persistenceEnabled: true,
    maxMemorySlots: 5
  },
  scientificDiscoveries: [
    {
      id: "invisible-architect",
      title: "The Invisible Architect",
      description: "Lone pairs shape molecular geometry through repulsion even though they never appear in the final drawn structure.",
      scientificInsight: "Feynman says: an unseen pair of electrons can still elbow its way into determining a molecule's entire shape."
    }
  ],
  rewards: {
    xp: 500,
    badges: ["invisible-architect"]
  },
  teacherNotes: "This mission uses four non-overlapping side-by-side regions, each encompassing a small decorative ball-and-stick style diagram (drawn as simple lines and circles, not precise 3D projections). The angle values and lone pair counts stated for CO2, H2O, NH3, and CH4 are chemically accurate; the 2D decorative diagrams are simplified stand-ins for the true 3D geometries and are not drawn to precise bond-angle scale.",
  assessmentStrategy: "Formative evaluation via direct classification - correct/incorrect selections tied immediately to lone-pair-count reasoning.",
  accessibilityNotes: "High-contrast dark backdrop with color-coded atoms (pink for central atom, cyan for bonded atoms, amber for lone pair markers) and clear text labels in the identification panel.",
  unlockConditions: {
    prerequisites: ["period-2-radius-trend"]
  },
  missionDuration: 30,
  difficulty: "Advanced",
  prerequisites: ["period-2-radius-trend"],
  guidedInquiries: [
    { label: "🥁 Ask Feynman about the invisible elbow", text: "How can something invisible in the final structure still change a molecule's shape?" },
    { label: "🍎 Ask Newton about repulsion equilibrium", text: "How does treating electron pairs as mutually repelling bodies predict molecular geometry?" }
  ]
};

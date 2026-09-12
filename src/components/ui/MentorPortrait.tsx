/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export type MentorId = "GALILEO" | "NEWTON" | "FEYNMAN" | "CURIE" | "SYSTEM" | "EINSTEIN" | string;

export interface MentorPortraitProps {
  mentorId: MentorId;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  className?: string;
  glow?: boolean;
  showReticle?: boolean;
}

const SIZE_MAP = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80
};

export default function MentorPortrait({
  mentorId,
  size = "md",
  className = "",
  glow = true,
  showReticle = true
}: MentorPortraitProps) {
  const pixelSize = typeof size === "number" ? size : SIZE_MAP[size] || 40;
  const normalizedId = (mentorId || "GALILEO").toUpperCase();

  // Color profiles matching HUD theme
  let strokeColor = "#38bdf8"; // Cyan default (Galileo)
  let glowColor = "rgba(56, 189, 248, 0.4)";
  let bgGradFrom = "rgba(14, 116, 144, 0.25)";
  let bgGradTo = "rgba(8, 51, 68, 0.05)";

  if (normalizedId === "NEWTON") {
    strokeColor = "#fb923c"; // Orange/Amber
    glowColor = "rgba(251, 146, 60, 0.4)";
    bgGradFrom = "rgba(194, 65, 12, 0.25)";
    bgGradTo = "rgba(67, 20, 7, 0.05)";
  } else if (normalizedId === "FEYNMAN") {
    strokeColor = "#c084fc"; // Purple/Violet
    glowColor = "rgba(192, 132, 252, 0.4)";
    bgGradFrom = "rgba(126, 34, 206, 0.25)";
    bgGradTo = "rgba(59, 7, 100, 0.05)";
  } else if (normalizedId === "CURIE") {
    strokeColor = "#34d399"; // Emerald/Mint
    glowColor = "rgba(52, 211, 153, 0.4)";
    bgGradFrom = "rgba(5, 150, 105, 0.25)";
    bgGradTo = "rgba(6, 78, 59, 0.05)";
  } else if (normalizedId === "SYSTEM" || normalizedId === "HYPATIA") {
    strokeColor = "#2dd4bf"; // Teal
    glowColor = "rgba(45, 212, 191, 0.4)";
    bgGradFrom = "rgba(13, 148, 136, 0.25)";
    bgGradTo = "rgba(19, 78, 74, 0.05)";
  } else if (normalizedId === "EINSTEIN") {
    strokeColor = "#818cf8"; // Indigo
    glowColor = "rgba(129, 140, 248, 0.4)";
    bgGradFrom = "rgba(67, 56, 202, 0.25)";
    bgGradTo = "rgba(30, 27, 75, 0.05)";
  }

  const gradId = `mentor-grad-${normalizedId}-${pixelSize}`;
  const filterId = `mentor-glow-${normalizedId}-${pixelSize}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <svg
        viewBox="0 0 100 100"
        width={pixelSize}
        height={pixelSize}
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={bgGradFrom} />
            <stop offset="100%" stopColor={bgGradTo} />
          </radialGradient>
          {glow && (
            <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={glowColor} />
            </filter>
          )}
        </defs>

        {/* Outer HUD Reticle Frame with corner ticks */}
        <circle
          cx="50"
          cy="50"
          r="47"
          fill={`url(#${gradId})`}
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeOpacity="0.4"
        />

        {showReticle && (
          <>
            {/* Top, Bottom, Left, Right HUD Reticle Ticks */}
            <line x1="50" y1="2" x2="50" y2="7" stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="50" y1="93" x2="50" y2="98" stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="2" y1="50" x2="7" y2="50" stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="93" y1="50" x2="98" y2="50" stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.8" />
            
            {/* Corner diagonal tick marks */}
            <circle cx="20" cy="20" r="1" fill={strokeColor} fillOpacity="0.6" />
            <circle cx="80" cy="20" r="1" fill={strokeColor} fillOpacity="0.6" />
            <circle cx="20" cy="80" r="1" fill={strokeColor} fillOpacity="0.6" />
            <circle cx="80" cy="80" r="1" fill={strokeColor} fillOpacity="0.6" />
          </>
        )}

        {/* Character Specific Line-Art Silhouette & Disciplinary Motifs */}
        <g filter={glow ? `url(#${filterId})` : undefined}>
          {normalizedId === "GALILEO" && <GalileoSilhouette stroke={strokeColor} />}
          {normalizedId === "NEWTON" && <NewtonSilhouette stroke={strokeColor} />}
          {normalizedId === "FEYNMAN" && <FeynmanSilhouette stroke={strokeColor} />}
          {normalizedId === "CURIE" && <CurieSilhouette stroke={strokeColor} />}
          {(normalizedId === "SYSTEM" || normalizedId === "HYPATIA") && <SystemSilhouette stroke={strokeColor} />}
          {normalizedId === "EINSTEIN" && <EinsteinSilhouette stroke={strokeColor} />}
          {![
            "GALILEO",
            "NEWTON",
            "FEYNMAN",
            "CURIE",
            "SYSTEM",
            "HYPATIA",
            "EINSTEIN"
          ].includes(normalizedId) && <GalileoSilhouette stroke={strokeColor} />}
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// 1. GALILEO GALILEI
// Renaissance bearded bust silhouette + Refracting Spyglass + Jovian Moons
// ============================================================================
function GalileoSilhouette({ stroke }: { stroke: string }) {
  return (
    <g stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Renaissance Scholar Cap & Hairline */}
      <path
        d="M32 38 C32 24, 68 24, 68 38 C68 40, 71 44, 70 48 C69 52, 65 52, 65 52"
        fill="none"
        strokeOpacity="0.85"
      />
      <path d="M30 36 C28 42, 30 50, 34 54" fill="none" strokeOpacity="0.7" />

      {/* Face profile / brow, nose & eye contour */}
      <path
        d="M48 33 C53 33, 56 36, 56 40 C56 42, 59 44, 60 46 L55 48 C55 51, 57 53, 55 56"
        fill="none"
      />
      {/* Eye dot & gaze */}
      <circle cx="52" cy="39" r="1.2" fill={stroke} />

      {/* Renaissance Beard & Mustache */}
      <path
        d="M55 48 C50 52, 45 52, 42 49 M55 52 C53 58, 48 64, 43 65 C38 66, 36 60, 36 54"
        fill="none"
        strokeOpacity="0.85"
      />

      {/* Renaissance Ruffled Collar & Shoulders */}
      <path
        d="M32 68 C35 63, 44 62, 50 63 C56 62, 65 63, 68 68 M26 84 C28 74, 34 70, 42 69 M74 84 C72 74, 66 70, 58 69"
        fill="none"
        strokeOpacity="0.7"
      />

      {/* MOTIF: Refracting Telescope Spyglass pointing upward */}
      <line x1="62" y1="58" x2="82" y2="34" strokeWidth="1.8" />
      <line x1="80" y1="32" x2="84" y2="36" strokeWidth="2.2" /> {/* Objective lens */}
      <line x1="60" y1="56" x2="64" y2="60" strokeWidth="1.8" /> {/* Eyepiece */}

      {/* MOTIF: Jupiter & 4 Galilean Moons (Io, Europa, Ganymede, Callisto) */}
      <circle cx="78" cy="20" r="4.5" strokeWidth="1" strokeDasharray="1.5 1.5" />
      <circle cx="78" cy="20" r="1.8" fill={stroke} fillOpacity="0.4" />
      <circle cx="68" cy="25" r="1" fill={stroke} />
      <circle cx="73" cy="22" r="1" fill={stroke} />
      <circle cx="83" cy="18" r="1" fill={stroke} />
      <circle cx="88" cy="15" r="1" fill={stroke} />
    </g>
  );
}

// ============================================================================
// 2. SIR ISAAC NEWTON
// Classical powdered wig / shoulder curls silhouette + Prism Spectrum + Apple
// ============================================================================
function NewtonSilhouette({ stroke }: { stroke: string }) {
  return (
    <g stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Prominent Baroque Cascade Wig / Curls */}
      <path
        d="M34 46 C30 38, 34 26, 48 24 C62 24, 68 34, 66 44 C66 52, 72 58, 70 72 C69 78, 64 82, 60 84"
        fill="none"
        strokeOpacity="0.85"
      />
      <path
        d="M34 46 C32 54, 28 62, 30 72 C32 78, 36 82, 40 84"
        fill="none"
        strokeOpacity="0.8"
      />
      {/* Interior wig curls */}
      <path d="M40 28 C45 32, 53 32, 58 29 M32 58 C35 62, 38 66, 36 74" fill="none" strokeOpacity="0.5" />

      {/* Noble Classical Profile Face (Brow, Nose, Lips, Firm Chin) */}
      <path
        d="M48 34 C52 35, 54 38, 54 41 C54 44, 57 46, 58 48 L53 50 C54 52, 53 55, 49 57 C45 58, 43 56, 42 54"
        fill="none"
      />
      {/* Eye & calm focus */}
      <circle cx="50" cy="40" r="1.2" fill={stroke} />

      {/* Classical High Collar & Cravat (Neckcloth) */}
      <path
        d="M42 62 L48 68 L54 62 M48 68 L48 80 M44 74 L52 74"
        fill="none"
        strokeOpacity="0.8"
      />

      {/* MOTIF: Triangular Optical Prism & Light Dispersion Rays */}
      <polygon points="76,38 88,58 64,58" fill="none" strokeWidth="1.2" strokeOpacity="0.8" />
      {/* Incident white light ray */}
      <line x1="58" y1="46" x2="71" y2="48" strokeWidth="1.2" strokeDasharray="2 2" strokeOpacity="0.6" />
      {/* Refracted dispersed spectrum rays */}
      <line x1="82" y1="48" x2="94" y2="44" strokeWidth="1" strokeOpacity="0.9" />
      <line x1="84" y1="52" x2="95" y2="52" strokeWidth="1" strokeOpacity="0.9" />
      <line x1="86" y1="56" x2="93" y2="60" strokeWidth="1" strokeOpacity="0.9" />

      {/* MOTIF: Orbital Curve with subtle Falling Apple accent */}
      <path d="M18 42 C18 28, 30 20, 42 20" fill="none" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.5" />
      {/* Small apple sphere with curved stem & leaf */}
      <circle cx="20" cy="44" r="3.5" fill="none" strokeWidth="1.2" />
      <path d="M20 40.5 C20 37, 23 37, 24 36" fill="none" strokeWidth="1.2" />
      <path d="M20 40 C18 39, 17 40, 18 41" fill="none" strokeWidth="1" />
    </g>
  );
}

// ============================================================================
// 3. DR. RICHARD FEYNMAN
// Witty swept-hair silhouette + Feynman Diagram (QED) + Bongo Acoustic Waves
// ============================================================================
function FeynmanSilhouette({ stroke }: { stroke: string }) {
  return (
    <g stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Dynamic Swept-Back Hair */}
      <path
        d="M32 46 C30 36, 36 24, 52 24 C64 24, 70 32, 68 40 C68 44, 66 48, 66 52 C65 54, 63 56, 61 56"
        fill="none"
        strokeOpacity="0.85"
      />
      {/* Characteristic hair sweep lines */}
      <path d="M38 30 C45 32, 54 29, 62 33 M42 36 C50 38, 56 36, 62 40" fill="none" strokeOpacity="0.5" />

      {/* Energetic, Smiling Face Contour */}
      <path
        d="M48 35 C52 36, 54 39, 54 42 C54 44, 57 46, 58 48 L54 50 C55 53, 53 56, 48 57 C44 57, 42 54, 40 50"
        fill="none"
      />
      {/* Eye & lively brow */}
      <circle cx="50" cy="41" r="1.2" fill={stroke} />
      <path d="M46 38 C49 37, 52 38, 53 39" fill="none" strokeOpacity="0.7" />
      {/* Smirk / smile line */}
      <path d="M48 52 C51 52, 53 51, 54 49" fill="none" strokeOpacity="0.8" />

      {/* Casual Open-Collar Shirt & Shoulders */}
      <path
        d="M42 60 L48 70 L54 60 M38 64 L48 74 L58 64 M26 84 C28 72, 34 66, 44 65 M74 84 C72 72, 66 66, 56 65"
        fill="none"
        strokeOpacity="0.7"
      />

      {/* MOTIF: Feynman Diagram (Electron-Positron Annihilation with Photon Wave) */}
      {/* Incoming fermion paths */}
      <line x1="72" y1="20" x2="80" y2="28" strokeWidth="1.2" />
      <line x1="72" y1="36" x2="80" y2="28" strokeWidth="1.2" />
      {/* Arrowheads on fermion lines */}
      <path d="M76 23 L77 25 L75 25" fill={stroke} />
      {/* Sinusoidal Photon Wave Propagator ~~~ */}
      <path
        d="M80 28 Q83 25, 86 28 T92 28 T98 28"
        fill="none"
        strokeWidth="1.4"
        strokeOpacity="0.9"
      />

      {/* MOTIF: Concentric Acoustic / Bongo Drum Resonant Arcs */}
      <path d="M16 66 C14 70, 14 76, 16 80" fill="none" strokeWidth="1.2" strokeOpacity="0.7" />
      <path d="M20 63 C18 69, 18 77, 20 83" fill="none" strokeWidth="1" strokeOpacity="0.5" />
      <ellipse cx="22" cy="74" rx="3" ry="8" fill="none" strokeWidth="1" strokeOpacity="0.7" />
    </g>
  );
}

// ============================================================================
// 4. MARIE CURIE
// Elegant chignon updo silhouette + Radiation Glow Lines + Erlenmeyer Flask
// ============================================================================
function CurieSilhouette({ stroke }: { stroke: string }) {
  return (
    <g stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* High Elegant Chignon Updo / Swept Victorian Hair */}
      <path
        d="M38 34 C36 24, 46 18, 56 20 C64 22, 68 28, 66 36 C66 42, 64 48, 64 52 C63 56, 60 58, 56 59"
        fill="none"
        strokeOpacity="0.85"
      />
      {/* Top bun / chignon silhouette */}
      <ellipse cx="48" cy="19" rx="7" ry="4" fill="none" strokeWidth="1.2" strokeOpacity="0.7" />
      <path d="M42 28 C48 31, 56 30, 62 33" fill="none" strokeOpacity="0.5" />

      {/* Serene Victorian Profile Face */}
      <path
        d="M50 34 C54 36, 56 39, 56 42 C56 44, 58 46, 59 48 L55 50 C56 53, 54 55, 51 56 C46 57, 44 55, 42 51"
        fill="none"
      />
      {/* Contemplative eye */}
      <circle cx="52" cy="41" r="1.2" fill={stroke} />
      <path d="M48 38 C51 37, 54 38, 55 39" fill="none" strokeOpacity="0.7" />

      {/* Victorian High-Neck Dark Collar & Fitted Shoulders */}
      <path
        d="M44 60 C48 59, 52 59, 56 60 M45 60 L45 68 M55 60 L55 68 M42 68 C46 69, 54 69, 58 68 M26 84 C28 73, 34 68, 44 68 M74 84 C72 73, 66 68, 56 68"
        fill="none"
        strokeOpacity="0.7"
      />

      {/* MOTIF: Conical Chemistry Erlenmeyer Flask */}
      <path
        d="M78 52 L82 52 M80 52 L80 58 L87 72 C88 74, 87 76, 84 76 L74 76 C71 76, 70 74, 71 72 L78 58 L78 52"
        fill="none"
        strokeWidth="1.3"
      />
      {/* Chemical meniscus line & bubbling particles */}
      <line x1="73" y1="70" x2="85" y2="70" strokeWidth="1" strokeOpacity="0.8" />
      <circle cx="77" cy="66" r="0.9" fill={stroke} />
      <circle cx="82" cy="64" r="0.9" fill={stroke} />

      {/* MOTIF: Radioactivity / Ionizing Emission Rays (Alpha, Beta, Gamma) */}
      <circle cx="80" cy="32" r="2" fill={stroke} fillOpacity="0.6" />
      <line x1="80" y1="24" x2="80" y2="28" strokeWidth="1" strokeOpacity="0.8" />
      <line x1="86" y1="26" x2="83" y2="29" strokeWidth="1" strokeOpacity="0.8" />
      <line x1="88" y1="32" x2="84" y2="32" strokeWidth="1" strokeOpacity="0.8" />
      <line x1="86" y1="38" x2="83" y2="35" strokeWidth="1" strokeOpacity="0.8" />
      <line x1="74" y1="26" x2="77" y2="29" strokeWidth="1" strokeOpacity="0.8" />
      <line x1="72" y1="32" x2="76" y2="32" strokeWidth="1" strokeOpacity="0.8" />
    </g>
  );
}

// ============================================================================
// 5. HYPATIA OF ALEXANDRIA / SYSTEM OBSERVER
// Classical Alexandrian scholar silhouette + Astrolabe / Armillary Coordinate Rings
// ============================================================================
function SystemSilhouette({ stroke }: { stroke: string }) {
  return (
    <g stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Classical Draped Headpiece / Fillet Ribbon & Hair */}
      <path
        d="M34 44 C32 30, 44 22, 56 22 C66 22, 70 30, 68 40 C68 48, 66 54, 63 58 C60 62, 56 64, 52 64"
        fill="none"
        strokeOpacity="0.85"
      />
      {/* Classical Headband / Laurel Ribbon */}
      <path d="M38 32 C46 29, 58 30, 66 36" fill="none" strokeWidth="1.8" strokeOpacity="0.9" />
      <path d="M34 40 C42 44, 52 44, 60 41" fill="none" strokeOpacity="0.4" />

      {/* Classical Hellenistic Profile Face */}
      <path
        d="M50 33 C54 35, 57 38, 57 42 C57 44, 59 46, 60 48 L56 50 C57 53, 55 55, 52 56 C48 57, 45 55, 43 51"
        fill="none"
      />
      <circle cx="52" cy="40" r="1.2" fill={stroke} />

      {/* Flowing Classical Peplos / Mantle over Shoulders */}
      <path
        d="M44 64 C48 68, 54 68, 58 64 M38 68 C42 74, 48 76, 56 72 M26 84 C28 72, 36 66, 44 66 M74 84 C72 72, 64 66, 56 66"
        fill="none"
        strokeOpacity="0.7"
      />

      {/* MOTIF: Astrolabe Rete Graduated Rings & Coordinate Grids */}
      <circle cx="78" cy="28" r="12" fill="none" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.8" />
      <circle cx="78" cy="28" r="6" fill="none" strokeWidth="0.8" strokeOpacity="0.6" />
      <line x1="78" y1="14" x2="78" y2="42" strokeWidth="0.8" strokeOpacity="0.7" />
      <line x1="64" y1="28" x2="92" y2="28" strokeWidth="0.8" strokeOpacity="0.7" />
      <circle cx="78" cy="28" r="1.5" fill={stroke} />
    </g>
  );
}

// ============================================================================
// 6. ALBERT EINSTEIN (Fallback / Extra)
// Wild radiating hair silhouette + Spacetime Curvature Funnel
// ============================================================================
function EinsteinSilhouette({ stroke }: { stroke: string }) {
  return (
    <g stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Iconic Wild Radiating Hair Silhouette */}
      <path
        d="M26 44 C22 36, 26 22, 40 18 C52 14, 68 18, 74 28 C78 34, 76 44, 74 50 C76 56, 72 64, 66 66 C62 68, 58 66, 56 64"
        fill="none"
        strokeOpacity="0.85"
      />
      {/* Hair spikes & tufts */}
      <path d="M26 34 L20 30 M32 24 L28 18 M46 18 L46 12 M62 20 L68 15 M72 28 L80 26 M74 40 L82 42" fill="none" strokeOpacity="0.6" />

      {/* Face & Mustache */}
      <path
        d="M48 35 C52 36, 54 39, 54 42 C54 44, 56 46, 57 48 L53 50 C54 53, 52 56, 48 57"
        fill="none"
      />
      <circle cx="50" cy="40" r="1.2" fill={stroke} />
      {/* Bushy mustache */}
      <path d="M44 50 C48 52, 54 52, 57 50" fill="none" strokeWidth="2" strokeOpacity="0.9" />

      {/* Turtleneck collar */}
      <path d="M42 62 C46 64, 54 64, 58 62 M40 68 C46 70, 54 70, 60 68 M26 84 C28 74, 36 68, 44 68 M74 84 C72 74, 64 68, 56 68" fill="none" strokeOpacity="0.7" />

      {/* MOTIF: Spacetime Curvature Grid */}
      <ellipse cx="80" cy="62" rx="14" ry="6" fill="none" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.6" />
      <ellipse cx="80" cy="66" rx="8" ry="3.5" fill="none" strokeWidth="0.8" strokeOpacity="0.7" />
      <circle cx="80" cy="69" r="1.5" fill={stroke} />
    </g>
  );
}

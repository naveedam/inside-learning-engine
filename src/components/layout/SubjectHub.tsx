/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";
import { getAllCurriculumPacks, getPackActiveChaptersCount, isChapterActive, getChapterStatus } from "../../content/registry";
import { useEngineStore } from "../../core/stores";
import { Atom, Beaker, Compass, Dna, ArrowRight, Zap, BookOpen, Layers, CheckCircle2, Clock, MinusCircle } from "lucide-react";
import { CurriculumPack } from "../../types";

// ============================================================================
// 1. AMBIENT DRIFTING BIOLUMINESCENT PARTICLES (Canvas Background)
// ============================================================================

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  color: string;
  oscSpeed: number;
  oscAmp: number;
  phase: number;
}

const PARTICLE_COLORS = [
  "rgba(34, 211, 238, ",  // Cyan (Physics)
  "rgba(16, 185, 129, ",  // Emerald (Chemistry)
  "rgba(245, 158, 11, ",  // Amber (Math)
  "rgba(244, 63, 94, ",   // Rose (Biology)
  "rgba(255, 255, 255, "  // Cosmic Stardust
];

function HubParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const particleCount = 40;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const baseAlpha = 0.15 + Math.random() * 0.35;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.15 - Math.random() * 0.3,
        radius: 1.2 + Math.random() * 2.2,
        baseAlpha,
        alpha: baseAlpha,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        oscSpeed: 0.001 + Math.random() * 0.003,
        oscAmp: 0.4 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2
      });
    }

    let lastTime = performance.now();

    const render = (currentTime: number) => {
      const dt = Math.min(currentTime - lastTime, 64);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.phase += p.oscSpeed * dt;
        p.x += p.vx * (dt / 16) + Math.sin(p.phase) * p.oscAmp * 0.1;
        p.y += p.vy * (dt / 16);

        p.alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.phase * 2));

        // Wrap around boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw soft glowing particle
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        gradient.addColorStop(0, `${p.color}${p.alpha})`);
        gradient.addColorStop(0.5, `${p.color}${p.alpha * 0.4})`);
        gradient.addColorStop(1, `${p.color}0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full z-0 opacity-80"
    />
  );
}

// ============================================================================
// 2. DISCIPLINARY CARD BACKGROUND MOTIFS (Physics, Chemistry, Math, Biology)
// ============================================================================

function PhysicsCardMotif() {
  return (
    <svg
      className="absolute right-0 top-0 h-full w-3/4 pointer-events-none opacity-20 group-hover:opacity-40 transition-all duration-700 select-none text-cyan-400 overflow-visible"
      viewBox="0 0 300 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Planetary elliptical orbital lines */}
      <ellipse
        cx="190"
        cy="120"
        rx="140"
        ry="65"
        transform="rotate(-22 190 120)"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="4 6"
      />
      <ellipse
        cx="190"
        cy="120"
        rx="95"
        ry="42"
        transform="rotate(-22 190 120)"
        stroke="currentColor"
        strokeWidth="1"
      />
      <ellipse
        cx="190"
        cy="120"
        rx="50"
        ry="22"
        transform="rotate(-22 190 120)"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity="0.8"
      />

      {/* Orbital focal crosshairs */}
      <circle cx="150" cy="132" r="3.5" fill="currentColor" />
      <line x1="135" y1="132" x2="165" y2="132" stroke="currentColor" strokeWidth="0.8" />
      <line x1="150" y1="117" x2="150" y2="147" stroke="currentColor" strokeWidth="0.8" />

      {/* Polar grid radial rays */}
      <line x1="150" y1="132" x2="280" y2="40" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4" />
      <line x1="150" y1="132" x2="290" y2="180" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4" />
      <line x1="150" y1="132" x2="80" y2="210" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4" />
      <line x1="150" y1="132" x2="60" y2="60" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4" />

      {/* Trajectory vector arrow */}
      <path
        d="M 120 70 Q 180 60 220 95"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <polygon points="220,95 210,91 216,84" fill="currentColor" />
    </svg>
  );
}

function ChemistryCardMotif() {
  return (
    <svg
      className="absolute right-0 top-0 h-full w-3/4 pointer-events-none opacity-20 group-hover:opacity-40 transition-all duration-700 select-none text-emerald-400 overflow-visible"
      viewBox="0 0 300 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hexagonal molecular benzene/carbon rings network */}
      <g stroke="currentColor" strokeWidth="1.2">
        {/* Central Hexagon */}
        <polygon points="170,70 200,87 200,122 170,140 140,122 140,87" />
        <circle cx="170" cy="105" r="16" strokeDasharray="3 4" strokeWidth="1" />

        {/* Right Adjacent Hexagon */}
        <polygon points="200,87 230,70 260,87 260,122 230,140 200,122" />

        {/* Lower Left Adjacent Hexagon */}
        <polygon points="140,122 170,140 170,175 140,192 110,175 110,140" />

        {/* Upper Left Ring */}
        <polygon points="110,35 140,52 140,87 110,105 80,87 80,52" />
      </g>

      {/* Atomic vertex bonding nodes */}
      <circle cx="170" cy="70" r="3" fill="currentColor" />
      <circle cx="200" cy="87" r="3" fill="currentColor" />
      <circle cx="200" cy="122" r="3" fill="currentColor" />
      <circle cx="170" cy="140" r="3" fill="currentColor" />
      <circle cx="140" cy="122" r="3" fill="currentColor" />
      <circle cx="140" cy="87" r="3" fill="currentColor" />
      <circle cx="230" cy="70" r="2.5" fill="currentColor" />
      <circle cx="260" cy="87" r="2.5" fill="currentColor" />
      <circle cx="260" cy="122" r="2.5" fill="currentColor" />
      <circle cx="230" cy="140" r="2.5" fill="currentColor" />
      <circle cx="110" cy="175" r="2.5" fill="currentColor" />
      <circle cx="140" cy="192" r="2.5" fill="currentColor" />

      {/* Extended valence bond linkages */}
      <line x1="260" y1="122" x2="285" y2="135" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="140" y1="192" x2="140" y2="215" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="80" y1="52" x2="60" y2="40" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
    </svg>
  );
}

function MathematicsCardMotif() {
  return (
    <svg
      className="absolute right-0 top-0 h-full w-3/4 pointer-events-none opacity-20 group-hover:opacity-40 transition-all duration-700 select-none text-amber-400 overflow-visible"
      viewBox="0 0 300 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cartesian Coordinate Grid Lines */}
      <g stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.35">
        <line x1="90" y1="40" x2="280" y2="40" />
        <line x1="90" y1="75" x2="280" y2="75" />
        <line x1="90" y1="110" x2="280" y2="110" />
        <line x1="90" y1="145" x2="280" y2="145" />
        <line x1="90" y1="180" x2="280" y2="180" />
        <line x1="90" y1="215" x2="280" y2="215" />

        <line x1="105" y1="25" x2="105" y2="225" />
        <line x1="140" y1="25" x2="140" y2="225" />
        <line x1="175" y1="25" x2="175" y2="225" />
        <line x1="210" y1="25" x2="210" y2="225" />
        <line x1="245" y1="25" x2="245" y2="225" />
      </g>

      {/* Main Coordinate Axes */}
      <line x1="90" y1="145" x2="285" y2="145" stroke="currentColor" strokeWidth="1.5" />
      <line x1="140" y1="25" x2="140" y2="225" stroke="currentColor" strokeWidth="1.5" />

      {/* Smooth Calculus / Function Curve (Sigmoid / Parabolic Wave) */}
      <path
        d="M 95 195 C 130 190 150 160 175 115 C 200 70 230 50 275 45"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Tangent Slope Vector at inflection point */}
      <line x1="150" y1="155" x2="200" y2="75" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
      <circle cx="175" cy="115" r="3.5" fill="currentColor" />

      {/* Math symbols */}
      <text x="260" y="38" fill="currentColor" fontSize="10" fontFamily="monospace" opacity="0.8">f(x)</text>
      <text x="275" y="140" fill="currentColor" fontSize="10" fontFamily="monospace" opacity="0.8">x</text>
      <text x="145" y="35" fill="currentColor" fontSize="10" fontFamily="monospace" opacity="0.8">y</text>
    </svg>
  );
}

function BiologyCardMotif() {
  return (
    <svg
      className="absolute right-0 top-0 h-full w-3/4 pointer-events-none opacity-20 group-hover:opacity-40 transition-all duration-700 select-none text-rose-400 overflow-visible"
      viewBox="0 0 300 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cellular Wall Membranes & Vacuoles */}
      <g stroke="currentColor" strokeWidth="1.2">
        {/* Cell A */}
        <path d="M 140 85 C 155 55 210 50 225 75 C 240 100 235 140 210 155 C 185 170 145 160 135 135 C 125 110 125 105 140 85 Z" />
        {/* Cell Nucleus */}
        <circle cx="180" cy="110" r="14" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
        <circle cx="180" cy="110" r="4.5" fill="currentColor" />

        {/* Cell B (Interlocking adjacent membrane) */}
        <path d="M 225 75 C 250 65 280 80 285 115 C 290 145 260 175 230 165 C 220 160 215 155 210 155" strokeDasharray="4 4" />

        {/* Cell C (Lower membrane) */}
        <path d="M 135 135 C 115 155 125 195 155 210 C 185 220 205 195 210 175" strokeDasharray="4 4" />
      </g>

      {/* Double Helix Strand Elements */}
      <path
        d="M 240 30 Q 255 60 240 90 T 240 150 T 240 210"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.8"
      />
      <path
        d="M 260 30 Q 245 60 260 90 T 260 150 T 260 210"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.8"
      />
      {/* Helix base-pair rungs */}
      <line x1="242" y1="45" x2="258" y2="45" stroke="currentColor" strokeWidth="1" />
      <line x1="248" y1="75" x2="252" y2="75" stroke="currentColor" strokeWidth="1" />
      <line x1="242" y1="105" x2="258" y2="105" stroke="currentColor" strokeWidth="1" />
      <line x1="248" y1="135" x2="252" y2="135" stroke="currentColor" strokeWidth="1" />
      <line x1="242" y1="165" x2="258" y2="165" stroke="currentColor" strokeWidth="1" />
      <line x1="248" y1="195" x2="252" y2="195" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

const renderSubjectMotif = (subjectId: string) => {
  switch (subjectId) {
    case "physics-class-11":
      return <PhysicsCardMotif />;
    case "chemistry-class-11":
      return <ChemistryCardMotif />;
    case "mathematics-class-11":
      return <MathematicsCardMotif />;
    case "biology-class-11":
      return <BiologyCardMotif />;
    default:
      return null;
  }
};

// ============================================================================
// 3. DIEGETIC HUD GAUGE (Circular Reactor Dial + Segmented Telemetry)
// ============================================================================

interface GaugeProps {
  active: number;
  total: number;
  accentColor: string;
  themeText: string;
  notPlanned?: number;
}

function ReactorProgressGauge({ active, total, accentColor, themeText, notPlanned = 0 }: GaugeProps) {
  const activePercent = Math.round((active / total) * 100);
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * activePercent) / 100;

  const totalSegments = 8;
  const activeSegments = Math.round((active / total) * totalSegments);

  const getStrokeColor = (col: string) => {
    switch (col) {
      case "cyan": return "#22d3ee";
      case "emerald": return "#10b981";
      case "amber": return "#f59e0b";
      case "rose": return "#f43f5e";
      default: return "#22d3ee";
    }
  };

  const strokeColor = getStrokeColor(accentColor);
  const comingOnlineCount = total - active - notPlanned;

  return (
    <div className="flex items-center gap-4 py-1">
      {/* Circular HUD Reactor Dial */}
      <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
          {/* Background Outer Ring */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="3.5"
          />

          {/* Active Reactor Core Arc */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 4px ${strokeColor}88)` }}
          />

          {/* Discrete perimeter tick marks */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1="28"
              y1="2"
              x2="28"
              y2="5"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
              transform={`rotate(${angle} 28 28)`}
            />
          ))}
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-mono font-bold text-xs text-white leading-none">
            {active}/{total}
          </span>
          <span className="font-mono text-[7px] text-gray-400 uppercase tracking-tighter mt-0.5">
            SECT
          </span>
        </div>
      </div>

      {/* Progress Telemetry & Segmented LED Pips */}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center justify-between font-mono text-[11px]">
          <span className="text-gray-300 font-semibold uppercase tracking-wider">
            Expedition Path Progress
          </span>
          <span className={`font-bold ${themeText}`}>{activePercent}%</span>
        </div>

        {/* Segmented Reactor LED Bar */}
        <div className="grid grid-cols-8 gap-1 w-full py-0.5">
          {Array.from({ length: totalSegments }).map((_, i) => {
            const isLit = i < activeSegments;
            return (
              <div
                key={i}
                className={`h-1.5 rounded-sm transition-all duration-500 ${
                  isLit
                    ? "opacity-100 shadow-sm"
                    : "bg-white/5 opacity-40"
                }`}
                style={{
                  backgroundColor: isLit ? strokeColor : undefined,
                  boxShadow: isLit ? `0 0 6px ${strokeColor}66` : undefined
                }}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between font-mono text-[9px] text-gray-500 uppercase tracking-wider">
          <span>{active} SECTORS OPERATIONAL</span>
          <span>
            {total - active > 0
              ? notPlanned > 0
                ? `+${comingOnlineCount} ONLINE • ${notPlanned} DEFERRED`
                : `+${total - active} ON STANDBY`
              : "EXPEDITION FULLY CHARTED"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. MAIN SUBJECT HUB COMPONENT
// ============================================================================

const getSubjectIcon = (iconName: string) => {
  switch (iconName) {
    case "Atom": return Atom;
    case "Beaker": return Beaker;
    case "Compass": return Compass;
    case "Dna": return Dna;
    case "BookOpen": return BookOpen;
    default: return Layers;
  }
};

interface SubjectTheme {
  border: string;
  borderHover: string;
  glow: string;
  bgGlow: string;
  text: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  progressBar: string;
  buttonBg: string;
}

const getSubjectTheme = (accentColor: string): SubjectTheme => {
  switch (accentColor) {
    case "cyan":
      return {
        border: "border-cyan-500/25",
        borderHover: "group-hover:border-cyan-400",
        glow: "group-hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]",
        bgGlow: "from-cyan-500/10 via-cyan-950/20 to-transparent",
        text: "text-cyan-400",
        badgeBg: "bg-cyan-950/60",
        badgeBorder: "border-cyan-500/30",
        badgeText: "text-cyan-300",
        progressBar: "bg-cyan-400",
        buttonBg: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-gray-950"
      };
    case "emerald":
      return {
        border: "border-emerald-500/25",
        borderHover: "group-hover:border-emerald-400",
        glow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.25)]",
        bgGlow: "from-emerald-500/10 via-emerald-950/20 to-transparent",
        text: "text-emerald-400",
        badgeBg: "bg-emerald-950/60",
        badgeBorder: "border-emerald-500/30",
        badgeText: "text-emerald-300",
        progressBar: "bg-emerald-400",
        buttonBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-gray-950"
      };
    case "amber":
      return {
        border: "border-amber-500/25",
        borderHover: "group-hover:border-amber-400",
        glow: "group-hover:shadow-[0_0_40px_rgba(251,191,36,0.25)]",
        bgGlow: "from-amber-500/10 via-amber-950/20 to-transparent",
        text: "text-amber-400",
        badgeBg: "bg-amber-950/60",
        badgeBorder: "border-amber-500/30",
        badgeText: "text-amber-300",
        progressBar: "bg-amber-400",
        buttonBg: "bg-amber-500/15 text-amber-300 border-amber-500/30 group-hover:bg-amber-500 group-hover:text-gray-950"
      };
    case "rose":
      return {
        border: "border-rose-500/25",
        borderHover: "group-hover:border-rose-400",
        glow: "group-hover:shadow-[0_0_40px_rgba(244,63,94,0.25)]",
        bgGlow: "from-rose-500/10 via-rose-950/20 to-transparent",
        text: "text-rose-400",
        badgeBg: "bg-rose-950/60",
        badgeBorder: "border-rose-500/30",
        badgeText: "text-rose-300",
        progressBar: "bg-rose-400",
        buttonBg: "bg-rose-500/15 text-rose-300 border-rose-500/30 group-hover:bg-rose-500 group-hover:text-gray-950"
      };
    default:
      return {
        border: "border-cyan-500/25",
        borderHover: "group-hover:border-cyan-400",
        glow: "group-hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]",
        bgGlow: "from-cyan-500/10 via-cyan-950/20 to-transparent",
        text: "text-cyan-400",
        badgeBg: "bg-cyan-950/60",
        badgeBorder: "border-cyan-500/30",
        badgeText: "text-cyan-300",
        progressBar: "bg-cyan-400",
        buttonBg: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-gray-950"
      };
  }
};

const PRIMARY_SUBJECT_IDS = [
  "physics-class-11",
  "chemistry-class-11",
  "mathematics-class-11",
  "biology-class-11"
];

export default function SubjectHub() {
  const packs = getAllCurriculumPacks();
  const { selectSubject, xp, streak } = useEngineStore();

  const primaryPacks = PRIMARY_SUBJECT_IDS.map(id => packs.find(p => p.id === id)).filter(Boolean) as CurriculumPack[];
  const prototypePacks = packs.filter(p => !PRIMARY_SUBJECT_IDS.includes(p.id));

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 relative select-none">
      {/* Background Ambient Drifting Bioluminescent Stardust Particles */}
      <HubParticleField />

      {/* Atmospheric Soft Nebula Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25 z-0">
        <div className="absolute w-[520px] h-[520px] rounded-full bg-cyan-500/5 blur-3xl -top-20 -left-20 animate-pulse-slow" />
        <div className="absolute w-[460px] h-[460px] rounded-full bg-emerald-500/5 blur-3xl top-1/3 -right-20 animate-pulse-slow" />
        <div className="absolute w-[420px] h-[420px] rounded-full bg-amber-500/5 blur-3xl bottom-10 left-1/4 animate-pulse-slow" />
      </div>

      {/* Hero Welcome Cinematic Header - Option A */}
      <div className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 relative z-10">
        <div className="flex flex-col gap-2.5 max-w-3xl">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] uppercase tracking-widest">
            <Zap size={11} className="animate-pulse" /> EMPIRICAL PROVING GROUNDS ACTIVE
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            Empirical Research Constellation
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Stop memorizing formulas. Take command of real-time parameter labs across Physics, Chemistry, Mathematics, and Biology — stress-test boundary conditions, break fundamental fallacies, and measure the laws of nature firsthand.
          </p>
        </div>

        {/* Global Progress Metrics Box */}
        <div className="px-5 py-3 rounded-2xl border border-white/5 bg-gray-950/60 backdrop-blur-xl flex items-center gap-4 shrink-0 shadow-lg">
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">RESEARCH PLATFORM</span>
            <span className="text-white font-mono font-bold text-lg">CLASS XI</span>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">DURABLE INTEL</span>
            <span className="text-cyan-400 font-mono font-bold text-lg">{xp} XP</span>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">FIELD STREAK</span>
            <span className="text-emerald-400 font-mono font-bold text-lg">{streak}D</span>
          </div>
        </div>
      </div>

      {/* Constellation Gateway Navigation Banner */}
      <div className="mb-6 flex items-center justify-between font-mono text-[11px] text-gray-400 px-1 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-semibold uppercase tracking-wider">
            LEVEL 01 // CONSTELLATION GATEWAY
          </span>
          <span className="text-gray-600">/</span>
          <span className="text-gray-400">
            SELECT DISCIPLINARY DOMAIN TO CHART EXPEDITIONS
          </span>
        </div>
        <span className="hidden sm:inline text-gray-500 text-[10px] tracking-wider">
          ISC CLASS XI EXPEDITIONS
        </span>
      </div>

      {/* The 4 Primary Subject Hub Nodes (Physics, Chemistry, Mathematics, Biology) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {primaryPacks.map((pack) => {
          const theme = getSubjectTheme(pack.accentColor);
          const Icon = getSubjectIcon(pack.icon);
          const { active, total } = getPackActiveChaptersCount(pack);

          // Get names of active chapters for preview
          const activeChapterNames = pack.chapters
            .filter(isChapterActive)
            .map(ch => ch.title.split(":")[0]);

          return (
            <div
              key={pack.id}
              onClick={() => selectSubject(pack.id)}
              className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl border ${theme.border} ${theme.borderHover} ${theme.glow} bg-gray-950/75 hover:bg-gray-950/90 backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.015] cursor-pointer overflow-hidden active:scale-[0.99] shadow-xl`}
            >
              {/* Unique Disciplinary Background Motif (Orbital / Lattice / Graph / Cellular) */}
              {renderSubjectMotif(pack.id)}

              {/* Soft atmospheric radial gradient sheen */}
              <div className={`absolute -top-24 -right-24 w-60 h-60 rounded-full bg-gradient-to-br ${theme.bgGlow} blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700`} />

              {/* Card Header: Disciplinary Identity */}
              <div className="flex items-start justify-between gap-4 relative z-10 mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl border ${theme.badgeBorder} ${theme.badgeBg} flex items-center justify-center ${theme.text} shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <Icon size={28} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">
                      {pack.grade}
                    </span>
                    <h2 className="font-display font-bold text-2xl text-white tracking-tight group-hover:text-white transition-colors">
                      {pack.subject}
                    </h2>
                  </div>
                </div>

                {/* Status Indicator Chip */}
                <div className={`px-2.5 py-1 rounded-full border ${theme.badgeBorder} ${theme.badgeBg} ${theme.badgeText} font-mono text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1.5 shrink-0 shadow-sm`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${theme.progressBar} animate-pulse`} />
                  <span>{active} OF {total} ACTIVE</span>
                </div>
              </div>

              {/* Middle Section: Diegetic HUD Reactor Gauge */}
              <div className="relative z-10 my-3">
                {(() => {
                  const notPlannedCount = pack.chapters.filter(ch => getChapterStatus(ch) === "Not Planned").length;
                  const comingOnlineCount = total - active - notPlannedCount;

                  return (
                    <>
                      <ReactorProgressGauge
                        active={active}
                        total={total}
                        accentColor={pack.accentColor}
                        themeText={theme.text}
                        notPlanned={notPlannedCount}
                      />

                      {/* Active Sectors Bullet Summary */}
                      <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mr-1">
                          ACTIVE:
                        </span>
                        {activeChapterNames.map((name, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md border border-white/10 bg-white/5 text-[11px] font-mono text-gray-300 flex items-center gap-1 group-hover:border-white/20 transition-colors"
                          >
                            <CheckCircle2 size={10} className={theme.text} />
                            {name}
                          </span>
                        ))}
                        {comingOnlineCount > 0 && (
                          <span className="px-2 py-0.5 rounded-md border border-dashed border-gray-700/60 bg-gray-900/40 text-[10px] font-mono text-gray-500 flex items-center gap-1">
                            <Clock size={10} />
                            +{comingOnlineCount} Coming Online
                          </span>
                        )}
                        {notPlannedCount > 0 && (
                          <span className="px-2 py-0.5 rounded-md border border-gray-800 bg-gray-950/40 text-[10px] font-mono text-gray-500 flex items-center gap-1">
                            <MinusCircle size={10} />
                            {notPlannedCount} Not Planned
                          </span>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Bottom CTA Action Bar */}
              <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                <span className="font-mono text-[11px] text-gray-400 group-hover:text-gray-200 transition-colors">
                  Chart the expedition path
                </span>
                <button 
                  tabIndex={-1}
                  className={`px-4 py-2 rounded-xl border text-xs font-mono font-semibold tracking-wider uppercase flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-sm ${theme.buttonBg}`}
                >
                  <span>CHART EXPEDITION PATH</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prototype Disciplines Drawer / Standby Bar */}
      {prototypePacks.length > 0 && (
        <div className="mt-8 p-4 rounded-2xl border border-white/5 bg-gray-950/40 backdrop-blur-md relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-gray-600" />
            <span className="text-gray-400 font-semibold uppercase tracking-wider">PROTOTYPE DISCIPLINES ON STANDBY:</span>
            <span className="text-gray-500 text-[11px]">Humanities exploratory reconnaissance</span>
          </div>

          <div className="flex items-center gap-3">
            {prototypePacks.map((proto) => (
              <button
                key={proto.id}
                onClick={() => selectSubject(proto.id)}
                className="px-3 py-1.5 rounded-xl border border-white/5 hover:border-white/15 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center gap-2 cursor-pointer text-[11px]"
              >
                <span>{proto.subject}</span>
                <span className="text-[9px] text-amber-400/80 font-bold px-1.5 py-0.2 rounded border border-amber-500/20 bg-amber-950/30">
                  STANDBY
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

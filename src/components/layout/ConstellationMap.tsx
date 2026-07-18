/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { getAllCurriculumPacks } from "../../content/registry";
import { useEngineStore } from "../../core/stores";
import { Compass, Trophy, Atom, Beaker, BookOpen, ArrowRight, Zap, LucideIcon } from "lucide-react";

const getIcon = (iconName: string): LucideIcon => {
  switch (iconName) {
    case "Atom": return Atom;
    case "Beaker": return Beaker;
    case "Compass": return Compass;
    case "BookOpen": return BookOpen;
    default: return Compass;
  }
};

const getColorClasses = (color: string) => {
  switch (color) {
    case "cyan":
      return {
        border: "border-cyan-400 text-cyan-400 hover:bg-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.5)]",
        text: "text-cyan-400",
        bg: "bg-cyan-950/40",
        borderLight: "border-cyan-500/20"
      };
    case "emerald":
      return {
        border: "border-emerald-400 text-emerald-400 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]",
        text: "text-emerald-400",
        bg: "bg-emerald-950/40",
        borderLight: "border-emerald-500/20"
      };
    case "orange":
      return {
        border: "border-orange-400 text-orange-400 hover:bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.5)]",
        text: "text-orange-400",
        bg: "bg-orange-950/40",
        borderLight: "border-orange-500/20"
      };
    case "purple":
      return {
        border: "border-purple-400 text-purple-400 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]",
        text: "text-purple-400",
        bg: "bg-purple-950/40",
        borderLight: "border-purple-500/20"
      };
    default:
      return {
        border: "border-cyan-400 text-cyan-400 hover:bg-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.5)]",
        text: "text-cyan-400",
        bg: "bg-cyan-950/40",
        borderLight: "border-cyan-500/20"
      };
  }
};

export default function ConstellationMap() {
  const packs = getAllCurriculumPacks();
  const { selectChapter, xp } = useEngineStore();

  // Extract all chapters with metadata for linking in the constellation Map
  const allChapters = packs.flatMap(pack => 
    pack.chapters.map(ch => ({
      ...ch,
      packSubject: pack.subject,
      packGrade: pack.grade,
      packIcon: pack.icon,
      packColor: pack.accentColor
    }))
  );

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 relative select-none">
      {/* Background Star Coordinates Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-3xl -top-24 -left-24 animate-pulse-slow" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-orange-500/5 blur-3xl bottom-12 right-12 animate-pulse-slow" />
      </div>

      {/* Hero Welcome Cinematic Header */}
      <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 relative z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] uppercase tracking-widest">
            <Zap size={11} className="animate-pulse" /> CORE ORBITAL PLATFORM UNLOCKED
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight leading-none">
            Curriculum Constellation Map
          </h1>
          <p className="text-gray-400 text-sm max-w-xl">
            Navigate through dynamic scientific worlds. Calibrate variables, discover empirical laws, and earn galactic academic credentials.
          </p>
        </div>

        {/* Global Progress Metrics Box */}
        <div className="px-5 py-3 rounded-2xl border border-white/5 bg-gray-950/60 backdrop-blur-xl flex items-center gap-4">
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">PLATFORM LEVEL</span>
            <span className="text-white font-mono font-bold text-lg">01</span>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">DURABLE INTEL</span>
            <span className="text-cyan-400 font-mono font-bold text-lg">{xp} XP</span>
          </div>
        </div>
      </div>

      {/* Dynamic Star Constellation Vector Grid */}
      <div className="relative w-full aspect-video md:aspect-[21/9] min-h-[420px] rounded-3xl border border-white/10 bg-gray-950/45 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Spatial Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Dynamic Vector Line connecting Constellation coordinates */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          {/* Dynamically draw paths between all active Chapters */}
          {allChapters.map((ch, idx) => {
            if (idx === allChapters.length - 1) return null;
            const nextCh = allChapters[idx + 1];
            return (
              <line
                key={`line-${ch.id}`}
                x1={`${ch.constellationPosition.x}%`}
                y1={`${ch.constellationPosition.y}%`}
                x2={`${nextCh.constellationPosition.x}%`}
                y2={`${nextCh.constellationPosition.y}%`}
                stroke="url(#neonGlow)"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
            );
          })}
        </svg>

        {/* Render all Chapter Star Nodes */}
        {allChapters.map((chapter) => {
          const pos = chapter.constellationPosition;
          const colors = getColorClasses(chapter.packColor);
          const IconComponent = getIcon(chapter.packIcon);

          return (
            <div
              key={chapter.id}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div 
                onClick={() => selectChapter(chapter.id)}
                className="relative group cursor-pointer"
              >
                {/* Outer halo circular ring pulse */}
                <span className={`absolute -inset-4 rounded-full border border-white/5 animate-ping opacity-30 pointer-events-none`} />
                <span className={`absolute -inset-8 rounded-full border border-white/5 animate-pulse-slow pointer-events-none`} />

                {/* The Interactive Core Star Node */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    selectChapter(chapter.id);
                  }}
                  className={`w-12 h-12 rounded-full border-2 bg-gray-950 flex items-center justify-center cursor-pointer group-hover:scale-110 active:scale-95 relative z-10 transition-all duration-300 ${colors.border}`}
                  title={`Align sensors to ${chapter.title}`}
                >
                  <IconComponent size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                </button>

                {/* Star node absolute hovering coordinates box */}
                <div className="absolute top-14 left-1/2 -translate-x-1/2 w-48 sm:w-64 p-4 rounded-2xl border border-white/10 bg-gray-950/90 backdrop-blur-md opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30 shadow-2xl">
                  <div className="flex flex-col gap-1">
                    <span className={`font-mono text-[8px] font-bold uppercase tracking-wider ${colors.text}`}>
                      {chapter.packSubject} • {chapter.packGrade}
                    </span>
                    <span className="font-display font-bold text-sm text-white">{chapter.title}</span>
                    <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{chapter.shortDescription}</p>
                    
                    <div className="flex items-center gap-2 mt-2 font-mono text-[9px] text-gray-400 border-t border-white/5 pt-2">
                      <span className={`px-1.5 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.borderLight}`}>
                        {chapter.difficulty}
                      </span>
                      <span>•</span>
                      <span>{chapter.estimatedMinutes} mins</span>
                    </div>

                    <div className={`mt-3 flex items-center justify-between font-mono text-[10px] font-bold sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colors.text}`}>
                      <span>ALIGN SENSORS</span>
                      <ArrowRight size={12} className="animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { getAllCurriculumPacks, isChapterActive } from "../../content/registry";
import { useEngineStore } from "../../core/stores";
import { Compass, Trophy, Atom, Beaker, BookOpen, Dna, ArrowRight, Zap, AlertCircle, Clock, LucideIcon } from "lucide-react";

const getIcon = (iconName: string): LucideIcon => {
  switch (iconName) {
    case "Atom": return Atom;
    case "Beaker": return Beaker;
    case "Compass": return Compass;
    case "BookOpen": return BookOpen;
    case "Dna": return Dna;
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
    case "amber":
      return {
        border: "border-amber-400 text-amber-400 hover:bg-amber-500 shadow-[0_0_20px_rgba(251,191,36,0.5)]",
        text: "text-amber-400",
        bg: "bg-amber-950/40",
        borderLight: "border-amber-500/20"
      };
    case "rose":
      return {
        border: "border-rose-400 text-rose-400 hover:bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]",
        text: "text-rose-400",
        bg: "bg-rose-950/40",
        borderLight: "border-rose-500/20"
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
  const [standbyNotice, setStandbyNotice] = useState<string | null>(null);

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

  const handleNodeClick = (chapterId: string, chapterTitle: string, isBuilt: boolean) => {
    if (!isBuilt) {
      setStandbyNotice(`The "${chapterTitle}" research chamber is currently in development (Coming Online).`);
      return;
    }
    setStandbyNotice(null);
    selectChapter(chapterId);
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 relative select-none">
      {/* Background Star Coordinates Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-3xl -top-24 -left-24 animate-pulse-slow" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-orange-500/5 blur-3xl bottom-12 right-12 animate-pulse-slow" />
      </div>

      {/* Standby Notice Toast */}
      {standbyNotice && (
        <div className="mb-6 px-4 py-3 rounded-2xl border border-amber-500/30 bg-amber-950/80 backdrop-blur-md flex items-center justify-between text-amber-200 text-xs font-mono shadow-xl relative z-30">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={16} className="text-amber-400 shrink-0 animate-pulse" />
            <span className="leading-snug">{standbyNotice}</span>
          </div>
          <button 
            onClick={() => setStandbyNotice(null)}
            className="text-amber-400 hover:text-white text-[10px] ml-4 uppercase font-bold tracking-wider hover:underline cursor-pointer shrink-0"
          >
            DISMISS
          </button>
        </div>
      )}

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
        <div className="px-5 py-3 rounded-2xl border border-white/5 bg-gray-950/60 backdrop-blur-xl flex items-center gap-4 shrink-0">
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">RESEARCH PLATFORM</span>
            <span className="text-white font-mono font-bold text-lg">CLASS XI</span>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">DURABLE INTEL</span>
            <span className="text-cyan-400 font-mono font-bold text-lg">{xp} XP</span>
          </div>
        </div>
      </div>

      {/* Dynamic Star Constellation Vector Grid */}
      <div className="relative w-full aspect-video md:aspect-[21/9] min-h-[440px] rounded-3xl border border-white/10 bg-gray-950/45 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Spatial Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Dynamic Vector Line connecting Constellation coordinates */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          {/* Dynamically draw paths between all active Chapters */}
          {allChapters.map((ch, idx) => {
            if (idx === allChapters.length - 1) return null;
            const nextCh = allChapters[idx + 1];
            const bothBuilt = isChapterActive(ch) && isChapterActive(nextCh);
            return (
              <line
                key={`line-${ch.id}`}
                x1={`${ch.constellationPosition.x}%`}
                y1={`${ch.constellationPosition.y}%`}
                x2={`${nextCh.constellationPosition.x}%`}
                y2={`${nextCh.constellationPosition.y}%`}
                stroke={bothBuilt ? "url(#neonGlow)" : "rgba(255,255,255,0.08)"}
                strokeWidth={bothBuilt ? "2" : "1"}
                strokeDasharray={bothBuilt ? "6 4" : "3 3"}
                className={bothBuilt ? "animate-pulse" : "opacity-40"}
              />
            );
          })}
        </svg>

        {/* Render all Chapter Star Nodes */}
        {allChapters.map((chapter) => {
          const pos = chapter.constellationPosition;
          const isBuilt = isChapterActive(chapter);
          const colors = getColorClasses(chapter.packColor);
          const IconComponent = getIcon(chapter.packIcon);

          return (
            <div
              key={chapter.id}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div 
                onClick={() => handleNodeClick(chapter.id, chapter.title, isBuilt)}
                className={`relative group flex flex-col items-center ${isBuilt ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                {/* Outer halo circular ring pulse (only for built active labs) */}
                {isBuilt ? (
                  <>
                    <span className="absolute -inset-4 rounded-full border border-white/5 animate-ping opacity-30 pointer-events-none" />
                    <span className="absolute -inset-8 rounded-full border border-white/5 animate-pulse-slow pointer-events-none" />
                  </>
                ) : (
                  <span className="absolute -inset-2 rounded-full border border-dashed border-gray-700/40 pointer-events-none" />
                )}

                {/* The Interactive Core Star Node */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNodeClick(chapter.id, chapter.title, isBuilt);
                  }}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center relative z-10 transition-all duration-300 ${
                    isBuilt
                      ? `bg-gray-950 cursor-pointer group-hover:scale-110 active:scale-95 ${colors.border}`
                      : "bg-gray-950/80 border-dashed border-gray-700 text-gray-500 cursor-not-allowed opacity-60 group-hover:opacity-100 group-hover:border-amber-500/60"
                  }`}
                  title={isBuilt ? `Align sensors to ${chapter.title}` : `${chapter.packSubject} Chamber Coming Online`}
                >
                  <IconComponent size={20} className={isBuilt ? "group-hover:rotate-12 transition-transform duration-300" : "opacity-60"} />
                </button>

                {/* Visible Per-Node Subject & Mission Label */}
                <div className="mt-2 flex flex-col items-center pointer-events-none text-center">
                  <div className="flex items-center gap-1">
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold tracking-wider uppercase backdrop-blur-md transition-all duration-200 ${
                      isBuilt 
                        ? `${colors.bg} ${colors.text} ${colors.borderLight} shadow-sm group-hover:shadow-md`
                        : "bg-gray-900/80 text-gray-400 border-gray-700/60"
                    }`}>
                      {chapter.packSubject}
                    </span>
                    {!isBuilt && (
                      <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-semibold tracking-wider uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        ONLINE SOON
                      </span>
                    )}
                  </div>
                  <span className={`font-display font-medium text-[11px] mt-0.5 max-w-[120px] truncate transition-colors duration-200 drop-shadow-md ${
                    isBuilt ? "text-gray-300 group-hover:text-white" : "text-gray-500"
                  }`}>
                    {chapter.title.split(":")[0]}
                  </span>
                </div>

                {/* Star node absolute hovering coordinates box */}
                <div className="absolute top-16 left-1/2 -translate-x-1/2 w-52 sm:w-64 p-4 rounded-2xl border border-white/10 bg-gray-950/95 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30 shadow-2xl">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-[8px] font-bold uppercase tracking-wider ${isBuilt ? colors.text : "text-amber-400"}`}>
                        {chapter.packSubject} • {chapter.packGrade}
                      </span>
                      {!isBuilt && (
                        <span className="px-1.5 py-0.2 rounded text-[7px] font-mono uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          STANDBY
                        </span>
                      )}
                    </div>
                    <span className="font-display font-bold text-sm text-white">{chapter.title}</span>
                    <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{chapter.shortDescription}</p>
                    
                    <div className="flex items-center gap-2 mt-2 font-mono text-[9px] text-gray-400 border-t border-white/5 pt-2">
                      <span className={`px-1.5 py-0.5 rounded border ${
                        isBuilt 
                          ? `${colors.bg} ${colors.text} ${colors.borderLight}` 
                          : "bg-gray-900 text-gray-400 border-gray-700"
                      }`}>
                        {isBuilt ? chapter.difficulty : "In Development"}
                      </span>
                      <span>•</span>
                      <span>{isBuilt ? `${chapter.estimatedMinutes} mins` : "Coming Soon"}</span>
                    </div>

                    <div className={`mt-3 flex items-center justify-between font-mono text-[10px] font-bold ${
                      isBuilt ? colors.text : "text-amber-400/90"
                    }`}>
                      <span>{isBuilt ? "ALIGN SENSORS" : "CHAMBER COMING ONLINE"}</span>
                      {isBuilt ? <ArrowRight size={12} className="animate-pulse" /> : <Clock size={12} />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Constellation Subject Legend: Built Labs vs Coming Online */}
      <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-6 py-4 rounded-2xl border border-white/10 bg-gray-950/70 backdrop-blur-xl">
        {/* Active Built Laboratories */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-[11px]">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] uppercase tracking-widest mr-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-gray-200 font-semibold">ACTIVE LABORATORIES:</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span className="text-white font-medium">Physics</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/60 text-cyan-300 font-semibold">3 Expeditions</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-white font-medium">Chemistry</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-950/60 text-emerald-300 font-semibold">Class XI Lab</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <span className="text-white font-medium">Mathematics</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded border border-amber-500/30 bg-amber-950/60 text-amber-300 font-semibold">Class XI Lab</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            <span className="text-white font-medium">Biology</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded border border-rose-500/30 bg-rose-950/60 text-rose-300 font-semibold">Class XI Lab</span>
          </div>
        </div>

        {/* Coming Online Standby Disciplines */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-5 font-mono text-[11px] pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
          <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[10px] uppercase tracking-wider mr-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
            <span>STANDBY:</span>
          </div>

          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <span className="w-2 h-2 rounded-full bg-purple-500/70" />
            <span className="text-gray-400">Literature</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded border border-purple-500/20 bg-purple-950/30 text-purple-300/80">COMING ONLINE</span>
          </div>

          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <span className="w-2 h-2 rounded-full bg-orange-500/70" />
            <span className="text-gray-400">History</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded border border-orange-500/20 bg-orange-950/30 text-orange-300/80">COMING ONLINE</span>
          </div>
        </div>
      </div>
    </main>
  );
}


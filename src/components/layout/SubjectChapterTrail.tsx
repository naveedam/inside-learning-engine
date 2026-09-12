/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { getCurriculumPackById, isChapterActive, getChapterStatus } from "../../content/registry";
import { useEngineStore } from "../../core/stores";
import { 
  ChevronLeft, Atom, Beaker, Compass, Dna, BookOpen, Layers, 
  ArrowRight, CheckCircle2, Clock, Lock, AlertCircle, Play, Sparkles, MinusCircle
} from "lucide-react";
import { Chapter } from "../../types";

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

const getSubjectStyles = (color: string) => {
  switch (color) {
    case "cyan":
      return {
        text: "text-cyan-400",
        bg: "bg-cyan-950/40",
        border: "border-cyan-500/30",
        borderActive: "border-cyan-400",
        glow: "shadow-[0_0_25px_rgba(34,211,238,0.25)]",
        lineActive: "#22d3ee",
        button: "bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold"
      };
    case "emerald":
      return {
        text: "text-emerald-400",
        bg: "bg-emerald-950/40",
        border: "border-emerald-500/30",
        borderActive: "border-emerald-400",
        glow: "shadow-[0_0_25px_rgba(16,185,129,0.25)]",
        lineActive: "#10b981",
        button: "bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold"
      };
    case "amber":
      return {
        text: "text-amber-400",
        bg: "bg-amber-950/40",
        border: "border-amber-500/30",
        borderActive: "border-amber-400",
        glow: "shadow-[0_0_25px_rgba(251,191,36,0.25)]",
        lineActive: "#f59e0b",
        button: "bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold"
      };
    case "rose":
      return {
        text: "text-rose-400",
        bg: "bg-rose-950/40",
        border: "border-rose-500/30",
        borderActive: "border-rose-400",
        glow: "shadow-[0_0_25px_rgba(244,63,94,0.25)]",
        lineActive: "#f43f5e",
        button: "bg-rose-500 hover:bg-rose-400 text-gray-950 font-bold"
      };
    default:
      return {
        text: "text-cyan-400",
        bg: "bg-cyan-950/40",
        border: "border-cyan-500/30",
        borderActive: "border-cyan-400",
        glow: "shadow-[0_0_25px_rgba(34,211,238,0.25)]",
        lineActive: "#22d3ee",
        button: "bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold"
      };
  }
};

export default function SubjectChapterTrail() {
  const { selectedSubjectId, selectSubject, selectChapter, completedMissions } = useEngineStore();
  const [standbyToast, setStandbyToast] = useState<string | null>(null);

  const pack = selectedSubjectId ? getCurriculumPackById(selectedSubjectId) : undefined;

  if (!pack) {
    return (
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 text-center font-mono">
        <p className="text-gray-400 mb-4">Subject discipline not found or unselected.</p>
        <button
          onClick={() => selectSubject(null)}
          className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-cyan-400 flex items-center gap-2 mx-auto"
        >
          <ChevronLeft size={14} /> RETURN TO SUBJECT HUB
        </button>
      </div>
    );
  }

  const styles = getSubjectStyles(pack.accentColor);
  const Icon = getSubjectIcon(pack.icon);
  const totalChapters = pack.chapters.length;
  const activeChapters = pack.chapters.filter(isChapterActive).length;

  const handleChapterClick = (chapter: Chapter) => {
    if (isChapterActive(chapter)) {
      setStandbyToast(null);
      selectChapter(chapter.id);
    } else {
      const status = getChapterStatus(chapter);
      if (status === "Not Planned") {
        setStandbyToast(`The "${chapter.title}" sector is not planned for simulation per expedition roadmap.`);
      } else {
        setStandbyToast(`The "${chapter.title}" research chamber is currently in development (Coming Online).`);
      }
    }
  };

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 relative select-none">
      {/* Standby Chapter Notice Toast */}
      {standbyToast && (
        <div className="mb-6 px-4 py-3 rounded-2xl border border-amber-500/30 bg-amber-950/90 backdrop-blur-md flex items-center justify-between text-amber-200 text-xs font-mono shadow-xl relative z-30 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={16} className="text-amber-400 shrink-0" />
            <span className="leading-snug">{standbyToast}</span>
          </div>
          <button 
            onClick={() => setStandbyToast(null)}
            className="text-amber-400 hover:text-white text-[10px] ml-4 uppercase font-bold tracking-wider hover:underline cursor-pointer shrink-0"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Navigation Breadcrumb Bar & Back to Hub */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => selectSubject(null)}
          className="px-3.5 py-2.5 min-h-[44px] rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
        >
          <ChevronLeft size={14} className="text-gray-400" />
          <span>BACK TO CONSTELLATION GATEWAY</span>
        </button>

        <div className="font-mono text-[11px] text-gray-500 hidden sm:flex items-center gap-2">
          <span>CONSTELLATION</span>
          <span>/</span>
          <span className={styles.text}>{pack.subject.toUpperCase()}</span>
          <span>/</span>
          <span className="text-gray-300">EXPEDITION TRAIL</span>
        </div>
      </div>

      {/* Subject Header Banner */}
      <div className="mb-10 p-6 sm:p-8 rounded-3xl border border-white/10 bg-gray-950/60 backdrop-blur-xl relative overflow-hidden shadow-xl">
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br ${styles.bg} blur-3xl pointer-events-none opacity-50`} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className={`w-16 h-16 rounded-2xl border ${styles.border} ${styles.bg} flex items-center justify-center ${styles.text} shadow-inner shrink-0`}>
              <Icon size={32} />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold tracking-widest uppercase ${styles.bg} ${styles.border} ${styles.text}`}>
                  {pack.grade}
                </span>
                <span className="text-[11px] font-mono text-gray-400">
                  SEQUENTIAL EXPEDITION PATH
                </span>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                {pack.subject} Expedition Trail
              </h1>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">TOTAL EXPEDITIONS</span>
              <span className="text-white font-bold text-lg">{totalChapters} Sectors</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">ACTIVE CHAMBERS</span>
              <span className={`font-bold text-lg ${styles.text}`}>{activeChapters} Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Path / Trail Layout */}
      <div className="relative">
        {/* Central Connecting Circuit Spine */}
        <div className="absolute left-6 sm:left-8 top-8 bottom-8 w-0.5 bg-white/10 pointer-events-none hidden md:block z-0">
          <div 
            className="w-full bg-gradient-to-b from-cyan-400 via-emerald-400 to-transparent transition-all duration-1000"
            style={{ height: `${Math.min(100, (activeChapters / totalChapters) * 100)}%` }}
          />
        </div>

        {/* Trail Chapter Nodes */}
        <div className="flex flex-col gap-6 relative z-10">
          {pack.chapters.map((chapter, index) => {
            const isActive = isChapterActive(chapter);
            const status = getChapterStatus(chapter);
            const chapterNum = String(index + 1).padStart(2, "0");
            const hasCompleted = chapter.missions.some(m => completedMissions.includes(m.id));

            return (
              <div
                key={chapter.id}
                onClick={() => handleChapterClick(chapter)}
                className={`group relative flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-3xl border transition-all duration-300 ${
                  isActive
                    ? `border-white/10 hover:border-white/20 bg-gray-950/70 hover:bg-gray-950/90 ${styles.glow} cursor-pointer`
                    : status === "Not Planned"
                    ? "border-gray-900 bg-gray-950/20 opacity-50 hover:opacity-75 cursor-pointer"
                    : "border-white/5 bg-gray-950/30 opacity-70 hover:opacity-90 cursor-pointer"
                }`}
              >
                {/* Node Sequence Indicator Badge */}
                <div className="flex items-center gap-3 md:gap-4 shrink-0">
                  <div className={`w-12 h-12 rounded-2xl border flex flex-col items-center justify-center font-mono transition-transform duration-300 group-hover:scale-105 ${
                    isActive
                      ? `${styles.border} ${styles.bg} ${styles.text} font-bold shadow-md`
                      : "border-gray-800 bg-gray-900/60 text-gray-500"
                  }`}>
                    <span className="text-[8px] uppercase tracking-wider text-gray-400">EXP</span>
                    <span className="text-sm font-bold leading-none">{chapterNum}</span>
                  </div>
                </div>

                {/* Chapter Information */}
                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Badge */}
                    {isActive ? (
                      <span className="px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 text-emerald-300 font-mono text-[9px] font-bold tracking-wider uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ACTIVE & READY
                      </span>
                    ) : status === "Not Planned" ? (
                      <span className="px-2 py-0.5 rounded-full border border-gray-700/60 bg-gray-900/60 text-gray-400 font-mono text-[9px] font-semibold tracking-wider uppercase flex items-center gap-1">
                        <MinusCircle size={10} />
                        NOT PLANNED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-950/40 text-amber-300 font-mono text-[9px] font-semibold tracking-wider uppercase flex items-center gap-1">
                        <Clock size={10} />
                        COMING ONLINE
                      </span>
                    )}

                    {hasCompleted && (
                      <span className="px-2 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-950/60 text-cyan-300 font-mono text-[9px] font-bold tracking-wider uppercase flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        COMPLETED
                      </span>
                    )}

                    <span className="font-mono text-[10px] text-gray-500">
                      • {chapter.estimatedMinutes} Mins • {chapter.difficulty}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight group-hover:text-white transition-colors">
                    {chapter.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 leading-relaxed">
                    {chapter.shortDescription}
                  </p>

                  {/* Core Competencies preview */}
                  {chapter.curricularRequirements && chapter.curricularRequirements.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {chapter.curricularRequirements.slice(0, 2).map((req, i) => (
                        <span key={i} className="px-2 py-0.5 rounded border border-white/5 bg-white/5 text-[10px] font-mono text-gray-400 truncate max-w-xs">
                          {req.split(":")[0]}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Action Button */}
                <div className="shrink-0 self-end md:self-center mt-2 md:mt-0">
                  {isActive ? (
                    <button
                      tabIndex={-1}
                      className={`px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer ${styles.button}`}
                    >
                      <span>ENTER CHAMBER</span>
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ) : status === "Not Planned" ? (
                    <div className="px-3 py-1.5 rounded-xl border border-gray-800 bg-gray-950/40 text-gray-500 font-mono text-[11px] flex items-center gap-1.5">
                      <MinusCircle size={12} />
                      <span>NOT PLANNED</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 rounded-xl border border-dashed border-gray-700/60 bg-gray-900/40 text-gray-500 font-mono text-[11px] flex items-center gap-1.5">
                      <Lock size={12} />
                      <span>STANDBY</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

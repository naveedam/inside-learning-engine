/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { getAllCurriculumPacks, getPackActiveChaptersCount, isChapterActive } from "../../content/registry";
import { useEngineStore } from "../../core/stores";
import { Atom, Beaker, Compass, Dna, ArrowRight, Zap, BookOpen, Layers, CheckCircle2, Clock } from "lucide-react";
import { CurriculumPack } from "../../types";

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
        borderHover: "group-hover:border-cyan-400/80",
        glow: "group-hover:shadow-[0_0_35px_rgba(34,211,238,0.22)]",
        bgGlow: "from-cyan-500/10 via-cyan-950/20 to-transparent",
        text: "text-cyan-400",
        badgeBg: "bg-cyan-950/60",
        badgeBorder: "border-cyan-500/30",
        badgeText: "text-cyan-300",
        progressBar: "bg-gradient-to-r from-cyan-500 to-cyan-300",
        buttonBg: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-gray-950"
      };
    case "emerald":
      return {
        border: "border-emerald-500/25",
        borderHover: "group-hover:border-emerald-400/80",
        glow: "group-hover:shadow-[0_0_35px_rgba(16,185,129,0.22)]",
        bgGlow: "from-emerald-500/10 via-emerald-950/20 to-transparent",
        text: "text-emerald-400",
        badgeBg: "bg-emerald-950/60",
        badgeBorder: "border-emerald-500/30",
        badgeText: "text-emerald-300",
        progressBar: "bg-gradient-to-r from-emerald-500 to-emerald-300",
        buttonBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-gray-950"
      };
    case "amber":
      return {
        border: "border-amber-500/25",
        borderHover: "group-hover:border-amber-400/80",
        glow: "group-hover:shadow-[0_0_35px_rgba(251,191,36,0.22)]",
        bgGlow: "from-amber-500/10 via-amber-950/20 to-transparent",
        text: "text-amber-400",
        badgeBg: "bg-amber-950/60",
        badgeBorder: "border-amber-500/30",
        badgeText: "text-amber-300",
        progressBar: "bg-gradient-to-r from-amber-500 to-amber-300",
        buttonBg: "bg-amber-500/10 text-amber-300 border-amber-500/30 group-hover:bg-amber-500 group-hover:text-gray-950"
      };
    case "rose":
      return {
        border: "border-rose-500/25",
        borderHover: "group-hover:border-rose-400/80",
        glow: "group-hover:shadow-[0_0_35px_rgba(244,63,94,0.22)]",
        bgGlow: "from-rose-500/10 via-rose-950/20 to-transparent",
        text: "text-rose-400",
        badgeBg: "bg-rose-950/60",
        badgeBorder: "border-rose-500/30",
        badgeText: "text-rose-300",
        progressBar: "bg-gradient-to-r from-rose-500 to-rose-300",
        buttonBg: "bg-rose-500/10 text-rose-300 border-rose-500/30 group-hover:bg-rose-500 group-hover:text-gray-950"
      };
    default:
      return {
        border: "border-cyan-500/25",
        borderHover: "group-hover:border-cyan-400/80",
        glow: "group-hover:shadow-[0_0_35px_rgba(34,211,238,0.22)]",
        bgGlow: "from-cyan-500/10 via-cyan-950/20 to-transparent",
        text: "text-cyan-400",
        badgeBg: "bg-cyan-950/60",
        badgeBorder: "border-cyan-500/30",
        badgeText: "text-cyan-300",
        progressBar: "bg-gradient-to-r from-cyan-500 to-cyan-300",
        buttonBg: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-gray-950"
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
      {/* Background Subtle Spatial Atmospheric Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-3xl -top-20 -left-20 animate-pulse-slow" />
        <div className="absolute w-[450px] h-[450px] rounded-full bg-emerald-500/5 blur-3xl top-1/3 -right-20 animate-pulse-slow" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-3xl bottom-10 left-1/4 animate-pulse-slow" />
      </div>

      {/* Hero Welcome Cinematic Header - Option A (Mandated) */}
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

      {/* Top Navigation Breadcrumb Banner */}
      <div className="mb-6 flex items-center justify-between font-mono text-[11px] text-gray-400 px-1">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-semibold uppercase tracking-wider">LEVEL 01 // DISCIPLINARY SUBJECT HUB</span>
          <span className="text-gray-600">/</span>
          <span className="text-gray-400">SELECT DISCIPLINE TO INSPECT SYLLABUS PATH</span>
        </div>
        <span className="hidden sm:inline text-gray-500 text-[10px]">
          ISC CLASS XI CURRICULUM
        </span>
      </div>

      {/* The 4 Primary Subject Hub Nodes (Physics, Chemistry, Mathematics, Biology) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
        {primaryPacks.map((pack) => {
          const theme = getSubjectTheme(pack.accentColor);
          const Icon = getSubjectIcon(pack.icon);
          const { active, total } = getPackActiveChaptersCount(pack);
          const activePercent = Math.round((active / total) * 100);

          // Get names of active chapters for preview
          const activeChapterNames = pack.chapters
            .filter(isChapterActive)
            .map(ch => ch.title.split(":")[0]);

          return (
            <div
              key={pack.id}
              onClick={() => selectSubject(pack.id)}
              className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl border ${theme.border} ${theme.borderHover} ${theme.glow} bg-gray-950/70 hover:bg-gray-950/90 backdrop-blur-xl transition-all duration-300 cursor-pointer overflow-hidden active:scale-[0.99]`}
            >
              {/* Soft atmospheric gradient sheen */}
              <div className={`absolute -top-24 -right-24 w-60 h-60 rounded-full bg-gradient-to-br ${theme.bgGlow} blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

              {/* Card Header: Disciplinary Identity */}
              <div className="flex items-start justify-between gap-4 relative z-10 mb-5">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl border ${theme.badgeBorder} ${theme.badgeBg} flex items-center justify-center ${theme.text} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} className="group-hover:rotate-6 transition-transform duration-300" />
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
                <div className={`px-2.5 py-1 rounded-full border ${theme.badgeBorder} ${theme.badgeBg} ${theme.badgeText} font-mono text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1.5 shrink-0`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${theme.progressBar} animate-pulse`} />
                  <span>{active} OF {total} ACTIVE</span>
                </div>
              </div>

              {/* Middle Section: Progress Bar and Syllabus Stats */}
              <div className="relative z-10 my-2 flex flex-col gap-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-gray-400">Syllabus Operational Progress</span>
                  <span className={`font-bold ${theme.text}`}>{activePercent}%</span>
                </div>

                {/* Progress bar line */}
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                  <div 
                    className={`h-full rounded-full ${theme.progressBar} transition-all duration-700`}
                    style={{ width: `${Math.max(activePercent, 8)}%` }}
                  />
                </div>

                {/* Active Chapters Bullet Summary */}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">
                    OPERATIONAL:
                  </span>
                  {activeChapterNames.map((name, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md border border-white/10 bg-white/5 text-[11px] font-mono text-gray-300 flex items-center gap-1"
                    >
                      <CheckCircle2 size={10} className={theme.text} />
                      {name}
                    </span>
                  ))}
                  {total > active && (
                    <span className="px-2 py-0.5 rounded-md border border-dashed border-gray-700/60 bg-gray-900/40 text-[10px] font-mono text-gray-500 flex items-center gap-1">
                      <Clock size={10} />
                      +{total - active} Coming Online
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom CTA Action Bar */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                <span className="font-mono text-[11px] text-gray-400 group-hover:text-gray-200 transition-colors">
                  Inspect sequential syllabus trail
                </span>
                <button 
                  tabIndex={-1}
                  className={`px-4 py-2 rounded-xl border text-xs font-mono font-semibold tracking-wider uppercase flex items-center gap-2 transition-all duration-200 cursor-pointer ${theme.buttonBg}`}
                >
                  <span>OPEN SYLLABUS</span>
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prototype Disciplines Drawer / Standby Bar */}
      {prototypePacks.length > 0 && (
        <div className="mt-8 p-4 rounded-2xl border border-white/5 bg-gray-950/40 backdrop-blur-md relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-gray-600" />
            <span className="text-gray-400 font-semibold uppercase tracking-wider">PROTOTYPE DISCIPLINES ON STANDBY:</span>
            <span className="text-gray-500 text-[11px]">Humanities exploratory sandboxes</span>
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

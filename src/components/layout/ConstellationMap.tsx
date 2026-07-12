/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { getAllCurriculumPacks } from "../../content/registry";
import { useEngineStore } from "../../core/stores";
import { Compass, Trophy, Atom, CircleDot, ArrowRight, Zap } from "lucide-react";

export default function ConstellationMap() {
  const packs = getAllCurriculumPacks();
  const { selectChapter, xp } = useEngineStore();

  // We map kinematics as our first prominent constellation system
  const activePack = packs[0] || null;

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
            Chapter Constellation Map
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
      <div className="relative w-full aspect-video md:aspect-[21/9] min-h-[360px] rounded-3xl border border-white/10 bg-gray-950/45 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Spatial Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Dynamic Vector Line connecting Constellation coordinates */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Constellation linking coordinate lines */}
          <line
            x1="32%"
            y1="48%"
            x2="55%"
            y2="30%"
            stroke="url(#neonGlow)"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="animate-pulse"
          />
          <line
            x1="55%"
            y1="30%"
            x2="78%"
            y2="60%"
            stroke="url(#neonGlow)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </svg>

        {/* ----------------- CORE STELLAR SYSTEM 1 (KINEMATICS) ----------------- */}
        {activePack && activePack.chapters.map((chapter) => {
          const pos = chapter.constellationPosition;
          return (
            <div
              key={chapter.id}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div className="relative group">
                {/* Outer halo circular ring pulse */}
                <span className="absolute -inset-4 rounded-full border border-cyan-400/25 animate-ping opacity-30" />
                <span className="absolute -inset-8 rounded-full border border-cyan-400/10 animate-pulse-slow pointer-events-none" />

                {/* The Interactive Core Star Node */}
                <button
                  onClick={() => selectChapter(chapter.id)}
                  className="w-12 h-12 rounded-full border-2 border-cyan-400 bg-gray-950 text-cyan-400 flex items-center justify-center cursor-pointer group-hover:bg-cyan-500 group-hover:text-black group-hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                  title="Align Sensors to Star System"
                >
                  <Atom size={20} className="group-hover:rotate-180 transition-transform duration-1000" />
                </button>

                {/* Star node absolute hovering coordinates box */}
                <div className="absolute top-14 left-1/2 -translate-x-1/2 w-48 sm:w-64 p-4 rounded-2xl border border-white/10 bg-gray-950/90 backdrop-blur-md opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none sm:pointer-events-auto z-30 shadow-2xl">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[8px] text-cyan-400 font-bold uppercase tracking-wider">
                      Target Constellation: Active
                    </span>
                    <span className="font-display font-bold text-sm text-white">{chapter.title}</span>
                    <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{chapter.shortDescription}</p>
                    
                    <div className="flex items-center gap-2 mt-2 font-mono text-[9px] text-gray-400 border-t border-white/5 pt-2">
                      <span className="bg-cyan-950/40 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20">
                        {chapter.difficulty}
                      </span>
                      <span>•</span>
                      <span>{chapter.estimatedMinutes} mins</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-cyan-400 font-mono text-[10px] font-bold sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>ALIGN SENSORS</span>
                      <ArrowRight size={12} className="animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* ----------------- STAR SYSTEM 2 (MOCKED LOCKED SYSTEM) ----------------- */}
        <div style={{ left: "55%", top: "30%" }} className="absolute -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative opacity-40 group cursor-not-allowed">
            <button className="w-10 h-10 rounded-full border border-gray-600 bg-gray-950 text-gray-500 flex items-center justify-center">
              <CircleDot size={16} />
            </button>
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl border border-white/5 bg-gray-950/90 font-mono text-[9px] text-gray-500 text-center pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
              MAPPED SECTOR: LORENTZ FORCES<br />
              <span className="text-orange-500 font-bold">LOCKED: REQUIREMENTS NOT MET</span>
            </div>
          </div>
        </div>

        {/* ----------------- STAR SYSTEM 3 (MOCKED LOCKED SYSTEM) ----------------- */}
        <div style={{ left: "78%", top: "60%" }} className="absolute -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative opacity-40 group cursor-not-allowed">
            <button className="w-10 h-10 rounded-full border border-gray-600 bg-gray-950 text-gray-500 flex items-center justify-center">
              <CircleDot size={16} />
            </button>
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl border border-white/5 bg-gray-950/90 font-mono text-[9px] text-gray-500 text-center pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
              MAPPED SECTOR: ORBITAL MECHANICS<br />
              <span className="text-orange-500 font-bold">LOCKED: REQUIREMENTS NOT MET</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useEngineStore } from "../../core/stores";
import { getAllCurriculumPacks } from "../../content/registry";
import { Compass, Clock, Award, Play, ChevronLeft, Zap, ArrowRight } from "lucide-react";

export default function ChapterMissionExplorer() {
  const { selectedChapterId, selectChapter, startMission, completedMissions } = useEngineStore();

  // Load the active pack and its corresponding chapter metadata
  const packs = getAllCurriculumPacks();
  const pack = packs.find((p) => p.chapters.some((ch) => ch.id === selectedChapterId)) || packs[0];
  const chapter = pack?.chapters.find((ch) => ch.id === selectedChapterId);

  if (!chapter) {
    return (
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 text-center font-mono text-gray-500">
        Aligning telescopic receptors. Chapter not found...
      </div>
    );
  }

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 relative">
      {/* Return button */}
      <button
        onClick={() => selectChapter(null)}
        className="mb-6 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1.5 transition-all self-start border border-white/10 active:scale-95 cursor-pointer"
      >
        <ChevronLeft size={14} className="text-gray-400" />
        <span>BACK TO {pack?.subject ? `${pack.subject.toUpperCase()} EXPEDITION PATH` : "EXPEDITIONS"}</span>
      </button>

      {/* Chapter Overview Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Chapter Narrative & Description */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-gray-950/45 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/5 blur-2xl pointer-events-none" />

            <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded self-start inline-block mb-3">
              {pack?.grade || "ISC Class XI"} Sector Core
            </span>

            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight leading-tight mb-2">
              {chapter.title}
            </h2>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
              {chapter.longDescription}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/10 pt-6 font-mono text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-cyan-400" />
                <span>ESTIMATED TIME: <span className="text-white font-bold">{chapter.estimatedMinutes} Mins</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={14} className="text-orange-500" />
                <span>DIFFICULTY: <span className="text-white font-bold">{chapter.difficulty}</span></span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <Compass size={14} className="text-emerald-500" />
                <span>STATUS: <span className="text-emerald-400 font-bold">READY TO DEPLOY</span></span>
              </div>
            </div>
          </div>

          {/* Core Learning Objectives block */}
          <div className="p-6 sm:p-8 rounded-3xl border border-white/5 bg-gray-950/30 backdrop-blur-md">
            <h3 className="font-mono text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-4">
              FIELD BRIEFING: CORE COMPETENCIES ({pack?.grade || "ISC Class XI"})
            </h3>
            <ul className="flex flex-col gap-3 font-mono text-xs text-gray-300">
              {chapter.curricularRequirements && chapter.curricularRequirements.length > 0 ? (
                chapter.curricularRequirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-cyan-400 font-bold">▶</span>
                    <span>{req}</span>
                  </li>
                ))
              ) : (
                Array.from(new Set(chapter.missions.flatMap(m => m.learningObjectives))).slice(0, 3).map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-cyan-400 font-bold">▶</span>
                    <span>{obj}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Right Column: Active Missions Diagnostic Deck */}
        <div className="flex flex-col gap-4">
          <h3 className="font-mono text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            Available Missions In Sector
          </h3>

          {chapter.missions.map((mission) => {
            const isCompleted = completedMissions.includes(mission.id);

            return (
              <div
                key={mission.id}
                className="p-5 rounded-2xl border border-white/10 bg-gray-950/70 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300 flex flex-col gap-4 shadow-lg"
              >
                {/* Absolute background color accent glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-cyan-500 font-bold tracking-widest uppercase">
                      {mission.codename}
                    </span>
                    <h4 className="font-display font-bold text-white text-base mt-0.5 group-hover:text-cyan-400 transition-colors">
                      {mission.title}
                    </h4>
                  </div>

                  {isCompleted && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[8px] font-bold border border-emerald-500/30">
                      RESOLVED
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">
                  {mission.description}
                </p>

                {/* Mission Objectives Checklist */}
                <div className="flex flex-col gap-1.5 font-mono text-[10px] text-gray-500">
                  <span className="text-white text-[9px] uppercase font-bold tracking-wider">Objectives:</span>
                  {mission.objectives.map((obj, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-cyan-400">⚡</span>
                      <span className="truncate">{obj}</span>
                    </div>
                  ))}
                </div>

                {/* Launch Button */}
                <button
                  onClick={() => startMission(mission.id)}
                  className="w-full mt-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 active:scale-98 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                >
                  <Play size={12} fill="currentColor" /> DEPLOY TO COCKPIT <ArrowRight size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

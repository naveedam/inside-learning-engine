/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useEngineStore } from "../../core/stores";
import { 
  BookOpen, 
  Clock, 
  MapPin, 
  Compass, 
  CheckCircle2, 
  Lock, 
  HelpCircle, 
  Sparkles,
  ArrowRight,
  Database,
  Feather
} from "lucide-react";

export default function LabNotebook() {
  const { 
    xp, 
    investigations, 
    knowledgeMap, 
    activeMisconceptions, 
    resetProgress 
  } = useEngineStore();

  const [selectedDiscoveryId, setSelectedDiscoveryId] = useState<string | null>("horizontal-independence");

  // Discovery Definitions (Richard Feynman style explanations)
  const discoveriesList = [
    {
      id: "horizontal-independence",
      title: "Independent Horizontal Motion",
      subtitle: "Galileo's Conic Split",
      icon: "🔭",
      description: "Discovering that sideways velocity is constant while vertical fall accelerates under gravity.",
      insight: "Galileo discovered a wonderful secret of our universe: if you throw a cargo crate sideways, its side-to-side drift is completely lazy and unbothered by gravity. Gravity only pulls straight down, speeding up the fall, while the horizontal speed remains constant. Together, these two independent speeds weave a perfect conic section: a parabola."
    },
    {
      id: "max-range-mars",
      title: "Ideal Launch Angle (45°)",
      subtitle: "The Ultimate Compromise",
      icon: "🏔️",
      description: "Finding the sweet spot between vertical airtime and horizontal velocity to reach maximum distance.",
      insight: "Why is 45 degrees the magic angle? If you aim too low, the ground catches the crate too early before it can travel. If you aim too high, the crate spends all its energy climbing into the upper atmosphere, barely moving sideways. 45 degrees balances airtime and forward velocity, yielding the maximum possible range."
    },
    {
      id: "gravity-shape",
      title: "Gravity Shapes Trajectories",
      subtitle: "The Gentle Grip of Mars",
      icon: "🪐",
      description: "Observing how a weaker gravitational constant extends flight paths into sweeping arches.",
      insight: "Gravitational pull is like an invisible hand. On Earth, a heavy 9.8 m/s² grip pulls trajectories down in a steep, compressed arch. But on Mars (3.72 m/s²), the grip is gentle! Trajectories expand, floating twice as far. The path is a physical manifestation of gravity's force bending the fabric of flight."
    },
    {
      id: "mass-independence",
      title: "Mass Independence in Vacuo",
      subtitle: "Galileo's Leaning Tower",
      icon: "⚖️",
      description: "Proving that a heavy iron block and light wooden box fall at the exact same rate under gravity.",
      insight: "It seems counter-intuitive, but heavier crates do not fall faster. Gravity pulls harder on a heavy steel crate, yes, but that crate also has more inertia—it requires more force to nudge! These two physical realities cancel out perfectly. In a vacuum, all matter falls at the exact same rate, regardless of mass."
    }
  ];

  const activeDiscovery = discoveriesList.find(d => d.id === selectedDiscoveryId);

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 relative select-none">
      {/* Decorative Blueprint Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/5 pb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] uppercase tracking-widest">
            <Feather size={12} className="animate-pulse" /> RESEARCH JOURNAL & EXPERIENTIAL LOGBOOK
          </div>
          <h1 className="font-display font-bold text-3xl text-white tracking-tight leading-none">
            The Researcher's Log
          </h1>
          <p className="text-gray-400 text-sm max-w-xl">
            A beautiful records ledger of your predictions, empirical experiments, and unlocked universal discoveries on Mars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-gray-950 border border-white/10 flex flex-col font-mono">
            <span className="text-[9px] text-gray-500 uppercase">Total Accumulated XP</span>
            <span className="text-cyan-400 font-bold text-base">{xp} XP</span>
          </div>

          <button
            onClick={() => {
              if (confirm("Resetting will wipe your investigation history and discoveries. Proceed?")) {
                resetProgress();
              }
            }}
            className="px-3 py-2 rounded-xl bg-red-950/20 text-red-400 hover:bg-red-950/40 border border-red-500/10 hover:border-red-500/20 text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer"
          >
            RESET EXPEDITION
          </button>
        </div>
      </div>

      {/* Tactile Book-like split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PAGE (Col 1-7): THE EMPIRICAL RECORD (Investigations feed) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-6 rounded-3xl border border-white/10 bg-gray-950/70 backdrop-blur-xl flex flex-col gap-6 shadow-xl relative min-h-[500px]">
            {/* Page Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="font-mono text-[10px] text-cyan-400 font-bold flex items-center gap-2 uppercase tracking-wider">
                <Database size={13} /> Left Page: Empirical Record Ledger
              </span>
              <span className="text-gray-500 font-mono text-[9px] uppercase">
                {investigations.length} loops compiled
              </span>
            </div>

            {investigations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/5 rounded-2xl bg-black/25 min-h-[350px]">
                <div className="w-12 h-12 rounded-full bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-xl mb-4">
                  ✏️
                </div>
                <h4 className="font-display font-bold text-sm text-white mb-1">Empirical Ledger is Empty</h4>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  Go back to the mission deck and launch supply canisters. Every prediction, flight telemetry, and reflection observation will be recorded here automatically!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6 max-h-[550px] overflow-y-auto pr-2">
                {investigations.map((record, index) => (
                  <div 
                    key={record.id} 
                    className="p-5 rounded-2xl border border-white/5 bg-gray-950/50 hover:bg-gray-950/80 transition-all flex flex-col gap-3 relative overflow-hidden group"
                  >
                    {/* Retro line numbering accent */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan-500/[0.03] to-transparent pointer-events-none" />

                    {/* Meta bar */}
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] text-cyan-300 font-semibold uppercase tracking-wider">
                        Loop Iteration #0{record.loopIteration}
                      </span>
                      <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[9px]">
                        <Clock size={11} />
                        <span>{new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    {/* Grid split showing prediction vs result */}
                    <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-3">
                      {/* Prediction Column */}
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[8px] text-gray-400 uppercase tracking-wider">Prediction (Hypothesis)</span>
                        <div className="flex items-center gap-1.5 text-xs text-orange-400 font-semibold font-mono">
                          <span>{record.prediction.angle}° Elev • {record.prediction.velocity}m/s</span>
                        </div>
                        <div className="text-[10px] font-mono text-gray-400 italic">
                          "{record.prediction.rationalePrompt || "No qualitative rationale stated"}"
                        </div>
                        {record.prediction.flagX && (
                          <div className="flex items-center gap-1 text-[9px] font-mono text-gray-500">
                            <MapPin size={10} /> Predicted Landing: <span className="text-orange-300">{record.prediction.flagX}m</span>
                          </div>
                        )}
                      </div>

                      {/* Result Column */}
                      <div className="flex flex-col gap-1 border-l border-white/5 pl-4">
                        <span className="font-mono text-[8px] text-gray-400 uppercase tracking-wider">Experiment (Reality)</span>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold font-mono">
                          <span>Impact Range: {record.experimentResult.telemetry.impactX}m</span>
                        </div>
                        <div className="flex flex-col gap-0.5 font-mono text-[9px] text-gray-500 mt-1">
                          <div>Max Apex: <span className="text-gray-300">{record.experimentResult.telemetry.peakHeight}m</span></div>
                          <div>Gravity: <span className="text-gray-300">{record.experimentResult.telemetry.gravity} m/s²</span></div>
                          <div>Mass Used: <span className="text-gray-300">{record.experimentResult.telemetry.mass || 100}kg</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Socratic Reflection box */}
                    {record.reflection.studentResponse && (
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                        <span className="font-mono text-[8px] text-cyan-400 font-bold uppercase tracking-wider">Reflective Observation</span>
                        <p className="text-xs text-gray-300 italic font-sans leading-relaxed">
                          "{record.reflection.studentResponse}"
                        </p>
                      </div>
                    )}

                    {/* Unlocked discoveries from this investigation */}
                    {record.discoveriesMade.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 items-center mt-1">
                        <span className="font-mono text-[8px] text-emerald-400 font-bold uppercase tracking-wider">Discoveries:</span>
                        {record.discoveriesMade.map(discId => {
                          const disc = discoveriesList.find(d => d.id === discId);
                          return (
                            <span 
                              key={discId} 
                              onClick={() => setSelectedDiscoveryId(discId)}
                              className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono hover:bg-emerald-500/20 cursor-pointer transition-all active:scale-95"
                            >
                              ✨ {disc?.title || discId}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PAGE (Col 8-12): KNOWLEDGE MAP & COGNITIVE PROGRESS */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-3xl border border-white/10 bg-gray-950/70 backdrop-blur-xl flex flex-col gap-6 shadow-xl min-h-[500px]">
            {/* Page Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="font-mono text-[10px] text-cyan-400 font-bold flex items-center gap-2 uppercase tracking-wider">
                <Compass size={13} /> Right Page: Cognitive Knowledge Map
              </span>
              <span className="text-gray-500 font-mono text-[9px] uppercase">
                {knowledgeMap.length} of 4 unlocked
              </span>
            </div>

            {/* Simulated Hand-Drawn Knowledge Network Map */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-2.5">
                {discoveriesList.map((disc) => {
                  const isUnlocked = knowledgeMap.includes(disc.id);
                  const isSelected = selectedDiscoveryId === disc.id;

                  return (
                    <button
                      key={disc.id}
                      onClick={() => setSelectedDiscoveryId(disc.id)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start gap-4 transition-all relative overflow-hidden cursor-pointer ${
                        isSelected
                          ? isUnlocked 
                            ? "bg-cyan-950/20 border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                            : "bg-gray-900 border-white/20"
                          : isUnlocked 
                          ? "bg-gray-950/50 border-white/5 hover:border-white/10" 
                          : "bg-gray-950/10 border-white/5 opacity-50"
                      }`}
                    >
                      {/* Left side node connection circle */}
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm shadow-inner transition-colors ${
                        isUnlocked
                          ? isSelected
                            ? "bg-cyan-950/60 border-cyan-400 text-white animate-pulse"
                            : "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                          : "bg-gray-900 border-white/5 text-gray-500"
                      }`}>
                        {isUnlocked ? disc.icon : <Lock size={12} />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-display font-bold text-xs ${isUnlocked ? "text-white" : "text-gray-500"}`}>
                            {disc.title}
                          </span>
                          {isUnlocked && (
                            <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/10 px-1 py-0.2 rounded font-mono">
                              UNLOCKED
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[9px] text-gray-500 uppercase">{disc.subtitle}</span>
                        <p className={`text-[10px] mt-1 ${isUnlocked ? "text-gray-400" : "text-gray-600"} leading-relaxed line-clamp-2`}>
                          {disc.description}
                        </p>
                      </div>

                      {/* Arrow indicator */}
                      <div className="self-center text-gray-500">
                        <ArrowRight size={14} className={`transform transition-transform ${isSelected ? "translate-x-1" : ""}`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Discovery Socratic Feynman Insight Details panel */}
              {activeDiscovery && (
                <div className="p-5 rounded-2xl border border-cyan-500/15 bg-cyan-950/10 relative overflow-hidden animate-in fade-in zoom-in-98 duration-200">
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan-500/5 blur-2xl pointer-events-none" />

                  {knowledgeMap.includes(activeDiscovery.id) ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{activeDiscovery.icon}</span>
                        <div className="flex flex-col">
                          <span className="font-mono text-[8px] text-cyan-400 font-bold uppercase tracking-wider">Feynman Insight Analysis</span>
                          <span className="font-display font-bold text-sm text-white">{activeDiscovery.title}</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed italic font-sans border-t border-cyan-500/10 pt-2.5">
                        "{activeDiscovery.insight}"
                      </p>

                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400/80 bg-cyan-500/5 border border-cyan-500/10 rounded-lg px-2.5 py-1.5 mt-1 self-start">
                        <Sparkles size={11} /> Derived via active scientific exploration
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-6">
                      <Lock size={20} className="text-gray-600 mb-2" />
                      <span className="font-mono text-[10px] text-gray-500 uppercase font-semibold">Discovery Locked</span>
                      <p className="text-[11px] text-gray-400 max-w-xs mt-1 leading-relaxed">
                        Complete investigations in Operation: Crate Drop matching the scientific conditions for {activeDiscovery.title} to unlock this Feynman insight.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

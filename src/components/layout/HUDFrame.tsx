/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { useEngineStore } from "../../core/stores";
import { Volume2, VolumeX, Radio, Compass, ShieldAlert, Cpu, Trophy, BookOpen } from "lucide-react";

export default function HUDFrame() {
  const { xp, streak, soundEnabled, toggleSound, currentView, setView, selectSubject, selectChapter } = useEngineStore();
  const [timeStr, setTimeStr] = useState("00:00:00 UTC");

  const navigateToHub = () => {
    selectSubject(null);
    selectChapter(null);
    setView("constellation");
  };

  // Real-time clock synchronizer
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, "0");
      const minutes = String(now.getUTCMinutes()).padStart(2, "0");
      const seconds = String(now.getUTCSeconds()).padStart(2, "0");
      setTimeStr(`${hours}:${minutes}:${seconds} UTC`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full border-b border-white/10 bg-gray-950/60 backdrop-blur-xl relative z-40 select-none">
      {/* Absolute CRT scanner effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none opacity-20" />
      
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left Side: Logo & System Indicator */}
        <div 
          onClick={navigateToHub}
          className="flex items-center gap-3 cursor-pointer group"
          title="Return to Disciplinary Subject Hub"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 group-hover:border-cyan-400 transition-colors">
            <Cpu size={16} className="animate-pulse" />
            <span className="absolute -inset-1 rounded-lg border border-cyan-400/20 animate-ping opacity-30" />
          </div>

          <div className="flex flex-col">
            <span className="font-display font-semibold text-sm tracking-widest text-white flex items-center gap-1.5 uppercase group-hover:text-cyan-300 transition-colors">
              Inside Learning Engine
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </span>
            <span className="font-mono text-[9px] text-cyan-500/70 tracking-widest uppercase">
              MULTI-DISCIPLINE RESEARCH PLATFORM v1.4.0
            </span>
          </div>
        </div>

        {/* Center: System Status Readings */}
        <div className="hidden md:flex items-center gap-8 font-mono text-[10px] text-gray-400">
          <div className="flex items-center gap-1.5">
            <Compass size={12} className="text-cyan-400" />
            <span>GRID: <span className="text-white">45.02.N</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Radio size={12} className="text-emerald-500 animate-pulse" />
            <span>UPLINK: <span className="text-emerald-400 font-bold">SECURE</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400">CHRONO:</span>
            <span className="text-white font-semibold tabular-nums">{timeStr}</span>
          </div>
        </div>

        {/* Right Side: Navigation, Streaks, XP, Sound Toggle */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Constellation Star Map / Subject Hub Link */}
          <button
            onClick={navigateToHub}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              currentView === "constellation" || currentView === "mission-details"
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 glow-cyan"
                : "bg-white/5 border-transparent text-gray-300 hover:bg-white/10"
            }`}
          >
            <Compass size={12} />
            <span className="hidden sm:inline">SUBJECT HUB</span>
          </button>

          {/* Lab Journal Link */}
          <button
            onClick={() => setView("journal")}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono tracking-wider flex items-center gap-1.5 transition-all ${
              currentView === "journal"
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 glow-cyan"
                : "bg-white/5 border-transparent text-gray-300 hover:bg-white/10"
            }`}
          >
            <BookOpen size={12} />
            <span className="hidden sm:inline">LAB NOTEBOOK</span>
          </button>

          {/* Streak Flame Counter */}
          <div className="flex items-center gap-1 bg-orange-950/20 border border-orange-500/20 px-2.5 py-1 rounded-lg">
            <span className="text-xs text-orange-400">🔥</span>
            <span className="font-mono text-xs text-orange-400 font-bold">{streak}d</span>
          </div>

          {/* XP Level Telemetry Box */}
          <div className="hidden sm:flex flex-col font-mono text-[10px]">
            <span className="text-gray-400 uppercase text-right">XP CODES:</span>
            <span className="text-white font-bold text-right text-xs text-cyan-400">{xp} XP</span>
          </div>

          {/* Programmatic Sound Switcher */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 transition-all border border-white/5 text-gray-400 hover:text-white"
            title={soundEnabled ? "Mute Cockpit Sound" : "Unmute Cockpit Sound"}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
}

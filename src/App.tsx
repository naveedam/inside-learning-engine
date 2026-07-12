/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { useEngineStore } from "./core/stores";
import { globalEventBus } from "./core/EventBus";
import { audioEngine } from "./core/audio";
import HUDFrame from "./components/layout/HUDFrame";
import ConstellationMap from "./components/layout/ConstellationMap";
import ChapterMissionExplorer from "./components/layout/ChapterMissionExplorer";
import MissionActiveView from "./components/layout/MissionActiveView";
import LabNotebook from "./components/layout/LabNotebook";

export default function App() {
  const { currentView, soundEnabled } = useEngineStore();

  // 1. Synchronize mute state with Zustand sound setting
  useEffect(() => {
    audioEngine.setMute(!soundEnabled);
  }, [soundEnabled]);

  // 2. Setup Event Bus global subscriptions
  useEffect(() => {
    const unsubscribe = globalEventBus.subscribe("*", (event) => {
      // Direct programmatic synthesized sound cues triggers
      if (event.type === "UI_SOUND_TRIGGER") {
        const cue = event.payload?.cue;
        if (cue === "CLICK") {
          audioEngine.playClick();
        } else if (cue === "SUCCESS") {
          audioEngine.playSuccess();
        } else if (cue === "FAILURE") {
          audioEngine.playFailure();
        } else if (cue === "DIAGNOSTIC") {
          audioEngine.playDiagnostic();
        }
      }

      // Mission progression event tracking
      if (event.type === "MISSION_STARTED") {
        audioEngine.playDiagnostic();
      }
      if (event.type === "SIMULATION_COMPLETED") {
        // Trigger generic telemetry chirp
        audioEngine.playDiagnostic();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // 3. Document top-level event listeners to activate audio contexts on first user tap
  useEffect(() => {
    const wakeUpAudio = () => {
      // Trigger a light tactile click tone to wake up browser Context
      audioEngine.playClick();
      audioEngine.startAmbient();

      // Remove listeners once successfully fired
      window.removeEventListener("mousedown", wakeUpAudio);
      window.removeEventListener("keydown", wakeUpAudio);
      window.removeEventListener("touchstart", wakeUpAudio);
    };

    window.addEventListener("mousedown", wakeUpAudio);
    window.addEventListener("keydown", wakeUpAudio);
    window.addEventListener("touchstart", wakeUpAudio);

    return () => {
      window.removeEventListener("mousedown", wakeUpAudio);
      window.removeEventListener("keydown", wakeUpAudio);
      window.removeEventListener("touchstart", wakeUpAudio);
    };
  }, []);

  // 4. View router mapping
  const renderMainContent = () => {
    switch (currentView) {
      case "constellation":
        return <ConstellationMap />;
      case "mission-details":
        return <ChapterMissionExplorer />;
      case "mission-active":
        return <MissionActiveView />;
      case "journal":
        return <LabNotebook />;
      default:
        return <ConstellationMap />;
    }
  };

  return (
    <div className="min-h-screen bg-cosmic-bg text-gray-100 flex flex-col relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-white">
      {/* Immersive cinematic subtle matrix mesh scanline overlay */}
      <div className="fixed inset-0 bg-gradient-to-tr from-cyan-500/[0.015] via-transparent to-orange-500/[0.015] pointer-events-none z-10" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_3px,6px_100%] opacity-15 pointer-events-none z-10" />

      {/* Main Glass HUD Frame layout wrapper */}
      <HUDFrame />

      {/* Primary experiential viewport frame section */}
      <div className="flex-1 flex flex-col relative z-20">
        {renderMainContent()}
      </div>

      {/* Subtle outer cockpit margin system indicators */}
      <footer className="w-full py-4 border-t border-white/5 bg-gray-950/20 text-center font-mono text-[9px] text-gray-500 tracking-wider">
        <span>© INSIDE LEARNING SYSTEMS CO. • MARS THARSIS RECOVERY OPERATIONS • ALL INTEGRATION ACTIVE</span>
      </footer>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { useEngineStore, useSimulationStore } from "../../core/stores";
import { getCurriculumPackById } from "../../content/registry";
import ProjectileSim from "../simulations/ProjectileSim";
import { MessageSquare, RefreshCw, Send, ChevronLeft, Award, HelpCircle, ShieldAlert, CheckCircle, HelpCircle as HelpIcon } from "lucide-react";
import { globalEventBus } from "../../core/EventBus";

export default function MissionActiveView() {
  const {
    activeMissionId,
    setView,
    awardXP,
    completeMission,
    completedMissions,
    cognitiveLoopState,
    predictionFlagX,
    setPredictionFlagX,
    commitPrediction,
    commitExperimentResult,
    submitReflection,
    investigations,
    activeMisconceptions,
    misconceptionDemoMode,
    triggerMisconceptionDemo,
    addMisconception,
    removeMisconception
  } = useEngineStore();

  const { isPlaying, setPlaying } = useSimulationStore();

  // Load mission from registry
  const pack = getCurriculumPackById("physics-class-11");
  const mission = pack?.chapters[0]?.missions.find((m) => m.id === activeMissionId);

  // Flight Ingress Boot Sequence
  const [bootCompleted, setBootCompleted] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);

  // Telemetry Logs database (Empirical Observation logbook list)
  const [launches, setLaunches] = useState<Array<{
    id: number;
    velocity: number;
    angle: number;
    gravity: number;
    peakHeight: number;
    impactX: number;
    status: "SECURED" | "CRASHED" | "UNDERSHOT" | "OVERSHOT";
  }>>([]);

  // Ballistic Launcher controls (Martian Gravity = 3.72 m/s²)
  const [velocity, setVelocity] = useState(55); // Pre-align with a reasonable closer starting value
  const [angle, setAngle] = useState(45);
  const [gravity, setGravity] = useState(3.72);

  // Cognitive local states
  const [cargoMass, setCargoMass] = useState(100); // 100 = Wood, 500 = Iron, 10 = Lithium Battery
  const [rationaleText, setRationaleText] = useState("");
  const [reflectionText, setReflectionText] = useState("");
  const [selectedPresetRationale, setSelectedPresetRationale] = useState<string>("");

  // Socratic AI Guide state
  const [selectedMentor, setSelectedMentor] = useState("GALILEO");
  const [aiInput, setAiInput] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ sender: "USER" | "MENTOR"; text: string }>>([
    {
      sender: "MENTOR",
      text: "Greetings, cadet. I am Galileo Galilei. How can I guide you to trace the perfect arc of our supply canister through the thin Martian sky?"
    }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Mission Landing / Impact Debrief overlay states
  const [debriefState, setDebriefState] = useState<{
    show: boolean;
    success: boolean;
    impactX: number;
    message: string;
  }>({
    show: false,
    success: false,
    impactX: 0,
    message: ""
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll chat log to bottom on updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, isAiThinking]);

  // Mentor profile switcher info
  const mentorsInfo: Record<string, { name: string; title: string; emoji: string; intro: string }> = {
    GALILEO: {
      name: "Galileo Galilei",
      title: "Observational Astronomer",
      emoji: "🔭",
      intro: "Welcome, traveler. Let us ponder how a horizontal glide and a vertical fall create a beautiful curve of nature."
    },
    NEWTON: {
      name: "Sir Isaac Newton",
      title: "Mathematical Physicist",
      emoji: "🍎",
      intro: "Identify the impressed forces, student. Speak of gravity as a constant pull and let us compute the proportions."
    },
    FEYNMAN: {
      name: "Dr. Richard Feynman",
      title: "Quantum Educator",
      emoji: "🥁",
      intro: "Hey! Let's ignore dry calculations for a second and visualize what's actually happening at the top of that flight!"
    }
  };

  const handleMentorChange = (id: string) => {
    setSelectedMentor(id);
    const info = mentorsInfo[id] || mentorsInfo.GALILEO;
    setChatLog([
      {
        sender: "MENTOR",
        text: info.intro
      }
    ]);
  };

  // Submit secure Socratic prompt to server proxy endpoint
  const handleAskMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || isAiThinking) return;

    const userMsg = aiInput.trim();
    setAiInput("");
    setChatLog((prev) => [...prev, { sender: "USER", text: userMsg }]);
    setIsAiThinking(true);

    try {
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMsg,
          mentorId: selectedMentor,
          simulationState: {
            x: 0,
            y: 0,
            velocity,
            angle,
            gravity
          }
        })
      });

      const data = await response.json();
      if (response.ok) {
        setChatLog((prev) => [...prev, { sender: "MENTOR", text: data.response }]);
        globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "CLICK" } });
      } else {
        setChatLog((prev) => [
          ...prev,
          { sender: "MENTOR", text: "Uplink disrupted. Let us reconsider the trajectory." }
        ]);
      }
    } catch (err) {
      console.error(err);
      setChatLog((prev) => [
        ...prev,
        { sender: "MENTOR", text: "Minor telemetry drift. Check your internet coordinates and ask me again." }
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handlePresetClick = async (text: string) => {
    if (isAiThinking) return;
    setChatLog((prev) => [...prev, { sender: "USER", text }]);
    setIsAiThinking(true);

    try {
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          mentorId: selectedMentor,
          simulationState: {
            x: 0,
            y: 0,
            velocity,
            angle,
            gravity
          }
        })
      });

      const data = await response.json();
      if (response.ok) {
        setChatLog((prev) => [...prev, { sender: "MENTOR", text: data.response }]);
        globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "CLICK" } });
      } else {
        setChatLog((prev) => [
          ...prev,
          { sender: "MENTOR", text: "Uplink disrupted. Let us reconsider the trajectory." }
        ]);
      }
    } catch (err) {
      console.error(err);
      setChatLog((prev) => [
        ...prev,
        { sender: "MENTOR", text: "Minor telemetry drift. Check your internet coordinates and ask me again." }
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Boot loading timer interval
  useEffect(() => {
    if (bootCompleted) return;
    const interval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [bootCompleted]);

  // Handle Projectile Impact Complete
  const handleSimulationComplete = (success: boolean, finalRange: number) => {
    setPlaying("PAUSED");
    const roundedRange = Math.round(finalRange);

    const angleRad = (angle * Math.PI) / 180;
    const peakHeight = Math.round((velocity * Math.sin(angleRad)) ** 2 / (2 * gravity));

    let status: "SECURED" | "CRASHED" | "UNDERSHOT" | "OVERSHOT" = "SECURED";
    let message = "";
    if (success) {
      status = "SECURED";
      message = `TARGET LOCKED & CARGO SECURED! The supply canister landed safely inside the recovery coordinate zone at ${roundedRange}m. The crew is fully resupplied. Excellent calculation.`;
    } else {
      if (roundedRange >= 340 && roundedRange <= 460) {
        status = "CRASHED";
        message = `CRITICAL DEBRIS IMPACT! Supply crate struck the Tharsis Ridge mountain peak at ${roundedRange}m coordinates. Altitude failed to clear the 140-meter mountain peak limit. Crate disintegrated.`;
      } else if (roundedRange < 780) {
        status = "UNDERSHOT";
        message = `DISTANT MISCALIBRATION. Canister landed far too short at ${roundedRange}m. Supplies dropped in deep cryogenic dunes. Out of life-support recovery bounds.`;
      } else {
        status = "OVERSHOT";
        message = `BALLISTIC OVERFLOW. Canister overshot target zone, impacting at ${roundedRange}m. supplies crashed into the Tharsis canyon. Recovery impossible.`;
      }
    }

    setLaunches((prev) => [
      {
        id: prev.length + 1,
        velocity,
        angle,
        gravity,
        peakHeight,
        impactX: roundedRange,
        status
      },
      ...prev
    ]);

    // Commit to Cognitive State Engine
    commitExperimentResult({
      impactX: roundedRange,
      peakHeight,
      angle,
      gravity,
      mass: cargoMass,
      message,
      status
    }, success);
  };

  const handleDismissDebrief = () => {
    setDebriefState((prev) => ({ ...prev, show: false }));
  };

  if (!bootCompleted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px] p-4 relative">
        <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl border border-cyan-500/20 bg-gray-950/80 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col gap-6 font-mono text-xs select-none">
          {/* Neon grid decorative overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-500/5 blur-3xl pointer-events-none animate-pulse" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              <span className="font-bold tracking-widest text-[10px] uppercase">COGNITIVE COCKPIT CONSOLE DECK v2.4</span>
            </div>
            <span className="text-gray-500 text-[10px]">THARSIS COURIER SYSTEM</span>
          </div>

          {/* Terminal output lines */}
          <div className="flex-1 flex flex-col gap-2.5 bg-black/45 p-4 rounded-xl border border-white/5 min-h-[220px] justify-end">
            {bootProgress >= 5 && (
              <p className="text-cyan-500/70 animate-pulse">📡 INCOMING ENCRYPTED COMM TRANSMISSION... [SOURCE: THARSIS STATION]</p>
            )}
            {bootProgress >= 25 && (
              <p className="text-gray-400">⚡ INITIALIZING COILS & ELECTROMAGNETIC INJECTORS... <span className="text-cyan-400 font-bold">[ONLINE]</span></p>
            )}
            {bootProgress >= 50 && (
              <p className="text-gray-400">🌍 DETECTING GRAVITY FLUX FIELD: Mars Tharsis Basin (<span className="text-emerald-400 font-bold">g = 3.72 m/s²</span>) <span className="text-cyan-400 font-bold">[RESOLVED]</span></p>
            )}
            {bootProgress >= 75 && (
              <p className="text-gray-400">🔭 ESTABLISHING HIGH-FIDELITY SOCRATIC INTERCEPTOR... <span className="text-cyan-400 font-bold">[ACTIVE]</span></p>
            )}
            {bootProgress >= 95 && (
              <p className="text-emerald-400 font-bold animate-pulse">▶ TELEMETRY RECEPTOR INTEGRATED. STANDBY FOR COCKPIT IMMERSION...</p>
            )}
          </div>

          {/* Progress loader */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>ESTABLISHING QUANTUM PATHWAY</span>
              <span className="text-cyan-400 font-bold">{bootProgress}%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-100"
                style={{ width: `${bootProgress}%` }}
              />
            </div>
          </div>

          {/* Engage trigger */}
          <button
            onClick={() => {
              if (bootProgress < 100) return;
              setBootCompleted(true);
              globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "SUCCESS" } });
            }}
            disabled={bootProgress < 100}
            className={`w-full py-3 rounded-2xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              bootProgress === 100
                ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.45)] scale-100 animate-pulse"
                : "bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed scale-98"
            }`}
          >
            ENGAGE FLIGHT CONSOLE
          </button>
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 text-center font-mono text-gray-500">
        Aligning sensors. Mission payload missing...
      </div>
    );
  }

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6 relative select-none">
      {/* Flight Control Back Button */}
      <button
        onClick={() => setView("mission-details")}
        className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-[11px] font-mono text-gray-400 hover:text-white flex items-center gap-1.5 transition-all self-start border border-white/5 active:scale-95 z-10"
      >
        <ChevronLeft size={13} /> ESCAPE TO MISSION DECK
      </button>

      {/* Main Grid: Sandbox Canvas + Left Control HUD + Right AI Companion */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        {/* Left Side (Col 1): Live Mission Parameters, Codename briefs and adjustments */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Brief Card */}
          <div className="p-5 rounded-2xl border border-white/10 bg-gray-950/70 backdrop-blur-xl flex flex-col gap-3">
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-widest">
                ACTIVE MISSION brief
              </span>
              <h3 className="font-display font-bold text-white text-base mt-0.5">{mission.title}</h3>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">{mission.description}</p>

            <div className="flex items-center gap-2 font-mono text-[9px] text-gray-500 border-t border-white/5 pt-3">
              <span>GRAVITY FIELD:</span>
              <span className="text-cyan-400 font-bold">MARTIAN (3.72 m/s²)</span>
            </div>
          </div>

          {/* Calibrator Controller Sliders */}
          <div className="p-5 rounded-2xl border border-white/10 bg-gray-950/70 backdrop-blur-xl flex flex-col gap-4 relative">
            {cognitiveLoopState !== "PREDICT" && (
              <div className="absolute inset-0 bg-gray-950/80 rounded-2xl flex flex-col items-center justify-center p-4 text-center z-20 backdrop-blur-sm">
                <span className="font-mono text-[9px] text-orange-400 font-bold uppercase tracking-widest animate-pulse">🔒 Launcher Controls Locked</span>
                <p className="text-[10px] text-gray-400 mt-1 max-w-[150px]">
                  Calibrations are locked during the experimental and reflection phases.
                </p>
              </div>
            )}
            
            <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-widest border-b border-white/5 pb-2">
              Launcher Calibration
            </span>

            {/* Launch velocity (v0) slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-gray-400">Launch Speed ($v_0$):</span>
                <span className="text-cyan-400 font-bold">{velocity} m/s</span>
              </div>
              <input
                type="range"
                min={30}
                max={150}
                value={velocity}
                disabled={cognitiveLoopState !== "PREDICT"}
                onChange={(e) => setVelocity(parseInt(e.target.value, 10))}
                className="accent-cyan-400 h-1 bg-white/10 rounded-lg cursor-pointer disabled:opacity-40"
              />
              <span className="font-mono text-[8px] text-gray-500 text-right">Range: 30 - 150 m/s</span>
            </div>

            {/* Elevation Angle (theta) slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-gray-400">Launch Angle ($\theta$):</span>
                <span className="text-orange-400 font-bold">{angle}°</span>
              </div>
              <input
                type="range"
                min={10}
                max={85}
                value={angle}
                disabled={cognitiveLoopState !== "PREDICT"}
                onChange={(e) => setAngle(parseInt(e.target.value, 10))}
                className="accent-orange-400 h-1 bg-white/10 rounded-lg cursor-pointer disabled:opacity-40"
              />
              <span className="font-mono text-[8px] text-gray-500 text-right">Range: 10° - 85°</span>
            </div>

            {/* Simulated Martian Gravity slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-gray-400">Martian Gravity ($g$):</span>
                <span className="text-emerald-400 font-bold">{gravity} m/s²</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={9.8}
                step={0.1}
                value={gravity}
                disabled={cognitiveLoopState !== "PREDICT"}
                onChange={(e) => setGravity(parseFloat(e.target.value))}
                className="accent-emerald-400 h-1 bg-white/10 rounded-lg cursor-pointer disabled:opacity-40"
              />
              <span className="font-mono text-[8px] text-gray-500 text-right">Standard Mars: 3.72 m/s²</span>
            </div>
          </div>

          {/* TELEMETRY OBSERVATIONS LOGBOOK (Ledger) */}
          <div className="p-5 rounded-2xl border border-white/10 bg-gray-950/70 backdrop-blur-xl flex flex-col gap-3">
            <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-widest border-b border-white/5 pb-2 flex justify-between items-center">
              <span>Historical Telemetry Log</span>
              <span className="text-[8px] text-gray-500 font-normal">Empirical Records</span>
            </span>

            {launches.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-[10px] font-mono text-gray-500 italic text-center py-6 border border-dashed border-white/5 rounded-xl bg-black/25">
                No telemetry drops logged yet. Launch a canister to log calculations.
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
                <table className="w-full font-mono text-[9px] text-left">
                  <thead>
                    <tr className="text-gray-500 border-b border-white/5 pb-1">
                      <th className="font-normal py-1">DROP</th>
                      <th className="font-normal py-1">VEL (v₀)</th>
                      <th className="font-normal py-1">ANG (θ)</th>
                      <th className="font-normal py-1">APEX (h)</th>
                      <th className="font-normal py-1">RANGE (R)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {launches.map((l) => (
                      <tr key={l.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-1 text-gray-400">#0{l.id}</td>
                        <td className="py-1 text-cyan-400">{l.velocity}m/s</td>
                        <td className="py-1 text-orange-400">{l.angle}°</td>
                        <td className="py-1 text-amber-500">{l.peakHeight}m</td>
                        <td className={`py-1 font-bold ${
                          l.status === "SECURED" 
                            ? "text-emerald-400" 
                            : l.status === "CRASHED"
                            ? "text-red-400"
                            : "text-orange-500"
                        }`}>
                          {l.impactX}m
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Center Canvas Stage (Col 2 & 3): Displays Interactive Physics Sandbox & Replays */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <ProjectileSim
            velocity={velocity}
            angle={angle}
            gravity={gravity}
            isChallengeMode={true}
            targetRange={{ min: 780, max: 820 }}
            onChallengeComplete={handleSimulationComplete}
            onControlsChange={(vel, ang) => {
              if (cognitiveLoopState === "PREDICT") {
                setVelocity(vel);
                setAngle(ang);
              }
            }}
          />

          {/* DYNAMIC COGNITIVE LOOP CONSOLE */}
          <div className="p-5 rounded-2xl border border-white/10 bg-gray-950/75 backdrop-blur-xl flex flex-col gap-4 relative overflow-hidden">
            {/* Ambient indicator lights */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-cyan-500 to-emerald-500" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  cognitiveLoopState === "PREDICT" 
                    ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-pulse" 
                    : cognitiveLoopState === "EXPERIMENT"
                    ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                    : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"
                }`} />
                <span className="font-mono text-[10px] font-bold tracking-widest text-white uppercase">
                  ACTIVE PHASE: {cognitiveLoopState}
                </span>
              </div>
              <span className="font-mono text-[9px] font-medium text-gray-500">COGNITIVE COOP SYSTEM</span>
            </div>

            {/* --- PHASE 1: PREDICT --- */}
            {cognitiveLoopState === "PREDICT" && (
              <div className="flex flex-col gap-3">
                <div className="p-3.5 rounded-xl border border-orange-500/10 bg-orange-500/5 flex flex-col gap-1 text-xs">
                  <span className="font-bold text-orange-400">Step 1: Predict Landing & Write Your Hypothesis</span>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    Adjust launch velocity and elevation angle using the sliders or by dragging the railgun barrel directly. 
                    Then, <strong className="text-orange-400">click/tap the canvas floor</strong> to drop your orange 🚩 Predicted Landing Flag.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] text-orange-400 font-bold uppercase tracking-wider">Select Rationale or Type Hypothesis:</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      { id: "opt1", label: "📦 Lighter Lithium is buoyant, so it travels further", isMisconception: true },
                      { id: "opt2", label: "⛓️ Heavy Iron Safe falls much faster under Mars gravity", isMisconception: true },
                      { id: "opt3", label: "⚖️ Gravity is independent of mass; the arc will be identical", isCorrectDiscovery: true },
                      { id: "opt4", label: "📐 45° splits horizontal & vertical velocities equally for peak distance" }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSelectedPresetRationale(opt.label);
                          setRationaleText(opt.label);
                          if (opt.isMisconception) {
                            addMisconception("MISCONCEPTION_MASS_DEPENDENT_GRAVITY");
                          } else {
                            removeMisconception("MISCONCEPTION_MASS_DEPENDENT_GRAVITY");
                          }
                          globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "CLICK" } });
                        }}
                        className={`p-2.5 rounded-lg border text-[10px] text-left font-sans transition-all flex items-start gap-2 ${
                          selectedPresetRationale === opt.label
                            ? "bg-orange-500/10 border-orange-500 text-orange-200 shadow-sm"
                            : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        <span className="mt-0.5">{selectedPresetRationale === opt.label ? "🟢" : "⚫"}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={rationaleText}
                    onChange={(e) => setRationaleText(e.target.value)}
                    placeholder="Describe your physical intuition..."
                    className="mt-2 w-full px-3 py-2 text-xs text-white bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:border-orange-500/40"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (predictionFlagX === null) return;
                    commitPrediction(angle, velocity, rationaleText || "No custom rationale entered.");
                    globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "CLICK" } });
                  }}
                  disabled={predictionFlagX === null}
                  className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    predictionFlagX !== null
                      ? "bg-orange-500 hover:bg-orange-400 text-black shadow-[0_0_15px_rgba(249,115,22,0.35)] cursor-pointer"
                      : "bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed"
                  }`}
                >
                  {predictionFlagX === null 
                    ? "🚩 CHOOSE LANDING FLAG ON GROUND TO COMMIT" 
                    : "🔒 LOCK HYPOTHESIS & POWER ELEVATION MAGNETS"}
                </button>
              </div>
            )}

            {/* --- PHASE 2: EXPERIMENT --- */}
            {cognitiveLoopState === "EXPERIMENT" && (
              <div className="flex flex-col gap-3">
                <div className="p-3.5 rounded-xl border border-cyan-500/10 bg-cyan-500/5 flex flex-col gap-1 text-xs">
                  <span className="font-bold text-cyan-400">Step 2: Run the Experiment</span>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    The calibration values are locked! Launch the cargo capsule using the control system below and monitor 
                    the real-time gravity vectors in the telemetry cockpit.
                  </p>
                </div>

                {/* Mass Selector (to trigger misconception demonstrations) */}
                <div className="flex flex-col gap-2 p-3 rounded-lg bg-black/30 border border-white/5">
                  <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-wider">Select Cargo Payload Material:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { mass: 100, label: "📦 Wood Crate (100kg)" },
                      { mass: 500, label: "⛓️ Heavy Safe (500kg)" },
                      { mass: 10, label: "🔋 Lithium Cell (10kg)" }
                    ].map((item) => (
                      <button
                        key={item.mass}
                        type="button"
                        onClick={() => {
                          setCargoMass(item.mass);
                          globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "CLICK" } });
                        }}
                        className={`py-1.5 px-2 rounded text-[10px] text-center font-mono border transition-all cursor-pointer ${
                          cargoMass === item.mass
                            ? "bg-cyan-500/10 border-cyan-500 text-cyan-300"
                            : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/35 border border-white/5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-gray-500 uppercase font-mono">HYPOTHESIS COORDINATE</span>
                    <span className="text-orange-400 font-mono font-bold text-xs">{predictionFlagX} m</span>
                  </div>
                  <div className="flex flex-col gap-0.5 items-end">
                    <span className="text-[10px] text-gray-500 uppercase font-mono">CALIBRATION VARIABLES</span>
                    <span className="text-cyan-400 font-mono font-bold text-xs">{angle}° elevation @ {velocity} m/s</span>
                  </div>
                </div>
              </div>
            )}

            {/* --- PHASE 3: REFLECT --- */}
            {cognitiveLoopState === "REFLECT" && (
              <div className="flex flex-col gap-3">
                {/* Find the current active investigation */}
                {(() => {
                  const currentInv = investigations[investigations.length - 1];
                  if (!currentInv) return null;

                  const hypothesisFlagX = currentInv.prediction?.flagX || 0;
                  const actualLandingX = currentInv.experimentResult?.telemetry?.impactX || 0;
                  const delta = actualLandingX - hypothesisFlagX;
                  const impactMessage = currentInv.experimentResult?.telemetry?.message || "";
                  const loopSuccess = currentInv.experimentResult?.isSuccess || false;

                  return (
                    <>
                      <div className="p-3.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 flex flex-col gap-1 text-xs">
                        <span className="font-bold text-emerald-400">Step 3: Empirical Reflection</span>
                        <p className="text-gray-400 text-[11px] leading-relaxed">
                          Compare the physics outcome with your original prediction. Learning is iterative — look at the curve 
                          and write down your scientific finding to save into your Research Journal.
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2.5 text-center bg-black/40 p-3 rounded-xl border border-white/5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-[8px] text-gray-500 uppercase">HYPOTHESIS</span>
                          <span className="font-mono text-xs text-orange-400 font-bold">{hypothesisFlagX}m</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-[8px] text-gray-500 uppercase">EMPIRICAL RESULT</span>
                          <span className="font-mono text-xs text-emerald-400 font-bold">{actualLandingX}m</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-[8px] text-gray-500 uppercase">DELTA RANGE</span>
                          <span className={`font-mono text-xs font-bold ${delta === 0 ? "text-emerald-400" : "text-yellow-500"}`}>
                            {delta === 0 ? "🎯 PERFECT ALIGNMENT" : `${delta > 0 ? "+" : ""}${delta}m`}
                          </span>
                        </div>
                      </div>

                      {/* Display the outcome details */}
                      <p className="text-[11px] font-mono text-gray-300 leading-relaxed bg-white/5 px-3 py-2.5 rounded-lg border border-white/5">
                        {impactMessage}
                      </p>

                      {/* Misconception trigger: Heavier objects fall faster */}
                      {activeMisconceptions.includes("MISCONCEPTION_MASS_DEPENDENT_GRAVITY") && (
                        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-xs flex flex-col gap-1.5">
                          <span className="font-bold flex items-center gap-1.5">
                            ⚠️ DIVERGENT PREDICTION DETECTED
                          </span>
                          <p className="text-[11px] leading-relaxed text-yellow-200/80">
                            Your hypothesis assumed that mass changes gravity's rate. However, the simulation proved that the Wood 
                            crate and the Iron Safe land at the exact same spot under Mars gravity.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              triggerMisconceptionDemo(true);
                              globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "CLICK" } });
                            }}
                            className="self-start mt-1 py-1 px-2.5 rounded bg-yellow-500 text-black text-[10px] font-mono font-bold hover:bg-yellow-400 transition-all active:scale-95 cursor-pointer"
                          >
                            🔬 RUN CO-OBSERVATION TEST (SIMULTANEOUS DUAL LAUNCH)
                          </button>
                        </div>
                      )}

                      {/* Demo Mode active feedback */}
                      {misconceptionDemoMode && (
                        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs">
                          <span className="font-bold flex items-center gap-1.5">🔄 CO-OBSERVATION ACTIVE</span>
                          <p className="text-[11px] leading-relaxed mt-1 text-cyan-200/80">
                            A comparative test has overlayed both physical pathways on the canvas stage. Notice that they trace 
                            the exact same curve, independent of mass!
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Select or Type Reflection Log:</label>
                        <div className="flex flex-col gap-1.5">
                          {[
                            "We found out that gravity exerts equal acceleration regardless of the cargo's mass.",
                            "The low gravity of Mars means we need less angle to clear the Tharsis basalt peak.",
                            "Splitting the vectors proved that horizontal speed stays perfectly constant during flight."
                          ].map((refPrompt, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setReflectionText(refPrompt);
                                globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "CLICK" } });
                              }}
                              className={`p-2 rounded-lg border text-[10px] text-left transition-all cursor-pointer ${
                                reflectionText === refPrompt
                                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-200"
                                  : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10"
                              }`}
                            >
                              📝 {refPrompt}
                            </button>
                          ))}
                        </div>

                        <textarea
                          rows={2}
                          value={reflectionText}
                          onChange={(e) => setReflectionText(e.target.value)}
                          placeholder="What did this experiment teach you? Summarize what you observed..."
                          className="mt-1.5 w-full px-3 py-2 text-xs text-white bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-500/40"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!reflectionText.trim()) return;
                          submitReflection(reflectionText, reflectionText);
                          setReflectionText("");
                          setRationaleText("");
                          setSelectedPresetRationale("");
                          setPredictionFlagX(null);
                          // Stop demo mode if running
                          triggerMisconceptionDemo(false);
                          
                          // Award XP and complete mission if success was met
                          if (loopSuccess) {
                            awardXP(100); // 100 extra cognitive XP!
                            completeMission(activeMissionId);
                          }
                          globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "SUCCESS" } });
                        }}
                        disabled={!reflectionText.trim()}
                        className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                          reflectionText.trim()
                            ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.35)] cursor-pointer"
                            : "bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed"
                        }`}
                      >
                        💾 COMMIT SCIENTIFIC FINDING & RELOAD AMMUNITION (+100 XP)
                      </button>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Right Side (Col 4): Socratic AI Mentor Station */}
        <div className="lg:col-span-1 flex flex-col h-[480px] lg:h-auto rounded-2xl border border-white/10 bg-gray-950/70 backdrop-blur-xl overflow-hidden shadow-lg">
          {/* AI Station Header with dropdown switcher */}
          <div className="p-4 border-b border-white/10 bg-gray-950 flex flex-col gap-2">
            <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-widest">
              SOCRATIC AI COMPANION
            </span>

            <div className="flex items-center gap-2">
              <select
                value={selectedMentor}
                onChange={(e) => handleMentorChange(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-cyan-500/30 cursor-pointer w-full"
              >
                <option value="GALILEO">Galileo Galilei (🔭)</option>
                <option value="NEWTON">Sir Isaac Newton (🍎)</option>
                <option value="FEYNMAN">Dr. Richard Feynman (🥁)</option>
              </select>
            </div>
          </div>

          {/* Interactive Chat bubble screen area */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 min-h-0">
            {chatLog.map((chat, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs flex flex-col gap-1 ${
                  chat.sender === "USER"
                    ? "self-end bg-cyan-600/20 text-cyan-100 rounded-br-none border border-cyan-500/10"
                    : "self-start bg-white/5 text-gray-200 rounded-bl-none border border-white/5"
                }`}
              >
                {/* Avatar tag */}
                <span className="font-mono text-[8px] text-gray-400 font-bold tracking-wider">
                  {chat.sender === "USER" ? "Astronaut Cadet" : mentorsInfo[selectedMentor]?.name}
                </span>
                <p className="leading-relaxed whitespace-pre-wrap">{chat.text}</p>
              </div>
            ))}

            {isAiThinking && (
              <div className="self-start max-w-[85%] rounded-2xl rounded-bl-none px-4 py-2.5 text-xs bg-white/5 border border-white/5 text-gray-500 font-mono animate-pulse">
                Uplinking telemetry to master mind...
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* SOCRATIC PRESETS DECK */}
          <div className="px-3 py-2 border-t border-white/10 bg-gray-950/60 flex flex-col gap-1.5">
            <span className="font-mono text-[8px] text-cyan-400 font-bold uppercase tracking-wider">GUIDED INQUIRIES:</span>
            <div className="flex flex-col gap-1">
              {[
                { label: "🔭 Ask Galileo about vector deconstruction", text: "How does splitting the trajectory into constant horizontal velocity and accelerated vertical fall help me clear Tharsis Peak?" },
                { label: "🍎 Ask Newton about Mars gravity ratio", text: "Since gravity on Mars is 3.72 m/s², how does this lower gravitational pull alter our projectile apex compared to Earth's 9.8 m/s²?" },
                { label: "🥁 Ask Feynman to visualize the apex speed", text: "At the exact peak of flight (the apex), is the horizontal speed zero? Help me visualize the speed vectors at the top." }
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetClick(p.text)}
                  disabled={isAiThinking}
                  className="w-full text-left font-mono text-[9px] text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/5 border border-white/5 hover:border-cyan-500/20 px-2 py-1 rounded transition-all active:scale-98 truncate cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat input form */}
          <form onSubmit={handleAskMentor} className="p-3 border-t border-white/10 bg-gray-950 flex items-center gap-1.5">
            <input
              type="text"
              className="flex-1 bg-white/5 border border-white/5 hover:border-white/15 focus:border-cyan-500/25 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-0 transition-colors"
              placeholder={`Ask ${mentorsInfo[selectedMentor]?.name}...`}
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={!aiInput.trim() || isAiThinking}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* APOLLO 13 / NASA COCKPIT DEBRIEF MODAL INTERFACE */}
      {debriefState.show && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-gray-950 p-6 flex flex-col gap-5 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Ambient indicator glowing backdrop */}
            <div className={`absolute top-0 right-0 w-48 h-48 blur-3xl pointer-events-none ${
              debriefState.success ? "bg-emerald-500/10" : "bg-red-500/10"
            }`} />

            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xl shadow-inner ${
                debriefState.success
                  ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                  : "bg-red-950/20 border-red-500/30 text-red-400"
              }`}>
                {debriefState.success ? <CheckCircle size={24} /> : <ShieldAlert size={24} />}
              </div>

              <div className="flex flex-col">
                <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">Orbital Evaluation</span>
                <h3 className="font-display font-bold text-lg text-white">
                  {debriefState.success ? "Mission Operations: Successful" : "Mission Operations: Aborted"}
                </h3>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed font-mono">
              {debriefState.message}
            </p>

            {/* Readout Telemetry Table */}
            <div className="p-4 rounded-xl border border-white/5 bg-gray-950/80 font-mono text-xs text-gray-400 flex flex-col gap-2">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span>IMPACT COORDINATE:</span>
                <span className="text-white font-bold">{debriefState.impactX} meters</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span>TARGET COMPLIANCE:</span>
                <span className={debriefState.success ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                  {debriefState.success ? "100% IN RANGE" : "OUT OF BOUNDS"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>RECOVERABLE DATA XP:</span>
                <span className="text-cyan-400 font-bold">
                  {debriefState.success ? "+50 INTEL XP" : "0 XP (RETRY ALLOCATED)"}
                </span>
              </div>
            </div>

            {debriefState.success && (
              <div className="flex flex-col gap-3 border border-cyan-500/20 bg-cyan-950/20 rounded-2xl p-4 animate-in fade-in duration-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-400/30 flex items-center justify-center text-lg shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                    🎖️
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[8px] text-cyan-400 font-bold uppercase tracking-wider">Badge Unlocked</span>
                    <span className="font-display font-bold text-[11px] text-white">Tharsis Trajectory Courier (Class XI Module 1)</span>
                  </div>
                </div>

                <div className="border-t border-cyan-500/10 pt-2 flex flex-col gap-1.5">
                  <span className="font-mono text-[8px] text-gray-400 font-bold">REVEALED PATH RELATIONSHIP (PARABOLA):</span>
                  <div className="py-2.5 rounded bg-black/60 border border-cyan-500/10 text-center text-cyan-300 font-mono text-[11px] shadow-inner select-text">
                    y = x·tan(θ) - [g·x² / (2·v₀²·cos²(θ))]
                  </div>
                  <p className="font-mono text-[9px] text-gray-400 leading-relaxed">
                    By isolating vertical fall from horizontal momentum, the curve resolves as a perfect conic section. You have successfully derived projectile physics empirically!
                  </p>
                </div>
              </div>
            )}

            {/* Close / Action triggers */}
            <div className="flex gap-3 mt-2">
              {!debriefState.success && (
                <button
                  onClick={() => {
                    handleDismissDebrief();
                    globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "CLICK" } });
                  }}
                  className="flex-1 py-3 rounded-2xl border border-white/10 hover:bg-white/5 font-mono text-xs font-bold text-white transition-all cursor-pointer"
                >
                  RECALIBRATE SENSORS
                </button>
              )}
              <button
                onClick={() => {
                  handleDismissDebrief();
                  setView("mission-details");
                  globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "CLICK" } });
                }}
                className={`flex-1 py-3 rounded-2xl font-mono text-xs font-bold text-black transition-all cursor-pointer ${
                  debriefState.success
                    ? "bg-cyan-500 hover:bg-cyan-400"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {debriefState.success ? "SECURE SECTOR" : "DEPART ORBIT"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

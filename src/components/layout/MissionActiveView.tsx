/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { useEngineStore, useSimulationStore } from "../../core/stores";
import { getAllCurriculumPacks } from "../../content/registry";
import { 
  MessageSquare, RefreshCw, Send, ChevronLeft, Award, HelpCircle, 
  ShieldAlert, CheckCircle, Play, ChevronRight, Compass, Atom, 
  Beaker, BookOpen, Sparkles, LogIn 
} from "lucide-react";
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
    triggerMisconceptionDemo,
    addMisconception,
    removeMisconception,
    activeStepIndex,
    setStepIndex,
    nextStep,
    prevStep,
    unlockBadge,
    unlockedBadges
  } = useEngineStore();

  const { isPlaying, setPlaying } = useSimulationStore();

  // 1. Dynamic Subject Resolution
  const packs = getAllCurriculumPacks();
  const pack = packs.find((p) => p.chapters.some((ch) => ch.missions.some((m) => m.id === activeMissionId))) || packs[0];
  const chapter = pack.chapters.find((ch) => ch.missions.some((m) => m.id === activeMissionId)) || pack.chapters[0];
  const mission = chapter.missions.find((m) => m.id === activeMissionId) || chapter.missions[0];

  // 2. Flight Ingress Boot Sequence
  const [bootCompleted, setBootCompleted] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!bootCompleted) {
      interval = setInterval(() => {
        setBootProgress((prev) => {
          if (prev >= 100) {
            setBootCompleted(true);
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 40);
    }
    return () => clearInterval(interval);
  }, [bootCompleted]);

  // 3. Dynamic Local Simulator Variables
  const [simParameters, setSimParameters] = useState<Record<string, number>>({});
  const [launches, setLaunches] = useState<Array<{
    id: number;
    params: Record<string, number>;
    outcomeValue: number;
    outcomeLabel: string;
    status: "SECURED" | "CRASHED" | "UNDERSHOT" | "OVERSHOT" | "BALANCED" | "OUTRAGED" | "TRAGIC" | "STABLE";
  }>>([]);

  // Initialize default values when mission changes
  useEffect(() => {
    if (mission) {
      const defaults: Record<string, number> = {};
      mission.experimentFlow.parameters.forEach((p) => {
        defaults[p.name] = p.defaultValue;
      });
      setSimParameters(defaults);
      setLaunches([]);
    }
  }, [activeMissionId, mission]);

  // 4. Cognitive Rationale & Reflection local states
  const [rationaleText, setRationaleText] = useState("");
  const [reflectionText, setReflectionText] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");

  const isDualMassActive = activeMisconceptions.includes("MISCONCEPTION_MASS_DEPENDENT_GRAVITY") || 
                           selectedPresetId === "mass-float" || 
                           selectedPresetId === "mass-heavy";

  // 5. Socratic AI Mentor state
  const [selectedMentor, setSelectedMentor] = useState("GALILEO");
  const [aiInput, setAiInput] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ sender: "USER" | "MENTOR"; text: string }>>([]);

  // Initialize mentor details based on active subject
  useEffect(() => {
    if (mission) {
      const initialMentor = mission.socraticMentorDialogue[0];
      if (initialMentor) {
        setSelectedMentor(initialMentor.avatar);
        setChatLog([
          {
            sender: "MENTOR",
            text: initialMentor.introductoryRemark
          }
        ]);
      }
    }
  }, [mission]);

  // Mentor profile switcher info
  const mentorsInfo: Record<string, { name: string; title: string; emoji: string }> = {
    GALILEO: { name: "Galileo Galilei", title: "Observational Astronomer", emoji: "🔭" },
    NEWTON: { name: "Sir Isaac Newton", title: "Mathematical Physicist", emoji: "🍎" },
    FEYNMAN: { name: "Dr. Richard Feynman", title: "Quantum Educator", emoji: "🥁" },
    CURIE: { name: "Marie Curie", title: "Nuclear Chemist", emoji: "🧪" },
    SYSTEM: { name: "Hypatia of Alexandria", title: "System Dynamics Observer", emoji: "🏛️" }
  };

  const handleMentorChange = (avatarId: string) => {
    setSelectedMentor(avatarId);
    const mDial = mission.socraticMentorDialogue.find(m => m.avatar === avatarId) || mission.socraticMentorDialogue[0];
    setChatLog([
      {
        sender: "MENTOR",
        text: mDial ? mDial.introductoryRemark : "Let us investigate the parameters of this system."
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
            subject: mission.subject,
            codename: mission.codename,
            params: simParameters,
            activeMisconceptions,
            cognitiveState: cognitiveLoopState
          }
        })
      });

      const data = await response.json();
      const text = data.text || data.response || "No response recorded from system.";
      setChatLog((prev) => [...prev, { sender: "MENTOR", text }]);
    } catch (err) {
      setChatLog((prev) => [
        ...prev,
        {
          sender: "MENTOR",
          text: "Sensor communication interrupted. Try framing your question using fundamental physical components."
        }
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const [isAiThinking, setIsAiThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, isAiThinking]);

  // Local helper for preset clicks
  const handlePresetClick = (text: string) => {
    setAiInput(text);
  };

  // 6. Mission Challenge Evaluator
  const [debriefState, setDebriefState] = useState<{
    show: boolean;
    success: boolean;
    outcomeValue: number;
    outcomeLabel: string;
    message: string;
  }>({
    show: false,
    success: false,
    outcomeValue: 0,
    outcomeLabel: "",
    message: ""
  });

  // 7. Interactive Physics/Chemistry/History/Lit CANVAS ENGINE
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationFrame, setAnimationFrame] = useState<number>(0);
  const [simProgress, setSimProgress] = useState<number>(-1); // -1 = idle, 0 to 1 = active animating

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Apply soft cinematic dark grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (mission.coreInteraction === "PROJECTILE_AIMING") {
      // Mars valley drawing
      const angle = simParameters["angle"] || 45;
      const velocity = simParameters["velocity"] || 55;
      const gravity = simParameters["gravity"] || 3.72;

      // Draw peak at 400m
      ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
      ctx.beginPath();
      ctx.moveTo(180, height);
      ctx.lineTo(200, height - 120);
      ctx.lineTo(220, height);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(239, 68, 68, 0.5)";
      ctx.stroke();

      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 9px monospace";
      ctx.fillText("VOLCANIC PEAK (140m)", 150, height - 130);

      // Draw landing zone between 780m and 820m
      let zoneX1 = 780 * 0.5;
      let zoneWidth = (820 - 780) * 0.5;
      ctx.fillStyle = "rgba(16, 185, 129, 0.2)";
      ctx.fillRect(zoneX1, height - 12, zoneWidth, 12);
      ctx.strokeStyle = "#10b981";
      ctx.strokeRect(zoneX1, height - 12, zoneWidth, 12);
      ctx.fillStyle = "#10b981";
      ctx.fillText("TARGET ZONE (780-820m)", zoneX1 - 25, height - 20);

      // Launch Pad
      ctx.fillStyle = "#06b6d4";
      ctx.fillRect(10, height - 10, 20, 10);

      // Draw launcher vector lines
      const rad = (angle * Math.PI) / 180;
      const vecX = 20 + Math.cos(rad) * 40;
      const vecY = (height - 10) - Math.sin(rad) * 40;
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(20, height - 10);
      ctx.lineTo(vecX, vecY);
      ctx.stroke();

      // Dual Mass Cognitive HUD Overlay
      if (isDualMassActive) {
        ctx.fillStyle = "rgba(14, 165, 233, 0.08)";
        ctx.fillRect(10, 15, 255, 34);
        ctx.strokeStyle = "rgba(14, 165, 233, 0.25)";
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 15, 255, 34);

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 8px monospace";
        ctx.fillText("⚡ COGNITIVE MONITOR: DUAL-MASS COMPARATIVE LAUNCH", 15, 26);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "7px monospace";
        ctx.fillText("Testing: wood crate (10kg) vs iron safe (500kg)", 15, 38);
      }

      // If animating launch
      if (simProgress >= 0) {
        let totalTime = (2 * velocity * Math.sin(rad)) / gravity;
        let animatedTime = totalTime * simProgress;

        if (isDualMassActive) {
          // Draw trail of Canister A (Iron Safe - Steel Blue, drawn 4px lower for separation)
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "rgba(14, 165, 233, 0.4)";
          ctx.beginPath();
          ctx.moveTo(20, height - 10);
          for (let t = 0; t <= animatedTime; t += 0.05) {
            let cx = 20 + velocity * Math.cos(rad) * t * 0.5;
            let cy = (height - 10) - (velocity * Math.sin(rad) * t - 0.5 * gravity * t * t) * 0.5 + 4;
            ctx.lineTo(cx, cy);
          }
          ctx.stroke();

          // Draw trail of Canister B (Wood Crate - Golden Amber, drawn 4px higher)
          ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
          ctx.beginPath();
          ctx.moveTo(20, height - 10);
          for (let t = 0; t <= animatedTime; t += 0.05) {
            let cx = 20 + velocity * Math.cos(rad) * t * 0.5;
            let cy = (height - 10) - (velocity * Math.sin(rad) * t - 0.5 * gravity * t * t) * 0.5 - 4;
            ctx.lineTo(cx, cy);
          }
          ctx.stroke();

          // Draw active Canister A (Iron Safe - Steel Blue circle)
          let curAX = 20 + velocity * Math.cos(rad) * animatedTime * 0.5;
          let curAY = (height - 10) - (velocity * Math.sin(rad) * animatedTime - 0.5 * gravity * animatedTime * animatedTime) * 0.5 + 4;
          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.arc(curAX, curAY, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.stroke();

          // Draw active Canister B (Wood Crate - Golden circle)
          let curBX = 20 + velocity * Math.cos(rad) * animatedTime * 0.5;
          let curBY = (height - 10) - (velocity * Math.sin(rad) * animatedTime - 0.5 * gravity * animatedTime * animatedTime) * 0.5 - 4;
          ctx.fillStyle = "#f59e0b";
          ctx.beginPath();
          ctx.arc(curBX, curBY, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.stroke();

          // Labels moving with objects
          ctx.fillStyle = "#cbd5e1";
          ctx.font = "bold 7px monospace";
          ctx.fillText("⛓️ SAFE (500kg)", curAX + 8, curAY + 2);
          ctx.fillText("📦 CRATE (10kg)", curBX + 8, curBY + 2);
        } else {
          // STANDARD SINGLE PROJECTILE DRAWING
          ctx.fillStyle = "#f97316";
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "rgba(249, 115, 22, 0.4)";
          ctx.beginPath();
          ctx.moveTo(20, height - 10);

          for (let t = 0; t <= animatedTime; t += 0.05) {
            let cx = 20 + velocity * Math.cos(rad) * t * 0.5;
            let cy = (height - 10) - (velocity * Math.sin(rad) * t - 0.5 * gravity * t * t) * 0.5;
            ctx.lineTo(cx, cy);
          }
          ctx.stroke();

          // Current payload canister drawing
          let curX = 20 + velocity * Math.cos(rad) * animatedTime * 0.5;
          let curY = (height - 10) - (velocity * Math.sin(rad) * animatedTime - 0.5 * gravity * animatedTime * animatedTime) * 0.5;
          ctx.fillStyle = "#ea580c";
          ctx.beginPath();
          ctx.arc(curX, curY, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.stroke();
        }
      }

      // Draw static result of last trial when idle
      if (simProgress === -1 && launches.length > 0) {
        const latestLaunch = launches[0];
        const lAngle = latestLaunch.params["angle"] || 45;
        const lVelocity = latestLaunch.params["velocity"] || 55;
        const lGravity = latestLaunch.params["gravity"] || 3.72;
        const lRad = (lAngle * Math.PI) / 180;

        let totalTime = (2 * lVelocity * Math.sin(lRad)) / lGravity;
        let landX = 20 + lVelocity * Math.cos(lRad) * totalTime * 0.5;
        let landY = (height - 10) - (lVelocity * Math.sin(lRad) * totalTime - 0.5 * lGravity * totalTime * totalTime) * 0.5;

        if (isDualMassActive) {
          // Dual Trails
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);

          ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
          ctx.beginPath();
          ctx.moveTo(20, height - 10);
          for (let t = 0; t <= totalTime; t += 0.05) {
            let cx = 20 + lVelocity * Math.cos(lRad) * t * 0.5;
            let cy = (height - 10) - (lVelocity * Math.sin(lRad) * t - 0.5 * lGravity * t * t) * 0.5 + 4;
            ctx.lineTo(cx, cy);
          }
          ctx.stroke();

          ctx.strokeStyle = "rgba(245, 158, 11, 0.25)";
          ctx.beginPath();
          ctx.moveTo(20, height - 10);
          for (let t = 0; t <= totalTime; t += 0.05) {
            let cx = 20 + lVelocity * Math.cos(lRad) * t * 0.5;
            let cy = (height - 10) - (lVelocity * Math.sin(lRad) * t - 0.5 * lGravity * t * t) * 0.5 - 4;
            ctx.lineTo(cx, cy);
          }
          ctx.stroke();
          ctx.setLineDash([]);

          // Landed Iron Safe
          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.arc(landX, landY + 4, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.stroke();

          // Landed Wood Crate
          ctx.fillStyle = "#f59e0b";
          ctx.beginPath();
          ctx.arc(landX, landY - 4, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.stroke();

          ctx.fillStyle = "#a7f3d0";
          ctx.font = "bold 8px monospace";
          ctx.fillText("🎯 BOTH MASSES LANDED SIMULTANEOUSLY!", landX - 60, landY - 14);
        } else {
          // Standard Single Trail
          ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(20, height - 10);
          for (let t = 0; t <= totalTime; t += 0.05) {
            let cx = 20 + lVelocity * Math.cos(lRad) * t * 0.5;
            let cy = (height - 10) - (lVelocity * Math.sin(lRad) * t - 0.5 * lGravity * t * t) * 0.5;
            ctx.lineTo(cx, cy);
          }
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = latestLaunch.status === "SECURED" ? "#10b981" : "#ef4444";
          ctx.beginPath();
          ctx.arc(landX, landY, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.stroke();
        }
      }
    } else if (mission.coreInteraction === "INERTIA_BOUNDS") {
      const mass = simParameters["mass"] || 200;
      const tAcc = simParameters["forwardDuration"] || 2.0;
      const tGlide = simParameters["glideDuration"] || 4.0;
      const tDec = simParameters["reverseDuration"] || 2.0;

      const a = 1000 / mass;
      const vMax = a * tAcc;

      let t = 0;
      if (simProgress >= 0) {
        t = (tAcc + tGlide + tDec) * simProgress;
      } else if (launches.length > 0) {
        t = tAcc + tGlide + tDec;
      } else {
        t = 0;
      }

      // Compute position and velocity at time t
      let posX = 0;
      let v = 0;
      let activeEngine: "none" | "forward" | "reverse" = "none";

      if (t <= tAcc) {
        v = a * t;
        posX = 0.5 * a * t * t;
        activeEngine = t > 0 ? "forward" : "none";
      } else if (t <= tAcc + tGlide) {
        v = vMax;
        posX = 0.5 * a * tAcc * tAcc + vMax * (t - tAcc);
        activeEngine = "none";
      } else {
        const dt = t - (tAcc + tGlide);
        const maxGlideX = 0.5 * a * tAcc * tAcc + vMax * tGlide;
        v = vMax - a * dt;
        posX = maxGlideX + vMax * dt - 0.5 * a * dt * dt;
        activeEngine = dt < tDec ? "reverse" : "none";
      }

      const surfaceY = height - 40;

      // Draw shiny Europa ice surface
      const groundGrad = ctx.createLinearGradient(0, surfaceY, 0, height);
      groundGrad.addColorStop(0, "rgba(56, 189, 248, 0.15)");
      groundGrad.addColorStop(1, "rgba(15, 23, 42, 0.8)");
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, surfaceY, width, height - surfaceY);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, surfaceY);
      ctx.lineTo(width, surfaceY);
      ctx.stroke();

      // Thermal Shelter (Docking Zone) at 60m
      const zoneX1 = 40 + 58 * 7.0;
      const zoneWidth = 4 * 7.0; // 58 to 62 is 4m
      ctx.fillStyle = "rgba(245, 158, 11, 0.08)";
      ctx.fillRect(zoneX1, surfaceY - 10, zoneWidth, 10);
      ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(zoneX1, surfaceY - 10, zoneWidth, 10);

      // Warm glowing dome representing the Thermal Shelter
      ctx.strokeStyle = "rgba(245, 158, 11, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 2]);
      ctx.beginPath();
      ctx.arc(40 + 60 * 7.0, surfaceY, 35, Math.PI, 0); // half dome
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 8px monospace";
      ctx.fillText("THERMAL SHELTER (60m)", 40 + 60 * 7.0 - 55, surfaceY - 42);

      // Draw Uniform Inertial Beacon Ribbon at fixed 0.5s time intervals
      const maxIntervals = Math.floor(t / 0.5);
      for (let i = 1; i <= maxIntervals; i++) {
        const dropT = i * 0.5;
        let dx = 0;
        if (dropT <= tAcc) {
          dx = 0.5 * a * dropT * dropT;
        } else if (dropT <= tAcc + tGlide) {
          dx = 0.5 * a * tAcc * tAcc + vMax * (dropT - tAcc);
        } else {
          const dt = dropT - (tAcc + tGlide);
          const maxGlideX = 0.5 * a * tAcc * tAcc + vMax * tGlide;
          dx = maxGlideX + vMax * dt - 0.5 * a * dt * dt;
        }
        const bx = 40 + dx * 7.0;

        // Draw glowing emerald beacon diamond
        ctx.fillStyle = "rgba(16, 185, 129, 0.85)";
        ctx.beginPath();
        ctx.moveTo(bx, surfaceY);
        ctx.lineTo(bx - 3, surfaceY - 4);
        ctx.lineTo(bx, surfaceY - 8);
        ctx.lineTo(bx + 3, surfaceY - 4);
        ctx.closePath();
        ctx.fill();

        // Draw vertical beacon line
        ctx.strokeStyle = "rgba(16, 185, 129, 0.2)";
        ctx.setLineDash([1, 2]);
        ctx.beginPath();
        ctx.moveTo(bx, surfaceY - 8);
        ctx.lineTo(bx, surfaceY - 22);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw scale tick marks every 10m on the surface
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.font = "7px monospace";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      for (let m = 0; m <= 80; m += 10) {
        const mx = 40 + m * 7.0;
        ctx.beginPath();
        ctx.moveTo(mx, surfaceY);
        ctx.lineTo(mx, surfaceY + 4);
        ctx.stroke();
        ctx.fillText(`${m}m`, mx - 6, surfaceY + 12);
      }

      // The Rover Arion
      let canvasX = 40 + posX * 7.0;
      if (canvasX < 40) canvasX = 40;
      if (canvasX > width - 20) canvasX = width - 20;

      // Nozzle backplates
      ctx.fillStyle = "#475569";
      ctx.fillRect(canvasX - 18, surfaceY - 19, 3, 8);
      ctx.fillRect(canvasX + 15, surfaceY - 19, 3, 8);

      // Thruster flame if active
      if (activeEngine === "forward") {
        ctx.fillStyle = "#06b6d4";
        ctx.beginPath();
        ctx.moveTo(canvasX - 18, surfaceY - 19);
        ctx.lineTo(canvasX - 32 - Math.random() * 12, surfaceY - 15);
        ctx.lineTo(canvasX - 18, surfaceY - 11);
        ctx.closePath();
        ctx.fill();
      } else if (activeEngine === "reverse") {
        ctx.fillStyle = "#f97316";
        ctx.beginPath();
        ctx.moveTo(canvasX + 18, surfaceY - 19);
        ctx.lineTo(canvasX + 32 + Math.random() * 12, surfaceY - 15);
        ctx.lineTo(canvasX + 18, surfaceY - 11);
        ctx.closePath();
        ctx.fill();
      }

      // Chassis
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(canvasX - 15, surfaceY - 22, 30, 14);

      // Wheels
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.arc(canvasX - 10, surfaceY - 4, 4, 0, Math.PI * 2);
      ctx.arc(canvasX + 10, surfaceY - 4, 4, 0, Math.PI * 2);
      ctx.fill();

      // Main sensor dome
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(canvasX, surfaceY - 22, 6, Math.PI, 0);
      ctx.fill();

      // Emerald Velocity Vector (The Visual Truth)
      if (v !== 0) {
        const arrowLen = v * 5.0;
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvasX, surfaceY - 15);
        ctx.lineTo(canvasX + arrowLen, surfaceY - 15);
        ctx.stroke();

        const dir = v > 0 ? 1 : -1;
        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.moveTo(canvasX + arrowLen, surfaceY - 15);
        ctx.lineTo(canvasX + arrowLen - dir * 5, surfaceY - 18);
        ctx.lineTo(canvasX + arrowLen - dir * 5, surfaceY - 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#10b981";
        ctx.font = "bold 8px monospace";
        ctx.fillText(`v = ${v.toFixed(1)} m/s`, canvasX + (v > 0 ? 5 : -45), surfaceY - 25);
      }

      // HUD overlay
      ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
      ctx.fillRect(10, 15, 240, 56);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 15, 240, 56);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 8px monospace";
      ctx.fillText("📡 EUROPA ARION TELEMETRY LINK", 16, 26);

      ctx.font = "7px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(`NET FORCE : ${activeEngine === "none" ? "0 N (ENGINE DARK)" : activeEngine === "forward" ? "1000 N (FORWARD THRUST)" : "-1000 N (BRAKING THRUST)"}`, 16, 36);
      ctx.fillText(`VELOCITY  : ${v.toFixed(1)} m/s`, 16, 45);
      ctx.fillText(`POSITION  : ${posX.toFixed(1)} m  /  60.0 m TARGET`, 16, 54);
    } else if (mission.coreInteraction === "TITRATION_BALANCE") {
      // Chemistry Titration setup drawing
      const baseMolar = simParameters["baseMolarity"] || 0.1;
      const dripVol = simParameters["dripVolume"] || 30;

      // Beaker drawing
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(180, height - 10);
      ctx.lineTo(180, height - 80);
      ctx.moveTo(180, height - 10);
      ctx.lineTo(260, height - 10);
      ctx.lineTo(260, height - 80);
      ctx.stroke();

      // Resolve beaker fluid color based on pH logic
      // Moles of Acid (50 mL of 0.1 M HCl) = 0.005
      const acidVol = 50;
      const addedL = dripVol / 1000;
      const molesOH = addedL * baseMolar;
      let pH = 1.0;
      if (molesOH < 0.005) {
        const remainingH = 0.005 - molesOH;
        const totalVolL = (acidVol + dripVol) / 1000;
        pH = -Math.log10(remainingH / totalVolL);
      } else if (molesOH === 0.005) {
        pH = 7.0;
      } else {
        const excessOH = molesOH - 0.005;
        const totalVolL = (acidVol + dripVol) / 1000;
        const pOH = -Math.log10(excessOH / totalVolL);
        pH = 14 - pOH;
      }

      // Smooth color transitions
      let fillStyle = "rgba(239, 68, 68, 0.4)"; // Acid Pink
      if (pH >= 6.5 && pH <= 7.5) {
        fillStyle = "rgba(16, 185, 129, 0.5)"; // Neutral Green
      } else if (pH > 7.5) {
        fillStyle = "rgba(59, 130, 246, 0.5)"; // Alkaline Blue
      }

      ctx.fillStyle = fillStyle;
      ctx.fillRect(182, height - 45, 76, 34);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px monospace";
      ctx.fillText(`pH: ${pH.toFixed(2)}`, 195, height - 25);

      // Burette at top
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(220, 10);
      ctx.lineTo(220, height - 120);
      ctx.stroke();

      // Drip nozzle
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(217, height - 120, 6, 10);

      // Droplet animation
      if (simProgress >= 0) {
        let dripY = (height - 110) + (height - 45 - (height - 110)) * (simProgress % 0.2) / 0.2;
        if (dripY < height - 45) {
          ctx.fillStyle = "#60a5fa";
          ctx.beginPath();
          ctx.arc(220, dripY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (mission.coreInteraction === "DECISION_TIMELINE") {
      // History Bastille drawing
      const garrison = simParameters["garrisonSize"] || 100;
      const price = simParameters["breadPrice"] || 15;
      const outrage = (price * garrison) / 1.5;

      // Draw Bastille castle outline
      ctx.fillStyle = "#334155";
      ctx.fillRect(160, height - 130, 180, 120);

      // Towers
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(140, height - 140, 40, 130);
      ctx.fillRect(320, height - 140, 40, 130);

      // Gate
      ctx.fillStyle = outrage > 1000 ? "rgba(220, 38, 38, 0.15)" : "#0f172a";
      ctx.fillRect(220, height - 50, 60, 50);
      ctx.strokeStyle = outrage > 1000 ? "#ef4444" : "#475569";
      ctx.lineWidth = 2;
      ctx.strokeRect(220, height - 50, 60, 50);

      // Crowd
      ctx.fillStyle = "#f97316";
      let numPeople = Math.min(30, Math.floor(outrage / 40) + 5);
      for (let i = 0; i < numPeople; i++) {
        let px = 20 + (i * 11) % 110;
        let py = height - 10 - (i % 3) * 5;
        // Draw torch
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(px, py - 10, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#f97316";
        ctx.fillRect(px - 1, py - 8, 2, 8);
      }

      // Dynamic warning labels
      ctx.fillStyle = outrage > 1000 ? "#ef4444" : "#e2e8f0";
      ctx.font = "bold 9px monospace";
      ctx.fillText(`OUTRAGE: ${Math.min(100, outrage / 15).toFixed(0)}%`, 30, 30);

      if (simProgress >= 0) {
        // Draw flying torches
        let startX = 60;
        let startY = height - 15;
        let endX = 220;
        let endY = height - 60;
        let curX = startX + (endX - startX) * simProgress;
        let curY = startY + (endY - startY) * simProgress - Math.sin(simProgress * Math.PI) * 40;

        ctx.fillStyle = "#f97316";
        ctx.beginPath();
        ctx.arc(curX, curY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (mission.coreInteraction === "THEMATIC_ANALYSIS") {
      // Literature Frankenstein Gothic lab
      const ambition = simParameters["ambitionLevel"] || 80;
      const resp = simParameters["responsibilityLevel"] || 20;
      const tragedy = (ambition * 100) / (resp + 1);

      // Draw lab gothic window
      ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 20, 100, 120);
      ctx.beginPath();
      ctx.arc(100, 20, 50, 0, Math.PI, true);
      ctx.stroke();

      // Slab with a laying humanoid outline
      ctx.fillStyle = "#334155";
      ctx.fillRect(180, height - 40, 140, 12);
      ctx.fillStyle = "rgba(168, 85, 247, 0.2)";
      ctx.fillRect(190, height - 55, 120, 15);

      // Galvanic spark wires
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100, 140);
      ctx.lineTo(190, height - 50);
      ctx.stroke();

      // Render lightning strike on active animation
      if (simProgress >= 0) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.shadowColor = "#a855f7";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(100, 20);
        ctx.lineTo(110, 60);
        ctx.lineTo(90, 100);
        ctx.lineTo(200, height - 50);
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      }

      ctx.fillStyle = tragedy > 2000 ? "#c084fc" : "#94a3b8";
      ctx.font = "bold 9px monospace";
      ctx.fillText(`TRAGIC INDEX: ${Math.min(100, tragedy / 30).toFixed(0)}%`, 30, 30);
    }
  }, [simParameters, simProgress, animationFrame, activeMissionId, mission, selectedPresetId, activeMisconceptions, launches]);

  // 8. Trigger Simulation & Experiment Logic
  const runSimulation = () => {
    if (simProgress >= 0) return; // already running
    setSimProgress(0);
    globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "HUM" } });

    let p = 0;
    const interval = setInterval(() => {
      p += 0.02;
      setSimProgress(p);
      setAnimationFrame(Date.now());

      if (p >= 1.0) {
        clearInterval(interval);
        setSimProgress(-1);
        evaluateExperimentOutcome();
      }
    }, 40);
  };

  const evaluateExperimentOutcome = () => {
    // Collect factors based on active simulator
    let isSuccess = false;
    let val = 0;
    let label = "";
    let status: "SECURED" | "CRASHED" | "UNDERSHOT" | "OVERSHOT" | "BALANCED" | "OUTRAGED" | "TRAGIC" | "STABLE" = "BALANCED";

    if (mission.coreInteraction === "PROJECTILE_AIMING") {
      const angle = simParameters["angle"] || 45;
      const velocity = simParameters["velocity"] || 55;
      const gravity = simParameters["gravity"] || 3.72;
      const rad = (angle * Math.PI) / 180;

      // Projectile Range = (v_0^2 * sin(2*theta)) / g
      let range = (velocity * velocity * Math.sin(2 * rad)) / gravity;
      val = Math.round(range);
      label = `${val}m Range`;

      // Check peak clearance at x = 400m
      // y(400) = 400 * tan(theta) - (g * 400^2) / (2 * v_0^2 * cos^2(theta))
      let yPeak = 400 * Math.tan(rad) - (gravity * 160000) / (2 * velocity * velocity * Math.cos(rad) * Math.cos(rad));

      if (yPeak < 140) {
        status = "CRASHED";
        isSuccess = false;
        label = "Crashed on Ridge (Apex too low)";
      } else if (val >= 780 && val <= 820) {
        status = "SECURED";
        isSuccess = true;
      } else if (val < 780) {
        status = "UNDERSHOT";
      } else {
        status = "OVERSHOT";
      }

      // Spontaneous Socratic Mentor Feedback based on physical flight outcomes
      setTimeout(() => {
        let mentorText = "";
        if (selectedMentor === "NEWTON") {
          if (status === "CRASHED") {
            mentorText = "The canister failed to clear the volcanic peak. Gravitational acceleration ($g = 3.72\\text{ m/s}^2$) has overcome the vertical speed before it could cross the Tharsis Ridge. We must apply more initial thrust or adjust our launch angle to gain altitude.";
          } else if (status === "UNDERSHOT") {
            mentorText = `The canister landed short at ${val} meters. Horizontal inertia was insufficient to sustain motion across the plains before gravity pulled the mass back to zero height. We must increase the initial velocity ($v_0$) or optimize the launch angle closer to the ideal 45 degrees.`;
          } else if (status === "OVERSHOT") {
            mentorText = `Excessive momentum! The canister overshot the target basin, landing at ${val} meters. The initial velocity was too great, carrying the cargo too far before gravitational pull finished its work. Reduce $v_0$ or increase the angle.`;
          } else if (status === "SECURED") {
            mentorText = "Superb! The canister has cleared the volcanic barrier and settled perfectly in the recovery basin. The math has aligned with physical truth. You have completed the challenge!";
          }
        } else if (selectedMentor === "FEYNMAN") {
          if (status === "CRASHED") {
            mentorText = "Boom! We slammed right into Tharsis Ridge! The peak of our curve was way too low to make it over. Try giving it a vertical kick by raising the angle, or just blast it faster so it climbs higher!";
          } else if (status === "UNDERSHOT") {
            mentorText = `Oops! We landed short at ${val}m. Try dialing up the muzzle velocity to carry it further, or check if your angle is close to 45 degrees for maximum distance! Let's get that cargo to the base!`;
          } else if (status === "OVERSHOT") {
            mentorText = `Wow, that sailed way too far, landing at ${val}m! We overshot into the far craters. Try toning down the velocity a bit, or adjust the angle to pull the range back.`;
          } else if (status === "SECURED") {
            mentorText = "Bullseye! That was a magnificent flight! It sailed right over the peak and landed perfectly in the zone! Check out how the constant horizontal speed and falling vertical speed curved into that beautiful parabola!";
          }
        } else { // Galileo Galilei
          if (status === "CRASHED") {
            mentorText = "Alas! Our supply canister has crashed into the basalt ridge of Tharsis at x = 400m. The vertical motion was exhausted before clearing the 140m summit. Should we intensify our muzzle velocity, or adjust the elevation angle to lift our parabola?";
          } else if (status === "UNDERSHOT") {
            mentorText = `The canister has landed safely, but fell short of the recovery basin at ${val} meters. To extend both horizontal inertia and vertical flight time, we must calibrate the launcher to a higher muzzle speed. What say you, young scholar?`;
          } else if (status === "OVERSHOT") {
            mentorText = `A breathtaking trajectory! Yet we have overshot the recovery basin, sailing past 820m. We must tame this momentum. Should we reduce our initial speed, or alter the launch angle to bring the cargo home?`;
          } else if (status === "SECURED") {
            if (isDualMassActive) {
              mentorText = "A triumph! Did you observe the double flight? Though the iron safe pulled with 50 times the force of the wooden crate, their inertia resisted proportionately, keeping them in lockstep! They landed together, proving that in vacuo, gravity falls equally on all!";
            } else {
              mentorText = "A magnificent parabola! The canister cleared the high volcanic peak and landed precisely in the target basin. You have proven that independent horizontal and vertical motions couple into a perfect mathematical path. Magnificent!";
            }
          }
        }

        if (mentorText) {
          setChatLog((prev) => [...prev, { sender: "MENTOR", text: mentorText }]);
        }
      }, 1000);
    } else if (mission.coreInteraction === "TITRATION_BALANCE") {
      const baseMolar = simParameters["baseMolarity"] || 0.1;
      const dripVol = simParameters["dripVolume"] || 30;
      const molesOH = (dripVol / 1000) * baseMolar;

      // Target pH is exactly 7.0 (equivalence moles is 0.005)
      val = Number(dripVol.toFixed(1));
      label = `added ${val}mL base`;

      if (molesOH >= 0.0048 && molesOH <= 0.0052) {
        status = "BALANCED";
        isSuccess = true;
      } else if (molesOH < 0.0048) {
        status = "UNDERSHOT";
      } else {
        status = "OVERSHOT";
      }
    } else if (mission.coreInteraction === "DECISION_TIMELINE") {
      const garrison = simParameters["garrisonSize"] || 100;
      const price = simParameters["breadPrice"] || 15;
      const outrage = (price * garrison) / 1.5;

      val = Math.round(outrage);
      label = `Outrage Score: ${val}`;

      if (outrage > 1000) {
        status = "OUTRAGED";
        isSuccess = true; // Historical storming triggered!
      } else {
        status = "STABLE";
      }
    } else if (mission.coreInteraction === "THEMATIC_ANALYSIS") {
      const ambition = simParameters["ambitionLevel"] || 80;
      const resp = simParameters["responsibilityLevel"] || 20;
      const tragedy = (ambition * 100) / (resp + 1);

      val = Math.round(tragedy);
      label = `Tragic Warning Index: ${val}`;

      if (tragedy > 3000) {
        status = "TRAGIC";
        isSuccess = true; // Cautionary tale peak successfully analyzed!
      } else {
        status = "STABLE";
      }
    } else if (mission.coreInteraction === "INERTIA_BOUNDS") {
      const mass = simParameters["mass"] || 200;
      const tAcc = simParameters["forwardDuration"] || 2.0;
      const tGlide = simParameters["glideDuration"] || 4.0;
      const tDec = simParameters["reverseDuration"] || 2.0;

      const a = 1000 / mass;
      const vMax = a * tAcc;
      const vFinal = vMax - a * tDec;

      const dAcc = 0.5 * a * tAcc * tAcc;
      const dGlide = vMax * tGlide;
      const dDec = vMax * tDec - 0.5 * a * tDec * tDec;
      const totalDistance = dAcc + dGlide + dDec;

      val = Number(totalDistance.toFixed(1));
      label = `${val}m Position, v_final = ${vFinal.toFixed(1)} m/s`;

      const vFinalZero = Math.abs(vFinal) < 0.01;
      if (vFinalZero && val >= 58 && val <= 62) {
        status = "SECURED";
        isSuccess = true;
      } else if (!vFinalZero) {
        status = "UNDERSHOT";
        isSuccess = false;
        if (vFinal > 0) {
          label = `Never Stopped! Drifting Forward (v_final = ${vFinal.toFixed(1)} m/s)`;
        } else {
          label = `Over-Braked! Drifting Backward (v_final = ${vFinal.toFixed(1)} m/s)`;
        }
      } else {
        isSuccess = false;
        if (val < 58) {
          status = "UNDERSHOT";
          label = `Stopped Short at ${val}m`;
        } else {
          status = "OVERSHOT";
          label = `Overshot Shelter at ${val}m`;
        }
      }

      // Spontaneous mentor reaction for Inertia Bounds
      setTimeout(() => {
        let mentorText = "";
        if (selectedMentor === "NEWTON") {
          if (status === "SECURED") {
            mentorText = "Superb! The forward and reverse impulses ($F \\cdot t$) are exactly equal and opposite, cancelling the rover's momentum perfectly ($p = 0$) at the 60m threshold. Newton's Laws are fully demonstrated!";
          } else if (!vFinalZero) {
            if (vFinal > 0) {
              mentorText = `The rover is drifting forward at ${vFinal.toFixed(1)} m/s because your reverse braking impulse was insufficient to cancel the forward momentum. Net force is zero during the drift, so velocity remains constant!`;
            } else {
              mentorText = `The rover is drifting backward at ${Math.abs(vFinal).toFixed(1)} m/s. Your reverse thruster fired for too long, introducing an excess negative force that created backward momentum.`;
            }
          } else if (val < 58) {
            mentorText = `The rover came to a complete halt, but short of the station at ${val} meters. Its momentum was cancelled perfectly, but you did not let it drift long enough. Increase the Glide Duration ($t_{\\text{glide}}$) to let inertia carry it further.`;
          } else {
            mentorText = `A perfect halt, but you overshot the shelter, landing at ${val} meters. The glide duration was too long, carrying the rover past the target before braking. Reduce the Glide Duration.`;
          }
        } else if (selectedMentor === "FEYNMAN") {
          if (status === "SECURED") {
            mentorText = "Unbelievable! You nailed the landing! It drifted completely friction-free and stopped on a dime! See how the exact same oomph (force * time) forward and backward kills the speed perfectly? Physics in action!";
          } else if (!vFinalZero) {
            mentorText = "Whoops, it's still moving! Remember, since there's no friction to stop it, it'll slide forever at constant speed. You need the exact same braking time as your forward push to bring it to a total standstill!";
          } else {
            mentorText = `Hey! The rover stopped completely at ${val}m, but missed the dome. You got the speeds balanced, but the timing was off! Adjust the Glide Duration slider to shift where it stops!`;
          }
        } else { // Galileo Galilei
          if (status === "SECURED") {
            mentorText = "A wonderful demonstration! On the frictionless plains of Europa, we see nature's true simplicity: uniform lateral motion persists endlessly without decay, until our counter-push arrests it.";
          } else if (!vFinalZero) {
            mentorText = "Fascinating! Notice how the speed does not diminish once the engine shuts off. Without friction, motion has no natural end. To stop it, we must match the original forward impulse precisely.";
          } else {
            mentorText = `The state of rest is achieved, but the position is incorrect. To change the resting coordinates on this frictionless canvas, we must adjust the duration of unpowered inertial drift.`;
          }
        }

        if (mentorText) {
          setChatLog((prev) => [...prev, { sender: "MENTOR", text: mentorText }]);
        }
      }, 1000);
    }

    // Save trial outcome in telemetry list
    const newLaunch = {
      id: launches.length + 1,
      params: { ...simParameters },
      outcomeValue: val,
      outcomeLabel: label,
      status
    };

    setLaunches((prev) => [newLaunch, ...prev]);

    // Track in central Zustand store
    commitExperimentResult({ telemetry: { finalValue: val, status }, isSuccess }, isSuccess);

    // If we are in final challenge step, show debrief modal!
    if (activeStepIndex === 3) {
      let descMessage = "";
      if (isSuccess) {
        descMessage = mission.steps[4]?.content.narrative || "Excellent work operator, parameters hit targets!";
        globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "SUCCESS" } });
      } else {
        descMessage = mission.failureBehaviors.radioTransmissions[Math.floor(Math.random() * mission.failureBehaviors.radioTransmissions.length)] || "Calibrations out of bounce. Recalibrate sensory indicators.";
        globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "FAILURE" } });
      }

      setDebriefState({
        show: true,
        success: isSuccess,
        outcomeValue: val,
        outcomeLabel: label,
        message: descMessage
      });
    }
  };

  const handleDismissDebrief = () => {
    setDebriefState(prev => ({ ...prev, show: false }));
    if (debriefState.success) {
      // Award XP, Unlock badge, move to next step!
      awardXP(mission.rewards.xp);
      completeMission(mission.id);
      
      const badge = mission.successConditions.badgeUnlocked;
      if (badge) {
        unlockBadge(badge.id, badge.name);
      }
      nextStep(mission.steps.length);
    }
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 relative flex flex-col gap-6">
      
      {/* 1. Header Navigation HUD Rail */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <button
          onClick={() => {
            setView("mission-details");
            globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "CLICK" } });
          }}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-mono text-gray-400 hover:text-white border border-white/5 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <ChevronLeft size={12} /> ABORT TO MISSION PROFILE
        </button>

        {/* Mission Step/Lifecycle Segment Progress Indicator */}
        <div className="hidden md:flex items-center gap-1 font-mono text-[9px] text-gray-500">
          {mission.steps.map((st, i) => (
            <React.Fragment key={st.id}>
              {i > 0 && <span className="px-1 text-gray-700">➔</span>}
              <span className={`px-2 py-0.5 rounded ${
                activeStepIndex === i 
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold" 
                  : i < activeStepIndex 
                  ? "text-emerald-400 font-medium" 
                  : "text-gray-600"
              }`}>
                {st.type}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Mission Level indicator */}
        <div className="font-mono text-[9px] text-gray-400 bg-gray-950/60 px-3 py-1.5 border border-white/5 rounded-xl flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>SYS STATE: ACTIVE</span>
        </div>
      </div>

      {/* 2. Interactive Mission Step Routing View */}
      {(() => {
        // --- STEP ROUTING: BRIEFING ---
        if (mission.steps[activeStepIndex]?.type === "BRIEFING") {
          const briefing = mission.steps[activeStepIndex];
          return (
            <div className="flex-1 max-w-3xl mx-auto w-full py-8 flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="p-8 rounded-3xl border border-white/10 bg-gray-950/50 backdrop-blur-xl relative overflow-hidden flex flex-col gap-6">
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/[0.02] blur-3xl" />
                
                <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
                  <span className="font-mono text-[9px] text-cyan-400 font-bold tracking-widest uppercase">
                    {mission.codename} • CRISIS DEPLOYMENT
                  </span>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight leading-none mt-1">
                    {briefing.title}
                  </h2>
                </div>

                <div className="prose prose-invert max-w-none text-gray-300 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {briefing.content.narrative}
                </div>

                {/* Checklist learning target blocks */}
                <div className="p-5 rounded-2xl border border-white/5 bg-black/35 font-mono text-xs text-gray-400 flex flex-col gap-3">
                  <span className="text-white text-[10px] font-bold tracking-wider uppercase">Active Learning Targets:</span>
                  {mission.learningObjectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-cyan-400 font-bold">✔</span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => nextStep(mission.steps.length)}
                  className="w-full mt-2 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                >
                  ESTABLISH COMMUNICATIONS LINK <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        }

        // --- STEP ROUTING: DIALOGUE ---
        if (mission.steps[activeStepIndex]?.type === "DIALOGUE") {
          const dialStep = mission.steps[activeStepIndex];
          return (
            <div className="flex-1 max-w-2xl mx-auto w-full py-8 flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="p-8 rounded-3xl border border-white/10 bg-gray-950/60 backdrop-blur-xl relative flex flex-col gap-6">
                <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
                  <span className="font-mono text-[9px] text-cyan-400 font-bold tracking-widest uppercase">
                    Socratic Uplink Established
                  </span>
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-white mt-1">
                    {dialStep.title}
                  </h2>
                </div>

                <div className="flex flex-col gap-5">
                  {dialStep.content.dialogue?.map((seg, i) => (
                    <div key={i} className="flex gap-4 items-start p-4 rounded-2xl border border-white/5 bg-white/[0.01]">
                      <div className="w-10 h-10 rounded-xl bg-gray-950 border border-white/10 flex items-center justify-center text-lg shrink-0 shadow-inner">
                        {seg.avatar === "GALILEO" ? "🔭" : seg.avatar === "NEWTON" ? "🍎" : seg.avatar === "FEYNMAN" ? "🥁" : seg.avatar === "CURIE" ? "🧪" : "🏛️"}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[9px] text-cyan-400 font-bold">{seg.speaker}</span>
                        <p className="text-gray-300 font-mono text-xs leading-relaxed">{seg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => nextStep(mission.steps.length)}
                  className="w-full mt-4 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                >
                  INITIALIZE PILOT SANDBOX <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        }

        // --- STEP ROUTING: SANDBOX & CHALLENGE COCKPIT VIEW ---
        const isChallenge = mission.steps[activeStepIndex]?.type === "CHALLENGE_EXPERIMENT";
        
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch flex-1 min-h-0">
            
            {/* Left Control Column (Col 1): PREDICT -> EXPERIMENT -> REFLECT Deck */}
            <div className="lg:col-span-1 flex flex-col gap-5">
              
              {/* IF IN SANDBOX: COGNITIVE LOOP PANEL */}
              {!isChallenge ? (
                <div className="p-5 rounded-2xl border border-white/10 bg-gray-950/70 backdrop-blur-xl flex flex-col gap-4">
                  
                  {/* COGNITIVE HEADER */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-widest">
                      Cognitive Loop State
                    </span>
                    <span className={`font-mono text-[8px] font-bold px-2 py-0.5 rounded ${
                      cognitiveLoopState === "PREDICT" 
                        ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" 
                        : cognitiveLoopState === "EXPERIMENT"
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {cognitiveLoopState}
                    </span>
                  </div>

                  {/* COGNITIVE BODY */}
                  {cognitiveLoopState === "PREDICT" && (
                    <div className="flex flex-col gap-3.5 animate-in fade-in duration-200">
                      <p className="font-mono text-xs text-gray-300 leading-relaxed border border-dashed border-white/5 p-3 rounded-xl bg-black/20">
                        {mission.predictionPrompt}
                      </p>

                      <div className="flex flex-col gap-2">
                        {mission.predictionPresets.map((preset) => (
                          <label
                            key={preset.id}
                            className={`flex items-start gap-2.5 p-3 rounded-xl border font-mono text-[11px] leading-snug cursor-pointer transition-all ${
                              selectedPresetId === preset.id
                                ? "bg-cyan-950/20 border-cyan-500/30 text-white"
                                : "bg-white/[0.01] border-white/5 text-gray-400 hover:bg-white/[0.03] hover:text-gray-200"
                            }`}
                          >
                            <input
                              type="radio"
                              name="prediction_preset"
                              value={preset.id}
                              checked={selectedPresetId === preset.id}
                              onChange={() => {
                                setSelectedPresetId(preset.id);
                                if (preset.isMisconception && preset.misconceptionId) {
                                  addMisconception(preset.misconceptionId);
                                } else {
                                  // remove active misconceptions if correct
                                  mission.predictionPresets.forEach(p => {
                                    if (p.misconceptionId) removeMisconception(p.misconceptionId);
                                  });
                                }

                                if (preset.id === "mass-float" || preset.id === "mass-heavy") {
                                  // Spontaneous mentor reaction on predicting mass-dependency
                                  setTimeout(() => {
                                    const text = "Ah, a classic thought, young scholar! You hypothesize that mass alters the rate of fall. Aristotle believed the same! I have calibrated a special comparative dual-mass track on your stage. Let us run the experiment and observe both the 10kg Wood Crate and 500kg Iron Safe fly side-by-side!";
                                    setChatLog((prev) => [...prev, { sender: "MENTOR", text }]);
                                  }, 600);
                                }
                              }}
                              className="mt-0.5 accent-cyan-400"
                            />
                            <span>{preset.label}</span>
                          </label>
                        ))}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="font-mono text-[9px] text-gray-500 font-bold uppercase">Qualitative Rationale:</span>
                        <textarea
                          rows={3}
                          className="w-full bg-white/5 border border-white/5 focus:border-cyan-500/20 rounded-xl p-2.5 text-xs text-white placeholder-gray-600 font-mono focus:outline-none focus:ring-0 resize-none"
                          placeholder="State your physical reasoning..."
                          value={rationaleText}
                          onChange={(e) => setRationaleText(e.target.value)}
                        />
                      </div>

                      <button
                        onClick={() => {
                          if (!selectedPresetId) return;
                          commitPrediction(0, 0, rationaleText);
                          globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "CLICK" } });
                        }}
                        disabled={!selectedPresetId}
                        className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                          selectedPresetId
                            ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-pointer"
                            : "bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed"
                        }`}
                      >
                        COMMIT COGNITIVE PREDICTION (+100 XP)
                      </button>
                    </div>
                  )}

                  {cognitiveLoopState === "EXPERIMENT" && (
                    <div className="flex flex-col gap-3.5 animate-in fade-in duration-200">
                      <div className="p-3.5 rounded-xl border border-dashed border-emerald-500/20 bg-emerald-950/10 font-mono text-[10px] text-emerald-400 leading-normal">
                        <strong>PREDICTION RECORDED.</strong> Calibrate system sliders in the main cockpit, run simulation, and log at least 1 outcome to unlock reflection.
                      </div>

                      {/* Run trial button */}
                      <button
                        onClick={runSimulation}
                        disabled={simProgress >= 0}
                        className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] disabled:opacity-45"
                      >
                        <RefreshCw size={13} className={simProgress >= 0 ? "animate-spin" : ""} />
                        {simProgress >= 0 ? "SIMULATION RUNNING..." : "RUN EXPERIMENT"}
                      </button>

                      {launches.length > 0 && (
                        <div className="flex flex-col gap-2 mt-2">
                          <span className="font-mono text-[9px] text-gray-500 font-bold uppercase">Empirical Data Captured:</span>
                          <button
                            onClick={() => {
                              useEngineStore.getState().setCognitiveLoopState("REFLECT");
                              globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "CLICK" } });
                            }}
                            className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded-xl font-mono text-[11px] font-bold"
                          >
                            PROCEED TO SYSTEM REFLECTION ➔
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {cognitiveLoopState === "REFLECT" && (
                    <div className="flex flex-col gap-3.5 animate-in fade-in duration-200">
                      {isDualMassActive ? (
                        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/15 flex flex-col gap-2 font-mono text-xs text-amber-200">
                          <span className="text-[9px] font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1">
                            <span>💡</span> GALILEO'S PARADOX UNCOVERED
                          </span>
                          <p className="leading-relaxed text-[11px] text-gray-300">
                            You observed the <strong className="text-white">10kg Wood Crate</strong> and <strong className="text-white">500kg Iron Safe</strong> glide side-by-side in perfect lockstep, landing together at the exact same moment!
                          </p>
                          <p className="text-[10px] text-amber-300/80 leading-normal border-t border-white/5 pt-2 mt-1">
                            Why does the 500kg safe, which is pulled down by 50 times more gravitational force, not outrun the 10kg crate? How does inertia play a role? State your findings below:
                          </p>
                        </div>
                      ) : (
                        <p className="font-mono text-xs text-cyan-300 leading-relaxed bg-cyan-950/20 border border-cyan-500/10 p-3 rounded-xl">
                          Analyze your telemetry logs. Explain what you discovered regarding this relationship:
                        </p>
                      )}

                      <div className="flex flex-col gap-1.5">
                        <span className="font-mono text-[9px] text-gray-500 font-bold uppercase">Your Reflection response:</span>
                        <textarea
                          rows={3}
                          className="w-full bg-white/5 border border-white/5 focus:border-cyan-500/20 rounded-xl p-2.5 text-xs text-white placeholder-gray-600 font-mono focus:outline-none focus:ring-0 resize-none"
                          placeholder={isDualMassActive ? "E.g., Force increases with mass, but acceleration is Force/Mass..." : "Synthesize your scientific explanation..."}
                          value={reflectionText}
                          onChange={(e) => setReflectionText(e.target.value)}
                        />
                      </div>

                      <button
                        onClick={() => {
                          if (!reflectionText.trim()) return;
                          submitReflection("", reflectionText);
                          
                          // Formulate and log in notebook
                          useEngineStore.getState().addNotebookEntry(
                            `${mission.subject}: ${mission.title}`,
                            reflectionText,
                            mission.subject
                          );

                          // Unlock Discoveries
                          mission.scientificDiscoveries.forEach((d) => {
                            useEngineStore.getState().unlockDiscovery(d.id);
                          });

                          // Award and Proceed!
                          awardXP(200);
                          globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "SUCCESS" } });
                          
                          // Advance to Socratic formalization step!
                          nextStep(mission.steps.length);
                        }}
                        disabled={!reflectionText.trim()}
                        className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                          reflectionText.trim()
                            ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.35)] cursor-pointer"
                            : "bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed"
                        }`}
                      >
                        COMMIT FORMAL FINDING (+200 XP)
                      </button>
                    </div>
                  )}

                </div>
              ) : (
                /* IF IN CHALLENGE STEP */
                <div className="p-5 rounded-2xl border border-white/10 bg-gray-950/70 backdrop-blur-xl flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <Award size={14} className="text-orange-400" />
                    <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-widest">
                      Active Challenge Target
                    </span>
                  </div>

                  <p className="font-mono text-xs text-gray-300 leading-relaxed border border-dashed border-orange-500/20 p-3 rounded-xl bg-orange-950/10">
                    {mission.steps[3]?.content.challengeQuestion?.questionText}
                  </p>

                  <div className="flex flex-col gap-3 mt-1 font-mono text-[10px] text-gray-400">
                    <span className="text-white font-bold uppercase text-[9px]">TARGET CRITERIA:</span>
                    <div className="flex items-center gap-1.5 bg-black/40 p-2 rounded border border-white/5">
                      <span className="text-cyan-400">⚡</span>
                      <span>Target Value Range: <strong className="text-white">{mission.experimentFlow.targets.min} - {mission.experimentFlow.targets.max} {mission.experimentFlow.targets.unit}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={runSimulation}
                    disabled={simProgress >= 0}
                    className="w-full mt-2 py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(249,115,22,0.2)] disabled:opacity-45"
                  >
                    <Play size={13} fill="currentColor" className={simProgress >= 0 ? "animate-pulse" : ""} />
                    {simProgress >= 0 ? "SIMULATION ACTIVE..." : "LAUNCH DEPLOYMENT"}
                  </button>
                </div>
              )}

              {/* TELEMETRY OBSERVATIONS LEDGER */}
              <div className="p-5 rounded-2xl border border-white/10 bg-gray-950/70 backdrop-blur-xl flex flex-col gap-3">
                <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-widest border-b border-white/5 pb-2 flex justify-between items-center">
                  <span>Historical Telemetry Log</span>
                  <span className="text-[8px] text-gray-500 font-normal">Empirical Records</span>
                </span>

                {launches.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-[10px] font-mono text-gray-500 italic text-center py-6 border border-dashed border-white/5 rounded-xl bg-black/25">
                    No telemetry entries recorded yet. Run simulations to log variables.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                    <table className="w-full font-mono text-[9px] text-left">
                      <thead>
                        <tr className="text-gray-500 border-b border-white/5 pb-1">
                          <th className="font-normal py-1">TRIAL</th>
                          <th className="font-normal py-1">CALIBRATIONS</th>
                          <th className="font-normal py-1">OUTCOME</th>
                        </tr>
                      </thead>
                      <tbody>
                        {launches.map((l) => (
                          <tr key={l.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="py-1 text-gray-400">#0{l.id}</td>
                            <td className="py-1 text-cyan-400 text-[8px] font-medium leading-tight">
                              {Object.entries(l.params).map(([k, v]) => `${k}:${v}`).join(", ")}
                            </td>
                            <td className={`py-1 font-bold ${
                              l.status === "SECURED" || l.status === "BALANCED" || l.status === "OUTRAGED" || l.status === "TRAGIC"
                                ? "text-emerald-400" 
                                : l.status === "CRASHED"
                                ? "text-red-400"
                                : "text-orange-500"
                            }`}>
                              {l.outcomeLabel}
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
              
              {/* Dynamic Simulated Interactive Window Container */}
              <div className="relative w-full aspect-video rounded-3xl border border-white/10 bg-gray-950 overflow-hidden shadow-2xl flex flex-col">
                
                {/* Header indicators */}
                <div className="p-3 border-b border-white/5 bg-gray-950/80 flex items-center justify-between font-mono text-[9px] text-gray-400 z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>COCKPIT RESOLVED: {mission.world.environmentName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>ATMOSPHERE: {mission.world.visualAtmosphere}</span>
                  </div>
                </div>

                {/* HTML5 Canvas Element */}
                <canvas
                  ref={canvasRef}
                  width={520}
                  height={280}
                  className="flex-1 w-full bg-gray-950 relative cursor-crosshair"
                />

                {/* Vector Slider Controls Panel */}
                <div className="p-4 border-t border-white/10 bg-gray-950/80 backdrop-blur-md flex flex-col gap-3 z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {mission.experimentFlow.parameters.map((p) => (
                      <div key={p.name} className="flex flex-col gap-1.5">
                        <div className="flex justify-between font-mono text-[10px]">
                          <span className="text-gray-400">{p.label} ({p.symbol}):</span>
                          <span className="text-cyan-400 font-bold">{simParameters[p.name] || p.defaultValue} {p.unit}</span>
                        </div>
                        <input
                          type="range"
                          min={p.min}
                          max={p.max}
                          step={p.step}
                          value={simParameters[p.name] || p.defaultValue}
                          disabled={!isChallenge && cognitiveLoopState !== "EXPERIMENT"}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setSimParameters((prev) => ({ ...prev, [p.name]: val }));
                          }}
                          className="accent-cyan-400 h-1 bg-white/10 rounded-lg cursor-pointer disabled:opacity-40"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DYNAMIC FORMULA STAT STATION */}
              <div className="p-4 rounded-2xl border border-white/5 bg-gray-950/30 font-mono text-xs flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-cyan-500 to-purple-500" />
                <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest">Scientific Insight Formula Relationship</span>
                <div className="p-3 rounded bg-black/60 border border-white/5 text-center text-cyan-300 font-mono text-xs sm:text-sm shadow-inner">
                  {mission.coreScientificConcept.equationLatex || "y = f(x)"}
                </div>
                <p className="text-[10px] text-gray-500 leading-normal">
                  {mission.coreScientificConcept.description}
                </p>
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
                    {mission.socraticMentorDialogue.map((m) => (
                      <option key={m.avatar} value={m.avatar}>
                        {m.character} ({mentorsInfo[m.avatar]?.emoji || "🎓"})
                      </option>
                    ))}
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
                    <span className="font-mono text-[8px] text-gray-400 font-bold tracking-wider">
                      {chat.sender === "USER" ? "Astronaut Cadet" : mentorsInfo[selectedMentor]?.name}
                    </span>
                    <p className="leading-relaxed whitespace-pre-wrap">{chat.text}</p>
                  </div>
                ))}

                {isAiThinking && (
                  <div className="self-start max-w-[85%] rounded-2xl rounded-bl-none px-4 py-2.5 text-xs bg-white/5 border border-white/5 text-gray-500 font-mono animate-pulse">
                    Uplinking telemetry to Socratic guide...
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* SOCRATIC PRESETS DECK */}
              {mission.guidedInquiries && mission.guidedInquiries.length > 0 && (
                <div className="px-3 py-2 border-t border-white/10 bg-gray-950/60 flex flex-col gap-1.5">
                  <span className="font-mono text-[8px] text-cyan-400 font-bold uppercase tracking-wider">GUIDED INQUIRIES:</span>
                  <div className="flex flex-col gap-1">
                    {mission.guidedInquiries.map((p, idx) => (
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
              )}

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
        );
      })()}

      {/* --- STEP ROUTING: DEBRIEF (CONGRATULATIONS & REWARD PACK) --- */}
      {mission.steps[activeStepIndex]?.type === "DEBRIEF" && (
        <div className="flex-1 max-w-2xl mx-auto w-full py-8 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="p-8 rounded-3xl border border-white/10 bg-gray-950/70 backdrop-blur-xl relative flex flex-col gap-6 text-center items-center">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 animate-pulse" />

            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(34,211,238,0.25)]">
              🎖️
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-widest">
                MISSION DEBRIEF SECURED
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                {mission.steps[activeStepIndex].title}
              </h2>
            </div>

            <div className="prose prose-invert max-w-none text-gray-300 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap border-y border-white/5 py-4">
              {mission.steps[activeStepIndex].content.narrative}
            </div>

            {/* Rewards Card */}
            <div className="p-5 rounded-2xl border border-white/5 bg-black/40 font-mono text-xs text-gray-400 flex flex-col gap-2 w-full max-w-md">
              <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                <span>STABILITY RECOVERED:</span>
                <span className="text-emerald-400 font-bold">100% IN COMPLIANCE</span>
              </div>
              <div className="flex justify-between items-center">
                <span>DURABLE INTEL RECOVERED:</span>
                <span className="text-cyan-400 font-bold">+{mission.rewards.xp} XP</span>
              </div>
            </div>

            <button
              onClick={() => {
                setView("constellation");
                globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "SUCCESS" } });
              }}
              className="w-full mt-2 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            >
              CONCLUDE DEPLOYMENT & ALIGN NEXT TARGETS
            </button>
          </div>
        </div>
      )}

      {/* --- PREVIEW OUT-OF-BOUNDS CALIBRATION OVERLAY DIALOG --- */}
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
                <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">Active Evaluation</span>
                <h3 className="font-display font-bold text-lg text-white">
                  {debriefState.success ? "Evaluation Result: Successful" : "Evaluation Result: Aborted"}
                </h3>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed font-mono">
              {debriefState.message}
            </p>

            {/* Readout Telemetry Table */}
            <div className="p-4 rounded-xl border border-white/5 bg-gray-950/80 font-mono text-xs text-gray-400 flex flex-col gap-2">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span>OUTCOME VARIABLE VALUE:</span>
                <span className="text-white font-bold">{debriefState.outcomeValue} ({debriefState.outcomeLabel})</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span>TARGET SPECIFICATION:</span>
                <span className="text-white font-bold">{mission.experimentFlow.targets.min} - {mission.experimentFlow.targets.max} {mission.experimentFlow.targets.unit}</span>
              </div>
              <div className="flex justify-between">
                <span>DURABLE INTEL XP RECOVERED:</span>
                <span className="text-cyan-400 font-bold">
                  {debriefState.success ? `+${mission.rewards.xp} XP` : "0 XP (RETRY ALLOCATED)"}
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
                    <span className="font-display font-bold text-[11px] text-white">
                      {mission.successConditions.badgeUnlocked?.name || "Topic Master"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-cyan-500/10 pt-2 flex flex-col gap-1.5">
                  <span className="font-mono text-[8px] text-gray-400 font-bold">REVEALED CONCEPT EQUATION:</span>
                  <div className="py-2.5 rounded bg-black/60 border border-cyan-500/10 text-center text-cyan-300 font-mono text-[11px] shadow-inner select-text">
                    {mission.coreScientificConcept.equationLatex || "E = mc²"}
                  </div>
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

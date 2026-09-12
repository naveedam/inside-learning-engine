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
      setSelectedPresetId("");
      setRationaleText("");
      setReflectionText("");
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
            coreInteraction: mission.coreInteraction,
            parameterSandboxConfig: mission.parameterSandboxConfig,
            params: simParameters,
            activeMisconceptions,
            cognitiveState: cognitiveLoopState,
            predictionPresetId: selectedPresetId
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
    } else if (mission.coreInteraction === "ENERGY_CONSERVATION") {
      // Expedition 03: Mariana Trench Orbital Elevator Spring Buffer (Work-Energy Theorem)
      const h = simParameters["dropHeight"] || 50;
      const m = simParameters["capsuleMass"] || 2000;
      const k = simParameters["springConstant"] || 20000;
      const g = 9.8;

      // Closed-form analytical mechanics for vertical drop into spring
      const xMax = (m * g + Math.sqrt((m * g) * (m * g) + 2 * k * m * g * h)) / k;
      const xEq = (m * g) / k;
      const vImpact = Math.sqrt(2 * g * h);
      const omega = Math.sqrt(k / m);
      const tFall = Math.sqrt((2 * h) / g);
      const tCompress = omega > 0 ? (Math.PI - Math.atan(vImpact / (omega * xEq))) / omega : 1.0;
      const tTotal = tFall + tCompress;

      let t = 0;
      if (simProgress >= 0) {
        t = tTotal * simProgress;
      } else if (launches.length > 0) {
        t = tTotal; // Show final arrested state
      } else {
        t = 0; // Ready at top
      }

      let yFall = 0;
      let x = 0;
      let v = 0;
      let stage: "FREEFALL" | "COMPRESSING" | "ARRESTED" = "FREEFALL";

      if (t <= tFall) {
        yFall = 0.5 * g * t * t;
        v = g * t;
        x = 0;
        stage = "FREEFALL";
      } else {
        const tPrime = t - tFall;
        x = xEq - xEq * Math.cos(omega * tPrime) + (vImpact / omega) * Math.sin(omega * tPrime);
        x = Math.max(0, Math.min(xMax, x));
        const rawV = xEq * omega * Math.sin(omega * tPrime) + vImpact * Math.cos(omega * tPrime);
        v = Math.max(0, rawV);
        yFall = h;
        stage = v <= 0.1 ? "ARRESTED" : "COMPRESSING";
      }

      // Energy accounting (Total = m*g*(h + xMax))
      const eTotal = m * g * (h + xMax);
      const uG = Math.max(0, m * g * (h + xMax - (yFall + x)));
      const kE = 0.5 * m * v * v;
      const uE = 0.5 * k * x * x;

      const pctUg = Math.min(100, Math.max(0, (uG / eTotal) * 100));
      const pctKe = Math.min(100, Math.max(0, (kE / eTotal) * 100));
      const pctUe = Math.min(100, Math.max(0, (uE / eTotal) * 100));

      const currentG = x > 0 ? (k * x) / (m * g) : 0;
      const peakG = (k * xMax) / (m * g);

      // --- CANVAS DRAWING ---
      // Left Shaft: x = 12 to 220, bedrock at y = height - 16
      const shaftL = 16;
      const shaftR = 215;
      const shaftW = shaftR - shaftL;
      const bedrockY = height - 16;
      const springTopRestY = bedrockY - 65; // 65px rest spring length

      // Abyssal trench gradient background inside shaft
      const shaftGrad = ctx.createLinearGradient(shaftL, 10, shaftR, bedrockY);
      shaftGrad.addColorStop(0, "#030c1e");
      shaftGrad.addColorStop(1, "#020712");
      ctx.fillStyle = shaftGrad;
      ctx.fillRect(shaftL, 10, shaftW, bedrockY - 10);

      // Floating bioluminescent abyssal particles
      ctx.fillStyle = "rgba(6, 182, 212, 0.4)";
      for (let i = 0; i < 7; i++) {
        const px = shaftL + 15 + ((i * 37 + (animationFrame % 200) * 0.2) % (shaftW - 30));
        const py = 20 + ((i * 43) % (bedrockY - 50));
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vertical guide rails
      ctx.strokeStyle = "rgba(71, 85, 105, 0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(shaftL + 12, 10);
      ctx.lineTo(shaftL + 12, bedrockY);
      ctx.moveTo(shaftR - 12, 10);
      ctx.lineTo(shaftR - 12, bedrockY);
      ctx.stroke();

      // Depth markers
      ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
      ctx.font = "6px monospace";
      ctx.fillText("-10,950m", shaftL + 16, 25);
      ctx.fillText("-10,975m", shaftL + 16, (bedrockY + 10) / 2);
      ctx.fillText("-11,000m (BEDROCK)", shaftL + 16, bedrockY - 4);

      // Target Safe Buffer Zone (10.0m - 12.0m)
      const targetZoneTop = springTopRestY + (10.0 / 15.0) * 45;
      const targetZoneH = (2.0 / 15.0) * 45;
      ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
      ctx.fillRect(shaftL + 14, targetZoneTop, shaftW - 28, targetZoneH);
      ctx.strokeStyle = "rgba(16, 185, 129, 0.6)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 2]);
      ctx.strokeRect(shaftL + 14, targetZoneTop, shaftW - 28, targetZoneH);
      ctx.setLineDash([]);
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 7px monospace";
      ctx.fillText("TARGET ZONE (10-12m)", shaftL + 24, targetZoneTop + targetZoneH - 2);

      // Equilibrium Line: kx = mg (Peak Speed Marker)
      const eqY = springTopRestY + (xEq / 15.0) * 45;
      if (eqY < bedrockY - 10) {
        ctx.strokeStyle = "rgba(245, 158, 11, 0.7)";
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(shaftL + 14, eqY);
        ctx.lineTo(shaftR - 14, eqY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#f59e0b";
        ctx.font = "6px monospace";
        ctx.fillText("⚖️ EQUILIBRIUM: kx=mg (PEAK SPEED)", shaftL + 24, eqY - 2);
      }

      // Dynamic Spring Coils
      const compressionPx = (x / 15.0) * 45;
      const currentPlateY = springTopRestY + compressionPx;
      const springHeight = bedrockY - currentPlateY;

      // Bedrock plate
      ctx.fillStyle = "#334155";
      ctx.fillRect(shaftL + 15, bedrockY - 4, shaftW - 30, 8);

      // Coils
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const numCoils = 7;
      const coilStep = springHeight / numCoils;
      const coilMidX = (shaftL + shaftR) / 2;
      const coilW = 26;

      ctx.moveTo(coilMidX, bedrockY - 4);
      for (let i = 0; i < numCoils; i++) {
        const segY = bedrockY - 4 - (i + 0.5) * coilStep;
        const sign = i % 2 === 0 ? 1 : -1;
        ctx.lineTo(coilMidX + sign * coilW, segY);
      }
      ctx.lineTo(coilMidX, currentPlateY);
      ctx.stroke();

      // Buffer impact head plate
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(shaftL + 25, currentPlateY - 4, shaftW - 50, 6);
      ctx.strokeStyle = "#e0f2fe";
      ctx.lineWidth = 1;
      ctx.strokeRect(shaftL + 25, currentPlateY - 4, shaftW - 50, 6);

      // Capsule Position:
      // Freefall travels from top (y = 25) to springTopRestY - 20 (capsule height = 24)
      const freefallPx = (yFall / h) * (springTopRestY - 45);
      const capsuleY = t <= tFall ? 25 + freefallPx : currentPlateY - 24;
      const capsuleMidX = (shaftL + shaftR) / 2;

      // Capsule Hull
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(capsuleMidX - 22, capsuleY, 44, 24);
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(capsuleMidX - 22, capsuleY, 44, 24);

      // Viewport window
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(capsuleMidX, capsuleY + 10, 5, 0, Math.PI * 2);
      ctx.fill();

      // Thruster trail / shockwave if falling
      if (v > 0) {
        // Emerald velocity vector arrow pointing downwards
        const arrowLen = Math.min(35, v * 0.8);
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(capsuleMidX, capsuleY + 24);
        ctx.lineTo(capsuleMidX, capsuleY + 24 + arrowLen);
        ctx.stroke();

        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.moveTo(capsuleMidX, capsuleY + 24 + arrowLen);
        ctx.lineTo(capsuleMidX - 4, capsuleY + 24 + arrowLen - 6);
        ctx.lineTo(capsuleMidX + 4, capsuleY + 24 + arrowLen - 6);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#10b981";
        ctx.font = "bold 7px monospace";
        ctx.fillText(`v=${v.toFixed(1)}m/s`, capsuleMidX + 8, capsuleY + 22 + arrowLen);
      }

      // Status text above capsule
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 7px monospace";
      ctx.fillText(`CAPSULE (${m}kg)`, capsuleMidX - 24, capsuleY - 4);

      // --- RIGHT SIDE HUD: LIVE REAL-TIME WORK-ENERGY BARS ---
      const hudX = 230;
      const hudW = width - hudX - 10;
      const hudH = 126;

      ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
      ctx.fillRect(hudX, 10, hudW, hudH);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.strokeRect(hudX, 10, hudW, hudH);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 8px monospace";
      ctx.fillText("⚡ WORK-ENERGY THEOREM (MARIANA SHAFT)", hudX + 8, 22);

      const barX = hudX + 8;
      const barW = hudW - 16;
      const barH = 10;

      // 1. Gravitational Potential Energy Bar
      ctx.fillStyle = "#94a3b8";
      ctx.font = "7px monospace";
      ctx.fillText(`GRAVITATIONAL PE (Ug = mgh): ${pctUg.toFixed(1)}%`, barX, 36);
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(barX, 40, barW, barH);
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(barX, 40, (barW * pctUg) / 100, barH);

      // 2. Kinetic Energy Bar
      ctx.fillStyle = "#94a3b8";
      ctx.font = "7px monospace";
      ctx.fillText(`KINETIC ENERGY (K = ½mv²): ${pctKe.toFixed(1)}%`, barX, 60);
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(barX, 64, barW, barH);
      ctx.fillStyle = "#06b6d4";
      ctx.fillRect(barX, 64, (barW * pctKe) / 100, barH);

      // 3. Elastic Potential Energy Bar
      ctx.fillStyle = "#94a3b8";
      ctx.font = "7px monospace";
      ctx.fillText(`SPRING ELASTIC PE (Ue = ½kx²): ${pctUe.toFixed(1)}%`, barX, 84);
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(barX, 88, barW, barH);
      ctx.fillStyle = "#10b981";
      ctx.fillRect(barX, 88, (barW * pctUe) / 100, barH);

      // 4. Conservation of Total Mechanical Energy
      const totalPct = Math.min(100, pctUg + pctKe + pctUe);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 7px monospace";
      ctx.fillText(`TOTAL MECHANICAL ENERGY: ${totalPct.toFixed(0)}% [CONSERVED]`, barX, 108);
      ctx.fillStyle = "rgba(56, 189, 248, 0.2)";
      ctx.fillRect(barX, 112, barW, 4);
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(barX, 112, (barW * totalPct) / 100, 4);

      // Lower Telemetry Readouts HUD
      const teleY = 144;
      const teleH = height - teleY - 10;
      ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
      ctx.fillRect(hudX, teleY, hudW, teleH);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.strokeRect(hudX, teleY, hudW, teleH);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 8px monospace";
      ctx.fillText("📊 ARREST DYNAMICS TELEMETRY", hudX + 8, teleY + 14);

      ctx.font = "7px monospace";
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText(`STATE       : ${stage}`, hudX + 8, teleY + 28);
      ctx.fillText(`COMPRESSION : x = ${x.toFixed(1)} m  (Max: ${xMax.toFixed(1)} m)`, hudX + 8, teleY + 40);
      ctx.fillText(`EQUILIBRIUM : x_eq = ${xEq.toFixed(1)} m  (kx = mg)`, hudX + 8, teleY + 52);
      ctx.fillText(`DECEL FORCE : ${currentG.toFixed(1)} G  (Peak: ${peakG.toFixed(1)} G)`, hudX + 8, teleY + 64);
      ctx.fillText(`TARGET ZONE : 10.0m - 12.0m [SAFETY THRESHOLD]`, hudX + 8, teleY + 76);
      ctx.fillText(`TOTAL WORK  : W_net = ΔK = 0 J at full stop`, hudX + 8, teleY + 88);
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
    } else if (mission.coreInteraction === "PARAMETER_SANDBOX") {
      // 2D Mathematical Axis Plot Engine
      const cfg = mission.parameterSandboxConfig;
      const primaryKey = cfg?.primaryParamKey || mission.experimentFlow.parameters[0]?.name || "x";
      const primaryParam = mission.experimentFlow.parameters.find((p) => p.name === primaryKey) || mission.experimentFlow.parameters[0];
      const xMin = primaryParam?.min ?? 0;
      const xMax = primaryParam?.max ?? 100;
      const curX = simParameters[primaryKey] ?? primaryParam?.defaultValue ?? 0;

      // Theme-based accent color mapping based on world.visualAtmosphere
      const atmo = (mission.world.visualAtmosphere || "").toLowerCase();
      let accentColor = "#22d3ee"; // default cyan
      let accentRgb = "34, 211, 238";
      if (atmo.includes("amber") || atmo.includes("gold") || atmo.includes("sunset") || atmo.includes("crimson")) {
        accentColor = "#f59e0b";
        accentRgb = "245, 158, 11";
      } else if (atmo.includes("violet") || atmo.includes("indigo") || atmo.includes("gothic") || atmo.includes("purple")) {
        accentColor = "#a855f7";
        accentRgb = "168, 85, 247";
      } else if (atmo.includes("emerald") || atmo.includes("green") || atmo.includes("neon")) {
        accentColor = "#10b981";
        accentRgb = "16, 185, 129";
      } else if (atmo.includes("blue") || atmo.includes("abyssal") || atmo.includes("ocean")) {
        accentColor = "#38bdf8";
        accentRgb = "56, 189, 248";
      }

      // Mathematical formula evaluator for a given x
      const evaluateFormula = (xVal: number): number => {
        if (!cfg) return xVal;
        const { relationshipType, coefficients = {} } = cfg;
        const a = coefficients.a ?? 1;
        const b = coefficients.b ?? 0;
        const c = coefficients.c ?? 0;
        const kCoeff = coefficients.k ?? 1;

        switch (relationshipType) {
          case "LINEAR":
            return a * xVal + b;
          case "QUADRATIC":
            return a * xVal * xVal + b * xVal + c;
          case "INVERSE":
            return xVal !== 0 ? a / (xVal + b) + c : 0;
          case "EXPONENTIAL":
            return a * Math.exp(kCoeff * xVal) + b;
          case "RATE_LIMITED":
            return (a * xVal) / (xVal + (kCoeff || 1));
          default:
            return xVal;
        }
      };

      // Determine graph bounding box with margins
      const padLeft = 70;
      const padRight = 35;
      const padTop = 45;
      const padBottom = 50;
      const plotW = width - padLeft - padRight;
      const plotH = height - padTop - padBottom;

      // Determine y-range (either from cfg or computed from sample points)
      let yMin = cfg?.yRange?.min ?? 0;
      let yMax = cfg?.yRange?.max ?? 100;
      if (!cfg?.yRange) {
        let sampleMin = Infinity;
        let sampleMax = -Infinity;
        const steps = 40;
        for (let i = 0; i <= steps; i++) {
          const sx = xMin + ((xMax - xMin) * i) / steps;
          const sy = evaluateFormula(sx);
          if (sy < sampleMin) sampleMin = sy;
          if (sy > sampleMax) sampleMax = sy;
        }
        yMin = Math.min(0, sampleMin);
        yMax = sampleMax > yMin ? sampleMax * 1.15 : yMin + 10;
      }
      if (yMax <= yMin) yMax = yMin + 1;

      const toPlotX = (xVal: number) => padLeft + ((xVal - xMin) / (xMax - xMin)) * plotW;
      const toPlotY = (yVal: number) => padTop + plotH - ((yVal - yMin) / (yMax - yMin)) * plotH;

      // Draw plot canvas background & inner grid lines
      ctx.fillStyle = "rgba(10, 15, 29, 0.6)";
      ctx.fillRect(padLeft, padTop, plotW, plotH);

      // Target calibration band if configured
      if (cfg?.targetBand) {
        const tbY1 = Math.max(padTop, Math.min(padTop + plotH, toPlotY(cfg.targetBand.max)));
        const tbY2 = Math.max(padTop, Math.min(padTop + plotH, toPlotY(cfg.targetBand.min)));
        const bandTop = Math.min(tbY1, tbY2);
        const bandHeight = Math.abs(tbY2 - tbY1);

        ctx.fillStyle = "rgba(16, 185, 129, 0.08)";
        ctx.fillRect(padLeft, bandTop, plotW, bandHeight);
        ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(padLeft, bandTop);
        ctx.lineTo(padLeft + plotW, bandTop);
        ctx.moveTo(padLeft, bandTop + bandHeight);
        ctx.lineTo(padLeft + plotW, bandTop + bandHeight);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#34d399";
        ctx.font = "bold 8px monospace";
        ctx.fillText(`TARGET ZONE [${cfg.targetBand.min} - ${cfg.targetBand.max} ${cfg.outputUnit}]`, padLeft + 8, bandTop + 11);
      }

      // Grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1;
      const xGridTicks = 5;
      for (let i = 0; i <= xGridTicks; i++) {
        const gx = padLeft + (plotW * i) / xGridTicks;
        const tickVal = xMin + ((xMax - xMin) * i) / xGridTicks;
        ctx.beginPath();
        ctx.moveTo(gx, padTop);
        ctx.lineTo(gx, padTop + plotH);
        ctx.stroke();

        ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${tickVal.toFixed(0)}`, gx, padTop + plotH + 14);
      }

      const yGridTicks = 5;
      for (let i = 0; i <= yGridTicks; i++) {
        const gy = padTop + (plotH * i) / yGridTicks;
        const tickVal = yMax - ((yMax - yMin) * i) / yGridTicks;
        ctx.beginPath();
        ctx.moveTo(padLeft, gy);
        ctx.lineTo(padLeft + plotW, gy);
        ctx.stroke();

        ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
        ctx.font = "8px monospace";
        ctx.textAlign = "right";
        ctx.fillText(`${tickVal.toFixed(1)}`, padLeft - 8, gy + 3);
      }
      ctx.textAlign = "left";

      // 2D Axes lines
      ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padLeft, padTop);
      ctx.lineTo(padLeft, padTop + plotH);
      ctx.lineTo(padLeft + plotW, padTop + plotH);
      ctx.stroke();

      // Axis Labels
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "bold 9px monospace";
      const xLabel = `${primaryParam?.label || primaryKey} (${primaryParam?.unit || ""})`;
      ctx.fillText(xLabel, padLeft + plotW / 2 - 30, padTop + plotH + 30);

      ctx.save();
      ctx.translate(18, padTop + plotH / 2);
      ctx.rotate(-Math.PI / 2);
      const yLabel = `${cfg?.outputLabel || "Output Quantity"} (${cfg?.outputUnit || ""})`;
      ctx.fillText(yLabel, -ctx.measureText(yLabel).width / 2, 0);
      ctx.restore();

      // Render past trial points if present
      launches.forEach((l, idx) => {
        const lx = l.params[primaryKey];
        if (lx !== undefined) {
          const ly = l.outcomeValue;
          const px = toPlotX(lx);
          const py = toPlotY(ly);
          if (px >= padLeft && px <= padLeft + plotW && py >= padTop && py <= padTop + plotH) {
            ctx.fillStyle = l.status === "TARGET_ACHIEVED" ? "rgba(52, 211, 153, 0.7)" : "rgba(148, 163, 184, 0.5)";
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
            ctx.font = "7px monospace";
            ctx.fillText(`T${idx + 1}`, px + 5, py - 3);
          }
        }
      });

      // Render the continuous function curve
      const samples = 120;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i <= samples; i++) {
        const sx = xMin + ((xMax - xMin) * i) / samples;
        const sy = evaluateFormula(sx);
        const px = toPlotX(sx);
        const py = toPlotY(sy);
        const clampedY = Math.max(padTop - 5, Math.min(padTop + plotH + 5, py));
        if (!started) {
          ctx.moveTo(px, clampedY);
          started = true;
        } else {
          ctx.lineTo(px, clampedY);
        }
      }
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = `rgba(${accentRgb}, 0.5)`;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Current operating point on curve
      const curY = evaluateFormula(curX);
      const curPx = toPlotX(curX);
      const curPy = Math.max(padTop, Math.min(padTop + plotH, toPlotY(curY)));

      // Crosshair lines to axes
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = `rgba(${accentRgb}, 0.5)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(curPx, padTop + plotH);
      ctx.lineTo(curPx, curPy);
      ctx.lineTo(padLeft, curPy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Operating point marker with pulse
      const pulse = simProgress >= 0 ? Math.sin(simProgress * Math.PI * 4) * 3 : 0;
      ctx.fillStyle = accentColor;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(curPx, curPy, 5 + Math.max(0, pulse), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(curPx, curPy, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Live readout badge above operating point
      const badgeText = `${curX.toFixed(1)}${primaryParam?.unit || ""} ➔ ${curY.toFixed(2)} ${cfg?.outputUnit || ""}`;
      ctx.font = "bold 9px monospace";
      const textWidth = ctx.measureText(badgeText).width;
      const badgeX = Math.max(padLeft + 5, Math.min(padLeft + plotW - textWidth - 12, curPx - textWidth / 2 - 5));
      const badgeY = Math.max(padTop + 14, curPy - 12);

      ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
      ctx.strokeStyle = `rgba(${accentRgb}, 0.6)`;
      ctx.lineWidth = 1;
      ctx.fillRect(badgeX, badgeY - 10, textWidth + 10, 15);
      ctx.strokeRect(badgeX, badgeY - 10, textWidth + 10, 15);

      ctx.fillStyle = "#ffffff";
      ctx.fillText(badgeText, badgeX + 5, badgeY + 1);

      // Header telemetry bar inside plot
      ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
      ctx.fillRect(padLeft + 8, padTop + 8, 230, 22);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.strokeRect(padLeft + 8, padTop + 8, 230, 22);

      ctx.fillStyle = accentColor;
      ctx.font = "bold 9px monospace";
      const relLabel = cfg?.relationshipType || "PARAMETRIC";
      ctx.fillText(`FUNCTION: ${relLabel}`, padLeft + 14, padTop + 22);
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(`| OUT: ${curY.toFixed(2)} ${cfg?.outputUnit || ""}`, padLeft + 135, padTop + 22);
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
    } else if (mission.coreInteraction === "ENERGY_CONSERVATION") {
      const h = simParameters["dropHeight"] || 50;
      const m = simParameters["capsuleMass"] || 2000;
      const k = simParameters["springConstant"] || 20000;
      const g = 9.8;

      const xMax = (m * g + Math.sqrt((m * g) * (m * g) + 2 * k * m * g * h)) / k;
      const peakG = (k * xMax) / (m * g);
      val = Number(xMax.toFixed(1));
      label = `${val}m Compression (${peakG.toFixed(1)}G Decel)`;

      if (val >= 10.0 && val <= 12.0) {
        status = "SECURED";
        isSuccess = true;
      } else if (val > 12.0) {
        status = "CRASHED";
        isSuccess = false;
        label = `Bottomed Out at ${val}m (Bedrock Breach!)`;
      } else {
        status = "UNDERSHOT";
        isSuccess = false;
        label = `Spring Too Stiff! Stopped at ${val}m (${peakG.toFixed(1)}G)`;
      }

      // Spontaneous mentor response for Energy Depths
      setTimeout(() => {
        let mentorText = "";
        if (selectedMentor === "NEWTON") {
          if (status === "SECURED") {
            mentorText = `Superb calibration! The Work-Energy Theorem is demonstrated with mathematical precision ($mg(h + x) = \\frac{1}{2}kx^2$). The capsule was safely arrested at ${val}m compression, and peak deceleration remained within the safe ${peakG.toFixed(1)}G threshold.`;
          } else if (status === "CRASHED") {
            mentorText = `Disaster in the Mariana shaft! The spring stiffness was too low ($k = ${k}\\text{ N/m}$), allowing the capsule to compress past the 12.0m buffer limit to ${val}m and strike bedrock. We must increase the spring constant to arrest the descent sooner.`;
          } else {
            mentorText = `The spring is excessively rigid! The capsule compressed to only ${val}m, but generated a severe deceleration force of ${peakG.toFixed(1)}G upon impact. We must decrease spring stiffness ($k$) or lower the drop height to protect the passengers.`;
          }
        } else if (selectedMentor === "FEYNMAN") {
          if (status === "SECURED") {
            mentorText = `Bullseye! That was a gorgeous energy transfer! Every single joule of gravitational energy from that ${h}m drop was cleanly soaked up by the spring coils, stopping right in the sweet spot at ${val}m! Look at those energy bars lock into place!`;
          } else if (status === "CRASHED") {
            mentorText = `Ouch! The spring was way too squishy! It compressed all the way down to ${val}m and bottomed out right against the bedrock! Dial up the spring stiffness so the coils push back harder!`;
          } else {
            mentorText = `Whoa, way too stiff! It stopped at ${val}m, but that impact slammed with ${peakG.toFixed(1)} Gs of deceleration! Dial down the spring constant so the capsule gets a softer, smoother landing inside the 10-12m zone!`;
          }
        } else { // Galileo Galilei
          if (status === "SECURED") {
            mentorText = `A triumph of natural equilibrium! The descent car has yielded to the restorative power of the electromagnetic coils, coming to rest at ${val}m. You have demonstrated the eternal balance of motion and resistance.`;
          } else if (status === "CRASHED") {
            mentorText = `The coils yielded too readily to the downward momentum of the capsule, compressing to ${val}m and striking the floor of the trench. We must stiffen the spring's elasticity to preserve the vessel.`;
          } else {
            mentorText = `The restorative force acted with violent abruptness, stopping the fall at ${val}m with an extreme force of ${peakG.toFixed(1)} G. Let us relax the coils to allow a longer, gentler arrest within the 10.0m - 12.0m zone.`;
          }
        }

        if (mentorText) {
          setChatLog((prev) => [...prev, { sender: "MENTOR", text: mentorText }]);
        }
      }, 1000);
    } else if (mission.coreInteraction === "PARAMETER_SANDBOX") {
      const cfg = mission.parameterSandboxConfig;
      const primaryKey = cfg?.primaryParamKey || mission.experimentFlow.parameters[0]?.name || "x";
      const primaryParam = mission.experimentFlow.parameters.find((p) => p.name === primaryKey) || mission.experimentFlow.parameters[0];
      const curX = simParameters[primaryKey] ?? primaryParam?.defaultValue ?? 0;

      // Calculate output using configured relationship
      const evaluateFormula = (xVal: number): number => {
        if (!cfg) return xVal;
        const { relationshipType, coefficients = {} } = cfg;
        const a = coefficients.a ?? 1;
        const b = coefficients.b ?? 0;
        const c = coefficients.c ?? 0;
        const kCoeff = coefficients.k ?? 1;

        switch (relationshipType) {
          case "LINEAR":
            return a * xVal + b;
          case "QUADRATIC":
            return a * xVal * xVal + b * xVal + c;
          case "INVERSE":
            return xVal !== 0 ? a / (xVal + b) + c : 0;
          case "EXPONENTIAL":
            return a * Math.exp(kCoeff * xVal) + b;
          case "RATE_LIMITED":
            return (a * xVal) / (xVal + (kCoeff || 1));
          default:
            return xVal;
        }
      };

      const outY = evaluateFormula(curX);
      val = Number(outY.toFixed(2));
      label = `${curX.toFixed(1)}${primaryParam?.unit || ""} ➔ ${val} ${cfg?.outputUnit || ""}`;

      // Check success against targetBand or targets
      const targetMin = cfg?.targetBand?.min ?? mission.experimentFlow.targets?.min ?? 0;
      const targetMax = cfg?.targetBand?.max ?? mission.experimentFlow.targets?.max ?? 100;

      if (val >= targetMin && val <= targetMax) {
        status = "SECURED";
        isSuccess = true;
      } else if (val < targetMin) {
        status = "UNDERSHOT";
        isSuccess = false;
      } else {
        status = "OVERSHOT";
        isSuccess = false;
      }

      setTimeout(() => {
        let mentorText = "";
        const outName = cfg?.outputLabel || "Output";
        const unit = cfg?.outputUnit || "";

        if (selectedMentor === "NEWTON") {
          if (status === "SECURED") {
            mentorText = `Mathematical harmony achieved! With ${primaryParam?.label || primaryKey} at ${curX.toFixed(1)}, the computed ${outName} is ${val} ${unit}, falling precisely within the target boundary [${targetMin} - ${targetMax}].`;
          } else if (status === "UNDERSHOT") {
            mentorText = `The current quantity yields ${val} ${unit}, which falls below the target threshold of ${targetMin} ${unit}. Analyze the rate of change and adjust ${primaryParam?.label || primaryKey} accordingly.`;
          } else {
            mentorText = `The magnitude of ${val} ${unit} exceeds our target boundary [${targetMin} - ${targetMax}]. Re-evaluate the underlying proportion and temper the primary input.`;
          }
        } else if (selectedMentor === "FEYNMAN") {
          if (status === "SECURED") {
            mentorText = `Boom! Spot on! With ${primaryParam?.label || primaryKey} dialed to ${curX.toFixed(1)}, we hit ${val} ${unit} right in the sweet spot! Look at how that curve predicts the real behavior!`;
          } else if (status === "UNDERSHOT") {
            mentorText = `Almost there, but we landed short at ${val} ${unit} (target is ${targetMin} - ${targetMax} ${unit}). Look at which way the curve bends and give it another tweak!`;
          } else {
            mentorText = `Whoa, that overshot past the target at ${val} ${unit}! Dial it back down toward the target band [${targetMin} - ${targetMax} ${unit}] and see how fast it drops!`;
          }
        } else { // Galileo Galilei
          if (status === "SECURED") {
            mentorText = `Magnificent! The empirical measure aligns with the geometric curve. At ${curX.toFixed(1)}, we recorded ${val} ${unit}, safely within the target haven. Nature confirms our mathematical deduction!`;
          } else if (status === "UNDERSHOT") {
            mentorText = `The measure of ${val} ${unit} remains beneath the required target. Let us calibrate ${primaryParam?.label || primaryKey} higher along the natural arc.`;
          } else {
            mentorText = `The resultant ${val} ${unit} has exceeded our target boundaries. Let us balance the proportions to bring our measure within [${targetMin} - ${targetMax} ${unit}].`;
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

                          // Custom pre-experiment mentor response for Expedition 02 (Newton's First Law / INERTIA_BOUNDS)
                          if (mission.coreInteraction === "INERTIA_BOUNDS") {
                            let preResponseText = "";
                            if (selectedMentor === "NEWTON") {
                              if (selectedPresetId === "inertia-slow") {
                                preResponseText = "An intriguing hypothesis. You expect the rover's quantity of motion to decay without a constant impressed force. Let us fire the thrusters and observe: does the speed decay, or does uniform inertia sustain its course?";
                              } else if (selectedPresetId === "inertia-instant") {
                                preResponseText = "To halt instantly implies an infinite negative force applied in an infinitesimal moment. Let us test if momentum can vanish so abruptly. Initiate the experiment, and track the velocity vector when the flame dies.";
                              } else {
                                preResponseText = "Indeed! You foresee the true nature of inertia. In the absence of external resistance, a body should persist in its state of uniform motion. Let us execute the launch and verify this mathematical truth.";
                              }
                            } else if (selectedMentor === "FEYNMAN") {
                              if (selectedPresetId === "inertia-slow") {
                                preResponseText = "A lot of people think that things naturally slow down unless you keep pushing them! But wait till you see what happens out on this super-smooth Jovian ice! Launch the rover and watch that speed vector!";
                              } else if (selectedPresetId === "inertia-instant") {
                                preResponseText = "Instantly stop? Whoa, that would be a crazy crash! Newton's got a law about things wanting to keep doing what they're already doing. Let's send the rover out and see if it stops, or keeps on cruising!";
                              } else {
                                preResponseText = "Spot on! With zero friction, there's absolutely nothing to stop it! It should just sail along at a steady clip forever. Let's run the trial and watch those emerald vectors lock in!";
                              }
                            } else { // GALILEO or default
                              if (selectedPresetId === "inertia-slow") {
                                preResponseText = "You anticipate the rover will rest once the push ceases, as objects seem to do on Earth. But let us test this on the pure ice of Europa, where no earthly friction resides. Launch and observe the geometry of its flight!";
                              } else if (selectedPresetId === "inertia-instant") {
                                preResponseText = "Nature abhors instant changes of state. Let us put your hypothesis to the test: when the engine light fades, does the Arion rover freeze in place, or does it glide onward? Fire the thrusters and watch the beacon ribbon!";
                              } else {
                                preResponseText = "A masterful prediction! You have seen past the illusions of earthly friction to the eternal geometry of motion. Let us launch the rover and observe the perfect, equal spacing of the beacon drops!";
                              }
                            }
                            setChatLog((prev) => [
                              ...prev,
                              { sender: "MENTOR", text: preResponseText }
                            ]);
                          } else if (mission.coreInteraction === "PROJECTILE_AIMING") {
                            let preResponseText = "";
                            if (selectedMentor === "NEWTON") {
                              if (selectedPresetId === "mass-float") {
                                preResponseText = "You expect lighter bodies to drift further, perhaps feeling gravity's pull less intensely. But wait: does gravity favor lightness, or does the resistance of mass compensate perfectly? Let us launch and discover!";
                              } else if (selectedPresetId === "mass-heavy") {
                                preResponseText = "A heavy safe is pulled by fifty-fold more force, yes, but its inertia resists that pull by fifty-fold as well! Let us test if mass has any dominion over the rate of fall under gravity. Launch the dual-payload rails.";
                              } else if (selectedPresetId === "mass-equal") {
                                preResponseText = "Superb! You understand that gravity exerts a force directly proportional to mass, while inertia resists in equal proportion. Thus, all bodies fall together. Let us launch and see this beautiful cancelation in action!";
                              } else { // angle-45
                                preResponseText = "An elevation of 45 degrees! A classic mathematical projection. It decomposes initial speed into equal orthogonal components. Let us verify if this splits horizontal drift and vertical time-of-flight to maximize the range.";
                              }
                            } else if (selectedMentor === "FEYNMAN") {
                              if (selectedPresetId === "mass-float") {
                                preResponseText = "Ah, you think lighter things float more and get more distance? That's a classic intuition! Let's fire up the double tracks and see how a lightweight lithium container compares to a massive iron safe in Martian gravity.";
                              } else if (selectedPresetId === "mass-heavy") {
                                preResponseText = "You're predicting that a big, heavy iron safe will fall like a rock while the wood crate floats along! That makes perfect everyday sense. But physics has a mind-bending surprise for you. Let's run the launch and see if they split up!";
                              } else if (selectedPresetId === "mass-equal") {
                                preResponseText = "Boom! You got it. In a vacuum, gravity treats everything exactly the same! A heavy safe and a wooden crate should fly perfectly synchronized. Let's run the dual-launch and watch them trace the exact same line!";
                              } else { // angle-45
                                preResponseText = "Ooh, 45 degrees! The ultimate compromise angle! Half your energy goes into soaring high, and the other half goes into racing forward. Let's launch and see if that sweet spot carries our supplies all the way to the safety zone!";
                              }
                            } else { // GALILEO or default
                              if (selectedPresetId === "mass-float") {
                                preResponseText = "You hypothesize that the wood crate will outrun the heavy iron safe. Let us test this on the plains of Mars, where the air is thin and free of earthly drag. Fire the dual-mass launcher and witness the truth of motion!";
                              } else if (selectedPresetId === "mass-heavy") {
                                preResponseText = "You suspect that heavier bodies fall faster. This was the belief of the ancient schoolmen for two thousand years! Let us put it to the test: when they fly across the basalt mountain, does the iron outstrip the wood, or do they share one destiny?";
                              } else if (selectedPresetId === "mass-equal") {
                                preResponseText = "You have grasped the eternal truth! Weight is but a force, and motion is independent of the quantity of matter when gravity alone governs. Let us launch the dual-mass capsules and behold Galileo's proof written in Mars' red sky.";
                              } else { // angle-45
                                preResponseText = "The angle of maximum projection! You expect 45 degrees to find the perfect geometric balance of vertical lift and horizontal progress. Let us launch the cargo and map the parabola!";
                              }
                            }
                            setChatLog((prev) => [
                              ...prev,
                              { sender: "MENTOR", text: preResponseText }
                            ]);
                          } else if (mission.coreInteraction === "ENERGY_CONSERVATION") {
                            let preResponseText = "";
                            if (selectedMentor === "NEWTON") {
                              if (selectedPresetId === "energy-linear") {
                                preResponseText = "You hypothesize that doubling the drop height doubles the spring compression in direct proportion. But take care: the work done to compress a spring increases quadratically with distance (W = 1/2 k x²). Let us release the capsule and observe the telemetry.";
                              } else if (selectedPresetId === "energy-impact-max") {
                                preResponseText = "You expect the capsule to attain its greatest velocity at the initial touch of the spring. Yet at that moment (x = 0), the upward spring force is zero, while gravity still pulls downward (mg). Acceleration must continue until kx = mg. Let us observe this equilibrium.";
                              } else {
                                preResponseText = "A masterful understanding of mechanics! Total energy is invariant, and the capsule must accelerate past contact until net force is zero at kx = mg. Let us initiate the drop and verify the conservation of energy.";
                              }
                            } else if (selectedMentor === "FEYNMAN") {
                              if (selectedPresetId === "energy-linear") {
                                preResponseText = "You're betting that doubling the height doubles the spring squish! That sounds super logical at first glance. But a spring pushes back harder and harder the more you squish it! Let's drop the capsule and watch those energy bars!";
                              } else if (selectedPresetId === "energy-impact-max") {
                                preResponseText = "You think the capsule is fastest right when it smacks the spring! But wait: the spring hasn't even pushed back yet at the very top! Gravity is still pulling it down faster and faster until the spring pushes back just as hard! Watch that speed gauge past the contact line!";
                              } else {
                                preResponseText = "Bingo! Energy is conserved, and that capsule keeps speeding up until the spring force equals its weight! Let's launch the trial and watch those three energy bars trade places in perfect harmony!";
                              }
                            } else { // GALILEO or default
                              if (selectedPresetId === "energy-linear") {
                                preResponseText = "You expect a linear proportion between the height of the fall and the depth of the buffer's yield. Yet the resistance of elastic bodies grows with every inch compressed. Drop the capsule down the abyssal shaft and let us record the true measure.";
                              } else if (selectedPresetId === "energy-impact-max") {
                                preResponseText = "You anticipate that speed is greatest at the threshold of contact. But consider: does an object cease accelerating before an opposing force exceeds its weight? Release the capsule and watch the velocity vector past the buffer's top.";
                              } else {
                                preResponseText = "You have discerned nature's mathematical beauty! The downward fall continues its acceleration into the buffer until equilibrium is struck. Release the capsule down the Mariana shaft!";
                              }
                            }
                            setChatLog((prev) => [
                              ...prev,
                              { sender: "MENTOR", text: preResponseText }
                            ]);
                          } else if (mission.coreInteraction === "PARAMETER_SANDBOX") {
                            const cfg = mission.parameterSandboxConfig;
                            const preset = mission.predictionPresets.find((p) => p.id === selectedPresetId);
                            const presetLabel = preset?.label || "your prediction";
                            const isMisconception = preset?.isMisconception || false;
                            const relName = cfg?.relationshipType || "parametric";
                            let preResponseText = "";

                            if (selectedMentor === "NEWTON") {
                              if (isMisconception) {
                                preResponseText = `You have hypothesized: "${presetLabel}". Let us put this proposition to empirical trial. Does nature conform to this assumption, or does the mathematical law of ${relName} govern the system? Calibrate the controls and observe.`;
                              } else {
                                preResponseText = `A rigorous hypothesis: "${presetLabel}". If the underlying dynamics obey a ${relName} proportion, the recorded telemetry will confirm your deduction. Proceed to calibrate and verify the law.`;
                              }
                            } else if (selectedMentor === "FEYNMAN") {
                              if (isMisconception) {
                                preResponseText = `You're predicting: "${presetLabel}"! It's super tempting to think that at first! But let's run the real experiment on the graph and see if the curve agrees with your hunch! Dial the sliders and let's test it!`;
                              } else {
                                preResponseText = `Bingo! You're thinking "${presetLabel}"! Let's fire up the sandbox and watch if the data points land right on that sweet ${relName} curve!`;
                              }
                            } else { // Galileo or default
                              if (isMisconception) {
                                preResponseText = `You anticipate: "${presetLabel}". Common intuition often suggests this path, but nature reveals its secrets only through rigorous geometry. Calibrate the apparatus and let us measure the true curve.`;
                              } else {
                                preResponseText = `A noble hypothesis: "${presetLabel}". You have discerned the geometric balance of this phenomenon. Let us conduct the experiment and record nature's testimony!`;
                              }
                            }

                            setChatLog((prev) => [
                              ...prev,
                              { sender: "MENTOR", text: preResponseText }
                            ]);
                          }
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

                              // Custom post-experiment reflection mentor response for Expedition 02 (INERTIA_BOUNDS)
                              if (mission.coreInteraction === "INERTIA_BOUNDS") {
                                let postResponseText = "";
                                if (selectedMentor === "NEWTON") {
                                  if (selectedPresetId === "inertia-slow") {
                                    postResponseText = "Observe, Cadet! Although the engine ceased firing, the speed of Arion did not decay by even a single millimeter per second. It drifted with uniform speed, dropping beacons of identical intervals. This directly contradicts your prediction that it would slow down. Reflect on why the velocity persisted when the force was zero.";
                                  } else if (selectedPresetId === "inertia-instant") {
                                    postResponseText = "Observe the telemetry: Arion did not halt when the force went to zero. Its momentum persisted, and it glided smoothly across the Jovian plains. An instantaneous deceleration would require an infinite backward force. Since net force was simply zero, why did its speed remain perfectly uniform?";
                                  } else {
                                    postResponseText = "Superb observation! The telemetry perfectly vindicates your prediction. During the unpowered glide, the net force was zero, yet the rover glided at a constant velocity, dropping beacons with exact, equal spacing. Explain in your own words how this demonstrates the law of inertia.";
                                  }
                                } else if (selectedMentor === "FEYNMAN") {
                                  if (selectedPresetId === "inertia-slow") {
                                    postResponseText = "Look at that! Even when the engine went dark, the rover didn't slow down at all! It just kept cruising at that constant speed. That's Newton's First Law right there! Since the ice has zero friction, there's no force pushing back on it. Do you see how the distance between those beacons stayed exactly the same?";
                                  } else if (selectedPresetId === "inertia-instant") {
                                    postResponseText = "Wow, did you see that drift? The rover didn't just freeze when the thruster went dark! It sailed along at that top speed! Things in motion really want to stay in motion! Look at the emerald velocity vector—it didn't shrink a bit until the brakes fired. How does this compare to what you expected?";
                                  } else {
                                    postResponseText = "You nailed it! Since there's absolutely zero friction, nothing can slow it down once the thruster cuts out. It just glides at a constant speed forever. Neat, right?";
                                  }
                                } else { // GALILEO or default
                                  if (selectedPresetId === "inertia-slow") {
                                    postResponseText = "A marvelous sight! The speed did not decrease once the thrust vanished, but remained perfectly constant. Observe the beacon ribbon: they are spaced with absolute geometric precision! Why did your prediction of deceleration fail? Recall that friction is the only thief of motion.";
                                  } else if (selectedPresetId === "inertia-instant") {
                                    postResponseText = "Behold! No sudden stop occurred. The rover glided forward across the ice with steady, unbroken speed. Nature does not leap; its velocities flow smoothly. Consider why the uniform spacing of the beacons proves that force is not required to maintain motion.";
                                  } else {
                                    postResponseText = "A triumph for your hypothesis! As we saw, the uniform velocity remained untouched once the thrust died, drawing a flawless geometric line of equally spaced beacons. Reflect on why this celestial ice field reveals the truth of inertia that Earth's friction always hides.";
                                  }
                                }
                                setChatLog((prev) => [
                                  ...prev,
                                  { sender: "MENTOR", text: postResponseText }
                                ]);
                              } else if (mission.coreInteraction === "PROJECTILE_AIMING") {
                                let postResponseText = "";
                                if (selectedMentor === "NEWTON") {
                                  if (selectedPresetId === "mass-float") {
                                    postResponseText = "Look at the telemetry! The lighter wood crate did not drift a single millimeter further than the iron safe. They landed in exact unison. Gravity's force was smaller on the wood, yes, but its inertia was lighter too, meaning the resulting acceleration is identical. Reflect on how this cancellation invalidates your buoyancy prediction.";
                                  } else if (selectedPresetId === "mass-heavy") {
                                    postResponseText = "Behold the telemetry: despite having fifty times the mass, the iron safe did not outstrip the lighter wooden crate by even a fraction of a second. The twin forces and inertias cancelled each other perfectly. Explain why mass did not affect the flight trajectory.";
                                  } else if (selectedPresetId === "mass-equal") {
                                    postResponseText = "A flawless validation! The telemetry shows the iron safe and wood crate landing in perfect coincidence, proving that mass cancels out of the equations of motion. Reflect on how this balance of gravity and inertia creates this universal harmony.";
                                  } else { // angle-45
                                    postResponseText = "The range formula holds true! At 45 degrees, the projectile reached its maximum possible horizontal range for this launch speed. Observe how higher angles gain height but lose forward speed, while lower angles land too soon. Explain how the orthogonal vectors balance here.";
                                  }
                                } else if (selectedMentor === "FEYNMAN") {
                                  if (selectedPresetId === "mass-float") {
                                    postResponseText = "Whoa, did you see that? Even though the lithium-wood crate is super light, it didn't drift any further! It landed at the exact same spot as that giant iron safe! In a vacuum, there's no air resistance to make light things float. How does that make you feel about your prediction?";
                                  } else if (selectedPresetId === "mass-heavy") {
                                    postResponseText = "Check that out! The iron safe is fifty times heavier, but it didn't touch down a single microsecond earlier than the wood crate! They stayed locked together like best friends. All things fall at the same rate when you take away the air. Why does that happen?";
                                  } else if (selectedPresetId === "mass-equal") {
                                    postResponseText = "They landed together! Absolute magic! It doesn't matter if it's wood or iron, gravity drags them down with the exact same acceleration. Your prediction was 100% correct! How does it feel to see Galileo's famous experiment play out in real time?";
                                  } else { // angle-45
                                    postResponseText = "Perfect hit! 45 degrees was exactly the sweet spot to clear that basalt ridge and hit the landing zone. If you went higher, you'd waste energy going up. If lower, you'd crash into the mountain. How does this balance of up-and-forward make sense to you?";
                                  }
                                } else { // GALILEO or default
                                  if (selectedPresetId === "mass-float") {
                                    postResponseText = "Behold! The lighter wood and the heavy iron safe traced the same glorious curve. Your expectation of buoyancy was a shadow of Earth's air. Here in the thin air of Mars, weight is nothing. Reflect on why the paths remained perfectly matched.";
                                  } else if (selectedPresetId === "mass-heavy") {
                                    postResponseText = "Observe! The schoolmen of old are proven wrong once more. The iron safe and the wooden crate fell in absolute harmony, striking the red sands together. Why did your prediction of a faster fall fail? Think on the balance of weight and inertia.";
                                  } else if (selectedPresetId === "mass-equal") {
                                    postResponseText = "A magnificent triumph! The telemetry records show both bodies describing the same geometric parabola, landing at the exact same coordinate. You have seen Galileo's truth on another world. Explain why mass is powerless to change the trajectory.";
                                  } else { // angle-45
                                    postResponseText = "A beautiful parabolic path! By choosing 45 degrees, you achieved the perfect geometric splitting of horizontal and vertical speeds, maximizing your reach. Reflect on why other angles fail to achieve this spatial harmony.";
                                  }
                                }
                                setChatLog((prev) => [
                                  ...prev,
                                  { sender: "MENTOR", text: postResponseText }
                                ]);
                              } else if (mission.coreInteraction === "ENERGY_CONSERVATION") {
                                let postResponseText = "";
                                if (selectedMentor === "NEWTON") {
                                  if (selectedPresetId === "energy-linear") {
                                    postResponseText = "Observe the telemetry: doubling the drop height did not double the compression. Because stored spring potential scales quadratically (U_e = 1/2 k x²), compression only scales with the square root of energy! Reflect on how this refutes your linear assumption.";
                                  } else if (selectedPresetId === "energy-impact-max") {
                                    postResponseText = "Look closely at the velocity trace: the speed did not peak at contact (x = 0), but continued to increase until x = mg/k, where the upward spring force exactly balanced gravity. Reflect on why maximum speed coincides with zero net force.";
                                  } else {
                                    postResponseText = "A flawless confirmation of the Work-Energy Theorem! Total mechanical energy remained strictly invariant across every phase of the descent. Formulate your scientific findings on this conservation.";
                                  }
                                } else if (selectedMentor === "FEYNMAN") {
                                  if (selectedPresetId === "energy-linear") {
                                    postResponseText = "Look at that! Doubling the height didn't double the squish at all! That's because squishing a spring gets harder and harder the deeper you go (1/2 k x²). How does that change the way you think about spring energy?";
                                  } else if (selectedPresetId === "energy-impact-max") {
                                    postResponseText = "Check that out! The capsule was still speeding up even after it hit the spring! It didn't hit top speed until it reached that equilibrium line where the spring push matched its weight! Why did gravity win out during those first few meters?";
                                  } else {
                                    postResponseText = "You called it! Total energy stayed at 100% the entire time—like water flowing between three buckets! And peak speed happened right at that equilibrium line. How did the live energy bars help you see that?";
                                  }
                                } else { // GALILEO or default
                                  if (selectedPresetId === "energy-linear") {
                                    postResponseText = "The empirical record shows the non-linear harmony of nature. The depth of compression did not double with height, proving that elastic resistance accumulates quadratically. Reflect on this geometric truth.";
                                  } else if (selectedPresetId === "energy-impact-max") {
                                    postResponseText = "Behold: the speed increased beyond the threshold of the buffer, reaching its zenith only when the coils exerted a force equal to the capsule's weight. Reflect on why acceleration persisted past the point of impact.";
                                  } else {
                                    postResponseText = "Your prediction is confirmed by empirical telemetry. The sum of gravitational, kinetic, and elastic potential remains immutable throughout. State your formal findings on this eternal conservation.";
                                  }
                                }
                                setChatLog((prev) => [
                                  ...prev,
                                  { sender: "MENTOR", text: postResponseText }
                                ]);
                              } else if (mission.coreInteraction === "PARAMETER_SANDBOX") {
                                const cfg = mission.parameterSandboxConfig;
                                const preset = mission.predictionPresets.find((p) => p.id === selectedPresetId);
                                const presetLabel = preset?.label || "your prediction";
                                const isMisconception = preset?.isMisconception || false;
                                const relName = cfg?.relationshipType || "parametric";
                                const latestLaunch = launches[0];
                                const outVal = latestLaunch ? latestLaunch.outcomeValue : 0;
                                const unit = cfg?.outputUnit || "";
                                let postResponseText = "";

                                if (selectedMentor === "NEWTON") {
                                  if (isMisconception) {
                                    postResponseText = `Examine your telemetry logs: the empirical measure produced ${outVal} ${unit}. Nature has not conformed to "${presetLabel}". The curve mathematically verifies a ${relName} relationship. Reflect upon the causes of this divergence.`;
                                  } else {
                                    postResponseText = `A triumphant verification! Your prediction of "${presetLabel}" aligns with the recorded outcome of ${outVal} ${unit}. The empirical data affirms the mathematical law of ${relName}. Detail your synthesis in the notebook.`;
                                  }
                                } else if (selectedMentor === "FEYNMAN") {
                                  if (isMisconception) {
                                    postResponseText = `Look at that graph! We got ${outVal} ${unit}, which totally breaks away from "${presetLabel}"! That's the beauty of science—when an experiment disagrees with a guess, the guess has gotta go! How does the shape of that curve explain what really happened?`;
                                  } else {
                                    postResponseText = `You nailed it! The sandbox gave us ${outVal} ${unit}, landing right on your prediction of "${presetLabel}"! Look at how neatly the real data tracks that ${relName} curve! What's the main takeaway here?`;
                                  }
                                } else { // Galileo or default
                                  if (isMisconception) {
                                    postResponseText = `The testimony of the apparatus is unequivocal: we recorded ${outVal} ${unit}. Your earlier anticipation of "${presetLabel}" yields to the true geometry of the phenomenon. State the mathematical principle revealed by this measurement.`;
                                  } else {
                                    postResponseText = `Nature has spoken with clarity! At ${outVal} ${unit}, the telemetry seals your prediction of "${presetLabel}". Record your reflections on this harmonious law of ${relName}.`;
                                  }
                                }

                                setChatLog((prev) => [
                                  ...prev,
                                  { sender: "MENTOR", text: postResponseText }
                                ]);
                              }
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
                            {selectedPresetId === "mass-float" ? (
                              <>
                                You predicted that the <strong className="text-white">lighter wood/lithium crate would travel further because it is buoyant</strong>. However, the telemetry shows the 10kg Wood Crate and 500kg Iron Safe sailed in perfect lockstep, landing at the exact same coordinates!
                              </>
                            ) : selectedPresetId === "mass-heavy" ? (
                              <>
                                You predicted that the <strong className="text-white">heavy Iron Safe would fall much faster under Mars gravity</strong>. However, the telemetry shows the 10kg Wood Crate and 500kg Iron Safe sailed in perfect lockstep, landing at the exact same coordinates!
                              </>
                            ) : (
                              <>
                                You observed the <strong className="text-white">10kg Wood Crate</strong> and <strong className="text-white">500kg Iron Safe</strong> glide side-by-side in perfect lockstep, landing together at the exact same moment!
                              </>
                            )}
                          </p>
                          <p className="text-[10px] text-amber-300/80 leading-normal border-t border-white/5 pt-2 mt-1">
                            Why does the 500kg safe, which is pulled down by 50 times more gravitational force, not outrun the 10kg crate? How does inertia play a role? State your findings below:
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/15 flex flex-col gap-2 font-mono text-xs text-cyan-200">
                          <span className="text-[9px] font-bold uppercase text-cyan-400 tracking-wider flex items-center gap-1">
                            <span>💡</span> {mission.coreInteraction === "INERTIA_BOUNDS" ? "NEWTON'S COGNITIVE ALIGNMENT" : mission.coreInteraction === "ENERGY_CONSERVATION" ? "WORK-ENERGY COGNITIVE ALIGNMENT" : mission.coreInteraction === "PARAMETER_SANDBOX" ? `${mission.coreScientificConcept?.name ? mission.coreScientificConcept.name.toUpperCase() + " " : ""}COGNITIVE ALIGNMENT` : "TRAJECTORY COGNITIVE ALIGNMENT"}
                          </span>
                          <p className="leading-relaxed text-[11px] text-gray-300">
                            {mission.coreInteraction === "INERTIA_BOUNDS" ? (
                              selectedPresetId === "inertia-slow" ? (
                                <>
                                  You predicted that the <strong className="text-white">rover would slowly decelerate and stop</strong> once thrust became zero. However, looking at the telemetry logs and the emerald velocity vector, the speed remained perfectly constant during the unpowered glide, dropping a uniform ribbon of beacons!
                                </>
                              ) : selectedPresetId === "inertia-instant" ? (
                                <>
                                  You predicted that the <strong className="text-white">rover would instantly drop to zero velocity</strong> once the engine went dark. Yet, the telemetry shows the rover continued to drift smoothly at its top velocity, dropping beacons at identical intervals.
                                </>
                              ) : (
                                <>
                                  You predicted that the <strong className="text-white">rover would drift at constant velocity</strong> because there is no friction to slow it down. This is the essence of Newton's First Law!
                                </>
                              )
                            ) : mission.coreInteraction === "ENERGY_CONSERVATION" ? (
                              selectedPresetId === "energy-linear" ? (
                                <>
                                  You predicted that <strong className="text-white">spring compression scales linearly with drop height</strong> (doubling height doubles compression). But the live telemetry bars proved that compression scales with the square root of height because spring potential energy is quadratic: <strong className="text-white">U_e = ½kx²</strong>!
                                </>
                              ) : selectedPresetId === "energy-impact-max" ? (
                                <>
                                  You predicted that <strong className="text-white">maximum velocity occurs at the moment of impact</strong>. However, the telemetry showed the capsule continued to accelerate downwards until reaching the equilibrium point <strong className="text-white">kx = mg</strong>, where net force is zero!
                                </>
                              ) : (
                                <>
                                  You predicted that <strong className="text-white">total mechanical energy is conserved</strong> and maximum velocity occurs at equilibrium (kx = mg). The live telemetry bars confirmed exact 100% energy conservation!
                                </>
                              )
                            ) : mission.coreInteraction === "PARAMETER_SANDBOX" ? (
                              (() => {
                                const preset = mission.predictionPresets.find((p) => p.id === selectedPresetId);
                                const isMisconception = preset?.isMisconception || false;
                                const presetLabel = preset?.label || "your prediction";
                                const cfg = mission.parameterSandboxConfig;
                                const relName = cfg?.relationshipType || "parametric";
                                if (isMisconception) {
                                  return (
                                    <>
                                      You predicted that <strong className="text-white">{presetLabel}</strong>. However, empirical telemetry across multiple calibrated trials proved that the response follows a <strong className="text-white">{relName}</strong> mathematical relationship!
                                    </>
                                  );
                                } else {
                                  return (
                                    <>
                                      You predicted that <strong className="text-white">{presetLabel}</strong>. The calibrated sandbox data corroborated your hypothesis, showing exact conformity with the <strong className="text-white">{relName}</strong> law!
                                    </>
                                  );
                                }
                              })()
                            ) : (
                              selectedPresetId === "mass-equal" ? (
                                <>
                                  You predicted that <strong className="text-white">gravity is independent of mass</strong> and the arcs would be identical. This was perfectly proven when both crates traced the exact same parabola!
                                </>
                              ) : selectedPresetId === "angle-45" ? (
                                <>
                                  You predicted that a <strong className="text-white">45° launch angle splits velocity components equally</strong> to produce the maximum range. The telemetry logs confirm this mathematical optimum!
                                </>
                              ) : (
                                "Analyze your telemetry logs. Explain what you discovered regarding this relationship:"
                              )
                            )}
                          </p>
                          <p className="text-[10px] text-cyan-300/80 leading-normal border-t border-white/5 pt-2 mt-1">
                            {mission.coreInteraction === "INERTIA_BOUNDS" ? (
                              selectedPresetId === "inertia-slow" ? (
                                "Explain why the rover did not slow down even though there was zero net force acting on it. How does the lack of friction support Newton's First Law?"
                              ) : selectedPresetId === "inertia-instant" ? (
                                "Reflect on why the rover's motion persisted even when force became zero. Why is an instantaneous stop physically impossible without an opposing force?"
                              ) : (
                                "Explain how your prediction matches the uniform spacing of the beacon ribbon and the persistent emerald velocity vector during the glide phase."
                              )
                            ) : mission.coreInteraction === "ENERGY_CONSERVATION" ? (
                              selectedPresetId === "energy-linear" ? (
                                "Why did doubling the drop height not double the spring compression? How does the Work-Energy Theorem (W = ΔK = ½kx²) explain this non-linear relationship?"
                              ) : selectedPresetId === "energy-impact-max" ? (
                                "Why was the capsule still speeding up even after making contact with the spring? At what exact point does acceleration become zero?"
                              ) : (
                                "Explain how the gravitational potential energy of the capsule transforms into kinetic energy, and then into elastic potential energy without any energy loss."
                              )
                            ) : mission.coreInteraction === "PARAMETER_SANDBOX" ? (
                              (() => {
                                const preset = mission.predictionPresets.find((p) => p.id === selectedPresetId);
                                const isMisconception = preset?.isMisconception || false;
                                const cfg = mission.parameterSandboxConfig;
                                if (isMisconception) {
                                  return `Explain why the recorded data diverged from your initial prediction. How does the ${cfg?.relationshipType || "parametric"} curve describe the underlying scientific mechanism?`;
                                } else {
                                  return `Synthesize your findings: how did the parameters and mathematical curve confirm your hypothesis?`;
                                }
                              })()
                            ) : (
                              selectedPresetId === "mass-equal" ? (
                                "Reflect on why gravity pulls harder on the heavier safe, yet it falls at the exact same rate as the light wood crate."
                              ) : selectedPresetId === "angle-45" ? (
                                "Reflect on why an angle higher or lower than 45° reduces the horizontal range under a constant gravitational pull."
                              ) : (
                                "State your findings below:"
                              )
                            )}
                          </p>
                        </div>
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

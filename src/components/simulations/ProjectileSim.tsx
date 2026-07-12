/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from "react";
import { useSimulationStore, useEngineStore } from "../../core/stores";
import { globalEventBus } from "../../core/EventBus";
import { Play, Pause, RotateCcw, FastForward, ChevronRight, ChevronLeft } from "lucide-react";

interface ProjectileSimProps {
  velocity: number;
  angle: number;
  gravity: number;
  isChallengeMode?: boolean;
  targetRange?: { min: number; max: number };
  onChallengeComplete?: (success: boolean, finalRange: number) => void;
  onControlsChange?: (velocity: number, angle: number) => void;
}

export default function ProjectileSim({
  velocity,
  angle,
  gravity,
  isChallengeMode = false,
  targetRange = { min: 780, max: 820 },
  onChallengeComplete,
  onControlsChange
}: ProjectileSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State for direct spatial manipulation dragging
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragRef = useRef(false);

  const getLauncherPivot = (width: number, height: number) => {
    const scaleX = (m: number) => (m / 900) * (width - 100) + 50;
    const scaleY = (m: number) => height - 60 - (m / 300) * (height - 100);
    return { x: scaleX(0), y: scaleY(0) };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleXFactor = canvas.width / rect.width;
    const scaleYFactor = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleXFactor;
    const mouseY = (e.clientY - rect.top) * scaleYFactor;

    const pivot = getLauncherPivot(canvas.width, canvas.height);
    const angleRad = (angle * Math.PI) / 180;
    const R = 55 + ((velocity - 30) / (150 - 30)) * 100;
    const handleX = pivot.x + R * Math.cos(angleRad);
    const handleY = pivot.y - R * Math.sin(angleRad);

    const dx = mouseX - handleX;
    const dy = mouseY - handleY;
    const distanceToHandle = Math.sqrt(dx * dx + dy * dy);

    if (dragRef.current) {
      const moveDx = mouseX - pivot.x;
      const moveDy = pivot.y - mouseY;

      const distance = Math.sqrt(moveDx * moveDx + moveDy * moveDy);
      let angleRadNew = Math.atan2(moveDy, moveDx);
      let angleDegNew = Math.round((angleRadNew * 180) / Math.PI);
      angleDegNew = Math.max(10, Math.min(85, angleDegNew));

      const clampedDistance = Math.max(55, Math.min(155, distance));
      const velocityValNew = Math.round(30 + ((clampedDistance - 55) / 100) * (150 - 30));

      if (onControlsChange) {
        onControlsChange(velocityValNew, angleDegNew);
      }
    } else {
      const hovering = distanceToHandle < 18;
      if (hovering !== isHovered) {
        setIsHovered(hovering);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleXFactor = canvas.width / rect.width;
    const scaleYFactor = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleXFactor;
    const mouseY = (e.clientY - rect.top) * scaleYFactor;

    // --- Ground/Terrain click prediction setting ---
    if (cognitiveLoopState === "PREDICT" && mouseY > canvas.height - 75) {
      const physicsX = Math.round(((mouseX - 50) / (canvas.width - 100)) * 900);
      const clampedX = Math.max(50, Math.min(850, physicsX));
      setPredictionFlagX(clampedX);
      globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "CLICK" } });
      return;
    }

    const pivot = getLauncherPivot(canvas.width, canvas.height);
    const angleRad = (angle * Math.PI) / 180;
    const R = 55 + ((velocity - 30) / (150 - 30)) * 100;
    const handleX = pivot.x + R * Math.cos(angleRad);
    const handleY = pivot.y - R * Math.sin(angleRad);

    const dx = mouseX - handleX;
    const dy = mouseY - handleY;
    const distanceToHandle = Math.sqrt(dx * dx + dy * dy);

    if (distanceToHandle < 20 || (mouseX > pivot.x - 20 && mouseX < pivot.x + 180 && mouseY < pivot.y + 20 && mouseY > pivot.y - 180 && isPlaying === "PAUSED")) {
      dragRef.current = true;
      setIsDragging(true);
      globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "CLICK" } });
    }
  };

  const handleMouseUpOrLeave = () => {
    if (dragRef.current) {
      dragRef.current = false;
      setIsDragging(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleXFactor = canvas.width / rect.width;
    const scaleYFactor = canvas.height / rect.height;
    const mouseX = (touch.clientX - rect.left) * scaleXFactor;
    const mouseY = (touch.clientY - rect.top) * scaleYFactor;

    const pivot = getLauncherPivot(canvas.width, canvas.height);

    if (dragRef.current) {
      const moveDx = mouseX - pivot.x;
      const moveDy = pivot.y - mouseY;

      const distance = Math.sqrt(moveDx * moveDx + moveDy * moveDy);
      let angleRadNew = Math.atan2(moveDy, moveDx);
      let angleDegNew = Math.round((angleRadNew * 180) / Math.PI);
      angleDegNew = Math.max(10, Math.min(85, angleDegNew));

      const clampedDistance = Math.max(55, Math.min(155, distance));
      const velocityValNew = Math.round(30 + ((clampedDistance - 55) / 100) * (150 - 30));

      if (onControlsChange) {
        onControlsChange(velocityValNew, angleDegNew);
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleXFactor = canvas.width / rect.width;
    const scaleYFactor = canvas.height / rect.height;
    const mouseX = (touch.clientX - rect.left) * scaleXFactor;
    const mouseY = (touch.clientY - rect.top) * scaleYFactor;

    const pivot = getLauncherPivot(canvas.width, canvas.height);
    const angleRad = (angle * Math.PI) / 180;
    const R = 55 + ((velocity - 30) / (150 - 30)) * 100;
    const handleX = pivot.x + R * Math.cos(angleRad);
    const handleY = pivot.y - R * Math.sin(angleRad);

    const dx = mouseX - handleX;
    const dy = mouseY - handleY;
    const distanceToHandle = Math.sqrt(dx * dx + dy * dy);

    if (distanceToHandle < 35 || (mouseX > pivot.x - 25 && mouseX < pivot.x + 185 && mouseY < pivot.y + 25 && mouseY > pivot.y - 185 && isPlaying === "PAUSED")) {
      dragRef.current = true;
      setIsDragging(true);
      globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "CLICK" } });
    }
  };

  
  // Connect simulation state from our central store
  const {
    isPlaying,
    currentTime,
    maxTime,
    playbackRate,
    historyFrames,
    currentFrameIndex,
    setPlaying,
    tickFrame,
    scrubToFrame,
    setPlaybackRate,
    resetSimulation
  } = useSimulationStore();

  // Connect Cognitive Learning Engine state
  const {
    cognitiveLoopState,
    predictionFlagX,
    setPredictionFlagX,
    misconceptionDemoMode
  } = useEngineStore();

  // Internal physical state refs to bypass React re-renders during high-frequency math loop ticks
  const stateRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    t: 0,
    trail: [] as { x: number; y: number }[],
    hasCrashed: false,
    hasLanded: false,
    completedFired: false
  });

  // Local state for UI readouts
  const [readouts, setReadouts] = useState({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    t: 0,
    peakHeight: 0,
    clearedPeak: true,
    landingX: 0
  });

  // Mount/unmount simulation resets
  useEffect(() => {
    handleReset();
    return () => {
      resetSimulation();
    };
  }, [velocity, angle, gravity]);

  // Handle manual resets
  const handleReset = () => {
    const angleRad = (angle * Math.PI) / 180;
    stateRef.current = {
      x: 0,
      y: 0,
      vx: velocity * Math.cos(angleRad),
      vy: velocity * Math.sin(angleRad),
      t: 0,
      trail: [],
      hasCrashed: false,
      hasLanded: false,
      completedFired: false
    };
    resetSimulation({ x: 0, y: 0, vx: stateRef.current.vx, vy: stateRef.current.vy, t: 0 });
    setReadouts({
      x: 0,
      y: 0,
      vx: stateRef.current.vx,
      vy: stateRef.current.vy,
      t: 0,
      peakHeight: 0,
      clearedPeak: true,
      landingX: 0
    });
  };

  // Math Integration & Live Recording Loop
  useEffect(() => {
    if (isPlaying !== "PLAYING") return;

    let animId: number;
    let lastTimestamp = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.016, (now - lastTimestamp) / 1000) * playbackRate;
      lastTimestamp = now;

      const state = stateRef.current;
      if (!state.hasLanded && !state.hasCrashed) {
        state.t += dt;
        
        // Newtonian mechanics equations (Euler-Verlet simplified integration)
        const angleRad = (angle * Math.PI) / 180;
        state.vx = velocity * Math.cos(angleRad); // Uniform horizontal velocity
        state.vy = velocity * Math.sin(angleRad) - gravity * state.t; // Accelerated gravitational velocity
        
        state.x = state.vx * state.t;
        state.y = (velocity * Math.sin(angleRad) * state.t) - (0.5 * gravity * state.t * state.t);

        // Record flight path trails
        state.trail.push({ x: state.x, y: state.y });

        // --- COLLISION CHECKS ---
        // 1. Ridge check: 140m mountain rises at x = 400m
        // We model the mountain as a triangular ridge centered at x = 400m spanning 340m to 460m
        const ridgeX = 400;
        const ridgeWidth = 120;
        const ridgePeakHeight = 140;
        let mountainHeightAtX = 0;
        if (Math.abs(state.x - ridgeX) < ridgeWidth) {
          const factor = 1 - Math.abs(state.x - ridgeX) / ridgeWidth;
          mountainHeightAtX = factor * ridgePeakHeight;
        }

        if (state.y < mountainHeightAtX && Math.abs(state.x - ridgeX) < ridgeWidth) {
          state.hasCrashed = true;
          setPlaying("PAUSED");
          globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "FAILURE" } });
          if (onChallengeComplete) {
            onChallengeComplete(false, state.x);
          }
        }

        // 2. Landing ground check (y <= 0)
        if (state.y <= 0 && state.t > 0.1) {
          state.y = 0;
          state.hasLanded = true;
          setPlaying("PAUSED");

          const isSuccess = state.x >= targetRange.min && state.x <= targetRange.max;
          if (isSuccess) {
            globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "SUCCESS" } });
            globalEventBus.publish({
              type: "SIMULATION_COMPLETED",
              payload: { simId: "PROJECTILE_MOTION", finalState: { range: state.x } }
            });
          } else {
            globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "FAILURE" } });
          }

          if (onChallengeComplete) {
            onChallengeComplete(isSuccess, state.x);
          }
        }

        // Log frame coordinate packet into Zustand for scrubbing timeline
        const frameData = {
          x: state.x,
          y: state.y,
          vx: state.vx,
          vy: state.vy,
          t: state.t,
          hasCrashed: state.hasCrashed ? 1 : 0,
          hasLanded: state.hasLanded ? 1 : 0
        };
        tickFrame(dt, frameData);

        // Update readouts for live telemetry
        setReadouts((prev) => {
          const maxH = (velocity * Math.sin(angleRad)) ** 2 / (2 * gravity);
          return {
            x: state.x,
            y: state.y,
            vx: state.vx,
            vy: state.vy,
            t: state.t,
            peakHeight: maxH,
            clearedPeak: state.x > 400 ? (prev.clearedPeak && state.y > mountainHeightAtX) : true,
            landingX: state.hasLanded ? state.x : 0
          };
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, velocity, angle, gravity, playbackRate]);

  // Chrono Scrubbing Synchronizer
  useEffect(() => {
    if (isPlaying !== "REPLAY_SCRUBBING" || historyFrames.length === 0) return;
    const frame = historyFrames[currentFrameIndex];
    if (!frame) return;

    // Synchronize physical refs to scrubbed coordinates
    stateRef.current.x = frame.x;
    stateRef.current.y = frame.y;
    stateRef.current.vx = frame.vx;
    stateRef.current.vy = frame.vy;
    stateRef.current.t = frame.t;
    stateRef.current.hasCrashed = frame.hasCrashed === 1;
    stateRef.current.hasLanded = frame.hasLanded === 1;

    // Rebuild flight trail up to index
    const trailSlice = historyFrames.slice(0, currentFrameIndex + 1).map((f) => ({ x: f.x, y: f.y }));
    stateRef.current.trail = trailSlice;

    const angleRad = (angle * Math.PI) / 180;
    const maxH = (velocity * Math.sin(angleRad)) ** 2 / (2 * gravity);

    setReadouts({
      x: frame.x,
      y: frame.y,
      vx: frame.vx,
      vy: frame.vy,
      t: frame.t,
      peakHeight: maxH,
      clearedPeak: frame.x >= 400 ? true : true,
      landingX: frame.hasLanded === 1 ? frame.x : 0
    });
  }, [currentFrameIndex, isPlaying, historyFrames, angle, velocity, gravity]);

  // Frame Step Functions
  const stepFrameForward = () => {
    if (currentFrameIndex < historyFrames.length - 1) {
      scrubToFrame(currentFrameIndex + 1);
    }
  };

  const stepFrameBackward = () => {
    if (currentFrameIndex > 0) {
      scrubToFrame(currentFrameIndex - 1);
    }
  };

  // Wind & Spark Particle Systems for 60fps persistent drawing
  const windParticles = useRef<{ x: number; y: number; speed: number; length: number; opacity: number }[]>([]);
  const sparks = useRef<{ x: number; y: number; vx: number; vy: number; size: number; color: string; alpha: number; decay: number }[]>([]);
  const muzzleFlash = useRef<number>(0);
  const radarSweepX = useRef<number>(0);

  // Initialize wind lines once on mount
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * 900,
        y: Math.random() * 260 + 10,
        speed: Math.random() * 1.5 + 0.5,
        length: Math.random() * 40 + 10,
        opacity: Math.random() * 0.15 + 0.05
      });
    }
    windParticles.current = particles;
  }, []);

  // Helper to spawn explosive sparks on crash or landing
  const spawnSparks = (xMeters: number, yMeters: number, isSuccess: boolean) => {
    const count = isSuccess ? 60 : 40;
    const list = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (isSuccess ? 6 : 4) + 1;
      list.push({
        x: xMeters,
        y: yMeters,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + (isSuccess ? 2 : 1), // drift up slightly
        size: Math.random() * 3 + 1,
        color: isSuccess 
          ? `hsla(${140 + Math.random() * 40}, 100%, 70%, 1)` // Glowing emerald stars
          : `hsla(${Math.random() * 30}, 100%, 60%, 1)`,   // Fiery volcanic embers
        alpha: 1.0,
        decay: Math.random() * 0.02 + 0.015
      });
    }
    sparks.current = [...sparks.current, ...list];
  };

  // Trigger muzzle flash on start playing
  useEffect(() => {
    if (isPlaying === "PLAYING" && currentFrameIndex === 0) {
      muzzleFlash.current = 1.0;
    }
  }, [isPlaying, currentFrameIndex]);

  // Unified persistent 60fps visual rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Coordinate conversion utilities (0m to 900m horizontal; 0m to 300m vertical)
      const scaleX = (m: number) => (m / 900) * (width - 100) + 50;
      const scaleY = (m: number) => height - 60 - (m / 300) * (height - 100);

      // --- 1. RUST MARS SKY GRADIENT ---
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, "#0c050a"); // Space edge
      skyGrad.addColorStop(0.4, "#260e10"); // High atmosphere
      skyGrad.addColorStop(0.8, "#591c13"); // Martian horizon
      skyGrad.addColorStop(1, "#1c0907"); // Ground level
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // --- 2. MARS TINY BLUE SUN (PHYSICAL PHENOMENON) ---
      // Sunset on Mars is blue due to fine dust scattering properties
      ctx.save();
      ctx.shadowBlur = 40;
      ctx.shadowColor = "rgba(103, 190, 245, 0.5)";
      ctx.fillStyle = "rgba(186, 230, 253, 0.8)";
      ctx.beginPath();
      ctx.arc(width * 0.75, height * 0.3, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // --- 3. PROCEDURAL BACKGROUND DUST STORM (WIND LINES) ---
      ctx.lineWidth = 1;
      windParticles.current.forEach((p) => {
        // Move wind lines from right to left
        p.x -= p.speed;
        if (p.x < -p.length) {
          p.x = 900 + p.length;
          p.y = Math.random() * 260 + 10;
        }
        ctx.strokeStyle = `rgba(234, 88, 12, ${p.opacity})`;
        ctx.beginPath();
        ctx.moveTo(scaleX(p.x), scaleY(p.y));
        ctx.lineTo(scaleX(p.x + p.length), scaleY(p.y));
        ctx.stroke();
      });

      // --- 4. TACTICAL COMPUTER GRAPHIC GRID ---
      ctx.strokeStyle = "rgba(6, 182, 212, 0.05)";
      ctx.lineWidth = 1;
      const gridSpacing = 50;
      for (let x = 0; x <= 900; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(scaleX(x), scaleY(0));
        ctx.lineTo(scaleX(x), scaleY(300));
        ctx.stroke();
      }
      for (let y = 0; y <= 300; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(scaleX(0), scaleY(y));
        ctx.lineTo(scaleX(900), scaleY(y));
        ctx.stroke();
      }

      // --- 5. THE CRAGGY VOLCANIC PEAK ---
      const ridgeX = 400;
      const ridgeWidth = 120;
      const ridgeHeight = 140;

      // Dynamic craggy volcanic slope back fill
      ctx.beginPath();
      ctx.moveTo(scaleX(ridgeX - ridgeWidth), scaleY(0));
      ctx.lineTo(scaleX(ridgeX - 60), scaleY(ridgeHeight * 0.4));
      ctx.lineTo(scaleX(ridgeX - 30), scaleY(ridgeHeight * 0.75));
      ctx.lineTo(scaleX(ridgeX), scaleY(ridgeHeight));
      ctx.lineTo(scaleX(ridgeX + 40), scaleY(ridgeHeight * 0.5));
      ctx.lineTo(scaleX(ridgeX + ridgeWidth), scaleY(0));
      ctx.closePath();
      ctx.fillStyle = "rgba(41, 14, 11, 0.85)";
      ctx.fill();

      // Craggy crest highlighting (glowing cold volcanic basalt embers)
      ctx.beginPath();
      ctx.moveTo(scaleX(ridgeX - ridgeWidth), scaleY(0));
      ctx.lineTo(scaleX(ridgeX - 60), scaleY(ridgeHeight * 0.4));
      ctx.lineTo(scaleX(ridgeX - 30), scaleY(ridgeHeight * 0.75));
      ctx.lineTo(scaleX(ridgeX), scaleY(ridgeHeight));
      ctx.lineTo(scaleX(ridgeX + 40), scaleY(ridgeHeight * 0.5));
      ctx.lineTo(scaleX(ridgeX + ridgeWidth), scaleY(0));
      
      ctx.strokeStyle = "rgba(224, 61, 31, 0.6)";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(224, 61, 31, 0.5)";
      ctx.stroke();
      ctx.shadowBlur = 0; // Clear shadow glow

      // Volcanic Peak Text label
      ctx.fillStyle = "rgba(249, 115, 22, 0.75)";
      ctx.font = "bold 9px monospace";
      ctx.fillText(`THARSIS RIDGE LIMIT: ${ridgeHeight}m`, scaleX(ridgeX) - 58, scaleY(ridgeHeight) - 12);

      // --- 6. TARGET LANDING ZONE RENDER ---
      const targetMin = targetRange.min;
      const targetMax = targetRange.max;

      // Bright emerald landing overlay
      ctx.fillStyle = "rgba(16, 185, 129, 0.08)";
      ctx.fillRect(scaleX(targetMin), scaleY(20), scaleX(targetMax) - scaleX(targetMin), scaleY(0) - scaleY(20));
      
      // Animated dashed borders for coordinate target zone
      ctx.strokeStyle = "rgba(16, 185, 129, 0.7)";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.lineDashOffset = -performance.now() / 150;
      ctx.beginPath();
      ctx.moveTo(scaleX(targetMin), scaleY(0));
      ctx.lineTo(scaleX(targetMin), scaleY(20));
      ctx.lineTo(scaleX(targetMax), scaleY(20));
      ctx.lineTo(scaleX(targetMax), scaleY(0));
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // Landing coordinate markings
      ctx.fillStyle = "rgba(16, 185, 129, 0.95)";
      ctx.font = "bold 9px monospace";
      ctx.fillText(`TARGET LANDING COORDINATES [${targetMin}m - ${targetMax}m]`, scaleX(targetMin) - 30, scaleY(20) - 8);

      // --- 7. RADAR COMPUTER SWEEP ---
      radarSweepX.current = (radarSweepX.current + 2.5) % width;
      const radarSweepGrad = ctx.createLinearGradient(radarSweepX.current - 120, 0, radarSweepX.current, 0);
      radarSweepGrad.addColorStop(0, "rgba(6, 182, 212, 0)");
      radarSweepGrad.addColorStop(1, "rgba(6, 182, 212, 0.06)");
      ctx.fillStyle = radarSweepGrad;
      ctx.fillRect(radarSweepX.current - 120, 0, 120, height);

      // --- 7.1 PREDICTIVE TRAJECTORY PATHWAY ---
      if (isPlaying === "PAUSED" || isPlaying === "REPLAY_SCRUBBING") {
        ctx.beginPath();
        const previewAngleRad = (angle * Math.PI) / 180;
        const previewVx = velocity * Math.cos(previewAngleRad);
        const previewVy = velocity * Math.sin(previewAngleRad);
        
        ctx.moveTo(scaleX(0), scaleY(0));
        
        const stepDt = 0.08;
        const maxSteps = 160;
        let px = 0;
        let py = 0;
        let pt = 0;
        
        for (let i = 0; i < maxSteps; i++) {
          pt += stepDt;
          px = previewVx * pt;
          py = (previewVy * pt) - (0.5 * gravity * pt * pt);
          
          if (py < 0) {
            ctx.lineTo(scaleX(px), scaleY(0));
            break;
          }
          
          // Check mountain peak collision
          const ridgeX = 400;
          const ridgeWidth = 120;
          const ridgePeakHeight = 140;
          let mountainHeightAtX = 0;
          if (Math.abs(px - ridgeX) < ridgeWidth) {
            const factor = 1 - Math.abs(px - ridgeX) / ridgeWidth;
            mountainHeightAtX = factor * ridgePeakHeight;
          }
          if (py < mountainHeightAtX) {
            ctx.lineTo(scaleX(px), scaleY(mountainHeightAtX));
            break;
          }
          
          ctx.lineTo(scaleX(px), scaleY(py));
        }
        ctx.strokeStyle = "rgba(6, 182, 212, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // --- 8. LAUNCHER RAILGUN PLATFORM WITH DIRECT SPATIAL DRAG ---
      ctx.save();
      const launcherX = scaleX(0);
      const launcherY = scaleY(0);
      ctx.translate(launcherX, launcherY);
      ctx.rotate(-(angle * Math.PI) / 180);

      // Barrel length is proportional to launch velocity
      const barrelLen = 55 + ((velocity - 30) / (150 - 30)) * 100;

      // Draw outer structural frame of the electromagnetic accelerator rail
      ctx.fillStyle = "rgba(9, 9, 11, 0.9)";
      ctx.strokeStyle = "rgba(6, 182, 212, 0.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(0, -9, barrelLen, 18, 4);
      ctx.fill();
      ctx.stroke();

      // Draw electromagnetic rail coil segments (number depends on velocity)
      const coilCount = Math.floor(4 + ((velocity - 30) / 120) * 8);
      ctx.strokeStyle = "rgba(34, 211, 238, 0.85)";
      ctx.lineWidth = 2;
      for (let i = 0; i < coilCount; i++) {
        const cx = 10 + (i / (coilCount - 1)) * (barrelLen - 24);
        ctx.beginPath();
        ctx.moveTo(cx, -7);
        ctx.lineTo(cx, 7);
        ctx.stroke();
        
        // Dynamic power core glow (pulsating neon blue)
        const alphaPulse = 0.3 + 0.4 * Math.sin(performance.now() / 150 + i);
        ctx.fillStyle = `rgba(34, 211, 238, ${alphaPulse})`;
        ctx.fillRect(cx - 2, -5, 4, 10);
      }

      // Draw glowing accelerator muzzle
      ctx.fillStyle = "rgba(6, 182, 212, 1)";
      ctx.fillRect(barrelLen - 6, -8, 6, 16);

      // --- TARGET DIRECT AIMING HANDLE ---
      const handleRadius = isHovered || isDragging ? 11 : 8;
      ctx.save();
      ctx.shadowBlur = isHovered || isDragging ? 15 : 6;
      ctx.shadowColor = "rgba(34, 211, 238, 0.9)";
      
      // outer glowing ring
      ctx.strokeStyle = isDragging ? "rgba(255, 255, 255, 0.95)" : "rgba(34, 211, 238, 0.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(barrelLen, 0, handleRadius + 4, 0, Math.PI * 2);
      ctx.stroke();

      // inner solid core
      ctx.fillStyle = isDragging ? "#ffffff" : "rgba(6, 182, 212, 0.9)";
      ctx.beginPath();
      ctx.arc(barrelLen, 0, handleRadius - 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();

      // Reticle center dot
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(barrelLen, 0, 2, 0, Math.PI * 2);
      ctx.fill();

      // Label showing theta & v0 directly next to the handle
      ctx.save();
      ctx.translate(barrelLen + 20, 0);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.fillStyle = isDragging ? "#ffffff" : "rgba(34, 211, 238, 0.95)";
      ctx.font = "bold 9px monospace";
      ctx.fillText(`DRAG AIMER [${angle}°, ${velocity}m/s]`, 0, 3);
      ctx.restore();

      // Muzzle Flash Effect
      if (muzzleFlash.current > 0.05) {
        ctx.save();
        ctx.shadowBlur = 35;
        ctx.shadowColor = "rgba(6, 182, 212, 1)";
        ctx.fillStyle = `rgba(186, 242, 255, ${muzzleFlash.current})`;
        ctx.beginPath();
        ctx.arc(barrelLen + 5, 0, 16, -Math.PI / 3, Math.PI / 3);
        ctx.lineTo(barrelLen + 22, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        muzzleFlash.current -= 0.04;
      }
      ctx.restore();

      // Circular magnetic base pivot
      ctx.fillStyle = "rgba(9, 9, 11, 1)";
      ctx.strokeStyle = "rgba(6, 182, 212, 0.9)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(scaleX(0), scaleY(0), 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Angle guidelines (dotted elevation arc)
      ctx.strokeStyle = "rgba(249, 115, 22, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(launcherX, launcherY, 80, 0, -Math.PI / 2, true);
      ctx.stroke();

      // Dotted vector extension line pointing from launcher towards launch trajectory
      ctx.strokeStyle = "rgba(34, 211, 238, 0.2)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 6]);
      ctx.beginPath();
      ctx.moveTo(launcherX, launcherY);
      const extLen = 300;
      ctx.lineTo(launcherX + extLen * Math.cos(angle * Math.PI / 180), launcherY - extLen * Math.sin(angle * Math.PI / 180));
      ctx.stroke();
      ctx.setLineDash([]);

      // --- 9. DISPLACEMENT PARABOLIC TRAILS ---
      const trail = stateRef.current.trail;
      if (trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(scaleX(trail[0].x), scaleY(trail[0].y));
        for (let i = 1; i < trail.length; i++) {
          ctx.lineTo(scaleX(trail[i].x), scaleY(trail[i].y));
        }
        ctx.strokeStyle = "rgba(34, 211, 238, 0.6)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]); // clear dash
      }

      // --- 10. ACTIVE PARTICLES/SPARKS PHYSICS ENGINE ---
      sparks.current.forEach((sp, idx) => {
        sp.x += sp.vx * 0.15;
        sp.y += sp.vy * 0.15;
        // Gravity pulls sparks down slightly over time
        sp.vy -= 0.1;
        sp.alpha -= sp.decay;
        if (sp.alpha <= 0) {
          sparks.current.splice(idx, 1);
          return;
        }

        ctx.save();
        ctx.globalAlpha = sp.alpha;
        ctx.fillStyle = sp.color;
        ctx.beginPath();
        ctx.arc(scaleX(sp.x), scaleY(sp.y), sp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // --- 11. ACTIVE FLYING PROJECTILE WITH VECTOR COCKPIT HUD ---
      const px = stateRef.current.x;
      const py = stateRef.current.y;

      if (px > 0 || py > 0) {
        const cx = scaleX(px);
        const cy = scaleY(py);

        if (stateRef.current.hasCrashed) {
          // Trigger explosion sparks exactly once when crash occurs
          if (!stateRef.current.completedFired) {
            spawnSparks(px, py, false);
            stateRef.current.completedFired = true;
          }
          // Draw charred crater sign
          ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
          ctx.beginPath();
          ctx.arc(cx, cy, 22, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx, cy, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (stateRef.current.hasLanded) {
          // Trigger green celebration fireworks exactly once on success landing
          if (!stateRef.current.completedFired) {
            const isSuccess = px >= targetRange.min && px <= targetRange.max;
            spawnSparks(px, py, isSuccess);
            stateRef.current.completedFired = true;
          }

          const isSuccess = px >= targetRange.min && px <= targetRange.max;
          ctx.fillStyle = isSuccess ? "rgba(16, 185, 129, 0.95)" : "rgba(113, 113, 122, 0.9)";
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.fillRect(cx - 7, cy - 7, 14, 14);
          ctx.strokeRect(cx - 7, cy - 7, 14, 14);
        } else {
          // ACTIVE CARGO BOX CANISTER
          ctx.save();
          ctx.shadowColor = "rgba(6, 182, 212, 0.9)";
          ctx.shadowBlur = 12;
          ctx.fillStyle = "rgba(6, 182, 212, 1)";
          ctx.fillRect(cx - 5, cy - 5, 10, 10);
          ctx.restore();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.strokeRect(cx - 5, cy - 5, 10, 10);

          // Vector analysis overlay (Horizontal vs Vertical arrows)
          const vxVal = stateRef.current.vx;
          const vyVal = stateRef.current.vy;
          const vecScale = 0.55;

          // Horizontal constant vector $v_x$ (Inertia)
          ctx.strokeStyle = "rgba(34, 211, 238, 0.95)";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + vxVal * vecScale, cy);
          ctx.stroke();

          // Arrow tip for $v_x$
          ctx.fillStyle = "rgba(34, 211, 238, 0.95)";
          ctx.beginPath();
          ctx.moveTo(cx + vxVal * vecScale, cy - 3.5);
          ctx.lineTo(cx + vxVal * vecScale + 5, cy);
          ctx.lineTo(cx + vxVal * vecScale, cy + 3.5);
          ctx.fill();

          // Vertical changing vector $v_y$ (Gravity force)
          ctx.strokeStyle = "rgba(249, 115, 22, 0.95)";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx, cy - vyVal * vecScale);
          ctx.stroke();

          // Arrow tip for $v_y$
          ctx.fillStyle = "rgba(249, 115, 22, 0.95)";
          ctx.beginPath();
          ctx.moveTo(cx - 3.5, cy - vyVal * vecScale);
          ctx.lineTo(cx, cy - vyVal * vecScale - (vyVal >= 0 ? 5 : -5));
          ctx.lineTo(cx + 3.5, cy - vyVal * vecScale);
          ctx.fill();

          // Live digital value tags drifting with capsule
          ctx.fillStyle = "rgba(34, 211, 238, 1)";
          ctx.font = "bold 9px monospace";
          ctx.fillText(`vx:${Math.round(vxVal)}m/s`, cx + vxVal * vecScale - 10, cy - 10);

          ctx.fillStyle = "rgba(249, 115, 22, 1)";
          ctx.font = "bold 9px monospace";
          ctx.fillText(`vy:${Math.round(vyVal)}m/s`, cx + 8, cy - vyVal * vecScale + 3);
        }
      }

      // Ground limit line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(scaleX(0), scaleY(0));
      ctx.lineTo(scaleX(900), scaleY(0));
      ctx.stroke();

      // --- DRAW PREDICTED LANDING FLAG ---
      if (predictionFlagX !== null) {
        const flagXScaled = scaleX(predictionFlagX);
        const flagYScaled = scaleY(0);

        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(249, 115, 22, 0.8)";

        // Draw flagpole
        ctx.strokeStyle = "rgba(249, 115, 22, 0.9)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(flagXScaled, flagYScaled);
        ctx.lineTo(flagXScaled, flagYScaled - 25);
        ctx.stroke();

        // Draw flag cloth
        ctx.fillStyle = "rgba(249, 115, 22, 0.95)";
        ctx.beginPath();
        ctx.moveTo(flagXScaled, flagYScaled - 25);
        ctx.lineTo(flagXScaled + 14, flagYScaled - 19);
        ctx.lineTo(flagXScaled, flagYScaled - 13);
        ctx.closePath();
        ctx.fill();

        // Draw prediction label
        ctx.fillStyle = "#f97316";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`HYPOTHESIS: ${predictionFlagX}m`, flagXScaled, flagYScaled - 32);

        ctx.restore();
      }

      // Draw active prediction guidelines prompt on canvas
      if (cognitiveLoopState === "PREDICT" && predictionFlagX === null) {
        ctx.save();
        ctx.fillStyle = "rgba(34, 211, 238, 0.85)";
        ctx.font = "italic 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText("🚩 TAP OR CLICK THE GROUND TO PLACE YOUR PREDICTED LANDING SPOT FLAG", width / 2, height - 20);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [readouts, targetRange, angle, velocity, gravity, isHovered, isDragging]);


  return (
    <div className="w-full flex flex-col gap-4">
      {/* Simulation Stage Container */}
      <div className="relative w-full rounded-2xl border border-white/10 bg-black/45 overflow-hidden backdrop-blur-xl shadow-inner">
        {/* Sky glow flare */}
        <div className="absolute top-0 left-1/4 right-1/4 h-24 bg-gradient-to-b from-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

        <canvas
          ref={canvasRef}
          width={800}
          height={320}
          className="w-full h-auto block touch-none"
          style={{ cursor: isDragging ? "grabbing" : isHovered ? "grab" : "default" }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUpOrLeave}
        />

        {/* Live Vector Telemetry HUD Overlay (Apple Vision/Iron Man HUD) */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 font-mono text-xs pointer-events-none">
          <div className="px-3 py-2 rounded bg-gray-950/80 border border-cyan-500/20 text-cyan-400 flex flex-col gap-1 backdrop-blur-md">
            <span className="text-[10px] text-cyan-500/60 uppercase tracking-widest font-bold">Orbital Telemetry</span>
            <div className="flex justify-between gap-6">
              <span>Position X:</span>
              <span className="text-white font-bold">{Math.round(readouts.x)} m</span>
            </div>
            <div className="flex justify-between gap-6">
              <span>Position Y:</span>
              <span className="text-white font-bold">{Math.round(readouts.y)} m</span>
            </div>
            <div className="flex justify-between gap-6">
              <span>Apex Height:</span>
              <span className="text-white font-bold">{Math.round(readouts.peakHeight)} m</span>
            </div>
            <div className="flex justify-between gap-6">
              <span>Flight Time:</span>
              <span className="text-white font-bold">{readouts.t.toFixed(2)} s</span>
            </div>
          </div>
        </div>

        {/* Vector Legend Overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5 font-mono text-[10px] pointer-events-none">
          <div className="px-3 py-1.5 rounded bg-gray-950/85 border border-white/5 flex flex-col gap-1 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-cyan-400 rounded-full" />
              <span className="text-cyan-400 uppercase tracking-widest">Inertial $v_x$ (Constant)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-orange-500 rounded-full" />
              <span className="text-orange-400 uppercase tracking-widest">Gravitational $v_y$ (Accelerated)</span>
            </div>
          </div>
        </div>
      </div>

      {/* CHRONO SCRUBBING & REPLAY CONTROL PANEL */}
      <div className="px-5 py-3 rounded-2xl border border-white/5 bg-gray-950/70 backdrop-blur-xl flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Main Playback state controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReset}
              className="p-2 rounded bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-gray-400 hover:text-white"
              title="Reset"
            >
              <RotateCcw size={16} />
            </button>

            {/* Frame step backward */}
            <button
              onClick={stepFrameBackward}
              disabled={historyFrames.length === 0}
              className="p-2 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 active:scale-95 transition-all text-gray-400 hover:text-white"
              title="Step Frame Backward"
            >
              <ChevronLeft size={16} />
            </button>

            {isPlaying === "PLAYING" ? (
              <button
                onClick={() => setPlaying("PAUSED")}
                className="px-4 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Pause size={12} fill="currentColor" /> PAUSE
              </button>
            ) : (
              <button
                onClick={() => setPlaying("PLAYING")}
                className="px-4 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Play size={12} fill="currentColor" /> FLIGHT EXECUTE
              </button>
            )}

            {/* Frame step forward */}
            <button
              onClick={stepFrameForward}
              disabled={historyFrames.length === 0}
              className="p-2 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 active:scale-95 transition-all text-gray-400 hover:text-white"
              title="Step Frame Forward"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Chronological scrubber timeline */}
          <div className="flex-1 w-full flex items-center gap-3">
            <span className="font-mono text-[10px] text-gray-400 select-none">0.00s</span>
            <input
              type="range"
              min={0}
              max={Math.max(0, historyFrames.length - 1)}
              value={currentFrameIndex}
              onChange={(e) => {
                const idx = parseInt(e.target.value, 10);
                if (!isNaN(idx)) scrubToFrame(idx);
              }}
              disabled={historyFrames.length === 0}
              className="flex-1 accent-cyan-400 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            />
            <span className="font-mono text-[10px] text-cyan-400 font-bold select-none">
              {currentTime.toFixed(2)}s
            </span>
          </div>

          {/* Playback speed rates (slow-mo, normal, fast forward) */}
          <div className="flex items-center gap-1">
            {[0.5, 1, 2].map((rate) => (
              <button
                key={rate}
                onClick={() => setPlaybackRate(rate)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono border transition-all ${
                  playbackRate === rate
                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                    : "bg-white/5 text-gray-400 border-transparent hover:bg-white/10"
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Readout telemetry block */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-white/5 pt-2 font-mono text-[10px] text-gray-400">
          <div>
            <span>Launch Velocity: </span>
            <span className="text-white font-bold">{velocity} m/s</span>
          </div>
          <div>
            <span>Elevation Angle: </span>
            <span className="text-white font-bold">{angle}°</span>
          </div>
          <div>
            <span>Martian Gravity: </span>
            <span className="text-white font-bold">{gravity} m/s²</span>
          </div>
          <div>
            <span>Impact Target coordinate: </span>
            <span className="text-emerald-400 font-bold">
              {readouts.landingX > 0 ? `${Math.round(readouts.landingX)}m` : "PENDING IMPACT"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

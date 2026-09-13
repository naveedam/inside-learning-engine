/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Mission } from "../../types";
import { useEngineStore } from "../../core/stores";
import { globalEventBus } from "../../core/EventBus";
import { ChevronLeft, CheckCircle, Sparkles, Award } from "lucide-react";
import MentorPortrait from "../ui/MentorPortrait";

interface StructureExplorerViewProps {
  mission: Mission;
}

// Fisher-Yates shuffle, seeded only by mount (stable across re-renders via useState initializer)
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function StructureExplorerView({ mission }: StructureExplorerViewProps) {
  const { setView, awardXP, completeMission, unlockBadge, completedMissions } = useEngineStore();

  const config = mission.structureExplorerConfig;
  const briefingStep = mission.steps.find((s) => s.type === "BRIEFING");
  const debriefStep = mission.steps.find((s) => s.type === "DEBRIEF");
  const primaryMentor = mission.socraticMentorDialogue[0];

  const [identifiedIds, setIdentifiedIds] = useState<string[]>([]);
  const [activeRegionId, setActiveRegionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ regionId: string; correct: boolean; selectedOption: string } | null>(null);
  const [rewardsClaimed, setRewardsClaimed] = useState(false);

  // Stable shuffled option order per region, computed once on mount
  const optionsByRegion = useMemo(() => {
    const map: Record<string, string[]> = {};
    config?.regions.forEach((r) => {
      map[r.id] = shuffle([r.label, ...r.distractors]);
    });
    return map;
  }, [config]);

  if (!config) {
    return (
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-10 text-center">
        <p className="text-red-400 font-mono text-sm">
          STRUCTURE_EXPLORER configuration missing for this mission.
        </p>
      </main>
    );
  }

  const allIdentified = identifiedIds.length === config.regions.length;
  const alreadyCompleted = completedMissions.includes(mission.id);

  const activeRegion = config.regions.find((r) => r.id === activeRegionId);

  const handleRegionClick = (regionId: string) => {
    if (identifiedIds.includes(regionId)) return;
    setActiveRegionId(regionId);
    setFeedback(null);
    globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "CLICK" } });
  };

  const handleOptionSelect = (regionId: string, option: string) => {
    const region = config.regions.find((r) => r.id === regionId);
    if (!region) return;

    if (option === region.label) {
      setIdentifiedIds((prev) => [...prev, regionId]);
      setFeedback({ regionId, correct: true, selectedOption: option });
      globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "SUCCESS" } });
    } else {
      setFeedback({ regionId, correct: false, selectedOption: option });
      globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "FAILURE" } });
    }
  };

  const handleClaimRewards = () => {
    if (rewardsClaimed || alreadyCompleted) {
      setView("mission-details");
      return;
    }
    awardXP(mission.rewards.xp);
    completeMission(mission.id);
    const badge = mission.successConditions.badgeUnlocked;
    if (badge) {
      unlockBadge(badge.id, badge.name);
    }
    setRewardsClaimed(true);
    globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "SUCCESS" } });
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 relative flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 gap-2">
        <button
          onClick={() => {
            setView("mission-details");
            globalEventBus.publish({ type: "UI_SOUND_TRIGGER", payload: { cue: "CLICK" } });
          }}
          className="px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-400 hover:text-white border border-white/5 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <ChevronLeft size={14} />
          <span className="hidden xs:inline">ABORT TO</span> MISSION PROFILE
        </button>
        <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase">
          {identifiedIds.length} / {config.regions.length} STRUCTURES IDENTIFIED
        </div>
      </div>

      {/* Briefing narrative */}
      {briefingStep && !allIdentified && (
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <h2 className="text-lg font-bold text-white mb-2">{config.diagramTitle}</h2>
          <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
            {(briefingStep.content as any)?.narrative}
          </div>
        </div>
      )}

      {!allIdentified ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Diagram */}
          <div className="rounded-2xl border border-white/10 bg-black/60 p-4 flex items-center justify-center min-h-[400px]">
            <svg
              viewBox={config.svgViewBox}
              className="w-full h-auto max-h-[560px]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g dangerouslySetInnerHTML={{ __html: config.backgroundSvg }} />
              {config.regions.map((region) => {
                const isIdentified = identifiedIds.includes(region.id);
                const isActive = activeRegionId === region.id;
                const commonProps = {
                  key: region.id,
                  onClick: () => handleRegionClick(region.id),
                  className: "cursor-pointer transition-all",
                  fill: isIdentified ? "rgba(16,185,129,0.25)" : isActive ? "rgba(34,211,238,0.3)" : "rgba(34,211,238,0.12)",
                  stroke: isIdentified ? "#10b981" : "#22d3ee",
                  strokeWidth: isIdentified ? 2 : isActive ? 3 : 1.5,
                  strokeDasharray: isIdentified ? undefined : "4 3"
                };
                if (region.shapeType === "circle") {
                  return (
                    <circle
                      {...commonProps}
                      cx={region.cx}
                      cy={region.cy}
                      r={region.r}
                    />
                  );
                }
                return (
                  <rect
                    {...commonProps}
                    x={region.x}
                    y={region.y}
                    width={region.width}
                    height={region.height}
                    rx={4}
                  />
                );
              })}
            </svg>
          </div>

          {/* Region quiz panel */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-5 flex flex-col gap-4">
            {primaryMentor && (
              <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                <MentorPortrait mentorId={primaryMentor.avatar} size={36} glow={false} showReticle={false} />
                <div>
                  <div className="text-sm font-bold text-white">{primaryMentor.character}</div>
                  <div className="text-[11px] text-gray-500 font-mono">SOCRATIC GUIDE</div>
                </div>
              </div>
            )}

            {activeRegion ? (
              <div className="flex flex-col gap-3">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  Identify this structure
                </div>
                <div className="flex flex-col gap-2">
                  {optionsByRegion[activeRegion.id]?.map((option) => {
                    const isCorrectOption = option === activeRegion.label;
                    const showFeedback = feedback?.regionId === activeRegion.id;
                    const isThisOptionSelected = showFeedback && feedback?.selectedOption === option;
                    const isIdentified = identifiedIds.includes(activeRegion.id);
                    return (
                      <button
                        key={option}
                        onClick={() => handleOptionSelect(activeRegion.id, option)}
                        disabled={isIdentified}
                        className={`text-left px-4 py-3 min-h-[44px] rounded-xl border text-sm font-medium transition-all active:scale-98 cursor-pointer disabled:cursor-default ${
                          showFeedback && isCorrectOption && (isThisOptionSelected || isIdentified)
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                            : isThisOptionSelected && !feedback?.correct
                            ? "bg-red-500/10 border-red-500/40 text-red-300"
                            : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {feedback?.regionId === activeRegion.id && (
                  <div
                    className={`text-xs rounded-lg p-3 font-mono ${
                      feedback.correct
                        ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                        : "bg-red-500/10 text-red-300 border border-red-500/30"
                    }`}
                  >
                    {feedback.correct ? (
                      <span>✓ Correct — {activeRegion.explanation}</span>
                    ) : (
                      <span>Not quite. Take another look and try again.</span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500 font-mono text-center py-8">
                Click a highlighted region on the diagram to identify it.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle size={20} />
            <span className="font-mono text-sm uppercase tracking-widest">
              All Structures Identified
            </span>
          </div>
          {debriefStep && (
            <div className="text-sm text-gray-200 whitespace-pre-line leading-relaxed">
              {(debriefStep.content as any)?.narrative}
            </div>
          )}
          {mission.scientificDiscoveries?.[0] && (
            <div className="rounded-xl bg-black/40 border border-white/10 p-4 flex gap-3">
              <Sparkles size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-white mb-1">
                  {mission.scientificDiscoveries[0].title}
                </div>
                <div className="text-xs text-gray-400">
                  {mission.scientificDiscoveries[0].scientificInsight}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleClaimRewards}
            className="mt-2 py-3 min-h-[44px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
          >
            <Award size={14} />
            {rewardsClaimed || alreadyCompleted ? "RETURN TO MISSION PROFILE" : `CLAIM ${mission.rewards.xp} XP`}
          </button>
        </div>
      )}
    </main>
  );
}

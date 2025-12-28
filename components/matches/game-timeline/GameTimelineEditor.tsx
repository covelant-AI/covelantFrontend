"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import DraggableTimeline from "./DraggableTimeline";
import TimeInputs from "./TimeInputs";
import ScoreDisplay from "./ScoreDisplay";

import type { GameTimelineEditorProps, VideoSection, ScoreValue } from "../types/gameTimelineTypes";
import { computeTennisGameScoreAtSection } from "@/components/matches/utils/tennisScoring";
import { formatSecondsToTime, timeToSeconds } from "@/components/matches/utils/time";
import { buildUiPlayers } from "@/components/matches/utils/gameTimelineEditorHelper";

import { updateSectionTime as updateSectionTimeApi } from "@/components/matches/services/gameTimelineApi";

export default function GameTimelineEditor({
  playerOne,
  playerTwo,
  videoSections: initialSections,
  onSeekVideo,
}: GameTimelineEditorProps) {
  const [videoSections, setVideoSections] = useState<VideoSection[]>(initialSections);

  const players = useMemo(() => buildUiPlayers(playerOne, playerTwo), [playerOne, playerTwo]);

  const firstSection = videoSections[0];
  const lastSection = videoSections[videoSections.length - 1];

  const [selectedSection, setSelectedSection] = useState<VideoSection | null>(null);

  const [startTime, setStartTime] = useState<string>(
    firstSection ? formatSecondsToTime(firstSection.startTime) : "00:00"
  );
  const [endTime, setEndTime] = useState<string>(
    lastSection ? formatSecondsToTime(lastSection.endTime) : "00:00"
  );

  const [scoreP1, setScoreP1] = useState<ScoreValue>(0);
  const [scoreP2, setScoreP2] = useState<ScoreValue>(0);

  const [isSaving, setIsSaving] = useState(false);

  const handleSectionSelect = useCallback(
    (sectionId: number) => {
      const section = videoSections.find((s) => s.id === sectionId);
      if (!section) return;

      setSelectedSection(section);
      setStartTime(formatSecondsToTime(section.startTime));
      setEndTime(formatSecondsToTime(section.endTime));

      onSeekVideo?.(section.startTime);

      const score = computeTennisGameScoreAtSection(videoSections, sectionId, {
        defaultWinner: "top",
      });

      setScoreP1(score.top);
      setScoreP2(score.bottom);
    },
    [videoSections, onSeekVideo]
  );

  const updateSectionTime = useCallback(async () => {
    if (!selectedSection) return;

    setIsSaving(true);

    const payload = {
      id: selectedSection.id,
      startTime: timeToSeconds(startTime),
      endTime: timeToSeconds(endTime),
    };

    try {
      const ok = await updateSectionTimeApi(payload);
      if (!ok) {
        alert("Failed to update section");
        return;
      }

      setVideoSections((prev) =>
        prev.map((s) => (s.id === payload.id ? { ...s, ...payload } : s))
      );
    } catch {
      alert("Server update failed");
    } finally {
      setIsSaving(false);
    }
  }, [selectedSection, startTime, endTime]);

  useEffect(() => {
    setVideoSections(initialSections);
  }, [initialSections]);

  return (
    <div className="w-full rounded-3xl bg-white shadow-lg md:p-6 mb-6">
      <div className="flex flex-col mx-8 gap-4">
        <DraggableTimeline
          videoSections={videoSections}
          players={players}
          title="Game Timeline"
          onSectionSelect={handleSectionSelect}
        />

        <div className="flex flex-col items-stretch justify-between md:flex-row">
          <TimeInputs
            startTime={startTime}
            endTime={endTime}
            onStartChange={setStartTime}
            onEndChange={setEndTime}
            onSave={updateSectionTime}
            isSaving={isSaving}
          />

          <ScoreDisplay players={players} scoreP1={scoreP1} scoreP2={scoreP2} />
        </div>
      </div>
    </div>
  );
}

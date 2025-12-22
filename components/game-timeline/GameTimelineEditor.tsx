// components/game-timeline/GameTimelineEditor.tsx
"use client";

import React, { useState } from "react";
import { Player } from "./types";
import DraggableTimeline from "./DraggableTimeline";
import TimeInputs from "./TimeInputs";
import ScoreDisplay from "./ScoreDisplay";
import { GameTimelineEditorProps, VideoSection } from "./types";

const formatSecondsToTime = (seconds: number): string => {
  const total = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const timeToSeconds = (time: string): number => {
  const [m, s] = time.split(":").map(Number);
  return (m || 0) * 60 + (s || 0);
};

// convert raw point count → tennis 0/15/30/40
const pointsToTennisScore = (points: number): number =>
  points === 0 ? 0 : points === 1 ? 15 : points === 2 ? 30 : 40;

export default function GameTimelineEditor({
  playerOne,
  playerTwo,
  videoSections: initialSections,
  onSeekVideo,
}: GameTimelineEditorProps) {
  const [videoSections, setVideoSections] = useState<VideoSection[]>(initialSections);

  const firstSection = videoSections[0];
  const lastSection = videoSections[videoSections.length - 1];

  const [selectedSection, setSelectedSection] = useState<VideoSection | null>(null);

  const [startTime, setStartTime] = useState<string>(
    firstSection ? formatSecondsToTime(firstSection.startTime) : "00:00"
  );
  const [endTime, setEndTime] = useState<string>(
    lastSection ? formatSecondsToTime(lastSection.endTime) : "00:00"
  );

  const [scoreP1, setScoreP1] = useState<number>(0);
  const [scoreP2, setScoreP2] = useState<number>(0);

  const [isSaving, setIsSaving] = useState(false);

  // UI Players
  const players: [Player, Player] = [
    {
      id: playerOne.id,
      name: `${playerOne.firstName} ${playerOne.lastName}`,
      short: playerOne.firstName[0] ?? "P1",
      bg: "bg-emerald-500",
      ring: "ring-teal-600",
      avatar: playerOne.avatar,
    },
    {
      id: playerTwo.id,
      name: `${playerTwo.firstName} ${playerTwo.lastName}`,
      short: playerTwo.firstName[0] ?? "P2",
      bg: "bg-rose-500",
      ring: "ring-red-300",
      avatar: playerTwo.avatar,
    },
  ];

  /* ------------------------------------------------------------
     🟢 WHEN USER SELECTS A TIMELINE SECTION
  ------------------------------------------------------------ */
  const handleSectionSelect = (sectionId: number) => {
    const section = videoSections.find((s) => s.id === sectionId);
    if (!section) return;

    setSelectedSection(section);

    setStartTime(formatSecondsToTime(section.startTime));
    setEndTime(formatSecondsToTime(section.endTime));

    onSeekVideo?.(section.startTime);

    let topPoints = 0;
    let bottomPoints = 0;

    for (const s of videoSections) {
      const winner = s.summary?.player_won_point ?? "top"; // default = top always

      if (winner === "top") topPoints++;
      else if (winner === "bottom") bottomPoints++;

      if (s.id === sectionId) break;
    }

    setScoreP1(pointsToTennisScore(topPoints));
    setScoreP2(pointsToTennisScore(bottomPoints));
  };


  /* ------------------------------------------------------------
     🔥 SAVE UPDATED SECTION TIME → /api/updateSection
  ------------------------------------------------------------ */
  const updateSectionTime = async () => {
    if (!selectedSection) return;

    setIsSaving(true);

    const payload = {
      id: selectedSection.id,
      startTime: timeToSeconds(startTime),
      endTime: timeToSeconds(endTime),
    };

    fetch("/api/updateSections", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return alert("Failed to update section");

        // 🔥 Update UI instantly
        setVideoSections((prev) =>
          prev.map((s) =>
            s.id === payload.id ? { ...s, ...payload } : s
          )
        );
      })
      .catch(() => alert("Server update failed"))
      .finally(() => setIsSaving(false));
  };


  return (
    <div className="w-full rounded-3xl bg-white shadow-lg md:p-6 ">
      <div className="flex flex-col gap-4">

        <DraggableTimeline
          videoSections={videoSections}
          players={players}
          title="Game 1"
          onSectionSelect={handleSectionSelect}
        />

        <div className="mt-2 flex flex-col items-stretch justify-between gap-4 border-t border-slate-100 pt-4 md:flex-row">

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

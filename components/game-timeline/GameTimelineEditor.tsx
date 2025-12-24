// ✅ GameTimelineEditor.tsx (update the selection handler to use the helper)
"use client";

import React, { useState } from "react";
import { Player } from "./types";
import DraggableTimeline from "./DraggableTimeline";
import TimeInputs from "./TimeInputs";
import ScoreDisplay from "./ScoreDisplay";
import { GameTimelineEditorProps, VideoSection } from "./types";
import { computeTennisGameScoreAtSection } from "./tennisScoring"; // ✅ NEW

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

  const [scoreP1, setScoreP1] = useState<number | "AD">(0);
  const [scoreP2, setScoreP2] = useState<number | "AD">(0);

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

    // ✅ Use tennis scoring helper (handles deuce + game reset)
    const score = computeTennisGameScoreAtSection(videoSections, sectionId, {
      defaultWinner: "top",
    });

    // top -> P1, bottom -> P2
    setScoreP1(score.top);
    setScoreP2(score.bottom);
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

        setVideoSections((prev) =>
          prev.map((s) => (s.id === payload.id ? { ...s, ...payload } : s))
        );
      })
      .catch(() => alert("Server update failed"))
      .finally(() => setIsSaving(false));
  };

  return (
    <div className="w-full rounded-3xl bg-white shadow-lg md:p-6 mb-6">
      <div className="flex flex-col mx-8 gap-4">
        <DraggableTimeline
          videoSections={videoSections}
          players={players}
          title="Game Timeline"
          onSectionSelect={handleSectionSelect}
        />

        <div className=" flex flex-col items-stretch justify-between md:flex-row">
          <TimeInputs
            startTime={startTime}
            endTime={endTime}
            onStartChange={setStartTime}
            onEndChange={setEndTime}
            onSave={updateSectionTime}
            isSaving={isSaving}
          />

          <ScoreDisplay players={players} scoreP1={scoreP1 as any} scoreP2={scoreP2 as any} />
        </div>
      </div>
    </div>
  );
}

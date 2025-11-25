"use client";

import React, { useState } from "react";
import { Player, TimelineEvent } from "./types";
import DraggableTimeline from "./DraggableTimeline";
import ScoreEditor from "./ScoreEditor";
import TimeInputs from "./TimeInputs";
import ScoreDisplay from "./ScoreDisplay";

// Mock data – swap this out for props / API data
const playersMock: Player[] = [
  { id: 1, name: "Player A", short: "A", bg: "bg-emerald-500", ring: "ring-emerald-300" },
  { id: 2, name: "Player B", short: "B", bg: "bg-rose-500", ring: "ring-rose-300" },
];

const eventsMock: TimelineEvent[] = [
  { id: 1, playerId: 1 },
  { id: 2, playerId: 2 },
  { id: 3, playerId: 1 },
  { id: 4, playerId: 1 },
  { id: 5, playerId: 2 },
  { id: 6, playerId: 2 },
  { id: 7, playerId: 2 },
  { id: 8, playerId: 2 },
  { id: 9, playerId: 2 },
];

const GameTimelineEditor: React.FC = () => {
  const [startTime, setStartTime] = useState<string>("22:55");
  const [endTime, setEndTime] = useState<string>("23:55");

  const [scoreP1, setScoreP1] = useState<number>(15);
  const [scoreP2, setScoreP2] = useState<number>(30);

  // In a real app, inject via props:
  const players: [Player, Player] = [playersMock[0], playersMock[1]];
  const events: TimelineEvent[] = eventsMock;

  return (
    <div className="w-full rounded-3xl bg-white shadow-lg md:p-6">
      <div className="flex flex-col gap-4">
        {/* TOP: Timeline + Score editor */}
        <DraggableTimeline events={events} players={players} title="Game 1" />

        {/* BOTTOM: Time inputs + compact score */}
        <div className="mt-2 flex flex-col items-stretch justify-between gap-4 border-t border-slate-100 pt-4 md:flex-row">
          <TimeInputs
            startTime={startTime}
            endTime={endTime}
            onStartChange={setStartTime}
            onEndChange={setEndTime}
          />
                    <ScoreEditor
            players={players}
            scoreP1={scoreP1}
            scoreP2={scoreP2}
            setScoreP1={setScoreP1}
            setScoreP2={setScoreP2}
          />
          <ScoreDisplay players={players} scoreP1={scoreP1} scoreP2={scoreP2} />
        </div>
      </div>
    </div>
  );
};

export default GameTimelineEditor;

"use client";

import React from "react";
import { Player } from "./types";
import PlayerAvatar from "./PlayerAvatar";

export interface ScoreDisplayProps {
  players: [Player, Player];
  scoreP1: number;
  scoreP2: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  players,
  scoreP1,
  scoreP2,
}) => {
  const [player1, player2] = players;

  return (
    <div className="flex items-center gap-6 md:justify-end">
      <div className="flex items-center gap-2">
        <PlayerAvatar player={player1} />
        <span className="text-xl font-semibold text-slate-900">{scoreP1}</span>
      </div>
      <div className="h-8 w-px bg-slate-200" />
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold text-slate-900">{scoreP2}</span>
        <PlayerAvatar player={player2} />
      </div>
    </div>
  );
};

export default ScoreDisplay;

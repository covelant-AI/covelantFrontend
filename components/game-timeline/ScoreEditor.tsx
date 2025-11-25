"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Player } from "./types";
import PlayerAvatar from "./PlayerAvatar";

export interface ScoreEditorProps {
  players: [Player, Player]; // exactly 2 players
  scoreP1: number;
  scoreP2: number;
  setScoreP1: Dispatch<SetStateAction<number>>;
  setScoreP2: Dispatch<SetStateAction<number>>;
}

const ScoreEditor: React.FC<ScoreEditorProps> = ({
  players,
  scoreP1,
  scoreP2,
  setScoreP1,
  setScoreP2,
}) => {
  const [player1, player2] = players;

  const handleScoreChange = (
    setter: Dispatch<SetStateAction<number>>,
    value: string
  ) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;
    setter(parsed);
  };

  return (
    <div className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:mt-0 md:w-56">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">
          Score editor
        </span>
        <span className="text-[11px] uppercase tracking-wide text-slate-400">
          Game 1
        </span>
      </div>

      <div className="space-y-3">
        {/* Player 1 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PlayerAvatar player={player1} />
            <span className="text-xs font-medium text-slate-700">
              {player1.name}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="h-6 w-6 rounded-full border border-slate-300 text-xs"
              onClick={() => setScoreP1((v) => Math.max(0, v - 5))}
            >
              −
            </button>
            <input
              type="number"
              value={scoreP1}
              onChange={(e) => handleScoreChange(setScoreP1, e.target.value)}
              className="w-10 rounded-md border border-slate-300 bg-white text-center text-sm font-semibold text-slate-800"
            />
            <button
              type="button"
              className="h-6 w-6 rounded-full border border-slate-300 text-xs"
              onClick={() => setScoreP1((v) => v + 5)}
            >
              +
            </button>
          </div>
        </div>

        {/* Player 2 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PlayerAvatar player={player2} />
            <span className="text-xs font-medium text-slate-700">
              {player2.name}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="h-6 w-6 rounded-full border border-slate-300 text-xs"
              onClick={() => setScoreP2((v) => Math.max(0, v - 5))}
            >
              −
            </button>
            <input
              type="number"
              value={scoreP2}
              onChange={(e) => handleScoreChange(setScoreP2, e.target.value)}
              className="w-10 rounded-md border border-slate-300 bg-white text-center text-sm font-semibold text-slate-800"
            />
            <button
              type="button"
              className="h-6 w-6 rounded-full border border-slate-300 text-xs"
              onClick={() => setScoreP2((v) => v + 5)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreEditor;

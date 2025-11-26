// components/game-timeline/ScoreDisplay.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Player } from "./types";
import PlayerAvatar from "./PlayerAvatar";
import { ScoreColumn } from "./ScoreColumn";
import {
  ScoreState,
  numericToToken,
  hasWinLoss,
  applyUp,
  applyDown,
} from "@/util/helpers/tennisScoring";

export interface ScoreDisplayProps {
  players: [Player, Player];
  /** numeric scores used as initial values; 0,15,30,40 only */
  scoreP1: number;
  scoreP2: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  players,
  scoreP1,
  scoreP2,
}) => {
  const [player1, player2] = players;

  const [state, setState] = useState<ScoreState>({
    score1: numericToToken(scoreP1),
    score2: numericToToken(scoreP2),
    prevScore1: null,
    prevScore2: null,
  });

  // 🔁 When parent changes numeric scores (e.g. on section click),
  // reset the internal state to match.
  useEffect(() => {
    setState({
      score1: numericToToken(scoreP1),
      score2: numericToToken(scoreP2),
      prevScore1: null,
      prevScore2: null,
    });
  }, [scoreP1, scoreP2]);

  const { score1, score2 } = state;
  const winLossVisible = hasWinLoss(score1, score2);

  const handleUp = (playerIndex: 1 | 2) => {
    setState((prev) => applyUp(prev, playerIndex));
  };

  const handleDown = (playerIndex: 1 | 2) => {
    setState((prev) => applyDown(prev, playerIndex));
  };

  return (
    <div className="flex items-center gap-6 md:justify-end">
      {/* Player 1: Avatar + score column */}
      <div className="flex items-center gap-2">
        <PlayerAvatar player={player1} />
        <ScoreColumn
          score={score1}
          showUp={!winLossVisible}
          onUp={() => handleUp(1)}
          onDown={() => handleDown(1)}
        />
      </div>

      <div className="h-8 w-px bg-slate-200" />

      {/* Player 2: score column + Avatar */}
      <div className="flex items-center gap-2">
        <ScoreColumn
          score={score2}
          showUp={!winLossVisible}
          onUp={() => handleUp(2)}
          onDown={() => handleDown(2)}
        />
        <PlayerAvatar player={player2} />
      </div>
    </div>
  );
};

export default ScoreDisplay;

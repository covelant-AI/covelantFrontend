"use client";

import React, { useEffect, useMemo, useState } from "react";
import PlayerAvatar from "./PlayerAvatar";
import { ScoreColumn } from "./ScoreColumn";

import {
  ScoreState,
  numericToToken,
  hasWinLoss,
  applyUp,
  applyDown,
} from "@/util/helpers/tennisScoring";

import type { Player as TimelinePlayer } from "../types/gameTimelineTypes";
import {ScoreValue} from "@/components/matches/types/gameTimelineTypes";

type ScoreDisplayProps = {
  players: [TimelinePlayer, TimelinePlayer];
  scoreP1: ScoreValue;
  scoreP2: ScoreValue;
};

//  keep conversion here so ScoreDisplay doesn't depend on token internals
function scoreValueToNumber(value: ScoreValue): number {
  return value === "AD" ? 50 : value;
}

function buildScoreState(scoreP1: ScoreValue, scoreP2: ScoreValue): ScoreState {
  return {
    score1: numericToToken(scoreValueToNumber(scoreP1)),
    score2: numericToToken(scoreValueToNumber(scoreP2)),
    prevScore1: null,
    prevScore2: null,
  };
}

export default function ScoreDisplay({ players, scoreP1, scoreP2 }: ScoreDisplayProps) {
  const [player1, player2] = players;

  // initialize once from props
  const initialState = useMemo(() => buildScoreState(scoreP1, scoreP2), []);
  const [state, setState] = useState<ScoreState>(initialState);

  // When parent changes (section click), reset internal state
  useEffect(() => {
    setState(buildScoreState(scoreP1, scoreP2));
  }, [scoreP1, scoreP2]);

  const { score1, score2 } = state;
  const winLossVisible = hasWinLoss(score1, score2);

  const handleUp = (playerIndex: 1 | 2) => setState((prev) => applyUp(prev, playerIndex));
  const handleDown = (playerIndex: 1 | 2) => setState((prev) => applyDown(prev, playerIndex));

  return (
    <div className="flex items-center gap-6 md:justify-end">
      {/* Player 1 */}
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

      {/* Player 2 */}
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
}

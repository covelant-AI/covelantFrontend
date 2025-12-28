// components/game-timeline/ScoreColumn.tsx
"use client";

import React from "react";
import type { ScoreToken } from "@/util/helpers/tennisScoring";

export interface ScoreColumnProps {
  score: ScoreToken;
  showUp: boolean;
  onUp: () => void;
  onDown: () => void;
}

export const ScoreColumn: React.FC<ScoreColumnProps> = ({
  score,
  showUp,
  onUp,
  onDown,
}) => (
  <div className="flex flex-col items-center justify-center">
    {showUp && (
      <button
        type="button"
        onClick={onUp}
        className="text-xs text-slate-600 hover:scale-110 transition-transform"
      >
        ▲
      </button>
    )}
    <span className="text-xl font-semibold text-slate-900 min-w-[2.5rem] text-center">
      {score}
    </span>
    <button
      type="button"
      onClick={onDown}
      className="text-xs text-slate-600 hover:scale-110 transition-transform"
    >
      ▼
    </button>
  </div>
);

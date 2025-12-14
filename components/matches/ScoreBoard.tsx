"use client";

import React from 'react';

interface Player {
  name: string;
  score: number;
}

interface ScoreBoardProps {
  topPlayer: Player;
  bottomPlayer: Player;
}

export default function ScoreBoard({ topPlayer, bottomPlayer }: ScoreBoardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <div className="space-y-3">
        {/* Top Player */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#42B6B1]"></span>
            <span className="font-semibold text-gray-800 text-sm">{topPlayer.name}</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">{topPlayer.score}</span>
        </div>

        {/* Bottom Player */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FE8E25]"></span>
            <span className="font-semibold text-gray-800 text-sm">{bottomPlayer.name}</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">{bottomPlayer.score}</span>
        </div>
      </div>
    </div>
  );
}


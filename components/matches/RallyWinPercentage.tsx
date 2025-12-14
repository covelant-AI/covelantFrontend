"use client";

import React from 'react';

interface RallyWinPercentageProps {
  percentage: number;
  playerColor: string;
}

export default function RallyWinPercentage({ percentage, playerColor }: RallyWinPercentageProps) {
  // Calculate stroke properties for the circular progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center h-full">
      <div className="flex items-center gap-2 mb-3">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-600"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>

      {/* Circular Progress */}
      <div className="relative">
        <svg width="120" height="120" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={playerColor}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        
        {/* Percentage text in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-2xl font-bold" style={{ color: playerColor }}>
              {percentage}
              <span className="text-lg">%</span>
            </span>
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="mt-3 text-center">
        <p className="text-xs font-semibold text-gray-700">Rally Win</p>
        <p className="text-xs font-semibold text-gray-700">Percentage</p>
      </div>
    </div>
  );
}


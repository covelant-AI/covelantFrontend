"use client";

import React from 'react';

interface ServeStats {
  firstServePercent: number;
  firstServePointsWon: number;
  secondServePointsWon: number;
}

interface ServePerformanceProps {
  stats: ServeStats;
  playerColor: string;
}

export default function ServePerformance({ stats, playerColor }: ServePerformanceProps) {
  const metrics = [
    {
      id: 1,
      label: 'First Serve %',
      value: stats.firstServePercent,
      color: '#5B8DEF',
      circleColor: '#5B8DEF',
    },
    {
      id: 2,
      label: '1st Serve Points Won %',
      value: stats.firstServePointsWon,
      color: '#FDB022',
      circleColor: '#FDB022',
    },
    {
      id: 3,
      label: '2nd Serve Points Won %',
      value: stats.secondServePointsWon,
      color: '#42B6B1',
      circleColor: '#42B6B1',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600"
            >
              {/* Tennis racket */}
              <circle cx="9" cy="9" r="6" />
              <line x1="9" y1="3" x2="9" y2="15" />
              <line x1="3" y1="9" x2="15" y2="9" />
              <line x1="5.5" y1="5.5" x2="12.5" y2="12.5" />
              <line x1="12.5" y1="5.5" x2="5.5" y2="12.5" />
              <line x1="15" y1="15" x2="21" y2="21" />
            </svg>
          </div>
        </div>
        <div className="px-6 py-2 bg-gray-50 rounded-full">
          <span className="text-sm font-semibold text-gray-700">Serve Performance</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-6">
        {metrics.map((metric) => (
          <div key={metric.id} className="flex items-center gap-4">
            {/* Number Circle */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-4"
              style={{ borderColor: metric.circleColor, backgroundColor: 'white' }}
            >
              <span className="text-lg font-bold" style={{ color: metric.circleColor }}>
                {metric.id}
              </span>
            </div>

            {/* Label */}
            <div className="w-48 flex-shrink-0">
              <span className="text-base font-medium text-gray-700">{metric.label}</span>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 h-8 bg-gray-200 rounded-full overflow-hidden relative">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${metric.value}%`,
                  backgroundColor: metric.color,
                }}
              />
            </div>

            {/* Percentage Value */}
            <div className="w-20 text-right">
              <span className="text-2xl font-bold" style={{ color: metric.color }}>
                {metric.value}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


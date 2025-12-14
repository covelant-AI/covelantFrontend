"use client";

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface SetsWonLostChartProps {
  setsWon: number;
  setsLost: number;
  last10Data?: Array<{ match: number; won: number; lost: number }>;
}

export default function SetsWonLostChart({ setsWon, setsLost, last10Data }: SetsWonLostChartProps) {
  // Generate sample data if not provided
  const data = last10Data || [
    { match: 1, won: 2, lost: 1 },
    { match: 2, won: 2, lost: 0 },
    { match: 3, won: 1, lost: 2 },
    { match: 4, won: 2, lost: 1 },
    { match: 5, won: 2, lost: 0 },
    { match: 6, won: 0, lost: 2 },
    { match: 7, won: 2, lost: 1 },
    { match: 8, won: 2, lost: 0 },
    { match: 9, won: 2, lost: 1 },
    { match: 10, won: 1, lost: 2 },
  ];

  const totalWon = data.reduce((acc, d) => acc + d.won, 0);
  const totalLost = data.reduce((acc, d) => acc + d.lost, 0);
  const last10Percentage = Math.round((totalWon / (totalWon + totalLost)) * 100);
  
  // Calculate all-time percentage from actual sets data
  const totalSets = setsWon + setsLost;
  const allTimePercentage = totalSets > 0 ? Math.round((setsWon / totalSets) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Sets Won/Lost</h3>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Last 10 Matches</p>
          <p className="text-4xl font-bold text-gray-900">{last10Percentage}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">All Time</p>
          <p className="text-4xl font-bold text-gray-900">{allTimePercentage}%</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <XAxis 
              dataKey="match" 
              tick={{ fontSize: 10, fill: '#999' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Bar dataKey="won" stackId="a" fill="#42B6B1" radius={[0, 0, 0, 0]} />
            <Bar dataKey="lost" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-teal-500" />
          <span className="text-gray-600">Won</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-600">Lost</span>
        </div>
      </div>
    </div>
  );
}


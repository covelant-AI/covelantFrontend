"use client";

import React, { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Cell
} from 'recharts';

interface ServeStatsScatterProps {
  firstServePercentage: number;
  secondServePercentage: number;
  doubleFaultsPerMatch: number;
  acesLast5: number;
}

type TimeFrame = 'last5' | 'allTime';

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-xs font-semibold mb-1">Serve</p>
        <p className="text-xs">Accuracy: {data.accuracy}%</p>
        <p className="text-xs">Speed: {data.speed} km/h</p>
        {data.isAce && <p className="text-xs text-teal-600 font-semibold mt-1">ACE</p>}
      </div>
    );
  }
  return null;
};

export default function ServeStatsScatter({
  firstServePercentage,
  secondServePercentage,
  doubleFaultsPerMatch,
  acesLast5
}: ServeStatsScatterProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>('last5');

  // Generate sample serve data
  const generateServeData = () => {
    const serves = [];
    const numServes = 80;
    
    for (let i = 0; i < numServes; i++) {
      const isAce = i < 7; // 7 aces
      const isFirstServe = Math.random() > 0.3;
      
      serves.push({
        speed: isFirstServe 
          ? Math.floor(150 + Math.random() * 90) // 150-240 km/h for first serve
          : Math.floor(120 + Math.random() * 60), // 120-180 km/h for second serve
        accuracy: Math.floor(30 + Math.random() * 70), // 30-100% accuracy
        isAce: isAce,
        type: isFirstServe ? 'first' : 'second'
      });
    }
    
    return serves;
  };

  const serveData = generateServeData();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Serve Stats - Speed/Accuracy</h3>
      
      {/* Timeframe selector */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600 mr-2">Matches Selector</span>
        <button
          onClick={() => setSelectedTimeframe('last5')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedTimeframe === 'last5' 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Last 5
        </button>
        <button
          onClick={() => setSelectedTimeframe('allTime')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedTimeframe === 'allTime' 
              ? 'bg-blue-400 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Time
        </button>
      </div>

      {/* Aces indicator */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Aces - Last 5</span>
          <span className="text-2xl font-bold text-teal-600">{acesLast5}</span>
        </div>
      </div>

      {/* Scatter plot */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              dataKey="accuracy" 
              name="Accuracy" 
              unit="%" 
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: '#999' }}
              label={{ value: 'Acc %', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#999' }}
            />
            <YAxis 
              type="number" 
              dataKey="speed" 
              name="Speed" 
              unit="km/h"
              domain={[0, 250]}
              tick={{ fontSize: 10, fill: '#999' }}
              label={{ value: 'Km/h', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#999' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Serves" data={serveData} fill="#8884d8">
              {serveData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isAce ? '#FE8E25' : entry.type === 'first' ? '#42B6B1' : '#B0C7FF'} 
                  opacity={entry.isAce ? 1 : 0.6}
                  r={entry.isAce ? 6 : 4}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Stats table */}
      <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">First Serve Percentage</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900">{firstServePercentage}%</p>
            <p className="text-sm text-gray-600">{selectedTimeframe === 'last5' ? '82%' : '69%'}</p>
            <p className="text-sm text-gray-600">{selectedTimeframe === 'last5' ? '69%' : '63%'}</p>
          </div>
          <div className="flex gap-2 text-xs text-gray-400 mt-1">
            <span>Last 5</span>
            <span>Last 10</span>
            <span>All Time</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Second Serve In Percentage</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900">{secondServePercentage}%</p>
            <p className="text-sm text-gray-600">92%</p>
            <p className="text-sm text-gray-600">87%</p>
          </div>
          <div className="flex gap-2 text-xs text-gray-400 mt-1">
            <span>Last 5</span>
            <span>Last 10</span>
            <span>All Time</span>
          </div>
        </div>
      </div>
    </div>
  );
}


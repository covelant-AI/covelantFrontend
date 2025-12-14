"use client";

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';

interface WinRateGraphProps {
  last5WinRate: number;
  last10WinRate: number;
  allTimeWinRate: number;
  matchData?: Array<{ matchNumber: number; winRate: number; result?: string }>;
}

type TimeFrame = 'last5' | 'last10' | 'allTime';

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-semibold">{`Match ${data.match || data.matchNumber}`}</p>
        <p className="text-sm text-teal-600">{`Win Rate: ${payload[0].value}%`}</p>
        {data.result && (
          <p className="text-xs text-gray-500 mt-1 capitalize">{`Result: ${data.result}`}</p>
        )}
      </div>
    );
  }
  return null;
};

export default function WinRateGraph({ 
  last5WinRate, 
  last10WinRate, 
  allTimeWinRate,
  matchData 
}: WinRateGraphProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>('last10');

  // Generate or filter graph data based on timeframe
  const generateGraphData = () => {
    if (!matchData || matchData.length === 0) {
      // Fallback to sample data
      const numMatches = selectedTimeframe === 'last5' ? 5 : selectedTimeframe === 'last10' ? 10 : 20;
      const baseRate = selectedTimeframe === 'last5' ? last5WinRate : 
                       selectedTimeframe === 'last10' ? last10WinRate : allTimeWinRate;
      
      return Array.from({ length: numMatches }, (_, i) => ({
        match: i + 1,
        winRate: Math.max(40, Math.min(80, baseRate + (Math.random() - 0.5) * 20))
      }));
    }
    
    // Use actual match data and filter based on timeframe
    const numMatches = selectedTimeframe === 'last5' ? 5 : selectedTimeframe === 'last10' ? 10 : matchData.length;
    const filteredData = matchData.slice(-numMatches); // Get last N matches
    
    return filteredData.map((data, index) => ({
      match: index + 1,
      winRate: data.winRate,
      result: data.result
    }));
  };

  const graphData = generateGraphData();

  const getWinRateForTimeframe = () => {
    switch (selectedTimeframe) {
      case 'last5': return last5WinRate;
      case 'last10': return last10WinRate;
      case 'allTime': return allTimeWinRate;
    }
  };

  const getChangePercentage = () => {
    const current = getWinRateForTimeframe();
    const previous = selectedTimeframe === 'last5' ? last10WinRate : 
                    selectedTimeframe === 'last10' ? allTimeWinRate : 0;
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Match Report - Win Rate</h3>
      
      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Last 5</p>
          <p className="text-3xl font-bold text-gray-900">{last5WinRate}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Last 10</p>
          <p className="text-3xl font-bold text-gray-900">{last10WinRate}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">All Time</p>
          <p className="text-3xl font-bold text-gray-900">{allTimeWinRate}%</p>
        </div>
      </div>

      {/* Timeframe selector */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setSelectedTimeframe('last10')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedTimeframe === 'last10' 
              ? 'bg-teal-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${selectedTimeframe === 'last10' ? 'bg-white' : 'bg-teal-500'}`} />
          Last 10
        </button>
      </div>

      {/* Graph */}
      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graphData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <XAxis 
              dataKey="match" 
              hide
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#999' }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <defs>
              <linearGradient id="colorWinRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#42B6B1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#42B6B1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Line 
              type="monotone" 
              dataKey="winRate" 
              stroke="#42B6B1" 
              strokeWidth={3}
              dot={{ fill: '#42B6B1', r: 5 }}
              activeDot={{ r: 7 }}
            />
            {/* Shaded area under the line */}
            <defs>
              <linearGradient id="colorWinRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#42B6B1" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#42B6B1" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


"use client";

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  TooltipProps
} from 'recharts';

interface MatchDurationGraphProps {
  averageDuration: number;
  matchData?: Array<{ match: number; duration: number }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-semibold">{`Match ${payload[0].payload.match}`}</p>
        <p className="text-sm text-teal-600">{`${payload[0].value} min`}</p>
      </div>
    );
  }
  return null;
};

export default function MatchDurationGraph({ 
  averageDuration,
  matchData 
}: MatchDurationGraphProps) {
  // Generate sample data if not provided
  const data = matchData || Array.from({ length: 10 }, (_, i) => ({
    match: i + 1,
    duration: Math.floor(averageDuration + (Math.random() - 0.5) * 60)
  }));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg h-full">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Match Duration Avg.</h3>
      
      {/* Average Duration */}
      <div className="mb-6">
        <p className="text-5xl font-bold text-gray-900">{averageDuration} <span className="text-2xl font-normal">min</span></p>
      </div>

      {/* Graph */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#42B6B1" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#42B6B1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="match" 
              hide
            />
            <YAxis 
              hide
              domain={[100, 250]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="duration" 
              stroke="#42B6B1" 
              strokeWidth={3}
              fill="url(#colorDuration)"
              dot={{ fill: '#42B6B1', r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Duration scale labels */}
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>90m</span>
        <span>150</span>
        <span>210</span>
        <span>240</span>
      </div>
    </div>
  );
}


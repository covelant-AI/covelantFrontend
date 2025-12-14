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

interface RallyPerformanceChartProps {
  rallyData?: Array<{ rally: string; avgRally: number; longestRally: number }>;
}

export default function RallyPerformanceChart({ rallyData }: RallyPerformanceChartProps) {
  // Generate sample data if not provided
  const data = rallyData || [
    { rally: '01', avgRally: 8, longestRally: 18 },
    { rally: '02', avgRally: 6, longestRally: 15 },
    { rally: '03', avgRally: 10, longestRally: 22 },
    { rally: '04', avgRally: 7, longestRally: 16 },
    { rally: '05', avgRally: 9, longestRally: 20 },
    { rally: '06', avgRally: 5, longestRally: 12 },
    { rally: '07', avgRally: 11, longestRally: 25 },
    { rally: '08', avgRally: 8, longestRally: 19 },
    { rally: '09', avgRally: 12, longestRally: 28 },
    { rally: '10', avgRally: 7, longestRally: 17 },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Rally Performance</h3>
      <p className="text-sm text-gray-500 mb-4">Last 10 matches - Starting from most Recent</p>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-6">{item.rally}</span>
            <div className="flex-1 flex gap-2">
              {/* Average Rally bar */}
              <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden flex-1">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-start pl-2"
                  style={{ width: `${(item.avgRally / 30) * 100}%` }}
                >
                  <span className="text-white text-xs font-semibold">{item.avgRally}</span>
                </div>
              </div>
              
              {/* Longest Rally bar */}
              <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden flex-1">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-300 to-blue-400 rounded-full flex items-center justify-start pl-2"
                  style={{ width: `${(item.longestRally / 30) * 100}%` }}
                >
                  <span className="text-white text-xs font-semibold">{item.longestRally}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-start gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-400 to-orange-500" />
          <span className="text-gray-600">Avg. Rally</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-300 to-blue-400" />
          <span className="text-gray-600">Longest Rally</span>
        </div>
      </div>

      {/* Scale */}
      <div className="flex justify-between text-xs text-gray-400 mt-4 px-8">
        <span>0</span>
        <span>10</span>
        <span>20</span>
        <span>30</span>
      </div>
    </div>
  );
}


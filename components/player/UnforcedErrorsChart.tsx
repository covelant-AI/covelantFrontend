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

interface UnforcedErrorsChartProps {
  allTimeAverage: number;
  errorData?: Array<{ match: string; avg: number; max: number }>;
}

export default function UnforcedErrorsChart({ 
  allTimeAverage,
  errorData 
}: UnforcedErrorsChartProps) {
  // Generate sample data if not provided
  const data = errorData || [
    { match: '01', avg: 4, max: 8 },
    { match: '02', avg: 6, max: 11 },
    { match: '03', avg: 5, max: 9 },
    { match: '04', avg: 7, max: 13 },
    { match: '05', avg: 6, max: 12 },
    { match: '06', avg: 8, max: 14 },
    { match: '07', avg: 5, max: 10 },
    { match: '08', avg: 4, max: 8 },
    { match: '09', avg: 6, max: 11 },
    { match: '10', avg: 7, max: 13 },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Unforced Errors</h3>
      <p className="text-sm text-gray-500 mb-4">Last 10 matches - Starting from most Recent</p>
      
      {/* Bar Chart */}
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <XAxis 
              dataKey="match" 
              tick={{ fontSize: 10, fill: '#999' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: '#999' }}
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="avg" fill="#FE8E25" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar dataKey="max" fill="#FFB976" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-gray-600">Avg. Unforced Errors</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-300" />
          <span className="text-gray-600">Max. Unforced Errors</span>
        </div>
      </div>

      {/* All Time Average */}
      <div className="border-t pt-4 text-center">
        <p className="text-sm text-gray-500 mb-1">All Time Average</p>
        <div className="flex items-center justify-center gap-2">
          <p className="text-4xl font-bold text-gray-900">{allTimeAverage}</p>
        </div>
      </div>
    </div>
  );
}


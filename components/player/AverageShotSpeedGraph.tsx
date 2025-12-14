"use client";

import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
  Scatter,
  Cell
} from 'recharts';

interface AverageShotSpeedGraphProps {
  numMatches: number;
}

interface BoxPlotData {
  match: number;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length && payload[0].payload) {
    const data = payload[0].payload as BoxPlotData;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-semibold mb-2">{`Match ${data.match}`}</p>
        <div className="space-y-1 text-xs">
          <p><span className="text-gray-600">Max:</span> <span className="font-semibold">{data.max} km/h</span></p>
          <p><span className="text-gray-600">Q3:</span> <span className="font-semibold">{data.q3} km/h</span></p>
          <p><span className="text-gray-600">Median:</span> <span className="font-semibold text-teal-600">{data.median} km/h</span></p>
          <p><span className="text-gray-600">Q1:</span> <span className="font-semibold">{data.q1} km/h</span></p>
          <p><span className="text-gray-600">Min:</span> <span className="font-semibold">{data.min} km/h</span></p>
        </div>
      </div>
    );
  }
  return null;
};

// Seeded random number generator for consistent results
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Custom BoxPlot shape component  
const CustomBoxPlot = (props: any) => {
  const { cx, payload, yAxis } = props;
  
  if (!payload || !yAxis) return null;
  
  const { min, q1, median, q3, max } = payload;
  const boxWidth = 20;
  
  // Use the yAxis scale function to convert data values to pixel positions
  const scale = yAxis.scale;
  
  const yMin = scale(min);
  const yQ1 = scale(q1);
  const yMedian = scale(median);
  const yQ3 = scale(q3);
  const yMax = scale(max);

  return (
    <g>
      {/* Vertical line from min to max */}
      <line
        x1={cx}
        y1={yMax}
        x2={cx}
        y2={yMin}
        stroke="#42B6B1"
        strokeWidth={2}
      />
      
      {/* Min cap */}
      <line
        x1={cx - 8}
        y1={yMin}
        x2={cx + 8}
        y2={yMin}
        stroke="#42B6B1"
        strokeWidth={2}
      />
      
      {/* Max cap */}
      <line
        x1={cx - 8}
        y1={yMax}
        x2={cx + 8}
        y2={yMax}
        stroke="#42B6B1"
        strokeWidth={2}
      />

      {/* Box from Q1 to Q3 */}
      <rect
        x={cx - boxWidth / 2}
        y={yQ3}
        width={boxWidth}
        height={yQ1 - yQ3}
        fill="#42B6B1"
        fillOpacity={0.3}
        stroke="#42B6B1"
        strokeWidth={2}
        rx={3}
      />

      {/* Median line */}
      <line
        x1={cx - boxWidth / 2}
        y1={yMedian}
        x2={cx + boxWidth / 2}
        y2={yMedian}
        stroke="#42B6B1"
        strokeWidth={3}
      />
    </g>
  );
};

export default function AverageShotSpeedGraph({ 
  numMatches 
}: AverageShotSpeedGraphProps) {
  // Generate boxplot data for each match
  const generateData = (): BoxPlotData[] => {
    return Array.from({ length: numMatches }, (_, i) => {
      const seed = i * 7.3;
      
      // Start with median in middle range
      const median = 120 + seededRandom(seed) * 40; // 120-160
      
      // Generate values ensuring proper ordering
      // Q1 is below median
      const q1Offset = 15 + seededRandom(seed + 1) * 20; // 15-35 below median
      const q1 = median - q1Offset;
      
      // Q3 is above median
      const q3Offset = 15 + seededRandom(seed + 2) * 20; // 15-35 above median
      const q3 = median + q3Offset;
      
      // Min is below Q1
      const minOffset = 10 + seededRandom(seed + 3) * 25; // 10-35 below Q1
      const min = Math.max(60, q1 - minOffset); // Ensure min >= 60
      
      // Max is above Q3
      const maxOffset = 15 + seededRandom(seed + 4) * 35; // 15-50 above Q3
      const max = Math.min(200, q3 + maxOffset); // Ensure max <= 200
      
      return {
        match: i + 1,
        min: Math.round(min),
        q1: Math.round(q1),
        median: Math.round(median),
        q3: Math.round(q3),
        max: Math.round(max)
      };
    });
  };

  const data = generateData();
  const allMedians = data.map(d => d.median);
  const avgSpeed = Math.round(allMedians.reduce((sum, val) => sum + val, 0) / allMedians.length);
  const maxSpeed = Math.max(...data.map(d => d.max));
  const minSpeed = Math.min(...data.map(d => d.min));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Average Shot Speed per Match</h3>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Average</p>
          <p className="text-3xl font-bold text-gray-900">{avgSpeed} <span className="text-lg font-normal text-gray-600">km/h</span></p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Max</p>
          <p className="text-3xl font-bold text-teal-600">{maxSpeed} <span className="text-lg font-normal text-gray-600">km/h</span></p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Min</p>
          <p className="text-3xl font-bold text-orange-500">{minSpeed} <span className="text-lg font-normal text-gray-600">km/h</span></p>
        </div>
      </div>

      {/* Graph */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
            <XAxis 
              type="number"
              dataKey="match" 
              domain={[0, numMatches + 1]}
              hide
            />
            <YAxis 
              type="number"
              tick={{ fontSize: 12, fill: '#999' }}
              domain={[50, 210]}
              label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#999' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={data} shape={<CustomBoxPlot />} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


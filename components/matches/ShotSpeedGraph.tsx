"use client";

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';

interface Stroke {
  start: {
    index: number;
    time: number;
  };
  player_hit: 'top' | 'bottom';
  ball_speed: number | null;
}

interface Rally {
  start: {
    index: number;
    time: number;
  };
  end: {
    index: number;
    time: number;
  };
  summary: {
    player_won_point: string;
    rally_size: number;
    valid_rally: boolean;
  };
  strokes: Stroke[];
}

interface ShotSpeedGraphProps {
  data: Rally[];
  topPlayerName?: string;
  bottomPlayerName?: string;
  selectedPlayer?: 'top' | 'bottom';
}

interface ChartDataPoint {
  time: number;
  topPlayerSpeed: number | null;
  bottomPlayerSpeed: number | null;
  displayTime: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold mb-2">{`Time: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.name}: ${entry.value ? entry.value.toFixed(2) : 'N/A'} km/h`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ShotSpeedGraph({ 
  data, 
  topPlayerName = 'Top Player',
  bottomPlayerName = 'Bottom Player',
  selectedPlayer = 'top'
}: ShotSpeedGraphProps) {
  // Process the data to extract shot speeds with timestamps
  const chartData: ChartDataPoint[] = React.useMemo(() => {
    // Collect all stroke times and speeds
    const timeMap = new Map<number, { topSpeed: number | null; bottomSpeed: number | null }>();
    
    data.forEach((rally) => {
      rally.strokes.forEach((stroke) => {
        if (stroke.ball_speed !== null) {
          const time = stroke.start.time;
          
          if (!timeMap.has(time)) {
            timeMap.set(time, { topSpeed: null, bottomSpeed: null });
          }
          
          const entry = timeMap.get(time)!;
          if (stroke.player_hit === 'top') {
            entry.topSpeed = stroke.ball_speed;
          } else {
            entry.bottomSpeed = stroke.ball_speed;
          }
        }
      });
    });
    
    // Convert to array and sort
    const points: ChartDataPoint[] = Array.from(timeMap.entries())
      .map(([time, speeds]) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const displayTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        return {
          time: time,
          topPlayerSpeed: speeds.topSpeed,
          bottomPlayerSpeed: speeds.bottomSpeed,
          displayTime: displayTime,
        };
      })
      .sort((a, b) => a.time - b.time);
    
    return points;
  }, [data]);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <XAxis
            dataKey="displayTime"
            hide={true}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="topPlayerSpeed"
            stroke="#42B6B1"
            strokeWidth={2}
            dot={false}
            connectNulls={true}
            name={topPlayerName}
            opacity={selectedPlayer === 'top' ? 1 : 0.2}
          />
          <Line
            type="monotone"
            dataKey="bottomPlayerSpeed"
            stroke="#FE8E25"
            strokeWidth={2}
            dot={false}
            connectNulls={true}
            name={bottomPlayerName}
            opacity={selectedPlayer === 'bottom' ? 1 : 0.2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


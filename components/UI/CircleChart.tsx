import React from 'react';

interface CircleChartProps {
  wins: number;    // raw count or percentage (based on percentage flag)
  losses: number;
  percentage?: boolean; // true means wins/losses are raw counts, else they are percentages
}

const CircleChart: React.FC<CircleChartProps> = ({ wins, losses, percentage }) => {
    const total = wins + losses;
    const winsPercent: number = total === 0 ? 0 : (wins / total) * 100;
    const lossesPercent: number = total === 0 ? 0 : (losses / total) * 100;


  const circleRadius = 50;
  const circumference = 2 * Math.PI * circleRadius;

  // Edge cases
  const isFullWinsCircle = losses === 0 && wins > 0;
  const isFullLossesCircle = wins === 0 && losses > 0;
  const isEqualWinsLosses = wins === losses && wins > 0;

  // Handle quarter circles if equal wins and losses:
  // Half circle = 50% of circumference, but now with half teal and half red (each 50%)
  // This replaces winsPercent and lossesPercent to 50 each for drawing.

  let winsStrokeLength = 0;
  let lossesStrokeLength = 0;
  let lossesStrokeDashOffset = 0;

  if (isFullWinsCircle) {
    winsStrokeLength = circumference;
    lossesStrokeLength = 0;
    lossesStrokeDashOffset = 0;
  } else if (isFullLossesCircle) {
    winsStrokeLength = 0;
    lossesStrokeLength = circumference;
    lossesStrokeDashOffset = 0;
  } else if (isEqualWinsLosses) {
    winsStrokeLength = circumference / 2;   // half circle for wins
    lossesStrokeLength = circumference / 2; // half circle for losses
    lossesStrokeDashOffset = -winsStrokeLength;
  } else {
    winsStrokeLength = (winsPercent / 100) * circumference;
    lossesStrokeLength = (lossesPercent / 100) * circumference;
    lossesStrokeDashOffset = -winsStrokeLength;
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Circle chart */}
      <svg
        width={100}
        height={100}
        viewBox="0 0 120 120"
        className="rotate-[-90deg]" // start arcs from top
      >
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r={circleRadius}
          fill="#F3F4F6"
        />
        {/* Inner white circle for donut */}
        <circle
          cx="60"
          cy="60"
          r={circleRadius - 20}
          fill="#fff"
        />
        {/* Wins arc */}
        {winsStrokeLength > 0 && (
          <circle
            cx="60"
            cy="60"
            r={circleRadius}
            fill="transparent"
            stroke="#42B6B1"
            strokeWidth="8"
            strokeDasharray={`${winsStrokeLength} ${circumference}`}
            strokeLinecap="round"
          />
        )}
        {/* Losses arc */}
        {lossesStrokeLength > 0 && (
          <circle
            cx="60"
            cy="60"
            r={circleRadius}
            fill="transparent"
            stroke="#EF4444"
            strokeWidth="8"
            strokeDasharray={`${lossesStrokeLength} ${circumference}`}
            strokeDashoffset={lossesStrokeDashOffset}
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* Numbers and text */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-[#42B6B1]">
           {percentage? `${winsPercent.toFixed(0)}%` : wins}
          </span>
          <span className="text-lg text-black font-normal">Wins</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-[#EF4444]">
            {percentage? `${lossesPercent.toFixed(0)}%` : losses}
          </span>
          <span className="text-lg text-black font-normal">Losses</span>
        </div>
      </div>
    </div>
  );
};

export default CircleChart;



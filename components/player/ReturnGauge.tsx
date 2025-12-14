"use client";

import React from 'react';

interface ReturnGaugeProps {
  last5Percentage: number;
  allTimePercentage: number;
  title: string;
  subtitle?: string;
}

export default function ReturnGauge({
  last5Percentage,
  allTimePercentage,
  title,
  subtitle
}: ReturnGaugeProps) {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const strokeWidth = 20;
  const r = cx - strokeWidth / 2;

  const degToRad = (deg: number) => (deg * Math.PI) / 180;
  const startAngle = 135;
  const endAngle = 405;
  const totalArc = endAngle - startAngle;

  const percentToAngle = (p: number) => startAngle + (totalArc * p) / 100;

  const pointOnCircle = (angleDeg: number) => {
    const angleRad = degToRad(angleDeg);
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  };

  function describeArc(startAngle: number, endAngle: number) {
    const start = pointOnCircle(startAngle);
    const end = pointOnCircle(endAngle);
    const largeArcFlag = (endAngle - startAngle) <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  }

  const backgroundPath = describeArc(startAngle, endAngle);
  const last5Angle = percentToAngle(last5Percentage);
  const last5Path = describeArc(startAngle, last5Angle);
  const allTimeAngle = percentToAngle(allTimePercentage);
  const allTimePoint = pointOnCircle(allTimeAngle);

  const zeroPercentPoint = pointOnCircle(startAngle);
  const hundredPercentPoint = pointOnCircle(endAngle);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center">
      <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 mb-4 text-center">{subtitle}</p>}
      
      <svg
        width={size}
        height={size}
        viewBox={`-10 -10 ${size + 20} ${size + 20}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodColor="#9CA3AF"
              floodOpacity="0.5"
            />
          </filter>
        </defs>

        {/* Background arc */}
        <path
          d={backgroundPath}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#shadow)"
        />

        {/* Last 5 arc */}
        <path
          d={last5Path}
          fill="none"
          stroke={title.includes("Return") ? "#FE8E25" : "#42B6B1"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* All time marker */}
        <circle
          cx={allTimePoint.x}
          cy={allTimePoint.y}
          r={strokeWidth / 2}
          fill="#B0C7FF"
          stroke="white"
          strokeWidth="2"
        />

        {/* Percentage texts */}
        <text
          x={cx - 45}
          y={cy + 5}
          fill={title.includes("Return") ? "#FE8E25" : "#42B6B1"}
          fontSize="26"
          fontWeight="700"
          fontFamily="sans-serif"
        >
          {last5Percentage}%
        </text>
        <text
          x={cx - 45}
          y={cy + 22}
          fill="#000"
          fontSize="11"
          fontWeight="600"
          fontFamily="sans-serif"
        >
          Last 5
        </text>

        <line
          x1={cx + 5}
          y1={cy - 20}
          x2={cx + 5}
          y2={cy + 30}
          stroke="#9CA3AF"
          strokeWidth={2}
          strokeLinecap="round"
          opacity="0.4"
        />

        <text
          x={cx + 15}
          y={cy + 5}
          fill="#B0C7FF"
          fontSize="26"
          fontWeight="700"
          fontFamily="sans-serif"
        >
          {allTimePercentage}%
        </text>
        <text
          x={cx + 15}
          y={cy + 22}
          fill="#000"
          fontSize="11"
          fontWeight="600"
          fontFamily="sans-serif"
        >
          All Time
        </text>
      </svg>
    </div>
  );
}


import React from 'react';

type NearlyFullCircleGaugeProps = {
  primaryPct: number;
  secondaryPct: number;
  size?: number;
  strokeWidth?: number;
};

export default function SemiCircleGauge({
  primaryPct,
  secondaryPct,
  size = 200,
  strokeWidth = 20,
}: NearlyFullCircleGaugeProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = cx - strokeWidth / 2;

  // Degrees to radians helper
  const degToRad = (deg: number) => (deg * Math.PI) / 180;

  // New arc covers 135° to 405°, so 270° total sweep
  const startAngle = 135;
  const endAngle = 405;
  const totalArc = endAngle - startAngle; // 270 degrees

  // Map percent (0-100) to angle in degrees (135° to 405°)
  const percentToAngle = (p: number) => startAngle + (totalArc * p) / 100;

  // Given an angle in degrees, get x,y on circle
  const pointOnCircle = (angleDeg: number) => {
    const angleRad = degToRad(angleDeg);
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  };

  // Describe an SVG arc path from startAngle to endAngle
  function describeArc(startAngle: number, endAngle: number) {
    const start = pointOnCircle(startAngle);
    const end = pointOnCircle(endAngle);

    // Determine if the arc is larger than 180°
    const largeArcFlag = (endAngle - startAngle) <= 180 ? '0' : '1';

    return `
      M ${start.x} ${start.y}
      A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
    `;
  }

  // Background arc path (full arc)
  const backgroundPath = describeArc(startAngle, endAngle);

  // Primary arc path (0 → primaryPct)
  const primaryAngle = percentToAngle(primaryPct);
  const primaryPath = describeArc(startAngle, primaryAngle);

  // Secondary marker position
  const secondaryAngle = percentToAngle(secondaryPct);
  const secPoint = pointOnCircle(secondaryAngle);

  // Calculate positions for 0% and 100% labels on circumference
  const zeroPercentPoint = pointOnCircle(startAngle);
  const hundredPercentPoint = pointOnCircle(endAngle);

  // Padding to nudge min/max labels away from circle edge (positive or negative)
  const labelPadding = 10;
  
    return (
        <svg
          width={size}
          height={size}
          viewBox={`-20 -20 ${size + 40} ${size + 40}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="4"
                floodColor="#9CA3AF"   /* gray color matching your stroke */
                floodOpacity="0.9"
              />
            </filter>
          </defs>

          {/* Background arc with shadow filter */}
          <path
            d={backgroundPath}
            fill="none"
            stroke="#E5E7EB" // gray-200
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter="url(#shadow)"
          />

          {/* Primary arc */}
          <path
            d={primaryPath}
            fill="none"
            stroke="#42B6B1" // teal
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Secondary marker */}
          <circle
            cx={secPoint.x}
            cy={secPoint.y}
            r={strokeWidth / 2}
            fill="#B0C7FF" // light blue
            stroke="white"
            strokeWidth="1"
          />
          {/* Primary percentage text */}
          <text
            x={cx - 75}
            y={cy + 5}
            fill="#42B6B1"
            fontSize="34"
            fontWeight="700"
            fontFamily="sans-serif"
          >
            {primaryPct}%
          </text>
          <text
            x={cx - 70}
            y={cy + 30}
            fill="#000"
            fontSize="18"
            fontWeight="700"
            fontFamily="sans-serif"
          >
            Last 5
          </text>
          <line
            x1={cx - 0}       // X position for start
            y1={cy - 30} // slightly above the top text
            x2={cx - 0}       // X position same as x1 (vertical line)
            y2={cy + 40}       // below the labels
            stroke="#9CA3AF"   // light gray line
            strokeWidth={3}
            strokeLinecap="round"
            opacity="0.5"
          />
          {/* Secondary percentage text */}
          <text
            x={cx + 10}
            y={cy + 5}
            fill="#B0C7FF"
            fontSize="34"
            fontWeight="700"
            fontFamily="sans-serif"
          >
            {secondaryPct}%
          </text>
          <text
            x={cx + 10}
            y={cy + 30}
            fill="#000"
            fontSize="16"
            fontWeight="700"
            fontFamily="sans-serif"
          >
            All Time
        </text>
        {/* Min and max labels, nudged inside the svg */}
        <text
          x={zeroPercentPoint.x - labelPadding}
          y={zeroPercentPoint.y + labelPadding}
          fill="#9CA3AF" // gray-400
          fontSize="14"
          fontFamily="sans-serif"
          textAnchor="end"
          dominantBaseline="hanging"
        >
          0%
        </text>
        <text
          x={hundredPercentPoint.x + labelPadding}
          y={hundredPercentPoint.y + labelPadding}
          fill="#9CA3AF"
          fontSize="14"
          fontFamily="sans-serif"
          textAnchor="start"
          dominantBaseline="hanging"
        >
          100%
        </text>
        </svg>
    );
}


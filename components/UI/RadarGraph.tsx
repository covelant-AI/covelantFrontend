import React, { PureComponent } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const data = [
  { subject: "SRV", A: 83, color: "#42B6B1" },
  { subject: "RTN", A: 72, color: "#42B6B1" },
  { subject: "ATT", A: 21, color: "#F24B3E" },
  { subject: "BKH", A: 42, color: "#F08C2B" },
  { subject: "RLY", A: 95, color: "#42B6B1" },
];

// Custom label renderer for PolarAngleAxis
const renderCustomizedLabel = (props: any) => {
  const { payload, x, y, cx, cy, radius, index } = props;
  const subject = payload.value;
  const value = data[index].A;
  const color = data[index].color;

  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  const labelX = cx + (dx / dist) * (radius + 5);
  const labelY = cy + (dy / dist) * (radius + 12);


  let valueBoxX = labelX + (dx > 0 ? 0 : -30);
  let valueBoxY = labelY + (dy > 0 ? 8 : 10);

  // Special case: for "SRV", position number to the right of label text (horizontal align)
  if (subject === "SRV") {
    const horizontalOffset = 5; 
    valueBoxX = labelX + horizontalOffset;
    valueBoxY = labelY - 12;
  }

  return (
    <g>
      {/* Label text */}
      <text
        x={labelX}
        y={labelY}
        textAnchor={dx > 0 ? "start" : "end"}
        dominantBaseline="middle"
        fontWeight="bold"
        fontSize={17}
        fill="#000"
      >
        {subject}
      </text>

      {/* Value box */}
      <rect
        x={valueBoxX}
        y={valueBoxY}
        width="30"
        height="24"
        rx="8"
        ry="8"
        fill={color}
      />
      <text
        x={valueBoxX + 15}
        y={valueBoxY + 12}
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight="bold"
        fontSize={16}
        fill="#fff"
      >
        {value}
      </text>
    </g>
  );
};


export default class RadarGraph extends PureComponent {

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="78%" data={data}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="subject"
          tick={renderCustomizedLabel}
          tickLine={false}
        />
        <Radar
          name="Player"
          dataKey="A"
          stroke="#42B6B1"
          fill="#42B6B1"
          fillOpacity={0.7}
        />
      </RadarChart>
    </ResponsiveContainer>
    );
  }
}
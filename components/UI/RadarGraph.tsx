import React, { PureComponent } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

type Stat = {
  subject: string;
  value: number;
};

type Player = {
  stats: Stat[];
};

interface RadarGraphProps {
  activePlayer?: Player;
}

export default class RadarGraph extends PureComponent<RadarGraphProps> {
  renderCustomizedLabel = (props: {
    payload: any;
    x: number;
    y: number;
    cx: number;
    cy: number;
    radius: number;
    index: number;
  }) => {
    const { payload, x, y, cx, cy, radius } = props;
    const subject = payload.value;
    const statData = this.props.activePlayer?.stats || [];
    const valueEntry = statData.find((d) => d.subject === subject);
    const value = valueEntry?.value ?? 0;

    // Dynamic color based on value
    let color = "#ccc";
    if (value < 30) {
      color = "#FF4545";
    } else if (value < 60) {
      color = "#FE8E25";
    } else {
      color = "#42B6B1";
    }

    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const labelX = cx + (dx / dist) * (radius + 5);
    const labelY = cy + (dy / dist) * (radius + 12);

    let valueBoxX = labelX + (dx > 0 ? 0 : -30);
    let valueBoxY = labelY + (dy > 0 ? 8 : 10);

    if (subject === "SRV") {
      const horizontalOffset = 5;
      valueBoxX = labelX + horizontalOffset;
      valueBoxY = labelY - 12;
    }

    return (
      <g>
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
          y={valueBoxY + 13}
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

  render() {
    const statData =
      this.props.activePlayer?.stats?.map((s) => ({
        subject: s.subject,
        A: s.value,
      })) || [];

    return (
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="74%" data={statData}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="subject"
            tick={this.renderCustomizedLabel}
            tickLine={false}
          />
          <Radar
            name="Player"
            dataKey="A"
            stroke="#42B6B1"
            fill="#42B6B1"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    );
  }
}

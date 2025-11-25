"use client";

import React from "react";

export interface TimeInputsProps {
  startTime: string;
  endTime: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
}

const TimeInputs: React.FC<TimeInputsProps> = ({
  startTime,
  endTime,
  onStartChange,
  onEndChange,
}) => {
  return (
    <div className="flex gap-6">
      <div>
        <div className="text-xs font-medium text-slate-500">Start</div>
        <input
          type="time"
          value={startTime}
          onChange={(e) => onStartChange(e.target.value)}
          className="mt-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800"
        />
      </div>
      <div>
        <div className="text-xs font-medium text-slate-500">End</div>
        <input
          type="time"
          value={endTime}
          onChange={(e) => onEndChange(e.target.value)}
          className="mt-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800"
        />
      </div>
    </div>
  );
};

export default TimeInputs;

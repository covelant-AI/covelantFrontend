"use client";
import React, { useState } from "react";
import {parseTimeToSeconds} from '@/util/services'
import {PHYSICAL_TYPES, CONDITION_OPTIONS} from "@/util/types"

export default function PhysicalForm() {
  const [physicalType, setPhysicalType] = useState<string>("FATIGUE_SIGN");
  const [eventTime, setEventTime] = useState<string>("00:00");
  const [condition, setCondition] = useState<string>("");
  const [conditionTime, setConditionTime] = useState<string>("00:00");

  const handleAdd = () => {
    const payload = {
      category: "PHYSICAL",
      physicalType,
      eventTimeSeconds: parseTimeToSeconds(eventTime),
      condition,
      conditionTimeSeconds: parseTimeToSeconds(conditionTime),
    };
    console.log("Submit PHYSICAL event:", payload);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <select
          className="border border-gray-300 rounded px-3 py-1 text-sm flex-1"
          value={physicalType}
          onChange={(e) => setPhysicalType(e.target.value)}
        >
          {PHYSICAL_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-1 text-sm w-20 text-center"
          placeholder="00:00"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-3">
        <select
          className="border border-gray-300 rounded px-3 py-1 text-sm flex-1"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        >
          {CONDITION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-1 text-sm w-20 text-center"
          placeholder="00:00"
          value={conditionTime}
          onChange={(e) => setConditionTime(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleAdd}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
        >
          + Add
        </button>
      </div>
    </div>
  );
}
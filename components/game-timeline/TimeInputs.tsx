"use client";
import React from "react";
import { TimeInputsProps } from "./types";

export default function TimeInputs({
  startTime,
  endTime,
  onStartChange,
  onEndChange,
  onSave,
  isSaving,
}: TimeInputsProps) {

  return (
    <div className="flex items-end gap-5">

      {/* START */}
      <div>
        <label className="text-xs font-medium text-slate-500">Start</label>
        <input
          type="text"
          value={startTime}
          onChange={(e) => onStartChange(e.target.value)}
          placeholder="0:00"
          className="mt-1 w-20 rounded-xl border px-3 py-1.5 text-sm"
        />
      </div>

      {/* END */}
      <div>
        <label className="text-xs font-medium text-slate-500">End</label>
        <input
          type="text"
          value={endTime}
          onChange={(e) => onEndChange(e.target.value)}
          placeholder="0:00"
          className="mt-1 w-20 rounded-xl border px-3 py-1.5 text-sm"
        />
      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={onSave}
        disabled={isSaving}
        className="
          px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold
          hover:bg-blue-700 active:scale-95 transition disabled:bg-gray-400
        "
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

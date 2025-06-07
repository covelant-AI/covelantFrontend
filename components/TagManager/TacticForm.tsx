
"use client";
import React, { useState, useEffect } from "react";
import { parseTimeToSeconds, formatSeconds } from "@/util/services";
import { TACTIC_TYPES, CONDITION_OPTIONS } from "@/util/types";
import {MainTagManagerProps} from "@/util/interfaces"

export default function TacticForm({ videoId, timeStamp, onAddTag }: MainTagManagerProps) {
  const [tacticType, setTacticType] = useState<string>("SERVE_VOLLEY");
  const [eventTime, setEventTime] = useState<string>("00:00");
  const [condition, setCondition] = useState<string>("");
  const [comment, setComment] = useState<string>(""); // new comment state

    useEffect(() => {
      setEventTime(formatSeconds(timeStamp));
    }, [timeStamp]);

  const handleAdd = () => {
    const payload = {
      matchId: videoId,
      category: "TACTIC",
      tacticType,
      eventTimeSeconds: parseTimeToSeconds(eventTime),
      condition,
      comment,
    };

      fetch('/api/createTag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
       if (data.message !== "MatchEvent created") {
        alert('Failed to create Tag.');
      } 
        onAddTag(data.event);
      })
      .catch((error) => {
        console.error('Error creating match:', error);
        alert('Failed to create match. Please try again.');
      });
  };

  return (
    <div className="bg-white p-2 rounded-xl w-full">
      <div className="flex items-center justify-between p-2">
        <h3 className="text-black font-semibold text-lg">
          Tactical Tag
        </h3>
        <div className="w-4 h-4 bg-radial-[at_50%_50%] from-white-200 via-teal-400 to-teal-900 to-300% rounded-sm transform rotate-45 shadow-inner relative">
        </div>
      </div>
      <div className="w-full flex gap-6">
        {/* ─── Left Column: dropdown + time input ─── */}
        <div className="flex flex-col flex-none gap-4">
          <div className="flex items-center gap-3">
            <select
              className="bg-gray-100 border border-gray-300 text-black rounded-lg px-3 py-1 text-md flex-1 font-semibold"
              value={tacticType}
              onChange={(e) => setTacticType(e.target.value)}
            >
              {TACTIC_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1 text-sm w-24 h-11 text-center font-bold text-black"
              placeholder="00:00"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
            />
          </div>
            
          <div className="flex items-center gap-3">
            <select
              className="bg-gray-100 border border-gray-300 text-black rounded-lg px-3 py-1 text-md flex-1 font-semibold"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              {CONDITION_OPTIONS.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
            
        {/* ─── Middle Column: comment textarea ─── */}
        <div className="flex-1">
          <textarea
            className="w-full h-26 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black resize-none"
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
            
        {/* ─── Right Column: + Add button ─── */}
        <div className="flex flex-col justify-end flex-none">
          <button
            onClick={handleAdd}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg text-sm font-bold transition"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}

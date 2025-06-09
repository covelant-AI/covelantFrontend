"use client";
import React, { useState, useEffect } from "react";
import {parseTimeToSeconds, formatSeconds} from '@/util/services'
import {MainTagManagerProps} from "@/util/interfaces"

export default function NoteForm({ videoId, timeStamp, onAddTag }: MainTagManagerProps) {
  const [noteText, setNoteText] = useState<string>("");
  const [eventTime, setEventTime] = useState<string>("00:00");

  useEffect(() => {
      setEventTime(formatSeconds(timeStamp));
    }, [timeStamp]);

  const handleAdd = () => {
    const payload = {
      matchId: videoId,
      category: "COMMENT",
      commentText: noteText,
      eventTimeSeconds: parseTimeToSeconds(eventTime),
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
      console.log(data.event)
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
          Note Tag
        </h3>
        <div className="w-4 h-4 bg-radial-[at_50%_50%] from-white-200 via-gray-400 to-gray-900 to-300% rounded-sm transform rotate-45 shadow-inner relative">
      </div>
    </div>
      <div className="w-full flex lg:flex-row flex-col gap-6">
        {/* Left: textarea + time input */}
        <div className="flex flex-1 items-center gap-3">
          <textarea
            className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-1 text-sm w-full resize-none h-12 text-black"
            placeholder="Comment"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
          <input
            type="text"
            className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1 text-sm w-24 h-11 text-center font-bold text-black"
            placeholder="00:00"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
          />
        </div>

        {/* Right: + Add button */}
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
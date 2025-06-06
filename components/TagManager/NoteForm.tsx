"use client";
import React, { useState } from "react";
import {parseTimeToSeconds} from '@/util/services'

export default function NoteForm() {
  const [noteText, setNoteText] = useState<string>("");
  const [eventTime, setEventTime] = useState<string>("00:00");

  const handleAdd = () => {
    const payload = {
      category: "NOTE",
      commentText: noteText,
      eventTimeSeconds: parseTimeToSeconds(eventTime),
    };
    console.log("Submit NOTE event:", payload);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <textarea
          className="border border-gray-300 rounded px-3 py-1 text-sm w-full resize-none h-12"
          placeholder="Comment"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-1 text-sm w-20 text-center"
          placeholder="00:00"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
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
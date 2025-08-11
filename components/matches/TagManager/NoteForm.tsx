"use client";
import React, { useState, useEffect } from "react";
import { parseTimeToSeconds, formatSeconds } from "@/util/services";
import { MainTagManagerProps } from "@/util/interfaces";
import { toast } from 'react-toastify';
import { Msg } from '@/components/UI/ToastTypes';
import * as Sentry from "@sentry/nextjs";

export default function NoteForm({ videoId, timeStamp, onAddTag }: MainTagManagerProps) {
  const [noteType, setNoteType] = useState<string>(""); 
  const [eventTime, setEventTime] = useState<string>("00:00");
  const [condition, setCondition] = useState<string>(""); // Default to ""
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    setEventTime(formatSeconds(timeStamp));  
  }, [timeStamp]);

  const handleAdd = () => {
    // Set defaults if empty
    const payload = {
      matchId: videoId,
      category: "NOTE",
      noteType: noteType || "General Note", 
      eventTimeSeconds: parseTimeToSeconds(eventTime),
      customCondition: condition || "", 
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
        alert('Failed to create Tag. Please refresh');
      } 
      onAddTag(data.event);
      setComment("");
      setCondition("")
      setNoteType("")
    })
    .catch((error) => {
      toast.error(Msg, {
        data: {
          title: 'Error Creating Note tag',
          message: 'There was a problem with our servers while creating the tag. Please try again later or contact support.',
        },
        position: 'bottom-right',
      });
      Sentry.captureException(error);
    });
  };

  return (
    <div className="bg-white p-2 rounded-xl w-full justify-center items-center">
      <div className="flex items-center justify-left gap-4 p-2">
        <h3 className="text-black font-semibold text-lg">Manual Tags</h3>
        <div className="w-4 h-4 bg-radial-[at_50%_50%] from-white-200 via-gray-400 to-gray-900 to-300% rounded-sm transform rotate-45 shadow-inner relative"></div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="w-full flex flex-col lg:flex-row gap-6">
          {/* Left Column: inputs for type and condition */}
          <div className="flex flex-row flex-none gap-4">
            <div className="flex items-center gap-3 sm:flex-row flex-col">
              {/* 1) Note Type input */}
              <input
                type="text"
                className="bg-gray-100 border border-gray-300 text-black rounded-lg px-3 py-2 text-md flex-1 font-semibold max-sm:w-full"
                placeholder="Comment Summery"
                value={noteType}
                onChange={(e) => setNoteType(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              {/* 2) Condition input */}
              <input
                type="text"
                className="bg-gray-100 border border-gray-300 text-black rounded-lg px-3 py-2 text-md flex-1 font-semibold"
                placeholder="Player Condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              />
            </div>
          </div>

          {/* Middle Column: Comment input */}
        <div className="flex-1">
          <textarea
            className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 text-sm content-center text-black"
            placeholder="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {/* Right Column: + Add button */}
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
    </div>
  );
}



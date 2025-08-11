"use client";
import React, { useState, useEffect } from "react";
import { parseTimeToSeconds,formatSeconds } from "@/util/services";
import { MATCH_TYPES, CONDITION_OPTIONS } from "@/util/types";
import { MainTagManagerProps } from "@/util/interfaces";
import { toast } from 'react-toastify';
import {Msg} from '@/components/UI/ToastTypes';
import * as Sentry from "@sentry/nextjs";

export default function MatchForm({ videoId, timeStamp, onAddTag }: MainTagManagerProps) {
  const [matchType, setMatchType] = useState<string>("FIRST_SERVE");
  const [eventTime, setEventTime] = useState<string>("00:00");
  const [condition, setCondition] = useState<string>("");
  const [comment, setComment] = useState<string>(""); 

  useEffect(() => {
    setEventTime(formatSeconds(timeStamp));  
  }, [timeStamp]);

  const handleAdd = () => {
    const payload = {
      matchId: videoId,
      category: "MATCH",
      matchType,
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
        setComment("");
      })
      .catch((error) => {
        toast.error(Msg, {
          data: {
            title: 'Error Creating Match tag',
            message: 'There was a problem with our servers while creating the tag. Please try again later or contact support.',
          },
          position: 'bottom-right',
        })
        Sentry.captureException(error);
      });
  };

  return (
    <div className="bg-white p-2 rounded-xl w-full justify-center items-center">
      <div className="flex items-center justify-left gap-4 p-2">
        <h3 className="text-black font-semibold text-lg">
          Manual Tags
        </h3>
        <div className="w-4 h-4 bg-radial-[at_50%_50%] from-white-200 via-yellow-400 to-yellow-900 to-300% rounded-sm transform rotate-45 shadow-inner relative">
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="w-full flex flex-col lg:flex-row gap-6">
        {/* ─── Left Column: dropdowns + time inputs ─── */}
        <div className="flex flex-row flex-none gap-2">
          <div className="flex items-center gap-2 sm:flex-row flex-col">
            {/* 1) Match type dropdown */}
            <select
              className="bg-gray-100 border border-gray-300 text-black rounded-lg px-3 py-1 text-md font-semibold max-sm:w-full"
              value={matchType}
              onChange={(e) => setMatchType(e.target.value)}
            >
              {MATCH_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center ">
            {/* 3) Condition dropdown */}
            <select
              className="bg-gray-100 border border-gray-300 text-black rounded-lg px-3 py-1 text-md font-semibold"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              {CONDITION_OPTIONS.map((opt) => (
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
            className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 text-sm content-center text-black"
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
    </div>
  );
}

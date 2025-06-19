import React, { MouseEvent, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Pen , Check , X,Trash2  } from "lucide-react";
import { toast } from 'react-toastify';
import {Msg} from '@/components/UI/ToastTypes';
import * as Sentry from "@sentry/nextjs";

export interface ProgressBarProps {
  duration: number;
  marks: Array<{
    id: number;
    offsetSeconds: number;
    color: string;
    label: string;
    lablePath: string;
    condition?: string;
    comment: string;
  }>;
  progressRef: React.RefObject<HTMLInputElement>;
  progressContainerRef: React.RefObject<HTMLDivElement>;
  hoveredIndex: number | null;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProgressMouseMove: (e: MouseEvent<HTMLDivElement>) => void;
  onProgressMouseLeave: () => void;
  isPlaying: boolean;
  togglePlay: () => void;
  onDeleteTag: (id: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  duration,
  marks,
  progressRef,
  progressContainerRef,
  hoveredIndex,
  onSeek,
  onProgressMouseMove,
  onProgressMouseLeave,
  isPlaying,
  togglePlay,
  onDeleteTag,
}) => {
  // Local state to reflect edits immediately
  const [localMarks, setLocalMarks] = useState(marks);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<string>("");
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const toggleOpen = (i: number) => setOpenIndex((prev) => (prev == i ? null : i));

  const startEditing = (i: number) => {
    setEditingIndex(i);
    setDraft(localMarks[i].comment);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setDraft("");
  };

  const saveEditing = async (i: number) => {
    const mark = localMarks[i];
    const payload = { id: mark.id, comment: draft };
    try {
      const res = await fetch("/api/updateTag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      // update localMarks immediately
      setLocalMarks(prev => {
        const next = [...prev];
        next[i] = { ...next[i], comment: data.event.comment };
        return next;
      });
      setEditingIndex(null);
    } catch (err) {
      toast.error(Msg, {
        data: {
          title: 'Error updating tag',
          message: 'There was a problem with our servers while updating the tag. Please try again later.',
        },
        position: 'bottom-right',
      })
      Sentry.captureException(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
        toggleOpen(-1); // Collapse the bubble
      }
    };

    if (openIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openIndex]);



  useEffect(() => {
    setLocalMarks(marks);
  }, [marks]);

  return (
    <div className="flex items-center rounded-xl px-3 py-3 gap-3 bg-gray-100">
      {/* Play/Pause Button */}
      <button onClick={togglePlay} className="text-black text-lg">
        {isPlaying ? "❚❚" : "►"}
      </button>

      {/* Progress Bar Container */}
      <div
        ref={progressContainerRef}
        className="relative flex-1 h-2 flex items-center"
        onMouseMove={onProgressMouseMove}
        onMouseLeave={onProgressMouseLeave}
      >
        <input
          type="range"
          ref={progressRef}
          defaultValue={0}
          onChange={onSeek}
          className="w-full h-1 bg-gray-700 rounded-3xl cursor-pointer accent-[#6EB6B3]"
        />

        {/* Diamonds */}
        {localMarks.map((m, i) => (
          <div
            key={m.id}
            onClick={() => {
              if (openIndex !== i) {
                toggleOpen(i); // Only open if it's not already open
              }
            }}
            className={`absolute w-[10px] h-[10px] transform rotate-45 rounded-xs border cursor-pointer ${
              openIndex === i
                ? "border-[#6EB6B3] bg-white cursor-pointer"
                : "border-black"
            }`}
            style={{
              left: `calc(${(m.offsetSeconds / duration) * 100}% - 6px)`,
              top: "-14px",
              backgroundColor: openIndex === i ? "#FFF" : m.color,
              transition: "background-color 0.2s, border-color 0.2s",
            }}
          />
        ))}

        {/* Hover tooltip */}
        {hoveredIndex !== null && openIndex !== hoveredIndex && (
          <div
            onMouseMove={e => e.stopPropagation()}
            className="absolute -top-15 left-0 transform -translate-x-1/2 bg-white border-2 border-teal-600 rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg"
            style={{ left: `calc(${(localMarks[hoveredIndex].offsetSeconds / duration) * 100}% - 0px)` }}
          >
            <Image
              src={localMarks[hoveredIndex].lablePath}
              alt=""
              width={16}
              height={16}
              className="flex-shrink-0"
            />
            <span className="text-sm font-medium text-black">
              {localMarks[hoveredIndex].label}
            </span>
          </div>
        )}

        {/* Expanded bubble */}
        {openIndex !== null && openIndex >= 0 && openIndex < localMarks.length && (
          <div
            onMouseMove={e => e.stopPropagation()}
            ref={bubbleRef}
            className="absolute top-8 left-0 transform -translate-x-1/2 bg-white border-2 border-yellow-600 rounded-3xl p-4 flex flex-col space-y-1 shadow-lg max-w-xs z-10"
            style={{ left: `calc(${(localMarks[openIndex].offsetSeconds / duration) * 100}% - 6px)` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Image
                  src={localMarks[openIndex].lablePath}
                  alt=""
                  width={16}
                  height={16}
                />
                <span className="text-sm font-bold text-black ">
                  {localMarks[openIndex].label}
                </span>
              </div>
              <button onClick={() => onDeleteTag(localMarks[openIndex].id)} className="p-3">
                <Trash2 size={16} className="text-red-700 hover:text-red-800 hover:scale-[1.1] cursor-pointer" />
              </button>

            </div>
            
            {/* Edit / Save / Cancel */}
            {localMarks[openIndex].condition && (
              <h3 className="text-md font-semibold text-gray-400 text-center">
                {localMarks[openIndex].condition}
              </h3>
            )}
              
            {editingIndex === openIndex ? (
              <textarea
                className="w-full bg-gray-100 border border-gray-200 rounded-2xl p-2 text-sm text-black min-w-60 min-h-40"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
            ) : (
              localMarks[openIndex].comment && (
                <p className="text-md font-semibold text-gray-700 text-center min-w-60">
                  {localMarks[openIndex].comment}
                </p>
              )
            )}
             {editingIndex !== openIndex ? (
              <div className="flex justify-end space-x-2">
                <button onClick={() => startEditing(openIndex!)}
                className=" mt-2 bg-radial-[at_50%_50%] from-white to-white-900 to-[#7fa3fa] 
                    to-300% hover:to-200% text-blue-500 rounded-full p-1.5 hover:scale-[1.1] active:scale-[1.05] pointer:cursor">
                  <Pen  size={16} className="text-black hover:scale-[1.1]" />
                </button>
              </div>
              ) : (
                <div className="flex justify-end space-x-2 pt-2">
                  <button onClick={() => saveEditing(openIndex!)}
                    className="bg-radial-[at_50%_50%] from-white  to-white-900 to-[#7fa3fa] 
                    to-300% hover:to-200% text-blue-500 rounded-full p-1  hover:scale-[1.1] active:scale-[1.05] pointer:cursor">
                    <Check  size={16} className="text-green-500 hover:text-green-800" />
                  </button>
                  <button onClick={cancelEditing}
                    className="bg-radial-[at_50%_50%] from-white  to-white-900 to-[#FF4545] 
                    to-300% hover:to-200% text-red-500 rounded-full p-1  hover:scale-[1.1] active:scale-[1.05] pointer:cursor">
                    <X size={16} className="text-red-600 hover:text-red-800" />
                  </button>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}


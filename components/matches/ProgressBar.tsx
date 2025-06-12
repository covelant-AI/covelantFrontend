import React, { MouseEvent, useState, useEffect } from "react";
import Image from "next/image";
import { FilePen, CircleCheckBig, OctagonX } from "lucide-react";

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
  openIndex: number | null;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProgressMouseMove: (e: MouseEvent<HTMLDivElement>) => void;
  onProgressMouseLeave: () => void;
  toggleOpen: (index: number) => void;
  isPlaying: boolean;
  togglePlay: () => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  duration,
  marks,
  progressRef,
  progressContainerRef,
  hoveredIndex,
  openIndex,
  onSeek,
  onProgressMouseMove,
  onProgressMouseLeave,
  toggleOpen,
  isPlaying,
  togglePlay,
}) => {
  // Local state to reflect edits immediately
  const [localMarks, setLocalMarks] = useState(marks);
  useEffect(() => {
    setLocalMarks(marks);
  }, [marks]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<string>("");

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
      console.error("Failed to update tag:", err);
      alert("Could not save comment. Please try again.");
    }
  };

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
            onClick={() => toggleOpen(i)}
            className={`absolute w-[12px] h-[12px] transform rotate-45 rounded-sm border ${
              openIndex === i
                ? "border-yellow-600 bg-yellow-200 cursor-pointer"
                : "border-black"
            }`}
            style={{
              left: `calc(${(m.offsetSeconds / duration) * 100}% - 6px)`,
              top: "-14px",
              backgroundColor: openIndex === i ? "#FEF3C7" : m.color,
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
        {openIndex !== null && (
          <div
            onMouseMove={e => e.stopPropagation()}
            className="absolute top-8 left-0 transform -translate-x-1/2 bg-white border-2 border-yellow-600 rounded-lg px-3 py-2 flex flex-col space-y-1 shadow-lg max-w-xs"
            style={{ left: `calc(${(localMarks[openIndex].offsetSeconds / duration) * 100}% - 0px)` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Image
                  src={localMarks[openIndex].lablePath}
                  alt=""
                  width={16}
                  height={16}
                />
                <span className="text-sm font-semibold text-black">
                  {localMarks[openIndex].label}
                </span>
              </div>
              {/* Edit / Save / Cancel */}
              {editingIndex !== openIndex ? (
                <button onClick={() => startEditing(openIndex!)}>
                  <FilePen size={16} className="text-black hover:scale-[1.2]" />
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button onClick={() => saveEditing(openIndex!)}>
                    <CircleCheckBig size={16} className="text-green-600 hover:text-green-800" />
                  </button>
                  <button onClick={cancelEditing}>
                    <OctagonX size={16} className="text-red-600 hover:text-red-800" />
                  </button>
                </div>
              )}
            </div>

            {localMarks[openIndex].condition && (
              <h3 className="text-md font-semibold text-gray-400 text-center">
                {localMarks[openIndex].condition}
              </h3>
            )}

            {editingIndex === openIndex ? (
              <textarea
                className="w-full bg-gray-100 border border-gray-300 rounded p-2 text-sm text-black min-w-60"
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
          </div>
        )}
      </div>
    </div>
  );
}


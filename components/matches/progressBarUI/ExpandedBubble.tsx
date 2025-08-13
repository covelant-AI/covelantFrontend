import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Pen, Check, X, Trash2 } from 'lucide-react';
import { toast } from "react-toastify";
import * as Sentry from "@sentry/nextjs";

interface ExpandedBubbleProps {
  openIndex: number | null;
  localMarks: Array<{
    id: number;
    offsetSeconds: number;
    label: string;
    lablePath: string;
    condition?: string;
    comment: string;
  }>;
  duration: number;
  onDeleteTag: (id: number) => void;
  toggleBubble: (index: number | null) => void;  
  isFullscreen: boolean;
}

const ExpandedBubble: React.FC<ExpandedBubbleProps> = ({
  openIndex,
  localMarks,
  duration,
  onDeleteTag,
  toggleBubble,
  isFullscreen,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<string>('');
  const bubbleRef = useRef<HTMLDivElement>(null);

  const currentMark = openIndex !== null && openIndex >= 0 && openIndex < localMarks.length
    ? localMarks[openIndex]
    : null;

  const startEditing = () => {
    if (currentMark) {
      setEditingIndex(openIndex);
      setDraft(currentMark.comment);
    }
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setDraft('');
  };

  const saveEditing = async () => {
    if (currentMark) {
      const payload = { id: currentMark.id, comment: draft };
      try {
        const res = await fetch('/api/updateTag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);

        const data = await res.json();

        localMarks[openIndex!] = { ...localMarks[openIndex!], comment: data.event.comment };

        setEditingIndex(null);
      } catch (err) {
        toast.error("Something went wrong while saving the tag", {
          position: 'bottom-right',
        });
        Sentry.captureException(err);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
        toggleBubble(null);
      }
    };

    if (openIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openIndex, toggleBubble]);

  if (!currentMark) return null;

  return (
    <div
      ref={bubbleRef}
      className={ isFullscreen?
        `absolute bottom-20 left-4 bg-white border-2 border-yellow-600 rounded-3xl p-4 flex flex-col space-y-2 shadow-lg max-w-xs ` :
        `absolute bottom-10 left-0 transform -translate-x-1/2 bg-white border-2 border-yellow-600 rounded-3xl p-4 flex flex-col space-y-1 shadow-lg max-w-xs z-10 overflow-auto`
      }
      style={isFullscreen ? {} : { left: `calc(${(currentMark.offsetSeconds / duration) * 100}% - 0px)` }}
    >
      <div className="flex flex-row items-center justify-between pb-4">
          <div className='flex flex-row space-x-4'>
            <span className='max-w-7'>
          <Image src={currentMark.lablePath} alt="" width={50} height={40} />
          </span>
          <div className='flex flex-row space-x-4'>
            <div className='flex flex-col'>
              <p className="text-lg font-bold text-black">{currentMark.label}</p>
              {currentMark.condition && (
              <h3 className="text-md font-semibold text-gray-400 text-left">{currentMark.condition}</h3>
              )}
            </div>
        </div>
        </div>
        <button onClick={() => onDeleteTag(currentMark.id)} className="p-3">
          <Trash2 size={16} className="text-red-700 hover:text-red-800 hover:scale-[1.1] cursor-pointer" />
        </button>
      </div>
      

      {/* Edit / Save / Cancel */}
      {editingIndex === openIndex ? (
        <textarea
          className="w-full bg-gray-100 border border-gray-200 rounded-2xl p-2 text-sm text-black min-w-60 min-h-40"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
      ) : (
        currentMark.comment && (
          <p className="text-md font-semibold text-gray-700 text-center min-w-60">{currentMark.comment}</p>
        )
      )}

      {editingIndex !== openIndex ? (
        <div className="flex justify-end space-x-2">
          <button
            onClick={startEditing}
            className="mt-2 bg-radial-[at_50%_50%] from-white to-white-900 to-[#7fa3fa] 
                    to-300% hover:to-200% text-blue-500 rounded-full p-1.5 hover:scale-[1.1] active:scale-[1.05] pointer:cursor"
          >
            <Pen size={16} className="text-black hover:scale-[1.1]" />
          </button>
        </div>
      ) : (
        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={saveEditing}
            className="bg-radial-[at_50%_50%] from-white to-white-900 to-[#7fa3fa] 
                    to-300% hover:to-200% text-blue-500 rounded-full p-1 hover:scale-[1.1] active:scale-[1.05] pointer:cursor"
          >
            <Check size={16} className="text-green-500 hover:text-green-800" />
          </button>
          <button
            onClick={cancelEditing}
            className="bg-radial-[at_50%_50%] from-white to-white-900 to-[#FF4545] 
                    to-300% hover:to-200% text-red-500 rounded-full p-1 hover:scale-[1.1] active:scale-[1.05] pointer:cursor"
          >
            <X size={16} className="text-red-600 hover:text-red-800" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpandedBubble;

"use client";

import React from "react";
import { Player, TimelineEvent } from "./types";
import PlayerAvatar from "./PlayerAvatar";

export interface TimelineCardProps {
  event: TimelineEvent;
  player: Player;
  onClick?: (sectionId: number) => void;
  isSelected?: boolean; // ✅ NEW
}

const TimelineCard: React.FC<TimelineCardProps> = ({
  event,
  player,
  onClick,
  isSelected = false,
}) => {
  return (
    <div
      id={event.id.toString()}
      onClick={() => onClick?.(event.id)}
      className={`
        relative flex min-w-[160px] items-center justify-between
        rounded-2xl px-4 py-3
        backdrop-blur-md
        transition-all duration-200
        hover:scale-[1.02] active:scale-[0.97] cursor-pointer
      
        ${
          isSelected
            ? "bg-white shadow-[0_8px_24px_rgba(255,255,255,0.45)]"
            : "bg-white/40 shadow-lg shadow-slate-900/20 hover:shadow-2xl"
        }
      `}
    >
      <div className="flex items-center gap-2">
        <PlayerAvatar player={player} />
        <span className="text-xs font-medium text-slate-700">Point</span>
      </div>
    </div>
  );
};

export default TimelineCard;


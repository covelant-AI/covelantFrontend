"use client";

import React from "react";
import { Player, TimelineEvent } from "./types";
import PlayerAvatar from "./PlayerAvatar";

export interface TimelineCardProps {
  event: TimelineEvent;
  player: Player;
  onClick?: (sectionId: number) => void;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ event, player, onClick }) => {
  return (
    <div
      id={event.id.toString()}
      onClick={() => onClick?.(event.id)}
      className="
        relative flex min-w-[160px] items-center justify-between
        rounded-2xl bg-white/40 px-4 py-3
        shadow-lg shadow-slate-900/20
        ring-1 ring-white/60
        backdrop-blur-md
        transition-transform transition-shadow duration-200
        hover:scale-[1.02] active:scale-[0.97] hover:shadow-2xl cursor-pointer
      "
    >
      <div className="flex items-center gap-2">
        <PlayerAvatar player={player} />
        <span className="text-xs font-medium text-slate-700">
          Point
        </span>
      </div>
    </div>
  );
};

export default TimelineCard;

"use client";

import React from "react";
import { Player } from "./types";

export interface PlayerAvatarProps {
  player: Player;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ player }) => {
  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white ring-2 ${player.bg} ${player.ring}`}
    >
      {player.short}
    </div>
  );
};

export default PlayerAvatar;

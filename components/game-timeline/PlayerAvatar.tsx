// components/game-timeline/PlayerAvatar.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Player } from "./types";

export interface PlayerAvatarProps {
  player: Player;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ player }) => {
  const initials = player.short || player.name?.charAt(0) || "?";

  return (
    <div
      className={`
        relative h-8 w-8 rounded-full overflow-hidden
        ring-2 ${player.ring} 
      `}
    >
      {player.avatar ? (
        <Image
          src={player.avatar}
          alt={player.name}
          fill
          sizes="32px"
          className="object-cover rounded-full"
        />
      ) : (
        <div
          className={`
            flex h-full w-full items-center justify-center
            rounded-full text-xs font-semibold text-white
            ${player.bg}
          `}
        >
          {initials}
        </div>
      )}
    </div>
  );
};

export default PlayerAvatar;

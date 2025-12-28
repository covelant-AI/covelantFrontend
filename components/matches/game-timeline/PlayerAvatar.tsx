"use client";

import React from "react";
import Image from "next/image";
import type { Player } from "../types/gameTimelineTypes";
import { getAvatarSrc, getPlayerAltText, getPlayerInitials } from "../utils/avatarUtils";

export type PlayerAvatarProps = {
  player: Player;
  sizePx?: number; 
};

export default function PlayerAvatar({ player, sizePx = 32 }: PlayerAvatarProps) {
  const avatarSrc = getAvatarSrc(player);
  const initials = getPlayerInitials(player);
  const alt = getPlayerAltText(player);

  return (
    <div
      className="relative rounded-full overflow-hidden ring-2"
      style={{ width: sizePx, height: sizePx }}
    >
      <div className={player.ring ? player.ring : "ring-slate-200"} />

      {avatarSrc ? (
        <Image
          src={avatarSrc}
          alt={alt}
          fill
          sizes={`${sizePx}px`}
          className="object-cover rounded-full"
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center rounded-full text-xs font-semibold text-white ${
            player.bg || "bg-slate-400"
          }`}
        >
          {initials}
        </div>
      )}
    </div>
  );
}

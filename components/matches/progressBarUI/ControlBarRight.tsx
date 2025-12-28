"use client";

import React from "react";
import Image from "next/image";
import { mmss } from "../utils/time";

type ControlBarRightProps = {
  controlsBottom: string;
  currentTime: number;
  duration: number;
  onToggleFullscreen: () => void;
  children: React.ReactNode; // SettingsMenu + VolumeControl (unchanged)
};

export function ControlBarRight({
  controlsBottom,
  currentTime,
  duration,
  onToggleFullscreen,
  children,
}: ControlBarRightProps) {
  return (
    <div
      className={`absolute ${controlsBottom} right-3 cursor-pointer bg-opacity-60 px-2 py-1 rounded-lg z-2`}
    >
      <span className="text-white text-lg flex flex-row justify-center items-center space-x-2">
        <div className="text-white text-sm">
          {mmss(currentTime)} / {mmss(duration)}
        </div>

        {children}

        <Image
          src="/icons/fullscreen.svg"
          alt="Toggle fullscreen"
          width={24}
          height={24}
          className="text-white text-lg hover:scale-[1.15] active:scale-[1.05]"
          onClick={onToggleFullscreen}
        />
      </span>
    </div>
  );
}

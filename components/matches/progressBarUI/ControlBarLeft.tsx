"use client";

import React from "react";
import Image from "next/image";

type ControlBarLeftProps = {
  controlsBottom: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function ControlBarLeft({
  controlsBottom,
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext,
}: ControlBarLeftProps) {
  return (
    <div
      className={`absolute ${controlsBottom} left-3 flex justify-center space-x-3 z-2`}
    >
      <button
        onClick={onTogglePlay}
        className="text-white p-1 text-2xl hover:scale-[1.1] active:scale-[1.01] cursor-pointer"
      >
        {isPlaying ? "❚❚" : "►"}
      </button>

      <button
        onClick={onPrev}
        className="text-white rounded-md hover:scale-[1.1] active:scale-[1.01] cursor-pointer"
      >
        <Image src="/icons/leftSkip.svg" alt="Skip to previous tag" width={24} height={24} />
      </button>

      <button
        onClick={onNext}
        className="text-white rounded-md hover:scale-[1.1] active:scale-[1.01] cursor-pointer"
      >
        <Image src="/icons/rightSkip.svg" alt="Skip to next tag" width={24} height={24} />
      </button>
    </div>
  );
}

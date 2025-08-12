"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type VolumeControlProps = {
  videoRef?: React.RefObject<HTMLVideoElement>; // optional – if passed, we wire it
  value?: number;                                // optional controlled value (0..1)
  onChange?: (v: number) => void;                // fires on change
  className?: string;
};

export default function VolumeControl({
  videoRef,
  value,
  onChange,
  className = "",
}: VolumeControlProps) {
  const [vol, setVol] = useState<number>(value ?? videoRef?.current?.volume ?? 1);
  const [open, setOpen] = useState(false);

  // sync local state if a controlled value is provided
  useEffect(() => {
    if (typeof value === "number") setVol(value);
  }, [value]);

  // apply volume to the video + notify parent
  const apply = (v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    setVol(clamped);
    if (videoRef?.current) videoRef.current.volume = clamped;
    onChange?.(clamped);
  };

  const icon = useMemo(() => {
    if (vol === 0) return "/icons/volume-mute.svg";
    if (vol < 0.35) return "/icons/volume-low.svg";
    if (vol < 0.75) return "/icons/volume-mid.svg";
    return "/icons/volume-high.svg";
  }, [vol]);

  return (
    <div className={`relative select-none ${className}`}>
      {/* toggle popup */}
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex items-center justify-center w-8 h-8 hover:scale-[1.1] active:scale-[0.98] transition hover:cursor-pointer"
        aria-label="Volume"
      >
        <img src='/icons/Volume.png' alt="Volume" className="w-5 h-5" />
      </button>

      {/* popup with slider only */}
      {open && (
        <div className="absolute bottom-10 right-0 w-40 rounded-lg bg-neutral-900/90 backdrop-blur p-3 shadow-lg border border-white/10 z-50">
          <div className="flex items-center justify-between gap-2 mb-2 text-white/80 text-xs">
            <span>Volume</span>
            <span>{Math.round(vol * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(vol * 100)}
            onChange={(e) => apply(parseInt(e.target.value, 10) / 100)}
            className="w-full accent-white"
          />
        </div>
      )}
    </div>
  );
}


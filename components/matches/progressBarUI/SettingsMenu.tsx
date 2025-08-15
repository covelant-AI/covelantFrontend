"use client";
import React, { useEffect, useRef, useState } from "react";

type SettingsMenuProps = {
  className?: string;
  onAutoSkipToggle: (enabled: boolean) => void; // Callback to notify parent of the setting change
};

export default function SettingsMenu({ className = "", onAutoSkipToggle }: SettingsMenuProps) {
  const [open, setOpen] = useState(false);
  const [autoSkipEnabled, setAutoSkipEnabled] = useState(false); // State for Auto Skip Dead Time
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click (keeps “click again to close” behavior too)
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // Handle toggling Auto Skip Dead Time
  const handleAutoSkipToggle = () => {
    setAutoSkipEnabled((prev) => !prev);
    onAutoSkipToggle(!autoSkipEnabled); // Notify parent about the toggle state
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex items-center justify-center w-8 h-8 hover:scale-[1.1] active:scale-[0.98] transition hover:cursor-pointer"
        aria-label="Settings"
      >
        <img src='/icons/VideoSettings.png' alt="Settings" className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute bottom-10 right-0 w-48 rounded-lg bg-neutral-900/90 backdrop-blur p-3 shadow-lg border border-white/10 text-white z-50">
          <div className="text-xs uppercase tracking-wide text-white/60 mb-2">Settings</div>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/10 cursor-pointer">
              <span>Filters</span><span className="text-white/60">coming soon</span>
            </li>
            <li className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/10 cursor-pointer">
              <span>Quality</span><span className="text-white/60">Auto</span>
            </li>
            {/* New "Auto Skip Dead Time" Toggle */}
            <li
              className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/10 cursor-pointer"
              onClick={handleAutoSkipToggle}
            >
              <span>Auto Skip Dead Time</span>
              <span className={`text-white/60 ${autoSkipEnabled ? 'text-green-400' : 'text-red-400'}`}>
                {autoSkipEnabled ? 'On' : 'Off'}
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

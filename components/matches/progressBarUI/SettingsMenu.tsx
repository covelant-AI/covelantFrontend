"use client";
import React, { useEffect, useRef, useState } from "react";
import {CategoryKey} from "@/util/types";

type SettingsMenuProps = {
  className?: string;
  onAutoSkipToggle: (enabled: boolean) => void;
  onTagFilterChange: (tags: CategoryKey[]) => void; 
  defaultSelectedTags?: CategoryKey[];               
};

export default function SettingsMenu({
  className = "",
  onAutoSkipToggle,
  onTagFilterChange,
}: SettingsMenuProps) {
  const [open, setOpen] = useState(false);
  const [autoSkipEnabled, setAutoSkipEnabled] = useState(false);
  const [selectedTags, setSelectedTags] = useState<CategoryKey[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  // Tag configs (diamond classes come from your design)
  const TAGS: { key: CategoryKey; ring: string; diamond: string }[] = [
    {
      key: "Match",
      ring: "ring-yellow-400/70",
      diamond:
        "w-4 h-4 bg-radial-[at_50%_50%] from-white-200 via-yellow-400 to-yellow-900 to-300% rounded-sm transform rotate-45 shadow-inner relative",
    },
    {
      key: "Tactic",
      ring: "ring-teal-400/70",
      diamond:
        "w-4 h-4 bg-radial-[at_50%_50%] from-white-200 via-teal-400 to-teal-900 to-300% rounded-sm transform rotate-45 shadow-inner relative",
    },
    {
      key: "Fouls",
      ring: "ring-red-400/70",
      diamond:
        "w-4 h-4 bg-radial-[at_50%_50%] from-white-200 via-red-400 to-red-900 to-300% rounded-sm transform rotate-45 shadow-inner relative",
    },
    {
      key: "Physical",
      ring: "ring-sky-400/70",
      diamond:
        "w-4 h-4 bg-radial-[at_50%_50%] from-white-200 via-sky-400 to-sky-900 to-300% rounded-sm transform rotate-45 shadow-inner relative",
    },
    {
      key: "Note",
      ring: "ring-gray-400/70",
      diamond:
        "w-4 h-4 bg-radial-[at_50%_50%] from-white-200 via-gray-400 to-gray-900 to-300% rounded-sm transform rotate-45 shadow-inner relative",
    },
  ];

  // Close on outside click
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

  // Notify parent whenever selected tags change
  useEffect(() => {
    onTagFilterChange(selectedTags);
  }, [selectedTags, onTagFilterChange]);

  // Toggle auto-skip
  const handleAutoSkipToggle = () => {
    setAutoSkipEnabled((prev) => !prev);
    onAutoSkipToggle(!autoSkipEnabled);
  };

  // Toggle tag selection
  const toggleTag = (tag: CategoryKey) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex items-center justify-center w-8 h-8 hover:scale-[1.1] active:scale-[0.98] transition hover:cursor-pointer"
        aria-label="Settings"
        aria-expanded={open}
      >
        <img src="/icons/VideoSettings.png" alt="Settings" className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute bottom-10 right-0 w-56 rounded-lg bg-neutral-900/90 backdrop-blur p-3 shadow-lg border border-white/10 text-white z-50">
          <div className="text-xs uppercase tracking-wide text-white/60 mb-2">Settings/Filters</div>
          <ul className="space-y-2 text-sm">
            {/* Filters row */}
            <li className="px-2 py-2 rounded ">
              <div className="flex items-center justify-between mb-2">
                <span>Filter Tags</span>
              </div>

              <div className="flex items-center gap-3">
                {TAGS.map(({ key, ring, diamond }) => {
                  const active = selectedTags.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleTag(key)}
                      className={`p-1 rounded-md transition-all duration-150 ease-out hover:scale-[1.2] hover:bg-white/10 hover:cursor-pointer
                                  ${active ? `ring-2 ${ring} bg-white/5 scale-105` : "ring-0 opacity-90 hover:opacity-100"}`}
                      role="checkbox"
                      aria-checked={active}
                      aria-label={key}
                    >
                      <div className={diamond} />
                    </button>
                  );
                })}
              </div>
            </li>

            {/* Auto Skip Dead Time toggle */}
            <li
              className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/10 cursor-pointer"
              onClick={handleAutoSkipToggle}
            >
              <span>Auto Skip Dead Time</span>
              <span className={`${autoSkipEnabled ? "text-green-400" : "text-red-400"}`}>
                {autoSkipEnabled ? "On" : "Off"}
              </span>
            </li>


            {/* Quality (placeholder) */}
            <li className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/10 cursor-default">
              <span>Quality</span>
              <span className="text-white/60">Auto</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

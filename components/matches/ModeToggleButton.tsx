"use client";

import { Tags, Film } from "lucide-react";

type Props = {
  mode: boolean;
  onToggle: () => void;
};

export function ModeToggleButton({ mode, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className="absolute top-3 left-3 z-50 flex items-center justify-center
                 h-10 w-10 rounded-xl bg-white bg-gray-900 text-black shadow-lg hover:bg-gray-200 transition-all"
      aria-label="Switch mode"
      type="button"
    >
      {mode ? <Film size={18} /> : <Tags size={18} />}
    </button>
  );
}

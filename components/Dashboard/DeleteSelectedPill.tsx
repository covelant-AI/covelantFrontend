"use client";

import { Trash2 } from "lucide-react";

type Props = {
  show: boolean;
  visible: boolean;
  disabled: boolean;
  isDeleting: boolean;
  onDelete: () => void;
};

export function DeleteSelectedPill({ show, visible, disabled, isDeleting, onDelete }: Props) {
  if (!show) return null;

  return (
    <div className="absolute bottom-4 right-4 z-50">
      <button
        type="button"
        onClick={onDelete}
        disabled={disabled}
        className={`flex items-center gap-2 rounded-2xl border border-gray-300 bg-white shadow-lg px-4 py-3 text-sm font-semibold
                    hover:scale-[1.05] hover:cursor-pointer transition-all duration-200 ease-out
                    ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
                    ${disabled ? "text-gray-400 cursor-not-allowed" : "text-red-700 hover:bg-red-50"}`}
        aria-busy={isDeleting}
      >
        <Trash2 size={16} />
        <span>{isDeleting ? "Deleting…" : "Delete Selected"}</span>
      </button>
    </div>
  );
}

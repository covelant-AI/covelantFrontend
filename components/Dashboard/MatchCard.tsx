"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import StatusTag from "@/components/StatusTag";
import type { MatchDisplay } from "@/util/interfaces";

type Props = {
  match: MatchDisplay;
  selectionMode: boolean;
  isSelected: boolean;
  isFading: boolean;
  onToggleSelect: (id: string | number) => void;
};

export function MatchCard({
  match,
  selectionMode,
  isSelected,
  isFading,
  onToggleSelect,
}: Props) {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden h-50 bg-[#F8F8F8] border-2 border-[#F8F8F8]
                  hover:scale-[1.03] active:scale-[0.99]
                  transition-all duration-300 ease-out
                  ${isFading ? "opacity-0 scale-[0.98] translate-y-1" : "opacity-100"}`}
      onClick={() => onToggleSelect(match.id)}
      role={selectionMode ? "button" : undefined}
    >
      {!selectionMode ? (
        <Link href={`/matches/${match.id}`} className="block w-full h-full">
          <Image
            src={match.imageUrl}
            alt={match.title}
            width={500}
            height={300}
            className="w-full h-full object-cover"
          />
        </Link>
      ) : (
        <div className="w-full h-full">
          <Image
            src={match.imageUrl}
            alt={match.title}
            width={500}
            height={300}
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      <div className="absolute bottom-2 left-2 text-gray-300 text-xs font-semibold px-2 py-1 rounded">
        {match.title}
      </div>

      <div className="absolute top-2 left-2 z-10">
        <StatusTag analysisStatus={match.analysisStatus} />
      </div>

      {selectionMode && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(match.id);
          }}
          className={`absolute top-2 right-2 w-6 h-6 rounded-md border-2 flex items-center justify-center z-10
                      transition-all duration-200 ease-out
                      ${selectionMode ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none"}
                      ${isSelected ? "bg-[#42B6B1] border-[#42B6B1]" : "bg-white border-gray-300"}`}
          aria-pressed={isSelected}
          aria-label={isSelected ? "Deselect video" : "Select video"}
        >
          {isSelected && <Check size={14} className="text-white" />}
        </button>
      )}
    </div>
  );
}

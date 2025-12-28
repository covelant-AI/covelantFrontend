"use client";

import React, { useMemo, useState, useCallback } from "react";
import TimelineCard from "./TimelineCard";
import { BackgroundGradientAnimation } from "../../UI/BackgroundGradientAnimation";
import { computeNewGameStartSectionIds } from "@/components/matches/utils/tennisScoring";
import { useMomentumDragScroll } from "../hooks/useMomentumDragScroll";
import {DraggableTimelineProps, toEvents, getPlayerById } from "@/components/matches/utils/draggableTimelineHelper";

export default function DraggableTimeline({
  videoSections,
  players,
  title = "Game 1",
  onSectionSelect,
}: DraggableTimelineProps) {
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);

  const { scrollRef, isDraggingCursor, handlers } = useMomentumDragScroll();

  const newGameStartIds = useMemo(() => {
    try {
      return computeNewGameStartSectionIds(videoSections, { defaultWinner: "top" });
    } catch {
      return new Set<number>();
    }
  }, [videoSections]);

  const events = useMemo(() => toEvents(videoSections, players), [videoSections, players]);

  const handleCardClick = useCallback(
    (sectionId: number) => {
      setSelectedSectionId(sectionId);
      onSectionSelect?.(sectionId);
    },
    [onSectionSelect]
  );

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <BackgroundGradientAnimation containerClassName="absolute inset-0 z-0" />

      <div className="relative z-10 bg-gray-100/10 py-1">
        <div className="mb-2 ml-4 text-sm font-semibold text-white">{title}</div>

        <div className="relative">
          {/* timeline line overlay */}
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-0 h-[3px] -translate-y-1/2 bg-white/90" />

          <div
            ref={scrollRef}
            className={[
              "relative z-10 flex items-center gap-4 overflow-x-auto pb-2 pt-2 select-none",
              "snap-none overscroll-x-contain touch-pan-y",
              isDraggingCursor ? "cursor-grabbing" : "cursor-grab",
            ].join(" ")}
            {...handlers}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {events.map((event) => {
              const player = getPlayerById(players, event.playerId);
              if (!player) return null;

              const isNewGameStart = newGameStartIds.has(event.id);

              return (
                <div key={event.id} className="relative z-10 px-4 cursor-pointer">
                  {/* divider on LEFT side of new game point */}
                  {isNewGameStart ? (
                    <div className="pointer-events-none absolute -left-2 top-1 bottom-1 border-l-2 border-dotted border-white/70" />
                  ) : null}

                  <TimelineCard
                    event={event}
                    player={player}
                    onClick={handleCardClick}
                    isSelected={selectedSectionId === event.id}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

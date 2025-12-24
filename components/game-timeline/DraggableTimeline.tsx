"use client";

import React, { useEffect, useRef, useMemo, useState } from "react";
import { Player, TimelineEvent, VideoSection } from "./types";
import TimelineCard from "./TimelineCard";
import { computeNewGameStartSectionIds } from "./tennisScoring";
import { BackgroundGradientAnimation } from "../UI/BackgroundGradientAnimation";

export interface DraggableTimelineProps {
  videoSections: VideoSection[];
  players: [Player, Player];
  title?: string;
  onSectionSelect?: (sectionId: number) => void;
}

const DraggableTimeline: React.FC<DraggableTimelineProps> = ({
  videoSections,
  players,
  title = "Game 1",
  onSectionSelect,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // ✅ NEW: track selected card
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);

  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const scrollLeft = useRef<number>(0);
  const dragged = useRef(false);

  const lastX = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const velocity = useRef<number>(0);
  const momentumFrame = useRef<number | null>(null);

  const [isDraggingCursor, setIsDraggingCursor] = useState(false);
  const newGameStartIds = useMemo(() => {
    try {
      return computeNewGameStartSectionIds(videoSections, { defaultWinner: "top" });
    } catch {
      return new Set<number>();
    }
  }, [videoSections]);


  const clearMomentum = () => {
    if (momentumFrame.current !== null) {
      cancelAnimationFrame(momentumFrame.current);
      momentumFrame.current = null;
    }
  };
  

  const startMomentumScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const friction = 0.35;
    const minVelocity = 0.01;

    let lastTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!scrollRef.current) return;

      if (lastTimestamp === null) lastTimestamp = timestamp;
      const dt = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      container.scrollLeft -= velocity.current * dt * 20;
      velocity.current *= Math.pow(friction, dt / 16);

      if (Math.abs(velocity.current) < minVelocity) {
        momentumFrame.current = null;
        return;
      }

      momentumFrame.current = requestAnimationFrame(step);
    };

    momentumFrame.current = requestAnimationFrame(step);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;

    clearMomentum();

    // ✅ prevent browser from trying to "help" scroll
    scrollRef.current.style.scrollBehavior = "auto";

    isDragging.current = true;
    setIsDraggingCursor(true);

    startX.current = e.clientX;
    scrollLeft.current = scrollRef.current.scrollLeft;

    lastX.current = e.clientX;
    lastTime.current = performance.now();
    velocity.current = 0;
  };

const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
  if (!isDragging.current || !scrollRef.current) return;

  e.preventDefault();

  const x = e.clientX;
  const dxTotal = x - startX.current;
  if (Math.abs(dxTotal) > 6) dragged.current = true;

  const dx = x - lastX.current;
  const now = performance.now();
  const dt = now - lastTime.current || 1;

  scrollRef.current.scrollLeft = scrollLeft.current - dxTotal;

  velocity.current = dx / dt;
  lastX.current = x;
  lastTime.current = now;
};

  const handlePointerUp = (_e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;

    if (isDragging.current) {
      isDragging.current = false;
      setIsDraggingCursor(false);

      if (Math.abs(velocity.current) > 0.02) startMomentumScroll();
      else velocity.current = 0;
    }
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging.current) handlePointerUp(e);
  };

  useEffect(() => {
    return () => clearMomentum();
  }, []);

  const [playerOne, playerTwo] = players;

  const eventsFromSections: TimelineEvent[] = videoSections.map((section) => {
    const won = section.summary?.player_won_point ?? null;

    const playerId =
      won === "top" ? playerOne.id : won === "bottom" ? playerTwo.id : playerOne.id;

    return { id: section.id, playerId };
  });

  const getPlayerById = (id: number): Player | undefined =>
    players.find((p) => p.id === id);

  const handleCardClick = (sectionId: number) => {
    setSelectedSectionId(sectionId); // ✅ NEW: glow follows selection
    onSectionSelect?.(sectionId);
  };

return (
  <div className="relative overflow-hidden rounded-2xl">
    <BackgroundGradientAnimation containerClassName="absolute inset-0 z-0" />

    <div className="relative z-10 bg-gray-100/10 py-1">
      <div className="mb-2 ml-4 text-sm font-semibold text-white">{title}</div>

      {/* ✅ wrapper that holds both the scroll area + the overlay line */}
      <div className="relative">
        {/* ✅ the timeline line OVERLAY (NOT inside scroll container) */}
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-0 h-[3px] -translate-y-1/2 bg-white/90" />

        <div
          ref={scrollRef}
          className={`
            relative z-10 flex items-center gap-4 overflow-x-auto pb-2 pt-2 select-none
            snap-none overscroll-x-contain touch-pan-y
            ${isDraggingCursor ? "cursor-grabbing" : "cursor-grab"}
          `}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {eventsFromSections.map((event) => {
            const player = getPlayerById(event.playerId);
            if (!player) return null;
          
            const isNewGameStart = newGameStartIds.has(event.id);
          
            return (
              <div key={event.id} className="relative z-10 px-4 cursor-pointer">
                {/* ✅ divider on LEFT side of new game point */}
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
};

export default DraggableTimeline;

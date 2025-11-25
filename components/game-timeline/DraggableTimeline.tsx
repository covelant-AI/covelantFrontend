"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import { Player, TimelineEvent } from "./types";
import TimelineCard from "./TimelineCard";
import { WavyBackground } from "../UI/wavy-background";

export interface DraggableTimelineProps {
  events: TimelineEvent[];
  players: Player[];
  title?: string;
}

const DraggableTimeline: React.FC<DraggableTimelineProps> = ({
  events,
  players,
  title = "Game 1",
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const scrollLeft = useRef<number>(0);

  const lastX = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const velocity = useRef<number>(0); // px per ms
  const momentumFrame = useRef<number | null>(null);

  const [isDraggingCursor, setIsDraggingCursor] = useState(false);

  const clearMomentum = () => {
    if (momentumFrame.current !== null) {
      cancelAnimationFrame(momentumFrame.current);
      momentumFrame.current = null;
    }
  };

  const startMomentumScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const friction = 0.35; // lower = more friction
    const minVelocity = 0.01; // px/ms

    let lastTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!scrollRef.current) return;

      if (lastTimestamp === null) lastTimestamp = timestamp;
      const dt = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      // move according to velocity
      container.scrollLeft -= velocity.current * dt * 20; // 20 = speed factor

      // apply friction
      velocity.current *= Math.pow(friction, dt / 16);

      // stop if very slow
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

    isDragging.current = true;
    setIsDraggingCursor(true);

    startX.current = e.clientX;
    scrollLeft.current = scrollRef.current.scrollLeft;

    lastX.current = e.clientX;
    lastTime.current = performance.now();
    velocity.current = 0;

    scrollRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollRef.current) return;

    e.preventDefault();

    const x = e.clientX;
    const dx = x - lastX.current;
    const now = performance.now();
    const dt = now - lastTime.current || 1;

    // drag scrolling
    const deltaX = x - startX.current;
    scrollRef.current.scrollLeft = scrollLeft.current - deltaX;

    // estimate velocity (px per ms)
    velocity.current = dx / dt;
    lastX.current = x;
    lastTime.current = now;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;

    if (isDragging.current) {
      isDragging.current = false;
      setIsDraggingCursor(false);

      scrollRef.current.releasePointerCapture(e.pointerId);

      // strong enough fling → inertia
      if (Math.abs(velocity.current) > 0.02) {
        startMomentumScroll();
      } else {
        // no snap, just stop
        velocity.current = 0;
      }
    }
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging.current) {
      handlePointerUp(e);
    }
  };

  useEffect(() => {
    return () => {
      clearMomentum();
    };
  }, []);

  const getPlayerById = (id: number): Player | undefined =>
    players.find((p) => p.id === id);

  return (
    <div className="relative rounded-2xl bg-gray-100 px-4 py-1">
      <WavyBackground backgroundFill="white" className="w-full h-full ">
        <div className="mb-2 ml-4 text-sm font-semibold text-white">
          {title}
        </div>

        <div
          ref={scrollRef}
          className={`
            relative flex items-center gap-4 overflow-x-auto pb-2 pt-2 select-none
            ${isDraggingCursor ? "cursor-grabbing" : "cursor-grab"}
          `}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
        >
          {/* Hide scrollbar visually */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* continuous line behind cards */}
          <div className="pointer-events-none absolute left-0 top-1/2 h-[3px] w-[200vw] -translate-y-1/2 bg-white/90" />

          {events.map((event) => {
            const player = getPlayerById(event.playerId);
            if (!player) return null;

            return (
              <div
                key={event.id}
                className="relative z-10 px-4 cursor-pointer"
                data-timeline-card
              >
                <TimelineCard event={event} player={player} />
              </div>
            );
          })}
        </div>
      </WavyBackground>
    </div>
  );
};

export default DraggableTimeline;

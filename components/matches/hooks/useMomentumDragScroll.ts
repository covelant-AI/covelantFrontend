"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  friction?: number;      // default 0.35
  minVelocity?: number;   // default 0.01
  momentumScale?: number; // default 20
  dragThresholdPx?: number; // default 6
  momentumTrigger?: number; // default 0.02
};

export function useMomentumDragScroll(options: Options = {}) {
  const {
    friction = 0.35,
    minVelocity = 0.01,
    momentumScale = 20,
    dragThresholdPx = 6,
    momentumTrigger = 0.02,
  } = options;

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragged = useRef(false);

  const lastX = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);

  const momentumFrame = useRef<number | null>(null);
  const [isDraggingCursor, setIsDraggingCursor] = useState(false);

  const clearMomentum = useCallback(() => {
    if (momentumFrame.current !== null) {
      cancelAnimationFrame(momentumFrame.current);
      momentumFrame.current = null;
    }
  }, []);

  const startMomentumScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    let lastTimestamp: number | null = null;

    const step = (timestamp: number) => {
      const el = scrollRef.current;
      if (!el) return;

      if (lastTimestamp === null) lastTimestamp = timestamp;
      const dt = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      container.scrollLeft -= velocity.current * dt * momentumScale;
      velocity.current *= Math.pow(friction, dt / 16);

      if (Math.abs(velocity.current) < minVelocity) {
        momentumFrame.current = null;
        return;
      }

      momentumFrame.current = requestAnimationFrame(step);
    };

    momentumFrame.current = requestAnimationFrame(step);
  }, [friction, minVelocity, momentumScale]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = scrollRef.current;
      if (!el) return;

      clearMomentum();
      el.style.scrollBehavior = "auto";

      isDragging.current = true;
      setIsDraggingCursor(true);

      startX.current = e.clientX;
      scrollLeft.current = el.scrollLeft;

      lastX.current = e.clientX;
      lastTime.current = performance.now();
      velocity.current = 0;
      dragged.current = false;
    },
    [clearMomentum]
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!isDragging.current || !el) return;

    e.preventDefault();

    const x = e.clientX;
    const dxTotal = x - startX.current;
    if (Math.abs(dxTotal) > dragThresholdPx) dragged.current = true;

    const dx = x - lastX.current;
    const now = performance.now();
    const dt = now - lastTime.current || 1;

    el.scrollLeft = scrollLeft.current - dxTotal;

    velocity.current = dx / dt;
    lastX.current = x;
    lastTime.current = now;
  }, [dragThresholdPx]);

  const onPointerUp = useCallback(
    (_e: React.PointerEvent<HTMLDivElement>) => {
      const el = scrollRef.current;
      if (!el) return;

      if (!isDragging.current) return;

      isDragging.current = false;
      setIsDraggingCursor(false);

      if (Math.abs(velocity.current) > momentumTrigger) startMomentumScroll();
      else velocity.current = 0;
    },
    [momentumTrigger, startMomentumScroll]
  );

  const onPointerLeave = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isDragging.current) onPointerUp(e);
    },
    [onPointerUp]
  );

  useEffect(() => clearMomentum, [clearMomentum]);

  return {
    scrollRef,
    isDraggingCursor,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerLeave,
    },
  };
}

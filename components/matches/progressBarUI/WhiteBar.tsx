"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { FlatVideoSection } from "@/components/matches/types/flatVideoSection";
import { readHorizontalPadding, type ContainerOffsets } from "@/components/matches/utils/dom";

interface WhiteBarProps {
  section: FlatVideoSection;
  duration: number;
  progressContainerRef: React.RefObject<HTMLDivElement>;
}

export default function WhiteBar({ section, duration, progressContainerRef }: WhiteBarProps) {
  const [padding, setPadding] = useState<ContainerOffsets>({ left: 0, right: 0 });

  useEffect(() => {
    const container = progressContainerRef.current;
    if (!container) return;
    setPadding(readHorizontalPadding(container));
  }, [progressContainerRef]);

  const containerWidth = progressContainerRef.current?.getBoundingClientRect().width ?? 0;

  const { leftPx, widthPx } = useMemo(() => {
    if (duration <= 0 || containerWidth <= 0) return { leftPx: 0, widthPx: 0 };

    const effectiveWidth = containerWidth - padding.left - padding.right;

    const startPx = (section.startTime / duration) * effectiveWidth;
    const wPx = ((section.endTime - section.startTime) / duration) * effectiveWidth;

    return { leftPx: padding.left + startPx, widthPx: wPx };
  }, [containerWidth, duration, padding.left, padding.right, section.startTime, section.endTime]);

  if (duration <= 0 || !progressContainerRef.current) return null;

  return (
    <div
      className="absolute bg-white rounded-lg"
      style={{
        left: `${leftPx}px`,
        width: `${widthPx}px`,
        height: "15%",
        pointerEvents: "none",
      }}
    />
  );
}

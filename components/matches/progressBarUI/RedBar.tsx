import React, { useEffect, useState } from 'react';

interface RedBarProps {
  section: {
    startTime: number;
    endTime: number;
  };
  duration: number;
  progressContainerRef: React.RefObject<HTMLDivElement>;
}

export default function RedBar({
  section,
  duration,
  progressContainerRef,
}: RedBarProps) {
  const [containerOffsets, setContainerOffsets] = useState({ left: 0, right: 0 });

  useEffect(() => {
    if (progressContainerRef.current) {
      const container = progressContainerRef.current;
      const styles = window.getComputedStyle(container);

      // Read the padding/margin from the parent container
      const leftPadding = parseInt(styles.paddingLeft, 10);
      const rightPadding = parseInt(styles.paddingRight, 10);
      setContainerOffsets({
        left: leftPadding,
        right: rightPadding,
      });
    }
  }, [progressContainerRef]);

  if (duration <= 0 || !progressContainerRef.current) return null;

  // Get the container dimensions
  const containerRect = progressContainerRef.current.getBoundingClientRect();
  const containerWidth = containerRect.width;

  const effectiveBarWidth = containerWidth - containerOffsets.left - containerOffsets.right;

  // Calculate the position of the red bar relative to the container width
  const startPx = (section.startTime / duration) * effectiveBarWidth;
  const widthPx = ((section.endTime - section.startTime) / duration) * effectiveBarWidth;

  return (
    <div
      className="absolute bg-red-500 rounded-lg"
      style={{
        left: `${containerOffsets.left + startPx}px`,  
        width: `${widthPx}px`,                         
        height: '15%',                                 
        pointerEvents: 'none', // This ensures that the red bar doesn't block interactions
      }}
    />
  );
}


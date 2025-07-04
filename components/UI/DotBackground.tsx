import { cn } from "@/lib/utils";
import React from "react";

export interface dotBackgroundProp {
  BackgroundType: string,
}

export function DotBackground({ BackgroundType }: dotBackgroundProp) {
  return (
    <div
      className={cn(
        BackgroundType, // Apply BackgroundType dynamically as a class
        "[background-size:20px_20px]",
        "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
        "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        "z-0",
        "absolute", // Position it absolutely inside the parent container
        "inset-0"   // Make it cover the full parent container
      )}
    />
  );
}

import type { MouseEvent } from "react";
import type { VideoSection } from "@/util/interfaces";
import type { FlatVideoSection } from "@/components/matches/types/flatVideoSection";



export type Mark = {
  id: number;
  offsetSeconds: number;
  color: string;
  label: string;
  lablePath: string;
  condition?: string;
  comment: string;
};

export interface ProgressBarProps {
  duration: number;
  marks: Mark[];
  progressRef: React.RefObject<HTMLInputElement>;
  progressContainerRef: React.RefObject<HTMLDivElement>;
  hoveredIndex: number | null;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProgressMouseMove: (e: MouseEvent<HTMLDivElement>) => void;
  onProgressMouseLeave: () => void;
  onDeleteTag: (id: number) => void;
  isFullscreen: boolean;

  videoSections?: FlatVideoSection[];
  FilteredTags?: string[];
}

export type PresenceState = "enter" | "present" | "exit";
export type DiamondPresence = Record<string, { mark: Mark; state: PresenceState }>;

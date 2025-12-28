"use client";

import { useEffect, useState } from "react";
import type { DiamondPresence, Mark } from "../types/progressBarTypes";
import { DIAMOND_ANIM_MS } from "../utils/progressBarHelper";

export function useDiamondPresence(renderMarks: Mark[]) {
  const [diamondPresence, setDiamondPresence] = useState<DiamondPresence>({});

  useEffect(() => {
    setDiamondPresence((prev) => {
      const next: DiamondPresence = { ...prev };
      const nextIds = new Set(renderMarks.map((m) => String(m.id)));

      // Mark removed items as exiting
      Object.keys(prev).forEach((id) => {
        if (!nextIds.has(id) && prev[id].state !== "exit") {
          next[id] = { ...prev[id], state: "exit" };

          setTimeout(() => {
            setDiamondPresence((curr) => {
              const copy = { ...curr };
              if (copy[id]?.state === "exit") delete copy[id];
              return copy;
            });
          }, DIAMOND_ANIM_MS);
        }
      });

      // Add or update current items
      renderMarks.forEach((m) => {
        const id = String(m.id);

        if (!prev[id]) {
          next[id] = { mark: m, state: "enter" };

          requestAnimationFrame(() => {
            setDiamondPresence((curr) => {
              const item = curr[id];
              if (item && item.state === "enter") {
                return { ...curr, [id]: { ...item, state: "present" } };
              }
              return curr;
            });
          });
        } else {
          const wasExiting = prev[id].state === "exit";
          next[id] = { mark: m, state: wasExiting ? "present" : prev[id].state };
        }
      });

      return next;
    });
  }, [renderMarks]);

  return diamondPresence;
}

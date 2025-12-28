import { useEffect, useMemo, useState } from "react";
import type { WinOutcome } from "@/util/interfaces";

type OutcomeResult = "win" | "loss";

interface OutcomeCirclesProps {
  winOutcome: WinOutcome[];
}

const MAX_CIRCLES = 4;
const EXIT_MS = 220; // keep in sync with your CSS transition duration

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Normalize backend/parent string values to strict UI states.
 * Adjust aliases here if you have other spellings coming from the server.
 */
function normalizeResult(result: string): OutcomeResult {
  const v = result.trim().toLowerCase();

  // common win spellings
  if (v === "win" || v === "w" || v === "won" || v === "victory") return "win";

  // everything else treated as loss (safe default)
  return "loss";
}

export default function OutcomeCircles({ winOutcome }: OutcomeCirclesProps) {
  const [phase, setPhase] = useState<"enter" | "exit">("enter");

  const outcomes = useMemo(
    () =>
      winOutcome
        .slice(0, MAX_CIRCLES)
        .map((o) => ({ id: o.id, result: normalizeResult(o.result) })),
    [winOutcome]
  );

  useEffect(() => {
    setPhase("exit");
    const t = window.setTimeout(() => setPhase("enter"), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [outcomes]);

  const baseCircle = cx(
    "flex items-center justify-center",
    "w-10 lg:w-9 h-9 rounded-full",
    "transition-all duration-500 ease-in-out"
  );

  const animClass = phase === "enter" ? "animate-circle" : "opacity-0 filter blur-xl";

  const remainingCount = Math.max(0, MAX_CIRCLES - outcomes.length);

  return (
    <>
      {/* Leading unknown circle */}
      <span className={cx(baseCircle, "text-white bg-[#C6C6C6]", animClass)} aria-label="Unknown outcome">
        ?
      </span>

      {/* Actual outcomes */}
      {outcomes.map((o, index) => {
        const isWin = o.result === "win";
        return (
          <span
            key={o.id}
            className={cx(
              baseCircle,
              animClass,
              isWin ? "bg-[#42B6B1] text-white" : "bg-[#FF4545] text-white"
            )}
            style={{ animationDelay: `${index * 200}ms` }}
            aria-label={isWin ? "Win" : "Loss"}
          >
            {isWin ? "✓" : "✕"}
          </span>
        );
      })}

      {/* Remaining dotted circles */}
      {Array.from({ length: remainingCount }).map((_, i) => (
        <span
          key={`dotted-${i}`}
          className={cx(baseCircle, animClass, "bg-transparent border-2 border-dashed border-gray-400")}
          style={{ animationDelay: `${(outcomes.length + i) * 200}ms` }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

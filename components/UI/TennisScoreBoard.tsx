import React, { useMemo } from "react";

interface Scorer {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: string;
  type: "PLAYER" | "OPPONENT";
}

export interface EventRecord {
  /** 1 = first set, 2 = second set, etc. */
  setNumber: number;
  /** Number of games won in that set at this moment */
  gamePoint: number;
  /** The score within the current game (0,15,30,40) */
  matchPoint: number;
  /** Seconds from the video start when this record occurred */
  eventTimeSeconds: number;
  scorer: Scorer;
}

interface TennisScoreBoardProps {
  /** All point‐events from your backend */
  events: EventRecord[] | { [key: string]: EventRecord };
  /** Current playback time in seconds */
  eventTime: number;
  /** Which sets to show columns for */
  rounds?: number[];
}

export default function TennisScoreBoard({
  events,
  eventTime,
  rounds = [1, 2, 3],
}: TennisScoreBoardProps) {
  // 1) normalize into a real array
  const allEvents: EventRecord[] = Array.isArray(events)
    ? events
    : Object.values(events as Record<string, EventRecord>);

  // 2) only past events
  const past = useMemo(
    () => allEvents.filter((e) => e.eventTimeSeconds <= eventTime),
    [allEvents, eventTime]
  );

  // 3) collect the two players
  const players = useMemo(() => {
    const m = new Map<number, Scorer>();
    past.forEach((e) => m.set(e.scorer.id, e.scorer));
    return Array.from(m.values());
  }, [past]);

  // 4) latest matchPoint per player
  const latestMatchPoint = useMemo(() => {
    const out: Record<number, number> = {};
    const eventTimes: Record<number, number> = {};
    players.forEach((p) => {
      out[p.id] = 0;
      eventTimes[p.id] = 0;
    });
    past.forEach((e) => {
      const id = e.scorer.id;
      // pick the event with largest eventTimeSeconds
      if (e.eventTimeSeconds >= (eventTimes[id] || 0)) {
        out[id] = e.matchPoint;
        eventTimes[id] = e.eventTimeSeconds;
      }
    });
    return out;
  }, [players, past]);

  // 5) latest gamePoint per player & set
  const latestGamePoints = useMemo(() => {
    const out: Record<number, Record<number, number>> = {};
    players.forEach((p) => {
      out[p.id] = {};
      rounds.forEach((r) => (out[p.id][r] = 0));
    });
    past.forEach((e) => {
      const id = e.scorer.id;
      const setNo = e.setNumber;
      if (rounds.includes(setNo)) {
        if (
          e.eventTimeSeconds >=
          ((out[id] as Record<string, number>)[setNo + "_t"] || 0)
        ) {
          out[id][setNo] = e.gamePoint;
          (out[id] as Record<string, number>)[setNo + "_t"] = e.eventTimeSeconds;
        }
      }
    });
    return out;
  }, [players, past, rounds]);

  // 6) build rows
  const rows = useMemo(
    () =>
      players.map((p) => ({
        name: `${p.firstName} ${p.lastName}`,
        matchPoint: latestMatchPoint[p.id] || 0,
        gamePoints: rounds.map((r) => latestGamePoints[p.id][r] || 0),
      })),
    [players, latestMatchPoint, latestGamePoints, rounds]
  );

  return (
    <div className="overflow-x-auto scale-[0.9]">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="text-gray-400 text-sm border-b border-gray-200">
            <th className="py-1 px-4 text-left" />
            <th className="py-1 px-4 text-center">R</th>
            {rounds.map((r) => (
              <th key={r} className="py-1 px-4 text-center">
                Set {r}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className={`text-black ${
                idx < rows.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              {/* Player name */}
              <td className="py-1 px-4 font-medium">{row.name}</td>
              {/* R (matchPoint) */}
              <td className="py-1 px-4 text-center font-bold">
                {row.matchPoint}
              </td>
              {/* Game points per set */}
              {row.gamePoints.map((gp, i) => (
                <td
                  key={i}
                  className="py-1 px-4 text-center text-gray-700 font-bold"
                >
                  {gp}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

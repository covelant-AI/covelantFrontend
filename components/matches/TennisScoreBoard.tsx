import React from "react";
import { TennisScoreBoardProps, Scorer, EventRecord } from "@/util/interfaces";
import Image from "next/image";

export default function TennisScoreBoard({
  events,
  eventTime,
  rounds = [1, 2, 3],
  playerOne,
  playerTwo,
}: TennisScoreBoardProps) {
  const defaultAvatar = "/images/default-avatar.png";
  const topAvatar = playerOne?.avatar || defaultAvatar; 
  const bottomAvatar = playerTwo?.avatar || defaultAvatar;

  // 1) normalize into a real array
  const allEvents: EventRecord[] = Array.isArray(events)
    ? events
    : Object.values(events as Record<string, EventRecord>);

  // 2) only past events
  const past = allEvents.filter((e) => e.eventTimeSeconds <= eventTime);

  // 3) collect the two players
  const m = new Map<number, Scorer>();
  past.forEach((e) => m.set(e.scorer.id, e.scorer));
  const players = Array.from(m.values());

  // 4) latest matchPoint per player
  const latestMatchPoint: Record<number, number> = {};
  const eventTimes: Record<number, number> = {};
  players.forEach((p) => {
    latestMatchPoint[p.id] = 0;
    eventTimes[p.id] = 0;
  });
  past.forEach((e) => {
    const id = e.scorer.id;
    if (e.eventTimeSeconds >= (eventTimes[id] || 0)) {
      latestMatchPoint[id] = e.matchPoint;
      eventTimes[id] = e.eventTimeSeconds;
    }
  });

  // 5) latest gamePoint per player & set
  const latestGamePoints: Record<number, Record<number, number>> = {};
  players.forEach((p) => {
    latestGamePoints[p.id] = {};
    rounds.forEach((r) => (latestGamePoints[p.id][r] = 0));
  });
  past.forEach((e) => {
    const id = e.scorer.id;
    const setNo = e.setNumber;
    if (rounds.includes(setNo)) {
      const tKey = `${setNo}_t` as keyof Record<string, number>;
      const tStore = latestGamePoints[id] as unknown as Record<string, number>;
      if (e.eventTimeSeconds >= (tStore[tKey] || 0)) {
        latestGamePoints[id][setNo] = e.gamePoint;
        tStore[tKey] = e.eventTimeSeconds;
      }
    }
  });

  // 6) build rows (same data as before)
  const rows = players.map((p) => ({
    id: p.id,
    name: `${p.firstName} ${p.lastName}`,
    matchPoint: latestMatchPoint[p.id],
    gamePoints: rounds.map((r) => latestGamePoints[p.id][r]),
  }));

  return (
      <div className="rounded-t-2xl bg-white overflow-hidden">
        <div className="p-3 space-y-2">
          {/* Row 1 (top) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* avatar */}
              <div className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-gray-100">
                <Image
                  src={topAvatar}
                  alt={playerOne?.firstName || "Player One"}
                  width={28}
                  height={28}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* set badges */}
              <div className="flex items-center gap-2">
                {rows[0]?.gamePoints?.map((gp, i) => (
                  <span
                    key={`r0-${i}`}
                    className={
                      "inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded-md text-[13px] leading-none font-semibold " +
                      (i === 0 ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-800")
                    }
                  >
                    {gp}
                  </span>
                ))}
              </div>
            </div>
            {/* points */}
            <div className="text-right text-[15px] font-semibold text-gray-900">
              {rows[0] ? (rows[0].matchPoint === 50 ? "AD" : rows[0].matchPoint) : ""}
            </div>
          </div>

          {/* divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-1" />

          {/* Row 2 (bottom) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* avatar */}
              <div className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-gray-100">
                <Image
                  src={bottomAvatar}
                  alt={playerTwo?.firstName || "Player Two"}
                  width={28}
                  height={28}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* set badges */}
              <div className="flex items-center gap-2">
                {rows[1]?.gamePoints?.map((gp, i) => (
                  <span
                    key={`r1-${i}`}
                    className={
                      "inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded-md text-[13px] leading-none font-semibold " +
                      (i === 1 ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-800")
                    }
                  >
                    {gp}
                  </span>
                ))}
              </div>
            </div>
            {/* points */}
            <div className="text-right text-[15px] font-semibold text-gray-900">
              {rows[1] ? (rows[1].matchPoint === 50 ? "AD" : rows[1].matchPoint) : ""}
            </div>
          </div>

          {/* Serving indicator (optional, matches earlier design) */}
          <div className="pt-2 flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-block w-2 h-2 rounded-full bg-teal-500" />
            <span>Serving*</span>
          </div>
        </div>
      </div>
  );
}
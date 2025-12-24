"use client";
import React, { useState, useEffect, useMemo } from "react";
import TennisScoreBoard from "@/components/matches/TennisScoreBoard";
import {
  MainPerformanceTrackerProps,
  MatchMetric,
  EventRecord,
  VideoSection,
  MetricPoint,
} from "@/util/interfaces";
import AISummery from "@/components/matches/AISummary";
import { toast } from "react-toastify";
import { Msg } from "@/components/UI/ToastTypes";

export default function MainPreformanceTracker({
  videoId,
  playerOne,
  playerTwo,
  matchTime,
  videoSections,
}: MainPerformanceTrackerProps) {
  const [ballSpeeds, setBallSpeeds] = useState<MatchMetric[]>([]);
  const [playerSpeeds, setPlayerSpeeds] = useState<MatchMetric[]>([]);
  const [strikesEff, setStrikesEff] = useState<MatchMetric[]>([]);
  const [scorePoints, setScorePoints] = useState<EventRecord[]>([]);

  // 🔥 Convert videoSections → rallyCounts time-series
  // value = rally_size, eventTimeSeconds = start.time
  const rallyCounts: MetricPoint[] = useMemo(() => {
    if (!videoSections || videoSections.length === 0) return [];

    return videoSections
      .filter((sec: VideoSection) => {
        // keep only sections with valid numeric start time and rally_size
        const hasStartTime =
          sec.start && typeof sec.start.time === "number";
        const hasRallySize =
          sec.summary && typeof sec.summary.rally_size === "number";

        return hasStartTime && hasRallySize;
      })
      .map((sec: VideoSection) => ({
        eventTimeSeconds: sec.start.time,          // ⬅ time it starts at
        value: sec.summary!.rally_size as number, // ⬅ number of rallies
      }))
      .sort((a, b) => a.eventTimeSeconds - b.eventTimeSeconds);
  }, [videoSections]);

  async function getMatchData() {
    const res = await fetch(`/api/getMatchData?id=${videoId}`);
    const json = await res.json();

    if (res.ok) {
      setBallSpeeds(json.data.ballSpeeds);
      setPlayerSpeeds(json.data.playerSpeeds);
      setStrikesEff(json.data.strikesEff);
      setScorePoints(json.data.scorePoints);
    } else {
      toast.error(Msg, {
        data: {
          title: "Error loading match data",
          message:
            "There was a problem with our servers while loading the match data. Please try again later or refresh the page.",
        },
        position: "bottom-right",
      });
    }
  }

  useEffect(() => {
    getMatchData();
  }, []);

  return (
    <div className="min-w-60 self-stretch flex flex-col border border-gray-300 rounded-2xl max-lg:hidden">
      <div className="flex-1 flex flex-col min-h-0">
        <TennisScoreBoard
          events={scorePoints}
          eventTime={matchTime}
          playerOne={playerOne}
          playerTwo={playerTwo}
        />

        {/* Summary panel */}
        <div className="mt-2 flex-1 min-h-0">
          <AISummery
            ballSpeeds={ballSpeeds}
            playerSpeeds={playerSpeeds}
            rallyCounts={rallyCounts}  
            strikesEff={strikesEff}
            eventTime={matchTime}
          />
        </div>
      </div>
    </div>
  );
}

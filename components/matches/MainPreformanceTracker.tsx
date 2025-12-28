"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import TennisScoreBoard from "@/components/matches/TennisScoreBoard";
import AISummery from "@/components/matches/AISummary";

import type { MainPerformanceTrackerProps, MatchMetric, EventRecord } from "@/util/interfaces";

import { buildRallyCounts } from "@/components/matches/utils/rallyCounts";
import { fetchMatchData } from "@/components/matches/services/matchDataApi";
import { showMatchDataErrorToast } from "@/components/matches/utils/toasts";

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

  const rallyCounts = useMemo(() => buildRallyCounts(videoSections), [videoSections]);

  const loadMatchData = useCallback(async () => {
    const json = await fetchMatchData(videoId);

    if (!json) {
      showMatchDataErrorToast();
      return;
    }

    setBallSpeeds(json.data.ballSpeeds);
    setPlayerSpeeds(json.data.playerSpeeds);
    setStrikesEff(json.data.strikesEff);
    setScorePoints(json.data.scorePoints);
  }, [videoId]);

  useEffect(() => {
    loadMatchData();
  }, [loadMatchData]);

  return (
    <div className="min-w-60 self-stretch flex flex-col border border-gray-300 rounded-2xl max-lg:hidden">
      <div className="flex-1 flex flex-col min-h-0">
        <TennisScoreBoard
          events={scorePoints}
          eventTime={matchTime}
          playerOne={playerOne}
          playerTwo={playerTwo}
        />

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

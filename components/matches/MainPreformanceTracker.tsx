"use client";
import React, { useState, useEffect } from "react";
import { formatSeconds } from "@/util/services";
import TennisScoreBoard from "@/components/matches/TennisScoreBoard"
import {MainPerformanceTrackerProps, MatchMetric, EventRecord} from "@/util/interfaces"
import AISummery from "@/components/matches/AISummary"
import { toast } from 'react-toastify';
import {Msg} from '@/components/UI/ToastTypes';


export default function MainPreformanceTracker({
  videoId,
  leftPlayer,
  rightPlayer,
  matchTime,
}: MainPerformanceTrackerProps) {
    const [eventTime, setEventTime] = useState<string>("00:00");
    const [ballSpeeds, setBallSpeeds] = useState<MatchMetric[]>([])
    const [playerSpeeds, setPlayerSpeeds] = useState<MatchMetric[]>([])
    const [longestRallies, setLongestRallies] = useState<MatchMetric[]>([])
    const [strikesEff, setStrikesEff] = useState<MatchMetric[]>([])
    const [scorePoints, setScorePoints] = useState<EventRecord[]>([])

    useEffect(() => {
      setEventTime(formatSeconds(matchTime));  
    }, [matchTime]);

  async function getMatchData() {
    const res = await fetch(`/api/getMatchData?id=${videoId}`);
    const json = await res.json();

    if (res.ok) {
      setBallSpeeds(json.data.ballSpeeds);
      setPlayerSpeeds(json.data.playerSpeeds);
      setLongestRallies(json.data.longestRallies);
      setStrikesEff(json.data.strikesEff);
      setScorePoints(json.data.scorePoints)
    } else {
      toast.error(Msg, {
      data: {
        title: 'Error loading tags',
        message: 'There was a problem with our servers while loading the tag. Please try again later or refresh the page.',
      },
      position: 'bottom-right',
    })
    }
  }

  useEffect(() => {
    getMatchData();
  }, []);

return (
  <div className="min-w-60 self-stretch flex flex-col border border-gray-300 rounded-2xl max-lg:hidden">
    {/* Main content fills all available height */}
    <div className=" flex-1 flex flex-col min-h-0 ">
      <TennisScoreBoard
        events={scorePoints}
        eventTime={matchTime}
        rightPlayer={rightPlayer}
        leftPlayer={leftPlayer}
      />

      {/* Stats grow to fill the rest */}
      <div className="mt-2 flex-1 min-h-0">
        <AISummery
          ballSpeeds={ballSpeeds}
          playerSpeeds={playerSpeeds}
          longestRallies={longestRallies}
          strikesEff={strikesEff}
          eventTime={matchTime}
        />
      </div>
    </div>
  </div>
);
}
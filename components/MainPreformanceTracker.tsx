"use client";
import React, { useState, useEffect } from "react";
import { formatSeconds } from "@/util/services";
import TennisScoreBoard from "@/components/UI/TennisScoreBoard"
import {MainPreformanceTrackerProps} from "@/util/interfaces"
import AISummery from "@/components/AISummery"


export default function MainPreformanceTracker({
  videoId,
  leftPlayer,
  rightPlayer,
  live,
  matchTime,
  setInfo,
}: MainPreformanceTrackerProps) {
    const [eventTime, setEventTime] = useState<string>("00:00");
    const [ballSpeeds, setBallSpeeds] = useState<any>([])
    const [playerSpeeds, setPlayerSpeeds] = useState<any>([])
    const [longestRallies, setLongestRallies] = useState<any>([])
    const [strikesEff, setStrikesEff] = useState<any>([])
    const [scorePoints, setScorePoints] = useState<any>([])

    useEffect(() => {
      setEventTime(formatSeconds(matchTime));  
    }, [matchTime]);

  async function getMatchData() {
    // note: our GET handler expects `?matchId=…`
    const res = await fetch(`/api/getMatchData?id=${videoId}`);
    const json = await res.json();


    if (res.ok) {
      setBallSpeeds(json.data.ballSpeeds);
      setPlayerSpeeds(json.data.playerSpeeds);
      setLongestRallies(json.data.longestRallies);
      setStrikesEff(json.data.strikesEff);
      setScorePoints(json.data.scorePoints)
    } else {
      console.error("Failed to load tags:", json);
    }
  }

  useEffect(() => {
    getMatchData();
  }, []);

  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-lg flex flex-col h-full">
      {/* ─── Main content ─── */}
      <div className="space-y-4">
        {/* Top row: avatars + live badge + timer */}
        <div className="flex items-center justify-between p-8 relative bg-gradient-to-b from-white via-gray-50 via-white to-[#9ED8D5] overflow-hidden
             [clip-path:polygon(0_0,100%_0,100%_85%,50%_100%,0_85%)]">
          {/* Left avatar */}
          <img
            src={rightPlayer?.avatar || "/images/default-avatar.png"}
            alt={rightPlayer?.firstName || "Player One"}
            className="w-16 h-16 rounded-full ring-2 ring-gray-100 object-cover"
          />

          {/* Center: Live & Time */}
          <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
              {live && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
              <span className="text-sm font-semibold text-gray-600">
                {live ? "Live" : "Recorded"}
              </span>
            </div>
            <div className="text-teal-400 font-extrabold text-2xl">{setInfo}</div>
            {setInfo && <div className="text-xs text-gray-400">{eventTime}</div>}
          </div>

          {/* Right avatar */}
          <img
            src={leftPlayer.avatar || "/images/default-avatar.png"}
            alt={leftPlayer.firstName || "Player Two"}
            className="w-16 h-16 rounded-full ring-2 ring-gray-100 object-cover"
          />
        </div>

        {/* Score row */}
        <TennisScoreBoard events={scorePoints} eventTime={matchTime}/>

        {/* Stats grid 2×2 */}
        <AISummery
          ballSpeeds={ballSpeeds}
          playerSpeeds={playerSpeeds}
          longestRallies={longestRallies}
          strikesEff={strikesEff}
          eventTime={matchTime}
        />
      </div>
        
      {/* ─── Spacer pushes button to bottom ─── */}
      <div className="mt-auto">
        <button
          className="w-full py-2 border-2 border-teal-600 text-black font-semibold rounded-xl hover:bg-teal-50 transition">
          AI Coming Soon
        </button>
      </div>
    </div>

  );
}


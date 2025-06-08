"use client";
import React, { useState, useEffect } from "react";
import { formatSeconds } from "@/util/services";
import TennisScoreBoard from "@/components/UI/TennisScoreBoard"
import {MainPreformanceTrackerProps} from "@/util/interfaces"


export default function MainPreformanceTracker({
  videoId,
  leftPlayer,
  rightPlayer,
  live,
  matchTime,
  setInfo,
  onFullAnalytics,
}: MainPreformanceTrackerProps) {
    const [eventTime, setEventTime] = useState<string>("00:00");
    const [matchData, setMatchData] = useState<any>([])
    const [scorePoints, setScorePoints] = useState<any>([])

    useEffect(() => {
      setEventTime(formatSeconds(matchTime));  
    }, [matchTime]);

  async function getMatchData() {
    // note: our GET handler expects `?matchId=…`
    const res = await fetch(`/api/getMatchData?id=${videoId}`);
    const json = await res.json();


    if (res.ok) {
      setMatchData(json.data);
          console.log(json.data)
      setScorePoints(json.data.scorePoints)
    } else {
      console.error("Failed to load tags:", json);
    }
  }

  useEffect(() => {
    getMatchData();
  }, []);

  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-lg w-1/3 mx-auto flex flex-col ">
      {/* ─── Main content ─── */}
      <div className="space-y-4 ">
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
        <div className="grid grid-cols-2 gap-3 pt-6 px-4">

            <div className={"flex flex-col items-start p-3 rounded-2xl shadow bg-gray-100"}>
              <span className="flex flex-row justify-center items-center pb-6">
                <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
                  <img
                    src="/images/lables/lable-ball.png"
                    alt="ball"
                    className="w-6 h-6"
                  />
                </div>
                <p className="text-sm text-black font-bold pl-4">Ball Speed</p>
              </span>
              <div className="mt-1 text-5xl font-semibold text-black">
                138
               <span className="text-lg font-light">km/h</span>
              </div>
            </div>

            <div className={"flex flex-col items-start p-3 rounded-2xl shadow bg-gray-100"}>
              <span className="flex flex-row justify-center items-center pb-6">
                 <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
                    <img
                      src="/images/lables/lable-person.png"
                      alt="person"
                      className="w-6 h-6"
                    />
                  </div>
                <p className="text-sm text-black font-bold pl-4">Player Speed</p>
              </span>
              <div className="mt-1 text-5xl font-semibold text-black">
                24
               <span className="text-lg font-light">km/h</span>
              </div>
            </div>

            <div className={"flex flex-col items-start p-3 rounded-2xl shadow bg-gray-100"}>
              <span className="flex flex-row justify-center items-center pb-6">
                <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
                  <img
                    src="/images/lables/lable-time.png" 
                    alt="time"
                    className="w-4 h-4"
                  />
                </div>
                <p className="text-sm text-black font-bold pl-4">Longest Rally</p>
              </span>
              <div className="mt-1 text-5xl font-semibold text-black">
                52
               <span className="text-lg font-light">sec</span>
              </div>
            </div>

            <div className={"flex flex-col items-start p-3 rounded-2xl shadow bg-gray-100"}>
              <span className="flex flex-row justify-center items-center pb-6">
                  <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
                    <img
                      src="/images/lables/lable-target.png" 
                      alt="target"
                      className="w-5 h-5"
                    />
                  </div>
                <p className="text-sm text-black font-bold pl-4">Strikes eff.</p>
              </span>
              <div className="mt-1 text-5xl font-semibold text-black">
                27
               <span className="text-lg font-light">hits/rlly</span>
              </div>
            </div>

        </div>
      </div>
        
      {/* ─── Spacer pushes button to bottom ─── */}
      <div className="mt-auto">
        <button
          onClick={onFullAnalytics}
          className="w-full py-2 border-2 border-teal-300 text-teal-500 font-semibold rounded-xl hover:bg-teal-50 transition"
        >
          AI Analytics Coming Soon
        </button>
      </div>
    </div>

  );
}


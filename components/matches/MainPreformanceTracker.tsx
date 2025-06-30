"use client";
import React, { useState, useEffect } from "react";
import { formatSeconds } from "@/util/services";
import TennisScoreBoard from "@/components/matches/TennisScoreBoard"
import {MainPerformanceTrackerProps, MatchMetric, EventRecord} from "@/util/interfaces"
import AISummery from "@/components/matches/AISummary"
import Image from "next/image";
import Link from "next/link";
import { toast } from 'react-toastify';
import {Msg} from '@/components/UI/ToastTypes';


export default function MainPreformanceTracker({
  videoId,
  leftPlayer,
  rightPlayer,
  live,
  matchTime,
  setInfo,
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
    <div className="bg-white border border-gray-100 rounded-3xl shadow-lg flex flex-col h-full">
      {/* ─── Main content ─── */}
      <div className="space-y-4">
        {/* Top row: avatars + live badge + timer */}
        <div className="flex items-center justify-between p-8 relative bg-gradient-to-b from-white to-gray-200 overflow-hidden
             [clip-path:polygon(0_0,100%_0,100%_85%,50%_100%,0_85%)]">
          {/* Left avatar */}
          <div className="w-18 h-18 rounded-xl overflow-hidden flex justify-center items-center">
            <Image
               src={rightPlayer?.avatar || "/images/default-avatar.png"}
               alt={rightPlayer?.firstName || "Player One"}
               width={64}  // Equivalent to w-16 (16 * 4px = 64px)
               height={64} // Equivalent to h-16 (16 * 4px = 64px)
               className="ring-2 ring-gray-100 object-cover w-25 h-25"
             />
           </div>

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
          <div className="w-18 h-18 rounded-xl overflow-hidden flex justify-center items-center">
            <Image
              src={leftPlayer.avatar || "/images/default-avatar.png"}
              alt={leftPlayer.firstName || "Player Two"}
              width={64}  // Equivalent to w-16 (16 * 4px = 64px)
              height={64} // Equivalent to h-16 (16 * 4px = 64px)
              className="ring-2 ring-gray-100 object-cover w-25 h-full"
            />
          </div>
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
      <div className="mt-auto px-4">
        <p className="text-xs text-black text-center mb-4">Full AI support is not available in this demo</p>
        <Link href="/demo-note">
          <button className="w-full py-2 border border-teal-600 text-black font-semibold text-md rounded-xl hover:bg-teal-600 
            hover:text-white transition-colors duration-300 cursor-pointer mb-4">
            View full version features
          </button>
        </Link>
        <p className="text-xs text-black text-center">Covelant beta 2025</p>
      </div>
    </div>

  );
}


"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ShotSpeedGraph from '@/components/matches/ShotSpeedGraph';
import ServePerformance from '@/components/matches/ServePerformance';
import RallyWinPercentage from '@/components/matches/RallyWinPercentage';
import HeatmapVisualization from '@/components/matches/HeatmapVisualization';
import testData from '@/lib/data/matchSummaryTestData.json';

interface Stroke {
  start: {
    index: number;
    time: number;
  };
  player_hit: 'top' | 'bottom';
  ball_speed: number | null;
  top_player_location: number[];
  bottom_player_location: number[];
  bounce: {
    location: number[];
    state: string;
    start: {
      index: number;
      time: number;
    };
  } | null;
}

interface Rally {
  start: {
    index: number;
    time: number;
  };
  end: {
    index: number;
    time: number;
  };
  summary: {
    player_won_point: string;
    rally_size: number;
    valid_rally: boolean;
  };
  strokes: Stroke[];
}

interface MatchData {
  video_id: string;
  data: Rally[];
}

interface Player {
  id: number;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  email: string;
}

interface MatchInfo {
  id: number;
  videoUrl: string | null;
  imageUrl: string | null;
  type: string | null;
  result: string | null;
  fieldType: string | null;
  status: string | null;
  date: string;
  videoType: string;
  players: Player[];
}

export default function SummaryPage() {
  const params = useParams();
  const matchId = params.id as string;
  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<'top' | 'bottom'>('top');

  // Type assertion for the imported JSON data
  const matchData = testData as MatchData;

  // Fetch match info from API
  useEffect(() => {
    const fetchMatchInfo = async () => {
      try {
        const response = await fetch(`/api/getMatchVideo?id=${matchId}`);
        const result = await response.json();
        
        if (result.success && result.data.playerMatches && result.data.playerMatches[0]) {
          const pm = result.data.playerMatches[0];
          setMatchInfo({
            id: result.data.id,
            videoUrl: result.data.videoUrl,
            imageUrl: result.data.imageUrl,
            type: result.data.type,
            result: result.data.result,
            fieldType: result.data.fieldType,
            status: result.data.status,
            date: result.data.date,
            videoType: result.data.videoType,
            players: [pm.player, pm.playerTwo].filter(Boolean) // Top player (id 1), Bottom player (id 2)
          });
        }
      } catch (error) {
        console.error('Error fetching match info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchInfo();
  }, [matchId]);

  // Get player names - player id 1 is top, player id 2 is bottom
  const topPlayerName = matchInfo?.players[0] 
    ? `${matchInfo.players[0].firstName || ''} ${matchInfo.players[0].lastName || ''}`.trim() || 'Top Player'
    : 'Top Player';
  
  const bottomPlayerName = matchInfo?.players[1]
    ? `${matchInfo.players[1].firstName || ''} ${matchInfo.players[1].lastName || ''}`.trim() || 'Bottom Player'
    : 'Bottom Player';

  // Calculate statistics based on selected player
  const selectedPlayerName = selectedPlayer === 'top' ? topPlayerName : bottomPlayerName;
  const selectedPlayerType = selectedPlayer; // 'top' or 'bottom'
  
  // Points won by selected player
  const playerWins = matchData.data.filter(r => r.summary.player_won_point === selectedPlayerType).length;
  
  // Rallies where selected player participated (all rallies in this case)
  const totalRallies = matchData.data.length;
  const validRallies = matchData.data.filter(r => r.summary.valid_rally).length;
  
  // Calculate average ball speeds for selected player
  const allStrokes = matchData.data.flatMap(r => r.strokes);
  const strokesWithSpeed = allStrokes.filter(s => s.ball_speed !== null);
  const selectedPlayerStrokes = strokesWithSpeed.filter(s => s.player_hit === selectedPlayerType);
  
  const avgSpeed = selectedPlayerStrokes.length > 0
    ? selectedPlayerStrokes.reduce((sum, s) => sum + (s.ball_speed || 0), 0) / selectedPlayerStrokes.length
    : 0;
  
  const maxSpeed = selectedPlayerStrokes.length > 0
    ? Math.max(...selectedPlayerStrokes.map(s => s.ball_speed || 0))
    : 0;

  // Calculate serve statistics for selected player
  // Process rallies sequentially to track first vs second serves
  let totalFirstServes = 0;
  let firstServesIn = 0;
  let firstServePointsWon = 0;
  let totalSecondServes = 0;
  let secondServesIn = 0;
  let secondServePointsWon = 0;
  
  let previousServeWasFault = false;
  let previousServer = null;
  
  matchData.data.forEach((rally) => {
    if (rally.strokes.length === 0) return;
    
    const server = rally.strokes[0].player_hit;
    
    // Only process if selected player is serving
    if (server !== selectedPlayerType) {
      previousServeWasFault = false;
      previousServer = server;
      return;
    }
    
    // Determine if serve was in
    const serveWasIn = rally.strokes.length > 1 || 
                       (rally.strokes.length === 1 && rally.summary.player_won_point === selectedPlayerType);
    
    // Determine if it's a first or second serve
    const isSecondServe = previousServeWasFault && previousServer === server;
    
    if (isSecondServe) {
      // This is a second serve
      totalSecondServes++;
      if (serveWasIn) {
        secondServesIn++;
        if (rally.summary.player_won_point === selectedPlayerType) {
          secondServePointsWon++;
        }
      }
      // Reset fault tracker after second serve (regardless of outcome)
      previousServeWasFault = false;
    } else {
      // This is a first serve
      totalFirstServes++;
      if (serveWasIn) {
        firstServesIn++;
        if (rally.summary.player_won_point === selectedPlayerType) {
          firstServePointsWon++;
        }
        previousServeWasFault = false;
      } else {
        // First serve was a fault
        previousServeWasFault = true;
      }
    }
    
    previousServer = server;
  });
  
  const firstServePercent = totalFirstServes > 0 ? Math.round((firstServesIn / totalFirstServes) * 100) : 0;
  const firstServePointsWonPercent = firstServesIn > 0 ? Math.round((firstServePointsWon / firstServesIn) * 100) : 0;
  const secondServePointsWonPercent = secondServesIn > 0 ? Math.round((secondServePointsWon / secondServesIn) * 100) : 0;
  
  const serveStats = {
    firstServePercent: firstServePercent,
    firstServePointsWon: firstServePointsWonPercent,
    secondServePointsWon: secondServePointsWonPercent,
  };
  
  const playerColor = selectedPlayer === 'top' ? '#42B6B1' : '#FE8E25';
  
  // Calculate rally win percentage for selected player
  const rallyWinPercentage = totalRallies > 0 ? Math.round((playerWins / totalRallies) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-24">
      <div className="max-w-[1600px] mx-auto">
        {/* Top: Player Selector */}
        <div className="mb-6">
          <div className="flex bg-white rounded-full p-1 shadow-md border border-gray-200 w-fit">
            <button
              onClick={() => setSelectedPlayer('top')}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedPlayer === 'top'
                  ? 'bg-[#42B6B1] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {matchInfo?.players[0]?.avatar && (
                <img 
                  src={matchInfo.players[0].avatar} 
                  alt={topPlayerName}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              {topPlayerName}
            </button>
            <button
              onClick={() => setSelectedPlayer('bottom')}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedPlayer === 'bottom'
                  ? 'bg-[#FE8E25] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {matchInfo?.players[1]?.avatar && (
                <img 
                  src={matchInfo.players[1].avatar} 
                  alt={bottomPlayerName}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              {bottomPlayerName}
            </button>
          </div>
        </div>

        {/* Main Layout: 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Heatmap Visualization */}
            <HeatmapVisualization 
              data={matchData.data}
              selectedPlayer={selectedPlayer}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Serve Performance */}
            <ServePerformance stats={serveStats} playerColor={playerColor} />

            {/* Rally Win Percentage and Shot Speed Graph - Side by Side */}
            <div className="flex gap-4">
              {/* Rally Win Percentage - flex-1 */}
              <div className="flex-1">
                <RallyWinPercentage 
                  percentage={rallyWinPercentage} 
                  playerColor={playerColor}
                />
              </div>

              {/* Shot Speed Graph - flex-2 */}
              <div className="flex-[2] bg-white p-4 rounded-2xl shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-600"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                  <div className="px-4 py-1 bg-gray-50 rounded-full">
                    <span className="text-xs font-semibold text-gray-700">Shot Speed</span>
                  </div>
                </div>
                <div className="h-[180px]">
                  <ShotSpeedGraph 
                    data={matchData.data} 
                    topPlayerName={topPlayerName}
                    bottomPlayerName={bottomPlayerName}
                    selectedPlayer={selectedPlayer}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


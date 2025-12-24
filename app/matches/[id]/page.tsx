'use client';
import { useEffect, useState, useCallback  } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/app/firebase/config";
import GameTimelineEditor from "@/components/game-timeline/GameTimelineEditor";
import CustomVideoPlayer from "@/components/matches/CustomVideoPlayer"
import MainTagManager from "@/components/matches/TagManager/MainTagManager"
import MainPreformanceTracker from "@/components/matches/MainPreformanceTracker"
import {Player, MatchEventData} from "@/util/interfaces"
import {defaultPlayer} from "@/util/default"
import AnalyticsCard from "@/components/matches/AnalyticsCard";
import Loading from "../loading"
import { useParams,useRouter } from 'next/navigation'
import { toast } from 'react-toastify';
import {Msg} from '@/components/UI/ToastTypes';
import Image from "next/image";
import { Tags, Film } from "lucide-react";
import * as Sentry from "@sentry/nextjs";
import { useMatchStatusUpdater } from "@/hooks/useMatchStatusUpdater";
import StatusTag from "@/components/StatusTag";
import { AnalysisStatus } from "@/util/interfaces";


export default function Matches() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoStart, setVideoStart] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentVideoTime, setCurrentVideoTime] = useState<number>(0);
  const [playerOne, setPlayerOne] = useState<Player>(defaultPlayer)
  const [playerTwo, setPlayerTwo] = useState<Player>(defaultPlayer)
  const [markers, setMarkers] = useState<MatchEventData[]>([]);
  const [videoSections, setVideoSections] = useState([]);
  const [mode , setMode] = useState<boolean>(false);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus | null>(null);
  const params = useParams<{ id: string }>()
  const router = useRouter();
  
  // Auto-update match status every 5 minutes
  useMatchStatusUpdater({ 
    matchId: videoId, 
    enabled: videoId !== 0,
    onStatusUpdate: (updatedStatus) => {
      setAnalysisStatus(updatedStatus);
    }
  });
  
// 1) Fetch video metadata & download URL
const getVideoData = useCallback(async() => {
    const matchId = Number(params.id)
    const vid = await fetch(`/api/getMatchVideo?id=${encodeURIComponent(matchId)}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) return res.data;
        Sentry.captureException(res);
      });
    const response = await fetch(`/api/getMatchSections?id=${encodeURIComponent(matchId)}`);
    const data = await response.json();
    setVideoSections(data.data);
    console.log("Fetched video sections:", data.data);
    setPlayerOne(vid.playerMatches[0].player)
    setPlayerTwo(vid.playerMatches[0].playerTwo)
    setVideoId(vid.id);
    setVideoStart(vid.date);
    setAnalysisStatus(vid.analysisStatus || null);
    const url = await getDownloadURL(ref(storage, vid.videoUrl));
    setVideoUrl(url);
    setLoading(false);
  }, []);


  // 2) Fetch existing tags for this match
  async function loadTags(){
    const res = await fetch(`/api/getTags?id=${videoId}`);
    const json = await res.json();
    if (json.data.length !== 0) {
      setMarkers(json.data)
    } else {
      setMarkers([])
    }
  }
  

  const handleTimeUpdate = (t: number) => setCurrentVideoTime(t);

  // 3) When a single new tag is added via the form
  const handleAddTag = (newTag: MatchEventData) => {
    setMarkers((prev: MatchEventData[]) => [...prev, newTag]);
  };

  // delete tag
  const handleDeleteTag = async (id: number) => {
  try {
    const res = await fetch("/api/deleteTag", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok)
    {
      toast.error("Something went wrong while deleting the tag", {
        position: 'bottom-right',
      })
    }
    setMarkers(prev => prev.filter(m => m.id !== id));
  } catch (err) {
    toast.error(Msg, {
      data: {
        title: 'Error deleting tag',
        message: 'There was a problem with our servers while deleting the tag. Please try again later.',
      },
      position: 'bottom-right',
    })
    Sentry.captureException(err);
  }
};

  // On mount, load video → then tags once we have videoId
  useEffect(() => {
    getVideoData();
  }, []);

  // once videoId is known, fetch tags
  useEffect(() => {
    if (videoId !== 0) {
      loadTags();
    }
  }, [videoId]);

  if (loading) return <Loading/>;

  return (
      <div className="bg-white h-screen overflow-x-hidden pt-5 max-md:pt-10">
        <div className="px-10 2xl:px-30 2xl:px-50 space-y-4 bg-white">
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 z-10
              px-4 py-4 rounded-xl bg-white shadow-md 
              hover:bg-gray-100 transition-colors duration-100 
              hover:scale-105 active:scale-95
            "
          >
          <Image src="https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/images%2Ficons%2FBackArrow.svg?alt=media&token=f4695bb5-dfd2-4733-9755-32748dbc86b8" alt="Back" width={20} height={20} />
          </button>
          
          {/* Status tag */}
          <div className="absolute top-4 right-4 z-10">
            <StatusTag analysisStatus={analysisStatus} />
          </div>

            
          {/* video + tags on top / left */}
          <div className="w-full space-x-4 gap-4 flex flex-row items-stretch">
            <CustomVideoPlayer
              src={videoUrl || ""}
              markers={markers}
              videoStartTime={videoStart ?? "2025-06-01T14:30:00Z"}
              onTimeUpdate={handleTimeUpdate}
              onDeleteTag={handleDeleteTag}
              timeStamp={currentVideoTime}
              videoSections={videoSections}
            />

            <MainPreformanceTracker
              videoId={videoId}
              playerOne={playerOne}
              playerTwo={playerTwo}
              matchTime={currentVideoTime}
              videoSections={videoSections}
              />
          </div>

            {/* performance panel below / right */}
            <div className="w-full flex flex-row gap-4 max-md:flex-col relative">
              {/* Toggle button (top-left, inside container) */}
              <button
                onClick={() => setMode((prev) => !prev)}
                className="
                  absolute top-3 left-3 z-50
                  flex items-center justify-center
                  h-10 w-10 rounded-xl bg-white
                  bg-gray-900 text-black
                  shadow-lg hover:bg-gray-200
                  transition-all
                "
                aria-label="Switch mode"
              >
                {mode ? <Film size={18} /> : <Tags size={18} />}
              </button>

              {mode ? (
                <>
                  <MainTagManager
                    videoId={videoId}
                    timeStamp={currentVideoTime}
                    onAddTag={handleAddTag}
                  />
                  <AnalyticsCard />
                </>
              ) : (
                <GameTimelineEditor
                  playerOne={playerOne}
                  playerTwo={playerTwo}
                  videoSections={videoSections}
                  onSeekVideo={(timeSeconds) => setCurrentVideoTime(timeSeconds)}
                />
              )}
            </div>

        </div>
      </div>
  );
};


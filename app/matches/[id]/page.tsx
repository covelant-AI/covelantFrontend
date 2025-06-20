'use client';
import { useEffect, useState, useCallback  } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/app/firebase/config";
import CustomVideoPlayer from "@/components/matches/CustomVideoPlayer"
import MainTagManager from "@/components/matches/TagManager/MainTagManager"
import MainPreformanceTracker from "@/components/matches/MainPreformanceTracker"
import {Player, MatchEventData} from "@/util/interfaces"
import {defaultPlayer} from "@/util/default"
import Loading from "../loading"
import { useParams  } from 'next/navigation'
import { toast } from 'react-toastify';
import {Msg} from '@/components/UI/ToastTypes';
import * as Sentry from "@sentry/nextjs";


export default function Matches() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoStart, setVideoStart] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentVideoTime, setCurrentVideoTime] = useState<number>(0);
  const [playerOne, setPlayerOne] = useState<Player>(defaultPlayer)
  const [playerTwo, setPlayerTwo] = useState<Player>(defaultPlayer)
  const [markers, setMarkers] = useState<MatchEventData[]>([]);
  const params = useParams<{ id: string }>()
  
// 1) Fetch video metadata & download URL
const getVideoData = useCallback(async() => {
    const matchId = Number(params.id)
    const vid = await fetch(`/api/getMatchVideo?id=${encodeURIComponent(matchId)}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) return res.data;
        Sentry.captureException(res);
      });
      setPlayerOne(vid.playerMatches[0].player)
      setPlayerTwo(vid.playerMatches[0].playerTwo)
      setVideoId(vid.id);
      setVideoStart(vid.date);

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
      <div className="bg-white h-screen overflow-x-hidden pt-25">
          <div className="px-10 md:px-40 lg:px-30 2xl:px-40 2xl:px-60 bg-white">
          <div className="flex flex-col lg:flex-row mt-8 w-full gap-4">
            {/* video + tags on top / left */}
            <div className="w-full lg:w-2/3 space-y-4 mx-auto flex flex-col items-center">
              <CustomVideoPlayer
                src={videoUrl || ""}
                markers={markers}
                videoStartTime={videoStart ?? "2025-06-01T14:30:00Z"}
                onTimeUpdate={handleTimeUpdate}
                onDeleteTag={handleDeleteTag} 
              />

              <MainTagManager
                videoId={videoId}
                timeStamp={currentVideoTime}
                onAddTag={handleAddTag}
              />
            </div>

            {/* performance panel below / right */}
            <div className="w-full lg:w-1/3">
              <MainPreformanceTracker
                videoId={videoId}
                leftPlayer={playerOne}
                rightPlayer={playerTwo}
                live={false}
                matchTime={currentVideoTime}
                setInfo="VS"
                />
            </div>
          </div>
        </div>
      </div>
  );
};


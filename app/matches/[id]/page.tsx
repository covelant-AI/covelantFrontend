'use client';
import { useEffect, useState } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/app/firebase/config";
import NavBar from "@/components/nav/Navbar";
import CustomVideoPlayer from "@/components/UI/CustomVideoPlayer"
import MainTagManager from "@/components/TagManager/MainTagManager"
import MainPreformanceTracker from "@/components/MainPreformanceTracker"
import Loading from "../loading"
import Link from "next/link";
import Image from "next/image";


interface ProfilePageProps {
  params: { id: string };
}

export default function Matches({ params }: ProfilePageProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoStart, setVideoStart] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVideoTime, setCurrentVideoTime] = useState<number>(0);
  const [playerOne, setPlayerOne] = useState<any>({})
  const [playerTwo, setPlayerTwo] = useState<any>({})
  const [markers, setMarkers] = useState<any>([]);


// 1) Fetch video metadata & download URL
  async function getVideoData() {
    const { id } = params;
    const vid = await fetch(`/api/getMatchVideo?id=${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) return res.data;
        throw new Error("No video data");
      });
      setPlayerOne(vid.playerMatches[0].player)
      setPlayerTwo(vid.playerMatches[0].playerTwo)
      setVideoId(vid.id);
      setVideoStart(vid.date);

      const url = await getDownloadURL(ref(storage, vid.videoUrl));
      setVideoUrl(url);
      setLoading(false);
  }

  // 2) Fetch existing tags for this match
  async function loadTags() {
    // note: our GET handler expects `?matchId=…`
    const res = await fetch(`/api/getTags?id=${videoId}`);
    const json = await res.json();

    if (res.ok) {
      setMarkers(json.data);
    } else {
      console.error("Failed to load tags:", json);
    }
  }

  const handleTimeUpdate = (t: number) => setCurrentVideoTime(t);

  // 3) When a single new tag is added via the form
  const handleAddTag = (newTag: any) => {
    setMarkers((prev: any) => [...prev, newTag]);
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
  if (error)   return <p>{error}</p>;


  return (
    <>
    <NavBar/>
      <div className="bg-white h-screen overflow-x-hidden pt-25">
          <div className="px-10 md:px-40 lg:px-30 xl:px-50 2xl:px-60 bg-white">
          <div className="flex flex-col lg:flex-row mt-8 w-full gap-4">
            {/* video + tags on top / left */}
            <div className="w-full lg:w-2/3 space-y-4 mx-auto flex flex-col items-center">
              <CustomVideoPlayer
                src={videoUrl || ""}
                markers={markers}
                videoStartTime={videoStart ?? "2025-06-01T14:30:00Z"}
                onTimeUpdate={handleTimeUpdate}
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
    </>
  );
};


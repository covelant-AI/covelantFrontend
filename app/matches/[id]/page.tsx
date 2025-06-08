'use client';
import { useEffect, useState } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/app/firebase/config";
import NavBar from "@/components/nav/Navbar";
import CustomVideoPlayer from "@/components/UI/CustomVideoPlayer"
import MainTagManager from "@/components/TagManager/MainTagManager"
import MainPreformanceTracker from "@/components/MainPreformanceTracker"
import Loading from "../loading"


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
    <div className="px-20 h-screen bg-white" >
      <h1>Stop playing around and get back to analysing!</h1>
      <NavBar/>
      <div className="flex md:flex-col-2 mt-30 w-full px-50 gap-4 max-md:flex-wrap">  {/*/////////////UPDATE LATER//////////////// */}
        <div className="w-2/3">
          <CustomVideoPlayer
            src={videoUrl || ""}
            markers={markers}
            videoStartTime={videoStart ?? "2025-06-01T14:30:00Z"}
            onTimeUpdate={handleTimeUpdate}
          />
          <MainTagManager videoId={videoId} timeStamp={currentVideoTime} onAddTag={handleAddTag}/>
        </div>
            <MainPreformanceTracker
              videoId={videoId}
              leftPlayer={playerOne}
              rightPlayer={playerTwo}
              live={false}
              matchTime={currentVideoTime}
              setInfo="VS"
              onFullAnalytics={() => console.log("Go to full analytics")}
            />
      </div>
    </div>
  );
};


'use client';
import { useEffect, useState } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/app/firebase/config";
import NavBar from "@/components/nav/Navbar";
import CustomVideoPlayer from "@/components/UI/CustomVideoPlayer"
import MainTagManager from "@/components/TagManager/MainTagManager"


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
  const [markers, setMarkers] = useState<any>([]);

  async function getVideoData(){
    const { id } = params;

    const videoData: any = await fetch(`/api/getMatchVideo?id=${encodeURIComponent(id)}`, {
          method: 'GET',
        })
      .then((r) => r.json())
      .then((result) => {
        if(result.success) return result.data
        console.log("no video was sent back")
      });
      setVideoId(videoData.id)
      setVideoStart(videoData.date)
      const videoRef = ref(storage, videoData.videoUrl);

     // 2) Ask for its download URL:
     getDownloadURL(videoRef)
       .then((url: string) => {
         setVideoUrl(url);
         setLoading(false);
       })
       .catch((err: Error) => {
         console.error("Could not get download URL:", err);
         setError("Failed to load video.");
         setLoading(false);
       });
  }

    const handleTimeUpdate = (timeInSeconds: number) => {
    setCurrentVideoTime(timeInSeconds);
  };

  const handleAddTag = (newTag: any) => {
    setMarkers((current: any) => [...current, newTag]);
  };
  
const timestampedMarkers = [
  { timestamp: "2025-06-26T00:00:05Z", color: "#A9C3FF", label: "Ball Speed Spike", lablePath: "/images/lables/lable-error.png"  }, //  5 seconds in
  { timestamp: "2025-06-26T00:00:15Z", color: "#FFDE9C", label: "unforced Error", lablePath: "/images/lables/lable-check.png"  }, // 15 seconds in
  { timestamp: "2025-06-26T00:01:00Z", color: "#FFDE9C", label: "max speed", lablePath: "/images/lables/lable-person.png"  },        // 60 seconds in (defaults to white)
  { timestamp: "2025-06-26T00:02:30Z", color: "#A9C3FF", label: "top spin", lablePath: "/images/lables/lable-time.png"  },         //150 seconds in
];

  useEffect(() => {
    getVideoData()
  }, []);

  if (loading) {
    return <p>Loading video…</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="px-20 h-screen bg-white" >
      <h1>Stop playing around and get back to analysing!</h1>
      <NavBar/>
      <div className="flex flex-col-2 mt-30 w-full gap-8">
        <div className="w-2/3">
          <CustomVideoPlayer
            src={videoUrl || ""}
            markers={markers}
            videoStartTime={videoStart ?? "2025-06-01T14:30:00Z"}
            onTimeUpdate={handleTimeUpdate}
          />
          <MainTagManager videoId={videoId} timeStamp={currentVideoTime} onAddTag={handleAddTag}/>
        </div>
          <div className="rounded-lg bg-gray-600 w-1/3">
        </div>
      </div>
    </div>
  );
};


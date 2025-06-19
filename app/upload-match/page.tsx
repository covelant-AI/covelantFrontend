'use client';
import { useState,useCallback, SetStateAction } from 'react'
import Image from "next/image";
import Link from "next/link";
import UploadVideo from "@/components/UploadPage/uploadVideo";
import MatchData from "@/components/UploadPage/MatchData";
import { Player } from '@/util/interfaces'
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {Msg} from '@/components/UI/ToastTypes';
import * as Sentry from "@sentry/nextjs";


export default function UploadMatchPage() {
  const router = useRouter();
    const [matchInfo, setMatchInfo] = useState<{
    playerOne: Player | null
    playerTwo: Player | null
    matchType: string
    fieldType: string
    date: string
  }>({
    playerOne: null,
    playerTwo: null,
    matchType: '',
    fieldType: '',
    date: '',
  })
  const [videoURL, setVideoURL] = useState<string | null>(null)
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null)

  
  const handleMatchDataChange = useCallback((data: SetStateAction<{ playerOne: Player | null; playerTwo: Player | null; matchType: string; fieldType: string; date: string; }>) => {
    setMatchInfo(data)
  }, [])

  function handleSubmit(){
    if (!videoURL || !videoThumbnail) {
      toast.warning(Msg, {
        data: {
          title: 'Upload a video before proceeding.',
          message: 'Please upload a video to analyze. Make sure it is and .mp4 format and less than 100MB in size.',
        },
        position: 'bottom-right',
      })
      return;
    }
    if (!matchInfo.playerOne || !matchInfo.playerTwo || !matchInfo.date || !matchInfo.fieldType || !matchInfo.matchType) {
      toast.warning(Msg, {
        data: {
          title: 'Missing Match Information',
          message: 'Please make sure to add both players, Select Match Type, Select Court, and Date before proceeding.',
        },
        position: 'bottom-right',
      })
      return;
    }

    const matchData = {
      ...matchInfo,
      videoURL,
      thumbnail: videoThumbnail,
    };
    fetch('/api/creatematch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matchData),
    })
      .then((response) => response.json())
      .then((data) => {
       if (!data.success) {
        toast.warning(Msg, {
        data: {
          title: 'Failed to upload match',
          message: 'Something went wrong while uploading your match. Please try again later.',
        },
        position: 'bottom-right',
      })
      } 
      toast.success("Match uploaded successfully!",{
          position: 'bottom-right',})
      router.push('/');
      })
      .catch((error) => {
        toast.error(Msg, {
          data: {
            title: 'Error uploading your video',
            message: 'There was a problem uploading your video. Please try again later or contact support.',
          },
          position: 'bottom-right',
        })
        Sentry.captureException(error);
      });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-20 py-10">
      {/* Header */}
      <div className="mb-8 text-center flex flex-col items-center">
        <div className="w-screen flex justify-start px-40">
            <Link href="/">
                <button className="px-6 py-4 rounded-xl bg-white shadow-md hover:bg-gray-100 transition-colors 
                    duration-100 hover:scale-105 hover:cursor-pointer active:scale-95 transition-transform">
                  <Image src="https://firebasestorage.googleapis.com/v0/b/fir-auth-f8ffb.firebasestorage.app/o/images%2Ficons%2FBackArrow.svg?alt=media&token=f4695bb5-dfd2-4733-9755-32748dbc86b8"
                   alt="Back" width={20} height={20} />
                </button>
            </Link>
        </div>
        <span>
        <h1 className="text-5xl font-bold text-gray-900">Upload Match Video</h1>
        <p className="text-lg text-gray-400 mt-2">
          Pick a video of a match you would like to analyze and <br/> make sure that the video satisfies the requirements.
        </p>
        </span>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Upload Section */}
        <UploadVideo
          onVideoUpload={(url, thumbnail) => {
            setVideoURL(url);
            setVideoThumbnail(thumbnail);
          }}
        />

        {/* Match Data Section */}
        <MatchData onDataChange={handleMatchDataChange} />
      </div>
      {/* Next Button */}
        <button onClick={handleSubmit} className="bg-[#4DBAB5] mt-6 text-xl px-20 py-2 rounded-xl cursor-pointer 
        hover:bg-teal-600 transition-colors duration-100 active:scale-95 transition-transform">
          Next
        </button>
    </div>
  );
}

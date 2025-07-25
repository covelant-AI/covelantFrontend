'use client';
import { useState, useCallback, SetStateAction } from 'react'
import UploadVideo from "@/components/UploadPage/uploadVideo";
import MatchData from "@/components/UploadPage/MatchData";
import StaticPlayerDisplay from "@/components/UI/StaticPlayerDisplay"
import OpponentSelector  from '@/components/UploadPage/OpponentSelector';
import { Player } from '@/util/interfaces'
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Msg } from '@/components/UI/ToastTypes';
import * as Sentry from "@sentry/nextjs";
import { useAuth } from '@/app/context/AuthContext';

export default function UploadMatchPage() {
  const router = useRouter();

  const [step, setStep] = useState(1); // Step control

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
  });

  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
  const [playerOne, setPlayerOne] = useState<Player | null>(null)
  const [playerTwo, setPlayerTwo] = useState<Player | null>(null)
  const [features, setFeatures] = useState<string[]>([]);
  const {profile} = useAuth(); 

  const handleMatchDataChange = useCallback((data: { matchType: string; fieldType: string; date: string }) => {
    setMatchInfo(prev => ({
      ...prev,
      matchType: data.matchType,
      fieldType: data.fieldType,
      date: data.date,
    }));
  }, []);

  const handleSubmit = () => {
    if (!videoURL || !videoThumbnail) {
      toast.warning(Msg, {
        data: {
          title: 'Upload a video before proceeding.',
          message: 'Please upload a video to analyze. Make sure it is and .mp4 format and less than 100MB in size.',
        },
        position: 'bottom-right',
      });
      return;
    }
    if (!matchInfo.playerOne || !matchInfo.playerTwo || !matchInfo.date || !matchInfo.fieldType || !matchInfo.matchType) {
      toast.warning(Msg, {
        data: {
          title: 'Missing Match Information',
          message: 'Please make sure to add both players, Select Match Type, Select Court, and Date before proceeding.',
        },
        position: 'bottom-right',
      });
      return;
    }

    const matchData = {
      ...matchInfo,
      videoURL,
      thumbnail: videoThumbnail,
      features,
    };

    fetch('/api/creatematch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
          });
        } else {
          toast.success("Match uploaded successfully!", { position: 'bottom-right' });
          router.push('/');
        }
      })
      .catch((error) => {
        toast.error(Msg, {
          data: {
            title: 'Error uploading your video',
            message: 'There was a problem uploading your video. Please try again later or contact support.',
          },
          position: 'bottom-right',
        });
        Sentry.captureException(error);
      });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <UploadVideo
              onVideoUpload={(url, thumbnail) => {
                setVideoURL(url);
                setVideoThumbnail(thumbnail);
              }}
              uploadedThumbnail={videoThumbnail}
            />

            {/* Player Selection */}
            <div className="flex justify-between gap-4 max-sm:gap-1 mb-4 max-[360]:flex-col">
              {profile?.type === "player" ? (
                <StaticPlayerDisplay
                  onSelect={setPlayerOne}
                />
              ) : (
                <OpponentSelector
                  onSelect={setPlayerOne}
                  selected={matchInfo.playerOne}
                />
              )}
              <div className="flex items-center font-bold text-gray-400 max-[360]:justify-center">VS</div>
              <OpponentSelector
                onSelect={setPlayerTwo}
                selected={matchInfo.playerTwo}
              />
            </div>

            <button
              onClick={() => {
                setMatchInfo(prev => ({
                  ...prev,
                  playerOne,
                  playerTwo,
                }));
                setStep(2);
              }}
              className="bg-[#4DBAB5] mt-6 text-xl px-20 py-2 rounded-xl cursor-pointer 
              hover:bg-teal-600 transition-colors duration-100 active:scale-95 transition-transform hover:text-white"
            >
              Next
            </button>
          </>
        );
      case 2:
        return (
        <>
          <MatchData onDataChange={handleMatchDataChange} />
          <button onClick={handleSubmit} className="bg-[#4DBAB5] mt-6 text-xl px-20 py-2 rounded-xl cursor-pointer 
          hover:bg-teal-600 transition-colors duration-100 active:scale-95 transition-transform hover:text-white">
            Analyse
          </button>
        </>
      )
      default:
        return null;
    }
  };

  return (
    <div className=" flex flex-col min-h-screen items-center justify-center px-20 py-10 max-md:px-4">
      <div className="flex flex-col gap-6 bg-gray-white border border-1 rounded-xl items-center justify-center p-8 min-w-[400px] w-full max-w-3xl shadow-lg">
      <div className="grid grid-cols-1 gap-2 w-full mb-8 text-center flex flex-col items-center">
        <span>
          <h1 className="text-5xl font-bold text-gray-900 max-md:text-2xl max-md:mt-20">Upload Match Video</h1>
          <p className="text-lg text-gray-400 mt-2 max-md:text-sm">
            Pick a video of a match you would like to analyze and <br /> make sure that the video satisfies the requirements.
          </p>
        </span>
      </div>
      
        {renderStep()}
        <div className="flex justify-between mt-6 w-full">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="bg-gray-200 px-6 py-2 rounded-lg text-gray-700 hover:bg-gray-300 transition-all"
            >
              Back
            </button>
          )}
        </div>
        </div>
      </div>
  );
}

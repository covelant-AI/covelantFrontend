'use client';
import { useState, useCallback } from 'react'
import UploadVideo from "@/components/UploadPage/uploadVideo";
import MatchData from "@/components/UploadPage/MatchData";
import StaticPlayerDisplay from "@/components/UI/StaticPlayerDisplay"
import OpponentSelector  from '@/components/UploadPage/OpponentSelector';
import AiFeatureSelector from "@/components/UploadPage/AiFeatureSelector";
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
    playerOne: Player | null;
    playerTwo: Player | null;
    matchType: string;
    fieldType: string;
    date: string;
    winner: 'playerOne' | 'playerTwo' | null;
  }>({
    playerOne: null,
    playerTwo: null,
    matchType: '',
    fieldType: '',
    date: '',
    winner: null,
  });

  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | undefined>(undefined);
  const [playerOne, setPlayerOne] = useState<Player | null>(null)
  const [playerTwo, setPlayerTwo] = useState<Player | null>(null)
  const [features, setFeatures] = useState<string[]>([]);
  const {profile} = useAuth(); 

  const handleMatchDataChange = useCallback((data: {
    matchType: string;
    fieldType: string;
    date: string;
    winner: 'playerOne' | 'playerTwo' | null;
  }) => {
    setMatchInfo(prev => ({
      ...prev,
      matchType: data.matchType,
      fieldType: data.fieldType,
      date: data.date,
      winner: data.winner,
    }));
  }, []);

  const handleStepTwoNext = () => {
  if (
    !matchInfo.playerOne ||
    !matchInfo.playerTwo ||
    !matchInfo.date ||
    !matchInfo.fieldType ||
    !matchInfo.matchType ||
    !matchInfo.winner
  ) {
    toast.warning(Msg, {
      data: {
        title: 'Missing Match Information',
        message:
          'Please make sure to add both players, select Match Type, Court, Date, and a Winner before proceeding.',
      },
      position: 'bottom-right',
    });
    return;
  }

  setStep(3);
};

const handleSubmit = (selectedFeatures: string[]) => {
  if (!videoURL || !videoThumbnail) {
    toast.warning(Msg, {
      data: {
        title: 'Upload a video before proceeding.',
        message: 'Please upload a video to analyze. Make sure it is .mp4 and less than 100MB.',
      },
      position: 'bottom-right',
    });
    return;
  }

  if (
    !matchInfo.playerOne ||
    !matchInfo.playerTwo ||
    !matchInfo.date ||
    !matchInfo.fieldType ||
    !matchInfo.matchType ||
    !matchInfo.winner
  ) {
    toast.warning(Msg, {
      data: {
        title: 'Missing Match Information',
        message: 'Add both players, court, match type, date, and winner.',
      },
      position: 'bottom-right',
    });
    return;
  }

  // Is playerTwo an existing Player (has an email)? Otherwise it's an opponent-by-name.
  const playerTwoIsPlayer =
    typeof (matchInfo.playerTwo as any)?.email === 'string' &&
    (matchInfo.playerTwo as any).email.trim() !== '';

  // If opponent-by-name, make sure we have both names
  if (!playerTwoIsPlayer) {
    const fn = (matchInfo.playerTwo as any)?.firstName?.trim();
    const ln = (matchInfo.playerTwo as any)?.lastName?.trim();
    if (!fn || !ln) {
      toast.warning(Msg, {
        data: {
          title: 'Opponent name required',
          message: 'Please provide first and last name for the opponent.',
        },
        position: 'bottom-right',
      });
      return;
    }
  }

  // Shape payload exactly as the API expects:
  // - playerOne: by email
  // - playerTwo: either by email OR by { firstName, lastName }
  const apiPlayerOne = { email: (matchInfo.playerOne as any).email };
  const apiPlayerTwo = playerTwoIsPlayer
    ? { email: (matchInfo.playerTwo as any).email }
    : {
        firstName: (matchInfo.playerTwo as any).firstName,
        lastName: (matchInfo.playerTwo as any).lastName,
      };

  // Winner logic:
  // - If playerOne selected as winner → send playerOne.id
  // - If playerTwo selected and it's a Player → send playerTwo.id
  // - If playerTwo selected and it's an Opponent → send a sentinel that != playerOne.id (e.g., -1)
  const winnerId =
    matchInfo.winner === 'playerOne'
      ? (matchInfo.playerOne as any)?.id
      : playerTwoIsPlayer
      ? (matchInfo.playerTwo as any)?.id
      : -1; // opponent won (backend checks winnerId === playerOne.id; anything else => playerTwo/opponent wins)

  const matchData = {
    ...matchInfo,
    playerOne: apiPlayerOne, // override with API shape
    playerTwo: apiPlayerTwo, // override with API shape
    videoURL,
    thumbnail: videoThumbnail,
    duration: videoDuration,
    features: selectedFeatures,
    winnerId,
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
            message: 'Something went wrong while uploading your match.',
          },
          position: 'bottom-right',
        });
      } else {
        toast.success('Match uploaded successfully!', { position: 'bottom-right' });
        router.push('/');
      }
    })
    .catch((error) => {
      toast.error(Msg, {
        data: {
          title: 'Error uploading your video',
          message: 'There was a problem uploading your video. Please try again later.',
        },
        position: 'bottom-right',
      });
      Sentry.captureException(error);
    });
};



  // Added function for step 1 validation
  const handleNext = () => {
    if (!playerOne || !playerTwo || !videoURL) {
      toast.warning(Msg, {
        data: {
          title: 'Missing Required Data',
          message: 'Please select both players and upload a video before proceeding.',
        },
        position: 'bottom-right',
      });
      return;
    }
    setMatchInfo(prev => ({
      ...prev,
      playerOne,
      playerTwo,
    }));
    setStep(2);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <UploadVideo
              onVideoUpload={(url, thumbnail, duration) => {
                setVideoURL(url);
                setVideoThumbnail(thumbnail);
                setVideoDuration(duration);
              }}
              uploadedThumbnail={videoThumbnail}
              profileEmail={profile?.email || ''}
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
              onClick={handleNext}
              className={`bg-[#4DBAB5] mt-6 text-xl px-20 py-2 rounded-xl cursor-pointer 
              hover:bg-teal-600 transition-colors duration-100 active:scale-95 transition-transform hover:text-white`}
            >
              Next
            </button>
          </>
        );
      case 2:
        return (
        <>
          <MatchData
            onDataChange={handleMatchDataChange}
            playerOne={playerOne!}
            playerTwo={playerTwo!}
          />
          <button onClick={handleStepTwoNext} className="bg-[#4DBAB5] mt-6 text-xl px-20 py-2 rounded-xl cursor-pointer 
          hover:bg-teal-600 transition-colors duration-100 active:scale-95 transition-transform hover:text-white">
             Next
          </button>
        </>)
      case 3:
        return (
          <AiFeatureSelector
            onFeatureChange={(features) => setFeatures(features)}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className=" flex flex-col min-h-screen items-center justify-center px-20 py-10 max-md:px-4">
      <div className="flex flex-col gap-6 bg-gray-white border border-1 rounded-xl items-center justify-center p-8 min-w-[400px] w-full max-w-3xl shadow-lg">
      {step == 1 && (
      <div className="grid grid-cols-1 gap-2 w-full mb-8 text-center flex flex-col items-center">
        <span>
          <h1 className="text-5xl font-bold text-gray-900 max-md:text-2xl max-md:mt-20">Upload Match Video</h1>
          <p className="text-lg text-gray-400 mt-2 max-md:text-sm">
            Pick a video of a match you would like to analyze and <br /> make sure that the video satisfies the requirements.
          </p>
        </span>
      </div>)}
      
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

"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import * as Sentry from "@sentry/nextjs";
import { toast } from "react-toastify";
import { Msg } from "@/components/UI/ToastTypes";

import Loading from "../loading";

import CustomVideoPlayer from "@/components/matches/CustomVideoPlayer";
import MainPreformanceTracker from "@/components/matches/MainPreformanceTracker";
import GameTimelineEditor from "@/components/matches/game-timeline/GameTimelineEditor";
import MainTagManager from "@/components/matches/TagManager/MainTagManager";
import AnalyticsCard from "@/components/matches/AnalyticsCard";
import StatusTag from "@/components/StatusTag";

import { useMatchStatusUpdater } from "@/hooks/useMatchStatusUpdater";
import type { MatchEventData, Player, AnalysisStatus } from "@/util/interfaces";
import type { VideoSection as InterfaceVideoSection } from "@/util/interfaces";
import { toTimelineVideoSections } from "@/components/matches/utils/sectionMapper";
import { defaultPlayer } from "@/util/default";

import { fetchMatchMeta, fetchMatchSections, fetchTags, deleteTag as deleteTagApi } from "@/components/matches/services/matchApi";
import { getFirebaseDownloadUrl } from "@/components/matches/services/videoUrl";
import { appendTag, removeTagById } from "@/components/matches/utils/tags";
import { BackButton } from "@/components/matches/BackButton";
import { ModeToggleButton } from "@/components/matches/ModeToggleButton";

export default function Matches() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoStart, setVideoStart] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentVideoTime, setCurrentVideoTime] = useState<number>(0);

  const [playerOne, setPlayerOne] = useState<Player>(defaultPlayer);
  const [playerTwo, setPlayerTwo] = useState<Player>(defaultPlayer);

  const [markers, setMarkers] = useState<MatchEventData[]>([]);
  const [videoSections, setVideoSections] = useState<InterfaceVideoSection[]>([]);



  const [mode, setMode] = useState<boolean>(false);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus | null>(null);

  // Auto-update match status every 5 minutes (same behavior)
  useMatchStatusUpdater({
    matchId: videoId,
    enabled: videoId !== 0,
    onStatusUpdate: (updatedStatus) => setAnalysisStatus(updatedStatus),
  });

  const matchId = Number(params.id);

  // 1) Load video metadata + sections + download URL
  const loadMatch = useCallback(async () => {
    const meta = await fetchMatchMeta(matchId);
    if (!meta) return;

    const sections = await fetchMatchSections(matchId);
    setVideoSections(sections);

    setPlayerOne(meta.playerOne);
    setPlayerTwo(meta.playerTwo);

    setVideoId(meta.id);
    setVideoStart(meta.date);
    setAnalysisStatus(meta.analysisStatus);

    const url = await getFirebaseDownloadUrl(meta.videoUrlPath);
    setVideoUrl(url);

    setLoading(false);
  }, [matchId]);

  // 2) Load tags once we have videoId (same behavior)
  const loadMatchTags = useCallback(async () => {
    const tags = await fetchTags(videoId);
    if (tags.length !== 0) {
      setMarkers(tags);
    } else {
      setMarkers([]);
    }
  }, [videoId]);

  const handleTimeUpdate = useCallback((t: number) => setCurrentVideoTime(t), []);

  const handleAddTag = useCallback((newTag: MatchEventData) => {
    setMarkers((prev) => appendTag(prev, newTag));
  }, []);

  const handleDeleteTag = useCallback(async (id: number) => {
    try {
      const res = await deleteTagApi(id);
      if (!res.ok) {
        toast.error("Something went wrong while deleting the tag", { position: "bottom-right" });
      }
      setMarkers((prev) => removeTagById(prev, id));
    } catch (err) {
      toast.error(Msg, {
        data: {
          title: "Error deleting tag",
          message: "There was a problem with our servers while deleting the tag. Please try again later.",
        },
        position: "bottom-right",
      });
      Sentry.captureException(err);
    }
  }, []);

  // On mount, load match
  useEffect(() => {
    loadMatch().catch((err) => Sentry.captureException(err));
  }, [loadMatch]);

  // Once videoId is known, fetch tags
  useEffect(() => {
    if (videoId !== 0) {
      loadMatchTags().catch((err) => Sentry.captureException(err));
    }
  }, [videoId, loadMatchTags]);

  if (loading) return <Loading />;

  return (
    <div className="bg-white h-screen overflow-x-hidden pt-5 max-md:pt-10">
      <div className="px-10 2xl:px-30 2xl:px-50 space-y-4 bg-white">
        <BackButton onClick={() => router.back()} />

        <div className="absolute top-4 right-4 z-10">
          <StatusTag analysisStatus={analysisStatus} />
        </div>

        {/* video + performance top */}
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

        {/* lower panel */}
        <div className="w-full flex flex-row gap-4 max-md:flex-col relative">
          <ModeToggleButton mode={mode} onToggle={() => setMode((prev) => !prev)} />

          {mode ? (
            <>
              <MainTagManager videoId={videoId} timeStamp={currentVideoTime} onAddTag={handleAddTag} />
              <AnalyticsCard />
            </>
          ) : (
            <GameTimelineEditor
              playerOne={playerOne}
              playerTwo={playerTwo}
              videoSections={toTimelineVideoSections(videoSections, matchId)}
              onSeekVideo={(timeSeconds) => setCurrentVideoTime(timeSeconds)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

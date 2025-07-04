// SidePanelDashboard.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { SidePanelDashboardProps, WinOutcome } from "@/util/interfaces";
import { useAuth } from "@/app/context/AuthContext";
import RadarChartWithExplanation from "./UI/HexaGraph";
import ProfileInfo from "../UI/ProfileInfo";
import OutcomeCircles from "./UI/OutcomeCircles";
import * as Sentry from "@sentry/nextjs";

export default function SidePanelDashboard({ activePlayer }: SidePanelDashboardProps) {
  const [winOutcome, setWinOutcome] = useState<Array<WinOutcome> | null>([]);
  const { profile } = useAuth();

  const getMatchOutcome = useCallback(async (): Promise<void> => {
    try {
      const email = activePlayer?.email;
      if (!email) {
        return;
      }
      const response = await fetch(`/api/getMatchOutcome?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
      });

      const result = await response.json();
      if (!result.success) {
        Sentry.captureException(result);
      }
      setWinOutcome(result.data);
    } catch (error) {
      Sentry.captureException(error);
    }
  }, [activePlayer?.email]);

  useEffect(() => {
    if (activePlayer) {
      getMatchOutcome();
    }
  }, [activePlayer, getMatchOutcome]);

  return (
    <div className="lg:col-span-3 flex justify-center max-sm:px-2 px-2">
      <div className="bg-[#FEFEFE] rounded-2xl z-1 flex flex-row space-x-4 mt-2 w-full lg:space-y-2 lg:flex-col lg:space-x-4 max-sm:flex-col max-sm:space-y-4">
        
        {/* Profile + status icons */}
        {profile?.type === "player" ? (
          <div className="bg-gray-100 w-full rounded-2xl p-1">
            <div className="flex flex-col w-full gap-4 bg-[#FFFFFF] p-4 rounded-2xl">
              <span className="flex flex-row items-center gap-4">
                <ProfileInfo avatarSrc={profile.avatar} firstName={activePlayer?.firstName} lastName={activePlayer?.lastName} />
              </span>
              <div className="flex items-center gap-2 justify-between pt-8 text-xl">
                <OutcomeCircles winOutcome={winOutcome} />
              </div>
            </div>
            <span className="flex text-sm text-white items-center justify-between px-2">
              <button className="text-black px-4 py-2 text-xl">Advanced</button>
              <button className="text-gray-600 px-4 py-2 text-xl">Tier</button>
            </span>
          </div>
        ) : (
          <div className="bg-gray-100 w-full rounded-2xl p-1">
            <div className="flex flex-col w-full gap-4 bg-[#FFFFFF] p-4 rounded-2xl">
              <span className="flex flex-row items-center gap-4">
                <ProfileInfo avatarSrc={activePlayer?.avatar} firstName={activePlayer?.firstName} lastName={activePlayer?.lastName} />
              </span>
              <div className="flex items-center gap-2 justify-between pt-8 text-xl">
                <OutcomeCircles winOutcome={winOutcome} />
              </div>
            </div>
            <span className="flex text-sm text-white items-center justify-between px-2">
              <button className="text-black px-4 py-2 text-xl">Advanced</button>
              <button className="text-gray-600 px-4 py-2 text-xl">Tier</button>
            </span>
          </div>
        )}

        {/* Radar chart placeholder */}
        <RadarChartWithExplanation activePlayer={activePlayer} />
      </div>
    </div>
  );
}

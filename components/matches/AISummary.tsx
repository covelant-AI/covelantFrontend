import React, { useMemo } from "react";
import {MetricPoint, AISummaryProps} from "@/util/interfaces"
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import Image from 'next/image';

export default function AISummary({
  ballSpeeds,
  playerSpeeds,
  rallyCounts,
  strikesEff,
  eventTime,
}: AISummaryProps) {
  const pickLatest = (arr: MetricPoint[]) => {
    const past = arr.filter((p) => p.eventTimeSeconds <= eventTime);
    return past.length ? past[past.length - 1].value : 0;
  };

  const rawBallSpeed = useMemo(() => pickLatest(ballSpeeds), [ballSpeeds, eventTime]);
  const rawPlayerSpeed = useMemo(() => pickLatest(playerSpeeds), [playerSpeeds, eventTime]);
  const rawLongestRally = useMemo(() => pickLatest(rallyCounts), [rallyCounts, eventTime]);
  const rawStrikesEff = useMemo(() => pickLatest(strikesEff), [strikesEff, eventTime]);

  const currentBallSpeed = useAnimatedNumber(rawBallSpeed);
  const currentPlayerSpeed = useAnimatedNumber(rawPlayerSpeed);
  const currentLongestRally = useAnimatedNumber(rawLongestRally);
  const currentStrikesEff = useAnimatedNumber(rawStrikesEff);


return (
  <div className="h-full flex flex-col rounded-b-2xl bg-white overflow-hidden">
    {/* Ball Speed */}
    <div
      className="flex-1 flex flex-col justify-between px-4 py-3"
      style={{
        background:
          "radial-gradient(80% 80% at 100% 100%, rgba(66,182,177,0.18) 0%, rgba(66,182,177,0.10) 34%, rgba(66,182,177,0) 60%), #FFFFFF",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="bg-white w-8 h-8 rounded-full shadow-md flex items-center justify-center ring-1 ring-gray-200">
          <Image src="/images/lables/lable-ball.png" alt="ball" width={24} height={24} className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-gray-700">Ball Speed</p>
      </div>
      <div className="text-right text-3xl md:text-4xl font-bold text-gray-900">
        {currentBallSpeed.toFixed(1)}
        <span className="ml-1 text-base md:text-lg font-normal text-gray-500">km/h</span>
      </div>
    </div>
    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

    {/* Player Speed */}
    <div
      className="flex-1 flex flex-col justify-between px-4 py-3"
      style={{
        background:
          "radial-gradient(80% 80% at 100% 100%, rgba(66,182,177,0.18) 0%, rgba(66,182,177,0.10) 34%, rgba(66,182,177,0) 60%), #FFFFFF",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="bg-white w-8 h-8 rounded-full shadow-md flex items-center justify-center ring-1 ring-gray-200">
          <Image src="/images/lables/lable-person.png" alt="person" width={24} height={24} className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-gray-700">Player Speed</p>
      </div>
      <div className="text-right text-3xl md:text-4xl font-bold text-gray-900">
        {currentPlayerSpeed.toFixed(1)}
        <span className="ml-1 text-base md:text-lg font-normal text-gray-500">km/h</span>
      </div>
    </div>
    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

    {/* Longest Rally */}
    <div
      className="flex-1 flex flex-col justify-between px-4 py-3"
      style={{
        background:
          "radial-gradient(80% 80% at 100% 100%, rgba(66,182,177,0.18) 0%, rgba(66,182,177,0.10) 34%, rgba(66,182,177,0) 60%), #f1f1f1ff",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="bg-white w-8 h-8 rounded-full shadow-md flex items-center justify-center ring-1 ring-gray-200">
          <Image src="/images/lables/lable-check.png" alt="person" width={24} height={24} className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-gray-700">Rally Count</p>
      </div>
      <div className="text-right text-3xl md:text-4xl font-extrabold text-gray-900">
        {/* {currentLongestRally} */}
        <span className="ml-1 text-base md:text-lg font-normal text-gray-500">Coming Soon</span>
      </div>
    </div>
    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

    {/* Win Eff. */}
    <div
      className="flex-1 flex flex-col justify-between px-4 py-3"
      style={{
        background:
          "radial-gradient(80% 80% at 100% 100%, rgba(66,182,177,0.18) 0%, rgba(66,182,177,0.10) 34%, rgba(66,182,177,0) 60%), #f1f1f1ff",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="bg-white w-8 h-8 rounded-full shadow-md flex items-center justify-center ring-1 ring-gray-200">
          <Image src="/images/lables/lable-target.png" alt="target" width={20} height={20} className="w-5 h-5" />
        </div>
        <p className="text-sm font-medium text-gray-700">Win Eff.</p>
      </div>
      <div className="text-right text-3xl md:text-4xl font-extrabold text-gray-900">
        {/* {currentStrikesEff.toFixed(1)} */}
        <span className="ml-1 text-base md:text-lg font-normal text-gray-500">Coming Soon</span>
      </div>
    </div>
  </div>
);
}

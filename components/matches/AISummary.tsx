import React, { useMemo } from "react";
import {MetricPoint, AISummaryProps} from "@/util/interfaces"
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import Image from 'next/image';

export default function AISummary({
  ballSpeeds,
  playerSpeeds,
  longestRallies,
  strikesEff,
  eventTime,
}: AISummaryProps) {
  // helper to pick the latest value ≤ eventTime
  const pickLatest = (arr: MetricPoint[]) => {
    const past = arr.filter((p) => p.eventTimeSeconds <= eventTime);
    return past.length ? past[past.length - 1].value : 0;
  };

  const rawBallSpeed = useMemo(() => pickLatest(ballSpeeds), [ballSpeeds, eventTime]);
  const rawPlayerSpeed = useMemo(() => pickLatest(playerSpeeds), [playerSpeeds, eventTime]);
  const rawLongestRally = useMemo(() => pickLatest(longestRallies), [longestRallies, eventTime]);
  const rawStrikesEff = useMemo(() => pickLatest(strikesEff), [strikesEff, eventTime]);

  const currentBallSpeed = useAnimatedNumber(rawBallSpeed);
  const currentPlayerSpeed = useAnimatedNumber(rawPlayerSpeed);
  const currentLongestRally = useAnimatedNumber(rawLongestRally);
  const currentStrikesEff = useAnimatedNumber(rawStrikesEff);


  return (
    <div className="grid grid-cols-2 gap-3 pt-6 px-4">
      {/* Ball Speed */}
      <div className="flex flex-col items-start p-3 rounded-2xl shadow bg-gray-100">
        <span className="flex flex-row justify-center items-center pb-6">
          <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
            <Image
              src="/images/lables/lable-ball.png"
              alt="ball"
              width={24} 
              height={24} 
              className="w-6 h-6"
            />
          </div>
          <p className="text-sm text-black font-bold pl-4">Ball Speed</p>
        </span>
        <div className="mt-1 text-4xl font-semibold text-black">
          {currentBallSpeed.toFixed(1)}
          <span className="text-lg font-light">km/h</span>
        </div>
      </div>

      {/* Player Speed */}
      <div className="flex flex-col items-start p-3 rounded-2xl shadow bg-gray-100">
        <span className="flex flex-row justify-center items-center pb-6">
          <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
            <Image
              src="/images/lables/lable-person.png"
              alt="person"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </div>
          <p className="text-sm text-black font-bold pl-4">Player Speed</p>
        </span>
        <div className="mt-1 text-4xl font-semibold text-black">
          {currentPlayerSpeed.toFixed(1)}
          <span className="text-lg font-light">km/h</span>
        </div>
      </div>

      {/* Longest Rally */}
      <div className="flex flex-col items-start p-3 rounded-2xl shadow bg-gray-100">
        <span className="flex flex-row justify-center items-center pb-6">
          <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
            <Image
              src="/images/lables/lable-time.png"
              alt="time"
              width={16} 
              height={16}
              className="w-4 h-4"
            />
          </div>
          <p className="text-sm text-black font-bold pl-4">Longest Rally</p>
        </span>
        <div className="mt-1 text-4xl font-semibold text-black">
          {Math.round(currentLongestRally)}
          <span className="text-lg font-light">hit</span>
        </div>
      </div>

      {/* Strikes Eff. */}
      <div className="flex flex-col items-start p-3 rounded-2xl shadow bg-gray-100">
        <span className="flex flex-row justify-center items-center pb-6">
          <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
            <Image
              src="/images/lables/lable-target.png"
              alt="target"
              width={20}
              height={20} 
              className="w-5 h-5"
            />
          </div>
          <p className="text-sm text-black font-bold pl-4">Win eff.</p>
        </span>
        <div className="mt-1 text-4xl font-semibold text-black">
          {currentStrikesEff.toFixed(1)}
          <span className="text-lg font-light">%</span>
        </div>
      </div>
    </div>
  );
}

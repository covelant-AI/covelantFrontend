import React, { useMemo } from "react";

interface MetricPoint {
  eventTimeSeconds: number;
  value: number;
}

interface AISummaryProps {
  /** arrays of metric snapshots */
  ballSpeeds: MetricPoint[];
  playerSpeeds: MetricPoint[];
  longestRallies: MetricPoint[];
  strikesEff: MetricPoint[];
  /** current playback time in seconds */
  eventTime: number;
}

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

  const currentBallSpeed = useMemo(
    () => pickLatest(ballSpeeds),
    [ballSpeeds, eventTime]
  );
  const currentPlayerSpeed = useMemo(
    () => pickLatest(playerSpeeds),
    [playerSpeeds, eventTime]
  );
  const currentLongestRally = useMemo(
    () => pickLatest(longestRallies),
    [longestRallies, eventTime]
  );
  const currentStrikesEff = useMemo(
    () => pickLatest(strikesEff),
    [strikesEff, eventTime]
  );

  return (
    <div className="grid grid-cols-2 gap-3 pt-6 px-4">
      {/* Ball Speed */}
      <div className="flex flex-col items-start p-3 rounded-2xl shadow bg-gray-100">
        <span className="flex flex-row justify-center items-center pb-6">
          <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
            <img
              src="/images/lables/lable-ball.png"
              alt="ball"
              className="w-6 h-6"
            />
          </div>
          <p className="text-sm text-black font-bold pl-4">Ball Speed</p>
        </span>
        <div className="mt-1 text-4xl font-semibold text-black">
          {currentBallSpeed}
          <span className="text-lg font-light">km/h</span>
        </div>
      </div>

      {/* Player Speed */}
      <div className="flex flex-col items-start p-3 rounded-2xl shadow bg-gray-100">
        <span className="flex flex-row justify-center items-center pb-6">
          <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
            <img
              src="/images/lables/lable-person.png"
              alt="person"
              className="w-6 h-6"
            />
          </div>
          <p className="text-sm text-black font-bold pl-4">Player Speed</p>
        </span>
        <div className="mt-1 text-4xl font-semibold text-black">
          {currentPlayerSpeed}
          <span className="text-lg font-light">km/h</span>
        </div>
      </div>

      {/* Longest Rally */}
      <div className="flex flex-col items-start p-3 rounded-2xl shadow bg-gray-100">
        <span className="flex flex-row justify-center items-center pb-6">
          <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
            <img
              src="/images/lables/lable-time.png"
              alt="time"
              className="w-4 h-4"
            />
          </div>
          <p className="text-sm text-black font-bold pl-4">Longest Rally</p>
        </span>
        <div className="mt-1 text-4xl font-semibold text-black">
          {currentLongestRally}
          <span className="text-lg font-light">sec</span>
        </div>
      </div>

      {/* Strikes Eff. */}
      <div className="flex flex-col items-start p-3 rounded-2xl shadow bg-gray-100">
        <span className="flex flex-row justify-center items-center pb-6">
          <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
            <img
              src="/images/lables/lable-target.png"
              alt="target"
              className="w-5 h-5"
            />
          </div>
          <p className="text-sm text-black font-bold pl-4">Strikes eff.</p>
        </span>
        <div className="mt-1 text-4xl font-semibold text-black">
          {currentStrikesEff}
          <span className="text-lg font-light">hits/rlly</span>
        </div>
      </div>
    </div>
  );
}

// RadarChartWithExplanation.tsx
import { useState } from "react";
import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import RadarGraph from "./RadarGraph";

interface HexaGraphProps {
  activePlayer: any;
}

const HexaGraph = ({ activePlayer }: HexaGraphProps) => {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="w-full rounded-lg bg-[#FFFFFF] relative">
      {/* Show Explanation Button */}
      <button
        onClick={() => setShowExplanation((v) => !v)}
        className="absolute top-3 right-3 p-1 hover:bg-gray-200 rounded-full z-10"
        aria-label="Show explanation"
      >
        <QuestionMarkCircleIcon className="h-6 w-6 text-gray-500" />
      </button>

      {/* Radar Graph */}
      <div className="w-full h-60 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 p-4">
        <RadarGraph activePlayer={activePlayer} />
      </div>

      {/* Explanation Section */}
      {showExplanation && (
        <div className="absolute bottom-1 right-70 z-10 w-72 bg-white rounded-2xl shadow-lg p-4">
          {/* Close Explanation Button */}
          <button
            onClick={() => setShowExplanation(false)}
            className="absolute top-3 right-3 p-1 hover:bg-gray-200 rounded-full"
            aria-label="Close explanation"
          >
            <XMarkIcon className="h-5 w-5 text-gray-700" />
          </button>

          {/* Explanation Header */}
          <div className="flex items-center gap-2 mb-3">
            <QuestionMarkCircleIcon className="h-6 w-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-600">Explanation</h3>
          </div>

          {/* Explanation List */}
          <ul className="space-y-4 text-sm text-gray-800">
            <li className="flex flex-row justify-center items-center p-2">
              <span className="font-bold text-lg mr-4">SRV:</span> Serve Quality, Measures effectiveness & variation
            </li>
            <li className="flex flex-row justify-center items-center p-2">
              <span className="font-bold text-lg mr-4">RSV:</span> Return Game, Ability to handle opponent&apos;s serves
            </li>
            <li className="flex flex-row justify-center items-center p-2">
              <span className="font-bold text-lg mr-4">FRH:</span> Forehand Attack, Aggressiveness & winners via forehand
            </li>
            <li className="flex flex-row justify-center items-center p-2">
              <span className="font-bold text-lg mr-4">BCH:</span> Backhand Attack, Aggressiveness & versatility via backhand
            </li>
            <li className="flex flex-row justify-center items-center p-2">
              <span className="font-bold text-lg mr-4">RLY:</span> Rally Endurance, Performance in longer rallies
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HexaGraph;

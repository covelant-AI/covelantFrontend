"use client";
import React, { useState } from "react";
import {CategoryKey} from '@/util/types'
import MatchForm from "./MatchForm"
import TacticForm from "./TacticForm"
import FoulsForm  from "./FoulsForm";
import PhysicalForm from "./PhysicalForm";
import NoteForm from "./NoteForm"
import {MainTagManagerProps} from "@/util/interfaces"

export default function MainTagManager({
  videoId,
  timeStamp,
  onAddTag,       
}: MainTagManagerProps){
  const [activeTab, setActiveTab] = useState<CategoryKey>("Match");

  return (
    <div className="bg-gray-100 rounded-xl shadow-lg max-w-2xl w-full p-6 z-10 ">
      <div className="flex space-x-4 border-b border-gray-200 pb-2  items-center justify-between">
        {(["Match", "Tactic", "Fouls", "Physical", "Note"] as CategoryKey[]).map(
          (tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center text-md font-bold px-4 py-2 border rounded-lg shadow-sm ${
                activeTab === tab
                  ? "bg-white border-teal-500 text-gray-600"   
                  : "bg-white border-gray-100 text-gray-600 hover:scale-[1.05]"
              }`}
            >
              <img
                src={`/images/lables/tag${idx + 1}.png`}
                alt={`${tab} icon`}
                className="w-5 h-5 mr-2"
              />
              {tab}
            </button>
          )
        )}
      </div>
        <div className="flex flex-row">
          {activeTab === "Match" && <MatchForm videoId={videoId} timeStamp={timeStamp} onAddTag={onAddTag}/>}
          {activeTab === "Tactic" && <TacticForm videoId={videoId} timeStamp={timeStamp} onAddTag={onAddTag}/>}
          {activeTab === "Fouls" && <FoulsForm videoId={videoId} timeStamp={timeStamp} onAddTag={onAddTag}/>}
          {activeTab === "Physical" && <PhysicalForm videoId={videoId} timeStamp={timeStamp} onAddTag={onAddTag}/>}
          {activeTab === "Note" && <NoteForm videoId={videoId} timeStamp={timeStamp} onAddTag={onAddTag}/>}
        </div>
    </div>
  );
}
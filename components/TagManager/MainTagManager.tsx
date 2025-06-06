"use client";
import React, { useState } from "react";
import {CategoryKey} from '@/util/types'
import MatchForm from "./MatchForm"
import TacticForm from "./TacticForm"
import FoulsForm  from "./FoulsForm";
import PhysicalForm from "./PhysicalForm";
import NoteForm from "./NoteForm"

export default function MainTagManager() {
  const [activeTab, setActiveTab] = useState<CategoryKey>("Match");

  return (
    <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full p-6 z-10">
      <div className="flex space-x-4 border-b border-gray-200 pb-2 mb-6">
        {(["Match", "Tactic", "Fouls", "Physical", "Note"] as CategoryKey[]).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium px-4 py-2 rounded-md ${
                activeTab === tab
                  ? "bg-transparent border border-teal-500 text-teal-600"
                  : "border border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      <main>
        {activeTab === "Match" && <MatchForm />}
        {activeTab === "Tactic" && <TacticForm />}
        {activeTab === "Fouls" && <FoulsForm />}
        {activeTab === "Physical" && <PhysicalForm />}
        {activeTab === "Note" && <NoteForm />}
      </main>
    </div>
  );
}
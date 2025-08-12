'use client';
import React, { useState, useRef, useEffect } from "react";
import { MainTagManagerProps } from "@/util/interfaces";
import { CategoryKey } from '@/util/types';
import {tabs} from '@/util/default'
import MatchForm from "./MatchForm";
import TacticForm from "./TacticForm";
import FoulsForm  from "./FoulsForm";
import PhysicalForm from "./PhysicalForm";
import NoteForm from "./NoteForm";
import { Menu, X } from "lucide-react";
import Image from "next/image"

export default function MainTagManager({
  videoId,
  timeStamp,
  onAddTag,
}: MainTagManagerProps) {
  const [activeTab, setActiveTab] = useState<CategoryKey>("Match");
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // close menu if clicked outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
      <div className="w-full shadow-lg bg-gray-100 rounded-2xl border border-gray-300 mx-auto flex flex-col space-y-4 pt-4">
      {/* header: inline tabs on md+, hamburger on sm */}
      <div className="flex items-center justify-center border-b border-gray-200 pb-2">
        {/* md+ inline */}
        <div className="hidden md:flex flex-wrap gap-3 justify-center w-full">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setMenuOpen(false);
              }}
              className={`flex items-center text-lg font-bold px-4 py-2 border rounded-lg shadow-sm transition ${
                activeTab === tab
                  ? "bg-white border-teal-500 text-gray-600"
                  : "bg-white border-gray-100 text-gray-600 hover:scale-105"
              }`}
            >
              <Image
                src={`/images/lables/tag${idx + 1}.png`}
                alt={`${tab} icon`}
                width={20} 
                height={20} 
                className="mr-2"
              />
              {tab}
            </button>
          ))}
        </div>

        {/* hamburger on small */}
        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="md:hidden p-2 rounded bg-white shadow text-black"
          aria-label="Toggle tabs"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* dropdown for small screens */}
      {menuOpen && (
        <div
          ref={dropdownRef}
          className="md:hidden left-0 right-0 bg-white rounded-b-xl shadow-lg flex flex-col gap-2 p-4 mx-5"
        >
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setMenuOpen(false);
              }}
              className={`flex items-center text-lg font-bold px-4 py-2 border rounded-lg transition ${
                activeTab === tab
                  ? "bg-white border-teal-500 text-gray-600"
                  : "bg-white border-gray-100 text-gray-600 hover:scale-105"
              }`}
            >
              <Image
                src={`/images/lables/tag${idx + 1}.png`}
                alt={`${tab} icon`}
                width={20}
                height={20} 
                className="mr-2"
              />
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* form area */}
      <div className="mt-2">
        {activeTab === "Match" && (
          <MatchForm
            videoId={videoId}
            timeStamp={timeStamp}
            onAddTag={onAddTag}
          />
        )}
        {activeTab === "Tactic" && (
          <TacticForm
            videoId={videoId}
            timeStamp={timeStamp}
            onAddTag={onAddTag}
          />
        )}
        {activeTab === "Fouls" && (
          <FoulsForm
            videoId={videoId}
            timeStamp={timeStamp}
            onAddTag={onAddTag}
          />
        )}
        {activeTab === "Physical" && (
          <PhysicalForm
            videoId={videoId}
            timeStamp={timeStamp}
            onAddTag={onAddTag}
          />
        )}
        {activeTab === "Note" && (
          <NoteForm
            videoId={videoId}
            timeStamp={timeStamp}
            onAddTag={onAddTag}
          />
        )}
      </div>
    </div>
  );
}

// src/components/HomeDashboard.tsx
import React from 'react'
import RadarGraph from './UI/RadarGraph'

type Match = {
  id: number
  title: string
  imageUrl: string
}

const matches: Match[] = [
  { id: 1, title: 'Alexis Lebrun vs Hugo Calderano', imageUrl: '/testImages/match.png' },
  { id: 2, title: 'Alexis Lebrun vs LIANG Jinkun',   imageUrl: '/testImages/match.png' },
  { id: 3, title: 'Alexis Lebrun vs Fan Zhendong',  imageUrl: '/testImages/match.png' },
  { id: 4, title: 'Alexis Lebrun vs Liam Pitchford',imageUrl: '/testImages/match.png' },
  { id: 5, title: 'Alexis Lebrun vs Xiang Peng',    imageUrl: '/testImages/match.png' },
]

export default function HomeDashboard() {
  return (
    <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-0.5 bg-[#FFFFFF]  
                px-[5vh] max-sm:px-[1vh] lg:px-[6vh] xl:px-[10vh] 2xl:px-[25vh]">
      {/* ── MAIN PANEL (matches + filters) ───────────────────────────────────────── */}
      <div className="col-span-1 lg:col-span-9 rounded-2xl shadow p-1 flex flex-col gap-6 bg-[#F8F8F8] my-5 justify-center">

        {/* Matches grid */}
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-2 bg-[#FFFFFF]  rounded-2xl">
          {matches.map(m => (
            <div key={m.id} className="relative rounded-lg overflow-hidden h-50 bg-[#F8F8F8] border-2 border-[#F8F8F8] 
                hover:scale-[1.05] transition duration-300">
              <img
                src={m.imageUrl}
                alt={m.title}
                className="w-full h-full object-cover"
              />

              {/* Black gradient fade at bottom */}
              <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />

              <div className="absolute bottom-2 left-2 text-gray-300 text-xs font-semibold px-2 py-1 rounded">
                {m.title}
              </div>
            </div>
          ))}
        </div>

        {/* Filters / controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-4">
          {/* Player selector */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-lg">
            <img
              src="/testImages/test.jpg"
              alt="Alexis"
              className="w-6 h-6 rounded-full"
            />
            <span className="text-gray-700">Alexis Lebrun</span>
            <span className="text-gray-500">▼</span>
          </button>

          <div className='flex items-center gap-6'>
          {/* Win rate */}
          <div className="flex items-baseline gap-2 bg-white border border-gray-300 rounded-full px-4 py-1">
            <span className="text-lg text-gray-600">Win Rate</span>
            <span className="text-lg font-bold text-green-600">71%</span>
          </div>

          {/* Sort */}
          <button className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-full text-lg text-gray-700">
            Sort  ↕
          </button>

          {/* Time filter */}
          <button className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-full text-lg text-gray-700">
            <span>Last month</span>
            <span className="text-gray-500">▼</span>
          </button>
          </div>
        </div>
      </div>

      {/* ── SIDEBAR (profile + radar) ─────────────────────────────────────────────── */}
      <div className="col-span-3 flex justify-center">
        <div className="bg-white rounded-2xl py-6 px-2 flex flex-col items-center gap-4 w-[60%] lg:w-[120%] xl:w-[90%]">
   
        {/* Profile + status icons */}
        <div className='bg-gray-100 w-full rounded-2xl p-1'>
        <div className="flex flex-col w-full gap-4 bg-[#FFFFFF] p-4 rounded-2xl">
            <span className='flex flex-row items-center gap-2'>
                <img
                  src="/testImages/test.jpg"
                  alt="Alexis Lebrun"
                  className="w-22 h-22 rounded-full object-cover"
                />
                <h3 className="text-2xl font-semibold text-gray-800">Alexis <br/> <span className='font-bold'>Lebrun</span></h3>
            </span>
        <div className="flex items-center justify-between pt-8 text-xl">
          <span className="flex items-center justify-center text-white bg-[#42B6B1] w-10 h-10 rounded-full">✓</span>
          <span className="flex items-center justify-center text-white bg-[#42B6B1] w-10 h-10 rounded-full">✓</span>
          <span className="flex items-center justify-center text-white bg-[#42B6B1] w-10 h-10 rounded-full">✓</span>
          <span className="flex items-center justify-center text-white bg-[#FF4545] w-10 h-10 rounded-full">✕</span>
          <span className="flex items-center justify-center text-white bg-[#FF4545] w-10 h-10 rounded-full">✕</span>
        </div>

        </div>

        {/* Advanced - tier section */}
        <span className="flex text-sm text-white items-center justify-between px-2">
            <button className="text-black px-4 py-2 text-xl">Advanced</button>
            <button className="text-black px-4 py-2 text-xl">Tier</button>
        </span>
        </div>
        {/* Radar chart placeholder */}
        <div className="w-full rounded-lg bg-[#FFFFFF]">
          <div className="w-full h-60 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 p-4">
            <RadarGraph />
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}



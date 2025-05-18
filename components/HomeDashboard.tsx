// src/components/HomeDashboard.tsx
import React from 'react'
import RadarGraph from './UI/RadarGraph'

type Match = {
  id: number
  title: string
  imageUrl: string
}

const matches: Match[] = [
  { id: 1, title: 'Alexis Lebrun vs Hugo Calderano', imageUrl: '/matches/hugo.jpg' },
  { id: 2, title: 'Alexis Lebrun vs LIANG Jinkun',   imageUrl: '/matches/liang.jpg' },
  { id: 3, title: 'Alexis Lebrun vs Fan Zhendong',  imageUrl: '/matches/fan.jpg' },
  { id: 4, title: 'Alexis Lebrun vs Liam Pitchford',imageUrl: '/matches/liam.jpg' },
  { id: 5, title: 'Alexis Lebrun vs Xiang Peng',    imageUrl: '/matches/xiang.jpg' },
]

export default function HomeDashboard() {
  return (
    <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── MAIN PANEL (matches + filters) ───────────────────────────────────────── */}
      <div className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow p-6 flex flex-col gap-6">

        {/* Matches grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {matches.map(m => (
            <div key={m.id} className="relative rounded-lg overflow-hidden h-36 bg-gray-200">
              <img
                src={m.imageUrl}
                alt={m.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs font-semibold px-2 py-1 rounded">
                {m.title}
              </div>
            </div>
          ))}
          {/* empty placeholder */}
          <div className="rounded-lg border-2 border-dashed border-gray-300 h-36 flex items-center justify-center text-gray-400">
            {/* … */}
          </div>
        </div>

        {/* Filters / controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Player selector */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm">
            <img
              src="/testImages/test.jpg"
              alt="Alexis"
              className="w-6 h-6 rounded-full"
            />
            <span className="text-gray-700">Alexis Lebrun</span>
            <span className="text-gray-500">▼</span>
          </button>

          {/* Win rate */}
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-gray-600">Win Rate</span>
            <span className="text-lg font-bold text-green-600">71%</span>
          </div>

          {/* Sort */}
          <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-700">
            ↕ Sort
          </button>

          {/* Time filter */}
          <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-700">
            <span>Last month</span>
            <span className="text-gray-500">▼</span>
          </button>
        </div>
      </div>

      {/* ── SIDEBAR (profile + radar) ─────────────────────────────────────────────── */}
      <div className="col-span-1 bg-white rounded-xl shadow p-6 flex flex-col items-center gap-6">
        {/* Profile + status icons */}
        <div className='bg-gray-100 w-full rounded-2xl p-1'>
        <div className="flex flex-col w-full gap-4 bg-[#FFFFFF] p-4 rounded-2xl">
            <span className='flex flex-row items-center gap-2'>
                <img
                  src="/testImages/test.jpg"
                  alt="Alexis Lebrun"
                  className="w-22 h-22 rounded-full"
                />
                <h3 className="text-lg font-semibold text-gray-800">Alexis <br/> Lebrun</h3>
            </span>
        <div className="flex items-center justify-between pt-8 text-xl">
          <span className="flex items-center justify-center text-green-500 bg-black w-10 h-10 rounded-full">✓</span>
          <span className="flex items-center justify-center text-green-500 bg-black w-10 h-10 rounded-full">✓</span>
          <span className="flex items-center justify-center text-green-500 bg-black w-10 h-10 rounded-full">✓</span>
          <span className="flex items-center justify-center text-red-500 bg-black w-10 h-10 rounded-full">✕</span>
          <span className="flex items-center justify-center text-red-500 bg-black w-10 h-10 rounded-full">✕</span>
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
            {/* TODO: replace with real chart (e.g. react-chartjs-2) */}
            <RadarGraph />
          </div>

        </div>
      </div>
    </div>
  )
}



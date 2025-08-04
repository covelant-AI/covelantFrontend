import { useState, useEffect } from 'react'
import {MatchDataProps} from '@/util/interfaces'

export default function MatchData({ onDataChange,playerOne, playerTwo }: MatchDataProps) {
  const [matchType, setMatchType] = useState('')
  const [fieldType, setFieldType] = useState('')
  const [selectedWinner, setSelectedWinner] = useState<'playerOne' | 'playerTwo' | null>(null);
  const [date, setDate] = useState('')

  // Notify parent on any change
  useEffect(() => {
    onDataChange({ matchType, fieldType, date, winner: selectedWinner });
  }, [matchType, fieldType, date, selectedWinner, onDataChange]);



  return (
    <div className="bg-white p-4 w-full">
      <h2 className="text-xl font-bold mb-4 text-black">Match Data</h2>

      <hr className="my-4" />
      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <select
          className="border border-gray-200 shadow-md rounded-md p-2 text-sm text-gray-700 hover:border-cyan-400"
          value={matchType}
          onChange={(e) => setMatchType(e.target.value)}
        >
          <option value="">Select Match Type</option>
          <option value="tournament">Tournament</option>
          <option value="friendly">Friendly</option>
          <option value="training">Training</option>
          <option value="league">League</option>
        </select>
        <select
          className="border border-gray-200 shadow-md rounded-md p-2 text-sm text-gray-700 hover:border-cyan-400"
          value={fieldType}
          onChange={(e) => setFieldType(e.target.value)}
        >
          <option value="">Select Court</option>
          <option value="Hard Court">Hard Court</option>
          <option value="local">Clay Court</option>
          <option value="national">Grass Court</option>
          <option value="international">Carpet Court</option>
        </select>
      </div>

      {/* Date Picker */}
      <input
        type="date"
        className="w-full border border-gray-200 shadow-md rounded-md p-2 mb-6 text-sm text-gray-700 hover:border-cyan-400"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <hr className="my-4" />

      {/* Winner Selector */}
      <div className="mb-4">
        <label className="block text-md font-semibold mb-2 text-black">Select Winner</label>
        <div className="space-y-3">
          <label
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
              selectedWinner === 'playerOne' ? 'border-cyan-500 ring-1 ring-cyan-500' : 'border-gray-200'
            }`}
          >
            <input
              type="radio"
              name="winner"
              value="playerOne"
              checked={selectedWinner === 'playerOne'}
              onChange={() => setSelectedWinner('playerOne')}
              className="hidden"
            />
            <img
              src={playerOne.avatar ?? '/images/default-avatar.png'}
              alt={playerOne.firstName ?? 'Player One'}
              className="w-10 h-10 rounded-full mr-3"
            />
            <span className="font-semibold text-black">
              {playerOne.firstName} {playerOne.lastName}
            </span>
            <span className="ml-auto">
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-gray-400">
                {selectedWinner === 'playerOne' && <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full" />}
              </div>
            </span>
          </label>
          
          <label
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
              selectedWinner === 'playerTwo' ? 'border-cyan-500 ring-1 ring-cyan-500' : 'border-gray-200'
            }`}
          >
            <input
              type="radio"
              name="winner"
              value="playerTwo"
              checked={selectedWinner === 'playerTwo'}
              onChange={() => setSelectedWinner('playerTwo')}
              className="hidden"
            />
            <img
              src={playerTwo.avatar ?? '/images/default-avatar.png'}
              alt={playerTwo.firstName ?? 'Player Two'}
              className="w-10 h-10 rounded-full mr-3"
            />
            <span className="font-semibold text-black">
              {playerTwo.firstName} {playerTwo.lastName}
            </span>
            <span className="ml-auto">
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-gray-400">
                {selectedWinner === 'playerTwo' && <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full" />}
              </div>
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}

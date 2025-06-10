import { useState, useEffect } from 'react'
import PlayerSelector  from '@/components/InvitePage/PlayerSelector'
import StaticPlayerDisplay from "@/components/UI/StaticPlayerDisplay"
import OpponentSelector  from './OpponentSelector'
import {MatchDataProps} from '@/util/interfaces'
import { Player } from '@/util/interfaces'
import { useAuth } from '@/app/context/AuthContext';


export default function MatchData({ onDataChange }: MatchDataProps) {
  const [playerOne, setPlayerOne] = useState<Player | null>(null)
  const [playerTwo, setPlayerTwo] = useState<Player | null>(null)
  const [matchType, setMatchType] = useState('')
  const [fieldType, setFieldType] = useState('')
  const [date, setDate] = useState('')
  const {profile} = useAuth(); 

  // Notify parent on any change
  useEffect(() => {
    onDataChange({ playerOne, playerTwo, matchType, fieldType, date })
  }, [playerOne, playerTwo, matchType, fieldType, date, onDataChange])

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 w-full">
      <h2 className="text-xl font-bold mb-4 text-black">Match Data</h2>

      {/* Player Selection */}
      <div className="flex justify-between gap-4 mb-4 px-4">
        {profile?.type === "player" ? <StaticPlayerDisplay onSelect={setPlayerOne}/>: <PlayerSelector onSelect={setPlayerOne} />}
        <div className="flex items-center font-bold text-gray-400">VS</div>
        <OpponentSelector onSelect={setPlayerTwo} />
      </div>

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
    </div>
  )
}

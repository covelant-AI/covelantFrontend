import { useState, useEffect } from 'react'
import {MatchDataProps} from '@/util/interfaces'

export default function MatchData({ onDataChange }: MatchDataProps) {
  const [matchType, setMatchType] = useState('')
  const [fieldType, setFieldType] = useState('')
  const [date, setDate] = useState('')

  // Notify parent on any change
  useEffect(() => {
    onDataChange({ matchType, fieldType, date});
  }, [ matchType, fieldType, date, onDataChange])

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
    </div>
  )
}

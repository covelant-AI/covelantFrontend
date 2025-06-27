"use client";
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Player } from '@/util/interfaces'
import {GetOpponentSearch, OpponentSelectorProps} from "@/util/interfaces"
import * as Sentry from "@sentry/nextjs";


export default function OpponentSelector({
  onSelect,
}: OpponentSelectorProps){
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<Player[]>([])
  const [selected, setSelected] = useState<Player | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newFirstName, setNewFirstName] = useState('')
  const [newLastName, setNewLastName] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  // fetch suggestions whenever the term changes and create form is not open
  useEffect(() => {
    if (!searchTerm.trim() || showCreateForm) {
      setSuggestions([])
      return
    }
    const ctrl = new AbortController()
    fetch(`/api/getOpponent?name=${encodeURIComponent(searchTerm)}`, {
      signal: ctrl.signal,
    })
      .then((res) => res.json())
      .then((data: GetOpponentSearch) => {
        setSuggestions(data.data )
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err)
      })
    return () => {
      ctrl.abort()
    }
  }, [searchTerm, showCreateForm])

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false)
        setShowCreateForm(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (user: Player) => {
    setSelected(user)
    onSelect(user)
    setSearchOpen(false)
    setShowCreateForm(false)
  }

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelected(null)
    setSearchTerm('')
    setSuggestions([])
    setShowCreateForm(false)
    setNewFirstName('')
    setNewLastName('')
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFirstName.trim() || !newLastName.trim()) return

    try {
      const res = await fetch('/api/createOpponent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: newFirstName.trim(),
          lastName: newLastName.trim(),
        }),
      })
      if (!res.ok) throw new Error('Failed to create opponent')

      const data = await res.json()
      
      if (data?.opponent) {
        handleSelect(data.opponent)
      } else {
        setShowCreateForm(false)
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  }

return (
  <div
    ref={containerRef}
    className="flex-1 border border-gray-200 rounded-xl flex flex-col items-center justify-center h-45 shadow-md bg-gray-100 hover:border-cyan-400 cursor-pointer">
    <div className="flex flex-col items-center w-full">
      {selected ? (
        <div className="h-45 w-full flex items-center justify-center text-black font-bold">
          {(
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <Image
                src={selected.avatar || "/images/default-avatar.png"}
                alt="User"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
          <div className="absolute bottom-85  md:bottom-102 max-[360px]:bottom-30 flex items-center text-black bg-gray-400 bg-opacity-50 rounded px-2">
            <button
              onClick={clearSelection}
              className="text-red hover:text-gray-300 text-xl cursor-pointer pb-1 active:scale-[0.9]"
            >
              ×
            </button>
          </div>
        </div>
      ) : (
        <>
          {!showCreateForm ? (
            <div className="flex flex-col gap-4 w-full px-4 justify-center">
              <button
                className="flex items-center justify-center px-4 py-2 bg-white border border-[#E7E7E7] 
                text-black rounded-xl hover:bg-[#42B6B1] hover:text-black transition-colors duration-300 cursor-pointer active:scale-[0.9]"
                onClick={(e) => {
                  e.stopPropagation()
                  setSearchOpen(true)
                  setShowCreateForm(false)
                }}
              >
                Search Opponent
              </button>
              <button
                className="flex items-center justify-center px-4 py-2 bg-white border border-[#E7E7E7] text-black 
                rounded-xl hover:bg-[#42B6B1] hover:text-black transition-colors duration-300 cursor-pointer active:scale-[0.9]"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowCreateForm(true)
                  setSearchOpen(false)
                  setSearchTerm('')
                  setSuggestions([])
                }}
              >
                Add Opponent
              </button>
            </div>
          ) : (
            <form
              className="flex flex-col gap-2 p-2 bg-white text-black rounded-md shadow-md w-full"
              onSubmit={handleCreateSubmit}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                placeholder="First Name"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                className="p-2 tex-black border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                className="p-2 tex-black border border-gray-300 rounded"
                required
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-[#4DBAB5] text-white px-2 py-1 scale-[0.8] rounded text-sm hover:bg-teal-600 cursor-pointer active:scale-[0.75]"
                >
                  Add Opponent
                </button>
                <button
                  type="button"
                  className="text-gray-600 px-4 py-2 rounded scale-[0.8] hover:bg-gray-200 cursor-pointer active:scale-[0.75]"
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewFirstName('')
                    setNewLastName('')
                    setSearchOpen(true)
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>

    {searchOpen && !selected && !showCreateForm && (
      <div className="bg-gray-100 rounded-xl mt-1 z-10 pb-20 mt-10 md:top-76 lg:top-75 2xl:top-85 max-[360]:max-w-40 max-[360]:top-160 absolute w-full max-w-[150] min-h-[150] shadow-lg">
        {/* search input with magnifier icon */}
        <div className="flex items-center px-2 py-2 bg-white border-b border-gray-200 rounded-lg">
          <Image src="/icons/search.svg" alt="Search" width={20} height={20} />
          <input
            type="text"
            className="flex-1 ml-2 w-full text-black bg-white focus:outline-none"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
        <div className="max-h-120 overflow-auto bg-white rounded-xl">
          {suggestions.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(u)}
            >
              {u.avatar && (
              <Image
                src={u.avatar}
                alt="Unavailable"
                width={24}
                height={24}
                className="rounded-full"
              />
              )}
              <span className="text-black">{u.firstName}</span>
            </div>
          ))}
          {suggestions.length === 0 && searchTerm.trim() !== '' && (
            <div className="px-3 py-2 text-gray-500 rounded-xl">No results</div>
          )}
        </div>
      </div>
    )}
  </div>
)
}
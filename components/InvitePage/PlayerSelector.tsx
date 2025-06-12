"use client";
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { User, GetUsersSearch, PlayerSelectorProps, Player } from '@/util/interfaces'
import * as Sentry from "@sentry/nextjs";

export default function PlayerSelector({onSelect}: PlayerSelectorProps){
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [selected, setSelected] = useState<User | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // fetch suggestions whenever the term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([])
      return
    }
    const ctrl = new AbortController()
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`/api/getUser?name=${encodeURIComponent(searchTerm)}`, {
          signal: ctrl.signal,
        })
        const data: GetUsersSearch = await res.json()
        setSuggestions(data.data)
      } catch (err) {
        Sentry.captureException(err);
      }
    }
    fetchSuggestions()
    return () => {
      ctrl.abort()
    }
  }, [searchTerm])

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (user: User) => {
    setSelected(user)

    if (user) {
      onSelect(user as Player)
    }
    setSearchOpen(false)
  }

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelected(null)
    setSearchTerm('')
    setSuggestions([])
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 border border-gray-200 rounded-xl flex flex-col items-center justify-center h-45 shadow-md bg-gray-100 hover:border-cyan-400 cursor-pointer relative"
      onClick={() => setSearchOpen(true)}
    >
      <div className="flex flex-col items-center gap-2 w-full">
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
          <div className="absolute bottom-2 flex items-center text-black bg-gray-400 bg-opacity-50 rounded px-2">
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
            <button className="flex items-center justify-center w-12 h-12 bg-white border border-[#E7E7E7] 
            text-black rounded-xl hover:bg-[#42B6B1] hover:text-black transition-colors duration-300 cursor-pointer active:scale-[0.9]">
              <svg
                className="w-5 h-5 stroke-current "
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            <span className="text-sm text-black">Search User</span>
          </>
        )}
      </div>

      {searchOpen && !selected && (
      <div className="absolute -top-10 left-0 right-0 bg-gray-100 h-full rounded-xl mt-1 z-10 pb-20 mt-11 mx-1">
              <div className="flex items-center px-2 py-2 bg-white border-b border-gray-200 rounded-lg">
              <Image
                src="/icons/search.svg"
                alt="Search"
                width={20}
                height={20}
                />
              <input
                type="text"
                className="flex-1 ml-2 text-black bg-white w-full focus:outline-none"
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
                    alt="some Image"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span className='text-black'>{u.firstName}</span>
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
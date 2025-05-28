import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { User } from '@/util/interfaces'


export const PlayerSelector: React.FC<{
  label: string
  onSelect: (user: User) => void
}> = ({ label, onSelect }) => {
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
    fetch(`/api/getUser?name=${encodeURIComponent(searchTerm)}`, {
      signal: ctrl.signal,
    })
      .then((res) => res.json())
      .then((data: User[]) => {
        setSuggestions(() => data.data || [])
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err)
      })
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
    onSelect(user)
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
            <img
              src={selected.avatar ? selected.avatar : './images/default-avatar.png'}
              alt={selected.firstName}
              className="w-full h-full object-cover rounded-xl"
            />
          )}
          <div className="absolute bottom-2 flex items-center text-black bg-gray-400 bg-opacity-50 rounded px-2">
            <button
              onClick={clearSelection}
              className="text-red hover:text-gray-300 text-xl cursor-pointer pb-1"
            >
              ×
            </button>
          </div>
        </div>
        ) : (
          <>
            <button className="flex items-center justify-center w-12 h-12 bg-white border border-[#E7E7E7] 
            text-black rounded-xl hover:bg-[#42B6B1] hover:text-black transition-colors duration-300 cursor-pointer">
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
            <span className="text-sm text-black">{label}</span>
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
                  <img
                    src={u.avatar}
                    alt={u.firstName}
                    className="w-6 h-6 rounded-full"
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
"use client";
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Msg } from '@/components/UI/ToastTypes';
import { User, GetUsersSearch, PlayerSelectorProps, Player } from '@/util/interfaces'
import { toast } from 'react-toastify';

export default function SearchUser({onSelect}: PlayerSelectorProps){
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [ lastToastTime, setlastToastTime ] = useState<number>(0)

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    const ctrl = new AbortController();
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`/api/getUser?name=${encodeURIComponent(searchTerm)}`, {
          signal: ctrl.signal,
        });
        const data: GetUsersSearch = await res.json();
        const currentTime = Date.now();
        if(data.data.length === 0 && currentTime - lastToastTime > 5000)
        {
          toast.warning(Msg, {
            data: {
              title: 'Player does not exist',
              message: 'Suggestion: Copy the invite link and send it to them so they can sign up first, then you can invite them',
            },
            position: 'bottom-right',
          });
          setlastToastTime(currentTime) 
        }
        else{ setSuggestions(data.data) }
      } catch (err) {
        console.log("player searched")
      }
    };
    fetchSuggestions();
    return () => {
      ctrl.abort();
    };
  }, [searchTerm]);

  function clearSelection(){
    setSearchTerm('')
    setSuggestions([])
  }

  const handleSelect = (user: User) => {

    if (user) {
      clearSelection()
      onSelect(user as Player)
    }
    setSearchOpen(false)
  }

  return (
    <div className="border border-gray-200 p-4 rounded-xl  bg-gray-50 hover:border-teal-500 cursor-pointer max-lg:max-w-[250px]" onClick={() =>setSearchOpen(true)}>
      <div className='flex flex-row justify-center items-center'>
        <Image
          src="/icons/search.svg"
          alt="Search"
          width={20}
          height={20}
          />
        <input
          type="text"
          className="text-black w-full focus:outline-none"
          placeholder=" Search User"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
      </div>
      {searchOpen && (
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
    )}
  </div>
  )
}
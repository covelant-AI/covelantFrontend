'use client';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link'
import {PlayerDataAray} from "@/util/interfaces"
import { useState, useEffect } from "react";
import Image from 'next/image'
import { UserPen } from 'lucide-react';
import * as Sentry from "@sentry/nextjs";

export default function ConnectionBox(){
  const {profile} = useAuth();  
  const [playerData, setPlayerData] = useState<PlayerDataAray>(); 
  const safePlayerData = Array.isArray(playerData) ? playerData : [];
  const playerCount = safePlayerData.length;

  useEffect(() => {
    if (!profile?.type) return

    const getUserData = async () => {
      try {
        const res = await fetch(
          `/api/getConnection?email=${encodeURIComponent(profile.email)}`,
          {
            headers: { 'Content-Type': 'application/json', Accept: 'application/json', type: profile.type },
          }
        )
        const result = await res.json()
        if (result.error) Sentry.captureException(result.error)

        if (profile.type === 'coach') {
          setPlayerData(result.connection)
        } else {
          setPlayerData(result.connection[0].coaches)
        }
      } catch (err) {
        Sentry.captureException(err);
        alert('Error fetching user data:')
      }
    }

    getUserData()
  }, [profile?.type, profile?.email])
  
  return (
    <div className="flex flex-col  z-10">
      <div className="pb-2 items-start">
          {profile?.type == "player" ? 
          <p className="font-semibold text-[#3E3E3E] text-md pl-2">Your Coach</p> 
          : 
          <p className="font-semibold text-[#3E3E3E] text-md pl-2">Your Players</p>
          }
      </div>
      <div className="flex items-center justify-center space-x-2 bg-[#F9F9F9] border border-[#E7E7E7] p-2 rounded-2xl">
      {playerCount === 0 ? 
      <>
        <div className="flex items-center justify-between px-1 py-1 gap-6">
          <div className='p-2 rounded-xl bg-[#42B6B1]'>
            <Image className="w-7 h-7 bg-[#42B6B1] justify-center" src="/images/default-avatar.png" width={50} height={50} alt="Upload Icon" />
          </div>
          <div>
            <div className="font-bold text-gray-900">Add a New {profile?.type == "player"? "Coach": "Players"}!</div>
            <div className="font-semibold text-gray-500 text-sm">Add your {profile?.type == "player"? "Coaches": "Players"} will appear here →</div>
          </div>
          <Link href="/invite">
          <div className="active:scale-[0.9] w-10 h-10 flex items-center justify-center border-2 border-[#E7E7E7] rounded-xl bg-white hover:bg-[#42B6B1] 
           cursor-pointer hover:text-white transition-colors duration-300">
            <svg 
            className="w-5 h-5 stroke-black"
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
          </div>
          </Link>
        </div>
      </>: <>
      <div className="flex items-center space-x-2 mr-6">
          {(playerCount < 3 ? safePlayerData : safePlayerData.slice(0, 3)).map((player) => (
            // <Link key={player.id} href={`/profile/${player.id}`}>
              // <button className='cursor-pointer active:scale-[0.9] hover:scale-[1.05]'>
                <div key={player.id} className="w-12 h-12 rounded-xl overflow-hidden ">
                <div className="relative w-full h-full">
                  <Image
                    src={player.avatar || "/images/test.jpg"}
                    alt={`${player.firstName} ${player.lastName}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                </div>
              // </button>
            // </Link>
          ))}

          <Link href="/your-connection">
            <button className='active:scale-[0.9]'>
                <div className="w-13 h-13 flex justify-center items-center bg-white border cursor-pointer 
                border-[#E7E7E7] font-semibold text-black rounded-xl text-md hover:bg-[#42B6B1] hover:text-white transition-colors duration-300">
                  <UserPen />
                </div>
            </button>
          </Link>
      </div>
      <Link href='/invite'>
        <button className="flex items-center justify-center w-12 h-12 bg-white border border-[#E7E7E7] text-black rounded-xl
                         cursor-pointer hover:bg-[#42B6B1] hover:text-white transition-colors duration-300 active:scale-[0.9]">
            <svg 
            className="w-7 h-7 stroke-current"
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
      </Link>
      </>}
      </div> 
    </div>  
  )
}

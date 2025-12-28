'use client';
import { useState, useEffect } from "react";
import { useAuth } from '@/app/context/AuthContext';
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import {Coach} from "@/util/interfaces"
import { toast } from 'react-toastify';
import {Msg} from '@/components/UI/ToastTypes';
import * as Sentry from "@sentry/nextjs";
import Image from 'next/image'

export default function ListAllCoaches(){
    const [selectedIds, setSelectedIds] = useState(new Set())
    const [playerData, setPlayerData] = useState<Coach[]>([]);
    const safePlayerData = Array.isArray(playerData) ? playerData : [];
    const {profile} = useAuth();

    const getUserData = async (): Promise<void> => {
      try {
        await fetch('/api/getAllCoaches', {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }),
        }).then((response) => response.json())
        .then((result)=> {
          if(result.error){
            Sentry.captureException(result.error);
          }
          setPlayerData(()=> result.data);
        })
      } catch (error) {
        toast.error(Msg, {
          data: {
            title: 'Internal Server Error',
            message: 'There was an error while loading the page. Please try refreshing the page or come back later.',
          },
          position: 'bottom-right',
        })
        Sentry.captureException(error);
      }
    };

    async function handleOnSubmit(clickedPlayer: Coach) {
      if (!clickedPlayer) return
    
      try {
        const res = await fetch('/api/addCoach', {
          method: 'POST',
          headers: new Headers( { 'Content-Type': 'application/json' }),
          body: JSON.stringify({ coach: clickedPlayer, email: profile?.email }),
        })
    
        if (!res.ok){
          toast.error(Msg, {
          data: {
            title: 'Internal Server Error',
            message: 'There was an error while adding user. Please try refreshing the page or come back later.',
          },
          position: 'bottom-right',
        })
        }
        
        toast.success("Coach invited successfully!", {
          position: 'bottom-right',
        })

        setSelectedIds((prev) => new Set(prev).add(clickedPlayer.id))
        
      } catch (error) {
        toast.error(Msg, {
          data: {
            title: 'Internal Server Error',
            message: 'Something went wrong on our end, we are looking into. Thank you for your patience.',
          },
          position: 'bottom-right',
        })
        Sentry.captureException(error)
      }
    }

    const visiblePlayers = safePlayerData.filter((p) => !selectedIds.has(p.id))


    useEffect(() => {
      if (profile) {
        getUserData()
      }
    }, [profile]);
    
    return(
        <>
        {safePlayerData.length == 0 ? 
      <></>
      :
    <div className="bg-white rounded-xl shadow-md max-w-4xl p-6 overflow-hidden z-10">
      <div className="font-bold text-gray-700 mb-4">Suggested Coaches</div>
      <div
        className="flex flex-wrap gap-4 max-w-[520px] p-4 justify-center max-h-[320px] overflow-y-auto"
      >
        {visiblePlayers.map((player) => (
          <div
            key={player.id}
            className="relative flex flex-col items-center w-20 cursor-pointer"
            onClick={() => handleOnSubmit(player)}
          >
            <div className="w-20 h-20 rounded-lg bg-cyan-200 overflow-hidden mb-2 transform transition-transform duration-200 hover:scale-105 relative">
              <div className="relative w-full h-full">
                <Image
                  src={player?.avatar || '/images/default-avatar.png'}
                  alt="Athlete"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>


              {/* Overlay plus icon on hover */}
              <div className="absolute inset-0 bg-[#42B6B1] bg-opacity-100 opacity-0 hover:opacity-100 flex justify-center items-center transition-opacity rounded-lg">
                <PlusCircleIcon className="w-10 h-10 opacity-100 bg-[#42B6B1] text-white" />
              </div>
            </div>
            <div className="text-sm text-center text-gray-700">
              {player.firstName} {player.lastName}
            </div>
          </div>
        ))}
      </div>
    </div>
      }
      </>
    )
}
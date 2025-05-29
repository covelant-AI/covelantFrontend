'use client';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link'
import {PlayerData} from "@/util/interfaces"
import { useState, useEffect } from "react";

export default function ConnectionBox(){
  const {user,type} = useAuth();  

  const [playerData, setPlayerData] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState(true);  
  const safePlayerData = Array.isArray(playerData) ? playerData : [];
  const playerCount = safePlayerData.length;

  const getUserData = async (): Promise<void> => {
    if (!user?.email || !type) return;
    setLoading(true);  
    try {
      const email = user.email;
      await fetch(`/api/getConnection?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          type: type,
        }),
      }).then((response) => response.json())
      .then((result)=> {
        if(result.error){
          alert('Error fetching user data:');
        }
        if(type=="coach"){
            setPlayerData(()=> result.connection);
          }
          else{
            setPlayerData(()=>result.connection[0].coaches)
          }
      })
    } catch (error) {
      alert('Error fetching user data');
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (!user || !type) {
      setLoading(false); 
      return;
    }
    getUserData();
  }, [user, type]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10 text-gray-600">
        Loading...
      </div>
    );
  }
  
  return (
    <div className="flex flex-col  z-10">
      <div className="pb-2 items-start">
          {type == "player" ? 
          <p className="font-semibold text-[#3E3E3E] text-md pl-2">Your Coach</p> 
          : 
          <p className="font-semibold text-[#3E3E3E] text-md pl-2">Your Players</p>
          }
      </div>
      <div className="flex items-center justify-center space-x-2 bg-[#F9F9F9] border border-[#E7E7E7] p-2 rounded-2xl">
      {playerCount == 0 ? 
      <Link href="/invite">
        <div className="flex items-center justify-between px-4 py-1 gap-10 cursor-pointer">
          <div>
            <div className="font-bold text-gray-900">No {type == "player"? "coach": "players"} invited</div>
            <div className="font-semibold text-gray-500 text-sm">Add your coach →</div>
          </div>
          <div className="w-10 h-10 flex items-center justify-center border-2 border-[#E7E7E7] rounded-xl bg-white hover:bg-[#42B6B1] hover:text-white transition-colors duration-300">
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
        </div>
      </Link>: <>
      <div className="flex items-center space-x-2">
            {(playerCount < 3 ? safePlayerData : safePlayerData.slice(0, 3)).map((player) => (
              <div key={player.id} className="w-12 h-12 rounded-xl overflow-hidden">
                <img
                  src={player.avatar || "images/test.jpg"}
                  alt={`${player.firstName} ${player.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <button className='cursor-pointer mr-6'>
              {playerCount  - 3 > 0 ? (
                <div className="w-12 h-12 flex justify-center items-center bg-white border 
                border-[#E7E7E7] font-semibold text-black rounded-xl text-md hover:bg-[#42B6B1] hover:text-white transition-colors duration-300">
                  +{playerCount  - 3}
                </div>
              ) : null}
            </button>
      </div>
      <Link href='/invite'>
        <button className="flex items-center justify-center w-12 h-12 bg-white border border-[#E7E7E7] text-black rounded-xl
                         cursor-pointer hover:bg-[#42B6B1] hover:text-white transition-colors duration-300">
            <svg 
            className="w-5 h-5 stroke-current"
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

'use client'
import Image from 'next/image'
import RadialBlurBg from '@/components/UI/RadialBlur'
import { useState, useEffect } from "react";
import { useAuth } from '../app/context/AuthContext';

export default function HeroSection(){
  
  const { user } = useAuth();

    interface PlayerData {
      id?: number;       
      avatar?: string;
      firstName?: string;
      lastName?: string;
      coachId?: number;   
    }

    const [playerData, setPlayerData] = useState<PlayerData[]>([]);
    const safePlayerData = Array.isArray(playerData) ? playerData : [];
    const playerCount = safePlayerData.length;

    const getUserData = async (): Promise<void> => {
      try {
        const email = user.email;

        await fetch(`/api/getConnection?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }),
        }).then((response) => response.json())
        .then((result)=> {
          if(result.error){
            console.error('Error fetching user data:', result.error);
          }
          setPlayerData(()=> result.connection);
        })
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    useEffect(() => {
      if (user) {
        getUserData()
      }
    }, [user]);

    return(
        <div className="relative overflow-hidden flex justify-between items-center px-20 xl:px-40 pt-60 pb-8 bg-[#F9F9F9] border-[#E7E7E7]">
          <RadialBlurBg 
              background={'radial-gradient(50% 50% at 50% 50%,rgba(8, 113, 151, 0.1) 61%,rgba(0, 180, 174, 0.12) 78%,rgba(176, 198, 255, 0) 100%)'}
              width={"auto"} 
              height={"504.04px"} 
              rotate={"0deg"} 
              top={'15vh'} 
              left={'5vh'}
            />

          <div className="flex flex-col items-start space-x-2 z-10">
            {/* left hand side */}
            <div className="pb-4">
                <p className="font-semibold text-[#3E3E3E] text-md">Your Actions</p>
            </div>
                <button className="flex items-center bg-[#42B6B1] text-white py-2 px-7 rounded-lg font-semibold mb-2 
                cursor-pointer hover:bg-teal-600 transition-colors duration-300">
                  <Image className="w-5 h-5 mr-4" src="./icons/upload.svg" width={50} height={50} alt="Upload Icon" />
                  Upload Match
                </button>
            </div>

         {/* right hand side */}
        <div className="flex flex-col z-10">
            <div className="pb-2">
                <p className="font-semibold text-[#3E3E3E] text-md">Your Athletes</p>
            </div>
          <div className="flex items- justify-center space-x-2 bg-[#F9F9F9] border boder-[#E7E7E7] p-2 rounded-2xl">
            {playerCount == 0 ? <button className="flex items-center justify-center w-12 h-12 bg-white border border-[#E7E7E7] text-black rounded-xl
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
            </button> : <>
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
                    ) : (
                      <></>
                    )}
                  </button>
            </div>
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
            </>}
          </div> 
        </div>  
        </div>
    )
}
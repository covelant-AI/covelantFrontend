'use client';
import { useState, useEffect } from "react";
import { useAuth } from '@/app/context/AuthContext';

export default function YourAthletes(){
            const {user} = useAuth();
    
            interface PlayerData {
              id?: number;       
              avatar?: string;
              firstName?: string;
              lastName?: string;
              coachId?: number;   
            }
        
            const [playerData, setPlayerData] = useState<PlayerData[]>([]);
            const safePlayerData = Array.isArray(playerData) ? playerData : [];
            
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
        <>
        {safePlayerData.length == 0 ? 
      <></>
      :
      <div className="bg-white rounded-xl shadow-md max-w-4xl p-6 overflow-hidden z-10">
          <div className="font-bold text-gray-700 mb-4">Athlete List</div>
          <div
            className="flex flex-wrap gap-4 max-w-[520px] p-4 justify-center max-h-[320px] overflow-y-auto"
          >
            {safePlayerData.map((player) => ( // Example with 20 images
              <div key={player.id} className="flex flex-col items-center w-20">
                <div className="w-20 h-20 rounded-lg bg-cyan-200 overflow-hidden mb-2">
                  <img
                    src={player?.avatar}
                    alt="Athlete"
                    className="w-full h-full object-cover"
                    />
                </div>
                <div className="text-sm text-center text-gray-700">{player.firstName} {player.lastName}</div>
              </div>
            ))}
          </div>
      </div> 
      }
      </>
    )
}
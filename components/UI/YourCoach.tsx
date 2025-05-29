'use client';
import { useState, useEffect } from "react";
import { useAuth } from '@/app/context/AuthContext';

export default function YourCoach(){
            const {user} = useAuth();
    
            interface CoachData {
              id?: number;       
              avatar?: string;
              firstName?: string;
              lastName?: string;
              coached?: any;
              email?: string;
              team?: string;
              age?: string;
              coachId?: number;   
            }

            const [coachData, setCoachData] = useState<CoachData[]>([]);
            const safePlayerData = Array.isArray(coachData) ? coachData : [];

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
              setCoachData(()=>  result.connection);
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
        {safePlayerData.length === 0 ? 
      <></>
      :
      <div className="bg-white rounded-xl shadow-md max-w-4xl p-6 overflow-hidden z-10">
          <div className="font-bold text-gray-700 mb-4">Coaches List</div>
          <div
            className="flex flex-wrap gap-4 max-w-[520px] p-4 justify-center max-h-[320px] overflow-y-auto"
          >
              <div key={coachData[0].id} className="flex flex-col items-center w-20">
                <div className="w-20 h-20 rounded-lg bg-cyan-200 overflow-hidden mb-2">
                  <img
                    src={coachData[0].coached.avatar}
                    alt="Athlete"
                    className="w-full h-full object-cover"
                    />
                </div>
                <div className="text-sm text-center text-gray-700">{coachData[0].coached.firstName} {coachData[0].coached.lastName}</div>
              </div>
          </div>
      </div> 
      }
      </>
    )
}
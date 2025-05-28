'use client';
import { useState, useEffect } from "react";
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link'

export default function PlayersCoaches(){
    const {user} = useAuth();
    
    interface CoachData {
    id: number,
    firstName: string,
    lastName: string,
    avatar: string,
    email: string,
    team: string,
    }

    const [coachData, setcoachData] = useState<CoachData | null>(null);
    
        
    const getCoachData = async (): Promise<void> => {
      try {
        const email = user.email;

         const result = await fetch(`/api/getConnection?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }),
        }).then((response) => response.json())
        .then((result)=> {
          if(!result.connection){
            setcoachData(null);
            return;
          }
          return result.connection
        })
        setcoachData(()=> result[0].coached);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    useEffect(() => {
      if (user) {
        getCoachData()
      }
    }, [user]);

return(
    <div className="flex items-center justify-center space-x-2 bg-[#F9F9F9] border boder-[#E7E7E7] p-2 rounded-2xl">
        {coachData == null ? 
        <div className="flex flex-col items-start justify-center space-x-20 px-4 ">
            <h3 className="text-black text-md font-bold">No coach Invited</h3>
            <h3 className="text-black text-sm">Add your coach →</h3>
        </div>
        :
        <div className="flex flex-row items-start justify-center space-x-2 px-1 mr-15">
            <div>
                <img
                    className="w-12 h-12 rounded-xl object-cover"
                    src={coachData.avatar}
                    alt="User Image"
                  />
            </div>
            <div>
                <h3 className="text-black text-md font-bold">{coachData.firstName} {coachData.lastName}</h3>
                <h3 className="text-black text-sm">Coach</h3>
            </div>
        </div>
        }
        <Link href='/invite'>
          <button className="flex items-center justify-center w-12 h-12 bg-white border border-[#E7E7E7] text-black rounded-xl
                               cursor-pointer hover:bg-[#42B6B1] hover:text-white transition-colors duration-300">
             +
          </button>
        </Link>
    </div>
    )
}
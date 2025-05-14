'use client'
import Image from 'next/image'
import { useEffect } from 'react';
import { useAuth } from '../app/context/AuthContext';
import RadialBlurBg from '@/components/UI/RadialBlur'

export default function HeroSection(){
    const { user } = useAuth();

    const getUserData = async () => {
    try {
      const email =  user.email
      
      const response = await fetch(`/api/getUser?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      });
      
      const data = await response.json();
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (user) {
      getUserData();
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
                <button className="flex items-center bg-[#42B6B1] text-white py-2 px-7 rounded-lg font-semibold mb-2">
                  <Image className="w-5 h-5 mr-4" src="./icons/upload.svg" width={50} height={50} alt="Upload Icon" />
                  Upload Match
                </button>
            </div>


         {/* right hand side */}
        <div className="flex flex-col z-10">
            <div className="pb-2">
                <p className="font-semibold text-[#3E3E3E] text-md">Your Athletes</p>
            </div>
          <div className="flex items-center space-x-2 bg-[#F9F9F9] border boder-[#E7E7E7] p-2 rounded-2xl">
            <div className="flex items-center space-x-2 pr-6">

              <div className="w-12 h-12 rounded-xl overflow-hidden">
                <img src="images/test.jpg" alt="Player 1" className="w-full h-full object-cover" />
              </div>
              <div className="w-12 h-12 rounded-xl overflow-hidden">
                <img src="images/test.jpg" alt="Player 2" className="w-full h-full object-cover" />
              </div>
              <div className="w-12 h-12 rounded-xl overflow-hidden">
                <img src="images/test.jpg" alt="Player 3" className="w-full h-full object-cover" />
              </div>


              <div className="w-12 h-12 flex justify-center items-center bg-[#FFFFFF] border border-[#E7E7E7] font-semibold text-black rounded-xl text-md">
                +23
              </div>

            </div>


            <button className="flex items-center justify-center w-12 h-12 bg-[#FFFFFF] border border-[#E7E7E7] text-black rounded-xl">
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>  
        </div>
    )
}
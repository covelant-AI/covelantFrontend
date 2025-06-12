"use client";
import { useEffect, useState,useCallback  } from 'react'
import RadarGraph from '../UI/RadarGraph'
import { SidePanelDashboardProps, WinOutcome } from '@/util/interfaces';
import { QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/context/AuthContext';
import Image from "next/image"
import * as Sentry from "@sentry/nextjs";

export default function SidePanelDashboard({ activePlayer }: SidePanelDashboardProps) {
  const [winOutcome, setWinOutcome] = useState<Array<WinOutcome> | null>([]);
  const [showExplanation, setShowExplanation] = useState(false)
  const { profile } = useAuth();

  const getMatchOutcome = useCallback(async (): Promise<void> => {
    try {
      const email = activePlayer?.email;
      if (!email) {
        return;
      }
      const response = await fetch(`/api/getMatchOutcome?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      });

      const result = await response.json();
      if (!result.success) {
        Sentry.captureException(result); // add loading here but later---------------------------
      }
      setWinOutcome(() => result.data);
    } catch (error) {
      Sentry.captureException(error);
    }
  }, [activePlayer?.email]);

  useEffect(() => {
    if (activePlayer) {
      getMatchOutcome(); 
    }
  }, [activePlayer, getMatchOutcome]);

    return (
        <div className="col-span-3 flex justify-center">
                <div className="bg-white rounded-2xl py-6 px-2 flex flex-col items-center gap-4 w-[60%] lg:w-[120%] xl:w-[90%]">
           
                {/* Profile + status icons */}
                {profile?.type == "player" ? <div className='bg-gray-100 w-full rounded-2xl p-1'>
                  <div className="flex flex-col w-full gap-4 bg-[#FFFFFF] p-4 rounded-2xl">
                      <span className='flex flex-row items-center gap-4'>
                        <div className="w-18 h-18 rounded-full overflow-hidden flex justify-center items-center">
                            <Image
                              src={profile?.avatar || '/images/default-avatar.png'}
                              alt="Profile picture"
                              width={70}  
                              height={70} 
                              className="object-cover w-full h-full"
                            />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">{profile?.firstName}<br/> <span className='font-bold'>{profile?.lastName}</span></h3>
                      </span>
                  <div className="flex items-center gap-2 justify-between pt-8 text-xl">
                    <span className="flex items-center justify-center text-white bg-[#C6C6C6] w-10 lg:w-9 h-9 rounded-full">?</span>
                    {winOutcome?.map((outcome) =>
                      outcome.result == "win"
                        ? <span key={outcome.id} className="flex items-center justify-center text-white bg-[#42B6B1] w-10 lg:w-9 h-9 rounded-full">✓</span>
                        : <span key={outcome.id} className="flex items-center justify-center text-white bg-[#FF4545] w-10 lg:w-9 h-9 rounded-full">✕</span>
                    )}
                  </div>    
                </div>
        
                  {/* Advanced - tier section */}
                  <span className="flex text-sm text-white items-center justify-between px-2">
                      <button className="text-black px-4 py-2 text-xl">Advanced</button>
                      <button className="text-gray-600 px-4 py-2 text-xl">Tier</button>
                  </span>
                </div>
                : // Coach condition ------------------------------------------------------------------------------------------------------------
                <div className='bg-gray-100 w-full rounded-2xl p-1'>
                  <div className="flex flex-col w-full gap-4 bg-[#FFFFFF] p-4 rounded-2xl">
                      <span className='flex flex-row items-center gap-4'>
                           <div className="w-18 h-18 rounded-full overflow-hidden flex justify-center items-center">
                              <Image
                                src={activePlayer?.avatar || '/images/default-avatar.png'}
                                alt="Alexis Lebrun"
                                width={72}
                                height={72}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          <h3 className="text-xl font-semibold text-gray-800">{activePlayer?.firstName ?? 'No Player'}<br/> <span className='font-bold'>{activePlayer?.lastName ?? 'selected'}</span></h3>
                      </span>
                    <div className="flex items-center gap-2 justify-between pt-8 text-xl">
                    <span className="flex items-center justify-center text-white bg-[#C6C6C6] w-10 lg:w-9 h-9 rounded-full">?</span>
                    {activePlayer ? (
                      winOutcome?.map((outcome) =>
                        outcome.result == "win"
                          ? <span key={outcome.id} className="flex items-center justify-center text-white bg-[#42B6B1] w-10 lg:w-9 h-9 rounded-full">✓</span>
                          : <span key={outcome.id} className="flex items-center justify-center text-white bg-[#FF4545] w-10 lg:w-9 h-9 rounded-full">✕</span>
                      )
                    ) : (
                      <span className="flex items-center justify-center text-black"></span>
                    )}
                  </div>    
                </div>
        
                  {/* Advanced - tier section */}
                  <span className="flex text-sm text-white items-center justify-between px-2">
                      <button className="text-black px-4 py-2 text-xl">Advanced</button>
                      <button className="text-gray-600 px-4 py-2 text-xl">Tier</button>
                  </span>
                </div>
                }
                
                {/* Radar chart placeholder */}
                <div className="w-full rounded-lg bg-[#FFFFFF] relative">
                  
                  {/* Help button in the top-right */}
                  <button
                    onClick={() => setShowExplanation((v) => !v)}
                    className="absolute top-3 right-3 p-1 hover:bg-gray-200 rounded-full z-10"
                    aria-label="Show explanation"
                  >
                    <QuestionMarkCircleIcon className="h-6 w-6 text-gray-500" />
                  </button>

                  <div className="w-full h-60 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 p-4">
                    <RadarGraph activePlayer={activePlayer} />
                  </div>

                  {showExplanation && (
                    <div
                      className="absolute bottom-1 right-70 z-10 w-72 bg-white rounded-2xl shadow-lg p-4"
                    >
                      {/* Close button */}
                      <button
                        onClick={() => setShowExplanation(false)}
                        className="absolute top-3 right-3 p-1 hover:bg-gray-200 rounded-full"
                        aria-label="Close explanation"
                      >
                        <XMarkIcon className="h-5 w-5 text-gray-700" />
                      </button>
                  
                      {/* Header */}
                      <div className="flex items-center gap-2 mb-3">
                        <QuestionMarkCircleIcon className="h-6 w-6 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-600">Explanation</h3>
                      </div>
                  
                      {/* Content */}
                      <ul className="space-y-4 text-sm text-gray-800">
                        <li className='flex flex-row justify-center items-center p-2'>
                          <span className="font-bold text-lg mr-4">SRV:</span> Serve Quality, Measures effectiveness &amp; variation
                        </li>
                        <li className='flex flex-row justify-center items-center p-2'>
                          <span className="font-bold text-lg mr-4">RTN:</span> Return Game, Ability to handle opponent&apos;s serves
                        </li>
                        <li className='flex flex-row justify-center items-center p-2'>
                          <span className="font-bold text-lg mr-4">FHD:</span> Forehand Attack, Aggressiveness &amp; winners via forehand
                        </li>
                        <li className='flex flex-row justify-center items-center p-2'>
                          <span className="font-bold text-lg mr-4">BHD:</span> Backhand Attack, Aggressiveness &amp; versatility via backhand
                        </li>
                        <li className='flex flex-row justify-center items-center p-2'>
                          <span className="font-bold text-lg mr-4">RLY:</span> Rally Endurance, Performance in longer rallies
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
    )
}
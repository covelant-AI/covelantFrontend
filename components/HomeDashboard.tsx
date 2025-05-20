import React from 'react'
import VideoDashboard from './UI/videoDashboard'
import SidePanelDashboard from './SidePanelDashboard'
import { useState } from 'react'

type Player = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  coachId: number;
};

export default function HomeDashboard() {
  const defaultPlayer: Player = {
      id: 1,
      firstName: 'My First',
      lastName: 'Player',
      email: 'savejhonconnor@covelant.com',
      avatar: '/testImages/player1.jpg',
      coachId: 1,
    };
  const [activePlayer, setActivePlayer] = useState<Player | null>(defaultPlayer);

  return (
    <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-0.5 bg-[#FFFFFF]  
                px-[5vh] max-sm:px-[1vh] lg:px-[6vh] xl:px-[10vh] 2xl:px-[25vh]">
      <VideoDashboard 
        activePlayer={activePlayer} 
        setActivePlayer={setActivePlayer} 
      />
      <SidePanelDashboard activePlayer={activePlayer} />
    </div>
  )
}



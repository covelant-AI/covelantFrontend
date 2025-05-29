import React from 'react'
import VideoDashboard from './videoDashboard'
import SidePanelDashboard from './SidePanelDashboard'
import {Player} from '@/util/types'
import { defaultPlayer1 } from '@/util/interfaces'
import { useState } from 'react'

export default function HomeDashboard() {
  const [activePlayer, setActivePlayer] = useState<Player>(defaultPlayer1);

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



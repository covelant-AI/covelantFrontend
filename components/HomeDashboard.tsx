import React from 'react'
import VideoDashboard from './UI/videoDashboard'
import SidePanelDashboard from './SidePanelDashboard'


export default function HomeDashboard() {
  return (
    <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-0.5 bg-[#FFFFFF]  
                px-[5vh] max-sm:px-[1vh] lg:px-[6vh] xl:px-[10vh] 2xl:px-[25vh]">
      <VideoDashboard/>
      <SidePanelDashboard/>
    </div>
  )
}



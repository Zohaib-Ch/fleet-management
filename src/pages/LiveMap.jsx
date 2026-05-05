import React from 'react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import FleetMap from '../components/FleetMap'

const LiveMapPage = () => {
  return (
    <div className="flex h-screen w-screen bg-soft-bg overflow-hidden p-4 gap-4">
      <Sidebar activeTab="Live Map" setActiveTab={() => {}} />
      
      <main className="flex-1 flex flex-col gap-4 overflow-hidden">
        <TopBar />
        
        <div className="flex-1 rounded-[2.5rem] overflow-hidden shadow-premium border border-white/80">
          <FleetMap isFullPage={true} />
        </div>
      </main>
    </div>
  )
}

export default LiveMapPage

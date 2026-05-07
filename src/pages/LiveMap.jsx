import React from 'react'
import Navbar from '../components/Navbar'
import FleetMap from '../components/FleetMap'

const LiveMapPage = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-soft-bg overflow-hidden p-4 gap-4">
      <Navbar />
      
      <main className="flex-1 flex flex-col gap-4 overflow-hidden pt-24">
        
        <div className="flex-1 rounded-[2.5rem] overflow-hidden shadow-premium border border-white/80">
          <FleetMap isFullPage={true} />
        </div>
      </main>
    </div>
  )
}

export default LiveMapPage

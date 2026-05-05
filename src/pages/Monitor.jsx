import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Maximize2, Minimize2 } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { mockVehicles, mockVehicleGroups, mockMonitorStats } from '../mockData'
import MonitorStatsBar from '../components/monitor/MonitorStatsBar'
import MonitorVehiclePanel from '../components/monitor/MonitorVehiclePanel'
import MonitorMap from '../components/monitor/MonitorMap'
import MonitorDetailPanel from '../components/monitor/MonitorDetailPanel'
import MapStatusFilter from '../components/monitor/MapStatusFilter'
import { useSettings } from '../context/SettingsContext'

// ── Tiny seeded jitter for smooth movement ────────────────────────────────────
const jitter = (v, range) => v + (Math.random() - 0.5) * range

const Monitor = () => {
  const { settings, updateSetting, toggleMonitorStat, updateMonitorStatusFilters } = useSettings()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showStatsConfig, setShowStatsConfig] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const viewMode = settings.monitorViewMode || 'all'
  const setViewMode = (val) => updateSetting('monitorViewMode', val)
  const [expandedGroups, setExpandedGroups] = useState(new Set(['grp-01']))
  const [activeGroupFilter, setActiveGroupFilter] = useState(null)
  const [focusedVehicle, setFocusedVehicle] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  // Derived stats with visibility from settings
  const stats = useMemo(() => {
    return mockMonitorStats.map(s => ({
      ...s,
      visible: settings.monitorStatsVisibility[s.id] ?? true
    }))
  }, [settings.monitorStatsVisibility])

  const statusFilters = settings.monitorStatusFilters

  const [liveVehicles, setLiveVehicles] = useState(() =>
    mockVehicles.map(v => ({ ...v, _heading: Math.random() * 360 }))
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVehicles(prev => prev.map(v => {
        if (v.status !== 'Moving') return v
        const heading = ((v._heading || 0) + jitter(0, 15) + 360) % 360
        const rad = (heading * Math.PI) / 180
        const step = 0.0004
        return {
          ...v,
          _heading: heading,
          lat: Math.max(55.5, Math.min(57.0, v.lat + Math.cos(rad) * step)),
          lng: Math.max(8.0, Math.min(12.5, v.lng + Math.sin(rad) * step)),
          speed: Number(Math.max(28, Math.min(98, v.speed + jitter(0, 6))).toFixed(1)),
        }
      }))
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedVehicle) {
      const updated = liveVehicles.find(v => v.id === selectedVehicle.id)
      if (updated) setSelectedVehicle(updated)
    }
  }, [liveVehicles])

  const handleSingleClick = useCallback((vehicle) => {
    const live = liveVehicles.find(v => v.id === vehicle.id) || vehicle
    setFocusedVehicle(live)
    setSelectedVehicle(live)
  }, [liveVehicles])

  const handleDoubleClick = useCallback((vehicle) => {
    const live = liveVehicles.find(v => v.id === vehicle.id) || vehicle
    setSelectedVehicle(live)
    setFocusedVehicle(live)
  }, [liveVehicles])

  const handleCloseDetail = useCallback(() => setSelectedVehicle(null), [])
  const toggleStat = useCallback((id) => toggleMonitorStat(id), [toggleMonitorStat])
  const toggleGroup = useCallback((groupId) => setExpandedGroups(prev => { const n = new Set(prev); n.has(groupId) ? n.delete(groupId) : n.add(groupId); return n }), [])

  const handleToggleStatus = useCallback((statusId) => {
    let nextFilters = []
    if (statusId === 'ALL') nextFilters = ['Moving', 'Resting', 'Idle', 'Maintenance']
    else if (statusId === 'NONE') nextFilters = []
    else nextFilters = statusFilters.includes(statusId) ? statusFilters.filter(s => s !== statusId) : [...statusFilters, statusId]
    
    updateMonitorStatusFilters(nextFilters)
  }, [statusFilters, updateMonitorStatusFilters])

  const filteredVehicles = useMemo(() => liveVehicles.filter(v => {
    const q = searchQuery.toLowerCase()
    const matchSearch = !q || v.name.toLowerCase().includes(q) || v.id.toLowerCase().includes(q)
    const matchGroup = !activeGroupFilter || v.group === activeGroupFilter
    const matchStatus = statusFilters.includes(v.status)
    return matchSearch && matchGroup && matchStatus
  }), [liveVehicles, searchQuery, activeGroupFilter, statusFilters])

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-[#F0F4F8] relative font-sans transition-all duration-500`}>
      <AnimatePresence>
        {!isFullscreen && (
          <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full shrink-0">
            <Sidebar activeTab="Dashboard" setActiveTab={() => { }} />
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`flex-1 flex flex-col overflow-hidden min-w-0 transition-all duration-500 ${isFullscreen ? 'p-0 gap-0' : 'p-3 gap-2'}`}>
        {!isFullscreen && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}>
            <TopBar hideSearch={true} hideProfile={true} hideNotifications={true} />
            <MonitorStatsBar stats={stats} showConfig={showStatsConfig} onToggleConfig={() => setShowStatsConfig(p => !p)} onToggleStat={toggleStat} />
          </motion.div>
        )}

        <div className="flex-1 flex gap-3 overflow-hidden min-h-0 relative">
          <AnimatePresence>
            {!isFullscreen && (
              <motion.div initial={{ x: -400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -400, opacity: 0 }} transition={{ type: 'spring', damping: 30 }} className="h-full">
                <MonitorVehiclePanel
                  vehicles={filteredVehicles}
                  allVehicles={liveVehicles}
                  groups={mockVehicleGroups}
                  searchQuery={searchQuery}
                  onSearch={setSearchQuery}
                  viewMode={viewMode}
                  onViewMode={setViewMode}
                  expandedGroups={expandedGroups}
                  onToggleGroup={toggleGroup}
                  activeGroupFilter={activeGroupFilter}
                  onGroupFilter={setActiveGroupFilter}
                  focusedVehicle={focusedVehicle}
                  selectedVehicle={selectedVehicle}
                  onSingleClick={handleSingleClick}
                  onDoubleClick={handleDoubleClick}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`flex-1 relative overflow-hidden transition-all duration-500 ${isFullscreen ? 'rounded-0 border-0' : 'rounded-2xl shadow-premium border border-white/70'}`}>
            <MonitorMap
              vehicles={filteredVehicles}
              focusedVehicle={focusedVehicle}
              selectedVehicle={selectedVehicle}
              onSingleClick={handleSingleClick}
              onDoubleClick={handleDoubleClick}
            />

            {/* Fullscreen/Expand Toggle Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="absolute bottom-24 right-4 z-[1000] w-10 h-10 bg-white rounded-xl shadow-premium flex items-center justify-center text-slate-500 hover:text-blue-600 hover:scale-110 active:scale-95 transition-all border border-white/50"
              title={isFullscreen ? "Exit Fullscreen" : "Expand Map"}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>

            <MapStatusFilter
              activeStatuses={statusFilters}
              onToggleStatus={handleToggleStatus}
            />

          </div>

          <AnimatePresence>
            {selectedVehicle && (
              <MonitorDetailPanel
                vehicle={selectedVehicle}
                onClose={handleCloseDetail}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default Monitor

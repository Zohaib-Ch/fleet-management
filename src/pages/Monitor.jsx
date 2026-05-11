import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { Maximize2, Minimize2, GripVertical, ChevronLeft, ChevronRight, LayoutDashboard, List, MapPin, Info } from 'lucide-react'
import Navbar from '../components/Navbar'
import { mockVehicles, mockVehicleGroups, mockMonitorStats } from '../mockData'
import MonitorStatsBar from '../components/monitor/MonitorStatsBar'
import MonitorVehiclePanel from '../components/monitor/MonitorVehiclePanel'
import MonitorMap from '../components/monitor/MonitorMap'
import MonitorDetailPanel from '../components/monitor/MonitorDetailPanel'
import MonitorDetailDrawer from '../components/monitor/MonitorDetailDrawer'
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
  const [selectedVehicleId, setSelectedVehicleId] = useState(null)

  // Mobile tab state: 'map' | 'fleet'
  const [mobileTab, setMobileTab] = useState('map')

  const sectorMapping = {
    General: [],
    Construction: ['Excavator'],
    Rental: ['Car'],
    Logistics: ['Van', 'Truck'],
    Transport: ['Truck']
  }

  // Customizable Dashboard Order - Stable Layout logic
  const [dashboardOrder, setDashboardOrder] = useState(() => {
    const saved = localStorage.getItem('fleet_monitor_layout_v1')
    return saved ? JSON.parse(saved) : ['fleet_list', 'map_view', 'detail_panel']
  })

  // Persistence
  useEffect(() => {
    localStorage.setItem('fleet_monitor_layout_v1', JSON.stringify(dashboardOrder))
  }, [dashboardOrder])

  // Simple reordering logic for Flexbox Order
  const moveItem = (id, direction) => {
    const currentIndex = dashboardOrder.indexOf(id)
    const newIndex = currentIndex + direction
    if (newIndex < 0 || newIndex >= dashboardOrder.length) return

    const newOrder = [...dashboardOrder]
    const temp = newOrder[currentIndex]
    newOrder[currentIndex] = newOrder[newIndex]
    newOrder[newIndex] = temp
    setDashboardOrder(newOrder)
  }

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
      setLiveVehicles(prev => {
        let changed = false
        const next = prev.map(v => {
          if (v.status !== 'Moving') return v
          changed = true
          const heading = ((v._heading || 0) + jitter(0, 15) + 360) % 360
          const rad = (heading * Math.PI) / 180
          const step = 0.0004
          return {
            ...v,
            _heading: heading,
            lat: Math.max(55.8, Math.min(56.5, v.lat + Math.cos(rad) * step)),
            lng: Math.max(9.5, Math.min(10.18, v.lng + Math.sin(rad) * step)),
            speed: Number(Math.max(28, Math.min(98, v.speed + jitter(0, 6))).toFixed(1)),
          }
        })
        return changed ? next : prev
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const selectedVehicle = useMemo(() => 
    selectedVehicleId ? liveVehicles.find(v => v.id === selectedVehicleId) : null
  , [selectedVehicleId, liveVehicles])

  const handleSingleClick = useCallback((vehicle) => {
    setFocusedVehicle(vehicle)
    setSelectedVehicleId(vehicle.id)
    if (window.innerWidth < 1024) {
      setMobileTab('map')
    }
  }, [])

  const handleDoubleClick = useCallback((vehicle) => {
    setSelectedVehicleId(vehicle.id)
    setFocusedVehicle(vehicle)
    if (window.innerWidth < 1024) {
      setMobileTab('map')
    }
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedVehicleId(null)
    if (window.innerWidth < 1024) {
      setMobileTab('map')
    }
  }, [])

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
    const sectorTypes = sectorMapping[settings.activeSector] || []
    const matchSector = settings.activeSector === 'General' || sectorTypes.includes(v.type)
    return matchSearch && matchGroup && matchStatus && matchSector
  }), [liveVehicles, searchQuery, activeGroupFilter, statusFilters, settings.activeSector])

  return (
    <div className={`flex flex-col h-[100dvh] w-screen overflow-hidden bg-[#F0F4F8] relative font-sans transition-all duration-500`}>
      {!isFullscreen && <Navbar />}

      <main className={`flex-1 flex flex-col overflow-hidden min-w-0 transition-all duration-500 ${isFullscreen ? 'pt-0 p-0 gap-0' : 'pt-[76px] lg:pt-24 p-2 lg:p-3 gap-2'}`}>
        {/* Stats Bar - scrollable on mobile */}
        {!isFullscreen && (
          <div className="shrink-0">
            <MonitorStatsBar stats={stats} showConfig={showStatsConfig} onToggleConfig={() => setShowStatsConfig(p => !p)} onToggleStat={toggleStat} />
          </div>
        )}

        {/* ═══════════════════ DESKTOP LAYOUT (lg+) ═══════════════════ */}
        <div className="flex-1 hidden lg:flex gap-3 overflow-hidden relative">
          {/* 1. Fleet List Panel */}
          <AnimatePresence>
            {!isFullscreen && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                style={{ order: dashboardOrder.indexOf('fleet_list') }}
                className="h-full shrink-0 relative group/panel"
              >
                {/* Visual Order Controls */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-1 opacity-0 group-hover/panel:opacity-100 transition-opacity">
                  <button onClick={() => moveItem('fleet_list', -1)} className="p-1 bg-white rounded-md shadow-sm hover:bg-slate-50 text-slate-400"><ChevronLeft className="w-3 h-3" /></button>
                  <div className="px-2 py-1 bg-white rounded-md shadow-sm cursor-grab active:cursor-grabbing"><GripVertical className="w-3 h-3 text-slate-300" /></div>
                  <button onClick={() => moveItem('fleet_list', 1)} className="p-1 bg-white rounded-md shadow-sm hover:bg-slate-50 text-slate-400"><ChevronRight className="w-3 h-3" /></button>
                </div>

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

          {/* 2. Map View Container */}
          <motion.div
            layout
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            style={{ order: dashboardOrder.indexOf('map_view') }}
            className={`flex-1 relative overflow-hidden transition-all duration-500 group/map ${isFullscreen ? 'rounded-0 border-0' : 'rounded-2xl shadow-premium border border-white/70'}`}
          >
            {/* Visual Order Controls */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] flex items-center gap-1 opacity-0 group-hover/map:opacity-100 transition-opacity">
              <button onClick={() => moveItem('map_view', -1)} className="p-2 bg-white/90 backdrop-blur-md rounded-lg shadow-premium border border-white/50 text-slate-400 hover:text-blue-600"><ChevronLeft className="w-4 h-4" /></button>
              <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-lg shadow-premium border border-white/50 flex items-center gap-2 cursor-grab active:cursor-grabbing">
                <GripVertical className="w-4 h-4 text-slate-300" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Layout</span>
              </div>
              <button onClick={() => moveItem('map_view', 1)} className="p-2 bg-white/90 backdrop-blur-md rounded-lg shadow-premium border border-white/50 text-slate-400 hover:text-blue-600"><ChevronRight className="w-4 h-4" /></button>
            </div>

            <div className="w-full h-full relative">
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
          </motion.div>

          {/* 3. Detail Panel Container */}
          <AnimatePresence>
            {selectedVehicle && (
              <motion.div
                layout
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                style={{ order: dashboardOrder.indexOf('detail_panel') }}
                className="h-full shrink-0 relative group/detail"
              >
                {/* Visual Order Controls */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-1 opacity-0 group-hover/detail:opacity-100 transition-opacity">
                  <button onClick={() => moveItem('detail_panel', -1)} className="p-1 bg-white rounded-md shadow-sm hover:bg-slate-50 text-slate-400"><ChevronLeft className="w-3 h-3" /></button>
                  <div className="px-2 py-1 bg-white rounded-md shadow-sm cursor-grab active:cursor-grabbing"><GripVertical className="w-3 h-3 text-slate-300" /></div>
                  <button onClick={() => moveItem('detail_panel', 1)} className="p-1 bg-white rounded-md shadow-sm hover:bg-slate-50 text-slate-400"><ChevronRight className="w-3 h-3" /></button>
                </div>

                <MonitorDetailPanel
                  vehicle={selectedVehicle}
                  onClose={handleCloseDetail}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══════════════════ MOBILE LAYOUT (<lg) ═══════════════════ */}
        <div className="flex-1 flex flex-col lg:hidden overflow-hidden">
          {/* Mobile Content Area */}
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Map Tab */}
              {mobileTab === 'map' && (
                <motion.div
                  key="mobile-map"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-2xl overflow-hidden shadow-premium border border-white/70"
                >
                  <MonitorMap
                    vehicles={filteredVehicles}
                    focusedVehicle={focusedVehicle}
                    selectedVehicle={selectedVehicle}
                    onSingleClick={handleSingleClick}
                    onDoubleClick={handleDoubleClick}
                  />
                  <MapStatusFilter
                    activeStatuses={statusFilters}
                    onToggleStatus={handleToggleStatus}
                  />
                </motion.div>
              )}

              {/* Fleet Tab */}
              {mobileTab === 'fleet' && (
                <motion.div
                  key="mobile-fleet"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="absolute inset-0"
                >
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
                    isMobile={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Detail Drawer - Slides up from bottom over map */}
            <AnimatePresence>
              {selectedVehicle && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleCloseDetail}
                    className="absolute inset-0 bg-black/40 backdrop-blur-[4px] z-[1999] rounded-2xl"
                  />
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                    className="absolute inset-x-0 bottom-0 top-[40px] z-[2000] bg-soft-bg rounded-t-[2.5rem] shadow-2xl border-t border-white/50 overflow-hidden flex flex-col"
                  >
                    {/* Drawer Handle */}
                    <div className="flex justify-center pt-3 pb-1 shrink-0">
                      <div className="w-10 h-1 rounded-full bg-slate-200" />
                    </div>
                    <div className="px-5 pb-3 flex items-center justify-between shrink-0">
                      <h1 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Asset Intelligence</h1>
                      <button onClick={handleCloseDetail} className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <MonitorDetailDrawer
                        vehicle={selectedVehicle}
                        onClose={handleCloseDetail}
                      />
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Bottom Tab Bar */}
          <div className="shrink-0 pt-2 pb-[env(safe-area-inset-bottom,0.75rem)]">
            <div className="flex items-center bg-white/90 backdrop-blur-xl rounded-2xl shadow-premium border border-white/50 p-1.5 gap-1 mx-2">
              {[
                { id: 'map', label: 'Map', icon: MapPin },
                { id: 'fleet', label: 'Fleet', icon: List },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setMobileTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${
                    mobileTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Monitor

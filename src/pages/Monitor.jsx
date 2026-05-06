import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { Maximize2, Minimize2, GripVertical, ChevronLeft, ChevronRight, LayoutDashboard } from 'lucide-react'
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
  const [industryMode, setIndustryMode] = useState('General')
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false)

  const industries = [
    { id: 'General', label: 'General', types: [] },
    { id: 'Construction', label: 'Construction', types: ['Excavator', 'Lift', 'Crane'] },
    { id: 'Rental', label: 'Rental', types: ['Car', 'SUV'] },
    { id: 'Vans', label: 'Vans', types: ['Van', 'Delivery'] },
    { id: 'Transport', label: 'Transport', types: ['Truck', 'Trailer'] },
  ]

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
      setLiveVehicles(prev => prev.map(v => {
        if (v.status !== 'Moving') return v
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
    const currentIndustry = industries.find(i => i.id === industryMode)
    const matchIndustry = industryMode === 'General' || currentIndustry?.types?.includes(v.type)
    return matchSearch && matchGroup && matchStatus && matchIndustry
  }), [liveVehicles, searchQuery, activeGroupFilter, statusFilters, industryMode])

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

            {/* Compact Professional Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              {/* Left: Title & Pulse */}
              <div className="flex items-center gap-6">
                <div>
                  <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">Monitoring</h1>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset Intel</p>
                  </div>
                </div>

                <div className="h-6 w-px bg-slate-200" />

                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Integrity</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-slate-800 tracking-tight">98.4%</span>
                      <span className="text-[8px] font-black text-emerald-500 bg-emerald-50 px-1 rounded">OK</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Missions</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-slate-800 tracking-tight">24</span>
                      <span className="text-[8px] font-black text-blue-500 bg-blue-50 px-1 rounded">LIVE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Compact Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
                  className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-400 transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Operating Sector</p>
                    <p className="text-[11px] font-black text-slate-800 group-hover:text-blue-600 transition-colors">{industryMode}</p>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-300 transition-transform ${showIndustryDropdown ? 'rotate-90' : ''}`} />
                </button>

                <AnimatePresence>
                  {showIndustryDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowIndustryDropdown(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-[2rem] shadow-xl border border-slate-100 p-2 z-[1001] overflow-hidden"
                      >
                        <div className="px-4 py-2 border-b border-slate-50 mb-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sector Switcher</p>
                        </div>
                        {[
                          { id: 'General', label: 'General Fleet', desc: 'Unified category view.' },
                          { id: 'Construction', label: 'Construction', desc: 'Heavy equipment.' },
                          { id: 'Rental', label: 'Rental & Sales', desc: 'Light vehicles.' },
                          { id: 'Vans', label: 'Last-Mile Vans', desc: 'Delivery optimization.' },
                          { id: 'Transport', label: 'Heavy Transport', desc: 'Logistics tracking.' },
                        ].map(ind => (
                          <div
                            key={ind.id}
                            onClick={() => { setIndustryMode(ind.id); setShowIndustryDropdown(false); }}
                            className={`px-4 py-2.5 rounded-xl cursor-pointer transition-all mb-0.5 border ${industryMode === ind.id
                                ? 'bg-blue-50 border-blue-100'
                                : 'hover:bg-slate-50 border-transparent hover:border-slate-100'
                              }`}
                          >
                            <p className={`text-[11px] font-black ${industryMode === ind.id ? 'text-blue-700' : 'text-slate-800'}`}>{ind.label}</p>
                            <p className="text-[9px] font-bold text-slate-400 leading-tight mt-0.5">{ind.desc}</p>
                          </div>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <MonitorStatsBar stats={stats} showConfig={showStatsConfig} onToggleConfig={() => setShowStatsConfig(p => !p)} onToggleStat={toggleStat} />
          </motion.div>
        )}

        <div className="flex-1 flex gap-3 overflow-hidden relative">
          {/* Dashboard Components - Fixed in DOM, Ordered by CSS */}

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
      </main>
    </div>
  )
}

export default Monitor

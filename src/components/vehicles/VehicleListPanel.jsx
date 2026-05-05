import React, { useMemo, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Truck, Filter, Check, ChevronRight, MapPin, Activity, Gauge } from 'lucide-react'

const STATUS_CONFIG = {
  Moving:      { color: '#10B981', label: 'On Route', bg: 'bg-emerald-500' },
  Resting:     { color: '#F59E0B', label: 'Stopped', bg: 'bg-amber-400' },
  Idle:        { color: '#94A3B8', label: 'Standby', bg: 'bg-slate-300' },
  Maintenance: { color: '#EF4444', label: 'Service', bg: 'bg-red-500' },
}

const ROLES = [
  { id: 'Moving',      label: 'Moving',      color: '#10B981' },
  { id: 'Resting',     label: 'Resting',     color: '#F59E0B' },
  { id: 'Idle',        label: 'Idle',        color: '#94A3B8' },
  { id: 'Maintenance', label: 'Maintenance', color: '#EF4444' },
]

const VehicleRow = ({ vehicle, isSelected, onClick }) => {
  const status = STATUS_CONFIG[vehicle.status] || STATUS_CONFIG.Idle
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => onClick(vehicle)}
      className={`group relative flex flex-col gap-2 p-3 rounded-2xl cursor-pointer transition-all duration-300 mb-1 border ${
        isSelected  ? 'bg-blue-600 border-blue-500 shadow-premium text-white' : 'bg-white/40 border-white hover:bg-white/80 hover:shadow-premium'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Animated Status Portal */}
        <div className="relative shrink-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            isSelected ? 'bg-white/20' : 'bg-slate-50 group-hover:bg-blue-50'
          }`}>
            <Truck className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${isSelected ? 'border-blue-600' : 'border-white'} ${status.bg} shadow-sm`}>
            {vehicle.status === 'Moving' && (
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            )}
          </div>
        </div>

        {/* Primary Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className={`text-[13px] font-black truncate tracking-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>
              {vehicle.name}
            </h4>
            <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${
               isSelected ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-50 border-slate-100 text-slate-400'
            }`}>
              {vehicle.id}
            </span>
          </div>
          <p className={`text-[10px] font-bold mt-0.5 flex items-center gap-1.5 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
            <MapPin className="w-2.5 h-2.5" />
            <span className="truncate">{vehicle.driver?.name || 'Automated Unit'}</span>
          </p>
        </div>
      </div>

      {/* Mini Telemetry Strip */}
      <div className="flex items-center justify-between pt-2 border-t border-black/5 mt-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Activity className={`w-2.5 h-2.5 ${isSelected ? 'text-blue-200' : 'text-emerald-500'}`} />
            <span className={`text-[9px] font-black ${isSelected ? 'text-white' : 'text-slate-700'}`}>{vehicle.vitals?.fuel || 0}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className={`w-2.5 h-2.5 ${isSelected ? 'text-blue-200' : 'text-blue-500'}`} />
            <span className={`text-[9px] font-black ${isSelected ? 'text-white' : 'text-slate-700'}`}>{vehicle.speed || 0} <span className="text-[7px] opacity-60 uppercase">KMH</span></span>
          </div>
        </div>
        <div className={`px-1.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tighter ${
          isSelected ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400 border border-slate-100'
        }`}>
          {status.label}
        </div>
      </div>
    </motion.div>
  )
}

const VehicleListPanel = ({ vehicles, selectedVehicle, onVehicleSelect, searchQuery, onSearch }) => {
  const [activeStatuses, setActiveStatuses] = useState(['Moving', 'Resting', 'Idle', 'Maintenance'])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setIsFilterOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const movingCount = useMemo(() => vehicles.filter(v => v.status === 'Moving').length, [vehicles])

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return vehicles.filter(v => {
      const matchSearch = v.name.toLowerCase().includes(q) || 
                          v.id.toLowerCase().includes(q) || 
                          v.plate.toLowerCase().includes(q)
      const matchStatus = activeStatuses.includes(v.status)
      return matchSearch && matchStatus
    })
  }, [vehicles, searchQuery, activeStatuses])

  const toggleStatus = (statusId) => {
    if (statusId === 'ALL') setActiveStatuses(['Moving', 'Resting', 'Idle', 'Maintenance'])
    else if (statusId === 'NONE') setActiveStatuses([])
    else {
      setActiveStatuses(prev => prev.includes(statusId) ? prev.filter(s => s !== statusId) : [...prev, statusId])
    }
  }

  return (
    <div className="w-[300px] shrink-0 flex flex-col bg-white/40 backdrop-blur-2xl rounded-[2rem] shadow-premium border border-white overflow-hidden h-full">
      
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[15px] font-black text-slate-800 tracking-tight">Fleet Console</h2>
            <div className="flex items-center gap-1.5 mt-1">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{movingCount} Units Online</p>
            </div>
          </div>
          
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${
                isFilterOpen ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-white border-white text-slate-400 hover:text-slate-600'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-premium border border-slate-100 p-2 z-50"
                >
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 py-1 mb-1">Status Filter</p>
                  {ROLES.map(role => {
                    const isActive = activeStatuses.includes(role.id)
                    return (
                      <button 
                        key={role.id}
                        onClick={() => toggleStatus(role.id)}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-all group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: role.color }} />
                          <span className={`text-[11px] font-bold ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>{role.label}</span>
                        </div>
                        <div className={`w-4 h-4 rounded-lg border flex items-center justify-center transition-all ${isActive ? 'bg-blue-600 border-blue-600' : 'border-slate-200'}`}>
                          {isActive && <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />}
                        </div>
                      </button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-blue-600 transition-all" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search tactical assets..."
            className="w-full pl-9 pr-3 py-2.5 text-[11px] font-bold bg-white border border-white rounded-[1.1rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100/50 transition-all placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar no-scrollbar px-3 py-2 space-y-1">
        {filtered.length > 0 ? (
          filtered.map(v => (
            <VehicleRow
              key={v.id}
              vehicle={v}
              isSelected={selectedVehicle?.id === v.id}
              onClick={onVehicleSelect}
            />
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Assets Found</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/40 bg-white/40">
        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-center">Tactical Directory v2.5</p>
      </div>
    </div>
  )
}

export default VehicleListPanel

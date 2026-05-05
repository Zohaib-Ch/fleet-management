import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, ChevronDown, ChevronRight, Truck, Layers, List, 
  MapPin, Activity, Gauge, Battery, Info, X
} from 'lucide-react'

const STATUS_CONFIG = {
  Moving:      { color: '#10B981', label: 'On Route', bg: 'bg-emerald-500' },
  Resting:     { color: '#F59E0B', label: 'Stopped', bg: 'bg-amber-400' },
  Idle:        { color: '#94A3B8', label: 'Standby', bg: 'bg-slate-300' },
  Maintenance: { color: '#EF4444', label: 'Service', bg: 'bg-red-500' },
}

const DRIVER_STATUS_STYLE = {
  Driving: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  Loading: 'text-blue-600 bg-blue-50 border-blue-100',
  Break:   'text-amber-600 bg-amber-50 border-amber-100',
  Parked:  'text-slate-500 bg-slate-50 border-slate-100',
}

const VehicleRow = ({ vehicle, isFocused, isSelected, onSingleClick, onDoubleClick }) => {
  const status = STATUS_CONFIG[vehicle.status] || STATUS_CONFIG.Idle
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => onSingleClick(vehicle)}
      onDoubleClick={() => onDoubleClick(vehicle)}
      className={`group relative flex flex-col gap-2 p-3 rounded-2xl cursor-pointer transition-all duration-300 mb-2 border ${
        isSelected  ? 'bg-blue-600 border-blue-500 shadow-premium text-white' :
        isFocused   ? 'bg-white border-blue-200 shadow-premium' :
                      'bg-white/40 border-white hover:bg-white/80 hover:shadow-premium'
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

      {/* Mini Telemetry Layer */}
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

const GroupRow = ({ group, vehicles, isExpanded, onToggle, focusedVehicle, selectedVehicle, onSingleClick, onDoubleClick, isActive, onGroupFilter }) => {
  const groupVehicles = vehicles.filter(v => v.group === group.id)
  const movingCount = groupVehicles.filter(v => v.status === 'Moving').length

  return (
    <div className="mb-2">
      <motion.div
        whileHover={{ x: 4 }}
        onClick={() => { onToggle(group.id); onGroupFilter(isActive ? null : group.id) }}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer transition-all border ${
          isActive ? 'bg-white border-blue-200 shadow-premium' : 'bg-white/20 border-transparent hover:bg-white/40'
        }`}
      >
        <div className="w-9 h-9 rounded-2xl bg-white shadow-sm flex items-center justify-center text-base">
          {group.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-black text-slate-800 truncate tracking-tight">{group.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
             <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-bold text-slate-400">{movingCount} Moving</span>
             </div>
             <span className="text-[9px] text-slate-300">·</span>
             <span className="text-[9px] font-bold text-slate-400">{groupVehicles.length} Total</span>
          </div>
        </div>
        <div className={`w-5 h-5 rounded-xl flex items-center justify-center transition-transform ${isExpanded ? 'rotate-90 bg-blue-50 text-blue-600' : 'text-slate-300'}`}>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-1"
          >
            <div className="pl-3 border-l-2 border-slate-100 ml-4 py-1 space-y-1">
              {groupVehicles.map(v => (
                <VehicleRow
                  key={v.id}
                  vehicle={v}
                  isFocused={focusedVehicle?.id === v.id}
                  isSelected={selectedVehicle?.id === v.id}
                  onSingleClick={onSingleClick}
                  onDoubleClick={onDoubleClick}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const MonitorVehiclePanel = ({
  vehicles, allVehicles, groups,
  searchQuery, onSearch,
  viewMode, onViewMode,
  expandedGroups, onToggleGroup,
  activeGroupFilter, onGroupFilter,
  focusedVehicle, selectedVehicle,
  onSingleClick, onDoubleClick,
}) => {
  const movingCount = useMemo(() => allVehicles.filter(v => v.status === 'Moving').length, [allVehicles])

  return (
    <div className="w-[320px] h-full shrink-0 flex flex-col bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-premium border border-white/50 overflow-hidden">
      
      {/* Visual Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[17px] font-black text-slate-800 tracking-tight leading-none">Fleet Console</h2>
            <div className="flex items-center gap-2 mt-1.5">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{movingCount} Units Online</p>
            </div>
          </div>
          
          <div className="flex bg-white/80 p-1 rounded-xl shadow-sm border border-white">
            <button
              onClick={() => onViewMode('all')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewMode('groups')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'groups' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-blue-600 transition-all" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search tactical assets..."
            className="w-full pl-10 pr-4 py-2.5 text-[11px] font-bold bg-white border border-white rounded-[1.1rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* Active Filter Cluster */}
      <AnimatePresence>
        {activeGroupFilter && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 mb-4">
            <button
              onClick={() => onGroupFilter(null)}
              className="flex items-center gap-2 text-[9px] font-black text-blue-600 bg-blue-50/50 px-3 py-1.5 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all"
            >
              {groups.find(g => g.id === activeGroupFilter)?.name}
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Asset Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4">
        {viewMode === 'all' ? (
          vehicles.length > 0 ? (
            vehicles.map(v => (
              <VehicleRow
                key={v.id}
                vehicle={v}
                isFocused={focusedVehicle?.id === v.id}
                isSelected={selectedVehicle?.id === v.id}
                onSingleClick={onSingleClick}
                onDoubleClick={onDoubleClick}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
               <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <Info className="w-7 h-7 text-slate-200" />
               </div>
               <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">No Assets Found</p>
               <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Adjust your search parameters</p>
            </div>
          )
        ) : (
          groups.map(group => (
            <GroupRow
              key={group.id}
              group={group}
              vehicles={allVehicles}
              isExpanded={expandedGroups.has(group.id)}
              onToggle={onToggleGroup}
              focusedVehicle={focusedVehicle}
              selectedVehicle={selectedVehicle}
              onSingleClick={onSingleClick}
              onDoubleClick={onDoubleClick}
              isActive={activeGroupFilter === group.id}
              onGroupFilter={onGroupFilter}
            />
          ))
        )}
      </div>

      {/* Intelligence Footer */}
      <div className="px-6 py-3 bg-white/60 border-t border-white/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
           <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
           <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Audit v2.5</p>
        </div>
      </div>
    </div>
  )
}

export default MonitorVehiclePanel

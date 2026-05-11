import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, X, Check, Truck, ParkingSquare, UserCheck, Coffee,
  Wrench, AlertTriangle, TrendingUp, TrendingDown, ClipboardCheck, Calendar,
  Leaf, ChevronDown, Activity, Zap, ShieldCheck
} from 'lucide-react'

const ICON_MAP = {
  Truck, ParkingSquare, UserCheck, Coffee, Wrench,
  AlertTriangle, TrendingUp, ClipboardCheck, Calendar, Leaf,
  Activity, Zap, ShieldCheck
}

const StatCard = React.memo(({ stat }) => {
  const Icon = ICON_MAP[stat.icon] || Truck
  const isPrimary = stat.id === 'active' || stat.id === 'moving'

  return (
    <motion.div
      initial={{ opacity: 0, y: 5, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.02)] border border-slate-100 shrink-0 min-w-[170px] cursor-pointer group transition-all duration-300 hover:border-blue-200"
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 transition-all group-hover:bg-blue-50 duration-300 border border-slate-50">
          <Icon className="w-5 h-5" style={{ color: stat.color }} />
        </div>
        {isPrimary && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white"></span>
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <div className="text-[9px] text-slate-400 font-black uppercase tracking-wider truncate">{stat.label}</div>
          {stat.trend && (
            <div className={`flex items-center gap-0.5 text-[8px] font-black ${stat.trend.startsWith('-') ? 'text-red-500' : 'text-emerald-500'}`}>
              {stat.trend.replace('-', '')}
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <div className="text-lg font-black text-slate-800 leading-none tracking-tight">{stat.value}</div>
          {stat.unit && <span className="text-[9px] font-bold text-slate-400 uppercase">{stat.unit}</span>}
        </div>
        <div className="text-[8px] font-bold text-slate-400/80 leading-none mt-1 truncate">
          {stat.sub}
        </div>
      </div>
    </motion.div>
  )
})

// ── Mobile Compact KPI Design ────────────────────────────────────────────────
const MobileStatCard = React.memo(({ stat }) => {
  const Icon = ICON_MAP[stat.icon] || Truck
  const isPrimary = stat.id === 'active' || stat.id === 'moving'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-w-[100px] bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-3 shadow-sm relative group active:scale-95 transition-transform"
    >
      <div className="relative mb-2">
         <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-600">
            <Icon className="w-4 h-4" style={{ color: stat.color }} />
         </div>
         {isPrimary && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 border border-white"></span>
            </span>
         )}
      </div>
      <div className="text-center">
         <div className="text-[14px] font-black text-slate-800 leading-none mb-0.5">{stat.value}</div>
         <div className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter truncate max-w-[80px]">{stat.label}</div>
      </div>
      {stat.trend && (
         <div className={`absolute top-2 right-2 text-[7px] font-black px-1 rounded bg-white/80 ${stat.trend.startsWith('-') ? 'text-red-500' : 'text-emerald-500'}`}>
            {stat.trend}
         </div>
      )}
    </motion.div>
  )
})

const MonitorStatsBar = React.memo(({ stats, showConfig, onToggleConfig, onToggleStat }) => {
  const visible = useMemo(() => stats.filter(s => s.visible), [stats])

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
      {/* Configuration Toggle */}
      <button
        onClick={onToggleConfig}
        className="shrink-0 w-11 h-11 lg:w-12 lg:h-12 bg-white rounded-2xl lg:rounded-[1.5rem] flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-slate-100 shadow-sm relative"
      >
        <Settings className={`w-5 h-5 transition-transform duration-700 ${showConfig ? 'rotate-90 text-blue-600' : ''}`} />
        {showConfig && <div className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />}
      </button>

      {/* KPI Stream */}
      <div className="flex-1 flex items-center gap-2 lg:gap-3">
        <AnimatePresence mode="popLayout">
          {visible.map(stat => (
             <div key={stat.id}>
                {/* Desktop View */}
                <div className="hidden lg:block">
                   <StatCard stat={stat} />
                </div>
                {/* Mobile View */}
                <div className="block lg:hidden">
                   <MobileStatCard stat={stat} />
                </div>
             </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Visual Configuration Overlay */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-0 right-0 z-[100] h-full flex items-center gap-2 bg-white/90 backdrop-blur-md pl-4 pr-2 rounded-2xl border-l border-slate-100 shadow-premium"
          >
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-4">Configure Board</div>
            <div className="flex items-center gap-1.5">
              {stats.map(s => (
                <button
                  key={s.id}
                  onClick={() => onToggleStat(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-black transition-all border ${
                    s.visible
                      ? 'bg-blue-600 text-white border-blue-500 shadow-lg'
                      : 'bg-white text-slate-400 border-slate-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
              <button
                onClick={onToggleConfig}
                className="ml-2 w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

export default MonitorStatsBar

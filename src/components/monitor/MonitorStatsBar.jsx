import React from 'react'
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

const StatCard = ({ stat }) => {
  const Icon = ICON_MAP[stat.icon] || Truck
  const isPrimary = stat.id === 'active' || stat.id === 'moving'

  return (
    <motion.div
      layout
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
}

const MonitorStatsBar = ({ stats, showConfig, onToggleConfig, onToggleStat }) => {
  const visible = stats.filter(s => s.visible)

  return (
    <div className="relative flex items-center gap-4 py-1">
      {/* Cinematic Stats Container */}
      <div className="flex-1 flex items-center gap-3 overflow-x-auto no-scrollbar">
        <AnimatePresence mode="popLayout">
          {visible.map(stat => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </AnimatePresence>
      </div>

      {/* Luxury Config Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleConfig}
        className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${showConfig
          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
          : 'bg-white text-slate-400 border-slate-100 hover:border-blue-400 hover:text-blue-600'
          }`}
      >
        <Settings className={`w-4 h-4 ${showConfig ? 'animate-spin-slow' : ''}`} />
      </motion.button>

      {/* Premium Config Panel */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-[calc(100%+12px)] w-64 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden z-[5000] p-3"
          >
            <div className="px-3 py-3 border-b border-slate-50 flex items-center justify-between mb-2">
               <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">KPI Modules</h4>
               <button onClick={onToggleConfig} className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all border border-slate-100">
                  <X className="w-3.5 h-3.5" />
               </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              {stats.map(stat => {
                const Icon = ICON_MAP[stat.icon] || Truck
                return (
                  <button
                    key={stat.id}
                    onClick={() => onToggleStat(stat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group mb-1 border ${
                      stat.visible ? 'bg-blue-50 border-blue-100' : 'bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-100'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                      style={{ background: stat.visible ? 'white' : `${stat.color}12` }}>
                      <Icon className="w-4 h-4" style={{ color: stat.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] font-black truncate ${stat.visible ? 'text-blue-700' : 'text-slate-700'}`}>{stat.label}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border-2 transition-all ${stat.visible ? 'bg-blue-600 border-blue-600' : 'border-slate-200'
                      }`}>
                      {stat.visible && <Check className="w-2.5 h-2.5 text-white stroke-[4px]" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MonitorStatsBar

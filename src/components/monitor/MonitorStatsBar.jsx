import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, X, Check, Truck, ParkingSquare, UserCheck, Coffee,
  Wrench, AlertTriangle, TrendingUp, TrendingDown, ClipboardCheck, Calendar,
  Leaf, ChevronDown, Activity, Zap
} from 'lucide-react'

const ICON_MAP = {
  Truck, ParkingSquare, UserCheck, Coffee, Wrench,
  AlertTriangle, TrendingUp, ClipboardCheck, Calendar, Leaf,
  Activity, Zap
}

const StatCard = ({ stat }) => {
  const Icon = ICON_MAP[stat.icon] || Truck
  const isPrimary = stat.id === 'active' || stat.id === 'moving'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
      className="flex items-center gap-4 bg-white/60 backdrop-blur-xl rounded-[1.5rem] px-5 py-4 shadow-premium border border-white/50 shrink-0 min-w-[200px] cursor-pointer group transition-all duration-300"
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:rotate-12 duration-500"
          style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}20` }}>
          <Icon className="w-6 h-6" style={{ color: stat.color }} />
        </div>
        {isPrimary && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate">{stat.label}</div>
          {stat.trend && (
            <div className={`flex items-center gap-0.5 text-[9px] font-bold ${stat.trend.startsWith('-') ? 'text-red-500' : 'text-emerald-500'}`}>
              {stat.trend.startsWith('-') ? <TrendingDown className="w-2.5 h-2.5" /> : <TrendingUp className="w-2.5 h-2.5" />}
              {stat.trend.replace('-', '')}
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-1.5">
          <div className="text-2xl font-black text-slate-800 leading-none tracking-tight">{stat.value}</div>
          {stat.unit && <span className="text-[10px] font-bold text-slate-400 uppercase">{stat.unit}</span>}
        </div>
        <div className="text-[10px] font-bold text-slate-400/80 leading-none mt-1.5 truncate flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-slate-300" />
          {stat.sub}
        </div>
      </div>
    </motion.div>
  )
}

const MonitorStatsBar = ({ stats, showConfig, onToggleConfig, onToggleStat }) => {
  const visible = stats.filter(s => s.visible)

  return (
    <div className="relative flex items-center gap-4 py-2">
      {/* Cinematic Stats Container */}
      <div className="flex-1 flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
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
        className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${showConfig
          ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100'
          : 'bg-white/60 backdrop-blur-md text-slate-400 border-white/50 hover:text-blue-600 shadow-premium'
          }`}
      >
        <Settings className={`w-5 h-5 ${showConfig ? 'animate-spin-slow' : ''}`} />
      </motion.button>

      {/* Premium Config Panel */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-[calc(100%+12px)] w-72 bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] border border-white overflow-hidden z-[5000] p-4"
          >
            <div className="px-4 py-4 border-b border-slate-50 flex items-center justify-between mb-2">
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Display Center</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Configure Telemetry Modules</p>
              </div>
              <button onClick={onToggleConfig} className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
              {stats.map(stat => {
                const Icon = ICON_MAP[stat.icon] || Truck
                return (
                  <button
                    key={stat.id}
                    onClick={() => onToggleStat(stat.id)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-slate-50 transition-all text-left group mb-1 border border-transparent hover:border-slate-100"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                      style={{ background: `${stat.color}12` }}>
                      <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black text-slate-700 truncate">{stat.label}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{stat.sub}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center border-2 transition-all ${stat.visible ? 'bg-blue-600 border-blue-600 scale-110' : 'border-slate-200'
                      }`}>
                      {stat.visible && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
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

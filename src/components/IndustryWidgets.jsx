import React from 'react'
import { motion } from 'framer-motion'
import { Thermometer, Zap, Activity, Clock, ShieldCheck } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

export const ColdChainWidget = ({ drag }) => {
  const tempData = [
    { time: '08:00', temp: -18.2 },
    { time: '10:00', temp: -18.5 },
    { time: '12:00', temp: -17.8 },
    { time: '14:00', temp: -18.1 },
    { time: '16:00', temp: -18.4 },
    { time: '18:00', temp: -18.3 },
  ]

  return (
    <motion.div
      drag={drag}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.05, zIndex: 1000 }}
      className={`bg-white rounded-[2.5rem] shadow-premium border border-white p-6 overflow-hidden ${drag ? 'cursor-grab active:cursor-grabbing border-amber-200' : ''}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-xs font-bold text-tech-slate uppercase tracking-wider mb-1">Cold Chain Integrity</h4>
          <p className="text-[10px] text-slate-400 font-medium">Pharma Trailer #402</p>
        </div>
        <div className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold">Live</div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
          <Thermometer className="w-6 h-6" />
        </div>
        <div>
          <span className="text-2xl font-bold text-tech-slate">-18.3°C</span>
          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-0.5">Stable Range</p>
        </div>
      </div>

      <div className="h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={tempData}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="temp" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export const HeavyMachineryWidget = ({ drag }) => {
  return (
    <motion.div
      drag={drag}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.05, zIndex: 1000 }}
      className={`bg-tech-slate rounded-[2.5rem] shadow-premium p-6 text-white relative overflow-hidden group ${drag ? 'cursor-grab active:cursor-grabbing ring-4 ring-amber-400/20' : ''}`}
    >
      <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
        <Zap className="w-24 h-24" />
      </div>

      <div className="mb-6">
        <h4 className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em] mb-1">Heavy Machinery Load</h4>
        <p className="text-xs font-bold">CAT Excavator Zone B</p>
      </div>

      <div className="flex items-center gap-6 mb-6">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
            <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-amber-400" strokeDasharray="201" strokeDashoffset="40" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold">82%</span>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <p className="text-[9px] font-bold opacity-40 uppercase">Working Hours</p>
            <p className="text-sm font-bold">142.5h</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-amber-400 uppercase">Idle Hours</p>
            <p className="text-sm font-bold">28.4h</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-white/5">
        <Activity className="w-3 h-3 text-emerald-400" />
        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Hydraulics Optimal</span>
      </div>
    </motion.div>
  )
}

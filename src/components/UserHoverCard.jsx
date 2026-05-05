import React from 'react'
import { motion } from 'framer-motion'
import { Fuel, Signal, Battery, Thermometer, ChevronRight } from 'lucide-react'

const UserHoverCard = ({ vehicle, onDetailClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="glass-panel w-72 rounded-3xl overflow-hidden shadow-2xl p-5 pointer-events-auto"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-bold text-tech-slate">{vehicle.name}</h3>
          <p className="text-[10px] text-slate-500 font-medium">{vehicle.id} • {vehicle.model}</p>
        </div>
        <div className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          Live
        </div>
      </div>

      {/* Compliance Ring Placeholder */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="175.9" strokeDashoffset="50" className="text-tech-blue" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold leading-none">{vehicle.driver.drivingTime}</span>
            <span className="text-[8px] text-slate-400">driving</span>
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-400">Resting</span>
            <span className="font-bold">{vehicle.driver.restingTime}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-400">Next break</span>
            <span className="font-bold text-amber-500">{vehicle.driver.nextBreak}</span>
          </div>
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {[
          { icon: Fuel, label: 'Fuel', value: `${vehicle.vitals.fuel}%`, color: 'text-blue-500' },
          { icon: Signal, label: 'Signal', value: vehicle.vitals.satellite, color: 'text-purple-500' },
          { icon: Battery, label: 'Battery', value: `${vehicle.vitals.battery}%`, color: 'text-emerald-500' },
          { icon: Thermometer, label: 'Temp', value: `${vehicle.vitals.temp}°C`, color: 'text-orange-500' }
        ].map((v, i) => (
          <div key={i} className="bg-white/40 rounded-xl p-2 flex items-center gap-2 border border-white/50">
            <v.icon className={`w-3 h-3 ${v.color}`} />
            <div>
              <p className="text-[8px] text-slate-400 font-bold uppercase">{v.label}</p>
              <p className="text-[10px] font-bold">{v.value}</p>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => onDetailClick(vehicle.id)}
        className="w-full py-3 bg-tech-blue text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
      >
        View Full Details
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export default UserHoverCard

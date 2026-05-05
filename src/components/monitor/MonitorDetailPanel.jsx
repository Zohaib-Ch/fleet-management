import React, { useState, useEffect } from 'react'
import { motion, Reorder, AnimatePresence, useSpring, useTransform, animate } from 'framer-motion'
import {
  X, Truck, MapPin, AlertTriangle, Wrench, Calendar, MousePointer2,
  RefreshCw, GripVertical, ChevronRight, LayoutDashboard, Car,
  Activity, Bell, ClipboardCheck, ArrowRight, Fuel, Gauge,
  Timer, Zap, Thermometer, Droplets, Navigation, Clock, ShieldCheck
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import toast from 'react-hot-toast'

// ── Animated Number Counter ──────────────────────────────────────────────────
const Counter = ({ value, duration = 1.5, suffix = "", keyId }) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount(0) // Reset for re-animation
    const controls = animate(0, value, {
      duration,
      onUpdate: (latest) => setCount(Math.floor(latest))
    })
    return () => controls.stop()
  }, [value, keyId]) // Re-trigger on value or vehicle change
  return <span>{count}{suffix}</span>
}

// ── UI Helpers ───────────────────────────────────────────────────────────────
const LargeRing = ({ healthy, attention, critical, keyId }) => {
  const total = healthy + attention + critical
  const r = 32, circ = 2 * Math.PI * r
  const hPct = healthy / total, aPct = attention / total, cPct = critical / total
  return (
    <div className="flex items-center gap-5">
      <div className="relative flex items-center justify-center shrink-0">
        <svg width="84" height="84" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#F1F5F9" strokeWidth="8" />
          <motion.circle key={`h-${keyId}`} cx="50" cy="50" r={r} fill="none" stroke="#10B981" strokeWidth="8" initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - hPct) }} strokeDasharray={circ} transition={{ duration: 1.5, ease: 'backOut' }} transform="rotate(-90 50 50)" />
          <motion.circle key={`a-${keyId}`} cx="50" cy="50" r={r} fill="none" stroke="#F59E0B" strokeWidth="8" initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - aPct) }} strokeDasharray={circ} transition={{ duration: 1.5, delay: 0.2, ease: 'backOut' }} strokeDashoffset={-circ * hPct} transform="rotate(-90 50 50)" />
          <motion.circle key={`c-${keyId}`} cx="50" cy="50" r={r} fill="none" stroke="#EF4444" strokeWidth="8" initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - cPct) }} strokeDasharray={circ} transition={{ duration: 1.5, delay: 0.4, ease: 'backOut' }} strokeDashoffset={-circ * (hPct + aPct)} transform="rotate(-90 50 50)" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-lg font-black text-slate-800"><Counter value={total} keyId={keyId} /></p>
        </div>
      </div>
      <div className="space-y-1.5">
        {[{ label: 'Healthy', value: healthy, color: 'bg-emerald-500' }, { label: 'Attention', value: attention, color: 'bg-amber-500' }, { label: 'Critical', value: critical, color: 'bg-red-500' }].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide w-20">{item.label}</span>
            <span className="text-[11px] font-black text-slate-800"><Counter value={item.value} keyId={keyId} /></span>
          </div>
        ))}
      </div>
    </div>
  )
}

const ProgressBar = ({ label, value, color = "bg-blue-500", icon: Icon, keyId }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center px-1">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3 text-slate-400" />}
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-[10px] font-black text-slate-800"><Counter value={value} suffix="%" keyId={keyId} /></span>
    </div>
    <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-50">
      <motion.div key={keyId} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }} className={`h-full rounded-full ${color}`} />
    </div>
  </div>
)

const MonitorDetailPanel = ({ vehicle: v, onClose }) => {
  const [moduleOrder, setModuleOrder] = useState(['hero_card', 'stats_strip', 'telemetry_grid', 'fuel_utilization', 'recent_trips', 'mid_grid'])

  if (!v) return null

  // Advanced data mapping
  const fuelData = [
    { day: 'Mon', val: 92 }, { day: 'Tue', val: 85 }, { day: 'Wed', val: 70 },
    { day: 'Thu', val: 88 }, { day: 'Fri', val: 65 }, { day: 'Sat', val: 50 }, { day: 'Sun', val: 45 }
  ].map(d => ({ ...d, val: d.val + (Math.random() * 10 - 5) })) // Slight variation to force re-anim

  const tripData = [
    { id: 'T-102', from: 'København', to: 'Aarhus', time: '2h 15m', status: 'Completed', dist: '187km' },
    { id: 'T-101', from: 'Odense', to: 'København', time: '1h 45m', status: 'Completed', dist: '165km' }
  ]

  const renderModule = (id) => {
    switch (id) {
      case 'hero_card':
        return (
          <Reorder.Item key="hero_card" value="hero_card" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm relative group/hero mb-4">
            <GripVertical className="absolute top-4 right-4 w-3 h-3 text-slate-100 opacity-0 group-hover/hero:opacity-100 cursor-grab transition-opacity" />
            <div className="flex items-start gap-6">
              <motion.div key={v.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="w-32 h-24 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shrink-0 shadow-sm">
                <img src={v.photo || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=300"} alt="" className="w-full h-full object-cover" />
              </motion.div>
              <div className="flex-1 min-w-0 pt-1">
                <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none truncate">{v.name}</h2>
                <p className="text-sm font-bold text-slate-400 mt-1">{v.year} · {v.model}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                    <ShieldCheck className="w-3 h-3 text-blue-500" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Inspected</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Live</span>
                  </div>
                </div>
              </div>
            </div>
          </Reorder.Item>
        )
      case 'stats_strip':
        return (
          <Reorder.Item key="stats_strip" value="stats_strip" className="grid grid-cols-4 gap-3 mb-4">
            {[
              { l: 'Odometer', v: v.odometer || 0, s: 'km' },
              { l: 'Efficiency', v: 92, s: '%' },
              { l: 'Fuel Level', v: v.vitals?.fuel || 0, s: '%' },
              { l: 'Engine Load', v: v.vitals?.engineLoad || 0, s: '%' }
            ].map(s => (
              <div key={s.l} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col items-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.l}</p>
                <p className="text-lg font-black text-slate-800"><Counter value={s.v} suffix={s.s} keyId={v.id} /></p>
              </div>
            ))}
          </Reorder.Item>
        )
      case 'telemetry_grid':
        return (
          <Reorder.Item key="telemetry_grid" value="telemetry_grid" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mb-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <ProgressBar label="Engine Load" value={v.vitals?.engineLoad || 0} color="bg-emerald-500" icon={Zap} keyId={v.id} />
              <ProgressBar label="Fuel Level" value={v.vitals?.fuel || 0} color="bg-blue-500" icon={Fuel} keyId={v.id} />
              <ProgressBar label="Battery Life" value={v.vitals?.battery || 0} color="bg-indigo-500" icon={RefreshCw} keyId={v.id} />
              <ProgressBar label="System Temp" value={v.vitals?.temp || 0} color="bg-amber-500" icon={Thermometer} keyId={v.id} />
            </div>
          </Reorder.Item>
        )
      case 'fuel_utilization':
        return (
          <Reorder.Item key="fuel_utilization" value="fuel_utilization" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mb-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekly Utilization</p>
              <Fuel className="w-4 h-4 text-blue-500" />
            </div>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart key={v.id} data={fuelData}>
                  <Bar dataKey="val" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1500} animationBegin={200}>
                    {fuelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.val > 80 ? '#10B981' : entry.val > 60 ? '#6366F1' : '#F59E0B'} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Reorder.Item>
        )
      case 'recent_trips':
        return (
          <Reorder.Item key="recent_trips" value="recent_trips" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Recent Trips</p>
            <div className="space-y-4">
              {tripData.map((trip, i) => (
                <motion.div key={`${v.id}-${i}`} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4 group/trip">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/trip:bg-blue-50 group-hover/trip:text-blue-500 transition-all">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-black text-slate-800">{trip.from} → {trip.to}</p>
                      <span className="text-[9px] font-black text-emerald-500 uppercase">{trip.dist}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{trip.id} · {trip.time} · {trip.status}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Reorder.Item>
        )
      case 'mid_grid':
        return (
          <Reorder.Item key="mid_grid" value="mid_grid" className="grid grid-cols-3 gap-4 mb-4">
            <motion.div key={`serv-${v.id}`} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="col-span-1 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col justify-center text-center">
              <Clock className="w-5 h-5 text-indigo-500 mx-auto mb-2" />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Service Due</p>
              <p className="text-lg font-black text-slate-800">12d</p>
            </motion.div>
            <div className="col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Flådesundhed</p>
              <LargeRing healthy={96} attention={24} critical={8} keyId={v.id} />
            </div>
          </Reorder.Item>
        )
      default: return null
    }
  }

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 480, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="shrink-0 flex flex-col bg-soft-bg rounded-[2.5rem] shadow-premium border-l border-white/50 overflow-hidden h-full max-h-screen relative z-10"
    >
      <div className="px-8 pt-8 pb-4 flex items-center justify-between shrink-0">
        <h1 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Driftsoversigt</h1>
        <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-all duration-300">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-8">
        <Reorder.Group axis="y" values={moduleOrder} onReorder={setModuleOrder} className="space-y-0">
          {moduleOrder.map(id => renderModule(id))}
        </Reorder.Group>
      </div>
    </motion.div>
  )
}

export default MonitorDetailPanel

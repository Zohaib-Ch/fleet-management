import React, { useState, useEffect } from 'react'
import { motion, Reorder, AnimatePresence, useSpring, useTransform, animate } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  X, Truck, MapPin, AlertTriangle, Wrench, Calendar, MousePointer2,
  RefreshCw, GripVertical, ChevronRight, LayoutDashboard, Car,
  Activity, Bell, ClipboardCheck, ArrowRight, Fuel, Gauge,
  Timer, Zap, Thermometer, Droplets, Navigation, Clock, ShieldCheck
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts'
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

const MonitorDetailPanel = ({ vehicle: v, onClose, dragControls, isMobile }) => {
  const navigate = useNavigate()
  const [moduleOrder, setModuleOrder] = useState(['driver_profile', 'hero_card', 'stats_strip', 'telemetry_grid', 'fiscal_performance', 'expense_distribution', 'quarterly_utilization', 'fuel_utilization', 'recent_trips', 'mid_grid'])

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

  const fiscalData = [
    { m: 'Jan', current: 14000, prev: 12000 }, { m: 'Feb', current: 12000, prev: 11000 },
    { m: 'Mar', current: 8500, prev: 7000 }, { m: 'Apr', current: 13500, prev: 13000 },
    { m: 'May', current: 10500, prev: 14000 }, { m: 'Jun', current: 10500, prev: 11000 },
    { m: 'Jul', current: 11500, prev: 12000 }, { m: 'Aug', current: 12000, prev: 9000 },
    { m: 'Sep', current: 11500, prev: 12500 }, { m: 'Oct', current: 11800, prev: 12000 },
    { m: 'Nov', current: 11000, prev: 12200 }, { m: 'Dec', current: 14500, prev: 13500 },
  ]

  const expenseCategories = [
    { name: 'Fuel', value: 62, color: '#0EA5E9' },
    { name: 'Maintenance', value: 21, color: '#10B981' },
    { name: 'Insurance', value: 7, color: '#F59E0B' },
    { name: 'Parts', value: 6, color: '#6366F1' },
    { name: 'Others', value: 4, color: '#94A3B8' },
  ]

  const quarterlyUtilization = [
    { q: 'Q1', drive: 6000, idle: 2000, park: 1500 },
    { q: 'Q2', drive: 7500, idle: 1500, park: 1000 },
    { q: 'Q3', drive: 4000, idle: 2500, park: 2000 },
    { q: 'Q4', drive: 9000, idle: 1000, park: 500 },
  ]

  const renderModule = (id) => {
    switch (id) {
      case 'driver_profile':
        return (
          <Reorder.Item key="driver_profile" value="driver_profile" className="mb-4">
            <motion.div
              onClick={() => navigate(`/profile/${v.driver.id}`)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex items-center gap-4 cursor-pointer hover:border-blue-200 transition-all group/driver"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                  <img src={v.driver?.photo} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Assigned Driver</p>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover/driver:text-blue-500 transform group-hover/driver:translate-x-1 transition-all" />
                </div>
                <h3 className="text-base font-black text-slate-800 mt-1 leading-none">{v.driver?.name}</h3>
                <p className="text-[11px] font-bold text-slate-400 mt-1">{v.driver?.role || 'Senior Driver'}</p>
              </div>
            </motion.div>
          </Reorder.Item>
        )
      case 'hero_card':
        return (
          <Reorder.Item key="hero_card" value="hero_card" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm relative group/hero mb-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
            <GripVertical className="absolute top-4 right-4 w-3 h-3 text-slate-100 opacity-0 group-hover/hero:opacity-100 cursor-grab active:cursor-grabbing transition-opacity" />
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
          <Reorder.Item key="stats_strip" value="stats_strip" className="grid grid-cols-4 gap-3 mb-4 cursor-grab active:cursor-grabbing">
            {[
              { l: 'Odometer', v: v.odometer || 0, s: 'km' },
              { l: 'Efficiency', v: 92, s: '%' },
              { l: 'Fuel Level', v: v.vitals?.fuel || 0, s: '%' },
              { l: 'Engine Load', v: v.vitals?.engineLoad || 0, s: '%' }
            ].map(s => (
              <div key={s.l} className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center min-h-[70px]">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-tight mb-1.5 whitespace-nowrap">{s.l}</p>
                <p className="text-lg font-black text-slate-800"><Counter value={s.v} suffix={s.s} keyId={v.id} /></p>
              </div>
            ))}
          </Reorder.Item>
        )
      case 'telemetry_grid':
        return (
          <Reorder.Item key="telemetry_grid" value="telemetry_grid" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mb-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
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
          <Reorder.Item key="fuel_utilization" value="fuel_utilization" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mb-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
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
          <Reorder.Item key="recent_trips" value="recent_trips" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mb-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
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
      case 'fiscal_performance':
        return (
          <Reorder.Item key="fiscal_performance" value="fiscal_performance" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mb-4 overflow-hidden cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fiscal Performance</p>
                <p className="text-xs font-bold text-slate-400 italic">Maintenance vs Fuel Costs (12mo)</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[9px] font-black text-slate-500 uppercase">2024</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                  <span className="text-[9px] font-black text-slate-500 uppercase">2023</span>
                </div>
              </div>
            </div>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fiscalData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94A3B8' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                    itemStyle={{ fontSize: '10px', fontWeight: 900 }}
                  />
                  <Bar dataKey="prev" fill="#E2E8F0" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="current" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Reorder.Item>
        )
      case 'expense_distribution':
        return (
          <Reorder.Item key="expense_distribution" value="expense_distribution" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mb-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Expense Allocation</p>
            <div className="flex items-center gap-4">
              <div className="w-44 h-44 shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {expenseCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-xl font-black text-slate-800 leading-none">62%</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-1">Fuel</p>
                </div>
              </div>
              <div className="flex-1 space-y-3.5">
                {expenseCategories.map(cat => (
                  <div key={cat.name} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide group-hover:text-slate-800 transition-colors">{cat.name}</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-800">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Reorder.Item>
        )
      case 'quarterly_utilization':
        return (
          <Reorder.Item key="quarterly_utilization" value="quarterly_utilization" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mb-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Quarterly Operational Hours</p>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={quarterlyUtilization}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="q" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748B' }} />
                  <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Bar dataKey="drive" stackId="a" fill="#0369A1" radius={[0, 0, 0, 0]} barSize={20} />
                  <Bar dataKey="idle" stackId="a" fill="#0EA5E9" />
                  <Bar dataKey="park" stackId="a" fill="#7DD3FC" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex gap-6 justify-center">
              {[{ l: 'Driving', c: '#0369A1' }, { l: 'Idle', c: '#0EA5E9' }, { l: 'Parked', c: '#7DD3FC' }].map(i => (
                <div key={i.l} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: i.c }} />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{i.l}</span>
                </div>
              ))}
            </div>
          </Reorder.Item>
        )
      case 'mid_grid':
        return (
          <Reorder.Item key="mid_grid" value="mid_grid" className="grid grid-cols-3 gap-4 mb-4 cursor-grab active:cursor-grabbing">
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
      initial={isMobile ? { opacity: 0 } : { width: 0, opacity: 0 }}
      animate={isMobile ? { opacity: 1 } : { width: 480, opacity: 1 }}
      exit={isMobile ? { opacity: 0 } : { width: 0, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`${isMobile ? 'w-full' : 'shrink-0'} flex flex-col bg-soft-bg rounded-[2rem] lg:rounded-[2.5rem] shadow-premium border-l border-white/50 overflow-hidden h-full max-h-screen relative z-10`}
    >
      <div className={`${isMobile ? 'px-5 pt-5' : 'px-8 pt-8'} pb-4 flex items-center justify-between shrink-0 relative group/detail`}>
        {/* Dashboard Drag Handle */}
        {!isMobile && (
          <div
            onPointerDown={(e) => dragControls?.start(e)}
            className="absolute top-3 left-1/2 -translate-x-1/2 z-50 p-1 opacity-0 group-hover/detail:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4 text-slate-300" />
          </div>
        )}

        <h1 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Driftsoversigt</h1>
        <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-all duration-300">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className={`flex-1 overflow-y-auto custom-scrollbar ${isMobile ? 'px-5 pb-5' : 'px-8 pb-8'}`}>
        <Reorder.Group axis="y" values={moduleOrder} onReorder={setModuleOrder} className="space-y-0">
          {moduleOrder.map(id => renderModule(id))}
        </Reorder.Group>
      </div>
    </motion.div>
  )
}

export default MonitorDetailPanel

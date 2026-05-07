import React, { useState, useEffect } from 'react'
import { motion, Reorder, AnimatePresence, useSpring, useTransform, animate } from 'framer-motion'
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
   const r = 28, circ = 2 * Math.PI * r
   const hPct = healthy / total, aPct = attention / total, cPct = critical / total
   return (
      <div className="flex items-center gap-3">
         <div className="relative flex items-center justify-center shrink-0">
            <svg width="64" height="64" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r={r} fill="none" stroke="#F1F5F9" strokeWidth="9" />
               <motion.circle key={`h-${keyId}`} cx="50" cy="50" r={r} fill="none" stroke="#10B981" strokeWidth="9" initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - hPct) }} strokeDasharray={circ} transition={{ duration: 1.5, ease: 'backOut' }} transform="rotate(-90 50 50)" />
               <motion.circle key={`a-${keyId}`} cx="50" cy="50" r={r} fill="none" stroke="#F59E0B" strokeWidth="9" initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - aPct) }} strokeDasharray={circ} transition={{ duration: 1.5, delay: 0.2, ease: 'backOut' }} strokeDashoffset={-circ * hPct} transform="rotate(-90 50 50)" />
               <motion.circle key={`c-${keyId}`} cx="50" cy="50" r={r} fill="none" stroke="#EF4444" strokeWidth="9" initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - cPct) }} strokeDasharray={circ} transition={{ duration: 1.5, delay: 0.4, ease: 'backOut' }} strokeDashoffset={-circ * (hPct + aPct)} transform="rotate(-90 50 50)" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
               <p className="text-base font-black text-slate-800"><Counter value={total} keyId={keyId} /></p>
            </div>
         </div>
         <div className="space-y-1">
            {[{ label: 'Healthy', value: healthy, color: 'bg-emerald-500' }, { label: 'Attention', value: attention, color: 'bg-amber-500' }, { label: 'Critical', value: critical, color: 'bg-red-500' }].map(item => (
               <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide w-16">{item.label}</span>
                  <span className="text-[10px] font-black text-slate-800"><Counter value={item.value} keyId={keyId} /></span>
               </div>
            ))}
         </div>
      </div>
   )
}

const ProgressBar = ({ label, value, color = "bg-blue-500", icon: Icon, keyId }) => (
   <div className="space-y-1">
      <div className="flex justify-between items-center px-0.5">
         <div className="flex items-center gap-1">
            {Icon && <Icon className="w-3 h-3 text-slate-400" />}
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
         </div>
         <span className="text-[9px] font-black text-slate-800"><Counter value={value} suffix="%" keyId={keyId} /></span>
      </div>
      <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-50">
         <motion.div key={keyId} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }} className={`h-full rounded-full ${color}`} />
      </div>
   </div>
)

const MonitorDetailDrawer = ({ vehicle: v, onClose }) => {
   if (!v) return null;

   const [moduleOrder, setModuleOrder] = useState(['hero_card', 'stats_strip', 'telemetry_grid', 'fiscal_performance', 'expense_distribution', 'quarterly_utilization', 'fuel_utilization', 'recent_trips', 'mid_grid'])

   // Advanced data mapping
   const fuelData = [
      { day: 'Mon', val: 92 }, { day: 'Tue', val: 85 }, { day: 'Wed', val: 70 },
      { day: 'Thu', val: 88 }, { day: 'Fri', val: 65 }, { day: 'Sat', val: 50 }, { day: 'Sun', val: 45 }
   ].map(d => ({ ...d, val: d.val + (Math.random() * 10 - 5) }))

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
         case 'hero_card':
            return (
               <Reorder.Item key="hero_card" value="hero_card" className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative group/hero mb-3">
                  <div className="flex items-center gap-3">
                     <motion.div key={v.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shrink-0 shadow-sm">
                        <img src={v.photo || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=300"} alt="" className="w-full h-full object-cover" />
                     </motion.div>
                     <div className="flex-1 min-w-0">
                        <h2 className="text-base font-black text-slate-800 tracking-tight leading-none truncate">{v.name}</h2>
                        <p className="text-[11px] font-bold text-slate-400 mt-0.5 truncate">{v.year} {v.make} {v.model}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                           <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-50 rounded-md border border-slate-100">
                              <ShieldCheck className="w-2.5 h-2.5 text-blue-500" />
                              <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Inspected</span>
                           </div>
                           <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 rounded-md border border-emerald-100">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Live</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </Reorder.Item>
            )
         case 'stats_strip':
            return (
               <Reorder.Item key="stats_strip" value="stats_strip" className="grid grid-cols-2 gap-2 mb-3">
                  {[
                     { l: 'Odometer', v: v.odometer || 0, s: 'km' },
                     { l: 'Efficiency', v: 92, s: '%' },
                     { l: 'Fuel Level', v: v.vitals?.fuel || 0, s: '%' },
                     { l: 'Engine Load', v: v.vitals?.engineLoad || 0, s: '%' }
                  ].map(s => (
                     <div key={s.l} className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-tight truncate">{s.l}</p>
                           <p className="text-lg font-black text-slate-800 leading-tight"><Counter value={s.v} suffix={s.s} keyId={v.id} /></p>
                        </div>
                     </div>
                  ))}
               </Reorder.Item>
            )
         case 'telemetry_grid':
            return (
               <Reorder.Item key="telemetry_grid" value="telemetry_grid" className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm mb-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">System Telemetry</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                     <ProgressBar label="Engine" value={88} color="bg-emerald-500" icon={Zap} keyId={v.id} />
                     <ProgressBar label="Tires" value={95} color="bg-blue-500" icon={Droplets} keyId={v.id} />
                     <ProgressBar label="Battery" value={76} color="bg-indigo-500" icon={RefreshCw} keyId={v.id} />
                     <ProgressBar label="Coolant" value={42} color="bg-amber-500" icon={Thermometer} keyId={v.id} />
                  </div>
               </Reorder.Item>
            )
         case 'fuel_utilization':
            return (
               <Reorder.Item key="fuel_utilization" value="fuel_utilization" className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm mb-3">
                  <div className="flex items-center justify-between mb-2">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Weekly Utilization</p>
                     <Fuel className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div className="h-20 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart key={v.id} data={fuelData}>
                           <Bar dataKey="val" radius={[3, 3, 0, 0]} isAnimationActive={true} animationDuration={1500} animationBegin={200}>
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
               <Reorder.Item key="recent_trips" value="recent_trips" className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm mb-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Recent Trips</p>
                  <div className="space-y-2.5">
                     {tripData.map((trip, i) => (
                        <motion.div key={`${v.id}-${i}`} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 group/trip">
                           <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                              <Navigation className="w-4 h-4" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                 <p className="text-[11px] font-black text-slate-800 truncate">{trip.from} → {trip.to}</p>
                                 <span className="text-[8px] font-black text-emerald-500 uppercase shrink-0">{trip.dist}</span>
                              </div>
                              <p className="text-[9px] font-bold text-slate-400 mt-0.5 truncate">{trip.id} · {trip.time} · {trip.status}</p>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </Reorder.Item>
            )
         case 'fiscal_performance':
            return (
               <Reorder.Item key="fiscal_performance" value="fiscal_performance" className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm mb-3 overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                     <div className="min-w-0">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fiscal Performance</p>
                        <p className="text-[9px] font-bold text-slate-300 italic mt-0.5">Maintenance vs Fuel (12mo)</p>
                     </div>
                     <div className="flex gap-3 shrink-0">
                        <div className="flex items-center gap-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                           <span className="text-[8px] font-black text-slate-400 uppercase">2024</span>
                        </div>
                        <div className="flex items-center gap-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                           <span className="text-[8px] font-black text-slate-400 uppercase">2023</span>
                        </div>
                     </div>
                  </div>
                  <div className="h-28 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={fiscalData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                           <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 700, fill: '#94A3B8' }} />
                           <Tooltip
                              contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: '10px' }}
                              itemStyle={{ fontSize: '9px', fontWeight: 900 }}
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
               <Reorder.Item key="expense_distribution" value="expense_distribution" className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm mb-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Expense Allocation</p>
                  <div className="flex items-center gap-3">
                     <div className="w-28 h-28 shrink-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie
                                 data={expenseCategories}
                                 cx="50%"
                                 cy="50%"
                                 innerRadius={30}
                                 outerRadius={48}
                                 paddingAngle={4}
                                 dataKey="value"
                                 stroke="none"
                              >
                                 {expenseCategories.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                 ))}
                              </Pie>
                              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', fontSize: '10px' }} />
                           </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                           <p className="text-lg font-black text-slate-800 leading-none">62%</p>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">Fuel</p>
                        </div>
                     </div>
                     <div className="flex-1 space-y-2.5 min-w-0">
                        {expenseCategories.map(cat => (
                           <div key={cat.name} className="flex items-center justify-between">
                              <div className="flex items-center gap-2 min-w-0">
                                 <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                                 <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide truncate">{cat.name}</span>
                              </div>
                              <span className="text-[10px] font-black text-slate-800 shrink-0 ml-2">{cat.value}%</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </Reorder.Item>
            )
         case 'quarterly_utilization':
            return (
               <Reorder.Item key="quarterly_utilization" value="quarterly_utilization" className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm mb-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Quarterly Hours</p>
                  <div className="h-28 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={quarterlyUtilization}>
                           <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                           <XAxis type="number" hide />
                           <YAxis dataKey="q" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#64748B' }} width={24} />
                           <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '10px', border: 'none', fontSize: '10px' }} />
                           <Bar dataKey="drive" stackId="a" fill="#0369A1" radius={[0, 0, 0, 0]} barSize={16} />
                           <Bar dataKey="idle" stackId="a" fill="#0EA5E9" />
                           <Bar dataKey="park" stackId="a" fill="#7DD3FC" radius={[0, 4, 4, 0]} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
                  <div className="mt-3 flex gap-4 justify-center">
                     {[{ l: 'Drive', c: '#0369A1' }, { l: 'Idle', c: '#0EA5E9' }, { l: 'Park', c: '#7DD3FC' }].map(i => (
                        <div key={i.l} className="flex items-center gap-1">
                           <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i.c }} />
                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{i.l}</span>
                        </div>
                     ))}
                  </div>
               </Reorder.Item>
            )
         case 'mid_grid':
            return (
               <Reorder.Item key="mid_grid" value="mid_grid" className="flex gap-2 mb-3">
                  <motion.div key={`serv-${v.id}`} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="w-24 shrink-0 bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center text-center">
                     <Clock className="w-4 h-4 text-indigo-500 mb-1" />
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Service</p>
                     <p className="text-base font-black text-slate-800">12d</p>
                  </motion.div>
                  <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex flex-col justify-center min-w-0">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Fleet Health</p>
                     <LargeRing healthy={96} attention={24} critical={8} keyId={v.id} />
                  </div>
               </Reorder.Item>
            )
         default: return null
      }
   }

   return (
      <div className="px-4 pb-4">
         <Reorder.Group axis="y" values={moduleOrder} onReorder={setModuleOrder} className="space-y-0">
            {moduleOrder.map(id => renderModule(id))}
         </Reorder.Group>
      </div>
   )
}

export default MonitorDetailDrawer

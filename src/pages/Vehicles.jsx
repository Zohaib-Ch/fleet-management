import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, MapPin, Activity, Truck, Fuel, Gauge, 
  Thermometer, ShieldCheck, Wrench, Zap, Bell, 
  TrendingUp, Clock, AlertTriangle, Send, Lock, 
  Flag, Navigation, Plus, UserPlus, X, ChevronRight, 
  Search, Shield, Battery, MoreVertical
} from 'lucide-react'
import { mockVehicles } from '../mockData'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import VehicleListPanel from '../components/vehicles/VehicleListPanel'
import AddVehicleModal from '../components/AddVehicleModal'
import toast from 'react-hot-toast'

// ── Animation presets ─────────────────────────────────────────────────────────
const fadeUp = (d = 0) => ({ 
  initial: { opacity: 0, y: 18 }, 
  animate: { opacity: 1, y: 0 }, 
  transition: { duration: 0.4, delay: d, ease: [0.22, 1, 0.36, 1] } 
})

// ── SVG Ring Component ────────────────────────────────────────────────────────
const Ring = ({ value, max = 100, size = 72, color = '#10B981', label }) => {
  const r = 28, circ = 2 * Math.PI * r, pct = Math.min(value / max, 1)
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#F1F5F9" strokeWidth="5" />
        <motion.circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circ} transform="rotate(-90 32 32)"
          initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }} />
        <text x="32" y="36" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1e293b">{value}%</text>
      </svg>
      {label && <p className="text-[9px] text-slate-400 uppercase tracking-wide font-bold mt-1">{label}</p>}
    </div>
  )
}

const Bar = ({ pct, color, delay = 0.4 }) => (
  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
    <motion.div className="h-full rounded-full" style={{ background: color }}
      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }} />
  </div>
)

const SectionLabel = ({ children }) => <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{children}</p>

const VehiclesPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  const queryParams = new URLSearchParams(location.search)
  const queryId = queryParams.get('id')
  
  const [selectedVehicle, setSelectedVehicle] = useState(() => {
    return mockVehicles.find(v => v.id === queryId) || mockVehicles[0]
  })

  useEffect(() => {
    if (queryId) {
      const v = mockVehicles.find(x => x.id === queryId)
      if (v) setSelectedVehicle(v)
    }
  }, [queryId])

  const handleVehicleSelect = (v) => {
    setSelectedVehicle(v)
    navigate(`/vehicles?id=${v.id}`, { replace: true })
  }

  const v = selectedVehicle
  const fuel = v.vitals?.fuel ?? 0
  const fuelColor = fuel < 20 ? '#EF4444' : fuel < 50 ? '#F59E0B' : '#10B981'
  const battery = v.vitals?.battery ?? 0
  const batteryColor = battery < 30 ? '#EF4444' : '#10B981'

  return (
    <div className="flex h-screen w-screen bg-[#F0F4F8] overflow-hidden">
      <Sidebar activeTab="Vehicles" setActiveTab={() => {}} />
      
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 p-3 gap-2">
        <TopBar />
        
        {/* Asset Stats Bar */}
        <div className="flex gap-3 mb-1 shrink-0">
          <div className="bg-white rounded-2xl p-4 flex-1 border border-slate-100 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
               <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Fleet Inventory</p>
              <p className="text-xl font-black text-slate-800 leading-none">{mockVehicles.length} <span className="text-xs text-slate-400 font-bold ml-1">Active Assets</span></p>
            </div>
            <div className="ml-auto flex gap-4 pr-4">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Operational</p>
                <p className="text-sm font-black text-emerald-600 leading-none">92.4%</p>
              </div>
              <div className="text-right border-l pl-4 border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Alerts</p>
                <p className="text-sm font-black text-red-500 leading-none">4 Critical</p>
              </div>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="h-10 px-4 bg-tech-blue text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Asset
            </button>
          </div>
        </div>

        <div className="flex-1 flex gap-3 overflow-hidden min-h-0">
          
          {/* Left Panel: Vehicle List */}
          <VehicleListPanel 
            vehicles={mockVehicles}
            selectedVehicle={v}
            onVehicleSelect={handleVehicleSelect}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
          />

          {/* Right Panel: Detailed Asset Information */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            <AnimatePresence mode="wait">
              <motion.div 
                key={v.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="pb-8"
              >
                
                {/* HERO HEADER */}
                <div className="relative rounded-[2rem] overflow-hidden mb-5 shadow-sm"
                  style={{ background: 'linear-gradient(135deg,#1e3a8a 0%,#2563eb 55%,#3b82f6 100%)' }}>
                  <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-10 bg-white" />
                  <div className="absolute left-1/4 -bottom-10 w-40 h-40 rounded-full opacity-5 bg-white" />
                  
                  <div className="px-8 py-7 flex items-start gap-6">
                    <div className="w-24 h-20 rounded-[1.5rem] overflow-hidden border-4 border-white/25 shadow-2xl shrink-0 relative bg-slate-800">
                      <img src={v.photo || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=300"} alt="" className="w-full h-full object-cover" />
                      <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-4 border-[#2563eb] ${v.status === 'Moving' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-black text-white tracking-tight">{v.name}</h2>
                        <span className="text-blue-100/60 text-sm font-mono">{v.id}</span>
                      </div>
                      <p className="text-blue-100 text-sm font-bold uppercase tracking-wider">{v.plate} &nbsp;·&nbsp; {v.zone}</p>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-blue-50">
                          <MapPin className="w-3.5 h-3.5 opacity-70" />
                          <span className="text-xs font-medium">Regional Center A-4</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-blue-50">
                          <Activity className="w-3.5 h-3.5 opacity-70" />
                          <span className="text-xs font-medium">{v.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => toast.success('Diagnostics triggerred')} 
                        className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-all">
                        <Wrench className="w-3.5 h-3.5" />Service
                      </button>
                      <button onClick={() => toast.success('Remote command sent')} 
                        className="px-4 py-2.5 bg-white rounded-xl text-xs font-bold text-blue-700 flex items-center gap-2 hover:bg-blue-50 transition-all shadow-lg">
                        <Navigation className="w-3.5 h-3.5" />Route
                      </button>
                    </div>
                  </div>
                </div>

                {/* QUICK STATS STRIP */}
                <div className="grid grid-cols-5 gap-3 mb-5">
                  {[
                    { label: 'Current Speed', value: `${v.speed ?? 0} kmh`, color: '#3B82F6' },
                    { label: 'Fuel Level', value: `${v.vitals?.fuel ?? 0}%`, color: fuelColor },
                    { label: 'System Temp', value: `${v.vitals?.temp ?? 42}°C`, color: '#F59E0B' },
                    { label: 'Mileage', value: `${(v.vitals?.mileage / 1000).toFixed(1)}k`, color: '#8B5CF6' },
                    { label: 'Battery', value: `${v.vitals?.battery ?? 0}%`, color: batteryColor },
                  ].map((s, i) => (
                    <motion.div key={i} {...fadeUp(i * 0.05)} className="bg-white rounded-2xl p-4 text-center border border-slate-100 shadow-sm">
                      <p className="text-lg font-black leading-none" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-wide mt-1.5 font-bold">{s.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* MAIN BODY GRID */}
                <div className="grid grid-cols-12 gap-5">
                  {/* Health & Actions */}
                  <div className="col-span-4 space-y-5">
                    <motion.div {...fadeUp(0.12)} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col items-center">
                      <SectionLabel>Asset Health Assessment</SectionLabel>
                      <div className="flex gap-8 mb-6 mt-2">
                        <Ring value={v.vitals?.fuel ?? 0} max={100} color={fuelColor} label="Fuel" />
                        <Ring value={v.vitals?.battery ?? 0} max={100} color={batteryColor} label="Battery" />
                      </div>
                      <div className="w-full space-y-4 pt-4 border-t border-slate-50">
                        <div>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-xs text-slate-500">Engine Integrity</span>
                            <span className="text-xs font-black text-emerald-500">94%</span>
                          </div>
                          <Bar pct={94} color="#10B981" delay={0.6} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-xs text-slate-500">Hydraulic Pressure</span>
                            <span className="text-xs font-black text-blue-500">82%</span>
                          </div>
                          <Bar pct={82} color="#3B82F6" delay={0.7} />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div {...fadeUp(0.16)} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                      <SectionLabel>Fleet Actions</SectionLabel>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => toast.success('Shift assigned')} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-all border border-blue-100 text-blue-700 group">
                          <Send className="w-4 h-4" />
                          <span className="text-[10px] font-bold">Dispatch</span>
                        </button>
                        <button onClick={() => toast.success('System locked')} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100 text-slate-700">
                          <Lock className="w-4 h-4" />
                          <span className="text-[10px] font-bold">Lock System</span>
                        </button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Specifications & Activity */}
                  <div className="col-span-8 space-y-5">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Transmission', val: 'Direct i-Shift', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'Max Payload', val: '22,400 KG', icon: Shield, color: 'text-amber-500', bg: 'bg-amber-50' },
                        { label: 'Connection', val: 'Active · 5G', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50' }
                      ].map((item, i) => (
                        <motion.div key={i} {...fadeUp(0.14 + i * 0.04)} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center shrink-0`}>
                            <item.icon className={`w-6 h-6 ${item.color}`} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                            <p className="text-lg font-black text-slate-800">{item.val}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div {...fadeUp(0.22)} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex-1">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-black text-slate-800">Operational Log Feed</h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-full">LATEST UPDATES</span>
                      </div>
                      <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-50">
                        {[
                          { title: 'Checkpoint Alpha Reached', desc: 'Arrived at distribution hub for scheduled drop-off.', time: 'Today • 11:20 AM', icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-100' },
                          { title: 'Refueling Protocol', desc: 'System detected refueling event. Added 420L Diesel.', time: 'Today • 08:15 AM', icon: Fuel, color: 'text-amber-500', bg: 'bg-amber-100' },
                          { title: 'Route Recalculated', desc: 'Adjusted course due to high congestion on Route 64.', time: 'Yesterday • 05:40 PM', icon: Navigation, color: 'text-purple-500', bg: 'bg-purple-100' },
                        ].map((ev, i) => (
                          <div key={i} className="flex items-start gap-6 relative group">
                            <div className={`w-10 h-10 rounded-2xl ${ev.bg} ${ev.color} flex items-center justify-center shrink-0 shadow-sm border-4 border-white relative z-10 transition-transform group-hover:scale-110`}>
                              <ev.icon className="w-5 h-5" />
                            </div>
                            <div className="pt-0.5">
                              <p className="text-sm font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{ev.title}</p>
                              <p className="text-xs text-slate-500 mb-2 leading-relaxed">{ev.desc}</p>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <Clock className="w-3 h-3" />
                                {ev.time}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(v) => toast.success('Asset added to fleet')}
      />
    </div>
  )
}

export default VehiclesPage

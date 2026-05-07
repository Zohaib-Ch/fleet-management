import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wrench, AlertTriangle, CheckCircle2, Clock, 
  Settings, Search, Filter, Hammer, Droplets, Battery, Activity,
  ChevronRight, MoreHorizontal, Calendar, Plus, Truck,
  ShieldCheck, Zap, Gauge, Thermometer,
  User, Star, MapPin, DollarSign, Send, ArrowUpRight, Box, Layers
} from 'lucide-react'
import Navbar from '../components/Navbar'
import AddTicketModal from '../components/AddTicketModal'
import AuditLogsModal from '../components/AuditLogsModal'
import toast from 'react-hot-toast'
import { mockMaintenanceTickets, mockServiceHistory, mockMechanics, mockInventory } from '../mockData'

// ── Animation presets ─────────────────────────────────────────────────────────
const fadeUp = (d = 0) => ({ 
  initial: { opacity: 0, y: 18 }, 
  animate: { opacity: 1, y: 0 }, 
  transition: { duration: 0.4, delay: d, ease: [0.22, 1, 0.36, 1] } 
})

const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
    {children}
  </p>
)

const Ring = ({ value, max = 100, size = 64, color = '#10B981', label }) => {
  const r = 24, circ = 2 * Math.PI * r, pct = Math.min(value / max, 1)
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#F1F5F9" strokeWidth="4" />
        <motion.circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circ} transform="rotate(-90 32 32)"
          initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }} />
        <text x="32" y="36" textAnchor="middle" fontSize="10" fontWeight="900" fill="#1e293b">{value}%</text>
      </svg>
      {label && <p className="text-[8px] text-slate-400 uppercase tracking-wider font-bold mt-1">{label}</p>}
    </div>
  )
}

const MaintenancePage = () => {
  const [activeTab, setActiveTab] = useState('Schedule')
  const [searchQuery, setSearchQuery] = useState('')
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false)
  const [tickets, setTickets] = useState(mockMaintenanceTickets)

  const handleAddTicket = (newTicket) => {
    setTickets([newTicket, ...tickets])
    toast.success('Service ticket initialized')
  }

  const kpis = [
    { label: 'Asset Health', value: '94.2%', sub: 'Global index', trend: 0.4, icon: Activity, color: 'bg-blue-600' },
    { label: 'Critical Faults', value: '03', sub: 'Immediate action', trend: -12, icon: AlertTriangle, color: 'bg-red-500' },
    { label: 'Pending Tasks', value: tickets.length.toString().padStart(2, '0'), sub: 'In maintenance', trend: 2, icon: Wrench, color: 'bg-amber-500' },
    { label: 'MTBF Rating', value: '482h', sub: 'System stability', trend: 1.5, icon: Clock, color: 'bg-indigo-600' },
  ]

  const filteredTickets = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return tickets.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.id.toLowerCase().includes(q) ||
      t.type.toLowerCase().includes(q)
    )
  }, [searchQuery, tickets])

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F8FAFC] overflow-hidden">
      <Navbar />
      
      <main className="flex-1 flex flex-col gap-3 overflow-hidden p-3 pt-24">
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-10 space-y-4">
          
          {/* CINEMATIC MAINTENANCE HERO */}
          <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 p-8 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-900/50" />
            <div className="absolute top-0 right-0 p-8 opacity-20">
               <Settings className="w-64 h-64 text-white rotate-12" />
            </div>
            
            <div className="relative z-10 flex justify-between items-end">
              <div>
                <div className="flex items-center gap-2 mb-3">
                   <div className="px-3 py-1 bg-indigo-500/20 backdrop-blur-md border border-indigo-400/30 rounded-full text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                     Asset Lifecycle Command
                   </div>
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight mb-2">Maintenance <span className="text-indigo-400">Control</span></h1>
                <p className="text-slate-400 text-sm font-medium max-w-lg">Predictive engineering and real-time diagnostic synchronization for 482 active fleet assets.</p>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsAuditModalOpen(true)}
                  className="px-6 py-3.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-[11px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  History Logs
                </button>
                <button 
                  onClick={() => setIsTicketModalOpen(true)}
                  className="px-8 py-3.5 bg-blue-600 rounded-2xl text-[11px] font-black text-white uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> New Ticket
                </button>
              </div>
            </div>
          </div>

          {/* TOP KPI GRID */}
          <div className="grid grid-cols-4 gap-4">
            {kpis.map((kpi, i) => (
              <motion.div key={i} {...fadeUp(i * 0.05)} className="bg-white/60 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white shadow-premium flex items-center gap-5 flex-1">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{kpi.label}</p>
                   <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-slate-800 tracking-tighter">{kpi.value}</span>
                      <span className={`text-[9px] font-bold ${kpi.trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {kpi.trend >= 0 ? '↑' : '↓'} {Math.abs(kpi.trend)}%
                      </span>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-12 gap-4">
            
            {/* Left: Asset Integrity & Inventory */}
            <div className="col-span-4 flex flex-col gap-4">
               <motion.div {...fadeUp(0.2)} className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-premium flex flex-col items-center">
                  <SectionLabel>Fleet Health Matrix</SectionLabel>
                  <div className="flex gap-6 mb-8 mt-2">
                    <Ring value={94} color="#10B981" label="Engine" />
                    <Ring value={68} color="#F59E0B" label="Hydraulics" />
                    <Ring value={82} color="#3B82F6" label="Brakes" />
                  </div>
                  <div className="w-full space-y-4 pt-4 border-t border-slate-50">
                    {[
                      { label: 'Electrical Integrity', val: 96, color: 'bg-indigo-500' },
                      { label: 'Tire Pressure Index', val: 74, color: 'bg-blue-500' },
                      { label: 'Coolant Flow', val: 88, color: 'bg-emerald-500' }
                    ].map((m, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{m.label}</span>
                          <span className="text-[10px] font-black text-slate-800">{m.val}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: `${m.val}%` }} className={`h-full ${m.color}`} />
                        </div>
                      </div>
                    ))}
                  </div>
               </motion.div>

               <motion.div {...fadeUp(0.3)} className="bg-slate-900 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:scale-110 transition-transform">
                     <Box className="w-32 h-32 text-white" />
                  </div>
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6">Component Inventory</h4>
                  <div className="space-y-5 relative z-10">
                     {mockInventory.slice(0, 5).map((item, i) => (
                       <div key={i} className="flex justify-between items-center group/item">
                          <div>
                             <p className="text-xs font-black text-white group-hover/item:translate-x-1 transition-transform">{item.label}</p>
                             <p className={`text-[8px] font-black uppercase tracking-[0.2em] mt-0.5 ${item.status === 'Low Stock' ? 'text-amber-400' : 'text-slate-500'}`}>{item.status}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-base font-black text-white font-mono">{item.qty}</p>
                          </div>
                       </div>
                     ))}
                  </div>
                  <button className="w-full py-4 mt-8 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-all">
                    Access Logistics Hub
                  </button>
               </motion.div>
            </div>

            {/* Right: Operational Queue */}
            <div className="col-span-8 flex flex-col gap-4">
               <motion.div {...fadeUp(0.4)} className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-8 border border-white shadow-premium flex-1">
                  <div className="flex justify-between items-center mb-8">
                     <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                        {['Schedule', 'History', 'Mechanics'].map(v => (
                          <button 
                            key={v}
                            onClick={() => setActiveTab(v)}
                            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                              activeTab === v ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                     </div>
                     <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                        <input 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          type="text" 
                          placeholder="Search tactical tasks..." 
                          className="pl-12 pr-6 py-3 bg-white rounded-2xl text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-blue-100/50 w-64 border border-slate-100 shadow-sm transition-all" 
                        />
                     </div>
                  </div>

                  <div className="space-y-2 max-h-[600px] overflow-y-auto no-scrollbar pr-2">
                     <AnimatePresence mode="wait">
                        {activeTab === 'Schedule' && (
                          <motion.div key="schedule" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                             {filteredTickets.map((t, i) => (
                               <motion.div 
                                  key={t.id}
                                  {...fadeUp(i * 0.05)}
                                  className="group bg-white p-5 rounded-[2.2rem] border border-slate-100 hover:border-blue-200 hover:shadow-premium transition-all cursor-pointer flex items-center gap-6 relative overflow-hidden"
                               >
                                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${t.urgency === 'High' ? 'bg-red-500' : t.urgency === 'Medium' ? 'bg-amber-400' : 'bg-blue-500'}`} />
                                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 transition-all">
                                     <Truck className="w-7 h-7 text-blue-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                     <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-sm font-black text-slate-800 truncate tracking-tight">{t.name}</h4>
                                        <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 uppercase tracking-widest">{t.id}</span>
                                     </div>
                                     <div className="flex items-center gap-5">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                           <Wrench className="w-3.5 h-3.5 opacity-50" />
                                           {t.type}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                           <MapPin className="w-3.5 h-3.5 opacity-50" />
                                           {t.location}
                                        </div>
                                     </div>
                                  </div>
                                  <div className="w-32 text-right">
                                     <p className="text-xs font-black text-slate-800">{t.cost}</p>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.due}</p>
                                  </div>
                                  <div className="w-32 px-4">
                                     <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                                        <span className="text-[8px] font-black text-blue-600">{t.progress}%</span>
                                     </div>
                                     <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${t.progress}%` }} className="h-full bg-blue-500" />
                                     </div>
                                  </div>
                                  <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                               </motion.div>
                             ))}
                          </motion.div>
                        )}

                        {activeTab === 'History' && (
                          <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                             {mockServiceHistory.map((item, i) => (
                               <div key={i} className="bg-white/40 p-5 rounded-[2rem] border border-white flex items-center gap-6">
                                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-sm text-emerald-500">
                                     <CheckCircle2 className="w-6 h-6" />
                                  </div>
                                  <div className="flex-1">
                                     <h4 className="text-sm font-black text-slate-800 tracking-tight">{item.name}</h4>
                                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{item.type} • {item.date}</p>
                                  </div>
                                  <div className="text-right pr-6">
                                     <p className="text-xs font-black text-slate-800">{item.cost}</p>
                                     <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">SETTLED</p>
                                  </div>
                                  <button className="px-5 py-2.5 bg-white rounded-xl text-[10px] font-black text-slate-400 border border-slate-50 hover:text-blue-600 hover:shadow-sm transition-all uppercase tracking-widest">Audit</button>
                               </div>
                             ))}
                          </motion.div>
                        )}

                        {activeTab === 'Mechanics' && (
                          <motion.div key="mechanics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-4">
                             {mockMechanics.map((tech, i) => (
                               <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-6 relative group overflow-hidden">
                                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform">
                                     <Hammer className="w-24 h-24 text-slate-900" />
                                  </div>
                                  <div className="flex justify-between items-start relative z-10">
                                     <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden shadow-lg border-4 border-white shrink-0">
                                        <img src={tech.photo} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                     </div>
                                     <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                       tech.status === 'On Duty' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                       tech.status === 'In Break' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                       'bg-slate-50 text-slate-400 border-slate-100'
                                     }`}>{tech.status}</div>
                                  </div>
                                  <div className="relative z-10">
                                     <h4 className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1.5">{tech.name}</h4>
                                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tech.specialty}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50 relative z-10">
                                     <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Efficiency</p>
                                        <p className="text-sm font-black text-slate-800 tracking-tighter">{tech.efficiency}%</p>
                                     </div>
                                     <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Queue</p>
                                        <p className="text-sm font-black text-slate-800 tracking-tighter">{tech.tasks} Tasks</p>
                                     </div>
                                  </div>
                               </div>
                             ))}
                          </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </motion.div>

               {/* Predictive Insights Card */}
               <motion.div {...fadeUp(0.6)} className="p-10 rounded-[3.5rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                     <Zap className="w-48 h-48" />
                  </div>
                  <div className="relative z-10">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20">
                           <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                           <h5 className="text-xl font-black tracking-tight leading-none mb-1">Neural Diagnostic Insights</h5>
                           <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">AI Engine Active</p>
                        </div>
                     </div>
                     <p className="text-sm text-indigo-50 max-w-xl mb-10 leading-relaxed font-medium">
                        System telemetry has identified abnormal vibration harmonics in <span className="font-black text-white underline decoration-amber-400 underline-offset-4">4 Scania R500 assets</span>. 
                        Early-stage transmission fatigue detected. Immediate recalibration is recommended to avoid mechanical failure.
                     </p>
                     <div className="flex gap-4">
                        <button className="px-8 py-4 bg-white text-indigo-700 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-900/20 hover:bg-slate-50 transition-all">Generate Batch Orders</button>
                        <button className="px-8 py-4 bg-white/10 backdrop-blur-xl text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/20">Analyze Patterns</button>
                     </div>
                  </div>
               </motion.div>
            </div>
          </div>
        </div>
      </main>

      <AddTicketModal 
        isOpen={isTicketModalOpen} 
        onClose={() => setIsTicketModalOpen(false)} 
        onAdd={handleAddTicket}
      />

      <AuditLogsModal 
        isOpen={isAuditModalOpen} 
        onClose={() => setIsAuditModalOpen(false)} 
      />
    </div>
  )
}

export default MaintenancePage

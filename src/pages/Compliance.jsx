import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, Clock, AlertTriangle, UserCheck, Calendar, 
  Filter, Download, MoreHorizontal, CheckCircle2, XCircle, 
  Timer, Coffee, Search, FileText, Activity, MapPin, 
  ChevronRight, AlertCircle, TrendingUp, ShieldAlert,
  Zap, Bell, Users, Plus
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { mockUsers } from '../mockData'
import toast from 'react-hot-toast'

// ── Animation presets ─────────────────────────────────────────────────────────
const fadeUp = (d = 0) => ({ 
  initial: { opacity: 0, y: 18 }, 
  animate: { opacity: 1, y: 0 }, 
  transition: { duration: 0.4, delay: d, ease: [0.22, 1, 0.36, 1] } 
})

// ── UI Helpers ───────────────────────────────────────────────────────────────
const Ring = ({ value, max = 100, size = 64, color = '#10B981', label }) => {
  const r = 26, circ = 2 * Math.PI * r, pct = Math.min(value / max, 1)
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#F1F5F9" strokeWidth="4" />
        <motion.circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circ} transform="rotate(-90 32 32)"
          initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }} />
        <text x="32" y="36" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1e293b">{value}%</text>
      </svg>
      {label && <p className="text-[8px] text-slate-400 uppercase tracking-widest font-bold mt-1">{label}</p>}
    </div>
  )
}

const Bar = ({ pct, color, delay = 0.4 }) => (
  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
    <motion.div className="h-full rounded-full" style={{ background: color }}
      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }} />
  </div>
)

const SectionLabel = ({ children }) => <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{children}</p>

const CompliancePage = () => {
  const [filter, setFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter only drivers and add compliance metadata
  const drivers = useMemo(() => {
    const baseDrivers = mockUsers.filter(u => u.role === 'Driver')
    return baseDrivers.map(d => ({
      ...d,
      dailyDrive: Math.floor(Math.random() * 90) + 10,
      weeklyDrive: Math.floor(Math.random() * 80) + 20,
      breakCountdown: Math.floor(Math.random() * 45) + 5,
      violationHistory: Math.floor(Math.random() * 2),
      tachographStatus: Math.random() > 0.9 ? 'Syncing' : 'Connected'
    }))
  }, [])

  const filteredDrivers = useMemo(() => {
    return drivers.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.id.toLowerCase().includes(searchQuery.toLowerCase())
      if (filter === 'All') return matchesSearch
      if (filter === 'Resting') return matchesSearch && d.status === 'Offline'
      if (filter === 'Driving') return matchesSearch && d.status === 'Online'
      if (filter === 'Warning') return matchesSearch && d.dailyDrive > 80
      return matchesSearch
    })
  }, [drivers, filter, searchQuery])

  return (
    <div className="flex h-screen w-screen bg-[#F0F4F8] overflow-hidden">
      <Sidebar activeTab="Compliance" setActiveTab={() => {}} />
      
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 p-3 gap-2">
        <TopBar />

        {/* Compliance Header Bar */}
        <div className="flex gap-3 mb-1 shrink-0">
          <div className="bg-white rounded-2xl p-4 flex-1 border border-slate-100 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-100">
               <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Compliance Control</p>
              <h1 className="text-xl font-black text-slate-800 leading-none">Regulatory Enforcement <span className="text-xs text-slate-400 font-bold ml-1">EC No 561/2006</span></h1>
            </div>

            <div className="ml-auto flex gap-4 pr-4">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Fleet Integrity</p>
                <p className="text-sm font-black text-emerald-600 leading-none">98.4% Safe</p>
              </div>
              <div className="text-right border-l pl-4 border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Active Alerts</p>
                <p className="text-sm font-black text-amber-600 leading-none">2 Warnings</p>
              </div>
            </div>
            
            <button 
              onClick={() => toast.success('Compliance audit triggered')}
              className="h-10 px-5 bg-tech-slate text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-slate-100 hover:bg-slate-800 transition-all"
            >
              <FileText className="w-4 h-4" /> Performance Audit
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-8">
          
          {/* QUICK STATS STRIP */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Avg Daily Duty', value: '7.2h', sub: '/ 9h limit', icon: Clock, color: 'text-blue-500' },
              { label: 'Violations (MTD)', value: '0', sub: 'Critical incidents', icon: ShieldAlert, color: 'text-emerald-500' },
              { label: 'Break Adherence', value: '100%', sub: 'Mandatory rests', icon: Coffee, color: 'text-purple-500' },
              { label: 'Logbook Syncs', value: '42', sub: 'Last 24h', icon: Zap, color: 'text-amber-500' },
            ].map((k, i) => (
              <motion.div key={i} {...fadeUp(i * 0.05)} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
                  <k.icon className={`w-6 h-6 ${k.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{k.label}</p>
                  <div className="flex items-end gap-2">
                    <p className="text-xl font-black text-slate-800 leading-none">{k.value}</p>
                    <span className="text-[9px] font-bold text-slate-400 leading-none pb-0.5">{k.sub}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* MAIN COMPLIANCE DIRECTORY */}
          <motion.div {...fadeUp(0.2)} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-5">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                {['All', 'Driving', 'Resting', 'Warning'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-tech-blue transition-colors" />
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text" 
                  placeholder="Find personnel..." 
                  className="pl-12 pr-6 py-3 bg-slate-50 rounded-xl text-xs font-bold focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-50/50 w-64 border border-transparent focus:border-blue-100 transition-all placeholder:text-slate-300" 
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Duty (9h)</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Break Countdown</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekly Limit</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredDrivers.map((d, i) => (
                      <motion.tr 
                        key={d.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-slate-50 hover:bg-slate-50/50 transition-all cursor-pointer group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border-2 border-white group-hover:scale-105 transition-transform shrink-0">
                              <img src={d.photo} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-black text-slate-800 truncate">{d.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${d.status === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{d.id}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-2 w-40">
                            <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase">
                              <span>{Math.round(9 * (d.dailyDrive / 100))}h Duty</span>
                              <span className={d.dailyDrive > 85 ? 'text-red-500' : 'text-slate-800'}>{d.dailyDrive}%</span>
                            </div>
                            <Bar pct={d.dailyDrive} color={d.dailyDrive > 85 ? '#EF4444' : '#3B82F6'} delay={0.2} />
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <Ring value={100 - (d.breakCountdown * 2)} size={42} color={d.breakCountdown < 15 ? '#F59E0B' : '#3B82F6'} />
                            <div>
                              <p className="text-xs font-black text-slate-800 leading-none">{d.breakCountdown} min</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">To Next Break</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-1">
                            <p className="text-xs font-black text-slate-800">{Math.round(56 * (d.weeklyDrive / 100))}h <span className="text-[10px] text-slate-400 font-bold">/ 56h</span></p>
                            <Bar pct={d.weeklyDrive} color="#6366F1" delay={0.3} />
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          {d.dailyDrive > 90 ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-[9px] font-black uppercase tracking-widest border border-red-100 shadow-sm">
                              <ShieldAlert className="w-3 h-3" /> VIOLATION RISK
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                              <CheckCircle2 className="w-3 h-3" /> COMPLIANT
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:shadow-md transition-all">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between px-10">
              <div className="flex items-center gap-8">
                {[
                  { label: 'NOMINAL', color: 'bg-emerald-500' },
                  { label: 'NEAR LIMIT', color: 'bg-amber-500' },
                  { label: 'VIOLATION', color: 'bg-red-500' }
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-2 text-[9px] font-black text-slate-400 tracking-widest">
                    <div className={`w-2 h-2 rounded-full ${l.color}`} /> {l.label}
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Regulatory Database Sync: Oct 2026</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-5">
            <motion.div {...fadeUp(0.3)} className="bg-tech-slate rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-1000"><ShieldCheck className="w-48 h-48" /></div>
              <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Legal Audit Hub
              </h3>
              <p className="text-sm text-slate-400 mb-8 max-w-sm leading-relaxed">
                Automated EC No 561/2006 compliance monitoring. Currently auditing <span className="text-white font-black">128 active logbooks</span> with zero unresolved critical violations.
              </p>
              <div className="flex gap-3 relative z-10">
                <button className="px-6 py-3 bg-white text-tech-slate rounded-xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-slate-100 transition-all">Run Legal Audit</button>
                <button className="px-6 py-3 bg-white/10 text-white border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all">Archived Logs</button>
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.35)} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <SectionLabel>Document Verification Queue</SectionLabel>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex -space-x-3">
                    {drivers.slice(0, 4).map((d, i) => (
                      <div key={i} className="w-10 h-10 rounded-2xl border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                        <img src={d.photo} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">4 Drivers Pending Verification</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Cross-border logbook sync required</p>
                  </div>
                </div>
              </div>
              <button className="w-full py-4 bg-slate-50 hover:bg-blue-50 text-blue-600 border border-slate-100 hover:border-blue-100 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> Open Verification Terminal
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CompliancePage

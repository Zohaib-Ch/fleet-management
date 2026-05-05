import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, TrendingUp, Leaf, Clock, Download, Calendar, 
  ChevronDown, Filter, PieChart, Thermometer, Zap, AlertTriangle,
  User, Truck, ArrowLeft, Fuel, Activity, MapPin, Gauge, Shield, 
  Search, Globe, Star, FileText, CheckCircle2, Layout, ZapOff, 
  ChevronRight, List, Settings, Wrench, ClipboardList, AlertCircle, 
  DollarSign, HardHat, Package, Smartphone, RefreshCw, Printer
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart as RePieChart, Pie, Cell, LineChart, Line 
} from 'recharts'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { mockVehicles, mockChartData } from '../mockData'
import toast from 'react-hot-toast'

// ── Animation presets ─────────────────────────────────────────────────────────
const fadeUp = (d = 0) => ({ 
  initial: { opacity: 0, y: 18 }, 
  animate: { opacity: 1, y: 0 }, 
  transition: { duration: 0.4, delay: d, ease: [0.22, 1, 0.36, 1] } 
})

// ── UI Helpers ───────────────────────────────────────────────────────────────
const Ring = ({ value, max = 100, size = 120, color = '#10B981', label, sublabel }) => {
  const r = 48, circ = 2 * Math.PI * r, pct = Math.min(value / max, 1)
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#F8FAFC" strokeWidth="8" />
          <motion.circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ} transform="rotate(-90 60 60)"
            initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - pct) }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-black text-slate-800 leading-none">{value}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{sublabel}</p>
        </div>
      </div>
      {label && <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-3">{label}</p>}
    </div>
  )
}

const ProgressBar = ({ label, value, max = 10, color = '#3B82F6', subtext }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-end">
      <p className="text-[11px] font-bold text-slate-600">{label}</p>
      <div className="text-right">
        <p className="text-xs font-black text-slate-800 leading-none">{value}</p>
        {subtext && <p className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">{subtext}</p>}
      </div>
    </div>
    <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  </div>
)

// ── Components ──────────────────────────────────────────────────────────────

const ReportCategory = ({ category, reports, activeReport, onSelectReport }) => {
  const [isOpen, setIsOpen] = useState(category.id === 'overview' || reports.some(r => r.id === activeReport))

  return (
    <div className="mb-1">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${isOpen ? 'text-slate-800 bg-slate-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
      >
        <div className="flex items-center gap-3">
          <category.icon className={`w-4 h-4 ${isOpen ? 'text-blue-600' : 'text-slate-400'}`} />
          <span className="text-xs font-black uppercase tracking-widest">{category.label}</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-slate-300">{reports.length}</span>
           <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-7 mt-0.5 space-y-0.5"
          >
            {reports.map(r => (
              <button 
                key={r.id}
                onClick={() => onSelectReport(r.id)}
                className={`w-full text-left px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeReport === r.id ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                {r.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const ReportsPage = () => {
  const [activeReport, setActiveReport] = useState('fleet-overview')
  const [searchQuery, setSearchQuery] = useState('')

  const catalog = [
    { 
      category: { id: 'overview', label: 'Overview', icon: Layout },
      reports: [{ id: 'fleet-overview', label: 'Fleet overview' }]
    },
    { 
      category: { id: 'vehicles', label: 'Vehicles', icon: Truck },
      reports: [
        { id: 'status-summary', label: 'Status Summary' },
        { id: 'utilization-summary', label: 'Utilization Summary' },
        { id: 'vehicle-renewal', label: 'Renewal Reminders' }
      ]
    },
    { 
      category: { id: 'inspections', label: 'Inspections', icon: ClipboardList },
      reports: [
        { id: 'submission-list', label: 'Submission List' },
        { id: 'failure-list', label: 'Inspection Failures' }
      ]
    },
    { 
      category: { id: 'service', label: 'Service', icon: Wrench },
      reports: [
        { id: 'service-kinds', label: 'Service Kinds' },
        { id: 'work-orders', label: 'Open Work Orders' }
      ]
    },
    { 
      category: { id: 'fuel', label: 'Fuel', icon: Fuel },
      reports: [
        { id: 'consumption-trend', label: 'Consumption Trend' },
        { id: 'efficiency-audit', label: 'Efficiency Audit' }
      ]
    },
    { 
      category: { id: 'finance', label: 'Finance', icon: DollarSign },
      reports: [
        { id: 'cost-summary', label: 'Operating Costs' },
        { id: 'parts-spend', label: 'Parts Inventory' }
      ]
    }
  ]

  // ── Render Helpers ──────────────────────────────────────────────────────────

  const renderFleetOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Vehicles', val: '34', sub: '71% Utilization', icon: Truck, color: '#10B981', bg: 'bg-emerald-50' },
          { label: 'Open Alerts', val: '8', sub: 'Across the fleet', icon: AlertTriangle, color: '#EF4444', bg: 'bg-red-50' },
          { label: 'Services Completed', val: '9', sub: 'Lifetime count', icon: Wrench, color: '#F59E0B', bg: 'bg-amber-50' },
          { label: 'Service Spend', val: '$850', sub: 'Recorded costs', icon: DollarSign, color: '#6366F1', bg: 'bg-indigo-50' },
        ].map((k, i) => (
          <motion.div key={i} {...fadeUp(i * 0.05)} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`w-12 h-12 rounded-2xl ${k.bg} flex items-center justify-center text-white`} style={{ color: k.color }}>
              <k.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 leading-none mb-1">{k.val}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{k.label}</p>
              <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">{k.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        <motion.div {...fadeUp(0.2)} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
           <SectionLabel>Fleet Status</SectionLabel>
           <div className="flex items-center gap-10">
              <Ring value={48} max={48} sublabel="VEHICLES" color="#10B981" />
              <div className="flex-1 space-y-4">
                 {[
                   { l: 'Active', v: 34, p: '71%', c: 'bg-emerald-500' },
                   { l: 'In Shop', v: 8, p: '17%', c: 'bg-amber-400' },
                   { l: 'Out of Service', v: 5, p: '10%', c: 'bg-red-500' },
                   { l: 'Sold', v: 1, p: '2%', c: 'bg-slate-300' },
                 ].map(item => (
                   <div key={item.l} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${item.c}`} />
                         <span className="text-xs font-bold text-slate-600">{item.l}</span>
                      </div>
                      <span className="text-xs font-black text-slate-400">{item.v} · <span className="text-slate-800">{item.p}</span></span>
                   </div>
                 ))}
              </div>
           </div>
        </motion.div>

        <motion.div {...fadeUp(0.25)} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
           <SectionLabel>Alerts by Severity</SectionLabel>
           <div className="flex items-center gap-10">
              <Ring value={8} max={8} sublabel="ALERTS" color="#EF4444" />
              <div className="flex-1 space-y-4">
                 {[
                   { l: 'Critical', v: 3, p: '38%', c: 'bg-red-500' },
                   { l: 'Warning', v: 4, p: '50%', c: 'bg-amber-400' },
                   { l: 'Info', v: 1, p: '13%', c: 'bg-blue-500' },
                 ].map(item => (
                   <div key={item.l} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${item.c}`} />
                         <span className="text-xs font-bold text-slate-600">{item.l}</span>
                      </div>
                      <span className="text-xs font-black text-slate-400">{item.v} · <span className="text-slate-800">{item.p}</span></span>
                   </div>
                 ))}
              </div>
           </div>
        </motion.div>
      </div>

      {/* Progress Bars Row */}
      <div className="grid grid-cols-2 gap-6 pb-10">
        <motion.div {...fadeUp(0.3)} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
           <SectionLabel>Top Alert Kinds</SectionLabel>
           <div className="space-y-6">
              <ProgressBar label="High engine temp" value={1} color="#EF4444" />
              <ProgressBar label="Low fuel" value={1} color="#EF4444" />
              <ProgressBar label="Overdue service" value={1} color="#EF4444" />
              <ProgressBar label="Geofence exited" value={1} color="#EF4444" />
              <ProgressBar label="High idle" value={1} color="#EF4444" />
           </div>
        </motion.div>

        <motion.div {...fadeUp(0.35)} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
           <SectionLabel>Service Kinds</SectionLabel>
           <div className="space-y-6">
              <ProgressBar label="Tire rotation" value={4} max={5} color="#3B82F6" />
              <ProgressBar label="Inspection" value={4} max={5} color="#3B82F6" />
              <ProgressBar label="Oil change" value={4} max={5} color="#3B82F6" />
              <ProgressBar label="Brake service" value={3} max={5} color="#3B82F6" />
              <ProgressBar label="Engine service" value={2} max={5} color="#3B82F6" />
           </div>
        </motion.div>
      </div>
    </div>
  )

  const renderStatusSummary = () => (
    <div className="space-y-6">
       <motion.div {...fadeUp()} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
          <SectionLabel>Vehicle Status Summary</SectionLabel>
          <p className="text-sm text-slate-400 font-medium mb-10">Lists the time vehicles have spent in different statuses over the selected period.</p>
          <div className="grid grid-cols-12 gap-10 items-center">
             <div className="col-span-4 flex justify-center">
                <Ring value={48} max={48} size={160} sublabel="VEHICLES" color="#10B981" />
             </div>
             <div className="col-span-8 space-y-8">
                <ProgressBar label="Active" value={34} max={48} color="#10B981" subtext="71% Distribution" />
                <ProgressBar label="In Shop" value={8} max={48} color="#F59E0B" subtext="17% Distribution" />
                <ProgressBar label="Out of Service" value={5} max={48} color="#EF4444" subtext="10% Distribution" />
                <ProgressBar label="Sold" value={1} max={48} color="#94A3B8" subtext="2% Distribution" />
             </div>
          </div>
       </motion.div>
    </div>
  )

  const renderSubmissionList = () => (
    <div className="space-y-6">
       <motion.div {...fadeUp()} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm overflow-hidden">
          <SectionLabel>Inspection Submission Trend</SectionLabel>
          <div className="h-[200px] mb-8">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={mockChartData.fuelHourly.slice(0, 14)}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                 <XAxis dataKey="h" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8'}} />
                 <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} />
                 <Bar dataKey="v" fill="#3B82F6" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </div>
          
          <SectionLabel>All Submissions - Last 14 Days</SectionLabel>
          <div className="space-y-3 mt-6">
             {[
               { title: 'Pre-trip · Toyota 001', date: 'May 5, 2026 5:00 PM', driver: 'Alex Rivera · 7m', status: 'pass' },
               { title: 'Pre-trip · Chevrolet 013', date: 'May 5, 2026 5:00 PM', driver: 'Daria Okafor · 10m', status: 'fail' },
               { title: 'Pre-trip · Ford 023', date: 'May 5, 2026 5:00 PM', driver: 'Alex Rivera · 11m', status: 'fail' },
               { title: 'Pre-trip · Ram 004', date: 'May 4, 2026 5:00 PM', driver: 'Bailey Chen · 12m', status: 'fail' },
               { title: 'Pre-trip · Toyota 001', date: 'May 3, 2026 5:00 PM', driver: 'Alex Rivera · 8m', status: 'pass' },
               { title: 'Post-trip · Ram 004', date: 'May 1, 2026 5:00 PM', driver: 'Bailey Chen · 5m', status: 'pass' },
             ].map((sub, i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-50 hover:bg-white hover:shadow-md hover:border-slate-100 transition-all group">
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sub.status === 'pass' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                        {sub.status === 'pass' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                     </div>
                     <div>
                        <p className="text-sm font-black text-slate-800">{sub.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{sub.date} · {sub.driver}</p>
                     </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-all" />
               </div>
             ))}
          </div>
       </motion.div>
    </div>
  )

  const SectionLabel = ({ children }) => <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">{children}</p>

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar activeTab="Reports" setActiveTab={() => {}} />
      
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 p-3 gap-3">
        <TopBar />

        <div className="flex-1 flex gap-3 overflow-hidden min-h-0">
          
          {/* Left Panel: Report Catalog */}
          <div className="w-[300px] shrink-0 flex flex-col bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden h-full">
             <div className="p-6 border-b border-slate-50">
                <h1 className="text-xl font-black text-slate-800 tracking-tight mb-1">Reports</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">Intelligence catalog — select a report to analyze fleet data.</p>
                
                <div className="relative mt-5">
                   <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                   <input 
                     type="text" 
                     placeholder="Find a report..." 
                     value={searchQuery}
                     onChange={e => setSearchQuery(e.target.value)}
                     className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-slate-300"
                   />
                </div>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                <div className="flex gap-2 mb-4 px-2">
                   {['All 40', 'Favorites', 'Recent'].map(tab => (
                     <button key={tab} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${tab === 'All 40' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}>{tab}</button>
                   ))}
                </div>
                
                {catalog.map(cat => (
                  <ReportCategory 
                    key={cat.category.id} 
                    category={cat.category} 
                    reports={cat.reports} 
                    activeReport={activeReport}
                    onSelectReport={setActiveReport}
                  />
                ))}
             </div>

             <div className="p-4 border-t border-slate-50 bg-slate-50/30">
                <button className="w-full py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                   <Settings className="w-3.5 h-3.5" /> Manage Custom Reports
                </button>
             </div>
          </div>

          {/* Right Panel: Report Dashboard */}
          <div className="flex-1 flex flex-col gap-3 overflow-hidden">
             
             {/* Report Toolbar */}
             <div className="bg-white rounded-2xl px-6 py-3 border border-slate-100 shadow-sm flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Updated Just Now</span>
                   </div>
                   <div className="h-4 w-px bg-slate-100" />
                   <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-all">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-[11px] font-black text-slate-700">Last 14 days</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                   </div>
                </div>

                <div className="flex items-center gap-2">
                   <button onClick={() => toast.success('Added to favorites')} className="p-2 text-slate-300 hover:text-amber-400 transition-all"><Star className="w-4 h-4" /></button>
                   <button onClick={() => toast.success('Refreshing data...')} className="p-2 text-slate-300 hover:text-blue-600 transition-all"><RefreshCw className="w-4 h-4" /></button>
                   <button onClick={() => window.print()} className="p-2 text-slate-300 hover:text-slate-600 transition-all"><Printer className="w-4 h-4" /></button>
                   <div className="h-4 w-px bg-slate-100 mx-2" />
                   <button onClick={() => toast.success('Report exported to PDF')} className="px-5 py-2 bg-tech-blue text-white rounded-xl text-[10px] font-black uppercase tracking-[0.1em] shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
                      <Download className="w-3.5 h-3.5" /> Export PDF
                   </button>
                </div>
             </div>

             {/* Report Content */}
             <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeReport}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                     <div className="mb-8">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em] mb-1">
                          {catalog.find(c => c.reports.some(r => r.id === activeReport))?.category.label}
                        </p>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight capitalize">
                          {activeReport.split('-').join(' ')}
                        </h2>
                        <p className="text-sm text-slate-400 font-medium mt-1">
                          Comprehensive analysis of {activeReport.split('-')[0]} metrics, alerts, and historical performance trends.
                        </p>
                     </div>

                     {activeReport === 'fleet-overview' && renderFleetOverview()}
                     {activeReport === 'status-summary' && renderStatusSummary()}
                     {activeReport === 'submission-list' && renderSubmissionList()}
                     {/* Fallback for other reports */}
                     {activeReport !== 'fleet-overview' && activeReport !== 'status-summary' && activeReport !== 'submission-list' && (
                       <div className="p-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                          <BarChart3 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                          <h3 className="text-xl font-black text-slate-400">Advanced Analytics Hub</h3>
                          <p className="text-sm text-slate-300 max-w-sm mx-auto mt-2 italic font-medium">Detailed data modeling for "{activeReport}" is being calculated. Check back in a moment for full visualization.</p>
                       </div>
                     )}
                  </motion.div>
                </AnimatePresence>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ReportsPage

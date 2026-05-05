import React, { useState, useEffect, useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts'
import { 
  Truck, AlertTriangle, Globe, Navigation, Radio, Wrench, 
  CheckCircle2, Clock, TrendingUp, MapPin, Battery, 
  ChevronRight, BarChart3, AlertCircle, Activity, 
  Droplets, Thermometer, Zap, ShieldCheck, Target, 
  Calendar, ArrowUpRight, ArrowDownRight, Layers, Box
} from 'lucide-react'
import { mockVehicles, mockUsers, mockFleetKPIs, mockChartData } from '../mockData'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '../context/SettingsContext'

// ── Animation presets ─────────────────────────────────────────────────────────
const fadeUp = (d = 0) => ({ 
  initial: { opacity: 0, y: 20 }, 
  animate: { opacity: 1, y: 0 }, 
  transition: { duration: 0.5, delay: d, ease: [0.22, 1, 0.36, 1] } 
})

const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
    {children}
  </p>
)

const MetricCard = ({ label, value, trend, icon: Icon, color, delay }) => (
  <motion.div {...fadeUp(delay)} className="bg-white/60 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white shadow-premium flex-1">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {Math.abs(trend)}%
      </div>
    </div>
    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black text-slate-800 tracking-tighter">{value}</p>
  </motion.div>
)

const Dashboard = () => {
  const { settings, updateSetting } = useSettings()
  const activeRange = settings.analyticsRange || '30D'
  const isDark = settings.theme === 'dark'
  
  const setActiveRange = (val) => updateSetting('analyticsRange', val)
  
  const chartColors = {
    primary: '#2563eb',
    secondary: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    neutral: isDark ? '#64748B' : '#94A3B8',
    text: isDark ? '#94A3B8' : '#64748B',
    grid: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9'
  }

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar activeTab="Analytics" setActiveTab={() => {}} />
      
      <main className="flex-1 flex flex-col gap-3 overflow-hidden p-3">
        <TopBar />
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-10 space-y-4">
          
          {/* CINEMATIC ANALYTICS HERO */}
          <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 p-8 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-slate-900 to-indigo-900/50" />
            <div className="absolute top-0 right-0 p-8 opacity-20">
               <Layers className="w-64 h-64 text-white" />
            </div>
            
            <div className="relative z-10 flex justify-between items-end">
              <div>
                <div className="flex items-center gap-2 mb-3">
                   <div className="px-3 py-1 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-full text-[10px] font-black text-blue-300 uppercase tracking-widest">
                     Operational Intelligence
                   </div>
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight mb-2">Fleet Analytics <span className="text-blue-400">Hub</span></h1>
                <p className="text-slate-400 text-sm font-medium max-w-lg">Advanced telemetry synthesis from 482 active assets across Global Logistics Sector A.</p>
              </div>
              
              <div className="flex bg-white/5 backdrop-blur-xl border border-white/10 p-1.5 rounded-[1.5rem]">
                {['7D', '30D', '90D', 'YTD'].map(r => (
                  <button 
                    key={r}
                    onClick={() => setActiveRange(r)}
                    className={`px-6 py-2.5 rounded-xl text-[11px] font-black tracking-widest transition-all ${
                      activeRange === r ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TOP KPI GRID */}
          <div className="grid grid-cols-4 gap-4">
            <MetricCard label="Total Mileage" value="1.24M km" trend={12.4} icon={Navigation} color="bg-blue-600" delay={0.1} />
            <MetricCard label="Fuel Efficiency" value="94.2%" trend={-2.1} icon={Droplets} color="bg-indigo-600" delay={0.2} />
            <MetricCard label="Asset Uptime" value="98.8%" trend={0.5} icon={Zap} color="bg-emerald-600" delay={0.3} />
            <MetricCard label="Active Incidents" value="48" trend={-18.4} icon={ShieldCheck} color="bg-amber-600" delay={0.4} />
          </div>

          {/* MAIN VISUALIZATION GRID */}
          <div className="grid grid-cols-12 gap-4">
            
            {/* Primary Area Chart: Utilization Trends */}
            <motion.div {...fadeUp(0.5)} className="col-span-8 bg-white/80 backdrop-blur-2xl rounded-[3rem] p-8 border border-white shadow-premium min-h-[450px] flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <div>
                   <SectionLabel>Fleet Utilization Index</SectionLabel>
                   <h3 className="text-xl font-black text-slate-800 tracking-tight">Activity Analysis</h3>
                </div>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-200" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Standby</span>
                   </div>
                </div>
              </div>
              
              <div className="flex-1 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData.fuelWeekly}>
                    <defs>
                      <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
                    <XAxis 
                      dataKey="h" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: chartColors.text }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: chartColors.text }} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDark ? '#0F172A' : '#fff', 
                        borderRadius: '1.5rem', 
                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none', 
                        boxShadow: '0 20px 50px rgba(0,0,0,0.1)' 
                      }}
                      labelStyle={{ fontWeight: 900, marginBottom: '4px', color: isDark ? '#F8FAFC' : '#1e293b' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="v" 
                      stroke="#2563eb" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorUtil)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Side Column: Distribution & Performance */}
            <div className="col-span-4 flex flex-col gap-4">
               {/* Pie Chart: Status Distribution */}
               <motion.div {...fadeUp(0.6)} className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-8 border border-white shadow-premium flex-1 flex flex-col">
                  <SectionLabel>Status Distribution</SectionLabel>
                  <div className="flex-1 w-full min-h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'On Road', value: 312 },
                            { name: 'Resting', value: 107 },
                            { name: 'Idle', value: 45 },
                            { name: 'Service', value: 18 },
                          ]}
                          cx="50%" cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          <Cell fill="#2563eb" />
                          <Cell fill="#10B981" />
                          <Cell fill="#F59E0B" />
                          <Cell fill="#EF4444" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                       <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">312 Units</p>
                       <p className="text-[9px] text-slate-400 font-bold uppercase">Moving</p>
                    </div>
                    <div className="text-center">
                       <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">107 Units</p>
                       <p className="text-[9px] text-slate-400 font-bold uppercase">Resting</p>
                    </div>
                  </div>
               </motion.div>

               {/* Bar Chart: Efficiency by Zone */}
               <motion.div {...fadeUp(0.7)} className="bg-slate-900 rounded-[3rem] p-8 shadow-2xl flex-1 flex flex-col">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Regional Efficiency</p>
                  <div className="flex-1 w-full min-h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockChartData.fuelWeekly.slice(0, 5)}>
                        <XAxis 
                          hide={true}
                        />
                        <Bar 
                          dataKey="v" 
                          fill="#3b82f6" 
                          radius={[4, 4, 0, 0]}
                          barSize={12}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Total Output</span>
                     <span className="text-lg font-black text-blue-400">88.4%</span>
                  </div>
               </motion.div>
            </div>
          </div>

          {/* BOTTOM GRID: DATA TABLES & DEEP INSIGHTS */}
          <div className="grid grid-cols-3 gap-4">
             {/* Security Risk Scorecard */}
             <motion.div {...fadeUp(0.8)} className="bg-white rounded-[2.5rem] p-7 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                      <AlertCircle className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-slate-800 leading-none mb-1">Risk Assessment</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Security Matrix</p>
                   </div>
                </div>
                <div className="space-y-4">
                   {[
                     { label: 'Geofence Breach', val: '4%', color: 'bg-emerald-500' },
                     { label: 'Overspeed Events', val: '22%', color: 'bg-amber-500' },
                     { label: 'Unauthorized Start', val: '0.2%', color: 'bg-red-500' }
                   ].map((item, i) => (
                     <div key={i}>
                        <div className="flex justify-between items-center mb-1.5">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                           <span className="text-[10px] font-black text-slate-800">{item.val}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                           <div className={`h-full ${item.color}`} style={{ width: item.val }} />
                        </div>
                     </div>
                   ))}
                </div>
             </motion.div>

             {/* Top Performers Table */}
             <motion.div {...fadeUp(0.9)} className="col-span-2 bg-white rounded-[2.5rem] p-7 border border-slate-100 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                         <Target className="w-6 h-6" />
                      </div>
                      <div>
                         <h4 className="text-sm font-black text-slate-800 leading-none mb-1">Asset Performance Rankings</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Efficiency Leaders</p>
                      </div>
                   </div>
                   <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="flex-1 overflow-hidden">
                   <table className="w-full">
                      <thead>
                         <tr className="text-left">
                            <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset ID</th>
                            <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance</th>
                            <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fuel Usage</th>
                            <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {mockVehicles.slice(0, 4).map((v, i) => (
                           <tr key={i} className="group">
                              <td className="py-3">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                       <Truck className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-black text-slate-800">{v.id}</span>
                                 </div>
                              </td>
                              <td className="py-3">
                                 <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-600">98%</span>
                                    <div className="w-16 h-1 bg-slate-50 rounded-full overflow-hidden">
                                       <div className="h-full bg-emerald-500 w-[98%]" />
                                    </div>
                                 </div>
                              </td>
                              <td className="py-3 text-xs font-bold text-slate-600">42.4 L/100km</td>
                              <td className="py-3 text-right">
                                 <span className="text-[9px] font-black px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg uppercase tracking-widest">Top Tier</span>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </motion.div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default Dashboard

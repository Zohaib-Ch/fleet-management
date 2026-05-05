import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Activity, Battery, Fuel, Gauge, Shield, MapPin, Navigation, Clock, Thermometer, Wifi } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useNavigate } from 'react-router-dom'
import ReportGenerationModal from './ReportGenerationModal'

const data = [
   { time: '00:00', value: 45 },
   { time: '04:00', value: 52 },
   { time: '08:00', value: 48 },
   { time: '12:00', value: 61 },
   { time: '16:00', value: 55 },
   { time: '20:00', value: 67 },
   { time: '23:59', value: 62 },
]

const AssetIntelligenceModal = ({ isOpen, onClose, vehicle }) => {
   const navigate = useNavigate()
   const [reportModalOpen, setReportModalOpen] = React.useState(false)

   if (!vehicle) return null

   const handleFullHistory = () => {
      navigate(`/reports?vehicleId=${vehicle.id}`)
      onClose()
   }

   const handleDownloadAudit = () => {
      setReportModalOpen(true)
   }

   return (
      <AnimatePresence>
         {isOpen && (
            <>
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={onClose}
                  className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[7000]"
               />
               <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: "-40%", x: "-50%" }}
                  animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                  exit={{ opacity: 0, scale: 0.9, y: "-40%", x: "-50%" }}
                  className="fixed top-1/2 left-1/2 w-full max-w-4xl bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] z-[7001] overflow-hidden border border-white/50"
               >
                  <div className="flex h-[600px]">
                     {/* Left Sidebar: Asset Overview */}
                     <div className="w-1/3 bg-slate-50/50 border-r border-slate-100 p-8 flex flex-col justify-between">
                        <div>
                           <div className="flex items-center gap-3 mb-8">
                              <div className="w-14 h-14 rounded-2xl bg-blue-600 shadow-xl shadow-blue-200 flex items-center justify-center text-white">
                                 <Activity className="w-7 h-7" />
                              </div>
                              <div>
                                 <h2 className="text-xl font-bold text-tech-slate">{vehicle.id}</h2>
                                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{vehicle.name}</p>
                              </div>
                           </div>

                           <div className="space-y-6">
                              <div className="bg-white p-5 rounded-2xl shadow-sm border border-white">
                                 <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Health</span>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase">Optimal</span>
                                 </div>
                                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <motion.div
                                       initial={{ width: 0 }}
                                       animate={{ width: '92%' }}
                                       transition={{ duration: 1.5, ease: "easeOut" }}
                                       className="h-full bg-emerald-500 rounded-full"
                                    />
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                 {[
                                    { label: 'Battery', val: `${vehicle.vitals?.battery}%`, icon: Battery, color: 'text-emerald-500' },
                                    { label: 'Fuel', val: `${vehicle.vitals?.fuel}%`, icon: Fuel, color: 'text-blue-500' },
                                    { label: 'Temp', val: '24°C', icon: Thermometer, color: 'text-amber-500' },
                                    { label: 'Signal', val: 'Strong', icon: Wifi, color: 'text-indigo-500' }
                                 ].map((item, i) => (
                                    <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-white">
                                       <item.icon className={`w-4 h-4 ${item.color} mb-2`} />
                                       <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">{item.label}</p>
                                       <p className="text-sm font-bold text-tech-slate">{item.val}</p>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                 <img src={`https://i.pravatar.cc/150?u=${vehicle.driver?.name}`} alt="" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Assigned Driver</p>
                                 <p className="text-xs font-bold text-tech-slate">{vehicle.driver?.name}</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Right Content: Deep Telemetry */}
                     <div className="flex-1 p-10 flex flex-col">
                        <div className="flex justify-between items-start mb-10">
                           <div>
                              <h3 className="text-2xl font-bold text-tech-slate mb-1">Deep Telemetry</h3>
                              <p className="text-sm text-slate-400 font-medium">Real-time propulsion & diagnostics feed</p>
                           </div>
                           <button
                              onClick={onClose}
                              className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                           >
                              <X className="w-6 h-6" />
                           </button>
                        </div>

                        <div className="flex-1">
                           <div className="h-64 mb-8">
                              <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={data}>
                                    <defs>
                                       <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                       </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <YAxis hide />
                                    <Tooltip
                                       contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                 </AreaChart>
                              </ResponsiveContainer>
                           </div>

                           <div className="grid grid-cols-3 gap-6">
                              <div className="space-y-1">
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Average Speed</p>
                                 <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-tech-slate">64</span>
                                    <span className="text-xs font-bold text-slate-400">km/h</span>
                                 </div>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Distance Today</p>
                                 <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-tech-slate">312</span>
                                    <span className="text-xs font-bold text-slate-400">km</span>
                                 </div>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Idle Time</p>
                                 <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-tech-slate">18</span>
                                    <span className="text-xs font-bold text-slate-400">min</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="mt-auto pt-8 border-t border-slate-100 flex gap-4">
                           <button
                              onClick={handleDownloadAudit}
                              className="flex-1 py-4 bg-tech-slate text-white rounded-2xl text-xs font-bold hover:bg-black transition-all"
                           >
                              Download Blackbox Data
                           </button>
                           <button
                              onClick={handleFullHistory}
                              className="flex-1 py-4 bg-blue-50 text-blue-600 rounded-2xl text-xs font-bold hover:bg-blue-100 transition-all"
                           >
                              Full History Report
                           </button>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </>
         )}
         <ReportGenerationModal
            isOpen={reportModalOpen}
            onClose={() => setReportModalOpen(false)}
            data={vehicle}
            mode="Vehicle"
         />
      </AnimatePresence>
   )
}

export default AssetIntelligenceModal

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldCheck, Activity, Clock, Server, FileText, ChevronRight } from 'lucide-react'

const AuditLogsModal = ({ isOpen, onClose }) => {
  const logs = [
    { type: 'System', event: 'Diagnostics Audit Started', user: 'Sarah Connor', time: '10:42 AM', status: 'Success' },
    { type: 'Security', event: 'New Mechanic Invited', user: 'Alex Jensen', time: '09:15 AM', status: 'Verified' },
    { type: 'Telemetry', event: 'Critical Fault E-4041 Detected', user: 'Automated System', time: '08:30 AM', status: 'Alert' },
    { type: 'Asset', event: 'Maintenance Ticket #482 Created', user: 'Robert Miller', time: 'Yesterday', status: 'Logged' },
    { type: 'System', event: 'Monthly Fuel Report Generated', user: 'Executive Manager', time: 'Yesterday', status: 'Success' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[5000]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: '100%' }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-4 right-4 bottom-4 w-full max-w-lg bg-white rounded-[3rem] shadow-2xl z-[5001] overflow-hidden flex flex-col"
          >
            <div className="p-10 border-b border-slate-50">
               <div className="flex justify-between items-center">
                  <div>
                     <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compliance & Audit</span>
                     </div>
                     <h2 className="text-3xl font-bold text-tech-slate">Fleet Audit Logs</h2>
                  </div>
                  <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                     <X className="w-6 h-6" />
                  </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-6">
               {logs.map((log, i) => (
                 <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-6 group cursor-default"
                 >
                    <div className="flex flex-col items-center">
                       <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border border-white shadow-sm ${
                          log.type === 'Security' ? 'bg-purple-50 text-purple-600' : 
                          log.type === 'Telemetry' ? 'bg-red-50 text-red-600' : 
                          'bg-blue-50 text-blue-600'
                       }`}>
                          {log.type === 'Security' ? <Server className="w-5 h-5" /> : 
                           log.type === 'Telemetry' ? <Activity className="w-5 h-5" /> : 
                           <FileText className="w-5 h-5" />}
                       </div>
                       {i !== logs.length - 1 && <div className="w-0.5 h-12 bg-slate-50 mt-1" />}
                    </div>
                    <div className="pt-1 flex-1">
                       <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-bold text-tech-slate">{log.event}</p>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{log.time}</span>
                       </div>
                       <p className="text-[10px] text-slate-500 font-medium mb-3">Initiated by <span className="text-tech-blue font-bold">{log.user}</span></p>
                       <span className={`px-2.5 py-1 rounded-lg text-[8px] font-bold uppercase tracking-wider ${
                          log.status === 'Alert' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500'
                       }`}>{log.status}</span>
                    </div>
                 </motion.div>
               ))}
            </div>

            <div className="p-10 bg-slate-50/50 border-t border-slate-50">
               <button className="w-full py-4 bg-white rounded-2xl text-xs font-bold text-slate-600 shadow-sm border border-white hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                  <Download className="w-4 h-4" /> Export Full System Audit
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

const Download = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>

export default AuditLogsModal

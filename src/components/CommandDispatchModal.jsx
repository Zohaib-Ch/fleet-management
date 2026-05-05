import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, ShieldAlert, Power, Zap, RefreshCw, Lock, Unlock, Eye, Bell } from 'lucide-react'
import toast from 'react-hot-toast'

const CommandDispatchModal = ({ isOpen, onClose, vehicle }) => {
  const [isDispatching, setIsDispatching] = useState(false)
  const [selectedCmd, setSelectedCmd] = useState(null)

  if (!vehicle) return null

  const commands = [
    { id: 'kill', label: 'Engine Kill', icon: Power, color: 'text-red-500', bg: 'bg-red-50', desc: 'Immediately cuts fuel delivery and ignition' },
    { id: 'unlock', label: 'Enable Drive', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50', desc: 'Restores all operational systems' },
    { id: 'reboot', label: 'Reboot ECU', icon: RefreshCw, color: 'text-blue-500', bg: 'bg-blue-50', desc: 'Restarts the main control unit' },
    { id: 'lockdown', label: 'Lock Doors', icon: Lock, color: 'text-amber-500', bg: 'bg-amber-50', desc: 'Secures all asset entry points' },
    { id: 'unlock_doors', label: 'Unlock Doors', icon: Unlock, color: 'text-slate-500', bg: 'bg-slate-50', desc: 'Releases entry point locks' },
    { id: 'lights', label: 'Flash Lights', icon: Eye, color: 'text-indigo-500', bg: 'bg-indigo-50', desc: 'Activates high-intensity strobe' },
  ]

  const handleDispatch = () => {
    if (!selectedCmd) return
    
    setIsDispatching(true)
    const loadToast = toast.loading(`Connecting to satellite...`)

    setTimeout(() => {
      toast.success(`${selectedCmd.label} command accepted by ${vehicle.id}`, {
        id: loadToast,
        duration: 4000
      })
      setIsDispatching(false)
      onClose()
    }, 2000)
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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[7000]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.4)] z-[7001] overflow-hidden p-10 border border-white/50"
          >
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                     <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                     <h2 className="text-xl font-bold text-tech-slate">Secure Command Console</h2>
                     <p className="text-xs text-slate-400 font-medium">Authorized dispatching for {vehicle.id}</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><X className="w-6 h-6 text-slate-300" /></button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
               {commands.map((cmd) => (
                 <button
                    key={cmd.id}
                    onClick={() => setSelectedCmd(cmd)}
                    className={`flex flex-col p-6 rounded-[2rem] border-2 transition-all text-left group ${selectedCmd?.id === cmd.id ? 'border-blue-500 bg-blue-50/50' : 'border-slate-50 bg-slate-50/30 hover:border-slate-100 hover:bg-slate-50/50'}`}
                 >
                    <div className={`w-10 h-10 rounded-xl ${cmd.bg} ${cmd.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                       <cmd.icon className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-tech-slate mb-1">{cmd.label}</p>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{cmd.desc}</p>
                 </button>
               ))}
            </div>

            <div className="flex gap-4">
               <button 
                 onClick={onClose}
                 className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-all"
               >
                 Cancel Session
               </button>
               <button 
                 onClick={handleDispatch}
                 disabled={!selectedCmd || isDispatching}
                 className={`flex-1 py-4 flex items-center justify-center gap-2 rounded-2xl text-sm font-bold shadow-lg transition-all ${!selectedCmd || isDispatching ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'}`}
               >
                 {isDispatching ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </motion.div>
                 ) : (
                    <Send className="w-4 h-4" />
                 )}
                 {isDispatching ? 'Transmitting...' : 'Dispatch Command'}
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CommandDispatchModal

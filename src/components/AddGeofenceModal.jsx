import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Shield, Maximize, Check, Info, Radio, Layers } from 'lucide-react'

const AddGeofenceModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Circular',
    radius: '500',
    severity: 'Medium',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd(formData)
    onClose()
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[5000]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-[3rem] shadow-2xl z-[5001] overflow-hidden"
          >
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Geospatial Security</span>
                  </div>
                  <h2 className="text-3xl font-bold text-tech-slate">New Geofence</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Zone Name</label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Restricted Site A"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-amber-100 focus:bg-white transition-all text-sm outline-none"
                      />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Shape Type</label>
                       <div className="relative">
                         <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                         <select 
                           value={formData.type}
                           onChange={(e) => setFormData({...formData, type: e.target.value})}
                           className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-amber-100 focus:bg-white transition-all text-sm outline-none appearance-none cursor-pointer"
                         >
                           <option>Circular</option>
                           <option>Polygonal</option>
                           <option>Corridor</option>
                         </select>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Radius (meters)</label>
                       <div className="relative">
                         <Maximize className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                         <input 
                           type="number"
                           value={formData.radius}
                           onChange={(e) => setFormData({...formData, radius: e.target.value})}
                           className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-amber-100 focus:bg-white transition-all text-sm outline-none"
                         />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Alert Severity</label>
                    <div className="flex gap-3">
                       {['Low', 'Medium', 'High'].map(s => (
                         <button
                           key={s}
                           type="button"
                           onClick={() => setFormData({...formData, severity: s})}
                           className={`flex-1 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider border-2 transition-all ${formData.severity === s ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-slate-50 text-slate-400 hover:border-slate-100'}`}
                         >
                           {s}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="pt-6">
                    <button 
                      type="submit"
                      className="w-full py-5 bg-amber-500 text-white rounded-3xl text-sm font-bold shadow-2xl shadow-amber-100 hover:bg-amber-600 transition-all flex items-center justify-center gap-3"
                    >
                      <Check className="w-5 h-5" />
                      Initialize Virtual Barrier
                    </button>
                 </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AddGeofenceModal

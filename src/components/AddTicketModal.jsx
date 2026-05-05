import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Wrench, AlertTriangle, User, Calendar, Check, Clipboard, Info } from 'lucide-react'
import { mockVehicles, mockUsers } from '../mockData'

const AddTicketModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    assetId: mockVehicles[0]?.id || '',
    serviceType: 'Oil & Filter Change',
    priority: 'Medium',
    mechanic: 'Alex Jensen',
    description: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const selectedAsset = mockVehicles.find(v => v.id === formData.assetId)
    const newTicket = {
      ...formData,
      id: formData.assetId,
      name: selectedAsset?.name || 'Unknown Asset',
      due: 'Pending',
      progress: 0,
      tech: formData.mechanic,
      urgency: formData.priority,
      cost: 'Pending'
    }
    onAdd(newTicket)
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl z-[5001] overflow-hidden"
          >
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Technical Operations</span>
                  </div>
                  <h2 className="text-3xl font-bold text-tech-slate">Register Service Ticket</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Asset ID</label>
                      <div className="relative">
                        <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <select 
                          value={formData.assetId}
                          onChange={(e) => setFormData({...formData, assetId: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm outline-none appearance-none cursor-pointer"
                        >
                          {mockVehicles.map(v => (
                            <option key={v.id} value={v.id}>{v.id} - {v.name}</option>
                          ))}
                        </select>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Service Type</label>
                      <div className="relative">
                        <Clipboard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <select 
                          value={formData.serviceType}
                          onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm outline-none appearance-none cursor-pointer"
                        >
                          <option>Oil & Filter Change</option>
                          <option>Brake Inspection</option>
                          <option>Hydraulic Flush</option>
                          <option>Engine Tuning</option>
                          <option>Track Tensioning</option>
                        </select>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Urgency Level</label>
                      <div className="relative">
                        <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <select 
                          value={formData.priority}
                          onChange={(e) => setFormData({...formData, priority: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm outline-none appearance-none cursor-pointer"
                        >
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                          <option>Critical</option>
                        </select>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Assigned Mechanic</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <select 
                          value={formData.mechanic}
                          onChange={(e) => setFormData({...formData, mechanic: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm outline-none appearance-none cursor-pointer"
                        >
                          {mockUsers.filter(u => u.role === 'Mechanic' || u.role === 'Driver').map(u => (
                            <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                          ))}
                        </select>
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Technical Notes</label>
                   <textarea 
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     placeholder="Describe the issue or service requirements..."
                     className="w-full p-6 bg-slate-50 rounded-3xl border border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm outline-none min-h-[120px] resize-none"
                   />
                </div>

                <div className="pt-6">
                   <button 
                     type="submit"
                     className="w-full py-5 bg-tech-blue text-white rounded-3xl text-sm font-bold shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                   >
                     <Check className="w-5 h-5" />
                     Initialize Maintenance Ticket
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

export default AddTicketModal

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Truck, User, MapPin, Hash, Plus, Check, Info } from 'lucide-react'

const AddVehicleModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    model: '',
    zone: 'Zone A',
    status: 'Resting',
    driverName: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const newVehicle = {
      ...formData,
      speed: 0,
      lat: 51.5 + (Math.random() * 0.1),
      lng: -0.1 + (Math.random() * 0.1),
      driver: {
        name: formData.driverName,
        photo: `https://i.pravatar.cc/150?u=${formData.driverName}`,
        drivingTime: '0h',
        restingTime: '0h',
        nextBreak: '60 min'
      },
      vitals: {
        fuel: 100,
        satellite: 'Strong',
        battery: 100,
        temp: 35
      }
    }
    onAdd(newVehicle)
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
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-[5000]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-2xl max-h-[90vh] bg-white rounded-[2rem] lg:rounded-[3rem] shadow-2xl z-[5001] overflow-y-auto custom-scrollbar"
          >
            <div className="p-6 md:p-10">
              <div className="flex justify-between items-center mb-8 md:mb-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Asset Registration</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-tech-slate font-jakarta">Register Vehicle</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                {/* Section 1: Core Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Vehicle Name</label>
                      <div className="relative">
                        <Truck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="e.g. Hauler 12"
                          className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm outline-none"
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Plate / Asset ID</label>
                      <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input 
                          required
                          value={formData.id}
                          onChange={(e) => setFormData({...formData, id: e.target.value})}
                          placeholder="e.g. DK-9901"
                          className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm outline-none font-mono"
                        />
                      </div>
                   </div>
                </div>

                {/* Section 2: Technical Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Vehicle Model</label>
                      <div className="relative">
                        <Info className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input 
                          required
                          value={formData.model}
                          onChange={(e) => setFormData({...formData, model: e.target.value})}
                          placeholder="e.g. Volvo EC220"
                          className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm outline-none"
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Deployment Zone</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <select 
                          value={formData.zone}
                          onChange={(e) => setFormData({...formData, zone: e.target.value})}
                          className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm outline-none appearance-none cursor-pointer"
                        >
                          <option>Zone A</option>
                          <option>Zone B</option>
                          <option>Zone C</option>
                        </select>
                      </div>
                   </div>
                </div>

                {/* Section 3: Driver Assignment */}
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Assign Driver</label>
                   <div className="relative">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                     <input 
                       required
                       value={formData.driverName}
                       onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                       placeholder="Enter driver's full name"
                       className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm outline-none"
                     />
                   </div>
                </div>

                <div className="pt-4 md:pt-6">
                   <button 
                     type="submit"
                     className="w-full py-4 md:py-5 bg-tech-blue text-white rounded-[1.5rem] md:rounded-3xl text-sm font-bold shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                   >
                     <Check className="w-5 h-5" />
                     Confirm & Initialize Asset
                   </button>
                   <p className="text-center text-[10px] text-slate-400 mt-4">By adding this asset, you agree to automatic telemetry synchronization.</p>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AddVehicleModal

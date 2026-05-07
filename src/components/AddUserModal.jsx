import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Phone, Shield, Check, Briefcase, Camera, Plus } from 'lucide-react'

const AddUserModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Driver',
    status: 'Online',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const roleId = formData.role.toLowerCase()
    const newUser = {
      ...formData,
      id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      role: {
        id: roleId,
        name: formData.role
      },
      photo: `https://i.pravatar.cc/150?u=${formData.name}`,
      department: roleId === 'driver' ? 'Logistics' : 'Operations',
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      performance: 100,
      compliance: 'Compliant'
    }
    onAdd(newUser)
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-full max-w-xl max-h-[90vh] md:max-h-none bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl z-[5001] overflow-y-auto md:overflow-hidden custom-scrollbar"
          >
            <div className="p-6 md:p-10">
              <div className="flex justify-between items-center mb-8 md:mb-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Workforce</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-tech-slate font-jakarta">Register New Member</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                
                <div className="flex justify-center mb-6 md:mb-8">
                  <div className="relative group">
                    <div className="w-20 md:w-24 h-20 md:h-24 rounded-[1.5rem] md:rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center group-hover:border-indigo-300 transition-all">
                      <Camera className="w-6 md:w-8 h-6 md:h-8 text-slate-300" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-7 md:w-8 h-7 md:h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-lg cursor-pointer">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-indigo-100 focus:bg-white transition-all text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-indigo-100 focus:bg-white transition-all text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+45 00 00 00 00"
                        className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-indigo-100 focus:bg-white transition-all text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Role Assignment</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-indigo-100 focus:bg-white transition-all text-sm outline-none appearance-none cursor-pointer"
                    >
                      <option>Driver</option>
                      <option>Dispatcher</option>
                      <option>Mechanic</option>
                      <option>Manager</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 md:pt-6">
                  <button
                    type="submit"
                    className="w-full py-4 md:py-5 bg-indigo-600 text-white rounded-[1.5rem] md:rounded-3xl text-sm font-bold shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                  >
                    <Check className="w-5 h-5" />
                    Confirm Member Registration
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-4">The member will be added to the database with immediate system access.</p>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AddUserModal

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Truck, UserPlus, MapPin, ClipboardList, X } from 'lucide-react'
import { useMagnetic } from '../hooks/useMagnetic'
import AddVehicleModal from './AddVehicleModal'
import AddUserModal from './AddUserModal'
import AddTicketModal from './AddTicketModal'
import AddGeofenceModal from './AddGeofenceModal'
import toast from 'react-hot-toast'

const FAB = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [isGeofenceModalOpen, setIsGeofenceModalOpen] = useState(false)
  const { ref, position } = useMagnetic(0.3)

  const handleAddVehicle = (newVehicle) => {
    toast.success(`${newVehicle.id} registration initialized successfully!`, {
      icon: '🚛',
    })
  }

  const handleAddUser = (newUser) => {
    toast.success(`Invitation sent to ${newUser.email}`, {
      icon: '📩',
    })
  }

  const handleAddTicket = (newTicket) => {
    toast.success(`Maintenance ticket for ${newTicket.id} created!`, {
      icon: '🔧',
    })
  }

  const handleAddGeofence = (newGeofence) => {
    toast.success(`Geofence "${newGeofence.name}" is now live!`, {
      icon: '🌐',
    })
  }

  const actions = [
    { label: 'Add Vehicle', icon: Truck, color: 'bg-blue-500', onClick: () => setIsVehicleModalOpen(true) },
    { label: 'Invite Driver', icon: UserPlus, color: 'bg-emerald-500', onClick: () => setIsUserModalOpen(true) },
    { label: 'New Geofence', icon: MapPin, color: 'bg-amber-500', onClick: () => setIsGeofenceModalOpen(true) },
    { label: 'Create Task', icon: ClipboardList, color: 'bg-indigo-500', onClick: () => setIsTicketModalOpen(true) },
  ]

  return (
    <div className="fixed bottom-8 right-8 z-[5000]">
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col-reverse items-end gap-4 mb-4">
            {actions.map((action, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  action.onClick()
                  setIsOpen(false)
                }}
                className="flex items-center gap-3 group cursor-pointer"
              >
                <span className="px-3 py-1.5 bg-tech-slate text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  {action.label}
                </span>
                <div className={`w-12 h-12 ${action.color} rounded-2xl shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.button
        ref={ref}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[2rem] shadow-2xl flex items-center justify-center transition-all ${isOpen ? 'bg-tech-slate text-white' : 'bg-tech-blue text-white shadow-blue-200'}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'plus'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
          >
            {isOpen ? <X className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      <AddVehicleModal 
        isOpen={isVehicleModalOpen} 
        onClose={() => setIsVehicleModalOpen(false)} 
        onAdd={handleAddVehicle} 
      />
      
      <AddUserModal 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
        onAdd={handleAddUser} 
      />

      <AddTicketModal 
        isOpen={isTicketModalOpen} 
        onClose={() => setIsTicketModalOpen(false)} 
        onAdd={handleAddTicket} 
      />

      <AddGeofenceModal 
        isOpen={isGeofenceModalOpen} 
        onClose={() => setIsGeofenceModalOpen(false)} 
        onAdd={handleAddGeofence} 
      />
    </div>
  )
}

export default FAB

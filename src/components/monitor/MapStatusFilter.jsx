import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, ChevronDown, Check, Settings } from 'lucide-react'

const STATUSES = [
  { id: 'Moving',      label: 'Moving',      color: '#10B981' },
  { id: 'Resting',     label: 'Resting',     color: '#F59E0B' },
  { id: 'Idle',        label: 'Idle',        color: '#94A3B8' },
  { id: 'Maintenance', label: 'Maintenance', color: '#EF4444' },
]

const MapStatusFilter = ({ activeStatuses, onToggleStatus }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="absolute top-4 right-4 z-[1000] flex gap-2" ref={dropdownRef}>
      {/* Filter Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-10 px-4 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white flex items-center gap-2 text-slate-600 hover:bg-white transition-all"
        >
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold">Status Filter</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          {activeStatuses.length < STATUSES.length && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-[8px] font-black text-white">{activeStatuses.length}</span>
            </div>
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white p-2 overflow-hidden"
            >
              <div className="px-3 py-2 mb-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toggle Visibility</p>
              </div>
              
              <div className="space-y-1">
                {STATUSES.map((status) => {
                  const isActive = activeStatuses.includes(status.id)
                  return (
                    <button
                      key={status.id}
                      onClick={() => onToggleStatus(status.id)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ background: status.color }} 
                        />
                        <span className={`text-xs font-bold ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                        isActive 
                          ? 'bg-blue-600 border-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]' 
                          : 'border-slate-200 group-hover:border-slate-300'
                      }`}>
                        {isActive && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-50 flex justify-between px-2">
                <button 
                  onClick={() => onToggleStatus('ALL')}
                  className="text-[10px] font-bold text-blue-600 hover:underline px-2 py-1"
                >
                  Select All
                </button>
                <button 
                  onClick={() => onToggleStatus('NONE')}
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-600 px-2 py-1"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default MapStatusFilter

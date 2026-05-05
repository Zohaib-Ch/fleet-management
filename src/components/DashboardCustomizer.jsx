import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, X, Layout, Eye, EyeOff, Check, GripVertical, ToggleRight } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

const DashboardCustomizer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { settings, toggleSetting } = useSettings()

  const widgets = [
    { key: 'showKPICards', label: 'KPI Statistics', icon: Layout },
    { key: 'showMap', label: 'Live Fleet Map', icon: Layout },
    { key: 'showHealthCircle', label: 'Fleet Health Chart', icon: Layout },
    { key: 'showActionRequired', label: 'Action Notifications', icon: Layout },
    { key: 'showIndustryWidgets', label: 'Specialized Widgets', icon: Layout },
    { key: 'showVehicleList', label: 'Bottom Vehicle List', icon: Layout },
  ]

  return (
    <div className="fixed bottom-24 right-8 z-[5000]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            className="absolute bottom-16 right-0 w-80 bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6 px-2">
              <div>
                <h3 className="text-sm font-black text-tech-slate uppercase tracking-tighter">Workspace Layout</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Customize your view</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-2">
              {widgets.map((widget) => (
                <motion.div
                  key={widget.key}
                  whileHover={{ x: 4 }}
                  onClick={() => toggleSetting(widget.key)}
                  className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${settings[widget.key] ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-100' : 'bg-slate-50 border-slate-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${settings[widget.key] ? 'bg-white/20 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                      {settings[widget.key] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </div>
                    <span className={`text-xs font-bold ${settings[widget.key] ? 'text-white' : 'text-slate-600'}`}>
                      {widget.label}
                    </span>
                  </div>
                  <div className={`w-8 h-4 rounded-full relative transition-all ${settings[widget.key] ? 'bg-white/30' : 'bg-slate-200'}`}>
                    <motion.div 
                      animate={{ x: settings[widget.key] ? 18 : 2 }}
                      className={`absolute top-1 w-2 h-2 rounded-full ${settings[widget.key] ? 'bg-white' : 'bg-slate-400'}`} 
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 px-2">
               <button 
                 onClick={() => toggleSetting('isEditMode')}
                 className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${settings.isEditMode ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
               >
                  <GripVertical className="w-3.5 h-3.5" />
                  {settings.isEditMode ? 'Exit Layout Edit' : 'Enter Drag Mode'}
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all ${isOpen ? 'bg-tech-slate text-white' : 'bg-white text-blue-600 border border-white'}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Layout className="w-6 h-6" />}
      </motion.button>
    </div>
  )
}

export default DashboardCustomizer

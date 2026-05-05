import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Layout, GripVertical, Settings2, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

const DashboardCustomizerTop = () => {
  const { settings, toggleSetting, updateSetting } = useSettings()
  const [isExpanded, setIsExpanded] = useState(false)

  const widgets = [
    { key: 'showKPICards', label: 'KPIs', icon: Layout },
    { key: 'showMap', label: 'Map', icon: Layout },
    { key: 'showHealthCircle', label: 'Health', icon: Layout },
    { key: 'showActionRequired', label: 'Actions', icon: Layout },
    { key: 'showIndustryWidgets', label: 'Specialized', icon: Layout },
    { key: 'showVehicleList', label: 'Fleet List', icon: Layout },
  ]

  const handleReset = () => {
    widgets.forEach(w => updateSetting(w.key, true))
    updateSetting('isEditMode', false)
  }

  return (
    <div className="flex flex-col gap-2 mb-2">
      <motion.div 
        layout
        className="bg-white/40 backdrop-blur-md rounded-[2rem] p-2 border border-white/60 shadow-sm flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-2 px-4 border-r border-slate-200/50 mr-2">
           <div className="w-8 h-8 rounded-xl bg-tech-slate flex items-center justify-center text-white">
              <Settings2 className="w-4 h-4" />
           </div>
           <div>
              <p className="text-[9px] font-black text-tech-slate uppercase tracking-tighter leading-none">Layout</p>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none">Customizer</p>
           </div>
        </div>

        <div className="flex-1 flex items-center gap-3">
           <button 
             onClick={() => setIsExpanded(!isExpanded)}
             className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-xl border border-white text-slate-500 hover:text-tech-blue transition-all"
           >
              <div className="flex items-center gap-1.5">
                 {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                 <span className="text-[10px] font-bold uppercase tracking-widest">{isExpanded ? 'Hide Controls' : 'Customize View'}</span>
              </div>
              <div className="flex -space-x-1.5 opacity-40">
                 {widgets.slice(0, 3).map((w, i) => (
                    <div key={i} className={`w-3.5 h-3.5 rounded-full border border-white ${settings[w.key] ? 'bg-blue-400' : 'bg-slate-300'}`} />
                 ))}
              </div>
           </button>
           
           {!isExpanded && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1">
                 {widgets.map(w => (
                    <div key={w.key} className={`w-1.5 h-1.5 rounded-full ${settings[w.key] ? 'bg-emerald-400' : 'bg-slate-300 opacity-30'}`} />
                 ))}
              </motion.div>
           )}
        </div>

        <div className="flex items-center gap-2 px-2 border-l border-slate-200/50">
           <button 
             onClick={() => toggleSetting('isEditMode')}
             className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${settings.isEditMode ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
           >
              <GripVertical className="w-3.5 h-3.5" />
              {settings.isEditMode ? 'Finish' : 'Edit'}
           </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden bg-white/30 backdrop-blur-sm rounded-[2rem] p-2 border border-white/40 shadow-sm flex items-center justify-between gap-4"
          >
            <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-4">
              {widgets.map((widget) => (
                <button
                  key={widget.key}
                  onClick={() => toggleSetting(widget.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap border ${settings[widget.key] ? 'bg-white border-blue-100 text-tech-blue shadow-sm' : 'bg-slate-50/50 border-transparent text-slate-400 opacity-60 hover:opacity-100'}`}
                >
                  {settings[widget.key] ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span className="text-[10px] font-black uppercase tracking-widest">{widget.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 px-4 border-l border-slate-200/50">
               <button 
                 onClick={handleReset}
                 className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-500 transition-all group"
               >
                  <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[-45deg] transition-transform" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Reset All</span>
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DashboardCustomizerTop

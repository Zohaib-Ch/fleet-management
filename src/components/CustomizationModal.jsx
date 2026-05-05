import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Layout, MousePointer2, Palette, Shield } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

const CustomizationModal = ({ isOpen, onClose }) => {
  const { settings, toggleSetting } = useSettings()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[5000]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-40%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-40%' }}
            className="fixed top-1/2 left-1/2 w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl z-[5001] overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-tech-slate">Platform Customization</h2>
                  <p className="text-xs text-slate-400 font-medium">Configure your workspace preferences</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                
                {/* Setting 1: Fleet List */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Layout className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Show Fleet List on Map</p>
                      <p className="text-[10px] text-slate-500">Display the floating vehicle list overlay</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleSetting('showFleetList')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.showFleetList ? 'bg-tech-blue' : 'bg-slate-200'}`}
                  >
                    <motion.div 
                      animate={{ x: settings.showFleetList ? 26 : 2 }}
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                {/* Setting 2: Hover Feature */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <MousePointer2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Enable Map Hover Cards</p>
                      <p className="text-[10px] text-slate-500">Show user details when hovering on pins</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleSetting('enableHoverCards')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.enableHoverCards ? 'bg-tech-blue' : 'bg-slate-200'}`}
                  >
                    <motion.div 
                      animate={{ x: settings.enableHoverCards ? 26 : 2 }}
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                {/* Setting 3: Workspace Locking (Placeholder) */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 opacity-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Shield className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Strict Workspace Layout</p>
                      <p className="text-[10px] text-slate-500">Lock widget positions for consistency</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-slate-200 relative">
                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>

              </div>

              <div className="mt-10">
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-tech-slate text-white rounded-2xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CustomizationModal

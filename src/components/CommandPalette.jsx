import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Truck, Users, BarChart3, Settings, Map, Command, X, ChevronRight, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import { mockVehicles, mockUsers } from '../mockData'

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { settings } = useSettings()
  const isDarkMode = settings.theme === 'dark'

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSelect = useCallback((path) => {
    console.log('CommandPalette: Selecting path:', path)
    navigate(path)
    setIsOpen(false)
    setQuery('')
  }, [navigate])

  const results = useCallback(() => {
    if (!query) return []

    const vehicleResults = mockVehicles
      .filter(v => v.name.toLowerCase().includes(query.toLowerCase()) || v.id.toLowerCase().includes(query.toLowerCase()))
      .map(v => ({ ...v, type: 'vehicle', icon: Truck, category: 'Vehicles', path: `/vehicle/${v.id}` }))

    const userResults = mockUsers
      .filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.role.name.toLowerCase().includes(query.toLowerCase()))
      .map(u => ({ ...u, type: 'user', icon: Users, category: 'Team', path: `/profile/${u.id}` }))

    const pageResults = [
      { name: 'Dashboard Overview', path: '/', category: 'Navigation', icon: Map },
      { name: 'Live Fleet Map', path: '/map', category: 'Navigation', icon: Zap },
      { name: 'Vehicle Management', path: '/vehicles', category: 'Navigation', icon: Truck },
      { name: 'User Management', path: '/users', category: 'Navigation', icon: Users },
      { name: 'Performance Reports', path: '/reports', category: 'Navigation', icon: BarChart3 },
    ].filter(p => p.name.toLowerCase().includes(query.toLowerCase()))

    return [...pageResults, ...vehicleResults, ...userResults].slice(0, 8)
  }, [query])

  // ── Keyboard shortcut handler ─────────────────────────────────────────────

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      if (e.key === 'Escape') setIsOpen(false)

      if (e.key === 'Enter' && isOpen) {
        const currentResults = results()
        if (currentResults.length > 0) {
          handleSelect(currentResults[0].path)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, handleSelect])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className={`fixed inset-0 backdrop-blur-[2px] z-[9998] ${isDarkMode ? 'bg-slate-900/60' : 'bg-slate-900/20'}`}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[9999]"
          >
            <div className={`backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border overflow-hidden ${
              isDarkMode 
                ? 'bg-slate-900/90 border-white/5 shadow-black/50' 
                : 'bg-white border-white shadow-slate-200/50'
            }`}>
              {/* Search Input */}
              <div className={`p-6 border-b flex items-center gap-4 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                <Search className="w-6 h-6 text-slate-400" />
                <input
                  autoFocus
                  placeholder="Type a vehicle ID, driver name, or command..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={`flex-1 bg-transparent border-none outline-none text-xl font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 ${
                    isDarkMode ? 'text-white' : 'text-tech-slate'
                  }`}
                />
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                  isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              </div>

              {/* Results Area */}
              <div className="max-h-[450px] overflow-y-auto custom-scrollbar p-2">
                {query === '' ? (
                  <div className="p-8 text-center">
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 ${
                      isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'
                    }`}>
                       <Command className={`w-8 h-8 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                    </div>
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-tech-slate'}`}>Global Command Palette</p>
                    <p className="text-xs text-slate-400 mt-1">Search anything across your fleet instantly</p>
                    
                    <div className="grid grid-cols-2 gap-3 mt-8">
                       {[
                         { label: 'Find a truck', keys: 'Scania' },
                         { label: 'Search driver', keys: 'Alex' },
                         { label: 'Go to map', keys: '/map' },
                         { label: 'Open reports', keys: '/rep' }
                       ].map(tip => (
                         <div key={tip.label} className={`p-3 rounded-2xl text-left border border-transparent transition-all cursor-pointer ${
                           isDarkMode ? 'bg-slate-800/40 hover:border-blue-900' : 'bg-slate-50 hover:border-blue-100'
                         }`}>
                            <p className={`text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{tip.label}</p>
                            <p className={`text-xs font-mono ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{tip.keys}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                ) : results().length > 0 ? (
                  <div className="space-y-1">
                    {results().map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          handleSelect(item.path)
                        }}
                        className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer group transition-all ${
                          isDarkMode ? 'hover:bg-blue-900/20' : 'hover:bg-blue-50/50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl shadow-sm flex items-center justify-center border transition-all ${
                          isDarkMode ? 'bg-slate-800 border-white/5 group-hover:border-blue-800' : 'bg-white border-slate-50 group-hover:border-blue-100'
                        }`}>
                          <item.icon className={`w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                             <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-tech-slate'}`}>{item.name || item.id}</p>
                             <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest ${
                               isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                             }`}>{item.category}</span>
                          </div>
                          {item.role && <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.role.name} • {item.status}</p>}
                          {item.model && <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.model} • {item.zone}</p>}
                        </div>
                        <ChevronRight className={`w-4 h-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0`} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-400 text-sm italic">
                    No matching results found for "{query}"
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={`p-4 border-t flex justify-between items-center px-6 ${
                isDarkMode ? 'bg-slate-900/80 border-white/5' : 'bg-slate-50/80 border-slate-100'
              }`}>
                <div className="flex gap-4">
                   <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      <span className={`px-1.5 py-0.5 rounded border shadow-sm ${
                        isDarkMode ? 'bg-slate-800 border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
                      }`}>↵</span>
                      Select
                   </div>
                   <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      <span className={`px-1.5 py-0.5 rounded border shadow-sm ${
                        isDarkMode ? 'bg-slate-800 border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
                      }`}>↑↓</span>
                      Navigate
                   </div>
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}>Zero-Friction Interface v1.0</div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CommandPalette

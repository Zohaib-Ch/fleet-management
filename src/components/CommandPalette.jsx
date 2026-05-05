import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Truck, Users, BarChart3, Settings, Map, Command, X, ChevronRight, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { mockVehicles, mockUsers } from '../mockData'

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

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
      .filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.role.toLowerCase().includes(query.toLowerCase()))
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[9999]"
          >
            <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white overflow-hidden">
              {/* Search Input */}
              <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                <Search className="w-6 h-6 text-slate-400" />
                <input
                  autoFocus
                  placeholder="Type a vehicle ID, driver name, or command..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-xl font-medium text-tech-slate placeholder:text-slate-300"
                />
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-500 uppercase">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              </div>

              {/* Results Area */}
              <div className="max-h-[450px] overflow-y-auto custom-scrollbar p-2">
                {query === '' ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                       <Command className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-tech-slate">Global Command Palette</p>
                    <p className="text-xs text-slate-400 mt-1">Search anything across your fleet instantly</p>
                    
                    <div className="grid grid-cols-2 gap-3 mt-8">
                       {[
                         { label: 'Find a truck', keys: 'Scania' },
                         { label: 'Search driver', keys: 'Alex' },
                         { label: 'Go to map', keys: '/map' },
                         { label: 'Open reports', keys: '/rep' }
                       ].map(tip => (
                         <div key={tip.label} className="p-3 rounded-2xl bg-slate-50 text-left border border-transparent hover:border-blue-100 transition-all cursor-pointer">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{tip.label}</p>
                            <p className="text-xs font-mono text-blue-600">{tip.keys}</p>
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
                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50/50 cursor-pointer group transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-50 group-hover:border-blue-100">
                          <item.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                             <p className="text-sm font-bold text-tech-slate">{item.name || item.id}</p>
                             <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-widest">{item.category}</span>
                          </div>
                          {item.role && <p className="text-[10px] text-slate-400 font-medium">{item.role} • {item.status}</p>}
                          {item.model && <p className="text-[10px] text-slate-400 font-medium">{item.model} • {item.zone}</p>}
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
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
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center px-6">
                <div className="flex gap-4">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                      <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 shadow-sm">↵</span>
                      Select
                   </div>
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                      <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 shadow-sm">↑↓</span>
                      Navigate
                   </div>
                </div>
                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Zero-Friction Interface v1.0</div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CommandPalette

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, Settings, ChevronDown, User, LogOut, BellRing, Sparkles, AlertTriangle, ShieldCheck, Layout, Edit3, Truck, UserCircle } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { useAuth } from '../context/AuthContext'
import { mockVehicles, mockUsers } from '../mockData'
import { useNavigate } from 'react-router-dom'

const TopBar = ({ hideSearch = false, hideProfile = false, hideNotifications = false }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const { settings, updateSetting, toggleSetting } = useSettings()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({ vehicles: [], users: [] })
  const [showSearch, setShowSearch] = useState(false)

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim().length > 1) {
      const filteredVehicles = mockVehicles.filter(v =>
        v.name.toLowerCase().includes(query.toLowerCase()) ||
        v.id.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)

      const filteredUsers = mockUsers.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)

      setSearchResults({ vehicles: filteredVehicles, users: filteredUsers })
      setShowSearch(true)
    } else {
      setShowSearch(false)
    }
  }

  const notifications = [
    { id: 1, type: 'Warning', title: 'Critical Fault Detected', desc: 'Asset DK-20481 (Scania R500) reported Engine Misfire.', time: '2 min ago', icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
    { id: 2, type: 'Compliance', title: 'Rest Period Overdue', desc: 'Driver Alex Jensen is 15 mins past mandatory break.', time: '12 min ago', icon: ShieldCheck, color: 'text-amber-500 bg-amber-50' },
    { id: 3, type: 'System', title: 'Audit Report Ready', desc: 'Monthly efficiency audit has been generated.', time: '1 hour ago', icon: Sparkles, color: 'text-blue-500 bg-blue-50' },
  ]

  return (
    <header className="flex items-center justify-between py-2 relative z-[4000]">
      {/* Global Search */}
      {!hideSearch ? (
        <div className="relative group flex-1 max-w-[500px]">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
            <Search className="w-4 h-4 text-slate-300 group-focus-within:text-tech-blue transition-colors" />
            {!searchQuery && <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest hidden lg:inline">Search anything</span>}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => searchQuery.length > 1 && setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            placeholder=""
            className="bg-soft-white rounded-2xl pl-14 pr-6 py-4 w-full shadow-sm border border-soft-white focus:outline-none focus:ring-4 focus:ring-tech-blue/10 transition-all text-sm font-medium text-tech-slate"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-soft-bg border border-soft-white rounded-md">
            <span className="text-[9px] font-bold text-slate-400">⌘ K</span>
          </div>

          <AnimatePresence>
            {showSearch && (searchResults.vehicles.length > 0 || searchResults.users.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-[calc(100%+12px)] left-0 w-[500px] bg-soft-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-soft-white overflow-hidden z-[5000]"
              >
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar p-2">
                  {searchResults.vehicles.length > 0 && (
                    <div className="mb-4">
                      <p className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicles & Assets</p>
                      {searchResults.vehicles.map(v => (
                        <div
                          key={v.id}
                          onClick={() => navigate(`/vehicle/${v.id}`)}
                          className="flex items-center gap-4 px-6 py-4 hover:bg-soft-bg rounded-3xl cursor-pointer transition-all group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                            <Truck className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-tech-slate group-hover:text-tech-blue">{v.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">ID: {v.id} • {v.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.users.length > 0 && (
                    <div>
                      <p className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Personnel</p>
                      {searchResults.users.map(u => (
                        <div
                          key={u.id}
                          onClick={() => navigate(`/profile/${u.id}`)}
                          className="flex items-center gap-4 px-6 py-4 hover:bg-soft-bg rounded-3xl cursor-pointer transition-all group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center overflow-hidden">
                            <img src={u.photo} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-tech-slate group-hover:text-tech-blue">{u.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{u.role.name} • {u.compliance}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-4 bg-soft-bg/50 border-t border-soft-white text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Press Enter for Advanced Search</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : <div className="flex-1" />}

      <div className="flex items-center gap-6">
        {/* Notifications */}
        {!hideNotifications && (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all relative ${showNotifications ? 'bg-tech-blue text-white shadow-lg shadow-blue-200 dark:shadow-none' : 'bg-soft-white text-slate-400 shadow-sm border border-soft-white'}`}
            >
              <Bell className="w-5 h-5" />
              <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-soft-white" />
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-[calc(100%+12px)] right-0 w-[400px] bg-soft-white rounded-[2.5rem] shadow-2xl border border-soft-white overflow-hidden"
                >
                  <div className="p-8 border-b border-soft-white flex justify-between items-center bg-soft-bg/50">
                    <div className="flex items-center gap-2">
                      <BellRing className="w-4 h-4 text-tech-blue" />
                      <h3 className="text-sm font-bold text-tech-slate">Platform Alerts</h3>
                    </div>
                    <button className="text-[10px] font-bold text-tech-blue uppercase tracking-widest">Mark all read</button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-6 border-b border-soft-white/50 hover:bg-soft-bg/30 transition-all cursor-pointer group">
                        <div className="flex gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.color} dark:bg-opacity-20`}>
                            <n.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-xs font-bold text-tech-slate group-hover:text-tech-blue transition-colors">{n.title}</p>
                              <span className="text-[9px] font-medium text-slate-400">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-2">{n.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 text-center">
                    <button className="text-[11px] font-bold text-slate-400 hover:text-tech-blue transition-colors uppercase tracking-[0.2em]">View All Activity</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* User Profile Dropdown */}
        {!hideProfile && (
          <div className="relative">
            <motion.div
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 bg-soft-white pl-2 pr-5 py-2 rounded-2xl shadow-sm border border-soft-white cursor-pointer hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 overflow-hidden border-2 border-soft-white shadow-sm">
                <img
                  src={user?.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-tech-slate">{user?.name || 'Nikolas G.'}</p>
                <p className="text-[10px] font-medium text-slate-400">{user?.role?.name || 'Fleet Director'}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
            </motion.div>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-[calc(100%+12px)] right-0 w-64 bg-soft-white rounded-[2rem] shadow-2xl border border-soft-white overflow-hidden p-3"
                >
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => { navigate('/settings'); setShowProfile(false) }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-soft-bg text-slate-600 dark:text-slate-400 transition-all"
                    >
                      <UserCircle className="w-4 h-4" />
                      <span className="text-xs font-bold">Account Settings</span>
                    </button>
                    <button
                      onClick={() => { navigate('/settings'); setShowProfile(false) }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-soft-bg text-slate-600 dark:text-slate-400 transition-all"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-xs font-bold">Preferences</span>
                    </button>
                    <div className="h-px bg-soft-bg my-1 mx-2" />
                    <button
                      onClick={() => { logout(); navigate('/login') }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-xs font-bold">Secure Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  )
}

export default TopBar

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Bell, Settings, LogOut, User, ChevronDown, ChevronRight,
  LayoutDashboard, Truck, Users, BarChart3, ShieldCheck,
  Wrench, Menu, X, Sparkles, Command, AlertTriangle, MapPin
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import toast from 'react-hot-toast'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { settings, updateSetting } = useSettings()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSectorDropdown, setShowSectorDropdown] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Monitor', path: '/', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Fleet', path: '/vehicles', icon: Truck },
    { name: 'Personnel', path: '/users', icon: Users },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Reports', path: '/reports', icon: Sparkles },
  ]

  const notifications = [
    { id: 1, title: 'Speed Violation', body: 'Vehicle V-102 exceeded 110km/h on E45', time: '2m ago', type: 'critical', icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
    { id: 2, title: 'Service Required', body: 'V-204 scheduled for engine inspection', time: '15m ago', type: 'warning', icon: Wrench, color: 'text-amber-500 bg-amber-50' },
    { id: 3, title: 'Geofence Exit', body: 'V-309 left designated zone: North Industrial', time: '1h ago', type: 'warning', icon: MapPin, color: 'text-blue-500 bg-blue-50' },
    { id: 4, title: 'System Update', body: 'Fleet Intelligence v4.2 now active', time: '3h ago', type: 'info', icon: Sparkles, color: 'text-emerald-500 bg-emerald-50' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[5000] transition-all duration-500 px-4 py-3 ${isScrolled ? 'top-2' : 'top-0'}`}>
      <div className={`max-w-[1800px] mx-auto transition-all duration-500 ${isScrolled ? 'rounded-[2.5rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/50 dark:border-white/5 px-8 py-3' : 'bg-transparent px-2 py-4'}`}>
        <div className="flex items-center justify-between gap-8">

          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-500">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div className="hidden lg:block relative">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <motion.h1
                  className="text-sm font-black text-slate-800 tracking-tighter leading-none flex"
                  initial="initial"
                  animate="animate"
                >
                  {["J", "E", "X", "I"].map((char, i) => (
                    <motion.span
                      key={i}
                      variants={{
                        initial: { y: 20, opacity: 0 },
                        animate: { y: 0, opacity: 1 }
                      }}
                      transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {char}
                    </motion.span>
                  ))}
                  <motion.span
                    className="ml-1 bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    CLOUD
                  </motion.span>
                </motion.h1>
              </div>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 leading-none">Intelligence Ops</p>
            </div>
          </Link>

          {/* Desktop Navigation Links - HIDDEN ON MOBILE */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all duration-300 group ${isActive(link.path) ? 'text-white' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {isActive(link.path) && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-200"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <link.icon className={`w-4 h-4 relative z-10 transition-transform duration-300 ${isActive(link.path) ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="text-xs font-bold relative z-10 tracking-tight">{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Operating Sector Selector - HIDDEN ON VERY SMALL SCREENS */}
            <div className="hidden sm:block relative">
              <button
                onClick={() => setShowSectorDropdown(!showSectorDropdown)}
                className="flex items-center gap-3 px-4 py-1.5 bg-white border border-slate-100 rounded-[1.8rem] hover:border-blue-200 transition-all shadow-sm group"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <div className="text-left pr-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Operating Sector</p>
                  <p className="text-[13px] font-black text-slate-800 leading-none">{settings.activeSector}</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-300 ${showSectorDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showSectorDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowSectorDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute left-0 mt-3 w-56 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-2 z-20"
                    >
                      {['General', 'Construction', 'Rental', 'Logistics', 'Transport'].map((sector) => (
                        <button
                          key={sector}
                          onClick={() => {
                            updateSetting('activeSector', sector);
                            setShowSectorDropdown(false);
                            toast.success(`Sector switched to ${sector}`)
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${settings.activeSector === sector ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-600'}`}
                        >
                          {sector}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all ${showNotifications ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-600 shadow-sm'}`}
              >
                <Bell className="w-4 h-4" />
                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="fixed sm:absolute top-20 sm:top-auto sm:right-0 left-4 right-4 sm:left-auto mt-3 sm:w-80 bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden z-20"
                    >
                      <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Notifications</h3>
                        <button onClick={() => toast.success('All notifications cleared')} className="text-[10px] font-black text-blue-600 uppercase tracking-tighter hover:underline">Clear All</button>
                      </div>
                      <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
                        {notifications.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => { toast.success(`Viewing: ${n.title}`); setShowNotifications(false) }}
                            className="flex items-start gap-4 w-full px-6 py-4 hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0 text-left group"
                          >
                            <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${n.color}`}>
                              <n.icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-[11px] font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">{n.title}</p>
                                <span className="text-[9px] font-bold text-slate-300 uppercase shrink-0">{n.time}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed truncate">{n.body}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile - CONDENSED ON MOBILE */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 pl-1.5 pr-1.5 sm:pr-4 py-1.5 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-all shadow-sm group"
              >
                <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-200 group-hover:border-blue-400 transition-colors">
                  <img src={user?.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-[11px] font-black text-slate-800 leading-none">{user?.name || 'Nikolas G.'}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-none">{user?.role?.name || 'Fleet Director'}</p>
                </div>
                <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-300 transition-transform duration-300" />
              </button>

              <AnimatePresence>
                {showProfile && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="fixed sm:absolute top-20 sm:top-auto sm:right-0 left-4 right-4 sm:left-auto mt-3 sm:w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-3 z-20 overflow-hidden"
                    >
                      <div className="flex flex-col gap-1">
                        <button onClick={() => { navigate('/settings'); setShowProfile(false) }} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 transition-all">
                          <User className="w-4 h-4 text-blue-500" />
                          <span className="text-xs font-bold">Profile Settings</span>
                        </button>
                        <button onClick={() => { navigate('/settings'); setShowProfile(false) }} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 transition-all">
                          <Settings className="w-4 h-4 text-indigo-500" />
                          <span className="text-xs font-bold">Preferences</span>
                        </button>
                        <div className="h-px bg-slate-50 my-1 mx-2" />
                        <button onClick={() => { logout(); navigate('/login') }} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-all">
                          <LogOut className="w-4 h-4" />
                          <span className="text-xs font-bold">Secure Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle - PREMIUM HAMBURGER */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden w-11 h-11 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100 flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <motion.div 
                animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 7 : 0 }}
                className="w-5 h-0.5 bg-current rounded-full" 
              />
              <motion.div 
                animate={{ opacity: isMobileMenuOpen ? 0 : 1, x: isMobileMenuOpen ? -10 : 0 }}
                className="w-5 h-0.5 bg-current rounded-full" 
              />
              <motion.div 
                animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -7 : 0 }}
                className="w-5 h-0.5 bg-current rounded-full" 
              />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY - LUXURY DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="xl:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[4999]"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="xl:hidden absolute top-20 left-4 right-4 bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/50 overflow-hidden z-[5000] p-6"
            >
              <div className="mb-6 pb-6 border-b border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Mission Intelligence</p>
                <div className="grid grid-cols-2 gap-4">
                  {navLinks.map((link, idx) => (
                    <motion.button
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => { navigate(link.path); setIsMobileMenuOpen(false) }}
                      className={`flex flex-col items-start gap-3 p-5 rounded-3xl border transition-all ${isActive(link.path) ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-white'}`}
                    >
                      <div className={`p-2 rounded-xl ${isActive(link.path) ? 'bg-white/20 text-white' : 'bg-white text-blue-600 shadow-sm'}`}>
                        <link.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider">{link.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                 <button 
                  onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false) }}
                  className="w-full p-5 rounded-3xl bg-slate-50 text-slate-600 text-xs font-black uppercase tracking-widest flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-500">
                      <Settings className="w-4 h-4" />
                    </div>
                    <span>System Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => { logout(); navigate('/login'); setIsMobileMenuOpen(false) }}
                  className="w-full p-5 rounded-3xl bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-red-500">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span>Secure Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar

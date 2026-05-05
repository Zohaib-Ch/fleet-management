import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Truck, 
  ShieldCheck, 
  Wrench, 
  BarChart3,
  Activity,
  Users as UsersIcon,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react'
import CustomizationModal from './CustomizationModal'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SidebarItem = ({ icon: Icon, label, active, onClick, isCollapsed }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 relative group ${
      active 
        ? 'bg-tech-blue text-white shadow-lg' 
        : 'text-slate-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-tech-blue'
    } ${isCollapsed ? 'justify-center px-0' : ''}`}
  >
    <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
    
    <AnimatePresence mode="wait">
      {!isCollapsed && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="text-sm font-semibold whitespace-nowrap overflow-hidden"
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>

    {isCollapsed && (
      <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[9999] whitespace-nowrap shadow-xl">
        {label}
      </div>
    )}
  </motion.div>
)

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved === 'true'
  })
  const [isCustomizing, setIsCustomizing] = useState(false)
  const navigate = useNavigate()
  const { user, logout, hasPermission } = useAuth()

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', isCollapsed)
  }, [isCollapsed])

  const handleNav = (tab, path) => {
    setActiveTab(tab)
    navigate(path)
  }

  const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: MapIcon, path: '/', permission: 'view_fleet' },
    { id: 'Analytics', label: 'Analytics', icon: LayoutDashboard, path: '/analytics', permission: 'view_fleet' },
    { id: 'Vehicles', label: 'Vehicles', icon: Truck, path: '/vehicles', permission: 'view_fleet' },
    { id: 'Users', label: 'Users', icon: UsersIcon, path: '/users', permission: 'all' },
    { id: 'Compliance', label: 'Compliance', icon: ShieldCheck, path: '/compliance', permission: 'all' },
    { id: 'Maintenance', label: 'Maintenance', icon: Wrench, path: '/maintenance', permission: 'maintenance_access' },
    { id: 'Reports', label: 'Reports', icon: BarChart3, path: '/reports', permission: 'all' },
  ]

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 100 : 288 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-white rounded-soft-lg p-6 flex flex-col gap-8 h-full shadow-xl shadow-black/5 border-none relative shrink-0"
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 w-6 h-6 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all z-10"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Logo */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="overflow-hidden"
              >
                <h1 className="text-2xl font-bold text-tech-slate leading-tight">JaxiFleet</h1>
                <p className="text-xs font-medium text-slate-400">Fleet command</p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className={`w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0 ${isCollapsed ? 'shadow-sm' : ''}`}>
             <Truck className="w-5 h-5 text-blue-700" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 overflow-x-hidden">
          {navItems.map((item) => (
            hasPermission(item.permission) && (
              <SidebarItem 
                key={item.id}
                icon={item.icon} 
                label={item.label} 
                active={activeTab === item.id} 
                onClick={() => handleNav(item.id, item.path)} 
                isCollapsed={isCollapsed}
              />
            )
          ))}
        </nav>

        {/* Footer Area */}
        <div className="mt-auto space-y-4">
          <div className={`p-3 bg-slate-50 rounded-[2rem] border border-white flex flex-col gap-3 transition-all ${isCollapsed ? 'items-center p-2' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-white shrink-0">
                <img src={user?.photo} alt={user?.name} className="w-full h-full object-cover" />
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex-1 overflow-hidden"
                  >
                    <p className="text-xs font-bold text-tech-slate truncate">{user?.name}</p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter truncate">{user?.role?.name}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className={`flex gap-2 w-full ${isCollapsed ? 'flex-col items-center' : ''}`}>
              <button 
                onClick={logout}
                className="flex-1 p-2.5 bg-white rounded-xl shadow-sm text-slate-400 hover:text-red-500 transition-all border border-slate-50 flex items-center justify-center"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                {!isCollapsed && <span className="ml-2 text-xs font-bold uppercase tracking-widest">Logout</span>}
              </button>
            </div>
          </div>

          <div className={`px-4 py-3 bg-indigo-600 rounded-2xl text-center shadow-lg shadow-indigo-100 flex flex-col items-center transition-all ${isCollapsed ? 'px-2 py-4' : ''}`}>
             {!isCollapsed ? (
               <>
                 <p className="text-[10px] font-bold text-indigo-100 uppercase mb-1">System Health</p>
                 <p className="text-xs font-bold text-white uppercase tracking-widest">98.4% Stable</p>
               </>
             ) : (
               <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
             )}
          </div>
        </div>
      </motion.aside>

      <CustomizationModal 
        isOpen={isCustomizing} 
        onClose={() => setIsCustomizing(false)} 
      />
    </>
  )
}

export default Sidebar

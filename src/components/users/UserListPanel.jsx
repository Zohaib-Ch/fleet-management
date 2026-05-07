import React, { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, User, Filter, ChevronDown, Check, Activity, Clock, ShieldCheck, Mail } from 'lucide-react'

const ROLE_COLOR = {
  driver:     'text-blue-600 bg-blue-50 border-blue-100',
  dispatcher: 'text-purple-600 bg-purple-50 border-purple-100',
  manager:    'text-emerald-600 bg-emerald-50 border-emerald-100',
  mechanic:   'text-amber-600 bg-amber-50 border-amber-100',
  admin:      'text-red-600 bg-red-50 border-red-100',
}

const ROLES = [
  { id: 'driver',     label: 'Drivers',     color: '#3B82F6' },
  { id: 'dispatcher', label: 'Dispatchers', color: '#8B5CF6' },
  { id: 'manager',    label: 'Managers',    color: '#10B981' },
  { id: 'mechanic',   label: 'Mechanics',   color: '#F59E0B' },
]

const UserRow = ({ user, isSelected, onClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    onClick={() => onClick(user)}
    className={`group relative flex flex-col gap-2 p-3 rounded-2xl cursor-pointer transition-all duration-300 mb-1 border ${
      isSelected  ? 'bg-blue-600 border-blue-500 shadow-premium text-white' : 'bg-white/40 border-white hover:bg-white/80 hover:shadow-premium'
    }`}
  >
    <div className="flex items-center gap-3">
      {/* Profile Portal */}
      <div className="relative shrink-0">
        <div className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all ${
          isSelected ? 'border-white/30 shadow-inner' : 'border-slate-100 shadow-sm'
        }`}>
          <img src={user.photo} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${isSelected ? 'border-blue-600' : 'border-white'} ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'} shadow-sm`}>
          {user.status === 'Active' && (
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
          )}
        </div>
      </div>

      {/* Primary Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className={`text-[13px] font-black truncate tracking-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>
            {user.name}
          </h4>
          <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${
             isSelected ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-50 border-slate-100 text-slate-400'
          }`}>
            {user.id}
          </span>
        </div>
        <p className={`text-[10px] font-bold mt-0.5 flex items-center gap-1.5 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
          <ShieldCheck className="w-2.5 h-2.5" />
          <span className="truncate">{user.role.name} · {user.department}</span>
        </p>
      </div>
    </div>

    {/* Mini Assessment Strip */}
    <div className="flex items-center justify-between pt-2 border-t border-black/5 mt-1">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Activity className={`w-2.5 h-2.5 ${isSelected ? 'text-blue-200' : 'text-emerald-500'}`} />
          <span className={`text-[9px] font-black ${isSelected ? 'text-white' : 'text-slate-700'}`}>{user.performance}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className={`w-2.5 h-2.5 ${isSelected ? 'text-blue-200' : 'text-blue-500'}`} />
          <span className={`text-[9px] font-black ${isSelected ? 'text-white' : 'text-slate-700'}`}>{user.weeklyHours} <span className="text-[7px] opacity-60 uppercase">HRS</span></span>
        </div>
      </div>
      <div className={`px-1.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tighter ${
        isSelected ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400 border border-slate-100'
      }`}>
        {user.status === 'Active' ? 'Online' : 'Standby'}
      </div>
    </div>
  </motion.div>
)

const UserListPanel = ({ users, selectedUser, onUserSelect, searchQuery, onSearch }) => {
  const [activeRoles, setActiveRoles] = useState(['driver', 'dispatcher', 'manager', 'mechanic'])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setIsFilterOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeCount = useMemo(() => users.filter(u => u.status === 'Active').length, [users])

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return users.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(q) || 
                          u.role.name.toLowerCase().includes(q) || 
                          u.department.toLowerCase().includes(q)
      const matchRole = activeRoles.includes(u.role.id)
      return matchSearch && matchRole
    })
  }, [users, searchQuery, activeRoles])

  const toggleRole = (roleId) => {
    if (roleId === 'ALL') setActiveRoles(['driver', 'dispatcher', 'manager', 'mechanic'])
    else if (roleId === 'NONE') setActiveRoles([])
    else {
      setActiveRoles(prev => prev.includes(roleId) ? prev.filter(r => r !== roleId) : [...prev, roleId])
    }
  }

  return (
    <div className="w-full lg:w-[300px] shrink-0 flex flex-col bg-white/40 backdrop-blur-2xl rounded-[2rem] shadow-premium border border-white overflow-hidden h-full">
      
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[15px] font-black text-slate-800 tracking-tight">Personnel Center</h2>
            <div className="flex items-center gap-1.5 mt-1">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{activeCount} Members Active</p>
            </div>
          </div>
          
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${
                isFilterOpen ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-white border-white text-slate-400 hover:text-slate-600'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-premium border border-slate-100 p-2 z-50"
                >
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 py-1 mb-1">Role Matrix</p>
                  {ROLES.map(role => {
                    const isActive = activeRoles.includes(role.id)
                    return (
                      <button 
                        key={role.id}
                        onClick={() => toggleRole(role.id)}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-all group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: role.color }} />
                          <span className={`text-[11px] font-bold ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>{role.label}</span>
                        </div>
                        <div className={`w-4 h-4 rounded-lg border flex items-center justify-center transition-all ${isActive ? 'bg-blue-600 border-blue-600' : 'border-slate-200'}`}>
                          {isActive && <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />}
                        </div>
                      </button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-blue-600 transition-all" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search team members..."
            className="w-full pl-9 pr-3 py-2.5 text-[11px] font-bold bg-white border border-white rounded-[1.1rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100/50 transition-all placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar no-scrollbar px-3 py-2 space-y-1">
        {filtered.length > 0 ? (
          filtered.map(u => (
            <UserRow
              key={u.id}
              user={u}
              isSelected={selectedUser?.id === u.id}
              onClick={onUserSelect}
            />
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Members Found</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/40 bg-white/40">
        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-center">Personnel Intelligence v2.0</p>
      </div>
    </div>
  )
}

export default UserListPanel

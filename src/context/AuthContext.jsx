import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

const roles = {
  MANAGEMENT: {
    name: 'Management',
    access: 'Full',
    permissions: ['all']
  },
  DISPATCHER: {
    name: 'Dispatcher',
    access: 'Restricted',
    permissions: ['view_fleet', 'dispatch_commands', 'manage_tasks']
  },
  MECHANIC: {
    name: 'Mechanic',
    access: 'Technical',
    permissions: ['view_fleet', 'maintenance_access']
  },
  EXTERNAL_PARTNER: {
    name: 'External Partner',
    access: 'Read-only',
    permissions: ['view_assigned_fleet']
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('fleet_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, roleKey) => {
    const userData = {
      email,
      role: roles[roleKey],
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      photo: `https://i.pravatar.cc/150?u=${email}`
    }
    setUser(userData)
    localStorage.setItem('fleet_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('fleet_user')
  }

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role.permissions.includes('all')) return true
    return user.role.permissions.includes(permission)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

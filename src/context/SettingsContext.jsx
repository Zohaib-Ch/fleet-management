import React, { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const defaultSettings = {
      showFleetList: true,
      enableHoverCards: true,
      showKPICards: true,
      showMap: true,
      showHealthCircle: true,
      showActionRequired: true,
      showIndustryWidgets: true,
      showVehicleList: true,
      showVehicleKPIs: true,
      showVehicleGrid: true,
      showMaintenanceLog: true,
      showUserKPIs: true,
      showUserGrid: true,
      showAuditLog: true,
      showReportKPIs: true,
      showConsumptionAnalysis: true,
      theme: 'light',
      role: 'Dispatcher',
      isEditMode: false,
      dashboardOrder: ['kpis', 'workspace', 'vehicles'],
      analyticsRange: '30D',
      monitorViewMode: 'all',
      activeSector: 'General',
      monitorStatsVisibility: {
        active: true,
        moving: true,
        efficiency: true,
        fuel: true,
        maintenance: true,
        resting: true,
        alerts: true
      },
      monitorStatusFilters: ['Moving', 'Resting', 'Idle', 'Maintenance']
    }
    const saved = localStorage.getItem('fleet_settings')
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings
  })

  useEffect(() => {
    localStorage.setItem('fleet_settings', JSON.stringify(settings))
    // Apply theme to document root for CSS cascade
    const root = document.documentElement
    if (settings.theme === 'dark') {
      root.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      root.classList.remove('dark')
      document.body.classList.remove('dark')
    }
  }, [settings])

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const toggleMonitorStat = (id) => {
    setSettings(prev => ({
      ...prev,
      monitorStatsVisibility: {
        ...prev.monitorStatsVisibility,
        [id]: !prev.monitorStatsVisibility[id]
      }
    }))
  }

  const updateMonitorStatusFilters = (filters) => {
    setSettings(prev => ({ ...prev, monitorStatusFilters: filters }))
  }

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      toggleSetting, 
      updateSetting, 
      toggleMonitorStat,
      updateMonitorStatusFilters
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)

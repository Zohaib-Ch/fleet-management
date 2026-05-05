import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import VehicleDetail from './pages/VehicleDetail'
import Monitor from './pages/Monitor'
import VehiclesPage from './pages/Vehicles'
import UsersPage from './pages/Users'
import UserProfile from './pages/UserProfile'
import ReportsPage from './pages/Reports'
import CompliancePage from './pages/Compliance'
import MaintenancePage from './pages/Maintenance'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/Settings'
import CommandPalette from './components/CommandPalette'
import { SettingsProvider } from './context/SettingsContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import FAB from './components/FAB'
import { Toaster } from 'react-hot-toast'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) return <div className="h-screen w-screen bg-soft-bg flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>

  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <Toaster position="top-right" />
          <CommandPalette />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<PrivateRoute><Monitor /></PrivateRoute>} />
            <Route path="/analytics" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/map" element={<Navigate to="/" replace />} />
            <Route path="/vehicles" element={<PrivateRoute><VehiclesPage /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
            <Route path="/compliance" element={<PrivateRoute><CompliancePage /></PrivateRoute>} />
            <Route path="/maintenance" element={<PrivateRoute><MaintenancePage /></PrivateRoute>} />
            <Route path="/profile/:id" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            <Route path="/vehicle/:id" element={<PrivateRoute><VehicleDetail /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <FABWrapper />
        </Router>
      </SettingsProvider>
    </AuthProvider>
  )
}

// Wrapper disabled per user request
const FABWrapper = () => {
  return null
}

export default App

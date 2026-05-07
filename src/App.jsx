import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

// ── Lazy-loaded pages ─────────────────────────────────────────────────────────
const Monitor = lazy(() => import('./pages/Monitor'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const VehiclesPage = lazy(() => import('./pages/Vehicles'))
const UsersPage = lazy(() => import('./pages/Users'))
const ReportsPage = lazy(() => import('./pages/Reports'))
const CompliancePage = lazy(() => import('./pages/Compliance'))
const MaintenancePage = lazy(() => import('./pages/Maintenance'))
const SettingsPage = lazy(() => import('./pages/Settings'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const UserProfile = lazy(() => import('./pages/UserProfile'))
const VehicleDetail = lazy(() => import('./pages/VehicleDetail'))
const CommandPalette = lazy(() => import('./components/CommandPalette'))

// ── Loading Spinner ───────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="h-screen w-screen bg-[#F0F4F8] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Module</p>
    </div>
  </div>
)

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
          <Suspense fallback={null}>
            <CommandPalette />
          </Suspense>
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
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

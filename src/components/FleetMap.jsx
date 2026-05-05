import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { mockVehicles } from '../mockData'
import { motion, AnimatePresence } from 'framer-motion'
import { Truck, Activity, MapPin, Navigation, User, AlertTriangle, Battery, Send, UserPlus, Eye, Bell, ChevronRight, MessageSquare, History, X, Paperclip, Smile, Maximize2 } from 'lucide-react'
import QuickActionMenu from './QuickActionMenu'
import AssetIntelligenceModal from './AssetIntelligenceModal'
import CommandDispatchModal from './CommandDispatchModal'
import { useMagnetic } from '../hooks/useMagnetic'
import MagneticButton from './MagneticButton'
import toast from 'react-hot-toast'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { useAuth } from '../context/AuthContext'

// Custom Luxury Marker
const createCustomIcon = (status) => {
  const color = status === 'Online' ? '#10B981' : '#F59E0B'
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-10 h-10 bg-white/40 rounded-full animate-ping opacity-20"></div>
        <div class="w-8 h-8 bg-white rounded-xl shadow-lg border-2 border-white flex items-center justify-center relative z-10">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-2.39-2.93a1 1 0 0 0-.77-.37H15v7a1 1 0 0 0 1 1h2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
        </div>
        <div class="absolute -top-1 -right-1 w-3 h-3 ${status === 'Online' ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full border-2 border-white shadow-sm"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

const FleetMap = ({ onAssetClick }) => {
  const [menuConfig, setMenuConfig] = React.useState({ isOpen: false, x: 0, y: 0, assetId: '' })
  const [intelligenceOpen, setIntelligenceOpen] = React.useState(false)
  const [commandOpen, setCommandOpen] = React.useState(false)
  const [selectedVehicle, setSelectedVehicle] = React.useState(null)
  const [isChatOpen, setIsChatOpen] = React.useState(false)
  const { hasPermission } = useAuth()

  const center = [56.1629, 10.2039] // Denmark center

  const handlePing = (id) => {
    const pingToast = toast.loading(`Pinging asset ${id}...`, {
      style: { minWidth: '200px' }
    })

    // Simulate satellite latency
    setTimeout(() => {
      toast.success(`Asset ${id} responsive (Latency: 42ms)`, {
        id: pingToast,
      })
    }, 1200)
  }

  const openIntelligence = (id) => {
    const vehicle = mockVehicles.find(v => v.id === id)
    setSelectedVehicle(vehicle)
    setIntelligenceOpen(true)
  }

  const openCommand = (id) => {
    const vehicle = mockVehicles.find(v => v.id === id)
    setSelectedVehicle(vehicle)
    setCommandOpen(true)
  }

  const handleAssignDriver = (id) => {
    toast.error("Driver Assignment API unavailable. Please check system permissions.", {
      icon: '⚠️',
    })
  }

  const mapActions = [
    { label: `Ping ${menuConfig.assetId}`, icon: Bell, onClick: () => handlePing(menuConfig.assetId) },
    hasPermission('all') && { label: 'Assign Driver', icon: UserPlus, onClick: () => handleAssignDriver(menuConfig.assetId) },
    (hasPermission('maintenance_access') || hasPermission('all')) && { label: 'Asset Intelligence', icon: Eye, onClick: () => openIntelligence(menuConfig.assetId) },
    (hasPermission('dispatch_commands') || hasPermission('all')) && { label: 'Send Command', icon: Send, onClick: () => openCommand(menuConfig.assetId) },
  ].filter(Boolean)

  return (
    <div className="w-full h-full relative group">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', background: '#F8FAFC' }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          showCoverageOnHover={false}
        >
          {mockVehicles.filter(v => v.lat && v.lng).map((vehicle) => (
            <Marker
              key={vehicle.id}
              position={[vehicle.lat, vehicle.lng]}
              icon={createCustomIcon(vehicle.status === 'Moving' ? 'Online' : 'Resting')}
              eventHandlers={{
                click: () => {
                  if (onAssetClick) onAssetClick(vehicle)
                },
                mouseover: (e) => {
                  e.target.openPopup()
                },
                contextmenu: (e) => {
                  L.DomEvent.stopPropagation(e)
                  setMenuConfig({
                    isOpen: true,
                    x: e.originalEvent.clientX,
                    y: e.originalEvent.clientY,
                    assetId: vehicle.id
                  })
                }
              }}
            >
              <Popup className="premium-map-popup">
                <div className="p-2 min-w-[220px]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Truck className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-tech-slate">{vehicle.id}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{vehicle.name}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${vehicle.status === 'Online' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {vehicle.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 p-2 rounded-xl border border-white">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Fuel Level</p>
                      <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-blue-500" />
                        <span className="text-xs font-bold text-tech-slate">{vehicle.vitals?.fuel}%</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-white">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Battery</p>
                      <div className="flex items-center gap-2">
                        <Battery className="w-3 h-3 text-emerald-500" />
                        <span className="text-xs font-bold text-tech-slate">{vehicle.vitals?.battery}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-50">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedVehicle(vehicle)
                        setIsChatOpen(true)
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-bold shadow-lg shadow-blue-100 transition-colors hover:bg-blue-700"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Message
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: '#f8fafc' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openIntelligence(vehicle.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-slate-500 rounded-xl text-[10px] font-bold border border-slate-100 shadow-sm transition-colors"
                    >
                      <History className="w-3 h-3" />
                      History
                    </motion.button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Floating Map Controls */}
      <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => {
            const el = document.documentElement;
            if (!document.fullscreenElement) {
              el.requestFullscreen().catch(err => {
                toast.error(`Error attempting to enable full-screen mode: ${err.message}`);
              });
            } else {
              document.exitFullscreen();
            }
          }}
          className="w-10 h-10 bg-white rounded-xl shadow-premium flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-white"
          title="Fullscreen"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 bg-white rounded-xl shadow-premium flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-white">
          <Navigation className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 bg-white rounded-xl shadow-premium flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-white">
          <MapPin className="w-5 h-5" />
        </button>
      </div>

      <QuickActionMenu
        isOpen={menuConfig.isOpen}
        x={menuConfig.x}
        y={menuConfig.y}
        onClose={() => setMenuConfig({ ...menuConfig, isOpen: false })}
        actions={mapActions}
      />

      <AssetIntelligenceModal
        isOpen={intelligenceOpen}
        onClose={() => setIntelligenceOpen(false)}
        vehicle={selectedVehicle}
      />

      <CommandDispatchModal
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
        vehicle={selectedVehicle}
      />

      {/* Side Chat Popup (Left Side) */}
      <AnimatePresence>
        {isChatOpen && selectedVehicle && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-[5000]"
            />
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 24, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-24 bottom-24 w-[380px] bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] z-[5001] border border-white/50 overflow-hidden flex flex-col"
            >
              {/* Chat Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                    <img src={selectedVehicle.driver?.photo || `https://i.pravatar.cc/150?u=${selectedVehicle.id}`} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-tech-slate">{selectedVehicle.driver?.name}</h4>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Dispatch</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                <div className="flex justify-center mb-6">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Today</span>
                </div>

                <div className="flex flex-col gap-1 max-w-[80%]">
                  <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none text-xs font-medium text-slate-700 leading-relaxed">
                    Hello control center, asset {selectedVehicle.id} is now on route. Satellite signal is stable.
                  </div>
                  <span className="text-[9px] font-bold text-slate-300 ml-1">09:42 AM</span>
                </div>

                <div className="flex flex-col items-end gap-1 ml-auto max-w-[80%]">
                  <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none text-xs font-medium text-white shadow-lg shadow-blue-100 leading-relaxed">
                    Copy that. We are monitoring your telemetry. Stay on the planned corridor.
                  </div>
                  <span className="text-[9px] font-bold text-slate-300 mr-1">09:43 AM</span>
                </div>

                <div className="flex flex-col gap-1 max-w-[80%]">
                  <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none text-xs font-medium text-slate-700 leading-relaxed">
                    Acknowledged. Requesting permission to stop for scheduled maintenance in 20km.
                  </div>
                  <span className="text-[9px] font-bold text-slate-300 ml-1">09:45 AM</span>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                <div className="relative flex items-center gap-3">
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-4 px-1">
                  <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-blue-600 transition-colors">
                    <Smile className="w-3.5 h-3.5" />
                    Quick Actions
                  </button>
                  <span className="text-[9px] font-bold text-slate-300">SECURE CHANNEL</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FleetMap

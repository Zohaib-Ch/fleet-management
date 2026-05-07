// ─── UTILS ────────────────────────────────────────────────────────────────────
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
let _seed = 42
const seeded = () => { _seed = (_seed * 1664525 + 1013904223) & 0xffffffff; return Math.abs(_seed) / 0x7fffffff }
const srnd = (min, max) => Math.floor(seeded() * (max - min + 1)) + min
const spick = (arr) => arr[srnd(0, arr.length - 1)]

// ─── STORAGE KEYS ─────────────────────────────────────────────────────────────
const STORAGE_KEY_VEHICLES = 'fleet_vehicles_v1'
const STORAGE_KEY_USERS = 'fleet_users_v1'
const STORAGE_KEY_GROUPS = 'fleet_groups_v1'

// ─── ASSETS ───────────────────────────────────────────────────────────────────
const TRUCK_IMAGES = [
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7',
  'https://images.unsplash.com/photo-1586191582056-96fcf2008706',
  'https://images.unsplash.com/photo-1591768793355-74d75b385e80',
  'https://images.unsplash.com/photo-1565891741441-64926e441838',
  'https://images.unsplash.com/photo-1606206591513-ad98a44c7f76',
  'https://images.unsplash.com/photo-1501700489910-fb244207186a',
  'https://images.unsplash.com/photo-1519003300449-424ad040507b',
]

const USER_PHOTOS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
]

// ─── DATA POOLS ───────────────────────────────────────────────────────────────
const vehicleModels = {
  Truck: ['Scania R500', 'Volvo FH16', 'Mercedes Actros', 'MAN TGX'],
  Van: ['Ford Transit', 'Mercedes Sprinter', 'VW Crafter'],
  Car: ['Tesla Model 3', 'VW ID.4', 'Skoda Enyaq'],
  Excavator: ['CAT 320', 'Komatsu PC210', 'JCB JS220']
}
const vehicleTypes = ['Truck', 'Van', 'Car', 'Excavator']

// ─── PERSISTENCE HELPERS ──────────────────────────────────────────────────────
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

const loadFromStorage = (key) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : null
  } catch (e) {
    console.error('Failed to load from localStorage:', e)
    return null
  }
}

// ─── INITIALIZATION ───────────────────────────────────────────────────────────
const initialUsers = [
  { id: 'usr-001', name: 'Nikolas G.', role: { id: 'admin', name: 'Fleet Director' }, status: 'Active', email: 'nikolas@fleet.com', phone: '+45 20 48 19 01', photo: USER_PHOTOS[0] + '?auto=format&fit=crop&q=80&w=150', department: 'Executive', joinDate: 'Jan 2022' },
  { id: 'usr-002', name: 'Sarah Miller', role: { id: 'dispatcher', name: 'Regional Dispatch' }, status: 'Active', email: 'sarah@fleet.com', phone: '+45 20 48 19 02', photo: USER_PHOTOS[6] + '?auto=format&fit=crop&q=80&w=150', department: 'Dispatch', joinDate: 'Mar 2022' },
  { id: 'usr-003', name: 'Alex Jensen', role: { id: 'driver', name: 'Senior Driver' }, status: 'Active', email: 'alex@fleet.com', phone: '+45 20 48 19 03', photo: USER_PHOTOS[1] + '?auto=format&fit=crop&q=80&w=150', department: 'Logistics', joinDate: 'Feb 2022', performance: 98, compliance: 'Compliant' },
  { id: 'usr-004', name: 'Elena Vance', role: { id: 'driver', name: 'Logistics Specialist' }, status: 'Active', email: 'elena@fleet.com', phone: '+45 20 48 19 04', photo: USER_PHOTOS[7] + '?auto=format&fit=crop&q=80&w=150', department: 'Logistics', joinDate: 'May 2022', performance: 95, compliance: 'Compliant' },
  { id: 'usr-005', name: 'Marcus Olsen', role: { id: 'driver', name: 'Cold Chain Lead' }, status: 'Active', email: 'marcus@fleet.com', phone: '+45 20 48 19 05', photo: USER_PHOTOS[2] + '?auto=format&fit=crop&q=80&w=150', department: 'Cold Chain', joinDate: 'Jan 2023', performance: 92, compliance: 'Compliant' },
  { id: 'usr-006', name: 'Sofia Chen', role: { id: 'driver', name: 'Urban Delivery' }, status: 'Active', email: 'sofia@fleet.com', phone: '+45 20 48 19 06', photo: USER_PHOTOS[8] + '?auto=format&fit=crop&q=80&w=150', department: 'Operations', joinDate: 'Jun 2023', performance: 88, compliance: 'Compliant' },
  { id: 'usr-007', name: 'Robert Holm', role: { id: 'mechanic', name: 'Lead Engineer' }, status: 'Active', email: 'robert@fleet.com', phone: '+45 20 48 19 07', photo: USER_PHOTOS[3] + '?auto=format&fit=crop&q=80&w=150', department: 'Maintenance', joinDate: 'Sep 2022' },
  { id: 'usr-008', name: 'Jane Smith', role: { id: 'driver', name: 'Heavy Haul' }, status: 'Active', email: 'jane@fleet.com', phone: '+45 20 48 19 08', photo: USER_PHOTOS[9] + '?auto=format&fit=crop&q=80&w=150', department: 'Logistics', joinDate: 'Nov 2022', performance: 94, compliance: 'Compliant' },
  { id: 'usr-009', name: 'Lars Poulsen', role: { id: 'driver', name: 'Regional Driver' }, status: 'Active', email: 'lars@fleet.com', phone: '+45 20 48 19 09', photo: USER_PHOTOS[4] + '?auto=format&fit=crop&q=80&w=150', department: 'Logistics', joinDate: 'Jan 2024', performance: 85, compliance: 'Non-Compliant' },
  { id: 'usr-010', name: 'Michael Beck', role: { id: 'driver', name: 'Long Haul' }, status: 'Active', email: 'michael@fleet.com', phone: '+45 20 48 19 10', photo: USER_PHOTOS[5] + '?auto=format&fit=crop&q=80&w=150', department: 'Logistics', joinDate: 'Apr 2023', performance: 91, compliance: 'Compliant' },
]

const generateInitialVehicles = (users) => {
  const drivers = users.filter(u => u.role.id === 'driver')
  const vehicles = []
    const centerLat = 56.1629, centerLng = 10.1439 // Shifted slightly west to avoid water
    for (let i = 0; i < 40; i++) {
      const driver = drivers[i % drivers.length]
      const type = vehicleTypes[i % vehicleTypes.length]
      const modelsForType = vehicleModels[type]
      const model = modelsForType[i % modelsForType.length]
      const status = i % 4 === 0 ? 'Resting' : i % 7 === 0 ? 'Maintenance' : 'Moving'
      const id = `${type.substring(0, 2).toUpperCase()}-${1000 + i}`
      const photo = TRUCK_IMAGES[i % TRUCK_IMAGES.length] + '?auto=format&fit=crop&q=80&w=800'

      vehicles.push({
        id,
        name: `${model} #${i + 1}`,
        model,
        type,
        plate: `DK ${srnd(10000, 99999)}`,
        year: srnd(2020, 2024),
        status,
        speed: status === 'Moving' ? srnd(45, 88) : 0,
        lat: centerLat + (seeded() - 0.5) * 0.08, // Tightened
        lng: centerLng + (seeded() - 0.5) * 0.1,  // Tightened
      photo,
      zone: 'Zone A',
      driver: {
        id: driver.id,
        name: driver.name,
        photo: driver.photo,
        email: driver.email,
        phone: driver.phone
      },
      vitals: {
        fuel: srnd(15, 95),
        battery: srnd(60, 100),
        temp: srnd(15, 45),
        engineLoad: srnd(20, 75),
        co2: (srnd(100, 200) / 100).toFixed(2),
      },
      odometer: srnd(500, 150),
      nextService: `${srnd(500, 5000)} km`,
      alerts: status === 'Maintenance' ? 1 : 0
    })
  }
  return vehicles
}

// ─── DATA EXPORTS (HYDRATED) ──────────────────────────────────────────────────
export let mockUsers = loadFromStorage(STORAGE_KEY_USERS) || initialUsers
if (!loadFromStorage(STORAGE_KEY_USERS)) saveToStorage(STORAGE_KEY_USERS, mockUsers)

export let mockVehicles = loadFromStorage(STORAGE_KEY_VEHICLES) || generateInitialVehicles(mockUsers)
if (!loadFromStorage(STORAGE_KEY_VEHICLES)) saveToStorage(STORAGE_KEY_VEHICLES, mockVehicles)

export let mockVehicleGroups = loadFromStorage(STORAGE_KEY_GROUPS) || [
  { id: 'grp-01', name: 'Logistics Fleet', icon: '🚛', color: '#2563EB', count: 18 },
  { id: 'grp-02', name: 'Cold Chain', icon: '❄️', color: '#06B6D4', count: 12 },
  { id: 'grp-03', name: 'Regional Ops', icon: '📍', color: '#10B981', count: 10 },
]
if (!loadFromStorage(STORAGE_KEY_GROUPS)) saveToStorage(STORAGE_KEY_GROUPS, mockVehicleGroups)

// ─── REFRESH STATS HELPER ─────────────────────────────────────────────────────
export const getFleetKPIs = (vehicles = mockVehicles) => ({
  totalAssets: vehicles.length,
  activeNow: vehicles.filter(v => v.status !== 'Maintenance').length,
  moving: vehicles.filter(v => v.status === 'Moving').length,
  resting: vehicles.filter(v => v.status === 'Resting').length,
  maintenance: vehicles.filter(v => v.status === 'Maintenance').length,
  compliance: '94.2%',
  uptime: '98.8%',
  co2Today: '1,240 kg',
})

// ─── PUBLIC MUTATION API ──────────────────────────────────────────────────────
export const addVehicle = (vehicle) => {
  mockVehicles = [vehicle, ...mockVehicles]
  saveToStorage(STORAGE_KEY_VEHICLES, mockVehicles)
  return mockVehicles
}

export const updateVehicle = (id, updates) => {
  mockVehicles = mockVehicles.map(v => v.id === id ? { ...v, ...updates } : v)
  saveToStorage(STORAGE_KEY_VEHICLES, mockVehicles)
  return mockVehicles
}

export const deleteVehicle = (id) => {
  mockVehicles = mockVehicles.filter(v => v.id !== id)
  saveToStorage(STORAGE_KEY_VEHICLES, mockVehicles)
  return mockVehicles
}

export const addUser = (user) => {
  mockUsers = [user, ...mockUsers]
  saveToStorage(STORAGE_KEY_USERS, mockUsers)
  return mockUsers
}

export const updateUser = (id, updates) => {
  mockUsers = mockUsers.map(u => u.id === id ? { ...u, ...updates } : u)
  saveToStorage(STORAGE_KEY_USERS, mockUsers)
  return mockUsers
}

// ─── STATIC KPI EXPORTS (FOR BACKWARD COMPAT) ─────────────────────────────────
export const mockFleetKPIs = getFleetKPIs()
export const mockMonitorStats = [
  { id: 'active', label: 'Active Fleet', value: mockVehicles.filter(v => v.status !== 'Maintenance').length.toString(), sub: 'In Operation', icon: 'Truck', color: '#2563EB', visible: true, trend: '+4%' },
  { id: 'moving', label: 'On Road', value: mockVehicles.filter(v => v.status === 'Moving').length.toString(), sub: 'Moving Assets', icon: 'Activity', color: '#10B981', visible: true, trend: '+12%' },
  { id: 'efficiency', label: 'Efficiency', value: '94.2', unit: '%', sub: 'Fleet Score', icon: 'Zap', color: '#8B5CF6', visible: true, trend: '+2.1%' },
  { id: 'fuel', label: 'Fuel Usage', value: '32.4', unit: 'L/100', sub: 'Avg Consumption', icon: 'ClipboardCheck', color: '#6366F1', visible: true, trend: '-0.8%' },
  { id: 'utilization', label: 'Utilization', value: '88.5', unit: '%', sub: 'Time in Motion', icon: 'TrendingUp', color: '#0EA5E9', visible: true, trend: '+3.4%' },
  { id: 'co2', label: 'CO2 Footprint', value: '1.2', unit: 'Tons', sub: 'Total Emission', icon: 'Leaf', color: '#10B981', visible: true, trend: '-5.2%' },
  { id: 'safety', label: 'Driver Safety', value: '9.4', unit: '/10', sub: 'Fleet Avg', icon: 'ShieldCheck', color: '#F43F5E', visible: true, trend: '+0.3%' },
  { id: 'maintenance', label: 'Service', value: mockVehicles.filter(v => v.status === 'Maintenance').length.toString(), sub: 'In Workshop', icon: 'Wrench', color: '#64748B', visible: true },
  { id: 'renewals', label: 'Renewals', value: '2', sub: 'Insurance/Tax', icon: 'Calendar', color: '#F59E0B', visible: true },
  { id: 'resting', label: 'Resting', value: mockVehicles.filter(v => v.status === 'Resting').length.toString(), sub: 'Driver Break', icon: 'Coffee', color: '#F59E0B', visible: true },
  { id: 'alerts', label: 'Incidents', value: '3', sub: 'Critical Alerts', icon: 'AlertTriangle', color: '#EF4444', visible: true },
]

// ─── CHART DATA ───────────────────────────────────────────────────────────────
export const mockChartData = {
  fuelWeekly: [
    { h: 'Mon', v: 85 }, { h: 'Tue', v: 92 }, { h: 'Wed', v: 88 },
    { h: 'Thu', v: 94 }, { h: 'Fri', v: 90 }, { h: 'Sat', v: 75 }, { h: 'Sun', v: 70 }
  ],
  fuelHourly: [
    { h: '00:00', v: 45 }, { h: '02:00', v: 42 }, { h: '04:00', v: 48 },
    { h: '06:00', v: 65 }, { h: '08:00', v: 92 }, { h: '10:00', v: 88 },
    { h: '12:00', v: 95 }, { h: '14:00', v: 91 }, { h: '16:00', v: 84 },
    { h: '18:00', v: 76 }, { h: '20:00', v: 62 }, { h: '22:00', v: 50 }
  ],
  performance6mo: [
    { month: 'Jan', performance: 88 }, { month: 'Feb', performance: 90 },
    { month: 'Mar', performance: 92 }, { month: 'Apr', performance: 95 },
    { month: 'May', performance: 94 }, { month: 'Jun', performance: 98 }
  ],
  hourlyFleetStatus: [
    { h: '8:00', available: 3, inWork: 6, service: 0 },
    { h: '9:00', available: 3, inWork: 5, service: 1 },
    { h: '10:00', available: 3, inWork: 7, service: 2 },
    { h: '11:00', available: 1, inWork: 7, service: 1 },
    { h: '12:00', available: 1, inWork: 6, service: 1 },
    { h: '13:00', available: 4, inWork: 4, service: 1 },
    { h: '14:00', available: 3, inWork: 4, service: 2 },
    { h: '15:00', available: 5, inWork: 4, service: 1 },
    { h: '16:00', available: 4, inWork: 4, service: 3 },
    { h: '17:00', available: 3, inWork: 4, service: 2 },
    { h: '18:00', available: 5, inWork: 1, service: 3 },
    { h: '19:00', available: 6, inWork: 2, service: 1 },
  ],
  vehicleTypeDistribution: [
    { name: 'PC', value: 55.56, color: '#2DD4BF' },
    { name: 'Pass Van', value: 11.11, color: '#8B5CF6' },
    { name: 'Van', value: 22.22, color: '#3B82F6' },
    { name: 'EV', value: 11.11, color: '#10B981' },
    { name: 'Bus', value: 5.5, color: '#84CC16' },
  ],
  dailyFleetComposition: Array.from({ length: 30 }, (_, i) => ({
    d: `${i + 1}.05`,
    available: srnd(40, 160),
    service: srnd(10, 40),
    inWork: srnd(20, 140),
  }))
}

export const mockAlerts = [
  { id: 'ALT-001', type: 'Critical', title: 'Engine Misfire', desc: 'FT-1007 · Mercedes Actros', time: '2m ago', icon: 'AlertTriangle', color: 'red' },
  { id: 'ALT-002', type: 'Warning', title: 'Geofence Breach', desc: 'FT-1012 · Zone B Exit', time: '15m ago', icon: 'MapPin', color: 'amber' },
]

export const mockInventory = [
  { label: 'Transmission Kits', qty: '04 Units', status: 'Optimal', stock: 4 },
  { label: 'Hydraulic Pumps', qty: '02 Units', status: 'Low Stock', stock: 2 },
  { label: 'Brake Modules', qty: '12 Units', status: 'Optimal', stock: 12 },
  { label: 'Oil Filter Pack', qty: '08 Units', status: 'Optimal', stock: 8 },
]

export const mockMaintenanceTickets = [
  { id: 'TIC-1024', name: 'Scania R500 #01', type: 'Engine Overhaul', location: 'Main Workshop', cost: '$4,280', due: 'In Progress', progress: 65, urgency: 'High' },
  { id: 'TIC-1025', name: 'Volvo FH16 #04', type: 'Brake System Update', location: 'Regional Hub', cost: '$1,150', due: 'Tomorrow', progress: 15, urgency: 'Medium' },
  { id: 'TIC-1028', name: 'Mercedes Actros #12', type: 'Electrical Audit', location: 'Main Workshop', cost: '$850', due: '2 Days Left', progress: 0, urgency: 'Low' },
]

export const mockServiceHistory = [
  { name: 'Volvo FH16 #02', type: 'Full Service', date: '22 Apr 2024', cost: '$2,400' },
  { name: 'Scania R500 #08', type: 'Hydraulic Repair', date: '20 Apr 2024', cost: '$1,850' },
  { name: 'MAN TGX #15', type: 'Tire Replacement', date: '18 Apr 2024', cost: '$900' },
]

export const mockMechanics = [
  { name: 'Erik Nielsen', specialty: 'Engine Specialist', status: 'On Duty', efficiency: 98, tasks: 3, photo: 'https://i.pravatar.cc/150?u=erik' },
  { name: 'Lars Thomsen', specialty: 'Electrical Systems', status: 'In Break', efficiency: 92, tasks: 1, photo: 'https://i.pravatar.cc/150?u=lars' },
  { name: 'Hans Moller', specialty: 'Hydraulic Expert', status: 'On Duty', efficiency: 95, tasks: 4, photo: 'https://i.pravatar.cc/150?u=hans' },
]

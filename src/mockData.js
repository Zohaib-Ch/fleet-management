// ─── Seed data pools ─────────────────────────────────────────────────────────
const firstNames = ['Alex', 'Marcus', 'Sarah', 'Robert', 'Elena', 'John', 'Jane', 'Michael', 'Sofia', 'Lars', 'Erik', 'Mette', 'Kristina', 'Anders', 'Thomas', 'Peter', 'Henrik', 'Jesper', 'Morten', 'Christian', 'Rania', 'Saima', 'Oliver', 'Emma', 'Lukas', 'Anna', 'Nikolaj', 'Ida', 'Magnus', 'Freja']
const lastNames = ['Jensen', 'Olsen', 'Connor', 'Miller', 'Vance', 'Doe', 'Smith', 'Chen', 'Ahmed', 'Nielsen', 'Poulsen', 'Andersen', 'Holm', 'Hansen', 'Petersen', 'Larsen', 'Rasmussen', 'Christensen', 'Bak', 'Costa', 'Mushtaq', 'Ataei', 'Berg', 'Lund', 'Dahl', 'Borg', 'Knudsen', 'Madsen', 'Riber', 'Holt']
const vehicleModels = ['Volvo EC220', 'Scania P410', 'Liebherr LTM 1050', 'Mercedes-Benz Actros', 'MAN TGS 26.480', 'DAF XF 480', 'Iveco Stralis NP', 'Renault T 480', 'CAT 320 GC', 'Komatsu PC210', 'Scania R500', 'Volvo FMX', 'Volvo FM 460', 'MAN TGL 12.220', 'Scania G450', 'DAF CF 330', 'Liebherr LTM 1100', 'CAT 336', 'Komatsu PC360', 'Mercedes Arocs']
const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Zone F', 'North Depot', 'South Depot', 'Main Hub', 'East Terminal']
const locations = ['Main Workshop', 'Zone A Depot', 'Zone B Depot', 'Site Alpha', 'Site Beta', 'North Terminal', 'South Hub', 'East Yard', 'Workshop 2', 'Field Station']
const specialties = ['Engine Diagnostics', 'Braking Systems', 'Hydraulics & Fluids', 'Electrical Systems', 'Transmission & Gearbox', 'Tire & Suspension', 'Fuel Systems', 'Cooling Systems', 'Exhaust & Emissions', 'Structural Inspection']
const departments = ['Dispatching', 'Operations', 'North Region', 'South Region', 'Workshop East', 'Workshop West', 'Cold Chain', 'Heavy Machinery', 'Executive', 'Logistics']

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

// ─── Vehicle Groups (for Monitor Tab left panel) ──────────────────────────────
export const mockVehicleGroups = [
  { id: 'grp-01', name: 'Service Vehicles',  icon: '🔧', color: '#2563EB', count: 20, description: 'Workshop & maintenance fleet' },
  { id: 'grp-02', name: 'Delivery Fleet',    icon: '🚛', color: '#10B981', count: 25, description: 'Long haul & regional delivery' },
  { id: 'grp-03', name: 'Heavy Machinery',   icon: '⚙️', color: '#F59E0B', count: 18, description: 'Excavators, cranes & loaders' },
  { id: 'grp-04', name: 'Reserve Units',     icon: '🚌', color: '#8B5CF6', count: 15, description: 'Standby & backup vehicles' },
  { id: 'grp-05', name: 'Electric Fleet',    icon: '⚡', color: '#06B6D4', count: 22, description: 'Zero-emission EV assets' },
  { id: 'grp-06', name: 'Cold Chain',        icon: '❄️', color: '#3B82F6', count: 20, description: 'Temperature-controlled transport' },
]
const pick = (arr) => arr[rnd(0, arr.length - 1)]
const uid = (prefix, i) => `${prefix}-${String(i).padStart(4, '0')}`

// ─── Deterministic seeded random (stable across renders) ─────────────────────
let _seed = 42
const seeded = () => { _seed = (_seed * 1664525 + 1013904223) & 0xffffffff; return Math.abs(_seed) / 0x7fffffff }
const srnd = (min, max) => Math.floor(seeded() * (max - min + 1)) + min
const spick = (arr) => arr[srnd(0, arr.length - 1)]

// ─── Routes / Trips ──────────────────────────────────────────────────────────
export const mockRoutes = [
  { id: 'RT-001', from: 'Aarhus Hub', to: 'Copenhagen Port', distance: 310, estTime: '3h 20m', type: 'Long Haul', status: 'Active' },
  { id: 'RT-002', from: 'Odense Depot', to: 'Esbjerg Terminal', distance: 120, estTime: '1h 25m', type: 'Regional', status: 'Active' },
  { id: 'RT-003', from: 'Aalborg North', to: 'Viborg Central', distance: 75, estTime: '55m', type: 'Local', status: 'Active' },
  { id: 'RT-004', from: 'Copenhagen Hub', to: 'Malmö SE', distance: 40, estTime: '45m', type: 'Cross-border', status: 'Scheduled' },
  { id: 'RT-005', from: 'Aarhus South', to: 'Randers', distance: 60, estTime: '42m', type: 'Local', status: 'Active' },
  { id: 'RT-006', from: 'Kolding Depot', to: 'Fredericia', distance: 18, estTime: '22m', type: 'Shuttle', status: 'Complete' },
  { id: 'RT-007', from: 'Herning Hub', to: 'Ikast', distance: 22, estTime: '20m', type: 'Shuttle', status: 'Active' },
  { id: 'RT-008', from: 'Silkeborg', to: 'Skanderborg', distance: 30, estTime: '28m', type: 'Local', status: 'Scheduled' },
]

// ─── Alerts ───────────────────────────────────────────────────────────────────
export const mockAlerts = [
  { id: 'ALT-001', type: 'Critical', title: 'Engine Misfire Detected', desc: 'DK-10023 · Scania R500 · Zone C', time: '2m ago', icon: 'AlertTriangle', color: 'red' },
  { id: 'ALT-002', type: 'Warning', title: 'Driver Rest Period Overdue', desc: 'Marcus Olsen · Route RT-002 · +18m', time: '11m ago', icon: 'Clock', color: 'amber' },
  { id: 'ALT-003', type: 'Info', title: 'Satellite Signal Degraded', desc: 'DK-10041 · Zone F · Medium signal', time: '34m ago', icon: 'Wifi', color: 'blue' },
  { id: 'ALT-004', type: 'Warning', title: 'Fuel Level Critical', desc: 'DK-10007 · 12% remaining', time: '1h ago', icon: 'Fuel', color: 'amber' },
  { id: 'ALT-005', type: 'Critical', title: 'Brake System Alert', desc: 'DK-10055 · Volvo FMX · Inspect now', time: '2h ago', icon: 'AlertTriangle', color: 'red' },
  { id: 'ALT-006', type: 'Info', title: 'Scheduled Maintenance Due', desc: 'DK-10012 · Komatsu PC210 · 3 days', time: '3h ago', icon: 'Wrench', color: 'blue' },
  { id: 'ALT-007', type: 'Warning', title: 'Speed Limit Exceeded', desc: 'DK-10031 · 94 km/h · Highway B461', time: '5h ago', icon: 'Gauge', color: 'amber' },
  { id: 'ALT-008', type: 'Info', title: 'Route Deviation Detected', desc: 'DK-10018 · 2.4 km off corridor', time: '6h ago', icon: 'Navigation', color: 'blue' },
]

// ─── Maintenance tickets ───────────────────────────────────────────────────────
export const mockMaintenanceTickets = [
  { id: 'DK-10023', name: 'Scania R500', type: 'Major Service', due: 'In 2 days', urgency: 'High', progress: 0, tech: 'Alex Jensen', cost: '$1,200', location: 'Main Workshop' },
  { id: 'DK-10019', name: 'Volvo FM 460', type: 'Brake Inspection', due: 'In 5 days', urgency: 'Medium', progress: 15, tech: 'Marcus Olsen', cost: '$450', location: 'Zone A Depot' },
  { id: 'DK-10033', name: 'Liebherr LTM 1050', type: 'Hydraulic Flush', due: 'Nov 1', urgency: 'Low', progress: 0, tech: 'Sarah Connor', cost: '$890', location: 'Main Workshop' },
  { id: 'DK-10010', name: 'CAT 320 GC', type: 'Track Tensioning', due: 'Nov 3', urgency: 'Medium', progress: 0, tech: 'Robert Miller', cost: '$600', location: 'Site Alpha' },
  { id: 'DK-10044', name: 'Mercedes-Benz Actros', type: 'Engine Tuning', due: 'Nov 5', urgency: 'Low', progress: 0, tech: 'Elena Vance', cost: '$1,100', location: 'Main Workshop' },
  { id: 'DK-10051', name: 'MAN TGS 26.480', type: 'Tire Replacement', due: 'Nov 6', urgency: 'Medium', progress: 30, tech: 'Henrik Larsen', cost: '$780', location: 'Zone B Depot' },
  { id: 'DK-10062', name: 'DAF XF 480', type: 'Oil & Filter Change', due: 'Nov 8', urgency: 'Low', progress: 0, tech: 'Mette Jensen', cost: '$320', location: 'Workshop 2' },
  { id: 'DK-10077', name: 'Komatsu PC210', type: 'Pump Replacement', due: 'Nov 10', urgency: 'High', progress: 0, tech: 'Thomas Hansen', cost: '$2,400', location: 'Site Beta' },
]

// ─── Maintenance history ───────────────────────────────────────────────────────
export const mockServiceHistory = [
  { id: 'DK-10055', name: 'Scania G450', type: 'Oil Change', date: 'Oct 18', status: 'Completed', cost: '$320', tech: 'Alex Jensen' },
  { id: 'DK-10099', name: 'Volvo FMX', type: 'Tire Rotation', date: 'Oct 14', status: 'Completed', cost: '$180', tech: 'Marcus Olsen' },
  { id: 'DK-10011', name: 'Komatsu PC360', type: 'Pump Replacement', date: 'Oct 08', status: 'Completed', cost: '$2,400', tech: 'Sarah Connor' },
  { id: 'DK-10020', name: 'DAF CF 330', type: 'Brake Overhaul', date: 'Oct 05', status: 'Completed', cost: '$960', tech: 'Robert Miller' },
  { id: 'DK-10037', name: 'MAN TGL 12.220', type: 'Engine Flush', date: 'Sep 28', status: 'Completed', cost: '$540', tech: 'Elena Vance' },
  { id: 'DK-10048', name: 'Iveco Stralis', type: 'Electrical Check', date: 'Sep 22', status: 'Completed', cost: '$275', tech: 'Henrik Larsen' },
]

// ─── Mechanics ────────────────────────────────────────────────────────────────
export const mockMechanics = [
  { id: 'mec-01', name: 'Alex Jensen', specialty: 'Engine Diagnostics', efficiency: 98, status: 'On Duty', tasks: 3, photo: 'https://i.pravatar.cc/150?u=alex.jensen' },
  { id: 'mec-02', name: 'Marcus Olsen', specialty: 'Braking Systems', efficiency: 92, status: 'In Break', tasks: 1, photo: 'https://i.pravatar.cc/150?u=marcus.olsen' },
  { id: 'mec-03', name: 'Sarah Connor', specialty: 'Hydraulics & Fluids', efficiency: 95, status: 'On Duty', tasks: 4, photo: 'https://i.pravatar.cc/150?u=sarah.connor' },
  { id: 'mec-04', name: 'Robert Miller', specialty: 'Transmission & Gearbox', efficiency: 89, status: 'On Duty', tasks: 2, photo: 'https://i.pravatar.cc/150?u=robert.miller' },
  { id: 'mec-05', name: 'Elena Vance', specialty: 'Electrical Systems', efficiency: 97, status: 'Off Duty', tasks: 0, photo: 'https://i.pravatar.cc/150?u=elena.vance' },
  { id: 'mec-06', name: 'Henrik Larsen', specialty: 'Fuel Systems', efficiency: 91, status: 'On Duty', tasks: 2, photo: 'https://i.pravatar.cc/150?u=henrik.larsen' },
]

// ─── Component inventory ──────────────────────────────────────────────────────
export const mockInventory = [
  { label: 'Transmission Kits', qty: '04 Units', status: 'Optimal', stock: 4 },
  { label: 'Hydraulic Pumps', qty: '02 Units', status: 'Low Stock', stock: 2 },
  { label: 'Brake Modules', qty: '12 Units', status: 'Optimal', stock: 12 },
  { label: 'Oil Filter Pack', qty: '08 Units', status: 'Optimal', stock: 8 },
  { label: 'Drive Belts', qty: '15 Units', status: 'Optimal', stock: 15 },
  { label: 'Air Filters', qty: '06 Units', status: 'Adequate', stock: 6 },
  { label: 'Coolant Fluid (L)', qty: '120 L', status: 'Optimal', stock: 120 },
  { label: 'Brake Fluid (L)', qty: '03 L', status: 'Low Stock', stock: 3 },
]

// ─── Chart data ────────────────────────────────────────────────────────────────
export const mockChartData = {
  fuelWeekly: [{ h: 'Mon', v: 92 }, { h: 'Tue', v: 88 }, { h: 'Wed', v: 82 }, { h: 'Thu', v: 76 }, { h: 'Fri', v: 69 }, { h: 'Sat', v: 63 }, { h: 'Sun', v: 58 }],
  fuelHourly: [{ h: '00:00', v: 95 }, { h: '04:00', v: 92 }, { h: '08:00', v: 85 }, { h: '12:00', v: 62 }, { h: '16:00', v: 45 }, { h: '20:00', v: 32 }, { h: '23:59', v: 28 }],
  speedDaily: [{ h: 'Mon', v: 64 }, { h: 'Tue', v: 72 }, { h: 'Wed', v: 58 }, { h: 'Thu', v: 81 }, { h: 'Fri', v: 67 }, { h: 'Sat', v: 45 }, { h: 'Sun', v: 70 }],
  efficiency: [{ name: 'Mon', val: 82 }, { name: 'Tue', val: 88 }, { name: 'Wed', val: 85 }, { name: 'Thu', val: 92 }, { name: 'Fri', val: 94 }, { name: 'Sat', val: 78 }, { name: 'Sun', val: 74 }],
  co2Sectors: [{ name: 'Pharma', val: 120 }, { name: 'Logistics', val: 450 }, { name: 'Construction', val: 320 }, { name: 'Long Haul', val: 680 }],
  performance6mo: [{ month: 'Jan', performance: 88 }, { month: 'Feb', performance: 92 }, { month: 'Mar', performance: 85 }, { month: 'Apr', performance: 94 }, { month: 'May', performance: 98 }, { month: 'Jun', performance: 96 }],
  fleetHealth: [{ month: 'Jan', healthy: 58, critical: 12 }, { month: 'Feb', healthy: 62, critical: 9 }, { month: 'Mar', healthy: 65, critical: 8 }, { month: 'Apr', healthy: 70, critical: 6 }, { month: 'May', healthy: 74, critical: 5 }, { month: 'Jun', healthy: 76, critical: 4 }],
  temperatureChain: [{ time: '06:00', temp: -18.2 }, { time: '09:00', temp: -17.8 }, { time: '12:00', temp: -18.5 }, { time: '15:00', temp: -17.1 }, { time: '18:00', temp: -18.9 }, { time: '21:00', temp: -18.3 }],
}

// ─── Top vehicles by fuel consumption (for Reports) ──────────────────────────
export const mockTopFuelConsumers = [
  { rank: 1, id: 'DK-10023', name: 'Scania R500 #24', consumption: 38.2, driver: 'Marcus Olsen', type: 'Long Haul', trend: 'up' },
  { rank: 2, id: 'DK-10044', name: 'Liebherr LTM 1050 #45', consumption: 35.7, driver: 'Sarah Connor', type: 'Heavy Mach.', trend: 'down' },
  { rank: 3, id: 'DK-10007', name: 'CAT 320 GC #8', consumption: 33.1, driver: 'Robert Miller', type: 'Construction', trend: 'up' },
  { rank: 4, id: 'DK-10077', name: 'Volvo FMX #78', consumption: 31.4, driver: 'Elena Vance', type: 'Long Haul', trend: 'same' },
  { rank: 5, id: 'DK-10031', name: 'MAN TGS #32', consumption: 29.8, driver: 'Lars Nielsen', type: 'Regional', trend: 'down' },
  { rank: 6, id: 'DK-10055', name: 'Mercedes Actros #56', consumption: 28.3, driver: 'Thomas Hansen', type: 'Long Haul', trend: 'up' },
  { rank: 7, id: 'DK-10018', name: 'DAF XF 480 #19', consumption: 26.7, driver: 'Henrik Larsen', type: 'Regional', trend: 'down' },
  { rank: 8, id: 'DK-10062', name: 'Komatsu PC360 #63', consumption: 25.1, driver: 'Mette Jensen', type: 'Construction', trend: 'same' },
]

// ─── Users ────────────────────────────────────────────────────────────────────
const generateUsers = () => {
  const users = []
  const roles = ['Driver', 'Driver', 'Driver', 'Driver', 'Dispatcher', 'Mechanic', 'Manager']

  const predefined = [
    { name: 'Alex Jensen', role: 'Driver', status: 'Active', department: 'North Region', email: 'alex.jensen@jaxicloud.com', phone: '+45 20 48 19 03' },
    { name: 'Marcus Olsen', role: 'Driver', status: 'Active', department: 'South Region', email: 'marcus.olsen@jaxicloud.com', phone: '+45 31 72 44 88' },
    { name: 'Sarah Connor', role: 'Mechanic', status: 'Active', department: 'Workshop East', email: 'sarah.connor@jaxicloud.com', phone: '+45 40 23 55 61' },
    { name: 'Robert Miller', role: 'Mechanic', status: 'Active', department: 'Workshop West', email: 'robert.miller@jaxicloud.com', phone: '+45 51 09 77 22' },
    { name: 'Elena Vance', role: 'Dispatcher', status: 'Active', department: 'Dispatching', email: 'elena.vance@jaxicloud.com', phone: '+45 28 34 90 15' },
    { name: 'Saima Mushtaq', role: 'Dispatcher', status: 'Active', department: 'Dispatching', email: 'saima.mushtaq@jaxicloud.com', phone: '+45 22 48 19 03' },
    { name: 'Lars Nielsen', role: 'Driver', status: 'Active', department: 'Long Haul', email: 'lars.nielsen@jaxicloud.com', phone: '+45 61 87 32 44' },
    { name: 'Erik Poulsen', role: 'Driver', status: 'Inactive', department: 'North Region', email: 'erik.poulsen@jaxicloud.com', phone: '+45 44 21 09 87' },
    { name: 'Mette Jensen', role: 'Mechanic', status: 'Active', department: 'Workshop East', email: 'mette.jensen@jaxicloud.com', phone: '+45 32 77 56 19' },
    { name: 'Thomas Hansen', role: 'Manager', status: 'Active', department: 'Operations', email: 'thomas.hansen@jaxicloud.com', phone: '+45 20 90 44 11' },
    { name: 'Kristina Holm', role: 'Dispatcher', status: 'Active', department: 'South Region', email: 'kristina.holm@jaxicloud.com', phone: '+45 50 38 12 77' },
    { name: 'Anders Andersen', role: 'Driver', status: 'Active', department: 'Cold Chain', email: 'anders.andersen@jaxicloud.com', phone: '+45 41 55 83 22' },
    { name: 'Peter Petersen', role: 'Driver', status: 'Active', department: 'North Region', email: 'peter.petersen@jaxicloud.com', phone: '+45 29 44 71 58' },
    { name: 'Henrik Larsen', role: 'Mechanic', status: 'Active', department: 'Workshop West', email: 'henrik.larsen@jaxicloud.com', phone: '+45 31 10 22 98' },
    { name: 'Jesper Rasmussen', role: 'Driver', status: 'Active', department: 'Long Haul', email: 'jesper.rasmussen@jaxicloud.com', phone: '+45 42 88 13 77' },
    { name: 'Morten Christensen', role: 'Manager', status: 'Active', department: 'Executive', email: 'morten.christensen@jaxicloud.com', phone: '+45 20 55 66 11' },
    { name: 'Rania Costa', role: 'Dispatcher', status: 'Active', department: 'Cold Chain', email: 'rania.costa@jaxicloud.com', phone: '+45 33 99 12 44' },
    { name: 'Oliver Berg', role: 'Driver', status: 'Active', department: 'South Region', email: 'oliver.berg@jaxicloud.com', phone: '+45 61 23 44 90' },
    { name: 'Emma Lund', role: 'Driver', status: 'Active', department: 'North Region', email: 'emma.lund@jaxicloud.com', phone: '+45 44 78 32 15' },
    { name: 'Lukas Dahl', role: 'Driver', status: 'Active', department: 'Long Haul', email: 'lukas.dahl@jaxicloud.com', phone: '+45 20 33 55 81' },
  ]

  predefined.forEach((u, i) => {
    users.push({
      id: `usr-${String(i).padStart(3, '0')}`,
      name: u.name,
      role: u.role,
      status: u.status,
      email: u.email,
      phone: u.phone,
      photo: `https://i.pravatar.cc/150?u=${u.email}`,
      performance: srnd(78, 99),
      compliance: i < 18 ? 'Compliant' : 'Non-Compliant',
      drivingTime: u.role === 'Driver' ? `${(seeded() * 8).toFixed(1)}h / 9h` : null,
      department: u.department,
      shiftStatus: srnd(0, 1) ? '09:00–18:00' : '06:00–15:00',
      assignedVehicle: null,
      weeklyHours: srnd(32, 56),
      reportsAccess: u.role === 'Driver' ? 'CO2, trips, utilization' : 'Full access',
      permissions: u.role === 'Driver' ? 'Read vehicles, dispatch, alerts' : 'Full admin',
      vehiclesAssigned: u.role === 'Dispatcher' ? srnd(18, 35) : u.role === 'Manager' ? srnd(80, 120) : 1,
      alertsCleared: srnd(2, 25),
      avgResponse: `${srnd(2, 8)} min`,
      joinDate: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'][srnd(0, 7)]} 202${srnd(1, 4)}`,
    })
  })

  // Pad to 60 users with generated data
  for (let i = predefined.length; i < 60; i++) {
    const fn = spick(firstNames), ln = spick(lastNames)
    const name = `${fn} ${ln}`
    const role = spick(roles)
    users.push({
      id: `usr-${String(i).padStart(3, '0')}`,
      name,
      role,
      status: seeded() > 0.15 ? 'Active' : 'Inactive',
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@jaxicloud.com`,
      phone: `+45 ${srnd(20, 99)} ${srnd(10, 99)} ${srnd(10, 99)} ${srnd(10, 99)}`,
      photo: `https://i.pravatar.cc/150?u=${name}${i}`,
      performance: srnd(70, 99),
      compliance: seeded() > 0.08 ? 'Compliant' : 'Non-Compliant',
      drivingTime: role === 'Driver' ? `${(seeded() * 8).toFixed(1)}h / 9h` : null,
      department: spick(departments),
      shiftStatus: seeded() > 0.5 ? '09:00–18:00' : '06:00–15:00',
      assignedVehicle: null,
      weeklyHours: srnd(28, 56),
      reportsAccess: role === 'Driver' ? 'CO2, trips, utilization' : 'Full access',
      permissions: role === 'Driver' ? 'Read vehicles, dispatch' : 'Full admin',
      vehiclesAssigned: role === 'Dispatcher' ? srnd(10, 30) : 1,
      alertsCleared: srnd(0, 20),
      avgResponse: `${srnd(2, 10)} min`,
      joinDate: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'][srnd(0, 7)]} 202${srnd(1, 4)}`,
    })
  }
  return users
}

export const mockUsers = generateUsers()
const drivers = mockUsers.filter(u => u.role === 'Driver')

// ─── Vehicles ─────────────────────────────────────────────────────────────────
const allStatuses = ['Moving', 'Moving', 'Moving', 'Resting', 'Idle', 'Maintenance']

const generateVehicles = () => {
  const vehicles = []
  const centerLat = 56.1629, centerLng = 10.2039

  for (let i = 0; i < 120; i++) {
    const status = spick(allStatuses)
    const driver = drivers[i % drivers.length]
    const vehicleId = `DK-${10000 + i}`
    const model = spick(vehicleModels)
    const zone = spick(zones)
    const fuel = srnd(12, 98)
    const battery = srnd(45, 100)
    const temp = srnd(10, 65)
    const speed = status === 'Moving' ? srnd(35, 94) : 0

    if (driver) driver.assignedVehicle = vehicleId

    vehicles.push({
      id: vehicleId,
      name: `${model} #${i + 1}`,
      model,
      plate: `DK ${srnd(10000, 99999)}`,
      year: srnd(2018, 2024),
      zone,
      status,
      speed,
      odometer: srnd(12000, 380000),
      lat: centerLat + (seeded() - 0.5) * 0.22,
      lng: centerLng + (seeded() - 0.5) * 0.35,
      driver: driver || { name: 'Unassigned', photo: 'https://i.pravatar.cc/150?u=unassigned', drivingTime: '0h', id: 'N/A', email: '—', phone: '—' },
      route: status === 'Moving' ? spick(mockRoutes) : null,
      vitals: {
        fuel,
        satellite: seeded() > 0.2 ? 'Strong' : 'Medium',
        battery,
        temp,
        engineLoad: srnd(20, 80),
        co2: (seeded() * 1.2 + 0.4).toFixed(2),
        fuelBurnRate: srnd(22, 42),
      },
      nextService: `${srnd(200, 4500)} km`,
      lastService: `${srnd(3, 60)} days ago`,
      alerts: srnd(0, 2),
      insuranceExpiry: `${['Jan', 'Mar', 'Jun', 'Aug', 'Oct', 'Dec'][srnd(0, 5)]} 202${srnd(5, 6)}`,
      registrationExpiry: `${['Feb', 'Apr', 'Jul', 'Sep', 'Nov'][srnd(0, 4)]} 202${srnd(5, 6)}`,
      fuelType: seeded() > 0.6 ? 'Diesel' : seeded() > 0.3 ? 'LNG' : 'HVO',
      dailyKm: srnd(80, 520),
      weeklyKm: srnd(400, 2800),
    })
  }
  return vehicles
}

export const mockVehicles = generateVehicles()

// ─── KPI summaries ────────────────────────────────────────────────────────────
export const mockFleetKPIs = {
  totalAssets: 482,
  activeNow: 419,
  moving: 312,
  resting: 107,
  idle: 63,
  maintenance: 18,
  healthy: 62,
  needAttention: 28,
  critical: 10,
  drivers: 28,
  fuelAvg: 68,
  co2Today: '1,240 kg',
  uptime: '98.4%',
  compliance: '98.4%',
  violations: 2,
  audits: 5,
  onRest: 12,
}

// ─── Compliance summary ────────────────────────────────────────────────────────
export const mockComplianceData = mockUsers
  .filter(u => u.role === 'Driver')
  .map((d, i) => ({
    ...d,
    dailyDrive: srnd(10, 99),
    weeklyDrive: srnd(20, 95),
    breakCountdown: srnd(5, 45),
    nextRest: `${srnd(15, 22)}:${srnd(0, 5)}${srnd(0, 9)}`,
    violationHistory: seeded() > 0.88 ? 1 : 0,
    tachographStatus: seeded() > 0.92 ? 'Syncing' : 'Connected',
  }))

// ─── Monitor Tab — Stats Bar cards ────────────────────────────────────────────
// Each card has: id, label, value, sub, icon (lucide name), color, visible
export const mockMonitorStats = [
  { id: 'active-vehicles', label: 'Active Vehicles',      value: '419',    sub: '63 parked',          icon: 'Truck',        color: '#2563EB', visible: true  },
  { id: 'parked',          label: 'Parked',               value: '63',     sub: 'Not in motion',      icon: 'ParkingSquare',color: '#64748B', visible: true  },
  { id: 'drivers-road',    label: 'Drivers on Road',      value: '312',    sub: '+14 since 08:00',    icon: 'UserCheck',    color: '#10B981', visible: true  },
  { id: 'drivers-break',   label: 'Drivers on Break',     value: '107',    sub: '12 overdue rest',    icon: 'Coffee',       color: '#F59E0B', visible: true  },
  { id: 'need-service',    label: 'Need Service',         value: '18',     sub: 'This month',         icon: 'Wrench',       color: '#F97316', visible: true  },
  { id: 'active-alarms',   label: 'Active Alarms',        value: '7',      sub: 'Require action',     icon: 'AlertTriangle',color: '#EF4444', visible: true  },
  { id: 'drivers-checked', label: 'Drivers Checked In',   value: '481',    sub: 'Of 510 total',       icon: 'ClipboardCheck',color:'#8B5CF6', visible: false },
  { id: 'planned-service', label: 'Planned Service',      value: '12',     sub: 'This week',          icon: 'Calendar',     color: '#3B82F6', visible: false },
  { id: 'co2-today',       label: 'CO₂ Today',            value: '1,240kg',sub: '-2.1% vs yesterday', icon: 'Leaf',         color: '#22C55E', visible: false },
]

import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Phone, Mail, Activity, Truck, Fuel, Gauge, Thermometer, ShieldCheck, Wrench, Zap, Info, Bell, TrendingUp, Clock, AlertTriangle, Send, Lock, Flag, Navigation } from 'lucide-react'
import { mockVehicles } from '../mockData'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'

const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: d, ease: [0.22, 1, 0.36, 1] } })

const Bar = ({ pct, color, delay = 0.4 }) => (
  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
    <motion.div className="h-full rounded-full" style={{ background: color }}
      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }} />
  </div>
)

const Ring = ({ value, max = 100, size = 72, color = '#10B981', label }) => {
  const r = 28, circ = 2 * Math.PI * r, pct = Math.min(value / max, 1)
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#F1F5F9" strokeWidth="5" />
        <motion.circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circ} transform="rotate(-90 32 32)"
          initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }} />
        <text x="32" y="36" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1e293b">{value}%</text>
      </svg>
      {label && <p className="text-[9px] text-slate-400 uppercase tracking-wide font-bold mt-1">{label}</p>}
    </div>
  )
}

const SL = ({ children }) => <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{children}</p>

const VehicleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const v = mockVehicles.find(x => x.id === id)
  if (!v) return <div className="flex h-screen items-center justify-center text-slate-400 text-lg">Vehicle not found</div>

  const fuel = v.vitals?.fuel ?? 0
  const fuelC = fuel < 20 ? '#EF4444' : fuel < 50 ? '#F59E0B' : '#10B981'
  const overall = v.behavior?.behaviorScore ?? 0
  const overallC = overall >= 80 ? '#10B981' : overall >= 60 ? '#F59E0B' : '#EF4444'

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F0F4F8] overflow-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 p-3 pt-24 gap-2">
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">

          {/* ── HERO HEADER ── */}
          <motion.div {...fadeUp(0)} className="relative rounded-[2rem] overflow-hidden mb-5"
            style={{ background: 'linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 55%,#3b82f6 100%)' }}>
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-10 bg-white" />
            <div className="px-8 py-7 flex items-start gap-5">
              <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/15 border border-white/25 rounded-2xl flex items-center justify-center shrink-0 hover:bg-white/25 transition-all">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="w-14 h-14 bg-white/15 border border-white/25 rounded-2xl flex items-center justify-center shrink-0">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-black text-white tracking-tight">{v.name}</h2>
                <p className="text-blue-200 text-sm mt-0.5">{v.id} · {v.plate} · {v.year} · {v.model}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-lg ${v.status === 'Moving' ? 'bg-emerald-400/25 text-emerald-100 border border-emerald-400/40' : v.status === 'Maintenance' ? 'bg-red-400/25 text-red-100 border border-red-400/40' : 'bg-white/15 text-blue-100 border border-white/20'}`}>{v.status}</span>
                  <span className="text-blue-200 text-xs">{v.zone}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 shrink-0">
                <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-white/30 shrink-0">
                  <img src={v.driver?.photo || `https://i.pravatar.cc/80?u=${v.id}`} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{v.driver?.name || 'Unassigned'}</p>
                  <p className="text-xs text-blue-200">{v.driver?.id || '—'}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => toast.success('Alert configured')} className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-all"><Bell className="w-3.5 h-3.5" />Alert</button>
                <button onClick={() => toast.success('Remote command sent')} className="px-4 py-2.5 bg-white rounded-xl text-xs font-bold text-blue-700 flex items-center gap-2 hover:bg-blue-50 transition-all"><Zap className="w-3.5 h-3.5" />Command</button>
              </div>
            </div>
          </motion.div>

          {/* ── QUICK STATS ── */}
          <motion.div {...fadeUp(0.08)} className="grid grid-cols-6 gap-3 mb-5">
            {[
              { l: 'Speed', v: `${Number(v.speed||0).toFixed(1)} km/h`, c: '#2563EB' },
              { l: 'Fuel', v: `${fuel}%`, c: fuelC },
              { l: 'Engine Temp', v: `${v.vitals?.temp??'—'}°C`, c: '#F59E0B' },
              { l: 'Mileage', v: v.vitals?.mileage ? `${(v.vitals.mileage/1000).toFixed(0)}k km` : '—', c: '#8B5CF6' },
              { l: 'Utilization', v: `${v.vitals?.utilization??'—'}%`, c: '#06B6D4' },
              { l: 'Alarms', v: v.activeAlarms??0, c: v.activeAlarms>0 ? '#EF4444' : '#94A3B8' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 text-center border border-slate-100 shadow-sm">
                <p className="text-lg font-black leading-none" style={{ color: s.c }}>{s.v}</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-wide mt-1.5 font-bold">{s.l}</p>
              </div>
            ))}
          </motion.div>

          {/* ── 2-COL BODY ── */}
          <div className="grid grid-cols-3 gap-5 pb-8">
            {/* Wide col */}
            <div className="col-span-2 space-y-5">
              {/* Health */}
              <motion.div {...fadeUp(0.12)} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <SL>Structural Health & Vitals</SL>
                  <span className="text-sm font-black text-emerald-500">EXCELLENT</span>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { label: 'Brake System', val: 12, color: '#10B981' },
                    { label: 'Tire Pressure', val: 94, color: '#3B82F6' },
                    { label: 'Oil Viscosity', val: 88, color: '#F59E0B' },
                    { label: 'Exhaust Emissions', val: 96, color: '#8B5CF6' },
                    { label: 'Fuel Efficiency', val: 74, color: '#3B82F6' },
                    { label: 'Battery', val: v.vitals?.battery ?? 90, color: '#10B981' },
                  ].map((b, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs text-slate-500">{b.label}</span>
                        <span className="text-xs font-black" style={{ color: b.color }}>{b.val}%</span>
                      </div>
                      <Bar pct={b.val} color={b.color} delay={0.4 + i * 0.08} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-8 mt-6 pt-5 border-t border-slate-50">
                  <Ring value={fuel} max={100} color={fuelC} label="Fuel" />
                  <Ring value={v.vitals?.battery ?? 90} max={100} color="#10B981" label="Battery" />
                  <Ring value={v.vitals?.utilization ?? 78} max={100} color="#06B6D4" label="Utilization" />
                  <Ring value={overall} max={100} color={overallC} label="Behavior" />
                </div>
              </motion.div>

              {/* Behavior */}
              <motion.div {...fadeUp(0.18)} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <SL>Driver Behavior</SL>
                  <span className="text-lg font-black" style={{ color: overallC }}>{overall}<span className="text-xs text-slate-400 font-medium">/100</span></span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Acceleration', score: v.behavior?.accelScore ?? 0 },
                    { label: 'Braking', score: v.behavior?.brakeScore ?? 0 },
                    { label: 'Turning', score: v.behavior?.turnScore ?? 0 },
                  ].map((s, i) => {
                    const c = s.score >= 80 ? '#10B981' : s.score >= 60 ? '#F59E0B' : '#EF4444'
                    return (<div key={i}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs text-slate-500">{s.label}</span>
                        <span className="text-xs font-bold" style={{ color: c }}>{s.score}/100</span>
                      </div>
                      <Bar pct={s.score} color={c} delay={0.5 + i * 0.1} />
                    </div>)
                  })}
                </div>
              </motion.div>

              {/* Maintenance */}
              <motion.div {...fadeUp(0.22)} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <SL>Maintenance Ledger</SL>
                  <button className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-wider">Full Log</button>
                </div>
                <div className="space-y-3">
                  {[
                    { type: 'Service', date: '24 Oct 2026', desc: 'Full engine diagnostics & oil change', cost: '$420', status: 'Completed' },
                    { type: 'Repair', date: '12 Sep 2026', desc: 'Front left tire replacement', cost: '$180', status: 'Completed' },
                    { type: 'Inspection', date: '01 Aug 2026', desc: 'Brake pad and rotor check', cost: '$0', status: 'Completed' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white transition-all">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.type === 'Repair' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold text-slate-700">{log.desc}</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-600 text-[8px] font-bold">{log.status}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">{log.date} · {log.type}</p>
                      </div>
                      <p className="text-sm font-bold text-slate-700">{log.cost}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar col */}
            <div className="space-y-5">
              {/* Driver */}
              <motion.div {...fadeUp(0.14)} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
                <SL>Assigned Driver</SL>
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-slate-100 shadow-lg mx-auto mb-3">
                  <img src={v.driver?.photo || `https://i.pravatar.cc/80?u=${v.id}`} alt="" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-black text-slate-800">{v.driver?.name || 'Unassigned'}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">Primary Operator</p>
                <div className="flex gap-2 mb-4">
                  <button onClick={() => toast('Calling…', { icon: '📞' })} className="flex-1 p-2.5 bg-blue-50 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-all"><Phone className="w-3.5 h-3.5 text-blue-600" /><span className="text-[10px] font-bold text-blue-700">Call</span></button>
                  <button onClick={() => toast('Email opened', { icon: '📧' })} className="flex-1 p-2.5 bg-slate-50 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"><Mail className="w-3.5 h-3.5 text-slate-500" /><span className="text-[10px] font-bold text-slate-600">Email</span></button>
                </div>
                <div className="space-y-2 text-left">
                  {[
                    { label: 'Drive Time', value: v.driver?.drivingTime || `${v.driver?.driveTimeHours ?? 0}h` },
                    { label: 'Rest Time', value: v.driver?.restingTime || `${v.driver?.breakTimeMin ?? 0} min` },
                    { label: 'Status', value: v.driver?.monitorStatus || 'Unknown' },
                  ].map((r, i) => (
                    <div key={i} className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{r.label}</span>
                      <span className="text-xs font-bold text-slate-700">{r.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Specs */}
              <motion.div {...fadeUp(0.2)} className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1e293b 0%,#334155 100%)' }}>
                <div className="absolute -bottom-6 -right-6 opacity-10"><Info className="w-28 h-28" /></div>
                <SL><span className="text-slate-400">Machine Specs</span></SL>
                <div className="space-y-3">
                  {[
                    { label: 'Model', val: v.model },
                    { label: 'VIN', val: 'XN202104819221' },
                    { label: 'Transmission', val: 'Auto i-Shift' },
                    { label: 'Payload', val: '22,000 kg' },
                    { label: 'Fuel Type', val: v.fuelType || '—' },
                    { label: 'Last Sync', val: '2 min ago' },
                  ].map((s, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/10 pb-2.5">
                      <span className="text-[10px] opacity-50 uppercase font-bold tracking-wider">{s.label}</span>
                      <span className="text-xs font-mono font-medium">{s.val}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Service */}
              <motion.div {...fadeUp(0.24)} className={`rounded-2xl p-5 border shadow-sm ${v.service?.repairsNeeded ? 'bg-orange-50 border-orange-100' : 'bg-white border-slate-100'}`}>
                <SL>Service Info</SL>
                <div className="flex items-start gap-3 mb-3">
                  <Wrench className={`w-5 h-5 shrink-0 ${v.service?.repairsNeeded ? 'text-orange-500' : 'text-slate-400'}`} />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{v.service?.nextService || 'No upcoming'}</p>
                    <p className="text-xs text-slate-500">{v.service?.nextServiceDate || '—'}</p>
                  </div>
                </div>
                {v.service?.repairsNeeded && (
                  <div className="p-3 bg-orange-100 rounded-xl border border-orange-200">
                    <p className="text-xs font-bold text-orange-700">⚠ {v.service.repairsNeeded}</p>
                  </div>
                )}
              </motion.div>

              {/* Quick Actions */}
              <motion.div {...fadeUp(0.28)} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <SL>Quick Actions</SL>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Send, label: 'Dispatch', color: 'bg-blue-600 text-white', action: () => toast.success('Task dispatched') },
                    { icon: Flag, label: 'Flag', color: 'bg-orange-500 text-white', action: () => toast.success('Flagged') },
                    { icon: Lock, label: 'Lock', color: 'bg-slate-700 text-white', action: () => toast.success('Remote lock sent') },
                    { icon: Activity, label: 'Telemetry', color: 'bg-purple-600 text-white', action: () => navigate(`/reports?vehicleId=${v.id}`) },
                  ].map(({ icon: Icon, label, color, action }) => (
                    <motion.button key={label} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={action}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl ${color} shadow-sm transition-all`}>
                      <Icon className="w-4 h-4" />
                      <span className="text-[9px] font-bold">{label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default VehicleDetail

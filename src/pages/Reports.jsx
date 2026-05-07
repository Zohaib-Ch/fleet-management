import React, { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, TrendingUp, Leaf, Clock, Download, Calendar, 
  ChevronDown, Filter, PieChart, Thermometer, Zap, AlertTriangle,
  User, Truck, ArrowLeft, Fuel, Activity, MapPin, Gauge, Shield, 
  Search, Globe, Star, FileText, CheckCircle2, Layout, ZapOff, 
  ChevronRight, List, Settings, Wrench, ClipboardList, AlertCircle, 
  DollarSign, HardHat, Package, Smartphone, RefreshCw, Printer, Award
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart as RePieChart, Pie, Cell, LineChart, Line 
} from 'recharts'
import Navbar from '../components/Navbar'
import { mockVehicles, mockChartData, mockUsers } from '../mockData'
import toast from 'react-hot-toast'
import * as docx from 'docx'
import { saveAs } from 'file-saver'

// ── Animation presets ─────────────────────────────────────────────────────────
const fadeUp = (d = 0) => ({ 
  initial: { opacity: 0, y: 18 }, 
  animate: { opacity: 1, y: 0 }, 
  transition: { duration: 0.4, delay: d, ease: [0.22, 1, 0.36, 1] } 
})

// ── UI Helpers ───────────────────────────────────────────────────────────────
const Ring = ({ value, max = 100, size = 120, color = '#10B981', label, sublabel }) => {
  const r = 48, circ = 2 * Math.PI * r, pct = Math.min(value / max, 1)
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#F8FAFC" strokeWidth="8" />
          <motion.circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ} transform="rotate(-90 60 60)"
            initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - pct) }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-black text-slate-800 leading-none">{value}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{sublabel}</p>
        </div>
      </div>
      {label && <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-3">{label}</p>}
    </div>
  )
}

const ProgressBar = ({ label, value, max = 10, color = '#3B82F6', subtext }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-end">
      <p className="text-[11px] font-bold text-slate-600">{label}</p>
      <div className="text-right">
        <p className="text-xs font-black text-slate-800 leading-none">{value}</p>
        {subtext && <p className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">{subtext}</p>}
      </div>
    </div>
    <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  </div>
)

// ── Components ──────────────────────────────────────────────────────────────

const ReportCategory = ({ category, reports, activeReport, onSelectReport }) => {
  const [isOpen, setIsOpen] = useState(category.id === 'overview' || reports.some(r => r.id === activeReport))

  return (
    <div className="mb-1">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${isOpen ? 'text-slate-800 bg-slate-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
      >
        <div className="flex items-center gap-3">
          <category.icon className={`w-4 h-4 ${isOpen ? 'text-blue-600' : 'text-slate-400'}`} />
          <span className="text-xs font-black uppercase tracking-widest">{category.label}</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-slate-300">{reports.length}</span>
           <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-7 mt-0.5 space-y-0.5"
          >
            {reports.map(r => (
              <button 
                key={r.id}
                onClick={() => onSelectReport(r.id)}
                className={`w-full text-left px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeReport === r.id ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                {r.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const ReportsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const userId = queryParams.get('userId')
  
  const [activeReport, setActiveReport] = useState('fleet-overview')
  const [searchQuery, setSearchQuery] = useState('')
  const reportRef = React.useRef(null)

  const user = useMemo(() => mockUsers.find(u => u.id === userId), [userId])

  const catalog = [
    { 
      category: { id: 'overview', label: 'Overview', icon: Layout },
      reports: [{ id: 'fleet-overview', label: 'Fleet overview' }]
    },
    { 
      category: { id: 'vehicles', label: 'Vehicles', icon: Truck },
      reports: [
        { id: 'status-summary', label: 'Status Summary' },
        { id: 'utilization-summary', label: 'Utilization Summary' },
        { id: 'vehicle-renewal', label: 'Renewal Reminders' }
      ]
    },
    { 
      category: { id: 'inspections', label: 'Inspections', icon: ClipboardList },
      reports: [
        { id: 'submission-list', label: 'Submission List' },
        { id: 'failure-list', label: 'Inspection Failures' }
      ]
    },
    { 
      category: { id: 'service', label: 'Service', icon: Wrench },
      reports: [
        { id: 'service-kinds', label: 'Service Kinds' },
        { id: 'work-orders', label: 'Open Work Orders' }
      ]
    },
    { 
      category: { id: 'fuel', label: 'Fuel', icon: Fuel },
      reports: [
        { id: 'consumption-trend', label: 'Consumption Trend' },
        { id: 'efficiency-audit', label: 'Efficiency Audit' }
      ]
    },
    { 
      category: { id: 'finance', label: 'Finance', icon: DollarSign },
      reports: [
        { id: 'cost-summary', label: 'Operating Costs' },
        { id: 'parts-spend', label: 'Parts Inventory' }
      ]
    }
  ]

  // ── Export Logic ───────────────────────────────────────────────────────────
  
  const handleExportWord = async () => {
    const loadToast = toast.loading('Synthesizing Intelligence Report...')
    try {
      const reportEl = reportRef.current
      if (!reportEl) throw new Error("Report context not found")

      // 1. Capture ONLY Charts (Recharts surfaces), skip UI icons
      const chartImages = []
      const chartSvgs = reportEl.querySelectorAll('.recharts-surface')
      
      for (const svg of chartSvgs) {
        try {
          const canvas = document.createElement('canvas')
          const svgData = new XMLSerializer().serializeToString(svg)
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
          const url = URL.createObjectURL(svgBlob)
          
          const img = new Image()
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
            img.src = url
          })
          
          // Use fixed width for report charts to keep them crisp and sized correctly in Word
          canvas.width = 1200
          canvas.height = (img.height / img.width) * 1200
          const ctx = canvas.getContext('2d')
          ctx.fillStyle = 'white'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          
          chartImages.push(canvas.toDataURL('image/jpeg', 0.9))
          URL.revokeObjectURL(url)
        } catch (err) { console.warn("Chart capture failed:", err) }
      }

      // 2. Construct Professional Document
      const docChildren = []

      // Branding Header
      docChildren.push(
        new docx.Paragraph({
          children: [
            new docx.TextRun({ text: "JAXIFLEET COMMAND CENTER", bold: true, size: 20, color: "4F46E5", characterSpacing: 40 }),
          ],
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({ text: userId ? "PERSONNEL PERFORMANCE AUDIT" : activeReport.toUpperCase().replace('-', ' '), bold: true, size: 40, color: "0f172a" }),
          ],
          spacing: { before: 200, after: 400 },
        })
      )

      // Report Metadata Table
      docChildren.push(
        new docx.Table({
          width: { size: 100, type: docx.WidthType.PERCENTAGE },
          borders: {
            top: { style: docx.BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
            bottom: { style: docx.BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
            left: { style: docx.BorderStyle.NONE },
            right: { style: docx.BorderStyle.NONE },
          },
          rows: [
            new docx.TableRow({
              children: [
                new docx.TableCell({
                  shading: { fill: "F8FAFC" },
                  children: [
                    new docx.Paragraph({
                      children: [
                        new docx.TextRun({ text: "Generated: ", bold: true, size: 18 }),
                        new docx.TextRun({ text: new Date().toLocaleString(), size: 18 }),
                      ],
                    }),
                    new docx.Paragraph({
                      children: [
                        new docx.TextRun({ text: "Report Period: ", bold: true, size: 18 }),
                        new docx.TextRun({ text: "Last 14 Days (Live Synthesis)", size: 18 }),
                      ],
                    }),
                  ],
                  padding: { top: 100, bottom: 100, left: 100 },
                }),
              ],
            }),
          ],
        })
      )

      // Subject Info (for User Report)
      if (userId && user) {
        docChildren.push(
          new docx.Paragraph({ spacing: { before: 400 } }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({ text: `Subject: ${user.name}`, bold: true, size: 28, color: "1e293b" }),
            ],
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({ text: `Role: ${user.role.name} | Security Score: ${user.performance}%`, size: 18, color: "64748b" }),
            ],
            spacing: { after: 400 },
          })
        )
      }

      // Main Content: Charts
      if (chartImages.length > 0) {
        docChildren.push(
          new docx.Paragraph({
            children: [new docx.TextRun({ text: "TELEMETRY & VISUAL ANALYTICS", bold: true, size: 24, color: "334155" })],
            spacing: { before: 600, after: 200 },
          })
        )

        chartImages.forEach((imgData) => {
          const base64 = imgData.split(',')[1]
          const binary = atob(base64)
          const bytes = new Uint8Array(binary.length)
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)

          docChildren.push(
            new docx.Paragraph({
              alignment: docx.AlignmentType.CENTER,
              children: [
                new docx.ImageRun({
                  data: bytes,
                  transformation: { width: 520, height: 260 },
                })
              ],
              spacing: { before: 200, after: 200 },
            })
          )
        })
      }

      // Operational Metrics Summary
      docChildren.push(
        new docx.Paragraph({
          children: [new docx.TextRun({ text: "KEY PERFORMANCE INDICATORS", bold: true, size: 24, color: "334155" })],
          spacing: { before: 400, after: 200 },
        }),
        new docx.Table({
          width: { size: 100, type: docx.WidthType.PERCENTAGE },
          rows: [
            new docx.TableRow({
              tableHeader: true,
              children: [
                new docx.TableCell({ shading: { fill: "4F46E5" }, children: [new docx.Paragraph({ children: [new docx.TextRun({ text: "METRIC", bold: true, color: "FFFFFF" })] })] }),
                new docx.TableCell({ shading: { fill: "4F46E5" }, children: [new docx.Paragraph({ children: [new docx.TextRun({ text: "VALUE", bold: true, color: "FFFFFF" })] })] }),
              ],
            }),
            new docx.TableRow({
              children: [
                new docx.TableCell({ children: [new docx.Paragraph("Fleet Health Index")] }),
                new docx.TableCell({ children: [new docx.Paragraph("98.4% (Optimal)")] }),
              ],
            }),
            new docx.TableRow({
              children: [
                new docx.TableCell({ children: [new docx.Paragraph("Safety Compliance")] }),
                new docx.TableCell({ children: [new docx.Paragraph("High - 0 Incidents")] }),
              ],
            }),
          ],
        })
      )

      // Footer
      docChildren.push(
        new docx.Paragraph({
          alignment: docx.AlignmentType.CENTER,
          children: [
            new docx.TextRun({ text: "\nEnd of Secure Intelligence Report.", italics: true, color: "94a3b8", size: 16 }),
          ],
          spacing: { before: 800 },
        })
      )

      const doc = new docx.Document({
        creator: "JaxiFleet Hub",
        title: "Fleet Report",
        sections: [{ children: docChildren }],
      })

      const blob = await docx.Packer.toBlob(doc)
      saveAs(blob, `JaxiFleet_Report_${activeReport}_${new Date().getTime()}.docx`)
      toast.success('Report synthesized successfully', { id: loadToast })
    } catch (error) {
      console.error("WORD EXPORT CRITICAL FAIL:", error)
      toast.error(`Export error: ${error.message}`, { id: loadToast })
    }
  }

  // ── Render Helpers ──────────────────────────────────────────────────────────

  const renderFleetOverview = () => (
    <div className="space-y-8 pb-10">
      {/* ── HOURLY CHARTS SECTION ────────────────────────────────────────── */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Hourly Charts</h3>
              <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg flex items-center gap-2">
                 <Calendar className="w-3.5 h-3.5 text-blue-500" />
                 <span className="text-[11px] font-bold text-slate-600">28.05.2026</span>
              </div>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last updated at <span className="text-slate-800">11:00 AM</span></p>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Hourly Fleet Status Bar Chart */}
          <div className="col-span-6 bg-slate-50/50 rounded-3xl p-6 border border-slate-50">
             <SectionLabel>Hourly Fleet Status</SectionLabel>
             <div className="h-[280px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={mockChartData.hourlyFleetStatus}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="h" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8'}} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="available" fill="#2DD4BF" radius={[2, 2, 0, 0]} name="Available" />
                      <Bar dataKey="inWork" fill="#3B82F6" radius={[2, 2, 0, 0]} name="InWork" />
                      <Bar dataKey="service" fill="#8B5CF6" radius={[2, 2, 0, 0]} name="Service" />
                   </BarChart>
                </ResponsiveContainer>
             </div>
             <div className="flex justify-center gap-6 mt-4">
                {[
                  { l: 'Available', c: 'bg-[#2DD4BF]' },
                  { l: 'InWork', c: 'bg-[#3B82F6]' },
                  { l: 'Service', c: 'bg-[#8B5CF6]' },
                ].map(item => (
                  <div key={item.l} className="flex items-center gap-2">
                     <div className={`w-3 h-3 rounded-full ${item.c}`} />
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.l}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Real-time Status Pie */}
          <div className="col-span-3 bg-slate-50/50 rounded-3xl p-6 border border-slate-50 flex flex-col">
             <SectionLabel>Real-time Fleet Status</SectionLabel>
             <div className="flex-1 flex items-center justify-center">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <RePieChart>
                        <Pie
                           data={[
                             { name: 'Available', value: 66.67, fill: '#2DD4BF' },
                             { name: 'Service', value: 11.11, fill: '#8B5CF6' },
                             { name: 'InWork', value: 22.22, fill: '#3B82F6' },
                           ]}
                           cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value"
                        >
                           { [0,1,2].map((_, i) => <Cell key={i} />) }
                        </Pie>
                        <Tooltip />
                     </RePieChart>
                  </ResponsiveContainer>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-2 mt-4">
                {[
                  { l: 'Available', c: 'bg-[#2DD4BF]' },
                  { l: 'Service', c: 'bg-[#8B5CF6]' },
                  { l: 'InWork', c: 'bg-[#3B82F6]' },
                ].map(item => (
                  <div key={item.l} className="flex items-center gap-2">
                     <div className={`w-2.5 h-2.5 rounded-full ${item.c}`} />
                     <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{item.l}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Vehicle Type Pie */}
          <div className="col-span-3 bg-slate-50/50 rounded-3xl p-6 border border-slate-50 flex flex-col">
             <SectionLabel>Vehicle Type</SectionLabel>
             <div className="flex-1 flex items-center justify-center">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <RePieChart>
                        <Pie
                           data={mockChartData.vehicleTypeDistribution}
                           cx="50%" cy="50%" innerRadius={0} outerRadius={70} dataKey="value"
                        >
                           { mockChartData.vehicleTypeDistribution.map((entry, i) => (
                             <Cell key={i} fill={entry.color} />
                           )) }
                        </Pie>
                        <Tooltip />
                     </RePieChart>
                  </ResponsiveContainer>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-2 mt-4">
                {mockChartData.vehicleTypeDistribution.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                     <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{item.name}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* ── CHARTS FOR PERIOD SECTION ───────────────────────────────────── */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6 mb-8">
           <h3 className="text-xl font-black text-slate-800 tracking-tight">Charts for period</h3>
           <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[11px] font-bold text-slate-600">28.04.2026 - 28.05.2026</span>
           </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
           {/* Daily Fleet Status composition */}
           <div className="col-span-9 bg-slate-50/50 rounded-3xl p-6 border border-slate-50">
              <SectionLabel>Daily Fleet Status composition</SectionLabel>
              <div className="h-[320px] mt-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockChartData.dailyFleetComposition}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                       <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize: 8, fill: '#94A3B8'}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8'}} />
                       <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                       <Bar dataKey="available" fill="#2DD4BF" stackId="a" name="Available" />
                       <Bar dataKey="service" fill="#8B5CF6" stackId="a" name="Service" />
                       <Bar dataKey="inWork" fill="#3B82F6" stackId="a" name="InWork" />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-8 mt-4">
                 {[
                   { l: 'Available', c: 'bg-[#2DD4BF]' },
                   { l: 'Service', c: 'bg-[#8B5CF6]' },
                   { l: 'InWork', c: 'bg-[#3B82F6]' },
                 ].map(item => (
                   <div key={item.l} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.c}`} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.l}</span>
                   </div>
                 ))}
              </div>
           </div>

           {/* Ratio Fleet Status for Period */}
           <div className="col-span-3 bg-slate-50/50 rounded-3xl p-6 border border-slate-50 flex flex-col">
              <SectionLabel>Ratio Fleet Status for Period</SectionLabel>
              <div className="flex-1 flex items-center justify-center">
                 <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <RePieChart>
                          <Pie
                             data={[
                               { name: 'Available', value: 40.71, fill: '#2DD4BF' },
                               { name: 'Service', value: 10.29, fill: '#8B5CF6' },
                               { name: 'InWork', value: 49.00, fill: '#3B82F6' },
                             ]}
                             cx="50%" cy="50%" innerRadius={0} outerRadius={85} dataKey="value"
                          >
                             { [0,1,2].map((_, i) => <Cell key={i} />) }
                          </Pie>
                          <Tooltip />
                       </RePieChart>
                    </ResponsiveContainer>
                 </div>
              </div>
              <div className="grid grid-cols-1 gap-3 mt-6 pl-4">
                 {[
                   { l: 'Available', c: 'bg-[#2DD4BF]' },
                   { l: 'Service', c: 'bg-[#8B5CF6]' },
                   { l: 'InWork', c: 'bg-[#3B82F6]' },
                 ].map(item => (
                   <div key={item.l} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.c}`} />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.l}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  )

  const renderStatusSummary = () => (
    <div className="space-y-6">
       <motion.div {...fadeUp()} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
          <SectionLabel>Vehicle Status Summary</SectionLabel>
          <p className="text-sm text-slate-400 font-medium mb-10">Lists the time vehicles have spent in different statuses over the selected period.</p>
          <div className="grid grid-cols-12 gap-10 items-center">
             <div className="col-span-4 flex justify-center">
                <Ring value={48} max={48} size={160} sublabel="VEHICLES" color="#10B981" />
             </div>
             <div className="col-span-8 space-y-8">
                <ProgressBar label="Active" value={34} max={48} color="#10B981" subtext="71% Distribution" />
                <ProgressBar label="In Shop" value={8} max={48} color="#F59E0B" subtext="17% Distribution" />
                <ProgressBar label="Out of Service" value={5} max={48} color="#EF4444" subtext="10% Distribution" />
                <ProgressBar label="Sold" value={1} max={48} color="#94A3B8" subtext="2% Distribution" />
             </div>
          </div>
       </motion.div>
    </div>
  )

  const renderSubmissionList = () => (
    <div className="space-y-6">
       <motion.div {...fadeUp()} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm overflow-hidden">
          <SectionLabel>Inspection Submission Trend</SectionLabel>
          <div className="h-[200px] mb-8">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={mockChartData.fuelHourly.slice(0, 14)}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                 <XAxis dataKey="h" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8'}} />
                 <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} />
                 <Bar dataKey="v" fill="#3B82F6" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </div>
          
          <SectionLabel>All Submissions - Last 14 Days</SectionLabel>
          <div className="space-y-3 mt-6">
             {[
               { title: 'Pre-trip · Toyota 001', date: 'May 5, 2026 5:00 PM', driver: 'Alex Rivera · 7m', status: 'pass' },
               { title: 'Pre-trip · Chevrolet 013', date: 'May 5, 2026 5:00 PM', driver: 'Daria Okafor · 10m', status: 'fail' },
               { title: 'Pre-trip · Ford 023', date: 'May 5, 2026 5:00 PM', driver: 'Alex Rivera · 11m', status: 'fail' },
               { title: 'Pre-trip · Ram 004', date: 'May 4, 2026 5:00 PM', driver: 'Bailey Chen · 12m', status: 'fail' },
               { title: 'Pre-trip · Toyota 001', date: 'May 3, 2026 5:00 PM', driver: 'Alex Rivera · 8m', status: 'pass' },
               { title: 'Post-trip · Ram 004', date: 'May 1, 2026 5:00 PM', driver: 'Bailey Chen · 5m', status: 'pass' },
             ].map((sub, i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-50 hover:bg-white hover:shadow-md hover:border-slate-100 transition-all group">
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sub.status === 'pass' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                        {sub.status === 'pass' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                     </div>
                     <div>
                        <p className="text-sm font-black text-slate-800">{sub.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{sub.date} · {sub.driver}</p>
                     </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-all" />
               </div>
             ))}
          </div>
       </motion.div>
    </div>
  )

  const renderUserIntelligenceReport = () => {
    if (!user) return null
    return (
      <div className="space-y-6 pb-20">
        {/* User Intelligence Header */}
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden mb-6">
           <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />
           <div className="flex items-start gap-8">
              <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl relative shrink-0">
                 <img src={user.photo} alt="" className="w-full h-full object-cover" />
                 <div className="absolute bottom-0 right-0 w-8 h-8 bg-tech-blue border-4 border-white rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white fill-white" />
                 </div>
              </div>
              <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight">{user.name}</h2>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Master Driver</span>
                 </div>
                 <p className="text-slate-400 font-medium max-w-xl leading-relaxed mb-6">Intelligence synthesis for {user.role.name}. This report correlates historical telemetry, safety compliance, and operational efficiency metrics.</p>
                 
                 <div className="grid grid-cols-4 gap-6">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Safety Score</p>
                       <p className="text-2xl font-black text-slate-800">{user.performance}%</p>
                    </div>
                    <div className="border-l border-slate-100 pl-6">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">On-Time Rate</p>
                       <p className="text-2xl font-black text-slate-800">98.4%</p>
                    </div>
                    <div className="border-l border-slate-100 pl-6">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fuel Economy</p>
                       <p className="text-2xl font-black text-blue-600">32.8L</p>
                    </div>
                    <div className="border-l border-slate-100 pl-6">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assets Managed</p>
                       <p className="text-2xl font-black text-slate-800">12</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
           {/* Telemetry Charts */}
           <div className="col-span-8 space-y-6">
              <motion.div {...fadeUp(0.1)} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                 <SectionLabel>Weekly Performance Synthesis</SectionLabel>
                 <div className="h-64 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={mockChartData.fuelWeekly}>
                          <defs>
                             <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                          <XAxis dataKey="h" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8'}} />
                          <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} />
                          <Area type="monotone" dataKey="v" stroke="#3B82F6" strokeWidth={4} fill="url(#userGrad)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </motion.div>

              <motion.div {...fadeUp(0.2)} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                 <SectionLabel>Recent Activity Log</SectionLabel>
                 <div className="space-y-4">
                    {[
                       { title: 'Geofence Entry: Zone A', date: 'May 5, 2026', type: 'System', val: 'Verified' },
                       { title: 'Route Optimization Applied', date: 'May 5, 2026', type: 'AI', val: '-12% Fuel' },
                       { title: 'Pre-Trip Inspection Complete', date: 'May 4, 2026', type: 'Safety', val: 'Passed' },
                    ].map((log, i) => (
                       <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-50">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm">
                                <Activity className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-800">{log.title}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{log.date} · {log.type}</p>
                             </div>
                          </div>
                          <span className="text-[10px] font-black px-3 py-1 bg-white border border-slate-100 rounded-lg text-slate-600 uppercase tracking-widest">{log.val}</span>
                       </div>
                    ))}
                 </div>
              </motion.div>
           </div>

           {/* Skills & Achievements */}
           <div className="col-span-4 space-y-6">
              <motion.div {...fadeUp(0.3)} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                 <SectionLabel>Skill Matrix</SectionLabel>
                 <div className="space-y-6">
                    <ProgressBar label="Defensive Driving" value={9.2} max={10} color="#10B981" subtext="Expert" />
                    <ProgressBar label="Fuel Efficiency" value={8.5} max={10} color="#3B82F6" subtext="Advanced" />
                    <ProgressBar label="Route Planning" value={7.8} max={10} color="#8B5CF6" subtext="Advanced" />
                    <ProgressBar label="Safety Compliance" value={9.8} max={10} color="#10B981" subtext="Elite" />
                 </div>
              </motion.div>

              <motion.div {...fadeUp(0.4)} className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl">
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6">Achievements</p>
                 <div className="grid grid-cols-2 gap-4">
                    {[
                       { label: 'Eco Legend', icon: Leaf, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                       { label: 'Safety First', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                       { label: 'Top Performer', icon: Award, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                       { label: 'Asset Keeper', icon: Truck, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                    ].map((ach, i) => (
                       <div key={i} className="flex flex-col items-center p-4 rounded-3xl bg-white/5 border border-white/10 text-center group hover:bg-white/10 transition-all">
                          <div className={`w-12 h-12 rounded-2xl ${ach.bg} flex items-center justify-center ${ach.color} mb-3 group-hover:scale-110 transition-transform`}>
                             <ach.icon className="w-6 h-6" />
                          </div>
                          <p className="text-[10px] font-black text-white uppercase tracking-tighter">{ach.label}</p>
                       </div>
                    ))}
                 </div>
              </motion.div>
           </div>
        </div>
      </div>
    )
  }

  const SectionLabel = ({ children }) => <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">{children}</p>

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F8FAFC] overflow-hidden">
      <Navbar />
      
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 p-3 pt-24 gap-3">

        <div className="flex-1 flex gap-3 overflow-hidden min-h-0">
          
          {/* Left Panel: Report Catalog */}
          <div className="w-[300px] shrink-0 flex flex-col bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden h-full">
             <div className="p-6 border-b border-slate-50">
                <h1 className="text-xl font-black text-slate-800 tracking-tight mb-1">Reports</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">Intelligence catalog — select a report to analyze fleet data.</p>
                
                <div className="relative mt-5">
                   <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                   <input 
                     type="text" 
                     placeholder="Find a report..." 
                     value={searchQuery}
                     onChange={e => setSearchQuery(e.target.value)}
                     className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-slate-300"
                   />
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                 <div className="flex gap-2 mb-4 px-2">
                    {['All 40', 'Favorites', 'Recent'].map(tab => (
                      <button key={tab} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${tab === 'All 40' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}>{tab}</button>
                    ))}
                 </div>
                 
                 {catalog.map(cat => (
                   <ReportCategory 
                     key={cat.category.id} 
                     category={cat.category} 
                     reports={cat.reports} 
                     activeReport={activeReport}
                     onSelectReport={setActiveReport}
                   />
                 ))}
              </div>

              <div className="p-4 border-t border-slate-50 bg-slate-50/30">
                 <button className="w-full py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                    <Settings className="w-3.5 h-3.5" /> Manage Custom Reports
                 </button>
              </div>
           </div>

           {/* Right Panel: Report Dashboard */}
           <div className="flex-1 flex flex-col gap-3 overflow-hidden">
              
              {/* Report Toolbar */}
              <div className="bg-white rounded-2xl px-6 py-3 border border-slate-100 shadow-sm flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-400">
                       <Clock className="w-3.5 h-3.5" />
                       <span className="text-[10px] font-bold uppercase tracking-wider">Updated Just Now</span>
                    </div>
                    <div className="h-4 w-px bg-slate-100" />
                    <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-all">
                       <Calendar className="w-3.5 h-3.5 text-blue-600" />
                       <span className="text-[11px] font-black text-slate-700">Last 14 days</span>
                       <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                 </div>

                 <div className="flex items-center gap-2">
                    <button onClick={() => toast.success('Added to favorites')} className="p-2 text-slate-300 hover:text-amber-400 transition-all"><Star className="w-4 h-4" /></button>
                    <button onClick={() => toast.success('Refreshing data...')} className="p-2 text-slate-300 hover:text-blue-600 transition-all"><RefreshCw className="w-4 h-4" /></button>
                    <button onClick={() => window.print()} className="p-2 text-slate-300 hover:text-slate-600 transition-all"><Printer className="w-4 h-4" /></button>
                    <button onClick={() => toast.success('Report exported to PDF')} className="p-2 text-slate-300 hover:text-red-500 transition-all" title="Export PDF"><FileText className="w-4 h-4" /></button>
                    <div className="h-4 w-px bg-slate-100 mx-2" />
                    <button onClick={handleExportWord} className="px-5 py-2 bg-tech-blue text-white rounded-xl text-[10px] font-black uppercase tracking-[0.1em] shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
                       <Download className="w-3.5 h-3.5" /> Export Word
                    </button>
                 </div>
              </div>

              {/* Report Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0" ref={reportRef}>
                 <AnimatePresence mode="wait">
                   <motion.div 
                     key={userId || activeReport}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.3 }}
                   >
                      <div className="mb-8 flex items-end justify-between">
                        <div>
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em] mb-1">
                            {userId ? 'Personnel Intelligence' : catalog.find(c => c.reports.some(r => r.id === activeReport))?.category.label}
                          </p>
                          <h2 className="text-3xl font-black text-slate-800 tracking-tight capitalize">
                            {userId ? 'Driver Intelligence Report' : activeReport.split('-').join(' ')}
                          </h2>
                          <p className="text-sm text-slate-400 font-medium mt-1">
                            {userId 
                              ? `Comprehensive behavioral analysis and performance synthesis for ${user?.name}.` 
                              : `Comprehensive analysis of ${activeReport.split('-')[0]} metrics, alerts, and historical performance trends.`
                            }
                          </p>
                        </div>
                        {userId && (
                          <button 
                            onClick={() => navigate('/reports')}
                            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all flex items-center gap-2"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
                          </button>
                        )}
                      </div>

                      {userId && renderUserIntelligenceReport()}
                      {!userId && activeReport === 'fleet-overview' && renderFleetOverview()}
                      {!userId && activeReport === 'status-summary' && renderStatusSummary()}
                      {!userId && activeReport === 'submission-list' && renderSubmissionList()}
                      
                      {!userId && activeReport !== 'fleet-overview' && activeReport !== 'status-summary' && activeReport !== 'submission-list' && (
                        <div className="p-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                           <BarChart3 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                           <h3 className="text-xl font-black text-slate-400">Advanced Analytics Hub</h3>
                           <p className="text-sm text-slate-300 max-w-sm mx-auto mt-2 italic font-medium">Detailed data modeling for "{activeReport}" is being calculated. Check back in a moment for full visualization.</p>
                        </div>
                      )}
                   </motion.div>
                 </AnimatePresence>
              </div>
           </div>
        </div>
      </main>
    </div>
  )
}

export default ReportsPage

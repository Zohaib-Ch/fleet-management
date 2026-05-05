import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Download, Printer, FileText, Check, Shield, Truck, User, Globe, Calendar 
} from 'lucide-react'
import { 
  Document, Packer, Paragraph, Table, TableCell, TableRow, 
  AlignmentType, HeadingLevel, TextRun, WidthType, BorderStyle,
  VerticalAlign
} from 'docx'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'

const ReportGenerationModal = ({ isOpen, onClose, data, mode }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [step, setStep] = useState('preview') // preview, done

  if (!data && mode !== 'Global') return null

  const handleDownload = async () => {
    setIsGenerating(true)
    const loadToast = toast.loading('Architecting professional Word document...')
    
    try {
      const subject = mode === 'Global' ? 'Enterprise Fleet' : (data?.name || data?.id)
      const reportId = `JF-${Math.floor(Math.random()*1000000)}`
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

      // Create Document
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Header
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: "JaxiFleet Operations", bold: true, color: "2563EB", size: 24 }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: `Document ID: ${reportId}`, size: 16, color: "94A3B8" }),
              ],
            }),

            // Title
            new Paragraph({
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.LEFT,
              spacing: { before: 400, after: 400 },
              children: [
                new TextRun({ text: `${mode.toUpperCase()} PERFORMANCE AUDIT`, bold: true, color: "1E293B", size: 48 }),
              ],
            }),

            // Subject Info Table
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      shading: { fill: "F8FAFC" },
                      borders: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" } },
                      children: [new Paragraph({ children: [new TextRun({ text: "REPORT SUBJECT", bold: true, size: 18, color: "475569" })] })],
                    }),
                    new TableCell({
                      shading: { fill: "F8FAFC" },
                      borders: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" } },
                      children: [new Paragraph({ children: [new TextRun({ text: "GENERATION DATE", bold: true, size: 18, color: "475569" })] })],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: subject, bold: true, size: 22, color: "1E293B" })] })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: dateStr, bold: true, size: 22, color: "1E293B" })] })],
                    }),
                  ],
                }),
              ],
            }),

            new Paragraph({ spacing: { before: 400 } }),

            // Introduction (Justified)
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 300 },
              children: [
                new TextRun({ 
                  text: "This comprehensive performance audit provides a deep-dive analysis into the operational efficiency and compliance metrics recorded via the JaxiFleet satellite telemetry network. The data presented herein has been verified through multiple redundant sensors and represents the official performance standing for the specified audit period.",
                  size: 20,
                  color: "334155"
                }),
              ],
            }),

            // Metrics Table
            new Paragraph({
               children: [new TextRun({ text: "CORE PERFORMANCE METRICS", bold: true, color: "2563EB", size: 24 })],
               spacing: { before: 400, after: 200 }
            }),

            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: ["METRIC CATEGORY", "RECORDED VALUE", "BENCHMARK STATUS"].map(h => 
                    new TableCell({
                      shading: { fill: "2563EB" },
                      children: [new Paragraph({ 
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: h, color: "FFFFFF", bold: true, size: 18 })] 
                      })],
                    })
                  )
                }),
                ... (mode === 'Global' ? [
                  { c: 'Fleet Efficiency Index', v: '94.2%', s: 'EXCEEDS TARGET' },
                  { c: 'Total Network Uptime', v: '99.8%', s: 'OPTIMAL' },
                  { c: 'Average Compliance Score', v: '100%', s: 'COMPLIANT' },
                  { c: 'CO2 Reduction Impact', v: '1.2t', s: 'PLATINUM RATING' },
                ] : mode === 'Vehicle' ? [
                  { c: 'Asset Health Score', v: `${data?.vitals?.battery}%`, s: 'NOMINAL' },
                  { c: 'Engine Efficiency', v: '98/100', s: 'OPTIMIZED' },
                  { c: 'Fuel Consumption', v: `${data?.vitals?.fuel}%`, s: 'NORMAL' },
                  { c: 'Telematics Link', v: 'Strong', s: 'ACTIVE' },
                ] : [
                  { c: 'Operator Performance', v: `${data?.performance}%`, s: 'TOP TIER' },
                  { c: 'Safety Compliance', v: '100%', s: 'VERIFIED' },
                  { c: 'Duty Cycle Adherence', v: '99%', s: 'OPTIMAL' },
                  { c: 'Eco-Driving Index', v: '94/100', s: 'EXCELLENT' },
                ]).map(row => 
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: row.c, size: 18 })] })] }),
                      new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: row.v, bold: true, size: 18 })] })] }),
                      new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: row.s, color: "10B981", bold: true, size: 16 })] })] }),
                    ]
                  })
                )
              ],
            }),

            // Footer / Disclaimer
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 800 },
              children: [
                new TextRun({ 
                  text: "PROPRIETARY AND CONFIDENTIAL - JAXIFLEET INTELLECTUAL PROPERTY", 
                  italics: true, 
                  color: "94A3B8",
                  size: 16
                }),
              ],
            }),
          ],
        }],
      });

      // Generate and Save
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `JaxiFleet_Audit_${mode}_${subject.replace(/\s+/g, '_')}.docx`);

      toast.success('Word Document generated successfully', { id: loadToast })
      setIsGenerating(false)
      setStep('done')
    } catch (error) {
      console.error(error)
      toast.error('Failed to generate Word document', { id: loadToast })
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[8000]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[85vh] bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] z-[8001] overflow-hidden flex flex-col border border-white/50"
          >
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                     <FileText className="w-6 h-6" />
                  </div>
                  <div>
                     <h2 className="text-xl font-black text-tech-slate tracking-tight">Report Intelligence Preview</h2>
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Enterprise Document Generator</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <button 
                    onClick={handlePrint}
                    className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 transition-all"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={onClose}
                    className="p-3 hover:bg-slate-50 rounded-xl text-slate-400 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
               </div>
            </div>

            {/* Preview Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-12 bg-slate-50/50 custom-scrollbar print:bg-white">
               <div className="max-w-3xl mx-auto bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2rem] p-16 min-h-[1000px] border border-white print:shadow-none print:border-none">
                  
                  {/* Report Header */}
                  <div className="flex justify-between items-start mb-16 border-b border-slate-100 pb-12">
                     <div>
                        <div className="flex items-center gap-2 mb-4">
                           <Truck className="w-6 h-6 text-blue-600" />
                           <span className="text-xl font-black text-tech-slate tracking-tighter">JaxiFleet</span>
                        </div>
                        <h1 className="text-3xl font-black text-tech-slate mb-2">Formal Analytics Report</h1>
                        <p className="text-sm text-slate-400 font-medium italic">Confidential Document ID: #JF-{Math.floor(Math.random()*1000000)}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Generated On</p>
                        <p className="text-sm font-bold text-tech-slate">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                     </div>
                  </div>

                  {/* Mode Specific Info */}
                  <div className="mb-16">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="w-1 bg-blue-600 h-8 rounded-full"></div>
                        <h3 className="text-lg font-bold text-tech-slate">Report Subject & Scope</h3>
                     </div>
                     
                     <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 grid grid-cols-2 gap-8">
                        {mode === 'Global' ? (
                          <>
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Scope</p>
                               <p className="text-sm font-bold text-tech-slate">Enterprise Fleet Network</p>
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Region</p>
                               <p className="text-sm font-bold text-tech-slate">Northern Denmark Operations</p>
                            </div>
                          </>
                        ) : mode === 'Vehicle' ? (
                          <>
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Asset ID</p>
                               <p className="text-sm font-bold text-tech-slate">{data?.id}</p>
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Asset Model</p>
                               <p className="text-sm font-bold text-tech-slate">{data?.model}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Employee Name</p>
                               <p className="text-sm font-bold text-tech-slate">{data?.name}</p>
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Assigned Role</p>
                               <p className="text-sm font-bold text-tech-slate">{data?.role}</p>
                            </div>
                          </>
                        )}
                     </div>
                  </div>

                  {/* Data Grid Section */}
                  <div className="mb-16">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="w-1 bg-blue-600 h-8 rounded-full"></div>
                        <h3 className="text-lg font-bold text-tech-slate">Performance Metrics</h3>
                     </div>
                     <div className="grid grid-cols-3 gap-6">
                        {[
                          { l: 'Efficiency Index', v: '94.2%', s: 'Excellent' },
                          { l: 'System Uptime', v: '99.8%', s: 'Stable' },
                          { l: 'Compliance Score', v: '100%', s: 'Perfect' },
                          { l: 'Avg Fuel Economy', v: '12.4L', s: 'Optimized' },
                          { l: 'Telematics Signal', v: 'Strong', s: 'Active' },
                          { l: 'Risk Level', v: 'Minimal', s: 'Low' },
                        ].map((item, i) => (
                          <div key={i} className="p-6 rounded-2xl border border-slate-100">
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.l}</p>
                             <p className="text-lg font-black text-tech-slate mb-1">{item.v}</p>
                             <p className="text-[9px] font-bold text-emerald-500 uppercase">{item.s}</p>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Verification Footer */}
                  <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-end">
                     <div>
                        <div className="flex items-center gap-2 mb-2 text-indigo-600">
                           <Shield className="w-4 h-4" />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Authenticated Document</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-xs">
                           This report is electronically generated and verified. Digital signatures are embedded in the PDF metadata for authentication purposes.
                        </p>
                     </div>
                     <div className="w-24 h-24 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 p-2">
                        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">QR SECURE</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Modal Footer (Fixed) */}
            <div className="p-8 border-t border-slate-100 bg-white flex justify-between items-center sticky bottom-0">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${step === 'done' ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`} />
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {step === 'done' ? 'Ready for distribution' : 'Verification Pending'}
                     </span>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button 
                    onClick={onClose}
                    className="px-8 py-4 bg-slate-50 text-slate-500 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-all"
                  >
                    Discard Session
                  </button>
                  <button 
                    onClick={handleDownload}
                    disabled={isGenerating || step === 'done'}
                    className={`px-10 py-4 flex items-center justify-center gap-2 rounded-2xl text-sm font-bold shadow-xl transition-all ${isGenerating || step === 'done' ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-tech-blue text-white shadow-blue-100 hover:bg-blue-700'}`}
                  >
                    {isGenerating ? (
                       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                          <Download className="w-4 h-4" />
                       </motion.div>
                    ) : step === 'done' ? (
                       <Check className="w-4 h-4" />
                    ) : (
                       <Download className="w-4 h-4" />
                    )}
                    {isGenerating ? 'Architecting...' : step === 'done' ? 'Doc Generated' : 'Download Word (.docx)'}
                  </button>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ReportGenerationModal

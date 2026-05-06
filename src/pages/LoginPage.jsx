import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Truck, Shield, Lock, Mail, ChevronRight, Activity, 
  Globe, Zap, Fingerprint, ShieldCheck, ArrowRight
} from 'lucide-react'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('MANAGEMENT')
  const [isScanning, setIsScanning] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter your credentials')
      return
    }

    setIsScanning(true)
    const loadToast = toast.loading('Authenticating secure session...')
    
    // Simulate auth delay with "Scanning" effect
    setTimeout(() => {
      login(email, selectedRole)
      toast.success('Access Granted. Welcome back.', { id: loadToast })
      navigate('/')
    }, 2400)
  }

  const roleOptions = [
    { key: 'MANAGEMENT', label: 'Management', icon: Shield, desc: 'Full Authority' },
    { key: 'DISPATCHER', label: 'Dispatcher', icon: Globe, desc: 'Operations' },
    { key: 'MECHANIC', label: 'Mechanic', icon: Activity, desc: 'Technical' },
    { key: 'EXTERNAL_PARTNER', label: 'Partner', icon: Truck, desc: 'Limited' },
  ]

  return (
    <div className="min-h-screen w-full bg-[#020617] flex items-center justify-center overflow-hidden font-outfit relative">
      
      {/* ── CINEMATIC BACKGROUND ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.08)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
            x: [0, -120, 0],
            y: [0, 80, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full"
        />
      </div>

      {/* ── LOGIN CONTAINER ─────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left Side: Branding/Identity */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left hidden md:block"
        >
          <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[9px] font-black text-blue-300 uppercase tracking-[0.2em]">Next-Gen Intelligence</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-6">
            Command <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">Centric.</span>
          </h1>
          
          <p className="text-slate-400 text-base lg:text-lg font-medium max-w-md mx-auto lg:mx-0 leading-relaxed">
            Unifying logistics, telemetry, and human intelligence into a single operative interface.
          </p>

          <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-6 opacity-40">
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure SSL</span>
             </div>
             <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Biometric</span>
             </div>
          </div>
        </motion.div>

        {/* Right Side: Auth Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-[440px]"
        >
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden">
            {/* Scanning Overlay */}
            <AnimatePresence>
               {isScanning && (
                 <motion.div 
                    initial={{ top: '-100%' }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent z-20 opacity-50 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                 />
               )}
            </AnimatePresence>

            <div className="mb-8 text-center">
               <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-5 shadow-2xl shadow-blue-600/20">
                  <Truck className="w-7 h-7" />
               </div>
               <h2 className="text-2xl font-black text-white tracking-tight">Security Portal</h2>
               <p className="text-slate-500 text-xs font-medium mt-1.5">Initialize operative session</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
               <div className="space-y-2">
                  <div className="relative group">
                     <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                     <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Operator ID / Email"
                        className="w-full pl-12 pr-6 py-4 bg-white/5 rounded-2xl border border-white/5 focus:border-blue-500/50 focus:bg-white/[0.08] transition-all text-white outline-none text-sm font-medium placeholder:text-slate-600"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <div className="relative group">
                     <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                     <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Security Key"
                        className="w-full pl-12 pr-6 py-4 bg-white/5 rounded-2xl border border-white/5 focus:border-blue-500/50 focus:bg-white/[0.08] transition-all text-white outline-none text-sm font-medium placeholder:text-slate-600"
                     />
                  </div>
               </div>

               <div className="pt-2">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Clearance Level</p>
                  <div className="grid grid-cols-2 gap-2.5">
                     {roleOptions.map((role) => (
                        <button
                           key={role.key}
                           type="button"
                           onClick={() => setSelectedRole(role.key)}
                           className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col gap-1.5 relative overflow-hidden group ${
                             selectedRole === role.key 
                             ? 'border-blue-500/50 bg-blue-500/10' 
                             : 'border-white/5 bg-white/5 hover:border-white/20'
                           }`}
                        >
                           {selectedRole === role.key && (
                              <motion.div layoutId="role-bg" className="absolute inset-0 bg-blue-500/5" />
                           )}
                           <role.icon className={`w-4 h-4 relative z-10 ${selectedRole === role.key ? 'text-blue-400' : 'text-slate-500'}`} />
                           <div className="relative z-10">
                              <p className={`text-[11px] font-bold ${selectedRole === role.key ? 'text-white' : 'text-slate-400'}`}>{role.label}</p>
                              <p className="text-[8px] text-slate-500 font-medium">{role.desc}</p>
                           </div>
                        </button>
                     ))}
                  </div>
               </div>

               <button 
                  type="submit"
                  disabled={isScanning}
                  className="w-full py-4.5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-blue-600/20 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group mt-4 relative overflow-hidden"
               >
                  <span className="relative z-10">{isScanning ? 'Authenticating...' : 'Establish Connection'}</span>
                  {!isScanning && <ArrowRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-1 transition-transform" />}
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
               </button>
            </form>

            <div className="mt-8 text-center">
               <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] max-w-[240px] mx-auto leading-relaxed">
                  Confidential Operative Terminal <br />
                  <span className="text-slate-700">© 2026 JaxiFleet Operations</span>
               </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Blur Background Elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

    </div>
  )
}

export default LoginPage

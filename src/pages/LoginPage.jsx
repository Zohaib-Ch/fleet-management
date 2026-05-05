import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Truck, Shield, Lock, Mail, ChevronRight, Activity, Globe } from 'lucide-react'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('MANAGEMENT')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter your credentials')
      return
    }

    const loadToast = toast.loading('Authenticating...')
    
    // Simulate auth delay
    setTimeout(() => {
      login(email, selectedRole)
      toast.success('Welcome to JaxiFleet Command', { id: loadToast })
      navigate('/')
    }, 1500)
  }

  const roleOptions = [
    { key: 'MANAGEMENT', label: 'Management', icon: Shield, desc: 'Full System Access' },
    { key: 'DISPATCHER', label: 'Dispatcher', icon: Globe, desc: 'Operational Control' },
    { key: 'MECHANIC', label: 'Mechanic', icon: Activity, desc: 'Technical Maintenance' },
    { key: 'EXTERNAL_PARTNER', label: 'Partner', icon: Truck, desc: 'Read-only Access' },
  ]

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex overflow-hidden font-outfit">
      {/* Left Side - Visual/Branding */}
      <div className="hidden lg:flex w-1/2 bg-tech-slate relative overflow-hidden p-16 flex-col justify-between">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
         </div>
         
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
               <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-900/20">
                  <Truck className="w-7 h-7" />
               </div>
               <span className="text-2xl font-black text-white tracking-tighter">JaxiFleet</span>
            </div>
            
            <h1 className="text-6xl font-black text-white leading-tight mb-8">
               Intelligence Behind <br />
               <span className="text-blue-500">Every Asset.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-md leading-relaxed">
               The next generation of fleet management. Real-time telemetry, advanced AI diagnostics, and seamless command dispatching.
            </p>
         </div>

         <div className="relative z-10 grid grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
               <p className="text-3xl font-black text-white mb-1">12,401</p>
               <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Active Assets</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
               <p className="text-3xl font-black text-white mb-1">99.9%</p>
               <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Uptime Record</p>
            </div>
         </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="w-full max-w-md"
         >
            <div className="mb-12">
               <h2 className="text-4xl font-black text-tech-slate mb-3">Sign In</h2>
               <p className="text-slate-400 font-medium">Access your enterprise dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                  <div className="relative">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                     <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm outline-none font-medium"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Password</label>
                     <a href="#" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Forgot?</a>
                  </div>
                  <div className="relative">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                     <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all text-sm outline-none font-medium"
                     />
                  </div>
               </div>

               <div className="space-y-3 pt-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Access Role (Demo Mode)</label>
                  <div className="grid grid-cols-2 gap-3">
                     {roleOptions.map((role) => (
                        <button
                           key={role.key}
                           type="button"
                           onClick={() => setSelectedRole(role.key)}
                           className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${selectedRole === role.key ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50 bg-slate-50/30 hover:border-slate-100'}`}
                        >
                           <role.icon className={`w-5 h-5 ${selectedRole === role.key ? 'text-blue-600' : 'text-slate-400'}`} />
                           <div>
                              <p className={`text-xs font-bold ${selectedRole === role.key ? 'text-blue-700' : 'text-tech-slate'}`}>{role.label}</p>
                              <p className="text-[9px] text-slate-400 font-medium">{role.desc}</p>
                           </div>
                        </button>
                     ))}
                  </div>
               </div>

               <button 
                  type="submit"
                  className="w-full py-5 bg-tech-slate text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-200 hover:bg-black transition-all flex items-center justify-center gap-3 group mt-8"
               >
                  Authorize Access
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
            </form>

            <div className="mt-12 pt-8 border-t border-slate-100 text-center">
               <p className="text-slate-400 text-xs font-medium">
                  Confidential System. Unauthorized access is strictly prohibited. <br />
                  © 2026 JaxiFleet Operations.
               </p>
            </div>
         </motion.div>
      </div>
    </div>
  )
}

export default LoginPage

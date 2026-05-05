import React, { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useTransform, animate, useMotionValue } from 'framer-motion'
import { TrendingUp, ArrowUpRight, Sparkles } from 'lucide-react'

const Counter = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0)
  
  // Clean the value string to get just the number (e.g., "482" or "86%")
  const numericValue = parseFloat(value.toString().replace(/[^0-9.]/g, ''))
  const suffix = value.toString().replace(/[0-9.]/g, '')

  useEffect(() => {
    const controls = animate(0, numericValue, {
      duration: 2.5,
      ease: [0.16, 1, 0.3, 1], // Luxury cubic bezier
      onUpdate: (latest) => {
        setDisplayValue(latest)
      },
    })
    return () => controls.stop()
  }, [numericValue])

  return (
    <span>
      {suffix === '%' ? displayValue.toFixed(1) : Math.floor(displayValue).toLocaleString()}
      {suffix}
    </span>
  )
}

const KPICard = ({ label, value, subvalue, icon: Icon, color, delay = 0 }) => {
  const cardRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth springs for the tilt effect
  const springConfig = { stiffness: 150, damping: 20 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig)
  
  // Spotlight effect positioning
  const spotlightX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig)
  const spotlightY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div 
      className="perspective-1000 w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          delay: delay * 0.1, 
          duration: 1.2, 
          ease: [0.16, 1, 0.3, 1] 
        }}
        className="relative group bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-7 min-w-[280px] flex-1 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/80 overflow-hidden hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] transition-shadow duration-500"
      >
        {/* Animated Spotlight Overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: useTransform(
              [spotlightX, spotlightY],
              ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.8) 0%, transparent 60%)`
            ),
          }}
        />

        {/* Dynamic Background Glow */}
        <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full ${color} opacity-[0.03] blur-[60px] group-hover:opacity-[0.1] transition-opacity duration-1000`} />
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`w-14 h-14 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] relative overflow-hidden`}
            >
              <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
              <div className={`absolute inset-0 opacity-20 bg-gradient-to-br from-white to-transparent`} />
              
              {/* Icon Glow Effect */}
              <div className={`absolute inset-0 ${color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
            </motion.div>
            
            <div className="flex flex-col items-end gap-1.5">
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Live</span>
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 text-[9px] text-slate-400 font-semibold"
              >
                <Sparkles className="w-2.5 h-2.5 text-blue-400" />
                Updated just now
              </motion.div>
            </div>
          </div>

          <div className="mt-8">
            <motion.div 
              style={{ translateZ: 20 }}
              className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2"
            >
              {label}
            </motion.div>
            <div className="flex items-end justify-between">
              <motion.h2 
                style={{ translateZ: 40 }}
                className="text-4xl font-bold text-tech-slate tracking-tight font-jakarta tabular-nums"
              >
                <Counter value={value} />
              </motion.h2>
              
              <motion.div 
                whileHover={{ scale: 1.1, backgroundColor: '#f8fafc' }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-tech-blue group-hover:border-blue-100 transition-all cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4" />
              </motion.div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500">
              <div className="p-1 rounded-md bg-emerald-50">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
              </div>
              {subvalue}
            </div>
            
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                   <div className={`w-full h-full ${i === 1 ? 'bg-blue-100' : i === 2 ? 'bg-amber-100' : 'bg-emerald-100'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Glass Reflection Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-1000 pointer-events-none bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transform duration-[1500ms]" />
      </motion.div>
    </div>
  )
}

export default KPICard


import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, UserPlus, Eye, Bell, Activity, ExternalLink } from 'lucide-react'

const QuickActionMenu = ({ isOpen, x, y, onClose, actions = [] }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        style={{ top: y, left: x }}
        className="fixed z-[6000] min-w-[180px] bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/50 overflow-hidden p-2"
      >
        <div className="space-y-1">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={() => {
                action.onClick()
                onClose()
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-blue-600 hover:text-white transition-all text-left group"
            >
              <action.icon className="w-4 h-4 text-slate-400 group-hover:text-white" />
              <span className="text-xs font-bold text-tech-slate group-hover:text-white">{action.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
      <div 
        className="fixed inset-0 z-[5999]" 
        onClick={onClose} 
        onContextMenu={(e) => { e.preventDefault(); onClose(); }}
      />
    </AnimatePresence>
  )
}

export default QuickActionMenu

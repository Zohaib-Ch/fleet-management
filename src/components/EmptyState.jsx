import React from 'react'
import { motion } from 'framer-motion'
import { SearchX, Inbox, FilterX, AlertCircle } from 'lucide-react'

const EmptyState = ({ 
  icon: Icon = SearchX, 
  title = "No results found", 
  message = "Try adjusting your filters or search terms to find what you're looking for.",
  actionLabel,
  onAction
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
        <div className="relative w-24 h-24 bg-white rounded-[2rem] shadow-premium flex items-center justify-center border border-white">
          <Icon className="w-10 h-10 text-slate-300" />
        </div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
        </motion.div>
      </div>

      <h3 className="text-xl font-bold text-tech-slate mb-2">{title}</h3>
      <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto leading-relaxed mb-8">
        {message}
      </p>

      {actionLabel && (
        <button 
          onClick={onAction}
          className="px-6 py-3 bg-white soft-card text-sm font-bold text-blue-600 hover:shadow-premium transition-all border-white"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  )
}

export default EmptyState

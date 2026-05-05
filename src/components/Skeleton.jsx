import React from 'react'
import { motion } from 'framer-motion'

const Skeleton = ({ className }) => {
  return (
    <div className={`relative overflow-hidden bg-slate-100 rounded-xl ${className}`}>
      <motion.div
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />
    </div>
  )
}

export const CardSkeleton = () => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-white flex flex-col gap-6">
    <div className="flex justify-between items-start">
      <Skeleton className="w-16 h-16 rounded-3xl" />
      <Skeleton className="w-20 h-6 rounded-full" />
    </div>
    <div className="space-y-3">
      <Skeleton className="w-3/4 h-8" />
      <Skeleton className="w-1/2 h-4" />
    </div>
    <div className="pt-6 border-t border-slate-50 flex flex-col gap-3">
      <Skeleton className="w-full h-3" />
      <Skeleton className="w-full h-3" />
    </div>
  </div>
)

export const KPISkeleton = () => (
  <div className="flex-1 bg-white/60 backdrop-blur-xl p-7 rounded-[2.5rem] shadow-premium border border-white/80 flex flex-col justify-between min-h-[220px]">
    <div className="flex justify-between items-start">
      <Skeleton className="w-14 h-14 rounded-2xl" />
      <Skeleton className="w-20 h-6 rounded-full" />
    </div>
    <div className="mt-8 space-y-3">
      <Skeleton className="w-24 h-3" />
      <Skeleton className="w-32 h-8" />
    </div>
    <div className="mt-6 pt-5 border-t border-slate-100/50 flex justify-between items-center">
      <Skeleton className="w-32 h-3" />
      <Skeleton className="w-12 h-5 rounded-full" />
    </div>
  </div>
)

export const TableRowSkeleton = () => (
  <div className="flex items-center gap-8 px-10 py-6 border-b border-slate-50/50">
    <div className="flex items-center gap-4 flex-1">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-16 h-2" />
      </div>
    </div>
    <Skeleton className="w-32 h-2" />
    <Skeleton className="w-24 h-2" />
    <Skeleton className="w-20 h-6 rounded-full" />
    <Skeleton className="w-8 h-8 rounded-lg" />
  </div>
)

export default Skeleton

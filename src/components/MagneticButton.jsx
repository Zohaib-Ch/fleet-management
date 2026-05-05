import React from 'react'
import { motion } from 'framer-motion'
import { useMagnetic } from '../hooks/useMagnetic'

const MagneticButton = ({ children, className, onClick, strength = 0.4 }) => {
  const { ref, position } = useMagnetic(strength)

  return (
    <motion.button
      ref={ref}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  )
}

export default MagneticButton

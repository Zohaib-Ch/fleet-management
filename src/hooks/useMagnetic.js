import { useRef, useState, useEffect } from 'react'

export const useMagnetic = (strength = 0.5) => {
  const ref = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return

      const { clientX, clientY } = e
      const { left, top, width, height } = ref.current.getBoundingClientRect()
      
      const centerX = left + width / 2
      const centerY = top + height / 2
      
      const distanceX = clientX - centerX
      const distanceY = clientY - centerY
      
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)
      const radius = Math.max(width, height) * 2

      if (distance < radius) {
        setPosition({
          x: distanceX * strength,
          y: distanceY * strength
        })
      } else {
        setPosition({ x: 0, y: 0 })
      }
    }

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [strength])

  return { ref, position }
}

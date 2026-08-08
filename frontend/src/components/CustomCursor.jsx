import React, { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Hide on coarse pointer (touchscreen devices)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return
    }

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)

      // Check if hovered element is interactive
      const target = e.target
      if (target) {
        const interactive = target.closest(
          'button, a, input, select, textarea, [role="button"], [onclick], .cursor-pointer, [data-interactive="true"]'
        )
        setIsHovered(Boolean(interactive))
      }
    }

    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.body.addEventListener('mouseleave', onMouseLeave)
    document.body.addEventListener('mouseenter', onMouseEnter)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.body.removeEventListener('mouseleave', onMouseLeave)
      document.body.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        willChange: 'transform',
      }}
    >
      {/* Outer Ring with Inner Dot nested inside to guarantee zero separation or drift */}
      <div
        className={`rounded-full border transition-all duration-200 ease-out flex items-center justify-center ${
          isHovered
            ? 'w-10 h-10 border-purple-400/90 bg-purple-500/15 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-110'
            : 'w-6 h-6 border-indigo-400/50 bg-indigo-500/5'
        }`}
      >
        {/* Tiny Center Dot - Permanently locked to exact center of outer ring */}
        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
      </div>
    </div>
  )
}

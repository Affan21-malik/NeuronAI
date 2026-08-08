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
          'button, a, input, select, textarea, [role="button"], [onclick], .cursor-pointer, [data-interactive="true"], summary, label, [tabindex], [type="button"], [type="submit"]'
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
      className="pointer-events-none fixed top-0 left-0 z-[99999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        willChange: 'transform',
      }}
    >
      {/* Circular Inverted Lens with Thin Outer Outline */}
      <div
        className={`rounded-full border transition-all duration-200 ease-out flex items-center justify-center ${
          isHovered
            ? 'w-10 h-10 border-purple-400/90 shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-110'
            : 'w-6 h-6 border-indigo-400/80 shadow-[0_0_8px_rgba(99,102,241,0.3)]'
        }`}
        style={{
          WebkitBackdropFilter: 'invert(1)',
          backdropFilter: 'invert(1)',
        }}
      >
        {/* Tiny Center Dot - Black */}
        <div className="w-1.5 h-1.5 bg-black rounded-full shadow-[0_0_4px_rgba(0,0,0,0.8)]" />
      </div>
    </div>
  )
}

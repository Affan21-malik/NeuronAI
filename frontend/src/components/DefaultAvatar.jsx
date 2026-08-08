import React, { useState } from 'react'
import { Bot, User } from 'lucide-react'

/**
 * Polished Default NeuronAI Avatar Component
 * 
 * Features:
 * - Displays uploaded user image if valid
 * - Fallbacks to sleek futuristic gradient avatar with user initials if missing/error
 * - Ensures zero broken image icons in the application
 */

// Helper to extract dynamic initials from First Name, Last Name, or Full Name
export const getInitials = (name = '', firstName = '', lastName = '') => {
  const f = (firstName || '').trim()
  const l = (lastName || '').trim()

  if (f || l) {
    if (f && l) return (f[0] + l[0]).toUpperCase()
    if (f) return f[0].toUpperCase()
    if (l) return l[0].toUpperCase()
  }

  if (!name || typeof name !== 'string') return 'U'
  const trimmed = name.trim()
  if (!trimmed) return 'U'

  // Ignore default generic placeholder strings if provided
  if (trimmed.toLowerCase() === 'candidate' || trimmed.toLowerCase() === 'new user') return 'U'

  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'U'
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function DefaultAvatar({ 
  src = null, 
  name = '', 
  firstName = '',
  lastName = '',
  className = 'w-9 h-9',
  ring = true,
  size = 'md' 
}) {
  const [imageError, setImageError] = useState(false)
  const initials = getInitials(name, firstName, lastName)

  const showImage = src && !imageError

  if (showImage) {
    return (
      <img
        src={src}
        alt={name || `${firstName} ${lastName}`.trim() || 'Avatar'}
        onError={() => setImageError(true)}
        className={`${className} rounded-full object-cover ${
          ring ? 'ring-2 ring-indigo-500/40' : ''
        } shadow-md transition-all`}
      />
    )
  }

  return (
    <div 
      className={`${className} rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-[1.5px] ${
        ring ? 'shadow-[0_0_15px_rgba(99,102,241,0.35)]' : ''
      } shrink-0 select-none overflow-hidden`}
    >
      <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center relative overflow-hidden">
        {/* Sleek glass background glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/25 via-purple-500/25 to-pink-500/20" />
        
        <span className="relative z-10 font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 font-mono tracking-wider text-xs">
          {initials}
        </span>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, AtSign, Mail, Check, AlertCircle, Save } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { validateUsername } from '../services/authService'

export default function EditProfileModal({ isOpen, onClose, initialTab = 'name' }) {
  const { user, updateUserProfile } = useAuth()
  
  const [activeTab, setActiveTab] = useState(initialTab) // 'name' | 'username'
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [usernameValidation, setUsernameValidation] = useState({ isValid: true, message: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user && isOpen) {
      setFirstName(user.firstName || (user.fullName ? user.fullName.split(' ')[0] : ''))
      setLastName(user.lastName || (user.fullName ? user.fullName.split(' ').slice(1).join(' ') : ''))
      const currentUn = user.username ? user.username.replace(/^@/, '') : ''
      setUsername(currentUn)
      setUsernameValidation(validateUsername(currentUn))
      setActiveTab(initialTab)
      setError('')
      setSuccess('')
    }
  }, [user, isOpen, initialTab])

  if (!isOpen || !user) return null

  const handleUsernameChange = (val) => {
    const cleaned = val.trim()
    setUsername(cleaned)
    setUsernameValidation(validateUsername(cleaned))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (activeTab === 'name') {
      if (!firstName.trim()) {
        setError('First name is required.')
        return
      }
      if (!lastName.trim()) {
        setError('Last name is required.')
        return
      }
      const trimmedFirst = firstName.trim()
      const trimmedLast = lastName.trim()
      const newFullName = `${trimmedFirst} ${trimmedLast}`.trim()

      try {
        setIsSaving(true)
        await updateUserProfile({
          firstName: trimmedFirst,
          lastName: trimmedLast,
          fullName: newFullName,
        })
        setSuccess('Name updated successfully!')
        setTimeout(() => {
          onClose()
        }, 600)
      } catch (err) {
        setError(err.message || 'Failed to update name.')
      } finally {
        setIsSaving(false)
      }
    } else {
      if (!usernameValidation.isValid) {
        setError(usernameValidation.message || 'Please provide a valid username.')
        return
      }
      const cleanUn = username.trim()

      try {
        setIsSaving(true)
        await updateUserProfile({
          username: cleanUn,
        })
        setSuccess('Username updated successfully!')
        setTimeout(() => {
          onClose()
        }, 600)
      } catch (err) {
        setError(err.message || 'Failed to update username.')
      } finally {
        setIsSaving(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-slate-900 border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden space-y-4 p-6"
      >
        {/* Top Glow & Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-extrabold text-white">Edit Profile Info</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-950/80 border border-indigo-500/15">
          <button
            type="button"
            onClick={() => { setActiveTab('name'); setError(''); setSuccess('') }}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'name'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Edit Name
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('username'); setError(''); setSuccess('') }}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'username'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Edit Username
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 pt-1">
          {activeTab === 'name' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs font-mono font-bold">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  placeholder="username"
                  className={`w-full pl-8 pr-4 py-2 rounded-xl bg-slate-950/80 border text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-mono ${
                    usernameValidation.isValid
                      ? 'border-emerald-500/50 focus:ring-1 focus:ring-emerald-500'
                      : 'border-rose-500/60 focus:ring-1 focus:ring-rose-500'
                  }`}
                  required
                />
              </div>

              <div className="text-[11px] pt-0.5">
                {usernameValidation.isValid ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Username available
                  </span>
                ) : (
                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> {usernameValidation.message}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Email Address Read-Only Section */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Mail className="w-3 h-3 text-slate-400" />
              <span>Authenticated Account Email (Read-Only)</span>
            </div>
            <p className="text-xs font-mono text-indigo-300 font-medium truncate">{user.email}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || (activeTab === 'username' && !usernameValidation.isValid)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-40"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

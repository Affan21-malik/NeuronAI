import React, { useState } from 'react'
import { 
  Cpu, 
  Sparkles, 
  LayoutDashboard, 
  PlayCircle, 
  BarChart3, 
  Bell, 
  Moon, 
  Sun, 
  Activity,
  LogOut,
  User as UserIcon,
  ChevronDown
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import DefaultAvatar from './DefaultAvatar'

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenFeedback, 
  interviewStatus,
  onStartInterview,
  onCompleteInterview,
  onResetInterview 
}) {
  const { user, logout } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isHighContrast, setIsHighContrast] = useState(false)

  const notifications = [
    { id: 1, title: 'AI Probing Update', desc: 'NeuronAI elevated follow-up difficulty to Staff level.', time: '2m ago' },
    { id: 2, title: 'Session Ready', desc: 'Technical Practice Session is ready for launch.', time: 'Just now' },
  ]

  const userName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || ''
  const userEmail = user?.email || ''
  const userUsername = user?.username ? (user.username.startsWith('@') ? user.username : `@${user.username}`) : ''
  const userRole = user?.targetRole || 'AI Systems Engineer'

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/80 border-b border-indigo-500/20 px-4 lg:px-8 py-3 transition-all select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-[1px] shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                Neuron<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">AI</span>
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                PRO v2.4
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wide font-medium">Autonomous AI Interview Agent</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-full border border-indigo-500/20 shadow-inner">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'landing'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Landing
          </button>
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'interview'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
            Interview Screen
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'report' || activeTab === 'report-details'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Evaluation Reports
          </button>
        </nav>

        {/* Header Control Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Lifecycle Stage Toggle for Testing */}
          <div className="hidden xl:flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-indigo-500/20 text-[10px] font-bold">
            <button
              onClick={onResetInterview}
              className={`px-2 py-1 rounded-lg transition-all ${
                interviewStatus === 'NOT_STARTED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Set to Before Interview mode"
            >
              1. Before
            </button>
            <button
              onClick={onStartInterview}
              className={`px-2 py-1 rounded-lg transition-all ${
                interviewStatus === 'IN_PROGRESS' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Set to During Interview mode"
            >
              2. During
            </button>
            <button
              onClick={onCompleteInterview}
              className={`px-2 py-1 rounded-lg transition-all ${
                interviewStatus === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Set to After Interview mode"
            >
              3. After
            </button>
          </div>

          {/* AI Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs font-semibold text-emerald-400 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI: Online</span>
          </div>

          {/* Theme Mode Toggle */}
          <button
            onClick={() => setIsHighContrast(!isHighContrast)}
            title="Toggle Cyber Dark Mode"
            className="p-2 rounded-xl bg-slate-900 border border-indigo-500/20 text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all"
          >
            {isHighContrast ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Notification Icon */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowUserMenu(false)
              }}
              className="relative p-2 rounded-xl bg-slate-900 border border-indigo-500/20 text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            </button>

            {/* Notification Popover Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-indigo-500/30 p-4 shadow-2xl z-50 animate-fadeIn space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-purple-400" />
                    AI Agent Alerts
                  </span>
                  <span className="text-[10px] text-indigo-300 font-mono">2 New</span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-indigo-500/10 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Candidate Profile Dropdown */}
          <div className="relative">
            <div 
              onClick={() => {
                setShowUserMenu(!showUserMenu)
                setShowNotifications(false)
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-slate-900 border border-indigo-500/25 hover:border-indigo-500/50 cursor-pointer transition-all shadow-sm group"
            >
              <DefaultAvatar 
                src={user?.profilePhoto} 
                name={userName} 
                firstName={user?.firstName}
                lastName={user?.lastName}
                className="w-7 h-7" 
                ring={false}
              />
              <div className="hidden sm:block text-left pr-1">
                <span className="text-xs font-bold text-white block leading-tight truncate max-w-[110px]">{userName}</span>
                <span className="text-[10px] text-slate-400 font-medium block truncate max-w-[110px]">{userUsername}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
            </div>

            {/* Profile Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-indigo-500/30 p-3 shadow-2xl z-50 space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/80 border border-indigo-500/15">
                  <DefaultAvatar 
                    src={user?.profilePhoto} 
                    name={userName} 
                    firstName={user?.firstName}
                    lastName={user?.lastName}
                    className="w-9 h-9"
                  />
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-white truncate">{userName}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{userEmail}</p>
                    <span className="inline-block mt-0.5 text-[9px] font-mono text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded">
                      {userRole}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('dashboard')
                      setShowUserMenu(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>View Profile & Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      logout()
                      setShowUserMenu(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Feedback Button */}
          <button
            onClick={onOpenFeedback}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition-all hover:border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Feedback
          </button>

        </div>

      </div>
    </header>
  )
}

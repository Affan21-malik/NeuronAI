import React from 'react'
import { 
  Bot, 
  LayoutDashboard, 
  FileText, 
  Radar, 
  Sliders, 
  Clock, 
  Target,
  Flame,
  Zap,
  LogOut,
  UserCheck
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getDynamicCandidateProfile } from '../data/mockData'
import DefaultAvatar from './DefaultAvatar'

export default function Sidebar({ activeTab, setActiveTab, onStartNewInterview, onOpenFeedback, interviewStatus }) {
  const { user, logout } = useAuth()
  
  const candidate = getDynamicCandidateProfile(user, interviewStatus)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'interview', label: 'Interview', icon: Bot, badge: interviewStatus === 'IN_PROGRESS' ? 'Live' : null },
    { id: 'report', label: 'Reports', icon: FileText },
    { id: 'knowledge', label: 'Knowledge Map', icon: Radar },
    { id: 'skillgap', label: 'Skill Gap', icon: Sliders },
    { id: 'history', label: 'History', icon: Clock },
  ]

  return (
<<<<<<< HEAD
    <aside className="w-64 shrink-0 flex flex-col justify-between h-[calc(100vh-65px)] bg-slate-950/90 border-r border-indigo-500/15 p-4 backdrop-blur-xl select-none overflow-y-auto">
=======
    <aside className="w-64 shrink-0 h-full flex flex-col justify-between bg-slate-950/90 border-r border-indigo-500/15 p-4 backdrop-blur-xl select-none overflow-y-auto">

>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
      
      <div className="flex flex-col gap-5">
        
        {/* Top Brand Header */}
<<<<<<< HEAD
        <div className="flex items-center gap-3 px-2 py-1">
=======
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 px-2 py-1 cursor-pointer group"
        >
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
<<<<<<< HEAD
              Neuron<span className="text-indigo-400">AI</span>
=======
              Neur<span className="relative inline-block">o<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-[3px] bg-black rounded-full pointer-events-none" /></span>n<span className="text-indigo-400">AI</span>
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">AI Interview Agent OS</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] border border-indigo-400/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 hover:border-indigo-500/10 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                
                {item.badge && (
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

      </div>

      {/* Bottom Section */}
      <div className="space-y-4 pt-4 border-t border-indigo-500/15">
        
        {/* Requirement 16: Dynamic Candidate Profile Card */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-indigo-500/20 space-y-2.5 shadow-lg">
          
          <div className="flex items-center gap-3">
            {/* Progress Ring around Avatar */}
            <div className="relative shrink-0">
              <svg className="w-10 h-10 transform -rotate-90">
                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2.5" className="text-slate-800" fill="transparent" />
                <circle 
                  cx="20" 
                  cy="20" 
                  r="16" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  className="text-indigo-400" 
                  fill="transparent"
                  strokeDasharray={100.5}
                  strokeDashoffset={100.5 - (100.5 * (candidate.readinessScore || 0)) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <DefaultAvatar 
                src={candidate.avatar} 
                name={candidate.name}
                firstName={candidate.firstName}
                lastName={candidate.lastName}
                className="w-7 h-7 absolute top-1.5 left-1.5"
                ring={false}
              />
            </div>

            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-slate-100 truncate">{candidate.name}</h4>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Authenticated Candidate" />
              </div>
              <p className="text-[10px] font-mono text-indigo-400 truncate">{candidate.username}</p>
              <p className="text-[10px] text-slate-400 truncate">{candidate.email}</p>
            </div>
          </div>

          {/* Quick Metrics Cluster */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
            <div className="p-1.5 rounded-lg bg-slate-950/70 border border-indigo-500/10 flex items-center justify-between">
              <span className="text-slate-400">Readiness</span>
              <span className="font-extrabold text-indigo-400 font-mono">
                {candidate.readinessScore > 0 ? `${candidate.readinessScore}%` : '0%'}
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950/70 border border-indigo-500/10 flex items-center justify-between">
              <span className="text-slate-400">Streak</span>
              <span className="font-extrabold text-amber-400 flex items-center gap-0.5">
                <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                {candidate.streakDays}d
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] text-slate-400 font-medium">
            <span>Interviews: <strong className="text-slate-200">{candidate.totalInterviews}</strong></span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30 truncate max-w-[90px]">
              {candidate.targetRole}
            </span>
          </div>

        </div>

        {/* Goal Card / Start Action */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/80 via-purple-950/60 to-slate-900 border border-indigo-500/30 p-3 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3 h-3 text-indigo-400" />
              Target Goal
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {candidate.targetRole}
            </span>
          </div>

          <button
<<<<<<< HEAD
            onClick={() => setActiveTab('interview')}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>{interviewStatus === 'IN_PROGRESS' ? 'Continue Interview' : 'Start Interview'}</span>
=======
            onClick={onStartNewInterview}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Start New Interview</span>
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
          </button>
        </div>

        {/* Logout Button */}
        <button
<<<<<<< HEAD
          onClick={logout}
=======
          onClick={() => {
            logout()
            setActiveTab('landing')
          }}
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-900/60 hover:bg-rose-500/10 border border-indigo-500/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>

      </div>

    </aside>
  )
}

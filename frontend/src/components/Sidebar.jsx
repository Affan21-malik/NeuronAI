import React from 'react'
import { 
  Bot, 
  LayoutDashboard, 
  FileText, 
  Radar, 
  Sliders, 
  Clock, 
  ChevronRight,
  Sparkles,
  Zap,
  Flame,
  Award,
  Target,
  CheckCircle2
} from 'lucide-react'
import { candidateProfile } from '../data/mockData'

export default function Sidebar({ activeTab, setActiveTab, onStartNewInterview, onOpenFeedback }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'interview', label: 'Interview', icon: Bot, badge: 'Live' },
    { id: 'report', label: 'Reports', icon: FileText },
    { id: 'knowledge', label: 'Knowledge Map', icon: Radar },
    { id: 'skillgap', label: 'Skill Gap', icon: Sliders },
    { id: 'history', label: 'History', icon: Clock },
  ]

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between h-[calc(100vh-65px)] bg-slate-950/90 border-r border-indigo-500/15 p-4 backdrop-blur-xl select-none overflow-y-auto">
      
      <div className="flex flex-col gap-5">
        
        {/* Top Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
              Neuron<span className="text-indigo-400">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">AI Interview Agent OS</p>
          </div>
        </div>

        {/* Navigation List - Evenly spaced */}
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
        
        {/* Requirement 8: Enhanced Profile Card */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-indigo-500/20 space-y-2 shadow-lg">
          
          <div className="flex items-center gap-3">
            {/* Small Progress Ring around Avatar */}
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
                  strokeDashoffset={100.5 - (100.5 * candidateProfile.readinessScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <img 
                src={candidateProfile.avatar} 
                alt={candidateProfile.name}
                className="w-7 h-7 rounded-full object-cover absolute top-1.5 left-1.5 ring-1 ring-indigo-500/40"
              />
            </div>

            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-slate-100 truncate">{candidateProfile.name}</h4>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Active Candidate" />
              </div>
              <p className="text-[10px] text-slate-400 truncate">{candidateProfile.email}</p>
            </div>
          </div>

          {/* Quick Metrics Cluster */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
            <div className="p-1.5 rounded-lg bg-slate-950/70 border border-indigo-500/10 flex items-center justify-between">
              <span className="text-slate-400">Readiness</span>
              <span className="font-extrabold text-indigo-400 font-mono">{candidateProfile.readinessScore}%</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950/70 border border-indigo-500/10 flex items-center justify-between">
              <span className="text-slate-400">Streak</span>
              <span className="font-extrabold text-amber-400 flex items-center gap-0.5">
                <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                {candidateProfile.streakDays}d
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] pt-0.5 text-slate-400 font-medium">
            <span>Interviews: <strong className="text-slate-200">{candidateProfile.totalInterviews}</strong></span>
            <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
              Staff Level
            </span>
          </div>

        </div>

        {/* Requirement 9: Today's Goal Bottom Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/80 via-purple-950/60 to-slate-900 border border-indigo-500/30 p-3.5 shadow-xl space-y-2.5">
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3 h-3 text-indigo-400" />
              Today's Goal
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
              <Flame className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              {candidateProfile.streakDays} Days
            </span>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-white mb-1 leading-snug">
              {candidateProfile.todayGoal.title}
            </h4>
            
            {/* Daily Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-1">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" 
                style={{ width: `${(candidateProfile.todayGoal.completed / candidateProfile.todayGoal.total) * 100}%` }} 
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>Daily Progress</span>
              <span>{candidateProfile.todayGoal.completed}/{candidateProfile.todayGoal.total} Done</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-indigo-500/10 leading-tight">
            <strong className="text-purple-300">AI Rec:</strong> {candidateProfile.aiRecommendation}
          </p>

          <button
            onClick={() => setActiveTab('interview')}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Continue Interview</span>
          </button>

        </div>

      </div>

    </aside>
  )
}

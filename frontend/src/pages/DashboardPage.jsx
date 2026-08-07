import React from 'react'
import { motion } from 'framer-motion'
import { 
  candidateProfile, 
  skillHeatmap, 
  learningProgressData, 
  weeklyActivityData, 
  recentReportsData 
} from '../data/mockData'
import { 
  Flame, 
  Award, 
  Clock, 
  TrendingUp, 
  PlayCircle, 
  FileText, 
  Sparkles, 
  Target, 
  ArrowUpRight,
  Sliders,
  ChevronRight,
  BookOpen,
  Activity,
  FileCheck2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Lock
} from 'lucide-react'
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar 
} from 'recharts'

export default function DashboardPage({ 
  interviewStatus, 
  onStartInterview, 
  onViewReport, 
  onViewSkillGap, 
  onViewKnowledgeMap 
}) {
  const isCompleted = interviewStatus === 'COMPLETED'

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto select-none">
      
      {/* State Banner Indicator */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-indigo-500/25">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-slate-400">Current Session State:</span>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
            interviewStatus === 'NOT_STARTED' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
            interviewStatus === 'IN_PROGRESS' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30 animate-pulse' :
            'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }`}>
            {interviewStatus === 'NOT_STARTED' && 'Pre-Interview (Not Started)'}
            {interviewStatus === 'IN_PROGRESS' && 'Interview In Progress'}
            {interviewStatus === 'COMPLETED' && 'Interview Completed & Evaluated'}
          </span>
        </div>

        {interviewStatus === 'NOT_STARTED' ? (
          <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> Evaluation metrics locked until interview completion
          </span>
        ) : (
          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Telemetry & Evaluation Scorecard Unlocked
          </span>
        )}
      </div>

      {/* Candidate Profile Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/40 border border-indigo-500/25 p-6 sm:p-8 shadow-[0_0_35px_rgba(99,102,241,0.15)]"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Candidate Profile Info */}
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <img 
                src={candidateProfile.avatar} 
                alt={candidateProfile.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/50 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-extrabold text-slate-950">
                ✓
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{candidateProfile.name}</h2>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {candidateProfile.streakDays} Day Streak
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {candidateProfile.level}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mb-2">{candidateProfile.role}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-400" /> Target: {candidateProfile.targetRole}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" /> Prep Time: {candidateProfile.prepTimeHours}h
                </span>
              </div>
            </div>
          </div>

          {/* Start Interview CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onStartInterview}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-4 h-4 fill-current text-white" />
              <span>{interviewStatus === 'IN_PROGRESS' ? 'Resume Active Interview' : 'Start AI Interview Session'}</span>
            </button>
          </div>

        </div>
      </motion.div>

      {/* ==================================================================== */}
      {/* STAGE 1: BEFORE INTERVIEW (Show Pre-interview preparation cards ONLY) */}
      {/* ==================================================================== */}
      {!isCompleted ? (
        <div className="space-y-8">
          
          {/* Pre-Interview Row 1: Target Role, Resume Status, Curriculum Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Target Role Alignment */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Target Role Alignment</span>
                <Target className="w-4 h-4 text-indigo-400" />
              </div>

              <div>
                <span className="text-xs text-indigo-400 font-mono font-bold block mb-1">Target Position</span>
                <h4 className="text-base font-extrabold text-white">{candidateProfile.targetRole}</h4>
                <p className="text-xs text-slate-400 mt-1">{candidateProfile.targetCompany}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Domain Focus</span>
                <span className="font-semibold text-emerald-400">Model Context Protocol</span>
              </div>
            </motion.div>

            {/* Card 2: Resume Status */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Resume & Profile Status</span>
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Parsed & Verified
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-white mt-2">Senior AI Systems Architecture</h4>
                <p className="text-xs text-slate-400 mt-1">{candidateProfile.skillsCovered} of {candidateProfile.totalSkills} technical primitives verified.</p>
              </div>

              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${(candidateProfile.skillsCovered / candidateProfile.totalSkills) * 100}%` }} />
              </div>
            </motion.div>

            {/* Card 3: Curriculum Progress */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Curriculum Progress</span>
                <BookOpen className="w-4 h-4 text-purple-400" />
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-white mb-2">4 of 6 Prep Modules Completed</h4>
                <p className="text-xs text-slate-400 mb-2">Mastered: MCP Transports, RAG Vector Search, sliding context compression.</p>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '66%' }} />
                </div>
              </div>

              <span className="text-xs text-slate-400 font-mono">Next: Live Adaptive Interview Probing</span>
            </motion.div>

          </div>

          {/* Recommended Interview Card & Start Action */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-purple-950/40 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Recommended Interview Session
                </span>
                <span className="text-xs font-mono text-slate-400">Est. 45 Mins • Hard Difficulty</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Model Context Protocol (MCP) Architecture & Secure Tool Call Integration
              </h3>
              <p className="text-xs text-slate-300 font-medium max-w-2xl">
                Deep-dive technical probing on JSON-RPC stdio capabilities, token authentication, dynamic sliding-window summarization, and asynchronous circuit breakers.
              </p>
            </div>

            <button
              onClick={onStartInterview}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Start Interview Now</span>
            </button>
          </div>

          {/* Locked Telemetry Preview Banner */}
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Lock className="w-6 h-6 text-indigo-400" />
            </div>
            <h4 className="text-base font-bold text-white">Evaluation Telemetry Locked</h4>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Your overall Readiness Score, Knowledge Map, Skill Gap breakdowns, and Hiring Verdict will generate automatically once you complete your live AI interview.
            </p>
          </div>

        </div>
      ) : (
        /* ==================================================================== */
        /* STAGE 3: AFTER INTERVIEW (Unlocked Post-Interview Evaluation Metrics) */
        /* ==================================================================== */
        <div className="space-y-8">
          
          {/* Grid Row 1: Readiness Score, Today's Goal, Recommended Interview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Widget 1: Interview Readiness Score */}
            <motion.div 
              whileHover={{ y: -3 }}
              onClick={onViewSkillGap}
              className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 flex flex-col justify-between space-y-4 cursor-pointer hover:border-indigo-500/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Interview Readiness Score</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>

              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="6" className="text-slate-800" fill="transparent" />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="38" 
                      stroke="currentColor" 
                      strokeWidth="6" 
                      className="text-indigo-400" 
                      fill="transparent"
                      strokeDasharray={238.7}
                      strokeDashoffset={238.7 - (238.7 * candidateProfile.readinessScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-2xl font-black text-white">{candidateProfile.readinessScore}%</span>
                </div>

                <div>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +5% this week
                  </span>
                  <p className="text-xs text-slate-400 mt-1">Ready for Staff Level AI Systems evaluation.</p>
                </div>
              </div>
            </motion.div>

            {/* Widget 2: Today's Quest */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Today's Quest</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Active
                </span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-white mb-2">{candidateProfile.todayGoal.title}</h4>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: `${(candidateProfile.todayGoal.completed / candidateProfile.todayGoal.total) * 100}%` }} />
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {candidateProfile.todayGoal.completed} of {candidateProfile.todayGoal.total} challenges completed
                </span>
              </div>
            </motion.div>

            {/* Widget 3: Hiring Recommendation & Scorecard */}
            <motion.div 
              whileHover={{ y: -3 }}
              onClick={onViewReport}
              className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 flex flex-col justify-between space-y-4 cursor-pointer hover:border-indigo-500/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Hiring Recommendation</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-block mb-2">
                  STRONG HIRE (Staff Ready)
                </span>
                <h4 className="text-sm font-extrabold text-white mb-1">MCP Architecture Deep-Dive</h4>
                <p className="text-xs text-slate-400">Technical Score: 94% • Comm Score: 89%</p>
              </div>

              <div className="flex items-center justify-between text-xs text-indigo-300 font-bold">
                <span>View Full Executive Report</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>

          </div>

          {/* Grid Row 2: Learning Progress (Area Chart) & Weekly Activity (Bar Chart) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recharts 1: Learning Progress */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    <span>Learning Progress (Readiness vs Confidence)</span>
                  </h3>
                  <p className="text-xs text-slate-400">Weekly progression trajectory</p>
                </div>
              </div>

              <div className="h-60 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={learningProgressData}>
                    <defs>
                      <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis domain={[60, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#6366f1', borderRadius: '12px', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="readiness" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#readinessGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recharts 2: Weekly Activity */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <span>Weekly Activity (Hours Spent)</span>
                  </h3>
                  <p className="text-xs text-slate-400">Daily practice hours log</p>
                </div>
              </div>

              <div className="h-60 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivityData}>
                    <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#a855f7', borderRadius: '12px', fontSize: '11px' }} />
                    <Bar dataKey="hours" fill="#c084fc" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Grid Row 3: Skill Heatmap */}
          <div 
            onClick={onViewSkillGap}
            className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-4 cursor-pointer hover:border-indigo-500/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Skill Heatmap</span>
                </h3>
                <p className="text-xs text-slate-400">Competency scores across AI technical domains (Click to open Skill Gap)</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skillHeatmap.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-indigo-500/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                    <span className="truncate">{item.name}</span>
                    <span className="text-indigo-400 font-mono">{item.score}%</span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${item.score}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{item.category}</span>
                    <span className="font-semibold text-emerald-400">{item.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid Row 4: Recent Evaluation Reports */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Recent Evaluation Reports</span>
                </h3>
                <p className="text-xs text-slate-400">Past performance history and hiring recommendations</p>
              </div>
            </div>

            <div className="space-y-3">
              {recentReportsData.map((rep) => (
                <div 
                  key={rep.id} 
                  onClick={onViewReport}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-indigo-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-indigo-500/50 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-white">{rep.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${rep.badgeColor}`}>
                        {rep.rating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{rep.topic} • {rep.date}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Score</span>
                      <span className="text-base font-extrabold text-emerald-400">{rep.score}/100</span>
                    </div>

                    <button className="p-2 rounded-xl bg-slate-800 text-indigo-300 hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  )
}

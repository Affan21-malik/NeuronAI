<<<<<<< HEAD
import React from 'react'
=======
import React, { useState } from 'react'
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
import { motion } from 'framer-motion'
import { 
  getDynamicCandidateProfile,
  skillHeatmap, 
  learningProgressData, 
  weeklyActivityData, 
  recentReportsData 
} from '../data/mockData'
import { 
  Flame, 
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
  ShieldCheck,
  Zap,
  Lock,
<<<<<<< HEAD
  Radar
=======
  Radar,
  Pencil
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
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
import { useAuth } from '../hooks/useAuth'
import DefaultAvatar from '../components/DefaultAvatar'
<<<<<<< HEAD
=======
import EditProfileModal from '../components/EditProfileModal'
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86

export default function DashboardPage({ 
  interviewStatus, 
  onStartInterview, 
  onViewReport, 
  onViewSkillGap, 
  onViewKnowledgeMap 
}) {
  const { user } = useAuth()
  const candidate = getDynamicCandidateProfile(user, interviewStatus)
  const isCompleted = interviewStatus === 'COMPLETED'

<<<<<<< HEAD
=======
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editModalTab, setEditModalTab] = useState('name')

  const handleOpenEdit = (tab) => {
    setEditModalTab(tab)
    setEditModalOpen(true)
  }

>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto select-none">
      
      {/* State Banner Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-900/90 border border-indigo-500/25 shadow-lg">
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

      {/* Dynamic Candidate Profile Header Card */}
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
              <DefaultAvatar 
                src={candidate.avatar} 
                name={candidate.name}
                firstName={candidate.firstName}
                lastName={candidate.lastName}
                className="w-20 h-20"
                ring={true}
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-extrabold text-slate-950">
                ✓
              </span>
            </div>

            <div>
<<<<<<< HEAD
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{candidate.name}</h2>
                <span className="text-xs font-mono text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                  {candidate.username}
                </span>
=======
              {/* Requirement 2: User Name & Username with pencil edit controls */}
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{candidate.name}</h2>
                  <button 
                    onClick={() => handleOpenEdit('name')}
                    title="Edit Name"
                    className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-indigo-500/20 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/50 transition-all shadow-sm active:scale-95"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-indigo-400 font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-1">
                    <span>{candidate.username}</span>
                  </span>
                  <button 
                    onClick={() => handleOpenEdit('username')}
                    title="Edit Username"
                    className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-indigo-500/20 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/50 transition-all shadow-sm active:scale-95"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>

>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {candidate.streakDays} Day Streak
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mb-2">{candidate.email} • {candidate.targetRole}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-400" /> Target: {candidate.targetRole}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" /> Prep Time: {candidate.prepTimeHours}h
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
              <span>{interviewStatus === 'IN_PROGRESS' ? 'Resume Active Interview' : 'Start AI Technical Interview'}</span>
            </button>
          </div>

        </div>
      </motion.div>

      {/* ==================================================================== */}
      {/* STAGE 1: BEFORE INTERVIEW (Zero Progress New User View) */}
      {/* ==================================================================== */}
      {!isCompleted ? (
        <div className="space-y-8">
          
          {/* Zero Progress KPI Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/20 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Progress</span>
              <div className="text-xl font-extrabold text-white font-mono">0%</div>
              <span className="text-[10px] text-slate-500">Not Started</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/20 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Interviews</span>
              <div className="text-xl font-extrabold text-white font-mono">0</div>
              <span className="text-[10px] text-slate-500">0 Questions Answered</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/20 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Streak</span>
              <div className="text-xl font-extrabold text-amber-400 font-mono flex items-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400" /> 0
              </div>
              <span className="text-[10px] text-slate-500">Start today</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/20 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Confidence</span>
              <div className="text-xl font-extrabold text-slate-400 font-mono">—</div>
              <span className="text-[10px] text-slate-500">Pending evaluation</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/20 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Knowledge Map</span>
              <div className="text-xs font-extrabold text-indigo-300 font-mono">Not Assessed</div>
              <span className="text-[10px] text-slate-500">Telemetry locked</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/20 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Skill Gap</span>
              <div className="text-xs font-extrabold text-purple-300 font-mono">Not Assessed</div>
              <span className="text-[10px] text-slate-500">Telemetry locked</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/20 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Final Score</span>
              <div className="text-xl font-extrabold text-slate-400 font-mono">—</div>
              <span className="text-[10px] text-slate-500">Pending session</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/20 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Readiness Score</span>
              <div className="text-xl font-extrabold text-slate-400 font-mono">—</div>
              <span className="text-[10px] text-slate-500">Pending assessment</span>
            </div>
          </div>

          {/* Pre-Interview Alignment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Target Role Card */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Target Role</span>
                <Target className="w-4 h-4 text-indigo-400" />
              </div>

              <div>
                <span className="text-xs text-indigo-400 font-mono font-bold block mb-1">Target Position</span>
                <h4 className="text-base font-extrabold text-white">{candidate.targetRole}</h4>
                <p className="text-xs text-slate-400 mt-1">Autonomous AI Benchmarks & Probing</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Domain Focus</span>
                <span className="font-semibold text-emerald-400">Model Context Protocol</span>
              </div>
            </motion.div>

            {/* Resume Status Card */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Profile Status</span>
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Candidate Profile Initialized
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-white mt-2">{candidate.name}</h4>
                <p className="text-xs text-slate-400 mt-1">Ready for first adaptive technical interview session.</p>
              </div>

              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '0%' }} />
              </div>
            </motion.div>

            {/* Curriculum Progress Card */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Curriculum Progress</span>
                <BookOpen className="w-4 h-4 text-purple-400" />
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-white mb-2">0 of 6 Modules Completed</h4>
                <p className="text-xs text-slate-400 mb-2">Next up: Launch your first interview to begin learning roadmap.</p>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>

              <span className="text-xs text-slate-400 font-mono">Status: Awaiting First Session</span>
            </motion.div>

          </div>

          {/* Recommended Session Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-purple-950/40 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Recommended First Session
                </span>
                <span className="text-xs font-mono text-slate-400">Est. 15-20 Mins • Adaptive Probing</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Model Context Protocol (MCP) Architecture & Systems Engineering
              </h3>
              <p className="text-xs text-slate-300 font-medium max-w-2xl">
                Test your knowledge on JSON-RPC transport streams, context window isolation, vector retrieval, and async backoff strategies with NeuronAI.
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

          {/* Locked Telemetry Notice */}
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Lock className="w-6 h-6 text-indigo-400" />
            </div>
            <h4 className="text-base font-bold text-white">Evaluation Telemetry Locked</h4>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Your overall Readiness Score, Knowledge Map, Skill Gap breakdowns, and Final Evaluation Report will generate automatically once you complete your live AI technical interview.
            </p>
          </div>

        </div>
      ) : (

        /* ==================================================================== */
        /* STAGE 3: AFTER INTERVIEW (Full Evaluation Metrics Unlocked View) */
        /* ==================================================================== */
        <div className="space-y-8">
          
          {/* Metric Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <motion.div 
              whileHover={{ y: -4 }}
              className="p-5 rounded-3xl bg-slate-900/80 border border-indigo-500/20 space-y-2 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Overall Readiness</span>
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400"><TrendingUp className="w-4 h-4" /></span>
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">{candidate.readinessScore}%</div>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <span>Top 3% Candidate Benchmark</span>
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="p-5 rounded-3xl bg-slate-900/80 border border-indigo-500/20 space-y-2 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Streak & Dedication</span>
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400"><Flame className="w-4 h-4" /></span>
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">{candidate.streakDays} Days</div>
              <p className="text-[11px] text-amber-400 font-semibold">Active Benchmark Track</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="p-5 rounded-3xl bg-slate-900/80 border border-indigo-500/20 space-y-2 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Interviews Completed</span>
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400"><FileText className="w-4 h-4" /></span>
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">{candidate.totalInterviews}</div>
              <p className="text-[11px] text-purple-300 font-semibold">Verified Probing Sessions</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="p-5 rounded-3xl bg-slate-900/80 border border-indigo-500/20 space-y-2 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">AI Confidence Index</span>
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400"><Activity className="w-4 h-4" /></span>
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">{candidate.avgConfidence}%</div>
              <p className="text-[11px] text-emerald-400 font-semibold">Strong Technical Depth</p>
            </motion.div>

          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Area Chart: Readiness Trajectory */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/70 border border-indigo-500/20 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white">Readiness & Confidence Velocity</h3>
                  <p className="text-xs text-slate-400">Historical telemetry tracking across AI evaluation sessions</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Last 7 Days
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={learningProgressData}>
                    <defs>
                      <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} domain={[60, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="readiness" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#readinessGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Reports Summary Box */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-indigo-500/20 space-y-4 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-extrabold text-white">Latest Evaluation Report</h3>
                  <button 
                    onClick={onViewReport}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                  >
                    View Details <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300">Model Context Protocol</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Score: 92/100
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Candidate demonstrated staff-level fluency in transport isolation, schema validation, and exponential backoff retry patterns.
                  </p>
                </div>
              </div>

              <button
                onClick={onViewReport}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-bold text-xs transition-all text-center"
              >
                Open Detailed Report Summary
              </button>
            </div>

          </div>

          {/* Knowledge & Skill Gap Previews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div 
              onClick={onViewKnowledgeMap}
              className="p-6 rounded-3xl bg-slate-900/70 border border-indigo-500/20 hover:border-indigo-500/40 cursor-pointer transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radar className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">Knowledge Map</h3>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-slate-400">
                Explore your mastery levels across protocols, RAG search, LLM Ops, and agentic system primitives.
              </p>
            </div>

            <div 
              onClick={onViewSkillGap}
              className="p-6 rounded-3xl bg-slate-900/70 border border-indigo-500/20 hover:border-indigo-500/40 cursor-pointer transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">Skill Gap Analysis</h3>
                </div>
<<<<<<< HEAD
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
=======
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
              </div>
              <p className="text-xs text-slate-400">
                Pinpoint high-priority weak topics and access recommended targeted practice modules.
              </p>
            </div>

          </div>

        </div>
      )}

<<<<<<< HEAD
=======

      {/* Edit Profile Info Modal */}
      <EditProfileModal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        initialTab={editModalTab} 
      />

>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
    </div>
  )
}

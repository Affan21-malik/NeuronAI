import React from 'react'
import { motion } from 'framer-motion'
import { skillGapData } from '../data/mockData'
import { 
  Sliders, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  ArrowRight, 
  PlayCircle, 
  Sparkles, 
  Award,
  Target,
  Zap,
  Clock,
  Lock
} from 'lucide-react'
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts'

export default function SkillGapPage({ interviewStatus, onStartInterview }) {
  const isLocked = interviewStatus === 'NOT_STARTED'

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-slate-100 select-none">
      
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-purple-950/60 border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.2)]"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              Skill Gap & Target Alignment
            </span>
            {!isLocked ? (
              <span className="text-xs font-mono text-emerald-400 font-bold">{skillGapData.weeklyGrowth} this week</span>
            ) : (
              <span className="text-xs font-mono text-amber-400 font-bold">Pending Live Evaluation</span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Skill Gap Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            AI-driven diagnostic identifying technical deficiencies and targeted learning milestones.
          </p>
        </div>

        <button
          onClick={onStartInterview}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <PlayCircle className="w-4 h-4 fill-current text-white" />
          <span>Launch Skill Practice Session</span>
        </button>
      </motion.div>

      {/* Gated Lock State if NOT_STARTED */}
      {isLocked && (
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-amber-500/30 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">Skill Gap Diagnostic Locked</h3>
          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            Weak and strong topic breakdowns, priority levels, and custom learning paths will be unlocked once you complete your live AI technical interview.
          </p>
          <button
            onClick={onStartInterview}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all shadow-md inline-flex items-center gap-2"
          >
            <PlayCircle className="w-4 h-4 fill-current" />
            <span>Start Live Practice Interview</span>
          </button>
        </div>
      )}

      {/* Unlocked Skill Gap Diagnostic Content */}
      {!isLocked && (
        <>
          {/* Row 1: Overall Readiness Score Gauge & Recommended Next Interview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Overall Readiness Score Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 flex flex-col justify-between space-y-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Overall Readiness Score</span>
                <Award className="w-5 h-5 text-amber-400" />
              </div>

              <div className="flex items-center justify-center">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-36 h-36 transform -rotate-90">
                    <circle cx="72" cy="72" r="56" stroke="currentColor" strokeWidth="8" className="text-slate-800" fill="transparent" />
                    <circle 
                      cx="72" 
                      cy="72" 
                      r="56" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      className="text-indigo-400" 
                      fill="transparent"
                      strokeDasharray={351.8}
                      strokeDashoffset={351.8 - (351.8 * (Number(skillGapData?.readinessScore) || 0)) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-white">{skillGapData.readinessScore}%</span>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Staff Ready</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-indigo-500/10 text-center">
                <p className="text-xs text-slate-300 font-medium">
                  You are <strong className="text-indigo-400">8% ahead</strong> of candidate baseline benchmark.
                </p>
              </div>
            </motion.div>

            {/* Recommended Next Interview Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-indigo-500/20 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Recommended Next Interview Session</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  High Impact Priority
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-300">{skillGapData.recommendedNextInterview.category}</span>
                  <span className="text-xs text-emerald-400 font-bold">{skillGapData.recommendedNextInterview.impact}</span>
                </div>
                <h4 className="text-lg font-extrabold text-white">{skillGapData.recommendedNextInterview.topic}</h4>
                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-400" /> Est: {skillGapData.recommendedNextInterview.estTime}</span>
                  <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-purple-400" /> Difficulty: {skillGapData.recommendedNextInterview.difficulty}</span>
                </div>
              </div>

              <button 
                onClick={onStartInterview}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Start Target Practice Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

          </div>

          {/* Row 2: Weak Topics vs Strong Topics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Weak Topics Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-amber-500/20 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span>Weak Topics & Skill Gaps</span>
                </h3>
                <span className="text-xs font-mono text-amber-400 font-bold">{skillGapData.weakTopics.length} Focus Areas</span>
              </div>

              <div className="space-y-4">
                {skillGapData.weakTopics.map((topic, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/15 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-200">{topic.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          topic.priority === 'High' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {topic.priority} Priority
                        </span>
                        <span className="text-amber-400 font-mono">{topic.score}%</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full" style={{ width: `${topic.score}%` }} />
                    </div>

                    <p className="text-[11px] text-slate-300 italic">
                      <strong>Recommendation:</strong> {topic.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Strong Topics Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-emerald-500/20 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Strong Topics & Core Strengths</span>
                </h3>
                <span className="text-xs font-mono text-emerald-400 font-bold">{skillGapData.strongTopics.length} Mastered</span>
              </div>

              <div className="space-y-4">
                {skillGapData.strongTopics.map((topic, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/15 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-200">{topic.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {topic.level}
                        </span>
                        <span className="text-emerald-400 font-mono">{topic.score}%</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${topic.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Row 3: Recommended Learning Path & Improvement Timeline Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recommended Learning Path */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-4"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Recommended Learning Path</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skillGapData.recommendedLearningPath.map((path, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-indigo-500/15 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo-400">{path.step}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        path.status === 'In Progress' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {path.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white">{path.title}</h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Focus: {path.focus}</span>
                      <span className="font-mono">{path.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Improvement Timeline Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-4"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Improvement Timeline</h3>
              </div>

              <div className="h-52 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={skillGapData.improvementTimeline}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis domain={[60, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#6366f1', borderRadius: '12px', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#scoreGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

          </div>
        </>
      )}

    </div>
  )
}

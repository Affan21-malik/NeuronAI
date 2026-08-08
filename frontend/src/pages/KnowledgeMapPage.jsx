import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { knowledgeMapData } from '../data/mockData'
import { 
  Radar, 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Layers, 
  Lightbulb, 
  Target,
  Lock,
  PlayCircle
} from 'lucide-react'
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar as RechartsRadar, 
  Legend,
  Tooltip
} from 'recharts'

export default function KnowledgeMapPage({ interviewStatus, onStartInterview }) {
  const isLocked = interviewStatus === 'NOT_STARTED'

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-slate-100 select-none">
      
      {/* Page Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-purple-950/60 border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.2)]"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5">
              <Radar className="w-3.5 h-3.5 text-indigo-400" />
              Live Competency Telemetry
            </span>
            {!isLocked ? (
              <span className="text-xs font-mono text-purple-300 font-bold">{knowledgeMapData.benchmarkComparison}</span>
            ) : (
              <span className="text-xs font-mono text-amber-300 font-bold">Pending Session Data</span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Knowledge Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Multi-dimensional polygon evaluating core competency across LLM protocols, vector RAG, and AI Ops.
          </p>
        </div>

        {/* Knowledge Score Badge or Lock Badge */}
        {!isLocked ? (
          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-indigo-500/25 shrink-0">
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-semibold">Overall Knowledge Score</span>
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-mono">
                {knowledgeMapData.overallKnowledgeScore}/100
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Brain className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={onStartInterview}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 shrink-0"
          >
            <PlayCircle className="w-4 h-4 fill-current" />
            <span>Start Interview to Unlock</span>
          </button>
        )}
      </motion.div>

      {/* Gated Lock State if NOT_STARTED */}
      {isLocked && (
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-amber-500/30 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">Knowledge Map Telemetry Locked</h3>
          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            Your multi-dimensional radar polygon and topic coverage scores will generate after you complete your live AI technical interview session.
          </p>
          <button
            onClick={onStartInterview}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all shadow-md inline-flex items-center gap-2"
          >
            <PlayCircle className="w-4 h-4 fill-current" />
            <span>Start Live Interview Session</span>
          </button>
        </div>
      )}

      {/* Unlocked Evaluation Content (Only rendered when interview is completed / unlocked) */}
      {!isLocked && (
        <>
          {/* Row 1: Interactive Radar Chart & Learning Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Interactive Radar Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-400" />
                    <span>Multi-Dimensional Competency Polygon</span>
                  </h3>
                  <p className="text-xs text-slate-400">Candidate Score vs Staff Engineer Benchmark</p>
                </div>
              </div>

              <div className="h-80 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={knowledgeMapData.radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" stroke="#cbd5e1" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                    <RechartsRadar name="Candidate Score" dataKey="Score" stroke="#818cf8" fill="#6366f1" fillOpacity={0.5} />
                    <RechartsRadar name="Target Benchmark" dataKey="Target" stroke="#38bdf8" fill="#06b6d4" fillOpacity={0.2} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#6366f1', borderRadius: '12px', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px', pt: '10px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Learning Insights Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">AI Learning Insights</h3>
                </div>

                <div className="space-y-3">
                  {knowledgeMapData.learningInsights.map((insight) => (
                    <div key={insight.id} className="p-3.5 rounded-2xl bg-slate-950/70 border border-indigo-500/15 space-y-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        insight.type === 'Strength' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        insight.type === 'Focus Area' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {insight.type}
                      </span>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed pt-1">
                        {insight.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/50 to-purple-950/40 border border-indigo-500/20 flex items-center justify-between text-xs text-indigo-300 font-bold">
                <span>Dynamic Telemetry Active</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
            </motion.div>

          </div>

          {/* Row 2: Topic Coverage Breakdown */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Topic Coverage Breakdown</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">5 Domains Evaluated</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {knowledgeMapData.topicCoverage.map((cat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-indigo-500/15 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-200 truncate">{cat.category}</span>
                    <span className="text-indigo-400 font-mono">{cat.coverage}%</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${cat.color} rounded-full`} style={{ width: `${cat.coverage}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Coverage</span>
                    <span className="font-semibold text-emerald-400">{cat.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Row 3: Strong Skills vs Weak Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Strong Skills */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-emerald-500/20 space-y-4"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Strong Skills & Mastered Concepts</h3>
              </div>

              <div className="space-y-3">
                {knowledgeMapData.strongSkills.map((sk, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/15 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                      <span>{sk.title}</span>
                      <span className="font-mono text-emerald-400">{sk.score}%</span>
                    </div>
                    <p className="text-xs text-slate-300">{sk.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Weak Skills */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-amber-500/20 space-y-4"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Weak Skills & Improvement Tips</h3>
              </div>

              <div className="space-y-3">
                {knowledgeMapData.weakSkills.map((sk, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/15 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                      <span>{sk.title}</span>
                      <span className="font-mono text-amber-400">{sk.score}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-200">
                      <strong>Action Tip:</strong> {sk.tip}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </>
      )}

    </div>
  )
}

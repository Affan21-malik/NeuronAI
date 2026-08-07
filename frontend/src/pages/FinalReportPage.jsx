import React from 'react'
import { motion } from 'framer-motion'
import { finalReportData } from '../data/mockData'
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  Share2, 
  Sparkles, 
  Brain, 
  Target, 
  Calendar,
  Clock,
  ChevronRight,
  TrendingUp,
  Check,
  ShieldCheck,
  BookOpen
} from 'lucide-react'
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend 
} from 'recharts'

export default function FinalReportPage({ onOpenFeedback, onStartNewInterview }) {
  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-slate-100">
      
      {/* Top Banner & Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-purple-950/60 border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.2)]"
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Evaluation Report Complete
            </span>
            <span className="text-xs font-mono text-slate-400">{finalReportData.date}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Staff Level Evaluation: <span className="text-indigo-400">{finalReportData.candidateName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Role Target: {finalReportData.roleEvaluated} • Session ID: #{finalReportData.id}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button 
            onClick={onOpenFeedback}
            className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Give Experience Feedback</span>
          </button>

          <button 
            onClick={onStartNewInterview}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
          >
            <span>Start New Interview</span>
          </button>
        </div>
      </motion.div>

      {/* SECTION 1: Hiring Recommendation & Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Overall Score & Hiring Recommendation */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hiring Recommendation</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>

          <div className="text-center space-y-2">
            <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 font-mono">
              {finalReportData.overallScore}
            </span>
            <span className="text-xs font-semibold text-slate-400 block">Out of 100 Overall Score</span>

            <div className="pt-2">
              <span className="px-4 py-2 rounded-2xl text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-block shadow-md">
                {finalReportData.hiringRecommendation}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-800">
            <div className="p-2 rounded-xl bg-slate-950/60">
              <span className="text-[10px] text-slate-400 block">Technical</span>
              <span className="text-sm font-bold text-indigo-400">{finalReportData.scores.technicalScore}%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60">
              <span className="text-[10px] text-slate-400 block">System Design</span>
              <span className="text-sm font-bold text-purple-400">{finalReportData.scores.systemDesignScore}%</span>
            </div>
          </div>
        </div>

        {/* Executive Summary & AI Generated Summary */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Executive Summary</h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {finalReportData.executiveSummary}
          </p>

          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 space-y-2">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              AI Generated Qualitative Summary
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {finalReportData.aiSummary}
            </p>
          </div>
        </div>

      </div>

      {/* SECTION 2: Radar Benchmark Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span>Multi-Dimensional Competency Map</span>
            </h3>
            <p className="text-xs text-slate-400">{finalReportData.candidateName} vs Staff Engineer Industry Benchmark</p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={finalReportData.radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" stroke="#cbd5e1" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
              <Radar name={`${finalReportData.candidateName} (Candidate)`} dataKey="Candidate" stroke="#818cf8" fill="#6366f1" fillOpacity={0.5} />
              <Radar name="Staff Benchmark" dataKey="Benchmark" stroke="#38bdf8" fill="#06b6d4" fillOpacity={0.2} />
              <Legend wrapperStyle={{ fontSize: '12px', pt: '10px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 3: Interview Timeline (Turn-by-turn) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Interview Turn-by-Turn Timeline</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {finalReportData.timeline.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-indigo-500/15 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-300 font-mono">
                <span>{item.q.split(':')[0]}</span>
                <span>{item.duration}</span>
              </div>
              <p className="text-xs text-slate-200 font-semibold truncate">{item.q.split(':')[1] || item.q}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="font-extrabold text-emerald-400">{item.score}/100</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-medium">
                  {item.verdict}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Strengths & Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Key Strengths */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-emerald-500/20 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Key Technical Strengths</span>
          </h3>

          <div className="space-y-3">
            {finalReportData.strengths.map((str, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/10 space-y-1">
                <h4 className="text-xs font-bold text-emerald-300">{str.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{str.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Growth */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-amber-500/20 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Areas for Improvement</span>
          </h3>

          <div className="space-y-3">
            {finalReportData.weaknesses.map((wk, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/10 space-y-2">
                <h4 className="text-xs font-bold text-amber-300">{wk.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{wk.description}</p>
                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-[11px] text-amber-200">
                  <strong>Recommendation:</strong> {wk.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 5: 4-Week Learning Roadmap & Recommended Next Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Learning Roadmap */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">4-Week Tailored Learning Roadmap</h3>
          </div>

          <div className="space-y-3">
            {finalReportData.roadmap.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-indigo-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-indigo-400">{item.week}</span>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300">{item.desc}</p>
                </div>

                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border shrink-0 ${
                  item.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                  item.status === 'In Progress' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
                  'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Next Topics */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Recommended Next Topics</h3>
          </div>

          <div className="space-y-3">
            {finalReportData.recommendedNextTopics.map((top, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/70 border border-indigo-500/15 space-y-2">
                <h4 className="text-xs font-bold text-white">{top.topic}</h4>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">{top.difficulty}</span>
                  <span className="text-slate-400 font-mono">{top.estTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}

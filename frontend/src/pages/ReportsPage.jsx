import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { allReportsData } from '../data/mockData'
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  Award, 
  Brain, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  BarChart2,
  MessageSquare,
  ShieldCheck,
  Lock,
  PlayCircle
} from 'lucide-react'

export default function ReportsPage({ 
  interviewStatus, 
  onStartInterview, 
  onViewReportDetails, 
  onOpenFeedback,
  selectedAgent 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [downloadToast, setDownloadToast] = useState(null)
  const isLocked = interviewStatus === 'NOT_STARTED'

  const handleDownload = (e, reportTitle) => {
    e.stopPropagation()
    setDownloadToast(`Downloading evaluation report for "${reportTitle}"...`)
    setTimeout(() => {
      setDownloadToast(`Report "${reportTitle}" downloaded successfully!`)
      setTimeout(() => setDownloadToast(null), 3000)
    }, 1200)
  }

  const filteredReports = allReportsData.filter((rep) => {
    const matchesSearch = rep.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rep.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rep.role.toLowerCase().includes(searchTerm.toLowerCase())
    if (selectedFilter === 'All') return matchesSearch
    if (selectedFilter === 'Staff Level') return matchesSearch && rep.rating.includes('Staff')
    if (selectedFilter === 'Top 3%') return matchesSearch && rep.rating.includes('Top 3%')
    return matchesSearch
  })

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-slate-100 select-none">
      
      {/* Toast Notification */}
      {downloadToast && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-8 z-50 px-4 py-3 rounded-2xl bg-indigo-600 text-white font-semibold text-xs shadow-2xl border border-indigo-400/30 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{downloadToast}</span>
        </motion.div>
      )}

      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-purple-950/60 border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.2)]"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Evaluation Scorecards
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">{allReportsData.length} Archived Reports</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Interview Evaluation Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Detailed post-interview telemetry scorecards, qualitative summaries, and hiring recommendations.
          </p>
        </div>

        <button 
          onClick={onOpenFeedback}
          className="px-5 py-3 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Submit Feedback</span>
        </button>
      </motion.div>

      {/* Gated Lock Banner if NOT_STARTED */}
      {isLocked && (
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-amber-500/30 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No Live Evaluation Session Completed Yet</h3>
          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            Evaluation reports generate after taking a live interview. Complete your first interview session to unlock your custom executive scorecard and hiring recommendation.
          </p>
          <button
            onClick={onStartInterview}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all shadow-md inline-flex items-center gap-2"
          >
            <PlayCircle className="w-4 h-4 fill-current" />
            <span>Start AI Interview Session</span>
          </button>
        </div>
      )}

      {/* Unlocked Reports Content */}
      {!isLocked && (
        <>
          {/* Metric Cards Row: Technical Score & Communication Score */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-5 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>Average Technical Score</span>
                <BarChart2 className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-3xl font-black text-indigo-400 font-mono">94%</span>
              <span className="text-[10px] text-emerald-400 font-semibold block">+4% above industry benchmark</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>Average Communication Score</span>
                <MessageSquare className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-3xl font-black text-purple-400 font-mono">89%</span>
              <span className="text-[10px] text-emerald-400 font-semibold block">High Clarity & Structure</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>Pass Rate / Hire Verdict</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-3xl font-black text-emerald-400 font-mono">95%</span>
              <span className="text-[10px] text-slate-400 font-semibold block">Strong Hire Rate</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>Highest Rating Achieved</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-xl font-extrabold text-amber-300 truncate block">Staff Level Ready</span>
              <span className="text-[10px] text-slate-400 font-semibold block">Top 3% Benchmark</span>
            </div>

          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/20">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input 
                type="text"
                placeholder="Search reports by topic, role, or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-indigo-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
              {['All', 'Staff Level', 'Top 3%'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    selectedFilter === filter
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-indigo-500/10'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

          </div>

          {/* Report Cards Grid */}
          <div className="space-y-4">
            {filteredReports.length > 0 ? (
              filteredReports.map((rep) => (
                <motion.div 
                  key={rep.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={onViewReportDetails}
                  className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 hover:border-indigo-500/50 transition-all cursor-pointer space-y-4 shadow-lg group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Title & Metadata */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-indigo-400">{rep.id}</span>
                        <h3 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                          {rep.title}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${rep.badgeColor}`}>
                          {rep.rating}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400">
                        Role Evaluated: <strong className="text-slate-300">{rep.role}</strong> • {rep.date} • Duration: {rep.duration}
                      </p>
                    </div>

                    {/* Score Pills & Actions */}
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="flex items-center gap-4 text-center">
                        <div className="p-2 px-3 rounded-xl bg-slate-950 border border-indigo-500/10">
                          <span className="text-[10px] text-slate-400 block uppercase">Technical</span>
                          <span className="text-sm font-black text-indigo-400">{rep.technicalScore}%</span>
                        </div>
                        <div className="p-2 px-3 rounded-xl bg-slate-950 border border-indigo-500/10">
                          <span className="text-[10px] text-slate-400 block uppercase">Comm.</span>
                          <span className="text-sm font-black text-purple-400">{rep.communicationScore}%</span>
                        </div>
                        <div className="p-2 px-3 rounded-xl bg-slate-950 border border-indigo-500/10">
                          <span className="text-[10px] text-slate-400 block uppercase">Overall</span>
                          <span className="text-sm font-black text-emerald-400">{rep.overallScore}/100</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Download Button */}
                        <button
                          onClick={(e) => handleDownload(e, rep.title)}
                          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Download PDF Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* View Details Button */}
                        <button 
                          onClick={onViewReportDetails}
                          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-colors flex items-center gap-1.5"
                        >
                          <span>View Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-indigo-500/20 text-slate-400 space-y-2">
                <p className="text-sm font-bold">No evaluation reports match your filter query.</p>
                <p className="text-xs text-slate-500">Try clearing your search terms or filters.</p>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  )
}

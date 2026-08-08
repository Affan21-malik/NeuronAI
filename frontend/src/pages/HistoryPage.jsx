import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { interviewHistoryData } from '../data/mockData'
import { 
  Clock, 
  Search, 
  Filter, 
  ChevronRight, 
  Award, 
  PlayCircle, 
  Calendar,
  Zap,
  FileText
} from 'lucide-react'

import { Lock } from 'lucide-react'

export default function HistoryPage({ onViewReport, onStartInterview, interviewStatus }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const isLocked = interviewStatus === 'NOT_STARTED'


  const filteredHistory = interviewHistoryData.filter((item) => {
    const matchesSearch = item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.role.toLowerCase().includes(searchTerm.toLowerCase())
    if (selectedDifficulty === 'All') return matchesSearch
    return matchesSearch && item.difficulty === selectedDifficulty
  })

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
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Interview Logs & Archives
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">{interviewHistoryData.length} Completed Sessions</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Interview History
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Chronological archive of past AI probing sessions, scores, durations, and evaluations.
          </p>
        </div>

        <button 
          onClick={onStartInterview}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <PlayCircle className="w-4 h-4 fill-current text-white" />
          <span>Start New Interview</span>
        </button>
      </motion.div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-2">
          <span className="text-xs text-slate-400 font-bold block uppercase">Total Completed</span>
          <span className="text-3xl font-black text-indigo-400 font-mono">{isLocked ? '0' : '1'}</span>
          <span className="text-[10px] text-slate-400 block font-medium">{isLocked ? 'Start first session' : 'Over last 30 days'}</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-2">
          <span className="text-xs text-slate-400 font-bold block uppercase">Total Practice Time</span>
          <span className="text-3xl font-black text-purple-400 font-mono">{isLocked ? '0 hrs' : '0.5 hrs'}</span>
          <span className="text-[10px] text-slate-400 block font-semibold">{isLocked ? 'Pending evaluation' : 'Active session'}</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-2">
          <span className="text-xs text-slate-400 font-bold block uppercase">Average Score</span>
          <span className="text-3xl font-black text-emerald-400 font-mono">{isLocked ? '—' : '92/100'}</span>
          <span className="text-[10px] text-slate-400 block font-semibold">{isLocked ? 'Not Assessed' : '+3.5% improvement'}</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-2">
          <span className="text-xs text-slate-400 font-bold block uppercase">Target Track</span>
          <span className="text-xl font-extrabold text-amber-300 truncate block">AI Systems Engineer</span>
          <span className="text-[10px] text-amber-400 font-semibold block">Adaptive Probing</span>
        </div>

      </div>

      {isLocked && (
        <div className="p-8 rounded-3xl bg-slate-900/40 border border-indigo-500/20 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            <Clock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No Interview Sessions Archived Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your session history, conversation logs, time durations, and question evaluations will be archived here after taking your first AI interview.
          </p>
          <button
            onClick={onStartInterview}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all shadow-md inline-flex items-center gap-2"
          >
            <PlayCircle className="w-4 h-4 fill-current" />
            <span>Start Practice Session</span>
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/20">
        
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input 
            type="text"
            placeholder="Search past sessions by topic or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-indigo-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filter by Difficulty */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          {['All', 'Hard', 'Medium', 'Easy'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                selectedDifficulty === diff
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-indigo-500/10'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

      </div>

      {/* History Table / Card List */}
      <div className="space-y-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((session) => (
            <motion.div 
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/20 hover:border-indigo-500/50 transition-all space-y-4 shadow-md group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Left Info */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-indigo-400 font-bold">{session.id}</span>
                    <h3 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                      {session.topic}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      session.difficulty === 'Hard' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      session.difficulty === 'Medium' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {session.difficulty}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium pt-1">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-500" /> {session.date}</span>
                    <span>Role: <strong className="text-slate-300">{session.role}</strong></span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-500" /> {session.duration}</span>
                  </div>
                </div>

                {/* Right Info & Actions */}
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-semibold">Evaluation Score</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">{session.score}/100</span>
                  </div>

                  <button
                    onClick={onViewReport}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-indigo-300 hover:text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Report</span>
                  </button>
                </div>

              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-indigo-500/20 text-slate-400 space-y-2">
            <p className="text-sm font-bold">No past interview sessions match your filter.</p>
            <p className="text-xs text-slate-500">Try clearing your search query.</p>
          </div>
        )}
      </div>

    </div>
  )
}

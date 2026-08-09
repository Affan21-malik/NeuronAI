import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  Paperclip, 
  Code, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  TrendingUp,
  Radar as RadarIcon,
  Sliders,
  Award,
  ChevronDown,
  Cpu,
  Brain,
  Timer
} from 'lucide-react'
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar 
} from 'recharts'
import CodeChallengeModal from '../components/CodeChallengeModal'
import AgentSelectionScreen from '../components/AgentSelectionScreen'
import { memoryTimeline, aiReasoningLogs } from '../data/mockData'
import { useAuth } from '../hooks/useAuth'

export default function InterviewPage({ interviewHook, onEndInterview }) {
  const { user } = useAuth()
  const candidateName = user?.fullName || 'Candidate'
  const {
    interviewStatus,
    selectedAgent,
    startInterview,
    session,
    messages,
    isAiThinking,
    timerFormatted,
    inputMessage,
    setInputMessage,
    handleSendMessage,
    isRecordingVoice,
    toggleVoiceRecording,
    isCodeModalOpen,
    setIsCodeModalOpen,
    currentQuestionIndex,
    confidenceScore,
    questionScores,
  } = interviewHook

  const [showReasoning, setShowReasoning] = useState(true)

  // Show Agent Selection screen if interview has not started yet or no agent selected
  if (interviewStatus === 'NOT_STARTED' || !selectedAgent) {
    return (
      <div className="h-[calc(100vh-65px)] overflow-hidden bg-slate-950 text-slate-100 flex items-center justify-center">
        <AgentSelectionScreen 
          onSelectAndStart={(agent) => {
            startInterview(agent)
          }} 
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-65px)] overflow-hidden bg-slate-950 text-slate-100">
      
      {/* Center Main Canvas (Hero Section of App) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-indigo-500/15">
        
        {/* Top Telemetry Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-indigo-500/15 backdrop-blur-xl shrink-0 space-y-4">
          
          {/* Status Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Live Interview Status */}
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Interview Status: Active
              </span>

              {/* Selected AI Interviewer Badge */}
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5 shadow-sm">
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
                Interviewer: {selectedAgent?.name || 'JARVIS'}
              </span>

              {/* Estimated Answer Time */}
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <Timer className="w-3.5 h-3.5 text-indigo-400" />
                Est. Answer Time: {session.estAnswerTime || "2m 30s"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-indigo-500/20 text-xs font-mono text-indigo-300 font-bold">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>{timerFormatted}</span>
              </div>

              <button
                onClick={onEndInterview}
                className="px-4 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-bold transition-all"
              >
                {currentQuestionIndex >= 10 ? 'View Final Evaluation' : 'Exit Interview'}
              </button>
            </div>
          </div>

          {/* Topic Title & Progress Tracker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <span>{session.title}</span>
                <HelpCircle className="w-4 h-4 text-slate-400 hover:text-indigo-400 cursor-pointer" />
              </h2>
              <span className="text-xs font-bold text-indigo-300 font-mono">
                Progress Tracker: Q{currentQuestionIndex} / 10
              </span>
            </div>

            {/* Question Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-900 border border-indigo-500/20 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentQuestionIndex / 10) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Badges Grid: Question Difficulty, Current Topic, Real-time Confidence Meter */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            
            {/* Question Difficulty Badge */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-indigo-500/15 flex flex-col justify-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Difficulty Badge</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>{session.difficulty}</span>
              </div>
            </div>

            {/* Current Topic Badge */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-indigo-500/15 flex flex-col justify-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Current Topic</span>
              <p className="text-xs font-bold text-indigo-300 truncate mt-0.5">{session.topic}</p>
            </div>

            {/* Real-time Confidence Meter */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-indigo-500/15 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Confidence</span>
                <span className="text-xs font-extrabold text-emerald-400">{confidenceScore}%</span>
              </div>

              {/* Dynamic SVG Meter */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-8 h-8 transform -rotate-90">
                  <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2.5" className="text-slate-800" fill="transparent" />
                  <circle 
                    cx="16" 
                    cy="16" 
                    r="13" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    className="text-emerald-400" 
                    fill="transparent"
                    strokeDasharray={81.6}
                    strokeDashoffset={81.6 - (81.6 * (Number(confidenceScore) || 0)) / 100}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

          </div>

          {/* AI Reasoning Status Accordion */}
          <div className="rounded-xl bg-indigo-950/40 border border-indigo-500/20 overflow-hidden">
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold text-indigo-300 bg-slate-900/40 hover:bg-slate-900/70 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>AI Reasoning Status Log</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showReasoning ? 'rotate-180' : ''}`} />
            </button>

            {showReasoning && (
              <div className="p-3 text-[11px] font-mono text-slate-300 space-y-1 bg-slate-950/60 border-t border-indigo-500/10">
                {aiReasoningLogs.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-purple-400">›</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* AI Chat Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
          <AnimatePresence>
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai'
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 sm:gap-4 max-w-3xl ${isAi ? '' : 'ml-auto flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-xl p-[1px] shrink-0 shadow-md ${
                    isAi ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'
                  }`}>
                    <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                      {isAi ? <Bot className="w-5 h-5 text-indigo-400" /> : <User className="w-5 h-5 text-purple-300" />}
                    </div>
                  </div>

                  {/* Bubble Content */}
                  <div className="space-y-1.5 max-w-2xl">
                    
                    {/* Sender Header */}
                    <div className={`flex items-center gap-2 text-xs font-semibold ${isAi ? '' : 'justify-end'}`}>
                      <span className={isAi ? 'text-indigo-400' : 'text-slate-300'}>
                        {isAi ? 'AI Interviewer' : `You (${candidateName})`}
                      </span>

                      {/* Follow-up Indicator / Question Badge */}
                      {msg.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          msg.followUp 
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)] animate-pulse'
                            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        }`}>
                          {msg.badge}
                        </span>
                      )}

                      <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                    </div>

                    {/* Main Bubble Text */}
                    <div className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                      isAi
                        ? 'bg-slate-900/90 border border-indigo-500/20 text-slate-100 rounded-tl-sm shadow-md'
                        : 'bg-indigo-950/60 border border-indigo-500/30 text-white rounded-tr-sm shadow-md'
                    }`}>
                      <p className="whitespace-pre-line">{msg.content}</p>

                      {/* Follow-up Question Sub-Card */}
                      {msg.followUp && msg.contentFollowUp && (
                        <div className="mt-3 p-3 rounded-2xl bg-purple-950/50 border border-purple-500/40 text-purple-200 font-medium space-y-1">
                          <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">Intelligent Follow-up Question</span>
                          <p>{msg.contentFollowUp}</p>
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* AI Thinking Loader */}
          {isAiThinking && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex gap-3 max-w-xl"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-400 animate-spin" />
                </div>
              </div>

              <div className="px-4 py-3 rounded-2xl bg-slate-900/90 border border-indigo-500/30 flex items-center gap-3 text-xs text-indigo-300 font-semibold shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <span>AI Agent is evaluating architectural depth & generating follow-up...</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Controls Bar */}
        <div className="p-4 bg-slate-950/95 border-t border-indigo-500/15 backdrop-blur-xl shrink-0 space-y-2">
          
          <div className="relative flex items-center bg-slate-900/90 rounded-2xl border border-indigo-500/25 p-2 shadow-inner focus-within:border-indigo-500/60 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all">
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1 pl-1">
              <button 
                onClick={() => setIsCodeModalOpen(true)}
                title="Attach Code Snippet"
                className="p-2 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
              >
                <Code className="w-4 h-4" />
              </button>

              <button 
                onClick={toggleVoiceRecording}
                title="Voice Dictation"
                className={`p-2 rounded-xl transition-all ${
                  isRecordingVoice
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                    : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>

              <button 
                title="Attach Schema Document"
                className="p-2 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isRecordingVoice ? "Listening... Speak your response..." : "Type your technical response here..."}
              className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-500/30 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-500 font-medium">
            AI Interviewer evaluates answers live. Code attachments automatically invoke schema validation.
          </p>

        </div>

      </div>

      {/* Right Intelligence & Memory Sidebar */}
      <div className="w-full lg:w-80 shrink-0 bg-slate-950/80 p-4 sm:p-5 overflow-y-auto space-y-6 select-none border-t lg:border-t-0 border-indigo-500/15">
        
        {/* Widget 1: Interview Memory Timeline */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/15 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              <span>Memory Timeline</span>
            </h4>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-mono">
              Active Memory
            </span>
          </div>

          <div className="space-y-2">
            {memoryTimeline.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/10 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-200">
                  <span>{item.turn}: {item.topic}</span>
                  <span className="text-[9px] text-slate-500 font-mono">{item.timestamp}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: Knowledge Map Radar Chart */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/15">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <RadarIcon className="w-3.5 h-3.5 text-purple-400" />
              <span>Live Knowledge Map</span>
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Live Radar
            </span>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={session.radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 9 }} />
                <Radar name="Score" dataKey="score" stroke="#c084fc" fill="#a855f7" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Widget 3: Skill Gap Analysis */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/15 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Skill Gap Analysis</span>
            </h4>
          </div>

          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-bold text-emerald-400">Strong</span>
                <span className="text-slate-400">{session.skillGap.strong.percentage}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${session.skillGap.strong.percentage}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-bold text-amber-400">Average</span>
                <span className="text-slate-400">{session.skillGap.average.percentage}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${session.skillGap.average.percentage}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-bold text-rose-400">Weak</span>
                <span className="text-slate-400">{session.skillGap.weak.percentage}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-rose-400 rounded-full" style={{ width: `${session.skillGap.weak.percentage}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Widget 4: Interview Progress Chart */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/15">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>Interview Progress</span>
            </h4>
            <span className="text-[10px] text-indigo-300 font-mono">Scores Q1-Q10</span>
          </div>

          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={questionScores}>
                <XAxis dataKey="question" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[50, 100]} stroke="#64748b" hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#6366f1', borderRadius: '12px', fontSize: '11px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#818cf8" 
                  strokeWidth={2.5} 
                  dot={{ fill: '#6366f1', r: 4 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Code Challenge Modal */}
      <CodeChallengeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        onSubmitCode={(codeText) => handleSendMessage(`\`\`\`typescript\n${codeText}\n\`\`\``)}
      />

    </div>
  )
}

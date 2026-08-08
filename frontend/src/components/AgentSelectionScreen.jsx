import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AI_AGENTS } from '../data/aiAgents'
import { 
  Bot, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Brain,
  Sliders
} from 'lucide-react'

export default function AgentSelectionScreen({ onSelectAndStart }) {
  const [selectedAgentId, setSelectedAgentId] = useState(null)

  const selectedAgent = AI_AGENTS.find((a) => a.id === selectedAgentId)

  const handleStart = () => {
    if (!selectedAgent) return
    onSelectAndStart(selectedAgent)
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto text-slate-100 select-none overflow-y-auto">
      
      {/* Top Header */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto space-y-3 mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs font-bold text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>INTERVIEWER PERSONA SELECTION</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Choose Your AI Interviewer
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
          Select the interviewer style that best matches how you want to be challenged.
        </p>
      </motion.div>

      {/* 3 Selectable Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
        {AI_AGENTS.map((agent) => {
          const Icon = agent.icon
          const isSelected = selectedAgentId === agent.id

          return (
            <motion.div
              key={agent.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`relative rounded-3xl p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between border ${
                isSelected
                  ? `bg-slate-900/95 ${agent.colorTheme.borderGlow} ${agent.colorTheme.ring}`
                  : `bg-slate-950/60 border-indigo-500/15 hover:border-indigo-500/40 hover:bg-slate-900/40`
              }`}
            >
              {/* Header Icon & Selection Indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${agent.colorTheme.badgeBg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${agent.colorTheme.textAccent}`} />
                </div>
                
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                  isSelected 
                    ? `${agent.colorTheme.border} ${agent.colorTheme.badgeBg} text-white shadow-md` 
                    : 'border-slate-700 bg-slate-900/50 text-transparent'
                }`}>
                  <CheckCircle2 className="w-4 h-4 fill-current" />
                </div>
              </div>

              {/* Agent Name & Tagline */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-white tracking-tight">{agent.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${agent.colorTheme.badgeBg}`}>
                    {agent.badge}
                  </span>
                </div>
                <p className={`text-xs font-semibold ${agent.colorTheme.textAccent}`}>
                  {agent.tagline}
                </p>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs">
                
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-0.5">Role Focus</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed font-medium">{agent.roleSummary}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-0.5">Personality & Style</span>
                  <p className="text-slate-400 text-[11px] font-mono">{agent.personality}</p>
                </div>

                {/* Focus Badges */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {agent.focusPoints.map((point, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-medium"
                    >
                      • {point}
                    </span>
                  ))}
                </div>

              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Start Interview CTA Cluster */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl text-center space-y-3"
      >
        <button
          onClick={handleStart}
          disabled={!selectedAgentId}
          className={`w-full py-4 px-8 rounded-2xl font-extrabold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-xl ${
            selectedAgentId
              ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
              : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60'
          }`}
        >
          <span>{selectedAgentId ? `Start Interview with ${selectedAgent?.name}` : 'Select an AI Interviewer to Begin'}</span>
          <ArrowRight className={`w-4 h-4 ${selectedAgentId ? 'text-white' : 'text-slate-600'}`} />
        </button>

        <p className="text-[11px] text-slate-500 font-mono">
          {selectedAgentId 
            ? `Interviewer Persona [${selectedAgent?.name}] selected for this session.` 
            : 'Select one persona card above to enable the Start Interview button.'}
        </p>
      </motion.div>

    </div>
  )
}

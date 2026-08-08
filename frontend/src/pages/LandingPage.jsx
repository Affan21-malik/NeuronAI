import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  Terminal, 
  Radar, 
  Activity, 
  Zap, 
  ShieldCheck, 
  ChevronDown, 
  Play, 
  CheckCircle2, 
  Brain, 
  MessageSquareCode, 
  FileCheck2,
  Award,
  Layers,
  Server,
  Database,
  Sliders,
  TrendingUp
} from 'lucide-react'
import { 
  whyChooseNeuronAI, 
  aiWorkflowSteps, 
  faqList 
} from '../data/mockData'

export default function LandingPage({ onLaunchInterview, onGoToDashboard }) {
  const [openFaq, setOpenFaq] = useState(0)

  const architectureNodes = [
    { title: "Host Application", desc: "React + Vite Frontend Host", icon: Terminal, color: "text-indigo-400 border-indigo-500/30" },
    { title: "MCP Transport Layer", desc: "JSON-RPC Stdio / SSE Adapter", icon: Server, color: "text-purple-400 border-purple-500/30" },
    { title: "Context Window Trimmer", desc: "Sliding Window Vector Compression", icon: Database, color: "text-cyan-400 border-cyan-500/30" },
    { title: "NeuronAI Probing Engine", desc: "Adaptive Staff Evaluation", icon: Cpu, color: "text-emerald-400 border-emerald-500/30" }
  ]

  const capabilitiesShowcase = [
    { title: "Contextual Interview Memory", desc: "Retains previous answers to probe contradictions and test technical integrity across multi-turn sessions.", icon: Brain, badge: "Memory Core" },
    { title: "Dynamic Adaptive Difficulty", desc: "Automatically scales from Senior to Staff level question complexity based on real-time response clarity.", icon: Sliders, badge: "Adaptive Scaling" },
    { title: "Live Skill Matrix Telemetry", desc: "Renders real-time Radar knowledge maps and confidence gauges for immediate performance visibility.", icon: Radar, badge: "Telemetry Map" },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden relative">
      
      {/* Neon Backdrop Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Animated AI Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.25)] mb-8"
        >
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
            Powered by Model Context Protocol & Adaptive AI
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-5xl mx-auto leading-[1.1]"
        >
          Master Technical Interviews with Your Personal <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 underline decoration-indigo-500/40 decoration-wavy underline-offset-8">
            Autonomous AI Agent
          </span>
        </motion.h1>

        {/* Subhead */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal"
        >
          NeuronAI simulates real-time Staff Engineer panels with dynamic follow-up questions, interactive code challenges, live confidence meters, and comprehensive knowledge maps.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={onLaunchInterview}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-extrabold text-sm shadow-[0_0_35px_rgba(99,102,241,0.45)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
          >
            <Play className="w-4 h-4 fill-current text-white" />
            <span>Start Live AI Interview</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onGoToDashboard}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 border border-indigo-500/25 text-slate-200 hover:text-white font-bold text-sm hover:bg-slate-800/80 hover:border-indigo-400/50 transition-all flex items-center justify-center gap-2"
          >
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Explore Candidate Dashboard</span>
          </button>
        </motion.div>

        {/* Live Metrics Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-indigo-500/15">
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-indigo-500/10">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-indigo-400">98.4%</h4>
            <p className="text-xs text-slate-400 mt-1 font-medium">Realism Match Score</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-indigo-500/10">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-purple-400">12,450+</h4>
            <p className="text-xs text-slate-400 mt-1 font-medium">Sessions Simulated</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-indigo-500/10">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-cyan-400">&lt; 400ms</h4>
            <p className="text-xs text-slate-400 mt-1 font-medium">AI Stream Latency</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-indigo-500/10">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-emerald-400">Staff+</h4>
            <p className="text-xs text-slate-400 mt-1 font-medium">Panel Difficulty</p>
          </div>
        </div>

      </section>

      {/* SECTION 1: Why Choose NeuronAI */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-indigo-500/15">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">Hackathon Advantage</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Why Choose NeuronAI?</h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3">
            Designed to replace static chat prompts with dynamic memory, live telemetry, and staff-level adaptive interview panels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {whyChooseNeuronAI.map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl bg-slate-900/60 border border-indigo-500/20 hover:border-indigo-500/50 shadow-xl transition-all relative overflow-hidden space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-6 h-6" />
              </div>

              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 inline-block">
                {item.badge}
              </span>

              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 2: AI Interview Workflow */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-indigo-500/15 bg-slate-950/40">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-2">Step-by-Step Execution</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Autonomous Interview Workflow</h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3">
            From setup to staff scorecard, see how NeuronAI conducts hyper-realistic evaluation sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiWorkflowSteps.map((step, idx) => (
            <div key={idx} className="relative p-6 rounded-3xl bg-slate-900/70 border border-indigo-500/15 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-mono">
                  {step.step}
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Zap className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-base font-bold text-white">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Architecture Preview (MCP + RAG) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-indigo-500/15">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-2">Technical Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Model Context Protocol Architecture</h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3">
            Standardized JSON-RPC schemas connecting client hosts to persistent context and LLM inference engines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {architectureNodes.map((node, idx) => {
            const Icon = node.icon
            return (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-3xl bg-slate-900/80 border ${node.color} space-y-3 shadow-lg`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${node.color.split(' ')[0]}`} />
                </div>
                <h3 className="text-base font-bold text-white">{node.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{node.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* SECTION 4: AI Capabilities Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-indigo-500/15 bg-slate-950/60">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-2">Feature Suite</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">AI Capabilities Showcase</h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3">
            Built from the ground up for technical candidates preparing for Staff AI Infrastructure roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {capabilitiesShowcase.map((cap, idx) => {
            const Icon = cap.icon
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-slate-900/60 border border-indigo-500/20 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {cap.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">{cap.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">{cap.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-indigo-500/15">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqList.map((faq, idx) => (
            <div 
              key={idx}
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="p-6 rounded-2xl bg-slate-900/60 border border-indigo-500/15 cursor-pointer hover:border-indigo-500/40 transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-bold text-white">{faq.q}</h3>
                <ChevronDown className={`w-5 h-5 text-indigo-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </div>

              {openFaq === idx && (
                <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed font-medium pt-3 border-t border-slate-800">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-12 border-t border-indigo-500/20 text-center text-xs text-slate-500">
        <p>© 2026 NeuronAI – Hackathon Edition. Autonomous AI Interview Agent.</p>
      </footer>

    </div>
  )
}

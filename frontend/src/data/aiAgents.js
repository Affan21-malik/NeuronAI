import { Cpu, Sparkles, Zap } from 'lucide-react'

/**
 * AI Interviewer Personas Definition
 * Stable IDs: 'jarvis', 'friday', 'ultron'
 */
export const AI_AGENTS = [
  {
    id: 'jarvis',
    name: 'JARVIS',
    tagline: 'Precision & Technical Correctness',
    personality: 'Calm, composed, intelligent, precise, systematic, reliable.',
    communication: 'Professional, concise, information-focused.',
    behavior: 'Analytical, structured, task-oriented, accuracy-focused.',
    role: 'Precision-Focused Technical Interviewer',
    roleSummary: 'Emphasizes technical correctness, architecture, engineering decisions, and accuracy.',
    focusPoints: ['Technical Correctness', 'Architecture', 'Engineering Decisions', 'Accuracy'],
    badge: 'Precision',
    icon: Cpu,
    colorTheme: {
      border: 'border-indigo-500',
      borderGlow: 'border-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.35)]',
      bgActive: 'bg-indigo-950/40',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      textAccent: 'text-indigo-400',
      gradient: 'from-indigo-600 to-blue-600',
      ring: 'ring-2 ring-indigo-500',
    }
  },
  {
    id: 'friday',
    name: 'FRIDAY',
    disabled: true,
    comingSoon: true,
    tagline: 'Adaptability & Conversation',
    personality: 'Responsive, adaptive, observant, context-aware, supportive.',
    communication: 'Natural, conversational, clear.',
    behavior: 'Responds according to changing situations and candidate context.',
    role: 'Adaptive & Conversational Interviewer',
    roleSummary: 'Focuses on candidate reasoning, context, natural conversation, and intelligent contextual follow-ups.',
    focusPoints: ['Candidate Reasoning', 'Context', 'Natural Conversation', 'Contextual Follow-ups'],
    badge: 'Adaptive',
    icon: Sparkles,
    colorTheme: {
      border: 'border-purple-500',
      borderGlow: 'border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.35)]',
      bgActive: 'bg-purple-950/40',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      textAccent: 'text-purple-400',
      gradient: 'from-purple-600 to-pink-600',
      ring: 'ring-2 ring-purple-500',
    }
  },
  {
    id: 'ultron',
    name: 'ULTRON',
    disabled: true,
    comingSoon: true,
    tagline: 'Depth & Technical Challenge',
    personality: 'Highly analytical, autonomous, persistent, confident, skeptical.',
    communication: 'Direct, assertive, analytical.',
    behavior: 'Challenges assumptions, identifies weaknesses and probes deeper.',
    role: 'Analytical & Stress-Test Interviewer',
    roleSummary: 'Focuses on edge cases, trade-offs, limitations, technical depth, and challenging assumptions.',
    focusPoints: ['Edge Cases', 'Trade-offs', 'Limitations', 'Technical Depth'],
    badge: 'Stress Test',
    icon: Zap,
    colorTheme: {
      border: 'border-rose-500',
      borderGlow: 'border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.35)]',
      bgActive: 'bg-rose-950/40',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      textAccent: 'text-rose-400',
      gradient: 'from-rose-600 to-amber-600',
      ring: 'ring-2 ring-rose-500',
    }
  }
]

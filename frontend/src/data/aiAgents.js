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
    tagline: 'Adaptive & Conversational',
    personality: 'Responsive, adaptive, observant, context-aware, supportive, natural and conversational.',
    communication: 'Natural, conversational, clear, supportive.',
    behavior: 'Responds according to candidate reasoning, context, and explanation quality.',
    role: 'Adaptive & Conversational Interviewer',
    roleSummary: 'Focuses on candidate reasoning, contextual follow-up questions, explanation quality, and adaptive conversation.',
    focusPoints: ['Candidate Reasoning', 'Contextual Follow-ups', 'Explanation Quality', 'Conversational Style'],
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
    tagline: 'Analytical & Technical Challenge',
    personality: 'Highly analytical, direct, persistent, skeptical, challenging.',
    communication: 'Direct, assertive, analytical.',
    behavior: 'Probes edge cases, trade-offs, limitations, and hidden assumptions.',
    role: 'Analytical & Stress-Test Interviewer',
    roleSummary: 'Focuses on edge cases, trade-offs, limitations, hidden assumptions, and deep technical understanding.',
    focusPoints: ['Edge Cases', 'Trade-offs', 'Limitations', 'Hidden Assumptions'],
    badge: 'Challenge',
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

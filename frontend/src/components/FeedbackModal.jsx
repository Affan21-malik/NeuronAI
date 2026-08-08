import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Sparkles, CheckCircle2, ThumbsUp, Send } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function FeedbackModal({ isOpen, onClose }) {
  const [overallRating, setOverallRating] = useState(5)
  const [realismRating, setRealismRating] = useState(5)
  const [difficultyRating, setDifficultyRating] = useState(4)
  const [questionQuality, setQuestionQuality] = useState(5)
  const [followUpQuality, setFollowUpQuality] = useState(5)
  const [interviewFlow, setInterviewFlow] = useState(5)
  const [knowledgeMapQuality, setKnowledgeMapQuality] = useState(5)
  const [confidenceMeterRating, setConfidenceMeterRating] = useState(5)
  const [skillGapRating, setSkillGapRating] = useState(4)
  const [finalReportQuality, setFinalReportQuality] = useState(5)

  const [suggestions, setSuggestions] = useState('')
  const [recommendToggle, setRecommendToggle] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitted(true)

    // Trigger celebratory confetti blast
    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      })
    } catch (err) {
      console.log('Confetti trigger error:', err)
    }
  }

  const handleReset = () => {
    setIsSubmitted(false)
    onClose()
  }

  const ratingCategories = [
    { label: "Overall Rating", state: overallRating, setter: setOverallRating, color: "text-amber-400 fill-amber-400" },
    { label: "Interview Realism", state: realismRating, setter: setRealismRating, color: "text-indigo-400 fill-indigo-400" },
    { label: "Difficulty Level", state: difficultyRating, setter: setDifficultyRating, color: "text-purple-400 fill-purple-400" },
    { label: "Question Quality", state: questionQuality, setter: setQuestionQuality, color: "text-cyan-400 fill-cyan-400" },
    { label: "Follow-up Quality", state: followUpQuality, setter: setFollowUpQuality, color: "text-pink-400 fill-pink-400" },
    { label: "Interview Flow", state: interviewFlow, setter: setInterviewFlow, color: "text-emerald-400 fill-emerald-400" },
    { label: "Knowledge Map Quality", state: knowledgeMapQuality, setter: setKnowledgeMapQuality, color: "text-amber-400 fill-amber-400" },
    { label: "Confidence Meter", state: confidenceMeterRating, setter: setConfidenceMeterRating, color: "text-indigo-400 fill-indigo-400" },
    { label: "Skill Gap Analysis", state: skillGapRating, setter: setSkillGapRating, color: "text-purple-400 fill-purple-400" },
    { label: "Final Report Quality", state: finalReportQuality, setter: setFinalReportQuality, color: "text-emerald-400 fill-emerald-400" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        
        {/* Top Glow Bar */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          /* Thank You Celebration View */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-6"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-[0_0_40px_rgba(99,102,241,0.6)] flex items-center justify-center animate-bounce">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
              </div>
              <Sparkles className="w-6 h-6 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-white mb-2">Thank You for Evaluating NeuronAI!</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Your feedback helps us refine NeuronAI's autonomous probing algorithms for staff-level engineering evaluations.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 max-w-md w-full">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-indigo-300">
                <ThumbsUp className="w-4 h-4 text-indigo-400" />
                <span>Overall Rating Submitted: {overallRating} / 5 Stars ★★★★★</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform"
            >
              Back to Candidate Dashboard
            </button>
          </motion.div>
        ) : (
          /* Feedback Form View */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            
            {/* Title */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-xl font-extrabold text-white">Interview Experience Feedback</h3>
              </div>
              <p className="text-xs text-slate-400">
                Evaluate all 10 core components of NeuronAI for hackathon judging & platform improvement.
              </p>
            </div>

            {/* 10 Rating Categories Grid */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-indigo-500/15 max-h-72 overflow-y-auto">
              {ratingCategories.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/40">
                  <span className="text-xs font-semibold text-slate-200">{cat.label}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={`star-${idx}-${star}`}
                        onClick={() => cat.setter(star)}
                        className="p-0.5 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-4 h-4 ${star <= cat.state ? cat.color : 'text-slate-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Suggestions */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 block">
                Suggestions & Hackathon Feedback
              </label>
              <textarea
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                rows={3}
                placeholder="The MCP probing follow-up questions and live telemetry meters were exceptional..."
                className="w-full p-3 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/50 resize-none"
              />
            </div>

            {/* Recommend To Others Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-indigo-500/15">
              <div>
                <span className="text-xs font-bold text-slate-100 block">Recommend To Others</span>
                <span className="text-[11px] text-slate-400">Would you recommend NeuronAI to peer engineers?</span>
              </div>

              <button
                type="button"
                onClick={() => setRecommendToggle(!recommendToggle)}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                  recommendToggle ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-slate-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  recommendToggle ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Feedback & Launch Confetti</span>
            </button>

          </form>
        )}

      </motion.div>
    </div>
  )
}

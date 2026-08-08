import { useState, useEffect } from 'react'
import { initialInterviewSession } from '../data/mockData'

<<<<<<< HEAD
export function useInterview() {
  const [interviewStatus, setInterviewStatus] = useState('NOT_STARTED') // 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  const [session, setSession] = useState(initialInterviewSession)
  const [messages, setMessages] = useState(initialInterviewSession.messages)
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
=======
const INTERVIEW_STORAGE_KEY = 'neuron_ai_interview_state'

function loadSavedInterviewState() {
  try {
    const raw = localStorage.getItem(INTERVIEW_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Only restore selectedAgent when there is an active IN_PROGRESS session.
    // For NOT_STARTED / COMPLETED sessions the agent belongs to that finished
    // session and must NOT carry over — the user must choose again.
    if (parsed.interviewStatus !== 'IN_PROGRESS') {
      parsed.selectedAgent = null
    }
    return parsed
  } catch (e) {
    return null
  }
}

export function useInterview() {
  const saved = loadSavedInterviewState()

  const [rawStatus, setRawStatus] = useState(() => saved?.interviewStatus || 'NOT_STARTED')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => saved?.currentQuestionIndex ?? 0)
  const [session, setSession] = useState(initialInterviewSession)
  const [messages, setMessages] = useState(() => saved?.messages || initialInterviewSession.messages)
  const [selectedAgent, setSelectedAgent] = useState(() => saved?.selectedAgent || null)
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(() => saved?.timerSeconds || 0)
  const [isTimerRunning, setIsTimerRunning] = useState(() => saved?.interviewStatus === 'IN_PROGRESS')
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
  const [inputMessage, setInputMessage] = useState('')
  const [isRecordingVoice, setIsRecordingVoice] = useState(false)
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
<<<<<<< HEAD
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1)
  const [confidenceScore, setConfidenceScore] = useState(72)
=======
  const [confidenceScore, setConfidenceScore] = useState(() => saved?.confidenceScore || 72)
  // Per-question scores — only populated as questions are actually answered.
  // Each entry: { question: 'Q1', score: 78 }
  const [questionScores, setQuestionScores] = useState(() => saved?.questionScores || [])

  // Single Source of Truth Derived Lifecycle State:
  // - NOT_STARTED (1. Before): When interview has not started and question count is 0
  // - IN_PROGRESS (2. During): When interview is active and questions Q1 to Q10 are in progress
  // - COMPLETED (3. After): When all 10 questions have been completed or interview has ended
  let interviewStatus = rawStatus

  if (rawStatus === 'COMPLETED' || currentQuestionIndex >= 10) {
    interviewStatus = 'COMPLETED'
  } else if (rawStatus === 'IN_PROGRESS' || currentQuestionIndex > 0) {
    interviewStatus = 'IN_PROGRESS'
  } else {
    interviewStatus = 'NOT_STARTED'
  }

  const activeQuestionNumber = 
    interviewStatus === 'NOT_STARTED' ? 0 : 
    interviewStatus === 'COMPLETED' ? 10 : 
    Math.max(1, Math.min(10, currentQuestionIndex))

  // Persist state in localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        interviewStatus,
        currentQuestionIndex: activeQuestionNumber,
        timerSeconds,
        confidenceScore,
        messages,
        selectedAgent,
        questionScores,
      }
      localStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify(stateToSave))
    } catch (e) {}
  }, [interviewStatus, activeQuestionNumber, timerSeconds, confidenceScore, messages, selectedAgent, questionScores])
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86

  // Timer interval
  useEffect(() => {
    let interval = null
    if (isTimerRunning && interviewStatus === 'IN_PROGRESS') {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, interviewStatus])

  const formatTimer = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs > 0 ? String(hrs).padStart(2, '0') + ':' : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

<<<<<<< HEAD
  const startInterview = () => {
    setInterviewStatus('IN_PROGRESS')
    setIsTimerRunning(true)
    if (timerSeconds === 0) {
      setTimerSeconds(1122) // 18m 42s live simulation baseline
      setCurrentQuestionIndex(4)
      setConfidenceScore(86)
    }
  }

  const completeInterview = () => {
    setInterviewStatus('COMPLETED')
    setIsTimerRunning(false)
  }

  const resetInterview = () => {
    setInterviewStatus('NOT_STARTED')
    setIsTimerRunning(false)
    setTimerSeconds(0)
    setCurrentQuestionIndex(1)
    setConfidenceScore(72)
=======
  const startInterview = (agent = null) => {
    const agentToUse = agent || selectedAgent || { id: 'jarvis', name: 'JARVIS', tagline: 'Precision & Technical Correctness' }
    setSelectedAgent(agentToUse)
    setRawStatus('IN_PROGRESS')
    setIsTimerRunning(true)
    setTimerSeconds(0)
    setCurrentQuestionIndex(1)
    setConfidenceScore(72)
    setQuestionScores([])  // clear per-question scores for fresh session

    const initialMsg = {
      id: `msg-ai-init`,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: `Hello! I am ${agentToUse.name}, your ${agentToUse.role || 'AI Interviewer'} for today's session.\n\nLet's begin with Question 1: How do you handle distributed consensus and state synchronization in high-throughput microservice architectures?`,
      badge: `Question 1/10 • ${agentToUse.name}`,
      followUp: false,
    }

    setMessages([initialMsg])
    try {
      localStorage.removeItem(INTERVIEW_STORAGE_KEY)
    } catch (e) {}
  }

  const completeInterview = () => {
    setRawStatus('COMPLETED')
    setIsTimerRunning(false)
    setCurrentQuestionIndex(10)
    // Clear agent from state so agent selection shows for the NEXT interview.
    // The completed session's agent is already embedded in the messages/report.
    setSelectedAgent(null)
  }

  const resetInterview = () => {
    setRawStatus('NOT_STARTED')
    setIsTimerRunning(false)
    setTimerSeconds(0)
    setCurrentQuestionIndex(0)
    setConfidenceScore(72)
    setSelectedAgent(null)
    setQuestionScores([])
    setMessages(initialInterviewSession.messages)
    try {
      localStorage.removeItem(INTERVIEW_STORAGE_KEY)
    } catch (e) {}
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
  }

  const handleSendMessage = (customText = null) => {
    const textToSend = customText || inputMessage
    if (!textToSend.trim()) return

<<<<<<< HEAD
=======
    // Auto-activate interview if first message is sent
    if (interviewStatus === 'NOT_STARTED' || currentQuestionIndex === 0) {
      setRawStatus('IN_PROGRESS')
      setIsTimerRunning(true)
    }

>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: timeStr,
      content: textToSend,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputMessage('')
    setIsAiThinking(true)

<<<<<<< HEAD
    // Simulate AI thinking and dynamic follow-up generation
    setTimeout(() => {
      setIsAiThinking(false)
      
      const isNextFollowUp = Math.random() > 0.3
      const nextIndex = Math.min(currentQuestionIndex + (isNextFollowUp ? 0 : 1), 10)
      setCurrentQuestionIndex(nextIndex)

=======
    // Simulate AI thinking and question progression
    setTimeout(() => {
      setIsAiThinking(false)
      
      const current = currentQuestionIndex === 0 ? 1 : currentQuestionIndex
      const nextIndex = current + 1
      const isCompletedNow = nextIndex > 10

      // Record score for the question that was just answered (current)
      const answeredScore = Math.min(98, Math.max(62, confidenceScore + Math.floor(Math.random() * 14) - 4))
      setQuestionScores((prev) => {
        // Avoid duplicate entry if question already scored (edge case)
        if (prev.find((p) => p.question === `Q${current}`)) return prev
        return [...prev, { question: `Q${current}`, score: answeredScore }]
      })

      if (isCompletedNow) {
        setCurrentQuestionIndex(10)
        completeInterview()
        const aiFinalMsg = {
          id: `msg-ai-${Date.now()}`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: `All 10 technical questions completed! Your full evaluation report and skill telemetry scorecard have been generated.`,
          badge: "Evaluation Complete",
          followUp: false,
        }
        setMessages((prev) => [...prev, aiFinalMsg])
        return
      }

      setCurrentQuestionIndex(nextIndex)
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
      const newConfidence = Math.min(98, Math.max(60, confidenceScore + Math.floor(Math.random() * 5) - 1))
      setConfidenceScore(newConfidence)

      const nextQuestionObj = session.nextSimulatedQuestions[
        Math.floor(Math.random() * session.nextSimulatedQuestions.length)
      ]

<<<<<<< HEAD
=======
      const activeAgentName = selectedAgent?.name || 'JARVIS'

>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
      const aiMsg = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
<<<<<<< HEAD
        content: `Great response on context isolation! Let me evaluate your implementation depth.\n\n${nextQuestionObj.question}`,
        badge: isNextFollowUp ? "Follow-up Question" : `Question ${nextIndex}/10`,
        followUp: isNextFollowUp,
=======
        content: `[${activeAgentName}] Evaluated response depth.\n\n${nextQuestionObj.question}`,
        badge: `Question ${nextIndex}/10 • ${activeAgentName}`,
        followUp: false,
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
      }

      setMessages((prev) => [...prev, aiMsg])

<<<<<<< HEAD
      // Update session progress
=======
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
      setSession((prev) => ({
        ...prev,
        confidenceScore: newConfidence,
        currentQuestionIndex: nextIndex,
        insights: {
          ...prev.insights,
          questionsAsked: prev.insights.questionsAsked + 1,
<<<<<<< HEAD
          followUps: prev.insights.followUps + (isNextFollowUp ? 1 : 0)
        }
      }))
    }, 2200)
=======
        }
      }))
    }, 1800)
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
  }

  const toggleVoiceRecording = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false)
<<<<<<< HEAD
      // Simulate transcribed text
=======
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
      setInputMessage("MCP implements strict token authentication with JSON-RPC payloads over TLS or stdin streams...")
    } else {
      setIsRecordingVoice(true)
    }
  }

  return {
    interviewStatus,
<<<<<<< HEAD
    setInterviewStatus,
=======
    selectedAgent,
    setSelectedAgent,
    setInterviewStatus: (status) => {
      setRawStatus(status)
      if (status === 'IN_PROGRESS' && currentQuestionIndex === 0) {
        setCurrentQuestionIndex(1)
      } else if (status === 'COMPLETED') {
        setCurrentQuestionIndex(10)
      } else if (status === 'NOT_STARTED') {
        setCurrentQuestionIndex(0)
      }
    },
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
    startInterview,
    completeInterview,
    resetInterview,
    session,
    messages,
    isAiThinking,
    timerFormatted: formatTimer(timerSeconds),
    inputMessage,
    setInputMessage,
    handleSendMessage,
    isRecordingVoice,
    toggleVoiceRecording,
    isCodeModalOpen,
    setIsCodeModalOpen,
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,
<<<<<<< HEAD
    currentQuestionIndex,
    confidenceScore,
=======
    currentQuestionIndex: activeQuestionNumber,
    confidenceScore,
    questionScores,
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
  }
}

import { useState, useEffect } from 'react'
import { initialInterviewSession } from '../data/mockData'

const INTERVIEW_STORAGE_KEY = 'neuron_ai_interview_state'

function loadSavedInterviewState() {
  try {
    const raw = localStorage.getItem(INTERVIEW_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
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
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(() => saved?.timerSeconds || 0)
  const [isTimerRunning, setIsTimerRunning] = useState(() => saved?.interviewStatus === 'IN_PROGRESS')
  const [inputMessage, setInputMessage] = useState('')
  const [isRecordingVoice, setIsRecordingVoice] = useState(false)
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [confidenceScore, setConfidenceScore] = useState(() => saved?.confidenceScore || 72)

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
      }
      localStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify(stateToSave))
    } catch (e) {}
  }, [interviewStatus, activeQuestionNumber, timerSeconds, confidenceScore, messages])

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

  const startInterview = () => {
    setRawStatus('IN_PROGRESS')
    setIsTimerRunning(true)
    setTimerSeconds(0)
    setCurrentQuestionIndex(1)
    setConfidenceScore(72)
    setMessages(initialInterviewSession.messages)
    try {
      localStorage.removeItem(INTERVIEW_STORAGE_KEY)
    } catch (e) {}
  }

  const completeInterview = () => {
    setRawStatus('COMPLETED')
    setIsTimerRunning(false)
    setCurrentQuestionIndex(10)
  }

  const resetInterview = () => {
    setRawStatus('NOT_STARTED')
    setIsTimerRunning(false)
    setTimerSeconds(0)
    setCurrentQuestionIndex(0)
    setConfidenceScore(72)
    setMessages(initialInterviewSession.messages)
    try {
      localStorage.removeItem(INTERVIEW_STORAGE_KEY)
    } catch (e) {}
  }

  const handleSendMessage = (customText = null) => {
    const textToSend = customText || inputMessage
    if (!textToSend.trim()) return

    // Auto-activate interview if first message is sent
    if (interviewStatus === 'NOT_STARTED' || currentQuestionIndex === 0) {
      setRawStatus('IN_PROGRESS')
      setIsTimerRunning(true)
    }

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

    // Simulate AI thinking and question progression
    setTimeout(() => {
      setIsAiThinking(false)
      
      const current = currentQuestionIndex === 0 ? 1 : currentQuestionIndex
      const nextIndex = current + 1
      const isCompletedNow = nextIndex > 10

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
      const newConfidence = Math.min(98, Math.max(60, confidenceScore + Math.floor(Math.random() * 5) - 1))
      setConfidenceScore(newConfidence)

      const nextQuestionObj = session.nextSimulatedQuestions[
        Math.floor(Math.random() * session.nextSimulatedQuestions.length)
      ]

      const aiMsg = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `Great response! Let me evaluate your implementation depth.\n\n${nextQuestionObj.question}`,
        badge: `Question ${nextIndex}/10`,
        followUp: false,
      }

      setMessages((prev) => [...prev, aiMsg])

      setSession((prev) => ({
        ...prev,
        confidenceScore: newConfidence,
        currentQuestionIndex: nextIndex,
        insights: {
          ...prev.insights,
          questionsAsked: prev.insights.questionsAsked + 1,
        }
      }))
    }, 1800)
  }

  const toggleVoiceRecording = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false)
      setInputMessage("MCP implements strict token authentication with JSON-RPC payloads over TLS or stdin streams...")
    } else {
      setIsRecordingVoice(true)
    }
  }

  return {
    interviewStatus,
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
    currentQuestionIndex: activeQuestionNumber,
    confidenceScore,
  }
}

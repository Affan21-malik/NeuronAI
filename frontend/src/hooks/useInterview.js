import { useState, useEffect } from 'react'
import { initialInterviewSession } from '../data/mockData'

export function useInterview() {
  const [interviewStatus, setInterviewStatus] = useState('NOT_STARTED') // 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  const [session, setSession] = useState(initialInterviewSession)
  const [messages, setMessages] = useState(initialInterviewSession.messages)
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [isRecordingVoice, setIsRecordingVoice] = useState(false)
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1)
  const [confidenceScore, setConfidenceScore] = useState(72)

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
  }

  const handleSendMessage = (customText = null) => {
    const textToSend = customText || inputMessage
    if (!textToSend.trim()) return

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

    // Simulate AI thinking and dynamic follow-up generation
    setTimeout(() => {
      setIsAiThinking(false)
      
      const isNextFollowUp = Math.random() > 0.3
      const nextIndex = Math.min(currentQuestionIndex + (isNextFollowUp ? 0 : 1), 10)
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
        content: `Great response on context isolation! Let me evaluate your implementation depth.\n\n${nextQuestionObj.question}`,
        badge: isNextFollowUp ? "Follow-up Question" : `Question ${nextIndex}/10`,
        followUp: isNextFollowUp,
      }

      setMessages((prev) => [...prev, aiMsg])

      // Update session progress
      setSession((prev) => ({
        ...prev,
        confidenceScore: newConfidence,
        currentQuestionIndex: nextIndex,
        insights: {
          ...prev.insights,
          questionsAsked: prev.insights.questionsAsked + 1,
          followUps: prev.insights.followUps + (isNextFollowUp ? 1 : 0)
        }
      }))
    }, 2200)
  }

  const toggleVoiceRecording = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false)
      // Simulate transcribed text
      setInputMessage("MCP implements strict token authentication with JSON-RPC payloads over TLS or stdin streams...")
    } else {
      setIsRecordingVoice(true)
    }
  }

  return {
    interviewStatus,
    setInterviewStatus,
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
    currentQuestionIndex,
    confidenceScore,
  }
}

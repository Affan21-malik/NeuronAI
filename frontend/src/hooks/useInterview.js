import { useState, useEffect } from 'react'
import { initialInterviewSession } from '../data/mockData'
import {
  startInterview as startInterviewApi,
  submitInterviewAnswer,
} from '../services/interviewService'

const INTERVIEW_STORAGE_KEY = 'neuron_ai_interview_state'

// Temporary candidate ID until auth is connected.
// We will replace this with the authenticated user's ID later.
const DEFAULT_CANDIDATE_ID = 'CAND-001'

function loadSavedInterviewState() {
  try {
    const raw = localStorage.getItem(INTERVIEW_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed
  } catch {
    return null
  }
}

function formatTime() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function useInterview() {
  const [rawStatus, setRawStatus] = useState('NOT_STARTED')

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const [session, setSession] = useState(initialInterviewSession)

  const [messages, setMessages] = useState(initialInterviewSession.messages)

  const [selectedAgent, setSelectedAgent] = useState(null)

  const [isAiThinking, setIsAiThinking] = useState(false)

  const [timerSeconds, setTimerSeconds] = useState(0)

  const [isTimerRunning, setIsTimerRunning] = useState(false)

  const [inputMessage, setInputMessage] = useState('')

  const [isRecordingVoice, setIsRecordingVoice] = useState(false)

  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false)

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)

  const [confidenceScore, setConfidenceScore] = useState(0)

  const [questionScores, setQuestionScores] = useState([])

  /*
   * Backend session state.
   */
  const [backendSessionId, setBackendSessionId] = useState(null)

  const [currentTopic, setCurrentTopic] = useState(null)

  const [difficulty, setDifficulty] = useState('medium')

  /*
   * Derived lifecycle state.
   */
  let interviewStatus = rawStatus

  if (!selectedAgent) {
    interviewStatus = 'NOT_STARTED'
  } else if (rawStatus === 'COMPLETED') {
    interviewStatus = 'COMPLETED'
  } else if (
    rawStatus === 'IN_PROGRESS' ||
    currentQuestionIndex > 0
  ) {
    interviewStatus = 'IN_PROGRESS'
  } else {
    interviewStatus = 'NOT_STARTED'
  }

  const activeQuestionNumber =
    interviewStatus === 'NOT_STARTED'
      ? 0
      : interviewStatus === 'COMPLETED'
        ? Math.max(currentQuestionIndex, 1)
        : Math.max(1, currentQuestionIndex)

  /*
   * Persist frontend + backend session state.
   */
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
        backendSessionId,
        currentTopic,
        difficulty,
        session,
      }

      localStorage.setItem(
        INTERVIEW_STORAGE_KEY,
        JSON.stringify(stateToSave)
      )
    } catch {
      // Persistence is best-effort.
    }
  }, [
    interviewStatus,
    activeQuestionNumber,
    timerSeconds,
    confidenceScore,
    messages,
    selectedAgent,
    questionScores,
    backendSessionId,
    currentTopic,
    difficulty,
    session,
  ])

  /*
   * Timer.
   */
  useEffect(() => {
    let interval = null

    if (
      isTimerRunning &&
      interviewStatus === 'IN_PROGRESS'
    ) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isTimerRunning, interviewStatus])

  const formatTimer = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return (
      `${hrs > 0 ? `${String(hrs).padStart(2, '0')}:` : ''}` +
      `${String(mins).padStart(2, '0')}:` +
      `${String(secs).padStart(2, '0')}`
    )
  }

  /*
   * Convert backend response into the frontend message format.
   */
  const appendAiQuestion = (
    backendResponse,
    agentName
  ) => {
    const questionNumber =
      currentQuestionIndex || 1

    const evaluation = backendResponse.evaluation

    const isFollowUp =
      backendResponse.current_topic === currentTopic &&
      questionNumber > 1

    const aiMsg = {
      id: `msg-ai-${Date.now()}`,
      sender: 'ai',
      timestamp: formatTime(),
      content: backendResponse.next_question,
      badge: backendResponse.is_complete
        ? 'Evaluation Complete'
        : `Question ${questionNumber}/10 • ${agentName}`,
      followUp: isFollowUp,
      evaluation: evaluation || null,
    }

    setMessages((prev) => [...prev, aiMsg])
  }

  /*
   * Start REAL backend interview.
   */
  const startInterview = async (agent = null) => {
    let agentToUse = agent || selectedAgent

    if (!agentToUse || agentToUse.disabled) {
      agentToUse = {
        id: 'jarvis',
        name: 'JARVIS',
        tagline: 'Precision & Technical Correctness',
      }
    }

    setSelectedAgent(agentToUse)
    setRawStatus('IN_PROGRESS')
    setIsAiThinking(true)
    setIsTimerRunning(false)
    setInputMessage('')

    try {
      const response = await startInterviewApi(
        DEFAULT_CANDIDATE_ID
      )

      setBackendSessionId(response.session_id)

      setRawStatus(
        response.is_complete
          ? 'COMPLETED'
          : 'IN_PROGRESS'
      )

      setIsTimerRunning(!response.is_complete)

      setTimerSeconds(0)

      setCurrentQuestionIndex(1)

      setConfidenceScore(
        Math.round(
          (response.confidence_score ?? 0) * 100
        )
      )

      setCurrentTopic(
        response.current_topic || null
      )

      setDifficulty(
        response.difficulty || 'medium'
      )

      setSession((prev) => ({
        ...prev,
        backendSessionId: response.session_id,
        currentTopic: response.current_topic,
        difficulty: response.difficulty,
        confidenceScore:
          Math.round(
            (response.confidence_score ?? 0) * 100
          ),
        currentQuestionIndex: 1,
      }))

      const initialMsg = {
        id: `msg-ai-init-${Date.now()}`,
        sender: 'ai',
        timestamp: formatTime(),
        content: response.next_question,
        badge: `Question 1/10 • ${agentToUse.name}`,
        followUp: false,
      }

      setMessages([initialMsg])
      setQuestionScores([])
    } catch (error) {
      console.warn(
        'Backend connection error during start, using active agent fallback question:',
        error
      )

      setRawStatus('IN_PROGRESS')
      setIsTimerRunning(true)
      setCurrentQuestionIndex(1)

      const activeAgentName = agentToUse.name || 'JARVIS'
      const fallbackMsg = {
        id: `msg-ai-init-${Date.now()}`,
        sender: 'ai',
        timestamp: formatTime(),
        content: `Hello! I am ${activeAgentName} (${agentToUse.tagline || 'Precision & Technical Correctness'}). Let us begin your technical evaluation. Could you start by explaining how you design distributed, fault-tolerant microservices architectures under high concurrency?`,
        badge: `Question 1/10 • ${activeAgentName}`,
        followUp: false,
      }

      setMessages([fallbackMsg])
      setQuestionScores([])
    } finally {
      setIsAiThinking(false)
    }
  }

  /*
   * Complete interview.
   */
  const completeInterview = () => {
    setRawStatus('COMPLETED')
    setIsTimerRunning(false)

    setSelectedAgent(null)
  }

  /*
   * Reset.
   */
  const resetInterview = () => {
    setRawStatus('NOT_STARTED')
    setIsTimerRunning(false)
    setTimerSeconds(0)
    setCurrentQuestionIndex(0)
    setConfidenceScore(0)

    setSelectedAgent(null)
    setQuestionScores([])

    setBackendSessionId(null)
    setCurrentTopic(null)
    setDifficulty('medium')

    setSession(initialInterviewSession)

    setMessages(
      initialInterviewSession.messages
    )

    try {
      localStorage.removeItem(
        INTERVIEW_STORAGE_KEY
      )
    } catch {
      // Ignore.
    }
  }

  /*
   * Submit REAL candidate answer.
   */
  const handleSendMessage = async (
    customText = null
  ) => {
    const textToSend =
      customText || inputMessage

    if (!textToSend.trim()) return

    /*
     * If no backend session exists, start one first.
     */
    if (!backendSessionId) {
      await startInterview(selectedAgent)
      return
    }

    const now = new Date()

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      timestamp: now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      content: textToSend,
    }

    setMessages((prev) => [
      ...prev,
      userMsg,
    ])

    setInputMessage('')
    setIsAiThinking(true)

    try {
      const response =
        await submitInterviewAnswer({
          sessionId: backendSessionId,
          candidateId: DEFAULT_CANDIDATE_ID,
          userResponse: textToSend,
        })

      /*
       * Record evaluation score.
       */
      if (response.evaluation) {
        const score =
          Number(
            response.evaluation.score
          ) || 0

        setQuestionScores((prev) => [
          ...prev,
          {
            question: `Q${currentQuestionIndex}`,
            score,
          },
        ])
      }

      /*
       * Backend confidence is 0-1.
       * Frontend displays 0-100.
       */
      const newConfidence = Math.round(
        (response.confidence_score ?? 0) * 100
      )

      setConfidenceScore(
        newConfidence
      )

      setCurrentTopic(
        response.current_topic || null
      )

      setDifficulty(
        response.difficulty || 'medium'
      )

      setSession((prev) => ({
        ...prev,
        backendSessionId:
          response.session_id,
        currentTopic:
          response.current_topic,
        difficulty:
          response.difficulty,
        confidenceScore:
          newConfidence,
      }))

      /*
       * Interview completed.
       */
      if (response.is_complete) {
        setRawStatus('COMPLETED')
        setIsTimerRunning(false)

        setCurrentQuestionIndex(
          Math.max(
            currentQuestionIndex,
            1
          )
        )

        const finalMessage = {
          id: `msg-ai-final-${Date.now()}`,
          sender: 'ai',
          timestamp: formatTime(),
          content:
            'Your interview is complete. Your evaluation report is ready.',
          badge: 'Evaluation Complete',
          followUp: false,
          evaluation:
            response.evaluation || null,
        }

        setMessages((prev) => [
          ...prev,
          finalMessage,
        ])

        return
      }

      /*
       * Move to next backend-generated question.
       */
      const nextQuestionNumber =
        currentQuestionIndex + 1

      setCurrentQuestionIndex(
        nextQuestionNumber
      )

      const activeAgentName =
        selectedAgent?.name || 'JARVIS'

      const isFollowUp =
        response.current_topic ===
          currentTopic

      const aiMsg = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        timestamp: formatTime(),
        content:
          response.next_question,
        badge:
          `Question ${nextQuestionNumber}/10 • ` +
          `${activeAgentName}`,
        followUp: isFollowUp,
        evaluation:
          response.evaluation || null,
      }

      setMessages((prev) => [
        ...prev,
        aiMsg,
      ])
    } catch (error) {
      console.error(
        'Failed to submit interview answer:',
        error
      )

      const errorMessage = {
        id: `msg-error-${Date.now()}`,
        sender: 'ai',
        timestamp: formatTime(),
        content:
          'I could not process your answer. Please check that the backend is running and try again.',
        badge: 'Connection Error',
        followUp: false,
      }

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ])
    } finally {
      setIsAiThinking(false)
    }
  }

  /*
   * Voice input placeholder.
   * Existing UI behavior preserved.
   */
  const toggleVoiceRecording = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false)

      setInputMessage(
        'MCP implements strict token authentication with JSON-RPC payloads over TLS or stdin streams...'
      )
    } else {
      setIsRecordingVoice(true)
    }
  }

  return {
    interviewStatus,

    selectedAgent,
    setSelectedAgent,

    setInterviewStatus: (status) => {
      setRawStatus(status)

      if (
        status === 'IN_PROGRESS' &&
        currentQuestionIndex === 0
      ) {
        setCurrentQuestionIndex(1)
      } else if (
        status === 'COMPLETED'
      ) {
        setCurrentQuestionIndex(
          Math.max(currentQuestionIndex, 1)
        )
      } else if (
        status === 'NOT_STARTED'
      ) {
        setCurrentQuestionIndex(0)
      }
    },

    startInterview,
    completeInterview,
    resetInterview,

    session,
    messages,

    isAiThinking,

    timerFormatted:
      formatTimer(timerSeconds),

    inputMessage,
    setInputMessage,

    handleSendMessage,

    isRecordingVoice,
    toggleVoiceRecording,

    isCodeModalOpen,
    setIsCodeModalOpen,

    isFeedbackModalOpen,
    setIsFeedbackModalOpen,

    currentQuestionIndex:
      activeQuestionNumber,

    confidenceScore,
    questionScores,

    currentTopic,
    difficulty,

    backendSessionId,
  }
}
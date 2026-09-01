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

  const [isFollowUpActive, setIsFollowUpActive] = useState(false)

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
   * Helper to compute dynamic Radar chart dataset from knowledge map
   */
  const computeRadarData = (knowledgeMap = {}, currentTopicName = '') => {
    const topics = Object.keys(knowledgeMap)
    if (topics.length === 0) {
      return [
        { subject: currentTopicName || 'Architecture', score: 85, fullMark: 100 },
        { subject: 'System Design', score: 80, fullMark: 100 },
        { subject: 'Data Foundations', score: 75, fullMark: 100 },
        { subject: 'Security & Auth', score: 90, fullMark: 100 },
        { subject: 'Performance Ops', score: 70, fullMark: 100 },
      ]
    }
    return topics.map((t) => {
      const val = Number(knowledgeMap[t]) || 0
      const score = val > 1 ? val : Math.round(val * 100)
      return {
        subject: t.length > 18 ? `${t.slice(0, 16)}..` : t,
        score: Math.min(100, Math.max(10, score)),
        fullMark: 100,
      }
    })
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

    let activeSessionId = null

    try {
      const response = await startInterviewApi(DEFAULT_CANDIDATE_ID, agentToUse.id)

      activeSessionId = response.session_id
      setBackendSessionId(response.session_id)
      setRawStatus(response.is_complete ? 'COMPLETED' : 'IN_PROGRESS')
      setIsTimerRunning(!response.is_complete)
      setTimerSeconds(0)
      setCurrentQuestionIndex(1)

      const confidencePct = Math.round((response.confidence_score ?? 0) * 100)
      setConfidenceScore(confidencePct)
      setCurrentTopic(response.current_topic || 'Technical Interview')
      setDifficulty(response.difficulty || 'medium')

      setSession((prev) => ({
        ...prev,
        title: response.current_topic ? `Interview: ${response.current_topic}` : prev.title,
        topic: response.current_topic || prev.topic,
        difficulty: response.difficulty || 'medium',
        confidenceScore: confidencePct,
        backendSessionId: response.session_id,
        currentQuestionIndex: 1,
        radarData: computeRadarData(response.knowledge_map, response.current_topic),
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
      return activeSessionId
    } catch (error) {
      console.warn(
        'Backend connection warning during start, initializing local state:',
        error
      )
      const fallbackSessionId = `session-local-${Date.now()}`
      setBackendSessionId(fallbackSessionId)
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
      return fallbackSessionId
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
    setMessages(initialInterviewSession.messages)

    try {
      localStorage.removeItem(INTERVIEW_STORAGE_KEY)
    } catch {
      // Ignore.
    }
  }

  /*
   * Submit REAL candidate answer.
   */
  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputMessage

    if (!textToSend.trim()) return

    let currentSessionId = backendSessionId

    /*
     * If no backend session exists, start one first.
     */
    if (!currentSessionId) {
      currentSessionId = await startInterview(selectedAgent)
      if (!currentSessionId) return
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

    setMessages((prev) => [...prev, userMsg])
    setInputMessage('')
    setIsAiThinking(true)

    try {
      const response = await submitInterviewAnswer({
        sessionId: currentSessionId,
        candidateId: DEFAULT_CANDIDATE_ID,
        userResponse: textToSend,
        agentId: selectedAgent?.id || 'jarvis',
      })

      /*
       * Record evaluation score for current main question (including follow-ups).
       */
      const evaluatedQuestionNum = currentQuestionIndex
      let turnScore = 0

      if (response.evaluation) {
        turnScore = Math.round(Number(response.evaluation.score) || 0)
        const qKey = `Q${evaluatedQuestionNum}`

        setQuestionScores((prev) => {
          const existingIdx = prev.findIndex((item) => item.question === qKey)
          if (existingIdx >= 0) {
            const updated = [...prev]
            updated[existingIdx] = { question: qKey, score: turnScore }
            return updated
          }
          return [...prev, { question: qKey, score: turnScore }]
        })
      }

      /*
       * Backend confidence is 0-1.
       * Frontend displays 0-100.
       */
      const newConfidence = Math.round((response.confidence_score ?? 0) * 100)

      setConfidenceScore(newConfidence)
      setCurrentTopic(response.current_topic || currentTopic)
      setDifficulty(response.difficulty || difficulty)

      setSession((prev) => ({
        ...prev,
        backendSessionId: response.session_id,
        title: response.current_topic ? `Topic: ${response.current_topic}` : prev.title,
        topic: response.current_topic || prev.topic,
        difficulty: response.difficulty || prev.difficulty,
        confidenceScore: newConfidence,
        radarData: computeRadarData(response.knowledge_map, response.current_topic || prev.topic),
      }))

      const activeAgentName = selectedAgent?.name || 'JARVIS'

      /*
       * 1. Append dedicated Evaluation message for the just-evaluated answer
       */
      if (response.evaluation) {
        const evalBadge = wasFollowUp
          ? `Question ${evaluatedQuestionNum}/10 Follow-up Evaluation`
          : `Question ${evaluatedQuestionNum}/10 Evaluation`

        const evalMsg = {
          id: `msg-eval-${Date.now()}`,
          sender: 'ai',
          type: 'evaluation',
          questionNumber: evaluatedQuestionNum,
          timestamp: formatTime(),
          badge: evalBadge,
          evaluation: response.evaluation,
        }
        setMessages((prev) => [...prev, evalMsg])
      }

      /*
       * Interview completed.
       */
      if (response.is_complete) {
        setRawStatus('COMPLETED')
        setIsTimerRunning(false)
        setIsFollowUpActive(false)

        const finalMessage = {
          id: `msg-ai-final-${Date.now()}`,
          sender: 'ai',
          type: 'completion',
          timestamp: formatTime(),
          content: 'Your technical interview is complete! Your final evaluation and breakdown have been generated.',
          badge: 'Evaluation Complete',
          followUp: false,
        }

        setMessages((prev) => [...prev, finalMessage])
        return
      }

      /*
       * 2. Determine if backend generated a follow-up on current question vs new numbered question.
       * Maximum of 1 follow-up is allowed per main question.
       */
      const isFollowUpRequested = Boolean(
        !wasFollowUp &&
        (response.is_followup || (response.current_topic === currentTopic && response.evaluation && response.evaluation.score < 70))
      )

      if (isFollowUpRequested) {
        // Activate ONE follow-up for the current main question. Main question number DOES NOT increment.
        setIsFollowUpActive(true)

        const followUpMsg = {
          id: `msg-ai-q-${Date.now()}`,
          sender: 'ai',
          type: 'question',
          questionNumber: evaluatedQuestionNum,
          timestamp: formatTime(),
          content: response.next_question,
          badge: `Question ${evaluatedQuestionNum}/10 Follow-up • ${activeAgentName}`,
          followUp: true,
        }
        setMessages((prev) => [...prev, followUpMsg])
      } else {
        // Transition to next main question. Reset followUpActive to false.
        setIsFollowUpActive(false)
        const nextQuestionNumber = evaluatedQuestionNum + 1
        setCurrentQuestionIndex(nextQuestionNumber)

        const nextMsg = {
          id: `msg-ai-q-${Date.now()}`,
          sender: 'ai',
          type: 'question',
          questionNumber: nextQuestionNumber,
          timestamp: formatTime(),
          content: response.next_question,
          badge: `Question ${nextQuestionNumber}/10 • ${activeAgentName}`,
          followUp: false,
        }
        setMessages((prev) => [...prev, nextMsg])
      }
    } catch (error) {
      console.error('Failed to submit interview answer:', error)

      const errorMessage = {
        id: `msg-error-${Date.now()}`,
        sender: 'ai',
        timestamp: formatTime(),
        content: `Evaluation Warning: ${error.message || 'Could not process answer'}. Please ensure the backend server is running at http://127.0.0.1:8000 and try again.`,
        badge: 'Connection Error',
        followUp: false,
      }

      setMessages((prev) => [...prev, errorMessage])
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
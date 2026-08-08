import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import LandingPage from '../pages/LandingPage'
import DashboardPage from '../pages/DashboardPage'
import InterviewPage from '../pages/InterviewPage'
import FinalReportPage from '../pages/FinalReportPage'
import SkillGapPage from '../pages/SkillGapPage'
import KnowledgeMapPage from '../pages/KnowledgeMapPage'
import ReportsPage from '../pages/ReportsPage'
import HistoryPage from '../pages/HistoryPage'
import AuthPage from '../pages/auth/AuthPage'
import FeedbackModal from '../components/FeedbackModal'
<<<<<<< HEAD
=======
import CustomCursor from '../components/CustomCursor'
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
import { AuthProvider } from '../context/AuthContext'
import { useAuth } from '../hooks/useAuth'
import { useInterview } from '../hooks/useInterview'
import { Cpu } from 'lucide-react'

function AppLayoutContent() {
  const { isAuthenticated, isLoading, authStep } = useAuth()
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState('dashboard')
=======
  // Session persistence: restored authenticated sessions open Dashboard directly
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const user = localStorage.getItem('neuron_ai_auth_user')
      const session = localStorage.getItem('neuron_ai_session')
      if (user && session) {
        return 'dashboard'
      }
    } catch (e) {}
    return 'landing'
  })
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

  // Central interview session hook
  const interviewHook = useInterview()
  const { interviewStatus, startInterview, completeInterview, resetInterview } = interviewHook

  const handleStartInterviewAction = () => {
<<<<<<< HEAD
    startInterview()
    setActiveTab('interview')
  }

  const handleEndInterviewAction = () => {
    completeInterview()
    setActiveTab('report-details')
  }

=======
    if (!isAuthenticated) {
      setActiveTab('auth')
      return
    }
    // Always reset so agent selection appears fresh
    resetInterview()
    setActiveTab('interview')
  }

  const handleGoToDashboardAction = () => {
    if (!isAuthenticated) {
      setActiveTab('auth')
      return
    }
    setActiveTab('dashboard')
  }

  const handleEndInterviewAction = () => {
    if (interviewHook.currentQuestionIndex >= 10) {
      completeInterview()
      setActiveTab('report-details')
    } else {
      // Exited mid-interview before completing Q10 -> Incomplete / abandoned
      resetInterview()
      setActiveTab('dashboard')
    }
  }

  const handleSelectTab = (tabId) => {
    if (tabId === 'landing' && isAuthenticated) {
      setActiveTab('dashboard')
      return
    }
    const publicTabs = ['landing', 'auth']
    if (!publicTabs.includes(tabId) && !isAuthenticated) {
      setActiveTab('auth')
      return
    }
    // Navigating to interview tab from anywhere always resets
    // so the agent selection screen appears fresh for a new interview.
    if (tabId === 'interview') {
      resetInterview()
    }
    setActiveTab(tabId)
  }

  // Sync activeTab to dashboard when user is authenticated, or landing on logout
  React.useEffect(() => {
    if (isAuthenticated && authStep === 'DASHBOARD') {
      if (activeTab === 'landing' || activeTab === 'auth') {
        setActiveTab('dashboard')
      }
    } else if (!isAuthenticated) {
      if (activeTab !== 'auth') {
        setActiveTab('landing')
      }
    }
  }, [isAuthenticated, authStep, activeTab])

>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
  // 1. Initial Auth Loading Spinner State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center select-none">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-[1px] shadow-[0_0_30px_rgba(99,102,241,0.6)] mb-4 animate-bounce">
          <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
            <Cpu className="w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
        </div>
        <h2 className="font-bold text-lg text-white mb-1">NeuronAI</h2>
        <p className="text-xs text-slate-400 font-mono animate-pulse">Initializing Secure AI Telemetry...</p>
      </div>
    )
  }

<<<<<<< HEAD
  // 2. Strict Unauthenticated Route Protection Guard
  const isAuthScreen = !isAuthenticated || authStep !== 'DASHBOARD'

  if (isAuthScreen) {
    return <AuthPage />
  }

  // 3. Authenticated App Layout
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        interviewStatus={interviewStatus}
=======
  // Requirement 6: Render AuthPage when user explicitly chooses Auth or tries to access protected tab while unauthenticated
  const isAuthTab = (activeTab === 'auth' && (!isAuthenticated || authStep !== 'DASHBOARD')) || (!isAuthenticated && activeTab !== 'landing')

  if (isAuthTab) {
    return <AuthPage />
  }

  // Authenticated or Landing App Layout
  return (
    <div className={`bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white ${
      activeTab === 'landing' ? 'min-h-screen overflow-x-hidden' : 'h-screen overflow-hidden'
    }`}>
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        interviewStatus={interviewStatus}
        currentQuestionIndex={interviewHook.currentQuestionIndex}
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
        onStartInterview={handleStartInterviewAction}
        onCompleteInterview={completeInterview}
        onResetInterview={resetInterview}
      />

      {/* Main View Area */}
      {activeTab === 'landing' ? (
<<<<<<< HEAD
        <LandingPage 
          onLaunchInterview={handleStartInterviewAction}
          onGoToDashboard={() => setActiveTab('dashboard')}
        />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Sidebar */}
          <Sidebar 
            activeTab={activeTab === 'report-details' ? 'report' : activeTab}
            setActiveTab={setActiveTab}
=======
        <div className="flex-1 overflow-y-auto">
          <LandingPage 
            onLaunchInterview={handleStartInterviewAction}
            onGoToDashboard={handleGoToDashboardAction}
          />
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden h-[calc(100vh-65px)]">
          
          {/* Requirement 4: Left Sidebar (Fixed to Viewport) */}
          <Sidebar 
            activeTab={activeTab === 'report-details' ? 'report' : activeTab}
            setActiveTab={handleSelectTab}
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
            onStartNewInterview={handleStartInterviewAction}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
            interviewStatus={interviewStatus}
          />

<<<<<<< HEAD
          {/* Dynamic Content Canvas */}
          <main className="flex-1 overflow-y-auto bg-slate-950/60 bg-grid-pattern">
=======
          {/* Dynamic Content Canvas — Independent Vertical Scroll */}
          <main className="flex-1 h-full overflow-y-auto bg-slate-950/60 bg-grid-pattern">

>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
            {activeTab === 'dashboard' && (
              <DashboardPage 
                interviewStatus={interviewStatus}
                onStartInterview={handleStartInterviewAction}
<<<<<<< HEAD
                onViewReport={() => setActiveTab('report-details')}
                onViewSkillGap={() => setActiveTab('skillgap')}
                onViewKnowledgeMap={() => setActiveTab('knowledge')}
=======
                onViewReport={() => handleSelectTab('report-details')}
                onViewSkillGap={() => handleSelectTab('skillgap')}
                onViewKnowledgeMap={() => handleSelectTab('knowledge')}
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
              />
            )}

            {activeTab === 'interview' && (
              <InterviewPage 
                interviewHook={interviewHook}
                onEndInterview={handleEndInterviewAction}
              />
            )}

            {activeTab === 'report' && (
              <ReportsPage 
                interviewStatus={interviewStatus}
                onStartInterview={handleStartInterviewAction}
<<<<<<< HEAD
                onViewReportDetails={() => setActiveTab('report-details')}
                onOpenFeedback={() => setIsFeedbackOpen(true)}
=======
                onViewReportDetails={() => handleSelectTab('report-details')}
                onOpenFeedback={() => setIsFeedbackOpen(true)}
                selectedAgent={interviewHook.selectedAgent}
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
              />
            )}

            {activeTab === 'report-details' && (
              <FinalReportPage 
                onOpenFeedback={() => setIsFeedbackOpen(true)}
                onStartNewInterview={handleStartInterviewAction}
                interviewStatus={interviewStatus}
<<<<<<< HEAD
=======
                selectedAgent={interviewHook.selectedAgent}
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
              />
            )}

            {activeTab === 'knowledge' && (
              <KnowledgeMapPage 
                interviewStatus={interviewStatus}
                onStartInterview={handleStartInterviewAction}
              />
            )}

            {activeTab === 'skillgap' && (
              <SkillGapPage 
                interviewStatus={interviewStatus}
                onStartInterview={handleStartInterviewAction}
              />
            )}

            {activeTab === 'history' && (
              <HistoryPage 
<<<<<<< HEAD
                onViewReport={() => setActiveTab('report-details')}
=======
                onViewReport={() => handleSelectTab('report-details')}
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
                onStartInterview={handleStartInterviewAction}
                interviewStatus={interviewStatus}
              />
            )}
          </main>

        </div>
      )}

      {/* Bonus Interview Feedback Dialog */}
      <FeedbackModal 
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

    </div>
  )
}

export default function AppLayout() {
  return (
    <AuthProvider>
<<<<<<< HEAD
=======
      <CustomCursor />
>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86
      <AppLayoutContent />
    </AuthProvider>
  )
}
<<<<<<< HEAD
=======

>>>>>>> 6fa68a3bfb443ac86feb59b06b67f69e8efd3c86

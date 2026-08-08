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
import { AuthProvider } from '../context/AuthContext'
import { useAuth } from '../hooks/useAuth'
import { useInterview } from '../hooks/useInterview'
import { Cpu } from 'lucide-react'

function AppLayoutContent() {
  const { isAuthenticated, isLoading, authStep } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

  // Central interview session hook
  const interviewHook = useInterview()
  const { interviewStatus, startInterview, completeInterview, resetInterview } = interviewHook

  const handleStartInterviewAction = () => {
    startInterview()
    setActiveTab('interview')
  }

  const handleEndInterviewAction = () => {
    completeInterview()
    setActiveTab('report-details')
  }

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
        onStartInterview={handleStartInterviewAction}
        onCompleteInterview={completeInterview}
        onResetInterview={resetInterview}
      />

      {/* Main View Area */}
      {activeTab === 'landing' ? (
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
            onStartNewInterview={handleStartInterviewAction}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
            interviewStatus={interviewStatus}
          />

          {/* Dynamic Content Canvas */}
          <main className="flex-1 overflow-y-auto bg-slate-950/60 bg-grid-pattern">
            {activeTab === 'dashboard' && (
              <DashboardPage 
                interviewStatus={interviewStatus}
                onStartInterview={handleStartInterviewAction}
                onViewReport={() => setActiveTab('report-details')}
                onViewSkillGap={() => setActiveTab('skillgap')}
                onViewKnowledgeMap={() => setActiveTab('knowledge')}
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
                onViewReportDetails={() => setActiveTab('report-details')}
                onOpenFeedback={() => setIsFeedbackOpen(true)}
              />
            )}

            {activeTab === 'report-details' && (
              <FinalReportPage 
                onOpenFeedback={() => setIsFeedbackOpen(true)}
                onStartNewInterview={handleStartInterviewAction}
                interviewStatus={interviewStatus}
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
                onViewReport={() => setActiveTab('report-details')}
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
      <AppLayoutContent />
    </AuthProvider>
  )
}

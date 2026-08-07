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
import FeedbackModal from '../components/FeedbackModal'
import { useInterview } from '../hooks/useInterview'

export default function AppLayout() {
  const [activeTab, setActiveTab] = useState('landing')
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

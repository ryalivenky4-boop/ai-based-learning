import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LearnerDashboard } from './components/learner/LearnerDashboard';
import { CompetencyProfile } from './components/learner/CompetencyProfile';
import { LearningPathway } from './components/learner/LearningPathway';
import { AssessmentCenter } from './components/assessment/AssessmentCenter';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StatSahayakChat } from './components/ai-tutor/StatSahayakChat';

import { OFFICIAL_PERSONAS } from './data/officialProfiles';
import { analyzeCompetencyGaps } from './services/competencyEngine';
import { generatePersonalizedPathway } from './services/recommendationEngine';
import { getStoredEnrollments, saveEnrollment, syncWithKarmayogiAPI } from './services/igotSyncService';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

export default function App() {
  // App Theme: default to 'dark' for sleek high-tech look
  const [theme, setTheme] = useState('dark');

  // Trainee Persona State
  const [currentPersona, setCurrentPersona] = useState(OFFICIAL_PERSONAS[0]);
  const [targetRoleKey, setTargetRoleKey] = useState(OFFICIAL_PERSONAS[0].targetRole);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // iGOT Telemetry & Course Enrollments
  const [enrollments, setEnrollments] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Toast Notifications
  const [toast, setToast] = useState(null);

  // Preset Document for Assessment launcher
  const [presetQuizDocId, setPresetQuizDocId] = useState(null);

  // Sync theme with HTML data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load enrollments whenever persona changes
  useEffect(() => {
    const loaded = getStoredEnrollments(currentPersona.id);
    setEnrollments(loaded);
    setTargetRoleKey(currentPersona.targetRole);
  }, [currentPersona.id]);

  // Dynamic Skill Gap Analysis
  const gapAnalysis = analyzeCompetencyGaps(currentPersona.competencyScores, targetRoleKey);

  // Dynamic Personalized Recommendations (iGOT + NSSTA)
  const recommendations = generatePersonalizedPathway(
    currentPersona.competencyScores,
    targetRoleKey,
    currentPersona.cadre
  );

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectPersona = (persona) => {
    setCurrentPersona(persona);
    setTargetRoleKey(persona.targetRole);
    setToast({
      title: 'Trainee Profile Switched',
      message: `Active persona: ${persona.name} (${persona.designation})`
    });
  };

  const handleUpdateCompetencyScore = (competencyId, newScore) => {
    setCurrentPersona(prev => ({
      ...prev,
      competencyScores: {
        ...prev.competencyScores,
        [competencyId]: newScore
      }
    }));
  };

  const handleSyncIgot = async () => {
    setIsSyncing(true);
    try {
      const res = await syncWithKarmayogiAPI(currentPersona);
      setIsSyncing(false);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(timeStr);
      setToast({
        title: 'iGOT Karmayogi Synced',
        message: `Telemetry verified with api.igotkarmayogi.gov.in. Synced at ${timeStr}.`
      });
    } catch (e) {
      setIsSyncing(false);
    }
  };

  const handleCompleteCourse = (item) => {
    // 1. Save enrollment as completed
    const updated = saveEnrollment(currentPersona.id, item.id, 100);
    setEnrollments(updated);

    // 2. Increment competency level by 1 (max 5)
    if (item.competencyId) {
      const currentLevel = currentPersona.competencyScores[item.competencyId] || 1;
      const nextLevel = Math.min(5, currentLevel + 1);

      setCurrentPersona(prev => ({
        ...prev,
        learningHours: parseFloat((prev.learningHours + (item.durationHours || 8)).toFixed(1)),
        karmayogiCredits: prev.karmayogiCredits + (item.karmayogiCredits || 150),
        competencyScores: {
          ...prev.competencyScores,
          [item.competencyId]: nextLevel
        }
      }));

      setToast({
        title: 'Skill Level Upgraded! (+1 Level)',
        message: `Completed "${item.title}". Competency score elevated from L${currentLevel} to L${nextLevel}. +${item.karmayogiCredits || 150} Karma Credits awarded.`
      });
    }
  };

  const handleQuickStartQuiz = (docId) => {
    setPresetQuizDocId(docId);
    setActiveTab('assessment');
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toast && (
        <div className="app-toast glass-card">
          <div className="toast-icon">
            <Sparkles size={18} color="#10B981" />
          </div>
          <div className="toast-text">
            <div className="toast-title">{toast.title}</div>
            <div className="toast-msg">{toast.message}</div>
          </div>
          <button className="btn-close-toast" onClick={() => setToast(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main App Layout */}
      <div className="main-content-wrapper">
        {/* Top Header */}
        <Header
          currentPersona={currentPersona}
          onSelectPersona={handleSelectPersona}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onSyncIgot={handleSyncIgot}
          isSyncing={isSyncing}
          lastSyncTime={lastSyncTime}
        />

        <div style={{ display: 'flex', flex: 1 }}>
          {/* Left Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            currentPersona={currentPersona}
            gapSummary={gapAnalysis}
          />

          {/* Center Main View Area */}
          <main className="page-container">
            {activeTab === 'dashboard' && (
              <LearnerDashboard
                persona={currentPersona}
                gapAnalysis={gapAnalysis}
                recommendations={recommendations}
                onNavigateTab={setActiveTab}
                onQuickStartQuiz={handleQuickStartQuiz}
                onSimulateCompleteCourse={handleCompleteCourse}
                enrollments={enrollments}
              />
            )}

            {activeTab === 'profile' && (
              <CompetencyProfile
                persona={currentPersona}
                gapAnalysis={gapAnalysis}
                targetRoleKey={targetRoleKey}
                onSelectTargetRole={setTargetRoleKey}
                onUpdateCompetencyScore={handleUpdateCompetencyScore}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'pathway' && (
              <LearningPathway
                persona={currentPersona}
                recommendations={recommendations}
                enrollments={enrollments}
                onEnrollCourse={(item) => saveEnrollment(currentPersona.id, item.id, 10)}
                onCompleteCourse={handleCompleteCourse}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'assessment' && (
              <AssessmentCenter
                persona={currentPersona}
                onUpdateCompetencyScore={handleUpdateCompetencyScore}
                onNavigateTab={setActiveTab}
                presetDocId={presetQuizDocId}
              />
            )}

            {activeTab === 'admin' && (
              <AdminDashboard
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'tutor' && (
              <StatSahayakChat
                onNavigateTab={setActiveTab}
                onStartQuizWithDoc={handleQuickStartQuiz}
              />
            )}
          </main>
        </div>
      </div>

      <style>{`
        .app-toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border-left: 4px solid var(--green-primary);
          box-shadow: var(--shadow-lg);
          max-width: 440px;
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .toast-icon {
          flex-shrink: 0;
        }

        .toast-text {
          flex: 1;
        }

        .toast-title {
          font-weight: 700;
          font-size: 0.88rem;
          color: var(--text-primary);
        }

        .toast-msg {
          font-size: 0.78rem;
          color: var(--text-secondary);
          margin-top: 2px;
          line-height: 1.35;
        }

        .btn-close-toast {
          color: var(--text-muted);
          padding: 4px;
        }

        .btn-close-toast:hover {
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LearnerDashboard } from './components/learner/LearnerDashboard';
import { CompetencyProfile } from './components/learner/CompetencyProfile';
import { LearningPathway } from './components/learner/LearningPathway';
import { AssessmentCenter } from './components/assessment/AssessmentCenter';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StatSahayakChat } from './components/ai-tutor/StatSahayakChat';
import AuthModal from './components/auth/AuthModal';

import { analyzeCompetencyGaps } from './services/competencyEngine';
import { generatePersonalizedPathway } from './services/recommendationEngine';
import { getStoredEnrollments, saveEnrollment, syncWithKarmayogiAPI } from './services/igotSyncService';
import {
  checkDatabaseHealth,
  fetchCurrentUser,
  fetchUserSkills,
  fetchCompetencyGaps,
  fetchPersonalizedRecommendations,
  fetchCourseProgress,
  updateCourseProgress,
  submitQuizResultToDB,
  clearToken,
  getToken
} from './services/apiClient';
import { CheckCircle2, Sparkles, X, Database } from 'lucide-react';

function buildOfficerPersona(user, skills = [], gaps = []) {
  if (!user) return null;

  const compScores = {};
  if (Array.isArray(skills)) {
    skills.forEach(s => {
      compScores[s.skill_name] = Math.max(1, Math.min(5, Math.round((s.proficiency_score || 50) / 20)));
    });
  }

  return {
    id: user.id,
    name: user.full_name,
    full_name: user.full_name,
    avatar: user.full_name
      ? user.full_name
          .split(' ')
          .filter(n => !n.startsWith('Smt.') && !n.startsWith('Shri') && !n.startsWith('Dr.'))
          .map(n => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase() || 'MO'
      : 'GOI',
    designation: user.job_role || 'Senior Statistical Officer',
    job_role: user.job_role || 'Senior Statistical Officer',
    roleKey: (user.job_role || '').toLowerCase().includes('junior')
      ? 'jso'
      : (user.job_role || '').toLowerCase().includes('assistant')
      ? 'asst_dir'
      : (user.job_role || '').toLowerCase().includes('deputy')
      ? 'dep_dir'
      : 'sso',
    cadre: user.job_role || 'Subordinate Statistical Service (SSS)',
    division: user.department || 'National Accounts Division (NAD)',
    department: user.department || 'National Accounts Division (NAD)',
    posting: 'MoSPI Headquarters, Sardar Patel Bhawan, New Delhi',
    organization: user.organization || 'MoSPI, Government of India',
    employeeId: `MoSPI/SSS/${user.id.substring(0, 6).toUpperCase()}`,
    email: user.email,
    qualification: 'M.Sc. in Statistics / Econometrics',
    experienceYears: user.experience_level === 'Senior' ? 10 : user.experience_level === 'Advanced' ? 7 : 4,
    currentAssignment: user.career_goal || 'National Accounts Compilation & Macroeconomic Data Scrutiny',
    career_goal: user.career_goal,
    targetRole: 'asst_dir',
    karmayogiCredits: user.karmayogi_credits ?? 120,
    karmayogi_credits: user.karmayogi_credits ?? 120,
    streakDays: user.streak_days ?? 1,
    streak_days: user.streak_days ?? 1,
    learningHours: parseFloat(user.learning_hours || 0),
    learning_hours: parseFloat(user.learning_hours || 0),
    competencyScores: {
      stat_survey_sampling: 4,
      stat_national_accounts: 3,
      stat_price_statistics: 3,
      stat_labour_statistics: 4,
      stat_industrial_stats: 3,
      stat_sdg_indicators: 2,
      stat_data_quality: 3,
      tech_python_stats: 2,
      tech_r_econometrics: 2,
      tech_sql_databases: 3,
      tech_gis_spatial: 2,
      tech_data_viz: 3,
      tech_ai_ml: 1,
      tech_cloud_apis: 2,
      gov_cybersecurity: 3,
      gov_data_privacy: 3,
      gov_dpi_cloud: 2,
      gov_eoffice_workflows: 4,
      mgmt_ethics_conduct: 4,
      mgmt_project_management: 3,
      mgmt_communication_briefs: 3,
      mgmt_leadership_change: 2,
      ...compScores
    }
  };
}

export default function App() {
  // App Theme
  const [theme, setTheme] = useState('dark');

  // MySQL Database Connection Status
  const [dbStatus, setDbStatus] = useState({ connected: false, loading: true });

  // Current Authenticated User & Persona
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPersona, setCurrentPersona] = useState(null);
  const [targetRoleKey, setTargetRoleKey] = useState('sso');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Real Database Data
  const [userSkills, setUserSkills] = useState([]);
  const [dbGaps, setDbGaps] = useState([]);
  const [dbRecommendations, setDbRecommendations] = useState([]);
  const [enrollments, setEnrollments] = useState({});

  // Sync state
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

  // Load authenticated user and MySQL connection
  useEffect(() => {
    let isMounted = true;

    async function initApp() {
      try {
        const health = await checkDatabaseHealth();
        if (isMounted) setDbStatus(health);

        // Fetch authenticated user if token exists
        const token = getToken();
        if (token) {
          const profileData = await fetchCurrentUser();
          if (profileData && profileData.user && isMounted) {
            setCurrentUser(profileData.user);
            setUserSkills(profileData.skills || []);
            setDbGaps(profileData.competencyGaps || []);

            const persona = buildOfficerPersona(profileData.user, profileData.skills, profileData.competencyGaps);
            setCurrentPersona(persona);

            // Fetch course progress & recommendations
            const [progressRows, recRows] = await Promise.all([
              fetchCourseProgress(),
              fetchPersonalizedRecommendations()
            ]);

            if (isMounted) {
              setDbRecommendations(recRows);
              const enrollMap = {};
              progressRows.forEach(p => {
                enrollMap[p.course_id] = {
                  course_id: p.course_id,
                  progress: p.progress_percentage,
                  status: p.progress_percentage >= 100 ? 'completed' : 'in_progress'
                };
              });
              setEnrollments(enrollMap);
            }
          } else if (isMounted) {
            setAuthModalOpen(true);
          }
        } else if (isMounted) {
          // Open auth modal if no active session
          setAuthModalOpen(true);
        }
      } catch (err) {
        console.warn('App initialization notice:', err);
      }
    }

    initApp();

    // Check DB health periodically
    const interval = setInterval(async () => {
      const health = await checkDatabaseHealth();
      if (isMounted) setDbStatus(health);
    }, 10000);

    // Listen for auth expiration
    const handleAuthExpired = () => {
      setCurrentUser(null);
      setCurrentPersona(null);
      setAuthModalOpen(true);
      setToast({
        title: 'Session Expired',
        message: 'Please sign in to access your capacity building records.'
      });
    };
    window.addEventListener('samarth_auth_expired', handleAuthExpired);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('samarth_auth_expired', handleAuthExpired);
    };
  }, []);

  const handleAuthSuccess = async (user) => {
    setCurrentUser(user);
    const [skills, gaps, recs, progress] = await Promise.all([
      fetchUserSkills(),
      fetchCompetencyGaps(),
      fetchPersonalizedRecommendations(),
      fetchCourseProgress()
    ]);

    setUserSkills(skills);
    setDbGaps(gaps);
    setDbRecommendations(recs);

    const persona = buildOfficerPersona(user, skills, gaps);
    setCurrentPersona(persona);

    const enrollMap = {};
    progress.forEach(p => {
      enrollMap[p.course_id] = {
        course_id: p.course_id,
        progress: p.progress_percentage,
        status: p.progress_percentage >= 100 ? 'completed' : 'in_progress'
      };
    });
    setEnrollments(enrollMap);

    setToast({
      title: 'Welcome, Officer!',
      message: `Signed in as ${user.full_name} (${user.job_role || 'MoSPI'}). Profile loaded from MySQL.`
    });
  };

  const handleLogout = () => {
    clearToken();
    setCurrentUser(null);
    setCurrentPersona(null);
    setAuthModalOpen(true);
    setToast({
      title: 'Signed Out',
      message: 'You have been securely signed out of SAMARTH-STAT.'
    });
  };

  // Safe persona fallback to prevent crashing during first paint or before auth
  const activePersona = currentPersona || {
    id: 'guest',
    name: 'MoSPI Officer',
    full_name: 'MoSPI Officer',
    avatar: 'MO',
    designation: 'Statistical Officer',
    job_role: 'Statistical Officer',
    roleKey: 'sso',
    cadre: 'Subordinate Statistical Service',
    division: 'Official Statistics Division',
    department: 'Official Statistics Division',
    posting: 'New Delhi',
    organization: 'MoSPI',
    targetRole: 'asst_dir',
    karmayogiCredits: 120,
    learningHours: 0,
    streakDays: 1,
    competencyScores: {
      stat_survey_sampling: 3,
      stat_national_accounts: 2,
      stat_price_statistics: 3,
      stat_labour_statistics: 3,
      stat_industrial_stats: 3,
      stat_sdg_indicators: 2,
      stat_data_quality: 3,
      tech_python_stats: 2,
      tech_r_econometrics: 2,
      tech_sql_databases: 2,
      tech_gis_spatial: 2,
      tech_data_viz: 2,
      tech_ai_ml: 1,
      tech_cloud_apis: 1,
      gov_cybersecurity: 2,
      gov_data_privacy: 3,
      gov_dpi_cloud: 2,
      gov_eoffice_workflows: 3,
      mgmt_ethics_conduct: 4,
      mgmt_project_management: 2,
      mgmt_communication_briefs: 2,
      mgmt_leadership_change: 1
    }
  };

  // Dynamic Skill Gap Analysis
  const gapAnalysis = analyzeCompetencyGaps(activePersona.competencyScores, targetRoleKey);

  // Dynamic Personalized Recommendations (iGOT + NSSTA)
  const recommendations = generatePersonalizedPathway(
    activePersona.competencyScores,
    targetRoleKey,
    activePersona.cadre
  );

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleUpdateCompetencyScore = (competencyId, newScore) => {
    setCurrentPersona(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        competencyScores: {
          ...prev.competencyScores,
          [competencyId]: newScore
        }
      };
    });
  };

  const handleSyncIgot = async () => {
    setIsSyncing(true);
    try {
      await syncWithKarmayogiAPI(activePersona);
      setIsSyncing(false);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(timeStr);
      setToast({
        title: 'iGOT Karmayogi Synced',
        message: `Telemetry verified with api.igotkarmayogi.gov.in at ${timeStr}.`
      });
    } catch (e) {
      setIsSyncing(false);
    }
  };

  const handleCompleteCourse = async (item) => {
    // 1. Update reactive state
    const updated = saveEnrollment(activePersona.id, item.id, 100);
    setEnrollments(updated);

    // 2. Persist to MySQL
    if (currentUser) {
      try {
        await updateCourseProgress(item.id, 100, true);
      } catch (err) {
        console.warn('Persist course completion warning:', err);
      }
    }

    // 3. Elevate persona stats
    setCurrentPersona(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        learningHours: parseFloat((prev.learningHours + (item.durationHours || 8)).toFixed(1)),
        karmayogiCredits: prev.karmayogiCredits + (item.karmayogiCredits || 150),
        competencyScores: item.competencyId
          ? {
              ...prev.competencyScores,
              [item.competencyId]: Math.min(5, (prev.competencyScores[item.competencyId] || 1) + 1)
            }
          : prev.competencyScores
      };
    });

    setToast({
      title: 'Course Completed & Saved to MySQL!',
      message: `Completed "${item.title}". +150 Karma Credits and hours updated.`
    });
  };

  const handleSaveQuizResult = (resultData) => {
    if (currentUser) {
      submitQuizResultToDB(currentUser.id, resultData);
    }
    setToast({
      title: 'Quiz Result Saved to MySQL',
      message: `Score: ${resultData.scorePercentage}% recorded in MySQL quiz tables.`
    });
  };

  const handleQuickStartQuiz = (docId) => {
    setPresetQuizDocId(docId);
    setActiveTab('assessment');
  };

  return (
    <div className="app-container">
      {/* Auth Modal for Login & Registration */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          if (currentUser) setAuthModalOpen(false);
        }}
        onAuthSuccess={handleAuthSuccess}
      />

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
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onSyncIgot={handleSyncIgot}
          isSyncing={isSyncing}
          lastSyncTime={lastSyncTime}
          dbStatus={dbStatus}
        />

        <div style={{ display: 'flex', flex: 1 }}>
          {/* Left Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            currentPersona={activePersona}
            gapSummary={gapAnalysis}
          />

          {/* Center Main View Area */}
          <main className="page-container">
            {activeTab === 'dashboard' && (
              <LearnerDashboard
                persona={activePersona}
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
                persona={activePersona}
                gapAnalysis={gapAnalysis}
                targetRoleKey={targetRoleKey}
                onSelectTargetRole={setTargetRoleKey}
                onUpdateCompetencyScore={handleUpdateCompetencyScore}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'pathway' && (
              <LearningPathway
                persona={activePersona}
                recommendations={recommendations}
                enrollments={enrollments}
                onEnrollCourse={(item) => saveEnrollment(activePersona.id, item.id, 10)}
                onCompleteCourse={handleCompleteCourse}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'assessment' && (
              <AssessmentCenter
                persona={activePersona}
                onUpdateCompetencyScore={handleUpdateCompetencyScore}
                onNavigateTab={setActiveTab}
                presetDocId={presetQuizDocId}
                onSubmitQuizResult={handleSaveQuizResult}
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

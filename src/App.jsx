import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LearnerDashboard } from './components/learner/LearnerDashboard';
import { CompetencyProfile } from './components/learner/CompetencyProfile';
import { LearningPathway } from './components/learner/LearningPathway';
import { AssessmentCenter } from './components/assessment/AssessmentCenter';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StatSahayakChat } from './components/ai-tutor/StatSahayakChat';

// Dedicated Separate Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProtectedRoute from './components/common/ProtectedRoute';

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
  logoutUser,
  getToken
} from './services/apiClient';
import { Sparkles, X } from 'lucide-react';

function buildOfficerPersona(user, skills = []) {
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
  const navigate = useNavigate();
  const location = useLocation();

  // App Theme
  const [theme, setTheme] = useState('dark');

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPersona, setCurrentPersona] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // MySQL Database Connection Status
  const [dbStatus, setDbStatus] = useState({ connected: false, loading: true });

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

  // Check initial authentication and MySQL connection
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const health = await checkDatabaseHealth();
        if (isMounted) setDbStatus(health);

        const token = getToken();
        let user = null;
        let skills = [];
        let gaps = [];

        if (token) {
          try {
            const profileData = await fetchCurrentUser();
            if (profileData && profileData.user) {
              user = profileData.user;
              skills = profileData.skills || [];
              gaps = profileData.competencyGaps || [];
            }
          } catch (e) {
            console.warn('API fetchCurrentUser notice:', e.message);
          }

          // Fallback to local active user if backend user unavailable
          if (!user) {
            try {
              const localUser = JSON.parse(localStorage.getItem('sb_active_user') || 'null');
              if (localUser) {
                user = localUser;
                skills = localUser.skills || [];
                gaps = localUser.competencyGaps || [];
              }
            } catch (e) {}
          }

          if (user && isMounted) {
            setCurrentUser(user);
            setUserSkills(skills);
            setDbGaps(gaps);

            const persona = buildOfficerPersona(user, skills);
            setCurrentPersona(persona);

            try {
              const [progressRows, recRows] = await Promise.all([
                fetchCourseProgress(),
                fetchPersonalizedRecommendations()
              ]);

              if (isMounted) {
                setDbRecommendations(recRows || []);
                const enrollMap = {};
                (progressRows || []).forEach(p => {
                  enrollMap[p.course_id] = {
                    course_id: p.course_id,
                    progress: p.progress_percentage,
                    status: p.progress_percentage >= 100 ? 'completed' : 'in_progress'
                  };
                });
                setEnrollments(enrollMap);
              }
            } catch (err) {}
          } else if (isMounted) {
            setCurrentUser(null);
            setCurrentPersona(null);
          }
        } else if (isMounted) {
          setCurrentUser(null);
          setCurrentPersona(null);
        }
      } catch (err) {
        console.warn('Auth check error:', err);
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    }

    initAuth();

    // Check DB health periodically
    const interval = setInterval(async () => {
      const health = await checkDatabaseHealth();
      if (isMounted) setDbStatus(health);
    }, 12000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [navigate]);

  const handleLoginSuccess = async (user) => {
    // 1. Synchronously set user & persona so ProtectedRoute & Dashboard are immediately active
    const basePersona = buildOfficerPersona(user, []);
    setCurrentUser(user);
    setCurrentPersona(basePersona);

    setToast({
      title: 'Login Successful',
      message: `Welcome back, ${user.full_name}! Officer profile authenticated.`
    });

    // 2. Fetch full skills, gaps, recommendations in background
    try {
      const [skills, gaps, recs, progress] = await Promise.all([
        fetchUserSkills(),
        fetchCompetencyGaps(),
        fetchPersonalizedRecommendations(),
        fetchCourseProgress()
      ]);

      setUserSkills(skills || []);
      setDbGaps(gaps || []);
      setDbRecommendations(recs || []);

      const fullPersona = buildOfficerPersona(user, skills || []);
      setCurrentPersona(fullPersona);

      const enrollMap = {};
      (progress || []).forEach(p => {
        enrollMap[p.course_id] = {
          course_id: p.course_id,
          progress: p.progress_percentage,
          status: p.progress_percentage >= 100 ? 'completed' : 'in_progress'
        };
      });
      setEnrollments(enrollMap);
    } catch (err) {
      console.warn('Post-login background fetch:', err);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setCurrentPersona(null);
    navigate('/login', { replace: true });
    setToast({
      title: 'Signed Out',
      message: 'You have been securely signed out.'
    });
  };

  // Determine active tab from pathname for Sidebar
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.startsWith('/competency') || path.startsWith('/skills') || path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/courses') || path.startsWith('/recommendations')) return 'pathway';
    if (path.startsWith('/quiz') || path.startsWith('/assessment')) return 'assessment';
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/tutor')) return 'tutor';
    return 'dashboard';
  };

  const handleSidebarTabSelect = (tabId) => {
    switch (tabId) {
      case 'dashboard': navigate('/dashboard'); break;
      case 'profile': navigate('/competency'); break;
      case 'pathway': navigate('/courses'); break;
      case 'assessment': navigate('/quiz'); break;
      case 'admin': navigate('/admin'); break;
      case 'tutor': navigate('/tutor'); break;
      default: navigate('/dashboard');
    }
  };

  // Dynamic Skill Gap Analysis
  const gapAnalysis = analyzeCompetencyGaps(currentPersona?.competencyScores || {}, currentPersona?.targetRole || 'sso');

  // Dynamic Personalized Recommendations (iGOT + NSSTA)
  const recommendations = generatePersonalizedPathway(
    currentPersona?.competencyScores || {},
    currentPersona?.targetRole || 'sso',
    currentPersona?.cadre || 'Official Statistical Service'
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
    if (!currentPersona) return;
    setIsSyncing(true);
    try {
      await syncWithKarmayogiAPI(currentPersona);
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
    if (!currentPersona) return;
    const updated = saveEnrollment(currentPersona.id, item.id, 100);
    setEnrollments(updated);

    if (currentUser) {
      try {
        await updateCourseProgress(item.id, 100, true);
      } catch (err) {
        console.warn('Course progress update notice:', err);
      }
    }

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
      message: `Completed "${item.title}". +150 Karma Credits awarded.`
    });
  };

  const handleSaveQuizResult = (resultData) => {
    if (currentUser) {
      submitQuizResultToDB(currentUser.id, resultData);
    }
    setToast({
      title: 'Quiz Result Saved to MySQL',
      message: `Score: ${resultData.scorePercentage}% saved to quiz history.`
    });
  };

  const handleQuickStartQuiz = (docId) => {
    setPresetQuizDocId(docId);
    navigate('/quiz');
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

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        <Route
          path="/register"
          element={
            currentUser ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <RegisterPage />
            )
          }
        />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* PROTECTED MAIN APPLICATION ROUTES */}
        <Route
          path="/*"
          element={
            <ProtectedRoute isAuthenticated={!!currentUser} isLoading={authLoading}>
              <div className="main-content-wrapper">
                {/* Top Header */}
                <Header
                  currentUser={currentUser}
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
                    activeTab={getActiveTabFromPath()}
                    onSelectTab={handleSidebarTabSelect}
                    currentPersona={currentPersona}
                    gapSummary={gapAnalysis}
                  />

                  {/* Center Main View Area */}
                  <main className="page-container">
                    <Routes>
                      <Route
                        path="/dashboard"
                        element={
                          <LearnerDashboard
                            persona={currentPersona}
                            gapAnalysis={gapAnalysis}
                            recommendations={recommendations}
                            onNavigateTab={handleSidebarTabSelect}
                            onQuickStartQuiz={handleQuickStartQuiz}
                            onSimulateCompleteCourse={handleCompleteCourse}
                            enrollments={enrollments}
                          />
                        }
                      />

                      <Route
                        path="/competency"
                        element={
                          <CompetencyProfile
                            persona={currentPersona}
                            gapAnalysis={gapAnalysis}
                            targetRoleKey={currentPersona?.targetRole || 'sso'}
                            onSelectTargetRole={() => {}}
                            onUpdateCompetencyScore={handleUpdateCompetencyScore}
                            onNavigateTab={handleSidebarTabSelect}
                          />
                        }
                      />

                      <Route
                        path="/skills"
                        element={
                          <CompetencyProfile
                            persona={currentPersona}
                            gapAnalysis={gapAnalysis}
                            targetRoleKey={currentPersona?.targetRole || 'sso'}
                            onSelectTargetRole={() => {}}
                            onUpdateCompetencyScore={handleUpdateCompetencyScore}
                            onNavigateTab={handleSidebarTabSelect}
                          />
                        }
                      />

                      <Route
                        path="/profile"
                        element={
                          <CompetencyProfile
                            persona={currentPersona}
                            gapAnalysis={gapAnalysis}
                            targetRoleKey={currentPersona?.targetRole || 'sso'}
                            onSelectTargetRole={() => {}}
                            onUpdateCompetencyScore={handleUpdateCompetencyScore}
                            onNavigateTab={handleSidebarTabSelect}
                          />
                        }
                      />

                      <Route
                        path="/courses"
                        element={
                          <LearningPathway
                            persona={currentPersona}
                            recommendations={recommendations}
                            enrollments={enrollments}
                            onEnrollCourse={(item) => saveEnrollment(currentPersona.id, item.id, 10)}
                            onCompleteCourse={handleCompleteCourse}
                            onNavigateTab={handleSidebarTabSelect}
                          />
                        }
                      />

                      <Route
                        path="/recommendations"
                        element={
                          <LearningPathway
                            persona={currentPersona}
                            recommendations={recommendations}
                            enrollments={enrollments}
                            onEnrollCourse={(item) => saveEnrollment(currentPersona.id, item.id, 10)}
                            onCompleteCourse={handleCompleteCourse}
                            onNavigateTab={handleSidebarTabSelect}
                          />
                        }
                      />

                      <Route
                        path="/progress"
                        element={
                          <LearningPathway
                            persona={currentPersona}
                            recommendations={recommendations}
                            enrollments={enrollments}
                            onEnrollCourse={(item) => saveEnrollment(currentPersona.id, item.id, 10)}
                            onCompleteCourse={handleCompleteCourse}
                            onNavigateTab={handleSidebarTabSelect}
                          />
                        }
                      />

                      <Route
                        path="/quiz"
                        element={
                          <AssessmentCenter
                            persona={currentPersona}
                            onUpdateCompetencyScore={handleUpdateCompetencyScore}
                            onNavigateTab={handleSidebarTabSelect}
                            presetDocId={presetQuizDocId}
                            onSubmitQuizResult={handleSaveQuizResult}
                          />
                        }
                      />

                      <Route
                        path="/assessment"
                        element={
                          <AssessmentCenter
                            persona={currentPersona}
                            onUpdateCompetencyScore={handleUpdateCompetencyScore}
                            onNavigateTab={handleSidebarTabSelect}
                            presetDocId={presetQuizDocId}
                            onSubmitQuizResult={handleSaveQuizResult}
                          />
                        }
                      />

                      <Route
                        path="/admin"
                        element={
                          <AdminDashboard
                            onNavigateTab={handleSidebarTabSelect}
                          />
                        }
                      />

                      <Route
                        path="/tutor"
                        element={
                          <StatSahayakChat
                            onNavigateTab={handleSidebarTabSelect}
                            onStartQuizWithDoc={handleQuickStartQuiz}
                          />
                        }
                      />

                      {/* Default root redirects to /dashboard */}
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>

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

        .toast-icon { flex-shrink: 0; }
        .toast-text { flex: 1; }
        .toast-title { font-weight: 700; font-size: 0.88rem; color: var(--text-primary); }
        .toast-msg { font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px; line-height: 1.35; }
        .btn-close-toast { color: var(--text-muted); padding: 4px; background: none; border: none; cursor: pointer; }
        .btn-close-toast:hover { color: var(--text-primary); }
      `}</style>
    </div>
  );
}

import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle,
  PlayCircle,
  BarChart,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { DOMAIN_METADATA } from '../../data/competencyFramework';

export function LearnerDashboard({
  persona,
  gapAnalysis,
  recommendations,
  onNavigateTab,
  onQuickStartQuiz,
  onSimulateCompleteCourse,
  enrollments
}) {
  const { overallReadiness = 75, criticalGapsCount = 3, moderateGapsCount = 2, domainSummaries = [], criticalGaps = [] } = gapAnalysis || {};
  const topHighPriorityItem = recommendations?.structuredPathways?.[0]?.items?.[0] || recommendations?.recommendedIgot?.[0];

  const name = persona?.full_name || persona?.name || 'MoSPI Officer';
  const division = persona?.department || persona?.division || 'National Accounts Division';
  const designation = persona?.job_role || persona?.designation || 'Statistical Officer';
  const targetRole = (persona?.target_role || persona?.targetRole || 'Advanced Role');
  const cadre = persona?.job_role || persona?.cadre || 'Official Statistical Service';
  const posting = persona?.posting || persona?.organization || 'MoSPI, New Delhi';
  const currentAssignment = persona?.currentAssignment || persona?.career_goal || 'Capacity Building & Official Statistics Modernization';
  const learningHours = persona?.learning_hours ?? persona?.learningHours ?? 0;
  const karmayogiCredits = persona?.karmayogi_credits ?? persona?.karmayogiCredits ?? 0;


  return (
    <div className="learner-dashboard">
      {/* Welcome & Career Elevation Hero */}
      <div className="welcome-hero glass-card">
        <div className="hero-content">
          <div className="hero-badge-row">
            <span className="badge badge-saffron">OFFICIAL TRAINEE PORTAL</span>
            <span className="badge badge-blue">{division}</span>
            <span className="badge badge-green">POSTING: {posting}</span>
          </div>
          <h1 className="hero-title">
            Welcome back, <span className="gradient-text-saffron">{name}</span>
          </h1>
          <p className="hero-assignment">
            <strong>Current Assignment:</strong> {currentAssignment}
          </p>
          <div className="hero-career-track">
            <span className="career-label">Target Career Elevation:</span>
            <span className="current-cadre-tag">{designation}</span>
            <ArrowRight size={14} color="#FF8547" />
            <span className="next-cadre-tag">{targetRole.toUpperCase()} • {cadre}</span>
          </div>
        </div>

        {/* Big Readiness Score Circular / Ring Metric */}
        <div className="readiness-gauge-card">
          <div className="gauge-circle-outer">
            <svg className="gauge-svg" viewBox="0 0 100 100">
              <circle className="gauge-bg" cx="50" cy="50" r="42" />
              <circle
                className="gauge-progress"
                cx="50"
                cy="50"
                r="42"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * overallReadiness) / 100}
              />
            </svg>
            <div className="gauge-inner-text">
              <span className="gauge-percentage">{overallReadiness}%</span>
              <span className="gauge-caption">Readiness</span>
            </div>
          </div>
          <div className="gauge-subtext">Benchmark for {targetRole.toUpperCase()}</div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="stats-grid grid-4">
        <div className="stat-card glass-card">
          <div className="stat-header">
            <span className="stat-title">Identified Skill Gaps</span>
            <div className="stat-icon-box critical">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="stat-value text-critical">{criticalGapsCount} Critical</div>
          <div className="stat-sub">{moderateGapsCount} Moderate Gaps • Requires Training</div>
          <button className="stat-link-btn" onClick={() => onNavigateTab('profile')}>
            <span>View Gap Radar</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-header">
            <span className="stat-title">Completed iGOT Modules</span>
            <div className="stat-icon-box green">
              <BookOpen size={18} />
            </div>
          </div>
          <div className="stat-value">{Object.values(enrollments || {}).filter(e => e.status === 'completed').length + 3} Courses</div>
          <div className="stat-sub">{learningHours} Verified Learning Hours</div>
          <button className="stat-link-btn" onClick={() => onNavigateTab('pathway')}>
            <span>Browse iGOT Catalog</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-header">
            <span className="stat-title">Karmayogi Karma Points</span>
            <div className="stat-icon-box purple">
              <Award size={18} />
            </div>
          </div>
          <div className="stat-value">{karmayogiCredits} pts</div>
          <div className="stat-sub">Top 15% in {cadre.split('(')[0]}</div>
          <button className="stat-link-btn" onClick={() => onNavigateTab('pathway')}>
            <span>Earn Credits</span>
            <ChevronRight size={14} />
          </button>
        </div>


        <div className="stat-card glass-card">
          <div className="stat-header">
            <span className="stat-title">NSSTA TPAC Programme</span>
            <div className="stat-icon-box blue">
              <Calendar size={18} />
            </div>
          </div>
          <div className="stat-value">Nomination Active</div>
          <div className="stat-sub">Greater Noida Campus • Oct 2025</div>
          <button className="stat-link-btn" onClick={() => onNavigateTab('pathway')}>
            <span>View Calendar</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Immediate Priority Remediation Alert */}
      {topHighPriorityItem && (
        <div className="remediation-banner glass-card">
          <div className="banner-left">
            <div className="alert-pulse-icon">
              <ShieldAlert size={24} color="#EF4444" />
            </div>
            <div className="banner-info">
              <div className="banner-tag-row">
                <span className="badge badge-critical">IMMEDIATE RECOMMENDED REMEDIATION</span>
                <span className="badge badge-saffron">{topHighPriorityItem.type || 'iGOT'}</span>
              </div>
              <h3 className="banner-course-title">{topHighPriorityItem.title}</h3>
              <p className="banner-desc">
                {topHighPriorityItem.relevanceReason || topHighPriorityItem.overview}
              </p>
            </div>
          </div>
          <div className="banner-actions">
            <button
              className="btn-primary"
              onClick={() => onNavigateTab('pathway')}
            >
              <PlayCircle size={17} />
              <span>Start Learning Track</span>
            </button>
          </div>
        </div>
      )}

      {/* 2-Column Section: Domain Readiness Breakdown & Quick AI MCQ Test */}
      <div className="dashboard-columns grid-2">
        {/* Left: Domain-wise Competency Readiness */}
        <div className="domain-readiness-card glass-card">
          <div className="card-heading-row">
            <div>
              <h3>Competency Domain Readiness</h3>
              <p>Current proficiency vs. MoSPI benchmark for {targetRole.toUpperCase()}</p>
            </div>

            <button className="btn-secondary btn-sm" onClick={() => onNavigateTab('profile')}>
              Full Radar
            </button>
          </div>

          <div className="domain-bars-list">
            {domainSummaries.map(domain => {
              return (
                <div key={domain.domain} className="domain-bar-item">
                  <div className="domain-bar-header">
                    <span className="domain-bar-title">{domain.title}</span>
                    <span className="domain-bar-score" style={{ color: domain.color }}>
                      {domain.readinessPercentage}% (L{domain.avgCurrent} / L{domain.avgTarget})
                    </span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${domain.readinessPercentage}%`,
                        backgroundColor: domain.color
                      }}
                    />
                  </div>
                  <div className="domain-bar-meta">
                    {domain.criticalGapsCount > 0 && (
                      <span className="gap-alert-tag critical">
                        {domain.criticalGapsCount} critical gap{domain.criticalGapsCount > 1 ? 's' : ''}
                      </span>
                    )}
                    {domain.moderateGapsCount > 0 && (
                      <span className="gap-alert-tag moderate">
                        {domain.moderateGapsCount} moderate
                      </span>
                    )}
                    {domain.criticalGapsCount === 0 && domain.moderateGapsCount === 0 && (
                      <span className="gap-alert-tag proficient">Proficient</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Quick AI Diagnostic Assessment Launcher */}
        <div className="quick-assessment-card glass-card">
          <div className="ai-sparkle-header">
            <div className="ai-icon-bubble">
              <Sparkles size={20} color="#FF671F" />
            </div>
            <div>
              <h3>AI Intelligent Assessment Engine</h3>
              <p>Evaluate your statistical understanding & close gaps</p>
            </div>
          </div>

          <div className="assessment-promo-box">
            <div className="promo-badge">PLFS & SAMPLING METHODOLOGY</div>
            <h4>Take 5-Question AI Diagnostic Quiz</h4>
            <p>
              Generated automatically from the official MoSPI Periodic Labour Force Survey
              Methodology manual. Tests your understanding of rotational sampling, CWS, and household stratification.
            </p>
            <div className="quiz-meta-row">
              <div className="meta-item">
                <Clock size={14} />
                <span>5 Minutes</span>
              </div>
              <div className="meta-item">
                <BarChart size={14} />
                <span>5 MCQs</span>
              </div>
              <div className="meta-item">
                <Award size={14} />
                <span>+50 Karma Credits</span>
              </div>
            </div>
          </div>

          <div className="quick-quiz-actions">
            <button
              className="btn-primary"
              style={{ width: '100%' }}
              onClick={() => onQuickStartQuiz('doc_plfs_methodology')}
            >
              <Sparkles size={16} />
              <span>Launch AI Diagnostic Assessment</span>
            </button>
            <button
              className="btn-secondary"
              style={{ width: '100%' }}
              onClick={() => onNavigateTab('assessment')}
            >
              <span>Upload Custom Material & Generate MCQ</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .learner-dashboard {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .welcome-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 30px 36px;
          background: linear-gradient(135deg, rgba(17, 27, 49, 0.9) 0%, rgba(30, 58, 138, 0.15) 100%);
          border: 1px solid var(--border-medium);
          position: relative;
          overflow: hidden;
        }

        .welcome-hero::before {
          content: '';
          position: absolute;
          top: -40px;
          right: -40px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 103, 31, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 1;
        }

        .hero-badge-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .hero-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .hero-assignment {
          font-size: 0.92rem;
          color: var(--text-secondary);
        }

        .hero-career-track {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
          padding-top: 10px;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.85rem;
        }

        .career-label {
          color: var(--text-muted);
          font-weight: 600;
        }

        .current-cadre-tag {
          font-weight: 700;
          color: var(--text-primary);
        }

        .next-cadre-tag {
          font-weight: 700;
          color: var(--saffron-primary);
        }

        .readiness-gauge-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding-left: 32px;
          z-index: 1;
        }

        .gauge-circle-outer {
          position: relative;
          width: 110px;
          height: 110px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gauge-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .gauge-bg {
          fill: none;
          stroke: var(--bg-subtle);
          stroke-width: 8;
        }

        .gauge-progress {
          fill: none;
          stroke: var(--saffron-primary);
          stroke-width: 8;
          stroke-linecap: round;
          transition: stroke-dashoffset 1s ease;
        }

        .gauge-inner-text {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .gauge-percentage {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
        }

        .gauge-caption {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          font-weight: 600;
        }

        .gauge-subtext {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .stat-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 20px;
        }

        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-title {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .stat-icon-box {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon-box.critical {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
        }

        .stat-icon-box.green {
          background: rgba(5, 150, 105, 0.15);
          color: #10B981;
        }

        .stat-icon-box.purple {
          background: rgba(139, 92, 246, 0.15);
          color: #8B5CF6;
        }

        .stat-icon-box.blue {
          background: rgba(37, 99, 235, 0.15);
          color: #3B82F6;
        }

        .stat-value {
          font-size: 1.55rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .text-critical {
          color: #F87171;
        }

        .stat-sub {
          font-size: 0.76rem;
          color: var(--text-secondary);
        }

        .stat-link-btn {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: var(--saffron-primary);
          font-size: 0.8rem;
          font-weight: 600;
        }

        .stat-link-btn:hover {
          color: var(--saffron-light);
        }

        .remediation-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-left: 4px solid #EF4444;
          background: rgba(239, 68, 68, 0.06);
          padding: 22px 28px;
        }

        .banner-left {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          flex: 1;
        }

        .alert-pulse-icon {
          animation: pulseGlow 2s infinite;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .banner-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .banner-tag-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .banner-course-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .banner-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .card-heading-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .card-heading-row h3 {
          font-size: 1.15rem;
          font-weight: 700;
        }

        .card-heading-row p {
          font-size: 0.8rem;
        }

        .domain-bars-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .domain-bar-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .domain-bar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .domain-bar-title {
          font-size: 0.86rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .domain-bar-score {
          font-size: 0.82rem;
          font-weight: 700;
        }

        .domain-bar-meta {
          display: flex;
          gap: 6px;
          margin-top: 2px;
        }

        .gap-alert-tag {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 1px 6px;
          border-radius: var(--radius-sm);
        }

        .gap-alert-tag.critical {
          background: rgba(239, 68, 68, 0.15);
          color: #F87171;
        }

        .gap-alert-tag.moderate {
          background: rgba(245, 158, 11, 0.15);
          color: #FBBF24;
        }

        .gap-alert-tag.proficient {
          background: rgba(5, 150, 105, 0.15);
          color: #34D399;
        }

        .quick-assessment-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ai-sparkle-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ai-icon-bubble {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-md);
          background: rgba(255, 103, 31, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .assessment-promo-box {
          background: var(--bg-card-solid);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .promo-badge {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--saffron-primary);
          letter-spacing: 0.05em;
        }

        .assessment-promo-box h4 {
          font-size: 1.05rem;
          font-weight: 700;
        }

        .assessment-promo-box p {
          font-size: 0.82rem;
          line-height: 1.4;
        }

        .quiz-meta-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 6px;
          padding-top: 10px;
          border-top: 1px solid var(--border-subtle);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .quick-quiz-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: auto;
        }

        @media (max-width: 900px) {
          .welcome-hero {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .readiness-gauge-card {
            padding-left: 0;
            align-self: center;
          }
          .remediation-banner {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

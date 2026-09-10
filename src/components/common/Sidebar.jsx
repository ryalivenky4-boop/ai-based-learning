import React from 'react';
import {
  LayoutDashboard,
  Radar,
  GraduationCap,
  Sparkles,
  BarChart3,
  BotMessageSquare,
  Award,
  Flame,
  Clock,
  ShieldCheck
} from 'lucide-react';

export function Sidebar({ activeTab, onSelectTab, currentPersona, gapSummary }) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Learner Overview',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Progress, streaks & active courses'
    },
    {
      id: 'profile',
      label: 'Competency & Gap Radar',
      icon: Radar,
      badge: gapSummary?.criticalGapsCount > 0 ? `${gapSummary.criticalGapsCount} Gaps` : null,
      badgeType: 'critical',
      desc: 'Multi-domain assessment & role targets'
    },
    {
      id: 'pathway',
      label: 'Personalized Pathway',
      icon: GraduationCap,
      badge: 'iGOT + NSSTA',
      badgeType: 'green',
      desc: 'Curated e-learning & TPAC workshops'
    },
    {
      id: 'assessment',
      label: 'AI Assessment Studio',
      icon: Sparkles,
      badge: 'AI MCQ',
      badgeType: 'saffron',
      desc: 'Document-to-Quiz generation & tests'
    },
    {
      id: 'admin',
      label: 'MoSPI DIID Analytics',
      icon: BarChart3,
      badge: 'Ministry View',
      badgeType: 'purple',
      desc: 'Workforce intelligence & forecasting'
    },
    {
      id: 'tutor',
      label: 'StatSahayak AI Tutor',
      icon: BotMessageSquare,
      badge: 'Online',
      badgeType: 'green',
      desc: 'Statistical concepts & coding assistant'
    }
  ];

  return (
    <aside className="app-sidebar">
      {/* Officer Quick Badge */}
      <div className="sidebar-profile-card glass-card">
        <div className="card-top">
          <div className="cadre-pill">{currentPersona.cadre.split('(')[0]}</div>
          <div className="online-pill">
            <span className="pulse-indicator" />
            <span>Active</span>
          </div>
        </div>
        <div className="officer-name">{currentPersona.name}</div>
        <div className="officer-division">{currentPersona.division}</div>

        {/* Quick Micro Stats */}
        <div className="quick-micro-stats">
          <div className="micro-stat" title="Total completed learning hours">
            <Clock size={13} color="#FF8547" />
            <span>{currentPersona.learningHours}h</span>
          </div>
          <div className="micro-stat" title="Karmayogi daily streak">
            <Flame size={13} color="#F87171" />
            <span>{currentPersona.streakDays}d Streak</span>
          </div>
          <div className="micro-stat" title="Karmayogi Credits">
            <Award size={13} color="#34D399" />
            <span>{currentPersona.karmayogiCredits} pts</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">PORTAL NAVIGATION</div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <div className="nav-icon-box">
                <Icon size={19} />
              </div>
              <div className="nav-text-col">
                <div className="nav-label-row">
                  <span className="nav-label">{item.label}</span>
                  {item.badge && (
                    <span className={`nav-badge badge-${item.badgeType}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="nav-desc">{item.desc}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Government Trust Footer */}
      <div className="sidebar-footer">
        <div className="trust-card">
          <ShieldCheck size={16} color="#059669" />
          <div className="trust-text">
            <span>Aligned with NPCSCB</span>
            <small>Mission Karmayogi Bharat</small>
          </div>
        </div>
      </div>

      <style>{`
        .app-sidebar {
          width: 300px;
          min-width: 300px;
          background: var(--bg-sidebar);
          border-right: 1px solid var(--border-subtle);
          padding: 24px 18px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: calc(100vh - 65px);
          position: sticky;
          top: 65px;
          overflow-y: auto;
        }

        .sidebar-profile-card {
          padding: 16px;
          background: var(--bg-card-solid);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .cadre-pill {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          background: rgba(255, 103, 31, 0.12);
          color: var(--saffron-light);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255, 103, 31, 0.25);
        }

        .online-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          color: var(--green-light);
          font-weight: 500;
        }

        .officer-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .officer-division {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 12px;
          margin-top: 2px;
        }

        .quick-micro-stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid var(--border-subtle);
        }

        .micro-stat {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .nav-section-title {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          padding: 0 10px 8px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .nav-item-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          text-align: left;
          width: 100%;
          border: 1px solid transparent;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-item-btn:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
          border-color: var(--border-subtle);
        }

        .nav-item-btn.active {
          background: rgba(255, 103, 31, 0.12);
          color: var(--text-primary);
          border-color: rgba(255, 103, 31, 0.35);
          box-shadow: 0 2px 10px rgba(255, 103, 31, 0.15);
        }

        .nav-item-btn.active .nav-icon-box {
          color: var(--saffron-primary);
        }

        .nav-icon-box {
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .nav-text-col {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }

        .nav-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }

        .nav-label {
          font-size: 0.86rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .nav-desc {
          font-size: 0.7rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .nav-badge {
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: var(--radius-full);
          font-weight: 700;
          flex-shrink: 0;
        }

        .sidebar-footer {
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle);
        }

        .trust-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: var(--bg-subtle);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .trust-text {
          display: flex;
          flex-direction: column;
        }

        .trust-text span {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .trust-text small {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        @media (max-width: 1024px) {
          .app-sidebar {
            width: 78px;
            min-width: 78px;
            padding: 16px 8px;
          }
          .sidebar-profile-card, .nav-text-col, .nav-section-title, .sidebar-footer {
            display: none;
          }
          .nav-item-btn {
            justify-content: center;
            padding: 12px;
          }
        }
      `}</style>
    </aside>
  );
}

import React, { useState } from 'react';
import {
  RefreshCw, Moon, Sun, User, Sparkles, Building2, Database,
  LogOut, LogIn, Award, Clock, Flame, ChevronDown, CheckCircle2
} from 'lucide-react';

export function Header({
  currentUser,
  onOpenAuth,
  onLogout,
  theme,
  onToggleTheme,
  onSyncIgot,
  isSyncing,
  lastSyncTime,
  dbStatus
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Compute initials
  const initials = currentUser?.full_name
    ? currentUser.full_name
        .split(' ')
        .filter(n => !n.startsWith('Smt.') && !n.startsWith('Shri') && !n.startsWith('Dr.'))
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'MO'
    : 'GOI';

  return (
    <header className="app-header">
      {/* Indian National Tricolor Header Stripe */}
      <div className="tricolor-stripe" />

      <div className="header-inner">
        {/* Left Branding */}
        <div className="header-brand">
          <div className="brand-logo-container">
            <div className="emblem-circle">
              <img src="/logo.png" alt="Skill Bridge-Ai Logo" className="app-header-logo" />
            </div>
            <div className="brand-titles">
              <div className="brand-top-tag">
                <span className="gov-india-badge">GOVERNMENT OF INDIA</span>
                <span className="divider">•</span>
                <span>MoSPI • DIID</span>
                <span className="divider">•</span>
                <span className="igot-badge">iGOT KARMAYOGI</span>
              </div>
              <h1 className="brand-main-title">
                Skill Bridge<span className="title-accent">-Ai</span>
              </h1>
            </div>
          </div>

        </div>

        {/* Right Actions */}
        <div className="header-actions">
          {/* Live MySQL Database Status Badge */}
          <div
            className={`db-status-pill ${dbStatus?.connected ? 'connected' : 'connecting'}`}
            title={
              dbStatus?.connected
                ? `MySQL 8.0 Live Database: ${dbStatus.database || 'samarth_stat'} on ${dbStatus.host || 'localhost'}:${dbStatus.port || 3306} (User: ${dbStatus.user || 'root'})`
                : 'Connecting to MySQL Server (localhost:3306)...'
            }
          >
            <Database size={14} className={dbStatus?.connected ? 'db-icon-pulse' : ''} />
            <span className="db-pill-text">
              {dbStatus?.connected ? 'MySQL 8.0 Connected' : 'MySQL Connecting...'}
            </span>
            <span className={`db-status-dot ${dbStatus?.connected ? 'green' : 'amber'}`} />
          </div>

          {/* iGOT Sync Button */}
          <button
            className={`btn-sync-igot ${isSyncing ? 'syncing' : ''}`}
            onClick={onSyncIgot}
            disabled={isSyncing}
            title="Sync competency and course completion data with iGOT Karmayogi API"
          >
            <RefreshCw size={15} className={isSyncing ? 'spin-anim' : ''} />
            <span className="btn-text">
              {isSyncing ? 'Syncing with iGOT...' : 'Sync iGOT Karmayogi'}
            </span>
            {lastSyncTime && (
              <span className="sync-status-dot" title={`Last synced: ${lastSyncTime}`}>
                <CheckCircle2 size={13} color="#10B981" />
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#1E293B" />}
          </button>

          {/* User Account or Sign In */}
          {currentUser ? (
            <div className="persona-switcher-wrapper">
              <button
                className="persona-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="avatar-badge">{initials}</div>
                <div className="persona-info-compact">
                  <span className="persona-name">{currentUser.full_name}</span>
                  <span className="persona-role-tag">{currentUser.job_role || 'Statistical Officer'}</span>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="persona-dropdown-menu glass-card">
                  <div className="dropdown-header">
                    <User size={14} />
                    <span>Officer Profile (MySQL Verified)</span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg mb-3">
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {currentUser.full_name}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {currentUser.email}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {currentUser.department || 'Official Statistics'} • {currentUser.organization || 'MoSPI'}
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 text-center">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Credits</div>
                        <div className="text-xs font-bold text-amber-500 flex items-center justify-center gap-1">
                          <Award size={12} />
                          {currentUser.karmayogi_credits || 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Hours</div>
                        <div className="text-xs font-bold text-emerald-500 flex items-center justify-center gap-1">
                          <Clock size={12} />
                          {currentUser.learning_hours || 0}h
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Streak</div>
                        <div className="text-xs font-bold text-rose-500 flex items-center justify-center gap-1">
                          <Flame size={12} />
                          {currentUser.streak_days || 1}d
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenAuth && onOpenAuth();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 transition"
                  >
                    <User size={14} />
                    <span>Switch Officer Account</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2 transition mt-1"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition"
            >
              <LogIn size={15} />
              <span>Officer Sign In</span>
            </button>
          )}
        </div>
      </div>

      <style>{`
        .app-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--bg-header);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border-subtle);
        }

        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 32px;
          max-width: 1540px;
          margin: 0 auto;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .brand-logo-container {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .emblem-circle {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
          padding: 2px;
        }

        .app-header-logo {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }


        .brand-titles {
          display: flex;
          flex-direction: column;
        }

        .brand-top-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .gov-india-badge {
          color: var(--saffron-primary);
        }

        .igot-badge {
          color: var(--green-primary);
        }

        .divider {
          color: var(--border-medium);
        }

        .brand-main-title {
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: var(--text-primary);
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .title-accent {
          color: var(--saffron-primary);
        }

        .hindi-title {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .db-status-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
          transition: all 0.2s ease;
          border: 1px solid var(--border-subtle);
          background: var(--bg-card-solid);
        }

        .db-status-pill.connected {
          color: var(--green-light);
          border-color: rgba(16, 185, 129, 0.35);
          background: rgba(16, 185, 129, 0.08);
        }

        .db-status-pill.connecting {
          color: #F59E0B;
          border-color: rgba(245, 158, 11, 0.35);
          background: rgba(245, 158, 11, 0.08);
        }

        .db-pill-text {
          font-family: var(--font-mono);
          font-size: 0.75rem;
        }

        .db-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .db-status-dot.green {
          background-color: #10B981;
          box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
        }

        .db-status-dot.amber {
          background-color: #F59E0B;
          box-shadow: 0 0 6px rgba(245, 158, 11, 0.6);
          animation: pulseGlow 1.5s infinite;
        }

        .btn-sync-igot {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-subtle);
          border: 1px solid var(--border-medium);
          padding: 8px 14px;
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .btn-sync-igot:hover {
          background: var(--bg-card-hover);
          border-color: var(--green-primary);
          color: var(--green-primary);
        }

        .btn-sync-igot.syncing {
          opacity: 0.8;
          cursor: wait;
        }

        .spin-anim {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .theme-toggle-btn {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .theme-toggle-btn:hover {
          background: var(--bg-card-hover);
          border-color: var(--border-medium);
          transform: scale(1.05);
        }

        .persona-switcher-wrapper {
          position: relative;
        }

        .persona-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 14px;
          border-radius: var(--radius-md);
          background: var(--bg-card-solid);
          border: 1px solid var(--border-subtle);
          transition: all 0.2s;
        }

        .persona-btn:hover {
          border-color: var(--saffron-primary);
          box-shadow: 0 0 12px var(--saffron-glow);
        }

        .avatar-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--saffron-primary), var(--navy-primary));
          color: #FFF;
          font-weight: 700;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .persona-info-compact {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .persona-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .persona-role-tag {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .persona-dropdown-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 290px;
          padding: 12px;
          z-index: 100;
          background: var(--bg-card-solid);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border-medium);
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (max-width: 900px) {
          .header-inner {
            padding: 10px 16px;
          }
          .hindi-title, .brand-top-tag {
            display: none;
          }
          .btn-text {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
export default Header;

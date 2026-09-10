import React, { useState } from 'react';
import { RefreshCw, Moon, Sun, Award, CheckCircle2, User, Sparkles, Building2, Database } from 'lucide-react';
import { OFFICIAL_PERSONAS } from '../../data/officialProfiles';

export function Header({
  currentPersona,
  onSelectPersona,
  theme,
  onToggleTheme,
  onSyncIgot,
  isSyncing,
  lastSyncTime,
  dbStatus
}) {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  return (
    <header className="app-header">
      {/* Indian National Tricolor Header Stripe */}
      <div className="tricolor-stripe" />

      <div className="header-inner">
        {/* Left Branding */}
        <div className="header-brand">
          <div className="brand-logo-container">
            <div className="emblem-circle">
              <Building2 className="emblem-icon" size={20} />
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
                SAMARTH<span className="title-accent">-STAT</span>
                <span className="hindi-title"> (समर्थ-सांख्यिकी)</span>
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

          {/* Persona Switcher Dropdown */}
          <div className="persona-switcher-wrapper">
            <button
              className="persona-btn"
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            >
              <div className="avatar-badge">{currentPersona.avatar}</div>
              <div className="persona-info-compact">
                <span className="persona-name">{currentPersona.name}</span>
                <span className="persona-role-tag">{currentPersona.designation}</span>
              </div>
            </button>

            {showPersonaMenu && (
              <div className="persona-dropdown-menu glass-card">
                <div className="dropdown-header">
                  <User size={14} />
                  <span>Switch MoSPI Trainee Profile</span>
                </div>
                {OFFICIAL_PERSONAS.map(persona => (
                  <div
                    key={persona.id}
                    className={`persona-option ${persona.id === currentPersona.id ? 'selected' : ''}`}
                    onClick={() => {
                      onSelectPersona(persona);
                      setShowPersonaMenu(false);
                    }}
                  >
                    <div className="avatar-badge-sm">{persona.avatar}</div>
                    <div className="option-details">
                      <div className="option-name">{persona.name}</div>
                      <div className="option-cadre">{persona.designation}</div>
                      <div className="option-division">{persona.division}</div>
                    </div>
                    {persona.id === currentPersona.id && (
                      <CheckCircle2 size={16} color="#10B981" className="check-icon" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
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
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #FF671F 0%, #1E3A8A 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(255, 103, 31, 0.3);
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

        .avatar-badge-sm {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--saffron-primary), var(--navy-primary));
          color: #FFF;
          font-weight: 700;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
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
          width: 320px;
          padding: 12px;
          z-index: 100;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-medium);
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .persona-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s;
        }

        .persona-option:hover {
          background: var(--bg-card-hover);
        }

        .persona-option.selected {
          background: rgba(255, 103, 31, 0.1);
          border: 1px solid rgba(255, 103, 31, 0.3);
        }

        .option-details {
          flex: 1;
        }

        .option-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .option-cadre {
          font-size: 0.75rem;
          color: var(--saffron-primary);
        }

        .option-division {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .check-icon {
          flex-shrink: 0;
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

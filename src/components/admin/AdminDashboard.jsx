import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Building,
  Users,
  Download,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Filter,
  ArrowUpRight,
  Clock,
  BookOpen
} from 'lucide-react';
import {
  MINISTRY_OVERVIEW_METRICS,
  DIVISIONS_METRICS,
  PREDICTIVE_CAPACITY_FORECASTS,
  MONTHLY_LEARNING_TREND
} from '../../data/mockAdminData';

export function AdminDashboard({ onNavigateTab }) {
  const [selectedDivision, setSelectedDivision] = useState('ALL');

  const filteredDivisions = selectedDivision === 'ALL'
    ? DIVISIONS_METRICS
    : DIVISIONS_METRICS.filter(d => d.code === selectedDivision);

  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      ministry: 'Ministry of Statistics and Programme Implementation (MoSPI)',
      department: 'Data Informatics & Innovation Division (DIID)',
      overview: MINISTRY_OVERVIEW_METRICS,
      divisions: DIVISIONS_METRICS,
      forecasts: PREDICTIVE_CAPACITY_FORECASTS
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mospi_workforce_competency_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="admin-dashboard-view">
      {/* Header Banner */}
      <div className="admin-header-banner glass-card">
        <div>
          <div className="admin-top-tag">MoSPI DATA INFORMATICS & INNOVATION DIVISION (DIID) & NSSTA</div>
          <h2>Ministry-Wide Workforce Competency Intelligence</h2>
          <p>
            Real-time capacity tracking, division-wise skill heatmaps, iGOT telemetry, and predictive capacity forecasting
          </p>
        </div>

        <div className="admin-header-actions">
          <button className="btn-secondary" onClick={handleExportReport}>
            <Download size={15} />
            <span>Export Audit Report (JSON)</span>
          </button>
        </div>
      </div>

      {/* Top 4 Key Indicator Cards */}
      <div className="admin-kpis-grid grid-4">
        <div className="admin-kpi-card glass-card">
          <div className="kpi-top">
            <span className="kpi-title">Total Cadre Personnel</span>
            <div className="kpi-icon-bubble blue">
              <Users size={17} />
            </div>
          </div>
          <div className="kpi-value">{MINISTRY_OVERVIEW_METRICS.totalOfficers.toLocaleString()}</div>
          <div className="kpi-sub">
            {MINISTRY_OVERVIEW_METRICS.sssOfficers} SSS • {MINISTRY_OVERVIEW_METRICS.issOfficers} ISS • {MINISTRY_OVERVIEW_METRICS.technicalOfficers} Tech
          </div>
        </div>

        <div className="admin-kpi-card glass-card">
          <div className="kpi-top">
            <span className="kpi-title">Workforce Competency Index</span>
            <div className="kpi-icon-bubble green">
              <TrendingUp size={17} />
            </div>
          </div>
          <div className="kpi-value">{MINISTRY_OVERVIEW_METRICS.averageCompetencyIndex}%</div>
          <div className="kpi-sub">
            <span className="growth-tag">+4.2% YoY</span> across all 6 divisions
          </div>
        </div>

        <div className="admin-kpi-card glass-card">
          <div className="kpi-top">
            <span className="kpi-title">Active iGOT Learners (30D)</span>
            <div className="kpi-icon-bubble saffron">
              <BookOpen size={17} />
            </div>
          </div>
          <div className="kpi-value">{MINISTRY_OVERVIEW_METRICS.activeLearnersLast30Days.toLocaleString()}</div>
          <div className="kpi-sub">
            76.5% active participation rate
          </div>
        </div>

        <div className="admin-kpi-card glass-card">
          <div className="kpi-top">
            <span className="kpi-title">Total Learning Hours YTD</span>
            <div className="kpi-icon-bubble purple">
              <Clock size={17} />
            </div>
          </div>
          <div className="kpi-value">{MINISTRY_OVERVIEW_METRICS.totalLearningHoursYTD.toLocaleString()} hrs</div>
          <div className="kpi-sub">
            {MINISTRY_OVERVIEW_METRICS.igotCompletedModules.toLocaleString()} modules completed
          </div>
        </div>
      </div>

      {/* Division Heatmap & Workforce Competency Table */}
      <div className="division-section glass-card">
        <div className="section-header-row">
          <div>
            <h3>Division-Level Competency Heatmap</h3>
            <p>Evaluating FOD, NAD, ESD, SDRD, DIID, and SSD workforce metrics</p>
          </div>

          <div className="division-filter-row">
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="division-select"
            >
              <option value="ALL">All MoSPI Divisions</option>
              {DIVISIONS_METRICS.map(d => (
                <option key={d.code} value={d.code}>{d.code} - {d.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="divisions-grid">
          {filteredDivisions.map(div => {
            const healthColor = div.avgCompetency >= 80 ? '#10B981' : div.avgCompetency >= 70 ? '#38BDF8' : '#F59E0B';

            return (
              <div key={div.code} className="division-card">
                <div className="div-card-top">
                  <div>
                    <div className="div-code-badge">{div.code}</div>
                    <h4 className="div-name">{div.name}</h4>
                    <span className="div-hq">{div.headquarters}</span>
                  </div>
                  <div className="div-score-bubble" style={{ borderColor: healthColor }}>
                    <span className="div-score-val" style={{ color: healthColor }}>{div.avgCompetency}%</span>
                    <span className="div-score-lbl">Index</span>
                  </div>
                </div>

                <div className="div-stats-strip">
                  <div className="div-stat-col">
                    <span className="stat-lbl">Officers</span>
                    <span className="stat-num">{div.officerCount}</span>
                  </div>
                  <div className="div-stat-col">
                    <span className="stat-lbl">iGOT Adoption</span>
                    <span className="stat-num">{div.igotAdoptionRate}%</span>
                  </div>
                  <div className="div-stat-col">
                    <span className="stat-lbl">TPAC Seats</span>
                    <span className="stat-num">{div.nsstaTpacSeatsAllocated}</span>
                  </div>
                </div>

                {/* Strengths & Critical Gaps */}
                <div className="div-competency-chips">
                  <div className="chip-section">
                    <span className="chip-header text-green">Key Strengths:</span>
                    <div className="chips-row">
                      {div.topStrengths.map((s, idx) => (
                        <span key={idx} className="badge badge-green">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="chip-section">
                    <span className="chip-header text-critical">Critical Skill Gaps:</span>
                    <div className="chips-row">
                      {div.criticalGaps.map((g, idx) => (
                        <span key={idx} className="badge badge-critical">{g}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Predictive Capacity Building Analytics (Next 12-24 Months) */}
      <div className="predictive-section glass-card">
        <div className="section-header-row">
          <div className="predictive-title-group">
            <div className="sparkle-bubble">
              <Sparkles size={20} color="#FF671F" />
            </div>
            <div>
              <h3>Predictive Capacity Building Forecasts (2025-2027)</h3>
              <p>Anticipates future skill requirements for upcoming national surveys, revisions & digital mandates</p>
            </div>
          </div>
        </div>

        <div className="forecasts-list">
          {PREDICTIVE_CAPACITY_FORECASTS.map(f => {
            const isCritical = f.riskLevel === 'Critical';
            const isHigh = f.riskLevel === 'High';

            return (
              <div key={f.id} className={`forecast-card ${f.riskLevel.toLowerCase()}`}>
                <div className="forecast-header">
                  <div className="forecast-title-col">
                    <div className="forecast-meta-row">
                      <span className={`badge ${isCritical ? 'badge-critical' : isHigh ? 'badge-moderate' : 'badge-blue'}`}>
                        Risk: {f.riskLevel}
                      </span>
                      <span className="badge badge-saffron">{f.targetTimeline}</span>
                      <span className="demand-text">Target: {f.projectedDemand}</span>
                    </div>
                    <h4 className="milestone-title">{f.milestone}</h4>
                  </div>

                  {/* Readiness Progress */}
                  <div className="forecast-readiness-col">
                    <span className="readiness-label">Current Workforce Readiness</span>
                    <div className="readiness-bar-box">
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${f.currentReadiness}%`,
                            backgroundColor: isCritical ? '#EF4444' : isHigh ? '#F59E0B' : '#38BDF8'
                          }}
                        />
                      </div>
                      <span className="readiness-percentage-num">{f.currentReadiness}%</span>
                    </div>
                  </div>
                </div>

                <div className="forecast-skills-row">
                  <span className="skills-tag-lbl">Required Skills:</span>
                  <div className="skills-pills">
                    {f.primarySkillsNeeded.map((skill, sIdx) => (
                      <span key={sIdx} className="skill-pill">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="forecast-action-row">
                  <strong>Recommended TPAC Strategy:</strong>
                  <span>{f.recommendedAction}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .admin-dashboard-view {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .admin-header-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 30px;
          gap: 20px;
        }

        .admin-top-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--saffron-primary);
          letter-spacing: 0.06em;
          margin-bottom: 4px;
        }

        .admin-kpis-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .admin-kpi-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .kpi-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .kpi-title {
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .kpi-icon-bubble {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kpi-icon-bubble.blue {
          background: rgba(37, 99, 235, 0.15);
          color: #3B82F6;
        }

        .kpi-icon-bubble.green {
          background: rgba(5, 150, 105, 0.15);
          color: #10B981;
        }

        .kpi-icon-bubble.saffron {
          background: rgba(255, 103, 31, 0.15);
          color: #FF671F;
        }

        .kpi-icon-bubble.purple {
          background: rgba(139, 92, 246, 0.15);
          color: #8B5CF6;
        }

        .kpi-value {
          font-size: 1.65rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .kpi-sub {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .growth-tag {
          color: var(--green-light);
          font-weight: 700;
        }

        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .division-select {
          font-size: 0.82rem;
          padding: 8px 12px;
        }

        .divisions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .division-card {
          background: var(--bg-card-solid);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: all 0.2s;
        }

        .division-card:hover {
          border-color: var(--border-medium);
          box-shadow: var(--shadow-md);
        }

        .div-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .div-code-badge {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--saffron-primary);
          letter-spacing: 0.05em;
        }

        .div-name {
          font-size: 0.98rem;
          font-weight: 700;
          line-height: 1.3;
        }

        .div-hq {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .div-score-bubble {
          border: 2px solid;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .div-score-val {
          font-size: 0.85rem;
          font-weight: 800;
          line-height: 1;
        }

        .div-score-lbl {
          font-size: 0.55rem;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .div-stats-strip {
          display: flex;
          justify-content: space-between;
          padding: 8px 10px;
          background: var(--bg-subtle);
          border-radius: var(--radius-sm);
        }

        .div-stat-col {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-lbl {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .stat-num {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .div-competency-chips {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .chip-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .chip-header {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .predictive-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sparkle-bubble {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: rgba(255, 103, 31, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .forecasts-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .forecast-card {
          background: var(--bg-card-solid);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 18px 22px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .forecast-card.critical {
          border-left: 4px solid #EF4444;
        }

        .forecast-card.high {
          border-left: 4px solid #F59E0B;
        }

        .forecast-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .forecast-title-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .forecast-meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .demand-text {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .milestone-title {
          font-size: 1.05rem;
          font-weight: 700;
        }

        .forecast-readiness-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          min-width: 200px;
        }

        .readiness-label {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .readiness-bar-box {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
        }

        .readiness-percentage-num {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          min-width: 36px;
        }

        .forecast-skills-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.78rem;
        }

        .skills-tag-lbl {
          font-weight: 700;
          color: var(--text-muted);
        }

        .skills-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .skill-pill {
          background: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.72rem;
          color: var(--text-secondary);
        }

        .forecast-action-row {
          background: var(--bg-subtle);
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          display: flex;
          gap: 6px;
          color: var(--text-secondary);
        }

        .forecast-action-row strong {
          color: var(--saffron-primary);
        }

        @media (max-width: 1024px) {
          .admin-kpis-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .divisions-grid {
            grid-template-columns: 1fr;
          }
          .forecast-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .forecast-readiness-col {
            align-items: flex-start;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

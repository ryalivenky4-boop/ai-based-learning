import React, { useState, useEffect, useRef } from 'react';
import {
  Radar,
  Filter,
  CheckCircle,
  AlertTriangle,
  Sliders,
  Sparkles,
  ArrowRight,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { COMPETENCIES, DOMAINS, DOMAIN_METADATA, PROFICIENCY_LEVELS } from '../../data/competencyFramework';
import { ROLES_CONFIG } from '../../data/officialProfiles';

export function CompetencyProfile({
  persona,
  gapAnalysis,
  targetRoleKey,
  onSelectTargetRole,
  onUpdateCompetencyScore,
  onNavigateTab
}) {
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('ALL');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState('ALL');
  const canvasRef = useRef(null);

  const { gaps, targetRole, criticalGapsCount, moderateGapsCount, overallReadiness } = gapAnalysis;

  // Render HTML5 Canvas Radar Chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 50;

    // Filter competencies for radar to ensure readability (top 10 key competencies across 4 domains)
    const radarCompetencies = COMPETENCIES.filter((_, idx) => idx % 2 === 0).slice(0, 10);
    const totalAxes = radarCompetencies.length;
    const angleStep = (Math.PI * 2) / totalAxes;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw concentric background grid polygons (Levels 1 to 5)
    for (let level = 1; level <= 5; level++) {
      const levelRadius = (radius / 5) * level;
      ctx.beginPath();
      for (let i = 0; i < totalAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + levelRadius * Math.cos(angle);
        const y = centerY + levelRadius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = level === 5 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = level === 5 ? 1.5 : 1;
      ctx.stroke();

      // Label level
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`L${level}`, centerX + 4, centerY - levelRadius + 10);
    }

    // 2. Draw axis lines and labels
    radarCompetencies.forEach((comp, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();

      // Axis labels
      const labelDistance = radius + 24;
      const lx = centerX + labelDistance * Math.cos(angle);
      const ly = centerY + labelDistance * Math.sin(angle);

      ctx.fillStyle = DOMAIN_METADATA[comp.domain]?.color || '#94A3B8';
      ctx.font = 'bold 9.5px Outfit, sans-serif';
      ctx.textAlign = Math.cos(angle) > 0.1 ? 'left' : Math.cos(angle) < -0.1 ? 'right' : 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(comp.shortName, lx, ly);
    });

    // 3. Draw Target Benchmark Polygon (Translucent Blue)
    ctx.beginPath();
    radarCompetencies.forEach((comp, i) => {
      const target = comp.benchmark[targetRoleKey] || 3;
      const r = (radius / 5) * target;
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Draw Official's Current Profile Polygon (Vibrant Saffron / Green)
    ctx.beginPath();
    radarCompetencies.forEach((comp, i) => {
      const current = persona.competencyScores[comp.id] || 1;
      const r = (radius / 5) * current;
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 103, 31, 0.3)';
    ctx.fill();
    ctx.strokeStyle = '#FF671F';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 5. Draw data points on vertices
    radarCompetencies.forEach((comp, i) => {
      const current = persona.competencyScores[comp.id] || 1;
      const r = (radius / 5) * current;
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FF671F';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }, [persona, targetRoleKey]);

  // Filtered gaps list
  const filteredGaps = gaps.filter(item => {
    const domainMatch = selectedDomainFilter === 'ALL' || item.domain === selectedDomainFilter;
    const severityMatch =
      selectedSeverityFilter === 'ALL' ||
      (selectedSeverityFilter === 'CRITICAL' && item.severity === 'critical') ||
      (selectedSeverityFilter === 'MODERATE' && item.severity === 'moderate') ||
      (selectedSeverityFilter === 'PROFICIENT' && (item.severity === 'proficient' || item.severity === 'exceeds'));
    return domainMatch && severityMatch;
  });

  return (
    <div className="competency-profile-view">
      {/* Header Bar */}
      <div className="profile-header-banner glass-card">
        <div>
          <div className="banner-tag">MoSPI OFFICIAL COMPETENCY INTELLIGENCE</div>
          <h2>Skill-Gap Analysis & Benchmark Mapping</h2>
          <p>
            Evaluated against the National Framework of Roles, Activities and Competencies (FRAC) for Indian Official Statistics
          </p>
        </div>

        {/* Target Benchmark Selector */}
        <div className="role-selector-card">
          <label className="selector-label">Comparing Against Role Target:</label>
          <div className="role-btn-group">
            {Object.values(ROLES_CONFIG).map(r => (
              <button
                key={r.id}
                className={`role-select-chip ${targetRoleKey === r.id ? 'active' : ''}`}
                onClick={() => onSelectTargetRole(r.id)}
              >
                {r.title.split('(')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Radar & Summary Grid */}
      <div className="radar-grid-section grid-2">
        {/* Left: Canvas Radar Chart */}
        <div className="radar-container-card glass-card">
          <div className="radar-card-header">
            <div>
              <h3>Interactive Competency Radar</h3>
              <p>Visual overlay: Trainee Assessed vs. Role Benchmark</p>
            </div>
            <div className="radar-legend">
              <div className="legend-item">
                <span className="legend-indicator saffron" />
                <span>Current ({persona.name.split(' ')[1] || 'Trainee'})</span>
              </div>
              <div className="legend-item">
                <span className="legend-indicator blue dashed" />
                <span>Target ({targetRole.title.split('(')[0]})</span>
              </div>
            </div>
          </div>

          <div className="canvas-wrapper">
            <canvas ref={canvasRef} width={480} height={440} className="radar-canvas" />
          </div>

          <div className="radar-footer-note">
            <span>Outer perimeter: Level 5 (Master/Policy Lead) • Center: Level 0</span>
          </div>
        </div>

        {/* Right: Interactive Skill Adjustment Simulator */}
        <div className="simulator-card glass-card">
          <div className="sim-header">
            <div className="sim-icon-box">
              <Sliders size={20} color="#FF671F" />
            </div>
            <div>
              <h3>Interactive Skill Simulator</h3>
              <p>Simulate competency level adjustments to see readiness impact</p>
            </div>
          </div>

          <div className="sim-metrics-row">
            <div className="sim-metric">
              <span className="metric-title">Target Readiness</span>
              <span className="metric-val">{overallReadiness}%</span>
            </div>
            <div className="sim-metric">
              <span className="metric-title">Critical Gaps</span>
              <span className="metric-val text-critical">{criticalGapsCount}</span>
            </div>
            <div className="sim-metric">
              <span className="metric-title">Moderate Gaps</span>
              <span className="metric-val text-moderate">{moderateGapsCount}</span>
            </div>
          </div>

          {/* Quick Domain Sliders */}
          <div className="sim-sliders-list">
            <h4 className="sliders-section-heading">Active Focus Competencies</h4>
            {gaps.filter(g => g.severity === 'critical' || g.severity === 'moderate').slice(0, 5).map(gapItem => {
              const currentVal = persona.competencyScores[gapItem.competencyId] || 1;
              return (
                <div key={gapItem.competencyId} className="slider-item">
                  <div className="slider-item-top">
                    <span className="slider-name">{gapItem.name}</span>
                    <span className="slider-level-badge">
                      L{currentVal} (Target: L{gapItem.targetLevel})
                    </span>
                  </div>
                  <div className="slider-control-row">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={currentVal}
                      onChange={(e) => onUpdateCompetencyScore(gapItem.competencyId, parseInt(e.target.value))}
                      className="competency-range-slider"
                    />
                    <div className="level-markers">
                      <span>L1</span>
                      <span>L2</span>
                      <span>L3</span>
                      <span>L4</span>
                      <span>L5</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sim-action-box">
            <button className="btn-primary" onClick={() => onNavigateTab('pathway')} style={{ width: '100%' }}>
              <GraduationCap size={16} />
              <span>View Personalized Remedial Courses</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comprehensive Skill Gap Table */}
      <div className="gaps-table-card glass-card">
        <div className="table-header-row">
          <div>
            <h3>Competency Gap Matrix ({filteredGaps.length} Items)</h3>
            <p>Detailed evaluation across all 24 sub-competencies in Official Statistics</p>
          </div>

          {/* Filter Bar */}
          <div className="table-filters">
            {/* Domain Filter */}
            <select
              value={selectedDomainFilter}
              onChange={(e) => setSelectedDomainFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All 4 Domains</option>
              <option value={DOMAINS.STATISTICAL}>Statistical Competencies</option>
              <option value={DOMAINS.TECHNICAL}>Technical & AI</option>
              <option value={DOMAINS.DIGITAL_GOVERNANCE}>Digital Governance</option>
              <option value={DOMAINS.BEHAVIOURAL}>Managerial & Ethics</option>
            </select>

            {/* Severity Filter */}
            <select
              value={selectedSeverityFilter}
              onChange={(e) => setSelectedSeverityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Gaps (Gap ≥ 2)</option>
              <option value="MODERATE">Moderate Gaps (Gap = 1)</option>
              <option value="PROFICIENT">Proficient / Benchmark Met</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="competency-table">
            <thead>
              <tr>
                <th>Competency & Domain</th>
                <th>Current Level</th>
                <th>Role Target</th>
                <th>Gap Status</th>
                <th>Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredGaps.map(item => {
                const isCritical = item.severity === 'critical';
                const isModerate = item.severity === 'moderate';
                const isProficient = item.severity === 'proficient' || item.severity === 'exceeds';

                return (
                  <tr key={item.competencyId} className={`table-row ${item.severity}`}>
                    <td className="col-name">
                      <div className="comp-name-text">{item.name}</div>
                      <div className="comp-domain-pill" style={{ color: item.domainMeta.color }}>
                        {item.domainMeta.shortTitle}
                      </div>
                    </td>
                    <td className="col-level">
                      <span className="level-chip current">Level {item.currentLevel}</span>
                    </td>
                    <td className="col-level">
                      <span className="level-chip target">Level {item.targetLevel}</span>
                    </td>
                    <td className="col-gap">
                      {isCritical && (
                        <span className="badge badge-critical">
                          <AlertTriangle size={12} />
                          Gap: -{item.gap} Levels (Critical)
                        </span>
                      )}
                      {isModerate && (
                        <span className="badge badge-moderate">
                          Gap: -{item.gap} Level
                        </span>
                      )}
                      {isProficient && (
                        <span className="badge badge-green">
                          <CheckCircle size={12} />
                          Benchmark Met
                        </span>
                      )}
                    </td>
                    <td className="col-action">
                      {item.gap > 0 ? (
                        <button
                          className="btn-secondary btn-sm"
                          onClick={() => onNavigateTab('pathway')}
                        >
                          <span>Remediate on iGOT</span>
                          <ArrowRight size={13} />
                        </button>
                      ) : (
                        <span className="proficient-tag">Certified</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .competency-profile-view {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .profile-header-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 30px;
          gap: 20px;
        }

        .banner-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--saffron-primary);
          letter-spacing: 0.06em;
          margin-bottom: 4px;
        }

        .role-selector-card {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .selector-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .role-btn-group {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .role-select-chip {
          padding: 6px 12px;
          border-radius: var(--radius-md);
          font-size: 0.78rem;
          font-weight: 600;
          background: var(--bg-subtle);
          color: var(--text-secondary);
          border: 1px solid var(--border-subtle);
        }

        .role-select-chip:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }

        .role-select-chip.active {
          background: rgba(255, 103, 31, 0.15);
          color: var(--saffron-primary);
          border-color: var(--saffron-primary);
        }

        .radar-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .radar-legend {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.75rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
        }

        .legend-indicator {
          width: 14px;
          height: 3px;
          border-radius: 2px;
        }

        .legend-indicator.saffron {
          background-color: #FF671F;
        }

        .legend-indicator.blue {
          background-color: #38BDF8;
        }

        .canvas-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 0;
        }

        .radar-canvas {
          max-width: 100%;
          height: auto;
        }

        .radar-footer-note {
          text-align: center;
          font-size: 0.72rem;
          color: var(--text-muted);
          padding-top: 8px;
          border-top: 1px solid var(--border-subtle);
        }

        .simulator-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sim-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sim-icon-box {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: rgba(255, 103, 31, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sim-metrics-row {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: var(--bg-card-solid);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .sim-metric {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .metric-title {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .metric-val {
          font-size: 1.25rem;
          font-weight: 800;
        }

        .text-moderate {
          color: #FBBF24;
        }

        .sliders-section-heading {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .sim-sliders-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .slider-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .slider-item-top {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
        }

        .slider-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .slider-level-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--saffron-primary);
        }

        .slider-control-row {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .competency-range-slider {
          width: 100%;
          accent-color: var(--saffron-primary);
          height: 6px;
          cursor: pointer;
        }

        .level-markers {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          color: var(--text-muted);
          padding: 0 2px;
        }

        .sim-action-box {
          margin-top: auto;
          padding-top: 12px;
        }

        .table-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          gap: 16px;
        }

        .table-filters {
          display: flex;
          gap: 10px;
        }

        .filter-select {
          font-size: 0.82rem;
          padding: 8px 12px;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .competency-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .competency-table th {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          padding: 12px 14px;
          border-bottom: 1px solid var(--border-medium);
        }

        .competency-table td {
          padding: 14px;
          border-bottom: 1px solid var(--border-subtle);
          font-size: 0.86rem;
        }

        .table-row:hover {
          background: var(--bg-card-hover);
        }

        .comp-name-text {
          font-weight: 600;
          color: var(--text-primary);
        }

        .comp-domain-pill {
          font-size: 0.72rem;
          font-weight: 600;
          margin-top: 2px;
        }

        .level-chip {
          padding: 3px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 700;
        }

        .level-chip.current {
          background: rgba(255, 103, 31, 0.12);
          color: var(--saffron-primary);
        }

        .level-chip.target {
          background: rgba(37, 99, 235, 0.12);
          color: #60A5FA;
        }

        .proficient-tag {
          font-size: 0.75rem;
          color: var(--green-light);
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .profile-header-banner {
            flex-direction: column;
            align-items: flex-start;
          }
          .role-selector-card {
            align-items: flex-start;
          }
          .table-header-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

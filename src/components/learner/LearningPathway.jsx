import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  PlayCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  Users,
  ShieldCheck,
  Building,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function LearningPathway({
  persona,
  recommendations,
  enrollments,
  onEnrollCourse,
  onCompleteCourse,
  onNavigateTab
}) {
  const [providerFilter, setProviderFilter] = useState('ALL'); // 'ALL' | 'iGOT' | 'NSSTA'
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  const { structuredPathways, recommendedIgot, recommendedNssta } = recommendations;

  const handleSimulateCompletion = (item) => {
    // Trigger festive confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF671F', '#059669', '#2563EB', '#FBBF24']
    });

    onCompleteCourse(item);
  };

  const toggleExpand = (id) => {
    setExpandedCourseId(expandedCourseId === id ? null : id);
  };

  return (
    <div className="learning-pathway-view">
      {/* Header Banner */}
      <div className="pathway-header-banner glass-card">
        <div>
          <div className="pathway-top-tag">INTEGRATED CAPACITY BUILDING PIPELINE</div>
          <h2>Personalized Trainee Pathway</h2>
          <p>
            Bridging <strong>iGOT Karmayogi</strong> digital modules and <strong>NSSTA (Greater Noida) TPAC</strong> approved training calendar
          </p>
        </div>

        {/* Provider Filter Tabs */}
        <div className="pathway-filter-pills">
          <button
            className={`filter-pill ${providerFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setProviderFilter('ALL')}
          >
            All Tracks ({recommendedIgot.length + recommendedNssta.length})
          </button>
          <button
            className={`filter-pill ${providerFilter === 'iGOT' ? 'active' : ''}`}
            onClick={() => setProviderFilter('iGOT')}
          >
            iGOT Karmayogi ({recommendedIgot.length})
          </button>
          <button
            className={`filter-pill ${providerFilter === 'NSSTA' ? 'active' : ''}`}
            onClick={() => setProviderFilter('NSSTA')}
          >
            NSSTA TPAC ({recommendedNssta.length})
          </button>
        </div>
      </div>

      {/* 3-Phase Milestone Roadmap */}
      <div className="phases-container">
        {structuredPathways.map((phase) => {
          // Filter phase items by provider
          const filteredItems = phase.items.filter(item => {
            if (providerFilter === 'ALL') return true;
            return item.type === providerFilter;
          });

          if (filteredItems.length === 0) return null;

          return (
            <div key={phase.phaseNumber} className="phase-card glass-card">
              {/* Phase Header */}
              <div className="phase-header-row">
                <div className="phase-title-group">
                  <span className="phase-step-badge" style={{ backgroundColor: phase.color }}>
                    Phase {phase.phaseNumber}
                  </span>
                  <div>
                    <h3 className="phase-title">{phase.title}</h3>
                    <div className="phase-timeline-text">
                      <span>{phase.timeline}</span>
                      <span className="divider">•</span>
                      <span>~{phase.estimatedHours} Total Training Hours</span>
                    </div>
                  </div>
                </div>
                <span className="badge" style={{ backgroundColor: `${phase.color}20`, color: phase.color, border: `1px solid ${phase.color}40` }}>
                  {phase.badge}
                </span>
              </div>

              <p className="phase-desc">{phase.description}</p>

              {/* Items in this phase */}
              <div className="phase-items-grid">
                {filteredItems.map(item => {
                  const isIgot = item.type === 'iGOT';
                  const isEnrolled = !!enrollments[item.id];
                  const isCompleted = enrollments[item.id]?.status === 'completed';
                  const isExpanded = expandedCourseId === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`course-card ${isCompleted ? 'completed' : ''} ${isIgot ? 'igot-card' : 'nssta-card'}`}
                    >
                      {/* Card Type Ribbon */}
                      <div className="card-ribbon-row">
                        <div className="provider-badge-group">
                          {isIgot ? (
                            <span className="badge badge-green">
                              <GraduationCap size={12} />
                              iGOT Karmayogi Module
                            </span>
                          ) : (
                            <span className="badge badge-saffron">
                              <Calendar size={12} />
                              NSSTA TPAC Programme
                            </span>
                          )}
                          <span className="course-code-text">{item.code}</span>
                        </div>

                        {isCompleted && (
                          <span className="badge badge-green">
                            <CheckCircle2 size={13} />
                            Completed
                          </span>
                        )}
                        {!isCompleted && item.priority === 'High' && (
                          <span className="badge badge-critical">Critical Gap</span>
                        )}
                      </div>

                      {/* Course Title */}
                      <h4 className="course-item-title">{item.title}</h4>

                      {/* Gap Relevance Callout */}
                      <div className="gap-relevance-box">
                        <span className="relevance-label">Skill Target:</span>
                        <span className="relevance-text">{item.relevanceReason}</span>
                      </div>

                      {/* Metadata Row */}
                      <div className="course-meta-tags">
                        {isIgot ? (
                          <>
                            <div className="meta-tag">
                              <Clock size={13} />
                              <span>{item.durationHours} Hours</span>
                            </div>
                            <div className="meta-tag">
                              <Award size={13} />
                              <span>+{item.karmayogiCredits} Karma pts</span>
                            </div>
                            <div className="meta-tag">
                              <Building size={13} />
                              <span>{item.provider}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="meta-tag">
                              <Clock size={13} />
                              <span>{item.durationDays} Days Residential</span>
                            </div>
                            <div className="meta-tag">
                              <MapPin size={13} />
                              <span>{item.venue.split(',')[0]}</span>
                            </div>
                            <div className="meta-tag">
                              <Users size={13} />
                              <span>{item.nominatedCount}/{item.capacity} Nominated</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Accordion Trigger for Syllabus */}
                      <button className="btn-expand-syllabus" onClick={() => toggleExpand(item.id)}>
                        <span>{isExpanded ? 'Hide Syllabus Topics' : 'View Syllabus Topics'}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      {/* Expanded Syllabus */}
                      {isExpanded && (
                        <div className="syllabus-expanded-content">
                          <div className="syllabus-heading">Curriculum Focus:</div>
                          <ul className="syllabus-list">
                            {(item.syllabus || item.syllabusFocus || []).map((point, idx) => (
                              <li key={idx}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action Footer */}
                      <div className="course-card-actions">
                        {isCompleted ? (
                          <div className="completed-state-badge">
                            <CheckCircle2 size={16} color="#10B981" />
                            <span>Competency Verified & Telemetry Synced</span>
                          </div>
                        ) : (
                          <>
                            {isIgot ? (
                              <button
                                className="btn-primary btn-sm"
                                onClick={() => handleSimulateCompletion(item)}
                                title="Simulates completing all modules, boosting your competency level, and syncing with iGOT"
                              >
                                <Sparkles size={14} />
                                <span>Complete & Boost Skill (+1 Level)</span>
                              </button>
                            ) : (
                              <button
                                className="btn-primary btn-sm"
                                onClick={() => handleSimulateCompletion(item)}
                              >
                                <Calendar size={14} />
                                <span>Submit TPAC Nomination</span>
                              </button>
                            )}

                            <button
                              className="btn-secondary btn-sm"
                              onClick={() => onNavigateTab('assessment')}
                              title="Test your mastery of this subject with AI Generated Quizzes"
                            >
                              <span>Take AI Quiz</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .learning-pathway-view {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .pathway-header-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 30px;
          gap: 20px;
        }

        .pathway-top-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--green-primary);
          letter-spacing: 0.06em;
          margin-bottom: 4px;
        }

        .pathway-filter-pills {
          display: flex;
          gap: 8px;
        }

        .filter-pill {
          padding: 8px 14px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          background: var(--bg-subtle);
          color: var(--text-secondary);
          border: 1px solid var(--border-subtle);
          transition: all 0.2s ease;
        }

        .filter-pill:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }

        .filter-pill.active {
          background: rgba(5, 150, 105, 0.15);
          color: var(--green-light);
          border-color: var(--green-light);
        }

        .phases-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .phase-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .phase-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .phase-title-group {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .phase-step-badge {
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 800;
          color: #FFF;
          letter-spacing: 0.04em;
        }

        .phase-title {
          font-size: 1.15rem;
          font-weight: 700;
        }

        .phase-timeline-text {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .phase-desc {
          font-size: 0.86rem;
          color: var(--text-secondary);
        }

        .phase-items-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .course-card {
          background: var(--bg-card-solid);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: all 0.2s ease;
        }

        .course-card:hover {
          border-color: var(--border-medium);
          box-shadow: var(--shadow-md);
        }

        .course-card.igot-card {
          border-top: 3px solid var(--green-primary);
        }

        .course-card.nssta-card {
          border-top: 3px solid var(--saffron-primary);
        }

        .course-card.completed {
          opacity: 0.85;
          background: rgba(5, 150, 105, 0.05);
          border-color: rgba(5, 150, 105, 0.3);
        }

        .card-ribbon-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .provider-badge-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .course-code-text {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
        }

        .course-item-title {
          font-size: 1.02rem;
          font-weight: 700;
          line-height: 1.35;
          color: var(--text-primary);
        }

        .gap-relevance-box {
          background: var(--bg-subtle);
          border-radius: var(--radius-sm);
          padding: 8px 10px;
          font-size: 0.78rem;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .relevance-label {
          font-weight: 700;
          color: var(--saffron-primary);
          font-size: 0.7rem;
          text-transform: uppercase;
        }

        .relevance-text {
          color: var(--text-secondary);
        }

        .course-meta-tags {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .meta-tag {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .btn-expand-syllabus {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--blue-accent);
          font-size: 0.76rem;
          font-weight: 600;
          padding: 4px 0;
          align-self: flex-start;
        }

        .btn-expand-syllabus:hover {
          color: var(--saffron-primary);
        }

        .syllabus-expanded-content {
          background: var(--bg-subtle);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          font-size: 0.78rem;
        }

        .syllabus-heading {
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .syllabus-list {
          padding-left: 18px;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .course-card-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid var(--border-subtle);
        }

        .completed-state-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--green-light);
          font-size: 0.8rem;
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .pathway-header-banner {
            flex-direction: column;
            align-items: flex-start;
          }
          .phase-items-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

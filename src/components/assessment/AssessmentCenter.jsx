import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  UploadCloud,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Flag,
  RotateCcw,
  BookOpen,
  Award,
  ChevronRight,
  Download,
  Edit3,
  Sliders,
  Check,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SAMPLE_MOSPI_DOCUMENTS } from '../../data/sampleMoSPIDocs';
import { generateQuestionsFromContent } from '../../services/quizGenerator';

export function AssessmentCenter({
  persona,
  onUpdateCompetencyScore,
  onNavigateTab,
  presetDocId = null
}) {
  // Navigation tabs inside Assessment Center
  const [activeTab, setActiveTab] = useState('generate'); // 'generate' | 'quiz' | 'result' | 'studio'

  // Generator configuration
  const [selectedDocId, setSelectedDocId] = useState(presetDocId || 'doc_plfs_methodology');
  const [customText, setCustomText] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('All');
  const [bloomLevel, setBloomLevel] = useState('All');
  const [isGenerating, setIsGenerating] = useState(false);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { qIndex: selectedOptionIndex }
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(300); // 5 min
  const timerRef = useRef(null);

  // Result state
  const [quizResult, setQuizResult] = useState(null);

  // Initialize preset document if provided
  useEffect(() => {
    if (presetDocId) {
      setSelectedDocId(presetDocId);
      setIsCustomMode(false);
      handleGenerateQuiz(presetDocId, false);
    }
  }, [presetDocId]);

  // Quiz Timer Countdown
  useEffect(() => {
    if (activeTab === 'quiz' && timeLeftSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTab, timeLeftSeconds]);

  const handleGenerateQuiz = (overrideDocId = null, startImmediately = false) => {
    setIsGenerating(true);
    const docId = overrideDocId || selectedDocId;
    const docMeta = SAMPLE_MOSPI_DOCUMENTS.find(d => d.id === docId);

    setTimeout(() => {
      const generated = generateQuestionsFromContent({
        documentId: isCustomMode ? null : docId,
        rawText: isCustomMode ? customText : (docMeta ? docMeta.content : ''),
        documentTitle: isCustomMode ? 'Custom Uploaded MoSPI Manual' : (docMeta?.title || 'MoSPI Guidelines'),
        questionCount,
        difficulty,
        bloomLevel
      });

      setActiveQuiz(generated);
      setSelectedAnswers({});
      setFlaggedQuestions({});
      setCurrentQIndex(0);
      setTimeLeftSeconds(questionCount * 60); // 1 min per question
      setIsGenerating(false);

      if (startImmediately || overrideDocId) {
        setActiveTab('quiz');
      }
    }, 600);
  };

  const handleSelectOption = (optionIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQIndex]: optionIdx
    }));
  };

  const toggleFlagCurrent = () => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [currentQIndex]: !prev[currentQIndex]
    }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    if (timerRef.current) clearInterval(timerRef.current);

    let correctCount = 0;
    const questionEvaluations = activeQuiz.questions.map((q, idx) => {
      const chosen = selectedAnswers[idx];
      const isCorrect = chosen === q.correctIndex;
      if (isCorrect) correctCount++;

      return {
        question: q,
        chosenIndex: chosen,
        isCorrect,
        correctIndex: q.correctIndex
      };
    });

    const scorePercentage = Math.round((correctCount / activeQuiz.questions.length) * 100);
    const passed = scorePercentage >= 60;

    // Trigger celebration confetti if passed
    if (passed) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#059669', '#FF671F', '#2563EB', '#F59E0B']
      });
    }

    setQuizResult({
      quizTitle: activeQuiz.quizTitle,
      totalQuestions: activeQuiz.questions.length,
      correctCount,
      scorePercentage,
      passed,
      evaluations: questionEvaluations,
      completedAt: new Date().toLocaleTimeString()
    });

    setActiveTab('result');
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="assessment-center-view">
      {/* Top Banner */}
      <div className="assessment-header-banner glass-card">
        <div>
          <div className="assessment-tag">AI-POWERED INTELLIGENT ASSESSMENT ENGINE</div>
          <h2>Document-to-Quiz Generator & Testing Studio</h2>
          <p>
            Dynamically generates objective MCQs, comprehensive rationales, and Bloom's Taxonomy evaluations from uploaded MoSPI learning materials
          </p>
        </div>

        {/* Studio Navigation Pills */}
        <div className="assessment-nav-pills">
          <button
            className={`assessment-pill ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
          >
            <Sparkles size={14} />
            <span>Generate Assessment</span>
          </button>

          {activeQuiz && (
            <button
              className={`assessment-pill ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz')}
            >
              <Clock size={14} />
              <span>Active Quiz ({formatTimer(timeLeftSeconds)})</span>
            </button>
          )}

          {quizResult && (
            <button
              className={`assessment-pill ${activeTab === 'result' ? 'active' : ''}`}
              onClick={() => setActiveTab('result')}
            >
              <Award size={14} />
              <span>Scorecard ({quizResult.scorePercentage}%)</span>
            </button>
          )}

          {activeQuiz && (
            <button
              className={`assessment-pill ${activeTab === 'studio' ? 'active' : ''}`}
              onClick={() => setActiveTab('studio')}
            >
              <Edit3 size={14} />
              <span>Trainer Studio</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: GENERATE ASSESSMENT */}
      {activeTab === 'generate' && (
        <div className="generator-grid grid-2">
          {/* Left: Document Source Selector */}
          <div className="doc-selector-card glass-card">
            <div className="card-top-row">
              <h3>1. Select or Upload MoSPI Learning Material</h3>
              <div className="source-toggle">
                <button
                  className={`toggle-sub-btn ${!isCustomMode ? 'active' : ''}`}
                  onClick={() => setIsCustomMode(false)}
                >
                  MoSPI Manuals
                </button>
                <button
                  className={`toggle-sub-btn ${isCustomMode ? 'active' : ''}`}
                  onClick={() => setIsCustomMode(true)}
                >
                  Custom Upload / Text
                </button>
              </div>
            </div>

            {!isCustomMode ? (
              <div className="preset-docs-list">
                {SAMPLE_MOSPI_DOCUMENTS.map(doc => {
                  const isSelected = selectedDocId === doc.id;
                  return (
                    <div
                      key={doc.id}
                      className={`preset-doc-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedDocId(doc.id)}
                    >
                      <div className="doc-icon-col">
                        <FileText size={20} color={isSelected ? '#FF671F' : '#94A3B8'} />
                      </div>
                      <div className="doc-info-col">
                        <div className="doc-title">{doc.title}</div>
                        <div className="doc-meta">
                          <span>{doc.author}</span>
                          <span className="divider">•</span>
                          <span>{doc.category}</span>
                        </div>
                      </div>
                      {isSelected && <Check size={18} color="#FF671F" />}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="custom-upload-zone">
                <div className="dropzone-box">
                  <UploadCloud size={32} color="#FF671F" />
                  <p>Drag and drop MoSPI report (PDF, DOCX, TXT) or paste raw text</p>
                  <small>Text will be processed using semantic NLP to extract key rules & definitions</small>
                </div>
                <textarea
                  className="custom-text-area"
                  rows={8}
                  placeholder="Paste excerpt of survey guidelines, National Accounts notes, or circulars here..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Right: AI Generation Parameters */}
          <div className="ai-params-card glass-card">
            <h3>2. AI Assessment Parameters</h3>
            <p>Configure evaluation depth, Bloom's cognitive taxonomy, and length</p>

            <div className="params-form">
              {/* Question Count */}
              <div className="param-field">
                <label className="param-label">Number of Objective Questions</label>
                <div className="param-chips-group">
                  {[3, 5, 10].map(cnt => (
                    <button
                      key={cnt}
                      className={`param-chip ${questionCount === cnt ? 'active' : ''}`}
                      onClick={() => setQuestionCount(cnt)}
                    >
                      {cnt} Questions
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="param-field">
                <label className="param-label">Difficulty Spectrum</label>
                <div className="param-chips-group">
                  {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
                    <button
                      key={diff}
                      className={`param-chip ${difficulty === diff ? 'active' : ''}`}
                      onClick={() => setDifficulty(diff)}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bloom's Taxonomy */}
              <div className="param-field">
                <label className="param-label">Bloom's Taxonomy Focus</label>
                <div className="param-chips-group">
                  {['All', 'Remembering', 'Understanding', 'Applying', 'Analyzing'].map(bloom => (
                    <button
                      key={bloom}
                      className={`param-chip ${bloomLevel === bloom ? 'active' : ''}`}
                      onClick={() => setBloomLevel(bloom)}
                    >
                      {bloom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary of Selection */}
              <div className="param-summary-box">
                <div className="summary-line">
                  <BookOpen size={14} color="#FF671F" />
                  <span>
                    Source: {isCustomMode ? 'Custom Uploaded Material' : SAMPLE_MOSPI_DOCUMENTS.find(d => d.id === selectedDocId)?.title}
                  </span>
                </div>
                <div className="summary-line">
                  <Clock size={14} color="#38BDF8" />
                  <span>Estimated Duration: {questionCount} Minutes ({questionCount} MCQs)</span>
                </div>
                <div className="summary-line">
                  <Award size={14} color="#10B981" />
                  <span>Karma Credits Upon Pass: +{questionCount * 10} Points</span>
                </div>
              </div>

              {/* Generate Button */}
              <button
                className={`btn-primary btn-generate ${isGenerating ? 'generating' : ''}`}
                onClick={() => handleGenerateQuiz(null, true)}
                disabled={isGenerating || (isCustomMode && !customText.trim())}
              >
                <Sparkles size={18} className={isGenerating ? 'spin-anim' : ''} />
                <span>{isGenerating ? 'Analyzing Material & Generating MCQs...' : 'Generate & Launch Assessment'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE TIMED QUIZ PLAYER */}
      {activeTab === 'quiz' && activeQuiz && (
        <div className="quiz-player-container glass-card">
          {/* Quiz Player Header */}
          <div className="quiz-top-bar">
            <div>
              <div className="quiz-doc-name">{activeQuiz.quizTitle}</div>
              <div className="question-tracker">
                Question {currentQIndex + 1} of {activeQuiz.questions.length}
              </div>
            </div>

            <div className="quiz-controls-right">
              {/* Timer */}
              <div className={`countdown-box ${timeLeftSeconds < 60 ? 'urgent' : ''}`}>
                <Clock size={16} />
                <span>{formatTimer(timeLeftSeconds)}</span>
              </div>

              {/* Flag Button */}
              <button
                className={`btn-flag ${flaggedQuestions[currentQIndex] ? 'flagged' : ''}`}
                onClick={toggleFlagCurrent}
                title="Flag question for review"
              >
                <Flag size={15} />
                <span>{flaggedQuestions[currentQIndex] ? 'Flagged' : 'Flag'}</span>
              </button>
            </div>
          </div>

          {/* Question Navigator Palette */}
          <div className="palette-strip">
            {activeQuiz.questions.map((_, idx) => {
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isCurrent = currentQIndex === idx;
              const isFlagged = flaggedQuestions[idx];

              return (
                <button
                  key={idx}
                  className={`palette-num-btn ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''} ${isFlagged ? 'flagged' : ''}`}
                  onClick={() => setCurrentQIndex(idx)}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Question Body */}
          {(() => {
            const currentQ = activeQuiz.questions[currentQIndex];
            if (!currentQ) return null;

            return (
              <div className="question-content-box">
                {/* Question Tags */}
                <div className="q-tags-row">
                  <span className="badge badge-saffron">{currentQ.difficulty}</span>
                  <span className="badge badge-blue">Bloom: {currentQ.bloomTaxonomy}</span>
                  <span className="badge badge-purple">{currentQ.competencyName}</span>
                </div>

                <h3 className="q-question-text">{currentQ.question}</h3>

                {/* 4 Radio Options */}
                <div className="q-options-list">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQIndex] === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={`q-option-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectOption(optIdx)}
                      >
                        <div className="option-radio-circle">
                          {isSelected && <div className="radio-dot" />}
                        </div>
                        <div className="option-letter">{String.fromCharCode(65 + optIdx)}.</div>
                        <div className="option-text">{opt}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Quiz Action Footer */}
          <div className="quiz-footer-actions">
            <button
              className="btn-secondary"
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex(prev => prev - 1)}
            >
              Previous
            </button>

            <div className="footer-middle-info">
              <span>{Object.keys(selectedAnswers).length} of {activeQuiz.questions.length} Answered</span>
            </div>

            {currentQIndex < activeQuiz.questions.length - 1 ? (
              <button
                className="btn-primary"
                onClick={() => setCurrentQIndex(prev => prev + 1)}
              >
                <span>Next Question</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                className="btn-success"
                onClick={handleSubmitQuiz}
              >
                <CheckCircle size={16} />
                <span>Submit Assessment</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: QUIZ RESULT SCORECARD & REMEDIAL PATHWAY */}
      {activeTab === 'result' && quizResult && (
        <div className="result-container glass-card">
          {/* Result Hero Banner */}
          <div className={`result-hero ${quizResult.passed ? 'pass' : 'fail'}`}>
            <div className="result-status-col">
              <span className={`badge ${quizResult.passed ? 'badge-green' : 'badge-critical'}`}>
                {quizResult.passed ? 'ASSESSMENT PASSED' : 'REMEDIATION RECOMMENDED'}
              </span>
              <h2>{quizResult.scorePercentage}% Score Achieved</h2>
              <p>
                {quizResult.correctCount} out of {quizResult.totalQuestions} questions answered correctly.
                {quizResult.passed
                  ? ' Congratulations! You demonstrated strong conceptual clarity in this official statistics domain.'
                  : ' You did not meet the 60% benchmark. Review the explanations below and proceed to targeted remedial modules.'}
              </p>
            </div>

            <div className="result-actions-col">
              <button className="btn-secondary" onClick={() => handleGenerateQuiz(null, true)}>
                <RotateCcw size={15} />
                <span>Retake Quiz</span>
              </button>
              <button className="btn-primary" onClick={() => onNavigateTab('pathway')}>
                <BookOpen size={15} />
                <span>Open Remedial Pathway</span>
              </button>
            </div>
          </div>

          {/* Question-by-Question Diagnostic Review */}
          <div className="review-section">
            <h3>Diagnostic Question Review with Authoritative Explanations</h3>
            <div className="review-list">
              {quizResult.evaluations.map((item, idx) => {
                const { question, chosenIndex, isCorrect, correctIndex } = item;

                return (
                  <div key={idx} className={`review-card ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="review-card-header">
                      <div className="header-left">
                        {isCorrect ? (
                          <CheckCircle size={18} color="#10B981" />
                        ) : (
                          <XCircle size={18} color="#EF4444" />
                        )}
                        <span className="q-num">Question {idx + 1}</span>
                        <span className="badge badge-purple">{question.competencyName}</span>
                      </div>
                      <span className={`status-pill ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    <h4 className="review-question-text">{question.question}</h4>

                    {/* Options Review */}
                    <div className="review-options">
                      {question.options.map((opt, optIdx) => {
                        let optClass = '';
                        if (optIdx === correctIndex) optClass = 'correct-opt';
                        else if (optIdx === chosenIndex && !isCorrect) optClass = 'wrong-opt';

                        return (
                          <div key={optIdx} className={`review-opt-item ${optClass}`}>
                            <span className="opt-letter">{String.fromCharCode(65 + optIdx)}.</span>
                            <span className="opt-text">{opt}</span>
                            {optIdx === correctIndex && <span className="opt-badge">Correct Answer</span>}
                            {optIdx === chosenIndex && !isCorrect && <span className="opt-badge wrong">Your Answer</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation & Official Source Citation */}
                    <div className="explanation-box">
                      <div className="exp-heading">Conceptual Rationale & Official Citation:</div>
                      <p className="exp-text">{question.explanation}</p>
                      <div className="source-citation">
                        <strong>Source:</strong> {question.sourceCitation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRAINER / INSTRUCTOR STUDIO */}
      {activeTab === 'studio' && activeQuiz && (
        <div className="studio-container glass-card">
          <div className="studio-header">
            <div>
              <h3>Trainer Assessment Studio & Export</h3>
              <p>Review, edit, add questions, or export assessment package for NSSTA classrooms</p>
            </div>
            <div className="studio-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeQuiz, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `mospi_assessment_${Date.now()}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
              >
                <Download size={15} />
                <span>Export QTI/JSON Assessment</span>
              </button>
            </div>
          </div>

          <div className="studio-questions-list">
            {activeQuiz.questions.map((q, idx) => (
              <div key={idx} className="studio-question-card glass-card">
                <div className="studio-card-top">
                  <span className="badge badge-saffron">Q{idx + 1}</span>
                  <span className="badge badge-blue">{q.bloomTaxonomy}</span>
                  <span className="badge badge-green">Correct: {String.fromCharCode(65 + q.correctIndex)}</span>
                </div>
                <div className="studio-q-text">{q.question}</div>
                <div className="studio-options-grid">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className={`studio-opt-box ${oIdx === q.correctIndex ? 'correct' : ''}`}>
                      <strong>{String.fromCharCode(65 + oIdx)}:</strong> {opt}
                    </div>
                  ))}
                </div>
                <div className="studio-citation">
                  <strong>Citation:</strong> {q.sourceCitation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .assessment-center-view {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .assessment-header-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 30px;
          gap: 20px;
        }

        .assessment-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--saffron-primary);
          letter-spacing: 0.06em;
          margin-bottom: 4px;
        }

        .assessment-nav-pills {
          display: flex;
          gap: 8px;
        }

        .assessment-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          font-weight: 600;
          background: var(--bg-subtle);
          color: var(--text-secondary);
          border: 1px solid var(--border-subtle);
        }

        .assessment-pill:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }

        .assessment-pill.active {
          background: rgba(255, 103, 31, 0.15);
          color: var(--saffron-primary);
          border-color: var(--saffron-primary);
        }

        .card-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .source-toggle {
          display: flex;
          background: var(--bg-subtle);
          border-radius: var(--radius-md);
          padding: 3px;
        }

        .toggle-sub-btn {
          padding: 4px 10px;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
        }

        .toggle-sub-btn.active {
          background: var(--bg-card-solid);
          color: var(--text-primary);
          box-shadow: var(--shadow-sm);
        }

        .preset-docs-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .preset-doc-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          background: var(--bg-card-solid);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s;
        }

        .preset-doc-item:hover {
          border-color: var(--border-medium);
          background: var(--bg-card-hover);
        }

        .preset-doc-item.selected {
          border-color: var(--saffron-primary);
          background: rgba(255, 103, 31, 0.08);
        }

        .doc-info-col {
          flex: 1;
        }

        .doc-title {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .doc-meta {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-top: 2px;
          display: flex;
          gap: 6px;
        }

        .custom-upload-zone {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dropzone-box {
          border: 2px dashed var(--border-medium);
          border-radius: var(--radius-md);
          padding: 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: var(--bg-subtle);
        }

        .custom-text-area {
          width: 100%;
          resize: vertical;
          font-size: 0.82rem;
        }

        .params-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 16px;
        }

        .param-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .param-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .param-chips-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .param-chip {
          padding: 6px 12px;
          border-radius: var(--radius-md);
          font-size: 0.78rem;
          font-weight: 600;
          background: var(--bg-subtle);
          color: var(--text-secondary);
          border: 1px solid var(--border-subtle);
        }

        .param-chip.active {
          background: rgba(255, 103, 31, 0.15);
          color: var(--saffron-primary);
          border-color: var(--saffron-primary);
        }

        .param-summary-box {
          background: var(--bg-card-solid);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .summary-line {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .btn-generate {
          width: 100%;
          padding: 12px;
          font-size: 0.95rem;
        }

        .quiz-player-container {
          padding: 24px 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .quiz-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .quiz-doc-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .question-tracker {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .quiz-controls-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .countdown-box {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-md);
          background: var(--bg-subtle);
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--text-primary);
          border: 1px solid var(--border-medium);
        }

        .countdown-box.urgent {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
          border-color: #EF4444;
          animation: pulseGlow 1s infinite;
        }

        .btn-flag {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: var(--radius-md);
          font-size: 0.78rem;
          font-weight: 600;
          background: var(--bg-subtle);
          color: var(--text-secondary);
          border: 1px solid var(--border-subtle);
        }

        .btn-flag.flagged {
          background: rgba(245, 158, 11, 0.15);
          color: #F59E0B;
          border-color: #F59E0B;
        }

        .palette-strip {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .palette-num-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          background: var(--bg-subtle);
          color: var(--text-secondary);
          border: 1px solid var(--border-subtle);
        }

        .palette-num-btn.answered {
          background: rgba(5, 150, 105, 0.15);
          color: var(--green-light);
          border-color: var(--green-light);
        }

        .palette-num-btn.flagged {
          border-color: #F59E0B;
          color: #F59E0B;
        }

        .palette-num-btn.current {
          outline: 2px solid var(--saffron-primary);
          outline-offset: 1px;
        }

        .question-content-box {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 10px 0;
        }

        .q-tags-row {
          display: flex;
          gap: 8px;
        }

        .q-question-text {
          font-size: 1.2rem;
          font-weight: 700;
          line-height: 1.4;
        }

        .q-options-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .q-option-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          background: var(--bg-card-solid);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s;
        }

        .q-option-item:hover {
          border-color: var(--border-medium);
          background: var(--bg-card-hover);
        }

        .q-option-item.selected {
          border-color: var(--saffron-primary);
          background: rgba(255, 103, 31, 0.1);
        }

        .option-radio-circle {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid var(--border-medium);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .q-option-item.selected .option-radio-circle {
          border-color: var(--saffron-primary);
        }

        .radio-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--saffron-primary);
        }

        .option-letter {
          font-weight: 700;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .option-text {
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .quiz-footer-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid var(--border-subtle);
        }

        .footer-middle-info {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .result-container {
          padding: 24px 30px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .result-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-medium);
        }

        .result-hero.pass {
          background: rgba(5, 150, 105, 0.1);
          border-color: rgba(5, 150, 105, 0.3);
        }

        .result-hero.fail {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
        }

        .result-status-col h2 {
          font-size: 1.8rem;
          margin-top: 6px;
        }

        .result-status-col p {
          font-size: 0.88rem;
          margin-top: 4px;
          max-width: 600px;
        }

        .result-actions-col {
          display: flex;
          gap: 10px;
        }

        .review-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .review-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .review-card {
          background: var(--bg-card-solid);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .review-card.correct {
          border-left: 4px solid var(--green-primary);
        }

        .review-card.incorrect {
          border-left: 4px solid #EF4444;
        }

        .review-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .q-num {
          font-weight: 700;
          font-size: 0.9rem;
        }

        .status-pill {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }

        .status-pill.correct {
          background: rgba(5, 150, 105, 0.15);
          color: var(--green-light);
        }

        .status-pill.incorrect {
          background: rgba(239, 68, 68, 0.15);
          color: #F87171;
        }

        .review-question-text {
          font-size: 1.05rem;
          font-weight: 700;
        }

        .review-options {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .review-opt-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          background: var(--bg-subtle);
        }

        .review-opt-item.correct-opt {
          background: rgba(5, 150, 105, 0.15);
          border: 1px solid rgba(5, 150, 105, 0.3);
          color: var(--green-light);
          font-weight: 600;
        }

        .review-opt-item.wrong-opt {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #F87171;
          font-weight: 600;
        }

        .opt-badge {
          margin-left: auto;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--green-light);
        }

        .opt-badge.wrong {
          color: #F87171;
        }

        .explanation-box {
          background: var(--bg-subtle);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          font-size: 0.82rem;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .exp-heading {
          font-weight: 700;
          color: var(--saffron-primary);
        }

        .source-citation {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .studio-container {
          padding: 24px 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .studio-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .studio-questions-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .studio-question-card {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .studio-card-top {
          display: flex;
          gap: 8px;
        }

        .studio-q-text {
          font-weight: 700;
          font-size: 0.95rem;
        }

        .studio-options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .studio-opt-box {
          padding: 8px 10px;
          background: var(--bg-subtle);
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
        }

        .studio-opt-box.correct {
          background: rgba(5, 150, 105, 0.12);
          border: 1px solid rgba(5, 150, 105, 0.25);
          color: var(--green-light);
        }

        .studio-citation {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          .assessment-header-banner {
            flex-direction: column;
            align-items: flex-start;
          }
          .assessment-nav-pills {
            flex-wrap: wrap;
          }
          .generator-grid {
            grid-template-columns: 1fr;
          }
          .result-hero {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .studio-options-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

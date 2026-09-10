import React, { useState, useRef, useEffect } from 'react';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  BookOpen,
  Code2,
  HelpCircle,
  PlayCircle,
  ThumbsUp,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

const PRESET_QUERIES = [
  {
    title: 'GVA vs GDP in SNA 2008',
    prompt: 'Explain the difference between GVA at basic prices and GDP at market prices under SNA 2008.'
  },
  {
    title: 'PLFS Rotational Sampling',
    prompt: 'How does the rotational panel sampling design work in the Periodic Labour Force Survey (PLFS)?'
  },
  {
    title: 'Python for Survey Microdata',
    prompt: 'Show me a Python pandas snippet to load and apply sampling weights to MoSPI unit-record data.'
  },
  {
    title: 'ASI Schedule Scrutiny Rules',
    prompt: 'What are the essential field scrutiny balance checks for Block C (Fixed Assets) in the Annual Survey of Industries (ASI)?'
  },
  {
    title: 'SDMX Metadata Standards',
    prompt: 'How does SDMX enable machine-readable data dissemination for MoSPI economic indicators?'
  }
];

const INITIAL_MESSAGES = [
  {
    id: 'welcome',
    sender: 'ai',
    timestamp: 'Just now',
    text: `Namaste! I am **StatSahayak (सांख्यिकी सहायक)**, your AI Statistical Copilot for India's Official Statistical System.

I can help you with:
- **Statistical Methodologies:** PLFS, National Accounts (SNA 2008/2025), ASI, CPI, and Survey Sampling.
- **Data Science Tools:** Python for microdata, R for complex survey estimation, QGIS, and SQL.
- **Karmayogi Guidance:** Recommending the exact iGOT micro-course or NSSTA TPAC workshop to bridge your competency gaps.

Choose a topic below or type your question:`,
    relatedCourseId: null
  }
];

export function StatSahayakChat({ onNavigateTab, onStartQuizWithDoc }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend = null) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Simulate specialized statistical AI reasoning
    setTimeout(() => {
      const response = generateAIStatisticalResponse(query);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 800);
  };

  const generateAIStatisticalResponse = (query) => {
    const q = query.toLowerCase();
    let reply = '';
    let relatedCourse = null;
    let quizDocId = null;

    if (q.includes('gva') || q.includes('gdp') || q.includes('national accounts') || q.includes('sna')) {
      reply = `### Gross Value Added (GVA) at Basic Prices vs GDP at Market Prices (SNA 2008)

Under the **System of National Accounts (SNA 2008)** adopted by MoSPI's National Accounts Division (NAD):

1. **GVA at Basic Prices:** Measures the production activity of individual industries/sectors:
   $$\\text{GVA at Basic Prices} = \\text{Gross Output} - \\text{Intermediate Consumption}$$
   *Basic Price* is what the producer receives, minus any product taxes payable (e.g. GST), plus any product subsidies receivable.

2. **GDP at Market Prices:** The headline aggregate for the entire domestic economy:
   $$\\mathbf{GDP\\text{ at Market Prices}} = \\sum \\text{GVA at Basic Prices} + \\text{Product Taxes} - \\text{Product Subsidies}$$

3. **Production Taxes vs Product Taxes:**
   - **Production Taxes:** Paid regardless of output volume (e.g., Land Revenue, Stamp Registration, Professional Tax). These are included in Basic Prices.
   - **Product Taxes:** Paid directly per unit of output/sale (GST, Petroleum Excise, Customs). These convert GVA to GDP at market prices.`;
      relatedCourse = {
        title: 'System of National Accounts (SNA 2008) & GVA Compilation',
        code: 'IGOT-STAT-002',
        provider: 'NAD - MoSPI'
      };
      quizDocId = 'doc_national_accounts_gva';
    } else if (q.includes('plfs') || q.includes('rotational') || q.includes('labour') || q.includes('cws')) {
      reply = `### Rotational Panel Sampling in the Periodic Labour Force Survey (PLFS)

In urban areas, MoSPI's Survey Design and Research Division (SDRD) implements a **rotational panel sampling design**:

- **Quarterly Dynamics:** Each selected Urban Frame Survey (UFS) block is visited four times:
  - Visit 1: Initial survey of 8 sample households.
  - Visit 2, 3, 4: Successive visits in the next 3 consecutive quarters.
- **75% Overlap:** In every quarter, 75% of the sample households are retained from the previous quarter, while 25% are freshly drawn. This yields high statistical precision for quarterly changes while avoiding respondent fatigue.
- **Current Weekly Status (CWS):** A person is counted as employed if they worked for at least **1 hour on any single day** during the 7 days preceding the survey.`;
      relatedCourse = {
        title: 'Periodic Labour Force Survey (PLFS): Indicators & Microdata Analysis',
        code: 'IGOT-STAT-004',
        provider: 'MoSPI & VV Giri NLI'
      };
      quizDocId = 'doc_plfs_methodology';
    } else if (q.includes('python') || q.includes('pandas') || q.includes('code') || q.includes('script')) {
      reply = `### Python Microdata Processing with Sampling Multipliers

Here is an authentic MoSPI Python snippet for processing survey microdata using **Pandas** and applying sampling weights:

\`\`\`python
import pandas as pd
import numpy as np

# 1. Load unit-record survey data (e.g., PLFS or ASI text extraction)
df = pd.read_csv('plfs_person_level_microdata.csv')

# 2. Inspect sampling multipliers (Weights)
# In MoSPI datasets, Weight = Multiplier / 100
df['weight'] = df['MULT'] / 100.0

# 3. Calculate Weighted Worker Population Ratio (WPR)
# Activity status codes 11-51 represent employed persons
df['is_employed'] = df['activity_status_cws'].isin(range(11, 52)).astype(int)

# 4. Weighted aggregation across domains
weighted_employed = np.sum(df['is_employed'] * df['weight'])
weighted_population = np.sum(df['weight'])

wpr = (weighted_employed / weighted_population) * 100
print(f"All-India Weighted WPR (CWS): {wpr:.2f}%")
\`\`\`

You can run this on your local machine or through MoSPI DIID's secure Jupyter analytical workbench.`;
      relatedCourse = {
        title: 'Python for Official Statistics: Microdata Processing with Pandas',
        code: 'IGOT-TECH-001',
        provider: 'DIID - MoSPI'
      };
    } else if (q.includes('asi') || q.includes('block c') || q.includes('factory') || q.includes('industries')) {
      reply = `### Annual Survey of Industries (ASI): Block C Field Scrutiny Balance Check

Under the Collection of Statistics Act 2008, when inspecting factory balance sheets in **Block C (Fixed Assets)**, field supervisors must verify:

$$\\text{Opening Gross Value} + \\text{Additions during Year} - \\text{Deductions/Disposals} = \\mathbf{\\text{Closing Gross Value}}$$

**Key Audit Checks:**
1. **Depreciation:** Verify depreciation against Income Tax or Companies Act schedules.
   $$\\text{Closing Net Value} = \\text{Closing Gross Value} - \\text{Cumulative Depreciation}$$
2. **Net Value Added (NVA):**
   $$\\text{NVA} = \\text{Gross Output} - \\text{Total Inputs} - \\text{Depreciation}$$
3. **Primary NIC Code Check:** Ensure 5-digit National Industrial Classification (NIC-2008) reflects the product contributing $>50\\%$ of total turnover.`;
      relatedCourse = {
        title: 'Annual Survey of Industries (ASI): Factory Accounting & Scrutiny',
        code: 'IGOT-STAT-005',
        provider: 'ESD - MoSPI'
      };
      quizDocId = 'doc_asi_scrutiny_manual';
    } else {
      reply = `### Official Statistics Clarification

Regarding your query on **"${query}"**:

In the Indian Official Statistical System (MoSPI), standard protocols mandate strict compliance with:
- **Collection of Statistics Act 2008** for respondent confidentiality and statutory powers.
- **National Data Quality Assurance Framework (NDQAF)** across the six dimensions: Relevance, Accuracy, Timeliness, Accessibility, Coherence, and Credibility.
- **UN Fundamental Principles of Official Statistics** guaranteeing professional independence and impartiality.

Would you like me to recommend the specific iGOT Karmayogi module or NSSTA workshop mapped to this competency?`;
      relatedCourse = {
        title: 'Data Quality Assurance Framework (DQAF) & SDMX Standards',
        code: 'IGOT-STAT-007',
        provider: 'DIID - MoSPI'
      };
    }

    return {
      id: `ai_${Date.now()}`,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: reply,
      relatedCourse,
      quizDocId
    };
  };

  return (
    <div className="stat-sahayak-view">
      {/* Header Banner */}
      <div className="sahayak-header-banner glass-card">
        <div className="sahayak-brand-group">
          <div className="sahayak-avatar-box">
            <BotMessageSquare size={24} color="#FF671F" />
          </div>
          <div>
            <div className="sahayak-tag">AI-POWERED VIRTUAL ASSISTANT FOR INDIAN OFFICIAL STATISTICS</div>
            <h2>Karmayogi StatSahayak (सांख्यिकी सहायक)</h2>
            <p>
              Trained on MoSPI survey manuals, SNA 2008, National Indicator Framework, and statistical computing
            </p>
          </div>
        </div>

        <div className="sahayak-badge-online">
          <span className="pulse-indicator" />
          <span>LLM Copilot Online</span>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="chat-container glass-card">
        {/* Preset Prompt Chips */}
        <div className="preset-prompts-bar">
          <span className="preset-lbl">Suggested Inquiries:</span>
          <div className="preset-chips-list">
            {PRESET_QUERIES.map((item, idx) => (
              <button
                key={idx}
                className="preset-chip"
                onClick={() => handleSend(item.prompt)}
              >
                <span>{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div className="messages-thread">
          {messages.map(msg => {
            const isAI = msg.sender === 'ai';

            return (
              <div key={msg.id} className={`message-row ${isAI ? 'ai' : 'user'}`}>
                {isAI && (
                  <div className="ai-avatar-small">
                    <Sparkles size={14} color="#FF671F" />
                  </div>
                )}

                <div className="message-bubble-col">
                  <div className={`message-bubble ${isAI ? 'ai-bubble' : 'user-bubble'}`}>
                    <div className="message-text" style={{ whiteSpace: 'pre-wrap' }}>
                      {msg.text}
                    </div>

                    {/* Deep-link Action Banner inside AI responses */}
                    {isAI && msg.relatedCourse && (
                      <div className="related-course-card">
                        <div className="related-info">
                          <BookOpen size={15} color="#059669" />
                          <div>
                            <div className="rel-course-code">{msg.relatedCourse.code} • {msg.relatedCourse.provider}</div>
                            <div className="rel-course-title">{msg.relatedCourse.title}</div>
                          </div>
                        </div>
                        <button className="btn-secondary btn-sm" onClick={() => onNavigateTab('pathway')}>
                          <span>Open on iGOT</span>
                        </button>
                      </div>
                    )}

                    {isAI && msg.quizDocId && (
                      <div className="quiz-trigger-bar">
                        <button
                          className="btn-primary btn-sm"
                          onClick={() => onStartQuizWithDoc(msg.quizDocId)}
                        >
                          <PlayCircle size={14} />
                          <span>Test Mastery with 5-Question AI Quiz</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="msg-timestamp">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="message-row ai">
              <div className="ai-avatar-small">
                <Sparkles size={14} color="#FF671F" />
              </div>
              <div className="message-bubble ai-bubble typing-bubble">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="chat-input-bar">
          <input
            type="text"
            className="chat-input"
            placeholder="Ask about PLFS, GDP compilation, ASI checks, Python scripts, or iGOT competencies..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button
            className="btn-primary btn-send"
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
          >
            <Send size={16} />
            <span>Send</span>
          </button>
        </div>
      </div>

      <style>{`
        .stat-sahayak-view {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .sahayak-header-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 30px;
          gap: 20px;
        }

        .sahayak-brand-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .sahayak-avatar-box {
          width: 46px;
          height: 46px;
          border-radius: var(--radius-md);
          background: rgba(255, 103, 31, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sahayak-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--saffron-primary);
          letter-spacing: 0.06em;
          margin-bottom: 4px;
        }

        .sahayak-badge-online {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          background: rgba(5, 150, 105, 0.12);
          color: var(--green-light);
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid rgba(5, 150, 105, 0.25);
        }

        .chat-container {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 240px);
          min-height: 520px;
          padding: 0;
          overflow: hidden;
        }

        .preset-prompts-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          background: var(--bg-subtle);
          border-bottom: 1px solid var(--border-subtle);
          overflow-x: auto;
        }

        .preset-lbl {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .preset-chips-list {
          display: flex;
          gap: 8px;
        }

        .preset-chip {
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          background: var(--bg-card-solid);
          color: var(--text-secondary);
          border: 1px solid var(--border-subtle);
          white-space: nowrap;
          transition: all 0.2s;
        }

        .preset-chip:hover {
          color: var(--saffron-primary);
          border-color: var(--saffron-primary);
          background: var(--bg-card-hover);
        }

        .messages-thread {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .message-row {
          display: flex;
          gap: 12px;
          max-width: 82%;
        }

        .message-row.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message-row.ai {
          align-self: flex-start;
        }

        .ai-avatar-small {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255, 103, 31, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .message-bubble-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .message-bubble {
          padding: 14px 18px;
          border-radius: var(--radius-lg);
          font-size: 0.88rem;
          line-height: 1.5;
        }

        .user-bubble {
          background: linear-gradient(135deg, var(--saffron-primary) 0%, var(--saffron-dark) 100%);
          color: #FFFFFF;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 14px var(--saffron-glow);
        }

        .ai-bubble {
          background: var(--bg-card-solid);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          border-bottom-left-radius: 4px;
        }

        .msg-timestamp {
          font-size: 0.68rem;
          color: var(--text-muted);
          padding: 0 4px;
        }

        .message-row.user .msg-timestamp {
          text-align: right;
        }

        .related-course-card {
          margin-top: 12px;
          padding: 10px 14px;
          background: var(--bg-subtle);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .related-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .rel-course-code {
          font-size: 0.68rem;
          font-family: var(--font-mono);
          color: var(--green-light);
        }

        .rel-course-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .quiz-trigger-bar {
          margin-top: 10px;
        }

        .typing-bubble {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 18px;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--saffron-primary);
          animation: typingPulse 1.2s infinite ease-in-out;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typingPulse {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        .chat-input-bar {
          display: flex;
          gap: 12px;
          padding: 14px 20px;
          background: var(--bg-card-solid);
          border-top: 1px solid var(--border-subtle);
        }

        .chat-input {
          flex: 1;
          font-size: 0.9rem;
        }

        .btn-send {
          padding: 0 20px;
        }

        @media (max-width: 900px) {
          .sahayak-header-banner {
            flex-direction: column;
            align-items: flex-start;
          }
          .message-row {
            max-width: 95%;
          }
        }
      `}</style>
    </div>
  );
}

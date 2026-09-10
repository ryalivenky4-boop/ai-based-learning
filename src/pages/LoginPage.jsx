import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Lock, Mail, Eye, EyeOff, Building2, Sparkles, ArrowRight,
  ShieldCheck, AlertCircle, Loader2, CheckCircle2, Award, BookOpen
} from 'lucide-react';
import { loginUser } from '../services/apiClient';

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const registeredSuccessMsg = location.state?.message;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginUser(email, password);
      if (res.success && res.user) {
        if (onLoginSuccess) {
          onLoginSuccess(res.user);
        }
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('venkatesh.kumar@mospi.gov.in');
    setPassword('Password@123');
    setError(null);
  };

  return (
    <div className="login-page-container">
      {/* Indian National Tricolor Ribbon */}
      <div className="tricolor-stripe" />

      <div className="login-inner-grid">
        {/* Left Side: National Branding & Capacity Building Showcase */}
        <div className="login-brand-panel">
          <div className="brand-header-badge">
            <span className="gov-badge">GOVERNMENT OF INDIA</span>
            <span className="dot-sep">•</span>
            <span className="mospi-badge">MoSPI • DIID</span>
            <span className="dot-sep">•</span>
            <span className="karmayogi-badge">iGOT KARMAYOGI</span>
          </div>

          <div className="brand-hero-title">
            <div className="emblem-box">
              <img src="/logo.png" alt="Skill Bridge-Ai Logo" className="brand-logo-img" />
            </div>
            <div>
              <h1 className="main-app-title">
                Skill Bridge<span className="title-accent">-Ai</span>
              </h1>
              <div className="sub-app-title">AI Competency Intelligence & Capacity Building</div>
            </div>
          </div>


          <p className="brand-description">
            AI-enabled competency intelligence and personalized training platform for India’s Official Statistical System. Strengthen capacity across national accounts, sample surveys, microdata governance, and modern AI/ML methodologies.
          </p>

          {/* Pillars List */}
          <div className="brand-pillars-list">
            <div className="pillar-item">
              <div className="pillar-icon bg-saffron-soft">
                <Sparkles size={18} color="#FF671F" />
              </div>
              <div>
                <div className="pillar-title">AI Competency Gap Mapping</div>
                <div className="pillar-desc">Autonomous comparison of current capabilities against target cadre benchmarks</div>
              </div>
            </div>

            <div className="pillar-item">
              <div className="pillar-icon bg-green-soft">
                <BookOpen size={18} color="#059669" />
              </div>
              <div>
                <div className="pillar-title">Curated iGOT Karmayogi & NSSTA Pathways</div>
                <div className="pillar-desc">Tailored government training recommendations synchronized with official workflows</div>
              </div>
            </div>

            <div className="pillar-item">
              <div className="pillar-icon bg-blue-soft">
                <Award size={18} color="#2563EB" />
              </div>
              <div>
                <div className="pillar-title">Document-to-Quiz AI Generation</div>
                <div className="pillar-desc">Automated Bloom’s Taxonomy MCQ synthesis from MoSPI manuals and circulars</div>
              </div>
            </div>
          </div>

          <div className="brand-footer-note">
            <ShieldCheck size={16} color="#059669" />
            <span>Aligned with the National Programme for Civil Services Capacity Building (NPCSCB)</span>
          </div>
        </div>

        {/* Right Side: Clean Login Form */}
        <div className="login-form-panel">
          <div className="login-card glass-card">
            <div className="form-heading">
              <h2>Officer Sign In</h2>
              <p>Enter your credentials to access your personalized capacity building dashboard.</p>
            </div>

            {registeredSuccessMsg && (
              <div className="success-banner animate-fadeIn">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>{registeredSuccessMsg}</span>
              </div>
            )}

            {error && (
              <div className="error-banner animate-fadeIn">
                <AlertCircle size={16} className="text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Official Email / Gmail Address</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. officer.name@mospi.gov.in"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-with-action">
                  <label htmlFor="password">Password</label>
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot Password?
                  </Link>
                </div>
                <div className="input-with-icon">
                  <Lock size={16} className="input-icon" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Sample Quickfill button for convenience */}
              <div className="quickfill-row">
                <span className="text-muted-xs">Testing credentials:</span>
                <button type="button" onClick={handleQuickFill} className="btn-quickfill">
                  Fill Verified Officer Account
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary-auth"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="spin-anim" />
                    <span>Verifying Officer Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Skill Bridge-Ai</span>
                    <ArrowRight size={18} />
                  </>

                )}
              </button>
            </form>

            <div className="form-footer-switch">
              <span>Don't have an account?</span>
              <Link to="/register" className="switch-link">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-page-container {
          min-height: 100vh;
          background: var(--bg-main);
          display: flex;
          flex-direction: column;
          color: var(--text-primary);
          position: relative;
        }

        .tricolor-stripe {
          height: 4px;
          background: linear-gradient(90deg, #FF671F 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #046A38 66.66%);
          width: 100%;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 100;
        }

        .login-inner-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          min-height: 100vh;
          max-width: 1440px;
          margin: 0 auto;
          width: 100%;
          padding: 32px;
          gap: 48px;
          align-items: center;
        }

        .login-brand-panel {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 24px;
        }

        .brand-header-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .gov-badge { color: #FF8547; }
        .mospi-badge { color: var(--text-secondary); }
        .karmayogi-badge { color: #10B981; }
        .dot-sep { color: var(--border-medium); }

        .brand-hero-title {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .emblem-box {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 4px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
        }

        .brand-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }


        .main-app-title {
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .title-accent {
          color: #FF671F;
        }

        .sub-app-title {
          font-size: 0.95rem;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        .brand-description {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        .brand-pillars-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pillar-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 12px 16px;
          background: var(--bg-card-solid);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .pillar-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .bg-saffron-soft { background: rgba(255, 103, 31, 0.12); }
        .bg-green-soft { background: rgba(5, 150, 105, 0.12); }
        .bg-blue-soft { background: rgba(37, 99, 235, 0.12); }

        .pillar-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .pillar-desc {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 2px;
          line-height: 1.4;
        }

        .brand-footer-note {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.76rem;
          color: var(--text-muted);
          padding-top: 8px;
        }

        /* Right Form Panel */
        .login-form-panel {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .login-card {
          width: 100%;
          max-width: 460px;
          padding: 36px 32px;
          border-radius: var(--radius-lg);
          background: var(--bg-card-solid);
          border: 1px solid var(--border-medium);
          box-shadow: var(--shadow-xl);
        }

        .form-heading h2 {
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .form-heading p {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-top: 6px;
          margin-bottom: 20px;
          line-height: 1.4;
        }

        .success-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          border-radius: var(--radius-md);
          color: #10B981;
          font-size: 0.82rem;
          margin-bottom: 18px;
        }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.35);
          border-radius: var(--radius-md);
          color: #EF4444;
          font-size: 0.82rem;
          margin-bottom: 18px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .label-with-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .forgot-link {
          font-size: 0.75rem;
          color: #3B82F6;
          text-decoration: none;
          font-weight: 500;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-with-icon input {
          width: 100%;
          padding: 10px 14px 10px 38px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-medium);
          background: var(--bg-subtle);
          color: var(--text-primary);
          font-size: 0.88rem;
          transition: all 0.2s;
        }

        .input-with-icon input:focus {
          outline: none;
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .toggle-password-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
        }

        .toggle-password-btn:hover {
          color: var(--text-primary);
        }

        .quickfill-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          padding: 2px 0;
        }

        .text-muted-xs {
          color: var(--text-muted);
        }

        .btn-quickfill {
          background: none;
          border: none;
          color: #3B82F6;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }

        .btn-primary-auth {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%);
          color: #FFF;
          font-size: 0.92rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
        }

        .btn-primary-auth:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
        }

        .btn-primary-auth:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spin-anim {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .form-footer-switch {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
          padding-top: 18px;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        .switch-link {
          color: #FF671F;
          font-weight: 700;
          text-decoration: none;
        }

        .switch-link:hover {
          text-decoration: underline;
        }

        /* Responsiveness */
        @media (max-width: 980px) {
          .login-inner-grid {
            grid-template-columns: 1fr;
            padding: 24px 16px;
            gap: 32px;
          }
          .login-brand-panel {
            padding: 8px;
            text-align: center;
            align-items: center;
          }
          .brand-hero-title {
            justify-content: center;
          }
          .brand-pillars-list {
            display: none;
          }
          .login-card {
            padding: 28px 20px;
          }
        }
      `}</style>
    </div>
  );
}

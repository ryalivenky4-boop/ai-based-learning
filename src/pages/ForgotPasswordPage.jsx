import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="forgot-page-container">
      {/* Indian National Tricolor Ribbon */}
      <div className="tricolor-stripe" />

      <div className="forgot-card glass-card">
        <div className="brand-header">
          <div className="emblem-box">
            <img src="/logo.png" alt="Skill Bridge-Ai Logo" className="brand-logo-img" />
          </div>
          <div>
            <h2 className="title">Skill Bridge<span className="accent">-Ai</span></h2>
            <div className="subtitle">Official Password Recovery</div>
          </div>
        </div>


        {submitted ? (
          <div className="success-content animate-fadeIn">
            <div className="success-icon-box">
              <CheckCircle2 size={36} color="#10B981" />
            </div>
            <h3>Password Reset Request Received</h3>
            <p>
              If an account with <strong>{email}</strong> exists in the MoSPI database, official recovery instructions and a secure temporary passkey have been generated.
            </p>
            <p className="contact-help">
              For immediate administrative assistance, contact the DIID IT Helpdesk at <span className="text-blue">ithelpdesk@mospi.gov.in</span>.
            </p>
            <Link to="/login" className="btn-back-login">
              <ArrowLeft size={16} />
              <span>Return to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="forgot-form animate-fadeIn">
            <div className="form-info">
              <h3>Forgot Your Password?</h3>
              <p>
                Enter your registered official email or Gmail address and we will initiate password reset protocols for your officer account.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="recovery-email">Official Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  id="recovery-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. officer@mospi.gov.in"
                />
              </div>
            </div>

            <button type="submit" className="btn-submit">
              <Send size={16} />
              <span>Send Recovery Instructions</span>
            </button>

            <div className="back-row">
              <Link to="/login" className="back-link">
                <ArrowLeft size={14} />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .forgot-page-container {
          min-height: 100vh;
          background: var(--bg-main);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          color: var(--text-primary);
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

        .forgot-card {
          width: 100%;
          max-width: 480px;
          padding: 36px 32px;
          border-radius: var(--radius-lg);
          background: var(--bg-card-solid);
          border: 1px solid var(--border-medium);
          box-shadow: var(--shadow-xl);
        }

        .brand-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding-bottom: 18px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .emblem-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 2px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .brand-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }


        .title {
          font-size: 1.3rem;
          font-weight: 800;
          line-height: 1.1;
        }

        .accent { color: #FF671F; }
        .subtitle { font-size: 0.78rem; color: var(--text-muted); margin-top: 2px; }

        .form-info h3 { font-size: 1.25rem; font-weight: 800; }
        .form-info p { font-size: 0.82rem; color: var(--text-secondary); margin-top: 6px; margin-bottom: 20px; line-height: 1.4; }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 20px;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
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

        .btn-submit {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%);
          color: #FFF;
          font-size: 0.88rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
        }

        .btn-submit:hover { transform: translateY(-1px); }

        .back-row {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: var(--text-muted);
          text-decoration: none;
        }

        .back-link:hover { color: var(--text-primary); text-decoration: underline; }

        .success-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .success-icon-box {
          margin-bottom: 4px;
        }

        .success-content h3 {
          font-size: 1.25rem;
          font-weight: 800;
        }

        .success-content p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .contact-help {
          font-size: 0.78rem !important;
          color: var(--text-muted) !important;
        }

        .text-blue { color: #3B82F6; }

        .btn-back-login {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: var(--radius-md);
          background: var(--bg-subtle);
          border: 1px solid var(--border-medium);
          color: var(--text-primary);
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          margin-top: 12px;
          transition: all 0.2s;
        }

        .btn-back-login:hover {
          background: var(--bg-card-hover);
        }
      `}</style>
    </div>
  );
}

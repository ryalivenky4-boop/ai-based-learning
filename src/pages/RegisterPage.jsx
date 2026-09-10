import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Lock, Eye, EyeOff, Briefcase, Building2,
  Award, Target, Sparkles, CheckCircle2, ArrowRight, ArrowLeft,
  AlertCircle, Loader2, ShieldCheck, Check
} from 'lucide-react';
import { registerUser } from '../services/apiClient';

const AVAILABLE_SKILLS = [
  'Survey Sampling & Field Methodologies',
  'System of National Accounts (SNA 2008)',
  'Python for Statistical Analysis',
  'SQL & Relational Databases',
  'GIS & Spatial Analytics',
  'Data Quality & Governance (DQAF)',
  'Price Statistics & Index Numbers (CPI/IIP)',
  'Labour Market Statistics (PLFS)',
  'AI & Machine Learning in Surveys',
  'Civil Service Conduct Rules & Ethics'
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    jobRole: 'Senior Statistical Officer',
    department: 'National Accounts Division (NAD)',
    organization: 'MoSPI, Government of India',
    experienceLevel: 'Intermediate',
    careerGoal: 'Advance statistical analysis, national accounts, and machine learning capacity',
    selectedSkills: ['Survey Sampling & Field Methodologies', 'Data Quality & Governance (DQAF)'],
    targetSkills: ['System of National Accounts (SNA 2008)', 'Python for Statistical Analysis']
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const toggleSkill = (skill) => {
    setFormData(prev => {
      const exists = prev.selectedSkills.includes(skill);
      return {
        ...prev,
        selectedSkills: exists
          ? prev.selectedSkills.filter(s => s !== skill)
          : [...prev.selectedSkills, skill]
      };
    });
  };

  const toggleTargetSkill = (skill) => {
    setFormData(prev => {
      const exists = prev.targetSkills.includes(skill);
      return {
        ...prev,
        targetSkills: exists
          ? prev.targetSkills.filter(s => s !== skill)
          : [...prev.targetSkills, skill]
      };
    });
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) return 'Full Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const validateStep2 = () => {
    if (!formData.jobRole) return 'Please select a job role';
    if (!formData.department) return 'Please select a department';
    return null;
  };

  const validateStep3 = () => {
    if (formData.selectedSkills.length === 0) return 'Please select at least 1 current skill';
    if (formData.targetSkills.length === 0) return 'Please select at least 1 target skill to learn';
    return null;
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) { setError(err); return; }
      setStep(3);
    } else if (step === 3) {
      const err = validateStep3();
      if (err) { setError(err); return; }
      setStep(4);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        full_name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone_number: formData.phone.trim() || null,
        password: formData.password,
        job_role: formData.jobRole,
        department: formData.department,
        organization: formData.organization,
        experience_level: formData.experienceLevel,
        career_goal: formData.careerGoal,
        skills: formData.selectedSkills.map(s => ({
          skill_name: s,
          proficiency_level: formData.experienceLevel,
          proficiency_score: formData.experienceLevel === 'Advanced' ? 70 : formData.experienceLevel === 'Expert' ? 85 : 45
        })),
        target_skills: formData.targetSkills.map(s => ({
          skill_name: s,
          priority: 'High'
        }))
      };

      const res = await registerUser(payload);
      if (res.success) {
        // Redirect to Login page per the preferred flow: Registration -> Login -> Dashboard
        navigate('/login', {
          state: {
            message: 'Account created successfully in MySQL! Please sign in with your credentials to enter your dashboard.'
          }
        });
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please verify the information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-container">
      {/* Indian National Tricolor Ribbon */}
      <div className="tricolor-stripe" />

      <div className="register-inner-wrapper">
        {/* Header Ribbon */}
        <div className="register-brand-header">
          <div className="brand-header-badge">
            <span className="gov-badge">GOVERNMENT OF INDIA</span>
            <span className="dot-sep">•</span>
            <span className="mospi-badge">MoSPI • DIID</span>
            <span className="dot-sep">•</span>
            <span className="karmayogi-badge">iGOT KARMAYOGI</span>
          </div>

          <div className="brand-row">
            <div className="emblem-box">
              <img src="/logo.png" alt="Skill Bridge-Ai Logo" className="brand-logo-img" />
            </div>
            <div>
              <h1 className="register-title">
                Skill Bridge<span className="title-accent">-Ai</span>
              </h1>
              <div className="register-subtitle">New Officer Capacity Building Profile Registration</div>
            </div>
          </div>
        </div>

        {/* Multi-Step Card */}
        <div className="register-card glass-card">
          {/* Step Progress Bar */}
          <div className="step-progress-row">
            {[
              { num: 1, label: 'Account' },
              { num: 2, label: 'Professional' },
              { num: 3, label: 'Skills' },
              { num: 4, label: 'Review' }
            ].map(s => (
              <div key={s.num} className={`step-node ${step === s.num ? 'active' : step > s.num ? 'completed' : ''}`}>
                <div className="step-circle">
                  {step > s.num ? <Check size={14} /> : s.num}
                </div>
                <span className="step-label">{s.label}</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="error-banner animate-fadeIn">
              <AlertCircle size={16} className="text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: ACCOUNT INFORMATION */}
          {step === 1 && (
            <div className="step-content animate-fadeIn">
              <div className="step-heading">
                <h3>Step 1: Account Information</h3>
                <p>Provide your personal details and create your official login credentials.</p>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Full Name & Designation *</label>
                  <div className="input-with-icon">
                    <User size={16} className="input-icon" />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      placeholder="e.g. Smt. Ananya Sharma"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Official Email Address / Gmail *</label>
                  <div className="input-with-icon">
                    <Mail size={16} className="input-icon" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="officer.email@mospi.gov.in"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number (Optional)</label>
                  <div className="input-with-icon">
                    <Phone size={16} className="input-icon" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Create Password *</label>
                  <div className="input-with-icon">
                    <Lock size={16} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="Min. 6 characters"
                    />
                    <button
                      type="button"
                      className="toggle-password-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group col-span-2">
                  <label>Confirm Password *</label>
                  <div className="input-with-icon">
                    <Lock size={16} className="input-icon" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="Re-enter password to confirm"
                    />
                    <button
                      type="button"
                      className="toggle-password-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <div />
                <button type="button" onClick={handleNext} className="btn-next">
                  <span>Next: Professional Information</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PROFESSIONAL INFORMATION */}
          {step === 2 && (
            <div className="step-content animate-fadeIn">
              <div className="step-heading">
                <h3>Step 2: Professional Information</h3>
                <p>Provide your cadre, posting, and capacity building career focus.</p>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Job Role / Cadre *</label>
                  <div className="input-with-icon">
                    <Briefcase size={16} className="input-icon" />
                    <select
                      value={formData.jobRole}
                      onChange={(e) => handleChange('jobRole', e.target.value)}
                    >
                      <option value="Junior Statistical Officer">Junior Statistical Officer (JSO - SSS)</option>
                      <option value="Senior Statistical Officer">Senior Statistical Officer (SSO - SSS)</option>
                      <option value="Assistant Director">Assistant Director (ISS - Group A)</option>
                      <option value="Deputy Director">Deputy Director (ISS - Group A)</option>
                      <option value="Data Informatics Officer">Data Informatics Officer (DIID)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Department / Division *</label>
                  <div className="input-with-icon">
                    <Building2 size={16} className="input-icon" />
                    <select
                      value={formData.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                    >
                      <option value="National Accounts Division (NAD)">National Accounts Division (NAD)</option>
                      <option value="Field Operations Division (FOD)">Field Operations Division (FOD)</option>
                      <option value="Economic Statistics Division (ESD)">Economic Statistics Division (ESD)</option>
                      <option value="Data Informatics & Innovation Division (DIID)">DIID - Innovation & AI Wing</option>
                      <option value="Survey Design & Research Division (SDRD)">Survey Design & Research Division (SDRD)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Organization</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => handleChange('organization', e.target.value)}
                    placeholder="MoSPI / State DES"
                  />
                </div>

                <div className="form-group">
                  <label>Experience Level</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => handleChange('experienceLevel', e.target.value)}
                  >
                    <option value="Beginner">Entry Level (0 - 2 Years)</option>
                    <option value="Intermediate">Mid-Career Officer (3 - 7 Years)</option>
                    <option value="Advanced">Senior Practitioner (8 - 15 Years)</option>
                    <option value="Expert">Leadership / Specialist (15+ Years)</option>
                  </select>
                </div>

                <div className="form-group col-span-2">
                  <label>Career / Upskilling Goal</label>
                  <input
                    type="text"
                    value={formData.careerGoal}
                    onChange={(e) => handleChange('careerGoal', e.target.value)}
                    placeholder="e.g. Master AI data validation and advance to Assistant Director"
                  />
                </div>
              </div>

              <div className="step-actions">
                <button type="button" onClick={() => setStep(1)} className="btn-back">
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button type="button" onClick={handleNext} className="btn-next">
                  <span>Next: Skills & Learning Goals</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SKILLS & LEARNING GOALS */}
          {step === 3 && (
            <div className="step-content animate-fadeIn">
              <div className="step-heading">
                <h3>Step 3: Skills & Competency Goals</h3>
                <p>Declare your current capabilities and the target competencies you want to acquire.</p>
              </div>

              {/* Current Skills */}
              <div className="skills-section">
                <div className="skills-section-header">
                  <Award size={16} className="text-emerald-500" />
                  <h4>1. Current Skills (Select all that apply)</h4>
                </div>
                <div className="skills-chip-grid">
                  {AVAILABLE_SKILLS.map(skill => {
                    const active = formData.selectedSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`skill-chip ${active ? 'active-current' : ''}`}
                      >
                        <span>{skill}</span>
                        {active && <CheckCircle2 size={14} className="chip-check" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Skills */}
              <div className="skills-section mt-4">
                <div className="skills-section-header">
                  <Target size={16} className="text-sky-500" />
                  <h4>2. Target Skills You Want to Learn (AI Gap Analysis)</h4>
                </div>
                <div className="skills-chip-grid">
                  {AVAILABLE_SKILLS.map(skill => {
                    const active = formData.targetSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleTargetSkill(skill)}
                        className={`skill-chip ${active ? 'active-target' : ''}`}
                      >
                        <span>{skill}</span>
                        {active && <Sparkles size={14} className="chip-check" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="step-actions">
                <button type="button" onClick={() => setStep(2)} className="btn-back">
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button type="button" onClick={handleNext} className="btn-next">
                  <span>Next: Review & Submit</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & CREATE ACCOUNT */}
          {step === 4 && (
            <div className="step-content animate-fadeIn">
              <div className="step-heading">
                <h3>Step 4: Review Your Registration</h3>
                <p>Confirm your official profile before saving permanently to the MySQL database.</p>
              </div>

              <div className="review-summary-card">
                <div className="review-item">
                  <span className="review-label">Officer Name:</span>
                  <span className="review-val font-bold">{formData.fullName}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Email:</span>
                  <span className="review-val">{formData.email}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Cadre / Role:</span>
                  <span className="review-val text-saffron">{formData.jobRole}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Department:</span>
                  <span className="review-val">{formData.department}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Current Skills:</span>
                  <span className="review-val">{formData.selectedSkills.join(', ')}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Target Skills:</span>
                  <span className="review-val text-sky">{formData.targetSkills.join(', ')}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Career Goal:</span>
                  <span className="review-val">{formData.careerGoal}</span>
                </div>
              </div>

              <div className="notice-box">
                <ShieldCheck size={18} color="#059669" className="shrink-0" />
                <span>
                  Passwords are securely hashed via bcrypt. Upon creation, Gemini AI will analyze your competency gap deltas and curate tailored iGOT Karmayogi recommendations.
                </span>
              </div>

              <div className="step-actions">
                <button type="button" onClick={() => setStep(3)} className="btn-back">
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-submit-reg"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="spin-anim" />
                      <span>Creating Account in MySQL...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account & Establish Profile</span>
                      <CheckCircle2 size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="form-footer-switch">
            <span>Already have an account?</span>
            <Link to="/login" className="switch-link">
              Login to Skill Bridge-Ai
            </Link>

          </div>
        </div>
      </div>

      <style>{`
        .register-page-container {
          min-height: 100vh;
          background: var(--bg-main);
          color: var(--text-primary);
          padding: 32px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
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

        .register-inner-wrapper {
          width: 100%;
          max-width: 820px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 12px;
        }

        .register-brand-header {
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-align: center;
          align-items: center;
        }

        .brand-header-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .gov-badge { color: #FF8547; }
        .mospi-badge { color: var(--text-secondary); }
        .karmayogi-badge { color: #10B981; }
        .dot-sep { color: var(--border-medium); }

        .brand-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .emblem-box {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 3px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
        }

        .brand-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }


        .register-title {
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .title-accent { color: #FF671F; }

        .register-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .register-card {
          padding: 32px;
          border-radius: var(--radius-lg);
          background: var(--bg-card-solid);
          border: 1px solid var(--border-medium);
          box-shadow: var(--shadow-xl);
        }

        .step-progress-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          position: relative;
        }

        .step-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          flex: 1;
          position: relative;
          color: var(--text-muted);
        }

        .step-node:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 14px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: var(--border-medium);
          z-index: 1;
        }

        .step-node.completed:not(:last-child)::after {
          background: #10B981;
        }

        .step-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--bg-subtle);
          border: 2px solid var(--border-medium);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          z-index: 2;
          transition: all 0.2s;
        }

        .step-node.active .step-circle {
          background: #2563EB;
          border-color: #2563EB;
          color: #FFF;
          box-shadow: 0 0 10px rgba(37, 99, 235, 0.4);
        }

        .step-node.completed .step-circle {
          background: #10B981;
          border-color: #10B981;
          color: #FFF;
        }

        .step-node.active .step-label {
          color: var(--text-primary);
          font-weight: 700;
        }

        .step-label {
          font-size: 0.75rem;
          font-weight: 500;
        }

        .step-heading {
          margin-bottom: 20px;
        }

        .step-heading h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .step-heading p {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .col-span-2 {
          grid-column: span 2;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.78rem;
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
          pointer-events: none;
        }

        .input-with-icon input,
        .input-with-icon select,
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 9px 12px 9px 38px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-medium);
          background: var(--bg-subtle);
          color: var(--text-primary);
          font-size: 0.85rem;
          transition: all 0.2s;
        }

        .form-group input:not(.input-with-icon input),
        .form-group select:not(.input-with-icon select) {
          padding-left: 12px;
        }

        .input-with-icon input:focus,
        .input-with-icon select:focus,
        .form-group input:focus,
        .form-group select:focus {
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

        .skills-section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .skills-section-header h4 {
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .skills-chip-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .skill-chip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-medium);
          background: var(--bg-subtle);
          color: var(--text-secondary);
          font-size: 0.78rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .skill-chip:hover {
          border-color: var(--border-strong);
        }

        .skill-chip.active-current {
          background: rgba(16, 185, 129, 0.12);
          border-color: #10B981;
          color: #10B981;
          font-weight: 600;
        }

        .skill-chip.active-target {
          background: rgba(14, 165, 233, 0.12);
          border-color: #0EA5E9;
          color: #0EA5E9;
          font-weight: 600;
        }

        .review-summary-card {
          padding: 18px;
          background: var(--bg-subtle);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 16px;
        }

        .review-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 6px;
        }

        .review-label {
          color: var(--text-muted);
          font-weight: 600;
          min-width: 140px;
        }

        .review-val {
          color: var(--text-primary);
          text-align: right;
        }

        .text-saffron { color: #FF8547; font-weight: 700; }
        .text-sky { color: #0EA5E9; font-weight: 600; }

        .notice-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.78rem;
          line-height: 1.4;
          margin-bottom: 20px;
        }

        .step-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 24px;
          gap: 12px;
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: var(--radius-md);
          background: var(--bg-subtle);
          border: 1px solid var(--border-medium);
          color: var(--text-primary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-back:hover {
          background: var(--bg-card-hover);
        }

        .btn-next {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%);
          color: #FFF;
          font-size: 0.85rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .btn-next:hover {
          transform: translateY(-1px);
        }

        .btn-submit-reg {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 24px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, #059669 0%, #10B981 100%);
          color: #FFF;
          font-size: 0.9rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
          transition: all 0.2s;
        }

        .btn-submit-reg:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .btn-submit-reg:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
          margin-bottom: 16px;
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

        @media (max-width: 768px) {
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
          .col-span-2 {
            grid-column: span 1;
          }
          .skills-chip-grid {
            grid-template-columns: 1fr;
          }
          .register-card {
            padding: 24px 16px;
          }
          .step-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

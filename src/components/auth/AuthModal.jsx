import React, { useState } from 'react';
import {
  Lock, Mail, User, Phone, Briefcase, Building2, Target,
  Award, Sparkles, CheckCircle2, ArrowRight, X, AlertCircle, Loader2
} from 'lucide-react';
import { loginUser, registerUser } from '../../services/apiClient';

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

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [step, setStep] = useState(1); // For multi-step registration
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
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
    careerGoal: 'Master AI-driven statistical compilations and SNA digital asset accounting',
    selectedSkills: ['Survey Sampling & Field Methodologies', 'Data Quality & Governance (DQAF)'],
    targetSkills: ['System of National Accounts (SNA 2008)', 'Python for Statistical Analysis']
  });

  if (!isOpen) return null;

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginUser(formData.email, formData.password);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phone || null,
        password: formData.password,
        job_role: formData.jobRole,
        department: formData.department,
        organization: formData.organization,
        experience_level: formData.experienceLevel,
        career_goal: formData.careerGoal,
        skills: formData.selectedSkills.map(s => ({
          skill_name: s,
          proficiency_level: formData.experienceLevel,
          proficiency_score: formData.experienceLevel === 'Advanced' ? 70 : 45
        })),
        target_skills: formData.targetSkills.map(s => ({
          skill_name: s,
          priority: 'High'
        }))
      };

      const res = await registerUser(payload);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-xl">
              स
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
                MoSPI Capacity Building & Karmayogi Portal
              </div>
              <h2 className="text-xl font-bold text-white">
                {mode === 'login' ? 'Officer Sign In' : 'Trainee Registration'}
              </h2>
            </div>
          </div>
          <p className="text-xs text-blue-100/80">
            {mode === 'login'
              ? 'Enter your credentials to access your personalized competency dashboard and iGOT recommendations.'
              : 'Register your official profile to map competency gaps with AI and unlock tailored iGOT learning paths.'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === 'login'
                  ? 'bg-white text-blue-950 shadow-md'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); setStep(1); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === 'register'
                  ? 'bg-white text-blue-950 shadow-md'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              Register New Profile
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="e.g. venkatesh.kumar@mospi.gov.in"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Passcodes are securely verified via bcrypt in MySQL</span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      email: 'venkatesh.kumar@mospi.gov.in',
                      password: 'Password@123'
                    }));
                  }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Fill Sample Credentials
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Officer Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to SAMARTH-STAT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {step === 1 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name & Designation *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => handleChange('fullName', e.target.value)}
                          placeholder="e.g. Shri Venkatesh Kumar"
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Official Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          placeholder="officer@mospi.gov.in"
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Phone Number (Optional)
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          placeholder="+91 9876543210"
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Cadre / Job Role
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                          value={formData.jobRole}
                          onChange={(e) => handleChange('jobRole', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="Junior Statistical Officer">Junior Statistical Officer (JSO - SSS)</option>
                          <option value="Senior Statistical Officer">Senior Statistical Officer (SSO - SSS)</option>
                          <option value="Assistant Director">Assistant Director (ISS - Group A)</option>
                          <option value="Deputy Director">Deputy Director (ISS - Group A)</option>
                          <option value="Data Informatics Officer">Data Informatics Officer (DIID)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Division / Department
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                          value={formData.department}
                          onChange={(e) => handleChange('department', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="National Accounts Division (NAD)">National Accounts Division (NAD)</option>
                          <option value="Field Operations Division (FOD)">Field Operations Division (FOD)</option>
                          <option value="Economic Statistics Division (ESD)">Economic Statistics Division (ESD)</option>
                          <option value="Data Informatics & Innovation Division (DIID)">DIID - Innovation & AI Wing</option>
                          <option value="Survey Design & Research Division (SDRD)">Survey Design & Research Division (SDRD)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Experience Level
                      </label>
                      <select
                        value={formData.experienceLevel}
                        onChange={(e) => handleChange('experienceLevel', e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="Beginner">Entry Level (0 - 2 Years)</option>
                        <option value="Intermediate">Mid-Career Officer (3 - 7 Years)</option>
                        <option value="Advanced">Senior Practitioner (8 - 15 Years)</option>
                        <option value="Expert">Leadership / Specialist (15+ Years)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Create Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => handleChange('password', e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => handleChange('confirmPassword', e.target.value)}
                          placeholder="Confirm password"
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Career / Upskilling Goal
                    </label>
                    <input
                      type="text"
                      value={formData.careerGoal}
                      onChange={(e) => handleChange('careerGoal', e.target.value)}
                      placeholder="e.g. Lead National Accounts compilation and implement ML in data validation"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.fullName || !formData.email || !formData.password) {
                        setError('Please fill in required fields: Name, Email, Password');
                        return;
                      }
                      if (formData.password !== formData.confirmPassword) {
                        setError('Passwords do not match');
                        return;
                      }
                      setError(null);
                      setStep(2);
                    }}
                    className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <span>Next: Select Current & Target Skills</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                /* STEP 2: SKILLS & TARGETS */
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-emerald-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        1. Current Competency Self-Declaration
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">
                      Select the domains in which you have working knowledge or field experience:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {AVAILABLE_SKILLS.map(skill => {
                        const active = formData.selectedSkills.includes(skill);
                        return (
                          <button
                            type="button"
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className={`text-left text-xs p-2.5 rounded-lg border transition flex items-center justify-between ${
                              active
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-medium'
                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>{skill}</span>
                            {active && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-sky-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        2. Target Skills You Want to Learn (AI Gap Mapping)
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">
                      Select target skills. Gemini AI will compute your gap delta and recommend targeted iGOT courses:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {AVAILABLE_SKILLS.map(skill => {
                        const active = formData.targetSkills.includes(skill);
                        return (
                          <button
                            type="button"
                            key={skill}
                            onClick={() => toggleTargetSkill(skill)}
                            className={`text-left text-xs p-2.5 rounded-lg border transition flex items-center justify-between ${
                              active
                                ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-500 text-sky-800 dark:text-sky-300 font-medium'
                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>{skill}</span>
                            {active && <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="py-2.5 px-4 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Registering & Running AI Competency Analysis...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Complete Registration & Generate AI Roadmap</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

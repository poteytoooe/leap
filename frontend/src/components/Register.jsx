import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    role: 'student',
    year_level: '',
    dept_id: '',
    specialization: '',
    contact_no: ''
  });

  function set(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  const isNcfEmail = form.email.toLowerCase().endsWith('@gbox.ncf.edu.ph') || form.email.toLowerCase().endsWith('@ncf.edu.ph');

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Too short', color: '#e03a3a', pct: 20 };
    if (p.length < 8) return { label: 'Weak', color: '#e07a3a', pct: 40 };
    const hasUpper = /[A-Z]/.test(p);
    const hasNum = /[0-9]/.test(p);
    const hasSpecial = /[^A-Za-z0-9]/.test(p);
    const score = [hasUpper, hasNum, hasSpecial].filter(Boolean).length;
    if (score === 0) return { label: 'Fair', color: '#e0c03a', pct: 55 };
    if (score === 1) return { label: 'Good', color: '#7ab83a', pct: 75 };
    return { label: 'Strong password', color: '#1a5c38', pct: 100 };
  })();

  const passwordsMatch = confirmPassword && form.password === confirmPassword;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!isNcfEmail) {
      setError('Only @gbox.ncf.edu.ph or @ncf.edu.ph addresses are allowed');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', form);
      alert('Account created. Please sign in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .leap-page {
          display: flex;
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── LEFT PANEL ── */
        .leap-left {
          width: 260px;
          min-width: 260px;
          background: #0d2b1e;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 24px 32px;
          gap: 18px;
          position: relative;
          overflow: hidden;
        }

        .leap-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 200px 200px at 30% 15%, rgba(183,140,30,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 180px 180px at 70% 80%, rgba(183,140,30,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .leap-shield {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 2px solid #b78c1e;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
        }

        .leap-shield svg {
          width: 38px;
          height: 38px;
          color: #b78c1e;
        }

        .leap-title {
          font-family: 'Cinzel', serif;
          font-size: 28px;
          color: #fff;
          letter-spacing: 2px;
          text-align: center;
          line-height: 1;
        }

        .leap-subtitle {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 3px;
          color: #b78c1e;
          text-transform: uppercase;
          text-align: center;
        }

        .leap-desc {
          font-size: 12.5px;
          color: rgba(255,255,255,0.65);
          text-align: center;
          line-height: 1.7;
          padding: 0 4px;
        }

        .leap-dots {
          display: flex;
          gap: 6px;
          align-items: center;
          margin: 4px 0;
        }

        .leap-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
        }

        .leap-dot.active { background: #b78c1e; }

        /* ── RIGHT PANEL ── */
        .leap-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #fff;
          padding: 40px 32px;
        }

        .leap-form-card {
          width: 100%;
          max-width: 360px;
          display: flex;
          flex-direction: column;
        }

        .leap-form-heading {
          margin-bottom: 4px;
        }

        .leap-form-heading h2 {
          font-size: 22px;
          font-weight: 700;
          color: #111;
        }

        .leap-form-heading p {
          font-size: 13px;
          color: #888;
          margin-top: 3px;
          margin-bottom: 22px;
        }

        /* Error */
        .leap-error {
          color: #c0392b;
          font-size: 13px;
          font-weight: 600;
          text-align: center;
          margin-bottom: 14px;
          background: #fdf0ef;
          border-radius: 8px;
          padding: 10px 14px;
        }

        /* Field */
        .leap-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }

        .leap-label {
          font-size: 13px;
          font-weight: 600;
          color: #333;
        }

        .leap-row {
          display: flex;
          gap: 10px;
          margin-bottom: 14px;
        }

        .leap-row .leap-field {
          flex: 1;
          margin-bottom: 0;
        }

        .leap-input-wrap {
          position: relative;
        }

        .leap-input {
          width: 100%;
          padding: 11px 42px 11px 14px;
          border: 1.5px solid #d0d0d0;
          border-radius: 8px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #111;
          outline: none;
          transition: border-color 0.2s;
          background: #fff;
        }

        .leap-input:focus { border-color: #1a5c38; }
        .leap-input.valid { border-color: #1a5c38; }

        .leap-input-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1a5c38;
          pointer-events: none;
        }

        .leap-input-icon.clickable {
          pointer-events: all;
          cursor: pointer;
          color: #888;
          background: none;
          border: none;
          padding: 0;
        }

        .leap-input-icon.clickable:hover { color: #333; }

        .leap-recognized {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #1a5c38;
          font-weight: 500;
          margin-top: 2px;
        }

        /* Password strength bar */
        .leap-strength-bar {
          height: 4px;
          border-radius: 4px;
          background: #e8e8e8;
          margin-top: 8px;
          overflow: hidden;
        }

        .leap-strength-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s, background 0.3s;
        }

        .leap-strength-label {
          font-size: 12px;
          font-weight: 500;
          margin-top: 4px;
        }

        /* Submit */
        .leap-submit {
          width: 100%;
          padding: 13px;
          background: #1a5c38;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
          transition: background 0.2s, opacity 0.2s;
        }

        .leap-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .leap-submit:not(:disabled):hover { background: #154d2f; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .leap-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        .leap-signin {
          text-align: center;
          font-size: 13px;
          color: #777;
          margin-top: 16px;
        }

        .leap-signin a {
          color: #1a5c38;
          font-weight: 600;
          text-decoration: none;
        }

        .leap-signin a:hover { text-decoration: underline; }
      `}</style>

      <div className="leap-page">
        {/* ── LEFT PANEL ── */}
        <div className="leap-left">
          <div className="leap-shield">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          <div className="leap-title">L.E.A.P.</div>
          <div className="leap-subtitle">NCF · IRS Program</div>

          <p className="leap-desc">
            Join the platform. Practice English. Earn XP. Build communicative fluency — one conversation at a time.
          </p>

          <div className="leap-dots">
            <div className="leap-dot" />
            <div className="leap-dot active" />
            <div className="leap-dot" />
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="leap-right">
          <div className="leap-form-card">

            <div className="leap-form-heading">
              <h2>Create your account</h2>
              <p>NCF gbox institutional email required</p>
            </div>

            {error && <div className="leap-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* First + Last name */}
              <div className="leap-row">
                <div className="leap-field">
                  <label className="leap-label">First name</label>
                  <div className="leap-input-wrap">
                    <input
                      className="leap-input"
                      type="text"
                      placeholder="Juan"
                      required
                      value={form.first_name}
                      onChange={set('first_name')}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="leap-field">
                  <label className="leap-label">Last name</label>
                  <div className="leap-input-wrap">
                    <input
                      className="leap-input"
                      type="text"
                      placeholder="dela Cruz"
                      required
                      value={form.last_name}
                      onChange={set('last_name')}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="leap-field">
                <label className="leap-label">Email address</label>
                <div className="leap-input-wrap">
                  <input
                    className={`leap-input${isNcfEmail ? ' valid' : ''}`}
                    type="email"
                    placeholder="juan.delacruz@gbox.ncf.edu.ph"
                    required
                    value={form.email}
                    onChange={set('email')}
                    disabled={loading}
                  />
                  {isNcfEmail && (
                    <span className="leap-input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="9 12 11 14 15 10" />
                      </svg>
                    </span>
                  )}
                </div>
                {isNcfEmail && (
                  <span className="leap-recognized">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    NCF gbox recognized
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="leap-field">
                <label className="leap-label">Password</label>
                <div className="leap-input-wrap">
                  <input
                    className="leap-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••"
                    required
                    value={form.password}
                    onChange={set('password')}
                    disabled={loading}
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="leap-input-icon clickable"
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {passwordStrength && (
                  <>
                    <div className="leap-strength-bar">
                      <div
                        className="leap-strength-fill"
                        style={{ width: `${passwordStrength.pct}%`, background: passwordStrength.color }}
                      />
                    </div>
                    <span className="leap-strength-label" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </>
                )}
              </div>

              {/* Confirm password */}
              <div className="leap-field">
                <label className="leap-label">Confirm password</label>
                <div className="leap-input-wrap">
                  <input
                    className={`leap-input${passwordsMatch ? ' valid' : ''}`}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••••"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                  {passwordsMatch ? (
                    <span className="leap-input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="9 12 11 14 15 10" />
                      </svg>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="leap-input-icon clickable"
                      onClick={() => setShowConfirm(v => !v)}
                      tabIndex={-1}
                    >
                      {showConfirm ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Hidden fields preserved from original — unchanged */}
              <input type="hidden" value={form.middle_name} onChange={set('middle_name')} />
              <input type="hidden" value={form.gender} onChange={set('gender')} />
              <input type="hidden" value={form.role} onChange={set('role')} />
              <input type="hidden" value={form.year_level} onChange={set('year_level')} />
              <input type="hidden" value={form.dept_id} onChange={set('dept_id')} />
              <input type="hidden" value={form.specialization} onChange={set('specialization')} />
              <input type="hidden" value={form.contact_no} onChange={set('contact_no')} />

              <button type="submit" className="leap-submit" disabled={loading}>
                {loading ? (
                  <><span className="leap-spinner" /> Creating account...</>
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            <p className="leap-signin">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}
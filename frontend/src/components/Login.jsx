import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const isNcfEmail = email.toLowerCase().endsWith('@gbox.ncf.edu.ph');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      if (res.data.user?.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else if (res.data.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Try again.');
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

        .leap-dot.active {
          background: #b78c1e;
        }

        .leap-notice {
          border: 1.5px solid #b78c1e;
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 12px;
          color: rgba(255,255,255,0.75);
          text-align: center;
          line-height: 1.6;
          margin-top: auto;
        }

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
          gap: 0;
        }

        /* Header */
        .leap-form-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
        }

        .leap-check-icon {
          width: 42px;
          height: 42px;
          min-width: 42px;
          border-radius: 50%;
          background: #1a5c38;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .leap-check-icon svg {
          width: 20px;
          height: 20px;
          color: #fff;
        }

        .leap-form-header h2 {
          font-size: 22px;
          font-weight: 700;
          color: #111;
          line-height: 1.2;
        }

        .leap-form-header p {
          font-size: 13px;
          color: #666;
          margin-top: 2px;
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
          margin-bottom: 16px;
        }

        .leap-label {
          font-size: 13px;
          font-weight: 600;
          color: #333;
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

        .leap-input:focus {
          border-color: #1a5c38;
        }

        .leap-input.valid {
          border-color: #1a5c38;
        }

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

        .leap-input-icon.clickable:hover {
          color: #333;
        }

        .leap-recognized {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #1a5c38;
          font-weight: 500;
          margin-top: 2px;
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

        .leap-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .leap-submit:not(:disabled):hover {
          background: #154d2f;
        }

        /* Spinner */
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

        /* Register link */
        .leap-register {
          text-align: center;
          font-size: 13px;
          color: #777;
          margin-top: 18px;
        }

        .leap-register a {
          color: #1a5c38;
          font-weight: 600;
          text-decoration: none;
        }

        .leap-register a:hover {
          text-decoration: underline;
        }

        /* Divider */
        .leap-divider {
          border: none;
          border-top: 1px solid #e8e8e8;
          margin: 24px 0 16px;
        }

        /* Footer */
        .leap-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          color: #999;
        }

        .leap-footer-logo {
          width: 20px;
          height: 20px;
          background: #1a5c38;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .leap-footer-logo svg {
          width: 13px;
          height: 13px;
          color: #fff;
        }
      `}</style>

      <div className="leap-page">
        {/* ── LEFT PANEL ── */}
        <div className="leap-left">
          <div className="leap-shield">
            {/* Shield icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          <div className="leap-title">L.E.A.P.</div>
          <div className="leap-subtitle">NCF · IRS Program</div>

          <p className="leap-desc">
            Language Education and Advancement Program — AI-powered English fluency for every NCF student.
          </p>

          <div className="leap-dots">
            <div className="leap-dot active" />
            <div className="leap-dot" />
            <div className="leap-dot" />
          </div>

          <div className="leap-notice">
            Use your official NCF Google Workspace gbox institutional email to access this platform.
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="leap-right">
          <div className="leap-form-card">

            {/* Header */}
            <div className="leap-form-header">
              <div className="leap-check-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h2>Welcome back</h2>
                <p>Sign in with your NCF gbox account</p>
              </div>
            </div>

            {error && <div className="leap-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="leap-field">
                <label className="leap-label">Email address</label>
                <div className="leap-input-wrap">
                  <input
                    type="email"
                    className={`leap-input${isNcfEmail ? ' valid' : ''}`}
                    placeholder="juan.delacruz@gbox.ncf.edu.ph"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    NCF gbox account recognized
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="leap-field">
                <label className="leap-label">Password</label>
                <div className="leap-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="leap-input"
                    placeholder="••••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="leap-input-icon clickable"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
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
              </div>

              <button type="submit" className="leap-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="leap-spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 8 16 12 12 16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                    Sign in to L.E.A.P.
                  </>
                )}
              </button>
            </form>

            <p className="leap-register">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>

            <hr className="leap-divider" />

            <div className="leap-footer">
              <div className="leap-footer-logo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              Naga College Foundation · IRS Program · AY 2025–2026
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
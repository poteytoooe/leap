import { useState } from "react";
import { api } from "./db.js";
import { Spinner } from "./SharedUI.jsx";

// ============================================================
// LOGIN
// ============================================================
export function Login({ onLogin, onGoRegister }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [role,     setRole]     = useState("student");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const DEMO_ACCOUNTS = {
    student:    "juan.delacruz@gbox.ncf.edu.ph",
    instructor: "prof.santos@ncf.edu.ph",
    admin:      "admin@ncf.edu.ph",
  };

  async function handleSubmit() {
    setError("");
    if (!email.endsWith("@gbox.ncf.edu.ph") && !email.endsWith("@ncf.edu.ph")) {
      setError("Only @gbox.ncf.edu.ph or @ncf.edu.ph addresses are allowed.");
      return;
    }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const { token, user } = await api.login(email, password);
      onLogin(token, user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(r) {
    setRole(r);
    setEmail(DEMO_ACCOUNTS[r]);
    setPassword("demo123");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-form-side">
          <h2>Sign In</h2>
          <p className="auth-notice">
            Use your school email — <strong>@gbox.ncf.edu.ph</strong>
          </p>

          {/* Quick demo login */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px" }}>
              Quick demo login
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              {["student", "instructor", "admin"].map(r => (
                <button
                  key={r}
                  onClick={() => fillDemo(r)}
                  style={{ flex: 1, padding: "6px 0", fontSize: 10, fontWeight: 700, borderRadius: 7, border: "1.5px solid var(--ncf-green-200)", background: "var(--ncf-green-50)", color: "var(--ncf-green-600)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", textTransform: "capitalize" }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Role selector */}
          <div className="role-pills">
            {["student", "instructor", "admin"].map(r => (
              <button
                key={r}
                className={`role-pill${role === r ? " active" : ""}`}
                onClick={() => setRole(r)}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {error && <div className="auth-error">{error}</div>}

          <input
            className="auth-input"
            type="email"
            placeholder="Email (@gbox.ncf.edu.ph)"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password (min. 6 chars)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
          <span className="auth-forgot">Forgot your password?</span>

          <button className="auth-submit" disabled={loading} onClick={handleSubmit}>
            {loading ? <><Spinner /> Signing in…</> : "Sign In"}
          </button>

          <p className="auth-switch-text">
            Don't have an account? <span onClick={onGoRegister}>Sign up here</span>
          </p>
        </div>

        <div className="auth-welcome-side">
          <h1>Welcome Back</h1>
          <p>Enter your credentials to access your L.E.A.P. account</p>
          <button className="auth-alt-btn" onClick={onGoRegister}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// REGISTER
// ============================================================
const INITIAL_FORM = {
  email: "", password: "", first_name: "", middle_name: "",
  last_name: "", gender: "", role: "student", year_level: "",
  dept_id: "", specialization: "", contact_no: "",
};

export function Register({ onGoLogin }) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [form,    setForm]    = useState(INITIAL_FORM);

  const set = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit() {
    setError("");
    if (!form.email.endsWith("@gbox.ncf.edu.ph") && !form.email.endsWith("@ncf.edu.ph")) {
      setError("Only @gbox.ncf.edu.ph or @ncf.edu.ph addresses are allowed."); return;
    }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (!form.first_name || !form.last_name) { setError("First and last name are required."); return; }
    setLoading(true);
    try {
      await api.register(form);
      setSuccess(true);
      setTimeout(onGoLogin, 1800);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card reverse">
        <div className="auth-welcome-side">
          <h1>Hello!</h1>
          <p>Register with your school details to get started with L.E.A.P.</p>
          <button className="auth-alt-btn" onClick={onGoLogin}>Sign In</button>
        </div>

        <div className="auth-form-side">
          <h2>Create Account</h2>
          <p className="auth-notice">
            Only <strong>@gbox.ncf.edu.ph</strong> addresses are allowed
          </p>

          {error   && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">Account created! Redirecting to sign in…</div>}

          <select className="auth-input" value={form.role} onChange={set("role")} disabled={loading}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>

          <div className="auth-row">
            <input className="auth-input" type="text" placeholder="First Name"  value={form.first_name} onChange={set("first_name")} disabled={loading} />
            <input className="auth-input" type="text" placeholder="Last Name"   value={form.last_name}  onChange={set("last_name")}  disabled={loading} />
          </div>
          <input className="auth-input" type="text" placeholder="Middle Name (optional)" value={form.middle_name} onChange={set("middle_name")} disabled={loading} />

          <select className="auth-input" value={form.gender} onChange={set("gender")} disabled={loading}>
            <option value="">Gender (optional)</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>

          {form.role === "student" && (
            <div className="auth-row">
              <input className="auth-input" type="number" placeholder="Year Level"       value={form.year_level} onChange={set("year_level")} disabled={loading} min="1" max="5" />
              <input className="auth-input" type="number" placeholder="Dept ID (optional)" value={form.dept_id}   onChange={set("dept_id")}   disabled={loading} />
            </div>
          )}

          {form.role === "instructor" && (
            <>
              <input className="auth-input" type="text" placeholder="Specialization"  value={form.specialization} onChange={set("specialization")} disabled={loading} />
              <input className="auth-input" type="text" placeholder="Contact Number"  value={form.contact_no}     onChange={set("contact_no")}     disabled={loading} />
            </>
          )}

          <input className="auth-input" type="email"    placeholder="Email (@gbox.ncf.edu.ph)" value={form.email}    onChange={set("email")}    disabled={loading} />
          <input className="auth-input" type="password" placeholder="Password (min. 6 chars)"  value={form.password} onChange={set("password")} disabled={loading} />

          <button className="auth-submit" disabled={loading || success} onClick={handleSubmit}>
            {loading ? <><Spinner /> Creating account…</> : "Sign Up"}
          </button>

          <p className="auth-switch-text">
            Already have an account? <span onClick={onGoLogin}>Sign in here</span>
          </p>
        </div>
      </div>
    </div>
  );
}

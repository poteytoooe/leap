import { useState } from "react";
import { Login, Register }      from "./Auth.jsx";
import { StudentDashboard }     from "./StudentDashboard.jsx";
import { InstructorDashboard }  from "./InstructorDashboard.jsx";
import { AdminDashboard }       from "./AdminDashboard.jsx";

// Import global styles (handled by your bundler, e.g. Vite / CRA)
// import "./global.css";

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  const [authPage, setAuthPage] = useState("login");
  const [session,  setSession]  = useState(null);

  function handleLogin(token, user) { setSession({ token, user }); }
  function handleLogout()           { setSession(null); setAuthPage("login"); }

  if (!session) {
    return authPage === "register"
      ? <Register onGoLogin={() => setAuthPage("login")} />
      : <Login    onLogin={handleLogin} onGoRegister={() => setAuthPage("register")} />;
  }

  if (session.user.role === "instructor") return <InstructorDashboard user={session.user} onLogout={handleLogout} />;
  if (session.user.role === "admin")      return <AdminDashboard      user={session.user} onLogout={handleLogout} />;
  return                                         <StudentDashboard    user={session.user} onLogout={handleLogout} />;
}

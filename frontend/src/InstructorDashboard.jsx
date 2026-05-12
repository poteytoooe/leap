import { useState, useEffect } from "react";
import { DB, api } from "./db.js";
import { LoadingState, Sidebar, TopBar } from "./SharedUI.jsx";

// ============================================================
// INSTRUCTOR DASHBOARD (shell)
// ============================================================
export function InstructorDashboard({ user, onLogout }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState("overview");

  const initials = (user.name || "TC").slice(0, 2).toUpperCase();

  useEffect(() => {
    api.getInstructorDashboard(user.user_id).then(setData).finally(() => setLoading(false));
  }, [user.user_id]);

  const menuItems = [
    { name: "CTA Basics A1",      key: "overview"     },
    { name: "CTA Intermediate A2",key: "courses"      },
    { name: "Lesson Plans",       key: "lessons"      },
    { name: "Assignments",        key: "submissions"  },
    { name: "Analytics",          key: "analytics"    },
  ];

  return (
    <div className="shell">
      <Sidebar
        role="Teacher"
        userInitials={initials}
        userName={user.name || "Instructor"}
        userRole="CTA Faculty"
        menuItems={menuItems}
        menuSections={[
          { title: "My Classes", start: 0, end: 2 },
          { title: "Tools",      start: 2, end: 5 },
        ]}
        avatarClass="av-gold"
        onLogout={onLogout}
        activeTab={tab}
        onTabChange={setTab}
      />
      <div className="main">
        <TopBar
          breadcrumb={`Teacher › ${menuItems.find(m => m.key === tab)?.name || "Dashboard"}`}
          right={<span style={{ fontSize: 10, color: "var(--text-muted)" }}>uid:{user.user_id}</span>}
        />
        <div className="pg">
          {loading ? <LoadingState /> : data && (
            <>
              {tab === "overview"    && <InstructorOverview    data={data} />}
              {tab === "lessons"     && <InstructorLessons     data={data} />}
              {tab === "submissions" && <InstructorSubmissions data={data} />}
              {tab === "analytics"   && <InstructorAnalytics   data={data} />}
              {tab === "courses"     && (
                <div style={{ fontSize: 12, color: "var(--text-muted)", padding: 20 }}>
                  CTA Intermediate A2 — coming soon.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// INSTRUCTOR — Overview Tab
// ============================================================
function InstructorOverview({ data }) {
  const avGrade     = data.grades.length ? (data.grades.reduce((a, g) => a + g.grade_value, 0) / data.grades.length).toFixed(1) : "—";
  const classColors = ["av-green", "av-gold", "av-dark", "av-green"];

  return (
    <>
      <div className="g4">
        <div className="sc2">
          <div className="sc2-val">{data.enrollments.length}</div>
          <div className="sc2-lbl">Students</div>
        </div>
        <div className="sc2" style={{ background: "var(--ncf-gold-50)", borderColor: "var(--ncf-gold-100)" }}>
          <div className="sc2-val" style={{ color: "var(--ncf-gold-700)" }}>{data.pendingReviews}</div>
          <div className="sc2-lbl">Pending reviews</div>
        </div>
        <div className="sc2">
          <div className="sc2-val">89%</div>
          <div className="sc2-lbl">Avg. attendance</div>
        </div>
        <div className="sc2">
          <div className="sc2-val">{avGrade}%</div>
          <div className="sc2-lbl">Avg. grade</div>
        </div>
      </div>

      <div className="g2" style={{ marginBottom: 12 }}>
        {/* Class progress */}
        <div className="card">
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dark)", marginBottom: 10 }}>Class progress</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>12 / 20 lessons completed</div>
          <div className="prog"><div className="prog-bar" style={{ width: "60%" }} /></div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6 }}>8 lessons remaining this semester</div>
        </div>

        {/* Top performers */}
        <div className="card">
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dark)", marginBottom: 10 }}>Top performers (grade)</div>
          {data.grades.sort((a, b) => b.grade_value - a.grade_value).slice(0, 3).map((g, i) => {
            const student = data.allStudents.find(s => s.student_id === g.student_id);
            const ini = student ? (student.first_name[0] + student.last_name[0]) : "?";
            const pct = Math.round(g.grade_value);
            return (
              <div key={i} className="row-item" style={{ padding: "7px 0", ...(i === 2 ? { borderBottom: "none" } : {}) }}>
                <div className={`av av-xs ${classColors[i]}`} style={{ flexShrink: 0 }}>{ini}</div>
                <div className="ri-info" style={{ paddingLeft: 5 }}>
                  <div className="ri-title" style={{ fontSize: 11 }}>{student ? student.first_name + " " + student.last_name : "Student"}</div>
                </div>
                <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{pct}%</span>
                <div style={{ width: 50, height: 4, background: "var(--ncf-green-100)", borderRadius: 3, margin: "0 8px", overflow: "hidden" }}>
                  <div style={{ width: pct + "%", height: "100%", background: "var(--ncf-green-500)", borderRadius: 3 }} />
                </div>
                <span className="tag tg" style={{ fontSize: 9 }}>#{i + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* All students */}
      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dark)", marginBottom: 10 }}>All enrolled students</div>
        {data.allStudents.map((s, i) => {
          const grade = data.grades.find(g => g.student_id === s.student_id);
          const ini   = (s.first_name[0] + s.last_name[0]).toUpperCase();
          return (
            <div key={i} className="row-item" style={i === data.allStudents.length - 1 ? { borderBottom: "none" } : {}}>
              <div className={`av av-sm ${classColors[i % 4]}`}>{ini}</div>
              <div className="ri-info">
                <div className="ri-title">{s.first_name} {s.last_name}</div>
                <div className="ri-sub">Year {s.year_level} · {DB.users.find(u => u.user_id === s.user_id)?.email}</div>
              </div>
              {grade
                ? <span className="tag tg">{grade.grade_value}%</span>
                : <span className="tag tgold">No grade</span>}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ============================================================
// INSTRUCTOR — Lessons Tab
// ============================================================
function InstructorLessons() {
  const lessons = DB.lessons.filter(l => l.course_id === 1);
  return (
    <div className="card">
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dark)", marginBottom: 10 }}>Lessons — CTA Basics A1</div>
      {lessons.map((l, i) => {
        const reqs = DB.requirements.filter(r => r.lesson_id === l.lesson_id);
        return (
          <div key={i} className="row-item" style={i === lessons.length - 1 ? { borderBottom: "none" } : {}}>
            <div className="av av-sm av-green" style={{ fontSize: 9, fontWeight: 700 }}>L{l.lesson_order}</div>
            <div className="ri-info">
              <div className="ri-title">{l.title}</div>
              <div className="ri-sub">{l.description} · {reqs.length} requirement{reqs.length !== 1 ? "s" : ""}</div>
            </div>
            {reqs.map((r, j) => (
              <span key={j} className="tag tg" style={{ fontSize: 9, marginLeft: 2 }}>{r.type}</span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// INSTRUCTOR — Submissions Tab
// ============================================================
function InstructorSubmissions({ data }) {
  const classColors = ["av-dark", "av-green", "av-gold"];
  return (
    <div className="card">
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dark)", marginBottom: 10 }}>Student submissions</div>
      {data.transcripts.map((t, i) => {
        const ini = t.student ? (t.student.first_name[0] + t.student.last_name[0]).toUpperCase() : "?";
        return (
          <div key={i} className="row-item" style={i === data.transcripts.length - 1 ? { borderBottom: "none" } : {}}>
            <div className={`av av-sm ${classColors[i % 3]}`}>{ini}</div>
            <div className="ri-info">
              <div className="ri-title">{t.student?.first_name} {t.student?.last_name} — {t.lesson?.title || "Lesson"}</div>
              <div className="ri-sub">Attempt #{t.submission.attempt_number} · {t.submission.date_submitted} · {t.submission.feedback}</div>
            </div>
            <span className={`tag ${t.submission.true_or_false ? "tg" : "tgold"}`}>
              {t.submission.true_or_false ? "Passed" : "Below threshold"}
            </span>
            <button className="btn btn-o btn-sm" style={{ height: 26, marginLeft: 8 }}>View</button>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// INSTRUCTOR — Analytics Tab
// ============================================================
function InstructorAnalytics({ data }) {
  const avGrade  = data.grades.length ? (data.grades.reduce((a, g) => a + g.grade_value, 0) / data.grades.length).toFixed(1) : 0;
  const passRate = data.grades.length ? Math.round((data.grades.filter(g => g.grade_value >= 75).length / data.grades.length) * 100) : 0;

  return (
    <>
      <div className="g4" style={{ marginBottom: 12 }}>
        <div className="sc2">
          <div className="sc2-val">{avGrade}%</div>
          <div className="sc2-lbl">Class avg. grade</div>
        </div>
        <div className="sc2">
          <div className="sc2-val">{passRate}%</div>
          <div className="sc2-lbl">Pass rate</div>
        </div>
        <div className="sc2" style={{ background: "var(--ncf-gold-50)", borderColor: "var(--ncf-gold-100)" }}>
          <div className="sc2-val" style={{ color: "var(--ncf-gold-700)" }}>{data.grades.filter(g => g.grade_value < 75).length}</div>
          <div className="sc2-lbl">At-risk students</div>
        </div>
        <div className="sc2">
          <div className="sc2-val">{DB.submissions.length}</div>
          <div className="sc2-lbl">Total submissions</div>
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dark)", marginBottom: 12 }}>Grade distribution</div>
        {data.grades.map((g, i) => {
          const student = data.allStudents.find(s => s.student_id === g.student_id);
          const pct     = Math.round(g.grade_value);
          return (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11 }}>
                <span>{student?.first_name} {student?.last_name}</span>
                <span style={{ color: g.grade_value >= 90 ? "var(--ncf-green-600)" : g.grade_value >= 75 ? "var(--ncf-gold-700)" : "#991b1b", fontWeight: 600 }}>
                  {pct}%
                </span>
              </div>
              <div className="prog">
                <div className="prog-bar" style={{ width: pct + "%", background: g.grade_value >= 90 ? "var(--ncf-green-500)" : g.grade_value >= 75 ? "var(--ncf-gold-400)" : "#ef4444" }} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

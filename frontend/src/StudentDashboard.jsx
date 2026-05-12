import { useState, useEffect } from "react";
import { DB, api } from "./db.js";
import { LoadingState } from "./SharedUI.jsx";
import "./StudentDashboard.css";

// ============================================================
// ICONS (inline SVG helpers)
// ============================================================
const Icon = {
  grid:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  book:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  clock:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  award:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  user:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  check:    () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  shield:   () => <span style={{ fontSize: 18 }}>🛡️</span>,
  fire:     () => <span style={{ fontSize: 12 }}>🔥</span>,
  starFill: () => <span style={{ fontSize: 12 }}>⭐</span>,
  calIcon:  () => <span style={{ fontSize: 14 }}>📅</span>,
  exclaim:  () => <span style={{ fontSize: 14 }}>❗</span>,
};

// ============================================================
// STUDENT DASHBOARD
// ============================================================
export function StudentDashboard({ user, onLogout }) {
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState("progress");
  const [lessonView, setLessonView] = useState(null); // { courseId, lessonIdx }

  const initials = (user.name || "ST").slice(0, 2).toUpperCase();

  const openLesson = (courseId, lessonIdx = 0) => setLessonView({ courseId, lessonIdx });
  const closeLesson = () => setLessonView(null);

  useEffect(() => {
    api.getStudentDashboard(user.user_id).then(setData).finally(() => setLoading(false));
  }, [user.user_id]);

  const xp        = data?.xp ?? 0;
  const level     = xp < 100 ? 1 : xp < 250 ? 2 : xp < 500 ? 3 : 4;
  const levelName = ["", "Beginner", "Intermediate", "Advanced", "Expert"][level];
  const streak    = 7;

  const menuLearning = [
    { name: "Dashboard",   key: "progress", icon: Icon.grid  },
    { name: "My subjects", key: "courses",  icon: Icon.book  },
  ];
  const menuProgress = [
    { name: "Deadlines",   key: "activity", icon: Icon.clock },
    { name: "Leaderboard", key: "badges",   icon: Icon.award },
    { name: "Profile",     key: "calendar", icon: Icon.user  },
  ];

  return (
    <div className="sd-shell">

      {/* ── Sidebar ── */}
      <aside className={`sd-sidebar${lessonView ? " sd-sidebar--collapsed" : ""}`}>

        {/* Brand / Logo */}
        <div className="sd-sb-brand">
          <div className="sd-sb-logo-row">
            <div className="sd-sb-logo-icon"><Icon.shield /></div>
            <div>
              <div className="sd-sb-logo-text">L.E.A.P.</div>
              <div className="sd-sb-logo-sub">NCF IRS</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sd-sb-nav">
          <div className="sd-sb-section">Learning</div>
          {menuLearning.map(m => (
            <div
              key={m.key}
              className={`sd-sb-item${tab === m.key ? " active" : ""}`}
              onClick={() => setTab(m.key)}
            >
              {tab === m.key && <div className="sd-sb-item-dot" />}
              <m.icon />
              {m.name}
            </div>
          ))}

          <div className="sd-sb-section">Progress</div>
          {menuProgress.map(m => (
            <div
              key={m.key}
              className={`sd-sb-item${tab === m.key ? " active" : ""}`}
              onClick={() => setTab(m.key)}
            >
              {tab === m.key && <div className="sd-sb-item-dot" />}
              <m.icon />
              {m.name}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="sd-sb-user">
          <div className="sd-sb-user-av">
            {initials}
            <div className="sd-online-dot" />
          </div>
          <div>
            <div className="sd-sb-user-name">{user.name || "Student"}</div>
            <div className="sd-sb-user-role">Student · {levelName}</div>
          </div>
        </div>
        <button className="sd-sb-logout" onClick={onLogout}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Log out
        </button>
      </aside>

      {/* ── Main content ── */}
      <div className="sd-main">

        {/* Top bar — hidden in lesson view */}
        {!lessonView && (
          <header className="sd-topbar">
            <div className="sd-tb-crumb">Dashboard</div>
            <div className="sd-tb-right">
              <div className="sd-tb-pill sd-tb-pill--green"><Icon.fire /> {streak} days</div>
              <div className="sd-tb-pill sd-tb-pill--gold"><Icon.starFill /> {xp} XP</div>
              <div className="sd-tb-av">
                {initials}
                <div className="sd-online-dot sd-online-dot--white" />
              </div>
            </div>
          </header>
        )}

        {/* Page content */}
        <div className={lessonView ? "sd-pg sd-pg--flush" : "sd-pg"}>
          {loading ? (
            <LoadingState />
          ) : data && (
            <>
              {lessonView ? (
                <LessonView
                  courseId={lessonView.courseId}
                  lessonIdx={lessonView.lessonIdx}
                  setLessonIdx={idx => setLessonView(v => ({ ...v, lessonIdx: idx }))}
                  onBack={closeLesson}
                  data={data}
                  user={user}
                />
              ) : (
                <>
                  {tab === "progress" && (
                    <DashboardHome
                      data={data}
                      xp={xp}
                      level={level}
                      levelName={levelName}
                      streak={streak}
                    />
                  )}
                  {tab === "courses"  && <StudentCourses  data={data} onOpenLesson={openLesson} />}
                  {tab === "activity" && <StudentActivity data={data} />}
                  {tab === "badges"   && <StudentBadges   data={data} />}
                  {tab === "calendar" && (
                    <p style={{ color: "var(--text-muted)", padding: 20, fontSize: 12 }}>
                      Calendar integration coming soon.
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD HOME — matches image layout
// ============================================================
function DashboardHome({ data, xp, level, levelName, streak }) {
  const nextXP    = level === 1 ? 100 : level === 2 ? 250 : level === 3 ? 500 : 1000;
  const prevXP    = level === 1 ? 0   : level === 2 ? 100 : level === 3 ? 250 : 500;
  const pct       = Math.round(((xp - prevXP) / (nextXP - prevXP)) * 100);
  const nextLevel = ["", "Intermediate", "Advanced", "Expert", "Master"][level];

  const badgeCount  = data.badges.length;
  const totalBadges = DB.badges.length;

  // Upcoming deadlines (demo data matching image)
  const deadlineItems = [
    { title: "Restaurant Vocab Quiz", sub: "IRS 101 · MCQ",        label: "2 days",  overdue: false },
    { title: "Essay Submission",      sub: "IRS 101 · File upload", label: "Overdue", overdue: true  },
  ];

  return (
    <>
      {/* ── Stat cards ── */}
      <div className="sd-stats-row">
        <div className="sd-stat-card">
          <div className="sd-stat-val">{xp}</div>
          <div className="sd-stat-lbl">Total XP</div>
        </div>
        <div className="sd-stat-card sd-stat-card--gold">
          <div className="sd-stat-val sd-stat-val--gold">{levelName}</div>
          <div className="sd-stat-lbl">Level</div>
        </div>
        <div className="sd-stat-card">
          <div className="sd-stat-val">{streak} days</div>
          <div className="sd-stat-lbl">Streak</div>
        </div>
        <div className="sd-stat-card">
          <div className="sd-stat-val">{badgeCount}/{totalBadges}</div>
          <div className="sd-stat-lbl">Badges</div>
        </div>
      </div>

      {/* ── Two-column grid ── */}
      <div className="sd-two-col">

        {/* Left — My subjects */}
        <div>
          <div className="sd-section-head">My subjects</div>

          {data.enrollments.length === 0 ? (
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Not enrolled in any courses.</p>
          ) : (
            data.enrollments.map((e, i) => {
              const course     = DB.courses.find(c => c.course_id === e.course_id);
              const lessons    = DB.lessons.filter(l => l.course_id === e.course_id);
              const done       = Math.ceil(lessons.length * 0.5);
              const isActive   = i === 0;
              const instructor = isActive ? "Ma. Santos" : "Instr. R. Bautista";
              const startNote  = isActive ? null : "Starts Nov 2025";
              const enrolled   = isActive ? `${lessons.length * 4 + 24} enrolled` : null;

              return (
                <div
                  key={i}
                  className={`sd-subject-card${isActive ? " sd-subject-card--active" : ""}`}
                >
                  {/* Code pill + enrollment count */}
                  <div className="sd-subject-header">
                    <span className={`sd-subject-code${isActive ? " sd-subject-code--active" : ""}`}>
                      {course?.course_code || "IRS"}
                    </span>
                    {enrolled && <span className="sd-subject-enrolled-count">{enrolled}</span>}
                  </div>

                  <div className="sd-subject-title">{course?.course_name}</div>

                  <div className="sd-subject-meta">
                    <div className="sd-meta-av">
                      {instructor.split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </div>
                    {instructor} · {lessons.length} lessons
                    {startNote && <span style={{ marginLeft: 4 }}>{startNote}</span>}
                  </div>

                  {/* Lesson icon row (active course only) */}
                  {isActive && (
                    <div className="sd-icon-row">
                      <div className="sd-icon-circle sd-icon-circle--done"><Icon.check /></div>
                      <ProgressArc pct={50} />
                      <div className="sd-icon-circle">🔑</div>
                      <div className="sd-icon-circle">📋</div>
                      <div className="sd-lesson-count">{done} of {lessons.length} complete</div>
                    </div>
                  )}

                  {!isActive && <span className="sd-coming-soon-tag">Coming soon</span>}
                </div>
              );
            })
          )}
        </div>

        {/* Right — XP + Deadlines */}
        <div>

          {/* XP progress */}
          <div className="sd-section-head">XP progress</div>
          <div className="sd-xp-panel">
            <div className="sd-xp-level-pill">⭐ {levelName}</div>
            <div className="sd-xp-to-next">{nextXP - xp} XP to {nextLevel}</div>
            <div className="sd-xp-value">{xp} XP</div>
            <div className="sd-xp-bar">
              <div className="sd-xp-bar-fill" style={{ width: pct + "%" }} />
            </div>
            <div className="sd-xp-scale">
              <span>{prevXP} XP</span>
              <span>{nextXP} XP</span>
            </div>
          </div>

          {/* Upcoming deadlines */}
          <div className="sd-section-head">Upcoming deadlines</div>
          <div className="sd-deadline-panel">
            {deadlineItems.map((d, i) => (
              <div key={i} className="sd-deadline-item">
                <div className={`sd-deadline-icon${d.overdue ? " sd-deadline-icon--overdue" : ""}`}>
                  {d.overdue ? <Icon.exclaim /> : <Icon.calIcon />}
                </div>
                <div>
                  <div className="sd-deadline-title">{d.title}</div>
                  <div className="sd-deadline-sub">{d.sub}</div>
                </div>
                <div className={`sd-deadline-tag${d.overdue ? " sd-deadline-tag--overdue" : ""}`}>
                  {d.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

// ── SVG arc progress ring ──────────────────────────────────
function ProgressArc({ pct }) {
  const r    = 11;
  const cx   = 14, cy = 14;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="28" height="28" viewBox="0 0 28 28">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e8eaf0" strokeWidth="2.5" />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke="#22c55e" strokeWidth="2.5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="7" fontWeight="700" fill="#22c55e">
        {pct}%
      </text>
    </svg>
  );
}

// ============================================================
// STUDENT — Courses Tab
// ============================================================
function StudentCourses({ data, onOpenLesson }) {
  return (
    <div className="sd-panel">
      <div className="sd-section-head">Enrolled courses</div>
      {data.enrollments.length === 0 ? (
        <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Not enrolled in any courses.</p>
      ) : (
        data.enrollments.map((e, i) => {
          const course  = DB.courses.find(c => c.course_id === e.course_id);
          const lessons = DB.lessons.filter(l => l.course_id === e.course_id);
          return (
            <div
              key={i}
              className="sd-row"
              style={{ cursor: "pointer" }}
              onClick={() => onOpenLesson && onOpenLesson(e.course_id, 0)}
            >
              <div className="sd-row-icon">
                {(course?.course_code || "CTA").slice(0, 2)}
              </div>
              <div style={{ flex: 1 }}>
                <div className="sd-row-title">{course?.course_name}</div>
                <div className="sd-row-sub">
                  {course?.course_code} · {lessons.length} lessons · {course?.description}
                </div>
              </div>
              <span className={`sd-tb-pill ${e.early_enrolled ? "sd-tb-pill--gold" : "sd-tb-pill--green"}`}
                style={{ fontSize: 10 }}>
                {e.early_enrolled ? "Early enrolled" : "Enrolled"}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}

// ============================================================
// STUDENT — Activity Tab
// ============================================================
function StudentActivity({ data }) {
  return (
    <div className="sd-panel">
      <div className="sd-section-head">Recent AI session activity</div>
      {data.recentActivity.map((r, i) => (
        <div key={i} className="sd-row">
          <div className="sd-row-icon" style={{ fontSize: 13, fontWeight: 700 }}>✓</div>
          <div style={{ flex: 1 }}>
            <div className="sd-row-title">
              {r.lesson?.title || "Session"} — {r.requirement?.type || "activity"}
            </div>
            <div className="sd-row-sub">
              {r.submission.date_submitted} · {r.submission.feedback}
            </div>
          </div>
          {r.submission.status === "graded" ? (
            <span
              className={`sd-tb-pill ${r.submission.true_or_false ? "sd-tb-pill--green" : "sd-tb-pill--gold"}`}
              style={{ fontSize: 10 }}>
              {r.submission.true_or_false ? "Passed" : "Below threshold"}
            </span>
          ) : (
            <span className="sd-tb-pill sd-tb-pill--gold" style={{ fontSize: 10 }}>Pending</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// STUDENT — Badges Tab
// ============================================================
function StudentBadges({ data }) {
  const allBadges = DB.badges;
  return (
    <div className="sd-panel">
      <div className="sd-section-head">Badges & achievements</div>

      {/* Earned badges strip */}
      <div className="sd-badge-strip">
        {data.badges.length === 0 ? (
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>No badges earned yet. Keep going!</p>
        ) : (
          data.badges.map((sb, i) => (
            <div key={i} className="sd-badge-chip">⭐ {sb.badge?.badge_name}</div>
          ))
        )}
      </div>

      {/* All available badges */}
      <div className="sd-section-head" style={{ marginTop: 4 }}>All available badges</div>
      {allBadges.map((b, i) => {
        const earned = data.badges.some(sb => sb.badge_id === b.badge_id);
        const cond   = DB.badgeConditions.find(bc => bc.badge_id === b.badge_id);
        return (
          <div key={i} className="sd-row">
            <div className={`sd-row-icon ${earned ? "sd-row-icon--gold" : "sd-row-icon--muted"}`}>★</div>
            <div style={{ flex: 1 }}>
              <div className="sd-row-title">{b.badge_name}</div>
              <div className="sd-row-sub">
                {b.description} · requires {cond?.required_score} {cond?.condition_type?.replace("_", " ")}
              </div>
            </div>
            {earned ? (
              <span className="sd-tb-pill sd-tb-pill--green" style={{ fontSize: 10 }}>Earned</span>
            ) : (
              <span className="sd-tag-locked">Locked</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// LESSON VIEW — Unit/module progression page
// ============================================================
function LessonView({ courseId, lessonIdx, setLessonIdx, onBack, data, user }) {
  const [quizModule, setQuizModule] = useState(null); // module object when quiz is open

  const course  = DB.courses.find(c => c.course_id === courseId);
  const lessons = DB.lessons.filter(l => l.course_id === courseId);
  const lesson  = lessons[lessonIdx];

  if (!lesson) return <div style={{ padding: 20, color: "#9ca3af" }}>No lesson found.</div>;

  // Build modules from requirements for this lesson
  const requirements = DB.requirements?.filter(r => r.lesson_id === lesson.lesson_id) ?? [];

  // Determine submission status per requirement
  const getStatus = (req, idx) => {
    const sub = data.recentActivity?.find(a => a.submission?.requirement_id === req.requirement_id);
    if (sub?.submission?.status === "graded" && sub.submission.true_or_false) return "done";
    if (sub) return "active";
    if (idx === 0) return "active";
    if (idx === 1) return "unlocked";
    return "locked";
  };

  // Fallback demo modules if no requirements in DB
  const modules = requirements.length > 0
    ? requirements.map((r, i) => ({
        num: `1.${i + 1}`,
        title: r.title || r.type,
        sub: `${r.activities ?? 1} activit${(r.activities ?? 1) === 1 ? "y" : "ies"}`,
        types: [r.type],
        status: getStatus(r, i),
      }))
    : [
        { num: "1.1", title: "Vocabulary: Restaurant Terms",   sub: "2 activities · 26/28 students completed", types: ["MCQ", "File"],    status: "done"     },
        { num: "1.2", title: "AI Roleplay: Ordering Food",     sub: "2 activities · 1 submitted",              types: ["MCQ", "AI Chat"], status: "active"   },
        { num: "1.3", title: "Writing: Menu Descriptions",     sub: "1 activity · Instructor-unlocked",        types: ["File"],           status: "unlocked" },
        { num: "1.4", title: "Speaking Practice: Complaints",  sub: "Complete previous modules to unlock",     types: [],                 status: "locked"   },
      ];

  const doneCount = modules.filter(m => m.status === "done").length;
  const levelName = course?.description?.split(" ")[0] || "Intermediate";

  const statusConfig = {
    done:     { label: "Done",     labelClass: "lv-tag--done",     borderClass: "lv-mod--done",     iconBg: "#22c55e", iconColor: "#fff"    },
    active:   { label: "Active",   labelClass: "lv-tag--active",   borderClass: "lv-mod--active",   iconBg: "#fff",    iconColor: "#22c55e" },
    unlocked: { label: "Unlocked", labelClass: "lv-tag--unlocked", borderClass: "lv-mod--unlocked", iconBg: "#fff",    iconColor: "#f59e0b" },
    locked:   { label: "Locked",   labelClass: "lv-tag--locked",   borderClass: "lv-mod--locked",   iconBg: "#fff",    iconColor: "#d1d5db" },
  };

  const ModuleIcon = ({ status }) => {
    const cfg = statusConfig[status];
    if (status === "done") return (
      <div className="lv-mod-icon" style={{ background: cfg.iconBg, border: "none" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={cfg.iconColor} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
    );
    if (status === "active") return (
      <div className="lv-mod-icon lv-mod-icon--ring">
        <ProgressArc pct={50} size={44} />
      </div>
    );
    if (status === "unlocked") return (
      <div className="lv-mod-icon" style={{ background: "#fffbeb", border: "2px solid #fde68a" }}>
        🔑
      </div>
    );
    return (
      <div className="lv-mod-icon" style={{ background: "#f3f4f6", border: "2px solid #e5e7eb" }}>
        🔒
      </div>
    );
  };

  return (
    <div className="lv-shell">

      {/* ── Left sidebar: lesson list ── */}
      <aside className="lv-sidebar">
        {quizModule ? (
          <button className="lv-back-btn" onClick={() => setQuizModule(null)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back to module
          </button>
        ) : (
          <button className="lv-back-btn" onClick={onBack}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Back to subjects
          </button>
        )}

        <div className="lv-sb-section">{quizModule ? quizModule.num : `Lesson ${lessonIdx + 1}`}</div>

        {quizModule ? (
          /* Show module list items when in quiz */
          modules.map((mod, i) => (
            <div
              key={i}
              className={`lv-sb-item${mod.num === quizModule.num ? " active" : ""}`}
              onClick={() => mod.status !== "locked" && mod.types?.includes("MCQ") && setQuizModule(mod)}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              {mod.title}
            </div>
          ))
        ) : (
          /* Show lesson list when in module view */
          lessons.map((l, i) => (
            <div
              key={i}
              className={`lv-sb-item${lessonIdx === i ? " active" : ""}`}
              onClick={() => setLessonIdx(i)}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              {l.title}
            </div>
          ))
        )}

        {/* User footer */}
        <div className="lv-sb-user">
          <div className="lv-sb-user-av">{(data?.user?.name || user?.name || "JD").slice(0,2).toUpperCase()}</div>
          <div>
            <div className="lv-sb-user-name">{data?.user?.name || user?.name || "Student"}</div>
            <div className="lv-sb-user-role">Student</div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="lv-main">

        {quizModule ? (
          <MCQQuiz
            mod={quizModule}
            lesson={lesson}
            onBack={() => setQuizModule(null)}
            user={user}
          />
        ) : (
          <>
            {/* Hero unit card */}
            <div className="lv-hero">
              <div className="lv-hero-icon">🍽️</div>
              <div className="lv-hero-info">
                <div className="lv-hero-crumb">Unit {lessonIdx + 1} — {lesson.title}</div>
                <div className="lv-hero-title">{lesson.title}</div>
                <div className="lv-hero-meta">
                  {levelName} · {modules.length} modules · {doneCount} complete
                </div>
              </div>
              <div className="lv-hero-pct">{Math.round((doneCount / modules.length) * 100)}%</div>
            </div>

            {/* Module progression */}
            <div className="lv-section-head">Module progression</div>

            <div className="lv-modules">
              {modules.map((mod, i) => {
                const cfg = statusConfig[mod.status];
                const clickable = mod.status !== "locked" && mod.types.includes("MCQ");
                return (
                  <div
                    key={i}
                    className={`lv-mod ${cfg.borderClass}${clickable ? " lv-mod--clickable" : ""}`}
                    onClick={() => clickable && setQuizModule(mod)}
                  >
                    <ModuleIcon status={mod.status} />
                    <div className="lv-mod-info">
                      <div className="lv-mod-title">{mod.num} — {mod.title}</div>
                      <div className="lv-mod-sub">{mod.sub}</div>
                      {mod.types.length > 0 && (
                        <div className="lv-mod-tags">
                          {mod.types.map((t, j) => (
                            <span key={j} className="lv-type-tag">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className={`lv-tag ${cfg.labelClass}`}>{cfg.label}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

// ============================================================
// MCQ QUIZ
// ============================================================
const DEMO_QUESTIONS = [
  { q: "Which word best describes the first course of a formal dinner served before the main dish?", options: ["Entrée", "Dessert", "Appetizer", "Beverage"], correct: 2 },
  { q: "What do you call the list of food and drinks available in a restaurant?", options: ["Receipt", "Menu", "Invoice", "Catalogue"], correct: 1 },
  { q: "Which term refers to a small amount of food served before the main course?", options: ["Entrée", "Side dish", "Amuse-bouche", "Dessert"], correct: 2 },
  { q: "What is the French term for a fixed-price multi-course meal?", options: ["À la carte", "Table d'hôte", "Prix fixe", "Tasting menu"], correct: 2 },
  { q: "Which word means the tip or gratuity left for the waiter?", options: ["Service charge", "Compliment", "Gratuity", "Cover charge"], correct: 2 },
  { q: "What is the term for the last course of a formal meal?", options: ["Starter", "Sorbet", "Entrée", "Dessert"], correct: 3 },
  { q: "Which phrase means ordering individual dishes rather than a set menu?", options: ["Prix fixe", "À la carte", "Chef's menu", "Set menu"], correct: 1 },
  { q: "What do you call a dish prepared according to the chef's special recipe of the day?", options: ["Staple", "House special", "Special of the day", "Seasonal dish"], correct: 2 },
];

function MCQQuiz({ mod, lesson, onBack, user }) {
  const [current,   setCurrent]   = useState(0);
  const [answers,   setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft,  setTimeLeft]  = useState(8 * 60);

  const questions = DEMO_QUESTIONS;
  const total     = questions.length;
  const answered  = Object.keys(answers).length;
  const q         = questions[current];
  const chosen    = answers[current] ?? null;

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => setTimeLeft(s => {
      if (s <= 1) { setSubmitted(true); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [submitted]);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  const score = submitted
    ? questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0)
    : 0;

  if (submitted) {
    const pct    = Math.round((score / total) * 100);
    const passed = pct >= 75;
    const xpEarned = passed ? (pct === 100 ? 30 : 20) : 0;
    return (
      <div className="mcq-result">
        <div className="mcq-result-icon">{passed ? "🎉" : "📚"}</div>
        <div className="mcq-result-title">{passed ? "Quiz Complete!" : "Keep Practicing"}</div>
        <div className="mcq-result-score">{score}/{total} · {pct}%</div>
        <div className="mcq-result-sub">{passed ? `You earned +${xpEarned} XP` : "Score 75% or above to earn XP"}</div>
        <div className="mcq-result-actions">
          <button className="mcq-btn mcq-btn--outline" onClick={() => { setAnswers({}); setCurrent(0); setSubmitted(false); setTimeLeft(8*60); }}>Retake</button>
          <button className="mcq-btn mcq-btn--primary" onClick={onBack}>Back to module</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mcq-shell">
      <div className="mcq-progress-outer">
        <div className="mcq-progress-fill" style={{ width: (((current + 1) / total) * 100) + "%" }} />
      </div>
      <div className="mcq-header">
        <span className="mcq-counter">Question {current + 1} of {total}</span>
        <span className="mcq-timer">{mm}:{ss}</span>
      </div>
      <div className="mcq-q-progress">
        <div className="mcq-q-progress-fill" style={{ width: (((current + 1) / total) * 100) + "%" }} />
      </div>
      <div className="mcq-question">{q.q}</div>
      <div className="mcq-options">
        {q.options.map((opt, i) => {
          const letter  = ["A","B","C","D"][i];
          const isChosen = chosen === i;
          return (
            <div key={i} className={`mcq-option${isChosen ? " mcq-option--chosen" : ""}`} onClick={() => setAnswers(a => ({ ...a, [current]: i }))}>
              <span className={`mcq-option-letter${isChosen ? " mcq-option-letter--chosen" : ""}`}>{letter}</span>
              <span className="mcq-option-text">{opt}</span>
              {isChosen && (
                <span className="mcq-option-check">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="mcq-footer">
        <div className="mcq-footer-nav">
          <button className="mcq-btn mcq-btn--outline" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>← Previous</button>
          {current < total - 1 && <button className="mcq-btn mcq-btn--primary" onClick={() => setCurrent(c => c + 1)}>Next →</button>}
        </div>
        <button className="mcq-btn mcq-btn--submit" onClick={() => setSubmitted(true)}>Submit quiz</button>
      </div>
      <div className="mcq-xp-hint">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Score 75% or above to earn <strong>20 XP</strong>. Perfect score earns bonus <strong>+10 XP</strong>.
      </div>
      <div className="mcq-nav-label">QUESTION NAVIGATOR</div>
      <div className="mcq-nav-grid">
        {questions.map((_, i) => (
          <div key={i} className={`mcq-nav-dot${i === current ? " mcq-nav-dot--current" : ""}${answers[i] !== undefined ? " mcq-nav-dot--answered" : ""}`} onClick={() => setCurrent(i)}>{i + 1}</div>
        ))}
      </div>
      <div className="mcq-nav-status">{answered} answered · {total - answered} remaining</div>
    </div>
  );
}
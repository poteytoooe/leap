import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../css/global.css";

// ── Shared avatar URL ──────────────────────────
const ADMIN_AVATAR =
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Admin&backgroundColor=ffd5b8";

// =============================================
//  SIDEBAR
// =============================================
function Sidebar({ page, setPage }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login"); };
  const navItems = [
    { key: "profile",   icon: "👤", label: "PROFILE" },
    { key: "users",     icon: "📋", label: "USERS LIST" },
    { key: "leaderboard", icon: "📈", label: "LEADER BOARD" },
    { key: "events",    icon: "🔔", label: "EVENTS" },
    { key: "calendar",  icon: "📅", label: "CALENDAR OF ACTIVITIES" },
    { key: "achievements", icon: "🏆", label: "ACHIEVEMENTS" },
    { key: "progress",  icon: "📊", label: "PROGRESS" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          <img src={ADMIN_AVATAR} alt="Admin" />
        </div>
        <div>
          <div className="sidebar-name">Hi, Admin Name</div>
          <span
            className="sidebar-viewprofile"
            onClick={() => setPage("profile")}
          >
            View profile
          </span>
        </div>
      </div>

      <button
        className="sidebar-logout"
        onClick={handleLogout}
      >
        Log out
      </button>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`nav-item ${page === item.key ? "active" : ""}`}
            onClick={() => setPage(item.key)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

// =============================================
//  SEARCH BAR
// =============================================
function SearchBar() {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input type="text" placeholder="Search Course/Task" />
    </div>
  );
}

// =============================================
//  PAGE: DASHBOARD (home)
// =============================================
function DashboardPage({ setPage }) {
  return (
    <div className="main">
      <SearchBar />
      <div className="dash-banner">
        <div className="dash-banner-overlay" />
        <div className="dash-banner-title">Welcome Tigers!</div>
      </div>
      <div className="dash-cards">
        <div
          className="dash-card dash-card--orange"
          onClick={() => setPage("lessons")}
        >
          <span className="dash-card-label">LESSONS CREATED</span>
          <span className="dash-card-emoji">🗂️</span>
        </div>
        <div className="dash-card dash-card--slate">
          <span className="dash-card-label">ACTIVE STUDENTS</span>
          <span className="dash-card-emoji">🎯</span>
        </div>
        <div className="dash-card dash-card--peach">
          <span className="dash-card-label">PENDING ITEMS</span>
          <span className="dash-card-emoji">⏳</span>
        </div>
      </div>
    </div>
  );
}

// =============================================
//  PAGE: ADMIN PROFILE
// =============================================
function ProfilePage({ setPage }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login"); };
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState({
    fullName: "Martin Cezar Ventajar Patol",
    phone: "+639 876 543 212",
    age: "28",
    birthdate: "05-31-1997",
    address:
      "123 Maharlika Highway Barangay Concepcion Pequeña\nNaga City, Camarines Sur 4400\nPhilippines",
  });
  const [snapshot, setSnapshot] = useState(fields);
  const [toast, setToast] = useState(false);

  const startEdit = () => { setSnapshot(fields); setEditing(true); };
  const save = () => {
    setEditing(false);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };
  const cancel = () => { setFields(snapshot); setEditing(false); };
  const update = (k) => (e) => setFields((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="ap-root">
      {/* Sidebar */}
      <aside className="ap-sidebar">
        <div className="ap-avatar-section">
          <div className="ap-avatar-circle">
            <img src={ADMIN_AVATAR} alt="Admin" />
          </div>
          <p className="ap-name">Hi, Admin Name</p>
          <div className="ap-links">
            <span className="ap-link">View Avatar</span>
            <span className="ap-link">Avatar Store</span>
          </div>
        </div>
        <div className="ap-footer">
          <button className="ap-footer-btn" onClick={handleLogout}>Log out</button>
          <button className="ap-footer-btn" onClick={() => setPage("dashboard")}>Back</button>
        </div>
      </aside>

      {/* Main */}
      <div className="ap-main">
        {/* Banner */}
        <div className="ap-banner">
          <div>
            <div className="ap-banner-title">Welcome Tigers!</div>
            <p className="ap-banner-sub">
              We are proud to have you join our vibrant community of learners, leaders,
              and achievers. At NCF, we are committed to nurturing excellence, integrity,
              and innovation as you pursue your academic journey.
            </p>
          </div>
          <img
            className="ap-seal"
            src="https://upload.wikimedia.org/wikipedia/en/6/6e/Nueva_Caceres_College_seal.svg"
            alt="NCF Seal"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>

        {/* Form card */}
        <div className="ap-card">
          <div className="ap-edit-row">
            <span className="ap-edit-link" onClick={startEdit}>Edit info</span>
          </div>
          <div className="ap-form-grid">
            {/* Admin ID */}
            <div className="ap-fg">
              <label className="ap-label">Admin ID:</label>
              <input className="ap-input" type="text" value="23-03281" readOnly />
            </div>
            {/* Full Name */}
            <div className="ap-fg">
              <label className="ap-label">Full Name:</label>
              <input
                className={`ap-input ${editing ? "editable" : ""}`}
                type="text" value={fields.fullName}
                readOnly={!editing} onChange={update("fullName")}
              />
            </div>
            {/* Phone / Age / Birthdate */}
            <div className="ap-fg ap-fg--trio">
              <div className="ap-fg">
                <label className="ap-label">Phone number:</label>
                <input
                  className={`ap-input ${editing ? "editable" : ""}`}
                  type="text" value={fields.phone}
                  readOnly={!editing} onChange={update("phone")}
                />
              </div>
              <div className="ap-fg ap-fg--age">
                <label className="ap-label">Age:</label>
                <input
                  className={`ap-input ${editing ? "editable" : ""}`}
                  type="text" value={fields.age}
                  readOnly={!editing} onChange={update("age")}
                />
              </div>
              <div className="ap-fg">
                <label className="ap-label">Birthdate:</label>
                <input
                  className={`ap-input ${editing ? "editable" : ""}`}
                  type="text" value={fields.birthdate}
                  readOnly={!editing} onChange={update("birthdate")}
                />
              </div>
            </div>
            {/* Address */}
            <div className="ap-fg ap-fg--full">
              <label className="ap-label">Address:</label>
              <textarea
                className={`ap-textarea ${editing ? "editable" : ""}`}
                value={fields.address}
                readOnly={!editing} onChange={update("address")}
              />
            </div>
          </div>
          {editing && (
            <div className="ap-action-row visible">
              <button className="ap-btn-cancel" onClick={cancel}>Cancel</button>
              <button className="ap-btn-save" onClick={save}>Save Changes</button>
            </div>
          )}
        </div>
      </div>

      <div className={`toast ${toast ? "show" : ""}`}>Changes saved! ✓</div>
    </div>
  );
}

// =============================================
//  PAGE: USER LIST
// =============================================
const STUDENTS = [
  { name: "Clara C.",   course: "BS Computer Science", id: "23-03281" },
  { name: "Emily W.",   course: "BS Computer Science", id: "23-03281" },
  { name: "Maria O.",   course: "BS Computer Science", id: "23-03282" },
  { name: "Mia K.",     course: "BS Computer Science", id: "23-03283" },
  { name: "Melody M.",  course: "BS Computer Science", id: "23-03284" },
  { name: "Carlos R.",  course: "BS Computer Science", id: "23-03285" },
  { name: "Ana P.",     course: "BS Information Tech.", id: "23-03286" },
  { name: "Diego S.",   course: "BS Information Tech.", id: "23-03287" },
  { name: "Lea T.",     course: "BS Computer Science", id: "23-03288" },
  { name: "Felix G.",   course: "BS Computer Science", id: "23-03289" },
  { name: "Grace Y.",   course: "BS Information Tech.", id: "23-03290" },
  { name: "Ben C.",     course: "BS Computer Science", id: "23-03291" },
];

function UserListPage() {
  const [search, setSearch] = useState("");
  const filtered = STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.includes(search)
  );

  return (
    <div className="main">
      <SearchBar />
      <div className="page-title-box" style={{ width: "fit-content" }}>
        <span className="page-title-icon">📋</span>
        <span className="page-title-text">USER LIST</span>
      </div>

      <div className="ul-table-wrap" style={{ flex: 1 }}>
        <div className="ul-table-title">STUDENTS LIST</div>
        <div style={{ marginBottom: 10 }}>
          <input
            style={{
              background: "rgba(255,255,255,0.15)", border: "none",
              borderRadius: 8, padding: "8px 14px", color: "white",
              fontSize: 13, fontWeight: 700, width: "100%", outline: "none",
            }}
            placeholder="🔍  Filter by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="ul-table-header">
          <span>STUDENT NAME</span>
          <span>STUDENT ID</span>
          <span>STATUS</span>
        </div>
        <div className="ul-table-body">
          {filtered.map((s, i) => (
            <div className="ul-row" key={i}>
              <div className="ul-student-info">
                <div className="ul-student-avatar">
                  <img
                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${s.name}&backgroundColor=b6e3f4`}
                    alt={s.name}
                  />
                </div>
                <div>
                  <div className="ul-student-name">{s.name}</div>
                  <div className="ul-student-course">{s.course}</div>
                </div>
              </div>
              <span className="ul-id">{s.id}</span>
              <span className="ul-status-badge">ACTIVE</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================
//  PAGE: LEADERBOARD (Admin)
// =============================================
const LB_STUDENTS = [
  { rank: 1, name: "Clara C.",  sub: "BS Computer Science", pts: "12,450" },
  { rank: 2, name: "Emily W.",  sub: "BS Computer Science", pts: "11,450" },
  { rank: 3, name: "Maria O.",  sub: "BS Computer Science", pts: "10,450" },
  { rank: 4, name: "Mia K.",    sub: "BS Computer Science", pts: "9,450"  },
  { rank: 5, name: "Melody M.", sub: "BS Computer Science", pts: "8,450"  },
];
const RANK_CLASSES = ["", "alb-row--gold", "alb-row--silver", "alb-row--bronze", "", ""];
const BAR_HEIGHTS = [55, 75, 100, 70, 48];
const BAR_COLORS  = ["#E07B2A", "#b3c7a0", "#3CB84A", "#b3c7a0", "#E07B2A"];

function LeaderboardPage() {
  const [filter, setFilter] = useState("WEEKLY");

  return (
    <div className="main">
      <SearchBar />
      <div className="page-title-box" style={{ width: "fit-content" }}>
        <span className="page-title-icon">📈</span>
        <span className="page-title-text">LEADERBOARD</span>
      </div>

      <div className="alb-content">
        {/* Filters */}
        <div className="alb-filters">
          {["WEEKLY", "MONTHLY", "ALL TIME"].map((f) => (
            <button
              key={f}
              className={`alb-filter ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Mid: donut + bar chart */}
        <div className="alb-mid">
          {/* Donut */}
          <div className="alb-donut-wrap">
            <div className="alb-donut">
              <svg viewBox="0 0 130 130">
                <circle cx="65" cy="65" r="52" fill="none" stroke="#1a5c24" strokeWidth="14" />
                <circle
                  cx="65" cy="65" r="52" fill="none"
                  stroke="#E07B2A" strokeWidth="14"
                  strokeDasharray="98 327" strokeDashoffset="0"
                  strokeLinecap="round"
                  transform="rotate(-90 65 65)"
                />
                <circle
                  cx="65" cy="65" r="52" fill="none"
                  stroke="#f0b800" strokeWidth="14"
                  strokeDasharray="40 327" strokeDashoffset="-98"
                  strokeLinecap="round"
                  transform="rotate(-90 65 65)"
                />
              </svg>
              <div className="alb-donut-text">
                <div className="alb-donut-pct">30%</div>
              </div>
            </div>
            <div className="alb-donut-label">STUDENTS PROGRESS</div>
          </div>

          {/* Bar chart */}
          <div className="alb-chart-wrap">
            <div className="alb-chart">
              {["Mia K.", "Maria O.", "Clara C.", "Emily W.", "Melody M."].map((name, i) => (
                <div className="alb-bar-group" key={name}>
                  {i === 2 && <div className="alb-crown">👑</div>}
                  <div className="alb-bar-avatar">🧑</div>
                  <div
                    className="alb-bar"
                    style={{ height: BAR_HEIGHTS[i], background: BAR_COLORS[i] }}
                  />
                  <div className="alb-bar-name">{name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="alb-tables">
          {["TOP STUDENTS", "CLASS RANKING"].map((title) => (
            <div className="alb-table" key={title}>
              <div className="alb-table-hdr">
                <span>{title}</span>
                <span className="alb-see-all">See all ›</span>
              </div>
              {LB_STUDENTS.map((s) => (
                <div className={`alb-row ${RANK_CLASSES[s.rank]}`} key={s.rank}>
                  <span className="alb-rank">{s.rank}</span>
                  <div className="alb-info">
                    <div className="alb-info-name">{s.name}</div>
                    <div className="alb-info-sub">
                      {title === "CLASS RANKING" ? "Batch 2026" : s.sub}
                    </div>
                  </div>
                  <span className="alb-pts">{s.pts} PTS</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================
//  PAGE: CALENDAR (Admin)
// =============================================
const EVENTS_DATA = [
  { date: "18 MAY", label: "Quiz – Module 1",           sub: "BS CompSci · 10:00 AM", red: false },
  { date: "19 MAY", label: "Assignment 2 Deadline",      sub: "All Sections · 11:59 PM", red: true  },
  { date: "21 MAY", label: "Module 3 Introduction",      sub: "Room 301 · 3:00 PM", red: false },
  { date: "25 MAY", label: "Midterm Review",             sub: "Lab B · 8:00 AM", red: false },
  { date: "28 MAY", label: "Final Project Due",          sub: "All Sections · 11:59 PM", red: true  },
];

function CalendarPage() {
  const [tab, setTab] = useState("lessons");

  const CAL_DAYS = [
    { d: 1 }, { d: 2 }, { d: 3, dots: ["blue"] },
    { d: 4 }, { d: 5, dots: ["orange"] }, { d: 6 }, { d: 7 },
    { d: 8 }, { d: 9 }, { d: 10, dots: ["blue", "orange"] },
    { d: 11 }, { d: 12 }, { d: 13 }, { d: 14, dots: ["orange", "blue"] },
    { d: 15 }, { d: 16 }, { d: 17, dots: ["orange"] },
    { d: 18 }, { d: 19 }, { d: 20, dots: ["red"] }, { d: 21 },
    { d: 22 }, { d: 23 }, { d: 24, dots: ["blue"] },
    { d: 25 }, { d: 26, today: true, dots: ["blue", "orange"] },
    { d: 27 }, { d: 28, dots: ["red"] },
  ];

  return (
    <div className="main">
      <SearchBar />
      <div className="page-title-box" style={{ width: "fit-content" }}>
        <span className="page-title-icon">📅</span>
        <span className="page-title-text">CALENDAR OF ACTIVITIES</span>
      </div>

      {/* Tabs */}
      <div className="acal-tabs">
        <button
          className={`acal-tab acal-tab--lessons ${tab === "lessons" ? "" : "opacity-60"}`}
          onClick={() => setTab("lessons")}
        >
          📖 REVIEW LESSONS
        </button>
        <button
          className={`acal-tab acal-tab--deadlines ${tab === "deadlines" ? "" : "opacity-60"}`}
          onClick={() => setTab("deadlines")}
        >
          🕐 DEADLINES
        </button>
      </div>

      <div className="acal-body">
        {/* Calendar grid */}
        <div className="acal-grid-wrap">
          <div className="acal-month-nav">
            <button className="acal-nav-btn">‹</button>
            <span className="acal-month-label">May 2026</span>
            <button className="acal-nav-btn">›</button>
          </div>
          <div className="acal-grid">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
              <div className="acal-day-hdr" key={d}>{d}</div>
            ))}
            {/* May 2026 starts on Friday — 5 empty cells */}
            {[0,1,2,3,4].map((i) => (
              <div className="acal-cell acal-cell--empty" key={`e${i}`} />
            ))}
            {CAL_DAYS.map((cell) => (
              <div
                key={cell.d}
                className={`acal-cell ${cell.today ? "acal-cell--today" : ""}`}
              >
                {cell.d}
                <div style={{ display: "flex", gap: 2, flexWrap: "wrap", marginTop: 2 }}>
                  {(cell.dots || []).map((color, i) => (
                    <span key={i} className={`acal-dot acal-dot--${color}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events panel */}
        <div className="acal-panel">
          <div className="acal-panel-title">
            <span className="acal-panel-dot" />
            Upcoming Events
          </div>
          {EVENTS_DATA.map((ev, i) => (
            <div className={`acal-event ${ev.red ? "acal-event--red" : ""}`} key={i}>
              <div className={`acal-event-date ${ev.red ? "acal-event-date--red" : ""}`}>
                {ev.date}
              </div>
              <div className="acal-event-name">{ev.label}</div>
              <div className="acal-event-sub">📍 {ev.sub}</div>
            </div>
          ))}
          <button className="acal-add-btn">ADD NEW ACTIVITY</button>
        </div>
      </div>
    </div>
  );
}

// =============================================
//  PAGE: PROGRESS (Admin)
// =============================================
const TASK_DATA = [
  { task: "Module 1 – Intro",  student: "Ana Reyes",    pct: 100, status: "passed"   },
  { task: "Module 2 – Data",   student: "Ben Cruz",     pct: 72,  status: "progress" },
  { task: "Module 3 – Logic",  student: "Cara Lim",     pct: 45,  status: "failed"   },
  { task: "Module 4 – UI/UX",  student: "Diego Santos", pct: 0,   status: "missing"  },
  { task: "Module 5 – Final",  student: "Elena Tan",    pct: 88,  status: "passed"   },
  { task: "Module 6 – Review", student: "Felix Go",     pct: 60,  status: "progress" },
  { task: "Module 7 – Deploy", student: "Grace Yap",    pct: 100, status: "passed"   },
];

function ProgressPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const fillClass = (status) => ({
    passed: "prg-tr-fill--green",
    progress: "prg-tr-fill--orange",
    failed: "prg-tr-fill--red",
    missing: "prg-tr-fill--red",
  }[status] || "prg-tr-fill--green");

  const filtered = activeFilter === "all"
    ? TASK_DATA
    : TASK_DATA.filter((r) => r.status === activeFilter);

  // Donut: passed=50%, failed=14%, progress=25%, missing=11%
  // r=70 circumference=439.8
  const C = 439.8;
  const segments = [
    { pct: 0.50, color: "#3CB84A", offset: 0 },
    { pct: 0.14, color: "#e03a3a", offset: 0.50 * C },
    { pct: 0.25, color: "#3a8eff", offset: (0.50 + 0.14) * C },
    { pct: 0.11, color: "#f0b800", offset: (0.50 + 0.14 + 0.25) * C },
  ];

  return (
    <div className="main">
      <SearchBar />
      <div className="page-title-box" style={{ width: "fit-content" }}>
        <span className="page-title-icon">📊</span>
        <span className="page-title-text">PROGRESS</span>
      </div>

      {/* Stat cards */}
      <div className="prg-stat-cards">
        {[
          { icon: "✅", num: 36, lbl: "PASSED",      cls: "passed"   },
          { icon: "❌", num: 0,  lbl: "FAILED",       cls: "failed"   },
          { icon: "🔄", num: 3,  lbl: "IN PROGRESS",  cls: "progress" },
          { icon: "⚠️", num: 4,  lbl: "MISSING",      cls: "missing"  },
        ].map((s) => (
          <div className={`prg-stat-card prg-stat-card--${s.cls}`} key={s.lbl}>
            <span className="prg-stat-icon">{s.icon}</span>
            <div>
              <div className="prg-stat-num">{s.num}</div>
              <div className="prg-stat-lbl">{s.lbl}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="prg-filter-tabs">
        {[
          { key: "missing",  label: "MISSING",     cls: "missing"  },
          { key: "passed",   label: "FINISHED",    cls: "finished" },
          { key: "progress", label: "IN PROGRESS", cls: "progress" },
        ].map((t) => (
          <button
            key={t.key}
            className={`prg-filter-tab prg-filter-tab--${t.cls}`}
            onClick={() => setActiveFilter(activeFilter === t.key ? "all" : t.key)}
            style={{ opacity: activeFilter === t.key || activeFilter === "all" ? 1 : 0.55 }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="prg-body">
        {/* Left: donut + legend */}
        <div className="prg-left">
          <div className="prg-dist-title">🎯 Overall Distribution</div>
          <div className="prg-donut-wrap">
            <svg className="prg-donut" viewBox="0 0 160 160">
              {segments.map((seg, i) => (
                <circle
                  key={i}
                  cx="80" cy="80" r="70"
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="30"
                  strokeDasharray={`${seg.pct * C} ${C}`}
                  strokeDashoffset={-seg.offset}
                  transform="rotate(-90 80 80)"
                />
              ))}
            </svg>
            <div className="prg-donut-center">
              36<small>Students</small>
            </div>
          </div>
          <div className="prg-legend">
            {[
              { color: "#3CB84A", label: "Passed (50%)"      },
              { color: "#e03a3a", label: "Failed (14%)"      },
              { color: "#3a8eff", label: "In Progress (25%)" },
              { color: "#f0b800", label: "Missing (11%)"     },
            ].map((l) => (
              <div className="prg-legend-item" key={l.label}>
                <span className="prg-legend-dot" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
          <div className="prg-action-btns">
            <button className="prg-action-btn prg-action-btn--passed" onClick={() => setActiveFilter("passed")}>✅ PASSED</button>
            <button className="prg-action-btn prg-action-btn--failed" onClick={() => setActiveFilter("failed")}>❌ FAILED</button>
            <button className="prg-action-btn prg-action-btn--wip"    onClick={() => setActiveFilter("progress")}>🔄 WIP</button>
          </div>
        </div>

        {/* Right: table */}
        <div className="prg-right">
          <div className="prg-table-title">📋 Course Task Progress</div>
          <div className="prg-table-hdr">
            <span>TASK / COURSE</span>
            <span>STUDENT</span>
            <span>PROGRESS</span>
            <span>STATUS</span>
          </div>
          <div className="prg-table-body">
            {filtered.map((row, i) => (
              <div className="prg-table-row" key={i}>
                <span className="prg-tr-task">{row.task}</span>
                <span className="prg-tr-student">{row.student}</span>
                <div className="prg-tr-bar-wrap">
                  <div className="prg-tr-bar">
                    <div
                      className={`prg-tr-fill ${fillClass(row.status)}`}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="prg-tr-pct">{row.pct}%</span>
                </div>
                <span className={`prg-status-badge prg-status-badge--${row.status}`}>
                  {row.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================
//  PAGE: EVENTS (placeholder)
// =============================================
function EventsPage() {
  return (
    <div className="main">
      <SearchBar />
      <div className="page-title-box" style={{ width: "fit-content" }}>
        <span className="page-title-icon">🔔</span>
        <span className="page-title-text">EVENTS</span>
      </div>
      <div style={{
        flex: 1, background: "var(--light-green)", borderRadius: 18,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, fontWeight: 800, color: "var(--forest-green)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
      }}>
        🔔 Events module coming soon...
      </div>
    </div>
  );
}

// =============================================
//  PAGE: ACHIEVEMENTS (placeholder)
// =============================================
function AchievementsPage() {
  return (
    <div className="main">
      <SearchBar />
      <div className="page-title-box" style={{ width: "fit-content" }}>
        <span className="page-title-icon">🏆</span>
        <span className="page-title-text">ACHIEVEMENTS</span>
      </div>
      <div style={{
        flex: 1, background: "var(--light-green)", borderRadius: 18,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, fontWeight: 800, color: "var(--forest-green)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
      }}>
        🏆 Achievements module coming soon...
      </div>
    </div>
  );
}

// =============================================
//  APP ROOT
// =============================================
export default function AdminApp() {
  const [page, setPage] = useState("dashboard");

  // Profile page has its own full layout
  if (page === "profile") {
    return <ProfilePage setPage={setPage} />;
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":    return <DashboardPage setPage={setPage} />;
      case "users":        return <UserListPage />;
      case "leaderboard":  return <LeaderboardPage />;
      case "events":       return <EventsPage />;
      case "calendar":     return <CalendarPage />;
      case "achievements": return <AchievementsPage />;
      case "progress":     return <ProgressPage />;
      default:             return <DashboardPage setPage={setPage} />;
    }
  };

  return (
    <div className="admin-root">
      <Sidebar page={page} setPage={setPage} />
      {renderPage()}
    </div>
  );
}
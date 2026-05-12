import { useState, useEffect, useCallback } from "react";
import { DB, api } from "./db.js";
import { LoadingState, Sidebar, TopBar, Spinner } from "./SharedUI.jsx";

// ============================================================
// ADMIN DASHBOARD (shell)
// ============================================================
export function AdminDashboard({ user, onLogout }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState("subscriptions");

  const initials = (user.name || "AD").slice(0, 2).toUpperCase();

  const loadData = useCallback(() => {
    setLoading(true);
    api.getAdminDashboard().then(setData).finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const menuItems = [
    { name: "Users",         key: "users"         },
    { name: "Subscriptions", key: "subscriptions" },
    { name: "Courses",       key: "courses"       },
    { name: "Departments",   key: "depts"         },
    { name: "API Usage",     key: "api"           },
    { name: "Audit Log",     key: "audit"         },
  ];

  return (
    <div className="shell">
      <Sidebar
        role="Admin"
        userInitials={initials}
        userName={user.name || "Administrator"}
        userRole="NCF IT Dept"
        menuItems={menuItems}
        menuSections={[{ title: "Governance", start: 0, end: 6 }]}
        avatarClass="av-green"
        onLogout={onLogout}
        activeTab={tab}
        onTabChange={setTab}
      />
      <div className="main">
        <TopBar
          breadcrumb={`Admin › ${menuItems.find(m => m.key === tab)?.name || "Dashboard"}`}
          right={
            <button onClick={loadData} className="btn btn-o btn-sm" style={{ height: 26 }}>
              ↻ Refresh
            </button>
          }
        />
        <div className="pg">
          {loading ? <LoadingState /> : data && (
            <>
              {tab === "subscriptions" && <AdminSubscriptions data={data} onRefresh={loadData} />}
              {tab === "users"         && <AdminUsers         data={data} />}
              {tab === "api"           && <AdminApiUsage      data={data} />}
              {tab === "courses"       && <AdminCourses />}
              {tab === "depts"         && <div style={{ fontSize: 12, color: "var(--text-muted)", padding: 20 }}>Department management coming soon.</div>}
              {tab === "audit"         && <AdminAudit />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN — Subscriptions Tab
// ============================================================
function AdminSubscriptions({ data, onRefresh }) {
  const [activating, setActivating] = useState(null);

  async function activate(subId) {
    setActivating(subId);
    await api.activateSubscription(subId);
    onRefresh();
    setActivating(null);
  }

  const tagClass = { active: "tg", pending: "tgold", expired: "tred" };
  const avClass  = ["av-dark", "av-green", "av-gold", "av-green"];

  return (
    <>
      <div className="g4">
        <div className="sc2">
          <div className="sc2-val" style={{ color: "var(--ncf-green-600)" }}>{data.active}</div>
          <div className="sc2-lbl">Active</div>
        </div>
        <div className="sc2" style={{ background: "var(--ncf-gold-50)", borderColor: "var(--ncf-gold-100)" }}>
          <div className="sc2-val" style={{ color: "var(--ncf-gold-700)" }}>{data.pending}</div>
          <div className="sc2-lbl">Pending</div>
        </div>
        <div className="sc2" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
          <div className="sc2-val" style={{ color: "#991b1b" }}>{data.expired}</div>
          <div className="sc2-lbl">Expired</div>
        </div>
        <div className="sc2">
          <div className="sc2-val">{(data.totalTokens / 1000).toFixed(0)}k</div>
          <div className="sc2-lbl">Tokens today</div>
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dark)", marginBottom: 12 }}>Student subscriptions</div>
        {data.subs.map((s, i) => {
          const ini = s.student ? (s.student.first_name[0] + s.student.last_name[0]).toUpperCase() : "?";
          return (
            <div key={i} className="row-item" style={i === data.subs.length - 1 ? { borderBottom: "none" } : {}}>
              <div className={`av av-md ${avClass[i % 4]}`}>{ini}</div>
              <div className="ri-info">
                <div className="ri-title">{s.student?.first_name} {s.student?.last_name}</div>
                <div className="ri-sub">
                  {s.user?.email} · {
                    s.status === "active"  ? "Active · exp. " + s.exp_date :
                    s.status === "pending" ? "Paid — awaiting activation" :
                                            "Expired " + s.exp_date
                  }
                </div>
              </div>
              <span className={`tag ${tagClass[s.status]}`}>
                {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
              </span>
              {s.status === "pending" && (
                <button className="btn btn-p btn-sm" style={{ height: 28, marginLeft: 8 }} disabled={activating === s.sub_id} onClick={() => activate(s.sub_id)}>
                  {activating === s.sub_id ? <Spinner sm /> : "Activate"}
                </button>
              )}
              {s.status === "active"  && <button className="btn btn-o btn-sm"      style={{ height: 28, marginLeft: 8 }}>Renew</button>}
              {s.status === "expired" && <button className="btn btn-danger btn-sm" style={{ height: 28, marginLeft: 8 }}>Renew</button>}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ============================================================
// ADMIN — Users Tab
// ============================================================
function AdminUsers({ data }) {
  const avClass = { admin: "av-green", instructor: "av-gold", student: "av-dark" };

  const allUsers = DB.users.map(u => {
    const admin      = DB.admins.find(a => a.user_id === u.user_id);
    const instructor = DB.instructors.find(i => i.user_id === u.user_id);
    const student    = DB.students.find(s => s.user_id === u.user_id);
    const role       = admin ? "admin" : instructor ? "instructor" : student ? "student" : "unknown";
    const name       = admin ? "Administrator" : instructor ? instructor.first_name + " " + instructor.last_name : student ? student.first_name + " " + student.last_name : "—";
    return { ...u, role, name };
  });

  return (
    <div className="card">
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dark)", marginBottom: 10 }}>All users ({allUsers.length})</div>
      {allUsers.map((u, i) => (
        <div key={i} className="row-item" style={i === allUsers.length - 1 ? { borderBottom: "none" } : {}}>
          <div className={`av av-sm ${avClass[u.role] || "av-dark"}`}>{u.name.slice(0, 2).toUpperCase()}</div>
          <div className="ri-info">
            <div className="ri-title">{u.name}</div>
            <div className="ri-sub">{u.email} · Joined {u.date_joined}</div>
          </div>
          <span
            className={`tag ${u.role === "admin" ? "tg" : u.role === "instructor" ? "tgold" : ""}`}
            style={u.role === "student" ? { background: "#f1f5f9", color: "var(--text-muted)", border: "1px solid var(--border-light)" } : {}}
          >
            {u.role}
          </span>
          <span className="tag tg" style={{ marginLeft: 4 }}>{u.is_active ? "Active" : "Inactive"}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// ADMIN — API Usage Tab
// ============================================================
function AdminApiUsage({ data }) {
  return (
    <div className="card">
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dark)", marginBottom: 10 }}>API usage today</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid var(--border-light)" }}>
        <span style={{ fontSize: 12, color: "var(--text-dark)" }}>System total</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ncf-green-600)" }}>{data.totalTokens.toLocaleString()} tokens</span>
      </div>
      {data.apiUsage.map((r, i) => (
        <div key={i} className="row-item" style={{ padding: "8px 0", ...(i === data.apiUsage.length - 1 ? { borderBottom: "none" } : {}) }}>
          <div className="av av-xs av-green" style={{ flexShrink: 0 }}>
            {r.student ? (r.student.first_name[0] + r.student.last_name[0]).toUpperCase() : "??"}
          </div>
          <div className="ri-info" style={{ paddingLeft: 6 }}>
            <div className="ri-title" style={{ fontSize: 11 }}>{r.student?.first_name} {r.student?.last_name}</div>
          </div>
          <div style={{ width: 80, height: 4, background: "var(--ncf-green-100)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: r.pct + "%", height: "100%", background: "var(--ncf-green-500)" }} />
          </div>
          <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 8 }}>{r.tokens_used.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// ADMIN — Courses Tab
// ============================================================
function AdminCourses() {
  const [courses, setCourses] = useState([]);
  useEffect(() => { api.getAllCourses().then(setCourses); }, []);

  return (
    <div className="card">
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dark)", marginBottom: 10 }}>Courses ({courses.length})</div>
      {courses.map((c, i) => (
        <div key={i} className="row-item" style={i === courses.length - 1 ? { borderBottom: "none" } : {}}>
          <div className="av av-sm av-green" style={{ fontSize: 9 }}>{c.course_code?.slice(0, 3)}</div>
          <div className="ri-info">
            <div className="ri-title">{c.course_name}</div>
            <div className="ri-sub">{c.description} · {c.lessons} lessons · {c.enrolled} enrolled</div>
          </div>
          <span className="tag tg">{c.is_published ? "Published" : "Draft"}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// ADMIN — Audit Log Tab
// ============================================================
function AdminAudit() {
  const log = [
    { action: "User login",             entity: "juan.delacruz@gbox.ncf.edu.ph",        ts: "2024-10-14 09:12" },
    { action: "Subscription activated", entity: "sub_id:2 (Ana Santos)",                 ts: "2024-10-13 11:05" },
    { action: "Grade awarded",          entity: "student_id:2, course_id:1, 96%",        ts: "2024-10-13 10:55" },
    { action: "Badge earned",           entity: "student_id:2, badge: First Steps",      ts: "2024-10-13 10:50" },
    { action: "Submission graded",      entity: "submission_id:2, requirement_id:2",     ts: "2024-10-12 14:30" },
    { action: "User registered",        entity: "kevin.lim@gbox.ncf.edu.ph",             ts: "2024-09-04 08:00" },
  ];

  return (
    <div className="card">
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dark)", marginBottom: 10 }}>Audit log</div>
      {log.map((e, i) => (
        <div key={i} className="row-item" style={i === log.length - 1 ? { borderBottom: "none" } : {}}>
          <div className="av av-sm" style={{ background: "#f1f5f9", color: "var(--text-muted)", fontSize: 10 }}>✓</div>
          <div className="ri-info">
            <div className="ri-title">{e.action}</div>
            <div className="ri-sub">{e.entity}</div>
          </div>
          <span style={{ fontSize: 10, color: "var(--text-muted)", flexShrink: 0 }}>{e.ts}</span>
        </div>
      ))}
    </div>
  );
}

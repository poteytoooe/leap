import { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

// ── SVG icons ──────────────────────────────────────────────────────────────
function GridIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
}
function BookIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
}
function CalIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function TrophyIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 9a6 6 0 0 0 12 0"/><line x1="12" y1="15" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>;
}
function UserIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function FlameIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9 7 6 9 6 13a6 6 0 0 0 12 0c0-4-3-6-6-11z"/></svg>;
}
function StarIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function getLevel(xp) {
  if (xp >= 600) return { label: 'Expert',       min: 600, max: 1000, next: null };
  if (xp >= 300) return { label: 'Advanced',     min: 300, max: 600,  next: 'Expert' };
  if (xp >= 100) return { label: 'Intermediate', min: 100, max: 300,  next: 'Advanced' };
  return               { label: 'Beginner',      min: 0,   max: 100,  next: 'Intermediate' };
}

function initials(user) {
  if (!user) return '??';
  return `${(user.first_name || '?')[0]}${(user.last_name || '')[0] || ''}`.toUpperCase();
}

function displayName(user) {
  if (!user) return 'Student';
  return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
}

// ── Nav config ─────────────────────────────────────────────────────────────
const LEARNING_NAV = [
  { to: '/',            label: 'Dashboard',   icon: <GridIcon />,   end: true },
  { to: '/lessons',     label: 'My subjects', icon: <BookIcon /> },
  { to: '/deadlines',   label: 'Deadlines',   icon: <CalIcon /> },
];
const PROGRESS_NAV = [
  { to: '/leaderboard', label: 'Leaderboard', icon: <TrophyIcon /> },
  { to: '/profile',     label: 'Profile',     icon: <UserIcon /> },
];

// ── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar({ user, xp, onLogout }) {
  const level = getLevel(xp);
  return (
    <aside style={S.sidebar}>
      <div style={S.logo}>
        <div style={S.logoIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b78c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div>
          <div style={S.logoText}>L.E.A.P.</div>
          <div style={S.logoSub}>NCF IRS</div>
        </div>
      </div>

      <NavSection label="LEARNING" items={LEARNING_NAV} />
      <NavSection label="PROGRESS" items={PROGRESS_NAV} />

      <div style={S.sidebarFooter} onClick={onLogout} title="Log out">
        <div style={S.footerAvatar}>{initials(user)}</div>
        <div style={{ minWidth: 0 }}>
          <div style={S.footerName}>{displayName(user)}</div>
          <div style={S.footerSub}>Student · {level.label}</div>
        </div>
      </div>
    </aside>
  );
}

function NavSection({ label, items }) {
  return (
    <div style={S.navSection}>
      <div style={S.navLabel}>{label}</div>
      {items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          style={({ isActive }) => ({ ...S.navLink, ...(isActive ? S.navLinkActive : {}) })}
        >
          <span style={S.navIcon}>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ value, label, bg, gold }) {
  return (
    <div style={{ ...S.statCard, background: bg }}>
      <div style={{ ...S.statValue, ...(gold ? { color: '#b78c1e' } : {}) }}>{value}</div>
      <div style={S.statLabel}>{label}</div>
    </div>
  );
}

// ── Subject card ───────────────────────────────────────────────────────────
function SubjectCard({ subject }) {
  const pct = subject.progress ?? null;
  const instr = (subject.instructor_name || 'IN').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const accent = subject.started === false ? '#e0a800' : '#1a5c38';

  return (
    <div style={S.subjectCard}>
      <div style={{ ...S.subjectBar, background: accent }} />
      <div style={S.subjectBody}>
        <div style={S.subjectMeta}>
          <span style={S.subjectCode}>{subject.code || 'IRS'}</span>
          <span style={S.subjectEnrolled}>{subject.enrolled ? `${subject.enrolled} enrolled` : ''}</span>
        </div>
        <div style={S.subjectName}>{subject.name}</div>
        <div style={S.subjectInstr}>
          <span style={S.instrAvatar}>{instr}</span>
          {subject.instructor_name}{subject.lessons ? ` · ${subject.lessons} lessons` : ''}
        </div>
        {pct !== null && (
          <div style={S.progTrack}>
            <div style={{ ...S.progFill, width: `${pct}%` }} />
          </div>
        )}
        {subject.started === false && (
          <div style={S.subjectPending}>Starts {subject.start_date || 'soon'}</div>
        )}
      </div>
    </div>
  );
}

// ── Deadline card ──────────────────────────────────────────────────────────
function DeadlineCard({ item }) {
  return (
    <div style={S.deadlineCard}>
      <div style={{ ...S.dlIcon, background: item.overdue ? '#fde8e8' : '#e8f5e9' }}>
        {item.overdue
          ? <span style={{ color: '#c0392b', fontWeight: 800, fontSize: 14 }}>!</span>
          : <CalIcon />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={S.dlTitle}>{item.title}</div>
        <div style={S.dlSub}>{item.subject} · {item.type}</div>
      </div>
      <div style={{ ...S.dlPill, ...(item.overdue ? S.dlOverdue : S.dlSoon) }}>
        {item.overdue ? 'Overdue' : `${item.daysLeft} days`}
      </div>
    </div>
  );
}

// ── Dashboard home content ─────────────────────────────────────────────────
function DashboardHome({ user, xp, streak, badges, subjects, deadlines, loading }) {
  const level   = getLevel(xp);
  const xpPct   = Math.min(100, ((xp - level.min) / (level.max - level.min)) * 100);
  const toNext  = level.max - xp;
  const ini     = initials(user);

  return (
    <div style={S.content}>
      {/* Top bar */}
      <div style={S.topBar}>
        <div style={S.breadcrumb}>Dashboard</div>
        <div style={S.topRight}>
          <div style={S.flamePill}><FlameIcon /> {streak} days</div>
          <div style={S.xpPill}><StarIcon /> {xp} XP</div>
          <div style={S.avatarBadge}>
            {ini}
            <span style={S.onlineDot} />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={S.statGrid}>
        <StatCard value={xp}            label="Total XP" bg="#e8f5e9" />
        <StatCard value={level.label}   label="Level"    bg="#fffde7" gold />
        <StatCard value={`${streak} days`} label="Streak" bg="#e8f5e9" />
        <StatCard value={`${badges.earned}/${badges.total}`} label="Badges" bg="#e8f5e9" />
      </div>

      {/* Two columns */}
      <div style={S.twoCol}>
        {/* Left: subjects */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={S.sectionTitle}>My subjects</div>
          {loading
            ? <div style={S.empty}>Loading…</div>
            : subjects.length === 0
              ? <div style={S.empty}>No subjects enrolled yet.</div>
              : subjects.map((s, i) => <SubjectCard key={i} subject={s} />)
          }
        </div>

        {/* Right: XP + deadlines */}
        <div style={S.rightCol}>
          <div style={S.sectionTitle}>XP progress</div>
          <div style={S.xpCard}>
            <div style={S.xpCardTop}>
              <div style={S.xpBadge}><StarIcon /> {level.label}</div>
              <div style={S.xpToNext}>{toNext} XP to {level.next || 'max'}</div>
            </div>
            <div style={S.xpAmt}>{xp} XP</div>
            <div style={S.xpTrack}>
              <div style={{ ...S.xpFill, width: `${xpPct}%` }} />
            </div>
            <div style={S.xpRange}>
              <span>{level.min} XP</span>
              <span>{level.max} XP</span>
            </div>
          </div>

          <div style={{ ...S.sectionTitle, marginTop: 20 }}>Upcoming deadlines</div>
          {deadlines.length === 0
            ? <div style={S.empty}>No upcoming deadlines.</div>
            : deadlines.slice(0, 3).map((d, i) => <DeadlineCard key={i} item={d} />)
          }
        </div>
      </div>
    </div>
  );
}

// ── Root export ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [xp,       setXp]       = useState(0);
  const [streak,   setStreak]   = useState(0);
  const [badges,   setBadges]   = useState({ earned: 0, total: 18 });
  const [subjects, setSubjects] = useState([]);
  const [deadlines,setDeadlines]= useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!user) return;

    api.get(`/users/${user.user_id}`)
      .then(res => {
        const d = res.data;
        setXp(Number(d.xp) || 0);
        setStreak(Number(d.streak) || 0);
        setBadges({ earned: Number(d.badges_earned) || 0, total: 18 });
      })
      .catch(() => {});

    api.get('/subjects/enrolled')
      .then(res => setSubjects(res.data || []))
      .catch(() => setSubjects([]))
      .finally(() => setLoading(false));

    api.get('/assignments/upcoming')
      .then(res => {
        const now = new Date();
        setDeadlines((res.data || []).map(a => {
          const diff = Math.ceil((new Date(a.due_date) - now) / 86400000);
          return {
            title:   a.title,
            subject: a.subject_code || '',
            type:    a.type || 'Task',
            daysLeft: diff,
            overdue:  diff < 0,
          };
        }));
      })
      .catch(() => setDeadlines([]));
  }, [user]);

  function handleLogout() {
    if (window.confirm('Log out?')) { logout(); navigate('/login'); }
  }

  const isDashHome = location.pathname === '/';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #f4f9f4; }
        a { text-decoration: none; color: inherit; }
      `}</style>

      <div style={S.root}>
        <Sidebar user={user} xp={xp} onLogout={handleLogout} />
        <div style={S.main}>
          {isDashHome
            ? <DashboardHome
                user={user} xp={xp} streak={streak}
                badges={badges} subjects={subjects}
                deadlines={deadlines} loading={loading}
              />
            : <Outlet />
          }
        </div>
      </div>
    </>
  );
}

// ── Style object ───────────────────────────────────────────────────────────
const S = {
  root:      { display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" },
  main:      { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' },

  // Sidebar
  sidebar:   { width: 210, minWidth: 210, background: '#0d2b1e', display: 'flex', flexDirection: 'column', padding: '20px 0 0' },
  logo:      { display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 12 },
  logoIcon:  { width: 34, height: 34, borderRadius: 8, background: '#1a5c38', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  logoText:  { fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: 1, lineHeight: 1.1 },
  logoSub:   { fontSize: 10, color: '#b78c1e', letterSpacing: 1.5, fontWeight: 600 },
  navSection:{ marginBottom: 4, padding: '0 10px' },
  navLabel:  { fontSize: 9.5, fontWeight: 700, letterSpacing: 1.5, color: 'rgba(255,255,255,0.3)', padding: '8px 8px 4px' },
  navLink:   { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'all 0.15s' },
  navLinkActive: { background: '#1a5c38', color: '#fff' },
  navIcon:   { display: 'flex', alignItems: 'center', opacity: 0.85 },
  sidebarFooter: { marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer' },
  footerAvatar:  { width: 32, height: 32, borderRadius: '50%', background: '#1a5c38', border: '2px solid #b78c1e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 },
  footerName:    { fontSize: 12.5, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  footerSub:     { fontSize: 11, color: '#b78c1e' },

  // Content
  content:   { flex: 1, padding: '0 28px 28px', background: '#f4f9f4' },
  topBar:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0 20px' },
  breadcrumb:{ fontSize: 14, color: '#555', background: '#fff', border: '1px solid #e0e0e0', borderRadius: 20, padding: '5px 16px', fontWeight: 500 },
  topRight:  { display: 'flex', alignItems: 'center', gap: 8 },
  flamePill: { display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600, background: '#fde8d0', color: '#b05a00', border: '1.5px solid #f0b060' },
  xpPill:    { display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600, background: '#fffbe6', color: '#b78c1e', border: '1.5px solid #f0d060' },
  avatarBadge:{ width: 34, height: 34, borderRadius: '50%', background: '#1a5c38', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, position: 'relative' },
  onlineDot: { position: 'absolute', bottom: 1, right: 1, width: 8, height: 8, borderRadius: '50%', background: '#4caf50', border: '1.5px solid #fff' },

  // Stats
  statGrid:  { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 },
  statCard:  { borderRadius: 12, padding: '18px 20px', border: '1px solid rgba(0,0,0,0.04)' },
  statValue: { fontSize: 28, fontWeight: 700, color: '#1a5c38', lineHeight: 1.1 },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4, fontWeight: 500 },

  // Layout
  twoCol:    { display: 'flex', gap: 20, alignItems: 'flex-start' },
  rightCol:  { width: 310, minWidth: 310, flexShrink: 0 },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: '#222', marginBottom: 10 },
  empty:     { fontSize: 13, color: '#aaa', padding: '14px 0' },

  // Subject
  subjectCard: { background: '#fff', borderRadius: 12, marginBottom: 12, overflow: 'hidden', border: '1px solid #e8f0e8' },
  subjectBar:  { height: 4 },
  subjectBody: { padding: '14px 16px' },
  subjectMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  subjectCode: { fontSize: 11, fontWeight: 700, color: '#1a5c38', background: '#e8f5e9', padding: '2px 8px', borderRadius: 20, border: '1px solid #c8e6c9' },
  subjectEnrolled: { fontSize: 11, color: '#aaa' },
  subjectName: { fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 6 },
  subjectInstr:{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#666' },
  instrAvatar: { width: 22, height: 22, borderRadius: '50%', background: '#1a5c38', color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  progTrack:   { height: 4, background: '#e8f0e8', borderRadius: 4, marginTop: 10, overflow: 'hidden' },
  progFill:    { height: '100%', background: '#1a5c38', borderRadius: 4 },
  subjectPending: { fontSize: 11, color: '#b78c1e', marginTop: 6, fontWeight: 500 },

  // XP
  xpCard:    { background: '#fff', borderRadius: 12, padding: '16px 18px', border: '1px solid #e8f0e8' },
  xpCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  xpBadge:   { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#7c5f00', background: '#fffbe6', padding: '3px 10px', borderRadius: 20, border: '1px solid #f0d060' },
  xpToNext:  { fontSize: 11, color: '#aaa' },
  xpAmt:     { fontSize: 26, fontWeight: 700, color: '#111', margin: '4px 0 10px' },
  xpTrack:   { height: 8, background: '#e8f0e8', borderRadius: 8, overflow: 'hidden' },
  xpFill:    { height: '100%', background: '#1a5c38', borderRadius: 8, transition: 'width 0.6s ease' },
  xpRange:   { display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#aaa', marginTop: 5 },

  // Deadlines
  deadlineCard: { display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 12, padding: '12px 14px', marginBottom: 10, border: '1px solid #e8f0e8' },
  dlIcon:    { width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#1a5c38' },
  dlTitle:   { fontSize: 13, fontWeight: 600, color: '#111' },
  dlSub:     { fontSize: 11, color: '#aaa', marginTop: 2 },
  dlPill:    { fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, border: '1.5px solid', whiteSpace: 'nowrap', flexShrink: 0 },
  dlSoon:    { color: '#1a5c38', borderColor: '#a5d6a7', background: '#f0faf0' },
  dlOverdue: { color: '#c0392b', borderColor: '#f5a9a9', background: '#fdf0ef' },
};
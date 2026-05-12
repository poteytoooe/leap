// ============================================================
// SHARED UI COMPONENTS
// ============================================================

export function Spinner({ sm }) {
  return <span className="spinner" style={sm ? { width: 13, height: 13 } : {}} />;
}

export function LoadingState({ text = "Loading from database…" }) {
  return (
    <div className="loading-state">
      <Spinner />
      {text}
    </div>
  );
}

export function Sidebar({
  role,
  userInitials,
  userName,
  userRole,
  menuItems = [],
  menuSections,
  avatarClass,
  onLogout,
  activeTab,
  onTabChange,
}) {
  const renderItems = (start, end) =>
    menuItems.slice(start, end).map((item, i) => (
      <div
        key={i}
        className={`sb-item${activeTab === item.key ? " active" : ""}`}
        onClick={() => item.key && onTabChange && onTabChange(item.key)}
      >
        {item.name}
      </div>
    ));

  return (
    <div className="sidebar">
      <div className="sb-brand">
        <div className="sb-logo">L.E.A.P.</div>
        <div className="sb-role">{role} View</div>
      </div>

      <div className="sb-nav">
        {menuSections
          ? menuSections.map((sec, i) => (
              <div key={i}>
                <div className="sb-section-title">{sec.title}</div>
                {renderItems(sec.start, sec.end)}
              </div>
            ))
          : renderItems(0, menuItems.length)}
      </div>

      <div className="sb-user">
        <div className={`av av-lg ${avatarClass}`}>{userInitials}</div>
        <div>
          <div className="sb-user-name">{userName}</div>
          <div className="sb-user-role">{userRole}</div>
        </div>
      </div>

      <button className="sb-logout" onClick={onLogout}>⎋&nbsp; Sign out</button>
    </div>
  );
}

export function TopBar({ breadcrumb, right }) {
  return (
    <div className="topbar">
      <span className="topbar-crumb">{breadcrumb}</span>
      <span style={{ flex: 1 }} />
      {right}
    </div>
  );
}

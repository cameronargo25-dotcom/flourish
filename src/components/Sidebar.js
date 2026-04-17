const NAV = [
  {
    id: 'home', label: 'Home',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 6.5L7 2l5 4.5V12a1 1 0 01-1 1H3a1 1 0 01-1-1z" stroke="currentColor" strokeWidth="1.2" fill="none"/><path d="M5 13V8h4v5" stroke="currentColor" strokeWidth="1.2"/></svg>
  },
  {
    id: 'goals', label: 'Goals',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" fill="none"/><circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.2" fill="none"/><circle cx="7" cy="7" r="1" fill="currentColor"/></svg>
  },
  {
    id: 'pipeline', label: 'Pipeline',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor" opacity=".7"/><rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor" opacity=".7"/><rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor" opacity=".4"/><rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor" opacity=".4"/></svg>
  },
  {
    id: 'samples', label: 'Samples',
    icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="3" y="1" width="8" height="5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="8" width="4" height="5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="8" width="4" height="5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M7 6v2M5 8h4" stroke="currentColor" strokeWidth="1.2"/></svg>
  },
]

const COMING_SOON = [
  { id: 'calendar', label: 'Calendar' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'deals', label: 'Brand deals' },
]

export default function Sidebar({ view, onNav, accentColor }) {
  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoName}>Flourish</div>
        <div style={styles.logoSub}>creator platform</div>
      </div>

      <div style={styles.section}>My space</div>
      {NAV.map(n => (
        <button
          key={n.id}
          style={{
            ...styles.navItem,
            ...(view === n.id ? { ...styles.navActive, borderRightColor: accentColor } : {}),
          }}
          onClick={() => onNav(n.id)}
        >
          <span style={styles.icon}>{n.icon}</span>
          {n.label}
        </button>
      ))}

      <div style={styles.section}>Coming soon</div>
      {COMING_SOON.map(n => (
        <div key={n.id} style={styles.navDim}>{n.label}</div>
      ))}
    </div>
  )
}

const styles = {
  sidebar: {
    width: 168,
    background: '#fff',
    borderRight: '0.5px solid rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    height: '100vh',
    position: 'sticky',
    top: 0,
  },
  logo: {
    padding: '14px 14px 12px',
    borderBottom: '0.5px solid rgba(0,0,0,0.08)',
  },
  logoName: { fontSize: 15, fontWeight: '500' },
  logoSub: { fontSize: 10, color: '#aaa', marginTop: 1 },
  section: {
    fontSize: 10,
    color: '#aaa',
    padding: '12px 14px 4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  navItem: {
    padding: '7px 14px',
    fontSize: 13,
    color: '#666',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    
    background: 'none',
    border: 'none',
    borderRight: '2px solid transparent',
    width: '100%',
    textAlign: 'left',
    transition: 'background 0.1s',
  },
  navActive: {
    background: '#f5f5f5',
    color: '#1a1a1a',
    fontWeight: '500',
  },
  navDim: {
    padding: '7px 14px',
    fontSize: 13,
    color: '#ccc',
    cursor: 'default',
  },
  icon: { display: 'flex', alignItems: 'center', flexShrink: 0 },
}

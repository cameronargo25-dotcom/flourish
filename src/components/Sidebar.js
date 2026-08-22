import { FlourishWordmark } from './Logo'

const NAV = [
  {
    id: 'home', label: 'Home',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1z" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.5"/></svg>
  },
  {
    id: 'goals', label: 'Goals',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>
  },
  {
    id: 'pipeline', label: 'Pipeline',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="9" height="9" rx="2" fill="currentColor" opacity=".8"/><rect x="13" y="2" width="9" height="9" rx="2" fill="currentColor" opacity=".8"/><rect x="2" y="13" width="9" height="9" rx="2" fill="currentColor" opacity=".4"/><rect x="13" y="13" width="9" height="9" rx="2" fill="currentColor" opacity=".4"/></svg>
  },
  {
    id: 'calendar', label: 'Calendar',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M2 9h20" stroke="currentColor" strokeWidth="1.5"/><path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  },
  {
    id: 'samples', label: 'Samples',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="6" y="2" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="14" width="7" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="15" y="14" width="7" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M12 10v4M9 14h6" stroke="currentColor" strokeWidth="1.5"/></svg>
  },
]

const COMING_SOON = [
  { id: 'analytics', label: 'Analytics' },
  { id: 'deals', label: 'Brand deals' },
]

export default function Sidebar({ view, onNav, accentColor }) {
  return (
    <div style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logoArea}>
        <FlourishWordmark size={26} dark={false}/>
      </div>

      {/* Nav */}
      <div style={styles.navSection}>
        <div style={styles.sectionLabel}>My space</div>
        {NAV.map(n => {
          const active = view === n.id
          return (
            <button
              key={n.id}
              style={{
                ...styles.navItem,
                ...(active ? {
                  background: '#F2EFE9',
                  color: accentColor,
                  borderRightColor: accentColor,
                } : {}),
              }}
              onClick={() => onNav(n.id)}
            >
              <span style={{ ...styles.icon, color: active ? accentColor : '#A8A29E' }}>
                {n.icon}
              </span>
              <span style={{ fontWeight: active ? '500' : '400' }}>{n.label}</span>
            </button>
          )
        })}
      </div>

      <div style={styles.navSection}>
        <div style={styles.sectionLabel}>Coming soon</div>
        {COMING_SOON.map(n => (
          <div key={n.id} style={styles.navDim}>{n.label}</div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  sidebar: {
    width: 176,
    background: '#FFFFFF',
    borderRight: '0.5px solid rgba(28,25,23,0.07)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    height: '100vh',
    position: 'sticky',
    top: 0,
  },
  logoArea: {
    padding: '18px 16px 14px',
    borderBottom: '0.5px solid rgba(28,25,23,0.07)',
    marginBottom: 8,
  },
  navSection: {
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#C4BEB9',
    padding: '10px 16px 4px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  navItem: {
    padding: '8px 16px',
    fontSize: 13,
    color: '#57534E',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    background: 'none',
    border: 'none',
    borderRight: '2px solid transparent',
    width: '100%',
    textAlign: 'left',
    transition: 'background 0.1s, color 0.1s',
    borderRadius: '0 0 0 0',
    fontFamily: 'inherit',
  },
  navDim: {
    padding: '7px 16px',
    fontSize: 13,
    color: '#D6D0CA',
    cursor: 'default',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    transition: 'color 0.1s',
  },
}

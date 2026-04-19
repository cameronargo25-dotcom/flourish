const NAV = [
  {
    id: 'home', label: 'Home',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1v-10.5z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    id: 'goals', label: 'Goals',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: 'pipeline', label: 'Pipeline',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="9" height="9" rx="2" fill="currentColor" opacity={active ? 1 : 0.5}/>
        <rect x="13" y="2" width="9" height="9" rx="2" fill="currentColor" opacity={active ? 1 : 0.35}/>
        <rect x="2" y="13" width="9" height="9" rx="2" fill="currentColor" opacity={active ? 1 : 0.25}/>
        <rect x="13" y="13" width="9" height="9" rx="2" fill="currentColor" opacity={active ? 1 : 0.15}/>
      </svg>
    )
  },
  {
    id: 'samples', label: 'Samples',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="2" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="2" y="14" width="7" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="15" y="14" width="7" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 10v4M9 14h6" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    )
  },
]

export default function BottomNav({ view, onNav, accentColor }) {
  return (
    <div style={styles.nav}>
      {NAV.map(n => {
        const active = view === n.id
        return (
          <button
            key={n.id}
            style={styles.item}
            onClick={() => onNav(n.id)}
          >
            <div style={{ color: active ? accentColor : '#bbb', marginBottom: 3 }}>
              {n.icon(active)}
            </div>
            <span style={{
              fontSize: 10,
              color: active ? accentColor : '#bbb',
              fontWeight: active ? '500' : '400',
            }}>
              {n.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    background: '#fff',
    borderTop: '0.5px solid rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 100,
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  item: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px 0',
    height: '100%',
  },
}

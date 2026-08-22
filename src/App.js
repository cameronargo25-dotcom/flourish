import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { useData } from './hooks/useData'
import { getAccent } from './lib/tokens'
import Auth from './pages/Auth'
import Sidebar from './components/Sidebar'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Goals from './pages/Goals'
import Pipeline from './pages/Pipeline'
import Samples from './pages/Samples'
import Calendar from './pages/Calendar'

const PAGE_TITLES = {
  home: 'Home',
  goals: 'Goals',
  pipeline: 'Pipeline',
  calendar: 'Calendar',
  samples: 'Samples',
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export default function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [view, setView] = useState('home')
  const isMobile = useIsMobile()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const {
    profile, videos, samples, goals, topVideos, loading,
    saveProfile, uploadAvatar, uploadBanner,
    saveVideo, deleteVideo, moveVideo, unarchiveVideo,
    saveSample, deleteSample,
    saveGoal, deleteGoal,
    saveTopVideo, deleteTopVideo,
  } = useData(session?.user?.id)

  if (authLoading) return <div style={styles.center}><div style={styles.loadingDot}/></div>
  if (!session) return <Auth />
  if (loading) return <div style={styles.center}><div style={styles.loadingDot}/></div>

  const accent = getAccent(profile?.accent_color)

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  return (
    <div style={{ ...styles.app, flexDirection: isMobile ? 'column' : 'row' }}>
      {!isMobile && (
        <Sidebar view={view} onNav={setView} accentColor={accent.color} />
      )}

      <div style={styles.main}>
        <div style={styles.topbar}>
          <div style={styles.topbarTitle}>{PAGE_TITLES[view]}</div>
          <button style={styles.signOutBtn} onClick={handleSignOut}>Sign out</button>
        </div>

        <div style={{ ...styles.content, paddingBottom: isMobile ? 64 : 0 }}>
          {view === 'home' && (
            <Home
              profile={profile}
              goals={goals}
              videos={videos}
              samples={samples}
              topVideos={topVideos}
              onSaveProfile={saveProfile}
              onUploadAvatar={uploadAvatar}
              onUploadBanner={uploadBanner}
              onSaveTopVideo={saveTopVideo}
              onDeleteTopVideo={deleteTopVideo}
              isMobile={isMobile}
              accentColor={accent.color}
            />
          )}
          {view === 'goals' && (
            <Goals goals={goals} onSave={saveGoal} onDelete={deleteGoal} isMobile={isMobile} accentColor={accent.color} />
          )}
          {view === 'pipeline' && (
            <Pipeline
              videos={videos}
              onSave={saveVideo}
              onDelete={deleteVideo}
              onMove={moveVideo}
              onUnarchive={unarchiveVideo}
              isMobile={isMobile}
              accentColor={accent.color}
            />
          )}
          {view === 'calendar' && (
            <Calendar videos={videos} onEditVideo={() => setView('pipeline')} isMobile={isMobile} accentColor={accent.color} />
          )}
          {view === 'samples' && (
            <Samples samples={samples} onSave={saveSample} onDelete={deleteSample} isMobile={isMobile} accentColor={accent.color} />
          )}
        </div>
      </div>

      {isMobile && (
        <BottomNav view={view} onNav={setView} accentColor={accent.color} />
      )}
    </div>
  )
}

const styles = {
  app: {
    display: 'flex',
    minHeight: '100vh',
    background: '#F7F5F2',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
    fontSize: 14,
    color: '#1C1917',
  },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' },
  topbar: {
    background: '#FFFFFF',
    borderBottom: '0.5px solid rgba(28,25,23,0.07)',
    padding: '0 20px',
    height: 52,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    boxShadow: '0 1px 0 rgba(28,25,23,0.04)',
  },
  topbarTitle: { fontSize: 15, fontWeight: '500', color: '#1C1917', letterSpacing: '-0.01em' },
  signOutBtn: {
    fontSize: 12,
    padding: '5px 14px',
    borderRadius: 20,
    border: '0.5px solid rgba(28,25,23,0.15)',
    background: 'none',
    color: '#A8A29E',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 0.1s',
  },
  content: { flex: 1, overflowY: 'auto' },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#F7F5F2',
  },
  loadingDot: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#EEEDFE',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
}

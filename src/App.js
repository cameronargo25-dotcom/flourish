import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { useData } from './hooks/useData'
import { getAccent } from './lib/utils'
import Auth from './pages/Auth'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Goals from './pages/Goals'
import Pipeline from './pages/Pipeline'
import Samples from './pages/Samples'

const PAGE_TITLES = {
  home: 'Home',
  goals: 'Goals',
  pipeline: 'Pipeline',
  samples: 'Samples',
}

export default function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [view, setView] = useState('home')

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
    saveProfile,
    saveVideo, deleteVideo, moveVideo,
    saveSample, deleteSample,
    saveGoal, deleteGoal,
    saveTopVideo, deleteTopVideo,
  } = useData(session?.user?.id)

  if (authLoading) return <div style={styles.center}>Loading...</div>
  if (!session) return <Auth />
  if (loading) return <div style={styles.center}>Loading your workspace...</div>

  const accent = getAccent(profile?.accent_color)

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  return (
    <div style={styles.app}>
      <Sidebar view={view} onNav={setView} accentColor={accent.color} />

      <div style={styles.main}>
        <div style={styles.topbar}>
          <div style={styles.topbarTitle}>{PAGE_TITLES[view]}</div>
          <button style={{ ...styles.signOutBtn }} onClick={handleSignOut}>Sign out</button>
        </div>

        <div style={styles.content}>
          {view === 'home' && (
            <Home
              profile={profile}
              goals={goals}
              videos={videos}
              samples={samples}
              topVideos={topVideos}
              onSaveProfile={saveProfile}
              onSaveTopVideo={saveTopVideo}
              onDeleteTopVideo={deleteTopVideo}
            />
          )}
          {view === 'goals' && (
            <Goals
              goals={goals}
              onSave={saveGoal}
              onDelete={deleteGoal}
            />
          )}
          {view === 'pipeline' && (
            <Pipeline
              videos={videos}
              onSave={saveVideo}
              onDelete={deleteVideo}
              onMove={moveVideo}
            />
          )}
          {view === 'samples' && (
            <Samples
              samples={samples}
              onSave={saveSample}
              onDelete={deleteSample}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  app: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f8f7f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: 14,
    color: '#1a1a1a',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    overflow: 'hidden',
  },
  topbar: {
    background: '#fff',
    borderBottom: '0.5px solid rgba(0,0,0,0.1)',
    padding: '0 16px',
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  topbarTitle: { fontSize: 15, fontWeight: '500' },
  signOutBtn: {
    fontSize: 12,
    padding: '5px 12px',
    borderRadius: 8,
    border: '0.5px solid rgba(0,0,0,0.2)',
    background: 'none',
    color: '#666',
    cursor: 'pointer',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontSize: 14,
    color: '#888',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
}

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { FlourishLockup } from '../components/Logo'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('Check your email for a confirmation link!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }
    setLoading(false)
  }

  return (
    <div style={styles.page}>
      {/* Warm background bloom decoration */}
      <div style={styles.bgBloom}/>

      <div style={styles.card}>
        {/* Logo lockup */}
        <div style={styles.logoWrap}>
          <FlourishLockup logoSize={64} dark={false}/>
        </div>

        {/* Mode tabs */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(mode === 'login' ? styles.tabActive : {}) }}
            onClick={() => { setMode('login'); setError(''); setMessage('') }}
          >
            Sign in
          </button>
          <button
            style={{ ...styles.tab, ...(mode === 'signup' ? styles.tabActive : {}) }}
            onClick={() => { setMode('signup'); setError(''); setMessage('') }}
          >
            Create account
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}
          {message && <div style={styles.success}>{message}</div>}

          <button style={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div style={styles.footer}>
          Built for creators who mean business.
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F7F5F2',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  bgBloom: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(127,119,221,0.08) 0%, transparent 70%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  card: {
    background: '#FFFFFF',
    borderRadius: 20,
    border: '0.5px solid rgba(28,25,23,0.08)',
    boxShadow: '0 8px 32px rgba(28,25,23,0.08)',
    padding: '40px 36px',
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  logoWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 28,
  },
  tabs: {
    display: 'flex',
    borderBottom: '0.5px solid rgba(28,25,23,0.1)',
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    padding: '8px',
    border: 'none',
    background: 'none',
    fontSize: 14,
    color: '#A8A29E',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    marginBottom: '-0.5px',
    fontFamily: 'inherit',
    transition: 'color 0.15s',
  },
  tabActive: {
    color: '#7F77DD',
    borderBottomColor: '#7F77DD',
    fontWeight: '500',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A8A29E',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
  input: {
    padding: '10px 14px',
    borderRadius: 10,
    border: '0.5px solid rgba(28,25,23,0.15)',
    fontSize: 14,
    fontFamily: 'inherit',
    color: '#1C1917',
    background: '#FAFAF9',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  },
  error: {
    background: '#FAECE7',
    color: '#993C1D',
    padding: '10px 14px',
    borderRadius: 10,
    fontSize: 13,
  },
  success: {
    background: '#E1F5EE',
    color: '#0F6E56',
    padding: '10px 14px',
    borderRadius: 10,
    fontSize: 13,
  },
  submitBtn: {
    padding: '11px',
    background: '#7F77DD',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: 4,
    fontFamily: 'inherit',
    letterSpacing: '0.01em',
    boxShadow: '0 2px 8px rgba(127,119,221,0.3)',
  },
  footer: {
    marginTop: 24,
    fontSize: 12,
    color: '#C4BEB9',
    textAlign: 'center',
    letterSpacing: '0.02em',
  },
}

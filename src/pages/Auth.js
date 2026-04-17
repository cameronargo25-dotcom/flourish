import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
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
      <div style={styles.card}>
        <div style={styles.logo}>Flourish</div>
        <div style={styles.logoSub}>creator platform</div>

        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(mode === 'login' ? styles.tabActive : {}) }}
            onClick={() => setMode('login')}
          >Sign in</button>
          <button
            style={{ ...styles.tab, ...(mode === 'signup' ? styles.tabActive : {}) }}
            onClick={() => setMode('signup')}
          >Create account</button>
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
    background: '#f8f7f5',
    padding: '20px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    border: '0.5px solid rgba(0,0,0,0.12)',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
  },
  logo: {
    fontSize: '22px',
    fontWeight: '500',
    marginBottom: '2px',
  },
  logoSub: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '28px',
  },
  tabs: {
    display: 'flex',
    borderBottom: '0.5px solid rgba(0,0,0,0.1)',
    marginBottom: '24px',
  },
  tab: {
    flex: 1,
    padding: '8px',
    border: 'none',
    background: 'none',
    fontSize: '14px',
    color: '#888',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    marginBottom: '-0.5px',
  },
  tabActive: {
    color: '#7F77DD',
    borderBottomColor: '#7F77DD',
    fontWeight: '500',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '12px', fontWeight: '500', color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' },
  input: {
    padding: '9px 12px',
    borderRadius: '8px',
    border: '0.5px solid rgba(0,0,0,0.2)',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  error: {
    background: '#FEF2F2',
    color: '#B91C1C',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
  },
  success: {
    background: '#F0FDF4',
    color: '#166534',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '13px',
  },
  submitBtn: {
    padding: '10px',
    background: '#7F77DD',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '4px',
  },
}

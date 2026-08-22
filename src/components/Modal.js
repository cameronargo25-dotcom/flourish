import { useEffect } from 'react'

const isMobileDevice = () => window.innerWidth < 768

export default function Modal({ title, onClose, onSave, saveLabel = 'Save', children, accentColor = '#7F77DD' }) {
  const mobile = isMobileDevice()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={mobile ? styles.modalMobile : styles.modal}>
        {mobile && <div style={styles.handle}/>}
        <div style={styles.header}>
          <span style={styles.title}>{title}</span>
          <button style={styles.close} onClick={onClose}>×</button>
        </div>
        <div style={styles.body}>{children}</div>
        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{ ...styles.saveBtn, background: accentColor }} onClick={onSave}>
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={fieldStyles.label}>{label}</label>
      {children}
    </div>
  )
}

export function Row({ children, cols = 2 }) {
  const mobile = isMobileDevice()
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : `repeat(${cols}, minmax(0, 1fr))`,
      gap: 10,
      marginBottom: 12,
    }}>
      {children}
    </div>
  )
}

export const inputStyle = {
  padding: '9px 12px',
  borderRadius: 8,
  border: '0.5px solid rgba(28,25,23,0.15)',
  fontSize: 14,
  width: '100%',
  boxSizing: 'border-box',
  background: '#FAFAF9',
  color: '#1C1917',
  fontFamily: 'inherit',
  outline: 'none',
}

const fieldStyles = {
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A8A29E',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(28,25,23,0.4)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(2px)',
  },
  modal: {
    background: '#FFFFFF',
    borderRadius: 20,
    border: '0.5px solid rgba(28,25,23,0.08)',
    boxShadow: '0 20px 60px rgba(28,25,23,0.15)',
    width: '100%',
    maxWidth: 520,
    maxHeight: '90vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    margin: 16,
  },
  modalMobile: {
    background: '#FFFFFF',
    borderRadius: '20px 20px 0 0',
    width: '100%',
    maxHeight: '92vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    background: '#E5E0D9',
    margin: '12px auto 0',
  },
  header: {
    padding: '16px 20px 12px',
    borderBottom: '0.5px solid rgba(28,25,23,0.07)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    background: '#FFFFFF',
    zIndex: 1,
  },
  title: { fontSize: 16, fontWeight: '500', color: '#1C1917' },
  close: {
    background: '#F2EFE9',
    border: 'none',
    fontSize: 18,
    cursor: 'pointer',
    color: '#A8A29E',
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  },
  body: { padding: '16px 20px', flex: 1 },
  footer: {
    padding: '12px 20px',
    borderTop: '0.5px solid rgba(28,25,23,0.07)',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
    position: 'sticky',
    bottom: 0,
    background: '#FFFFFF',
  },
  cancelBtn: {
    padding: '9px 18px',
    borderRadius: 10,
    border: '0.5px solid rgba(28,25,23,0.15)',
    background: 'none',
    fontSize: 14,
    cursor: 'pointer',
    color: '#57534E',
    fontFamily: 'inherit',
  },
  saveBtn: {
    padding: '9px 18px',
    borderRadius: 10,
    border: 'none',
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'inherit',
    flex: 1,
    boxShadow: '0 2px 8px rgba(127,119,221,0.25)',
  },
}

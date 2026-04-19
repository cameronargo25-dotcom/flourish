import { useEffect } from 'react'

const isMobileDevice = () => window.innerWidth < 768

export default function Modal({ title, onClose, onSave, saveLabel = 'Save', children }) {
  const mobile = isMobileDevice()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={mobile ? styles.modalMobile : styles.modal}>
        <div style={styles.header}>
          <span style={styles.title}>{title}</span>
          <button style={styles.close} onClick={onClose}>×</button>
        </div>
        <div style={styles.body}>{children}</div>
        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={styles.saveBtn} onClick={onSave}>{saveLabel}</button>
        </div>
      </div>
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
      marginBottom: 10,
    }}>
      {children}
    </div>
  )
}

export const inputStyle = {
  padding: '9px 12px',
  borderRadius: 8,
  border: '0.5px solid rgba(0,0,0,0.2)',
  fontSize: 14,
  width: '100%',
  boxSizing: 'border-box',
  background: '#fff',
  color: '#1a1a1a',
}

const fieldStyles = {
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.38)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    borderRadius: 16,
    border: '0.5px solid rgba(0,0,0,0.12)',
    width: '100%',
    maxWidth: 500,
    maxHeight: '90vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    margin: 16,
  },
  modalMobile: {
    background: '#fff',
    borderRadius: '20px 20px 0 0',
    width: '100%',
    maxHeight: '92vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '16px 18px 12px',
    borderBottom: '0.5px solid rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    background: '#fff',
    zIndex: 1,
  },
  title: { fontSize: 16, fontWeight: '500' },
  close: {
    background: 'none',
    border: 'none',
    fontSize: 22,
    cursor: 'pointer',
    color: '#888',
    lineHeight: 1,
    padding: '2px 6px',
    borderRadius: 4,
  },
  body: { padding: '14px 18px', flex: 1 },
  footer: {
    padding: '12px 18px',
    borderTop: '0.5px solid rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
    position: 'sticky',
    bottom: 0,
    background: '#fff',
  },
  cancelBtn: {
    padding: '10px 18px',
    borderRadius: 10,
    border: '0.5px solid rgba(0,0,0,0.2)',
    background: 'none',
    fontSize: 14,
    cursor: 'pointer',
    color: '#444',
  },
  saveBtn: {
    padding: '10px 18px',
    borderRadius: 10,
    border: 'none',
    background: '#7F77DD',
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    cursor: 'pointer',
    flex: 1,
  },
}

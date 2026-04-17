export default function Modal({ title, onClose, onSave, saveLabel = 'Save', children }) {
  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
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
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap: 10,
      marginBottom: 10,
    }}>
      {children}
    </div>
  )
}

export const inputStyle = {
  padding: '7px 10px',
  borderRadius: 8,
  border: '0.5px solid rgba(0,0,0,0.2)',
  fontSize: 13,
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
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 16,
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
  },
  header: {
    padding: '14px 18px 11px',
    borderBottom: '0.5px solid rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 15, fontWeight: '500' },
  close: {
    background: 'none',
    border: 'none',
    fontSize: 20,
    cursor: 'pointer',
    color: '#888',
    lineHeight: 1,
    padding: '2px 6px',
    borderRadius: 4,
  },
  body: { padding: '14px 18px', flex: 1 },
  footer: {
    padding: '11px 18px',
    borderTop: '0.5px solid rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelBtn: {
    padding: '6px 14px',
    borderRadius: 8,
    border: '0.5px solid rgba(0,0,0,0.2)',
    background: 'none',
    fontSize: 13,
    cursor: 'pointer',
    color: '#444',
  },
  saveBtn: {
    padding: '6px 14px',
    borderRadius: 8,
    border: 'none',
    background: '#7F77DD',
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    cursor: 'pointer',
  },
}

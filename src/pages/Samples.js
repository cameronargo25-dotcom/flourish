import { useState } from 'react'
import Modal, { Field, Row, inputStyle } from '../components/Modal'
import { STATUS_STYLES } from '../lib/utils'

export default function Samples({ samples, onSave, onDelete }) {
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})

  function openNew() {
    setForm({ name: '', brand: '', arrival_date: '', status: 'transit', linked_video: '' })
    setEditing({})
  }
  function openEdit(s) { setForm({ ...s }); setEditing(s) }
  function closeModal() { setEditing(null) }

  async function handleSave() {
    await onSave({ ...form, ...(editing?.id ? { id: editing.id } : {}) })
    closeModal()
  }

  const grouped = {
    overdue: samples.filter(s => s.status === 'overdue'),
    transit: samples.filter(s => s.status === 'transit'),
    received: samples.filter(s => s.status === 'received'),
  }

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <div style={styles.counts}>
          {grouped.overdue.length > 0 && <span style={styles.alertBadge}>{grouped.overdue.length} overdue</span>}
          <span style={styles.countBadge}>{grouped.transit.length} in transit</span>
          <span style={styles.countBadge}>{grouped.received.length} received</span>
        </div>
        <button style={styles.addBtn} onClick={openNew}>+ New sample</button>
      </div>

      {samples.length === 0 && (
        <div style={styles.empty}>No samples tracked yet. Add one when a brand sends you a product.</div>
      )}

      {['overdue', 'transit', 'received'].map(status => {
        const group = grouped[status]
        if (group.length === 0) return null
        const ss = STATUS_STYLES[status]
        return (
          <div key={status}>
            <div style={styles.groupLabel}>{ss.label}</div>
            {group.map(s => (
              <div key={s.id} style={styles.row} onClick={() => openEdit(s)}>
                <div style={styles.rowInfo}>
                  <div style={styles.rowName}>{s.name}</div>
                  <div style={styles.rowMeta}>
                    {s.brand}
                    {s.arrival_date && ' · Exp. ' + new Date(s.arrival_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {s.linked_video && ' · ' + s.linked_video}
                  </div>
                </div>
                <span style={{ ...styles.pill, background: ss.bg, color: ss.color }}>{ss.label}</span>
              </div>
            ))}
          </div>
        )
      })}

      {editing !== null && (
        <Modal
          title={editing.id ? 'Edit sample' : 'New sample'}
          onClose={closeModal}
          onSave={handleSave}
        >
          <Row>
            <Field label="Product / sample name"><input style={inputStyle} value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Glow serum – BrandX" /></Field>
            <Field label="Brand"><input style={inputStyle} value={form.brand || ''} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="Brand name" /></Field>
          </Row>
          <Row>
            <Field label="Expected arrival"><input style={inputStyle} type="date" value={form.arrival_date || ''} onChange={e => setForm(f => ({ ...f, arrival_date: e.target.value }))} /></Field>
            <Field label="Status">
              <select style={inputStyle} value={form.status || 'transit'} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="transit">In transit</option>
                <option value="received">Received</option>
                <option value="overdue">Overdue</option>
              </select>
            </Field>
          </Row>
          <Row cols={1}>
            <Field label="Linked video"><input style={inputStyle} value={form.linked_video || ''} onChange={e => setForm(f => ({ ...f, linked_video: e.target.value }))} placeholder="Video this sample is for" /></Field>
          </Row>
          {editing.id && (
            <button style={styles.deleteBtn} onClick={async () => { await onDelete(editing.id); closeModal() }}>
              Remove sample
            </button>
          )}
        </Modal>
      )}
    </div>
  )
}

const styles = {
  page: { padding: 14, maxWidth: 800 },
  topRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  counts: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
  alertBadge: { fontSize: 11, padding: '3px 10px', borderRadius: 10, background: '#FAECE7', color: '#993C1D', fontWeight: '500' },
  countBadge: { fontSize: 11, padding: '3px 10px', borderRadius: 10, background: '#f0f0f0', color: '#666' },
  addBtn: { fontSize: 13, padding: '6px 14px', borderRadius: 8, border: 'none', background: '#7F77DD', color: '#fff', cursor: 'pointer', fontWeight: '500' },
  empty: { fontSize: 13, color: '#aaa', padding: '40px 0', textAlign: 'center' },
  groupLabel: { fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '500', margin: '16px 0 8px' },
  row: { background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' },
  rowInfo: { flex: 1, minWidth: 0 },
  rowName: { fontSize: 13, fontWeight: '500' },
  rowMeta: { fontSize: 12, color: '#aaa', marginTop: 2 },
  pill: { fontSize: 10, padding: '3px 9px', borderRadius: 10, fontWeight: '500', flexShrink: 0 },
  deleteBtn: { marginTop: 8, fontSize: 12, color: '#B91C1C', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' },
}

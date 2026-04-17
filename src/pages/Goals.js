import { useState } from 'react'
import Modal, { Field, Row, inputStyle } from '../components/Modal'
import { GOAL_CATEGORIES, GOAL_CAT_STYLES, pct, fmtValue, goalProgressColor } from '../lib/utils'

const UNITS = ['followers', '$', 'videos', '%', 'custom']
const FILTERS = ['all', ...GOAL_CATEGORIES]

function catLabel(c) { return c.charAt(0).toUpperCase() + c.slice(1) }

export default function Goals({ goals, onSave, onDelete }) {
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})

  function openNew() {
    setForm({ title: '', category: 'growth', unit: 'followers', current_value: '', target_value: '', target_date: '', notes: '' })
    setEditing({})
  }
  function openEdit(g) { setForm({ ...g }); setEditing(g) }
  function closeModal() { setEditing(null) }

  async function handleSave() {
    await onSave({ ...form, current_value: Number(form.current_value) || 0, target_value: Number(form.target_value) || 100, ...(editing?.id ? { id: editing.id } : {}) })
    closeModal()
  }

  const filtered = filter === 'all' ? goals : goals.filter(g => g.category === filter)

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <div style={styles.filterRow}>
          {FILTERS.map(f => (
            <button key={f} style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : catLabel(f)}
            </button>
          ))}
        </div>
        <button style={styles.addBtn} onClick={openNew}>+ New goal</button>
      </div>

      {filtered.length === 0 && (
        <div style={styles.empty}>No goals here yet. Add one to start tracking your progress.</div>
      )}

      {filtered.map(g => {
        const p = pct(g.current_value, g.target_value)
        const col = goalProgressColor(p)
        const done = p >= 100
        const catStyle = GOAL_CAT_STYLES[g.category] || GOAL_CAT_STYLES.custom
        const remain = Math.max(0, (g.target_value || 0) - (g.current_value || 0))

        return (
          <div key={g.id} style={styles.card}>
            <div style={styles.cardTop}>
              <div>
                <div style={styles.cardTitle}>{g.title}</div>
                <span style={{ ...styles.catBadge, background: catStyle.bg, color: catStyle.color }}>
                  {catLabel(g.category)}
                </span>
              </div>
              <div style={styles.cardActions}>
                <button style={styles.editBtn} onClick={() => openEdit(g)}>Edit</button>
                <button style={styles.deleteBtn} onClick={() => onDelete(g.id)}>×</button>
              </div>
            </div>

            <div style={styles.nums}>
              <span style={{ ...styles.current, color: col }}>{fmtValue(g.current_value, g.unit)}</span>
              <span style={styles.target}>/ {fmtValue(g.target_value, g.unit)} {g.unit !== '$' ? g.unit : ''}</span>
            </div>

            {g.target_date && (
              <div style={styles.dateLabel}>
                Target: {new Date(g.target_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            )}

            <div style={styles.track}>
              <div style={{ ...styles.fill, width: p + '%', background: col }} />
            </div>
            <div style={styles.progressRow}>
              <span style={{ fontSize: 12, fontWeight: '500', color: col }}>{p}%</span>
              {!done && <span style={styles.remain}>{fmtValue(remain, g.unit)} {g.unit} to go</span>}
              {done && <span style={styles.achieved}>Goal achieved!</span>}
            </div>

            {g.notes && <div style={styles.notes}>{g.notes}</div>}
          </div>
        )
      })}

      {editing !== null && (
        <Modal
          title={editing.id ? 'Edit goal' : 'New goal'}
          onClose={closeModal}
          onSave={handleSave}
          saveLabel="Save goal"
        >
          <Row cols={1}><Field label="Goal title"><input style={inputStyle} value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Reach 200K followers" /></Field></Row>
          <Row>
            <Field label="Category">
              <select style={inputStyle} value={form.category || 'growth'} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {GOAL_CATEGORIES.map(c => <option key={c} value={c}>{catLabel(c)}</option>)}
              </select>
            </Field>
            <Field label="Unit">
              <select style={inputStyle} value={form.unit || 'followers'} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </Field>
          </Row>
          <Row>
            <Field label="Current value"><input style={inputStyle} type="number" value={form.current_value ?? ''} onChange={e => setForm(f => ({ ...f, current_value: e.target.value }))} placeholder="0" /></Field>
            <Field label="Target value"><input style={inputStyle} type="number" value={form.target_value ?? ''} onChange={e => setForm(f => ({ ...f, target_value: e.target.value }))} placeholder="200000" /></Field>
          </Row>
          <Row>
            <Field label="Target date"><input style={inputStyle} type="date" value={form.target_date || ''} onChange={e => setForm(f => ({ ...f, target_date: e.target.value }))} /></Field>
            <Field label="Notes"><input style={inputStyle} value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Why this goal matters..." /></Field>
          </Row>
        </Modal>
      )}
    </div>
  )
}

const styles = {
  page: { padding: 14, maxWidth: 800 },
  topRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 },
  filterRow: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  filterBtn: { fontSize: 11, padding: '4px 11px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.2)', background: 'none', color: '#666', cursor: 'pointer' },
  filterActive: { background: '#7F77DD', borderColor: '#7F77DD', color: '#fff' },
  addBtn: { fontSize: 13, padding: '6px 14px', borderRadius: 8, border: 'none', background: '#7F77DD', color: '#fff', cursor: 'pointer', fontWeight: '500' },
  empty: { fontSize: 13, color: '#aaa', padding: '40px 0', textAlign: 'center' },
  card: { background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 14, padding: '14px 16px', marginBottom: 10 },
  cardTop: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: '500', lineHeight: 1.3, marginBottom: 4 },
  catBadge: { fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: '500' },
  cardActions: { display: 'flex', gap: 6, flexShrink: 0, marginLeft: 10 },
  editBtn: { fontSize: 11, padding: '3px 9px', borderRadius: 6, border: '0.5px solid rgba(0,0,0,0.2)', background: 'none', cursor: 'pointer', color: '#444' },
  deleteBtn: { fontSize: 14, padding: '1px 7px', borderRadius: 6, border: '0.5px solid rgba(0,0,0,0.15)', background: 'none', cursor: 'pointer', color: '#999', lineHeight: 1 },
  nums: { display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 },
  current: { fontSize: 22, fontWeight: '500' },
  target: { fontSize: 13, color: '#aaa' },
  dateLabel: { fontSize: 11, color: '#aaa', marginBottom: 8 },
  track: { height: 6, background: '#eee', borderRadius: 3, overflow: 'hidden', marginBottom: 5 },
  fill: { height: '100%', borderRadius: 3, transition: 'width 0.4s ease' },
  progressRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 4 },
  remain: { fontSize: 11, color: '#aaa' },
  achieved: { fontSize: 12, color: '#1D9E75', fontWeight: '500' },
  notes: { fontSize: 12, color: '#aaa', marginTop: 8, paddingTop: 8, borderTop: '0.5px solid rgba(0,0,0,0.07)' },
}

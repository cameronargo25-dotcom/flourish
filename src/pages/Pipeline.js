import { useState, useRef } from 'react'
import Modal, { Field, Row, inputStyle } from '../components/Modal'
import { STAGES, TYPE_STYLES, deadlineLabel, deadlineColor } from '../lib/utils'

export default function Pipeline({ videos, onSave, onDelete, onMove }) {
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [dragOver, setDragOver] = useState(null)
  const dragId = useRef(null)

  function openNew(stage = 0) {
    setForm({ title: '', type: 'shop', stage, deadline: '', affiliate_link: '', commission: '', caption: '', hashtags: '', notes: '' })
    setEditing({})
  }
  function openEdit(v) { setForm({ ...v }); setEditing(v) }
  function closeModal() { setEditing(null) }

  async function handleSave() {
    await onSave({ ...form, ...(editing?.id ? { id: editing.id } : {}) })
    closeModal()
  }

  function onDragStart(e, id) {
    dragId.current = id
    e.dataTransfer.effectAllowed = 'move'
  }
  function onDragOver(e, stage) {
    e.preventDefault()
    setDragOver(stage)
  }
  function onDrop(e, stage) {
    e.preventDefault()
    if (dragId.current) onMove(dragId.current, stage)
    dragId.current = null
    setDragOver(null)
  }

  return (
    <div style={styles.page}>
      <div style={styles.board}>
        {STAGES.map((stageName, si) => {
          const stageVids = videos.filter(v => v.stage === si)
          return (
            <div
              key={si}
              style={{ ...styles.col, ...(dragOver === si ? styles.colOver : {}) }}
              onDragOver={e => onDragOver(e, si)}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => onDrop(e, si)}
            >
              <div style={styles.colHeader}>
                <span style={styles.colTitle}>{stageName}</span>
                <span style={styles.colCount}>{stageVids.length}</span>
              </div>

              {stageVids.map(v => {
                const typeStyle = TYPE_STYLES[v.type] || TYPE_STYLES.organic
                const dlLabel = deadlineLabel(v.deadline)
                const dlColor = deadlineColor(v.deadline)
                return (
                  <div
                    key={v.id}
                    style={styles.card}
                    draggable
                    onDragStart={e => onDragStart(e, v.id)}
                    onClick={() => openEdit(v)}
                  >
                    <div style={styles.cardTitle}>{v.title}</div>
                    <div style={styles.cardMeta}>
                      <span style={{ ...styles.tag, background: typeStyle.bg, color: typeStyle.color }}>
                        {typeStyle.label}
                      </span>
                      {dlLabel && <span style={{ fontSize: 11, color: dlColor, fontWeight: dlColor === '#993C1D' ? '500' : '400' }}>{dlLabel}</span>}
                    </div>
                  </div>
                )
              })}

              <div style={styles.addCard} onClick={() => openNew(si)}>+ Add</div>
            </div>
          )
        })}
      </div>

      {editing !== null && (
        <Modal
          title={editing.id ? 'Edit video' : 'New video'}
          onClose={closeModal}
          onSave={handleSave}
        >
          <Row>
            <Field label="Title"><input style={inputStyle} value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Video title" /></Field>
            <Field label="Type">
              <select style={inputStyle} value={form.type || 'shop'} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="shop">TikTok Shop</option>
                <option value="organic">Organic</option>
                <option value="collab">Collab</option>
              </select>
            </Field>
          </Row>
          <Row>
            <Field label="Stage">
              <select style={inputStyle} value={form.stage ?? 0} onChange={e => setForm(f => ({ ...f, stage: Number(e.target.value) }))}>
                {STAGES.map((s, i) => <option key={i} value={i}>{s}</option>)}
              </select>
            </Field>
            <Field label="Deadline"><input style={inputStyle} type="date" value={form.deadline || ''} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} /></Field>
          </Row>
          <Row>
            <Field label="Affiliate link"><input style={inputStyle} value={form.affiliate_link || ''} onChange={e => setForm(f => ({ ...f, affiliate_link: e.target.value }))} placeholder="https://..." /></Field>
            <Field label="Commission"><input style={inputStyle} value={form.commission || ''} onChange={e => setForm(f => ({ ...f, commission: e.target.value }))} placeholder="e.g. 8%" /></Field>
          </Row>
          <Row cols={1}>
            <Field label="Caption draft">
              <textarea style={{ ...inputStyle, minHeight: 72, lineHeight: 1.5, resize: 'vertical' }} value={form.caption || ''} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="Paste your caption here..." />
            </Field>
          </Row>
          <Row cols={1}><Field label="Hashtags"><input style={inputStyle} value={form.hashtags || ''} onChange={e => setForm(f => ({ ...f, hashtags: e.target.value }))} placeholder="#tiktokmademebuyit ..." /></Field></Row>
          <Row cols={1}>
            <Field label="Notes">
              <textarea style={{ ...inputStyle, minHeight: 52, lineHeight: 1.5, resize: 'vertical' }} value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Brand requirements, filming notes..." />
            </Field>
          </Row>
          {editing.id && (
            <button style={styles.deleteBtn} onClick={async () => { await onDelete(editing.id); closeModal() }}>
              Delete video
            </button>
          )}
        </Modal>
      )}
    </div>
  )
}

const styles = {
  page: { padding: 14, overflowX: 'auto' },
  board: { display: 'flex', gap: 10, minWidth: 'max-content', paddingBottom: 8 },
  col: { width: 178, background: '#f8f7f5', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.08)', padding: 10, display: 'flex', flexDirection: 'column', gap: 7, minHeight: 200, transition: 'background 0.15s' },
  colOver: { background: '#EEEDFE' },
  colHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 7, borderBottom: '0.5px solid rgba(0,0,0,0.08)' },
  colTitle: { fontSize: 12, fontWeight: '500', color: '#666' },
  colCount: { fontSize: 11, background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: '1px 7px', color: '#aaa' },
  card: { background: '#fff', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', padding: '10px 11px', cursor: 'grab', userSelect: 'none' },
  cardTitle: { fontSize: 13, fontWeight: '500', lineHeight: 1.3, marginBottom: 6 },
  cardMeta: { display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap' },
  tag: { fontSize: 10, padding: '2px 7px', borderRadius: 10, fontWeight: '500' },
  addCard: { border: '0.5px dashed rgba(0,0,0,0.2)', borderRadius: 8, padding: '7px', textAlign: 'center', cursor: 'pointer', color: '#aaa', fontSize: 12 },
  deleteBtn: { marginTop: 8, fontSize: 12, color: '#B91C1C', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' },
}

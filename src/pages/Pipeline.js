import { useState, useRef } from 'react'
import Modal, { Field, Row, inputStyle } from '../components/Modal'
import { STAGES, TYPE_STYLES, deadlineLabel, deadlineColor } from '../lib/utils'

const PLATFORMS = [
  { id: 'tiktok',    label: 'TikTok' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook',  label: 'Facebook' },
  { id: 'linkedin',  label: 'LinkedIn' },
  { id: 'x',         label: 'X' },
  { id: 'benable',   label: 'Benable' },
  { id: 'ltk',       label: 'LTK' },
  { id: 'other',     label: 'Other' },
]

const PLATFORM_COLORS = {
  tiktok:    { bg: '#F0F0F0', color: '#1a1a1a' },
  instagram: { bg: '#FBEAF0', color: '#993556' },
  facebook:  { bg: '#E6F1FB', color: '#185FA5' },
  linkedin:  { bg: '#E6F1FB', color: '#0C447C' },
  x:         { bg: '#F1EFE8', color: '#444441' },
  benable:   { bg: '#E1F5EE', color: '#0F6E56' },
  ltk:       { bg: '#FAECE7', color: '#993C1D' },
  other:     { bg: '#FAEEDA', color: '#854F0B' },
}

function platformLabel(id, customLabel) {
  if (id === 'other' && customLabel) return customLabel
  return PLATFORMS.find(p => p.id === id)?.label || id
}

function PlatformSelector({ selected = [], otherText = '', onChange, onOtherChange }) {
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {PLATFORMS.map(p => {
          const isSelected = selected.includes(p.id)
          const colors = PLATFORM_COLORS[p.id]
          return (
            <button
              key={p.id}
              type="button"
              style={{
                fontSize: 13,
                padding: '6px 13px',
                borderRadius: 10,
                border: '0.5px solid',
                cursor: 'pointer',
                background: isSelected ? colors.bg : 'transparent',
                color: isSelected ? colors.color : '#aaa',
                borderColor: isSelected ? colors.color : 'rgba(0,0,0,0.15)',
                fontWeight: isSelected ? '500' : '400',
              }}
              onClick={() => {
                const next = isSelected
                  ? selected.filter(s => s !== p.id)
                  : [...selected, p.id]
                onChange(next)
              }}
            >
              {p.label}
            </button>
          )
        })}
      </div>
      {selected.includes('other') && (
        <input
          style={{ ...inputStyle, marginTop: 8 }}
          placeholder="Specify platform..."
          value={otherText}
          onChange={e => onOtherChange(e.target.value)}
        />
      )}
    </div>
  )
}

export default function Pipeline({ videos, onSave, onDelete, onMove, isMobile }) {
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [dragOver, setDragOver] = useState(null)
  const [collapsedStages, setCollapsedStages] = useState({})
  const dragId = useRef(null)

  function openNew(stage = 0) {
    setForm({ title: '', type: 'shop', stage, deadline: '', affiliate_link: '', commission: '', caption: '', hashtags: '', notes: '', platforms: [], other_platform: '' })
    setEditing({})
  }
  function openEdit(v) { setForm({ ...v, platforms: v.platforms || [], other_platform: v.other_platform || '' }); setEditing(v) }
  function closeModal() { setEditing(null) }

  async function handleSave() {
    await onSave({ ...form, ...(editing?.id ? { id: editing.id } : {}) })
    closeModal()
  }

  function toggleStage(si) {
    setCollapsedStages(prev => ({ ...prev, [si]: !prev[si] }))
  }

  function onDragStart(e, id) { dragId.current = id; e.dataTransfer.effectAllowed = 'move' }
  function onDragOver(e, stage) { e.preventDefault(); setDragOver(stage) }
  function onDrop(e, stage) {
    e.preventDefault()
    if (dragId.current) onMove(dragId.current, stage)
    dragId.current = null; setDragOver(null)
  }

  // Mobile: vertical accordion layout
  if (isMobile) {
    return (
      <div style={{ padding: 12 }}>
        <button style={mStyles.addBtn} onClick={() => openNew()}>+ New video</button>
        {STAGES.map((stageName, si) => {
          const stageVids = videos.filter(v => v.stage === si)
          const isCollapsed = collapsedStages[si]
          return (
            <div key={si} style={mStyles.stageBlock}>
              <div style={mStyles.stageHeader} onClick={() => toggleStage(si)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={mStyles.stageTitle}>{stageName}</span>
                  <span style={mStyles.stageCnt}>{stageVids.length}</span>
                </div>
                <span style={{ color: '#aaa', fontSize: 16 }}>{isCollapsed ? '›' : '⌄'}</span>
              </div>
              {!isCollapsed && (
                <div style={mStyles.stageCards}>
                  {stageVids.map(v => {
                    const typeStyle = TYPE_STYLES[v.type] || TYPE_STYLES.organic
                    const dlLabel = deadlineLabel(v.deadline)
                    const dlColor = deadlineColor(v.deadline)
                    const platforms = v.platforms || []
                    return (
                      <div key={v.id} style={mStyles.card} onClick={() => openEdit(v)}>
                        <div style={mStyles.cardTitle}>{v.title}</div>
                        <div style={mStyles.cardMeta}>
                          <span style={{ ...mStyles.tag, background: typeStyle.bg, color: typeStyle.color }}>{typeStyle.label}</span>
                          {dlLabel && <span style={{ fontSize: 12, color: dlColor, fontWeight: '500' }}>{dlLabel}</span>}
                        </div>
                        {platforms.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                            {platforms.map(pid => {
                              const col = PLATFORM_COLORS[pid] || PLATFORM_COLORS.other
                              return <span key={pid} style={{ ...mStyles.platformPill, background: col.bg, color: col.color }}>{platformLabel(pid, v.other_platform)}</span>
                            })}
                          </div>
                        )}
                        <div style={mStyles.moveRow}>
                          {si > 0 && <button style={mStyles.moveBtn} onClick={e => { e.stopPropagation(); onMove(v.id, si - 1) }}>← Back</button>}
                          {si < STAGES.length - 1 && <button style={{ ...mStyles.moveBtn, ...mStyles.moveBtnPrimary }} onClick={e => { e.stopPropagation(); onMove(v.id, si + 1) }}>Next →</button>}
                        </div>
                      </div>
                    )
                  })}
                  <button style={mStyles.addStageBtn} onClick={() => openNew(si)}>+ Add to {stageName}</button>
                </div>
              )}
            </div>
          )
        })}

        {editing !== null && renderModal()}
      </div>
    )
  }

  // Desktop: horizontal kanban
  function renderModal() {
    return (
      <Modal title={editing.id ? 'Edit video' : 'New video'} onClose={closeModal} onSave={handleSave}>
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
        <div style={{ marginBottom: 10 }}>
          <Field label="Platforms">
            <div style={{ marginTop: 6 }}>
              <PlatformSelector
                selected={form.platforms || []}
                otherText={form.other_platform || ''}
                onChange={platforms => setForm(f => ({ ...f, platforms }))}
                onOtherChange={other_platform => setForm(f => ({ ...f, other_platform }))}
              />
            </div>
          </Field>
        </div>
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
        {editing.id && <button style={styles.deleteBtn} onClick={async () => { await onDelete(editing.id); closeModal() }}>Delete video</button>}
      </Modal>
    )
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
                const platforms = v.platforms || []
                return (
                  <div key={v.id} style={styles.card} draggable onDragStart={e => onDragStart(e, v.id)} onClick={() => openEdit(v)}>
                    <div style={styles.cardTitle}>{v.title}</div>
                    <div style={styles.cardMeta}>
                      <span style={{ ...styles.tag, background: typeStyle.bg, color: typeStyle.color }}>{typeStyle.label}</span>
                      {dlLabel && <span style={{ fontSize: 11, color: dlColor, fontWeight: dlColor === '#993C1D' ? '500' : '400' }}>{dlLabel}</span>}
                    </div>
                    {platforms.length > 0 && (
                      <div style={styles.platformRow}>
                        {platforms.map(pid => {
                          const col = PLATFORM_COLORS[pid] || PLATFORM_COLORS.other
                          return <span key={pid} style={{ ...styles.platformPill, background: col.bg, color: col.color }}>{platformLabel(pid, v.other_platform)}</span>
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
              <div style={styles.addCard} onClick={() => openNew(si)}>+ Add</div>
            </div>
          )
        })}
      </div>
      {editing !== null && renderModal()}
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
  cardMeta: { display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 },
  tag: { fontSize: 10, padding: '2px 7px', borderRadius: 10, fontWeight: '500' },
  platformRow: { display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 },
  platformPill: { fontSize: 10, padding: '1px 6px', borderRadius: 8, fontWeight: '500' },
  addCard: { border: '0.5px dashed rgba(0,0,0,0.2)', borderRadius: 8, padding: '7px', textAlign: 'center', cursor: 'pointer', color: '#aaa', fontSize: 12 },
  deleteBtn: { marginTop: 8, fontSize: 12, color: '#B91C1C', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' },
}

const mStyles = {
  addBtn: { width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#7F77DD', color: '#fff', fontSize: 15, fontWeight: '500', cursor: 'pointer', marginBottom: 12 },
  stageBlock: { background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', marginBottom: 8, overflow: 'hidden' },
  stageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 14px', cursor: 'pointer', background: '#fafaf9' },
  stageTitle: { fontSize: 14, fontWeight: '500', color: '#333' },
  stageCnt: { fontSize: 12, background: '#eee', borderRadius: 10, padding: '1px 8px', color: '#888' },
  stageCards: { padding: '8px 10px 10px' },
  card: { background: '#f8f7f5', borderRadius: 10, padding: '12px 13px', marginBottom: 8, cursor: 'pointer' },
  cardTitle: { fontSize: 14, fontWeight: '500', lineHeight: 1.3, marginBottom: 7 },
  cardMeta: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' },
  tag: { fontSize: 11, padding: '3px 9px', borderRadius: 10, fontWeight: '500' },
  platformPill: { fontSize: 11, padding: '2px 8px', borderRadius: 8, fontWeight: '500' },
  moveRow: { display: 'flex', gap: 8, marginTop: 10 },
  moveBtn: { flex: 1, padding: '8px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.15)', background: '#fff', fontSize: 13, cursor: 'pointer', color: '#555' },
  moveBtnPrimary: { background: '#7F77DD', border: 'none', color: '#fff', fontWeight: '500' },
  addStageBtn: { width: '100%', padding: '10px', borderRadius: 8, border: '0.5px dashed rgba(0,0,0,0.2)', background: 'none', color: '#aaa', fontSize: 13, cursor: 'pointer', marginTop: 2 },
}

import { useState } from 'react'
import Modal, { Field, Row, inputStyle } from '../components/Modal'
import { ACCENTS, getAccent, pct, goalProgressColor, initials } from '../lib/utils'

export default function Home({ profile, goals, videos, samples, topVideos, onSaveProfile, onSaveTopVideo, onDeleteTopVideo, isMobile }) {
  const [editingProfile, setEditingProfile] = useState(false)
  const [editingTopVideo, setEditingTopVideo] = useState(null)
  const [form, setForm] = useState({})
  const [tvForm, setTvForm] = useState({})

  const accent = getAccent(profile?.accent_color)
  const urgentCount = videos.filter(v => {
    if (!v.deadline) return false
    const diff = Math.round((new Date(v.deadline + 'T00:00:00') - new Date()) / 86400000)
    return diff >= 0 && diff <= 3
  }).length
  const awaitingCount = samples.filter(s => s.status !== 'received').length
  const ideasCount = videos.filter(v => v.stage === 0).length
  const activeGoals = goals.filter(g => pct(g.current_value, g.target_value) < 100).slice(0, 3)

  function openProfileEdit() { setForm({ ...profile }); setEditingProfile(true) }
  async function handleSaveProfile() { await onSaveProfile(form); setEditingProfile(false) }
  function openTvEdit(tv) {
    setTvForm(tv ? { ...tv } : { title: '', views: '', likes: '', display_order: topVideos.length })
    setEditingTopVideo(tv || {})
  }
  async function handleSaveTv() { await onSaveTopVideo(tvForm); setEditingTopVideo(null) }

  const pf = profile || {}
  const statsGridCols = isMobile ? 'repeat(2, minmax(0,1fr))' : 'repeat(4, minmax(0,1fr))'
  const pipelineGridCols = isMobile ? 'repeat(3, minmax(0,1fr))' : 'repeat(3, minmax(0,1fr))'
  const topVidsGridCols = isMobile ? 'repeat(1, minmax(0,1fr))' : 'repeat(3, minmax(0,1fr))'

  return (
    <div style={{ ...styles.page, padding: isMobile ? '12px' : '14px' }}>
      {/* Profile header */}
      <div style={styles.profileCard}>
        <div style={{ ...styles.banner, background: accent.light }} />
        <div style={{ ...styles.identity, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
          <div style={{ ...styles.avatar, background: accent.color }}>
            {initials(pf.name)}
          </div>
          <div style={styles.profileText}>
            <div style={styles.profileName}>{pf.name || 'Your name'}</div>
            <div style={styles.profileHandle}>
              {[pf.tiktok_handle, pf.instagram_handle].filter(Boolean).join(' · ')}
            </div>
            {pf.niche && <div style={styles.profileNiche}>{pf.niche}</div>}
          </div>
          <button
            style={{ ...styles.editBtn, borderColor: accent.color, color: accent.color }}
            onClick={openProfileEdit}
          >
            Edit profile
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: statsGridCols, gap: 10, marginBottom: 14 }}>
        {[
          { label: 'Followers', val: pf.followers || '—', sub: 'TikTok' },
          { label: 'Total likes', val: pf.total_likes || '—', sub: 'all time' },
          { label: 'Avg. views', val: pf.avg_views || '—', sub: 'per video' },
          { label: 'Shop revenue', val: pf.shop_revenue || '—', sub: 'this month' },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statLabel}>{s.label}</div>
            <div style={styles.statVal}>{s.val}</div>
            <div style={styles.statSub}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Goals snapshot */}
      {activeGoals.length > 0 && (
        <>
          <div style={styles.sectionLabel}>Goals in progress</div>
          <div style={styles.goalsSnapshot}>
            {activeGoals.map(g => {
              const p = pct(g.current_value, g.target_value)
              const col = goalProgressColor(p)
              return (
                <div key={g.id} style={styles.snapRow}>
                  <div style={styles.snapTitle}>{g.title}</div>
                  <div style={styles.snapTrack}>
                    <div style={{ ...styles.snapFill, width: p + '%', background: col }} />
                  </div>
                  <div style={{ ...styles.snapPct, color: col }}>{p}%</div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Top videos */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={styles.sectionLabel}>Top performing videos</div>
        <button style={styles.smBtn} onClick={() => openTvEdit(null)}>+ Add</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: topVidsGridCols, gap: 10, marginBottom: 14 }}>
        {topVideos.map(tv => (
          <div key={tv.id} style={styles.vidCard} onClick={() => openTvEdit(tv)}>
            <div style={{ ...styles.vidThumb, background: accent.light }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 3l16 9-16 9V3z" fill={accent.color} />
              </svg>
            </div>
            <div style={styles.vidInfo}>
              <div style={styles.vidTitle}>{tv.title}</div>
              <div style={styles.vidStats}>
                <span style={styles.vidStat}><b>{tv.views}</b> views</span>
                <span style={styles.vidStat}><b>{tv.likes}</b> likes</span>
              </div>
            </div>
          </div>
        ))}
        {topVideos.length === 0 && (
          <div style={styles.emptyVids}>Add your best performing videos here.</div>
        )}
      </div>

      {/* Platform handles */}
      <div style={styles.sectionLabel}>Platforms</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 10, marginBottom: 14 }}>
        <div style={styles.handleCard}>
          <div style={{ ...styles.hIcon, background: accent.light }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={accent.color}>
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 106.34 6.34V9.35a8.16 8.16 0 004.77 1.52V7.42a4.85 4.85 0 01-1-.73z"/>
            </svg>
          </div>
          <div>
            <div style={styles.hName}>TikTok</div>
            <div style={styles.hAt}>{pf.tiktok_handle || 'not set'}</div>
          </div>
        </div>
        <div style={styles.handleCard}>
          <div style={{ ...styles.hIcon, background: accent.light }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke={accent.color} strokeWidth="2"/>
              <circle cx="12" cy="12" r="4" stroke={accent.color} strokeWidth="2"/>
              <circle cx="17.5" cy="6.5" r="1.2" fill={accent.color}/>
            </svg>
          </div>
          <div>
            <div style={styles.hName}>Instagram</div>
            <div style={styles.hAt}>{pf.instagram_handle || 'not set'}</div>
          </div>
        </div>
      </div>

      {/* Pipeline summary */}
      <div style={styles.sectionLabel}>Today's pipeline</div>
      <div style={{ display: 'grid', gridTemplateColumns: pipelineGridCols, gap: 10, marginBottom: 14 }}>
        <div style={styles.statCard}><div style={styles.statLabel}>Due this week</div><div style={{ ...styles.statVal, color: '#D85A30' }}>{urgentCount}</div></div>
        <div style={styles.statCard}><div style={styles.statLabel}>Samples awaited</div><div style={{ ...styles.statVal, color: '#BA7517' }}>{awaitingCount}</div></div>
        <div style={styles.statCard}><div style={styles.statLabel}>Ideas queued</div><div style={{ ...styles.statVal, color: accent.color }}>{ideasCount}</div></div>
      </div>

      {/* Edit Profile Modal */}
      {editingProfile && (
        <Modal title="Edit profile" onClose={() => setEditingProfile(false)} onSave={handleSaveProfile}>
          <Row><Field label="Display name"><input style={inputStyle} value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></Field>
          <Field label="Niche / tagline"><input style={inputStyle} value={form.niche || ''} onChange={e => setForm(f => ({ ...f, niche: e.target.value }))} /></Field></Row>
          <Row><Field label="TikTok handle"><input style={inputStyle} value={form.tiktok_handle || ''} onChange={e => setForm(f => ({ ...f, tiktok_handle: e.target.value }))} placeholder="@handle" /></Field>
          <Field label="Instagram handle"><input style={inputStyle} value={form.instagram_handle || ''} onChange={e => setForm(f => ({ ...f, instagram_handle: e.target.value }))} placeholder="@handle" /></Field></Row>
          <Row><Field label="Followers"><input style={inputStyle} value={form.followers || ''} onChange={e => setForm(f => ({ ...f, followers: e.target.value }))} placeholder="142K" /></Field>
          <Field label="Total likes"><input style={inputStyle} value={form.total_likes || ''} onChange={e => setForm(f => ({ ...f, total_likes: e.target.value }))} placeholder="2.4M" /></Field></Row>
          <Row><Field label="Avg. views"><input style={inputStyle} value={form.avg_views || ''} onChange={e => setForm(f => ({ ...f, avg_views: e.target.value }))} placeholder="18K" /></Field>
          <Field label="Shop revenue"><input style={inputStyle} value={form.shop_revenue || ''} onChange={e => setForm(f => ({ ...f, shop_revenue: e.target.value }))} placeholder="$3,200" /></Field></Row>
          <Field label="Brand color">
            <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
              {ACCENTS.map(a => (
                <div key={a.name} onClick={() => setForm(f => ({ ...f, accent_color: a.name }))}
                  style={{ width: 32, height: 32, borderRadius: '50%', background: a.color, cursor: 'pointer',
                    border: form.accent_color === a.name ? '3px solid #1a1a1a' : '3px solid transparent', boxSizing: 'border-box' }} />
              ))}
            </div>
          </Field>
        </Modal>
      )}

      {/* Top Video Modal */}
      {editingTopVideo !== null && (
        <Modal
          title={editingTopVideo.id ? 'Edit video' : 'Add top video'}
          onClose={() => setEditingTopVideo(null)}
          onSave={handleSaveTv}
          saveLabel={editingTopVideo.id ? 'Save' : 'Add'}
        >
          <Row cols={1}><Field label="Video title"><input style={inputStyle} value={tvForm.title || ''} onChange={e => setTvForm(f => ({ ...f, title: e.target.value }))} placeholder="GRWM for Target run" /></Field></Row>
          <Row><Field label="Views"><input style={inputStyle} value={tvForm.views || ''} onChange={e => setTvForm(f => ({ ...f, views: e.target.value }))} placeholder="284K" /></Field>
          <Field label="Likes"><input style={inputStyle} value={tvForm.likes || ''} onChange={e => setTvForm(f => ({ ...f, likes: e.target.value }))} placeholder="41K" /></Field></Row>
          {editingTopVideo.id && (
            <button style={styles.deleteBtn} onClick={async () => { await onDeleteTopVideo(editingTopVideo.id); setEditingTopVideo(null) }}>
              Remove video
            </button>
          )}
        </Modal>
      )}
    </div>
  )
}

const styles = {
  page: { maxWidth: 900 },
  profileCard: { background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 14, overflow: 'hidden', marginBottom: 14 },
  banner: { height: 60 },
  identity: { padding: '0 14px 14px', display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: -22 },
  avatar: { width: 48, height: 48, borderRadius: '50%', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: '500', color: '#fff', flexShrink: 0 },
  profileText: { paddingTop: 24, flex: 1, minWidth: 0 },
  profileName: { fontSize: 16, fontWeight: '500' },
  profileHandle: { fontSize: 12, color: '#888', marginTop: 1 },
  profileNiche: { fontSize: 12, color: '#aaa', marginTop: 2 },
  editBtn: { fontSize: 12, padding: '6px 14px', borderRadius: 8, border: '0.5px solid', background: 'none', cursor: 'pointer', flexShrink: 0, marginBottom: 4, whiteSpace: 'nowrap' },
  statCard: { background: '#f8f7f5', borderRadius: 10, padding: '12px 13px' },
  statLabel: { fontSize: 11, color: '#888', marginBottom: 3 },
  statVal: { fontSize: 20, fontWeight: '500' },
  statSub: { fontSize: 11, color: '#aaa', marginTop: 1 },
  sectionLabel: { fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10, fontWeight: '500' },
  goalsSnapshot: { background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '4px 14px', marginBottom: 14 },
  snapRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)' },
  snapTitle: { fontSize: 13, fontWeight: '500', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  snapTrack: { flex: '0 0 80px', height: 5, background: '#eee', borderRadius: 3, overflow: 'hidden' },
  snapFill: { height: '100%', borderRadius: 3 },
  snapPct: { fontSize: 12, fontWeight: '500', flex: '0 0 36px', textAlign: 'right' },
  vidCard: { background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 10, overflow: 'hidden', cursor: 'pointer' },
  vidThumb: { height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  vidInfo: { padding: '8px 10px' },
  vidTitle: { fontSize: 12, fontWeight: '500', lineHeight: 1.3, marginBottom: 4 },
  vidStats: { display: 'flex', gap: 8 },
  vidStat: { fontSize: 11, color: '#888' },
  emptyVids: { fontSize: 13, color: '#aaa', padding: '16px 0' },
  smBtn: { fontSize: 11, padding: '5px 12px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.2)', background: 'none', cursor: 'pointer', color: '#666', marginBottom: 10 },
  handleCard: { background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 10 },
  hIcon: { width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  hName: { fontSize: 12, fontWeight: '500' },
  hAt: { fontSize: 11, color: '#aaa' },
  deleteBtn: { marginTop: 8, fontSize: 13, color: '#B91C1C', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' },
}

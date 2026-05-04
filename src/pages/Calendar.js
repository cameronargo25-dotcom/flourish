import { useState } from 'react'
import { TYPE_STYLES, deadlineColor } from '../lib/utils'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

function toDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function Calendar({ videos, onEditVideo, isMobile }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(null)

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelectedDay(null)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelectedDay(null)
  }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate())

  // Map videos to their deadline date keys
  const videosByDate = {}
  videos.filter(v => v.deadline && !v.archived).forEach(v => {
    const key = v.deadline // already in YYYY-MM-DD format
    if (!videosByDate[key]) videosByDate[key] = []
    videosByDate[key].push(v)
  })

  // Build calendar grid — 6 rows x 7 cols
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const selectedKey = selectedDay ? toDateKey(year, month, selectedDay) : null
  const selectedVideos = selectedKey ? (videosByDate[selectedKey] || []) : []

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.navBtn} onClick={prevMonth}>‹</button>
        <div style={styles.monthTitle}>{MONTHS[month]} {year}</div>
        <button style={styles.navBtn} onClick={nextMonth}>›</button>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        {Object.entries(TYPE_STYLES).map(([key, val]) => (
          <div key={key} style={styles.legendItem}>
            <div style={{ ...styles.legendDot, background: val.color }} />
            <span>{val.label}</span>
          </div>
        ))}
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, background: '#D85A30' }} />
          <span>Urgent (≤3 days)</span>
        </div>
      </div>

      {/* Day headers */}
      <div style={styles.dayHeaders}>
        {DAYS.map(d => (
          <div key={d} style={styles.dayHeader}>{isMobile ? d.slice(0, 1) : d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={styles.grid}>
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} style={styles.emptyCell} />

          const dateKey = toDateKey(year, month, day)
          const dayVideos = videosByDate[dateKey] || []
          const isToday = dateKey === todayKey
          const isSelected = selectedDay === day

          return (
            <div
              key={dateKey}
              style={{
                ...styles.cell,
                ...(isToday ? styles.cellToday : {}),
                ...(isSelected ? styles.cellSelected : {}),
                ...(dayVideos.length > 0 ? styles.cellHasEvents : {}),
              }}
              onClick={() => setSelectedDay(isSelected ? null : day)}
            >
              <div style={{
                ...styles.dayNum,
                ...(isToday ? styles.dayNumToday : {}),
              }}>{day}</div>

              {/* Event dots / pills */}
              <div style={styles.events}>
                {isMobile ? (
                  // Mobile: show dots only
                  <div style={styles.dotRow}>
                    {dayVideos.slice(0, 3).map(v => {
                      const col = deadlineColor(v.deadline)
                      const typeStyle = TYPE_STYLES[v.type] || TYPE_STYLES.organic
                      return (
                        <div key={v.id} style={{ ...styles.dot, background: col !== '#888' ? col : typeStyle.color }} />
                      )
                    })}
                    {dayVideos.length > 3 && <div style={styles.moreText}>+{dayVideos.length - 3}</div>}
                  </div>
                ) : (
                  // Desktop: show pills with title
                  dayVideos.slice(0, 2).map(v => {
                    const dlColor = deadlineColor(v.deadline)
                    const typeStyle = TYPE_STYLES[v.type] || TYPE_STYLES.organic
                    const bg = dlColor !== '#888' ? (dlColor === '#993C1D' ? '#FAECE7' : '#FAEEDA') : typeStyle.bg
                    const color = dlColor !== '#888' ? dlColor : typeStyle.color
                    return (
                      <div
                        key={v.id}
                        style={{ ...styles.pill, background: bg, color }}
                        onClick={e => { e.stopPropagation(); onEditVideo(v) }}
                      >
                        {v.title.length > 16 ? v.title.slice(0, 16) + '…' : v.title}
                      </div>
                    )
                  })
                )}
                {!isMobile && dayVideos.length > 2 && (
                  <div style={styles.moreText}>+{dayVideos.length - 2} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected day detail panel */}
      {selectedDay && (
        <div style={styles.detailPanel}>
          <div style={styles.detailHeader}>
            {MONTHS[month]} {selectedDay}, {year}
            {selectedVideos.length === 0 && <span style={styles.noEvents}> — no deadlines</span>}
          </div>
          {selectedVideos.map(v => {
            const typeStyle = TYPE_STYLES[v.type] || TYPE_STYLES.organic
            const dlColor = deadlineColor(v.deadline)
            return (
              <div key={v.id} style={styles.detailRow} onClick={() => onEditVideo(v)}>
                <div style={styles.detailLeft}>
                  <div style={styles.detailTitle}>{v.title}</div>
                  <div style={styles.detailMeta}>
                    <span style={{ ...styles.detailTag, background: typeStyle.bg, color: typeStyle.color }}>
                      {typeStyle.label}
                    </span>
                    {v.platforms && v.platforms.length > 0 && (
                      <span style={styles.detailPlatforms}>{v.platforms.join(', ')}</span>
                    )}
                  </div>
                </div>
                <div style={{ ...styles.detailDeadline, color: dlColor }}>
                  {dlColor === '#993C1D' ? '🔴 Urgent' : dlColor === '#854F0B' ? '🟡 Soon' : 'Deadline'}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Upcoming deadlines summary */}
      <div style={styles.upcomingSection}>
        <div style={styles.upcomingTitle}>Upcoming deadlines</div>
        {(() => {
          const upcoming = videos
            .filter(v => v.deadline && !v.archived)
            .map(v => ({ ...v, _diff: Math.round((new Date(v.deadline + 'T00:00:00') - today) / 86400000) }))
            .filter(v => v._diff >= 0 && v._diff <= 14)
            .sort((a, b) => a._diff - b._diff)

          if (upcoming.length === 0) return <div style={styles.noUpcoming}>No deadlines in the next 14 days.</div>

          return upcoming.map(v => {
            const typeStyle = TYPE_STYLES[v.type] || TYPE_STYLES.organic
            const dlColor = deadlineColor(v.deadline)
            const diffLabel = v._diff === 0 ? 'Today' : v._diff === 1 ? 'Tomorrow' : `In ${v._diff} days`
            return (
              <div key={v.id} style={styles.upcomingRow} onClick={() => onEditVideo(v)}>
                <div style={styles.upcomingLeft}>
                  <div style={styles.upcomingVideoTitle}>{v.title}</div>
                  <span style={{ ...styles.detailTag, background: typeStyle.bg, color: typeStyle.color }}>
                    {typeStyle.label}
                  </span>
                </div>
                <div style={{ ...styles.upcomingDiff, color: dlColor, fontWeight: v._diff <= 3 ? '500' : '400' }}>
                  {diffLabel}
                </div>
              </div>
            )
          })
        })()}
      </div>
    </div>
  )
}

const styles = {
  page: { padding: 14, maxWidth: 900 },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  navBtn: { width: 36, height: 36, borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.15)', background: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' },
  monthTitle: { fontSize: 18, fontWeight: '500' },
  legend: { display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 12 },
  legendItem: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#888' },
  legendDot: { width: 8, height: 8, borderRadius: '50%' },
  dayHeaders: { display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0,1fr))', marginBottom: 4 },
  dayHeader: { fontSize: 11, color: '#aaa', fontWeight: '500', textAlign: 'center', padding: '4px 0', textTransform: 'uppercase', letterSpacing: '0.04em' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0,1fr))', gap: 3, marginBottom: 14 },
  cell: { minHeight: 80, background: '#fff', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.08)', padding: '6px 7px', cursor: 'pointer', transition: 'border-color 0.1s' },
  emptyCell: { minHeight: 80, borderRadius: 8 },
  cellToday: { border: '1.5px solid #7F77DD' },
  cellSelected: { background: '#F5F4FF', border: '1.5px solid #7F77DD' },
  cellHasEvents: { cursor: 'pointer' },
  dayNum: { fontSize: 12, fontWeight: '400', color: '#888', marginBottom: 4 },
  dayNumToday: { color: '#7F77DD', fontWeight: '600' },
  events: { display: 'flex', flexDirection: 'column', gap: 2 },
  dotRow: { display: 'flex', gap: 3, flexWrap: 'wrap', marginTop: 2 },
  dot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },
  pill: { fontSize: 10, padding: '2px 6px', borderRadius: 6, fontWeight: '500', lineHeight: 1.3, cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  moreText: { fontSize: 10, color: '#aaa', marginTop: 1 },
  detailPanel: { background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '13px 15px', marginBottom: 14 },
  detailHeader: { fontSize: 14, fontWeight: '500', marginBottom: 10, paddingBottom: 8, borderBottom: '0.5px solid rgba(0,0,0,0.08)' },
  noEvents: { fontWeight: '400', color: '#aaa' },
  detailRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)', cursor: 'pointer' },
  detailLeft: { flex: 1, minWidth: 0 },
  detailTitle: { fontSize: 13, fontWeight: '500', marginBottom: 4 },
  detailMeta: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' },
  detailTag: { fontSize: 10, padding: '2px 7px', borderRadius: 10, fontWeight: '500' },
  detailPlatforms: { fontSize: 11, color: '#aaa' },
  detailDeadline: { fontSize: 11, fontWeight: '500', flexShrink: 0, marginLeft: 10 },
  upcomingSection: { background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '13px 15px' },
  upcomingTitle: { fontSize: 12, fontWeight: '500', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 },
  noUpcoming: { fontSize: 13, color: '#aaa' },
  upcomingRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)', cursor: 'pointer' },
  upcomingLeft: { flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 },
  upcomingVideoTitle: { fontSize: 13, fontWeight: '500' },
  upcomingDiff: { fontSize: 12, flexShrink: 0, marginLeft: 10 },
}
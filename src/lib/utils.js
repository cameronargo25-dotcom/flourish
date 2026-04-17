export const STAGES = [
  'Idea',
  'Waiting on sample',
  'Filming',
  'Editing',
  'Scheduled',
  'Posted',
]

export const ACCENTS = [
  { name: 'violet', color: '#7F77DD', light: '#EEEDFE', pale: '#F5F4FF' },
  { name: 'pink',   color: '#D4537E', light: '#FBEAF0', pale: '#FEF3F7' },
  { name: 'teal',   color: '#1D9E75', light: '#E1F5EE', pale: '#F0FBF6' },
  { name: 'coral',  color: '#D85A30', light: '#FAECE7', pale: '#FEF5F2' },
  { name: 'blue',   color: '#378ADD', light: '#E6F1FB', pale: '#F2F8FE' },
]

export const GOAL_CATEGORIES = ['growth', 'revenue', 'content', 'engagement', 'custom']

export const GOAL_CAT_STYLES = {
  growth:     { bg: '#EEEDFE', color: '#534AB7' },
  revenue:    { bg: '#E1F5EE', color: '#0F6E56' },
  content:    { bg: '#FAEEDA', color: '#854F0B' },
  engagement: { bg: '#FBEAF0', color: '#993556' },
  custom:     { bg: '#F1EFE8', color: '#5F5E5A' },
}

export const TYPE_STYLES = {
  shop:    { bg: '#E1F5EE', color: '#0F6E56', label: 'TikTok Shop' },
  organic: { bg: '#EEEDFE', color: '#534AB7', label: 'Organic' },
  collab:  { bg: '#FAEEDA', color: '#854F0B', label: 'Collab' },
}

export const STATUS_STYLES = {
  transit:  { bg: '#FAEEDA', color: '#854F0B', label: 'In transit' },
  received: { bg: '#E1F5EE', color: '#0F6E56', label: 'Received' },
  overdue:  { bg: '#FAECE7', color: '#993C1D', label: 'Overdue' },
}

export function getAccent(name = 'violet') {
  return ACCENTS.find(a => a.name === name) || ACCENTS[0]
}

export function pct(current, target) {
  if (!target || target === 0) return 0
  return Math.min(100, Math.round((current / target) * 100))
}

export function fmtValue(n, unit) {
  const num = Number(n) || 0
  if (unit === '$') return '$' + num.toLocaleString()
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
  return String(num)
}

export function deadlineLabel(d) {
  if (!d) return ''
  const today = new Date(); today.setHours(0,0,0,0)
  const due = new Date(d + 'T00:00:00')
  const diff = Math.round((due - today) / 86400000)
  if (diff < 0) return 'Overdue'
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  return 'Due ' + due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function deadlineColor(d) {
  if (!d) return '#888'
  const today = new Date(); today.setHours(0,0,0,0)
  const diff = Math.round((new Date(d + 'T00:00:00') - today) / 86400000)
  if (diff < 0 || diff <= 3) return '#993C1D'
  if (diff <= 7) return '#854F0B'
  return '#888'
}

export function goalProgressColor(p) {
  if (p >= 100) return '#1D9E75'
  if (p >= 60) return '#7F77DD'
  if (p >= 30) return '#BA7517'
  return '#D85A30'
}

export function initials(name = '') {
  return name.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'
}

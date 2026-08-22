export { ACCENTS, getAccent } from './tokens'

export const STAGES = [
  'Idea',
  'Waiting on sample',
  'Filming',
  'Editing',
  'Scheduled',
  'Posted',
]

export const GOAL_CATEGORIES = ['growth', 'revenue', 'content', 'engagement', 'custom']

export const GOAL_CAT_STYLES = {
  growth:     { bg: '#EEEDFE', color: '#534AB7' },
  revenue:    { bg: '#E1F5EE', color: '#0F6E56' },
  content:    { bg: '#FEF3C7', color: '#92400E' },
  engagement: { bg: '#FBEAF0', color: '#993556' },
  custom:     { bg: '#F2EFE9', color: '#57534E' },
}

export const TYPE_STYLES = {
  shop:    { bg: '#E1F5EE', color: '#0F6E56', label: 'TikTok Shop' },
  organic: { bg: '#EEEDFE', color: '#534AB7', label: 'Organic' },
  collab:  { bg: '#FEF3C7', color: '#92400E', label: 'Collab' },
}

export const STATUS_STYLES = {
  transit:  { bg: '#FEF3C7', color: '#92400E', label: 'In transit' },
  received: { bg: '#E1F5EE', color: '#0F6E56', label: 'Received' },
  overdue:  { bg: '#FAECE7', color: '#993C1D', label: 'Overdue' },
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
  if (!d) return '#A8A29E'
  const today = new Date(); today.setHours(0,0,0,0)
  const diff = Math.round((new Date(d + 'T00:00:00') - today) / 86400000)
  if (diff < 0 || diff <= 3) return '#993C1D'
  if (diff <= 7) return '#92400E'
  return '#A8A29E'
}

export function goalProgressColor(p) {
  if (p >= 100) return '#1D9E75'
  if (p >= 60) return '#7F77DD'
  if (p >= 30) return '#F59E0B'
  return '#D85A30'
}

export function initials(name = '') {
  return name.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'
}

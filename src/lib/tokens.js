// Flourish Design Tokens
// All visual decisions live here. Change here, changes everywhere.

export const tokens = {
  // Brand
  brand: {
    primary:   '#7F77DD',
    secondary: '#534AB7',
    light:     '#EEEDFE',
    pale:      '#F5F4FF',
    dark:      '#1E1A3C',
  },

  // Backgrounds — warm off-white system
  bg: {
    app:      '#F7F5F2',   // main app background, warm off-white
    primary:  '#FFFFFF',   // cards, modals, sidebar
    secondary:'#F2EFE9',   // stat cards, subtle sections
    tertiary: '#EAE6DF',   // hover states, dividers
  },

  // Text
  text: {
    primary:   '#1C1917',  // warm near-black
    secondary: '#57534E',  // warm medium gray
    tertiary:  '#A8A29E',  // warm light gray
    inverse:   '#FFFFFF',
  },

  // Borders
  border: {
    light:  'rgba(28,25,23,0.07)',
    medium: 'rgba(28,25,23,0.12)',
    strong: 'rgba(28,25,23,0.2)',
  },

  // Semantic colors
  status: {
    urgent: { bg: '#FAECE7', text: '#993C1D', dot: '#D85A30' },
    soon:   { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
    done:   { bg: '#DCFCE7', text: '#166534', dot: '#22C55E' },
    info:   { bg: '#EEEDFE', text: '#534AB7', dot: '#7F77DD' },
  },

  // Content type tags
  type: {
    shop:    { bg: '#E1F5EE', text: '#0F6E56' },
    organic: { bg: '#EEEDFE', text: '#534AB7' },
    collab:  { bg: '#FEF3C7', text: '#92400E' },
  },

  // Typography
  font: {
    family: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
    size: {
      xs:  11,
      sm:  12,
      md:  13,
      base:14,
      lg:  15,
      xl:  17,
      xxl: 20,
      h1:  24,
    },
    weight: {
      regular: '400',
      medium:  '500',
      semibold:'600',
    },
    tracking: {
      tight:  '-0.02em',
      normal: '0',
      wide:   '0.04em',
      wider:  '0.07em',
    },
  },

  // Spacing
  space: {
    xs:  4,
    sm:  8,
    md:  12,
    lg:  16,
    xl:  20,
    xxl: 28,
  },

  // Radii
  radius: {
    sm:  6,
    md:  8,
    lg:  12,
    xl:  16,
    full: 9999,
  },

  // Shadows
  shadow: {
    sm:  '0 1px 3px rgba(28,25,23,0.08)',
    md:  '0 4px 12px rgba(28,25,23,0.08)',
    lg:  '0 8px 24px rgba(28,25,23,0.1)',
  },
}

// Accent system — respects user's chosen brand color
export const ACCENTS = [
  { name: 'violet', color: '#7F77DD', light: '#EEEDFE', pale: '#F5F4FF', dark: '#534AB7' },
  { name: 'pink',   color: '#D4537E', light: '#FBEAF0', pale: '#FEF3F7', dark: '#993556' },
  { name: 'teal',   color: '#1D9E75', light: '#E1F5EE', pale: '#F0FBF6', dark: '#0F6E56' },
  { name: 'coral',  color: '#D85A30', light: '#FAECE7', pale: '#FEF5F2', dark: '#993C1D' },
  { name: 'blue',   color: '#378ADD', light: '#E6F1FB', pale: '#F2F8FE', dark: '#185FA5' },
]

export function getAccent(name = 'violet') {
  return ACCENTS.find(a => a.name === name) || ACCENTS[0]
}

// Shared component styles
export const ui = {
  card: {
    background: '#FFFFFF',
    borderRadius: 12,
    border: '0.5px solid rgba(28,25,23,0.08)',
    boxShadow: '0 1px 3px rgba(28,25,23,0.06)',
  },
  cardHover: {
    boxShadow: '0 4px 12px rgba(28,25,23,0.1)',
  },
  input: {
    padding: '9px 12px',
    borderRadius: 8,
    border: '0.5px solid rgba(28,25,23,0.2)',
    fontSize: 14,
    width: '100%',
    boxSizing: 'border-box',
    background: '#FFFFFF',
    color: '#1C1917',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
    outline: 'none',
  },
  btnPrimary: {
    padding: '9px 18px',
    borderRadius: 8,
    border: 'none',
    background: '#7F77DD',
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    cursor: 'pointer',
    letterSpacing: '0.01em',
  },
  btnSecondary: {
    padding: '9px 18px',
    borderRadius: 8,
    border: '0.5px solid rgba(28,25,23,0.2)',
    background: 'transparent',
    color: '#57534E',
    fontSize: 14,
    cursor: 'pointer',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A8A29E',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 10,
  },
  tag: {
    fontSize: 10,
    fontWeight: '500',
    padding: '2px 8px',
    borderRadius: 999,
  },
}

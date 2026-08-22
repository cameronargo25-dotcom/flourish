// Flourish bloom logo — matches the design you created
// Two-tone petals, no letter, pure bloom mark

export default function FlourishLogo({ size = 32, dark = false }) {
  const bg = dark ? '#1E1A3C' : 'transparent'
  const petalLight = dark ? '#9B8FE8' : '#7F77DD'
  const petalDark  = dark ? '#6B5DC4' : '#534AB7'
  const center     = dark ? '#1E1A3C' : '#F7F5F2'

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {dark && <circle cx="32" cy="32" r="32" fill={bg}/>}
      <g transform="translate(32,32)">
        {/* 8 outer lighter petals */}
        {[0,45,90,135,180,225,270,315].map(deg => (
          <ellipse key={`o${deg}`} cx="0" cy="-13" rx="6" ry="10.5"
            fill={petalLight} transform={`rotate(${deg})`}/>
        ))}
        {/* 8 inner darker petals offset by 22.5deg */}
        {[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5].map(deg => (
          <ellipse key={`i${deg}`} cx="0" cy="-13" rx="6" ry="10.5"
            fill={petalDark} transform={`rotate(${deg})`}/>
        ))}
        {/* Center */}
        <circle cx="0" cy="0" r="6" fill={center}/>
      </g>
    </svg>
  )
}

// Wordmark — logo + "flourish" text
export function FlourishWordmark({ size = 28, dark = false }) {
  const textColor = dark ? '#FFFFFF' : '#7F77DD'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <FlourishLogo size={size} dark={dark}/>
      <span style={{
        fontSize: size * 0.6,
        fontWeight: '400',
        color: textColor,
        letterSpacing: '0.02em',
        lineHeight: 1,
      }}>
        flourish
      </span>
    </div>
  )
}

// Full stacked lockup — for auth screen
export function FlourishLockup({ logoSize = 72, dark = false }) {
  const textColor = dark ? '#FFFFFF' : '#7F77DD'
  const subColor  = dark ? 'rgba(255,255,255,0.5)' : '#A8A29E'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <FlourishLogo size={logoSize} dark={dark}/>
      <div>
        <div style={{
          fontSize: logoSize * 0.38,
          fontWeight: '400',
          color: textColor,
          letterSpacing: '0.06em',
          textAlign: 'center',
          lineHeight: 1,
        }}>
          flourish
        </div>
        <div style={{
          fontSize: 11,
          color: subColor,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginTop: 4,
        }}>
          creator platform
        </div>
      </div>
    </div>
  )
}

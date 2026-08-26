
import { Link } from 'react-router-dom';

export default function Logo({ size = 32, showText = true, light = false, to = '/' }) {
  return (
    <Link
      to={to}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
      }}
    >
      {/* Your Stitch HomeNest logo image */}
      <img
        src="/homenest-logo.png"
        alt="HomeNest"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: `${size * 0.22}px`,   /* proportional rounding */
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />

      {/* "HomeNest" text — only shown if showText=true */}
      {showText && (
        <span style={{
          fontFamily: 'var(--font-headline)',
          fontSize: `${Math.max(size * 0.65, 16)}px`,
          fontWeight: 700,
          color: light ? '#ffffff' : 'var(--color-primary)',
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}>
          HomeNest
        </span>
      )}
    </Link>
  );
}

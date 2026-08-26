import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';


export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a1c1c', color: 'var(--color-white)', padding: '64px 32px 32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
        <div>
          {/* HomeNest Logo — light=true for white text on dark footer */}
          <Logo size={38} light={true} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', lineHeight: '1.6', marginTop: '14px', fontSize: '14px' }}>
            Find a place that feels like home.<br/>Verified properties, direct contact, secure transactions.
          </p>
        </div>
        <div>
          <h3 style={{ fontFamily: 'var(--font-headline)', marginBottom: '16px', fontSize: '18px' }}>For Tenants</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/search" style={{ color: 'var(--color-foggy)', textDecoration: 'none' }}>Search Properties</Link>
            <Link to="/tenant/saved" style={{ color: 'var(--color-foggy)', textDecoration: 'none' }}>Saved Homes</Link>
            <Link to="/tenant/visits" style={{ color: 'var(--color-foggy)', textDecoration: 'none' }}>My Visits</Link>
          </div>
        </div>
        <div>
          <h3 style={{ fontFamily: 'var(--font-headline)', marginBottom: '16px', fontSize: '18px' }}>For Owners</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/owner/add" style={{ color: 'var(--color-foggy)', textDecoration: 'none' }}>List Property</Link>
            <Link to="/owner/dashboard" style={{ color: 'var(--color-foggy)', textDecoration: 'none' }}>Owner Dashboard</Link>
            <Link to="/owner/requests" style={{ color: 'var(--color-foggy)', textDecoration: 'none' }}>Visit Requests</Link>
          </div>
        </div>
        <div>
          <h3 style={{ fontFamily: 'var(--font-headline)', marginBottom: '16px', fontSize: '18px' }}>Company</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/about" style={{ color: 'var(--color-foggy)', textDecoration: 'none' }}>About Us</Link>
            <Link to="/contact" style={{ color: 'var(--color-foggy)', textDecoration: 'none' }}>Contact</Link>
            <Link to="/privacy" style={{ color: 'var(--color-foggy)', textDecoration: 'none' }}>Privacy Policy</Link>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '32px auto 0', paddingTop: '32px', borderTop: '1px solid #333', textAlign: 'center', color: 'var(--color-foggy)' }}>
        <p>&copy; {new Date().getFullYear()} HomeNest. All rights reserved.</p>
      </div>
    </footer>
  );
}

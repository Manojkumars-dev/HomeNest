// Navbar.jsx — Top navigation bar
// Connected to real useAuth() — shows Login/SignUp when logged out,
// shows user name + dashboard link + logout when logged in

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, ChevronDown, User } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getDashboardPath = () => {
    if (user?.role === 'TENANT') return '/tenant/dashboard';
    if (user?.role === 'OWNER')  return '/owner/dashboard';
    if (user?.role === 'ADMIN')  return '/admin/dashboard';
    return '/';
  };

  return (
    <nav style={{
      backgroundColor:'var(--color-white)',
      borderBottom:'1px solid var(--color-bebe)',
      position:'sticky', top:0, zIndex:100,
      padding:'14px 32px',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:'1200px', margin:'0 auto' }}>

        {/* Logo */}
        <Logo size={36} />

        {/* Center Nav Links */}
        <div style={{ display:'flex', gap:'28px', alignItems:'center' }}>
          <Link to="/search"           style={{ textDecoration:'none', color:'var(--color-on-surface)', fontFamily:'var(--font-body)', fontSize:'14px', fontWeight:500 }}>Find Homes</Link>
          <Link to="/owner/add-property" style={{ textDecoration:'none', color:'var(--color-on-surface)', fontFamily:'var(--font-body)', fontSize:'14px', fontWeight:500 }}>List Property</Link>
        </div>

        {/* Right: Auth buttons OR user menu */}
        <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
          {!isLoggedIn ? (
            // ── NOT logged in: show Login + Sign Up ──────────
            <>
              <Link to="/login"
                style={{ textDecoration:'none', color:'var(--color-on-surface)', fontFamily:'var(--font-body)', padding:'9px 18px', borderRadius:'999px', fontSize:'14px', fontWeight:500, border:'1px solid var(--color-bebe)', transition:'background 0.15s' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor='var(--color-surface-container-low)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor='transparent'}
              >
                Log In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding:'9px 22px', fontSize:'14px' }}>
                Sign Up
              </Link>
            </>
          ) : (
            // ── Logged in: show user avatar + dropdown ────────
            <div style={{ position:'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ display:'flex', alignItems:'center', gap:'8px', padding:'7px 14px', backgroundColor:'var(--color-surface-container-low)', border:'1px solid var(--color-bebe)', borderRadius:'999px', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'14px', fontWeight:500, color:'var(--color-on-surface)' }}>
                {/* Avatar circle */}
                <div style={{ width:'28px', height:'28px', borderRadius:'50%', backgroundColor:'var(--color-primary)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:700, flexShrink:0 }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span>{user.name?.split(' ')[0]}</span>
                <ChevronDown size={14} color="var(--color-foggy)"/>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <>
                  {/* Backdrop — click outside to close */}
                  <div onClick={() => setDropdownOpen(false)} style={{ position:'fixed', inset:0, zIndex:99 }}/>
                  <div style={{ position:'absolute', right:0, top:'calc(100% + 8px)', backgroundColor:'var(--color-white)', border:'1px solid var(--color-bebe)', borderRadius:'16px', padding:'8px', boxShadow:'0 8px 32px rgba(0,0,0,0.12)', zIndex:100, minWidth:'200px' }}>
                    {/* User info */}
                    <div style={{ padding:'10px 12px 14px', borderBottom:'1px solid var(--color-bebe)', marginBottom:'4px' }}>
                      <p style={{ fontWeight:700, fontSize:'14px', color:'var(--color-on-surface)' }}>{user.name}</p>
                      <p style={{ fontSize:'12px', color:'var(--color-foggy)' }}>{user.email}</p>
                      <span style={{ display:'inline-block', marginTop:'4px', padding:'2px 8px', backgroundColor:'rgba(186,0,54,0.08)', color:'var(--color-primary)', borderRadius:'999px', fontSize:'11px', fontWeight:600 }}>
                        {user.role}
                      </span>
                    </div>
                    {/* Dashboard link */}
                    <button onClick={() => { setDropdownOpen(false); navigate(getDashboardPath()); }}
                      style={{ display:'flex', alignItems:'center', gap:'10px', width:'100%', padding:'10px 12px', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'14px', color:'var(--color-on-surface)', borderRadius:'10px', transition:'background 0.15s', textAlign:'left' }}
                      onMouseOver={e => e.currentTarget.style.backgroundColor='var(--color-surface-container-low)'}
                      onMouseOut={e => e.currentTarget.style.backgroundColor='transparent'}>
                      <LayoutDashboard size={16} color="var(--color-foggy)"/> My Dashboard
                    </button>
                    {/* Logout */}
                    <button onClick={() => { setDropdownOpen(false); logout(); }}
                      style={{ display:'flex', alignItems:'center', gap:'10px', width:'100%', padding:'10px 12px', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'14px', color:'var(--color-error, #ba1a1a)', borderRadius:'10px', transition:'background 0.15s', textAlign:'left' }}
                      onMouseOver={e => e.currentTarget.style.backgroundColor='rgba(186,0,54,0.06)'}
                      onMouseOut={e => e.currentTarget.style.backgroundColor='transparent'}>
                      <LogOut size={16}/> Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

// DashboardSidebar.jsx
// Left sidebar for Tenant, Owner, and Admin dashboards
// Connected to real useAuth() — shows real user name, logout works

import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

export default function DashboardSidebar({ navItems, role }) {
  const { user, logout } = useAuth();

  return (
    <aside style={{
      width:'240px', flexShrink:0,
      backgroundColor:'var(--color-white)',
      borderRight:'1px solid var(--color-bebe)',
      minHeight:'100vh', position:'sticky', top:0,
      display:'flex', flexDirection:'column',
      padding:'24px 16px',
    }}>

      {/* Logo */}
      <div style={{ marginBottom:'32px', padding:'0 8px' }}>
        <Logo size={34} />
        {/* Role badge */}
        <div style={{ marginTop:'10px', fontSize:'11px', padding:'3px 10px', backgroundColor:'rgba(186,0,54,0.08)', borderRadius:'999px', display:'inline-block', color:'var(--color-primary)', fontWeight:600, textTransform:'capitalize' }}>
          {role} Portal
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex:1, display:'flex', flexDirection:'column', gap:'4px' }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:'12px',
              padding:'11px 16px', borderRadius:'10px',
              textDecoration:'none', fontFamily:'var(--font-body)',
              fontSize:'14px',
              color:      isActive ? 'var(--color-primary)' : 'var(--color-on-surface)',
              backgroundColor: isActive ? 'rgba(186,0,54,0.08)' : 'transparent',
              fontWeight: isActive ? 600 : 400,
              transition:'all 0.15s',
            })}
            onMouseOver={e => { if (!e.currentTarget.className.includes('active')) e.currentTarget.style.backgroundColor='var(--color-surface-container-low)'; }}
            onMouseOut={e => { if (!e.currentTarget.className.includes('active')) e.currentTarget.style.backgroundColor='transparent'; }}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info + logout at bottom */}
      <div style={{ borderTop:'1px solid var(--color-bebe)', paddingTop:'20px', marginTop:'20px' }}>
        {user && (
          <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'0 8px', marginBottom:'12px' }}>
            {/* Avatar */}
            <div style={{ width:'36px', height:'36px', borderRadius:'50%', backgroundColor:'var(--color-primary)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'15px', flexShrink:0 }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow:'hidden' }}>
              <p style={{ fontWeight:600, fontSize:'13px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color:'var(--color-on-surface)' }}>{user.name}</p>
              <p style={{ color:'var(--color-foggy)', fontSize:'11px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.email}</p>
            </div>
          </div>
        )}
        <button onClick={logout}
          style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 16px', width:'100%', border:'none', background:'none', color:'var(--color-foggy)', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'13px', borderRadius:'10px', transition:'all 0.15s', textAlign:'left' }}
          onMouseOver={e => { e.currentTarget.style.backgroundColor='rgba(186,0,54,0.06)'; e.currentTarget.style.color='var(--color-primary)'; }}
          onMouseOut={e => { e.currentTarget.style.backgroundColor='transparent'; e.currentTarget.style.color='var(--color-foggy)'; }}
        >
          <LogOut size={16}/> <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}

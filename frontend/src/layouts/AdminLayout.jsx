// AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { LayoutDashboard, Users, Building2, Flag, Activity } from 'lucide-react';

const adminNav = [
  { label:'Dashboard',  path:'/admin/dashboard',  icon:<LayoutDashboard size={18}/> },
  { label:'Users',      path:'/admin/users',      icon:<Users size={18}/> },
  { label:'Properties', path:'/admin/properties', icon:<Building2 size={18}/> },
  { label:'Reports',    path:'/admin/reports',    icon:<Flag size={18}/> },
  { label:'System',     path:'/admin/health',     icon:<Activity size={18}/> },
];

export default function AdminLayout() {
  return (
    <div style={{ display:'flex', minHeight:'100vh', backgroundColor:'var(--color-background)' }}>
      <DashboardSidebar navItems={adminNav} role="Admin" />
      <main style={{ flex:1, padding:'32px', overflowY:'auto', minWidth:0 }}>
        <Outlet />
      </main>
    </div>
  );
}

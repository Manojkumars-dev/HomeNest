// TenantLayout.jsx — wraps all tenant dashboard pages
// Sidebar on left, page content on right
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { LayoutDashboard, Search, Heart, FileText, Calendar, MessageSquare } from 'lucide-react';

const tenantNav = [
  { label:'Dashboard',    path:'/tenant/dashboard',    icon:<LayoutDashboard size={18}/> },
  { label:'Search Homes', path:'/search',              icon:<Search size={18}/> },
  { label:'Saved Homes',  path:'/tenant/saved',        icon:<Heart size={18}/> },
  { label:'Applications', path:'/tenant/applications', icon:<FileText size={18}/> },
  { label:'My Visits',    path:'/tenant/visits',       icon:<Calendar size={18}/> },
  { label:'Messages',     path:'/tenant/messages',     icon:<MessageSquare size={18}/> },
];

export default function TenantLayout() {
  return (
    <div style={{ display:'flex', minHeight:'100vh', backgroundColor:'var(--color-background)' }}>
      <DashboardSidebar navItems={tenantNav} role="Tenant" />
      <main style={{ flex:1, padding:'32px', overflowY:'auto', minWidth:0 }}>
        <Outlet />
      </main>
    </div>
  );
}

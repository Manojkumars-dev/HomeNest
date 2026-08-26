// OwnerLayout.jsx — wraps all owner dashboard pages
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { LayoutDashboard, Home, PlusSquare, Calendar, MessageSquare, Building2 } from 'lucide-react';

const ownerNav = [
  { label:'Dashboard',      path:'/owner/dashboard',    icon:<LayoutDashboard size={18}/> },
  { label:'My Properties',  path:'/owner/properties',   icon:<Building2 size={18}/> },
  { label:'Add Property',   path:'/owner/add-property', icon:<PlusSquare size={18}/> },
  { label:'Visit Requests', path:'/owner/visits',       icon:<Calendar size={18}/> },
  { label:'Messages',       path:'/owner/messages',     icon:<MessageSquare size={18}/> },
];

export default function OwnerLayout() {
  return (
    <div style={{ display:'flex', minHeight:'100vh', backgroundColor:'var(--color-background)' }}>
      <DashboardSidebar navItems={ownerNav} role="Owner" />
      <main style={{ flex:1, padding:'32px', overflowY:'auto', minWidth:0 }}>
        <Outlet />
      </main>
    </div>
  );
}

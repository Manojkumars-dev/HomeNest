import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import PublicLayout  from '../layouts/PublicLayout';
import TenantLayout  from '../layouts/TenantLayout';
import OwnerLayout   from '../layouts/OwnerLayout';
import AdminLayout   from '../layouts/AdminLayout';

import LandingPage    from '../pages/Landing/LandingPage';
import Login          from '../pages/Auth/Login';
import Register       from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import SearchPage     from '../pages/Properties/SearchPage';
import PropertyDetail from '../pages/Properties/PropertyDetail';

import TenantDashboard  from '../pages/Tenant/TenantDashboard';
import SavedProperties  from '../pages/Tenant/SavedProperties';
import MyVisits         from '../pages/Tenant/MyVisits';
import Applications     from '../pages/Tenant/Applications';
import TenantMessages   from '../pages/Tenant/TenantMessages';

import OwnerDashboard from '../pages/Owner/OwnerDashboard';
import MyProperties   from '../pages/Owner/MyProperties';
import AddProperty    from '../pages/Owner/AddProperty';
import EditProperty   from '../pages/Owner/EditProperty';
import VisitRequests  from '../pages/Owner/VisitRequests';
import OwnerMessages  from '../pages/Owner/OwnerMessages';

import AdminDashboard    from '../pages/Admin/AdminDashboard';
import ManageUsers       from '../pages/Admin/ManageUsers';
import ManageProperties  from '../pages/Admin/ManageProperties';
import ManageReports     from '../pages/Admin/ManageReports';
import SystemHealth      from '../pages/Admin/SystemHealth';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/"             element={<LandingPage />} />
        <Route path="/search"       element={<SearchPage />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
      </Route>

      {/* Auth */}
      <Route path="/login"          element={<Login />} />
      <Route path="/register"       element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Tenant */}
      <Route element={<ProtectedRoute allowedRoles={['TENANT']}><TenantLayout /></ProtectedRoute>}>
        <Route path="/tenant/dashboard"    element={<TenantDashboard />} />
        <Route path="/tenant/saved"        element={<SavedProperties />} />
        <Route path="/tenant/visits"       element={<MyVisits />} />
        <Route path="/tenant/applications" element={<Applications />} />
        <Route path="/tenant/messages"     element={<TenantMessages />} />
      </Route>

      {/* Owner */}
      <Route element={<ProtectedRoute allowedRoles={['OWNER']}><OwnerLayout /></ProtectedRoute>}>
        <Route path="/owner/dashboard"       element={<OwnerDashboard />} />
        <Route path="/owner/properties"      element={<MyProperties />} />
        <Route path="/owner/add-property"    element={<AddProperty />} />
        <Route path="/owner/edit-property/:id" element={<EditProperty />} />
        <Route path="/owner/visits"          element={<VisitRequests />} />
        <Route path="/owner/messages"        element={<OwnerMessages />} />
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin/dashboard"   element={<AdminDashboard />} />
        <Route path="/admin/users"       element={<ManageUsers />} />
        <Route path="/admin/properties"  element={<ManageProperties />} />
        <Route path="/admin/reports"     element={<ManageReports />} />
        <Route path="/admin/health"      element={<SystemHealth />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

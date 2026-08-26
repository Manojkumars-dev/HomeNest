// adminApi.js — Admin management API calls
// Used by: AdminDashboard, ManageUsers, ManageProperties pages

import api from './api';

// ── DASHBOARD STATS ───────────────────────────────────────────

export const getAdminStats = async () => {
  const response = await api.get('/api/admin/stats');
  return response.data;
};

// ── USER MANAGEMENT ───────────────────────────────────────────

export const getAllUsers = async () => {
  const response = await api.get('/api/admin/users');
  return response.data;
};

export const toggleUserActive = async (userId) => {
  const response = await api.put(`/api/admin/users/${userId}/toggle-active`);
  return response.data;
};

export const toggleUserVerified = async (userId) => {
  const response = await api.put(`/api/admin/users/${userId}/toggle-verified`);
  return response.data;
};

// ── PROPERTY MANAGEMENT ───────────────────────────────────────

export const getAllPropertiesAdmin = async () => {
  const response = await api.get('/api/admin/properties');
  return response.data;
};

export const verifyProperty = async (propertyId) => {
  const response = await api.put(`/api/admin/properties/${propertyId}/verify`);
  return response.data;
};

export const rejectProperty = async (propertyId) => {
  const response = await api.put(`/api/admin/properties/${propertyId}/reject`);
  return response.data;
};

export const deletePropertyAdmin = async (propertyId) => {
  const response = await api.delete(`/api/admin/properties/${propertyId}`);
  return response.data;
};

// tenantApi.js — All tenant-specific API calls
// Used by: SavedProperties, MyVisits, Applications pages

import api from './api';

// ── SAVED PROPERTIES ──────────────────────────────────────────

export const getSavedProperties = async () => {
  const response = await api.get('/api/tenant/saved');
  return response.data;
};

export const saveProperty = async (propertyId) => {
  const response = await api.post(`/api/tenant/saved/${propertyId}`);
  return response.data;
};

export const unsaveProperty = async (propertyId) => {
  const response = await api.delete(`/api/tenant/saved/${propertyId}`);
  return response.data;
};

export const checkSaved = async (propertyId) => {
  const response = await api.get(`/api/tenant/saved/${propertyId}/check`);
  return response.data;
};

// ── VISITS ────────────────────────────────────────────────────

export const getMyVisits = async () => {
  const response = await api.get('/api/tenant/visits');
  return response.data;
};

export const scheduleVisit = async ({ propertyId, date, time, note }) => {
  const response = await api.post('/api/tenant/visits', { propertyId, date, time, note });
  return response.data;
};

export const cancelVisit = async (visitId) => {
  const response = await api.put(`/api/tenant/visits/${visitId}/cancel`);
  return response.data;
};

// ── APPLICATIONS ──────────────────────────────────────────────

export const getMyApplications = async () => {
  const response = await api.get('/api/tenant/applications');
  return response.data;
};

export const applyForProperty = async ({ propertyId, message }) => {
  const response = await api.post('/api/tenant/applications', { propertyId, message });
  return response.data;
};

export const withdrawApplication = async (applicationId) => {
  const response = await api.put(`/api/tenant/applications/${applicationId}/withdraw`);
  return response.data;
};
